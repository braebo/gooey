---
'gooey': patch
---

The stylesheet's reset now sits in a `gooey-reset` cascade layer; the rest stays unlayered. A page that layers its own globals declares `gooey-reset` first (`@layer gooey-reset, reset, globals;`) so its button and input rules reach gooey's controls while gooey's class rules still win. A page with no layers sees no change.
