<script lang="ts">
	import { Tree } from '$lib/utils/tree'
	import { page } from '$app/stores'

	import Desktop from './Desktop.svelte'

	const tree = new Tree($page.data.routes)
	const links = tree.root.children!
</script>

<Desktop {links} />
