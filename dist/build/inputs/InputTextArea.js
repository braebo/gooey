import { textareaController } from '../controllers/textarea';
import { Logger } from '../shared/logger';
import { create } from '../shared/create';
import { Input } from './Input';
export const TEXTAREA_INPUT_DEFAULTS = {
    __type: 'TextAreaInputOptions',
    value: 'foo',
    maxLength: 50,
};
export class InputTextArea extends Input {
    __type = 'InputTextArea';
    initialValue;
    state;
    // get element() {
    // 	return this.elements.controllers.input
    // }
    #log;
    constructor(options, folder) {
        const opts = Object.assign({}, TEXTAREA_INPUT_DEFAULTS, options, {
            __type: 'TextAreaInputOptions',
        });
        super(opts, folder);
        this.#log = new Logger(`InputTextArea ${opts.title}`, { fg: 'cyan' });
        this.#log.fn('constructor').debug({ opts, this: this });
        this.initialValue = this.resolveInitialValue(opts);
        this.state = this.resolveState(opts);
        const container = create('div', {
            classes: ['gooey-input-textarea-container'],
            parent: this.elements.content,
        });
        this.elements.controllers = {
            container,
            input: textareaController(this, opts, container),
        };
        this._evm.listen(this.elements.controllers.input, 'input', this.set);
        this._evm.add(this.state.subscribe(this.refresh));
    }
    enable() {
        this.elements.controllers.input.disabled = false;
        this.disabled = false;
        super.enable();
        return this;
    }
    disable() {
        this.elements.controllers.input.disabled = true;
        this.disabled = true;
        super.disable();
        return this;
    }
    set = (v) => {
        if (typeof v === 'undefined') {
            return;
        }
        if (typeof v !== 'string') {
            if (v?.target && 'value' in v.target) {
                this.state.set(v.target.value);
            }
        }
        else {
            this.state.set(v);
        }
        this._emit('change', this.state.value);
        return this;
    };
    refresh = () => {
        const v = this.state.value;
        super.refresh(v);
        this.elements.controllers.input.value = v;
        return this;
    };
    dispose() {
        super.dispose();
    }
}
