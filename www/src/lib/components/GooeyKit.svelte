<script lang="ts">
	import type { GooeyOptions, Folder, InputText } from '../../../../src'
	import type { Branch } from '$lib/utils/tree'
	
	import { useInspector } from '$lib/utils/useInspector'
	import { afterNavigate, goto } from '$app/navigation'
	import GooeyThemeSync from './GooeyThemeSync.svelte'
	import { themer } from '$lib/themer/themer.svelte'
	import { Gooey } from '../../../../src/Gooey'
	import { page } from '$app/state'
	import { onMount } from 'svelte'
	// import { Store } from 'runed'

	let {
		options = {},
		filter = true,
		...props
	} = $props<{
		links: Branch[]
		options?: GooeyOptions
		filter?: boolean
	}>()

	let gooey = $state<Gooey>()

	afterNavigate(() => {
		if (gooey) gooey.title = page.url.pathname
	})

	onMount(() => {
		gooey = new Gooey({
			id: 'kit-tool',
			position: 'top-right',
			margin: { x: 16 * 6, y: 16 * 0.75 },
			width: 350,
			theme: themer.activeTheme.title,
			title: page.url.pathname,
			storage: { theme: false },
			hidden: true,
			...options,
		})
		useInspector(gooey.element, import.meta.url, 33, 9)

		createRoutesFolder(gooey)
		createUrlFolder(gooey)
		createThemerFolder(gooey)

		return () => {
			gooey?.dispose()
		}
	})

	function createRoutesFolder(gooey: Gooey) {
		let routes_f = gooey.addFolder('routes', { closed: true })

		function walk(node: Branch, parent: Folder, depth = 0) {
			if (filter && node.name.startsWith('_')) return

			let folder = parent
			let title = node.name

			if (node.children?.length) {
				folder = parent.addFolder(node.name, { closed: true })
			}

			if (title === folder.title) {
				title = ''
			}

			folder.addButton(
				title,
				() => {
					goto(node.path)
				},
				{ text: node.path },
			)

			if (node.children?.length) {
				for (const child of node.children ?? []) {
					walk(child, folder, depth + 1)
				}
			}
		}

		for (const link of props.links) {
			walk(link, routes_f, 0)
		}

		routes_f.refresh()
	}

	function createUrlFolder(gooey: Gooey) {
		const url = page.url

		const url_f = gooey.addFolder('url', { closed: true })

		const pathname_i = url_f.add('pathname', url.pathname)
		let search_i: InputText | null = null
		let hash_i: InputText | null = null
		if (url.hash) {
			hash_i = url_f.add('hash', url.hash)
		}

		$effect(() => {
			pathname_i.set(url.pathname)
			if (search_i) {
				search_i.set(url.search)
			}
			if (hash_i) {
				hash_i.set(url.hash)
			}
		})

		let search_f: Folder | null = null
		function createSearchParamsFolder() {
			if (!gooey) return
			if (!url.searchParams.size) return

			search_f?.dispose()
			search_f = url_f.addFolder('search params', { closed: true })

			search_i = search_f.add('search', url.search)
			search_f.addMany(Object.fromEntries(url.searchParams.entries()))
		}

		createSearchParamsFolder()

		$effect(() => {
			if (!gooey) return
			createSearchParamsFolder()
		})
	}

	function createThemerFolder(gooey: Gooey) {
		const themer_f = gooey.addFolder('themer', { closed: true })
		const title_i = themer_f.add('theme', themer.activeTheme.title)
		const mode_i = themer_f.add('mode', themer.mode)
		$effect(() => {
			title_i.set(themer.activeTheme.title)
			mode_i.set(themer.mode)
		})
	}
</script>

<svelte:window
	on:keydown={e => {
		if (e.key === 'i') {
			gooey?.toggleHidden()
		}
	}}
/>

{#if gooey}
	<GooeyThemeSync {gooey} />
{/if}
