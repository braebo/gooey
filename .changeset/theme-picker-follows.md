---
'gooey': patch
---

The settings panel's `theme` picker follows the themer. A theme created after the panel was built (a copy the `ThemeEditor` saves) is listed without a reload, and a switch made elsewhere (`gooey.theme = …`, the editor) shows in the picker. Picking the title that's already active does nothing, so the picker showing a switch can't put the stored theme back over a draft the editor is previewing under that title. `InputSelect`'s `options` setter labels object options the way the constructor does (`labelKey`, then `label`, then `title`) where it used to label them with their JSON, and the menu's `options` list now keeps step with what's in it, so a `refresh` after an `options` reset no longer adds every option a second time.
