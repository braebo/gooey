---
'gooey': patch
---

`addMany()` and `bindMany()` type their inputs the way they build them. A nested folder's `inputs.a` holds only its inputs; the type also promised `inputs.a.folder`, which was `undefined` (the Folder is `folders.a.folder`). A plain `{ r, g, b }` object builds a folder of numbers, and the type said `InputColor`; only a `Color` instance builds a color. An array is a select only when its items are labeled options with nothing but `label` and `value`, which is the check the runtime makes, so `[{ label, value, note }]` is an `InputArray` and `any[]` binds. The theme picker in the panel's settings records no undo step, the same as the mode buttons beside it, so ⌘Z undoes your own values and leaves the theme alone.
