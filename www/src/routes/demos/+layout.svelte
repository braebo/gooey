<script>
	import Desktop from '$lib/components/Header/Nav/Desktop.svelte'
	import { setContext } from 'svelte'

	setContext('links', [
		['/demos/orbs', 'Orbs']
	])
</script>

<Desktop />

<slot />
