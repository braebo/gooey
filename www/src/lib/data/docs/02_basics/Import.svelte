<!-- <script lang="ts">
	import type { Tab } from '$lib/components/Code.svelte'

	import { importMode, IMPORT_MODES } from '$lib/data/importMode.svelte'
	import { page } from '$app/stores'

	// const { highlighted } = $page.data as Data

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

	let importCode = $derived(wow?.innerText.replace('PATH', IMPORT_MODES[importMode.value]))
</script> -->

<h2 id="import" class="section-title">Import</h2>

<section class="section">
	<!--? basics - import -->

	<div class="description">
		Import the <code>Gooey</code> class to create a new <span class="gooey">gooey</span>
	</div>

	<div class="example">
		<!-- <Code ssr headless lang="ts" highlightedText={highlighted.events.code} /> -->
		<!-- shiki-start
```ts
gooey.add('title', 'change me', {
  onChange: (v) => gooey.title = v
})
```
shiki-end -->
	</div>

	<div class="example">
		<!-- shiki-start
```ts
import { Gooey } from 'PATH'

const gooey = new Gooey()
```
shiki-end -->
	</div>
</section>

<style>
	.example {
		:global(.code-window) {
			border-radius: var(--radius);
		}
	}
</style>
