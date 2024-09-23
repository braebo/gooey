<script lang="ts" module>
	import type { Example } from './types'

	import { page } from '$app/stores'

	const bindManyData = $state({
		wght: 100,
		wdth: 75,
	})

	export const data = {
		// Add
		add: {
			code: `
gooey.add('hello', 'world')

gooey.add('count', 1, { min: -1 })`.trim(),
			fn: g => {
				g.add('hello', 'world')
				g.add('count', 1, { min: -1 })
			},
		},
		add1: {
			code: `
gooey.add('count', 1, {
  min: -1,
  max: 10,
  step: 0.1
})
`.trim(),
		},
		// addMany
		addMany: {
			code: `
gooey.addMany({
  stuff: true,
  more_stuff: {
    like_colors: '#4aa7ff' as const,
    or_buttons: () => alert('thanks!')
  }
})
`.trim(),
			fn: g => {
				g.addMany({
					stuff: true,
					more_stuff: {
						like_colors: '#4aa7ff' as const,
						or_buttons: () => alert('thanks!'),
					},
				})
			},
		},
		// Event handling
		events: {
			code: `
const title = gooey.add('title', 'change me')

title.on('change', (v) => gooey.title = v)
`.trim(),
			fn: g => {
				g.add('title', 'change me').on('change', v => {
					if (g) g.title = v
				})
			},
		},
		// Event handling info
		events1: {
			code: `
gooey.add('title', 'change me', {
  onChange: (v) => gooey.title = v
})
`.trim(),
		},
		events2: {
			code: `
gooey
  .add('title', 'change me')
  .on('change', (v) => gooey.title = v)
`.trim(),
		},
		// bind
		bind: {
			code: `
const data = {
  size: 12,
  color: '#4aa7ff' as const
}

gooey.bind(data, 'size')
gooey.bind(data, 'color')
`.trim(),
			fn: g => {
				const data = {
					size: 12,
					color: '#4aa7ffff' as const,
				}

				g.bind(data, 'size')
				g.bind(data, 'color')
			},
		},
		// bindMany
		bindMany: {
			code: `
const data = {
  wght: 100,
  wdth: 75,
}

gooey.bindMany(data)
`.trim(),
			fn: g => {
				g.bindMany(bindManyData, { wght: { min: 100, max: 900 }, wdth: { min: 75, max: 125 } })
			},
		},
		// bindMany info
		bindMany1: {
			code: `
const data = {
  wght: 300,
  wdth: 100,
}

gooey.bindMany(data, {
  wght: { min: 100, max: 900 },
  wdth: { min: 100, max: 130 }
})`.trim(),
		},
		// folders
		folders: {
			code: `
const outer = gooey.addFolder('outer')

const inner = outer.addFolder('inner')

inner.add('say sike', () => outer.close(), {
  text: 'sike',
})
`.trim(),
			fn: gooey => {
				const outer = gooey.addFolder('outer')

				const inner = outer.addFolder('inner')
				inner.add('say sike', () => outer.close(), {
					text: 'sike',
				})
			},
		},
		folders1: {
			code: `
// Persist all states
const gooey = new Gooey({ storage: true })

// Only \`closed\` state
const gooey = new Gooey({
  storage: {
    closed: true
  },
})
`.trim(),
		},
	} as const satisfies Example
</script>

<script lang="ts">
	import type { PageData } from '../../../../routes/docs/$types'

	import LiveExample from '$lib/components/LiveExample.svelte'
	import Info from '$lib/components/Info.svelte'
	import Code from '$lib/components/Code.svelte'

	const { highlighted } = $page.data as PageData

	let addEl = $state<HTMLElement>()
	let eventsEl = $state<HTMLElement>()
	let bindManyEl = $state<HTMLElement>()
	let proTipEl = $state<HTMLElement>()
</script>

<h2 id="basics" class="section-title">Basics</h2>

