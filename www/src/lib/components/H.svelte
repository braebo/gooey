<script lang="ts">
	import type { Snippet } from 'svelte'

	const { id, l = '1', children } = $props<{ id: string; l: '1' | '2' | '3'; children: Snippet }>()
</script>

<a href="#{id}">
	{#if l === '1'}
		<h1 {id} class:section-title={typeof id === 'string'}>
			{@render children()}
		</h1>
	{:else if l === '2'}
		<h2 {id} class:section-title={typeof id === 'string'}>
			{@render children()}
		</h2>
	{:else if l === '3'}
		<h3 {id} class:section-title={typeof id === 'string'}>
			{@render children()}
		</h3>
	{/if}
</a>

<style>
	a {
		position: relative;

		width: fit-content !important;
		height: fit-content !important;

		text-decoration: none !important;

		transition: 0.1s ease-out;

		&::before {
			content: '';
			position: absolute;
			bottom: 28%;

			max-width: 0px;
			width: 100%;
			height: 0.25rem;

			opacity: 0;
			background: var(--theme-a);
			border-radius: var(--radius-sm);
			border-bottom-right-radius: 1rem;

			transition: 0.2s cubic-bezier(0.75, 0.9, 0.12, 1.275);
			z-index: -1;
		}

		&:has(h1)::before {
			height: 1rem;
		}

		&:has(h3)::before {
			height: 0.1rem;
			bottom: 0%;
		}

		h2::before {
			content: '#';
			color: var(--bg-b);
			font-size: 0.75em;
			transition: 0.2s ease-out;
		}

		h3::before {
			content: '#';
			color: var(--bg-b);
			font-size: 1.5rem;
			transition: 0.2s ease-out;
		}
	}

	a:hover {
		&::before {
			opacity: 0.2;
			max-width: 100%;
		}

		h2::before {
			color: var(--bg-c);
		}

		h3::before {
			color: var(--bg-c);
		}
	}

	h1,
	h2,
	h3 {
		font-family: var(--font-b);
	}

	h1 {
		font-size: var(--font-xxxl);
		font-variation-settings:
			'wght' 500,
			'wdth' 80;
	}

	h2 {
		font-size: var(--font-xxl);
		font-variation-settings:
			'wght' 400,
			'wdth' 98;
	}

	h3 {
		transform: none;
		margin-bottom: 0;
		font-size: var(--font-lg);
		font-variation-settings:
			'wght' 300,
			'wdth' 98;
	}
</style>
