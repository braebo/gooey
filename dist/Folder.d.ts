import { State } from "./shared/state.js";
import { Tooltip } from "./shared/Tooltip.js";
import { EventCallback, EventManager } from "./shared/EventManager.js";
import { ColorObject } from "./shared/color/types/objects.js";
import { ColorString } from "./shared/color/types/strings.js";
import { ColorFormat } from "./shared/color/types/colorFormat.js";
import { ColorValue } from "./shared/color/color.js";
import { LabeledOption, Option } from "./controllers/Select.js";
import { ToolbarButton, ToolbarButtonConfig } from "./svg/ToolbarButton.js";
import { InputSwitch, SwitchInputOptions } from "./inputs/InputSwitch.js";
import { ButtonInputOptions, InputButton } from "./inputs/InputButton.js";
import { InputSelect, SelectInputOptions } from "./inputs/InputSelect.js";
import { InputNumber, NumberInputOptions } from "./inputs/InputNumber.js";
import { ColorInputOptions, InputColor } from "./inputs/InputColor.js";
import { ArrayInputOptions, InputArray } from "./inputs/InputArray.js";
import { InputText, TextInputOptions } from "./inputs/InputText.js";
import { ElementContent, ElementInputOptions, InputElement } from "./inputs/InputElement.js";
import { BezierInputOptions, BezierString, BezierValue, InputBezier } from "./inputs/InputBezier.js";
import { ButtonGridArrays, ButtonGridInputOptions, InputButtonGrid } from "./inputs/InputButtonGrid.js";
import { InputOptions, InputPreset, ValidInput, ValidInputValue } from "./inputs/Input.js";
import { Gooey } from "./Gooey.js";

//#region src/Folder.d.ts

/**
 * The input a string that isn't a {@link ColorFormat} literal resolves to.  A string literal
 * like `'hello'` is known to be text, but a wide `string` is only known at runtime, where a color
 * string like `'#ff0000'` builds an {@link InputColor} — so its input is either.
 */
type InferStringInput<T extends string> = string extends T ? InputText | InputColor : InputText;
/**
 * Resolves the provided value to the corresponding {@link InputOptions} type associated with the type
 * based on what type of {@link InputOptions.value|`value`} property it expects.
 */
type InferOptions<T> = T extends number ? NumberInputOptions : T extends boolean ? SwitchInputOptions : T extends ColorFormat ? ColorInputOptions : T extends string ? TextInputOptions : T extends LabeledOption<infer U>[] ? SelectInputOptions<U> : T extends {
  value: infer V;
  options: Array<infer V>;
} ? SelectInputOptions<V> : T extends Option<infer U> ? SelectInputOptions<U> : T extends Array<infer U> ? ArrayInputOptions<U> : T extends (() => void) ? ButtonInputOptions : InputOptions;
/**
 * Resolves any provided value to the corresponding {@link ValidInput} associated with the type.
 */
type InferInput<TValueType> = TValueType extends number ? InputNumber : TValueType extends boolean ? InputSwitch : TValueType extends ColorFormat ? InputColor : TValueType extends string ? InferStringInput<TValueType> : TValueType extends (() => void) ? InputButton : TValueType extends LabeledOption<infer U>[] ? InputSelect<U> : TValueType extends {
  value: infer V;
  options: Array<infer V>;
} ? InputSelect<V> : TValueType extends Option<infer U> ? InputSelect<U> : TValueType extends Array<infer U> ? InputArray<U> : ValidInput;
/**
 * Resolves a target object to a type that represents the same structure, but with all values
 * replaced with the corresponding input options type accepted by the input type that would be
 * @template TTarget - The target object being used to generate inputs.
 * @example
 * ```typescript
 * const target = {
 *   foo: 5,
 *   bar: 'baz',
 * }
 *
 * type TargetOptions = InferTargetOptions<typeof target>
 * //   ^?
 * {
 *   foo: NumberInputOptions,
 *   bar: TextInputOptions,
 * }
 * ```
 */
