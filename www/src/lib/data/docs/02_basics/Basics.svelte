<script lang="ts" module>
	import { page } from '$app/stores'

	interface Data {
		code: string
		fn?: (gooey: Gooey) => void
	}

	export const data = {
		// Basics
		goo1: {
			code: /*ts*/ `import { Gooey } from 'gooey'

const gooey = new Gooey()

gooey.add('hello', 'world')
gooey.add('count', 1)`.trim(),
			fn: g => {
				g.add('hello', 'world')
				g.add('count', 1)
			},
		},
		// Event handling
		goo2: {
			code: /*js*/ `
const title = gooey.add('title', 'change me')

title.on('change', (v) => gooey.title = v)`.trim(),
			fn: g => {
				g.add('title', 'change me').on('change', v => {
					if (g) g.title = v
				})
			},
		},
		// addMany
		goo3: {
			code: /*ts*/ `
const stuff = {
  a: true,
  b: {
    c: '#ff0000',
    d: ['e', 'e', 'z']
  }
}
`.trim(),
			fn: g => {
				g.bindMany(
					{
						a: true,
						b: {
							c: '#ff0000',
							d: 'a',
						},
					},
					{
						d: {
							options: ['a', 'b', 'c'],
						},
					},
				)
			},
		},
		events1: {
			code: `
gooey.add('title', 'change me', {
  onChange: (v) => gooey.title = v
})`.trim(),
		},
		events2: {
			code: `
gooey
  .add('title', 'change me')
  .on('change', (v) => gooey.title = v)`.trim(),
		},
	} as const satisfies Record<string, Data>
</script>

<script lang="ts">
	import type { Gooey } from '../../../../../../src'

	import LiveExample from '$lib/components/LiveExample.svelte'
	import Info from '$lib/components/Info.svelte'
	import Code from '$lib/components/Code.svelte'

	const { highlighted } = $page.data

	let eventsEl = $state<HTMLElement>()

	let goo1 = $state<Gooey>()
	$effect(() => {
		if (goo1) data.goo1.fn(goo1)
	})

	let goo2 = $state<Gooey>()
	$effect(() => {
		if (goo2) data.goo2.fn(goo2)
	})

	let goo3 = $state<Gooey>()
	$effect(() => {
		if (goo3) data.goo3.fn(goo3)
	})
</script>

<h2 id="basics" class="section-title">Basics</h2>

<section class="section">
	<div class="description">
		Create a <span class="gooey">gooey</span> with some <a href="#inputs">inputs </a>
	</div>

	<!--? `add` method -->

	<div class="example">
		<Code headless lang="ts" highlightedText={highlighted.goo1} ssr />

		<LiveExample bind:gooey={goo1} position="center" />
	</div>

	<!--? event handling -->

	<div class="br"></div>
	<div class="description">
		<!-- <p>Handle <a href="#events">events</a> with <code>on</code></p> -->
		Do stuff <code>on</code> change
	</div>

	<div class="example">
		<Code headless lang="ts" highlightedText={highlighted.goo2} ssr />

		<LiveExample bind:gooey={goo2} position="center" />
	</div>

	<div class="info-wrapper">
		<div class="description em">
			<span bind:this={eventsEl}>
				See <a href="#events">Events</a>
			</span>
		</div>

		{#if eventsEl}
			<!-- show={/*deleteme*/ true}  -->
			<Info tooltipText={['more info', 'less info']} target={eventsEl} side="left">
				<!--? `onChange` option -->

				<div class="br-sm"></div>
				<div class="example inline">
					<div class="description">
						The <code>onChange</code> option can also be used
					</div>

					<Code headless lang="ts" highlightedText={highlighted.events1} ssr />
				</div>
				<div class="br"></div>

				<!--? Chaining `on` method -->

				<div class="example inline">
					<div class="description">Or you can chain stuff</div>

					<Code headless lang="ts" highlightedText={highlighted.events2} ssr />
				</div>
				<div class="br-sm"></div>
			</Info>
		{/if}
	</div>

	<!--? addMany -->

	<div class="br"></div>
	<div class="description">
		Use <code>addMany</code> to create multiple inputs at once
	</div>

	<div class="example">
		<Code headless lang="ts" highlightedText={highlighted.goo3} ssr />

		<LiveExample bind:gooey={goo3} />
	</div>
</section>
