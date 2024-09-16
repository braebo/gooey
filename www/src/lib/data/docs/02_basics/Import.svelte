<script lang="ts" module>
	export const data = {
		import: {
			code: `
import { Gooey } from 'PATH'

const gooey = new Gooey()`.trim(),
			fn: () => {},
		},
	} as const satisfies Example
</script>

<script lang="ts">
	import type { Tab } from '$lib/components/Code.svelte'
	import type { Example, Data } from './types'

	import { importMode, IMPORT_MODES } from '$lib/data/importMode.svelte'
	import Code from '$lib/components/Code.svelte'
	import { page } from '$app/stores'

	const { highlighted } = $page.data as Data

	let tabs: Tab[] = $derived([
		{
			text: 'JSR',
			onclick: () => {
				importMode.value = 'JSR'
			},
			active: importMode.value === 'JSR',
		},
		{
			text: 'NPM',
			onclick: () => {
				importMode.value = 'NPM'
			},
			active: importMode.value === 'NPM',
		},
		{
			text: 'CDN',
			onclick: () => {
				importMode.value = 'CDN'
			},
			active: importMode.value === 'CDN',
		},
	])

	let importCode = $derived(highlighted.import.replace('PATH', IMPORT_MODES[importMode.value]))
</script>

<h2 id="import" class="section-title">Import</h2>

<section class="section">
	<!--? basics - import -->

	<div class="description">
		Import the <code>Gooey</code> class to create a new <span class="gooey">gooey</span>
	</div>

	<div class="example">
		<Code ssr lang="ts" highlightedText={importCode} {tabs} />
	</div>
</section>

<style>
	.example {
		:global(.code-window) {
			border-radius: var(--radius);
		}
	}
</style>
