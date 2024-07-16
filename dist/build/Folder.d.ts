import type { InputOptions, InputPreset, ValidInput } from './inputs/Input';
import type { ColorFormat } from './shared/color/types/colorFormat';
import type { Option } from './controllers/Select';
import type { Tooltip } from './shared/Tooltip';
import { InputButtonGrid, type ButtonGridInputOptions } from './inputs/InputButtonGrid';
import { InputSwitch, type SwitchInputOptions } from './inputs/InputSwitch';
import { InputButton, type ButtonInputOptions } from './inputs/InputButton';
import { InputSelect, type SelectInputOptions } from './inputs/InputSelect';
import { InputNumber, type NumberInputOptions } from './inputs/InputNumber';
import { InputColor, type ColorInputOptions } from './inputs/InputColor';
import { InputText, type TextInputOptions } from './inputs/InputText';
import { EventManager } from './shared/EventManager';
import { Gooey } from './Gooey';
/**
 * Resolves the provided value to the corresponding {@link InputOptions} type associated with the type
 * based on what type of {@link InputOptions.value|`value`} property it expects.
 */
export type InferOptions<T> = T extends number ? NumberInputOptions : T extends boolean ? SwitchInputOptions : T extends ColorFormat ? ColorInputOptions : T extends string ? TextInputOptions : T extends Array<infer T> ? SelectInputOptions<T> : T extends Option<infer T> ? SelectInputOptions<T> : InputOptions;
/**
 * Resolves any provided value to the corresponding {@link ValidInput} associated with the type.
 */
export type InferInput<TValueType> = TValueType extends number ? InputNumber : TValueType extends boolean ? InputSwitch : TValueType extends ColorFormat ? InputColor : TValueType extends string ? InputText : TValueType extends Array<infer T> ? InputSelect<T> : TValueType extends Option<infer T> ? InputSelect<T> : ValidInput;
/**
 * Resolves a target object to a type that represents the same structure, but with all values
 * replaced with the corresponding input type that would be generated by
 * {@link Folder.addMany|`addMany`} or {@link Folder.bindMany|`bindMany`}.
 * @template TTarget - The target object being used to generate inputs.
 */
export type InferTarget<TTarget> = TTarget extends Record<string, any> ? {
    [K in keyof TTarget]: TTarget[K] extends number ? InputNumber : TTarget[K] extends boolean ? InputSwitch : TTarget[K] extends string ? InputText : TTarget[K] extends Array<infer T> ? InputSelect<T> : TTarget[K] extends ColorFormat ? InputColor : TTarget[K] extends object ? InferTarget<TTarget[K]> : never;
} : never;
export type InferTargetOptions<T> = {
    [K in keyof T]?: T[K] extends Array<infer U> ? Partial<SelectInputOptions<U>> : T[K] extends object ? InferTargetOptions<T[K]> & {
        folderOptions?: Partial<FolderOptions>;
    } : Partial<InferOptions<T[K]>>;
};
/**
 * [0]:
 * No overload matches this call.
  Overload 1 of 2, '(folderTitle: string, targetObject: { foo: { bar: { title: string; }; }; }, targetOptions?: InferTargetOptions<{ foo: { bar: { title: string; }; }; }> | undefined): Folder & { ...; }', gave the following error.
    Argument of type '{ foo: { bar: string; }; }' is not assignable to parameter of type 'string'.
  Overload 2 of 2, '(target: { foo: { bar: string; }; }, targetOptions?: InferTargetOptions<{ foo: { bar: string; }; }> | undefined): Folder & { foo: { bar: InputText; }; }', gave the following error.
    Object literal may only specify known properties, and 'bar' does not exist in type 'Partial<SelectInputOptions<{ bar: string; }>>'.ts(2769)
 */
