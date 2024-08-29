<script lang="ts" generics="T extends Record<string, any> = Record<string, any>">
	import { Gooey, type GooeyOptions } from '../../../../src/Gooey'
	import GooeyThemeSync from './GooeyThemeSync.svelte'
	import { onMount } from 'svelte'

	let {
		params = {} as T,
		wrapperStyle = '',
		gooey = $bindable<Gooey>(),
		autoCenter = true,
		...props
	}: Partial<GooeyOptions> & {
		wrapperStyle?: string
		params?: T
		gooey?: Gooey
		autoCenter?: boolean
	} = $props()

	let el = $state<HTMLElement>()

	onMount(() => {
		const width = window.innerWidth < 900 ? 320 : 380

		gooey = new Gooey({
			// position: 'center',
			storage: false,
			width,
			...props,
			container: el,
		})

		if (params) {
			gooey.bindMany(params)
		}

		if (autoCenter && props.position === 'center') {
			setTimeout(() => {
				const boundsRect = el!.getBoundingClientRect()
				const gooeyRect = gooey.folder.element!.getBoundingClientRect()

				const centerX = boundsRect.width / 2 - gooeyRect.width / 2
				const centerY = boundsRect.height / 2 - gooeyRect.height / 2

				gooey.window!.draggableInstance!.position = { x: centerX, y: centerY }
			}, 100)
		}

		return gooey.dispose
	})
</script>

{#if gooey}
	<GooeyThemeSync {gooey} />
{/if}

<div class="gooish" style={wrapperStyle} bind:this={el}></div>

<style>
	.gooish {
		/* position: relative; */
		width: 100%;
		height: 100%;
	}

	:global(:root[theme='light']) .gooish {
		/* prettier-ignore */
		box-shadow:
			1px 2px 5px hsla(0, 0%, 0%, 0.063) inset,
			1px 1px 16px hsla(0, 0%, 0%, 0.02) inset,
			1px 4px 8px hsla(0, 0%, 0%, 0.063) inset
		;
	}
</style>
