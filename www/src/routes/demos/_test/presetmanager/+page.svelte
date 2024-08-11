<script lang="ts">
	import { Gooey } from '../../../../../../src/Gooey'
	import Code from '$lib/components/Code.svelte'
	import { onMount } from 'svelte'

	let _ = $state()

	onMount(() => {
		localStorage.clear()
		const gooey = new Gooey({
			title: 'test',
			themeMode: 'system',
			position: 'top-center',
		})

		gooey.addNumber('number', 0)
		gooey.addText('string', 'foo')
		gooey.addSwitch('boolean', true)
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
