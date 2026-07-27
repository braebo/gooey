---
'gooey': minor
---

feat: `InputArray` — arrays passed to `add` / `bind` now resolve to a dedicated array input

feat: `addToolbarButton` — custom toolbar buttons on any folder

feat: `InputColor` accepts plain color strings

feat: `InputSelect` overhaul — improved `{ value, options }` and labeled-option handling

fix: `InputText` no longer fires a native `alert()` when exceeding `maxLength`

fix: `Gooey` constructor overload types (`new Gooey(title, options)`)

fix: JSR publish — renamed generated `gooey.css.ts` module so the raw `src` publish resolves under Deno

BREAKING: `add()` no longer infers `InputButtonGrid` from array values — use the explicit `addButtonGrid()` method. Arrays now default to `InputArray`.
