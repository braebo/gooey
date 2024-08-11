<script lang="ts">
	import { Gooey } from '../../../../../src/Gooey'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'

	const { data, children } = $props()

	let gooey: Gooey

	onMount(() => {
		localStorage.clear()
		gooey ??= new Gooey({
			title: 'routes',
			themeMode: 'system',
			position: 'top-left',
			margin: {
				x: 16,
				y: 48,
			},
			storage: false,
		})

		gooey.element.style.minWidth = '100px'

		const routes = Array.from(data.routes)
			.map((route) => route.match(/\/demos\/_test\/(.+)/)?.[1]!)
			.filter(Boolean)

		console.log(routes)

		if (routes.length) {
			for (const route of routes) {
				gooey.addButton(
					'',
					() => {
						goto(`/demos/_test/${route}`)
					},
					{ text: route },
				)
			}
		}

		// return gooey.dispose
	})
</script>

{@render children?.()}
