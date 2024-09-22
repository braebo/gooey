<script lang="ts">
	import type { Branch } from '$lib/utils/tree'

	import { isActive } from '$lib/utils/isActive'
	import { device } from '$lib/device.svelte'
	import { fly } from 'svelte/transition'
	import { Tree } from '$lib/utils/tree'
	import { page } from '$app/stores'
	import { DEV } from 'esm-env'

	const { absolute = true } = $props()

	// prettier-ignore
	const routes = [
		...$page.data.routes,
		'/docs#basics',
		'/docs#import',
		'/docs#install',
		'/docs/control/binding',
		'/docs/control/adding',
		'/docs/inputs/number',
		'/docs/inputs/text',
		'/docs/inputs/switch',
		'/docs/inputs/select',
		'/docs/inputs/color',
		'/docs/ui/folder',
		'/docs/ui/button',
		'/docs/persistence/storage',
		'/docs/persistence/presets',
		'/docs/persistence/history',
		'/docs/theming/themes',
		'/docs/theming/builder',
	]

	if (DEV) {
		routes.push('/demos/_test')
	}

	const links = new Tree(routes as string[]).root.children!

	function sort(links?: Branch[], skip = false): Branch[] | undefined {
		return skip
			? links
			: links?.toSorted((a, b) => {
					const _a = routes.find(r => r.includes(a.path))
					const _b = routes.find(r => r.includes(b.path))
					return routes.indexOf(_a!) - routes.indexOf(_b!)
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

	function shouldBeVisible(url: URL, path: string) {
		return url.pathname.startsWith(path.slice(0, path.slice(1).indexOf('/') + 1 || -1))
	}

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
			{#each sort(links, true) ?? [] as link, i (link.name)}
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

					{#if shouldBeVisible($page.url, link.path)}
						{@render subnav(link, i)}
					{/if}
				</div>
			{/each}
		</ul>
	</nav>

	{#snippet subnav(link: Branch, i = 0, depth = 1)}
		<ul>
			{#each sort( link.children?.filter(c => DEV || !c.name.startsWith('_')), false ) ?? [] as child, j (child.name)}
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

				{#if shouldBeVisible($page.url, child.path)}
					{@render subnav(child, i, depth + 1)}
				{/if}
			{/each}
		</ul>
	{/snippet}
{/if}

<style lang="scss">
	nav {
		display: flex;
		align-items: start;

		width: 100%;
		height: 100vh;
		min-height: auto;

		pointer-events: none;

		z-index: 1;
	}

	nav {
		scrollbar-gutter: auto;
	}

	nav::-webkit-scrollbar {
		height: 7px;
		width: 7px;

		border-radius: 0.25rem;
		background: transparent; /* make scrollbar transparent */
	}
	nav::-webkit-scrollbar-thumb {
		background: var(--bg-b);
		border-radius: 0.125rem;

		cursor: pointer;
	}
	nav::-webkit-scrollbar-corner {
		background: transparent;
	}

	nav.absolute {
		position: fixed;
		top: 2.5rem;
		left: 1rem;
	}

	ul {
		padding-left: 0.5rem;
		padding-right: 0.25rem;
		z-index: 1;
	}

	.li {
		box-sizing: border-box;
		position: relative;

		min-width: 10rem;
		height: 100%;
		margin: 0;

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
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: flex-start;

		width: 100%;
		height: 100%;
		padding: 0.5rem 0.75rem;

		color: var(--fg-c);
		border-radius: var(--radius);
		outline: 1px solid color-mix(in sRGB, var(--fg-b), transparent 100%);

		font-family: Fredoka;
		font-size: var(--font-md);
		text-decoration: none;
		letter-spacing: 1px;
		font-variation-settings:
			'wght' 400,
			'wdth' 100;

		transition:
			outline 0.1s,
			all 0.2s;
		pointer-events: all;
	}

	@mixin hover {
		outline: 1px solid color-mix(in sRGB, var(--fg-b), transparent 50%);

		font-variation-settings:
			'wght' 500,
			'wdth' 98;
	}

	a.depth-0 {
		border-radius: var(--radius-md);
		padding: 0.4rem 1rem;

		letter-spacing: 2.75px;
		text-transform: uppercase;
		font-size: var(--font-lg);
		font-variation-settings:
			'wght' 200,
			'wdth' 98;
	}

	a.depth-1 {
		border-radius: var(--radius-md);

		font-size: var(--font-sm);
		font-variation-settings:
			'wght' 500,
			'wdth' 100;
	}

	a.depth-2 {
		font-size: var(--font-xs);
		font-variation-settings:
			'wght' 350,
			'wdth' 100;

		&:hover {
			@include hover;
		}
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
