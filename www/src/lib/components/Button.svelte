<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		children,
		onclick = () => {},
		center = false,
		active = $bindable(false),
	}: {
		children: Snippet
		onclick: () => void
		center: boolean
		active: boolean
	} = $props()
</script>

<button {onclick} class:center class:active>
	{@render children?.()}
</button>

<style lang="scss">
	button {
		background: var(--bg-b);
		border: none;
		outline: 1px solid color-mix(in lch, var(--bg-b), var(--bg-c) 50%);
		border-radius: var(--radius-md);
		width: fit-content;

		padding: var(--padding-sm) var(--padding-md);
		font-size: var(--font-xs);
		font-family: var(--font-a);
		font-variation-settings:
			'wght' 400,
			'wdth' 105;
	}

	.center {
		display: flex;
		margin: 0 auto;
	}
</style>
