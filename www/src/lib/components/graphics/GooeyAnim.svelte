<script lang="ts">
	import type { InputNumber } from '../../../../../src/index'

	import GooeyThemeSync from '../GooeyThemeSync.svelte'
	import { Gooey } from '../../../../../src/index'
	import { device } from '$lib/device.svelte'
	import { onMount } from 'svelte'
	import presets from './presets'

	const viewBox = {
		width: 500,
		height: 190,
	}

	let gooey = $state<Gooey>()
	let ready = $state(false)
	let sliderEl = $state<SVGRectElement>()
	let thumbEl = $state<SVGRectElement>()

	let hueInput: InputNumber
	let hue = $state(210)

	let p = $state({
		orbs: {
			hue: '#57abffff' as const,
			size: 1.22,
		},
		goo: {
			speed: 0.66,
			animate: true,
			texture: 'fractalNoise',
			gooeyness: 50,
			viscosity: 0.0123,
			density: 1,
		},
	})

	const shift1 = -15
	const shift2 = -40
	const shift3 = -8
	const shift4 = 6

	const mapRange = (v: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
		return ((v - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
	}

	let duration = $derived(p.goo.speed ? mapRange(p.goo.speed, 0, 1, 100, 5) : 0)

	let progress = $derived.by(() => {
		if (sliderEl === undefined || thumbEl === undefined) return 1
		const x = +sliderEl.getAttribute('x')!
		const width = +sliderEl.getAttribute('width')!
		const thumbWidth = +thumbEl.getAttribute('width')!
		return mapRange(hue, 0, 1, x, width + x - thumbWidth)
	})

	onMount(() => {
		// Create the gui.
		gooey = new Gooey({
			position: 'top-center',
			margin: { y: device.mobile ? 100 : 200 },
			width: device.mobile ? 333 : 400,
			presets,
			storage: false,
		})

		// Bind to the params and configure their options.
		const { inputs } = gooey.bindMany(p, {
			goo: {
				folderOptions: { closed: true },
				texture: { options: ['turbulence', 'fractalNoise'], value: 'fractalNoise' },
				gooeyness: { min: 0.1, max: 100, step: 0.1 },
				viscosity: { min: 0.001, max: 0.5, step: 0.0001 },
				density: { min: 1, max: 20, step: 1 },
			},
			size: { min: 0.5, max: 3, step: 0.01 },
		})

		// Store a ref to the slider input to sync it with the svg slider.
		const hueInput = inputs.orbs.hue
		hueInput.on('change', v => {
			hue = v.hue
		})

		ready = true

		return () => {
			gooey?.dispose()
			disposed = true
		}
	})

	let grabbing = false
	let mouseOffset = 0

	function onpointerdown(e: PointerEvent) {
		grabbing = true
		mouseOffset = e.clientX - thumbEl!.getBoundingClientRect().left
		hueInput?.elements.controllers.range.classList.add('active')
	}

	function onblur() {
		grabbing = false
		hueInput?.elements.controllers.range.classList.remove('active')
	}

	function onpointermove(e: PointerEvent) {
		if (!grabbing) return

		const { clientX } = e
		const { left: sliderLeft, width: sliderWidth } = sliderEl!.getBoundingClientRect()
		const thumbWidth = thumbEl!.getBoundingClientRect().width

		const minX = sliderLeft
		const maxX = sliderLeft + sliderWidth - thumbWidth
		const newX = Math.min(Math.max(clientX - mouseOffset, minX), maxX)

		hue = mapRange(newX, minX, maxX, 0, 360)
		hueInput.refresh()
	}

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
			dur: `${duration}s`,
			calcMode: 'spline',
			repeatCount: 'indefinite',
			fill: 'freeze',
		}
	}

	let time = $state(1)
	let disposed = false
	const fps = 60
	const interval = 1000 / fps

	requestAnimationFrame(tick)
	function tick() {
		if (disposed) return
		const now = performance.now()
		const elapsed = now - time
		if (elapsed > interval) {
			time = now
		}
		requestAnimationFrame(tick)
	}
