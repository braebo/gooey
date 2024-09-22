import { ButtonController } from '../controllers/ButtonController.js';
import { Logger } from '../shared/logger.js';
import { create } from '../shared/create.js';
import { state } from '../shared/state.js';
import { Input } from './Input.js';

const BUTTON_INPUT_DEFAULTS = {
    __type: 'ButtonInputOptions',
    text: () => 'click me',
};
class InputButton extends Input {
    __type = 'InputButton';
    initialValue = {};
    state = state({});
    onClick = () => { };
    button;
    _log;
    constructor(options, folder) {
        const opts = Object.assign({}, BUTTON_INPUT_DEFAULTS, options, {
            __type: 'ButtonInputOptions',
        });
        opts.resettable ??= false;
        super(opts, folder);
        this._evm.registerEvents(['change', 'refresh', 'click']);
        this._log = new Logger(`InputButton ${opts.title}`, { fg: 'cyan' });
        this._log.fn('constructor').debug({ opts, this: this });
        if (opts.value)
            this.onClick = opts.value;
        else if (opts.onClick)
            this.onClick = opts.onClick;
        else ;
        const container = create('div', {
            classes: ['gooey-input-button-container'],
            parent: this.elements.content,
        });
        this.button = new ButtonController({
            text: opts.text,
            onClick: this.onClick.bind(this),
            parent: container,
        });
        this.elements.controllers = {
            container,
            button: this.button.element,
        };
        this._evm.add(this.state.subscribe(this.refresh.bind(this)));
    }
    get text() {
        return this.button.text;
    }
    set text(v) {
        this.button.text = v;
    }
    /**
     * Manually calls the {@link onClick} function.
     */
    click() {
        this.button.click.call(this, { ...new MouseEvent('click'), target: this.button.element });
    }
    enable() {
        this.button.enable();
        super.enable();
        return this;
    }
    disable() {
        this.button.disable();
        super.disable();
        return this;
    }
    /**
     * Overwrites the button state.
     */
    set = (v) => {
        if (ButtonController.is(v)) {
            this.state.set(v);
        }
    };
    /**
     * Refreshes the button text.
     */
    refresh() {
        this.button.refresh();
        super.refresh();
        return this;
    }
    dispose() {
        this.button.dispose();
        super.dispose();
    }
}

export { BUTTON_INPUT_DEFAULTS, InputButton };
//# sourceMappingURL=InputButton.js.map
