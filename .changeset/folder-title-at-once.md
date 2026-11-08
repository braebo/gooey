---
'gooey': minor
---

A folder's `title` setter writes the new title at once, as text. It used to write it only when a fade-out animation finished, which never happened on a hidden window or in a background tab, so `gooey.title` and the title shown disagreed; the fade-in now plays only where the title can be seen. A folder's title is written with `textContent`, no longer `innerHTML` (an input's title is unchanged there). Only a key-shaped title (letters, digits, `-` and `_`, the way `bindMany` makes them from keys) has its `-` and `_` read as spaces, in folders and inputs alike: `font_size` still shows `font size`, while `x-offset (px)` and `¯\_(ツ)_/¯` show as written. Ids derived under a renamed root (`gooey.title = …`) stay where they were, keyed on the root's id rather than its new title, so each folder's stored `closed` state survives renaming the root. A folder below the root still derives its children's ids from its current title.
