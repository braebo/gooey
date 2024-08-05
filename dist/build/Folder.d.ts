import type { InputOptions, InputPreset, ValidInput } from './inputs/Input';
import type { ColorFormat } from './shared/color/types/colorFormat';
import type { Option } from './controllers/Select';
import type { Tooltip } from './shared/Tooltip';
import { InputSwitch, type SwitchInputOptions } from './inputs/InputSwitch';
import { InputButton, type ButtonInputOptions } from './inputs/InputButton';
import { InputSelect, type SelectInputOptions } from './inputs/InputSelect';
import { InputNumber, type NumberInputOptions } from './inputs/InputNumber';
import { InputColor, type ColorInputOptions } from './inputs/InputColor';
import { InputText, type TextInputOptions } from './inputs/InputText';
import { InputButtonGrid, type ButtonGridInputOptions, type ButtonGridArrays } from './inputs/InputButtonGrid';
import { Color } from './shared/color/color';
import { type State } from './shared/state';
import { EventManager } from './shared/EventManager';
import { Gooey } from './Gooey';
type InvalidBinding = never;
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
/**
 * Resolves a target object to a type that represents the same structure, but with all values
 * replaced with the corresponding input options type accepted by the input type that would be
 * @template TTarget - The target object being used to generate inputs.
 * @example
 * ```typescript
 * const target = { foo: 5, bar: 'baz' }
 * // The inferred result:
 * type TargetOptions = InferTargetOptions<typeof target>
 * // Generates:
 * 	foo: NumberInputOptions,
 * 	bar: TextInputOptions,
 * }
 * ```
 */
export type InferTargetOptions<TTarget> = {
    [K in keyof TTarget]?: TTarget[K] extends Array<infer U> ? Partial<SelectInputOptions<U>> : TTarget[K] extends object ? InferTargetOptions<TTarget[K]> & {
        folderOptions?: Partial<FolderOptions>;
    } : Partial<InferOptions<TTarget[K]>>;
};
/**
 * Resolves a target object into a flat array of all keys that are not objects,
 * recursively resolving objects into their keys.
 * @template TTarget - The target object being used to generate inputs.
 */
