---
'gooey': patch
---

`bindMany` and `addMany` no longer crash when a target key shares a name with a control option (`maxSize`, `exclude`, `include`) or with a stray non-object option — only an object is read as a key's input options, so `{ title: 'hi' }` with a top-level `title` binds instead of throwing `Cannot create property 'title' on string`. `exclude`, `include`, and `maxSize` now type-check on a target with a string index signature (`Record<string, …>`).
