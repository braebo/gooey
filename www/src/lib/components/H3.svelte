<script lang="ts">
	import type { Snippet } from 'svelte'

	const { id, children } = $props<{ id: string; children: Snippet }>()
</script>

<a href="#{id}">
	<h3 {id} class:section-title={typeof id === 'string'}>
		{@render children()}
	</h3>
</a>

<style>
	a {
		text-decoration: none;

		transition: 0.1s ease-out;

		h3::before {
			content: '#';
			color: var(--bg-b);
			font-size: 1.5rem;
		}
	}

	a:hover {
		h3::before {
			color: var(--bg-c);
		}
	}

	h3 {
		transform: none;
		margin-bottom: 0;
		left: 0;
		font-variation-settings:
			'wght' 300,
			'wdth' 98;
	}
</style>
