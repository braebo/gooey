---
'gooey': minor
---

`bind()` and the `bind*` methods are typed by what they build and what they accept.

- `bind()` and `add()` on a `string` field return `InputText | InputColor`: a color string like `'#ff0000'` builds an `InputColor` at runtime, which the type used to hide. A color-typed field (`'#ff0000'` as a literal, or a `ColorString` type) is still `InputColor`, and a text literal is still `InputText`.
- `bindNumber`, `bindText`, `bindSwitch`, `bindArray`, `bindButton`, `bindButtonGrid`, and `bindSelect` reject a field of another type at the type level, as `bindColor` does.
- `bindArray` returns `InputArray` typed by the field's items, and `bindSelect` returns `InputSelect` typed by the field.
