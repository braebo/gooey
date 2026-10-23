---
'gooey': patch
---

Cmd/Ctrl+Z no longer swallows native undo in the page's text fields. Gooey's undo listener on `window` used to `preventDefault()` every Cmd+Z, whatever had focus, so a `<textarea>`, a text-type `<input>` or a `contenteditable` anywhere on a page with a gooey lost its own undo and redo. Those fields (inside shadow roots too, closed ones included) now keep the browser's undo, and so does any key a nearer handler already claimed, like a code editor's. Sliders, checkboxes, gooey's own number fields and the rest of gooey's controls keep gooey's undo.

- `dispose()` now removes the listener. It used to stay on `window`, so a disposed gooey still answered Cmd+Z.
- Ctrl+Shift+Z redoes off mac, the same as Ctrl+Y.
- Gooey's number field keeps gooey's undo even though it's a text-type input: the browser doesn't undo its arrow, spinner or wheel steps, and gooey's history already holds each one.
- A key from inside a closed shadow root (an extension's UI, a closed web component) is left to the browser, since gooey can't see which field has focus there. An element with a `tabindex` (a skip-link `<main tabindex="-1">`, a dialog panel) still gets gooey's undo when it's focused, so a closed host that sets `tabindex` and holds a text field is the one case that still loses its native undo.
