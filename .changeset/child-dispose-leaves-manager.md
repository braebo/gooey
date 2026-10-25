---
'gooey': patch
---

Disposing a child gooey (one built with `parentGooey`, or with a shared window manager) now frees it. Before this fix, a disposed child left four things behind. First, its window stayed in the shared manager's `windows` map with its grab listener, and its drag and resize ResizeObservers kept watching the detached element. Second, its folders' subscriptions stayed live on the shared themer, which kept the whole child and its DOM reachable. Third, its resizable `<style>` stayed in `document.head`. Fourth, every disposed folder gained a `pointerdown` listener on its header, because dispose added one where it should have removed it. Each child opened and closed added another set.
