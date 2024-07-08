import type { InputNumber, NumberInputOptions } from '../inputs/InputNumber';
export declare class NumberButtonsController {
    input: InputNumber;
    opts: NumberInputOptions;
    parent?: HTMLElement | undefined;
    elements: {
        container: HTMLDivElement;
        increment: HTMLDivElement;
        decrement: HTMLDivElement;
    };
    constructor(input: InputNumber, opts: NumberInputOptions, parent?: HTMLElement | undefined);
    rampChange(direction?: number): void;
    rampChangeUp(): void;
    rampChangeDown(): void;
}
