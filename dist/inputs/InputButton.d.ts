import { State } from "../shared/state.js";
import { ButtonController } from "../controllers/ButtonController.js";
import { Folder } from "../Folder.js";
import { ElementMap, Input, InputEvents, InputOptions } from "./Input.js";

//#region src/inputs/InputButton.d.ts
type ButtonClickFunction = (this: InputButton) => void;
type ButtonInputOptions = InputOptions<ButtonClickFunction> & {
  readonly __type?: 'ButtonInputOptions';
  text?: string | (() => string);
  /**
   * The function to call when the button is clicked.
   */
  value?: ButtonClickFunction;
  /**
   * An alias for {@link value} (does the same thing).
   */
  onClick?: ButtonClickFunction;
};
interface ButtonControllerElements extends ElementMap {
  container: HTMLElement;
  button: HTMLButtonElement;
}
interface ButtonInputEvents extends InputEvents<InputButton> {
  click: void;
}
declare class InputButton extends Input<ButtonController, ButtonInputOptions, ButtonControllerElements, ButtonInputEvents> {
  readonly __type: "InputButton";
  readonly initialValue: ButtonController;
  readonly state: State<ButtonController>;
  onClick: ButtonClickFunction;
  button: ButtonController;
  private _log;
  constructor(options: Partial<ButtonInputOptions>, folder: Folder);
  get text(): string | (() => string);
  set text(v: string | (() => string));
  /**
   * Manually calls the {@link onClick} function.
   */
  click(): void;
  enable(): this;
  disable(): this;
  /**
   * Overwrites the button state.
   */
  set: (v: ButtonController | unknown) => void;
  /**
   * Refreshes the button text.
   */
  refresh(): this;
  /**
   * A bound button's field is its click handler, and its state is the {@link ButtonController},
   * so there's nothing to read back.  The base read would set the function as state, and a
   * function never compares equal in the store, so each read would re-run this refresh.
   */
  protected readBinding(): void;
  dispose(): void;
}
//#endregion
export { ButtonInputOptions, InputButton };
//# sourceMappingURL=InputButton.d.ts.map