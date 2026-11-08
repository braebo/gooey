import { Color } from "../../shared/color/color.js";
import { Disableable } from "../../shared/decorators/disableable-class-decorator.js";
import { Select } from "../Select.js";
import { ColorMode, InputColor } from "../../inputs/InputColor.js";

//#region src/controllers/color/ColorComponents.d.ts
interface ColorComponentsOptions {
  container?: HTMLDivElement;
  disabled: boolean | (() => boolean);
}
type ColorComponentsElements = {
  container: HTMLDivElement;
  title: HTMLDivElement;
  select: Select<ColorMode>['elements'];
  numbers: {
    a: HTMLInputElement;
    b: HTMLInputElement;
    c: HTMLInputElement;
    d: HTMLInputElement;
  };
  text: HTMLInputElement;
};
interface ColorComponents extends Disableable {}
declare class ColorComponents {
  #private;
  input: InputColor;
  opts: ColorComponentsOptions;
  element: HTMLDivElement;
  elements: ColorComponentsElements;
  select: Select<ColorMode>;
  private _evm;
  private _mode;
  /**
   * Used to prevent inputs from being refreshed externally after they're updated internally.
   */
  private _locked;
  private _log;
  constructor(input: InputColor, options?: Partial<ColorComponentsOptions>);
  get color(): Color;
  get mode(): ColorMode;
  set mode(v: ColorMode);
  updateMode: (v?: "rgba" | "rgbaString" | "hsla" | "hslaString" | "hex" | "hex8") => void;
  get a(): number;
  set a(v: number);
  get b(): number;
  set b(v: number);
  get c(): number;
  set c(v: number);
  get d(): number;
  set d(v: number);
  /**
   * Updates the UI to reflect the current state of the source color.
   */
  refresh: () => this;
  disable(): this;
  enable(): this;
  dispose(): void;
}
//#endregion
export { ColorComponents, ColorComponentsElements };
//# sourceMappingURL=ColorComponents.d.ts.map