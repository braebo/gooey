<script>
	import Desktop from '$lib/components/Header/Nav/Desktop.svelte'
	import { setContext } from 'svelte'

	setContext('links', [
		['/demos/gooey', 'Gooey'],
		['/demos/orbs', 'Orbs']
	])
</script>

<Desktop />

<slot />
