import { State } from "../shared/state.js";
import { ColorFormat } from "../shared/color/types/colorFormat.js";
import { Color } from "../shared/color/color.js";
import { ColorComponents, ColorComponentsElements } from "../controllers/color/ColorComponents.js";
import { ColorPicker, ColorPickerElements } from "../controllers/color/ColorPicker.js";
import { CopyButton } from "../shared/CopyButton.js";
import { Folder } from "../Folder.js";
import { ElementMap, Input, InputOptionType, InputOptions, InputPreset, ValidInputValue } from "./Input.js";

//#region src/inputs/InputColor.d.ts

type ColorMode = (typeof COLOR_MODES)[number];
declare const COLOR_MODES: readonly ["rgba", "rgbaString", "hsla", "hslaString", "hex", "hex8"];
interface ColorControllerElements extends ElementMap<ColorPicker> {
  container: HTMLDivElement;
  /**
   * A color swatch that displays the current color and toggles the color-picker when clicked.
   */
  currentColor: {
    container: HTMLDivElement;
    displayBackground: HTMLDivElement;
    display: HTMLDivElement;
    copyButton: CopyButton;
  };
  /**
   * The main input content body.
   */
  body: {
    container: HTMLDivElement;
    /**
     * All elements related to the color picker.
     */
    picker: ColorPickerElements;
    /**
     * Number controllers for rgb/hsl/hsv components.
     */
    components: ColorComponentsElements;
  };
}
type ColorInputOptions = {
  __type?: 'ColorInputOptions';
  mode?: ColorMode;
  expanded?: boolean;
  onChange?: (value: Color) => void;
} & InputOptions<ColorFormat | Color>;
declare class InputColor extends Input<Color, ColorInputOptions, ColorControllerElements> {
  #private;
  readonly __type: "InputColor";
  initialValue: Color;
  state: State<Color>;
  /**
   * The color picker instance.
   */
  picker: ColorPicker;
  /**
   * RGBA/HSLA/HSVA number component inputs.
   */
  components: ColorComponents;
  /**
   * When `true`, the color picker is visible.
   */
  expanded: boolean;
  private _mode;
  get mode(): ColorMode;
  set mode(v: ColorMode);
  private _log;
  /**
   * The Color accessor that projects the input's color into the bound field's own format.
   */
  private _accessor?;
  constructor(options: Partial<ColorInputOptions>, folder: Folder);
  set(v: ColorFormat | Color): this;
  refresh: (v?: Color) => this;
  /**
   * The input owns the color and the field holds its projection, so the field is read only when
   * it differs from that projection — a write from outside lands, while what the field's format
   * can't hold (alpha on a `#rrggbb` field) stays with the input.
   */
  protected readBinding(): void;
  private _createCurrentColor;
  private get _pickerContainer();
  togglePicker: () => Promise<void>;
  open: () => Promise<void>;
  close: (duration?: number) => Promise<void>;
  /**
   * Prevents the range slider from registering undo history commits while dragging on the
   * canvas, storing the initial value on pointerdown for the eventual commit in {@link unlock}.
   */
  private _lock;
  /**
   * Saves the commit stored in #lock on pointerup.
   */
  private _unlock;
  enable(): this;
  disable(): this;
  save(): Omit<InputOptions<any, Record<any, any>>, "saveable" | "title"> & {
    __type: InputOptionType;
    presetId: string;
    title: string;
    value: ValidInputValue;
    disabled: boolean;
    hidden: boolean;
    order: number;
    resettable: boolean;
  } & Partial<InputPreset<ColorInputOptions>>;
  load(json: string | InputPreset<ColorInputOptions>): void;
  dispose(): void;
}
//#endregion
export { ColorInputOptions, ColorMode, InputColor };
//# sourceMappingURL=InputColor.d.ts.map