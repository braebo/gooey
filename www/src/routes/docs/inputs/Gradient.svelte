<!-- based on InputGradient: "../../../../../src/inputs/InputGradient.ts" -->

<script lang="ts">
	import { gradientToString, sampleGradient } from 'gooey'
	import LiveExample from '$lib/components/LiveExample.svelte'
	import Props from '$lib/components/Props.svelte'
	import H from '$lib/components/H.svelte'
</script>

<H l="2" id="gradient">Gradient</H>

<section class="section">
	<!--? Overview -->

	<div class="description">
		Gradient inputs edit a list of colour stops. Drag a stop to move it, press the strip to add one, and drag
		one off the strip (or press <code>Delete</code>) to remove it. The selected stop's colour is edited with the
		colour picker below the strip.
	</div>

	<!--? Basic usage -->

	<div class="example">
		<!-- shiki-start
```ts
// stops
gooey.addGradient('heat', [
  { offset: 0, color: '#3b82f6' },
  { offset: 0.35, color: '#14b8a6' },
  { offset: 0.6, color: '#eab308' },
  { offset: 0.8, color: '#f97316' },
  { offset: 1, color: '#ef4444' },
])

// bare colours, spaced evenly
gooey.addGradient('sunset', ['#ff7e5f', '#feb47b', '#86a8e7'])

// binding
const theme = { ramp: [{ offset: 0, color: '#000000' }, { offset: 1, color: '#ffffff' }] }
gooey.bindGradient(theme, 'ramp')
```
shiki-end -->

		<LiveExample
			title="Basic Gradient Inputs"
			onMount={g => {
				g.addGradient('heat', [
					{ offset: 0, color: '#3b82f6' },
					{ offset: 0.35, color: '#14b8a6' },
					{ offset: 0.6, color: '#eab308' },
					{ offset: 0.8, color: '#f97316' },
					{ offset: 1, color: '#ef4444' },
				])

				g.addGradient('sunset', ['#ff7e5f', '#feb47b', '#86a8e7'])

				const theme = {
					ramp: [
						{ offset: 0, color: '#000000' },
						{ offset: 1, color: '#ffffff' },
					],
				}
				g.bindGradient(theme, 'ramp')
			}}
			position="center"
		/>
	</div>

	<!--? Using the value -->

	<div class="br"></div>
	<H l="3" id="GradientValue">Using the value</H>

	<div class="description">
		The value is plain <code>{'{ offset, color }'}</code> stops, sorted by offset (<code>0..1</code>), so it saves
		and serializes as-is. <code>gradientToString</code> renders it as CSS, and <code>sampleGradient</code> reads the
		colour at any point along it.
	</div>

	<div class="example">
		<!-- shiki-start
```ts
import { gradientToString, sampleGradient } from 'gooey'

const usage = gooey.addGradient('usage', ['#3b82f6', '#22c55e', '#eab308', '#ef4444'])
const level = gooey.addNumber('level', 0.29, { min: 0, max: 1, step: 0.01 })

const paint = () => {
  swatch.style.background = sampleGradient(usage.value, level.value)
  bar.style.background = gradientToString(usage.value)
}
usage.on('change', paint)
level.on('change', paint)
```
shiki-end -->

		<LiveExample
			title="Sampling a Gradient"
			onMount={g => {
				const usage = g.addGradient('usage', ['#3b82f6', '#22c55e', '#eab308', '#ef4444'])
				const level = g.addNumber('level', 0.29, { min: 0, max: 1, step: 0.01 })

				const block = () => {
					const el = document.createElement('div')
					el.style.cssText = 'height: 1.25rem; width: 100%; border-radius: 0.25rem;'
					return el
				}
				const swatch = block()
				const bar = block()
				g.addElement('sample', swatch)
				g.addElement('css', bar)

				const paint = () => {
					swatch.style.background = sampleGradient(usage.value, level.value)
					bar.style.background = gradientToString(usage.value)
				}
				usage.on('change', paint)
				level.on('change', paint)
				paint()
			}}
			position="center"
		/>
	</div>

	<!--? Options -->

	<div class="br"></div>
	<H l="3" id="GradientOptions">Gradient Options</H>

	<div class="description">
		<Props
			props={[
				{
					name: 'step',
					description: 'the increment a dragged stop snaps to, and the arrow keys move by',
					default: '0.01',
				},
				{
					name: 'mode',
					description: "the selected stop's colour format",
					default: '"hex"',
					values: '"rgba" | "rgbaString" | "hsla" | "hslaString" | "hex" | "hex8"',
				},
				{
					name: 'expanded',
					description: "whether the selected stop's colour picker starts open",
					default: 'false',
				},
			]}
		/>
	</div>
</section>
