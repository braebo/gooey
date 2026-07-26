<script lang="ts">
	import { Gooey } from '../../../../../../src/Gooey'
	import Code from '$lib/components/Code.svelte'
	import { onMount } from 'svelte'

	let _ = $state()

	onMount(() => {
		// localStorage.clear()
		const gooey = new Gooey({
			title: 'Input Button Grid',
			themeMode: 'system',
			position: 'top-center',
		})

		const grid = gooey.addButtonGrid(
			'addButtonGrid',
			[
				[
					{
						text: 'foo 0',
						onClick: v => {
							const [text, count] = v.button.text.split(' ')
							v.button.text = `${text} ${Number(count) + 1}`
							console.log({ callback: v })
							_ = v
						},
					},
					{
						text: 'Button Grid',
						onClick: () => {
							console.log({ grid })
							// _ = tldr(grid.buttons, { maxSiblings: 20 })
						},
						tooltip: {
							text: 'Logs and displays button grid information.',
						},
					},
				],
			],
			{
				applyActiveClass: true,
			},
		)

		return gooey.dispose
	})
</script>

<!-- <pre>
	{JSON.stringify(_, null, 2)}
</pre> -->

<div class="code">
	{#key _}
		<Code text={`${JSON.stringify(_, null, 2)}`} lang="json" />
	{/key}
</div>

<style lang="scss">
	.code {
		display: flex;
		margin: auto;
		// margin-bottom: 1rem;
		width: 100%;
		max-width: 800px;
	}
</style>
