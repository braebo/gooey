<script lang="ts">
	import GooeyThemeSync from '$lib/components/GooeyThemeSync.svelte'
	import { Nav } from '$lib/components/Nav'
	import '$lib/data/docs/docs.scss'
	import { onMount } from 'svelte'

	import { Gooey } from '../../../../../gooey/src/Gooey'

	const { children } = $props()

	let gooey = $state<Gooey>()

	onMount(() => {
		gooey = new Gooey({
			title: 'page',
			position: 'top-right',
			margin: { x: 16, y: 16 * 3.5 },
			storage: {
				key: 'docs-gradient',
				size: true,
				position: true,
			},
		})
	})
</script>

<div class="sidebar">
	<Nav />
</div>


{#if gooey}
	<GooeyThemeSync {gooey} />
{/if}

<div class="docs-page">
	{@render children?.()}
</div>

<style lang="scss">
	.sidebar {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 3;
	}
</style>