type InferTargetOptions<TTarget> = { [K in keyof TTarget]?: TTarget[K] extends LabeledOption<infer U>[] ? Partial<SelectInputOptions<U>> : TTarget[K] extends LabeledOption<infer U> ? Partial<SelectInputOptions<U>> : TTarget[K] extends {
  value: infer V;
  options: Array<infer V>;
} ? Partial<SelectInputOptions<V>> : TTarget[K] extends Array<infer U> ? Partial<ArrayInputOptions<U>> : TTarget[K] extends Function ? Partial<ButtonInputOptions> : TTarget[K] extends ColorFormat ? Partial<ColorInputOptions> : TTarget[K] extends object ? InferTargetOptions<TTarget[K]> & {
  folderOptions?: Partial<FolderOptions>;
} : Partial<InferOptions<TTarget[K]>> };
/**
 * Recursively resolves a target object into a flat array of all keys at all depths.
 * @template TTarget - The target object being used to generate inputs.
 */
type InferTargetKeys<TTarget> = TTarget extends object ? { [K in keyof TTarget]: K | InferTargetKeys<Exclude<TTarget[K], TTarget>> }[keyof TTarget] : never;
/**
 * The controls {@link Folder.addMany|`addMany`} and {@link Folder.bindMany|`bindMany`} read from
 * the same options bag as the per-key input options.
 */
type ManyControls<TTarget> = {
  /**
   * An array of keys to exclude from a target object when generating inputs.
   */
  exclude?: InferTargetKeys<TTarget>[];
  /**
   * An array of keys to include in a target object when generating inputs.
   */
  include?: InferTargetKeys<TTarget>[];
  /**
   * Maximum total number of properties to process across all depths (prevents browser crashes from large objects).
   * @default 50
   */
  maxSize?: number;
};
/**
 * The options bag for {@link Folder.addMany|`addMany`} and {@link Folder.bindMany|`bindMany`}:
 * per-key input options plus the {@link ManyControls}.  A target with a string index signature
 * gives its per-key options an index signature too, which every control would have to satisfy —
 * so there the index signature widens to admit the control values.
 */
type ManyOptions<TTarget, TOptions> = ManyControls<TTarget> & (string extends keyof TTarget ? { [K in keyof TOptions]: TOptions[K] | ManyControls<TTarget>[keyof ManyControls<TTarget>] } : TOptions);
/**
 * Resolves a target object to a type that represents the same structure, but with all values
 * replaced with the corresponding input type that would be generated by
 * {@link Folder.addMany|`addMany`} or {@link Folder.bindMany|`bindMany`}.
 * @template TTarget - The target object being used to generate inputs.
 */
type InferInputs<TTarget> = TTarget extends Record<string, any> ? { [K in keyof TTarget]: TTarget[K] extends number ? InputNumber : TTarget[K] extends boolean ? InputSwitch : TTarget[K] extends ColorString | ColorObject ? InputColor : TTarget[K] extends string ? InputText : TTarget[K] extends LabeledOption<infer U>[] ? InputSelect<U> : TTarget[K] extends {
  value: infer V;
  options: Array<infer V>;
} ? InputSelect<V> : TTarget[K] extends Array<infer U> ? InputArray<U> : TTarget[K] extends (() => void) ? InputButton : TTarget[K] extends object ? InferInputs<TTarget[K]> & {
  folder: Folder;
} : never } : never;
/**
 * Given a target object, recursively resolves all keys that are objects into a union of all
 * object keys.
 */
