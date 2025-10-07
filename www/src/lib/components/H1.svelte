<script lang="ts">
	import type { Snippet } from 'svelte'

	export let children: Snippet
</script>

{#if children}
	<div class="br-md"></div>
	<h1>{@render children()}</h1>
{/if}

<style lang="scss">
	h1 {
		font-size: var(--font-xxxl);
		font-family: var(--font-b);
		font-variation-settings:
			'wght' 500,
			'wdth' 80;
	}
</style>
