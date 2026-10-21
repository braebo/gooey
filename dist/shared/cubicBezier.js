//#region src/shared/cubicBezier.ts
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
function cubicBezier(x1, y1, x2, y2) {
	if (x1 === y1 && x2 === y2) return (t) => t;
	const cx = 3 * x1;
	const bx = 3 * (x2 - x1) - cx;
	const ax = 1 - cx - bx;
	const cy = 3 * y1;
	const by = 3 * (y2 - y1) - cy;
	const ay = 1 - cy - by;
	const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
	const sampleY = (t) => ((ay * t + by) * t + cy) * t;
	const sampleDX = (t) => (3 * ax * t + 2 * bx) * t + cx;
	/** Finds the curve parameter whose `x` is the given progress. */
	const solveX = (x) => {
		const epsilon = 1e-7;
		let t = x;
		for (let i = 0; i < 8; i++) {
			const err = sampleX(t) - x;
			if (Math.abs(err) < epsilon) return t;
			const d = sampleDX(t);
			if (Math.abs(d) < 1e-6) break;
			t -= err / d;
		}
		let lo = 0;
		let hi = 1;
		t = x;
		while (lo < hi) {
			const v = sampleX(t);
			if (Math.abs(v - x) < epsilon) return t;
			if (x > v) lo = t;
			else hi = t;
			const next = (lo + hi) / 2;
			if (next === t) break;
			t = next;
		}
		return t;
	};
	return (t) => {
		if (t <= 0) return 0;
		if (t >= 1) return 1;
		return sampleY(solveX(t));
	};
}

//#endregion
export { cubicBezier };
//# sourceMappingURL=cubicBezier.js.map