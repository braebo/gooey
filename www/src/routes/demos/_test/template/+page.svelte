<script lang="ts">
	import { Gooey } from '../../../../../../src/Gooey'
	import { onMount } from 'svelte'

	let params = $state({
		foo: 1,
		bar: 'baz',
		qux: () => console.log('quux'),
	})

	onMount(() => {
		const gooey = new Gooey({
			title: 'Template',
			themeMode: 'system',
			position: 'center',
		})

		gooey.bindMany({})

		return gooey.dispose
	})
</script>
