<!-- <script lang="ts">
	import { Gooey, type InputNumber } from '../../../../../src/index'
	import { seededRandom } from '$lib/utils/seededRandom'
	import { onDestroy, onMount } from 'svelte'
	import { themer } from '$lib/themer.svelte'
	import presets from './presets'

	const viewBox = {
		width: 500,
		height: 190,
	}

	let svgEl = $state<SVGSVGElement>()

	let p = $state({
		gooeyness: 10,
		size: 1,
		duration: 1,
		width: 200,
		height: 200,
		complexity: 10,
		seed: Math.random(),
		create: () => createBlob(),
	} satisfies Record<string, any>)

	// const mapRange = (v: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
	// 	return ((v - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
	// }

	const unsubs = [] as (() => any)[]
	onMount(() => {
		// Create the gui.
		const gui = new Gooey({
			position: 'top-center',
			margin: { y: 100 },
			presets,
		})

		// Bind to the params and configure their options.
		gui.bindMany(p, {
			gooeyness: {
				min: 0,
				max: 100,
				step: 1,
				label: 'Gooeyness',
				tooltip: 'The amount of gooeyness.',
			},
			size: {
				min: 0,
				max: 100,
				step: 1,
				label: 'Size',
				tooltip: 'The size of the blob.',
			},
		})

		// Update the page theme when the gui theme changes.
		unsubs.push(
			gui.themer.mode.subscribe((m) => {
				themer.theme = m
			}),
		)

		// Update the gui when the page theme changes.
		$effect(() => {
			gui.themer.mode.set(themer.theme)
			updateTheme()
		})

		// Update the page theme when the gui theme changes.
		unsubs.push(
			gui.themer.theme.subscribe(() => {
				updateTheme()
			}),
		)

		function updateTheme() {
			for (const [k, v] of Object.entries(gui.themer.modeColors)) {
				document.documentElement.style.setProperty(`--${k}`, v)
			}
		}
	})

	onDestroy(() => {
		for (const unsubscribe of unsubs) {
			unsubscribe()
		}
		globalThis.window?.location.reload() //! todo - DELETE ME
	})

	function randomPositions(n = 3) {
		const r = (n = 50) => Math.random() * n - n / 2

		function randomValues(n: number) {
			const positions = Array.from({ length: n }, () => `0,${r().toFixed(2)};`).join('')
			return `0,0;${positions}0,0;`
		}

		function randomKeySplines(n: number) {
			return Array.from({ length: n }, () =>
				Math.random() > 0.5 ? '0.42,0,0.58,1' : `${0.5 + r(0.15)},0,${0.5 + r(0.15)},1`,
			).join(';')
		}

		return {
			values: randomValues(n),
			keySplines: randomKeySplines(n + 1),
			attributeName: 'transform',
			type: 'translate',
			begin: '0s',
			dur: `${p.duration}s`,
			calcMode: 'spline',
			repeatCount: 'indefinite',
			fill: 'freeze',
		}
	}

	type Point = [number, number]

	let blobs = $state<string[]>([])
	function createBlob() {
		const random = seededRandom(p.seed)
		const points: [number, number][] = []
		const angleStep = (Math.PI * 2) / p.complexity

		for (let i = 0; i < p.complexity; i++) {
			const angle = i * angleStep
			const radius = p.size * 0.5
			points.push([
				Math.cos(angle) * radius * (p.width / 2) + p.width / 2,
				Math.sin(angle) * radius * (p.height / 2),
			])
		}

		blobs.push(
			`M${points[0].join(' ')} ${points
				.slice(1)
				.map((p) => `L${p.join(' ')}`)
				.join(' ')}Z`,
		)
	}
</script> -->

<!-- <div class="logo">
	<svg
		id="blob"
		xmlns="http://www.w3.org/2000/svg"
		width="100%"
		height="100%"
		fill="currentColor"
		viewBox="0 0 {viewBox.width} {viewBox.height}"
		overflow="visible"
		style="overflow: visible"
		bind:this={svgEl}
	>
		{#each blobs as blob}
			<path d={blob} fill="currentColor" />
		{/each}
	</svg>
</div> -->

<!-- <style lang="scss">
	svg {
		color: var(--fg-d);
	}
</style> -->
