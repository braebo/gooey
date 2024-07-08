import type { ElementMap, InputOptions } from './Input';
import type { State } from '../shared/state';
import type { Folder } from '../Folder';
import { NumberButtonsController } from '../controllers/NumberButtonsController';
import { NumberController } from '../controllers/NumberController';
import { Input } from './Input';
export interface NumberControllerElements extends ElementMap {
    container: HTMLElement;
    buttons: {
        container: HTMLDivElement;
        increment: HTMLDivElement;
        decrement: HTMLDivElement;
    };
    input: HTMLInputElement;
    range: HTMLInputElement;
}
export type NumberInputOptions = {
    readonly __type?: 'NumberInputOptions';
    min?: number;
    max?: number;
    step?: number;
} & InputOptions<number>;
export declare const NUMBER_INPUT_DEFAULTS: NumberInputOptions;
export declare class InputNumber extends Input<number, NumberInputOptions, NumberControllerElements> {
    readonly __type: "InputNumber";
    private _log;
    initialValue: number;
    state: State<number>;
    dragEnabled: boolean;
    numberController: NumberController;
    numberButtonsController: NumberButtonsController;
    constructor(options: Partial<NumberInputOptions>, folder: Folder);
    set: (v?: number | Event) => this | undefined;
    enable(): this;
    disable(): this;
    refresh: () => this;
    dispose(): void;
}
