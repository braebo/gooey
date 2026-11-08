---
'gooey': patch
---

The `folders` that `addMany()` and `bindMany()` return are typed as they're built. A nested folder is `folders.a.subFolders.b.folder`; the type said `folders.a.b.folder`, which is `undefined` at runtime, and had no `subFolders` at all. It also listed every key of the target as a folder, numbers and selects included; now only the nested objects that become folders are in it.
