---
'gooey': patch
---

`bindMany()` on an inline `{ value, options }` field binds the select to that object's `value`. Before, the input read the whole object back as its `.value` (the `addMany()` twin gave the value), and a pick wrote the bare value over the field, dropping its `options`. Now `bindMany({ theme: { value: 'light', options: ['light', 'dark'] } }).inputs.theme.value` is `'light'`, and a pick writes `target.theme.value`.
