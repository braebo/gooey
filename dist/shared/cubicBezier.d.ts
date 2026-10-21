//#region src/shared/cubicBezier.d.ts
/**
 * Creates an easing function from the control points of a cubic bézier curve, the same curve CSS
 * draws for `cubic-bezier(x1, y1, x2, y2)`.  The curve starts at `(0, 0)` and ends at `(1, 1)`;
 * the returned function maps a progress `t` in `0..1` to the curve's `y` at `x = t`.
 *
 * `x1` and `x2` must be in `0..1` (as in CSS) for the curve to be a function of `x`; `y1` and `y2`
 * can overshoot for back / anticipate style easings.
 *
 * @example
 * ```ts
 * const ease = cubicBezier(0.25, 0.1, 0.25, 1)
 * ease(0.5) // ~0.8
 *
 * // A value from an `InputBezier` spreads straight in:
 * const curve = cubicBezier(...gooey.addBezier('ease', [0.16, 1, 0.3, 1]).value)
 * ```
 */
declare function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number;
//#endregion
export { cubicBezier };
//# sourceMappingURL=cubicBezier.d.ts.map