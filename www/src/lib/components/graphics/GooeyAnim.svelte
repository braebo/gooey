<script lang="ts">
	import { tweened } from 'svelte/motion'
	import { Color, Folder, Gooey } from 'gooey'
	import { onMount } from 'svelte'

	const _$ = $state({
		orbs: {
			orb1: {
				cx: 8.9,
				cy: 8.4,
				radius: 8.6,
				transform: 'matrix(.94902 -.31523 .35646 .93431 86.1 103)',
				colorA: new Color('#57B1FF'),
				colorB: new Color('#2B2E6B')
			},
			orb2: {
				cx: 14,
				cy: 13.2,
				radius: 14,
				transform: 'matrix(.94902 -.31523 .35646 .93431 229.4 89.3)',
				colorA: new Color('#1EFFE4'),
				colorB: new Color('#004545')
			},
			orb3: {
				cx: 8.9,
				cy: 8.4,
				radius: 8.6,
				transform: 'matrix(.94902 -.31523 .35646 .93431 298.3 38.6)',
				colorA: new Color('#0094FF'),
				colorB: new Color('#2B5C6B')
			},
			orb4: {
				cx: 10.3,
				cy: 9.7,
				radius: 10,
				transform: 'matrix(.94902 -.31523 .35646 .93431 461.3 46.4)',
				colorA: new Color('#5486D1'),
				colorB: new Color('#2B2E6B')
			}
		}
	} as const)

	onMount(() => {
		const gui = new Gooey()

		const orbsFolder = gui.addFolder('Orbs')
		// const foo = orbsFolder.bind(_$.orbs.orb1, 'cx')

		orbsFolder.bindMany(_$)
		console.log(gui.folder.allInputs)

		return () => {
			gui.dispose()
		}
	})
</script>

