<script lang="ts">
	import type { Gooey } from '../../../../../../src'

	import LiveExample from '$lib/components/LiveExample.svelte'
	import Code from '$lib/components/Code.svelte'

	let goo1 = $state<Gooey>()
	$effect(() => {
		goo1?.add('hello', 'world')
		goo1?.add('count', 1)
	})

	const goo2Title = 'change me'
	let goo2 = $state<Gooey>()
	$effect(() => {
		goo2?.add('title', goo2Title).on('change', v => {
			if (goo2) goo2.title = v
		})
	})

	let goo3 = $state<Gooey>()
	$effect(() => {
		goo3?.add('title', 'change me', {
			onChange: v => {
				if (goo3) goo3.title = v
			},
		})
	})
</script>

<h2 id="basics" class="section-title">Basics</h2>

<section class="section">
	<!--? create -->

	<div class="description">
		<p>
			Create a <span class="gooey">gooey</span>
		</p>
	</div>

	<div class="example">
		<Code
			headless
			lang="ts"
			text={`import { Gooey } from 'gooey'

const gooey = new Gooey()`.trim()}
		/>

		<LiveExample bind:gooey={goo1} position="center" />
	</div>

	<!--? `add` method -->

	<div class="br"></div>
	<div class="description">
		<p>
			<code>add</code> some inputs
		</p>
	</div>

	<div class="example">
		<Code
			headless
			lang="ts"
			text={`gooey.add('hello', 'world')
gooey.add('count', 1)`.trim()}
		/>

		<LiveExample bind:gooey={goo1} position="center" />
	</div>

	<!--? `on('change')` method -->

	<div class="br"></div>
	<div class="description">
		<p>Handle events with <code>on</code></p>
	</div>

	<div class="example">
		<Code
			headless
			lang="ts"
			text={`
gooey
  .add('title', '${goo2Title}')
  .on('change', (v) => gooey.title = v)`.trim()}
		/>

		<LiveExample bind:gooey={goo2} position="center" />
	</div>

	<!--? `onChange` option -->

	<div class="br"></div>
	<div class="description">
		<p>Or pass a callback to the <code>onChange</code> option.</p>
	</div>

	<div class="example">
		<Code
			headless
			lang="ts"
			text={`
gooey.add('title', '${goo2Title}', {
  onChange: (v) => gooey.title = v
})`.trim()}
		/>

		<LiveExample bind:gooey={goo3} position="center" />
	</div>
</section>
