<script lang="ts" module>
	import { page } from '$app/stores'

	interface Data {
		code: string
		fn?: (gooey: Gooey) => void
	}

	export const data = {
		// Simple Example
		g1: {
			code: `
import { Gooey } from 'gooey'

const gooey = new Gooey()

gooey.add('hello', 'world')
gooey.add('count', 1)
`.trim(),
			fn: g => {
				g.add('hello', 'world')
				g.add('count', 1)
			},
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
</script>

<h2 id="basics" class="section-title">Basics</h2>

<section class="section">
	<div class="description">
		Create a <span class="gooey">gooey</span> with some <a href="#inputs">inputs </a>
	</div>

	<!--? Simple Example -->

	<div class="example">
		<Code headless lang="ts" highlightedText={highlighted.g1} ssr />

		<LiveExample onMount={data.g1.fn} position="center" />
	</div>

	<!--? Optional Info -->

	<div class="info-wrapper">
		<div class="description em">
			<span bind:this={eventsEl}>
				See <a href="#events">Events</a>
			</span>
		</div>

		{#if eventsEl}
			<Info target={eventsEl} side="left">
				<div class="br-sm"></div>
				<div class="example inline">
					<div class="description">
						This <code>Info</code> component shows info, believe it or not.
					</div>

					<Code headless lang="ts" highlightedText={`console.log('hello world')`} ssr />
				</div>
			</Info>
		{/if}
	</div>
</section>
