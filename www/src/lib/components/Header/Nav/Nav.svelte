<script lang="ts">
	import { Tree } from '$lib/utils/tree'
	import { page } from '$app/stores'
	// import { mobile } from 'fractils'

	// import Mobile from './Mobile/Mobile.svelte'
	import Desktop from './Desktop.svelte'

	const tree = new Tree($page.data.routes)
	const links = tree.root.children!
</script>

<!-- {#if $mobile} -->
<!-- <Mobile {links} /> -->
<!-- {:else} -->
<Desktop {links} />
<!-- {/if} -->
