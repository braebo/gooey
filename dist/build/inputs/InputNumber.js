import { NumberButtonsController } from '../controllers/NumberButtonsController.js';
import { NumberController } from '../controllers/NumberController.js';
import { rangeController } from '../controllers/number.js';
import { Logger } from '../shared/logger.js';
import { create } from '../shared/create.js';
import { Input } from './Input.js';

const NUMBER_INPUT_DEFAULTS = {
    __type: 'NumberInputOptions',
};
class InputNumber extends Input {
    __type = 'InputNumber';
    _log;
    initialValue;
    state;
    dragEnabled = false; // todo - Move this into the number controller?
    numberController;
    numberButtonsController;
    constructor(options, folder) {
        const opts = Object.assign({}, NUMBER_INPUT_DEFAULTS, options, {
            __type: 'NumberInputOptions',
        });
        // Smart defaults.
        let v = opts.binding?.initial ?? opts.value ?? 1;
        opts.value ??= v;
        let min = 0;
        let max = 1;
        let step = 0.01;
        // If the value is between [0..1], then it's nicer to keep the defaults.
        // Otherwise, we can adjust them dynamically to be more useful.
        if (v < 0 || v > 1) {
            min ??= v <= 0 ? v * 2 : 0;
            max ??= v <= 0 ? v * -2 : v * 2;
            step = v / 100 <= 0.1 ? 0.001 : 0.1;
        }
        opts.min ??= min;
        opts.max ??= max;
        opts.step ??= step;
        super(opts, folder);
        this._log = new Logger(`InputNumber ${opts.title}`, { fg: 'cyan' });
        this._log.fn('constructor').debug({ opts, this: this });
        this.initialValue = this.resolveInitialValue(opts);
        this.state = this.resolveState(opts);
        const container = create('div', {
            classes: ['gooey-input-number-container'],
            parent: this.elements.content,
        });
        this.numberController = new NumberController(this, opts, container);
        this.numberButtonsController = new NumberButtonsController(this, opts, container);
        this.elements.controllers = {
            container,
            input: this.numberController.element,
            buttons: this.numberButtonsController.elements,
            range: rangeController(this, opts, container),
        };
        this._evm.add(this.state.subscribe(this.refresh));
        this._evm.listen(this.elements.controllers.range, 'pointerdown', this.lock);
        this._evm.listen(this.elements.controllers.range, 'pointerup', () => this.unlock());
        this._evm.listen(this.elements.controllers.input, 'input', this.set);
        this._evm.listen(this.elements.controllers.input, 'dragStart', this.lock);
        this._evm.listen(this.elements.controllers.input, 'dragEnd', () => this.unlock());
    }
    set = (v) => {
        this._log.fn('set').debug(v);
        if (typeof v === 'undefined')
            return;
        let newValue = v;
        if (v instanceof Event && v?.target && 'valueAsNumber' in v.target) {
            newValue = v.target.valueAsNumber;
        }
        this.commit({ to: newValue });
        this.state.set(newValue);
        this._emit('change', newValue);
        return this;
    };
    enable() {
        this._log.fn('enable').debug();
        this.elements.controllers.input.disabled = false;
        super.enable();
        return this;
    }
    disable() {
        this._log.fn('disable').debug();
        this.elements.controllers.input.disabled = true;
        super.disable();
        return this;
    }
    refresh = () => {
        const v = this.state.value;
        this._log.fn('refresh').debug(v);
        this.elements.controllers.range.value = String(v);
        this.elements.controllers.input.value = String(v);
        super.refresh(v);
        return this;
    };
    dispose() {
        this._log.fn('dispose').debug();
        super.dispose();
    }
}

export { InputNumber, NUMBER_INPUT_DEFAULTS };
//# sourceMappingURL=InputNumber.js.map
