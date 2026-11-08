---
'gooey': patch
---

An undo or redo of a color change no longer swallows the next change. The undo manager locked itself before replaying a commit and unlocked on the next commit it saw, but a color's replay writes its state without committing, so the lock stayed set and the next real change (to any input) never reached the history: undoing again skipped it, and the history and the panel fell out of sync. The lock now spans the replay alone.