type FolderKeys<T> = { [K in keyof T]: T[K] extends ValidInputValue ? K : never }[keyof T];
type InferFolders<T> = T extends object ? { [K in FolderKeys<T>]: InferFolders<T[K]> & {
  folder: Folder;
} } : never;
interface FolderOptions {
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
 * A folder preset stores the state of a folder and all of its inputs, as well as the state of all
 * child folders and their inputs.
 */
interface FolderPreset {
  __type: 'FolderPreset';
  id: string;
  title: string;
  hidden: boolean;
  children: FolderPreset[];
  inputs: InputPreset<any>[];
}
interface FolderEvents {
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
  /**
   * Fires when the folder is opened.
   */
  open: void;
  /**
   * Fires when the folder is closed.
   */
  close: void;
}
/**
 * Folder is a container for organizing and grouping {@link Input|Inputs} and child Folders.
 *
 * This class should not be instantiated directly.  Instead, use the {@link Gooey.addFolder} and
 * {@link Folder.addFolder} methods.
 *
 * @example
 * ```typescript
 * const gooey = new Gooey()
 * const folder = gooey.addFolder({ title: 'My Folder' })
 * folder.addNumber({ title: 'foo', value: 5 })
 * ```
 */
declare class Folder {
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
  on: <K$1 extends keyof FolderEvents>(event: K$1, callback: EventCallback<FolderEvents[K$1]>) => string;
  /**
   * The pixel height of the folder header element.
   * @internal
   */
  private initialHeaderHeight;
  private _title;
  private _hidden;
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
   * Default maximum number of properties to process in addMany/bindMany.
   */
  private static _DEFAULT_MAX_SIZE;
  /**
   * The duration of the open/close and hide/show animations in ms.
   * @default 350
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
  set hidden(v: boolean | (() => boolean));
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
  /** {@link _handleClick} bound once, so dispose removes the same function the header got. */
  private _onHeaderPointerdown;
  private _handleClick;
  private _disableClicks;
  private _resetClicks;
  toggle: () => this;
  open(options?: {
    /**
     * Whether to update the folder's {@link closed} state.  Used internally to avoid loops.
     * @default true
     */
    updateState?: boolean;
    /**
     * Whether to open the folder instantly, bypassing the animation.
     * @default false
     */
    instant?: boolean;
  }): this;
  close(options?: {
    /**
     * Whether to update the folder's {@link closed} state.  Defaults to `false` to avoid
     * getting caught in a feedback loop.
     * @default true
     */
    updateState?: boolean;
    /**
     * Whether to open the folder instantly, bypassing the animation.
     * @default false
     */
    instant?: boolean;
  }): this;
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
  private _updateHiddenState;
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
  add<T>(title: string, initialValue: {
    value: T;
    options: Array<Option<T>>;
  }): InputSelect<T>;
  add<T, O extends {
    options: Array<any>;
  }>(title: string, initialValue: T, options: O): InputSelect<T>;
  add<T extends boolean>(title: string, initialValue: T, options?: SwitchInputOptions): InputSwitch;
  add<T extends number>(title: string, initialValue: T, options?: NumberInputOptions): InputNumber;
  add<T extends ColorFormat>(title: string, initialValue: T, options?: ColorInputOptions): InputColor;
  add<T extends string>(title: string, initialValue: T, options?: TextInputOptions): InferStringInput<T>;
  add<T extends (() => void)>(title: string, initialValue: T, options?: ButtonInputOptions): InputButton;
  add<T>(title: string, initialValue: T[], options?: ArrayInputOptions<T>): InputArray<T>;
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
   * Takes an object and generates a set of inputs based on the object's keys and values.  Any
   * nested objects will result in child folders being created.  Options can be passed to
   * customize the inputs generated, and to exclude/include specific keys.
   * @param target - The object to generate inputs from.
   * @param options - Options to customize the inputs generated, as well as `include` and
   * `exclude` arrays to omit certain keys.
   * @example
   * ```ts
   * const gui = new Gooey()
   *
   * const params = {
   *  myNumber: 5,
   * 	myFolder: {
   *    myOptions: 'foo',
   * 	}
   * }
   *
   * gui.addMany(params, {
   *   myFolder: {
   * folderOptions: title: 'My Folder' }}, // optional folder controls
   * })
   */
  addMany<T extends object, const TOptions extends InferTargetOptions<T> = InferTargetOptions<T>, const TInputs extends InferInputs<T> = InferInputs<T>>(target: T, options?: ManyOptions<T, TOptions>): {
    folders: InferFolders<T>;
    inputs: TInputs;
  };
  bindMany<const T extends object, const TOptions extends InferTargetOptions<T> = InferTargetOptions<T>, const TInputs extends InferInputs<T> = InferInputs<T>>(target: T, options?: ManyOptions<T, TOptions>): {
    inputs: TInputs;
    folders: InferFolders<T>;
  };
  private _walk;
  /**
   * Adds a new {@link InputNumber} to the folder.
   * @example
   * ```ts
   * const number = gui.addNumber('Foo', true)
   * number.on('change', console.log)
   * ```
   */
  addNumber(title: string, value?: number, options?: Partial<NumberInputOptions>): InputNumber;
  bindNumber<K$1 extends PropertyKey, T extends Record<K$1, number>>(target: T, key: K$1, options?: Partial<NumberInputOptions>): InputNumber;
  addText(title: string, value?: string, options?: TextInputOptions): InputText;
  bindText<K$1 extends PropertyKey, T extends Record<K$1, string>>(target: T, key: K$1, options?: Partial<TextInputOptions>): InputText;
  addColor(title: string, value?: ColorValue | (string & {}), options?: ColorInputOptions): InputColor;
  /**
   * Binds a color input to `target[key]`.  The field keeps the format it started in — a hex
   * string stays that hex string, an `{ h, s, l }` object stays that object, a Color stays a Color.
   */
  bindColor<K$1 extends PropertyKey, T extends Record<K$1, ColorValue | (string & {})>>(target: T, key: K$1, options?: Partial<ColorInputOptions>): InputColor;
  addButton(title: string, onclick: () => void, options?: ButtonInputOptions): InputButton;
  /**
   * Passes the function at `target[key]` to {@link addButton} as the `onclick` handler.
   */
  bindButton<K$1 extends PropertyKey, T extends Record<K$1, () => void>>(target: T, key: K$1, options?: Partial<ButtonInputOptions>): InputButton;
  addButtonGrid(title: string, value: ButtonGridArrays, options?: Partial<ButtonGridInputOptions>): InputButtonGrid;
  bindButtonGrid<K$1 extends PropertyKey, T extends Record<K$1, ButtonGridArrays>>(target: T, key: K$1, options?: Partial<ButtonGridInputOptions>): InputButtonGrid;
  /**
   * Adds a new {@link InputSelect} to the folder.
   * @example
   * ```ts
   * // Pattern 1: Value first, options in config (consistent with other inputs)
   * gui.addSelect('theme', 'light', { options: ['light', 'dark'] })
   *
   * // Pattern 2: Inline value+options object (skip 3rd param, works great with addMany)
   * gui.addSelect('theme', { value: 'light', options: ['light', 'dark'] })
   *
   * // Pattern 3: Labeled options (for non-primitives needing labels)
   * gui.addSelect('item', { value: 1, options: [{ value: 1, label: 'One' }, { value: 2, label: 'Two' }] })
   * ```
   */
  addSelect<T>(title: string, valueOrConfig: T | {
    value: T;
    options: Array<Option<T>>;
  }, options?: SelectInputOptions<NoInfer<T>> & {
    value?: NoInfer<T>;
    options?: Array<NoInfer<T>>;
  }): InputSelect<T>;
  /**
   * Binds an {@link InputSelect} to a target object property.
   * Requires `options` array to be provided in the options parameter.
   * @example
   * ```ts
   * const params = { theme: 'light' }
   * gui.bindSelect(params, 'theme', { options: ['light', 'dark'] })
   * ```
   */
  bindSelect<K$1 extends PropertyKey, T extends Record<K$1, unknown>>(target: T, key: K$1, options: Partial<SelectInputOptions<T[K$1]>> & {
    options: Array<T[K$1]>;
  }): InputSelect<T[K$1]>;
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
  bindSwitch<K$1 extends PropertyKey, T extends Record<K$1, boolean>>(target: T, key: K$1, options?: Partial<SwitchInputOptions>): InputSwitch;
  /**
   * Adds a new {@link InputArray} to the folder.
   * @example
   * ```ts
   * const array = gui.addArray('Items', ['a', 'b', 'c'])
   * array.on('change', console.log)
   * ```
   */
  addArray<T>(title: string, value: T[], options?: Partial<ArrayInputOptions<T>>): InputArray<T>;
  /**
   * Binds an {@link InputArray} to the array at the target object's key.
   * @example
   * ```ts
   * const params = { items: ['a', 'b', 'c'] }
   * const array = gui.bindArray(params, 'items')
   * ```
   */
  bindArray<K$1 extends PropertyKey, T extends Record<K$1, unknown[]>>(target: T, key: K$1, options?: Partial<ArrayInputOptions<T[K$1][number]>>): InputArray<T[K$1][number]>;
  /**
   * Adds a new {@link InputElement} to the folder, mounting arbitrary content in place of a
   * controller.  The content is either an existing element, or a mount function receiving the
   * container (and optionally returning a cleanup function).  It has no value to serialize, so
   * it's skipped when saving and loading presets.
   * @example
   * ```ts
   * gui.addElement('Notes', container => {
   * 	container.innerHTML = renderMarkdown(notes)
   * 	return () => container.replaceChildren()
   * })
   * ```
   */
  addElement(title: string, content: ElementContent, options?: Partial<ElementInputOptions>): InputElement;
  /**
   * Adds a new {@link InputBezier} to the folder: a cubic bézier curve editor whose value is
   * `[x1, y1, x2, y2]`, the arguments of CSS `cubic-bezier()`.  Also takes a
   * `'cubic-bezier(...)'` string or a CSS easing keyword like `'ease-out'`.
   * @example
   * ```ts
   * const ease = gui.addBezier('ease', [0.16, 1, 0.3, 1])
   * ease.on('change', ([x1, y1, x2, y2]) => console.log(x1, y1, x2, y2))
   * ```
   */
  addBezier(title: string, value?: BezierValue | BezierString, options?: Partial<BezierInputOptions>): InputBezier;
  /**
   * Binds an {@link InputBezier} to the curve at the target object's key.  The field keeps the
   * shape it started in -- an `[x1, y1, x2, y2]` array stays an array, and a string is written
   * back as a `cubic-bezier()` string.
   * @example
   * ```ts
   * const params = { ease: 'cubic-bezier(0.4, 0, 0.2, 1)' }
   * gui.bindBezier(params, 'ease')
   * ```
   */
  bindBezier<K$1 extends PropertyKey, T extends Record<K$1, BezierValue | number[] | string>>(target: T, key: K$1, options?: Partial<BezierInputOptions>): InputBezier;
  /**
   * Does validation / error handling.
   * If no title was provided, this method will also assign the binding key to the title.
   * @returns The processed options.
   */
  private _validateBinding;
  private _createInput;
  private _resolveBinding;
  /**
   * Attempts to determine the type of input to create based on the provided options.
   */
  private _resolveType;
  private _createElement;
  private _createElements;
  private _createGraphics;
  private _resolveHeaderHeight;
  get hue(): number;
  get scrollHeight(): number;
  private _refreshIcon;
  disposed: boolean;
  dispose(): void;
  /**
   * Add a button to the folder's toolbar.
   */
  addToolbarButton(config: ToolbarButtonConfig): ToolbarButton;
}
//#endregion
export { Folder, FolderOptions, FolderPreset };
//# sourceMappingURL=Folder.d.ts.map