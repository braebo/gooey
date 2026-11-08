---
'gooey': patch
---

A bound `InputSelect`'s `refresh()` reads the target into the whole input. After an outside write, `.value` moved but `selected` and the dropdown stayed put (the dropdown on the option the input was created on), so the next look or pick started from the wrong option. Now all three follow the target, with no `change` event.

`InputSelect` records undo history, as the other inputs do. It never committed, so a pick couldn't be undone. An open menu is one undo step, however many options the pointer previewed on the way, and a cancel records nothing; `set()` from code is a step too. The preset menu keeps its own single step for a pick.
