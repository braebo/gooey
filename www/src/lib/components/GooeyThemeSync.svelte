<script lang="ts">
	import { themer } from '$lib/themer/themer.svelte'
	import { Gooey } from '../../../../src/index'
	import { onMount } from 'svelte'

	const props: {
		gooey: Gooey
		autoInit?: boolean
	} = $props()
	const gooey = props.gooey

	let locked = false

	onMount(() => {
		/* gooey mode change -> update page theme (aka mode) */
		const unsub = gooey.themer.mode.subscribe((m) => {
			if (locked) return
			themer.preference = m
		})

		/* page theme (aka mode) change -> update gooey mode */
		$effect(() => {
			gooey.themer.mode.set(themer.preference)
		})

		/* gooey theme change -> apply theme */

		gooey.themer.theme.subscribe((t) => {
			const newTheme = themer.themes[t.title as keyof typeof themer.themes]
			if (newTheme) {
				themer.activeTheme = newTheme
			}
		})

		return () => {
			unsub()
			gooey?.dispose()
		}
	})
</script>
