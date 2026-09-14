# gooey

## 0.5.0

### Minor Changes

- A bound color field keeps the format it started in — `bindColor({ color: '#0000ff' }, 'color')` no longer overwrites the field with a `Color` object. ([`94c8741`](https://github.com/braebo/gooey/commit/94c874182328ea22229b8ae25a9a74c8269d34df))
    - Hex (`#rrggbb`, `#rrggbbaa`, `#rgb`, `#rgba`), `rgb()`, `rgba()`, `hsl()`, `hsla()`, `{ r, g, b(, a) }`, `{ h, s, l(, a) }`, `{ h, s, v(, a) }`, and `{ kelvin }` fields stay in that format; a `Color` field stays a `Color`.
    - The input keeps the full color: alpha set on a `#rrggbb` field holds, and a write to the field from outside lands on `refresh()`.
    - `bindColor` rejects a field that isn't color-shaped at the type level.
    - `hsl()` strings parse as hsl (they parsed as rgb).
    - `Color` gains `hex3String`, `hex4String`, and `kelvinColor`.

- `minWidth`, `maxWidth` and `maxHeight` options, and root sizing defaults move out of the theme. ([`a359682`](https://github.com/braebo/gooey/commit/a359682f7d12a6b5d9af473ad2ed5f644fa4d342))

    `--gooey-root_width/min-width/max-width/max-height` used to be theme vars written onto `.gooey-wrapper` on every theme apply, so a mode change clobbered any sizing a gooey had set for itself. Their defaults now live in `gooey.scss` as zero-specificity `:where(.gooey-root)` custom properties, and the new options write inline on `.gooey-root`. Var names are unchanged, so a consumer overriding them keeps working.

    Each option takes `number | string` — a number is pixels, a string is a css length, `'none'` is unbounded — and has a matching getter/setter on the instance. `width` now also applies when `resizable: false`.

    A resizable gooey wider than its bounds now shrinks with them (a window resize, a zoom) so the grabbers stay reachable — the 35rem cap used to do that by accident.

- Themer reseam — one writer per element, and user themes persist. ([`de15286`](https://github.com/braebo/gooey/commit/de152862b274d4bd28c2ba0c90494039da9b6f16))
    - `Themer.attach(el)` / `detach(el)` replace `addTarget`; every target gets the css vars and the `theme` / `mode` attributes on each apply. `ThemerOptions.wrapper` is gone — the owning gooey builds its themer on `.gooey-wrapper`, and each gooey stamps its own `.gooey-root`, so a child under `parentGooey` now follows the shared theme and mode instead of freezing on its first stamp.
    - `gooey.theme = 'scout'` switches the themer (shared across a `parentGooey` family) instead of only stamping an attribute; a child's `theme` option is ignored.
    - Disposing a child no longer disposes the parent's themer.
    - `Themer.userThemes` — themes added with `create()` persist under `<key>::themes` and merge over the code's themes by title. The old `save` / `load` / `toJSON` / `fromJSON` are removed: their keys never matched, and a stored array shadowed edits to themes in source.
    - `create()` actually adds the theme now; a storage-less gooey no longer persists under a literal `'undefined'` key; `storage.theme: false` really disables theme persistence.

### Patch Changes

- The package ships `llms-full.txt` — the README plus the full API reference rendered from TSDoc — for agents that read a library's docs from `node_modules`. ([`3285807`](https://github.com/braebo/gooey/commit/32858071a28ec63914ddd36575bafc792014464e))

- An element input taller than the room left under the root's `maxHeight` no longer bleeds upward over the rows above it — `.gooey-input-container` aligns `safe center`, so the content starts at its row and the root content scrolls. ([`29fbad8`](https://github.com/braebo/gooey/commit/29fbad879729af27a46bf6f1aaca46f311b68951))

## 0.4.1

### Patch Changes

-   - Inputs re-evaluate a function-valued `disabled` (and `hidden`) on every `refresh()`, so a callback that flips back to enabled or visible takes effect; `InputSwitch` no longer bails out of `refresh()` while disabled. ([`7f534b6`](https://github.com/braebo/gooey/commit/7f534b62db7f4ea54dd2d26f36ae6d9590bcfe73))
    - A persisted or initial size no longer pins an element's height unless it can actually be resized vertically — a root gooey with left/right grabbers shrinks again when its folders collapse.
    - Test suite runs under vitest's playwright provider (chromium) instead of webdriverio.

## 0.4.0

### Minor Changes

- feat: `InputArray` — arrays passed to `add` / `bind` now resolve to a dedicated array input ([`914385b`](https://github.com/braebo/gooey/commit/914385baf739b709ee0880638744a3f679520eee))

    feat: `addToolbarButton` — custom toolbar buttons on any folder

    feat: `InputColor` accepts plain color strings

    feat: `InputSelect` overhaul — improved `{ value, options }` and labeled-option handling

    fix: `InputText` no longer fires a native `alert()` when exceeding `maxLength`

    fix: `InputArray` infinite loop crashing the page when editing an item of a bound array

    fix: `addArray` / `bindArray` were missing from the `Gooey` class (not forwarded from `Folder`)

    fix: `Gooey.dispose()` crash when the preset manager has no folder

    fix: `Gooey` constructor overload types (`new Gooey(title, options)`)

    fix: JSR publish — renamed generated `gooey.css.ts` module so the raw `src` publish resolves under Deno

    BREAKING: `add()` no longer infers `InputButtonGrid` from array values — use the explicit `addButtonGrid()` method. Arrays now default to `InputArray`.

## 0.3.2

### Patch Changes

- feat: release ([`cba5bb939f8f1c35e8f86f422c7c226edf7cc28e`](https://github.com/braebo/gooey/commit/cba5bb939f8f1c35e8f86f422c7c226edf7cc28e))

## 0.3.1

### Patch Changes

- feat: release ([`49727c30b0fa8d63d522cfad9c1c4df29e30d51c`](https://github.com/braebo/gooey/commit/49727c30b0fa8d63d522cfad9c1c4df29e30d51c))

## 0.3.0

### Minor Changes

- feat: release ([`3ab2623c1e926e46476072837923474a3c9a8a91`](https://github.com/braebo/gooey/commit/3ab2623c1e926e46476072837923474a3c9a8a91))

## 0.2.12

### Patch Changes

- fix: initial title not using `innerHTML` ([`a4e6fc31848b6febbd8cff5f138c8833358e8b95`](https://github.com/braebo/gooey/commit/a4e6fc31848b6febbd8cff5f138c8833358e8b95))

## 0.2.11

### Patch Changes

- feat: innerhtml titles ([`0c1b9415a790dd950e7e8a679b2d98a613b64cd3`](https://github.com/braebo/gooey/commit/0c1b9415a790dd950e7e8a679b2d98a613b64cd3))

## 0.2.10

### Patch Changes

- feat: ures ([`a00748a0be099f2c24a58b061bb07355de0e9845`](https://github.com/braebo/gooey/commit/a00748a0be099f2c24a58b061bb07355de0e9845))

- fix: bugs ([`15b45063c8f80fca7b86422186d4d77461513d45`](https://github.com/braebo/gooey/commit/15b45063c8f80fca7b86422186d4d77461513d45))

- chore: cleanup logs ([`1b2ee4f67fb313d2ac3ee90bd5f9619778782455`](https://github.com/braebo/gooey/commit/1b2ee4f67fb313d2ac3ee90bd5f9619778782455))

## 0.2.9

### Patch Changes

- fix: wrong loglevel ([`4aa2a1fce90e2aff2fc5d0c9e7d0b4e1201d225d`](https://github.com/braebo/gooey/commit/4aa2a1fce90e2aff2fc5d0c9e7d0b4e1201d225d))

- fix: unhandled error ([`5d7d4c449d968c02b148a3589b76a7f76841cfe4`](https://github.com/braebo/gooey/commit/5d7d4c449d968c02b148a3589b76a7f76841cfe4))

## 0.2.8

### Patch Changes

- fix:es ([`e885641a1ea3b0bc84bca71cc3644e6a15306c40`](https://github.com/braebo/gooey/commit/e885641a1ea3b0bc84bca71cc3644e6a15306c40))

- fix: swallow commitStyles err ([`e35de98be114da936990708fccd2b36272d0c73f`](https://github.com/braebo/gooey/commit/e35de98be114da936990708fccd2b36272d0c73f))

## 0.2.7

### Patch Changes

- fix: `bindMany` throwing when options are missing ([`e0e3d205b78e4a29b1bcbdf8793698083db7f83d`](https://github.com/braebo/gooey/commit/e0e3d205b78e4a29b1bcbdf8793698083db7f83d))

## 0.2.6

### Patch Changes

- feat: better default preset handling ([`d48eda50db8e5c8c3fe67103690e35a2bd6c9a36`](https://github.com/braebo/gooey/commit/d48eda50db8e5c8c3fe67103690e35a2bd6c9a36))

- feat: ures ([`37aaa97cc6ac4fc25ed25d98205ef739d516a0b5`](https://github.com/braebo/gooey/commit/37aaa97cc6ac4fc25ed25d98205ef739d516a0b5))

## 0.2.5

### Patch Changes

- fix: get correct initial position before mounting ([`d6c182c51c9610c8bcb1a67f180951d1ebc08bcb`](https://github.com/braebo/gooey/commit/d6c182c51c9610c8bcb1a67f180951d1ebc08bcb))

- feat: more exports ([`c7b98bc1803c761ff9990f05ae48a158950ab6ff`](https://github.com/braebo/gooey/commit/c7b98bc1803c761ff9990f05ae48a158950ab6ff))

- feat: bugfixes ([`9c3360901d6e6806ccce81ddbec882f95e8a5ab3`](https://github.com/braebo/gooey/commit/9c3360901d6e6806ccce81ddbec882f95e8a5ab3))

## 0.2.4

### Patch Changes

- feat: lots of features / bugfixes ([`aa538e675575aefa1dc6b27cd91264b0ff6cebc9`](https://github.com/braebo/gooey/commit/aa538e675575aefa1dc6b27cd91264b0ff6cebc9))

- fix: tooltip lifecycle / default `delayOut` ([`7175380c4904393dd6f2492264c531b6850dbac4`](https://github.com/braebo/gooey/commit/7175380c4904393dd6f2492264c531b6850dbac4))

## 0.2.3

### Patch Changes

- fix: preset renaming ([`9614a9e00f5488317e53f2d836c1d3186e8f0b3e`](https://github.com/braebo/gooey/commit/9614a9e00f5488317e53f2d836c1d3186e8f0b3e))

## 0.2.2

### Patch Changes

- feat: preset/folder init improvements ([`4c367900989afc5510105c8b9c4eb5e898e751fe`](https://github.com/braebo/gooey/commit/4c367900989afc5510105c8b9c4eb5e898e751fe))

## 0.2.1

### Patch Changes

- fix: various bugs ([`3d50431196ffc95a9b22f2da771e76bc1d280f0e`](https://github.com/braebo/gooey/commit/3d50431196ffc95a9b22f2da771e76bc1d280f0e))

## 0.2.0

### Minor Changes

- feat: new version ([`1b8c99dd0e31daa638ee9e96fd87d63b04212ceb`](https://github.com/braebo/gooey/commit/1b8c99dd0e31daa638ee9e96fd87d63b04212ceb))

## 0.1.2

### Patch Changes

- chore: remove assets alias ([`b42dab5a0c52ceaf9dc2bbbfac7f0b47f6e0b7e0`](https://github.com/braebo/gooey/commit/b42dab5a0c52ceaf9dc2bbbfac7f0b47f6e0b7e0))

## 0.1.1

### Patch Changes

- fix: remove typescript from peer deps ([`28833d9f76a2bf24417b4c3bfd811a0b57f58131`](https://github.com/braebo/gooey/commit/28833d9f76a2bf24417b4c3bfd811a0b57f58131))

## 0.1.0

### Minor Changes

- feat: initial pre-release ([`72b788bc58b82d566acf67e968c488ff58130c0f`](https://github.com/braebo/gooey/commit/72b788bc58b82d566acf67e968c488ff58130c0f))
