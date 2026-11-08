---
'gooey': patch
---

The `refresh` event fires once, with the value the refresh read. After an outside write to a bound field, it fired twice: first the new value, then the stale one from before the read.
