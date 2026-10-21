import { State } from "../shared/state.js";
import { Tooltip } from "../shared/Tooltip.js";
import { NumberButtonsController } from "../controllers/NumberButtonsController.js";
import { NumberController } from "../controllers/NumberController.js";
import { Folder } from "../Folder.js";
import { ElementMap, Input, InputOptions } from "./Input.js";

//#region src/inputs/InputNumber.d.ts
interface NumberControllerElements extends ElementMap {
  /** The main container for the number input. */
  container: HTMLElement;
  /** Increment/decrement buttons. */
  buttons: {
    container: HTMLDivElement;
    increment: HTMLDivElement;
    decrement: HTMLDivElement;
  };
  /** The text input. */
  input: HTMLInputElement & {
    tooltip: Tooltip;
  };
  /** The range slider. */
  slider: HTMLInputElement;
}
type NumberInputOptions = {
  readonly __type?: 'NumberInputOptions';
  /**
   * The minimum value (lowest/inclusive).
   * @defaultValue 0 for positive numbers, `initialValue * 2` for negative numbers.
   */
  min?: number;
  /**
   * The maximum value (highest/inclusive).
   * @defaultValue `initialValue * 2` for positive numbers, `initialValue * -2` for negative numbers.
   */
  max?: number;
  /**
   * The amount to increment/decrement by.
   * @defaultValue 0.001 if the value is small (less than 10), otherwise 0.1
   */
  step?: number;
} & InputOptions<number>;
/**
 * A combined input with a traditional text input, increment/decrement buttons, and a slider.
 *
 * @example
 * ```ts
 * gooey.add('foo', 0)
 * gooey.addNumber('bar', 10)
 * gooey.bind({ baz: 100 }, 'baz')
 * ```
 *
 * Hold down `cmd`/`ctrl` to snap to drag the number text input.
 *
 * Hold down `shift` to double the step, and `option`/`alt` to halve it (this works both on the slider, and when dragging the text input).
 */
declare class InputNumber extends Input<number, NumberInputOptions, NumberControllerElements> {
  readonly __type: "InputNumber";
  private _log;
  initialValue: number;
  state: State<number>;
  dragEnabled: boolean;
  numberController: NumberController;
  numberButtonsController: NumberButtonsController;
  constructor(options: Partial<NumberInputOptions>, folder: Folder);
  set: (v?: number | Event) => this | undefined;
  refresh: () => this;
  dispose(): void;
}
//#endregion
export { InputNumber, NumberInputOptions };
//# sourceMappingURL=InputNumber.d.ts.map