import { ButtonController } from '../controllers/ButtonController';
import { Logger } from '../shared/logger';
import { create } from '../shared/create';
import { state } from '../shared/state';
import { Input } from './Input';
import { DEV } from 'esm-env';
export const BUTTON_INPUT_DEFAULTS = {
    __type: 'ButtonInputOptions',
    text: () => 'click me',
};
export class InputButton extends Input {
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
        super(opts, folder);
        this._evm.registerEvents(['change', 'refresh', 'click']);
        this._log = new Logger(`InputButton ${opts.title}`, { fg: 'cyan' });
        this._log.fn('constructor').debug({ opts, this: this });
        if (opts.value)
            this.onClick = opts.value;
        else if (opts.onClick)
            this.onClick = opts.onClick;
        else {
            if (DEV) {
                console.error(`${this.title} created with no onClick function. Use the 'value' or 'onClick' property to assign one.`);
            }
        }
        const container = create('div', {
            classes: ['fracgui-input-button-container'],
            parent: this.elements.content,
        });
        this.button = new ButtonController({
            text: opts.text,
            onClick: opts.onClick,
            parent: container,
        });
        this.elements.controllers = {
            container,
            button: this.button.element,
        };
        this._evm.listen(this.elements.controllers.button, 'click', this.click.bind(this));
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
        this.button.click({ ...new MouseEvent('click'), target: this.button.element });
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
     * Overwrites the
     */
    set = (v) => {
        if (ButtonController.is(v)) {
            v; //=>
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