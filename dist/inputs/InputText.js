import { Logger } from "../shared/logger.js";
import { state } from "../shared/state.js";
import { create } from "../shared/create.js";
import { Input } from "./Input.js";
import { textController } from "../controllers/text.js";

//#region src/inputs/InputText.ts
const TEXT_INPUT_DEFAULTS = {
	__type: "TextInputOptions",
	value: "",
	maxLength: 50
};
var InputText = class extends Input {
	__type = "InputText";
	initialValue;
	state;
	#log;
	constructor(options, folder) {
		const opts = Object.assign({}, TEXT_INPUT_DEFAULTS, options);
		super(opts, folder);
		this.#log = new Logger(`InputText ${opts.title}`, { fg: "cyan" });
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
		const container = create("div", {
			classes: ["gooey-input-text-container"],
			parent: this.elements.content,
			tooltip: {
				text: `Max length: ${this.opts.maxLength}`,
				placement: "left",
				delay: 0,
				offsetX: "-4px",
				hideOnClick: true,
				manual: true,
				...this.opts.tooltipOptions
			}
		});
		this.elements.controllers = {
			container,
			input: textController(this, opts, container)
		};
		this._evm.listen(this.elements.controllers.input, "input", this.set);
		this._evm.add(this.state.subscribe(() => {
			this.refresh();
		}));
	}
	set = (v) => {
		if (typeof v !== "string" && v?.target && "value" in v.target) v = v.target.value;
		if (typeof v !== "string") return;
		if (v.length > this.opts.maxLength) {
			v = v.slice(0, this.opts.maxLength);
			this.elements.drawerToggle.tooltip.text = `Max length: ${this.opts.maxLength}`;
			this.elements.drawerToggle.tooltip.show();
		}
		this.commit({ to: v });
		this.state.set(v);
		this.emit("change", this.state.value);
		return this;
	};
	refresh = () => {
		const v = this.state.value;
		this.elements.controllers.input.value = v;
		super.refresh(v);
		return this;
	};
	dispose() {
		super.dispose();
	}
};

//#endregion
export { InputText };
//# sourceMappingURL=InputText.js.map