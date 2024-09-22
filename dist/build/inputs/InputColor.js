import { ColorComponents } from '../controllers/color/ColorComponents.js';
import { ColorPicker } from '../controllers/color/ColorPicker.js';
import { Color, isColor } from '../shared/color/color.js';
import { CopyButton } from '../shared/CopyButton.js';
import { create } from '../shared/create.js';
import { Logger } from '../shared/logger.js';
import { state } from '../shared/state.js';
import { Input } from './Input.js';

//⌟
const COLOR_INPUT_DEFAULTS = {
    __type: 'ColorInputOptions',
    value: '#FF0000FF',
    mode: 'hex',
    expanded: false,
};
class InputColor extends Input {
    __type = 'InputColor';
    initialValue;
    state;
    /**
     * The color picker instance.
     */
    picker;
    /**
     * RGBA/HSLA/HSVA number component inputs.
     */
    components;
    /**
     * When `true`, the color picker is visible.
     */
    expanded;
    _mode;
    get mode() {
        return this._mode;
    }
    set mode(v) {
        this._mode = v;
        this.components.mode = v;
    }
    _log;
    constructor(options, folder) {
        const opts = Object.assign({}, COLOR_INPUT_DEFAULTS, options, {
            __type: 'ColorInputOptions',
        });
        super(opts, folder);
        this.expanded = opts.expanded;
        this._mode = opts.mode;
        this._log = new Logger(`InputColor ${opts.title}`, { fg: 'cyan' });
        this._log.fn('constructor').debug({ opts, this: this }).groupEnd();
        //? Initialize state.
        if (opts.binding) {
            this.initialValue = new Color(opts.binding.target[opts.binding.key]);
            this.state = state(this.initialValue.clone());
            this._evm.add(this.state.subscribe(v => {
                opts.binding.target[opts.binding.key] = v;
            }));
        }
        else {
            this.initialValue = new Color(opts.value);
            this.state = state(this.initialValue.clone());
        }
        //? Elements.
        const container = create('div', {
            classes: ['gooey-input-color-container'],
            parent: this.elements.content,
        });
        this.elements.controllers.container = container;
        //- Current Color
        this.elements.controllers.currentColor = this._createCurrentColor(container);
        //- Body
        const body = create('div', {
            classes: ['gooey-input-color-body'],
            parent: container,
        });
        //- Color Picker
        this.picker = new ColorPicker(this, { container: body });
        //- Components
        this.components = new ColorComponents(this, { container: body });
        this.elements.controllers.body = {
            container: body,
            picker: this.picker.elements,
            components: this.components.elements,
        };
        this._dirty = () => this.state.value.hex !== this.initialValue.hex;
        setTimeout(() => {
            this.expanded ? this.open() : this.close(0);
        }, 10);
        this.emit('change');
        this.refresh();
        this.picker.on('pointerdown', this._lock);
        this.picker.on('pointerup', this._unlock);
    }
    set(v) {
        if (isColor(v)) {
            this.commit({
                to: v.rgba,
                from: this.state.value.rgba,
                setter: v => {
                    this.state.value.set(v);
                    this.state.refresh();
                    this.refresh();
                },
            });
            this.state.set(new Color(v.rgba));
        }
        else {
            const newColor = new Color(v);
            this.commit({
                to: newColor.rgba,
                from: this.state.value.rgba,
                setter: v => {
                    this.state.value.set(v);
                    this.state.refresh();
                    this.refresh();
                },
            });
            this.state.set(newColor);
        }
        const newValue = this.state.value;
        this._log.fn('set').debug({ v, newValue, this: this });
        this.emit('change', newValue);
        this.refresh(newValue);
        return this;
    }
    refresh = (v = this.state.value) => {
        this._log.fn('refresh').debug({ v, this: this });
        this.elements.controllers.currentColor.display.style.backgroundColor = v.hex;
        this.picker.refresh();
        this.components.refresh();
        super.refresh(v);
        return this;
    };
    _createCurrentColor(parent) {
        const container = create('div', {
            classes: ['gooey-input-color-current-color-container'],
            parent,
        });
        const displayBackground = create('div', {
            classes: ['gooey-input-color-current-color-background'],
            parent: container,
        });
        const display = create('div', {
            classes: ['gooey-input-color-current-color-display'],
            parent: displayBackground,
        });
        this._evm.listen(display, 'click', this.togglePicker);
        const copyButton = new CopyButton(container, () => {
            return this.state.value.hex;
        }, 'Copy Hex', this);
        return {
            container,
            displayBackground,
            display,
            copyButton,
        };
    }
    //· Open/Close ···············································································¬
    static #pickerHeight = '75px';
    get _pickerContainer() {
        return this.picker.elements.container;
    }
    togglePicker = async () => {
        if (!this.expanded) {
            await this.open();
        }
        else {
            await this.close();
        }
    };
    open = async () => {
        this.expanded = true;
        this.elements.container.dataset['search_height'] = '100px';
        const pickerAnim = this._pickerContainer?.animate([
            { height: '0px', clipPath: 'inset(0 0 100% 0)' },
            { height: InputColor.#pickerHeight, clipPath: 'inset(0 0 -50% 0)' },
        ], { duration: 200, easing: 'cubic-bezier(.08,.38,0,0.92)', fill: 'forwards' });
        const containerAnim = this.elements.container.animate({ maxHeight: '100px', height: '100px' }, { duration: 200, easing: 'cubic-bezier(.08,.38,0,0.92)', fill: 'forwards' });
        this._pickerContainer?.style.setProperty('overflow', 'visible');
        this._pickerContainer?.classList.add('expanded');
        await Promise.all([pickerAnim?.finished, containerAnim?.finished]);
        if (this._pickerContainer && document.contains(this._pickerContainer)) {
            try {
                pickerAnim?.commitStyles();
            }
            catch (e) { }
        }
        if (this.elements.container && document.contains(this.elements.container)) {
            try {
                containerAnim?.commitStyles();
            }
            catch (e) { }
        }
        this.folder.graphics?.connector?.update();
    };
    close = async (duration = 300) => {
        this.expanded = false;
        delete this.elements.container.dataset['search_height'];
        const pickerAnim = this._pickerContainer?.animate([
            { height: InputColor.#pickerHeight, clipPath: 'inset(0 0 -100% 0)' },
            { height: '0px', clipPath: 'inset(0 0 100% 0)' },
        ], { duration: duration, easing: 'cubic-bezier(.13,.09,.02,.96)', fill: 'forwards' });
        const containerAnim = this.elements.container.animate({
            minHeight: 'var(--gooey-input_height)',
            maxHeight: 'var(--gooey-input_height)',
            height: 'var(--gooey-input_height)',
        }, { duration: duration, easing: 'cubic-bezier(.13,.09,.02,.96)', fill: 'forwards' });
        this._pickerContainer?.style.setProperty('overflow', 'hidden');
        this._pickerContainer?.classList.remove('expanded');
        await Promise.all([pickerAnim?.finished, containerAnim?.finished]);
        if (this._pickerContainer && document.contains(this._pickerContainer)) {
            try {
                pickerAnim?.commitStyles();
            }
            catch (e) { }
        }
        if (this.elements.container && document.contains(this.elements.container)) {
            try {
                containerAnim?.commitStyles();
            }
            catch (e) { }
        }
    };
    //⌟
    //· Super Overrides ··········································································¬
    /**
     * Prevents the range slider from registering undo history commits while dragging on the
     * canvas, storing the initial value on pointerdown for the eventual commit in {@link unlock}.
     */
    _lock = () => {
        // console.log('lock', 'from:' + chalk.hex(this.state.value.hex)(this.state.value.rgbaString))
        this.lock(this.state.value.rgba);
    };
    /**
     * Saves the commit stored in #lock on pointerup.
     */
    _unlock = () => {
        this.unlock({
            target: this,
            to: this.state.value.rgba,
            setter: v => {
                this.state.value.set(v);
                this.state.refresh();
                this.emit('change', this.state.value);
                this.refresh();
            },
        });
    };
    enable() {
        this.picker.enable();
        super.enable();
        return this;
    }
    disable() {
        this.picker.disable();
        super.disable();
        return this;
    }
    save() {
        return super.save({ value: this.state.value.hex });
    }
    load(json) {
        const data = typeof json === 'string' ? JSON.parse(json) : json;
        this.id = data.presetId;
        this.disabled = data.disabled;
        this.hidden = data.hidden;
        this.initialValue = new Color(data.value);
        this.set(this.initialValue.clone());
    }
    //⌟
    dispose() {
        this._log.fn('dispose').debug({ this: this });
        this.picker.dispose();
        super.dispose();
    }
}

export { COLOR_INPUT_DEFAULTS, InputColor };
//# sourceMappingURL=InputColor.js.map
