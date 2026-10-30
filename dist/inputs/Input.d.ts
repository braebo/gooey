import { Commit, UndoManager } from "../UndoManager.js";
import { State } from "../shared/state.js";
import { Tooltip, TooltipOptions } from "../shared/Tooltip.js";
import { EventCallback, EventManager } from "../shared/EventManager.js";
import { ColorFormat } from "../shared/color/types/colorFormat.js";
import { Color } from "../shared/color/color.js";
import { LabeledOption, Option } from "../controllers/Select.js";
import { InputSwitch, SwitchInputOptions } from "./InputSwitch.js";
import { ButtonInputOptions, InputButton } from "./InputButton.js";
import { InputSelect, SelectInputOptions } from "./InputSelect.js";
import { InputNumber, NumberInputOptions } from "./InputNumber.js";
import { ColorInputOptions, InputColor } from "./InputColor.js";
import { ArrayInputOptions, InputArray } from "./InputArray.js";
import { InputText, TextInputOptions } from "./InputText.js";
import { ElementInputOptions, InputElement } from "./InputElement.js";
import { BezierInputOptions, InputBezier } from "./InputBezier.js";
import { Folder } from "../Folder.js";
import { ButtonGridInputOptions, InputButtonGrid } from "./InputButtonGrid.js";
import { InputTextArea, TextAreaInputOptions } from "./InputTextArea.js";

//#region src/inputs/Input.d.ts
type InputType = (typeof INPUT_TYPES)[number];
type InputOptionType = (typeof INPUT_OPTION_TYPES)[number];
declare const INPUT_TYPE_MAP: Readonly<{
  InputText: "TextInputOptions";
  InputTextArea: "TextAreaInputOptions";
  InputNumber: "NumberInputOptions";
  InputColor: "ColorInputOptions";
  InputSelect: "SelectInputOptions";
  InputButton: "ButtonInputOptions";
  InputButtonGrid: "ButtonGridInputOptions";
  InputSwitch: "SwitchInputOptions";
  InputArray: "ArrayInputOptions";
  InputElement: "ElementInputOptions";
  InputBezier: "BezierInputOptions";
}>;
declare const INPUT_TYPES: readonly ("InputSelect" | "InputText" | "InputTextArea" | "InputNumber" | "InputColor" | "InputButton" | "InputButtonGrid" | "InputSwitch" | "InputArray" | "InputElement" | "InputBezier")[];
declare const INPUT_OPTION_TYPES: readonly ("TextInputOptions" | "TextAreaInputOptions" | "NumberInputOptions" | "ColorInputOptions" | "SelectInputOptions" | "ButtonInputOptions" | "ButtonGridInputOptions" | "SwitchInputOptions" | "ArrayInputOptions" | "ElementInputOptions" | "BezierInputOptions")[];
type BindTarget = Record<any, any>;
type BindableObject<T extends BindTarget, K extends keyof T = keyof T> = {
  target: T;
  key: K;
  initial?: T[K];
};
/**
 * The initial value of an input can be either a raw value, or a "binding"
 */
