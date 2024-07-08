import { Logger } from '../shared/logger';
import { create } from '../shared/create';
import { state } from '../shared/state';
import { Input } from './Input';
export const SWITCH_INPUT_DEFAULTS = {
    __type: 'SwitchInputOptions',
    value: true,
    labels: {
        true: {
            state: 'on',
            verb: 'Enable',
        },
        false: {
            state: 'off',
            verb: 'Disable',
        },
    },
};
/**
 * A switch {@link Input} for booleans.
 */
export class InputSwitch extends Input {
    __type = 'InputSwitch';
    state;
    initialValue;
    #log;
    constructor(options, folder) {
        const opts = Object.assign({}, SWITCH_INPUT_DEFAULTS, options);
        super(opts, folder);
        this.#log = new Logger(`InputSwitch ${opts.title}`, { fg: 'cyan' });
        this.#log.fn('constructor').debug({ opts, this: this });
        if (opts.binding) {
            // Bind the state to the target object.
            this.initialValue = opts.binding.target[opts.binding.key];
            this.state = state(!!this.initialValue);
            this._evm.add(this.state.subscribe(v => {
                opts.binding.target[opts.binding.key] = v;
            }));
        }
        else {
            // Create a new observable state.
            this.initialValue = opts.value;
            this.state = state(!!opts.value);
        }
        //- Container
        const container = create('div', {
            classes: ['fracgui-input-switch-container'],
            parent: this.elements.content,
        });
        //- Switch Button
        const input = create('button', {
            classes: ['fracgui-controller', 'fracgui-controller-switch'],
            parent: container,
            tooltip: {
                text: () => {
                    return ((this.state.value ? opts.labels?.false.verb : opts.labels?.true.verb) || '');
                },
                anchor: '.fracgui-controller-switch-thumb',
                delay: 750,
            },
        });
        const thumb = create('div', {
            classes: ['fracgui-controller-switch-thumb'],
            parent: input,
        });
        //- State Text
        const stateText = create('div', {
            classes: ['fracgui-controller-switch-state-text'],
            parent: container,
            innerText: this.state.value ? opts.labels?.true.state : opts.labels?.false.state,
            style: {
                opacity: '0.75',
            },
        });
        this.elements.controllers = {
            container,
            input,
            thumb,
            stateText,
        };
        this._evm.listen(this.elements.controllers.input, 'click', () => this.set());
        this._evm.add(this.state.subscribe(this.refresh.bind(this)));
    }
    set(v = !this.state.value) {
        this.#log.fn('set').debug({ v, this: this });
        if (typeof v === 'boolean') {
            this.undoManager?.commit({
                // @ts-expect-error - ¯\_(ツ)_/¯
                target: this,
                from: this.state.value,
                to: v,
            });
            this.state.set(v);
        }
        else {
            throw new Error(`InputBoolean.set() received an invalid value: ${JSON.stringify(v)} (${typeof v})`);
        }
        this._emit('change', v);
        return this;
    }
    refresh(v = this.state.value) {
        this.#log.fn('refresh').debug({ v, this: this });
        if (this.disabled)
            return this;
        this.elements.controllers.input.classList.toggle('active', v);
        this.elements.controllers.input?.tooltip?.refresh();
        this.elements.controllers.stateText.innerText =
            (this.state.value ? this.opts.labels?.true.state : this.opts.labels?.false.state) ?? '';
        this._emit('refresh', v);
        return this;
    }
    enable() {
        this.elements.controllers.input.disabled = false;
        super.enable();
        return this;
    }
    disable() {
        this.elements.controllers.input.disabled = true;
        super.disable();
        return this;
    }
    dispose() {
        super.dispose();
    }
}