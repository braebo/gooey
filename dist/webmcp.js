import { Logger } from "./shared/logger.js";
import { bezierToString } from "./inputs/InputBezier.js";

//#region src/webmcp.ts
const DISABLED_HANDLE = Object.freeze({
	enabled: false,
	tools: Object.freeze([]),
	refresh() {},
	dispose() {}
});
/**
* Exposes a {@link Gooey}'s controls to in-browser AI agents as
* {@link https://webmachinelearning.github.io/webmcp/|WebMCP} tools -- one setter per input, plus
* a `state` tool that reads the whole panel in a single call.  Setters go through each input's own
* `set`, so bindings, `onChange` handlers, and undo history behave exactly as they do for a click.
*
* In a browser without `document.modelContext` this registers nothing and returns a disabled
* handle.  It never throws, and nothing imports it, so it costs nothing until you call it.
*
* @example
* ```ts
* import { Gooey, registerWebMCP } from 'gooey'
*
* const gooey = new Gooey('Scene')
* gooey.addNumber('speed', 1, { min: 0, max: 10 })
*
* const agentDoor = registerWebMCP(gooey)
* // → tools: scene.state, scene.speed
* ```
*/
function registerWebMCP(gooey, options = {}) {
	const modelContext = options.modelContext ?? resolveModelContext();
	if (!modelContext) return DISABLED_HANDLE;
	return new WebMCPRegistration(gooey, modelContext, options);
}
/**
* Reads `document.modelContext`, returning `undefined` unless it's usable.  The API moved off
* `navigator` in the 2026-05-27 draft, so a `navigator.modelContext` fallback would only find
* deprecated implementations -- we don't look there.
*/
function resolveModelContext() {
	const mc = globalThis.document?.modelContext;
	return typeof mc?.registerTool === "function" ? mc : void 0;
}
var WebMCPRegistration = class {
	enabled = true;
	#tools = [];
	/** A frozen snapshot, consistent with the disabled handle's frozen-array contract. */
	get tools() {
		return Object.freeze([...this.#tools]);
	}
	#gooey;
	#mc;
	#opts;
	#prefix;
	#controller = new AbortController();
	#disposed = false;
	#restoreDispose;
	#log;
	constructor(gooey, modelContext, options) {
		this.#gooey = gooey;
		this.#mc = modelContext;
		this.#opts = options;
		this.#prefix = slug(options.prefix ?? gooey.title ?? "gooey");
		this.#log = new Logger(`webmcp ${this.#prefix}`, { fg: "mediumspringgreen" });
		if (options.disposeWithGooey !== false) {
			const original = gooey.dispose;
			gooey.dispose = () => {
				this.dispose();
				original();
			};
			this.#restoreDispose = () => {
				gooey.dispose = original;
			};
		}
		this.#register();
	}
	refresh() {
		if (this.#disposed) return;
		this.#unregister();
		this.#controller = new AbortController();
		this.#register();
	}
	dispose() {
		if (this.#disposed) return;
		this.#disposed = true;
		this.#unregister();
		this.#restoreDispose?.();
		this.#restoreDispose = void 0;
	}
	#register() {
		const targets = collectInputs(this.#gooey, this.#opts.includeSettings === true);
		if (this.#opts.stateTool !== false) this.#add({
			name: this.#name("state"),
			description: `Read every control in the "${this.#gooey.title}" panel: current values, their tool paths, and how many there are.`,
			inputSchema: {
				type: "object",
				properties: {}
			},
			execute: () => this.#readState()
		});
		for (const target of targets) for (const tool of toolsFor(target, this.#name(target.path))) this.#add(tool);
		this.#log.fn("register").debug({ tools: this.tools });
	}
	/** Registers one tool, de-duping its name and swallowing whatever the browser throws. */
	#add(tool) {
		let name = tool.name;
		for (let i = 2; this.#tools.includes(name); i++) name = `${tool.name}-${i}`;
		tool.name = name;
		try {
			const result = this.#mc.registerTool(tool, { signal: this.#controller.signal });
			this.#tools.push(name);
			if (isPromise(result)) result.catch((err) => {
				this.#log.fn("register").error(err);
				const i = this.#tools.indexOf(name);
				if (i !== -1) this.#tools.splice(i, 1);
			});
		} catch (err) {
			this.#log.fn("register").error("Failed to register tool", {
				name,
				err
			});
		}
	}
	/**
	* Best-effort teardown.  The draft doesn't spell out how a page revokes a tool, so we try both
	* plausible mechanisms: abort the signal handed to `registerTool`, then call `unregisterTool`
	* if the implementation has one.
	*/
	#unregister() {
		try {
			this.#controller.abort();
		} catch (err) {
			this.#log.fn("unregister").error(err);
		}
		if (typeof this.#mc.unregisterTool === "function") for (const name of this.#tools) try {
			this.#mc.unregisterTool(name);
		} catch (err) {
			this.#log.fn("unregister").error("Failed to unregister tool", {
				name,
				err
			});
		}
		this.#tools = [];
	}
	#name(path) {
		return `${this.#prefix}.${path}`;
	}
	#readState() {
		const targets = collectInputs(this.#gooey, this.#opts.includeSettings === true);
		const folders = new Set(targets.map((t) => t.breadcrumb));
		const header = `${this.#gooey.title} · ${targets.length} controls · ${folders.size} folders`;
		if (!targets.length) return `${header}\n(no controls)`;
		return [
			header,
			`(set one with the tool named ${this.#prefix}.<path>)`,
			...targets.map((t) => `${t.path} = ${readValue(t.input)}`)
		].join("\n");
	}
};
/**
* Flattens a gooey into the inputs worth exposing.  Skipped: the builtin settings folder (unless
* asked for), element inputs (arbitrary DOM has no value to get or set), and the throwaway item
* inputs an {@link InputArray} renders -- the array itself is one tool.
*/
function collectInputs(gooey, includeSettings) {
	const root = gooey.folder;
	const skipped = /* @__PURE__ */ new Set();
	const settings = gooey.elements?.settingsFolder;
	if (settings && !includeSettings) {
		skipped.add(settings);
		for (const child of settings.allChildren) skipped.add(child);
	}
	const targets = [];
	const taken = /* @__PURE__ */ new Set();
	for (const folder of [root, ...root.allChildren]) {
		if (skipped.has(folder)) continue;
		const trail = folderTrail(folder, root);
		const prefix = trail.map(slug);
		for (const input of folder.inputs.values()) {
			if (input.__type === "InputElement") continue;
			if (input.__type === "InputArray") {
				const itemFolder = input.folder;
				skipped.add(itemFolder);
				for (const child of itemFolder.allChildren) skipped.add(child);
			}
			const base = [...prefix, slug(input.title || input.__type.replace("Input", ""))].join(".");
			let path = base;
			for (let i = 2; taken.has(path); i++) path = `${base}-${i}`;
			taken.add(path);
			targets.push({
				input,
				path,
				breadcrumb: [root.title, ...trail].join(" › ")
			});
		}
	}
	return targets;
}
function folderTrail(folder, root) {
	const trail = [];
	let f = folder;
	while (f && f !== root) {
		trail.unshift(f.title);
		f = f.parentFolder === f ? void 0 : f.parentFolder;
	}
	return trail;
}
/**
* Derives the tool(s) for one input.  Every type but {@link InputButtonGrid} produces exactly one
* tool; a grid produces one per button, because each button is a distinct action with its own name
* and an agent picks tools more reliably than it picks enum values.
*/
function toolsFor(target, name) {
	const { input, breadcrumb } = target;
	const label = input.title || name;
	const where = `in ${breadcrumb}`;
	const note = input.opts.description ? ` ${input.description}` : "";
	const setter = (kind, value, set) => [{
		name,
		description: `Set the "${label}" ${kind} ${where}.${note}`,
		inputSchema: {
			type: "object",
			properties: { value },
			required: ["value"],
			additionalProperties: false
		},
		execute: (args) => {
			if (input.disabled) return `error: "${label}" is disabled`;
			set(args["value"]);
			return `${target.path} = ${readValue(input)}`;
		}
	}];
	switch (input.__type) {
		case "InputNumber": {
			const opts = input.opts;
			return setter("number", {
				type: "number",
				...typeof opts.min === "number" ? { minimum: opts.min } : {},
				...typeof opts.max === "number" ? { maximum: opts.max } : {},
				...typeof opts.step === "number" && opts.step > 0 ? { multipleOf: opts.step } : {}
			}, (v) => input.set(Number(v)));
		}
		case "InputSwitch": {
			const labels = input.opts.labels;
			return setter(`switch${labels ? ` (${labels.true.state} / ${labels.false.state})` : ""}`, { type: "boolean" }, (v) => input.set(Boolean(v)));
		}
		case "InputText":
		case "InputTextArea": {
			const text = input;
			const max = text.opts.maxLength;
			return setter("text", {
				type: "string",
				...typeof max === "number" ? { maxLength: max } : {}
			}, (v) => text.set(String(v)));
		}
		case "InputColor": return setter("color", {
			type: "string",
			description: "A css color string, i.e. \"#ff0000\" or \"tomato\"."
		}, (v) => input.set(String(v)));
		case "InputSelect": {
			const select = input;
			const labels = select.options.map((o) => o.label);
			return [{
				name,
				description: `Choose an option for the "${label}" select ${where}.${note}`,
				inputSchema: {
					type: "object",
					properties: { value: {
						type: "string",
						enum: labels
					} },
					required: ["value"],
					additionalProperties: false
				},
				execute: (args) => {
					if (select.disabled) return `error: "${label}" is disabled`;
					const wanted = String(args["value"]);
					const option = select.options.find((o) => o.label === wanted);
					if (!option) return `error: no option "${wanted}" — options: ${labels.join(", ") || "(none)"}`;
					select.select(option);
					return `${target.path} = ${readValue(input)}`;
				}
			}];
		}
		case "InputArray": return setter("array", {
			type: "array",
			description: "The full replacement array."
		}, (v) => input.set(Array.isArray(v) ? v : [v]));
		case "InputBezier": return setter("easing curve", {
			type: "array",
			items: { type: "number" },
			minItems: 4,
			maxItems: 4,
			description: "The cubic-bezier control points [x1, y1, x2, y2]; x1 and x2 within 0..1, i.e. [0.42, 0, 0.58, 1]."
		}, (v) => input.set(v));
		case "InputButton": return [{
			name,
			description: `Click the "${label}" button ${where}.${note}`,
			inputSchema: {
				type: "object",
				properties: {},
				additionalProperties: false
			},
			execute: () => {
				if (input.disabled) return `error: "${label}" is disabled`;
				input.click();
				return `clicked ${target.path}`;
			}
		}];
		case "InputButtonGrid": return [...input.buttons.entries()].map(([id, button]) => ({
			name: `${name}.${slug(id)}`,
			description: `Click the "${button.text || id}" button in the "${label}" grid ${where}.`,
			inputSchema: {
				type: "object",
				properties: {},
				additionalProperties: false
			},
			execute: () => {
				button.element.click();
				return `clicked ${target.path}.${slug(id)} · active: ${readValue(input)}`;
			}
		}));
	}
	return [];
}
const MAX_VALUE_LENGTH = 120;
/**
* Renders an input's current value as one compact line -- no JSON envelope, no quoting, just what
* the agent needs to decide its next call.
*/
function readValue(input) {
	switch (input.__type) {
		case "InputColor": return input.state.value.hex8;
		case "InputSelect": return input.selected.value?.label ?? "(none)";
		case "InputButton": return "(button)";
		case "InputButtonGrid": {
			const active = [...input.active];
			return active.length ? active.join(", ") : "(none active)";
		}
		case "InputBezier": return bezierToString(input.value);
		case "InputArray": return truncate(JSON.stringify(input.state.value));
		default: return truncate(String(input.state.value));
	}
}
function truncate(v) {
	return v.length <= MAX_VALUE_LENGTH ? v : `${v.slice(0, MAX_VALUE_LENGTH)}…(${v.length} chars)`;
}
/** Lowercases and dash-joins a title into a tool-name segment. */
function slug(v) {
	return v.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "untitled";
}
function isPromise(v) {
	return typeof v?.catch === "function";
}

//#endregion
export { registerWebMCP };
//# sourceMappingURL=webmcp.js.map