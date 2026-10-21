---
'gooey': patch
---

`storage: { presets: false }` now turns preset storage off, as `PresetManager`'s `localStorageKey` documents. It used to fall back to a shared `gooey::presets` key, so every gooey with presets off read and wrote the same active preset, and on construction loaded whatever another gooey had left there, `hidden` included. A gooey created with `hidden: true` would then come up shown.

A gooey that relied on presets surviving a reload with `presets: false` should set `storage: { presets: true }`, which gives it its own key.
