<!-- svelte-ignore state_referenced_locally -->
<script lang="ts" generics="T extends Record<string, any> = Record<string, any>">
	import GooeyThemeSync from './GooeyThemeSync.svelte'
	import { Gooey, type GooeyOptions } from 'gooey'
	import { onMount } from 'svelte'

	let {
		params = {} as T,
		wrapperStyle = '',
		gooey = $bindable<Gooey>(),
		autoCenter = true,
		refreshPosition = false,
		...props
	}: Partial<GooeyOptions> & {
		wrapperStyle?: string
		params?: T
		gooey?: Gooey
		autoCenter?: boolean
		refreshPosition?: boolean
	} = $props()

	let el = $state<HTMLElement>()

	onMount(() => {
		requestAnimationFrame(() => {
			let width = window.innerWidth < 900 ? 320 : 380
			const elWidth = el?.offsetWidth

			if (elWidth) {
				width = Math.min(elWidth * 0.9, width)
			}

			gooey = new Gooey({
				storage: false,
				width,
				...props,
				container: el,
			})

			if (params) {
				gooey.bindMany(params)
			}
		})

		return gooey?.dispose
	})
</script>

{#if gooey}
	<GooeyThemeSync {gooey} />
{/if}

<div class="gooish" style={wrapperStyle} bind:this={el}></div>

<style>
	.gooish {
		width: 100%;
		height: 100%;
	}
</style>
