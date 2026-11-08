---
'gooey': patch
---

What `addElement` mounts can be selected and copied. The root is `user-select: none` so a drag on a control never selects its label, and every element input inherited it, so a card or a preview mounted there couldn't be copied from without a host stylesheet putting `user-select: text` back. `.gooey-input-element-container` now does that itself, one class deep, so a host's own lock (`.some-mode .gooey-root *`) still wins.
