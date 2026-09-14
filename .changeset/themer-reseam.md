---
'gooey': minor
---

Themer reseam — one writer per element, and user themes persist.

- `Themer.attach(el)` / `detach(el)` replace `addTarget`; every target gets the css vars and the `theme` / `mode` attributes on each apply. `ThemerOptions.wrapper` is gone — the owning gooey builds its themer on `.gooey-wrapper`, and each gooey stamps its own `.gooey-root`, so a child under `parentGooey` now follows the shared theme and mode instead of freezing on its first stamp.
- `gooey.theme = 'scout'` switches the themer (shared across a `parentGooey` family) instead of only stamping an attribute; a child's `theme` option is ignored.
- Disposing a child no longer disposes the parent's themer.
- `Themer.userThemes` — themes added with `create()` persist under `<key>::themes` and merge over the code's themes by title. The old `save` / `load` / `toJSON` / `fromJSON` are removed: their keys never matched, and a stored array shadowed edits to themes in source.
- `create()` actually adds the theme now; a storage-less gooey no longer persists under a literal `'undefined'` key; `storage.theme: false` really disables theme persistence.
