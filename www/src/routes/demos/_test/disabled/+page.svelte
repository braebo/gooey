<script lang="ts">
	import GooeyThemeSync from '$lib/components/GooeyThemeSync.svelte'
	import { kitchen } from '../../../../../../src/demo/kitchen'
	import { Gooey } from '../../../../../../src/Gooey'
	import { onMount } from 'svelte'

	let gooey = $state<Gooey | undefined>(undefined)
	let sinkGooey = $state<Gooey | undefined>(undefined)

	onMount(() => {
		const sink = kitchen({
			title: 'Kitchen Sink',
			themeMode: 'system',
			position: 'top-center',
		})
		sinkGooey = sink.gooey

		sink.inputs.text.description = 'static description'
		let count = 0
		sink.inputs.number.description = () => 'dynamic description ' + count++

		gooey = new Gooey({
			title: 'Disabler',
			themeMode: 'system',
			position: 'top-center',
			offset: { y: 400 },
		})
		;['text', 'number', 'boolean', 'select', 'color', 'button'].forEach((inputName: string, i) => {
			const input = sinkGooey!.inputs.get(inputName)!

			if (i > 1 && Math.random() > 0.5) input.disable()

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
			sinkGooey?.dispose()
			gooey?.dispose()
		}
	})
</script>

{#if gooey}
	<GooeyThemeSync {gooey} />
{/if}

{#if sinkGooey}
	<GooeyThemeSync gooey={sinkGooey} />
{/if}
