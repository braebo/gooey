import { textController } from '../controllers/text.js';
import { create } from '../shared/create.js';
import { Logger } from '../shared/logger.js';
import { state } from '../shared/state.js';
import { Input } from './Input.js';

const TEXT_INPUT_DEFAULTS = {
    __type: 'TextInputOptions',
    value: '',
    maxLength: 50,
};
class InputText extends Input {
    __type = 'InputText';
    initialValue;
    state;
    #log;
    constructor(options, folder) {
        const opts = Object.assign({}, TEXT_INPUT_DEFAULTS, options);
        super(opts, folder);
        this.#log = new Logger(`InputText ${opts.title}`, { fg: 'cyan' });
        this.#log.fn('constructor').debug({ opts, this: this });
        if (opts.binding) {
            this.initialValue = opts.binding.target[opts.binding.key];
            this.state = state(this.initialValue);
            this._evm.add(this.state.subscribe(v => {
                opts.binding.target[opts.binding.key] = v;
            }));
        }
        else {
            this.initialValue = opts.value;
            this.state = state(opts.value);
        }
        const container = create('div', {
            classes: ['gooey-input-text-container'],
            parent: this.elements.content,
        });
        this.elements.controllers = {
            container,
            input: textController(this, opts, container),
        };
        this._evm.listen(this.elements.controllers.input, 'input', this.set);
        this._evm.add(this.state.subscribe(() => {
            this.refresh();
        }));
    }
    enable() {
        // super.enable()
        this.disabled = false;
        this.elements.controllers.input.disabled = false;
        return this;
    }
    disable() {
        // super.disable()
        this.disabled = true;
        this.elements.controllers.input.disabled = true;
        return this;
    }
    set = (v) => {
        if (typeof v === 'undefined')
            return;
        if (typeof v !== 'string') {
            if (v?.target && 'value' in v.target) {
                this.commit({ to: v.target.value });
                this.state.set(v.target.value);
            }
        }
        else {
            this.commit({ to: v });
            this.state.set(v);
        }
        this._emit('change', this.state.value);
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
}

export { InputText, TEXT_INPUT_DEFAULTS };
//# sourceMappingURL=InputText.js.map
