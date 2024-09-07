<script lang="ts">
	import type { Branch } from '$lib/utils/tree'

	import { isActive } from '$lib/utils/isActive'
	import { device } from '$lib/device.svelte'
	import { fly } from 'svelte/transition'
	import { Tree } from '$lib/utils/tree'
	import { page } from '$app/stores'

	const { absolute = true } = $props()

	// prettier-ignore
	const routes = [
		...$page.data.routes,
		'/docs#install',
		'/docs#import',
		'/docs#basics',
	]

	const links = new Tree(routes as string[]).root.children!

	function sort(links?: Branch[]): Branch[] | undefined {
		return links?.toSorted((a, b) => {
			return routes.indexOf(a.path) - routes.indexOf(b.path)
		})
	}

	let activeHeading = $state('')

	$effect(() => {
		const root = document.body
		const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6')

		function callback(entries: IntersectionObserverEntry[]) {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue
				activeHeading = entry.target.id
			}
		}

		const observer = new IntersectionObserver(callback, {
			threshold: 1,
			rootMargin: '25px 0px -75% 0px',
		})

		for (const heading of Array.from(headings)) {
			observer.observe(heading)
		}

		return () => observer.disconnect()
	})

	{
		// import { Gooey } from '../../../../../src'
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
	}
</script>

{#if !device.mobile}
	<nav class:absolute class:mobile={device.mobile}>
		<ul>
			{#each sort(links) ?? [] as link, i (link.name)}
				<div class="li" in:fly={{ y: -10 - 5 * i }} style:view-transition-name="li-{link.name}">
					<a
						class="depth-0"
						data-sveltekit-prefetch
						href={link.path}
						class:active={isActive(link.name, $page.url.pathname)}
						style="
							padding-left: 0.5rem;
							animation-delay: {i * 0.1}s;
						"
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

	{#snippet subnav(link: Branch, i = 0, depth = 1)}
		<ul>
			{#each sort(link.children?.filter(c => !c.name.startsWith('_'))) ?? [] as child, j (child.name)}
				<div
					class="li"
					class:active={isActive(child.name, $page.url.pathname)}
					style="
						padding-left: {depth * 1.5}rem;
						view-transition-name: li-{child.name};
						animation-delay: {0.1 + i * 0.1 + j * 0.05 + (depth - 1) * 0.2}s;
					"
				>
					<a
						class="depth-{depth}"
						data-sveltekit-prefetch
						href={child.path}
						class:active={child.name === activeHeading}
					>
						{child.name.replaceAll('-', ' ')}
					</a>
				</div>
				{#if $page.url.pathname.includes(child.path)}
					{@render subnav(child, i, depth + 1)}
				{/if}
			{/each}
		</ul>
	{/snippet}
{/if}

<style>
	nav {
		contain: strict;

		display: flex;
		align-items: center;
		gap: 1rem;

		width: 100%;
		height: 100vh;
		margin: 0 auto;
		padding-left: 0.75rem;

		pointer-events: none;

		z-index: 1;
	}

	nav.absolute {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
	}

	ul {
		padding: 0;

		z-index: 1;
	}

	.li {
		position: relative;
		width: 100%;
		min-width: 10rem;
		height: 100%;

		/* padding: 0.5rem 2px; */
		margin: 0;
		margin-top: 1rem;

		opacity: 0;
		color: var(--fg-a);

		text-transform: capitalize;

		animation: fly 0.5s cubic-bezier(0, 0.51, 0.02, 1) forwards;
	}
	@keyframes fly {
		from {
			opacity: 0;
			translate: -0.5rem 0;
		}
		to {
			opacity: 1;
			translate: 0 0;
		}
	}

	a {
		display: flex;
		align-items: center;
		justify-content: flex-start;

		width: 100%;
		height: 100%;

		color: var(--fg-c);

		font-family: Fredoka;
		font-size: var(--font-md);
		text-decoration: none;
		letter-spacing: 1px;
		font-variation-settings:
			'wght' 400,
			'wdth' 100;

		transition: 0.2s;
		pointer-events: all;
	}

	a.depth-0 {
		letter-spacing: 2.75px;
		text-transform: uppercase;
		font-size: var(--font-lg);
		font-variation-settings:
			'wght' 200,
			'wdth' 98;
	}

	.li:has(a.active) a:not(.active) {
		color: var(--fg-a);
	}

	a:hover {
		color: var(--fg-a);
		text-decoration: none;

		font-variation-settings:
			'wght' 500,
			'wdth' 98;
	}

	.active {
		color: var(--theme-a);
		/* font-variation-settings:
			'wght' 500,
			'wdth' 94.66; */
	}

	a.active {
		font-variation-settings:
			'wght' 500,
			'wdth' 96.66;
	}
</style>
