---
'gooey': patch
---

`bindMany`'s refusal of a bare labeled-options array reads its options. A key that `exclude` names, or that an `include` leaves out, is never walked, so it's no longer a type error either. A target that's refused at runtime (a cast labeled array, or a `null` field with no `value` option) throws before any input is built, where it used to leave the inputs ahead of it in the panel. `bindMany` has TSDoc now, including the cast that gets a generic wrapper past the type-level refusal: `gui.bindMany<typeof v>(v as any)`.
