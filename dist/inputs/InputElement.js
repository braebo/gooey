import { Logger } from "../shared/logger.js";
import { state } from "../shared/state.js";
import { create } from "../shared/create.js";
import { Input } from "./Input.js";

//#region src/inputs/InputElement.ts
const ELEMENT_INPUT_DEFAULTS = {
	__type: "ElementInputOptions",
	saveable: false,
	resettable: false
};
/**
* An input that mounts arbitrary content in its content area instead of a controller.  Use it to
* put consumer-rendered DOM -- a chart, a markdown card, a preview -- in a folder alongside normal
* inputs.  It has no value to serialize, so it opts out of presets by default.
*
* @example
* ```ts
* const card = gooey.addElement('Notes', container => {
* 	container.innerHTML = renderMarkdown(notes)
* 	return () => container.replaceChildren()
* })
*
* card.set(someOtherElement)
* ```
*/
var InputElement = class extends Input {
	__type = "InputElement";
	initialValue;
	state;
	/**
	* The cleanup function returned by the last mount function, if any.
	*/
	#cleanup;
	/**
	* The content currently mounted, used to avoid re-mounting on every refresh.
	*/
	#mounted;
	#disposed = false;
	#log;
	constructor(options, folder) {
		const opts = Object.assign({}, ELEMENT_INPUT_DEFAULTS, options, { __type: "ElementInputOptions" });
		super(opts, folder);
		this.#log = new Logger(`InputElement ${opts.title}`, { fg: "lightgreen" });
		this.#log.fn("constructor").debug({
			opts,
			this: this
		});
		this.initialValue = opts.value;
		this.state = state(opts.value);
		this.elements.container.style.setProperty("height", "auto");
		this.elements.controllers = { container: create("div", {
			classes: ["gooey-input-element-container"],
			parent: this.elements.content,
			style: { width: "100%" }
		}) };
		this.#mount(opts.value);
		this._evm.add(this.state.subscribe(this.refresh));
	}
	/**
	* The container the content is mounted into.
	*/
	get container() {
		return this.elements.controllers.container;
	}
	/**
	* Replaces the mounted content, running the previous mount function's cleanup first.
	*/
	set = (v) => {
		this.state.set(v);
		this.emit("change", v);
		return this;
	};
	refresh = () => {
		if (this.#disposed) return this;
		const v = this.state.value;
		super.refresh(v);
		if (v !== this.#mounted) this.#mount(v);
		return this;
	};
	#mount(content) {
		this.#unmount();
		if (!content) return;
		if (typeof content === "function") this.#cleanup = content(this.container) ?? void 0;
		else this.container.appendChild(content);
		this.#mounted = content;
	}
	#unmount() {
		this.#cleanup?.();
		this.#cleanup = void 0;
		this.#mounted = void 0;
		this.container.replaceChildren();
	}
	dispose() {
		this.#disposed = true;
		this.#unmount();
		super.dispose();
	}
};

//#endregion
export { InputElement };
//# sourceMappingURL=InputElement.js.map