export interface FolderOptions {
    __type?: 'FolderOptions';
    /**
     * The element to append the folder to (usually
     * the parent folder's content element).
     */
    container: HTMLElement;
    /**
     * The title of the folder.
     * @defaultValue `''`
     */
    title?: string;
    /**
     * A preset namespace to use for saving/loading.  By default, the {@link title|`title`}
     * is used, in combiniation with the parent folder's title (and so on up the hierarchy).
     * Therefore, if you want to use presets, you will only need to set this if you:
     * - Use the same title for multiple inputs _in the same {@link Folder}_, or
     * - Leave all titles empty
     * Otherwise, this can be left as the default and presets will work as expected.
     * @defaultValue {@link title|`title`}
     */
    presetId?: string;
    /**
     * The child folders of this folder.
     */
    children?: Folder[];
    /**
     * Whether the folder should be collapsed by default.
     * @defaultValue `false`
     */
    closed?: boolean;
    /**
     * Whether the folder should be hidden by default.  If a function is
     * provided, it will be called to determine the hidden state.  Use
     * {@link refresh} to update the hidden state.
     * @defaultValue `false`
     */
    hidden?: boolean | (() => boolean);
    /**
     * Any controls this folder should contain.
     */
    controls?: Map<string, ValidInput>;
    /**
     * Whether this Folder should be saved as a {@link FolderPreset} when saving the
     * {@link GooeyPreset} for the {@link Gooey} this Folder belongs to.  If `false`, this Input will
     * be skipped.
     * @defaultValue `true`
     */
    saveable?: boolean;
    /**
     * The order in which this input should appear in its folder relative to the other inputs.
     * - To force an input to be first *(at the top of its folder)*, set `order` to `0` or below.
     * - To force an input to be last *(at the bottom of its folder)*, set `order` to any number greater than number of inputs + 1.
     * @default folder.inputs.size + folder.children.size + 1
     */
    order?: number;
    /**
     * When `true`, a search input will be added to the folder's toolbar, allowing users to search
     * for inputs within the folder by title.  By default, only the root folder is searchable.
     * @defaultValue `false`
     */
    searchable?: boolean;
}
/**
 * @internal
 */
export interface InternalFolderOptions {
    __type?: 'InternalFolderOptions';
    /**
     * The parent folder of this folder (or a circular reference if this is the root folder).
     */
    parentFolder?: Folder;
    /**
     * The GUI instance this folder belongs to.
     */
    gooey?: Gooey;
    /**
     * Whether this folder is the root folder.  Always true when
     * creating a `new Folder()`. Always false inside of the
     * `gooey.addFolder` and `folder.addFolder` methods.
     * Be wary of infinite loops when setting manually.
     * @defaultValue `true`
     * @internal
     */
    isRoot: boolean;
    /**
     * Temporarily bypasses the folder open/close animations upon creation.
     * @internal
     */
    _skipAnimations: boolean;
    /**
     * Hides the folder header.
     * @defaultValue `false`
     * @internal
     */
    _headerless: boolean;
}
/**
 * A folder preset stores the state of a folder and all of its inputs, as well as the state of all
 * child folders and their inputs.
 */
export interface FolderPreset {
    __type: 'FolderPreset';
    id: string;
    title: string;
    closed: boolean;
    hidden: boolean;
    children: FolderPreset[];
    inputs: InputPreset<any>[];
}
export interface FolderElements {
    header: HTMLElement;
    title: HTMLElement;
    contentWrapper: HTMLElement;
    content: HTMLElement;
    toolbar: {
        container: HTMLElement;
        settingsButton?: HTMLButtonElement & {
            tooltip?: Tooltip;
        };
    };
}
export interface FolderEvents {
    /**
     * When any input in the folder changes, this event emits the input that changed.
     */
    change: ValidInput;
    /**
     * When the folder is opened or closed, this event emits the new
     * {@link Folder.closed | `closed`} state.
     */
    toggle: Folder['closed']['value'];
    /**
     * Fires when {@link Folder.refresh} is called.
     */
    refresh: void;
    /**
     * Fired after the folder and all of it's children/graphics have been mounted.
     */
    mount: void;
}
/**
 * Folder is a container for organizing and grouping {@link Input|Inputs} and child Folders.
 *
 * This class should not be instantiated directly.  Instead, use the {@link Gooey.addFolder} method.
 *
 * @example
 * ```typescript
 * const gooey = new Gooey()
 * const folder = gooey.addFolder({ title: 'My Folder' })
 * folder.addNumber({ title: 'foo', value: 5 })
 * ```
 */
