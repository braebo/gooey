---
'gooey': patch
---

- Inputs re-evaluate a function-valued `disabled` (and `hidden`) on every `refresh()`, so a callback that flips back to enabled or visible takes effect; `InputSwitch` no longer bails out of `refresh()` while disabled.
- A persisted or initial size no longer pins an element's height unless it can actually be resized vertically — a root gooey with left/right grabbers shrinks again when its folders collapse.
- Test suite runs under vitest's playwright provider (chromium) instead of webdriverio.
