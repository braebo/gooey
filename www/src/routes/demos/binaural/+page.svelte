<script lang="ts">
	import { BinauralBeats } from './beats/BinauralBeats'
	import { onMount } from 'svelte'

	onMount(() => {
		const beats = new BinauralBeats({ volume: 0.5 })

		return () => {
			beats.dispose()
		}
	})
</script>
