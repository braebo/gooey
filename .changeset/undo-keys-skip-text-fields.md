---
'gooey': patch
---

Cmd/Ctrl+Z no longer swallows native undo in the page's text fields. Gooey's undo listener on `window` used to `preventDefault()` every Cmd+Z, whatever had focus, so a `<textarea>`, a text-type `<input>` or a `contenteditable` anywhere on a page with a gooey lost its own undo and redo. Those fields (shadow roots included) now keep the browser's undo, and so does any key a nearer handler already claimed, like a code editor's. Sliders, checkboxes and the rest of gooey's controls keep gooey's undo.

- `dispose()` now removes the listener. It used to stay on `window`, so a disposed gooey still answered Cmd+Z.
- Ctrl+Shift+Z redoes off mac, the same as Ctrl+Y.
