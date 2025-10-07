<script lang="ts">
	import type { InputEvents } from '../../../../../src/inputs/Input'
	import type { FolderEvents } from '../../../../../src/Folder'
	import type { Branch } from '$lib/utils/tree'

	import { INPUT_TYPE_MAP } from '../../../../../src/inputs/Input'
	import { isActive } from '$lib/utils/isActive'
	import { device } from '$lib/device.svelte'
	import { Tree } from '$lib/utils/tree'
	import { DEV } from 'esm-env'

	import { fly } from 'svelte/transition'
	import { page } from '$app/stores'

	const { absolute = true } = $props()

	const folderEvents: `/docs/events/folder#${keyof FolderEvents}`[] = [
		'/docs/events/folder#change',
		'/docs/events/folder#toggle',
		'/docs/events/folder#refresh',
		'/docs/events/folder#mount',
		'/docs/events/folder#open',
		'/docs/events/folder#close',
	]

	const inputEvents: `/docs/events/inputs#${keyof InputEvents}`[] = [
		'/docs/events/inputs#change',
		'/docs/events/inputs#refresh',
	]

	const inputs: `/docs/inputs#${Lowercase<keyof typeof INPUT_TYPE_MAP extends `Input${infer T}` ? T : never>}`[] = [
		'/docs/inputs#number',
		'/docs/inputs#text',
		'/docs/inputs#textarea',
		'/docs/inputs#color',
		'/docs/inputs#select',
		'/docs/inputs#button',
		'/docs/inputs#buttongrid',
		'/docs/inputs#switch',
	]

	const events = [...inputEvents, ...folderEvents]

	const pageRoutes = $page.data.routes || []

	// prettier-ignore
	const routes = [
		...pageRoutes,

		'/docs/getting-started#install',
		'/docs/getting-started#import',
		'/docs/getting-started#basics',

		'/docs/create/binding',
		'/docs/create/adding',

		...inputs,
		...events,

		'/docs/events/folder',
		'/docs/events/folder#change',
		'/docs/events/folder#toggle',
		'/docs/events/folder#toggle',
		'/docs/events/inputs',

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

	let navEl = $state<HTMLElement>()
	let activeIndicatorEl = $state<HTMLDivElement>()
	let li_els = $state<HTMLElement[]>([])
	let timeout: ReturnType<typeof setTimeout>
	let opacity = $state(0)
	$effect(() => {
		activeHeading
		clearTimeout(timeout)
		timeout = setTimeout(() => {
			if (!activeIndicatorEl || !navEl) return

			let activeEl: HTMLElement | undefined
			for (let i = 0; i < li_els.length; i++) {
				const el = li_els[i]
				if (el?.classList.contains('active')) {
					activeEl = el
					break
				}
			}

			if (!activeEl) return

			opacity ||= 1

			const activeRect = activeEl.getBoundingClientRect()
			const navTop = navEl.getBoundingClientRect().top
			const indicatorRect = activeIndicatorEl.getBoundingClientRect()
			activeIndicatorEl.style.setProperty(
				'top',
				activeRect.top + activeRect.height / 2 - navTop - indicatorRect.height / 2 + 'px',
			)
		}, 10)
	})

	const list = (el: HTMLElement) => {
		li_els.push(el)
		return {
			destroy: () => {
				li_els = li_els.filter(e => e !== el)
			},
		}
	}

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
	<nav class:absolute class:mobile={device.mobile} bind:this={navEl}>
		<div bind:this={activeIndicatorEl} class="active-indicator" style:opacity></div>
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
			<div class="box box-{depth}"></div>
			{#each sort( link.children?.filter(c => !DEV || !c.name.startsWith('_')), false, ) ?? [] as child, j (child.name)}
				{@const id = `li-${child.name}-${Math.round(Math.random() * 100)}`}
				<div
					{id}
					class="li"
					class:active={child.name === activeHeading}
					style="
						padding-left: {depth * 1.5}rem;
						view-transition-name: {id};
						animation-delay: {0.1 + i * 0.1 + j * 0.05 + (depth - 1) * 0.2}s;
					"
					use:list
				>
					<!-- {#if depth > 0 && active}
						<div class="active-indicator" bind:this={activeIndicatorEl}></div>
					{/if} -->
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

<style lang="css">
	nav {
		display: flex;
		align-items: start;

		width: 100%;
		transform: translateX(0);
		height: 100vh;
		min-height: auto;

		pointer-events: none;

		transition: transform 0.2s;
		overflow-y: auto;

		z-index: 1;

		@media (width < 1000px) {
			transform: translateX(-100%);
			overflow: hidden;
		}
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
		top: 1.75rem;
		/* left: 0rem; */
		left: 0.75rem;
	}

	ul {
		position: relative;
		/* // padding-left: 0.5rem; */
		padding-left: 0rem;
		padding-right: 0.25rem;
		z-index: 1;
	}

	.box {
		position: absolute;
		top: 0;
		left: 0;
		background: var(--bg-a);
		height: 100%;
		height: 1rem;
	}

	.li,
	.box {
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
		padding: 0.3rem 0.75rem;

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

	a.depth-2,
	a.depth-3 {
		font-size: var(--font-xs);
		font-variation-settings:
			'wght' 350,
			'wdth' 100;
		border-radius: 0;

		&:hover,
		&.active {
			font-variation-settings:
				'wght' 500,
				'wdth' 98;
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
	}

	a.active {
		font-variation-settings:
			'wght' 500,
			'wdth' 96.66;
	}

	:global(.active-indicator) {
		position: absolute;
		top: 0;
		left: 0;
		width: 0.25rem;
		height: 1rem;
		background: var(--theme-a);
		border-radius: var(--radius);
		opacity: 0;
		transition: all 0.2s cubic-bezier(0, 0.8, 0.05, 1);
	}
</style>
