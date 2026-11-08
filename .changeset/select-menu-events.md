---
'gooey': patch
---

`InputSelect`'s `open`, `close`, `cancel` and `preview` events fire. They never did: the input listened for DOM events of those names on the dropdown, and the controller never dispatched any. Now `open` fires when the dropdown opens, `preview` with the option the pointer moves onto (which selects it while the menu is open), `close` when it closes, and `cancel` when Escape, a click outside, or a click on the menu itself closes it without a pick. Every cancel puts back the value the menu opened over: a click on the menu itself used to keep whatever option the pointer last previewed.
