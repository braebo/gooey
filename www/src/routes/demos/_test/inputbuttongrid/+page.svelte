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

		gooey.addButtonGrid(
			'addButtonGrid',
			[
				[
					{
						text: 'foo',
						onClick: (v) => {
							_ = v
							console.log('foo', v)
						},
					},
					{
						text: 'bar',
						onClick: (v) => {
							_ = v
							console.log('bar', v)
						},
					},
					{
						text: 'baz',
						onClick: (v) => {
							_ = v
							console.log('baz', v)
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
