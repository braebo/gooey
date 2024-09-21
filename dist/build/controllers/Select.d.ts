import type { State } from '../shared/state';
import type { Input } from '../inputs/Input';
import { type Disableable } from '../shared/decorators/disableable-class-decorator';
export type LabeledOption<T> = {
    label: string;
    value: T;
};
export type Option<T> = T | LabeledOption<T>;
export interface SelectInputOptions<T> {
    readonly __type?: 'SelectInputOptions';
    input: Input;
    container: HTMLDivElement;
    disabled: boolean | (() => boolean);
    /**
     * The default selected option. If not provided, the first option in
     * the `options` array will be selected.
     * @todo - We need a 'blank' state where no option is selected.
     */
    selected?: Option<T>;
    /**
     * The options to display in the select controller.  Pass each
     * option as a {@link LabeledOption} (`{ label: string, value: T }`)
     * to specify text to display for each option.  Alternatively, if the
     * label you want to display is already on the option object, use the
     * `labelKey` property to specify the key to use as the label.
     */
    options: Option<T>[];
    /**
     * An optional key on each {@link Option} to use as the `label` when
     * converting to a {@link LabeledOption}.
     */
    labelKey?: T extends Record<infer K, any> ? K : never;
    /**
     * When `true`, options will be automatically selected when a user
     * hovers over them in the dropdown.  If none are selected, the
     * original value will be restored.
     * @default true
     */
    selectOnHover?: boolean;
    /**
     * Just used internally for the logger label.
     * @internal
     */
    title?: string;
}
export type SelectElements = {
    container: HTMLDivElement;
    selected: HTMLDivElement;
    dropdown: HTMLDivElement;
    options: HTMLDivElement[];
};
interface SelectInputEvents<T> {
    change: LabeledOption<T>;
    refresh: void;
    open: void;
    close: void;
    cancel: void;
}
export interface Select<T> extends Disableable {
}
export declare class Select<T> {
    readonly __type: "Select";
    element: HTMLDivElement;
    private _opts;
    elements: SelectElements;
    /**
     * All options in the select controller.
     */
    options: LabeledOption<T>[];
    /**
     * A map of all options by their (internally generated) id.
     */
    optionMap: Map<string, {
        option: LabeledOption<T>;
        element: HTMLDivElement;
    }>;
    /**
     * Whether the dropdown is currently visible.
     */
    expanded: boolean;
    /**
     * The initial selected option.
     */
    initialValue: LabeledOption<T>;
    /**
     * The initial options array.
     */
    initialOptions: LabeledOption<T>[];
    /**
     * When true, clicking clicks will be ignored.
     */
    disableClicks: boolean;
    /**
     * Used to prevent infinite loops when updating internally.
     */
    bubble: boolean;
    /**
     * The currently selected option.
     */
    private _selected;
    /**
     * The currently selected option preserved when hot-swapping on:hover.
     */
    private _currentSelection;
    /**
     * The parent element that the selected element is scrolling in.
     */
    private _scrollParent;
    private _evm;
    /**
     * Used to subscribe to {@link SelectInputEvents}.
     */
    on: <K extends keyof SelectInputEvents<T>>(event: K, handler: (v: SelectInputEvents<T>[K]) => void) => void;
    private _log;
    constructor(options: SelectInputOptions<T>);
    /**
     * The currently selected option. Assigning a new value will update the UI.
     */
    get selected(): LabeledOption<T>;
    set selected(v: Option<T> | State<Option<T>>);
    getLabel(v: LabeledOption<T> | State<LabeledOption<T>>): string;
    /**
     * Adds an option to the select controller.
     * @param option The option to add.
     * @returns The id of the added option.
     */
    add<O extends T>(option: Option<O>): this;
    /**
     * Removes an option from the select controller by id.
     */
    remove(
    /**
     * The id of the option to remove.
     */
    id: string, 
    /**
     * If false, the select controller will not attempt to select a new fallback option
     * when the removed option is also the currently selection one.
     * @default false
     */
    autoSelectFallback?: boolean): void;
    /**
     * Removes all options and their elements.
     */
    clear(): void;
    select: (v: LabeledOption<T> | Event, bubble?: boolean) => this;
    /**
     * Updates the UI to reflect the current state of the source.
     */
    refresh: () => this;
    /**
     * Toggles the dropdown's visibility.
     */
    toggle: () => void;
    /**
     * Shows the dropdown.
     */
    open: () => void;
    /**
     * Positions the dropdown to the selected element.
     */
    updatePosition: () => void;
    get container(): HTMLElement;
    /**
     * Hides the dropdown.
     */
    close: () => void;
    /**
     * Closes the dropdown if the escape key was pressed.  If {@link selectOnHover}
     * is enabled, the current selection will be re-selected to restore the original
     * value.
     */
    private _closeOnEscape;
    private _clickOutside;
    private _cancel;
    enable(): this;
    disable(): this;
    dispose(): void;
}
export declare function isLabeledOption<T>(v: any): v is LabeledOption<T>;
export declare function toLabeledOption<T>(v: Option<T>): LabeledOption<T>;
export declare function fromLabeledOption<T>(v: Option<T> | State<Option<T>>): T;
export {};
