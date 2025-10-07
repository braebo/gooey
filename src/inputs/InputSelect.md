# InputSelect

Currently, `InputSelect` is a bit of a special case. I'm still struggling on the best way to handle it in `Folder.{add|bind}Many`, and how/when to differentiate between a plain array of values and a `SelectInputOptions` object. The most ergonmic API alludes me, but now that we have `InputArray`, we can handle it more explicitly.

# API

## `addSelect`

Adding a single select input to a folder:

```typescript
gooey.addSelect('theme', 'light', { options: ['light', 'dark'] })
// or
gooey.addSelect('theme', { value: 'light', options: ['light', 'dark'] })
```

`value` is always the current value of the input being consumed by the user. In the case of `InputSelect`, it's the `selected` option in the `options` array. Unlike most other inputs, however, both value `T` and options `T[]` are converted to a `LabeledOption<T>`, which means that `value` is always a `LabeledOption<T>`. This could be unintuitive for users who expect `value` to be the same shape as whatever `T` they passed in, but my thinking was that, in cases where the `label` is needed to be displayed to an end user, it's less work to have to manually track and calculate labels based on the selected option. This thinking is somewhat flawed though, as a user could always just provide labeled options and a labaled intitial value to ensure they have access to both the value and label.

I feel it would be wise to reevaluate this decision not that we have `InputArray` and are making changes to the `InputSelect` API.

## `bindSelect`

Binding a select input to a target object:

```typescript
const target = { theme: ['light', 'dark'] }
gooey.bindSelect(target, 'theme')
```

## `addMany`

Passing a data object containing data intended for an `InputSelect` to `addMany`:

```typescript
const data = { theme: { value: 'light', options: ['light', 'dark'] } }
const { inputs } = gooey.addMany(data)

inputs.theme // -> InputSelect
```

## `bindMany`

Passing a data object containing data intended for an `InputSelect` to `bindMany` is a bit tricky, as the user likely has a target object with a value, and would need to provide the options separately.  `bindMany` allows us to pass options to the input as the third argument, and the valid options are fully inferred from the target object, but in this case, there's no way to know if the 'string' value is intended to be the a `InputText`, or a selected value in an `InputSelect`, so the options type needs to be flexible, and ideally see `options` as a qualifier to override the inference from `InputText` to `InputSelect`.

It's often the case that objects being `bound` to as opposed to `added` will have a value already that is less flexible and more problematic to change the shape of as it's often being consumed in an application, unlike added inputs which are more often consumed via `value` as the source of truth, thus making it less of an ask to have the user change the input data from `{ theme: 'light' }` to something like `{ theme: { value: 'light', options: ['light', 'dark'] } }` as we do in `addMany`.

```typescript
const data = { theme: 'light' }
const { inputs } = gooey.bindMany(data, 'theme', {
	theme: { options: ['light', 'dark'] },
})

inputs.theme //=> InputSelect
```

# TODO Convert the following `addSelect` thought dump code into more structured thoughts / examples like those above.

```ts
const arr = this.add('arr', ['a', 'b', 'c'])
//^ InputArray<string>

const sel1 = this.addSelect('sel3', 'foo', { options: ['foo', 'bar', 'baz'] }) // I like this API because it communicates the importance of the input.value being the selected option's value.
//^ InputSelect<unknown> (should be InputSelect<string>)

const sel3 = this.addSelect('sel1', { value: 'a', options: ['a', 'b', 'c'] }) //  I like this API because it doesn't require additional options.options to be specified.
//^ InputSelect<unknown> (should be InputSelect<string>)

// This is a currently supported API, but it's no longer intuitive because `value` is no longer `LabeledOption<T>`, and is now just `T`, so it should probably be removed as much as I'm averse to imposing (often vital) restrictions..
const sel2 = this.addSelect('sel2', [{ value: 'a', label: 'Option A' }], { initialValue: { value: 'a', label: 'Option A' } })
// I don't know why this works too and what the difference is -- that's confusing... but this likely also shares problems with the old API above and should be removed.
const sel2 = this.addSelect('sel2', [{ value: 'a', label: 'Option A' }], { value: { value: 'a', label: 'Option A' } })
```