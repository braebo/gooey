---
'gooey': patch
---

Undo works across a preset load. A load used to push a step whose target was the gooey itself, which has no `set()`, so the next undo threw and every undo after it hit the same step; a page that booted with a saved preset started with it on the stack. Now a pick in the preset menu is one undo step: undo brings back the values and the active preset from before the pick, unsaved changes included, and redo makes the pick again. `gooey.load()` from code, the boot load, and saving, renaming or deleting a preset record nothing.
