---
'gooey': minor
---

A bound color field keeps the format it started in — `bindColor({ color: '#0000ff' }, 'color')` no longer overwrites the field with a `Color` object.

- Hex (`#rrggbb`, `#rrggbbaa`, `#rgb`, `#rgba`), `rgb()`, `rgba()`, `hsl()`, `hsla()`, `{ r, g, b(, a) }`, `{ h, s, l(, a) }`, `{ h, s, v(, a) }`, and `{ kelvin }` fields stay in that format; a `Color` field stays a `Color`.
- The input keeps the full color: alpha set on a `#rrggbb` field holds, and a write to the field from outside lands on `refresh()`.
- `bindColor` rejects a field that isn't color-shaped at the type level.
- `hsl()` strings parse as hsl (they parsed as rgb).
- `Color` gains `hex3String`, `hex4String`, and `kelvinColor`.
