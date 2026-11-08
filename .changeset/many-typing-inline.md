---
'gooey': minor
---

`addMany()` types an inline string by its literal, as `add()` does: `addMany({ bg: '#ff0000' }).inputs.bg` is `InputColor` and `addMany({ name: 'gooey' }).inputs.name` is `InputText` (a field typed plain `string` is still `InputText | InputColor`). `addMany()` and `bindMany()` type an inline select or array by its widened items: `{ value: 'a', options: ['a', 'b'] }` is `InputSelect<string>` and `[1, 2]` is `InputArray<number>`, where `bindMany()` used to type them as readonly tuples of inputs. A select whose options are labeled (`{ label, value }`) is `InputSelect` of the option values, where it used to be a union of the values and the options themselves. A declared select or array keeps its item type (`InputSelect<'light' | 'dark'>`), `readonly` or not; a declared `as const` tuple widens like an inline one.
