import { fromLabeledOption, Select, toLabeledOption, isLabeledOption } from '../controllers/Select.js';
import { fromState, state, isState } from '../shared/state.js';
import { stringify } from '../shared/stringify.js';
import { Logger } from '../shared/logger.js';
import { create } from '../shared/create.js';
import { toFn } from '../shared/toFn.js';
import { Input } from './Input.js';

const SELECT_INPUT_DEFAULTS = {
    __type: 'SelectInputOptions',
    options: [],
};
class InputSelect extends Input {
    __type = 'InputSelect';
    initialValue;
    state;
    #options;
    set options(v) {
        this._log.fn('set options').debug(v);
        v ??= [];
        this.#options = toFn(v);
        this.select.clear();
        for (const option of fromState(this.#options())) {
            this.select.add(option);
        }
    }
    get options() {
        return this.resolveOptions(this.#options());
    }
    /**
     * The select controller instance.
     */
    select;
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
        const opts = Object.assign({}, SELECT_INPUT_DEFAULTS, options, {
            __type: 'SelectInputOptions',
        });
        super(opts, folder);
        this._evm.registerEvents(['preview', 'open', 'close', 'cancel']);
        this._log = new Logger(`InputSelect ${opts.title}`, { fg: 'slategrey' });
        this._log.fn('constructor').debug({ opts, this: this });
        opts.value ??= opts.binding?.initial ?? fromState(this.targetValue);
        this.initialValue = this.resolveInitialValue(opts);
        this.labeledSelection = {
            value: fromLabeledOption(this.initialValue),
            label: this.resolveInitialLabel(this.initialValue, opts),
        };
        this.#options = toFn(this.opts.options ?? []);
        this.state = state(this.initialValue);
        const container = create('div', {
            classes: ['gooey-input-select-container'],
            parent: this.elements.content,
        });
        this.select = new Select({
            // @ts-expect-error - ¯\_(ツ)_/¯
            input: this,
            container,
            options: this.options,
            selected: this.labeledSelection,
            title: this.title,
        });
        this.elements.controllers = {
            container,
            select: this.select.elements,
        };
        this.disabled = opts.disabled ?? false;
        this._evm.add(this.state.subscribe(v => {
            if (!this.select.bubble)
                return;
            if (this.targetObject) {
                if (isState(this.targetValue)) {
                    this._log
                        .fn('updating binding')
                        .debug({ from: this.targetValue.value, to: v.value });
                    this.targetValue.set(v.value);
                }
                else {
                    this.targetValue = v.value;
                }
            }
            if (this.#stopPropagation) {
                this.#stopPropagation = false;
                this._log
                    .fn('state.subscribe')
                    .debug('Stopped propagation.  Subscribers will not be notified.');
                return;
            }
            this.set(v);
        }));
        if (options.onChange) {
            this._evm.on('change', v => {
                this._log.fn('calling options onChange').debug(v);
                options.onChange?.(toLabeledOption(v));
            });
        }
        // Bind our state to the select controller.
        this.select.on('change', v => {
            this._log.fn('select.onChange').debug(v);
            if (this.#stopPropagation)
                return;
            // Make sure the select controller doesn't react to its own changes.
            this.#stopPropagation = true;
            this.set(v);
        });
        // todo - bind to options if it's observable ?
        // if (isState(options.options)) {
        // 	this.evm.add(
        // 		options.options.subscribe(v => {
        // 			if (isState(v)) {
        // 				this.options = v.value as T[]
        // 			}
        // 		}),
        // 	)
        // }
        this.listen(this.select.element, 'preview', () => {
            this.emit('preview');
        });
        this.listen(this.select.element, 'open', () => {
            this.emit('open');
        });
        this.listen(this.select.element, 'close', () => {
            this.emit('close');
        });
        this.listen(this.select.element, 'cancel', () => {
            this.emit('cancel');
        });
        // Override the default dirty check to use an option's `label` for equality checks.
        this._dirty = () => this.value.label !== this.initialValue.label;
        this._log.fn('constructor').debug({ this: this });
    }
    resolveOptions(providedOptions) {
        function isLabeledOptionsArray(v) {
            return isLabeledOption(v[0]);
        }
        let selectOptions = toFn(fromState(providedOptions))();
        if (!isLabeledOptionsArray(selectOptions)) {
            if (!Array.isArray(selectOptions)) {
                throw new Error(`gooey: Invalid options array: "${selectOptions}"`);
            }
            if (selectOptions.every(o => typeof o === 'string')) {
                return selectOptions.map(o => ({
                    label: o,
                    value: o,
                }));
            }
            if (!this.opts.labelKey) {
                throw new Error('Recieved unlabeled options with no `labelKey` specified.  Please label your options or provide the `labelKey` to use as a label.');
            }
            return selectOptions.map(o => ({
                label: o[this.opts.labelKey],
                value: o,
            }));
        }
        return selectOptions;
    }
    resolveInitialValue(opts) {
        const value = opts.binding ? opts.binding.target[opts.binding.key] : opts.value;
        const v = fromState(value);
        if (!isLabeledOption(v)) {
            if (typeof v === 'string') {
                return {
                    label: v,
                    value: v,
                };
            }
            // todo - Double check that this is working as expected.
            if (Array.isArray(v)) {
                if (v.every(s => typeof s === 'string')) {
                    return {
                        label: v[0],
                        value: v[0],
                    };
                }
            }
            if (!opts.labelKey) {
                console.error('Error:', { v, value, opts });
                throw new Error('Cannot resolve initial value.  Please provide a `labelKey` or use labeled options.');
            }
            return {
                label: v[opts.labelKey],
                value: v,
            };
        }
        return v;
    }
    resolveInitialLabel(initialValue, opts) {
        const v = isState(initialValue) ? initialValue.value : initialValue;
        this._log.fn('resolveInitialLabel').debug({ v, initialValue, opts });
        if (isLabeledOption(v)) {
            return v.label;
        }
        if (opts.labelKey) {
            return initialValue[opts.labelKey];
        }
        return stringify(v);
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
        if (isLabeledOption(v))
            v = fromLabeledOption(v);
        this._log.fn('set targetValue').debug(v);
        if (typeof v === 'undefined') {
            console.error('Cannot set target value to undefined');
            console.error('this', this);
            throw new Error('Cannot set target value to undefined');
        }
        const to = this.targetObject;
        const tk = this.targetKey;
        if (to && tk) {
            if (isState(to[tk])) {
                to[tk].set(v);
            }
            else {
                to[tk] = v;
            }
        }
    }
    /**
     * Selects the given {@link LabeledOption} and updates the ui.
     */
    set(value) {
        this._log.fn('set').debug(value);
        this.#stopPropagation = true;
        this.select.select(value, false);
        this.state.set(value);
        this.emit('change', value);
        return this;
    }
    enable() {
        this._log.fn('enable').debug();
        this.disabled = false;
        this.select.enable();
        return this;
    }
    disable() {
        this._log.fn('disable').debug();
        this.disabled = true;
        this.select.disable();
        return this;
    }
    refresh = () => {
        const v = this.state.value;
        this._log.fn('refresh').debug({ v, this: this });
        if (!this.labeledSelection) {
            throw new Error('Failed to find labeled selection.');
        }
        const newOptions = this.options.filter(o => !this.select.options.some(oo => oo.label === o.label));
        for (const option of newOptions) {
            this.select.add(option);
        }
        this.select.select(this.labeledSelection, false);
        super.refresh();
        return this;
    };
    dispose() {
        super.dispose();
    }
}

export { InputSelect, SELECT_INPUT_DEFAULTS };
//# sourceMappingURL=InputSelect.js.map
