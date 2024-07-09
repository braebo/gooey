import type { ElementMap, InputOptions } from './Input';
import type { State } from '../shared/state';
import type { Folder } from '../Folder';
import { Input } from './Input';
export type TextInputOptions = InputOptions<string> & {
    readonly __type?: 'TextInputOptions';
    /**
     * The maximum number of characters that can be entered.
     * @default 50
     */
    maxLength?: number;
};
export declare const TEXT_INPUT_DEFAULTS: {
    readonly __type: "TextInputOptions";
    readonly value: "foo";
    readonly maxLength: 50;
};
export interface TextControllerElements extends ElementMap {
    container: HTMLElement;
    input: HTMLInputElement;
}
export declare class InputText extends Input<string, TextInputOptions, TextControllerElements> {
    #private;
    readonly __type: "InputText";
    readonly initialValue: string;
    readonly state: State<string>;
    constructor(options: Partial<TextInputOptions>, folder: Folder);
    enable(): this;
    disable(): this;
    set: (v?: string | Event) => this | undefined;
    refresh: () => this;
    dispose(): void;
}
