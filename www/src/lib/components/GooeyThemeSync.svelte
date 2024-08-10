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

	let locked = false
	let lockTimer: ReturnType<typeof setTimeout>
	function lock() {
		locked = true
		clearTimeout(lockTimer)
		lockTimer = setTimeout(() => {
			locked = false
		})
	}

	onMount(() => {
		// gooey mode change -> update page theme (aka mode)
		subs.push(
			gooey.themer.mode.subscribe((m) => {
				if (locked) return
				themer.theme = m
			}),
		)

		// page theme (aka mode) change -> update gooey mode
		$effect(() => {
			lock()
			gooey.themer.mode.set(themer.preference)
			applyTheme()
		})

		// gooey theme change -> apply theme
		subs.push(
			gooey.themer.theme.subscribe(() => {
				applyTheme()
			}),
		)

		function applyTheme() {
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
