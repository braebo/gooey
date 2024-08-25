<script lang="ts" generics="T extends Record<string, any> = Record<string, any>">
	import { Gooey, type GooeyOptions } from '../../../../src/Gooey'
	import GooeyThemeSync from './GooeyThemeSync.svelte'
	import { onMount } from 'svelte'

	let {
		params = {} as T,
		wrapperStyle = '',
		gooey = $bindable<Gooey>(),
		...props
	}: Partial<GooeyOptions> & {
		wrapperStyle?: string
		params?: T
		gooey?: Gooey
	} = $props()

	let el = $state<HTMLElement>()

	onMount(() => {
		const width = window.innerWidth < 900 ? 320 : 380

		gooey = new Gooey({
			position: 'center',
			storage: false,
			...props,
			container: el,
			width,
		})

		if (params) {
			gooey.bindMany(params)
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
