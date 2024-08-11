import { create } from '../shared/create.js';
import { EventManager } from '../shared/EventManager.js';
import { Logger } from '../shared/logger.js';
import { nanoid } from '../shared/nanoid.js';
import { toFn } from '../shared/toFn.js';

const BUTTON_INPUT_DEFAULTS = {
    __type: 'ButtonControllerOptions',
    text: () => 'click me',
    onClick: () => void 0,
    id: nanoid(8),
    disabled: false,
    style: undefined,
    tooltip: undefined,
    active: false,
    element: undefined,
    parent: undefined,
};
class ButtonController {
    __type = 'ButtonController';
    static is(v) {
        return v?.__type === 'ButtonController' && v instanceof ButtonController;
    }
    _text;
    _active = () => false;
    _disabled = () => false;
    element;
    parent;
    _evm = new EventManager(['change', 'refresh', 'click']);
    on = this._evm.on.bind(this._evm);
    _log = new Logger('ButtonController', { fg: 'coral' });
    constructor(options) {
        const opts = Object.assign({}, BUTTON_INPUT_DEFAULTS, options);
        this._log.fn('constructor').debug({ opts, this: this });
        this.element = opts.element
            ? opts.element
            : create('button', {
                id: opts.id ?? nanoid(8),
                classes: ['gooey-controller', 'gooey-controller-button'],
                parent: opts.parent,
            });
        this.text = opts.text;
        this.active = opts.active;
        if (typeof opts.disabled !== 'undefined')
            this.disabled = opts.disabled;
        this._evm.listen(this.element, 'click', this.click);
        if (opts.onClick) {
            this._evm.on('click', opts.onClick);
        }
    }
    get id() {
        return this.element.id;
    }
    get text() {
        return this._text();
    }
    set text(value) {
        this._text = toFn(value);
        this.element.innerHTML = this._text();
    }
    get active() {
        return this._active();
    }
    set active(value) {
        if (typeof value === 'undefined')
            return;
        this._active = toFn(value);
        // this.element.classList.toggle('active', this._active())
    }
    /**
     * Set this to `true` to disable the button.  If a function is assigned, it will be called
     * whenever the button is refreshed.
     */
    get disabled() {
        return this._disabled();
    }
    set disabled(value) {
        if (typeof value === 'undefined')
            return;
        this._disabled = toFn(value);
        this._disabled() ? this.disable() : this.enable();
    }
    /**
     * Update the button with new options.
     */
    set(options) {
        Object.assign(this, options);
        this._evm.emit('change', this);
        this.refresh();
    }
    click = (event) => {
        this._log.fn('click').debug({ this: this });
        this._evm.emit('click', { event, button: this });
        this.refresh();
    };
    enable = () => {
        if (this.disabled)
            return (this.disabled = false);
        this.element.classList.remove('disabled');
        this.element.removeAttribute('disabled');
        return this;
    };
    disable = () => {
        if (!this.disabled)
            return (this.disabled = true);
        this.element.classList.add('disabled');
        this.element.setAttribute('disabled', 'true');
        return this;
    };
    refresh = () => {
        this.element.toggleAttribute('disabled', this.disabled);
        this.element.classList.toggle('disabled', this.disabled);
        this.element.innerHTML = this.text;
        // this.element.classList.toggle('active', this.active)
        this._evm.emit('refresh');
        return this;
    };
    toJSON() {
        return {
            __type: this.__type,
            id: this.id,
            text: this.text,
            active: this.active,
            disabled: this.disabled,
        };
    }
    dispose() {
        this.element.remove();
        this._evm.dispose();
    }
}

export { BUTTON_INPUT_DEFAULTS, ButtonController };
//# sourceMappingURL=ButtonController.js.map
