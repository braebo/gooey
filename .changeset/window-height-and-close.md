---
'gooey': minor
---

A window can be resized in height, and can carry a close button. `resizable` takes `{ sides, corners }` as well as a boolean, so a window asks for the bottom edge and corners at construction, where the grabbers are built (`true` stays left and right only). `onClose` puts a close button at the end of the root's header toolbar (pinned last with `order`, so a host's own header buttons sit before it) and calls it on a press; without it there's none. The terminal icon every folder carried, a `console.log` of the folder behind a `console.log` tooltip, is gone: it was a debugging aid that shipped.

The stored size's `height` is now the height picked on a vertical grabber, and `0` until one is: `resize()` and a left or right drag keep it, where before they wrote whatever the window measured. A window that sizes to its content no longer comes back from a reload frozen at a height nobody chose.
