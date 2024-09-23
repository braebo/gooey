<script lang="ts">
	import GooeyThemeSync from '$lib/components/GooeyThemeSync.svelte'
	import { kitchen } from '../../../../../../src/demo/kitchen'
	import { Gooey } from '../../../../../../src/Gooey'
	import { onMount } from 'svelte'

	let gooey = $state<Gooey | undefined>(undefined)
	let sink = $state<Gooey | undefined>(undefined)

	onMount(() => {
		gooey = new Gooey({
			title: 'Disabler',
			themeMode: 'system',
			position: 'top-center',
			offset: { y: 400 },
		})
		sink = kitchen({
			title: 'Kitchen Sink',
			themeMode: 'system',
			position: 'top-center',
		})
		;['text', 'number', 'boolean', 'select', 'color', 'button'].forEach((inputName: string) => {
			const input = sink!.inputs.get(inputName)!
			if (Math.random() > 0.5) input.disable()
			gooey?.add(
				inputName,
				() => {
					input.disabled = !input.disabled
					console.log(`${inputName} disabled =`, input.disabled)
				},
				{
					text: () => (input.disabled ? 'enable' : 'disable'),
				},
			)
		})

		return () => {
			sink?.dispose()
			gooey?.dispose()
		}
	})
</script>

{#if gooey}
	<GooeyThemeSync {gooey} />
{/if}

{#if sink}
	<GooeyThemeSync gooey={sink} />
{/if}
