---
'gooey': patch
---

A gooey built with `draggable: false` no longer makes its whole panel a drag handle. The pointer capture that came with it swallowed clicks inside the panel, including the reset-to-default button on every input. `resizable: false` is honoured the same way.
