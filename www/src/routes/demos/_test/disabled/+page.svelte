<script lang="ts">
	import { kitchen } from '../../../../../../src/demo/kitchen'
	import { Gooey } from '../../../../../../src/Gooey'
	import { onMount } from 'svelte'

	onMount(() => {
		const sink = kitchen({
			title: 'Kitchen Sink',
			themeMode: 'system',
			position: 'top-center',
		})

		const g = new Gooey({
			title: 'Disabler',
			themeMode: 'system',
			position: 'top-center',
			offset: { y: 400 },
		})

		;['text', 'number', 'boolean', 'select', 'color', 'button'].forEach((inputName: string) => {
			const input = sink.inputs.get(inputName)!
			if (Math.random() > 0.5) input.disable()
			g.add(
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
			sink.dispose()
			g.dispose()
		}
	})
</script>
