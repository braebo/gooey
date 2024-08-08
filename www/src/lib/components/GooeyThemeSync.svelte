<script lang="ts">
	import { Gooey } from '../../../../src/index'
	import { themer } from '$lib/themer.svelte'
	import { onMount } from 'svelte'

	const props: {
		gooey: Gooey
		autoInit?: boolean
	} = $props()
	const gooey = props.gooey
	// const autoInit = props.autoInit ?? true

	const subs = [] as (() => any)[]

	onMount(() => {
		// Update the page theme when the gui theme changes.
		subs.push(
			gooey.themer.mode.subscribe((m) => {
				themer.theme = m
			}),
		)

		// Update the gui when the page theme changes.
		$effect(() => {
			gooey.themer.mode.set(themer.theme)
			updateTheme()
		})

		// Update the page theme when the gui theme changes.
		subs.push(
			gooey.themer.theme.subscribe(() => {
				updateTheme()
			}),
		)

		function updateTheme() {
			for (const [k, v] of Object.entries(gooey.themer.modeColors)) {
				document.documentElement.style.setProperty(`--${k}`, v)
			}
		}

		return () => {
			for (const unsubscribe of subs) {
				unsubscribe()
			}
			gooey?.dispose()
		}
	})
</script>
