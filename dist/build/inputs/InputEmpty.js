//! wip
// @ts-nocheck
import { textController } from '../controllers/text';
import { create } from '../shared/create';
import { Logger } from '../shared/logger';
import { state } from '../shared/state';
import { Input } from './Input';
export const EMPTY_INPUT_DEFAULTS = {
    __type: 'EmptyInputOptions',
    type: 'empty',
    value: '',
};
export class InputEmpty extends Input {
    __type = 'InputEmpty';
    type = 'empty';
    initialValue;
    state;
    #log;
    constructor(options, folder) {
        const opts = Object.assign({}, EMPTY_INPUT_DEFAULTS, options);
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
        this.elements.container = create('div', {
            classes: ['gooey-input-text-container'],
            parent: this.elements.content,
        });
        this._evm.add(this.state.subscribe(() => {
            this.refresh();
        }));
    }
    addText(text) {
        const input = textController(this, {
            value: text,
            binding: {
                target: this.elements.controllers,
                key: 'text',
            },
        });
        this._evm.listen(input, 'input', this.set);
    }
    enable() {
        this.disabled = false;
        this.elements.container.classList.remove('disabled');
        return this;
    }
    disable() {
        this.disabled = true;
        this.elements.container.classList.add('disabled');
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
        this.emit('change', this.state.value);
        return this;
    };
    refresh = () => {
        const v = this.state.value;
        this.elements.container.innerHTML = v;
        super.refresh(v);
        return this;
    };
    dispose() {
        super.dispose();
    }
}
