<script>
	import Nav from '$lib/components/Nav/Nav.svelte'

	const { children } = $props()
</script>

<div class="sidebar">
	<Nav />
</div>

<div class="demo-page">
	{@render children?.()}
</div>

<style>
	.demo-page {
		display: flex;
		min-height: 100vh;
		height: 100%;
		width: 100%;
	}

	@keyframes slide {
		to {
			transform: translateX(-100%);
		}
	}
</style>
