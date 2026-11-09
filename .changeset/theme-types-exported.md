---
'gooey': patch
---

The theme types are exported (`Theme`, `ThemeDefinition`, `Themer`, `ThemerOptions`, `ThemeMode`, `ThemeVariant`, `ThemeColors`, `ColorDefinition`, `ColorTheme`, `BaseColors`, `ModeColors`, `VariableDefinition`, `ExtendedVars`), and the `themes` option takes a `ThemeDefinition`, the shape a theme is written in, since the themer resolves it anyway. A theme that leaves out `prefix` now writes `--gooey-*` vars; it used to write `--fractils-*` ones and change nothing. The `ThemeEditor` window reads "Theme Editor · <theme>" instead of the edited panel's title, and an open select dropdown picks up a CSS variable overridden on `.gooey-root`, which it never inherited because it mounts outside the root.
