---
'gooey': patch
---

Disposing a child gooey (one built with `parentGooey`, or with a shared window manager) now takes its window out of the shared manager. Before, the window's entry stayed in the manager's `windows` map along with its grab listener, and the drag and resize ResizeObservers kept watching the detached element. Every child opened and closed left one more set behind, and the manager's z-ordering walked all of them.
