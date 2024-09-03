<script lang="ts" module>
	import { page } from '$app/stores'

	interface Data {
		code: string
		fn?: (gooey: Gooey) => void
	}

	const goo4Data = $state({
		wght: 300,
		wdth: 100,
	})

	export const data = {
		// Basics
		goo1: {
			code: `import { Gooey } from 'gooey'

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
			code: `
const title = gooey.add('title', 'change me')

title.on('change', (v) => gooey.title = v)`.trim(),
			fn: g => {
				g.add('title', 'change me').on('change', v => {
					if (g) g.title = v
				})
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
		// addMany
		goo3: {
			code: `
gooey.addMany({
  stuff: true,
  more_stuff: {
    like_colors: '#4aa7ff',
    or_buttons: () => alert('thanks!')
  }
})`.trim(),
			// todo - Add this to addMany section:
			// 			code: `
			// const controls = {
			//   foo: true,
			//   bar: {
			//     baz: '#ff0000',
			//     qux: () => alert('thanks!')
			//   }
			// }

			// gooey.addMany(controls, {
			//   foo: { description: 'good stuff' },
			//   bar: { folderOptions: { open: false }}
			// })`.trim(),
			fn: g => {
				g.addMany({
					stuff: true,
					more_stuff: {
						like_colors: '#4aa7ff',
						or_buttons: () => alert('thanks!'),
					},
				})
			},
		},
		goo4: {
			code: `
const data = {
  wght: 300,
  wdth: 100,
}

gooey.bindMany(data)
`.trim(),
			fn: g => {
				g.bindMany(goo4Data, { wght: { min: 100, max: 900 }, wdth: { min: 75, max: 125 } })
			},
		},
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
		goo5: {
			code: `
const folder = gooey.addFolder('user')

folder.add('name', 'Stewy Gooey')

const subFolder = folder.addFolder('secret', {
  closed: true,
})

secretFolder.add('password', '1234', {
  disabled: true,
})
`.trim(),
			fn: gooey => {
				// Create a user folder
				const user = gooey.addFolder('user')

				// Add a name input
				user.add('name', 'Stewy Gooey')

				// Add a closed folder
				const secretFolder = user.addFolder('secret', {
					closed: true,
				})

				secretFolder.add('password', '1234', {
					disabled: true,
				})
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
	let bindManyEl = $state<HTMLElement>()
</script>

<h2 id="basics" class="section-title">Basics</h2>

<section class="section">
	<div class="description">
		Create a <span class="gooey">gooey</span> with some <a href="#inputs">inputs </a>
	</div>

	<!--? goo1 - `add` method -->

	<div class="example">
		<Code ssr headless lang="ts" highlightedText={highlighted.goo1} />

		<LiveExample onMount={data.goo1.fn} position="center" />
	</div>

	<!--? goo3 - `addMany` method -->

	<div class="br"></div>
	<div class="description">
		Use <code>addMany</code> to create multiple inputs at once
	</div>

	<div class="example">
		<Code ssr headless lang="ts" highlightedText={highlighted.goo3} />

		<LiveExample onMount={data.goo3.fn} position="top-center" heightSm="16rem" />
	</div>

	<!--? goo2 - `on` method -->

	<div class="br"></div>
	<div class="description">
		Do stuff <code>on</code> change
	</div>

	<div class="example">
		<Code ssr headless lang="ts" highlightedText={highlighted.goo2} />

		<LiveExample onMount={data.goo2.fn} position="center" />
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

	<!--? goo4 - `bindMany` method -->

	<div class="br"></div>
	<div class="description">Or just bind gooey to your own objects</div>

	<div class="example">
		<Code ssr headless lang="ts" highlightedText={highlighted.goo4} />

		<LiveExample onMount={data.goo4.fn} title="font" position="top-center" heightSm="12rem">
			<div class="display" style="font-variation-settings: 'wght' {goo4Data.wght}, 'wdth' {goo4Data.wdth}">
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
				<!--? `onChange` option -->

				<div class="br-sm"></div>
				<div class="description">
					You can also pass options to <code>bindMany</code>
				</div>
				<div class="br-sm"></div>
				<div class="example">
					<Code headless lang="ts" highlightedText={highlighted.bindMany1} ssr />
				</div>
				<div class="br"></div>
			</Info>
		{/if}
	</div>

	<!--? goo5 - Folders -->

	<div class="br"></div>
	<div class="description">
		Create <a href="#folders">folders</a> with <code>addFolder</code>
	</div>

	<div class="example">
		<Code ssr headless lang="ts" highlightedText={highlighted.goo5} />

		<LiveExample onMount={data.goo5.fn} position="center" />
	</div>
</section>

<style>
	.display {
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
