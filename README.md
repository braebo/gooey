# gooey

Another GUI library for the web.

## Features

- [x] Flexible API
- [x] Zero Dependencies
- [x] Theme Manager
- [x] Preset Manager
- [x] Fully Typed
- [x] Draggable
- [x] Resizable
- [x] `bulkAdd` Method
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

## About

[tweakpane](https://github.com/cocopon/tweakpane) was the main inspiration for this project.  I recommend it over `gooey` -- it's a more lightweight solution with more features and an awesome, highly active developer!

I started this to scratch an itch, and pave the way for more advanced features related to 3D / audio / audio-reactivity in the future.

Other, similar projects:

- [lil-gui](https://github.com/georgealways/lil-gui)
- [dat.gui](https://github.com/dataarts/dat.gui)
