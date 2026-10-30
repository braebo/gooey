# gooey

## 0.6.0

### Minor Changes

- `addBezier` / `bindBezier`: a cubic bézier curve editor input. Its value is `[x1, y1, x2, y2]`, the arguments of CSS `cubic-bezier()`, and it also takes a `'cubic-bezier(...)'` string or a CSS easing keyword. ([`a4d329c`](https://github.com/braebo/gooey/commit/a4d329c87dc94cb9a4f9de678b3a3ccc5472cc94))
    - A graph with two draggable control points (`x` held to `0..1`, `y` free to overshoot within `yMin` / `yMax`), a number field per coordinate, and a dropdown of named easings that previews each on hover. A drag, a field drag, or an open dropdown is one undo step.
    - It saves to presets and resets to its default like every other input.
    - A bound string field is written back as a `cubic-bezier()` string; a bound array stays an array.
    - `cubicBezier(x1, y1, x2, y2)` returns the easing function for a curve, and `bezierToString` / `toBezier` convert between the array and the CSS string.

- `bind()` and the `bind*` methods are typed by what they build and what they accept. ([`9adc98a`](https://github.com/braebo/gooey/commit/9adc98aa93730bc4e905d9ae303dcb0dd2e0864a))
    - `bind()` and `add()` on a `string` field return `InputText | InputColor`: a color string like `'#ff0000'` builds an `InputColor` at runtime, which the type used to hide. A color-typed field (`'#ff0000'` as a literal, or a `ColorString` type) is still `InputColor`, and a text literal is still `InputText`.
    - `bindNumber`, `bindText`, `bindSwitch`, `bindArray`, `bindButton`, `bindButtonGrid`, and `bindSelect` reject a field of another type at the type level, as `bindColor` does.
    - `bindArray` returns `InputArray` typed by the field's items, and `bindSelect` returns `InputSelect` typed by the field.

- `ThemeEditor` is exported: `new ThemeEditor(gooey)` opens a window that edits the gooey's themes, previews the draft live, and saves it into `themer.userThemes`. ([`1c45366`](https://github.com/braebo/gooey/commit/1c453661bad5fcf073d0c53e4f583449f232b9b2))

### Patch Changes

- Disposing a child gooey (one built with `parentGooey`, or with a shared window manager) now frees it. Before this fix, a disposed child left four things behind. First, its window stayed in the shared manager's `windows` map with its grab listener, and its drag and resize ResizeObservers kept watching the detached element. Second, its folders' subscriptions stayed live on the shared themer, which kept the whole child and its DOM reachable. Third, its resizable `<style>` stayed in `document.head`. Fourth, every disposed folder gained a `pointerdown` listener on its header, because dispose added one where it should have removed it. Each child opened and closed added another set. ([`e0c3cc7`](https://github.com/braebo/gooey/commit/e0c3cc7dfb566e465cc9df4ed650f665f0602365))

- `ColorPicker` no longer throws when its deferred first draw lands after it was disposed. ([`3fca87a`](https://github.com/braebo/gooey/commit/3fca87a07792fb3baecd6cc39658e10baed9117a))

- Gooey's debug and trace logging stays out of production builds. Its internal loggers checked only the log level, so an app that set `VITE_FRACTILS_LOG_LEVEL="debug"` (which Vite ships to the production build too) printed a debug line for every new event listener, input and folder in production, each carrying a whole object. Debug and trace output now runs only when `esm-env`'s `DEV` is true; info, warn and error are unchanged. ([`578c8bd`](https://github.com/braebo/gooey/commit/578c8bd3a24ac454a1267798ee0cdbd16da7a483))

- A gooey built with `draggable: false` no longer makes its whole panel a drag handle. The pointer capture that came with it swallowed clicks inside the panel, including the reset-to-default button on every input. `resizable: false` is honoured the same way. ([`35d93fa`](https://github.com/braebo/gooey/commit/35d93fab459e3945bc98d70b68933a57065abf6c))

- An `addElement` row keeps its content's height when the panel is taller than the root's max-height. The folder content is a flex column, so past the cap every row shrank toward its `min-height`; a controller's floor is its own height, but an element row's is one line, so it collapsed and its content spilled over the rows below it. The row no longer shrinks, and the root scrolls instead. ([`83856e0`](https://github.com/braebo/gooey/commit/83856e0ed6cfca87dee7f1d1fa063f980a22fe0a))

- `storage: { presets: false }` now turns preset storage off, as `PresetManager`'s `localStorageKey` documents. It used to fall back to a shared `gooey::presets` key, so every gooey with presets off read and wrote the same active preset, and on construction loaded whatever another gooey had left there, `hidden` included. A gooey created with `hidden: true` would then come up shown. ([`28338ff`](https://github.com/braebo/gooey/commit/28338ffda9061a9b381fefb34446dcf42b175cb4))

    A gooey that relied on presets surviving a reload with `presets: false` should set `storage: { presets: true }`, which gives it its own key.

- Opening a `ThemeEditor` no longer marks its draft dirty and repaints the target (the inputs it builds emit their starting values, and those aren't edits), and closing one with unsaved edits paints the stored theme again. ([`1c45366`](https://github.com/braebo/gooey/commit/1c453661bad5fcf073d0c53e4f583449f232b9b2))

- The settings folder's theme picker sets the themer's current copy of the picked theme, by title, so a theme a consumer replaced in `themer.themes` after construction (a live-synced palette) is the one that paints. ([`6c22813`](https://github.com/braebo/gooey/commit/6c228135652a8b1fcc571cef40c91a01847e35f6))

- Cmd/Ctrl+Z no longer swallows native undo in the page's text fields. Gooey's undo listener on `window` used to `preventDefault()` every Cmd+Z, whatever had focus, so a `<textarea>`, a text-type `<input>` or a `contenteditable` anywhere on a page with a gooey lost its own undo and redo. Those fields (inside shadow roots too, closed ones included) now keep the browser's undo, and so does any key a nearer handler already claimed, like a code editor's. Sliders, checkboxes, gooey's own number fields and the rest of gooey's controls keep gooey's undo. ([`120d169`](https://github.com/braebo/gooey/commit/120d169da7fab6804166a0a5e40c44ea6a879723))
    - `dispose()` now removes the listener. It used to stay on `window`, so a disposed gooey still answered Cmd+Z.
    - Ctrl+Shift+Z redoes off mac, the same as Ctrl+Y.
    - Gooey's number field keeps gooey's undo even though it's a text-type input: the browser doesn't undo its arrow, spinner or wheel steps, and gooey's history already holds each one.
    - A key from inside a closed shadow root (an extension's UI, a closed web component) is left to the browser, since gooey can't see which field has focus there. An element with a `tabindex` (a skip-link `<main tabindex="-1">`, a dialog panel) still gets gooey's undo when it's focused, so a closed host that sets `tabindex` and holds a text field is the one case that still loses its native undo.

## 0.5.0

### Minor Changes

- A bound color field keeps the format it started in — `bindColor({ color: '#0000ff' }, 'color')` no longer overwrites the field with a `Color` object. ([`94c8741`](https://github.com/braebo/gooey/commit/94c874182328ea22229b8ae25a9a74c8269d34df))
    - Hex (`#rrggbb`, `#rrggbbaa`, `#rgb`, `#rgba`), `rgb()`, `rgba()`, `hsl()`, `hsla()`, `{ r, g, b(, a) }`, `{ h, s, l(, a) }`, `{ h, s, v(, a) }`, and `{ kelvin }` fields stay in that format; a `Color` field stays a `Color`.
    - The input keeps the full color: alpha set on a `#rrggbb` field holds, and a write to the field from outside lands on `refresh()`.
    - `bindColor` rejects a field that isn't color-shaped at the type level.
    - `hsl()` strings parse as hsl (they parsed as rgb).
    - `Color` gains `hex3String`, `hex4String`, and `kelvinColor`.

- `Resizable.resize({ width, height })` — a window can be sized from code, not only by dragging a grabber. ([`22fa344`](https://github.com/braebo/gooey/commit/22fa34417dbd5fa41fdad83e225e2e5923c9ce52))
    - Either dimension can be omitted, and each is clamped to the `bounds` and the node's own computed `min-width` / `max-width` / `min-height` / `max-height`, exactly as a drag is. The min / max values used to be read only on the first grab, so a pre-grab resize would have clamped to `0`.
    - `height` is ignored when no grabber could have changed it (no vertical `side`, no `corners`) — an inline height there pins the element forever.
    - It writes the `size` state, so a `localStorageKey` persists the new size, and it fires `onResize` and the `resize` event a drag fires.
    - `WindowInstance.resize` exposes it the way `moveTo` exposes the draggable's, and `WindowInstance.size` is now the resizable's own size state instead of a dead `{ width: 0, height: 0 }`.

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

- `bindMany` and `addMany` no longer crash when a target key shares a name with a control option (`maxSize`, `exclude`, `include`) or with a stray non-object option — only an object is read as a key's input options, so `{ title: 'hi' }` with a top-level `title` binds instead of throwing `Cannot create property 'title' on string`. `exclude`, `include`, and `maxSize` now type-check on a target with a string index signature (`Record<string, …>`). ([`c3cea9e`](https://github.com/braebo/gooey/commit/c3cea9ec9f9e2e6692a32f7e7cb9777c13cf9ebb))

- The package ships `llms-full.txt` — the README plus the full API reference rendered from TSDoc — for agents that read a library's docs from `node_modules`. ([`3285807`](https://github.com/braebo/gooey/commit/32858071a28ec63914ddd36575bafc792014464e))

- An element input taller than the room left under the root's `maxHeight` no longer bleeds upward over the rows above it — `.gooey-input-container` aligns `safe center`, so the content starts at its row and the root content scrolls. ([`29fbad8`](https://github.com/braebo/gooey/commit/29fbad879729af27a46bf6f1aaca46f311b68951))

- An untitled input row's content is centered in its row instead of sitting against the left edge. ([`0e295e0`](https://github.com/braebo/gooey/commit/0e295e0b439d3702e60f83c2a0ba376662029b55))

    An input with no title already zeroes `--gooey-input-section-1_width` to give the right side the full row, but the left column didn't actually collapse: `.gooey-input-title` keeps `padding-left: 4px` and `padding-right: 10px`, and `box-sizing: border-box` floors the element at that 14px however narrow the width says; the drawer toggle's `min-width: 0.33rem` added another 5px. Content mounted with `addElement('', node)` sat 19px from the left edge against 8px on the right.

    The row now carries a `gooey-input-untitled` class that zeroes the title's padding and the toggle's width (a toggle with a description keeps its clickable strip), and gives the content area the same `0.5rem` on the left it already had on the right — measured 19.27px/8px before, 8px/8px after.

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
