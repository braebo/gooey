<script lang="ts">
	import { Gooey, type InputNumber } from 'gooey'
	import { onDestroy, onMount } from 'svelte'
	import { themer } from '$lib/themer.svelte'

	const viewBox = {
		width: 500,
		height: 190
	}

	let svgEl = $state<SVGSVGElement>()
	let turbulenceEl: SVGFETurbulenceElement

	let sliderEl = $state<SVGRectElement>()
	let thumbEl = $state<SVGRectElement>()
	let sliderInput: InputNumber

	let orb1El: SVGEllipseElement
	let orb2El: SVGEllipseElement
	let orb3El: SVGEllipseElement
	let orb4El: SVGEllipseElement

	// const lfo = tweened(1, { duration: 1000 })

	const r = (n: number, amount: number) => Math.abs(n + (-0.5 + Math.random()) * amount).toFixed(2)
	function anims() {
		const easing = `cubic-bezier(${r(0.85, 0.1)},${r(0.01, 0.1)},${r(0.13, 0.1)},${r(0.81, 0.1)})`
		return {
			distance: 10 + 10 * Math.random(),
			easing,
			duration: 2000 + 3000 * Math.random(),
			delay: 1000 + 4000 * Math.random()
		}
	}

	let p = $state({
		speed: 0.5,
		slider: 0.73,
		glow: 21.2,
		goo: {
			viscosity: 0.05,
			density: 4,
			gooeyness: 33,
			lfo: 0.25,
			scale1: 2,
			scale2: 2
		},
		orbs: {
			size: 1,
			speed: 1,
			distance: 1
		}
	} satisfies Record<string, any>)

	const hueShift = $derived(Math.floor(p.slider * 360))
	const shift1 = 307
	const shift2 = 275
	const shift3 = 307
	const shift4 = 302

	const mapRange = (v: number, inMin: number, inMax: number, outMin: number, outMax: number): number =>
		((v - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin

	let progress = $derived.by(() => {
		if (sliderEl === undefined || thumbEl === undefined) return 1
		const x = +sliderEl.getAttribute('x')!
		const width = +sliderEl.getAttribute('width')!
		const thumbWidth = +thumbEl.getAttribute('width')!
		return mapRange(p.slider, 0, 1, x, width + x - thumbWidth)
	})

	const unsubs = [] as (() => any)[]
	onMount(() => {
		const gui = new Gooey({
			position: 'top-center',
			margin: { y: 100 }
		})

		const orbConfig = (title: string) =>
			({
				title,
				folderOptions: { closed: true },
				cx: { max: 500, step: 1 },
				cy: { max: 190, step: 1 },
				radius: { max: 50, step: 0.1 },
				animation: {
					folderOptions: { closed: true },
					distance: { max: 50, step: 0.1 },
					duration: { max: 5000, step: 1 },
					delay: { max: 5000, step: 1 }
				}
			}) as const

		gui.bindMany(p, {
			speed: { max: 5, step: 0.01 },
			slider: { max: 1, step: 0.01 },
			glow: { max: 30, step: 0.1 },
			goo: {
				gooeyness: { min: 0.1, max: 100, step: 0.1 },
				viscosity: { min: 0.004, max: 10.5, step: 0.0001 },
				density: { min: 1, max: 20, step: 1 },
				scale1: { min: -100, max: 100, step: 0.1 },
				scale2: { min: -100, max: 100, step: 0.1 }
			},
			orbs: {
				size: { min: 0.5, max: 3, step: 0.01 },
				orb1: orbConfig('orb 1'),
				orb2: orbConfig('orb 2'),
				orb3: orbConfig('orb 3'),
				orb4: orbConfig('orb 4')
			}
		})

		// Loopguard.
		let locked = 0

		unsubs.push(
			gui.themer.mode.subscribe((m) => {
				if (locked) {
					locked = 0
				} else {
					themer.theme = m
				}
				// document.documentElement.setAttribute('theme', m)
			})
		)

		function updateTheme() {
			for (const [k, v] of Object.entries(gui.themer.modeColors)) {
				document.documentElement.style.setProperty(`--${k}`, v)
			}
		}

		$effect(() => {
			locked = 1
			gui.themer.mode.set(themer.theme)
			updateTheme()
		})

		// Sync with the page theme.
		unsubs.push(
			gui.themer.theme.subscribe(() => {
				updateTheme()
			})
		)

		// Sync the sliders.
		sliderInput = gui.allInputs.get('slider') as InputNumber
	})

	onDestroy(() => {
		for (const unsubscribe of unsubs) {
			unsubscribe()
		}
		disposed = true
		globalThis.window?.location.reload()
	})

	let grabbing = false
	let mouseOffset = 0

	function onpointerdown(e: PointerEvent) {
		grabbing = true
		mouseOffset = e.clientX - thumbEl!.getBoundingClientRect().left
	}

	function onblur() {
		grabbing = false
	}

	function onpointermove(e: PointerEvent) {
		if (!grabbing) return

		const { clientX } = e
		const { left: sliderLeft, width: sliderWidth } = sliderEl!.getBoundingClientRect()
		const thumbWidth = thumbEl!.getBoundingClientRect().width

		const minX = sliderLeft
		const maxX = sliderLeft + sliderWidth - thumbWidth
		const newX = Math.min(Math.max(clientX - mouseOffset, minX), maxX)

		p.slider = mapRange(newX, minX, maxX, 0, 1).toFixed(2) as any as number
		sliderInput.refresh()
	}

	let time = $state(1)
	const fps = 60
	const interval = 1000 / fps
	let disposed = false

	let lfo = $derived(((0.75 + Math.sin(time * p.speed * 0.0001) * 0.5) * 0.8 + 0.1) * p.goo.lfo)

	requestAnimationFrame(tick)
	// fps limited
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
		bind:this={svgEl}
	>
		<ellipse id="orb2" bind:this={orb2El} cx="14" cy="13.2" rx={14 * p.orbs.size} ry={14 * p.orbs.size} fill="url(#gooey_anim_gradient_2)" />
		<path
			id="text"
			fill="currentColor"
			d="M55 144.2a48 48 0 0 1-21.5-5c-2.7-1.6-5-3.2-6.6-5-1.6-1.7-2.4-3.3-2.4-4.8 0-1.2.2-2.2.5-3l1.6-2.2c1.1-1.2 2-2 2.8-2.5a5 5 0 0 1 2.8-.7c1.1 0 2.3.5 3.4 1.4a48 48 0 0 0 4.2 3.3 26.5 26.5 0 0 0 15.7 5 30 30 0 0 0 10.3-1.8 22 22 0 0 0 12.8-13.8 33 33 0 0 0 1.8-11.2l-.3-72.4c0-2.2.7-3.8 1.9-4.7 1.3-1 3.2-1.4 6-1.4 2.1 0 3.7.3 4.6 1 1 .6 1.7 1.5 2 2.6.3 1 .5 2.4.5 4v72.2c0 6.1-1 11.6-3 16.3a34.3 34.3 0 0 1-21 20 47.3 47.3 0 0 1-16.1 2.7Zm-.5-36a40 40 0 0 1-15.5-3 39.8 39.8 0 0 1-20.6-21.8A46 46 0 0 1 15.6 67a40.8 40.8 0 0 1 11-29.4 38.1 38.1 0 0 1 41.6-8.7c4.2 2 7.7 4.8 10.7 8.5a36 36 0 0 1 6.7 12.9c1.6 5 2.3 10.6 2.3 16.7a54 54 0 0 1-4 21.8c-2.7 6.1-6.5 11-11.5 14.3-5 3.3-11 5-18 5Zm.8-14.4a23.3 23.3 0 0 0 21.5-13A29 29 0 0 0 80 66.7c0-5.3-1.1-9.9-3.3-13.8A24.4 24.4 0 0 0 55 40.2a22.8 22.8 0 0 0-21.4 12.7c-2 4-3 8.6-3 14 0 5.3 1 10 3.1 14s5 7.1 8.7 9.5c3.8 2.3 8 3.4 13 3.4Zm99.6 17.3c-5.7 0-11.1-1.1-16.4-3.3A43.8 43.8 0 0 1 115.2 85c-2.3-5.3-3.5-11-3.5-17.1a41.7 41.7 0 0 1 12.6-30.5 43.4 43.4 0 0 1 30.3-12.7c8 0 15.2 1.9 21.6 5.7a41.8 41.8 0 0 1 21.2 37.3A43.7 43.7 0 0 1 184.5 99a42 42 0 0 1-29.6 12.2Zm-.3-15.2c4.8 0 9.4-1.2 13.6-3.6A28 28 0 0 0 182 67.5c0-5.4-1.2-10.2-3.7-14.4a24.6 24.6 0 0 0-9.7-9.8 29 29 0 0 0-14.3-3.5 27.1 27.1 0 0 0-27.5 28 27.8 27.8 0 0 0 13.9 24.7c4.3 2.3 8.9 3.4 13.8 3.4Zm97.8 15.2c-5.7 0-11.1-1.1-16.4-3.3A43.8 43.8 0 0 1 212.7 85c-2.3-5.3-3.5-11-3.5-17.1a41.7 41.7 0 0 1 12.6-30.5A43.4 43.4 0 0 1 252 24.7c8 0 15.2 1.9 21.6 5.7a41.8 41.8 0 0 1 21.2 37.3A43.7 43.7 0 0 1 282 99a42 42 0 0 1-29.6 12.2Zm-.3-15.2c4.8 0 9.4-1.2 13.6-3.6a28 28 0 0 0 13.9-24.8c0-5.4-1.2-10.2-3.7-14.4a24.6 24.6 0 0 0-9.7-9.8 29 29 0 0 0-14.3-3.5 27.1 27.1 0 0 0-27.5 28 27.8 27.8 0 0 0 13.9 24.7c4.3 2.3 8.9 3.4 13.8 3.4Zm99.4 15c-7 0-13.2-1.1-18.7-3.5A42.2 42.2 0 0 1 319 98a43 43 0 0 1-8.5-14 47.4 47.4 0 0 1 2.6-38.2 40 40 0 0 1 15.3-14.9 45.5 45.5 0 0 1 22.7-5.5 40.6 40.6 0 0 1 27.3 9.9c3.3 3 5.8 6.4 7.5 10.1a26 26 0 0 1 2.6 11.2c0 5.9-1.4 10-4.2 12.5a15.5 15.5 0 0 1-10.2 3.5h-50.4c-.1 5.1 1.2 9.5 4 13.2a30.7 30.7 0 0 0 24.1 11.4 57.4 57.4 0 0 0 14.4-2 47 47 0 0 0 7.9-3.4c1-.6 2-1 3-1.3 1-.2 2 0 2.9.4a4 4 0 0 1 2.4 2.2c.7 1 1.2 1.8 1.4 2.7.2.8.4 1.6.4 2.6 0 1.6-1.4 3.4-4.2 5.4a38 38 0 0 1-11.7 5 61 61 0 0 1-16.7 2.1Zm-27.9-48.6h43.7c2.2 0 3.9-.3 5-.9 1-.5 1.7-2.1 1.7-4.7 0-3.2-1-6.1-3-8.7a21 21 0 0 0-8.2-6.4 31.8 31.8 0 0 0-25.8.7c-4.2 2-7.5 4.7-10 8.2a19.2 19.2 0 0 0-3.4 11.8Zm95.6 81.5c-2.8-1.1-4.4-2.4-4.9-4-.4-1.5 0-3.6 1.3-6.2l46.1-103.7c1.3-2.7 2.6-4.3 4-4.9 1.5-.7 3.6-.4 6.3.7 2.8 1.3 4.4 2.7 4.7 4.2.5 1.5.1 3.5-1 6.1L429 140.2c-1.1 2.7-2.4 4.2-3.8 4.7s-3.4.1-6-1ZM436.5 99l-40-61.5c-1.4-2.3-2-4.2-1.7-5.8.4-1.6 1.7-3.2 4-4.7 2.6-1.6 4.6-2.2 6.1-1.7 1.7.3 3.3 1.7 5 4l33.7 53.1-7.1 16.6Z"
			filter="url(#gooey_anim_goo_filter)"
		/>
		<ellipse id="orb1" bind:this={orb1El} cx="110" cy="120" rx={10 * p.orbs.size} ry={10 * p.orbs.size} fill="url(#gooey_anim_gradient_1)" />
		<ellipse id="orb4" bind:this={orb4El} cx="490" cy="75" rx={10 * p.orbs.size} ry={10 * p.orbs.size} fill="url(#gooey_anim_gradient_4)" />
		<ellipse id="orb3" bind:this={orb3El} cx="326" cy="55" rx={8.5 * p.orbs.size} ry={8.5 * p.orbs.size} fill="url(#gooey_anim_gradient_3)" />

		<g id="slider">
			<rect bind:this={sliderEl} id="track" width="242" height="14.3" x="139" y="129.3" fill="currentColor" class="track" rx="8.2" />
			<g id="thumb-glow" filter="url(#gooey_anim_thumb_glow)">
				<rect
					id="thumb"
					bind:this={thumbEl}
					{onpointerdown}
					{onblur}
					role="slider"
					tabindex="0"
					aria-valuemin="0"
					aria-valuemax="1"
					aria-valuenow={p.slider}
					width="15"
					height="36"
					x={progress}
					y="118.45"
					fill="hsl({310 + hueShift % 360}, 100%, 67%)"
					rx="5.4"
				/>
			</g>
		</g>

		<defs>
			<linearGradient id="gooey_anim_gradient_1" class="gooey_anim_gradient_1" gradientUnits="objectBoundingBox" x1="1" x2="1" y1="0" y2="1">
				<!-- <stop stop-color={p.orbs.orb1.colorA.hex} /> -->
				<!-- <stop offset="1" stop-color={p.orbs.orb1.colorB.hex} /> -->
				<stop stop-color="hsl({shift1 + hueShift % 360}, 100%, 67%)" />
				<stop offset="1" stop-color="hsl({shift1 + 20 + hueShift % 360}, 42%, 50%)" />
			</linearGradient>
			<linearGradient id="gooey_anim_gradient_2" class="gooey_anim_gradient_2" gradientUnits="objectBoundingBox" x1 ="1" x2="1"y1="0"y2="1">
				<!-- <stop stop-color={p.orbs.orb2.colorA.hex} /> -->
				<!-- <stop offset="1" stop-color={p.orbs.orb2.colorB.hex} /> -->
				<stop stop-color="hsl({shift2 + hueShift % 360}, 100%, 67%)" />
				<stop offset="1" stop-color="hsl({shift2 + 20 + hueShift % 360}, 42%, 50%)" />
			</linearGradient>
			<linearGradient id="gooey_anim_gradient_4" class="gooey_anim_gradient_4" gradientUnits="objectBoundingBox" x1="1" x2="1" y1="0" y2="1">
				<!-- <stop stop-color={p.orbs.orb4.colorA.hex} /> -->
				<!-- <stop offset="1" stop-color={p.orbs.orb4.colorB.hex} /> -->
				<stop stop-color="hsl({shift4 + hueShift % 360}, 100%, 67%)" />
				<stop offset="1" stop-color="hsl({shift4 + 20 + hueShift % 360}, 42%, 50%)" />
			</linearGradient>
			<linearGradient id="gooey_anim_gradient_3" class="gooey_anim_gradient_3" gradientUnits="objectBoundingBox" x1="1" x2="1" y1="0" y2="1">
				<!-- <stop stop-color={p.orbs.orb3.colorA.hex} /> -->
				<!-- <stop offset="1" stop-color={p.orbs.orb3.colorB.hex} /> -->
				<stop stop-color="hsl({shift3 + hueShift % 360}, 100%, 67%)" />
				<stop offset="1" stop-color="hsl({shift3 + 20 + hueShift % 360}, 42%, 50%)" />
			</linearGradient>

			<!--//- Glow Filter -->

			<filter id="gooey_anim_thumb_glow" class="gooey_anim_thumb_glow" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
				<feOffset />
				<feGaussianBlur stdDeviation={p.glow} />
				<feComposite in2="hardAlpha" operator="out" />
				
				<!-- works -->
				<feColorMatrix values="0 0 0 0 0.0352941 0 0 0 0 0.541176 0 0 0 0 0.894118 0 0 0 1 0" />
				
				<feFlood flood-color="hsl(210, 100%, 50%)" result="hslColor" />
				<!-- doesn't work -->
				<feComposite in="hslColor" in2="hardAlpha" operator="in" result="colorEffect" />
				
				<feBlend in2="BackgroundImageFix" result="gooey_anim_glow_shadow" />
				<feBlend in="SourceGraphic" in2="gooey_anim_glow_shadow" result="shape" />
			</filter>

			<!--//- Turbulence Filter -->

			<filter id="gooey_anim_goo_filter" x="-50%" y="-50%" width="200%" height="200%">
				<!-- <feTurbulence
					bind:this={turbulenceEl}
					type="noise"
					baseFrequency={p.goo.viscosity * $lfo}
					numOctaves={p.goo.density}
					result="turbulence"
					stitchTiles="noStitch"
				> -->
				
				<!-- <feTurbulence>
				<animate
					attributeName="baseFrequency"
					values="0.02;0.05;0.02"
					dur="10s"
					repeatCount="indefinite"
				/>
				</feTurbulence>
				<feDisplacementMap
					bind:this={displacementEl}
					in2="turbulence"
					in="SourceGraphic"
					scale={p.goo.gooeyness}
					xChannelSelector="R"
					yChannelSelector="G"
					transform-origin="center"
				/> -->
				<!-- <feTurbulence id="fractalNoise" baseFrequency="0.10" numOctaves="3" seed="1" stitchTiles="noStitch"> -->
					<!-- <animate id="noiseAnimate" attributeName="baseFrequency" attributeType="XML" values="0.10;0.15" keyTimes="0;1" begin="0s" dur="1s" repeatCount="indefinite" calcMode="linear" /> -->
				<!-- </feTurbulence> -->
				
				<feTurbulence
					bind:this={turbulenceEl}
					type="fractalNoise"
					baseFrequency={p.goo.viscosity * lfo}
					numOctaves={p.goo.density}
					result="turbulence"
					stitchTiles="noStitch"
				/>

				<feOffset dx="0" dy="0">
					<animate attributeName="dx" values="{svgEl?.clientWidth ?? 0};0" keyTimes="0;1" dur="{p.speed}s" repeatCount="indefinite" calcMode="linear" />
				</feOffset>
				<!-- <feScale scale="10" in="turbulence" result="scaledOffset" /> -->
				<!-- <feOffset dx="0" dy="0" in="scaled" result="offset" /> -->
				<feFlood flood-color="hsl({hueShift % 360}, 100%, 67%)" result="flood" />
				<feGaussianBlur in="offset" stdDeviation="2" result="blurred" />
				<!-- <feDisplacementMap in="SourceGraphic" in2="turbulence" scale={p.goo.gooeyness} xChannelSelector="B" yChannelSelector="B" /> -->
				<!-- <feDisplacementMap in="SourceGraphic" result="turbulence" scale="{p.goo.gooeyness}" xChannelSelector="R" yChannelSelector="G" /> -->
				<feDisplacementMap in="SourceGraphic" in2="turbulence" scale={p.goo.scale1} xChannelSelector="B" yChannelSelector="B" />
				<feDisplacementMap in="SourceGraphic" result="turbulence" scale="{p.goo.scale2}" xChannelSelector="R" yChannelSelector="G" />
				<!-- src graphic -->
				<!-- <feBlend in="SourceGraphic" in2="blurred" mode="multiply" /> -->
				<!-- </feOffset> -->
			</filter>
		</defs>
	</svg>
</div>

<style lang="scss">
	.logo {
		width: min(50rem, 90vw);
		margin: auto;
		overflow: visible;

		#orb2 {
			animation: orb2 2s infinite;
		}
		@keyframes orb2 {
			0% {
				transform: matrix(0.94902, -0.31523, 0.35646, 0.93431, 229.4, 89.3);
			}
			100% {
				transform: matrix(0.94902, -0.31523, 0.35646, 0.93431, 229.4, 89.3);
			}
		}
		#thumb {
			cursor: grab;
			// transition: all 0.3s ease-in-out;
			outline: none;
			border: none;
		}
	}

	svg {
		color: var(--fg-a);
	}

	:global(:root[theme='light'] svg) {
		color: var(--fg-d);
	}
</style>
