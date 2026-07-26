<!-- based on InputColor: "../../../../../src/inputs/InputColor.ts" -->

<script lang="ts">
	import LiveExample from '$lib/components/LiveExample.svelte'
	import Props from '$lib/components/Props.svelte'
	import H from '$lib/components/H.svelte'
</script>

<H l="2" id="color">Color</H>

<section class="section">
	<!--? Overview -->

	<div class="description">Color inputs provide a full-featured color picker with multiple format support.</div>

	<!--? Basic usage -->

	<div class="example">
		<!-- shiki-start
```ts
// explicit
gooey.addColor('primary', '#FF0000')

// implicit
gooey.add('accent', '#00FF00')

// binding
const data = { color: '#0000FF' }
gooey.bind(data, 'color')
```
shiki-end -->

		<LiveExample
			title="Basic Color Inputs"
			onMount={g => {
				g.add('accent', '#00FF00')
				g.addColor('primary', '#FF0000')

				const data = { color: '#0000FF' }
				g.bind(data, 'color')
			}}
			position="center"
		/>
	</div>

	<!--? Options -->

	<div class="br"></div>
	<H l="3" id="ColorOptions">Color Options</H>

	<div class="description">
		<Props
			props={[
				{
					name: 'mode',
					description: 'color format mode',
					default: '"hex"',
					values: '"rgba" | "rgbaString" | "hsla" | "hslaString" | "hex" | "hex8"',
				},
				{
					name: 'expanded',
					description: 'whether the color picker is initially expanded',
					default: 'false',
				},
			]}
		/>
	</div>

	<div class="example">
		<!-- shiki-start
c"has-focus" p
```ts
gooey.add('color', '#FF00FF', {
  mode: 'rgba',     //! c"focus"
  expanded: true,   //! c"focus"
})
```
shiki-end -->

		<LiveExample
			title="Color Options"
			onMount={g => {
				g.add('color', '#FF00FF', { mode: 'rgba', expanded: true })
			}}
			position="center"
		/>
	</div>

	<!--? Advanced usage -->

	<div class="br"></div>
	<div class="description">Some more advanced stuff you can do with color inputs:</div>

	<div class="example">
		<!-- shiki-start
```ts
// Binding to an object property
const data = { bgColor: '#FF5733' }
gooey.bind(data, 'bgColor', { mode: 'hex' })

// Using onChange callback
gooey.add('theme', '#0088FF', {
  onChange: (color) => console.log('New color:', color.hex)
})

// Dynamic disabled state
gooey.add('dynamicColor', '#AABBCC', {
  disabled: () => someCondition
})
```
shiki-end -->

		<LiveExample
			title="Advanced Color Input Usage"
			onMount={g => {
				const data = { bgColor: '#FF5733' }
				g.bind(data, 'bgColor', { mode: 'hex' })
				g.add('theme', '#0088FF', {
					onChange: color => console.log('New color:', color.hex),
				})
				let someCondition = false
				g.add('dynamicColor', '#AABBCC', {
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