</script>

<svelte:window {onblur} onpointerup={onblur} {onpointermove} />

{#if gooey}
	<GooeyThemeSync {gooey} />
{/if}

<div class="logo">
	<!-- prettier-ignore -->
	<svg
		id="gooey_anim"
		xmlns="http://www.w3.org/2000/svg"
		width="100%"
		height="100%"
		fill="currentColor"
		viewBox="0 0 {viewBox.width} {viewBox.height}"
		overflow="visible"
		style="overflow: visible"
	>
		<ellipse id="orb2" cx="247" cy="97" rx={14 * p.orbs.size} ry={14 * p.orbs.size} fill="url(#gooey_anim_gradient_2)">
			<animateTransform {...randomPositions()} />
		</ellipse>

		<g id="slider" filter="url(#gooey_anim_goo_filter)">
			<path
				id="text"
				fill="currentColor"
				d="M55 144.2a48 48 0 0 1-21.5-5c-2.7-1.6-5-3.2-6.6-5-1.6-1.7-2.4-3.3-2.4-4.8 0-1.2.2-2.2.5-3l1.6-2.2c1.1-1.2 2-2 2.8-2.5a5 5 0 0 1 2.8-.7c1.1 0 2.3.5 3.4 1.4a48 48 0 0 0 4.2 3.3 26.5 26.5 0 0 0 15.7 5 30 30 0 0 0 10.3-1.8 22 22 0 0 0 12.8-13.8 33 33 0 0 0 1.8-11.2l-.3-72.4c0-2.2.7-3.8 1.9-4.7 1.3-1 3.2-1.4 6-1.4 2.1 0 3.7.3 4.6 1 1 .6 1.7 1.5 2 2.6.3 1 .5 2.4.5 4v72.2c0 6.1-1 11.6-3 16.3a34.3 34.3 0 0 1-21 20 47.3 47.3 0 0 1-16.1 2.7Zm-.5-36a40 40 0 0 1-15.5-3 39.8 39.8 0 0 1-20.6-21.8A46 46 0 0 1 15.6 67a40.8 40.8 0 0 1 11-29.4 38.1 38.1 0 0 1 41.6-8.7c4.2 2 7.7 4.8 10.7 8.5a36 36 0 0 1 6.7 12.9c1.6 5 2.3 10.6 2.3 16.7a54 54 0 0 1-4 21.8c-2.7 6.1-6.5 11-11.5 14.3-5 3.3-11 5-18 5Zm.8-14.4a23.3 23.3 0 0 0 21.5-13A29 29 0 0 0 80 66.7c0-5.3-1.1-9.9-3.3-13.8A24.4 24.4 0 0 0 55 40.2a22.8 22.8 0 0 0-21.4 12.7c-2 4-3 8.6-3 14 0 5.3 1 10 3.1 14s5 7.1 8.7 9.5c3.8 2.3 8 3.4 13 3.4Zm99.6 17.3c-5.7 0-11.1-1.1-16.4-3.3A43.8 43.8 0 0 1 115.2 85c-2.3-5.3-3.5-11-3.5-17.1a41.7 41.7 0 0 1 12.6-30.5 43.4 43.4 0 0 1 30.3-12.7c8 0 15.2 1.9 21.6 5.7a41.8 41.8 0 0 1 21.2 37.3A43.7 43.7 0 0 1 184.5 99a42 42 0 0 1-29.6 12.2Zm-.3-15.2c4.8 0 9.4-1.2 13.6-3.6A28 28 0 0 0 182 67.5c0-5.4-1.2-10.2-3.7-14.4a24.6 24.6 0 0 0-9.7-9.8 29 29 0 0 0-14.3-3.5 27.1 27.1 0 0 0-27.5 28 27.8 27.8 0 0 0 13.9 24.7c4.3 2.3 8.9 3.4 13.8 3.4Zm97.8 15.2c-5.7 0-11.1-1.1-16.4-3.3A43.8 43.8 0 0 1 212.7 85c-2.3-5.3-3.5-11-3.5-17.1a41.7 41.7 0 0 1 12.6-30.5A43.4 43.4 0 0 1 252 24.7c8 0 15.2 1.9 21.6 5.7a41.8 41.8 0 0 1 21.2 37.3A43.7 43.7 0 0 1 282 99a42 42 0 0 1-29.6 12.2Zm-.3-15.2c4.8 0 9.4-1.2 13.6-3.6a28 28 0 0 0 13.9-24.8c0-5.4-1.2-10.2-3.7-14.4a24.6 24.6 0 0 0-9.7-9.8 29 29 0 0 0-14.3-3.5 27.1 27.1 0 0 0-27.5 28 27.8 27.8 0 0 0 13.9 24.7c4.3 2.3 8.9 3.4 13.8 3.4Zm99.4 15c-7 0-13.2-1.1-18.7-3.5A42.2 42.2 0 0 1 319 98a43 43 0 0 1-8.5-14 47.4 47.4 0 0 1 2.6-38.2 40 40 0 0 1 15.3-14.9 45.5 45.5 0 0 1 22.7-5.5 40.6 40.6 0 0 1 27.3 9.9c3.3 3 5.8 6.4 7.5 10.1a26 26 0 0 1 2.6 11.2c0 5.9-1.4 10-4.2 12.5a15.5 15.5 0 0 1-10.2 3.5h-50.4c-.1 5.1 1.2 9.5 4 13.2a30.7 30.7 0 0 0 24.1 11.4 57.4 57.4 0 0 0 14.4-2 47 47 0 0 0 7.9-3.4c1-.6 2-1 3-1.3 1-.2 2 0 2.9.4a4 4 0 0 1 2.4 2.2c.7 1 1.2 1.8 1.4 2.7.2.8.4 1.6.4 2.6 0 1.6-1.4 3.4-4.2 5.4a38 38 0 0 1-11.7 5 61 61 0 0 1-16.7 2.1Zm-27.9-48.6h43.7c2.2 0 3.9-.3 5-.9 1-.5 1.7-2.1 1.7-4.7 0-3.2-1-6.1-3-8.7a21 21 0 0 0-8.2-6.4 31.8 31.8 0 0 0-25.8.7c-4.2 2-7.5 4.7-10 8.2a19.2 19.2 0 0 0-3.4 11.8Zm95.6 81.5c-2.8-1.1-4.4-2.4-4.9-4-.4-1.5 0-3.6 1.3-6.2l46.1-103.7c1.3-2.7 2.6-4.3 4-4.9 1.5-.7 3.6-.4 6.3.7 2.8 1.3 4.4 2.7 4.7 4.2.5 1.5.1 3.5-1 6.1L429 140.2c-1.1 2.7-2.4 4.2-3.8 4.7s-3.4.1-6-1ZM436.5 99l-40-61.5c-1.4-2.3-2-4.2-1.7-5.8.4-1.6 1.7-3.2 4-4.7 2.6-1.6 4.6-2.2 6.1-1.7 1.7.3 3.3 1.7 5 4l33.7 53.1-7.1 16.6Z"
				filter="url(#gooey_anim_goo_filter)"
			/>

			<rect bind:this={sliderEl} id="track" width="242" height="14.3" x="139" y="129.3" fill="currentColor" class="track" rx="8.2" />

			<rect
				bind:this={thumbEl}
				id="thumb"
				filter="url(#gooey_anim_thumb_glow)"
				fill="hsl({310 + hue % 360}, 100%, 67%)"
				width="15"
				height="36"
				x={progress}
				y="118.45"
				rx="5.4"
				{onblur}
				{onpointerdown}
				role="slider"
				tabindex="0"
				aria-valuemin="0"
				aria-valuemax="1"
				aria-valuenow={hue}
			/>
		</g>

		<ellipse id="orb1" cx="110" cy="120" rx={10 * p.orbs.size} ry={10 * p.orbs.size} fill="url(#gooey_anim_gradient_1)">
			<animateTransform {...randomPositions(5)} />
		</ellipse>

		<ellipse id="orb4" cx="490" cy="75" rx={10 * p.orbs.size} ry={10 * p.orbs.size} fill="url(#gooey_anim_gradient_4)">
			<animateTransform {...randomPositions(5)} />
		</ellipse>

		<ellipse id="orb3" cx="326" cy="55" rx={8.5 * p.orbs.size} ry={8.5 * p.orbs.size} fill="url(#gooey_anim_gradient_3)">
			<animateTransform {...randomPositions(5)} />
		</ellipse>

		<defs>
			<!--//- Orb Gradients -->

			<linearGradient id="gooey_anim_gradient_1" class="gooey_anim_gradient_1" gradientUnits="objectBoundingBox" x1="1" x2="1" y1="0" y2="1">
				<stop stop-color="hsl({shift1 + hue % 360}, 100%, 67%)" />
				<stop offset="1" stop-color="hsl({shift1 + 20 + hue % 360}, 42%, 25%)" />
			</linearGradient>

			<linearGradient id="gooey_anim_gradient_2" class="gooey_anim_gradient_2" gradientUnits="objectBoundingBox" x1 ="1" x2="1"y1="0"y2="1">
				<stop stop-color="hsl({shift2 + hue % 360}, 100%, 67%)" />
				<stop offset="1" stop-color="hsl({shift2 + 20 + hue % 360}, 42%, 30%)" />
			</linearGradient>

			<linearGradient id="gooey_anim_gradient_4" class="gooey_anim_gradient_4" gradientUnits="objectBoundingBox" x1="1" x2="1" y1="0" y2="1">
				<stop stop-color="hsl({shift4 + hue % 360}, 100%, 67%)" />
				<stop offset="1" stop-color="hsl({shift4 + 20 + hue % 360}, 42%, 30%)" />
			</linearGradient>

			<linearGradient id="gooey_anim_gradient_3" class="gooey_anim_gradient_3" gradientUnits="objectBoundingBox" x1="1" x2="1" y1="0" y2="1">
				<stop stop-color="hsl({shift3 + hue % 360}, 100%, 67%)" />
				<stop offset="1" stop-color="hsl({shift3 + 20 + hue % 360}, 42%, 30%)" />
			</linearGradient>

			<!--//- Glow Filter -->

			<filter id="gooey_anim_thumb_glow" x="-500%" y="-500%" width="1000%" height="1000%">
				<feGaussianBlur stdDeviation="18" result="coloredBlur" />

				<feMerge>
					<feMergeNode in="coloredBlur" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>

			<!--//- Turbulence Filter -->

			<filter id="gooey_anim_goo_filter" width="3" height="3" x="-1" y="-1">
				<feTurbulence type="{p.goo.texture}" width="{viewBox.width}" height="{viewBox.width}" x="0" y="0" numOctaves={p.goo.density} seed="1" baseFrequency={p.goo.viscosity} stitchTiles="stitch" />

				<feTile width="{viewBox.width * 3}" height="{viewBox.width}" />

				<feOffset result="TURBULENCE" dx="0" width="{viewBox.width * 2}">
					{#if p.goo.animate}
						<animate attributeName="dx" from="-{viewBox.width}" to="0" begin="0s" dur="{duration}s" repeatCount="indefinite" />
					{/if}
				</feOffset>

				<feDisplacementMap in="SourceGraphic" in2="TURBULENCE" scale={p.goo.gooeyness}>
			</filter>
		</defs>
	</svg>
</div>

<style lang="scss">
	.logo {
		width: min(50rem, 90vw);
		margin: auto;
		overflow: visible;

		#thumb {
			cursor: grab;
			outline: none;
			border: none;
		}
	}

	svg {
		color: var(--fg-d);
		contain: layout style;
		backface-visibility: hidden;
		transform: translateZ(0px);

		* {
			backface-visibility: hidden;
			transform: translateZ(0px);
			contain: content;
		}
	}
</style>
