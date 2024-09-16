<script lang="ts">
	import GooeyThemeSync from '$lib/components/GooeyThemeSync.svelte'
import { Nav } from '$lib/components/Nav'
	import '$lib/data/docs/docs.scss'

	import { Gooey } from '../../../../../gooey/src/Gooey'
	import { onMount } from 'svelte'

	const { children } = $props()

	const gradients = [
		'linear-gradient(in hsl 46deg, var(--secondary) 0%, rgb(0 228 255) 10%, color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%))',
		'linear-gradient(in hsl 198deg, var(--secondary) 0%, rgb(0 228 255) 10%, color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%))',
		'linear-gradient(in hsl 346deg, var(--secondary) 0%, rgb(0 228 255) 10%, color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%))',
		'linear-gradient(in hsl 123deg, var(--secondary) 0%, rgb(0 228 255) 10%, color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%))',
		'linear-gradient(in hsl 46deg, var(--secondary) 0%, rgb(0, 255, 234) 20%, color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%))',
		'linear-gradient(in hsl 198deg, var(--secondary) 0%, rgb(0, 255, 234) 20%, color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%))',
		'linear-gradient(in lab 24deg, color-mix(in hsl, var(--bw), var(--bg-a)) 10%, color-mix(in hsl, var(--bg-b) 20%, var(--bg-e) 45%))',
		'linear-gradient(in hsl 346deg, rgb(0 228 255) 10%, color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%))',
		'linear-gradient(in hsl 346deg, rgb(0 228 255) 10%, color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%), #0059ff63)',
	]

	let gooey = $state<Gooey>()
	let gradient = $state(gradients[1])
	let docsPageEl = $state<HTMLElement>()
	const chunk = (size: number, arr: any[]) =>
		Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size))

	// const params = $state({
	// 	gradient: chunk(
	// 		5,
	// 		gradients.map((_, i) => {
	// 			return {
	// 				text: i,
	// 				onClick: v => {
	// 					console.log({ v })
	// 					// params.gradient = gradients[i]
	// 					// params.text = gradients[i]
	// 				},
	// 				id: `nb${i}`,
	// 			}
	// 		}),
	// 	),
	// 	text: gradients[0],
	// })

	onMount(() => {
		const description = document.getElementById('hero-description')
		if (!description) return

		description.style.opacity = '0'
		const descriptionHeight = description?.offsetTop

		gooey = new Gooey({
			title: 'gui library for the web',
			container: docsPageEl,
			position: 'top-center',
			margin: { y: descriptionHeight },
			storage: {
				key: 'docs-gradient',
				size: true,
				position: true,
			},
		})

		// gooey.add('gradient', active, {
		// 	min: 0,
		// 	max: gradients.length - 1,
		// 	step: 1,
		// 	onChange: i => {
		// 		active = i
		// 		text.value = gradient
		// 	},
		// })

		// const text = gooey.addText('text', gradient)

		// gooey.bindMany(params)

		const gradientFolder = gooey.addFolder('gradient')

		gradientFolder.addButtonGrid(
			'',
			// chunk(
			// 5,
			[
				gradients.map((_, i) => {
					return {
						text: i,
						onClick: () => {
							gradient = gradients[i]
							// gradientText.set(gradient)
						},
						id: `nb${i}`,
					}
				}),
			],
			// ),
		)

		// const gradientText = gradientFolder.addText('', gradient, {
		// 	onChange: v => {
		// 		const dummy = document.createElement('div')
		// 		dummy.style.background = v
		// 		dummy.style.width = '100px'
		// 		dummy.style.height = '100px'
		// 		dummy.style.display = 'none'

		// 		document.body.append(dummy)

		// 		// const valid = CSS.supports('background-image', v.replace('linear-gradient', ''))
		// 		const valid = globalThis.window?.getComputedStyle(dummy).background !== ''
		// 		console.log({
		// 			v,
		// 			valid,
		// 			background: dummy.style.background,
		// 			computed: globalThis.window?.getComputedStyle(dummy).background,
		// 		})
		// 		dummy.remove()

		// 		console.log('Valid CSS gradient:', valid)
		// 		if (valid) {
		// 			console.log({ v })
		// 			gradient = v
		// 		}
		// 	},
		// })
	})
</script>

<div class="sidebar-background"></div>

<div class="sidebar">
	<Nav />
</div>

<div class="hero-gradient-container">
	<div class="hero-gradient" style:background-image={gradient}></div>
</div>

<div id="docs-gradient-gooey"></div>
{#if gooey}
	<GooeyThemeSync {gooey} />
{/if}

<div class="docs-page" bind:this={docsPageEl}>
	{@render children?.()}
</div>

<style>
	.sidebar {
		position: fixed;
		left: 0;
		width: 13rem;
		z-index: 3;
	}

	.sidebar-background {
		transition: 1s cubic-bezier(0, 0.82, 0, 1.08);
	}

	@media (width < 1000px) {
		.sidebar-background {
			width: 0%;
		}
	}

	.hero-gradient-container {
		position: absolute;
		inset: 0;
		z-index: 0;

		height: 57rem;
		width: 100dvw;

		/* background-color: var(--bg-a); */

		mask-image: linear-gradient(to bottom, black 0%, transparent 99%);
		mix-blend-mode: color-dodge;

		height: 45rem;
		mask-image: linear-gradient(to bottom, hsla(0deg, 0%, 0%, 0.2) 0%, transparent 100%);
		mix-blend-mode: hard-light;
	}

	.hero-gradient {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		height: 100%;
		width: 100%;

		/* background-image: linear-gradient(
			in hsl 46deg,
			var(--secondary) 0%,
			rgb(0, 255, 234) 20%,
			color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%)
		); */

		/* background-image: linear-gradient(
			in hsl 198deg,
			var(--secondary) 0%,
			rgb(0, 255, 234) 20%,
			color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%)
		); */

		/* background-image: linear-gradient(
			in hsl 198deg,
			var(--secondary) 0%,
			rgb(0 228 255) 10%,
			color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%)
		); */

		background-image: linear-gradient(
			in hsl 123deg,
			var(--secondary) 0%,
			rgb(0 228 255) 10%,
			color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%)
		);
	}

	/* :global(:root[theme='light']) .hero-gradient {
		background-image: linear-gradient(
			in lab 24deg,
			color-mix(in hsl, var(--bw), var(--bg-a)) 10%,
			color-mix(in hsl, var(--bg-b) 20%, var(--bg-e) 45%)
		);
	} */
	:global(:root[theme='light']) .hero-gradient-container {
		position: absolute;
		inset: 0;
		z-index: 0;

		height: 57rem;
		width: 100dvw;

		/* background-color: var(--bg-a); */

		mask-image: linear-gradient(to bottom, hsla(0deg, 0%, 0%, 0.6) 0%, transparent 100%);
		mix-blend-mode: hard-light;
	}

	:global(:root[theme='light']) .hero-gradient {
		/* background-image: linear-gradient(
			in hsl 346deg,
			rgb(0 228 255) 10%,
			color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%)
		); */

		background-image: linear-gradient(
			in hsl 346deg,
			rgb(0 228 255) 10%,
			color-mix(in oklab, var(--bg-b) 20%, var(--bg-c) 75%),
			#0059ff63
		);
	}
</style>
