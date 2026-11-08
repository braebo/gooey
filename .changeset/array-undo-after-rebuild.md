---
'gooey': patch
---

An array item's edit is the array's undo step. Undoing it sets the whole array back, so it still lands after the items were rebuilt by an outside write and `refresh()`, or by `set()`; before, the undo went to the item input the rebuild had disposed, spending the step with nothing changed.
