import type { InputButtonGrid, ButtonGridInputOptions } from './InputButtonGrid';
import type { InputTextArea, TextAreaInputOptions } from './InputTextArea';
import type { InputButton, ButtonInputOptions } from './InputButton';
import type { InputSwitch, SwitchInputOptions } from './InputSwitch';
import type { InputSelect, SelectInputOptions } from './InputSelect';
import type { InputNumber, NumberInputOptions } from './InputNumber';
import type { InputColor, ColorInputOptions } from './InputColor';
import type { InputText, TextInputOptions } from './InputText';
import type { ColorFormat } from '../shared/color/types/colorFormat';
import type { EventCallback } from '../shared/EventManager';
import type { Option } from '../controllers/Select';
import type { Color } from '../shared/color/color';
import type { State } from '../shared/state';
import type { Commit } from '../UndoManager';
import type { Folder } from '../Folder';
import { EventManager } from '../shared/EventManager';
export type InputType = (typeof INPUT_TYPES)[number];
export type InputOptionType = (typeof INPUT_OPTION_TYPES)[number];
export declare const INPUT_TYPE_MAP: Readonly<{
    InputText: "TextInputOptions";
    InputTextArea: "TextAreaInputOptions";
    InputNumber: "NumberInputOptions";
    InputColor: "ColorInputOptions";
    InputSelect: "SelectInputOptions";
    InputButton: "ButtonInputOptions";
    InputButtonGrid: "ButtonGridInputOptions";
    InputSwitch: "SwitchInputOptions";
}>;
export declare const INPUT_TYPES: readonly ("InputText" | "InputTextArea" | "InputNumber" | "InputColor" | "InputSelect" | "InputButton" | "InputButtonGrid" | "InputSwitch")[];
export declare const INPUT_OPTION_TYPES: readonly ("TextInputOptions" | "TextAreaInputOptions" | "NumberInputOptions" | "ColorInputOptions" | "SelectInputOptions" | "ButtonInputOptions" | "ButtonGridInputOptions" | "SwitchInputOptions")[];
export type BindTarget = Record<any, any>;
export type BindableObject<T extends BindTarget, K extends keyof T = keyof T> = {
    target: T;
    key: K;
    initial?: T[K];
};
/**
 * The initial value of an input can be either a raw value, or a "binding"
 */
export type ValueOrBinding<TValue = ValidInputValue, TBindTarget extends BindTarget = BindTarget> = {
    value: TValue;
    binding?: BindableObject<TBindTarget>;
} | {
    value?: TValue;
    binding: {
        target: TBindTarget;
        key: keyof TBindTarget;
        initial?: TValue;
    };
} | {
    value?: TValue;
    binding?: {
        target: TBindTarget;
        key: keyof TBindTarget;
        initial?: TValue;
    };
} | {
    value: TValue;
    binding?: {
        target: TBindTarget;
        key: keyof TBindTarget;
        initial?: TValue;
    };
};
export type InputOptions<TValue = ValidInputValue, TBindTarget extends BindTarget = Record<any, any & TValue>> = {
    /**
     * The title displayed to the left of the input.
     */
    title?: string;
    /**
     * If provided, will be used as the key for the input's value in a preset.
     * @defaultValue `<folder_title>:<input_type>:<input_title>`
     */
    presetId?: string;
    /**
     * Whether the inputs are disabled.  A function can be used to dynamically determine the
     * disabled state.
     * @default false
     */
    disabled?: boolean | (() => boolean);
    /**
     * Whether the input is hidden. A function can be used to dynamically determine the hidden
     * state.
     * @default false
     */
    hidden?: boolean;
    /**
     * The order in which this input should appear in its folder relative to the other inputs.
     * - To force an input to be first *(at the top of its folder)*, set `order` to `0` or below.
     * - To force an input to be last *(at the bottom of its folder)*, set `order` to any number greater than number of inputs + 1.
     * @default folder.inputs.size + 1
     */
    order?: number;
    /**
     * If true, the `reset to default` button will appear when the input's value is marked dirty.
     * @default true
     */
    resettable?: boolean;
    /**
     * Whether this Input should be saved as a {@link InputPreset} when saving the
     * {@link FolderPreset} for the {@link Folder} this Input belongs to.  If `false`, this Input
     * will be skipped.
     * @default true
     */
    saveable?: boolean;
    /**
     * An optional callback to run when this Input's state changes.  Also accessible via
     * `Input.on('change', value => {})`.
     */
    onChange?: (value: TValue) => void;
} & ValueOrBinding<TValue, TBindTarget>;
export type InputPreset<T extends ValidInputOptions> = Omit<InputOptions<T>, 'title' | 'saveable'> & {
    __type: InputOptionType;
    presetId: string;
    title: string;
    value: ValidInputValue;
    disabled: boolean;
    hidden: boolean;
    order: number;
    resettable: boolean;
};
export interface ElementMap<T = unknown> {
    [key: string]: HTMLElement | HTMLInputElement | ElementMap | T;
}
export type ValidInputValue = string | number | Color | ColorFormat | Option<any>;
export type ValidInputOptions = TextInputOptions | TextAreaInputOptions | NumberInputOptions | ColorInputOptions | SelectInputOptions<Option<any>> | ButtonInputOptions | ButtonGridInputOptions | SwitchInputOptions;
export type ValidInput = InputText | InputTextArea | InputNumber | InputColor | InputSelect<Option<any>> | InputButton | InputButtonGrid | InputSwitch;
export type InputEvents<T extends ValidInputValue = ValidInputValue> = {
    /**
     * Called when the input's value changes, providing the new value.
     */
    readonly change: T;
    /**
     * Called when a input's controllers are refreshed, providing the current value of the input.
     */
    readonly refresh: T;
};
/**
 * An input that can be added to a {@link Folder}.  This class is extended by all
 * {@link ValidInput} classes. Inputs occupy a single row in a folder, and are in charge of
 * managing a single state value.  Inputs often combine multiple controllers to provide a rich
 * user interface for interacting with the input's value.
 *
 * @template TValueType - The type of value this input manages.
 * @template TOptions - The options object for this input, determined by the input class
 * responsible for the {@link TValueType}.
 * @template TElements - A map of all HTMLElement's created by this input.
 * @template TEvents - A map of all events emitted by this input.
 * @template TType - A string-literal type brand.  Identical to the input class name.
 */
