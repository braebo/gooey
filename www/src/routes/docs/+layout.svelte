<script lang="ts">
	import { Nav } from '$lib/components/Nav'
	import '$lib/data/docs/docs.scss'

	const { children } = $props()
</script>

<div class="sidebar">
	<Nav />
</div>

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
