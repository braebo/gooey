---
'gooey': patch
---

`bindMany()` refuses a bare array of labeled options (`{ arr: [{ label: 'one', value: 1 }, …] }`), as a type error and, past a cast, a thrown error that names the field. A bound select writes its pick to the field it's bound to, and here the field is the options: the input read the whole array back as its `.value`, and a pick wrote the bare value over the array. Bind `{ value, options }` instead, which has a `value` to write to. `addMany()` still builds a select from the bare array, starting on its first option.
