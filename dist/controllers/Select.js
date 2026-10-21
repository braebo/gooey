import { Logger } from "../shared/logger.js";
import { isState } from "../shared/state.js";
import { EventManager } from "../shared/EventManager.js";
import { values } from "../shared/object.js";
import { __decorateMetadata } from "../_virtual/_@oxc-project_runtime@0.95.0/helpers/decorateMetadata.js";
import { __decorate } from "../_virtual/_@oxc-project_runtime@0.95.0/helpers/decorate.js";
import { create } from "../shared/create.js";
import { disableable } from "../shared/decorators/disableable-class-decorator.js";

//#region src/controllers/Select.ts
let Select = class Select$1 {
	__type = "Select";
	element;
	_opts;
	elements;
	/**
	* All options in the select controller.
	*/
	options;
	/**
	* A map of all options by their (internally generated) id.
	*/
	optionMap = /* @__PURE__ */ new Map();
	/**
	* Whether the dropdown is currently visible.
	*/
	expanded = false;
	/**
	* The initial selected option.
	*/
	initialValue;
	/**
	* The initial options array.
	*/
	initialOptions;
	/**
	* When true, clicking clicks will be ignored.
	*/
	disableClicks = false;
	/**
	* Used to prevent infinite loops when updating internally.
	*/
	bubble = true;
	/**
	* The currently selected option.
	*/
	_selected;
	/**
	* The currently selected option preserved when hot-swapping on:hover.
	*/
	_currentSelection;
	/**
	* The parent element that the selected element is scrolling in.
	*/
	_scrollParent;
	_evm = new EventManager([
		"change",
		"refresh",
		"cancel",
		"open",
		"close"
	]);
	/**
	* Used to subscribe to {@link SelectInputEvents}.
	*/
	on = this._evm.on.bind(this._evm);
	_log;
	constructor(options) {
		this._opts = {
			...options,
			selected: toLabeledOption(options.selected ? options.selected : options.options[0]),
			options: options.options.map((o) => toLabeledOption(o)),
			selectOnHover: options.selectOnHover ?? true
		};
		if (options?.title) this._log = new Logger(`Select ${options.title}`, { fg: "burlywood" });
		else this._log = new Logger("Select", { fg: "blueviolet" });
		this._selected = this._currentSelection = this.initialValue = this._opts.selected;
		this.options = this.initialOptions = this._opts.options;
		const container = create("div", {
			classes: ["gooey-controller-select-container"],
			parent: options.container
		});
		this.element = container;
		const selected = create("div", {
			classes: ["gooey-controller-select-selected"],
			parent: container,
			textContent: String(this.getLabel(this.selected))
		});
		this._evm.listen(selected, "click", () => {
			if (this.disableClicks) return;
			this.toggle();
		});
		this.elements = {
			container,
			selected,
			dropdown: create("div", { classes: ["gooey-controller-select-dropdown"] }),
			options: []
		};
		for (const option of this.options) this.add(option);
		this.disabled = this._opts.disabled;
		this._log.fn("constructor").debug({
			opts: this._opts,
			this: this
		});
	}
	/**
	* The currently selected option. Assigning a new value will update the UI.
	*/
	get selected() {
		return this._selected;
	}
	set selected(v) {
		this._log.fn("set selected").debug(v);
		const newValue = isState(v) ? toLabeledOption(v.value) : toLabeledOption(v);
		this._selected = newValue;
		this.elements.selected.innerHTML = newValue.label;
		if (!this.bubble) {
			this.bubble = true;
			return;
		}
		this._evm.emit("change", this.selected);
	}
	getLabel(v) {
		if (isState(v)) return v.value.label;
		else return v.label;
	}
	/**
	* Adds an option to the select controller.
	* @param option The option to add.
	* @returns The id of the added option.
	*/
	add(option) {
		const opt = toLabeledOption(option);
		const el = create("div", {
			classes: ["gooey-controller-select-option"],
			parent: this.elements.dropdown,
			innerText: opt.label
		});
		const id = this._evm.listen(el, "click", this.select);
		el.dataset["optionId"] = id;
		this.optionMap.set(id, {
			option: opt,
			element: el
		});
		this.elements.options.push(el);
		this._log.fn("add").debug({
			option,
			added: this.optionMap.get(id),
			id,
			this: this
		});
		return this;
	}
	/**
	* Removes an option from the select controller by id.
	*/
	remove(id, autoSelectFallback = false) {
		const found = this.optionMap.get(id);
		if (!found) {
			console.error({ this: this });
			throw new Error("No option found in map for id: " + id);
		}
		const btn = found;
		this._log.fn("remove").debug({
			btn,
			id,
			this: this
		});
		if (autoSelectFallback && JSON.stringify(this.selected.value) === JSON.stringify(btn.option.value)) {
			const nextIndex = this.options.indexOf(btn.option) + 1;
			const fallback = this.options[nextIndex % this.options.length];
			this._log.fn("remove").debug("Auto-selecting fallback btn", {
				fallback,
				btn,
				id,
				this: this
			});
			this.select(fallback, false);
		}
		this.elements.options = this.elements.options.filter((el) => el !== btn.element);
		btn.element.remove();
		this.options = this.options.filter((o) => o.label !== btn.option.label);
		this.optionMap.delete(id);
	}
	/**
	* Removes all options and their elements.
	*/
	clear() {
		this._log.fn("clear").debug({ this: this });
		for (const id of this.optionMap.keys()) this.remove(id, false);
		this.options = [];
		this.optionMap.clear();
	}
	select = (v, bubble = true) => {
		if (this.disabled) return this;
		this._log.fn("select").debug("v", v, { this: this });
		if (v instanceof Event) {
			const target = v.target;
			const id = target.dataset["optionId"];
			if (typeof id !== "string") {
				console.error({ target });
				throw new Error("No option id found on select click");
			}
			const option = this.optionMap.get(id);
			if (!option) {
				console.error({ target });
				throw new Error("No option found in map");
			}
			for (const [, { element }] of this.optionMap) element.classList.toggle("selected", element === option.element);
			this.close();
			this.selected = option.option;
		} else {
			const newValue = toLabeledOption(v);
			if (isState(newValue)) this.selected = newValue.value;
			else if (isLabeledOption(newValue)) {
				this.bubble = bubble;
				this.selected = newValue;
			} else throw new Error("Invalid value: " + newValue);
		}
		return this;
	};
	/**
	* Updates the UI to reflect the current state of the source.
	*/
	refresh = () => {
		this._log.fn("refresh").debug({ this: this });
		this.elements.selected.innerHTML = this.selected.label;
		return this;
	};
	/**
	* Toggles the dropdown's visibility.
	*/
	toggle = () => {
		this._log.fn("toggle").debug({ this: this });
		if (this.expanded) {
			this._evm.emit("cancel");
			this.close();
		} else this.open();
	};
	/**
	* Shows the dropdown.
	*/
	open = () => {
		this.expanded = true;
		this._opts.input.folder.gooey.wrapper.appendChild(this.elements.dropdown);
		this.elements.dropdown.classList.add("expanded");
		this.elements.selected.classList.add("active");
		this.updatePosition();
		this._scrollParent ??= this._opts.input.folder.gooey?.container;
		this._scrollParent?.removeEventListener("scroll", this.updatePosition);
		this._scrollParent?.addEventListener("scroll", this.updatePosition);
		this._evm.listen(window, "keydown", this._closeOnEscape, {}, "dropdown");
		this._evm.listen(window, "click", this._clickOutside, {}, "dropdown");
		if (this._opts.selectOnHover) {
			this._currentSelection = this.selected;
			for (const [, { option, element }] of this.optionMap) {
				element.classList.toggle("selected", option.label === this.selected.label);
				const select = () => {
					this._log.fn("on(mouseenter)").debug("currentSelection", {
						option,
						element
					}, this);
					this.select(option);
				};
				this._evm.listen(element, "mouseenter", select, {}, "dropdown");
			}
		}
		this._evm.emit("open");
		this._log.fn("open").debug({ element: this.elements.dropdown }, this);
		setTimeout(() => {
			this.elements.dropdown.style.pointerEvents = "all";
		}, 200);
	};
	/**
	* Positions the dropdown to the selected element.
	*/
	updatePosition = () => {
		if (!this.expanded) return;
		this.elements.dropdown.style.setProperty("width", "unset");
		this.elements.dropdown.style.setProperty("top", "unset");
		const dropdown = this.elements.dropdown;
		const selectedRect = this.elements.selected.getBoundingClientRect();
		const containerRect = this._opts.input.folder.gooey.container.getBoundingClientRect();
		const top = selectedRect.top - containerRect.top + 22;
		const left = selectedRect.left - containerRect.left;
		dropdown.style.setProperty("top", `${top}px`);
		dropdown.style.setProperty("left", `${left}px`);
		const width = Math.max(selectedRect.width, dropdown.offsetWidth);
		dropdown.style.setProperty("width", `${width}px`);
		const scrollHeight = dropdown.scrollHeight;
		const maxHeight = Math.max(200, this.container.offsetHeight - top);
		if (scrollHeight > maxHeight) dropdown.style.setProperty("max-height", `${maxHeight}px`);
		else dropdown.style.setProperty("max-height", `${scrollHeight}px`);
	};
	get container() {
		return this._opts.input.folder.gooey.container;
	}
	/**
	* Hides the dropdown.
	*/
	close = () => {
		this.expanded = false;
		this.elements.dropdown.classList.remove("expanded");
		this.elements.selected.classList.remove("active");
		this.elements.dropdown.style.pointerEvents = "none";
		this._evm.clearGroup("dropdown");
		this._evm.emit("close");
		setTimeout(() => {
			this.elements.dropdown.remove();
		}, 200);
	};
	/**
	* Closes the dropdown if the escape key was pressed.  If {@link selectOnHover}
	* is enabled, the current selection will be re-selected to restore the original
	* value.
	*/
	_closeOnEscape = (e) => {
		if (e.key === "Escape") this._cancel();
	};
	_clickOutside = (e) => {
		const path = e.composedPath();
		if (!path.includes(this.elements.selected) && !path.includes(this.elements.dropdown)) this._cancel();
	};
	_cancel() {
		this.close();
		if (this._opts.selectOnHover) this.select(this._currentSelection);
		this._evm.emit("cancel");
	}
	enable() {
		this.elements.selected.classList.remove("disabled");
		this.elements.selected.removeAttribute("disabled");
		return this;
	}
	disable() {
		this.elements.selected.classList.add("disabled");
		this.elements.selected.setAttribute("disabled", "true");
		return this;
	}
	dispose() {
		for (const el of values(this.elements)) if (Array.isArray(el)) el.forEach((e) => e.remove());
		else el.remove();
		this._scrollParent?.removeEventListener("scroll", this.updatePosition);
		removeEventListener("click", this._clickOutside);
		this._evm.dispose();
	}
};
Select = __decorate([disableable, __decorateMetadata("design:paramtypes", [Object])], Select);
function isLabeledOption(v) {
	return typeof v === "object" && Object.keys(v).length === 2 && "label" in v && "value" in v;
}
function toLabeledOption(v) {
	if (isLabeledOption(v)) return v;
	if (["string", "number"].includes(typeof v)) return {
		label: String(v),
		value: v
	};
	if (isState(v)) {
		if (isLabeledOption(v.value)) return v.value;
		return {
			label: String(v.value),
			value: v
		};
	}
	if (v && typeof v === "object") return {
		label: JSON.stringify(v),
		value: v
	};
	console.error("Invalid option:", v, ". Please provide a named option ({ label: string, value: T })and place your value in the `value` property.");
	throw new Error("Missing label:" + JSON.stringify(v), { cause: { v } });
}
function fromLabeledOption(v) {
	function rtrn(v$1) {
		return v$1;
	}
	if (isLabeledOption(v)) return rtrn(v.value);
	if (isState(v)) {
		const t = v.value;
		if (isLabeledOption(t)) return rtrn(t.value);
		else return rtrn(t);
	}
	return v;
}

//#endregion
export { Select, fromLabeledOption, isLabeledOption, toLabeledOption };
//# sourceMappingURL=Select.js.map