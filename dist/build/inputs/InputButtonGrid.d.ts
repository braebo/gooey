import type { CreateOptions } from '../shared/create';
import type { ElementMap, InputOptions } from './Input';
import type { Folder } from '../Folder';
import type { ButtonControllerEvents, ButtonControllerOptions } from '../controllers/ButtonController';
import { ButtonController } from '../controllers/ButtonController';
import { Input } from './Input';
/**
 * A 2D array of {@link ButtonControllerOptions} objects, representing a grid of buttons. The inner
 * arrays represent rows, and the outer array represents columns.
 * @example
 * ```ts
 * [
 *   // First row columns
 *   [
 *     { text: 'top-left', onClick: () => {} },
 *     { text: 'top-right', onClick: () => {} }
 *   ],
 *   // Second row columns
 *   [
 *     { text: 'bottom-left', onClick: () => {} },
 *     { text: 'bottom-right', onClick: () => {} }
 *   ]
 * ]
 * ```
 */
export type ButtonGridArrays = ButtonControllerOptions[][];
/**
 * A fully processed {@link ButtonGridArrays} entry with the generated {@link ButtonController}s.
 * Stored in the input's {@link InputButtonGrid.buttonGrid|`buttonGrid`} property.
 */
export type ButtonGrid = ButtonController[][];
export type ButtonGridInputOptions = {
    readonly __type?: 'ButtonGridInputOptions';
    value: ButtonGridArrays;
    /**
     * Optional css style overrides in {@link JavascriptStyleProperty} (camelCase) format.
     */
    style?: CreateOptions['style'];
    /**
     * If `true`, the `active` class will be added to the last clicked button, and removed from
     * all other buttons.  This is useful for indicating the currently selected button in a grid.
     * @default true
     */
    activeOnClick?: boolean;
    disabled?: boolean | (() => boolean);
} & InputOptions<ButtonGridArrays>;
export declare const BUTTONGRID_INPUT_DEFAULTS: {
    readonly __type: "ButtonGridInputOptions";
    readonly value: [[{
        readonly text: "";
        readonly onClick: () => void;
    }]];
    readonly style: {
        readonly gap: "0.5em";
    };
    readonly activeOnClick: false;
    readonly resettable: false;
};
export interface ButtonGridControllerElements extends ElementMap {
    container: HTMLElement;
    buttonGrid: HTMLButtonElement[];
}
export type ButtonId = string;
export declare class InputButtonGrid extends Input<ButtonController, ButtonGridInputOptions, ButtonGridControllerElements, ButtonControllerEvents> {
    readonly __type: "InputButtonGrid";
    readonly initialValue: ButtonGridArrays;
    readonly state: import("../shared/state").PrimitiveState<ButtonController>;
    buttons: Map<ButtonId, ButtonController>;
    buttonGrid: ButtonGrid;
    private _log;
    constructor(options: Partial<ButtonGridInputOptions>, folder: Folder);
    onClick(callback: (payload: ButtonController) => void): void;
    /**
     * Converts a {@link ButtonGridArrays} into a a grid of {@link HTMLButtonElement}
     * elements, and
     *
     * - appends them to the {@link InputButtonGrid.elements.controllers.container}
     */
    toGrid(grid: ButtonGridArrays): ButtonGrid;
    addButton(opts: ButtonControllerOptions, id: string, i: number, j: number): ButtonController;
    set(button: ButtonController): void;
    refresh(): this;
    enable(): this;
    disable(): this;
    dispose(): void;
}