type ValueOrBinding<TValue = ValidInputValue, TBindTarget extends BindTarget = BindTarget> = {
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
type InputOptions<TValue = ValidInputValue, TBindTarget extends BindTarget = Record<any, any & TValue>> = {
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
   * state, in which case it is re-evaluated on every {@link Input.refresh}.
   * @default false
   */
  hidden?: boolean | (() => boolean);
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
  /**
   * Optional tooltip text to display when hovering over the input's title.
   */
  description?: string | (() => string);
  /**
   * When {@link description} is provided, these options can be used to customize the tooltip.
   */
  tooltipOptions?: Partial<TooltipOptions>;
} & ValueOrBinding<TValue, TBindTarget>;
type InputPreset<T extends ValidInputOptions> = Omit<InputOptions<T>, 'title' | 'saveable'> & {
  __type: InputOptionType;
  presetId: string;
  title: string;
  value: ValidInputValue;
  disabled: boolean;
  hidden: boolean;
  order: number;
  resettable: boolean;
};
interface ElementMap<T = unknown> {
  [key: string]: HTMLElement | HTMLInputElement | ElementMap | T;
}
type ValidInputValue = string | number | Color | ColorFormat | Option<any> | LabeledOption<any> | any[] | (() => void);
type ValidInputOptions = TextInputOptions | TextAreaInputOptions | NumberInputOptions | ColorInputOptions | SelectInputOptions<Option<any>> | ButtonInputOptions | ButtonGridInputOptions | SwitchInputOptions | ArrayInputOptions | ElementInputOptions | BezierInputOptions;
type ValidInput = InputText | InputTextArea | InputNumber | InputColor | InputSelect<Option<any>> | InputButton | InputButtonGrid | InputSwitch | InputArray | InputElement | InputBezier;
type InputEvents<T extends ValidInputValue = ValidInputValue> = {
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
declare abstract class Input<TValueType extends ValidInputValue = ValidInputValue, TOptions extends ValidInputOptions = InputOptions, TElements extends ElementMap = ElementMap, TEvents extends InputEvents = InputEvents<TValueType>, TType extends InputType = InputType, T__TYPE = (typeof INPUT_TYPE_MAP)[TType]> {
  folder: Folder;
  abstract readonly __type: TType;
  /**
   * A {@link State} observable, the source of truth for the input's value.  It can be subscribed
   * to with {@link State.subscribe} to listen for changes.
   */
  abstract state: State<TValueType>;
  /**
   * The initial value of the input when it was created, used for things like dirty checking and
   * the "reset to default" button.
   */
  abstract initialValue: ValidInputValue;
  /**
   * The options object used to create this input.  More specifically, the input's default
   * options merged with the options passed by the consumer.
   */
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
    drawerToggle: HTMLElement & {
      tooltip: Tooltip;
    };
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
  private _description;
  private _hidden;
  private _disabled;
  static DISABLED_DESCRIPTION: string;
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
  listen: <TTarget extends Element | Window | Document, TEventName extends keyof GlobalEventHandlersEventMap | (string & {}), TEventInstance extends (TEventName extends keyof GlobalEventHandlersEventMap ? GlobalEventHandlersEventMap[TEventName] & {
    target: TTarget;
  } : Event)>(element: TTarget, event: TEventName, callback: (e: TEventInstance) => void, options?: AddEventListenerOptions, groupId?: string) => string;
  on: <K extends keyof TEvents>(event: K, callback: EventCallback<TEvents[K]>) => string;
  private __log;
  constructor(options: TOptions & {
    __type: T__TYPE;
  }, folder: Folder);
  get value(): TValueType;
  set value(v: TValueType);
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
  /**
   * The index of the input in the folder relative to other inputs.  Setting or changing this
   * value will update the input's {@link element|`element`}'s order style property.
   */
  get index(): number;
  set index(v: number);
  get undoManager(): UndoManager | undefined;
  /**
   * The description of the input, displayed when hovering over the thin
   * tab element found on the far left of the input's row.
   */
  get description(): string;
  set description(v: string | (() => string));
  /**
   * Whether the input is disabled (non-interactive / dimmed).
   *
   * For dynamic disabled states, assign this to a function and it will be called whenever
   * {@link refresh} is called.  Keep in mind that calling {@link enable} or {@link disable}
   * will not prevent a dynamic disabled state function from running on the next {@link refresh}.
   */
  get disabled(): boolean;
  set disabled(v: boolean | (() => boolean));
  /**
   * Disables the input and any associated controllers. A disabled input can't be interacted
   * with, and its state can't be changed.
   */
  disable(): this;
  /**
   * Removes the disabled state from the input and any associated controllers.
   */
  enable(): this;
  /**
   * Updates the disabled state of the input container and the main input element if it exists.
   */
  private _refreshDisabled;
  /**
   * Completely hides the Input from view when set to `true`.
   */
  get hidden(): boolean;
  set hidden(v: boolean | (() => boolean));
  /**
   * Updates the hidden state of the input container.
   */
  private _refreshHidden;
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
  emit(event: keyof TEvents, v?: TValueType): this;
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
   * Refreshes the value of any controllers to match the current input state.
   */
  refresh(v?: TValueType): this;
  /**
   * Reads the bound field into state on {@link refresh}, so a write to the target from outside
   * gooey lands.
   */
  protected readBinding(): void;
  save(overrides?: Partial<InputPreset<TOptions>>): Omit<InputOptions<any, Record<any, any>>, "saveable" | "title"> & {
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
//#endregion
export { ElementMap, Input, InputEvents, InputOptionType, InputOptions, InputPreset, ValidInput, ValidInputValue };
//# sourceMappingURL=Input.d.ts.map