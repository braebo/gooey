---
'gooey': patch
---

`InputSelect`'s `open`, `close`, `cancel` and `preview` events fire. They never did: the input listened for DOM events of those names on the dropdown, and the controller never dispatched any. Now `open` fires when the dropdown opens, `preview` with the option the pointer moves onto (which selects it while the menu is open), `close` when it closes, and `cancel` when Escape or a click outside closes it without a pick, or a click on the menu itself does.
