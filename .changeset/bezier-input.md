---
'gooey': minor
---

`addBezier` / `bindBezier`: a cubic bézier curve editor input. Its value is `[x1, y1, x2, y2]`, the arguments of CSS `cubic-bezier()`, and it also takes a `'cubic-bezier(...)'` string or a CSS easing keyword.

- A graph with two draggable control points (`x` held to `0..1`, `y` free to overshoot within `yMin` / `yMax`), a number field per coordinate, and a dropdown of named easings that previews each on hover. A drag, a field drag, or an open dropdown is one undo step.
- It saves to presets and resets to its default like every other input.
- A bound string field is written back as a `cubic-bezier()` string; a bound array stays an array.
- `cubicBezier(x1, y1, x2, y2)` returns the easing function for a curve, and `bezierToString` / `toBezier` convert between the array and the CSS string.
