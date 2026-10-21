import { SetState } from "../shared/state.js";
import { CreateOptions } from "../shared/create.js";
import { ButtonController, ButtonControllerEvents, ButtonControllerOptions } from "../controllers/ButtonController.js";
import { Folder } from "../Folder.js";
import { ElementMap, Input, InputOptions } from "./Input.js";

//#region src/inputs/InputButtonGrid.d.ts

/**
 * @see {@link ButtonGridInputOptions.value}
 */
type ButtonGridArrays = ButtonControllerOptions[][];
/**
 * A unique identifier for a button in a {@link ButtonGridArrays} array.  Used as the key in the
 * {@link InputButtonGrid.buttons} map, as the value in the {@link InputButtonGrid.state} property,
 * and as the `id` attribute on the button element.
 */
type ButtonId = string;
/**
 * A fully processed {@link ButtonGridArrays} entry with the generated {@link ButtonController}s.
 * Stored in the input's {@link InputButtonGrid.buttonGrid|`buttonGrid`} property.
 */
type ButtonGrid = ButtonController[][];
/**
 * Options for the {@link InputButtonGrid} {@link Input}.
 */
type ButtonGridInputOptions = {
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
interface ButtonGridControllerElements extends ElementMap {
  container: HTMLElement;
  buttonGrid: HTMLButtonElement[];
}
declare class InputButtonGrid extends Input<Set<ButtonId>, ButtonGridInputOptions, ButtonGridControllerElements, ButtonControllerEvents> {
  readonly __type: "InputButtonGrid";
  readonly initialValue: ButtonGridArrays;
  /**
   * An array of active button ids.
   * @see {@link Input.state}
   */
  readonly state: SetState<string>;
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
//#endregion
export { ButtonGridArrays, ButtonGridInputOptions, InputButtonGrid };
//# sourceMappingURL=InputButtonGrid.d.ts.map