export declare abstract class Input<TValueType extends ValidInputValue = ValidInputValue, TOptions extends ValidInputOptions = InputOptions, TElements extends ElementMap = ElementMap, TEvents extends InputEvents = InputEvents<TValueType>, TType extends InputType = InputType, T__TYPE = (typeof INPUT_TYPE_MAP)[TType]> {
    folder: Folder;
    abstract readonly __type: TType;
    abstract state: State<TValueType>;
    abstract initialValue: ValidInputValue;
    readonly opts: TOptions & {
        __type: T__TYPE;
    };
    /**
     * Unique identifier for the input. Also used for saving and loading presets.
     * @default `<folder_title>:<input_type>:<input_title>`
     */
    id: string;
    /**
     * Whether the input was initialized with a bind target/key.
     * @default false
     */
    bound: boolean;
    /**
     * All HTMLElement's created by this input.
     */
    elements: {
        container: HTMLElement;
        title: HTMLElement;
        content: HTMLElement;
        drawer: HTMLElement;
        drawerToggle: HTMLElement;
        controllers: TElements;
        resetBtn: HTMLElement;
    };
    /**
     * Whether the controllers should bubble their events up to the input and it's listeners.
     * If false, the next update will be silent, after which the flag will be reset to true.
     */
    bubble: boolean;
    private _title;
    private _index;
    private _disabled;
    private _hidden;
    /**
     * Prevents the input from registering commits to undo history until
     * {@link unlock} is called.
     */
    private _undoLock;
    /**
     * The commit object used to store the initial value of the input when
     * {@link lock} is called.
     */
    private lockCommit;
    /**
     * The input's {@link EventManager}.
     */
    protected _dirty: () => boolean;
    protected _evm: EventManager<TEvents>;
    listen: <TTarget extends Element | Window | Document, TEventName extends keyof GlobalEventHandlersEventMap | (string & {}), TEventInstance extends TEventName extends keyof GlobalEventHandlersEventMap ? GlobalEventHandlersEventMap[TEventName] & {
        target: TTarget;
    } : Event>(element: TTarget, event: TEventName, callback: (e: TEventInstance) => void, options?: AddEventListenerOptions, groupId?: string) => string;
    on: <K extends keyof TEvents>(event: K, callback: EventCallback<TEvents[K]>) => string;
    private __log;
    constructor(options: TOptions & {
        __type: T__TYPE;
    }, folder: Folder);
    get value(): TValueType;
    /**
     * The title displayed on this Input's label.
     */
    get title(): string;
    set title(v: string);
    /**
     * The main Element.  Usually a container div for the rest of the Input's
     * {@link Input.elements|`elements`}.
     */
    get element(): HTMLElement;
    get index(): number;
    set index(v: number);
    get undoManager(): import("../UndoManager").UndoManager | undefined;
    /**
     * Whether the input is disabled.  A function can be used to dynamically determine the
     * disabled state.
     */
    get disabled(): boolean;
    set disabled(v: boolean | (() => boolean));
    /**
     * Completely hides the Input from view when set to `true`.
     */
    get hidden(): boolean;
    set hidden(v: boolean | (() => boolean));
    /**
     * Wether the current state value differs from the initial state value.
     * @internal
     */
    protected get dirty(): boolean;
    /**
     * Updates the Input's state to the given value.
     */
    abstract set(v: TValueType): void;
    protected resolveState<T = TValueType>(opts: TOptions): State<T>;
    protected resolveInitialValue(opts: TOptions): any;
    /**
     * Called from subclasses at the end of their `set` method to emit the `change` event.
     */
    _emit(event: keyof TEvents, v?: TValueType): this;
    /**
     * Prevents the input from registering undo history, storing the initial
     * for the eventual commit in {@link unlock}.
     */
    protected lock: (from?: unknown) => void;
    /**
     * Unlocks commits and saves the current commit stored in lock.
     */
    protected unlock: (commit?: Partial<Commit>) => void;
    /**
     * Commits a change to the input's value to the undo manager.
     */
    commit(commit: Partial<Commit>): void;
    /**
     * Enables the input and any associated controllers.
     */
    enable(): this;
    /**
     * Disables the input and any associated controllers. A disabled input's state can't be
     * changed or interacted with.
     */
    disable(): this;
    /**
     * Refreshes the value of any controllers to match the current input state.
     */
    refresh(v?: TValueType): this | undefined;
    save(overrides?: Partial<InputPreset<TOptions>>): Omit<InputOptions<any, Record<any, any>>, "title" | "saveable"> & {
        __type: InputOptionType;
        presetId: string;
        title: string;
        value: ValidInputValue;
        disabled: boolean;
        hidden: boolean;
        order: number;
        resettable: boolean;
    } & Partial<InputPreset<TOptions>>;
    load(json: InputPreset<TOptions> | string): void;
    dispose(): void;
}