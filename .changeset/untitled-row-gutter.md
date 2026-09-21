---
'gooey': patch
---

An untitled input row's content is centered in its row instead of sitting against the left edge.

An input with no title already zeroes `--gooey-input-section-1_width` to give the right side the full row, but the left column didn't actually collapse: `.gooey-input-title` keeps `padding-left: 4px` and `padding-right: 10px`, and `box-sizing: border-box` floors the element at that 14px however narrow the width says; the drawer toggle's `min-width: 0.33rem` added another 5px. Content mounted with `addElement('', node)` sat 19px from the left edge against 8px on the right.

The row now carries a `gooey-input-untitled` class that zeroes the title's padding and the toggle's width (a toggle with a description keeps its clickable strip), and gives the content area the same `0.5rem` on the left it already had on the right — measured 19.27px/8px before, 8px/8px after.
