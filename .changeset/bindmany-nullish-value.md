---
'gooey': patch
---

`bindMany` binds a `null` field through its `value` option, as its error message says to. `bindMany({ z: null }, { z: { value: 3 } })` threw a `TypeError` with the inputs ahead of it already built; now it writes `3` to `target.z` and binds a number input to it.
