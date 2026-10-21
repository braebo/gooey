import { Logger } from "../shared/logger.js";
import { state } from "../shared/state.js";
import { toFn } from "../shared/toFn.js";
import { create } from "../shared/create.js";
import { Input } from "./Input.js";
import { ButtonController } from "../controllers/ButtonController.js";
import { getStyle } from "../shared/getStyle.js";

//#region src/inputs/InputButtonGrid.ts
const BUTTONGRID_INPUT_DEFAULTS = {
	__type: "ButtonGridInputOptions",
	value: [[{
		id: "",
		text: "",
		onClick: () => {}
	}]],
	style: { gap: "0.5em" },
	applyActiveClass: true,
	resettable: false
};
var InputButtonGrid = class extends Input {
	__type = "InputButtonGrid";
	initialValue = {};
	/**
	* An array of active button ids.
	* @see {@link Input.state}
	*/
	state = state(/* @__PURE__ */ new Set());
	buttons = /* @__PURE__ */ new Map();
	buttonGrid;
	/**
	* A Set of active button ids.
	*/
	get active() {
		return this.state.value;
	}
	setActive(id) {
		const button = this.buttons.get(id);
		if (!button) {
			console.warn(`Button id "${id}" not found`);
			return;
		}
		const cls = this.opts.applyActiveClass;
		if (!this.opts.multiple) {
			for (const btn of this.buttons.values()) {
				btn.active = false;
				if (cls) btn.element.classList.remove("active");
				this.state.value.delete(id);
			}
			button.active = true;
			if (cls) button.element.classList.add("active");
			this.state.value.add(id);
		} else {
			const newState = !button.active;
			button.active = newState;
			if (cls) button.element.classList.toggle("active", newState);
			newState ? this.state.value.add(id) : this.state.value.delete(id);
		}
	}
	_log;
	constructor(options, folder) {
		const opts = Object.assign({}, BUTTONGRID_INPUT_DEFAULTS, options);
		super(opts, folder);
		this._evm.registerEvents(["click"]);
		this.initialValue = opts.value;
		this._log = new Logger(`InputButtonGrid ${opts.title}`, { fg: "cyan" });
		this._log.fn("constructor").debug({
			opts,
			this: this
		});
		const container = create("div", {
			classes: ["gooey-input", "gooey-input-buttongrid-container"],
			parent: this.elements.content
		});
		this.elements.controllers = {
			container,
			buttonGrid: []
		};
		this.buttonGrid = this.toGrid(this.initialValue);
		this.refresh();
	}
	onClick(callback) {
		this._evm.on("click", ({ event, button }) => callback({
			event,
			button
		}));
	}
	/**
	* Converts a {@link ButtonGridArrays} into a a grid of {@link HTMLButtonElement}
	* elements, and
	*
	* - appends them to the {@link InputButtonGrid.elements.controllers.container}
	*/
	toGrid(grid) {
		const instanceGrid = [];
		const seen = /* @__PURE__ */ new Set();
		const rows = grid.length;
		const cols = Math.max(...grid.map((row) => row.length));
		for (const { element } of this.buttons.values()) element.remove();
		this.buttons.clear();
		for (let i = 0; i < rows; i++) {
			const row = create("div", {
				classes: ["gooey-controller-buttongrid-row"],
				parent: this.elements.controllers.container,
				style: { gap: "0.5em" }
			});
			instanceGrid[i] = [];
			for (let j = 0; j < cols; j++) {
				const opts = grid[i]?.[j];
				if (opts) {
					const id = this._resolveId(opts, seen);
					seen.add(id);
					const button = this.addButton(opts, id, i, j);
					row.appendChild(button.element);
					instanceGrid[i][j] = button;
				}
			}
		}
		this.elements.container.style.setProperty("height", getStyle(this.elements.controllers.container, "height"));
		return instanceGrid;
	}
	_resolveId(opts, seen) {
		let id = opts.id ?? (typeof opts.text === "function" ? opts.text() : opts.text);
		let i = 0;
		while (seen.has(id + (i ? i : ""))) i++;
		if (i) id += i;
		return id;
	}
	addButton(opts, id, i, j) {
		const text = toFn(opts.text);
		const tooltip = opts.tooltip ? Object.assign({
			placement: "top",
			delay: 1e3
		}, opts.tooltip) : void 0;
		opts.element = create("button", {
			id,
			classes: [
				"gooey-controller",
				"gooey-controller-button",
				"gooey-controller-buttongrid-button"
			],
			innerHTML: text(),
			dataset: {
				id,
				row: String(i),
				col: String(j)
			},
			style: {
				...opts.style,
				width: "100%"
			},
			tooltip
		});
		if (typeof opts.active !== "function") opts.active = () => {
			return this.state.value.has(id);
		};
		const btn = new ButtonController(opts);
		if (this.opts.applyActiveClass) btn.element.classList.toggle("active", btn.active);
		btn.on("click", (payload) => {
			this._set(payload);
		});
		this.buttons.set(id, btn);
		return btn;
	}
	_set(payload) {
		this.setActive(payload.button.id);
		this._evm.emit("click", payload);
	}
	set() {
		this.refresh();
	}
	refresh() {
		this._log.fn("refresh").debug({ this: this });
		for (const btn of this.buttons.values()) btn.refresh();
		super.refresh();
		return this;
	}
	enable() {
		for (const btn of this.buttons.values()) btn.enable();
		this.disabled = false;
		return this;
	}
	disable() {
		for (const btn of this.buttons.values()) btn.disable();
		this.disabled = true;
		return this;
	}
	dispose() {
		for (const btn of this.buttons.values()) btn.dispose();
		this.buttons.clear();
		super.dispose();
	}
};

//#endregion
export { InputButtonGrid };
//# sourceMappingURL=InputButtonGrid.js.map