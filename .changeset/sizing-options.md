---
'gooey': minor
---

`minWidth`, `maxWidth` and `maxHeight` options, and root sizing defaults move out of the theme.

`--gooey-root_width/min-width/max-width/max-height` used to be theme vars written onto `.gooey-wrapper` on every theme apply, so a mode change clobbered any sizing a gooey had set for itself. Their defaults now live in `gooey.scss` as zero-specificity `:where(.gooey-root)` custom properties, and the new options write inline on `.gooey-root`. Var names are unchanged, so a consumer overriding them keeps working.

Each option takes `number | string` — a number is pixels, a string is a css length, `'none'` is unbounded — and has a matching getter/setter on the instance. `width` now also applies when `resizable: false`.
