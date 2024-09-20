<script lang="ts">
	import { Gooey } from '../../../../../gooey/src/Gooey'
	import { themer } from '$lib/themer/themer.svelte'
	import { fade } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'

	const gradients = [
		{
			deg: 46,
			str: (deg: number) =>
				`linear-gradient(in hsl ${deg}deg, var(--secondary) 0%, rgb(0 228 255) 10%, color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%))`,
		},
		{
			deg: 198,
			str: (deg: number) =>
				`linear-gradient(in hsl ${deg}deg, var(--secondary) 0%, rgb(0 228 255) 10%, color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%))`,
		},
		{
			deg: 346,
			str: (deg: number) =>
				`linear-gradient(in hsl ${deg}deg, var(--secondary) 0%, rgb(0 228 255) 10%, color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%))`,
		},
		{
			deg: 123,
			str: (deg: number) =>
				`linear-gradient(in hsl ${deg}deg, var(--secondary) 0%, rgb(0 228 255) 10%, color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%))`,
		},
		{
			deg: 46,
			str: (deg: number) =>
				`linear-gradient(in hsl ${deg}deg, var(--secondary) 0%, rgb(0 255 234) 20%, color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%))`,
		},
		{
			deg: 198,
			str: (deg: number) =>
				`linear-gradient(in hsl ${deg}deg, var(--secondary) 0%, rgb(0 255 234) 20%, color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%))`,
		},
		{
			deg: 346,
			str: (deg: number) =>
				`linear-gradient(in hsl ${deg}deg, rgb(0 228 255) 10%, color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%))`,
		},
		{
			deg: 346,
			str: (deg: number) =>
				`linear-gradient(in hsl ${deg}deg, rgb(0 228 255) 10%, color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%), #0059ff63)`,
		},
	]

	let gooey = $state<Gooey>()
	let index = $state(1)
	let gradient = $derived(gradients[index])
	// svelte-ignore state_referenced_locally
	let deg = $state(gradient.deg)
	let str = $derived(gradient.str(deg))

	$effect(() => {
		$page.url.pathname
		themer.mode

		randomize()
	})

	function randomize() {
		const i =
			themer.mode === 'light'
				? [2, 6, 7][Math.floor(Math.random() * 3)]
				: Math.floor(Math.random() * gradients.length)

		index = i
		deg = gradients[index].deg
	}

	function chunk(size: number, arr: any[]) {
		return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size))
	}

	onMount(() => {
		if (!$page.url.searchParams.has('gradient-gooey')) return

		gooey = new Gooey({
			title: 'page',
			position: 'top-right',
			margin: { x: 16, y: 16 * 3.5 },
			storage: {
				key: 'docs-gradient',
				size: true,
				position: true,
			},
		})

		const gradientFolder = gooey.addFolder('gradient')

		const angleInput = gradientFolder.add('angle', 46, {
			max: 360,
			onChange: v => (deg = v),
		})

		gradientFolder.addButtonGrid(
			'variations',
			chunk(
				4,
				gradients.map((_, i) => {
					return {
						id: `#${i}`,
						text: i,
						onClick: () => {
							index = i
							angleInput.set(deg)
						},
					}
				}),
			),
		)
	})
</script>

<div class="hero-gradient-container">
	{#key index}
		<div
			class="hero-gradient"
			in:fade={{ duration: 5000, easing: cubicOut }}
			out:fade={{ duration: 1250, easing: cubicOut }}
			style:background-image={str}
		></div>
	{/key}
</div>

<style lang="scss">
	.hero-gradient-container {
		z-index: 0;

		display: grid;

		position: absolute;
		inset: 0;

		height: 45rem;
		width: 100dvw;

		filter: blur(20px);
		backdrop-filter: blur(20px);

		mask-image: linear-gradient(to bottom, hsla(0deg, 0%, 0%, 0.2) 0%, transparent 100%);
		mix-blend-mode: hard-light;

		pointer-events: none;
	}

	.hero-gradient {
		grid-area: 1/1;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		height: 100%;
		width: 100%;

		background-image: linear-gradient(
			in hsl 123deg,
			var(--secondary) 0%,
			rgb(0 228 255) 10%,
			color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%)
		);
	}

	:global(:root[theme='light']) .hero-gradient-container {
		position: absolute;
		inset: 0;
		z-index: 0;

		height: 57rem;
		width: 100dvw;

		mask-image: linear-gradient(to bottom, hsla(0deg, 0%, 0%, 0.6) 0%, transparent 100%);
		mix-blend-mode: hard-light;
	}

	:global(:root[theme='light']) .hero-gradient {
		background-image: linear-gradient(
			in hsl 346deg,
			rgb(0 228 255) 10%,
			color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%),
			#0059ff63
		);
	}
</style>
