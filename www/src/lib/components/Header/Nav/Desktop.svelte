<script lang="ts">
	import { fly } from 'svelte/transition'
	import { getContext } from 'svelte'
	import { page } from '$app/stores'

	const links = getContext('links') as [string, string][]
</script>

<nav class="showMenu">
	<ul>
		{#each links as [path, title], i (title)}
			{@const crumbs = $page.url.pathname.split('/')}
			{@const active = !path
				.split('/')
				.map((p) => !crumbs.includes(p))
				.some(Boolean)}

			<li class:active transition:fly|global={{ y: -10 - 5 * i }}>
				<a data-sveltekit-prefetch href={path}>{title}</a>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	nav {
		display: flex;
		justify-content: center;
		padding-bottom: 1rem;
		
		width: 100%;

		pointer-events: none;
	}

	ul {
		display: flex;
		gap: 3rem;
		
		z-index: 1;
	}

	li {
		position: relative;
		list-style: none;

		color: var(--fg-a);
	}

	a {
		min-width: 5rem;
		display: flex;
		align-items: center;
		justify-content: center;

		height: 100%;

		color: currentColor;

		font-family: fredoka;
		font-size: var(--font-sm);
		font-variation-settings:
			'wght' 300,
			'wdth' 97;
		text-transform: uppercase;
		text-decoration: none;
		letter-spacing: 2.75px;

		transition: 0.2s;
		pointer-events: all;
	}

	a:hover {
		text-decoration: none;

		font-variation-settings:
			'wght' 700,
			'wdth' 94.66;
	}

	.active {
		color: var(--theme-a);
		a {
			font-variation-settings:
				'wght' 500,
				'wdth' 94.66;
		}
	}
</style>
