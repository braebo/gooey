---
'gooey': patch
---

Opening a `ThemeEditor` no longer marks its draft dirty and repaints the target (the inputs it builds emit their starting values, and those aren't edits), and closing one with unsaved edits paints the stored theme again.
