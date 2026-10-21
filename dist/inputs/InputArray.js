import { Logger } from "../shared/logger.js";
import { state } from "../shared/state.js";
import { create } from "../shared/create.js";
import { Input } from "./Input.js";

//#region src/inputs/InputArray.ts
const ARRAY_INPUT_DEFAULTS = {
	__type: "ArrayInputOptions",
	value: [],
	maxItems: 20,
	closed: true
};
var InputArray = class extends Input {
	__type = "InputArray";
	initialValue;
	state;
	/**
	* The internal folder that contains the individual array item inputs.
	*/
	folder;
	/**
	* Individual inputs for each (rendered) array item.
	*/
	items = [];
	#overflowNote;
	#log;
	constructor(options, folder) {
		const opts = Object.assign({}, ARRAY_INPUT_DEFAULTS, options);
		super(opts, folder);
		this.#log = new Logger(`InputArray ${opts.title}`, { fg: "purple" });
		this.#log.fn("constructor").debug({
			opts,
			this: this
		});
		if (opts.binding) {
			this.initialValue = opts.binding.target[opts.binding.key];
			this.state = state(this.initialValue);
			this._evm.add(this.state.subscribe((v) => {
				opts.binding.target[opts.binding.key] = v;
			}));
		} else {
			this.initialValue = opts.value;
			this.state = state(opts.value);
		}
		this.folder = folder.addFolder(opts.title || "Array", { closed: opts.closed });
		this.elements.container = create("div", {
			classes: ["gooey-input-array-container"],
			parent: this.elements.content
		});
		this.elements.content = this.folder.elements.content;
		this._createArrayItems();
		this._evm.add(this.state.subscribe(() => {
			this.refresh();
		}));
	}
	_createArrayItems() {
		const array = this.state.value;
		const count = Math.min(array.length, this.opts.maxItems);
		this.items = [];
		for (let i = 0; i < count; i++) this.items.push(this._createItemInput(i, array[i]));
		if (array.length > count) this.#overflowNote = create("div", {
			classes: ["gooey-input-array-overflow"],
			parent: this.folder.elements.content,
			textContent: `+ ${array.length - count} more…`
		});
	}
	_createItemInput(index, value) {
		const title = "";
		if (typeof value === "boolean") {
			const input = this.folder.addSwitch(title, value);
			input.on("change", (newValue) => this._updateArrayItem(index, newValue));
			return input;
		} else if (typeof value === "number") {
			const input = this.folder.addNumber(title, value);
			input.on("change", (newValue) => this._updateArrayItem(index, newValue));
			return input;
		} else if (typeof value === "string") {
			const input = this.folder.addText(title, value);
			input.on("change", (newValue) => this._updateArrayItem(index, newValue));
			return input;
		} else if (typeof value === "object" && value !== null) {
			const input = this.folder.addText(title, JSON.stringify(value));
			input.on("change", (newValue) => {
				try {
					this._updateArrayItem(index, JSON.parse(newValue));
				} catch {
					this._updateArrayItem(index, newValue);
				}
			});
			return input;
		} else {
			const input = this.folder.addText(title, String(value));
			input.on("change", (newValue) => this._updateArrayItem(index, newValue));
			return input;
		}
	}
	_updateArrayItem(index, newValue) {
		const currentArray = [...this.state.value];
		currentArray[index] = newValue;
		this.state.set(currentArray);
		this.emit("change", currentArray);
	}
	set = (v) => {
		this.state.set(v);
		this._recreateItems();
		this.emit("change", v);
		return this;
	};
	_recreateItems() {
		for (const item of this.items) item.dispose();
		this.items = [];
		this.folder.inputs.clear();
		this.#overflowNote?.remove();
		this.#overflowNote = void 0;
		this._createArrayItems();
	}
	refresh = () => {
		const binding = this.opts.binding;
		this.opts.binding = void 0;
		super.refresh(this.state.value);
		this.opts.binding = binding;
		return this;
	};
	dispose() {
		for (const item of this.items) item.dispose();
		this.folder.dispose();
		super.dispose();
	}
};

//#endregion
export { InputArray };
//# sourceMappingURL=InputArray.js.map