---
'gooey': minor
---

`addMany()` and `bindMany()` type a plain `string` field as `InputText | InputColor`, the way `add()` and `bind()` do. A color string like `'#ff0000'` builds an `InputColor` at runtime, but `addMany({ bg: '#ff0000' }).inputs.bg` was typed `InputText`. A color-typed field (a `ColorString` type, or a color literal `bindMany` keeps) is still `InputColor`, and a text literal is still `InputText`.
