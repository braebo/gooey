<script lang="ts">
	import type { Gooey } from '../../../../../../src'

	import LiveExample from '$lib/components/LiveExample.svelte'
	import Info from '$lib/components/Info.svelte'
	import Code from '$lib/components/Code.svelte'

	let eventsEl = $state<HTMLElement>()

	// First gooey: using the `add` method
	let goo1 = $state<Gooey>()
	const goo1Code = /*ts*/ `import { Gooey } from 'gooey'

const gooey = new Gooey()

gooey.add('hello', 'world')
gooey.add('count', 1)`.trim()
	$effect(() => {
		goo1?.add('hello', 'world')
		goo1?.add('count', 1)
	})

	// `on` method
	let goo2 = $state<Gooey>()
	const goo2Code = /*js*/ `
const title = gooey.add('title', 'change me')

title.on('change', (v) => gooey.title = v)`.trim()
	$effect(() => {
		goo2?.add('title', 'change me').on('change', v => {
			if (goo2) goo2.title = v
		})
	})

	// `onChange` option
	let goo3 = $state<Gooey>()
	const goo3Code = /*ts*/ `
gooey.add('title', 'change me', {
  onChange: (v) => gooey.title = v
})`.trim()
	$effect(() => {
		goo3?.add('title', 'change me', {
			onChange: v => {
				if (goo3) goo3.title = v
			},
		})
	})

	// chaining the `on` method
	let goo4 = $state<Gooey>()
	const goo4Code = /*ts*/ `
gooey
  .add('title', 'change me')
  .on('change', (v) => gooey.title = v)`.trim()
	$effect(() => {
		goo4?.add('title', 'change me').on('change', v => {
			if (goo4) goo4.title = v
		})
	})

	let goo5 = $state<Gooey>()
	const goo5Code = /*ts*/ `
const stuff = {
  foo: 'bar',
  baz: 1
}

gooey.bindMany(stuff)`.trim()
	$effect(() => {
		goo5?.bindMany({
			foo: 'bar',
			baz: 1,
		})
	})
</script>

<h2 id="basics" class="section-title">Basics</h2>

<section class="section">
	<div class="description">
		Create a <span class="gooey">gooey</span> with some <a href="#inputs">inputs </a>
	</div>

	<!--? `add` method -->

	<div class="example">
		<Code headless lang="ts" text={goo1Code} />

		<LiveExample bind:gooey={goo1} position="center" />
	</div>

	<!--? event handling -->

	<div class="br"></div>
	<div class="description">
		<!-- <p>Handle <a href="#events">events</a> with <code>on</code></p> -->
		Do stuff <code>on</code> change
	</div>

	<div class="example">
		<Code headless lang="ts" text={goo2Code} />

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

					<Code headless lang="ts" text={goo3Code} />
				</div>
				<div class="br"></div>

				<!--? Chaining `on` method -->

				<div class="example inline">
					<div class="description">Or you can chain stuff</div>

					<Code headless lang="ts" text={goo4Code} />
				</div>
				<div class="br-sm"></div>
			</Info>
		{/if}
	</div>

	<!--? bindMany -->

	<div class="br"></div>
	<div class="description">
		Use <code>bindMany</code> to bind multiple inputs at once
	</div>

	<div class="example">
		<Code headless lang="ts" text={goo5Code} />

		<LiveExample bind:gooey={goo5} position="center" />
	</div>
</section>

