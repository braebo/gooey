<script lang="ts">
	import { Nav } from '$lib/components/Nav'
	// import NavConnectors from '$lib/components/Nav/NavConnectors.svelte'
	// import { device } from '$lib/device.svelte'
	import '../../styles/docs.scss'

	const { children } = $props()
</script>

<div class="sidebar">
	<Nav />
	<!-- {#if !device.mobile}
		<NavConnectors />
	{/if} -->
</div>

<div class="sidebar-background" />

<div class="docs-page">
	{@render children?.()}
</div>

<style lang="scss">
	.sidebar {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 3;
		width: 15rem;
	}

	.sidebar-background {
		view-transition-name: sidebar-background;

		position: relative;
		left: 0;
		top: 0;

		min-height: 100%;
		// width: 13rem;
		min-width: 15rem;

		background: var(--bg-a);

		z-index: 1;

		transform: translateX(-100%);
		transition: transform 0.3s cubic-bezier(0, 0.82, 0, 1.08);
		animation: slide 0.3s cubic-bezier(0, 0.82, 0, 1.08) forwards;

		&::after {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			width: 0.2rem;
			height: 100%;
			background: inherit;
			z-index: 2;
		}
	}

	@media (width < 1000px) {
		.sidebar-background {
			min-width: 0;
		}
	}
</style>
