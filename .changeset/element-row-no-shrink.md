---
'gooey': patch
---

An `addElement` row keeps its content's height when the panel is taller than the root's max-height. The folder content is a flex column, so past the cap every row shrank toward its `min-height`; a controller's floor is its own height, but an element row's is one line, so it collapsed and its content spilled over the rows below it. The row no longer shrinks, and the root scrolls instead.
