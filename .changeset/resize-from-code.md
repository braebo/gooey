---
'gooey': minor
---

`Resizable.resize({ width, height })` — a window can be sized from code, not only by dragging a grabber.

- Either dimension can be omitted, and each is clamped to the `bounds` and the node's own computed `min-width` / `max-width` / `min-height` / `max-height`, exactly as a drag is. The min / max values used to be read only on the first grab, so a pre-grab resize would have clamped to `0`.
- `height` is ignored when no grabber could have changed it (no vertical `side`, no `corners`) — an inline height there pins the element forever.
- It writes the `size` state, so a `localStorageKey` persists the new size, and it fires `onResize` and the `resize` event a drag fires.
- `WindowInstance.resize` exposes it the way `moveTo` exposes the draggable's, and `WindowInstance.size` is now the resizable's own size state instead of a dead `{ width: 0, height: 0 }`.
