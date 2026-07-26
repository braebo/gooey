<!-- based on InputText: "../../../../../src/inputs/InputText.ts" -->

<script lang="ts">
	import LiveExample from '$lib/components/LiveExample.svelte'
	import Props from '$lib/components/Props.svelte'
	import H from '$lib/components/H.svelte'
</script>

<H l="2" id="text">Text</H>

<section class="section">
	<!--? Overview -->

	<div class="description">Text inputs provide a simple text input field with configurable character limits.</div>

	<!--? Basic usage -->

	<div class="example">
		<!-- shiki-start
```ts
// explicit
gooey.addText('name', 'Alice')

// implicit
gooey.add('username', 'user123')

// binding
const data = { message: 'Hello' }
gooey.bind(data, 'message')
```
shiki-end -->

		<LiveExample
			title="Basic Text Inputs"
			onMount={g => {
				g.add('username', 'user123')
				g.addText('name', 'Alice')

				const data = { message: 'Hello' }
				g.bind(data, 'message')
			}}
			position="center"
		/>
	</div>

	<!--? Options -->

	<div class="br"></div>
	<H l="3" id="TextOptions">Text Options</H>

	<div class="description">
		<Props
			props={[
				{
					name: 'maxLength',
					description: 'maximum number of characters that can be entered',
					// default: '50',
				},
			]}
		/>
	</div>

	<div class="example">
		<!-- shiki-start
c"has-focus" p
```ts
gooey.add('bio', 'Short bio', {
  maxLength: 10,  //! c"focus"
})
```
shiki-end -->

		<LiveExample
			title="Text Options"
			onMount={g => {
				g.addText('bio', 'Short bio', { maxLength: 10 })
			}}
			position="center"
		/>
	</div>

	<!--? Advanced usage -->

	<div class="br"></div>
	<div class="description">Some more advanced stuff you can do with text inputs:</div>

	<div class="example">
		<!-- shiki-start
```ts
// Binding to an object property
const data = { name: 'Alice' }
gooey.bind(data, 'name', { maxLength: 20 })

// Using onChange callback
gooey.add('username', 'user', {
  onChange: (v) => console.log('New value:', v)
})

// Dynamic disabled state
gooey.add('dynamicText', 'editable', {
  disabled: () => someCondition
})
```
shiki-end -->

		<LiveExample
			title="Advanced Text Input Usage"
			onMount={g => {
				const data = { name: 'Alice' }
				g.bind(data, 'name', { maxLength: 20 })
				g.add('username', 'user', {
					onChange: v => console.log('New value:', v),
				})
				let someCondition = false
				g.add('dynamicText', 'editable', {
					disabled: () => someCondition,
				})
				g.add('Toggle disabled', () => (someCondition = !someCondition))
			}}
			position="center"
		/>
	</div>

	<div class="description">
		You can bind to object properties, use callbacks, or pass a function to `disabled` for dynamic, programmatic
		toggling, for example.
	</div>
</section>
