<script lang="ts">
	import type { Gooey } from '../../../../../../src'

	import LiveExample from '$lib/components/LiveExample.svelte'
	import Code from '$lib/components/Code.svelte'

	let goo1 = $state<Gooey>()
	let goo2 = $state<Gooey>()
	let goo3 = $state<Gooey>()
	let goo4 = $state<Gooey>()

	// First gooey: using the `add` method
	$effect(() => {
		goo1?.add('hello', 'world')
		goo1?.add('count', 1)
	})

	// `on` method
	$effect(() => {
		goo2?.add('title', 'change me').on('change', v => {
			if (goo2) goo2.title = v
		})
	})

	// `onChange` option
	$effect(() => {
		goo3?.add('title', 'change me', {
			onChange: v => {
				if (goo3) goo3.title = v
			},
		})
	})

	// chaining the `on` method
	$effect(() => {
		goo4?.add('title', 'change me').on('change', v => {
			if (goo4) goo4.title = v
		})
	})
</script>

<h2 id="basics" class="section-title">Basics</h2>

<section class="section">
	<div class="description">
		<p>
			Create a <span class="gooey">gooey</span> with some inputs:
		</p>
	</div>

	<!--? `add` method -->

	<div class="example">
		<Code
			headless
			lang="ts"
			text={`import { Gooey } from 'gooey'

const gooey = new Gooey()

gooey.add('hello', 'world')
gooey.add('count', 1)`.trim()}
		/>

		<LiveExample bind:gooey={goo1} position="center" />
	</div>

	<div class="description em">
		<p>See <a href="#inputs">Inputs</a> for more ways to create and manage inputs.</p>
	</div>

	<!--? event handling -->

	<div class="br"></div>
	<div class="description">
		<p>Handle change events with <code>on</code>:</p>
	</div>

	<div class="example">
		<Code
			headless
			lang="ts"
			text={`
const title = gooey.add('title', 'change me')

title.on('change', (v) => gooey.title = v)`.trim()}
		/>

		<LiveExample bind:gooey={goo2} position="center" />
	</div>

	<div class="description em">
		<p>See <a href="#events">Events</a> for more ways to interact with lifecycle events.</p>
	</div>

	<!--? `onChange` option -->

	<div class="br"></div>
	<div class="description">
		<p>Or, use the <code>onChange</code> option:</p>
	</div>

	<div class="example">
		<Code
			headless
			lang="ts"
			text={`
gooey.add('title', 'change me', {
  onChange: (v) => gooey.title = v
})`.trim()}
		/>

		<LiveExample bind:gooey={goo3} position="center" />
	</div>

	<!--? Chaining `on` method -->

	<div class="br"></div>
	<div class="description">
		<p>Most methods can also be chained if you're into that:</p>
	</div>

	<div class="example">
		<Code
			headless
			lang="ts"
			text={`
gooey
  .add('title', 'change me')
  .on('change', (v) => gooey.title = v)`.trim()}
		/>

		<LiveExample bind:gooey={goo4} position="center" />
	</div>
</section>
