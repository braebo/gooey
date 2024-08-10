<script lang="ts">
	import { clickOutside } from '$lib/utils/clickOutside'
	import { isActive } from '$lib/utils/isActive'
	import { type Branch } from '$lib/utils/tree'
	import Burger from './Mobile/Burger.svelte'
	import { fly } from 'svelte/transition'
	import { page } from '$app/stores'
	import { mobile } from 'fractils'

	const { links }: { links: Branch[] } = $props()
	let showMenu = $state(false)
</script>

{#if $mobile}
	<div class="burger" use:clickOutside={{ whitelist: ['wrapper'] }} onoutclick={() => (showMenu = false)}>
		<Burger bind:showMenu />
	</div>
{/if}

{#if !$mobile || showMenu}
	{#snippet subnav(link: Branch, i = 0, depth = 1)}
		<ul>
			{#each link.children?.filter((c) => !c.name.startsWith('_')) ?? [] as child, j (child.name)}
				<!-- <div class="li depth-{depth}" class:active={isActive(child.name)}> -->
				<div
					class="li depth-{depth}"
					class:active={isActive(child.name, $page.url.pathname)}
					in:fly={{ y: -10 - 5 * i - j * 2.5 }}
					style:view-transition-name="li-{child.name}"
					style="margin-left: 1.5rem;"
				>
					<!-- <a style:view-transition-name="li-{child.name}" data-sveltekit-prefetch href={child.path}> -->
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

<style lang="scss">
	.code {
		display: flex;
		height: fit-content;
		min-width: 10rem;
		max-width: clamp(20rem, 50vw, 90vw);
		box-sizing: border-box;
		z-index: 1;
		contain: strict;
	}

	nav {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 1rem;
		display: flex;
		align-items: center;

		width: 100%;
		max-width: 50rem;
		margin: 0 auto;
		gap: 1rem;

		pointer-events: none;
		contain: strict;

		z-index: 1;
	}

	ul {
		all: unset;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;

		margin: 0;

		z-index: 1;
	}

	.li {
		position: relative;
		height: 100%;

		padding: 0.5rem 2px;
		margin: 0;

		color: var(--fg-a);

		font-size: var(--font-xs);
		letter-spacing: 1.5px;
	}

	.depth-0 {
		font-size: var(--font-sm);
	}

	a {
		min-width: 5rem;
		display: flex;
		align-items: center;
		justify-content: flex-start;

		height: 100%;

		color: currentColor;

		font-family: fredoka;
		font-variation-settings:
			'wght' 300,
			'wdth' 97;
		text-transform: uppercase;
		text-decoration: none;
		letter-spacing: 2.75px;

		transition: 0.2s;
		pointer-events: all;

		animation: fade 0.2s;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	a:hover {
		text-decoration: none;

		font-variation-settings:
			'wght' 700,
			'wdth' 94.66;
	}

	.active {
		color: var(--theme-a);
		font-variation-settings:
			'wght' 500,
			'wdth' 94.66;
	}
</style>
