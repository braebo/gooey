<!-- based on InputSelect: "../../../../../src/inputs/InputSelect.ts" -->

<script lang="ts">
	import LiveExample from '$lib/components/LiveExample.svelte'
	import Props from '$lib/components/Props.svelte'
	import H from '$lib/components/H.svelte'
</script>

<H l="2" id="select">Select</H>

<section class="section">
	<!--? Overview -->

	<div class="description">Select inputs provide a dropdown menu for choosing from a list of options.</div>

	<!--? Basic usage -->

	<div class="example">
		<!-- shiki-start
```ts
// explicit
gooey.addSelect('theme', 'dark', ['light', 'dark', 'auto'])

// implicit with inline options
gooey.add('size', { value: 'medium', options: ['small', 'medium', 'large'] })

// binding
const data = { mode: 'easy' }
gooey.bind(data, 'mode', { options: ['easy', 'normal', 'hard'] })
```
shiki-end -->

		<LiveExample
			title="Basic Select Inputs"
			onMount={g => {
				g.add('size', { value: 'medium', options: ['small', 'medium', 'large'] })
				g.addSelect('theme', 'dark', ['light', 'dark', 'auto'])

				const data = { mode: 'easy' }
				g.bind(data, 'mode', { options: ['easy', 'normal', 'hard'] })
			}}
			position="center"
		/>
	</div>

	<!--? Options -->

	<div class="br"></div>
	<H l="3" id="SelectOptions">Select Options</H>

	<div class="description">
		<Props
			props={[
				{
					name: 'options',
					description: 'array of available options',
					required: true,
				},
				{
					name: 'labelKey',
					description: 'key to use as label for object options',
					default: 'auto-detects "label" or "title" properties',
				},
			]}
		/>
	</div>

	<div class="example">
		<!-- shiki-start
c"has-focus" p
```ts
// String options
gooey.add('fruit', 'apple', {
  options: ['apple', 'banana', 'orange']  //! c"focus"
})

// Labeled options
gooey.add('country', { label: 'USA', value: 'us' }, {
  options: [  //! c"focus"
    { label: 'USA', value: 'us' },  //! c"focus"
    { label: 'Canada', value: 'ca' }  //! c"focus"
  ]  //! c"focus"
})
```
shiki-end -->

		<LiveExample
			title="Select Options"
			onMount={g => {
				g.add('fruit', 'apple', {
					options: ['apple', 'banana', 'orange'],
				})
				g.add('country', { label: 'USA', value: 'us' }, {
					options: [
						{ label: 'USA', value: 'us' },
						{ label: 'Canada', value: 'ca' },
					],
				})
			}}
			position="center"
		/>
	</div>

	<!--? Advanced usage -->

	<div class="br"></div>
	<div class="description">Some more advanced stuff you can do with select inputs:</div>

	<div class="example">
		<!-- shiki-start
```ts
// Object options with labelKey
const users = [
  { name: 'Alice', id: 1 },
  { name: 'Bob', id: 2 }
]
gooey.add('user', users[0], {
  options: users,
  labelKey: 'name'
})

// Using onChange callback
gooey.add('choice', 'a', {
  options: ['a', 'b', 'c'],
  onChange: (v) => console.log('Selected:', v)
})

// Dynamic disabled state
gooey.add('dynamicSelect', 'opt1', {
  options: ['opt1', 'opt2', 'opt3'],
  disabled: () => someCondition
})
```
shiki-end -->

		<LiveExample
			title="Advanced Select Usage"
			onMount={g => {
				const users = [
					{ name: 'Alice', id: 1 },
					{ name: 'Bob', id: 2 },
				]
				g.add('user', users[0], {
					options: users,
					labelKey: 'name',
				})
				g.add('choice', 'a', {
					options: ['a', 'b', 'c'],
					onChange: v => console.log('Selected:', v),
				})
				let someCondition = false
				g.add('dynamicSelect', 'opt1', {
					options: ['opt1', 'opt2', 'opt3'],
					disabled: () => someCondition,
				})
				g.add('Toggle disabled', () => (someCondition = !someCondition))
			}}
			position="center"
		/>
	</div>

	<div class="description">
		You can use labeled options, specify a labelKey for objects, use callbacks, or pass a function to `disabled` for
		dynamic, programmatic toggling, for example.
	</div>
</section>
