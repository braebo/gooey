import type { InputOptions } from './Input';
import type { State } from '../shared/state';
import type { Folder } from '../Folder';
import { Input } from './Input';
export type EmptyInputOptions = InputOptions<string> & {
    readonly __type?: 'EmptyInputOptions';
    readonly type: 'empty';
};
export interface EmptyControllerElements {
    container: HTMLElement;
}
export declare const EMPTY_INPUT_DEFAULTS: {
    readonly __type: "EmptyInputOptions";
    readonly type: "empty";
    readonly value: "";
};
export declare class InputEmpty extends Input {
    #private;
    readonly __type: "InputEmpty";
    readonly type: "empty";
    readonly initialValue: string;
    readonly state: State<string>;
    constructor(options: Partial<EmptyInputOptions>, folder: Folder);
    addText(text: string): void;
    enable(): this;
    disable(): this;
    set: (v?: string | Event) => this | undefined;
    refresh: () => this;
    dispose(): void;
}
