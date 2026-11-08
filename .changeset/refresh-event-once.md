---
'gooey': patch
---

The `refresh` event fires once, with the value the refresh read. After an outside write to a bound field, it fired twice: first the new value, then the stale one from before the read. Called from a select's `change` handler it fired the stale one first, and a bound select fired only the stale one.