export declare class Folder {
    #private;
    __type: "Folder";
    isRoot: boolean;
    id: string;
    gooey?: Gooey;
    /**
     * A preset namespace to use for saving/loading.  By default, the {@link title|`title`}
     * is used, in combiniation with the parent folder's title (and so on up the hierarchy).
     * Therefore, if you want to use presets, you will only need to set this if you:
     * - Use the same title for multiple inputs _in the same {@link Folder}_, or
     * - Leave all titles empty
     * Otherwise, this can be left as the default and presets will work as expected.
     * @defaultValue {@link title|`title`}
     */
    presetId: string;
    /**
     * Whether this Folder should be saved as a {@link FolderPreset} when saving the
     * {@link GooeyPreset} for the {@link Gooey} this Folder belongs to.  If `false`, this Input will
     * be skipped.
     * @defaultValue `true`
     */
    saveable: boolean;
    /**
     * The child folders of this folder.
     */
    children: Folder[];
    /**
     * All inputs added to this folder.
     */
    inputs: Map<string, ValidInput>;
    /**
     * The root folder.  All folders have a reference to the same root folder.
     */
    root: Folder;
    parentFolder: Folder;
    settingsFolder: Folder;
    closed: {
        set: (value: boolean) => void;
    } & Omit<import("./shared/state").PrimitiveState<boolean>, "set">;
    element: HTMLDivElement;
    elements: FolderElements;
    graphics?: {
        icon: HTMLDivElement;
        connector?: {
            container: HTMLDivElement;
            svg: SVGElement;
            path: SVGPathElement;
        };
    };
    evm: EventManager<FolderEvents>;
    on: <K extends keyof FolderEvents>(event: K, callback: import("./shared/EventManager").EventCallback<FolderEvents[K]>) => string;
    initialHeight: number;
    initialHeaderHeight: number;
    private _title;
    private _hidden;
    private _log;
    /**
     * Used to disable clicking the header to open/close the folder.
     */
    private _disabledTimer?;
    /**
     * The time in ms to wait after mousedown before disabling toggle for a potential drag.
     */
    private _clickTime;
    /**
     * Whether clicking the header to open/close the folder is disabled.
     */
    private _clicksDisabled;
    private _depth;
    /**
     * Maps preset ids to their inputs.
     */
    private static _presetIdMap;
    constructor(options: FolderOptions);
    /**
     * The folder's title.  Changing this will update the UI.
     */
    get title(): string;
    set title(v: string);
    /**
     * Whether the folder is visible.
     */
    get hidden(): boolean;
    set hidden(v: boolean | (() => boolean));
    /**
     * A flat array of all child folders of this folder (and their children, etc).
     */
    get allChildren(): Folder[];
    /**
     * A flat array of all inputs in all child folders of this folder (and their children, etc).
     * See Input Generators region.
     */
    get allInputs(): Map<string, ValidInput>;
    isRootFolder(): this is Folder & {
        isRoot: true;
    };
    addFolder(title?: string, options?: Partial<FolderOptions>): Folder;
    private _handleClick;
    private _disableClicks;
    private _resetClicks;
    toggle: () => this;
    open(updateState?: boolean): this;
    close(updateState?: boolean): this;
    toggleHidden(): this;
    hide(): this;
    show(): this;
    resolvePresetId: (opts?: FolderOptions) => string;
    save(): FolderPreset;
    /**
     * Updates all inputs with values from the {@link FolderPreset}.  If the preset has children,
     * those presets will also be passed to the corresponding child folders'
     * {@link Folder.load|`load`} method.
     */
    load(preset: FolderPreset): this;
    /**
     * Updates the ui for all inputs belonging to this folder to reflect their current values.
     */
    refresh(): this;
    /**
     * Updates the ui for all inputs in this folder and all child folders recursively.
     */
    refreshAll(): this;
    add(title: string, options: SwitchInputOptions): InputSwitch;
    add(options: SwitchInputOptions, never?: never): InputSwitch;
    add(title: string, options: NumberInputOptions): InputNumber;
    add(options: NumberInputOptions, never?: never): InputNumber;
    add(title: string, options: TextInputOptions): InputText;
    add(options: TextInputOptions, never?: never): InputText;
    add(title: string, options: ColorInputOptions): InputColor;
    add(options: ColorInputOptions, never?: never): InputColor;
    add(title: string, options: ButtonInputOptions): InputButton;
    add(options: ButtonInputOptions, never?: never): InputButton;
    add(title: string, options: ButtonGridInputOptions): InputButtonGrid;
    add(options: ButtonGridInputOptions, never?: never): InputButtonGrid;
    add<T>(title: string, options: SelectInputOptions<T>): InputSelect<T>;
    add<T>(options: SelectInputOptions<T>, never?: never): InputSelect<T>;
    add(options: InputOptions, never?: never): ValidInput;
    addMany<T extends Record<string, any>>(obj: T, options?: {
        folder?: Folder;
    }): Folder & {
        inputs: Map<keyof T | (string & {}), InferInput<T[keyof T]>>;
    };
    /**
     * Binds an input to a target object and key.  The input will automatically update the target
     * object's key when the input value changes.
     * @param target - The object to bind the input to.
     * @param key - The key of the target object to bind the input to.
     * @param options - The {@link InputOptions}, the type of which is inferred based on the type
     * of the value at the {@link target} object's {@link key}.
     * @example
     * ```ts
     * const gooey = new Gooey()
     * const params = { foo: 5, bar: 'baz' }
     * const folder = gooey.addFolder('params')
     *
     * const numberInput = folder.bind(params, 'foo', { min: 0, max: 10, step: 1 })
     * //    ^? `InputNumber`
     *
     * const textInput = folder.bind(params, 'bar', { maxLength: 50 })
     * //    ^? `InputText`
     * ```
     */
    bind<TTarget extends Record<string, any>, TKey extends keyof TTarget, const TValue extends TTarget[TKey], TOptions extends InferOptions<TValue>, TInput extends InferInput<TValue>>(target: TTarget, key: TKey, options?: Partial<TOptions>): TInput;
    /**
     * Used to store a ref to the top level folder of a nested generator like `bindMany`.
     * @internal
     */
    private _transientRoot;
    bindMany<TTarget extends Record<string, any>, TOptions extends InferTargetOptions<TTarget> = InferTargetOptions<TTarget>>(folderTitle: string, targetObject: TTarget, targetOptions?: TOptions): this & InferTarget<TTarget>;
    bindMany<TTarget extends Record<string, any>, TOptions extends InferTargetOptions<TTarget> = InferTargetOptions<TTarget>>(target: TTarget, targetOptions?: TOptions, never?: never): this & InferTarget<TTarget>;
    /**
     * Explicitly adds an {@link InputNumber} to the folder.
     */
    addNumber(title: string, options: NumberInputOptions): InputNumber;
    addNumber(options: NumberInputOptions, never?: never): InputNumber;
    /**
     * Explicitly binds an {@link InputNumber} to the provided key on the given target object.
     */
    bindNumber<T extends Record<string, any>, K extends keyof T>(target: T, key: K, options?: Partial<NumberInputOptions>): InputNumber;
    bindNumber(title: string, options: Partial<NumberInputOptions>): InputNumber;
    /**
     * Explicitly adds an {@link InputText} to the folder.
     */
    addText(title: string, options: TextInputOptions): InputText;
    addText(options: TextInputOptions, never?: never): InputText;
    /**
     * Explicitly binds an {@link InputText} to the provided key on the given target object.
     */
    bindText<T extends Record<string, any>, K extends keyof T>(target: T, key: K, options?: Partial<TextInputOptions>): InputText;
    bindText(title: string, options: Partial<TextInputOptions>): InputText;
    /**
     * Explicitly adds an {@link InputColor} to the folder.
     */
    addColor(title: string, options: ColorInputOptions): InputColor;
    addColor(options: ColorInputOptions, never?: never): InputColor;
    /**
     * Explicitly binds an {@link InputColor} to the provided key on the given target object.
     */
    bindColor<T extends Record<string, any>, K extends keyof T>(target: T, key: K, options?: Partial<ColorInputOptions>): InputColor;
    bindColor(title: string, options: Partial<ColorInputOptions>): InputColor;
    /**
     * Explicitly adds an {@link InputButton} to the folder.
     */
    addButton(title: string, onclick: () => void, options?: ButtonInputOptions): InputButton;
    addButton(title: string, options: ButtonInputOptions, never?: never): InputButton;
    addButton(options: ButtonInputOptions): InputButton;
    /**
     * Explicitly binds an {@link InputButton} to the provided key on the given target object.
     */
    bindButton<T extends Record<string, any>, K extends keyof T>(target: T, key: K, options?: Partial<ButtonInputOptions>): InputButton;
    bindButton(title: string, options: Partial<ButtonInputOptions>): InputButton;
    /**
     * Explicitly adds an {@link InputButtonGrid} to the folder.
     */
    addButtonGrid(title: string, options: ButtonGridInputOptions): InputButtonGrid;
    addButtonGrid(options: ButtonGridInputOptions, never?: never): InputButtonGrid;
    /**
     * Explicitly binds an {@link InputButtonGrid} to the provided key on the given target object.
     */
    bindButtonGrid<T extends Record<string, any>, K extends keyof T>(target: T, key: K, options?: Partial<ButtonGridInputOptions>): InputButtonGrid;
    bindButtonGrid(title: string, options: Partial<ButtonGridInputOptions>): InputButtonGrid;
    /**
     * Explicitly adds an {@link InputSelect} to the folder.
     */
    addSelect<T>(title: string, options: SelectInputOptions<T>): InputSelect<T>;
    addSelect<T>(options: SelectInputOptions<T>, never?: never): InputSelect<T>;
    /**
     * Explicitly binds an {@link InputSelect} to the provided key on the given target object.
     */
    bindSelect<T extends Record<any, any> = Record<any, any>, K extends keyof T = keyof T>(target: T, key: K, options?: Partial<SelectInputOptions<T>>): InputSelect<T>;
    bindSelect<T>(title: string, options: Partial<SelectInputOptions<T>>): InputSelect<T>;
    /**
     * Explicitly adds an {@link InputSwitch} to the folder.
     */
    addSwitch(title: string, options: SwitchInputOptions): InputSwitch;
    addSwitch(options: SwitchInputOptions, never?: never): InputSwitch;
    /**
     * Explicitly binds an {@link InputSwitch} to the provided key on the given target object.
     */
    bindSwitch<T, K extends keyof T>(target: T, key: K, options?: Partial<SwitchInputOptions>): InputSwitch;
    bindSwitch(title: string, options: Partial<SwitchInputOptions>): InputSwitch;
    /**
     * Does validation / error handling.
     * If no title was provided, this method will also assign the binding key to the title.
     * @returns The processed options.
     */
    private _validateOptions;
    private _createInput;
    private _resolveId;
    private _resolveOptions;
    private _resolveBinding;
    private _resolveType;
    private _createElement;
    private _createElements;
    private _createGraphics;
    private _resolveHeaderHeight;
    get hue(): number;
    private _refreshIcon;
    disposed: boolean;
    dispose(): void;
}
