import type { ElementMap, InputOptions } from './Input';
import type { State } from '../shared/state';
import type { Folder } from '../Folder';
import { Input } from './Input';
export type TextAreaInputOptions = {
    readonly __type?: 'TextAreaInputOptions';
    /**
     * The maximum number of characters that can be entered.
     * @default 50
     */
    maxLength?: number;
} & InputOptions<string>;
export declare const TEXTAREA_INPUT_DEFAULTS: TextAreaInputOptions;
export interface TextAreaControllerElements extends ElementMap {
    container: HTMLElement;
    input: HTMLInputElement;
}
export declare class InputTextArea extends Input<string, TextAreaInputOptions, TextAreaControllerElements> {
    #private;
    readonly __type: "InputTextArea";
    readonly initialValue: string;
    readonly state: State<string>;
    constructor(options: Partial<TextAreaInputOptions>, folder: Folder);
    enable(): this;
    disable(): this;
    set: (v?: string | Event) => this | undefined;
    refresh: () => this;
    dispose(): void;
}
