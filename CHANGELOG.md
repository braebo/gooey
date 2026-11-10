# gooey

## 0.6.0

### Minor Changes

- `addMany` refuses a `null` or `undefined` field with no `value` option, the way `bindMany` does, and throws before any input is built. An `undefined` field used to become a text input reading `'undefined'` while its type said otherwise (an `InputNumber` for a `number | undefined` field), and a `null` one threw "Failed to resolve the input type for the provided options and value." with the inputs ahead of it left in the panel. Give the field a `value` option (`{ count: { value: 0 } }`) and its input is built from that, as before. An untyped call that gave a nullish field only an `options` or `onClick` option, which the option types refuse, used to build a select or a button from it, and is refused now too. Both verbs' refusal now names the verb and the key (`addMany(): "count" is \`undefined\` …`) in place of `bindMany`'s "Invalid binding." ([`af17701`](https://github.com/braebo/gooey/commit/af177010c4ca7a3ed0425170f26778fee5768a6c))

- `addMany()` and `bindMany()` type a plain `string` field as `InputText | InputColor`, the way `add()` and `bind()` do. A color string like `'#ff0000'` builds an `InputColor` at runtime, but `addMany({ bg: '#ff0000' }).inputs.bg` was typed `InputText`. A color-typed field (a `ColorString` type, or a color literal `bindMany` keeps) is still `InputColor`, and a text literal is still `InputText`. ([`48f1062`](https://github.com/braebo/gooey/commit/48f1062f471c167327d220268e4b56752032cc72))

- `addBezier` / `bindBezier`: a cubic bézier curve editor input. Its value is `[x1, y1, x2, y2]`, the arguments of CSS `cubic-bezier()`, and it also takes a `'cubic-bezier(...)'` string or a CSS easing keyword. ([`a4d329c`](https://github.com/braebo/gooey/commit/a4d329c87dc94cb9a4f9de678b3a3ccc5472cc94))
    - A graph with two draggable control points (`x` held to `0..1`, `y` free to overshoot within `yMin` / `yMax`), a number field per coordinate, and a dropdown of named easings that previews each on hover. A drag, a field drag, or an open dropdown is one undo step.
    - It saves to presets and resets to its default like every other input.
    - A bound string field is written back as a `cubic-bezier()` string; a bound array stays an array.
    - `cubicBezier(x1, y1, x2, y2)` returns the easing function for a curve, and `bezierToString` / `toBezier` convert between the array and the CSS string.

- `bind()` and the `bind*` methods are typed by what they build and what they accept. ([`9adc98a`](https://github.com/braebo/gooey/commit/9adc98aa93730bc4e905d9ae303dcb0dd2e0864a))
    - `bind()` and `add()` on a `string` field return `InputText | InputColor`: a color string like `'#ff0000'` builds an `InputColor` at runtime, which the type used to hide. A color-typed field (`'#ff0000'` as a literal, or a `ColorString` type) is still `InputColor`, and a text literal is still `InputText`.
    - `bindNumber`, `bindText`, `bindSwitch`, `bindArray`, `bindButton`, `bindButtonGrid`, and `bindSelect` reject a field of another type at the type level, as `bindColor` does.
    - `bindArray` returns `InputArray` typed by the field's items, and `bindSelect` returns `InputSelect` typed by the field.

- A folder's `title` setter writes the new title at once, as text. It used to write it only when a fade-out animation finished, which never happened on a hidden window or in a background tab, so `gooey.title` and the title shown disagreed; the fade-in now plays only where the title can be seen. A folder's title is written with `textContent`, no longer `innerHTML` (an input's title is unchanged there). Only a key-shaped title (letters, digits, `-` and `_`, the way `bindMany` makes them from keys) has its `-` and `_` read as spaces, in folders and inputs alike: `font_size` still shows `font size`, while `x-offset (px)` and `¯\_(ツ)_/¯` show as written. Ids derived under a renamed root (`gooey.title = …`) stay where they were, keyed on the root's id rather than its new title, so each folder's stored `closed` state survives renaming the root. A folder below the root still derives its children's ids from its current title. ([`575a9ff`](https://github.com/braebo/gooey/commit/575a9ffe0d93829ba8ecde8b8e58d5d8f7ceae79))

- `addGradient` / `bindGradient`: a gradient editor input. Its value is a list of `{ offset, color }` stops, sorted by `offset` (`0..1`), with colours as `#rrggbb` (or `#rrggbbaa` when translucent) -- plain data that saves and serializes as-is. It also takes stops without an offset, or bare colours, spaced evenly. ([`dc4b492`](https://github.com/braebo/gooey/commit/dc4b492ea61c9dbf29beef6313e09039758d3b20))
    - A strip of the gradient with a handle per stop: drag a stop to move it, press the strip to add one (coloured as the gradient already was there), and drag one off the strip or press `Delete` / `Backspace` to remove it. A gradient keeps at least two stops. The arrow keys move a focused stop.
    - The selected stop's offset has a number field, and its colour is edited with gooey's own colour picker. A drag, a field drag, or a picker gesture is one undo step.
    - It saves to presets and resets to its default like every other input.
    - `gradientToString(stops, direction?)` renders a CSS `linear-gradient()`, and `sampleGradient(stops, t)` returns the colour at `t`, blended the way CSS paints it.

- `addMany()` types an inline string by its literal, as `add()` does: `addMany({ bg: '#ff0000' }).inputs.bg` is `InputColor` and `addMany({ name: 'gooey' }).inputs.name` is `InputText` (a field typed plain `string` is still `InputText | InputColor`). `addMany()` and `bindMany()` type an inline select or array by its widened items: `{ value: 'a', options: ['a', 'b'] }` is `InputSelect<string>` and `[1, 2]` is `InputArray<number>`, where `bindMany()` used to type them as readonly tuples of inputs. A select whose options are labeled (`{ label, value }`) is `InputSelect` of the option values, where it used to be a union of the values and the options themselves. A declared select or array keeps its item type (`InputSelect<'light' | 'dark'>`), `readonly` or not; a declared `as const` tuple widens like an inline one. ([`ae94237`](https://github.com/braebo/gooey/commit/ae9423778c94f0c53cb78745bba66d94936dc04c))

- `ThemeEditor` is exported: `new ThemeEditor(gooey)` opens a window that edits the gooey's themes, previews the draft live, and saves it into `themer.userThemes`. ([`1c45366`](https://github.com/braebo/gooey/commit/1c453661bad5fcf073d0c53e4f583449f232b9b2))

### Patch Changes

- An array item's edit is the array's undo step. Undoing it sets the whole array back, so it still lands after the items were rebuilt by an outside write and `refresh()`, or by `set()`; before, the undo went to the item input the rebuild had disposed, spending the step with nothing changed. ([`6b3534c`](https://github.com/braebo/gooey/commit/6b3534c47b36269bd97af5aec9bb046290af47d7))

- `bindMany()` on an inline `{ value, options }` field binds the select to that object's `value`. Before, the input read the whole object back as its `.value` (the `addMany()` twin gave the value), and a pick wrote the bare value over the field, dropping its `options`. Now `bindMany({ theme: { value: 'light', options: ['light', 'dark'] } }).inputs.theme.value` is `'light'`, and a pick writes `target.theme.value`. ([`84156e8`](https://github.com/braebo/gooey/commit/84156e81a0be9f7be0a23e796df07404c949adeb))

- `bindMany()` refuses a bare array of labeled options (`{ arr: [{ label: 'one', value: 1 }, …] }`), as a type error and, past a cast, a thrown error that names the field. A bound select writes its pick to the field it's bound to, and here the field is the options: the input read the whole array back as its `.value`, and a pick wrote the bare value over the array. Bind `{ value, options }` instead, which has a `value` to write to. `addMany()` still builds a select from the bare array, starting on its first option. ([`50f9a40`](https://github.com/braebo/gooey/commit/50f9a40bd768fedf1df03f35eab93a4b77d8e78d))

- `bindMany` binds a `null` field through its `value` option, as its error message says to. `bindMany({ z: null }, { z: { value: 3 } })` threw a `TypeError` with the inputs ahead of it already built; now it writes `3` to `target.z` and binds a number input to it. ([`b727fed`](https://github.com/braebo/gooey/commit/b727fedbf7864ede1ed39fa9f6e6d28356144370))

- `bindMany`'s refusal of a bare labeled-options array reads its options. A key that `exclude` names, or that an `include` leaves out, is never walked, so it's no longer a type error either. A target that's refused at runtime (a cast labeled array, or a `null` field with no `value` option) throws before any input is built, where it used to leave the inputs ahead of it in the panel. `bindMany` has TSDoc now, including the cast that gets a generic wrapper past the type-level refusal: `gui.bindMany<typeof v>(v as any)`. ([`61871c2`](https://github.com/braebo/gooey/commit/61871c222183f87165b775b7a1b3d28d867e9207))

- `bindMany` treats an `undefined` field like a `null` one: it binds through a `value` option, written to the field, and without one the target is refused before any input is built. It used to throw "Failed to resolve the input type" with the inputs ahead of it left in the panel. ([`b727fed`](https://github.com/braebo/gooey/commit/b727fedbf7864ede1ed39fa9f6e6d28356144370))

- `refresh()` re-reads a bound array. `InputArray` turned its binding off around the refresh, so an outside write to the target, a new array or the same one changed in place, never reached its items. It now reads the field when it holds something other than what the items show, and rebuilds them, with no `change` event and no undo step. Editing an item still keeps the item inputs in place. ([`c2951db`](https://github.com/braebo/gooey/commit/c2951db4bb9bfffe954b5df898a5fbf1d47f5fd8))

- A bound `InputSelect`'s `refresh()` reads the target into the whole input. After an outside write, `.value` moved but `selected` and the dropdown stayed put (the dropdown on the option the input was created on), so the next look or pick started from the wrong option. Now all three follow the target, with no `change` event. ([`6ca1db2`](https://github.com/braebo/gooey/commit/6ca1db2286e21354bc6f328ef111e66ecdfbae0a))

    `InputSelect` records undo history, as the other inputs do. It never committed, so a pick couldn't be undone. An open menu is one undo step, however many options the pointer previewed on the way, and a cancel records nothing; `set()` from code is a step too. The preset menu keeps its own single step for a pick.

- Disposing a child gooey (one built with `parentGooey`, or with a shared window manager) now frees it. Before this fix, a disposed child left four things behind. First, its window stayed in the shared manager's `windows` map with its grab listener, and its drag and resize ResizeObservers kept watching the detached element. Second, its folders' subscriptions stayed live on the shared themer, which kept the whole child and its DOM reachable. Third, its resizable `<style>` stayed in `document.head`. Fourth, every disposed folder gained a `pointerdown` listener on its header, because dispose added one where it should have removed it. Each child opened and closed added another set. ([`e0c3cc7`](https://github.com/braebo/gooey/commit/e0c3cc7dfb566e465cc9df4ed650f665f0602365))

- `ColorPicker` no longer throws when its deferred first draw lands after it was disposed. ([`3fca87a`](https://github.com/braebo/gooey/commit/3fca87a07792fb3baecd6cc39658e10baed9117a))

- Gooey's debug and trace logging stays out of production builds. Its internal loggers checked only the log level, so an app that set `VITE_FRACTILS_LOG_LEVEL="debug"` (which Vite ships to the production build too) printed a debug line for every new event listener, input and folder in production, each carrying a whole object. Debug and trace output now runs only when `esm-env`'s `DEV` is true; info, warn and error are unchanged. ([`578c8bd`](https://github.com/braebo/gooey/commit/578c8bd3a24ac454a1267798ee0cdbd16da7a483))

- A gooey built with `draggable: false` no longer makes its whole panel a drag handle. The pointer capture that came with it swallowed clicks inside the panel, including the reset-to-default button on every input. `resizable: false` is honoured the same way. ([`35d93fa`](https://github.com/braebo/gooey/commit/35d93fab459e3945bc98d70b68933a57065abf6c))

- What `addElement` mounts can be selected and copied. The root is `user-select: none` so a drag on a control never selects its label, and every element input inherited it, so a card or a preview mounted there couldn't be copied from without a host stylesheet putting `user-select: text` back. `.gooey-input-element-container` now does that itself, one class deep, so a host's own lock (`.some-mode .gooey-root *`) still wins. ([`7267f14`](https://github.com/braebo/gooey/commit/7267f14501e741bba11a56710928571a616730d4))

- An `addElement` row keeps its content's height when the panel is taller than the root's max-height. The folder content is a flex column, so past the cap every row shrank toward its `min-height`; a controller's floor is its own height, but an element row's is one line, so it collapsed and its content spilled over the rows below it. The row no longer shrinks, and the root scrolls instead. ([`83856e0`](https://github.com/braebo/gooey/commit/83856e0ed6cfca87dee7f1d1fa063f980a22fe0a))

- The `folders` that `addMany()` and `bindMany()` return are typed as they're built. A nested folder is `folders.a.subFolders.b.folder`; the type said `folders.a.b.folder`, which is `undefined` at runtime, and had no `subFolders` at all. It also listed every key of the target as a folder, numbers and selects included; now only the nested objects that become folders are in it. ([`9a493ce`](https://github.com/braebo/gooey/commit/9a493ce9fb406c2266e45aa0c2e6f99911865361))

- `addMany()` and `bindMany()` type a nullable field's input as the rest of its type builds it. A `number | null` field was typed `never`, so the input `bindMany` builds for it through its `value` option could only be read untyped; now it's an `InputNumber`, and `string | undefined` is a text or color input. A field typed only `null` or `undefined` is any input, since its `value` option decides. ([`9e9e8f1`](https://github.com/braebo/gooey/commit/9e9e8f108bda3569d472faf36b079f616051da46))

- `addMany()` and `bindMany()` type their inputs the way they build them. A nested folder's `inputs.a` holds only its inputs; the type also promised `inputs.a.folder`, which was `undefined` (the Folder is `folders.a.folder`). A plain `{ r, g, b }` object builds a folder of numbers, and the type said `InputColor`; only a `Color` instance builds a color. An array is a select only when its items are labeled options with nothing but `label` and `value`, which is the check the runtime makes, so `[{ label, value, note }]` is an `InputArray` and `any[]` binds. The theme picker in the panel's settings records no undo step, the same as the mode buttons beside it, so ⌘Z undoes your own values and leaves the theme alone. ([`c410853`](https://github.com/braebo/gooey/commit/c410853d3ae153c3ba30a9074cc3c98eece833af))

- Undo works across a preset load. A load used to push a step whose target was the gooey itself, which has no `set()`, so the next undo threw and every undo after it hit the same step; a page that booted with a saved preset started with it on the stack. Now a pick in the preset menu is one undo step, however many options the pointer passed over on the way: undo brings back the values and the active preset from before the menu opened, unsaved changes included, and redo makes the pick again. Cancelling the menu (Escape, a click outside, or a click on the menu itself) puts back what it opened over, unsaved changes included, and records nothing. `gooey.load()` from code, the boot load, and saving, renaming or deleting a preset record nothing. ([`2d196e2`](https://github.com/braebo/gooey/commit/2d196e246adf25eb651ba4322803fbcddd024380))

- `storage: { presets: false }` now turns preset storage off, as `PresetManager`'s `localStorageKey` documents. It used to fall back to a shared `gooey::presets` key, so every gooey with presets off read and wrote the same active preset, and on construction loaded whatever another gooey had left there, `hidden` included. A gooey created with `hidden: true` would then come up shown. ([`28338ff`](https://github.com/braebo/gooey/commit/28338ffda9061a9b381fefb34446dcf42b175cb4))

    A gooey that relied on presets surviving a reload with `presets: false` should set `storage: { presets: true }`, which gives it its own key.

- The `refresh` event fires once, with the value the refresh read. After an outside write to a bound field, it fired twice: first the new value, then the stale one from before the read. Called from a select's `change` handler it fired the stale one first, and a bound select fired only the stale one. ([`ed3a1c1`](https://github.com/braebo/gooey/commit/ed3a1c1cae68724b99e98ad1d751c798bf8670e3))

- `refresh()` re-reads a bound field whether or not the input is `resettable`. An input made with `resettable: false` returned before reading its binding, so an outside write to the target never landed in it (a bound select read its own, so it was the one exception). The `refresh` event now fires for those inputs too; only the reset button's dirty mark still depends on `resettable`. A button bound to a function field (by `bind` or `bindMany`) doesn't read its handler back on refresh: a bound button made with `resettable: true` used to loop there until the page died. ([`35acd50`](https://github.com/braebo/gooey/commit/35acd5046827da5ae0135c32a9a284611534f380))

- `InputSelect`'s `open`, `close`, `cancel` and `preview` events fire. They never did: the input listened for DOM events of those names on the dropdown, and the controller never dispatched any. Now `open` fires when the dropdown opens, `preview` with the option the pointer moves onto (which selects it while the menu is open), `close` when it closes, and `cancel` when Escape, a click outside, or a click on the menu itself closes it without a pick. Every cancel puts back the value the menu opened over: a click on the menu itself used to keep whatever option the pointer last previewed. ([`30350cb`](https://github.com/braebo/gooey/commit/30350cb03d733e9569c891c80c1579fed95fe782))

- Opening a `ThemeEditor` no longer marks its draft dirty and repaints the target (the inputs it builds emit their starting values, and those aren't edits), and closing one with unsaved edits paints the stored theme again. ([`1c45366`](https://github.com/braebo/gooey/commit/1c453661bad5fcf073d0c53e4f583449f232b9b2))

- The settings panel's `theme` picker follows the themer. A theme created after the panel was built (a copy the `ThemeEditor` saves) is listed without a reload, and a switch made elsewhere (`gooey.theme = …`, the editor) shows in the picker. Picking the title that's already active does nothing, so the picker showing a switch can't put the stored theme back over a draft the editor is previewing under that title. `InputSelect`'s `options` setter labels object options the way the constructor does (`labelKey`, then `label`, then `title`) where it used to label them with their JSON, and the menu's `options` list now keeps step with what's in it, so a `refresh` after an `options` reset no longer adds every option a second time. ([`4b78246`](https://github.com/braebo/gooey/commit/4b78246b4e2b0bc9b60468ebaca87996b9e3704c))

- The settings folder's theme picker sets the themer's current copy of the picked theme, by title, so a theme a consumer replaced in `themer.themes` after construction (a live-synced palette) is the one that paints. ([`6c22813`](https://github.com/braebo/gooey/commit/6c228135652a8b1fcc571cef40c91a01847e35f6))

- The theme types are exported (`Theme`, `ThemeDefinition`, `Themer`, `ThemerOptions`, `ThemeMode`, `ThemeVariant`, `ThemeColors`, `ColorDefinition`, `ColorTheme`, `BaseColors`, `ModeColors`, `VariableDefinition`, `ExtendedVars`), and the `themes` option takes a `ThemeDefinition`, the shape a theme is written in, since the themer resolves it anyway. A theme that leaves out `prefix` now writes `--gooey-*` vars; it used to write `--fractils-*` ones and change nothing. The `ThemeEditor` window reads "Theme Editor · <theme>" instead of the edited panel's title, and an open select dropdown picks up a CSS variable overridden on `.gooey-root`, which it never inherited because it mounts outside the root. ([`f0a5199`](https://github.com/braebo/gooey/commit/f0a51990321b552f69925533a24d5a6b323d80b5))

- An undo or redo of a color change no longer swallows the next change. The undo manager locked itself before replaying a commit and unlocked on the next commit it saw, but a color's replay writes its state without committing, so the lock stayed set and the next real change (to any input) never reached the history: undoing again skipped it, and the history and the panel fell out of sync. The lock now spans the replay alone. ([`4422e3b`](https://github.com/braebo/gooey/commit/4422e3bdc7969760d4c7f754806d0e33d744afc5))

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
