import { __decorate, __metadata } from './../../external/.pnpm/@rollup_plugin-typescript@11.1.6_rollup@4.22.2_tslib@2.7.0_typescript@5.6.2/external/tslib/tslib.es6.js';
import { parseColorFormat } from '../../shared/color/color.js';
import { NumberController } from '../NumberController.js';
import { Select } from '../Select.js';
import { disableable } from '../../shared/decorators/disableable-class-decorator.js';
import { EventManager } from '../../shared/EventManager.js';
import { entries } from '../../shared/object.js';
import { create } from '../../shared/create.js';
import { Logger } from '../../shared/logger.js';

const COLOR_PICKER_DEFAULTS = {
    disabled: false,
};
let ColorComponents = class ColorComponents {
    input;
    opts;
    element;
    elements;
    select;
    _evm = new EventManager();
    _mode;
    /**
     * Used to prevent inputs from being refreshed externally after they're updated internally.
     */
    _locked = false;
    _log;
    constructor(input, options) {
        this.input = input;
        const opts = { ...COLOR_PICKER_DEFAULTS, ...options };
        this._log = new Logger(`ColorComponents ${input.title}`, { fg: 'wheat' });
        this.opts = opts;
        this._mode = input.mode;
        const parent = opts.container ?? input.elements.controllers.container;
        const componentsContainer = create('div', {
            classes: ['gooey-input-color-components-container'],
            parent: parent,
        });
        this.element = componentsContainer;
        const selectContainer = create('div', {
            classes: ['gooey-input-color-components-select-container'],
            parent: componentsContainer,
        });
        this.select = new Select({
            input: this.input,
            // disabled: this.opts.disabled,
            disabled: this.disabled,
            container: selectContainer,
            options: ['hex', 'hex8', 'rgba', 'rgbaString', 'hsla', 'hslaString'],
        });
        this.select.on('change', v => {
            this.updateMode(v.value);
        });
        const numbersContainer = create('div', {
            classes: ['gooey-input-color-components-numbers-container'],
            parent: componentsContainer,
        });
        const numbers = {
            a: new NumberController(this.input, this.input.opts, numbersContainer).element,
            b: new NumberController(this.input, this.input.opts, numbersContainer).element,
            c: new NumberController(this.input, this.input.opts, numbersContainer).element,
            d: new NumberController(this.input, this.input.opts, numbersContainer).element,
        };
        numbers.a.classList.add('a');
        numbers.b.classList.add('b');
        numbers.c.classList.add('c');
        numbers.d.classList.add('d');
        for (const [k, v] of entries(numbers)) {
            const update = () => {
                this[k] = +v.value;
                this.input.set(this.color);
            };
            if (this.#modeType() === 'text') {
                v.classList.add('visible');
            }
            this._evm.listen(v, 'input', update);
        }
        const text = create('input', {
            classes: [
                'gooey-controller',
                'gooey-controller-text',
                'gooey-input-color-components-text',
            ],
            parent: componentsContainer,
        });
        this._evm.listen(text, 'change', (e) => {
            const target = e.target;
            let format = parseColorFormat(target.value);
            if (!format)
                return;
            // We need to make the first character lowercase to match the format names.
            format = format[0].toLowerCase() + format.slice(1);
            // @ts-expect-error
            this.input.set(target.value);
        });
        if (this.#modeType() === 'text') {
            text.classList.add('visible');
        }
        this.elements = {
            container: componentsContainer,
            title: selectContainer,
            select: this.select.elements,
            numbers,
            text,
        };
        this.mode = this._mode;
        if (typeof options?.disabled !== 'undefined') {
            this.disabled = options.disabled;
        }
    }
    get color() {
        return this.input.state.value;
    }
    get mode() {
        return this._mode;
    }
    set mode(v) {
        this._log.fn(`set mode`, v).debug();
        this._mode = v;
        this.select.selected = v;
    }
    updateMode = (v = this.mode) => {
        this._log.fn(`updateMode`, v).debug();
        this._mode = v;
        if (this.#modeType() === 'text') {
            this.elements.text.classList.add('visible');
            for (const [, v] of entries(this.elements.numbers)) {
                v.classList.remove('visible');
            }
            this.#refreshText();
        }
        else {
            this.elements.text.classList.remove('visible');
            for (const [, v] of entries(this.elements.numbers)) {
                v.classList.add('visible');
            }
            if (this.mode === 'rgba') {
                this.#setProps(this.elements.numbers.a, { min: 0, max: 255, step: 1 });
                this.#setProps(this.elements.numbers.b, { min: 0, max: 255, step: 1 });
                this.#setProps(this.elements.numbers.c, { min: 0, max: 255, step: 1 });
                this.#setProps(this.elements.numbers.d, { min: 0, max: 1, step: 0.01 });
            }
            if (['hsla', 'hsva'].includes(this.mode)) {
                this.#setProps(this.elements.numbers.a, { min: 0, max: 360, step: 1 });
                this.#setProps(this.elements.numbers.b, { min: 0, max: 100, step: 1 });
                this.#setProps(this.elements.numbers.c, { min: 0, max: 100, step: 1 });
                this.#setProps(this.elements.numbers.d, { min: 0, max: 1, step: 0.01 });
            }
            this.elements.select.selected.innerHTML = [...v]
                .map((c, i) => `<span class="${['a', 'b', 'c', 'd'][i]}">${c}</span>`)
                .join('');
        }
        this.refresh();
    };
    #setProps = (el, props) => {
        this._log.fn(`#setProps`, el, props).debug();
        for (const [k, v] of entries(props)) {
            el[k] = String(v);
        }
    };
    get a() {
        return this.mode === 'rgba' ? this.color.rgba.r : this.color.hsla.h;
    }
    set a(v) {
        if (this.mode === 'rgba') {
            this.color.red = v;
        }
        else {
            this.color.hue = v;
        }
        this._locked = true;
        this.input.refresh();
    }
    get b() {
        return this.mode === 'rgba' ? this.color.rgba.g : this.color.hsla.s;
    }
    set b(v) {
        if (this.mode === 'rgba') {
            this.color.green = v;
        }
        else {
            this.color.saturation = v;
        }
        this._locked = true;
        this.input.refresh();
    }
    get c() {
        switch (this.mode) {
            case 'rgba':
                return this.color.blue;
            case 'hsla':
                return this.color.lightness;
            default:
                return this.color.value;
        }
    }
    set c(v) {
        if (this.mode === 'rgba') {
            this.color.blue = v;
        }
        else if (this.mode === 'hsla') {
            this.color.lightness = v;
        }
        this._locked = true;
        this.input.refresh();
    }
    get d() {
        return this.color.alpha;
    }
    set d(v) {
        this.color.alpha = v;
        this._locked = true;
        this.input.refresh();
    }
    #modeType() {
        if (['rgba', 'hsla'].includes(this.mode)) {
            return 'numbers';
        }
        return 'text';
    }
    #refreshText = () => {
        this.elements.text.value = // @ts-expect-error
            this.color[this.mode.startsWith('hex') ? this.mode + 'String' : this.mode];
        this.select.elements.selected.innerText = this.select.elements.selected.innerHTML.replace('String', '*');
    };
    #lastColor;
    #lastMode;
    /**
     * Updates the UI to reflect the current state of the source color.
     */
    refresh = () => {
        this._log.fn('refresh').debug();
        const color = this.input.state.value.hex8String;
        const mode = this.mode;
        if (this.#lastColor === color && mode === this.#lastMode) {
            return this;
        }
        this.#lastColor = color;
        this.#lastMode = mode;
        if (this._locked) {
            this._locked = false;
            return this;
        }
        if (this.#modeType() === 'text') {
            this.#refreshText();
        }
        else {
            this.elements.numbers.a.value = String(this.a);
            this.elements.numbers.b.value = String(this.b);
            this.elements.numbers.c.value = String(this.c);
            this.elements.numbers.d.value = String(this.d);
        }
        return this;
    };
    disable() {
        if (!this.disabled)
            this.disabled = true;
        this.select.disable();
        this.elements.text.disabled = true;
        for (const [, v] of entries(this.elements.numbers)) {
            v.disabled = true;
        }
        return this;
    }
    enable() {
        if (this.disabled)
            this.disabled = false;
        this.select.enable();
        this.elements.text.disabled = false;
        for (const [, v] of entries(this.elements.numbers)) {
            v.disabled = false;
        }
        return this;
    }
    dispose() {
        this.elements.title.remove();
        this.elements.numbers.a.remove();
        this.elements.numbers.b.remove();
        this.elements.numbers.c.remove();
        this.elements.container.remove();
        this.elements.text.remove();
        this.select.dispose();
        this._evm.dispose();
    }
};
ColorComponents = __decorate([
    disableable,
    __metadata("design:paramtypes", [Function, Object])
], ColorComponents);

export { COLOR_PICKER_DEFAULTS, ColorComponents };
//# sourceMappingURL=ColorComponents.js.map
