<script lang="ts">
	import type { Gooey } from '../../../../../src'

	import GooeyThemeSync from '$lib/components/GooeyThemeSync.svelte'
	import { BinauralBeats } from './beats/BinauralBeats'
	import { onMount } from 'svelte'

	let gooey: Gooey

	onMount(() => {
		const beats = new BinauralBeats({ volume: 0.5 })
		gooey = beats.gooey

		return () => {
			beats.dispose()
		}
	})
</script>

{#if gooey}
	<GooeyThemeSync {gooey} />
{/if}
