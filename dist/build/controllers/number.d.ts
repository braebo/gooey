import type { InputNumber } from '../inputs/InputNumber';
import type { ControllerFactory } from './types';
export declare const rangeController: ControllerFactory<HTMLInputElement>;
export declare const numberButtonsController: ControllerFactory<{
    container: HTMLDivElement;
    increment: HTMLDivElement;
    decrement: HTMLDivElement;
}, InputNumber>;
