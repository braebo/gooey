import { State } from "../shared/state.js";
import { Select } from "../controllers/Select.js";
import { NumberController } from "../controllers/NumberController.js";
import { Folder } from "../Folder.js";
import { ElementMap, Input, InputOptionType, InputOptions, InputPreset, ValidInputValue } from "./Input.js";

//#region src/inputs/InputBezier.d.ts

/**
 * The control points of a cubic bézier easing curve, `[x1, y1, x2, y2]` -- the four arguments of
 * CSS `cubic-bezier()`.  The curve runs from `(0, 0)` to `(1, 1)`.
 */
type BezierValue = [x1: number, y1: number, x2: number, y2: number];
/**
 * The CSS easing keywords that are cubic béziers.
 */
type BezierKeyword = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
/**
 * A CSS easing string an {@link InputBezier} accepts in place of a {@link BezierValue}:
 * `'cubic-bezier(0.25, 0.1, 0.25, 1)'`, or one of the {@link BezierKeyword}s.
 */
type BezierString = `cubic-bezier(${string})` | BezierKeyword;
type BezierInputOptions = InputOptions<BezierValue> & {
  readonly __type?: 'BezierInputOptions';
  /**
   * The named curves in the input's dropdown.  Picking one sets the curve; hovering one in the
   * open dropdown previews it.  `false` hides the dropdown.
   * @default {@link BEZIER_EASINGS}
   */
  easings?: Record<string, BezierValue> | false;
  /**
   * The lowest `y` a control point can be dragged to.  Below `0` makes room for anticipation
   * curves.  Only dragging is clamped -- `set` takes any `y`, as CSS does.
   * @default -0.5
   */
  yMin?: number;
  /**
   * The highest `y` a control point can be dragged to.  Above `1` makes room for overshoot
   * ("back") curves.
   * @default 1.5
   */
  yMax?: number;
  /**
   * The increment a drag snaps to, and the step of the number fields.  Hold `shift` while
   * dragging a control point to snap to `0.05`.
   * @default 0.01
   */
  step?: number;
  /**
   * Whether a dot runs along the curve after each change, to show how the easing feels.
   * @default true
   */
  preview?: boolean;
  /**
   * How long one `preview` run lasts, in milliseconds.
   * @default 750
   */
  previewDuration?: number;
};
/**
 * The curves offered by default in an {@link InputBezier}'s dropdown: the CSS keywords, plus a few
 * common out-curves.
 */
declare const BEZIER_EASINGS: Readonly<{
  readonly linear: readonly [0, 0, 1, 1];
  readonly ease: readonly [0.25, 0.1, 0.25, 1];
  readonly 'ease-in': readonly [0.42, 0, 1, 1];
  readonly 'ease-out': readonly [0, 0, 0.58, 1];
  readonly 'ease-in-out': readonly [0.42, 0, 0.58, 1];
  readonly 'out-expo': readonly [0.16, 1, 0.3, 1];
  readonly 'out-quint': readonly [0.22, 1, 0.36, 1];
  readonly 'out-back': readonly [0.34, 1.56, 0.64, 1];
}>;
interface BezierInputElements extends ElementMap<SVGElement> {
  container: HTMLDivElement;
  /** The named-easing dropdown's container, empty and hidden when `easings` is `false`. */
  select: HTMLDivElement;
  graph: {
    svg: SVGSVGElement;
    frame: SVGRectElement;
    diagonal: SVGLineElement;
    arm1: SVGLineElement;
    arm2: SVGLineElement;
    curve: SVGPathElement;
    start: SVGCircleElement;
    end: SVGCircleElement;
    handle1: SVGCircleElement;
    handle2: SVGCircleElement;
    dot: SVGCircleElement;
    railDot: SVGCircleElement;
  };
  fields: {
    container: HTMLDivElement;
    x1: HTMLInputElement;
    y1: HTMLInputElement;
    x2: HTMLInputElement;
    y2: HTMLInputElement;
  };
}
/**
 * Normalizes a {@link BezierValue} or {@link BezierString} into a fresh `[x1, y1, x2, y2]` array,
 * clamping `x1` and `x2` into `0..1`.  Throws on anything else.
 */
declare function toBezier(v: unknown): BezierValue;
/**
 * Renders a {@link BezierValue} as a CSS `cubic-bezier()` string.
 */
declare function bezierToString(v: Readonly<BezierValue>): `cubic-bezier(${string})`;
/**
 * A cubic bézier curve editor: a graph with two draggable control points, a field for each of the
 * four numbers, and a dropdown of named easings.  Its value is `[x1, y1, x2, y2]`, the arguments
 * of CSS `cubic-bezier()`; it also accepts a `'cubic-bezier(...)'` string or a CSS easing keyword.
 *
 * A field bound with {@link Folder.bindBezier|`bindBezier`} keeps the shape it started in -- an
 * array stays an array, a string is written back as a `cubic-bezier()` string.
 *
 * @example
 * ```ts
 * const ease = gooey.addBezier('ease', [0.16, 1, 0.3, 1])
 * ease.on('change', v => (el.style.transitionTimingFunction = bezierToString(v)))
 *
 * const params = { ease: 'cubic-bezier(0.4, 0, 0.2, 1)' }
 * gooey.bindBezier(params, 'ease')
 * ```
 */
declare class InputBezier extends Input<BezierValue, BezierInputOptions, BezierInputElements> {
  #private;
  readonly __type: "InputBezier";
  readonly state: State<BezierValue>;
  initialValue: BezierValue;
  /** The dropdown of named easings, absent when `easings` is `false`. */
  selectController?: Select<BezierValue>;
  /** The four number fields, in `[x1, y1, x2, y2]` order. */
  numberControllers: NumberController[];
  constructor(options: Partial<BezierInputOptions>, folder: Folder);
  /**
   * Sets the curve.  Takes `[x1, y1, x2, y2]`, a `'cubic-bezier(...)'` string, or a CSS easing
   * keyword; `x1` and `x2` are clamped into `0..1`.
   */
  set(v: BezierValue | BezierString | Readonly<BezierValue> | number[]): this;
  refresh(v?: BezierValue): this;
  /**
   * Pulls the bound field into state on {@link refresh} -- only when it says a different curve,
   * since an array never compares equal in the store and would re-notify forever.
   */
  protected readBinding(): void;
  save(overrides?: Partial<InputPreset<BezierInputOptions>>): Omit<InputOptions<any, Record<any, any>>, "saveable" | "title"> & {
    __type: InputOptionType;
    presetId: string;
    title: string;
    value: ValidInputValue;
    disabled: boolean;
    hidden: boolean;
    order: number;
    resettable: boolean;
  } & Partial<InputPreset<BezierInputOptions>>;
  load(json: InputPreset<BezierInputOptions> | string): void;
  dispose(): void;
}
//#endregion
export { BEZIER_EASINGS, BezierInputOptions, BezierKeyword, BezierString, BezierValue, InputBezier, bezierToString, toBezier };
//# sourceMappingURL=InputBezier.d.ts.map