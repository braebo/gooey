---
'gooey': patch
---

`bindMany` treats an `undefined` field like a `null` one: it binds through a `value` option, written to the field, and without one the target is refused before any input is built. It used to throw "Failed to resolve the input type" with the inputs ahead of it left in the panel.
