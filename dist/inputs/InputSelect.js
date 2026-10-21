import { stringify } from "../shared/stringify.js";
import { Logger } from "../shared/logger.js";
import { fromState, isState, state } from "../shared/state.js";
import { toFn } from "../shared/toFn.js";
import { create } from "../shared/create.js";
import { Input } from "./Input.js";
import { Select, fromLabeledOption, isLabeledOption, toLabeledOption } from "../controllers/Select.js";

//#region src/inputs/InputSelect.ts
const SELECT_INPUT_DEFAULTS = {
	__type: "SelectInputOptions",
	options: []
};
var InputSelect = class extends Input {
	__type = "InputSelect";
	initialValue;
	/**
	* Reactive state containing the raw value (T, not LabeledOption<T>).
	* This is automatically kept in sync with `selected`.
	* Consistent with other Input types.
	*/
	state;
	/**
	* The currently selected option (full LabeledOption<T> with both label and value).
	* This is the source of truth for the selection. When this changes, `state` is
	* automatically updated with the raw value.
	*/
	selected;
	/**
	* The raw value of the currently selected option (just T, not LabeledOption<T>).
	* Consistent with other Input types.
	*/
	get value() {
		return this.state.value;
	}
	set value(v) {
		if (typeof v !== "object" || v === null) {
			const option$1 = this.options.find((o) => o.value === v);
			if (option$1) {
				this.selected.set(option$1);
				return;
			}
		}
		let value = isLabeledOption(v) ? v.value : v;
		const vStr = JSON.stringify(value);
		const option = this.options.find((o) => JSON.stringify(o.value) === vStr);
		if (option) this.selected.set(option);
		else console.warn(`InputSelect: Could not find option with value`, value, "in options", this.options);
	}
	#options;
	set options(v) {
		this._log.fn("set options").debug(v);
		v ??= [];
		this.#options = toFn(v);
		this.selectController.clear();
		for (const option of fromState(this.#options())) this.selectController.add(option);
	}
	/**
	* The options array of valid values for this select input.
	*/
	get options() {
		return this.resolveOptions(this.#options());
	}
	/**
	* The select controller instance.
	*/
	selectController;
	/**
	* A latch for event propagation. Toggled off everytime an event aborted.
	*/
	#stopPropagation = true;
	/**
	* The currently selected option as a labeled option.
	*/
	labeledSelection;
	_log;
	constructor(options, folder) {
		const opts = Object.assign({}, SELECT_INPUT_DEFAULTS, options, { __type: "SelectInputOptions" });
		super(opts, folder);
		this._evm.registerEvents([
			"select",
			"preview",
			"open",
			"close",
			"cancel"
		]);
		this._log = new Logger(`InputSelect ${opts.title}`, { fg: "slategrey" });
		this._log.fn("constructor").debug({
			opts,
			this: this
		});
		const v = opts.value;
		if (v && typeof v === "object" && !Array.isArray(v) && "value" in v && "options" in v) {
			const config = v;
			opts.value = config.value;
			opts.options = config.options;
		}
		opts.value ??= opts.binding?.initial ?? fromState(this.targetValue);
		this.initialValue = this.resolveInitialValue(opts);
		this.labeledSelection = {
			value: fromLabeledOption(this.initialValue),
			label: this.resolveInitialLabel(this.initialValue, opts)
		};
		this.#options = toFn(this.opts.options ?? []);
		this.selected = state(this.labeledSelection);
		this.state = state(this.selected.value.value);
		this._evm.add(this.selected.subscribe((labeledOption) => {
			this.state.set(labeledOption.value);
		}));
		const container = create("div", {
			classes: ["gooey-input-select-container"],
			parent: this.elements.content
		});
		this.selectController = new Select({
			input: this,
			container,
			options: this.options,
			selected: this.labeledSelection,
			title: this.title
		});
		this.elements.controllers = {
			container,
			select: this.selectController.elements
		};
		this.disabled = opts.disabled ?? false;
		this._evm.add(this.selected.subscribe((v$1) => {
			if (!this.selectController.bubble) return;
			if (this.targetObject) if (isState(this.targetValue)) {
				this._log.fn("updating binding").debug({
					from: this.targetValue.value,
					to: v$1.value
				});
				this.targetValue.set(v$1.value);
			} else this.targetValue = v$1.value;
			if (this.#stopPropagation) {
				this.#stopPropagation = false;
				this._log.fn("selected.subscribe").debug("Stopped propagation.  Subscribers will not be notified.");
				return;
			}
			this.select(v$1);
		}));
		if (options.onChange) this._evm.on("change", (v$1) => {
			this._log.fn("calling options onChange").debug(v$1);
			options.onChange?.(toLabeledOption(v$1));
		});
		this.selectController.on("change", (v$1) => {
			this._log.fn("select.onChange").debug(v$1);
			if (this.#stopPropagation) return;
			this.#stopPropagation = true;
			this.select(v$1);
		});
		this.listen(this.selectController.element, "preview", () => {
			this.emit("preview");
		});
		this.listen(this.selectController.element, "open", () => {
			this.emit("open");
		});
		this.listen(this.selectController.element, "close", () => {
			this.emit("close");
		});
		this.listen(this.selectController.element, "cancel", () => {
			this.emit("cancel");
		});
		this._dirty = () => this.selected.value.label !== this.labeledSelection.label;
		this._log.fn("constructor").debug({ this: this });
	}
	resolveOptions(providedOptions) {
		function isLabeledOptionsArray(v) {
			return isLabeledOption(v[0]);
		}
		let selectOptions = toFn(fromState(providedOptions))();
		if (!isLabeledOptionsArray(selectOptions)) {
			if (!Array.isArray(selectOptions)) throw new Error(`gooey: Invalid options array: "${selectOptions}"`);
			if (selectOptions.every((o) => typeof o === "string")) return selectOptions.map((o) => ({
				label: o,
				value: o
			}));
			if (!this.opts.labelKey) {
				if (selectOptions.every((o) => o && typeof o === "object" && "label" in o && typeof o.label === "string")) return selectOptions.map((o) => ({
					label: o.label,
					value: o
				}));
				if (selectOptions.every((o) => o && typeof o === "object" && "title" in o && typeof o.title === "string")) return selectOptions.map((o) => ({
					label: o.title,
					value: o
				}));
				throw new Error("Recieved unlabeled options with no `labelKey` specified.  Please label your options or provide the `labelKey` to use as a label.");
			}
			return selectOptions.map((o) => ({
				label: o[this.opts.labelKey],
				value: o
			}));
		}
		return selectOptions;
	}
	resolveInitialValue(opts) {
		return fromState(opts.binding ? opts.binding.target[opts.binding.key] : opts.value);
	}
	resolveInitialLabel(initialValue, opts) {
		const v = isState(initialValue) ? initialValue.value : initialValue;
		this._log.fn("resolveInitialLabel").debug({
			v,
			initialValue,
			opts
		});
		if (isLabeledOption(v)) return v.label;
		if (opts.options && Array.isArray(opts.options) && opts.options.length > 0) {
			if (isLabeledOption(opts.options[0])) {
				const labeledOptions = opts.options;
				if (typeof v !== "object" || v === null) {
					const match = labeledOptions.find((o) => o.value === v);
					if (match) return match.label;
				} else {
					const vStr = JSON.stringify(v);
					const match = labeledOptions.find((o) => JSON.stringify(o.value) === vStr);
					if (match) return match.label;
				}
			}
		}
		if (opts.labelKey) return initialValue[opts.labelKey];
		if (v && typeof v === "object") {
			if ("title" in v && typeof v.title === "string") return v.title;
			if ("label" in v && typeof v.label === "string") return v.label;
			return stringify(v);
		}
		return String(v);
	}
	get targetObject() {
		return this.opts.binding?.target;
	}
	get targetKey() {
		return this.opts.binding?.key;
	}
	get targetValue() {
		return this.targetObject?.[this.targetKey];
	}
	set targetValue(v) {
		if (isLabeledOption(v)) v = fromLabeledOption(v);
		this._log.fn("set targetValue").debug(v);
		if (typeof v === "undefined") {
			console.error("Cannot set target value to undefined");
			console.error("this", this);
			throw new Error("Cannot set target value to undefined");
		}
		const to = this.targetObject;
		const tk = this.targetKey;
		if (to && tk) if (isState(to[tk])) to[tk].set(v);
		else to[tk] = v;
	}
	/**
	* Sets the value (required by base Input class).
	* This accepts the raw value and finds the corresponding option.
	*/
	set(v) {
		this.value = v;
	}
	/**
	* Selects the given {@link LabeledOption} and updates the ui.
	* Use this when you have the full labeled option.
	*/
	select(value) {
		this._log.fn("select").debug(value);
		this.#stopPropagation = true;
		this.selectController.select(value, false);
		this.selected.set(value);
		this.emit("change", value.value);
		this.emit("select", value);
		return this;
	}
	enable() {
		this._log.fn("enable").debug();
		this.disabled = false;
		this.selectController.enable();
		return this;
	}
	disable() {
		this._log.fn("disable").debug();
		this.disabled = true;
		this.selectController.disable();
		return this;
	}
	refresh = () => {
		const v = this.selected.value;
		this._log.fn("refresh").debug({
			v,
			this: this
		});
		if (!this.labeledSelection) throw new Error("Failed to find labeled selection.");
		const newOptions = this.options.filter((o) => !this.selectController.options.some((oo) => oo.label === o.label));
		for (const option of newOptions) this.selectController.add(option);
		this.selectController.select(this.labeledSelection, false);
		super.refresh();
		return this;
	};
	dispose() {
		super.dispose();
	}
};

//#endregion
export { InputSelect };
//# sourceMappingURL=InputSelect.js.map