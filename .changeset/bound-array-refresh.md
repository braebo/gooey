---
'gooey': patch
---

`refresh()` re-reads a bound array. `InputArray` turned its binding off around the refresh, so an outside write to the target, a new array or the same one changed in place, never reached its items. It now reads the field when it holds something other than what the items show, and rebuilds them, with no `change` event and no undo step. Editing an item still keeps the item inputs in place.
