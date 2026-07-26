<!-- based on InputNumber: "../../../../../src/inputs/InputNumber.ts" -->

<script lang="ts">
	import LiveExample from '$lib/components/LiveExample.svelte'
	import Props from '$lib/components/Props.svelte'
	import KBD from '$lib/components/KBD.svelte'
	import H from '$lib/components/H.svelte'
</script>

<H l="2" id="number">Number</H>

<section class="section">
	<!--? Overview -->

	<div class="description">Number inputs come with a text input, buttons, and a slider.</div>

	<!--? Dynamic min/max -->

	<div class="example">
		<!-- shiki-start
```ts
// explicit
gooey.addNumber('bar', 10)

// implicit
gooey.add('foo', 0)

// binding
const data = { count: 0 }
gooey.bind(data, 'count')
```
shiki-end -->

		<LiveExample
			title="Basic Number Inputs"
			onMount={g => {
				g.add('foo', -1)
				g.addNumber('bar', 10)

				const data = { count: 0 }
				g.bind(data, 'count')
			}}
			position="center"
		/>
	</div>

	<div class="description em">
		<span class="gooey">gooey</span> will <strong>try</strong> to guess useful <code>min</code> ,
		<code>max</code> , and <code>step</code> values based on the initial value
	</div>

	<!--? Options -->

	<div class="br"></div>
	<H l="3" id="NumberOptions">Number Options</H>

	<div class="description">
		<Props
			props={[
				{
					name: 'min',
					description: 'minimum value &nbsp;_ lowest / inclusive_',
					// default: '`0` for positive numbers, `initialValue * 2` for negative numbers.'
				},
				{
					name: 'max',
					description: 'maximum value &nbsp;_ highest / inclusive_',
					// default: '`initialValue * 2` for positive numbers, `initialValue * -2` for negative numbers.'
				},
				{
					name: 'step',
					description: 'increment / decrement amount',
					// default: '`0.001` if the `initialValue` is less than `10`, otherwise `0.1`'
				},
			]}
		/>
	</div>

	<div class="example">
		<!-- shiki-start
c"has-focus" p
```ts
gooey.add('foo', 50, {
  min: 0,    //! c"focus"
  max: 100,  //! c"focus"
  step: 1,   //! c"focus"
})
```
shiki-end -->

		<LiveExample
			title="Number Options"
			onMount={g => {
				g.add('foo', 50, { min: 0, max: 100, step: 1 })
			}}
			position="center"
		/>
	</div>

	<!--? Use cases -->

	<div class="br"></div>

	<div class="description">
		Hold <KBD key="cmd" /> to make the text input draggable. While dragging, holding <KBD key="shift" /> will double
		the step, and <KBD key="alt" /> will halve it (this works both on the slider, and when dragging the text input).
	</div>

	<div class="example">
		<!-- shiki-start
```ts
const number_input = gooey.add('drag', 50, {
    step: 1,
})

// Just so you can notice the tooltip ->
number_input.elements.controllers.input.tooltip.show()
```
shiki-end -->

		<LiveExample
			title="Text Dragging"
			onMount={g => {
				const i = g.add('drag', 50, {
					step: 1,
				})
				setTimeout(i.elements.controllers.input.tooltip.show, 10)
			}}
			position="center"
		/>
	</div>

	<!--? Advanced usage -->

	<div class="br"></div>
	<div class="description">Some more advanced stuff you can do with number inputs:</div>

	<div class="example">
		<!-- shiki-start
```ts
// Binding to an object property
const data = { count: 0 }
gooey.bind(data, 'count', { min: 0, max: 10 })

// Using onChange callback
gooey.add('value', 5, {
  onChange: (v) => console.log('New value:', v)
})

// Dynamic disabled state
gooey.add('dynamicNumber', 0, {
  disabled: () => someCondition
})
```
shiki-end -->

		<LiveExample
			title="Advanced Number Input Usage"
			onMount={g => {
				const data = { count: 0 }
				g.bind(data, 'count', { min: 0, max: 10 })
				g.add('value', 5, {
					onChange: v => console.log('New value:', v),
				})
				let someCondition = false
				g.add('dynamicNumber', 0, {
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
