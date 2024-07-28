<script lang="ts">
	import { onMount } from 'svelte'
	import { Gooey } from '../../../../../src/Gooey'

	onMount(() => {
		localStorage.clear()
		const gooey = new Gooey({ title: 'test', themeMode: 'system', position: 'center' })

		gooey.add('foo', 1)
	})
</script>

<div>
	<h1>Test Page</h1>
</div>

<style lang="scss">
</style>