type InferTargetKeys<TTarget> = TTarget extends object ? {
    [K in keyof TTarget]: K | InferTargetKeys<Exclude<TTarget[K], TTarget>>;
}[keyof TTarget] : never;
export interface FolderOptions {
    __type?: 'FolderOptions';
    /**
     * The element to append the folder to (usually
     * the parent folder's content element).
     */
    container: HTMLElement;
    /**
     * The title of the folder.
     * @default ''
     */
    title?: string;
    /**
     * A preset namespace to use for saving/loading.  By default, the {@link title|`title`}
     * is used, in combiniation with the parent folder's title (and so on up the hierarchy).
     * Therefore, if you want to use presets, you will only need to set this if you:
     * - Use the same title for multiple inputs _in the same {@link Folder}_, or
     * - Leave all titles empty
     * Otherwise, this can be left as the default and presets will work as expected.
     * @default The provided `title`.
     */
    presetId?: string;
    /**
     * The child folders of this folder.
     */
    children?: Folder[];
    /**
     * Whether the folder should be collapsed by default.
     * @default false
     */
    closed?: boolean;
    /**
     * Whether the folder should be hidden by default.  If a function is
     * provided, it will be called to determine the hidden state.  Use
     * {@link Folder.refresh} to update the hidden state.
     * @default false
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
     * @default true
     */
    saveable?: boolean;
    /**
     * The order in which this input should appear in its folder relative to the other inputs.
     * - To force an input to be first *(at the top of its folder)*, set `order` to `0` or below.
     * - To force an input to be last *(at the bottom of its folder)*, set `order` to any number
     * greater than number of inputs + 1.
     * @default folder.inputs.size + folder.children.size + 1
     */
    order?: number;
    /**
     * When `true`, a search input will be added to the folder's toolbar, allowing users to search
     * for inputs within the folder by title.  By default, only the root folder is searchable.
     * @default false
     */
    searchable?: boolean;
    /**
     * Disables all user interactions and dims the folder brightness.  If a function is provided,
     * it will be called to update the disabled state each time the {@link refresh} method runs.
     * @default false
     */
    disabled?: boolean | (() => boolean);
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
     * @default true
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
     * @default false
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
     * @default The provided `title`.
     */
    presetId: string;
    /**
     * Whether this Folder should be saved as a {@link FolderPreset} when saving the
     * {@link GooeyPreset} for the {@link Gooey} this Folder belongs to.  If `false`, this Input will
     * be skipped.
     * @default true
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
    inputIdMap: Map<string, string>;
    /**
     * The root folder.  All folders share a reference to the same root folder.
     */
    root: Folder;
    /**
     * The parent folder of this folder (or a circular reference if this is the root folder).
     */
    parentFolder: Folder;
    /**
     * The folder containing Gooey instance settings, like the `ui` and `presets` sections.
     */
    settingsFolder: Folder;
    /**
     * An observable responsible for the folder's open/closed state.  Setting this value will
     * open/close the folder, and subscribing to this value will allow you to listen for
     * open/close events.
     */
    closed: State<boolean>;
    /**
     * The folder's root container element, containing all other related folder {@link elements}.
     */
    element: HTMLDivElement;
    /**
     * All HTMLElements that make up the folder's UI.
     */
    elements: {
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
    };
    /**
     * The animated svg graphics belonging to the folder.
     */
    graphics?: {
        icon: HTMLDivElement;
        connector?: {
            container: HTMLDivElement;
            svg: SVGElement;
            path: SVGPathElement;
            update: () => void;
        };
    };
    /**
     * The event manager for the folder.  This should rarely need to be accessed directly, since
     * subscribing to events can be done with a Folder's {@link on} method.
     * @internal
     */
    evm: EventManager<FolderEvents>;
    /**
     * Equivalent to `addEventListener`.
     */
    on: <K extends keyof FolderEvents>(event: K, callback: import("./shared/EventManager").EventCallback<FolderEvents[K]>) => string;
    /**
     * The pixel height of the folder header element.
     * @internal
     */
    private initialHeaderHeight;
    private _title;
    private _hidden;
    private _hiddenFn?;
    private _disabled;
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
    /**
     * The duration of the open/close and hide/show animations in ms.
     * @default 450
     *
     * @todo This needs to sync with the animation duration in the css.
     */
    private _animDuration;
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
    /**
     * Whether the input is disabled.  Modifying this value will update the UI.
     */
    get disabled(): boolean;
    set disabled(v: boolean | (() => boolean));
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
    private static _EASE;
    private static _SHOW_ANIM;
    private static _HIDE_ANIM;
    toggleHidden(
    /**
     * Whether to show the folder instantly, bypassing the animation.
     * @default false
     */
    instant?: boolean): this;
    show(
    /**
     * Whether to show the folder instantly, bypassing the animation.
     * @default false
     */
    instant?: boolean): Promise<this>;
    hide(
    /**
     * Whether to show the folder instantly, bypassing the animation.
     * @default false
     */
    instant?: boolean): Promise<this>;
    private _toggleTimeout;
    private _toggleClass;
    private _resolvePresetId;
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
    /**
     * Registers all new inputs by adding them to the {@link inputs|folder inputs} map, updating
     * the internal preset-id map, and and refreshing the folder icon (debounced slightly).
     */
    private _registerInput;
    /**
     * Takes in a title, value, and options, and return an updated options object.
     *
     * Updates:
     * - {@link InputOptions.title|`title`}
     * - {@link InputOptions.value|`value`}
     * - {@link InputOptions.presetId|`presetId`}
     */
    private _resolveOpts;
    add(title: string, initialValue: boolean, options?: SwitchInputOptions): InputSwitch;
    add(title: string, initialValue: number, options?: NumberInputOptions): InputNumber;
    add(title: string, initialValue: string, options?: TextInputOptions): InputText;
    add(title: string, initialValue: () => void, options?: ButtonInputOptions): InputButton;
    add(title: string, initialValue: ColorFormat, options?: ColorInputOptions): InputColor;
    add<T>(title: string, initialValue: Option<T>, options: SelectInputOptions<T>): InputSelect<T>;
    add(title: string, initialValue: ButtonGridArrays, options?: ButtonGridInputOptions): InputButtonGrid;
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
     * const gui = new Gooey()
     *
     * // Some state.
     * const params = { foo: 5, bar: 'baz', qux: true }
     *
     * const numberInput = gui.bind(params, 'foo', { min: 0, max: 10, step: 1 })
     * //    ^? InputNumber
     *
     * // By default, the `title` is inferred from the key.
     * // To override it, use the `title` option:
     * const switchInput = gui.bind(params, 'qux', { title: 'Kwucks' })
     * ```
     */
    bind<TTarget extends Record<string, any>, TKey extends keyof TTarget, const TValue extends TTarget[TKey], TOptions extends InferOptions<TValue>, TInput extends InferInput<TValue>>(target: TTarget, key: TKey, options?: Partial<TOptions>): TInput;
    /**
     * Used to store a ref to the top level folder of a nested generator like `bindMany`.
     * @internal
     */
    private _transientRoot;
    bindMany<T extends object, TOptions extends InferTargetOptions<T> = InferTargetOptions<T>, TInputs extends InferTarget<T> = this & InferTarget<T>>(target: T, options?: TOptions & {
        /**
         * An array of keys to exclude from a target object when generating inputs.
         */
        exclude?: InferTargetKeys<T>[];
        /**
         * An array of keys to include in a target object when generating inputs.
         */
        include?: InferTargetKeys<T>[];
    }): TInputs;
    /**
     * Adds a new {@link InputNumber} to the folder.
     * @example
     * ```ts
     * const number = gui.addNumber('Foo', true)
     * number.on('change', console.log)
     * ```
     */
    addNumber(title: string, value?: number, options?: Partial<NumberInputOptions>): InputNumber;
    bindNumber<const T extends Record<string, any>, const K extends keyof T, V extends T[K] extends number ? number : InvalidBinding>(target: T, key: K, options?: Partial<NumberInputOptions>): InputNumber;
    addText(title: string, value?: string, options?: TextInputOptions): InputText;
    bindText<T extends Record<string, any>, K extends keyof T, TValue extends T[K] extends string ? string : InvalidBinding>(target: T, key: K, options?: Partial<TextInputOptions>): InputText;
    addColor(title: string, value?: ColorFormat, options?: ColorInputOptions): InputColor;
    bindColor<T extends Record<string, any> | Color, K extends keyof T, TValue extends T[K] extends ColorFormat ? Color : InvalidBinding>(target: T, key: K, options?: Partial<ColorInputOptions>): InputColor;
    addButton(title: string, onclick: () => void, options?: ButtonInputOptions): InputButton;
    /**
     * Passes the function at `target[key]` to {@link addButton} as the `onclick` handler.
     */
    bindButton<T extends Record<string, any>, K extends keyof T, TValue extends T[K] extends Function ? () => void : InvalidBinding>(target: T, key: K, options?: Partial<ButtonInputOptions>): InputButton;
    addButtonGrid(title: string, value: ButtonGridArrays, options?: Partial<ButtonGridInputOptions>): InputButtonGrid;
    bindButtonGrid<T extends Record<string, any>, K extends keyof T, V extends T[K] extends ButtonGridArrays ? ButtonGridArrays : never>(target: T, key: K, options?: Partial<ButtonGridInputOptions>): InputButtonGrid;
    /**
     * Adds a new {@link InputSelect} to the folder.
     * @example
     * ```ts
     * // For primitives:
     * gui.addSelect('theme', ['light', 'dark'], { initialValue: 'light' })
     *
     * // For objects:
     * const options = {
     *   foo: { id: 0 },
     *   bar: { id: 1 },
     * }
     *
     * todo - Implement this -- will need to detect that the list has objects and pass a union of
     * todo - their keys to the initialValue type or something?
     * gui.addSelect('foobar', options, { initialValue: 'foo' })
     * ```
     */
    addSelect<T>(title: string, array: T[], options?: SelectInputOptions<NoInfer<T>> & {
        initialValue?: NoInfer<T>;
    }): InputSelect<T>;
    /**
     * todo - Does this work / make sense?  It's just wrapping the list in a function.. which
     * happens internally anyways... I'm not sure what binding to a select should do, other than
     * ensure that the options array is regularly refreshed after interactions... but without a
     * way to listen to changes on the target object's array (i.e. forcing or wrapping with a
     * store), I'm not sure what the behavior should be.
     */
    bindSelect<T extends Record<string, any>, K extends keyof T, V extends T[K] extends Option<infer U> ? U : InvalidBinding, A extends Array<V>, O extends SelectInputOptions<V> = SelectInputOptions<V> & {
        options: A;
        initialValue?: V;
        targetKey?: keyof T;
    }>(target: T, key: K, options?: O): InputSelect<V>;
    /**
     * Adds a new {@link InputSwitch} to the folder.
     * @example
     * ```ts
     * const switch = gui.addSwitch('Foo', true)
     * switch.on('change', console.log)
     * ```
     */
    addSwitch(title: string, value: boolean, options?: SwitchInputOptions): InputSwitch;
    /**
     * Binds an {@link InputSwitch} to the `boolean` at the target object's key.
     * @example
     * ```ts
     * const params = { foo: true }
     * const switch = gui.bindSwitch(params, 'foo')
     * ```
     */
    bindSwitch<T extends Record<string, any>, K extends keyof T, V extends T[K] extends boolean ? boolean : InvalidBinding>(target: T, key: K, options?: Partial<SwitchInputOptions>): InputSwitch;
    /**
     * Does validation / error handling.
     * If no title was provided, this method will also assign the binding key to the title.
     * @returns The processed options.
     */
    private _validateBinding;
    private _createInput;
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
export {};
