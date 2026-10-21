import { State } from "../shared/state.js";
import { Tooltip } from "../shared/Tooltip.js";
import { Folder } from "../Folder.js";
import { ElementMap, Input, InputOptions } from "./Input.js";

//#region src/inputs/InputSwitch.d.ts

/**
 * Options for the {@link InputSwitch} class.
 */
type SwitchInputOptions = InputOptions<boolean> & {
  readonly __type?: 'SwitchInputOptions';
  /**
   * Text to display in various parts of the switch.
   */
  labels?: {
    /** Text to display when the state is `true` */
    true: {
      /**
       * Represents the `true` state, i.e. `'on' | 'active' | 'enabled'`
       * @default 'on'
       */
      state?: string;
      /**
       * Represents, i.e. `'turn on' | 'activate' | 'enable'`.
       * Displayed on the tooltip when the switch is `false`.
       * @default 'Enable'
       */
      verb?: string;
    };
    /** Text to display when the state is `false` */
    false: {
      /**
       * Represents the `false` state, i.e. `'off' | 'inactive' | 'disabled'`
       * @default 'off'
       */
      state?: string;
      /**
       * Represents the action, i.e. `'turn off' | 'deactivate' | 'disable'`.
       * Displayed on the tooltip when the switch is `true`.
       * @default 'Disable'
       */
      verb?: string;
    };
  };
};
interface SwitchInputElements extends ElementMap {
  container: HTMLElement;
  input: HTMLButtonElement & {
    tooltip: Tooltip;
  };
  thumb: HTMLDivElement;
  stateText: HTMLDivElement;
}
/**
 * A switch {@link Input} for booleans.
 */
declare class InputSwitch extends Input<boolean, SwitchInputOptions, SwitchInputElements> {
  #private;
  readonly __type: "InputSwitch";
  readonly state: State<boolean>;
  initialValue: boolean;
  constructor(options: Partial<SwitchInputOptions>, folder: Folder);
  set(v?: boolean): this;
  refresh(v?: boolean): this;
  dispose(): void;
}
//#endregion
export { InputSwitch, SwitchInputOptions };
//# sourceMappingURL=InputSwitch.d.ts.map