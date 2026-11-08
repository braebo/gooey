---
'gooey': patch
---

`refresh()` re-reads a bound field whether or not the input is `resettable`. An input made with `resettable: false` returned before reading its binding, so an outside write to the target never landed in it (a bound select read its own, so it was the one exception). The `refresh` event now fires for those inputs too; only the reset button's dirty mark still depends on `resettable`.
