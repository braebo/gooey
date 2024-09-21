import type { ElementMap, InputOptions } from './Input';
import type { CreateOptions } from '../shared/create';
import type { Folder } from '../Folder';
import type { ButtonControllerEvents, ButtonControllerOptions } from '../controllers/ButtonController';
import { ButtonController } from '../controllers/ButtonController';
import { Input } from './Input';
/**
 * @see {@link ButtonGridInputOptions.value}
 */
export type ButtonGridArrays = ButtonControllerOptions[][];
/**
 * A unique identifier for a button in a {@link ButtonGridArrays} array.  Used as the key in the
 * {@link InputButtonGrid.buttons} map, as the value in the {@link InputButtonGrid.state} property,
 * and as the `id` attribute on the button element.
 */
export type ButtonId = string;
/**
 * A fully processed {@link ButtonGridArrays} entry with the generated {@link ButtonController}s.
 * Stored in the input's {@link InputButtonGrid.buttonGrid|`buttonGrid`} property.
 */
export type ButtonGrid = ButtonController[][];
/**
 * Options for the {@link InputButtonGrid} {@link Input}.
 */
export type ButtonGridInputOptions = {
    readonly __type?: 'ButtonGridInputOptions';
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
    value: ButtonGridArrays;
    /**
     * Optional css style overrides in {@link JavascriptStyleProperty} (camelCase) format.
     */
    style?: CreateOptions['style'];
    /**
     * Whether to apply the `active` classname to the button when it is clicked, changing its
     * appearance.
     * @default true
     */
    applyActiveClass?: boolean;
    /**
     * When `false`, the `active` class will be removed from all buttons before applying it to the
     * clicked button.  Whem `true`, each button's active class will toggle independently.
     */
    multiple?: boolean;
    /**
     * Whether a button is clickable.  If a function is passed, it will be called whenever the
     * button is refreshed.
     * @default false
     */
    disabled?: boolean | (() => boolean);
} & InputOptions<ButtonGridArrays>;
export declare const BUTTONGRID_INPUT_DEFAULTS: {
    readonly __type: "ButtonGridInputOptions";
    readonly value: [[{
        readonly id: "";
        readonly text: "";
        readonly onClick: () => void;
    }]];
    readonly style: {
        readonly gap: "0.5em";
    };
    readonly applyActiveClass: true;
    readonly resettable: false;
};
export interface ButtonGridControllerElements extends ElementMap {
    container: HTMLElement;
    buttonGrid: HTMLButtonElement[];
}
export declare class InputButtonGrid extends Input<Set<ButtonId>, ButtonGridInputOptions, ButtonGridControllerElements, ButtonControllerEvents> {
    readonly __type: "InputButtonGrid";
    readonly initialValue: ButtonGridArrays;
    /**
     * An array of active button ids.
     * @see {@link Input.state}
     */
    readonly state: import("../shared/state").SetState<string>;
    buttons: Map<ButtonId, ButtonController>;
    buttonGrid: ButtonGrid;
    /**
     * A Set of active button ids.
     */
    get active(): Set<ButtonId>;
    setActive(id: ButtonId): void;
    private _log;
    constructor(options: Partial<ButtonGridInputOptions>, folder: Folder);
    onClick(callback: (payload: {
        /** The original click event. */
        event: MouseEvent;
        /** The individual {@link ButtonController} that was clicked. */
        button: ButtonController;
    }) => void): void;
    /**
     * Converts a {@link ButtonGridArrays} into a a grid of {@link HTMLButtonElement}
     * elements, and
     *
     * - appends them to the {@link InputButtonGrid.elements.controllers.container}
     */
    toGrid(grid: ButtonGridArrays): ButtonGrid;
    private _resolveId;
    addButton(opts: ButtonControllerOptions, id: string, i: number, j: number): ButtonController;
    private _set;
    set(): void;
    refresh(): this;
    enable(): this;
    disable(): this;
    dispose(): void;
}
export declare function isButtonGridArrays(value: any): value is ButtonGridArrays;