<section class="section">
	<!--? basics - `add` method -->

	<div class="description">
		Use <code>add</code> to create a new <a href="#inputs">input</a>
	</div>

	<div class="example">
		<Code ssr headless lang="ts" highlightedText={highlighted.add} />

		<LiveExample title="add" onMount={data.add.fn}  position="center" />
	</div>

	<div class="info-wrapper">
		<div class="description em">
			<span bind:this={addEl}>
				See <a href="#add">add</a>
			</span>
		</div>

		{#if addEl}
			<Info target={addEl} side="left" tooltipText={['tldr', 'k thx']} --max-width="33rem">
				<div class="description">
					The options available in the third argument will change depending on the type of input. For example:
				</div>

				<div class="example">
					<Code headless lang="ts" highlightedText={highlighted.add1} ssr />
				</div>

				<div class="description">
					Here, <span class="gooey">gooey</span> infers the options as <code>NumberInputOptions</code>
					because the initial value of <code>1</code> is a <strong>number</strong>, which is why it accepts
					<mono>min</mono>, <mono>max</mono>, and <mono>step</mono> options.
				</div>

				<div class="description em plain">
					This should get you some nice, dynamic intellisense, but you can always fall back to the more
					specific adders if need be, like <code>addNumber</code> , <code>addColor</code> , etc.
				</div>
			</Info>
		{/if}
	</div>

	<!--? addMany - `addMany` method -->

	<div class="br"></div>
	<div class="description">
		Use <code>addMany</code> to create multiple inputs at once
	</div>

	<div class="example">
		<Code ssr headless lang="ts" highlightedText={highlighted.addMany} />

		<LiveExample title="addMany" onMount={data.addMany.fn}  position="top-center" heightSm="16rem" />
	</div>

	<!--? events - `on` method -->

	<div class="br"></div>
	<div class="description">
		Do stuff <code>on</code> change
	</div>

	<div class="example">
		<Code ssr headless lang="ts" highlightedText={highlighted.events} />

		<LiveExample title="on" onMount={data.events.fn} position="center" />
	</div>

	<div class="info-wrapper">
		<div class="description em">
			<span bind:this={eventsEl}>
				See <a href="#events">Events</a>
			</span>
		</div>

		{#if eventsEl}
			<Info target={eventsEl} side="left">
				<!--? `onChange` option -->

				<div class="example inline">
					<div class="description">
						The <code>onChange</code> option can also be used
					</div>

					<Code headless lang="ts" highlightedText={highlighted.events1} ssr />
				</div>

				<!--? Chaining `on` method -->

				<div class="example inline">
					<div class="description">Or you can chain stuff</div>

					<Code headless lang="ts" highlightedText={highlighted.events2} ssr />
				</div>
			</Info>
		{/if}
	</div>

	<!--? bind - `bind` method -->

	<div class="br"></div>
	<div class="description">
		Alternatively, <code>bind</code> to any object to keep its values in sync automatically
		<em>(as opposed to using <code>add</code> with events)</em>
	</div>

	<div class="example">
		<Code ssr headless lang="ts" highlightedText={highlighted.bind} />

		<LiveExample title="bind" onMount={data.bind.fn}  position="top-center" />
	</div>

	<!--? bindMany - `bindMany` method -->

	<div class="br"></div>
	<div class="description">
		Bind to an entire object with <code>bindMany</code>
	</div>

	<div class="example">
		<Code ssr headless lang="ts" highlightedText={highlighted.bindMany} />

		<LiveExample title="font" onMount={data.bindMany.fn}  position="top-center" heightSm="12rem">
			<div
				class="variable-font-display"
				style="font-variation-settings: 'wght' {bindManyData.wght}, 'wdth' {bindManyData.wdth}"
			>
				variable fonts are neat
			</div>
		</LiveExample>
	</div>

	<div class="info-wrapper">
		<div class="description em">
			<span bind:this={bindManyEl}>
				See <a href="#bindmany">bindMany</a>
			</span>
		</div>

		{#if bindManyEl}
			<Info target={bindManyEl} side="left">
				<div class="description">
					You can also pass options to <code>bindMany</code>
				</div>

				<div class="example">
					<Code headless lang="ts" highlightedText={highlighted.bindMany1} ssr />
				</div>

				<div class="description em plain">
					The types here will be inferred for all that intellisense goodness
				</div>
			</Info>
		{/if}
	</div>

	<!--? folders - Folders -->

	<div class="br"></div>
	<div class="description">
		Create <a href="#folders">folders</a> with <code>addFolder</code>
	</div>

	<div class="example">
		<Code ssr headless lang="ts" highlightedText={highlighted.folders} />

		<LiveExample title="folders" onMount={data.folders.fn}  position="center" />
	</div>

	<!--? folders1 - Folders Info 1 -->

	<div class="info-wrapper">
		<div class="description em">
			<span bind:this={proTipEl}>
				<span style="color:var(--bg-e)">Pro tip &nbsp;·&nbsp; </span>
				<span style="color:var(--fg-c)">click folder headers to open / close them</span>
			</span>
		</div>

		{#if proTipEl}
			<Info target={proTipEl} side="left" tooltipText={['more tips', 'less tips']}>
				<div class="description">
					The <code>closed</code> state can be persisted in <code>localStorage</code>
				</div>

				<div class="example">
					<Code headless lang="ts" highlightedText={highlighted.folders1} ssr />
				</div>
			</Info>
		{/if}
	</div>
</section>

<style>
	.variable-font-display {
		position: absolute;
		inset: 0;

		display: flex;
		justify-content: center;
		align-items: flex-end;
		gap: var(--padding-lg);

		padding: var(--padding);

		font-size: var(--font-xl);
	}
</style>
