<!-- based on InputBezier: "../../../../../src/inputs/InputBezier.ts" -->

<script lang="ts">
	import { bezierToString, cubicBezier } from 'gooey'
	import LiveExample from '$lib/components/LiveExample.svelte'
	import Props from '$lib/components/Props.svelte'
	import KBD from '$lib/components/KBD.svelte'
	import H from '$lib/components/H.svelte'
</script>

<H l="2" id="bezier">Bezier</H>

<section class="section">
	<!--? Overview -->

	<div class="description">
		Bezier inputs edit a cubic bézier easing curve: a graph with two draggable control points, a field for each of
		the four numbers, and a dropdown of named easings. The value is <code>[x1, y1, x2, y2]</code>, the four arguments
		of CSS <code>cubic-bezier()</code>.
	</div>

	<!--? Basic usage -->

	<div class="example">
		<!-- shiki-start
```ts
// control points
gooey.addBezier('ease', [0.16, 1, 0.3, 1])

// binding: a CSS string stays a string
const params = {
  curve: 'cubic-bezier(0.4, 0, 0.2, 1)',
}
gooey.bindBezier(params, 'curve')
```
shiki-end -->

		<LiveExample
			title="Basic Bezier Inputs"
			height="42rem"
			onMount={g => {
				g.addBezier('ease', [0.16, 1, 0.3, 1])

				const params = {
					curve: 'cubic-bezier(0.4, 0, 0.2, 1)',
				}
				g.bindBezier(params, 'curve')
			}}
			position="center"
		/>
	</div>

	<div class="description em">
		Drag a control point to reshape the curve; hold <KBD key="shift" /> while dragging to snap to <code>0.05</code>.
		Hovering a curve in the open dropdown previews it, and after each change a dot runs along the curve so you can
		feel the easing.
	</div>

	<div class="description em">
		The value can also start as a CSS keyword like <code>'ease-out'</code>. <code>add</code> won't guess a bezier:
		four numbers are an array like any other, so use <code>addBezier</code> or <code>bindBezier</code>.
	</div>

	<!--? Using the value -->

	<div class="br"></div>
	<H l="3" id="BezierValue">Using the value</H>

	<div class="description">
		<code>bezierToString</code> renders the value as a CSS <code>cubic-bezier()</code> string, and
		<code>cubicBezier</code> turns it into an easing function for JavaScript animation.
	</div>

	<div class="example">
		<!-- shiki-start
```ts
import {
  bezierToString,
  cubicBezier,
} from 'gooey'

const ease = gooey.addBezier(
  'ease',
  [0.34, 1.56, 0.64, 1],
)

// ball and label: any two elements on your page
const play = () => {
  const css = bezierToString(ease.value)
  label.textContent = css
  ball.style.transition = 'none'
  ball.style.left = '0%'
  ball.offsetWidth // restart it
  ball.style.transition = `left 1s ${css}`
  ball.style.left = 'calc(100% - 1rem)'
}
ease.on('change', play)
gooey.addButton('play', play)

// or in JS: y at x = 0.5
cubicBezier(...ease.value)(0.5)
```
shiki-end -->

		<LiveExample
			title="Easing a Transition"
			height="31rem"
			onMount={g => {
				const ease = g.addBezier('ease', [0.34, 1.56, 0.64, 1])

				const track = document.createElement('div')
				track.style.cssText = 'position: relative; height: 1rem; width: 100%;'
				const ball = document.createElement('div')
				ball.style.cssText =
					'position: absolute; left: 0%; width: 1rem; height: 1rem; border-radius: 50%; background: var(--gooey-theme-a);'
				track.append(ball)
				g.addElement('ball', track)

				const label = document.createElement('code')
				label.style.cssText = 'font-size: 0.75rem; white-space: nowrap;'
				label.textContent = bezierToString(ease.value)
				g.addElement('css', label)

				const play = () => {
					const css = bezierToString(ease.value)
					label.textContent = css
					ball.style.transition = 'none'
					ball.style.left = '0%'
					ball.offsetWidth
					ball.style.transition = `left 1s ${css}`
					ball.style.left = 'calc(100% - 1rem)'
				}
				ease.on('change', play)
				g.addButton('play', play)

				cubicBezier(...ease.value)(0.5)
			}}
			position="center"
		/>
	</div>

	<!--? Options -->

	<div class="br"></div>
	<H l="3" id="BezierOptions">Bezier Options</H>

	<div class="description">
		<Props
			props={[
				{
					name: 'easings',
					description: 'the named curves in the dropdown, as `{ name: [x1, y1, x2, y2] }`; `false` hides it',
					default: '`BEZIER_EASINGS` (the CSS keywords, plus `out-expo`, `out-quint` and `out-back`)',
				},
				{
					name: 'yMin',
					description: 'the lowest `y` a control point can be dragged to; below `0` allows anticipation',
					default: '`-0.5`',
				},
				{
					name: 'yMax',
					description: 'the highest `y` a control point can be dragged to; above `1` allows overshoot',
					default: '`1.5`',
				},
				{
					name: 'step',
					description: 'the increment a drag snaps to, and the step of the number fields',
					default: '`0.01`',
				},
				{
					name: 'preview',
					description: 'whether a dot runs along the curve after each change',
					default: '`true`',
				},
				{
					name: 'previewDuration',
					description: 'how long one preview run lasts, in milliseconds',
					default: '`750`',
				},
			]}
		/>
	</div>

	<div class="description em">
		Only dragging is clamped to <code>yMin</code> / <code>yMax</code>: <code>set</code> takes any <code>y</code>, as
		CSS does, and the graph grows to fit it. <code>x1</code> and <code>x2</code> are always clamped to
		<code>0..1</code>.
	</div>
</section>
