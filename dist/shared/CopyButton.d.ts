import { Tooltip } from "./Tooltip.js";
import { CopySVG } from "../svg/CopySVG.js";
import { ValidInput } from "../inputs/Input.js";

//#region src/shared/CopyButton.d.ts
declare class CopyButton {
  #private;
  container: HTMLElement;
  text: () => string;
  message: string;
  input?: ValidInput | undefined;
  button: HTMLDivElement;
  icon: CopySVG;
  /**
   * When the copy animation is active, this is `true` and the button has an `active` class.
   */
  active: boolean;
  /**
   * When the copy animation is outroing, this is `true` and the button has an `outro` class.
   */
  outro: boolean;
  tooltip: Tooltip;
  constructor(container: HTMLElement, text: () => string, message?: string, input?: ValidInput | undefined);
  copy: () => void;
}
//#endregion
export { CopyButton };
//# sourceMappingURL=CopyButton.d.ts.map