<script lang="ts">
	import type { Branch } from '$lib/utils/tree'

	import { clickOutside } from '$lib/utils/clickOutside'
	import { isActive } from '$lib/utils/isActive'
	import Burger from './Mobile/Burger.svelte'
	import { fly } from 'svelte/transition'
	import { Tree } from '$lib/utils/tree'
	import { page } from '$app/stores'
	import { mobile } from 'fractils'

	const { absolute = true } = $props()

	const tree = new Tree($page.data.routes)
	const links = tree.root.children!

	let showMenu = $state(false)

	// import { Gooey } from '../../../../../../src'
	// import { goto } from '$app/navigation'
	// import { onMount } from 'svelte'

	// onMount(() => {
	// 	const gooey = new Gooey({ title: 'nav' })

	// 	function walk(node: Branch, depth = 0) {
	// 		if (!node.name.startsWith('_')) {
	// 			gooey.addButton(
	// 				'',
	// 				() => {
	// 					goto(node.path)
	// 				},
	// 				{ text: node.name },
	// 			)
	// 		}

	// 		for (const child of node.children ?? []) {
	// 			walk(child, depth + 1)
	// 		}
	// 	}

	// 	for (const link of links) {
	// 		walk(link)
	// 	}

	// 	return gooey.dispose
	// })
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
				<div
					class="li"
					class:active={isActive(child.name, $page.url.pathname)}
					in:fly={{ y: -10 - 5 * i - j * 2.5 }}
					style:view-transition-name="li-{child.name}"
					style="margin-left: 1rem;"
				>
					<a class="depth-{depth}" data-sveltekit-prefetch href={child.path}>
						{child.name.replaceAll('-', ' ')}
					</a>
					{#if $page.url.pathname.includes(child.path)}
						{@render subnav(child, i, depth + 1)}
					{/if}
				</div>
			{/each}
		</ul>
	{/snippet}

	<nav class:absolute>
		<ul>
			{#each links ?? [] as link, i (link.name)}
				<div class="li" in:fly={{ y: -10 - 5 * i }} style:view-transition-name="li-{link.name}">
					<a
						class="depth-0"
						data-sveltekit-prefetch
						href={link.path}
						class:active={isActive(link.name, $page.url.pathname)}
					>
						{link.name.replaceAll('-', ' ')}
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
		display: flex;
		align-items: center;
		gap: 1rem;

		width: 100%;
		height: 100vh;
		max-width: 50rem;
		margin: 0 auto;
		padding-left: 1rem;

		pointer-events: none;
		contain: strict;

		z-index: 1;
	}

	nav.absolute {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
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

		text-transform: capitalize;
	}

	.depth-0 {
		text-transform: uppercase;
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
