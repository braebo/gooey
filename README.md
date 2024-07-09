# gooey

Yet another web gui.

> Work in progress.


## Features

- [x] Flexible API
- [x] Thoroughly Typed
- [x] Zero Dependencies
- [x] Preset Manager
- [x] Theme Manager
- [x] Undo History
- [x] Draggable / Resizable
- [x] `addMany` for Bulk Generation
- [x] Strong Type Inference
- [x] Reset to Default buttons
- [ ] Monitors
- [ ] LFO / Envelope manager
- [ ] Curve Editor
- [ ] Plugins
- [ ] Svelte Components


## Inputs

| Status | Feature  | Primitive                      |
| ------ | -------- | ------------------------------ |
| ✅      | Number   | `number`                       |
| ✅      | Color    | `Color \| ColorRepresentation` |
| ✅      | Select   | `Array<any>`                   |
| ✅      | Switch   | `boolean`                      |
| ✅      | Text     | `string`                       |
| 🚧      | Textarea | `string`                       |
| 🚧      | Range    | `{ min, max }`                 |
| 🚧      | Vector3  | `{ x, y, z }`                  |
| 🚧      | Vector2  | `{ x, y }`                     |


## Installation

NPM

```bash
pnpm install gooey
```

or, [JSR](https://jsr.io/)

```bash
jsr add @braebo/gooey
```


## Usage

Create a new `Gooey`.

```typescript
import { Gooey } from 'gooey'

const gooey = new Gooey()
```


You can use the `addNumber` method directly to create a number input:

```typescript
const input = gooey.addNumber('count')

input.on('change', console.log)
```


Or, use the generic `add` method, and it will infer the type of the input from the `value` property:

```typescript
const input = gooey.add('count', { value: 0 })

input.on('change', v => console.log(v))
```


Add multiple inputs at once with `addMany`.

```typescript
gooey.addMany({
  number: 0,
  color: '#ff0000',
  select: ['a', 'b', 'c'],
  switch: true,
  text: 'hello'
})
```

### TODO - More docs...

## About

[tweakpane](https://github.com/cocopon/tweakpane) was the main inspiration for this project.  I recommend it over `gooey` -- it's a more lightweight solution with more features and an awesome, highly active developer!

I started this to scratch an itch, and pave the way for more advanced features related to 3D / audio / audio-reactivity in the future.

Other, similar projects:

- [lil-gui](https://github.com/georgealways/lil-gui)
- [dat.gui](https://github.com/dataarts/dat.gui)
