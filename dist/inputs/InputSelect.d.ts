import { State } from "../shared/state.js";
import { LabeledOption, Select } from "../controllers/Select.js";
import { Folder } from "../Folder.js";
import { ElementMap, Input, InputEvents, InputOptions, ValidInputValue } from "./Input.js";

//#region src/inputs/InputSelect.d.ts

type SelectInputOptions<T = ValidInputValue> = Omit<InputOptions<T | {
  label: string;
  value: T;
}>, 'onChange'> & {
  __type?: 'SelectInputOptions';
  onChange?: (value: LabeledOption<T>) => void;
  /**
   * For arrays of unlabeled objects, labelKey specifies a key to use as the label.
   * If none is provided, select will attempt to use a `label` or `title` key if they exist.
   * If neither exist, an error will be thrown.
   */
  labelKey?: T extends Record<infer K, any> ? K : string;
  value?: T;
  options?: Array<T>;
};
interface SelectControllerElements<T> extends ElementMap {
  container: HTMLElement;
  select: Select<T>['elements'];
}
interface SelectInputEvents<T> extends InputEvents<T> {
  /**
   * Emitted when an option is selected, providing the full LabeledOption.
   * Use this when you need access to both the value and label.
   */
  select: LabeledOption<T>;
  /**
   * Emitted when hovering over an option (preview).
   */
  preview: LabeledOption<T>;
  open: void;
  close: void;
  cancel: void;
}
declare class InputSelect<TValueType extends ValidInputValue = any> extends Input<TValueType, SelectInputOptions<TValueType>, SelectControllerElements<TValueType>, SelectInputEvents<TValueType>> {
  #private;
  readonly __type: "InputSelect";
  readonly initialValue: TValueType;
  /**
   * Reactive state containing the raw value (T, not LabeledOption<T>).
   * This is automatically kept in sync with `selected`.
   * Consistent with other Input types.
   */
  state: State<TValueType>;
  /**
   * The currently selected option (full LabeledOption<T> with both label and value).
   * This is the source of truth for the selection. When this changes, `state` is
   * automatically updated with the raw value.
   */
  selected: State<LabeledOption<TValueType>>;
  /**
   * The raw value of the currently selected option (just T, not LabeledOption<T>).
   * Consistent with other Input types.
   */
  get value(): TValueType;
  set value(v: TValueType);
  set options(v: SelectInputOptions['options']);
  /**
   * The options array of valid values for this select input.
   */
  get options(): LabeledOption<TValueType>[];
  /**
   * The select controller instance.
   */
  selectController: Select<TValueType>;
  /**
   * The currently selected option as a labeled option.
   */
  labeledSelection: LabeledOption<TValueType>;
  private _log;
  constructor(options: Partial<SelectInputOptions<TValueType>>, folder: Folder);
  resolveOptions(providedOptions: TValueType[]): LabeledOption<TValueType>[];
  resolveInitialValue(opts: SelectInputOptions<TValueType>): TValueType;
  resolveInitialLabel(initialValue: TValueType, opts: SelectInputOptions<TValueType>): string;
  get targetObject(): Record<any, any> | undefined;
  get targetKey(): any;
  get targetValue(): TValueType;
  set targetValue(v: TValueType);
  /**
   * Sets the value (required by base Input class).
   * This accepts the raw value and finds the corresponding option.
   */
  set(v: TValueType): void;
  /**
   * Selects the given {@link LabeledOption} and updates the ui.
   * Use this when you have the full labeled option.
   */
  select(value: LabeledOption<TValueType>): this;
  enable(): this;
  disable(): this;
  refresh: () => this;
  dispose(): void;
}
//#endregion
export { InputSelect, SelectInputOptions };
//# sourceMappingURL=InputSelect.d.ts.map