<script lang="ts">
	import type { Branch } from '$lib/utils/tree'

	import { isActive } from '$lib/utils/isActive'
	import PageFill from './PageFill.svelte'
	import { fly } from 'svelte/transition'
	import { page } from '$app/stores'

	let { links, showMenu = true }: { links: Branch[]; showMenu?: boolean } = $props()
</script>

<PageFill bind:showMenu />

{#if showMenu}
	{#snippet subnav(link: Branch, i = 0, depth = 1)}
		<ul>
			{#each link.children?.filter((c) => !c.name.startsWith('_')) ?? [] as child, j (child.name)}
				<div
					class="li depth-{depth}"
					class:active={isActive(child.name, $page.url.pathname)}
					in:fly={{ y: -10 - 5 * i - j * 2.5 }}
					style:view-transition-name="li-{child.name}"
					style="margin-top: .5rem;"
				>
					<a data-sveltekit-prefetch href={child.path}>
						{child.name}
					</a>
					{#if $page.url.pathname.includes(child.path)}
						{@render subnav(child, i, depth + 1)}
					{/if}
				</div>
			{/each}
		</ul>
	{/snippet}

	<nav class="showMenu">
		<ul>
			{#each links ?? [] as link, i (link.name)}
				<div class="li depth-0" in:fly={{ y: -10 - 5 * i }} style:view-transition-name="li-{link.name}">
					<a data-sveltekit-prefetch href={link.path} class:active={isActive(link.name, $page.url.pathname)}>
						{link.name}
					</a>
					{#if $page.url.pathname.includes(link.path)}
						{@render subnav(link, i)}
					{/if}
				</div>
			{/each}
		</ul>
	</nav>
{/if}

<style>
	nav {
		display: flex;
		justify-content: center;

		pointer-events: none;
		position: fixed;
		inset: 0;
		top: -50vh;
		z-index: 99;
	}

	ul {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;

		margin: auto;
	}

	.li {
		list-style: none;

		color: var(--fg-a);
		font-size: 1.2rem;
	}

	.li.depth-0 {
		font-size: 2rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 10%;
	}

	a {
		display: flex;
		align-items: center;

		height: 100%;

		color: currentColor;
		text-decoration: none;

		transition: color 0.15s linear;
		pointer-events: all;
	}

	a:hover {
		color: var(--theme-a);

		text-decoration: none;
	}

	.active {
		color: var(--theme-a);
	}
</style>
