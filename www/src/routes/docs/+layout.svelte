<script lang="ts">
	import { Nav } from '$lib/components/Nav'
	import '$lib/data/docs/docs.scss'

	const { children } = $props()
</script>

<div class="sidebar-background"></div>

<div class="sidebar">
	<Nav />
</div>

<div class="docs-page">
	{@render children?.()}
</div>

<style>
	.sidebar {
		position: fixed;
		left: 0;
		width: 13rem;
		z-index: 3;
	}

	.sidebar-background {
		transition: 1s cubic-bezier(0, 0.82, 0, 1.08);
	}

	@media (width < 1000px) {
		.sidebar-background {
			width: 0%;
		}
	}
</style>
