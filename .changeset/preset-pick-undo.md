---
'gooey': patch
---

Undo works across a preset load. A load used to push a step whose target was the gooey itself, which has no `set()`, so the next undo threw and every undo after it hit the same step; a page that booted with a saved preset started with it on the stack. Now a pick in the preset menu is one undo step, however many options the pointer passed over on the way: undo brings back the values and the active preset from before the menu opened, unsaved changes included, and redo makes the pick again. Cancelling the menu (Escape, a click outside, or a click on the menu itself) puts back what it opened over, unsaved changes included, and records nothing. `gooey.load()` from code, the boot load, and saving, renaming or deleting a preset record nothing.
