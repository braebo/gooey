<script lang="ts">
	import { Nav } from '$lib/components/Nav'
</script>

<div class="page">
	<div class="sidebar">
		<Nav absolute={false} />
	</div>
	<div class="docs-page">
		<slot />
	</div>
</div>

<style lang="scss">
	.page {
		display: flex;
	}
	.sidebar {
		width: 10rem;
	}
	.docs-page {
		display: flex;
		flex-direction: column;

		width: var(--page-width);
		margin: 0 auto;
	}
</style>
