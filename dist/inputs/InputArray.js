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
/**
* An array as JSON that can't throw, for comparing what's on screen with the field: a bigint
* item writes as its digits, and an object met twice (a cycle) as a marker.  Plain
* `JSON.stringify` throws on both, and the array is snapshotted whole, past `maxItems` too.
*/
function snapshot(array) {
	const seen = /* @__PURE__ */ new WeakSet();
	return JSON.stringify(array, (_, v) => {
		if (typeof v === "bigint") return `${v}n`;
		if (typeof v === "object" && v !== null) {
			if (seen.has(v)) return "[seen]";
			seen.add(v);
		}
		return v;
	});
}
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
	/**
	* The array the items were built from, as JSON, so a {@link readBinding} can tell an outside
	* write (a new array, or the same one changed in place) from what's already on screen.
	*/
	#rendered = "";
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
	_createArrayItems(array = this.state.value) {
		this.#rendered = snapshot(array);
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
		let input;
		/** The array item an item input's value stands for. */
		let toItem = (v) => v;
		if (typeof value === "boolean") input = this.folder.addSwitch(title, value);
		else if (typeof value === "number") input = this.folder.addNumber(title, value);
		else if (typeof value === "string") input = this.folder.addText(title, value);
		else if (typeof value === "object" && value !== null) {
			input = this.folder.addText(title, JSON.stringify(value));
			toItem = (v) => {
				try {
					return JSON.parse(v);
				} catch {
					return v;
				}
			};
		} else input = this.folder.addText(title, String(value));
		input.on("change", (newValue) => this._updateArrayItem(index, toItem(newValue)));
		const commit = input.commit.bind(input);
		input.commit = ({ from, to = input.state.value }) => commit({
			from: from === void 0 ? [...this.state.value] : this._withItem(index, toItem(from)),
			to: this._withItem(index, toItem(to)),
			target: this,
			setter: (v) => this.set([...v])
		});
		return input;
	}
	/** The array as it stands, with one item swapped. */
	_withItem(index, item) {
		const array = [...this.state.value];
		array[index] = item;
		return array;
	}
	_updateArrayItem(index, newValue) {
		const currentArray = this._withItem(index, newValue);
		this.#rendered = snapshot(currentArray);
		this.state.set(currentArray);
		this.emit("change", currentArray);
	}
	set = (v) => {
		this._recreateItems(v);
		this.state.set(v);
		this.emit("change", v);
		return this;
	};
	_recreateItems(array = this.state.value) {
		for (const item of this.items) item.dispose();
		this.items = [];
		this.folder.inputs.clear();
		this.#overflowNote?.remove();
		this.#overflowNote = void 0;
		this._createArrayItems(array);
	}
	/**
	* Reads the bound field on {@link refresh} only when it holds something other than what the
	* items show: the store never finds two arrays equal, so an unconditional read would
	* re-notify forever.  Silent: no `change`, and no undo step.
	*/
	readBinding() {
		const binding = this.opts.binding;
		if (!binding) return;
		const next = binding.target[binding.key];
		if (!Array.isArray(next) || snapshot(next) === this.#rendered) return;
		this._recreateItems(next);
		this.state.set(next);
	}
	dispose() {
		for (const item of this.items) item.dispose();
		this.folder.dispose();
		super.dispose();
	}
};

//#endregion
export { InputArray };
//# sourceMappingURL=InputArray.js.map