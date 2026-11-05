---
'gooey': minor
---

`addGradient` / `bindGradient`: a gradient editor input. Its value is a list of `{ offset, color }` stops, sorted by `offset` (`0..1`), with colours as `#rrggbb` (or `#rrggbbaa` when translucent) -- plain data that saves and serializes as-is. It also takes stops without an offset, or bare colours, spaced evenly.

- A strip of the gradient with a handle per stop: drag a stop to move it, press the strip to add one (coloured as the gradient already was there), and drag one off the strip or press `Delete` / `Backspace` to remove it. A gradient keeps at least two stops. The arrow keys move a focused stop.
- The selected stop's offset has a number field, and its colour is edited with gooey's own colour picker. A drag, a field drag, or a picker gesture is one undo step.
- It saves to presets and resets to its default like every other input.
- `gradientToString(stops, direction?)` renders a CSS `linear-gradient()`, and `sampleGradient(stops, t)` returns the colour at `t`, blended the way CSS paints it.
