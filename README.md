<p align="center">
  <img src="./www/static/assets/gooey-meta@600.png" alt="gooey" width="300"></img>
</p>

<p align="center">
  <img src="./www/static/assets/goos-dark.png" alt="gooey" width="500"></img>
</p>

<p align="center">
floating gui library for the web

<br><a align="center" href="https://gooey.braebo.dev">gooey.braebo.dev</a>

</p>

<blockquote>
  <h6>🚧 Pre <code>v1.0.0</code></h6>
  Changes are frequent and breaking 𛱠
</blockquote>

<br>

<!-- TOC -->

-   [Features](#features)
-   [Getting Started](#getting-started)
    -   [1. Install](#1-install)
    -   [2. Create a new `Gooey`](#2-create-a-new-gooey)
-   [Basics](#basics)
-   [Inputs](#inputs)
    -   [`add` vs `bind`](#add-vs-bind)
    -   [`add`](#add)
    -   [`bind`](#bind)
-   [About](#about)
-   [Roadmap](#roadmap)
<!-- /TOC -->

<br>

## Features

<p align="center">

&nbsp; &nbsp; &nbsp;&nbsp; Preset Manager &nbsp;&nbsp; · &nbsp; Theme Manager &nbsp;&nbsp; · &nbsp; Draggable / Resizable / Placeable &nbsp;&nbsp; · &nbsp; Local Storage Integration &nbsp;&nbsp; · &nbsp; Generators &nbsp;&nbsp; · &nbsp; Reset Mechanism &nbsp;&nbsp; · &nbsp; Undo/Redo History &nbsp;&nbsp; · &nbsp; Flexible API &nbsp;&nbsp; · &nbsp; Fully Typed &nbsp;&nbsp; · &nbsp; Zero Dependencies

</p>

<br>

## Getting Started

### 1. Install

```elixir
npm install gooey
```

```typescript
import { Gooey } from 'gooey'
```

<details><summary>More Install Methods</summary>
<br>
<!-- Alternatives-->
<!-- There are a few other ways to install `gooey`, most of which I recommend over NPM: -->

<!-- <br> -->

<details><summary>JSR</summary>

<a href="https://jsr.io">JSR</a> is a modern alternative to NPM

```elixir
npx jsr add @braebo/gooey
```

```typescript
import { Gooey } from '@braebo/gooey'
```

<br>
</details>

<details><summary>PNPM</summary>

<a href="https://pnpm.io">PNPM</a> is the recommended way to install `gooey`.

```elixir
pnpm i -D gooey
```

```typescript
import { Gooey } from 'gooey'
```

<br>
</details>

<details><summary>CDN</summary>

```html
<script type="module">
	import { Gooey } from 'https://esm.sh/gooey'

	const gui = new Gooey()
</script>
```

</details>

</details>

<br>

### 2. Create a new `Gooey`

```typescript
const gui = new Gooey()
```

<br>

## Basics

Use [`add`](#add) to create a new [input](#inputs)

```typescript
gooey.add('hello', 'world')

gooey.add('count', 1, { min: -1 })
```

<br>

Use [`addMany`](#addmany) to create multiple inputs at once:

```typescript
gooey.addMany({
	stuff: true,
	more_stuff: {
		like_colors: '#4aa7ff' as const,
		or_buttons: () => alert('thanks!'),
	},
})
```

<br>

<!-- events - `on` method -->

Do stuff [`on`](#on) change:

```typescript
const greetingInput = gooey.add('greeting', 'hello')

greetingInput.on('change', console.log) // logs the text value when changed
```

<details><summary><em><sup>alternatives</sup></em></summary>

The `onChange` option can also be used to set a callback that will be called when the value changes:

```typescript
gooey.add('title', 'change me', {
	onChange: v => (gooey.title = v),
})
```

Or, you can chain stuff:

```typescript
gooey.add('title', 'change me').on('change', v => (gooey.title = v))
```

</details>

<br>

<!-- bind - `bind` method -->

Instead of using [`add`](#add) with event callbacks, you can use [`bind`](#bind) to automatically sync an object's values with an input. For example:

```typescript
const data = {
	size: 12,
	color: '#4aa7ff' as const,
}

gooey.bind(data, 'size')
gooey.bind(data, 'color')
```

<br>

<!-- bindMany - `bindMany` method -->

Bind to an entire object with [`bindMany`](#bindmany)

```typescript
const data = {
	wght: 100,
	wdth: 75,
}

gooey.bindMany(data)
```

<!-- todo - these details should move to the `bindMany` section -->

<!-- <details><summary><sup>more info</sup></summary>

You can also pass options to `bindMany`:

```typescript
const data = {
    wght: 300,
    wdth: 100,
}

gooey.bindMany(data, {
    wght: { min: 100, max: 900 },
    wdth: { min: 100, max: 130 },
})
```

The types here will be inferred for all that intellisense goodness.

</details> -->

<br>

Create [folders](#folders) with `addFolder`

```typescript
const outer = gooey.addFolder('outer')

const inner = outer.addFolder('inner')

inner.add('say sike', () => outer.close(), {
	text: 'sike',
})
```

<!-- todo - these details should move to the `Folder` section -->

<!-- <details><summary>Pro tip &nbsp;·&nbsp; click folder headers to open / close them</summary>

The `closed` state can be persisted in `localStorage`:

```typescript
// Persist all states
const gooey = new Gooey({ storage: true })

// Only `closed` state
const gooey = new Gooey({
    storage: {
        closed: true,
    },
})
```

</details> -->

<br>

## Inputs

<details><summary>Inputs Table</summary><br>

| Status | Feature    | Primitive                      |
| ------ | ---------- | ------------------------------ |
| ✅     | Number     | `number`                       |
| ✅     | Text       | `string`                       |
| ✅     | Switch     | `boolean`                      |
| ✅     | Select     | `Array<any>`                   |
| ✅     | Button     | `{ text, onClick, ... }`       |
| ✅     | ButtonGrid | `{ text, onClick, ... }[][]`   |
| ✅     | Color      | `Color \| ColorRepresentation` |
| 🏗️     | Range      | `{ min, max }`                 |
| 🏗️     | Vector2    | `{ x, y }`                     |
| 🏗️     | Vector3    | `{ x, y, z }`                  |

</details>

<br>

### `add` vs `bind`

There are two ways to create inputs; [`add`](#add) or [`bind`](#bind) _(along with [`addMany`](#addmany) / [`bindMany`](#bindmany) for multiple inputs)_. The return value will be the generated `Input` instance.

-   [`add`](#add) inputs when you have no data and just want to generate some values and hook into change [events](#events). The value will be created and managed by Gooey.

-   [`bind`](#bind) inputs when you have an existing object, and you want its value(s) to stay in sync with the generated input(s) automatically. This is useful for data that's integrated into a larger system, like reactive state in a web app or entities in a 3D scene graph.

<br>

### `add`

The `Folder.add` method can be used to create any input.

```typescript
type add = <T>(
  title: string,
  initialValue: T,
  options?: InputOptions<T>
): Input<T>
```

It accepts a `title`, `initialValue`, and `options` object.

> [!TIP]
> Passing an empty string as the `title` will omit the title's `<div>` element, allowing the input to fill the entire width of the parent folder.

<br>

The type of input generated depends on the type of the `initialValue` argument. For example, passing a `string` results in an `InputText` instance, while passing a `number` results in an `InputNumber` instance.

```typescript
gooey.add('my text', 'foo') // string -> InputText

gooey.add('my number', 1) // number -> InputNumber
```

<details><summary>All <code>add</code> overloads</summary>

Simple examples of each type of input that can be created with the `add` method _(with empty strings in the `title` arguments for simplicity)_:

```typescript
// InputText
gooey.add('', 'foo') // string

// InputNumber
gooey.add('', 1) // number

// InputColor
gooey.add('', '#4aa7ff') // ColorValue

// InputSelect
gooey.add('', ['foo', 'bar']) // any[]

// InputButton
gooey.add('', () => alert('hi')) // () => void

// InputSwitch
gooey.add('', true) // boolean

// InputButtonGrid
gooey.add('', [
	[
		{ text: 'foo', onClick: () => alert('foo') },
		{ text: 'bar', onClick: () => alert('bar') },
	],
	[
		{ text: 'baz', onClick: () => alert('baz') },
		{ text: 'qux', onClick: () => alert('qux') },
	],
]) // (() => void)[][]
```

</details>

<br>

The type of the `options` object in the third argument will change depending on the type of input, for example:

```typescript
const countInput = gooey.add('count', 1, {
	min: -1,
	max: 10,
	step: 0.1,
})
```

Because the initial value _(`1`)_ is a **number**, gooey infers the options in the third argument as `NumberInputOptions` — which is why it accepts `min`, `max`, and `step`.

If we pass a **string** instead, it'll infer `TextInputOptions`:

```typescript
const textInput = gooey.add('greeting', 'hello', {
	maxLength: 10,
})
```

This should get you some nice, dynamic intellisense. However, you can always fall back to the more specific adders _(like `addNumber`, `addColor`, etc.)_ if need be.

### `addMany`

The `Folder.addMany` method can be used to create multiple inputs at once.

```typescript
type addMany = <T>(
  target: T,
  options?: Record<keyof T, InputOptions<T>> & {
    exclude?: Array<keyof T>
    include?: Array<keyof T>
  },
) => {
  folders: Folder[];
  inputs: Input<T>[];
}
```

It takes in any object, and generates a set of inputs based on the object's keys and values.

Nested objects will result in child folders being created.

Options can be passed to the second argument to customize the inputs being generated, and/or to include/exclude specific keys from generation.

While the simplified version of the type signature for `addMany` above might seem a bit complex, it's actually quite simple in practice! Let's break it down:

The `addMany` method takes two arguments:

1. `target`: The object to create inputs from.
2. `options`: Options to customize the inputs generated, as well as `include` and `exclude` arrays to omit certain keys.

It returns an object with two properties:

1. `folders`: An array of `Folder` instances created from the object's nested objects, if any.
2. `inputs`: An array of `Input` instances created from the object's primitive values.

Let's look at an example to see how this works in practice.

```typescript
const {inputs, folders} = gooey.addMany({
  myNumber: 5,
  myFolder: {
    myColor: '#4aa7ff',
  }
})
```
This will result in an `InputNumber`, and a `Folder` titled `myFolder` containing an `InputColor`.

```typescript
inputs.myNumber  // -> InputNumber
inputs.myColor   // -> InputColor

folders.myFolder // -> Folder
```

Suppose we want to configure the `min` and `max` options for `myNumber`.  To do this, we can specify them in the second argument:

```typescript
const { inputs, folders }  = gooey.addMany({
  myNumber: 5,
  myFolder: {
    myColor: '#4aa7ff',
  }
}, {
  myNumber: {
    min: 0,
    max: 10,
  }
})
```

And that's it!  If all goes well, you should get strong intellisense for all available options in the second argument.  If you don't, please file an issue!

Sometimes, relying on inference won't be enough, and you'll need an escape-hatch to get the exact inputs you want.  In that case, you can `exclude` a key from generation, and create it manually with a more specific adder:

```typescript
const { inputs, folders }  = gooey.addMany({
  myNumber: 5,
  myFolder: {
    myColor: 'hsl(200, 100%, 50%)', // -> InputText (wrong! let's exclude it)
  }
}, {
  exclude: ['myColor'],
})

// ...and now we can add it manually:
gooey.addColor('myColor', 'hsl(200, 100%, 50%)', {
  // and customize it a bit:
  mode: 'hsl'
})
```

### `bind`

```typescript
type bind = <T>(
  target: T,
  key: keyof T,
  options?: InputOptions<T>
): Input<T>
```

The `Folder.bind` method can be used to create an input that is bound to a key on a target object. When an input created with `bind` is changed, the target object's value for the given key will be updated automatically.

```typescript
const data = {
	size: 12,
	color: '#4aa7ff' as const,
}

gooey.bind(data, 'size') // -> InputNumber
gooey.bind(data, 'color') // -> InputColor
```

<br>

## About

I built this to scratch an itch, and to pave the way for more advanced features related to WebGL / WebAudio / audio-reactive 3D in the future.

[tweakpane](https://github.com/cocopon/tweakpane) was the main inspiration for this project. I recommend it over `gooey` -- it's a more lightweight solution with more features and an awesome, highly active developer!

Other, similar projects:

-   [lil-gui](https://github.com/georgealways/lil-gui)
-   [dat.gui](https://github.com/dataarts/dat.gui)

<br>

## Roadmap

-   [ ] Graph / Monitor Input
-   [ ] LFO / Envelope Manager
-   [ ] Bezier Curve Editor Input
-   [ ] Plugins
-   [ ] Framework Wrappers (svelte 5 runes "just work", but other frameworks need wrappers)