<div class="logo">
	<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 500 190">
		<ellipse
			id="orb2"
			class="orb2"
			cx={_$.orbs.orb2.cx}
			cy={_$.orbs.orb2.cy}
			fill="url(#gooey_anim_gradient_2)"
			rx={_$.orbs.orb2.radius}
			ry={_$.orbs.orb2.radius}
			transform={_$.orbs.orb2.transform}
		/>
		<path
			id="text"
			fill="var(--fg-b)"
			d="M55 144.2a48 48 0 0 1-21.5-5c-2.7-1.6-5-3.2-6.6-5-1.6-1.7-2.4-3.3-2.4-4.8 0-1.2.2-2.2.5-3l1.6-2.2c1.1-1.2 2-2 2.8-2.5a5 5 0 0 1 2.8-.7c1.1 0 2.3.5 3.4 1.4a48 48 0 0 0 4.2 3.3 26.5 26.5 0 0 0 15.7 5 30 30 0 0 0 10.3-1.8 22 22 0 0 0 12.8-13.8 33 33 0 0 0 1.8-11.2l-.3-72.4c0-2.2.7-3.8 1.9-4.7 1.3-1 3.2-1.4 6-1.4 2.1 0 3.7.3 4.6 1 1 .6 1.7 1.5 2 2.6.3 1 .5 2.4.5 4v72.2c0 6.1-1 11.6-3 16.3a34.3 34.3 0 0 1-21 20 47.3 47.3 0 0 1-16.1 2.7Zm-.5-36a40 40 0 0 1-15.5-3 39.8 39.8 0 0 1-20.6-21.8A46 46 0 0 1 15.6 67a40.8 40.8 0 0 1 11-29.4 38.1 38.1 0 0 1 41.6-8.7c4.2 2 7.7 4.8 10.7 8.5a36 36 0 0 1 6.7 12.9c1.6 5 2.3 10.6 2.3 16.7a54 54 0 0 1-4 21.8c-2.7 6.1-6.5 11-11.5 14.3-5 3.3-11 5-18 5Zm.8-14.4a23.3 23.3 0 0 0 21.5-13A29 29 0 0 0 80 66.7c0-5.3-1.1-9.9-3.3-13.8A24.4 24.4 0 0 0 55 40.2a22.8 22.8 0 0 0-21.4 12.7c-2 4-3 8.6-3 14 0 5.3 1 10 3.1 14s5 7.1 8.7 9.5c3.8 2.3 8 3.4 13 3.4Zm99.6 17.3c-5.7 0-11.1-1.1-16.4-3.3A43.8 43.8 0 0 1 115.2 85c-2.3-5.3-3.5-11-3.5-17.1a41.7 41.7 0 0 1 12.6-30.5 43.4 43.4 0 0 1 30.3-12.7c8 0 15.2 1.9 21.6 5.7a41.8 41.8 0 0 1 21.2 37.3A43.7 43.7 0 0 1 184.5 99a42 42 0 0 1-29.6 12.2Zm-.3-15.2c4.8 0 9.4-1.2 13.6-3.6A28 28 0 0 0 182 67.5c0-5.4-1.2-10.2-3.7-14.4a24.6 24.6 0 0 0-9.7-9.8 29 29 0 0 0-14.3-3.5 27.1 27.1 0 0 0-27.5 28 27.8 27.8 0 0 0 13.9 24.7c4.3 2.3 8.9 3.4 13.8 3.4Zm97.8 15.2c-5.7 0-11.1-1.1-16.4-3.3A43.8 43.8 0 0 1 212.7 85c-2.3-5.3-3.5-11-3.5-17.1a41.7 41.7 0 0 1 12.6-30.5A43.4 43.4 0 0 1 252 24.7c8 0 15.2 1.9 21.6 5.7a41.8 41.8 0 0 1 21.2 37.3A43.7 43.7 0 0 1 282 99a42 42 0 0 1-29.6 12.2Zm-.3-15.2c4.8 0 9.4-1.2 13.6-3.6a28 28 0 0 0 13.9-24.8c0-5.4-1.2-10.2-3.7-14.4a24.6 24.6 0 0 0-9.7-9.8 29 29 0 0 0-14.3-3.5 27.1 27.1 0 0 0-27.5 28 27.8 27.8 0 0 0 13.9 24.7c4.3 2.3 8.9 3.4 13.8 3.4Zm99.4 15c-7 0-13.2-1.1-18.7-3.5A42.2 42.2 0 0 1 319 98a43 43 0 0 1-8.5-14 47.4 47.4 0 0 1 2.6-38.2 40 40 0 0 1 15.3-14.9 45.5 45.5 0 0 1 22.7-5.5 40.6 40.6 0 0 1 27.3 9.9c3.3 3 5.8 6.4 7.5 10.1a26 26 0 0 1 2.6 11.2c0 5.9-1.4 10-4.2 12.5a15.5 15.5 0 0 1-10.2 3.5h-50.4c-.1 5.1 1.2 9.5 4 13.2a30.7 30.7 0 0 0 24.1 11.4 57.4 57.4 0 0 0 14.4-2 47 47 0 0 0 7.9-3.4c1-.6 2-1 3-1.3 1-.2 2 0 2.9.4a4 4 0 0 1 2.4 2.2c.7 1 1.2 1.8 1.4 2.7.2.8.4 1.6.4 2.6 0 1.6-1.4 3.4-4.2 5.4a38 38 0 0 1-11.7 5 61 61 0 0 1-16.7 2.1Zm-27.9-48.6h43.7c2.2 0 3.9-.3 5-.9 1-.5 1.7-2.1 1.7-4.7 0-3.2-1-6.1-3-8.7a21 21 0 0 0-8.2-6.4 31.8 31.8 0 0 0-25.8.7c-4.2 2-7.5 4.7-10 8.2a19.2 19.2 0 0 0-3.4 11.8Zm95.6 81.5c-2.8-1.1-4.4-2.4-4.9-4-.4-1.5 0-3.6 1.3-6.2l46.1-103.7c1.3-2.7 2.6-4.3 4-4.9 1.5-.7 3.6-.4 6.3.7 2.8 1.3 4.4 2.7 4.7 4.2.5 1.5.1 3.5-1 6.1L429 140.2c-1.1 2.7-2.4 4.2-3.8 4.7s-3.4.1-6-1ZM436.5 99l-40-61.5c-1.4-2.3-2-4.2-1.7-5.8.4-1.6 1.7-3.2 4-4.7 2.6-1.6 4.6-2.2 6.1-1.7 1.7.3 3.3 1.7 5 4l33.7 53.1-7.1 16.6Z"
			class="text"
		/>
		<ellipse
			id="orb1"
			cx={_$.orbs.orb1.cx}
			cy={_$.orbs.orb1.cy}
			fill="url(#gooey_anim_gradient_1)"
			class="orb1"
			rx={_$.orbs.orb1.radius}
			ry={_$.orbs.orb1.radius}
			transform={_$.orbs.orb1.transform}
		/>
		<ellipse
			id="orb4"
			cx={_$.orbs.orb4.cx}
			cy={_$.orbs.orb4.cy}
			fill="url(#gooey_anim_gradient_4)"
			class="orb4"
			rx={_$.orbs.orb4.radius}
			ry={_$.orbs.orb4.radius}
			transform={_$.orbs.orb4.transform}
		/>
		<ellipse
			id="orb3"
			cx={_$.orbs.orb3.cx}
			cy={_$.orbs.orb3.cy}
			fill="url(#gooey_anim_gradient_3)"
			class="orb3"
			rx={_$.orbs.orb3.radius}
			ry={_$.orbs.orb3.radius}
			transform={_$.orbs.orb3.transform}
		/>
		<g id="slider" class="slider">
			<rect id="track" width="245" height="16.3" x="127" y="123.3" fill="#15161D" class="track" rx="8.2" />
			<g id="thumb" class="thumb" filter="url(#gooey_anim_thumb_glow)">
				<rect width="16.3" height="38.1" x="295.8" y="112.4" fill="#57B1FF" rx="5.4" />
			</g>
		</g>
		<!-- prettier-ignore -->
		<defs>
			<linearGradient id="gooey_anim_gradient_1" class="gooey_anim_gradient_1" gradientUnits="objectBoundingBox" x1="1" x2="1" y1="0" y2="1">
				<stop stop-color={_$.orbs.orb2.colorA.hex} />
				<stop offset="1" stop-color={_$.orbs.orb2.colorB.hex} />
			</linearGradient>
			<linearGradient id="gooey_anim_gradient_2" class="gooey_anim_gradient_2" gradientUnits="objectBoundingBox" x1 ="1" x2="1"y1="0"y2="1">
				<stop stop-color={_$.orbs.orb1.colorA.hex} />
				<stop offset="1" stop-color={_$.orbs.orb1.colorB.hex} />
			</linearGradient>
			<linearGradient id="gooey_anim_gradient_4" class="gooey_anim_gradient_4" gradientUnits="objectBoundingBox" x1="1" x2="1" y1="0" y2="1">
				<stop stop-color={_$.orbs.orb3.colorA.hex} />
				<stop offset="1" stop-color={_$.orbs.orb3.colorB.hex} />
			</linearGradient>
			<linearGradient id="gooey_anim_gradient_3" class="gooey_anim_gradient_3" gradientUnits="userSpaceOnUse" x1="1" x2="1" y1="0" y2="1">
				<stop stop-color={_$.orbs.orb4.colorA.hex} />
				<stop offset="1" stop-color={_$.orbs.orb4.colorB.hex} />
			</linearGradient>
			<clipPath id="gooey-anim-clip" class="clip0_454">
				<path fill="var(--fg-b)" d="M0 0h500v190H0z" />
			</clipPath>
			<filter id="gooey_anim_thumb_glow" class="gooey_anim_thumb_glow" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" width="100" height="123" x="253" y="70">
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
				<feOffset />
				<feGaussianBlur stdDeviation="21.2" />
				<feComposite in2="hardAlpha" operator="out" />
				<feColorMatrix values="0 0 0 0 0.0352941 0 0 0 0 0.541176 0 0 0 0 0.894118 0 0 0 1 0" />
				<feBlend in2="BackgroundImageFix" result="gooey_anim_glow_shadow" />
				<feBlend in="SourceGraphic" in2="gooey_anim_glow_shadow" result="shape" />
			</filter>
		</defs>
	</svg>
</div>

<style lang="scss">
	.logo {
		width: min(50rem, 90vw);
		margin: auto;
	}
</style>
