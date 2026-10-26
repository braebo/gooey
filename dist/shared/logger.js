import { CSS_COLORS, randomCSSColorName } from "./css-colors.js";
import { dim, gr, hex, r, y } from "./l.js";
import { stringify } from "./stringify.js";
import { defer } from "./defer.js";
import { tldr } from "./tldr.js";
import { DEV } from "esm-env";

//#region src/shared/logger.ts
const LOG_LEVELS = [
	"trace",
	"debug",
	"info",
	"warn",
	"error",
	"off"
];
var Logger = class Logger {
	static LOG_LEVEL = void 0;
	static _BYPASS_STYLES = false;
	static _BYPASS_DEFER = true;
	title = "";
	options;
	logLevel = "info";
	color;
	#logger;
	constructor(titleOrOptions, options) {
		if (typeof titleOrOptions === "string") {
			this.title = titleOrOptions;
			this.options = options ?? {};
		} else {
			this.options = titleOrOptions;
			this.title = titleOrOptions.title ?? "";
		}
		const colorname = options?.fg?.toLowerCase() ?? randomCSSColorName();
		const fg = colorname in CSS_COLORS ? CSS_COLORS[colorname] : colorname;
		const env = import.meta?.env?.VITE_FRACTILS_LOG_LEVEL;
		this.logLevel = options?.logLevel || env || Logger.LOG_LEVEL || this.logLevel;
		this.color = hex(fg);
		this.#logger = Logger.createLogger(this.title, this.options);
		return this;
	}
	get deferred() {
		return !Logger._BYPASS_DEFER && this.options?.deferred;
	}
	/**
	* Logs any args as well as any logs in the current buffer.
	* @param args
	*/
	log = (...args) => {
		this.#logger(...args);
	};
	/**
	* Logs any args as well as any logs in the current buffer.
	* @param args
	*/
	flush = (...args) => {
		if (this.buffer.length) {
			if (args[0].match(/ⓘ|⚠|⛔|💀|🐞/)) this.buffer.unshift(args.shift());
			this.consolidateBuffer();
			this.#logger(...this.buffer, ...args);
		} else this.#logger(...args);
		this.buffer = [];
	};
	trace(...args) {
		if (this.#devOnlyQuiet) return this;
		console.trace(...args);
		return this;
	}
	/** Outside dev, a `devOnly` logger drops `debug` and `trace`. */
	get #devOnlyQuiet() {
		return !DEV && this.options.devOnly !== false;
	}
	debug(...args) {
		if (this.#devOnlyQuiet || LOG_LEVELS.indexOf(this.logLevel) > LOG_LEVELS.indexOf("debug")) return this;
		this.flush("🐞", ...args);
		return this;
	}
	i = hex("#426685")("ⓘ");
	info(...args) {
		this.flush(this.i, ...args);
		return this;
	}
	warn(...args) {
		this.flush(y("⚠"), ...args);
		return this;
	}
	error(...args) {
		this.flush(r("⛔"), ...args);
		return this;
	}
	fatal(...args) {
		this.flush(r("💀"), ...args);
		return this;
	}
	group(label) {
		const title = this.title + (label ? `:${label}` : "");
		if (this.deferred) defer(() => console.group(title));
		else console.group(title);
		return this;
	}
	groupCollapsed(label) {
		const title = this.title + (label ? `:${label}` : "");
		if (this.deferred) defer(() => console.groupCollapsed(title));
		else console.groupCollapsed(title);
		return this;
	}
	groupEnd() {
		if (this.deferred) defer(() => console.groupEnd());
		else console.groupEnd();
		return this;
	}
	buffer = [];
	/**
	* Replaces any sequentially repeating strings in the buffer with a single instance and a count.
	*/
	consolidateBuffer() {
		const buff = /* @__PURE__ */ new Map();
		for (const item of this.buffer) buff.set(item, (buff.get(item) ?? 0) + 1);
		this.buffer = Array.from(buff).map(([item, count]) => count > 1 ? `${item}x${dim(`${count}`)}` : item);
	}
	/**
	* Used to display the name of a method being called and the arguments it's being called with.
	* @param str The name of the method being called.
	* @param args The arguments being passed to the method.
	* @returns The logger instance.
	*
	* @example
	* ```typescript
	* const log = new Logger('Foo')
	* const bar = (a: number) => log.fn('bar', a)
	* bar(1) // logs:
	* ⓘ Foo bar(1)
	* ```
	*/
	fn(str, ...args) {
		this.buffer.push(gr(str) + gr("(") + args.map((a) => gr(typeof a === "object" ? stringify(a) : a)).join(", ") + gr(")"));
		Promise.resolve().then(() => this.buffer = []);
		return this;
	}
	static createLogger(title, options) {
		options ??= {};
		const BROWSER$1 = typeof globalThis.window !== "undefined";
		const SERVER = !BROWSER$1;
		if (!BROWSER$1 || options.browser === false) return () => void 0;
		if (SERVER && options.server !== true) return () => void 0;
		const fg = options.fg || randomCSSColorName();
		const bg = options.bg || "transparent";
		const css = options.css ?? "";
		options.styled ??= true;
		const styled = options.styled && !Logger._BYPASS_STYLES;
		options.deferred ??= true;
		const deferred = options.deferred && !Logger._BYPASS_DEFER && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		let callsite = void 0;
		let messageConfigBase = "%c%s%c";
		const [t, ...rest] = title.split(" ");
		let restParts = [];
		if (rest.length) {
			for (const part of rest) restParts.push(`color:#666;background:${bg};padding:0.1rem;filter:saturate(0.25);${css}`, ` ${part}`);
			const i = restParts.indexOf(restParts.at(-1) ?? "");
			if (i >= 0) restParts[i] = `${restParts[i]}\n`;
			messageConfigBase = "%c%s".repeat(rest.length) + `${messageConfigBase}`;
			title = t;
		} else title = `${title}\n`;
		const log = !styled ? (...args) => {
			console.log(`| ${callsite} |\n| ${title} |`, ...args);
		} : (...args) => {
			let messageConfig = messageConfigBase;
			args.forEach((argument) => {
				switch (typeof argument) {
					case "bigint":
					case "number":
						messageConfig += "%d ";
						break;
					case "string":
						messageConfig += "%s ";
						break;
					case "object":
					case "boolean":
					case "undefined":
					default: messageConfig += "%o ";
				}
			});
			console.log(messageConfig + "%c%s", `color:${fg};background:${bg};padding:0.1rem;${css}`, `${title}`, ...restParts, `color:initial;background:${bg};padding:0.1rem;${css}`, ...args.map((a) => import.meta?.env?.VITEST ? tldr(a, {
				maxDepth: 1,
				maxSiblings: 1
			}) : a), `color:#666;background:${bg};padding:0.1rem;${css};font-size:0.66rem;`, options?.callsite ? `${callsite}` : "");
		};
		if (!deferred) return log;
		return (...args) => defer(() => log(...args));
	}
};
const logger = (title = "LOG", options) => {
	return Logger.createLogger(title, options);
};

//#endregion
export { Logger, logger };
//# sourceMappingURL=logger.js.map