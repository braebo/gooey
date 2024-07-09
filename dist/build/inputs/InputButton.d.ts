import type { ElementMap, InputEvents, InputOptions } from './Input';
import type { State } from '../shared/state';
import type { Folder } from '../Folder';
import { ButtonController } from '../controllers/ButtonController';
import { Input } from './Input';
export type ButtonClickFunction = (this: InputButton) => void;
export type ButtonInputOptions = InputOptions<ButtonClickFunction> & {
    readonly __type?: 'ButtonInputOptions';
    text: string | (() => string);
    /**
     * The function to call when the button is clicked.
     */
    value?: ButtonClickFunction;
    /**
     * An alias for {@link value} (does the same thing).
     */
    onClick?: ButtonClickFunction;
};
export declare const BUTTON_INPUT_DEFAULTS: ButtonInputOptions;
export interface ButtonControllerElements extends ElementMap {
    container: HTMLElement;
    button: HTMLButtonElement;
}
interface ButtonInputEvents extends InputEvents<InputButton> {
    click: void;
}
export declare class InputButton extends Input<ButtonController, ButtonInputOptions, ButtonControllerElements, ButtonInputEvents> {
    readonly __type: "InputButton";
    readonly initialValue: ButtonController;
    readonly state: State<ButtonController>;
    onClick: ButtonClickFunction;
    button: ButtonController;
    private _log;
    constructor(options: Partial<ButtonInputOptions>, folder: Folder);
    get text(): string | (() => string);
    set text(v: string | (() => string));
    /**
     * Manually calls the {@link onClick} function.
     */
    click(): void;
    enable(): this;
    disable(): this;
    /**
     * Overwrites the
     */
    set: (v: ButtonController | unknown) => void;
    /**
     * Refreshes the button text.
     */
    refresh(): this;
    dispose(): void;
}
export {};
