<script lang="ts">
	import type { Tab } from '$lib/components/Code.svelte'

	import { importMode, IMPORT_MODES } from '$lib/data/importMode.svelte'
	import Code from '$lib/components/Code.svelte'
	import H from '$lib/components/H.svelte'

	let first = true
	/** The parent element of the import example. */
	let el = $state<HTMLDivElement>()
	/** The span that contains the 'gooey' text. */
	let span = $derived(el ? Array.from(el.querySelectorAll('span')).find(node => node.innerText == "'gooey'") : null)
	/** The animation object. */
	let anim: Animation | null = null
	/** Used to animate the text. */
	let div: HTMLDivElement | null = null

	let tabs: Tab[] = $derived([
		{
			text: 'JSR',
			onclick: () => (importMode.value = 'JSR'),
			active: importMode.value === 'JSR',
		},
		{
			text: 'NPM',
			onclick: () => (importMode.value = 'NPM'),
			active: importMode.value === 'NPM',
		},
		{
			text: 'CDN',
			onclick: () => (importMode.value = 'CDN'),
			active: importMode.value === 'CDN',
		},
	])

	$effect(() => {
		if (importMode.value) {
			if (first) {
				if (span) span.innerText = `'${IMPORT_MODES[importMode.value]}'`
				first = false
				console.warn('first')
			} else {
				console.log('animate')
				animate()
			}
		}
	})

	async function animate() {
		if (!div) {
			div = document.createElement('div')
			div.style.setProperty('display', 'inline-block')
			div.innerText = span?.innerText ?? ''
			if (span) {
				span.innerHTML = ''
				span.appendChild(div)
			}
		}

		anim = div.animate(
			[
				{ opacity: 1, transform: 'translateY(0px)' },
				{ opacity: 0, transform: 'translateY(-5px)' },
			],
			{ duration: 50 },
		)

		await anim.finished

		div.innerText = `'${IMPORT_MODES[importMode.value]}'`

		anim = div.animate(
			[
				{ opacity: 0, transform: 'translateY(5px)' },
				{ opacity: 1, transform: 'translateY(0px)' },
			],
			{ duration: 100 },
		)
	}
</script>

<H l="2" id="import">Import</H>

<section class="section">
	<!--? basics - import -->

	<div class="description">
		Import the <code>Gooey</code> class to create a new <span class="gooey">gooey</span>
	</div>

	<div class="example" bind:this={el}>
		<Code {tabs} headless={false}>
			{#snippet children()}
				<!-- shiki-start
nowrap
```ts
import { Gooey } from 'gooey'
 
const gooey = new Gooey()
```
shiki-end -->
			{/snippet}
		</Code>
	</div>
</section>

<style>
	.example {
		:global(.code-window) {
			border-radius: var(--radius);
		}
	}
</style>
