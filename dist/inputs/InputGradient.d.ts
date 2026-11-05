import { State } from "../shared/state.js";
import { Color, ColorValue } from "../shared/color/color.js";
import { NumberController } from "../controllers/NumberController.js";
import { ColorMode, InputColor } from "./InputColor.js";
import { Folder } from "../Folder.js";
import { ElementMap, Input, InputOptionType, InputOptions, InputPreset, ValidInputValue } from "./Input.js";

//#region src/inputs/InputGradient.d.ts

/**
 * One stop of a {@link GradientValue}: a colour at a position along the gradient.
 */
type GradientStop = {
  /** Where the stop sits along the gradient, from `0` (the start) to `1` (the end). */
  offset: number;
  /** The stop's colour: `'#rrggbb'`, or `'#rrggbbaa'` when it isn't opaque. */
  color: string;
};
/**
 * A gradient's colour stops, sorted by `offset`.  Plain data, so it serializes as-is.
 */
type GradientValue = GradientStop[];
/**
 * What an {@link InputGradient} accepts as a stop: a full {@link GradientStop}, a stop whose
 * `offset` is left out, or a bare colour.  A missing offset spaces the stops evenly.  A colour is
 * a hex, `rgb()` or `hsl()` string, a CSS colour name, a colour object, or a {@link Color}.
 */
type GradientStopLike = string | Color | ColorValue | {
  offset?: number;
  color: string | Color | ColorValue;
};
type GradientInputOptions = InputOptions<GradientValue> & {
  readonly __type?: 'GradientInputOptions';
  /**
   * The increment a dragged stop snaps to, the step of the offset field, and the distance an
   * arrow key moves the focused stop.  Hold `shift` to move by `0.05` while dragging, or by ten
   * steps with the arrow keys.
   * @default 0.01
   */
  step?: number;
  /**
   * The format of the selected stop's colour fields.
   * @default 'hex'
   */
  mode?: ColorMode;
  /**
   * Whether the selected stop's colour picker starts open.
   * @default false
   */
  expanded?: boolean;
};
interface GradientInputElements extends ElementMap<InputColor | HTMLDivElement[]> {
  container: HTMLDivElement;
  /** The strip and its stops.  A press on the strip adds a stop. */
  track: HTMLDivElement;
  /** The gradient itself, over a checkerboard so transparency shows. */
  strip: HTMLDivElement;
  /** The lane the stop handles are positioned in, inset so the end stops aren't clipped. */
  stops: HTMLDivElement;
  /** A handle per stop, in `offset` order. */
  handles: HTMLDivElement[];
  /** The selected stop's editor. */
  editor: {
    container: HTMLDivElement;
    offset: HTMLInputElement;
    /** The selected stop's colour input: gooey's own colour picker. */
    color: InputColor;
  };
}
/**
 * Normalizes anything an {@link InputGradient} accepts into a fresh, sorted {@link GradientValue}:
 * offsets clamped into `0..1` (a missing one spaces the stops evenly), colours as hex.  Throws on
 * anything else, and on fewer than two stops.
 */
declare function toGradient(v: unknown): GradientValue;
/**
 * Renders a {@link GradientValue} as a CSS `linear-gradient()`.
 * @param direction - The gradient line's direction, as CSS takes it: `'90deg'`, `'to bottom'`...
 * @default 'to right'
 * @example
 * ```ts
 * gradientToString([{ offset: 0, color: '#000000' }, { offset: 1, color: '#ffffff' }])
 * // 'linear-gradient(to right, #000000 0%, #ffffff 100%)'
 * ```
 */
declare function gradientToString(stops: Readonly<GradientValue>, direction?: string): `linear-gradient(${string})`;
/**
 * The colour a {@link GradientValue} has at `t` (`0..1`), as `'#rrggbb'` or `'#rrggbbaa'`.
 * Blends in premultiplied sRGB, the way CSS paints a `linear-gradient()` of hex colours, so the
 * colour matches what the strip shows.  Before the first stop is the first colour, after the last
 * is the last.
 * @example
 * ```ts
 * const usage = gooey.addGradient('usage', ['#3b82f6', '#22c55e', '#eab308', '#ef4444'])
 * circle.style.color = sampleGradient(usage.value, 0.29)
 * ```
 */
declare function sampleGradient(stops: Readonly<GradientValue>, t: number): string;
/**
 * A gradient editor: a strip of the gradient with a handle per colour stop, and the selected
 * stop's offset and colour below it.  The colour is edited with gooey's own colour picker.  Its
 * value is a list of `{ offset, color }` stops, sorted by `offset` -- plain data that serializes
 * as-is, and that {@link gradientToString} and {@link sampleGradient} read.
 *
 * - Drag a stop to move it, or press the strip to add one there (it takes the colour already
 *   under it, and can be dragged straight away).
 * - Drag a stop off the strip, or press `Delete` / `Backspace` on a focused one, to remove it.
 *   A gradient keeps at least two stops.
 * - The arrow keys move a focused stop, by ten steps with `shift`.
 *
 * @example
 * ```ts
 * const heat = gooey.addGradient('heat', [
 * 	{ offset: 0, color: '#3b82f6' },
 * 	{ offset: 0.5, color: '#eab308' },
 * 	{ offset: 1, color: '#ef4444' },
 * ])
 * heat.on('change', stops => (el.style.background = gradientToString(stops)))
 * ```
 */
declare class InputGradient extends Input<GradientValue, GradientInputOptions, GradientInputElements> {
  #private;
  readonly __type: "InputGradient";
  readonly state: State<GradientValue>;
  initialValue: GradientValue;
  /** The selected stop's offset field. */
  offsetController: NumberController;
  /** The selected stop's colour input. */
  colorInput: InputColor;
  constructor(options: Partial<GradientInputOptions>, folder: Folder);
  /** The index of the selected stop -- the one the editor below the strip shows. */
  get selected(): number;
  /**
   * Selects the stop at `index`, so the offset field and colour picker edit it.
   */
  select(index: number): this;
  /**
   * Sets the gradient.  Takes `{ offset, color }` stops in any order, stops without an offset,
   * or bare colours (spaced evenly).  The value is stored sorted by offset, colours as hex.
   */
  set(v: ReadonlyArray<GradientStopLike>): this;
  refresh(v?: GradientValue): this;
  /**
   * Pulls the bound field into state on {@link refresh} -- only when it says a different
   * gradient, since an array never compares equal in the store and would re-notify forever.
   */
  protected readBinding(): void;
  enable(): this;
  disable(): this;
  save(overrides?: Partial<InputPreset<GradientInputOptions>>): Omit<InputOptions<any, Record<any, any>>, "title" | "saveable"> & {
    __type: InputOptionType;
    presetId: string;
    title: string;
    value: ValidInputValue;
    disabled: boolean;
    hidden: boolean;
    order: number;
    resettable: boolean;
  } & Partial<InputPreset<GradientInputOptions>>;
  load(json: InputPreset<GradientInputOptions> | string): void;
  dispose(): void;
}
//#endregion
export { GradientInputOptions, GradientStop, GradientStopLike, GradientValue, InputGradient, gradientToString, sampleGradient, toGradient };
//# sourceMappingURL=InputGradient.d.ts.map