<script lang="ts">
	import type { Theme } from '$lib/themer/themer.svelte'

	import { themer } from '$lib/themer/themer.svelte'

	const defaultColors = {
		shadow: '#102231',
		lg1: {
			a: '#42DDFF',
			b: '#4D00F0',
		},
		lg2: '#57B1FF',
		sm1: '#57E1FF',
		sm2: '#57CDFF',
		sm3: '#57B1FF',
		sm4: '#5790FF',
		sm5: '#5768FF',
	}

	const {
		expand = false,
		theme = themer.activeTheme,
		colors = defaultColors,
	}: {
		expand?: boolean
		theme?: Theme
		colors?: typeof defaultColors
	} = $props()

	let hovering = $state(false)
	let reveal = $derived(hovering || (expand && theme.title === themer.activeTheme.title))
	let c = $state(colors)
	let hide = $derived(!expand && theme.title !== themer.activeTheme.title)

	c.shadow = themer.resolveLightDark(theme.vars.color['--dark-a'])
	if (theme.title !== 'vanilla') {
		c.lg1.a = themer.resolveLightDark(theme.vars.color['--theme-a'])
		c.lg1.b = themer.resolveLightDark(theme.vars.color['--theme-a'])
		c.lg2 = themer.resolveLightDark(theme.vars.color['--theme-b'])
	}
	// c.sm1 = themer.resolveLightDark(theme.vars.color['--bg-b'])
	// c.sm2 = themer.resolveLightDark(theme.vars.color['--bg-c'])
	// c.sm3 = themer.resolveLightDark(theme.vars.color['--bg-d'])
	// c.sm4 = themer.resolveLightDark(theme.vars.color['--fg-e'])
	// c.sm5 = themer.resolveLightDark(theme.vars.color['--fg-d'])
	c.sm1 = themer.resolveLightDark(theme.vars.color['--fg-d'])
	c.sm2 = themer.resolveLightDark(theme.vars.color['--fg-e'])
	c.sm3 = themer.resolveLightDark(theme.vars.color['--bg-d'])
	c.sm4 = themer.resolveLightDark(theme.vars.color['--bg-c'])
	c.sm5 = themer.resolveLightDark(theme.vars.color['--bg-b'])

	const seed = Math.round(Math.random() * 100000)

	const size = 256
	const center = size / 2
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width="100%"
	height="100%"
	viewBox="0 0 256 256"
	onpointerenter={() => (hovering = true)}
	onpointerleave={() => (hovering = false)}
	class:hide
>
	<g id="gooey-icon-gradient" class="gooey-icon-gradient" class:reveal>
		<g class="sm1">
			<circle cx={!reveal ? center : 85.1} cy={!reveal ? center : 20.1} r="14.8" fill={c.sm1} />
			<circle
				cx={!reveal ? center : 85.1}
				cy={!reveal ? center : 20.1}
				r="14.8"
				fill="url(#sm1_radial_{theme?.title ?? seed})"
				fill-opacity=".5"
			/>
		</g>

		<g class="sm2">
			<circle
				cx={!reveal ? center : 20.5}
				cy={!reveal ? center : 20.5}
				r="20.5"
				fill={c.sm2}
				transform="rotate(-19.6 131.4 -386.6)"
			/>
			<circle
				cx={!reveal ? center : 20.5}
				cy={!reveal ? center : 20.5}
				r="20.5"
				fill="url(#sm2_radial_{theme?.title ?? seed})"
				fill-opacity=".7"
				transform="rotate(-19.6 131.4 -386.6)"
			/>
		</g>

		<g class="sm3">
			<circle cx={!reveal ? center : 201.7} cy={!reveal ? center : 126.7} r="28.2" fill={c.sm3} />
			<circle
				cx={!reveal ? center : 201.7}
				cy={!reveal ? center : 126.7}
				r="28.2"
				fill="url(#sm3_radial_{theme?.title ?? seed})"
				fill-opacity=".6"
			/>
		</g>

		<g class="sm4">
			<circle
				cx={!reveal ? center : 20.1}
				cy={!reveal ? center : 20.1}
				r="20.1"
				fill={c.sm4}
				transform="rotate(-19.6 666.3 -295.8)"
			/>
			<circle
				cx={!reveal ? center : 20.1}
				cy={!reveal ? center : 20.1}
				r="20.1"
				fill="url(#sm4_radial_{theme?.title ?? seed})"
				fill-opacity=".6"
				transform="rotate(-19.6 666.3 -295.8)"
			/>
		</g>

		<g class="sm5">
			<circle
				cx={!reveal ? center : 13}
				cy={!reveal ? center : 13.0}
				r="13"
				fill={c.sm5}
				transform="rotate(-19.6 693 -90)"
			/>
			<circle
				cx={!reveal ? center : 13}
				cy={!reveal ? center : 13.0}
				r="13.0"
				fill="url(#sm5_radial_{theme?.title ?? seed})"
				fill-opacity=".6"
				transform="rotate(-19.6 693 -90)"
			/>
		</g>

		<g class="lg">
			<circle cx="84.4" cy="128.8" r="57.2" fill="url(#lg1_radial_{theme?.title ?? seed})" />
			<circle cx="84.4" cy="128.8" r="57.2" fill="url(#lg2_radial_{theme?.title ?? seed})" fill-opacity=".8" />
		</g>
	</g>

	<defs>
		<radialGradient
			id="sm1_radial_{theme?.title ?? seed}"
			cx={!reveal ? center : 0}
			cy={!reveal ? center : 0.0}
			r="1"
			class="sm1_radial_{theme?.title ?? seed}_454"
			gradientTransform="matrix(-10.13396 26.39988 -26.40007 -10.13404 89.7 8.3)"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color={c.sm1} stop-opacity="0" />
			<!-- <stop offset="1" stop-color={c.shadow} /> -->
			<stop offset="1" stop-color={c.shadow} />
		</radialGradient>

		<radialGradient
			id="sm2_radial_{theme?.title ?? seed}"
			cx={!reveal ? center : 0}
			cy={!reveal ? center : 0.0}
			r="1"
			class="sm2_radial_{theme?.title ?? seed}_454"
			gradientTransform="rotate(111 12 11.4) scale(39.3112 39.3113)"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color={c.sm2} stop-opacity="0" />
			<!-- <stop offset="1" stop-color={c.shadow} /> -->
			<stop offset="1" stop-color={c.shadow} />
		</radialGradient>

		<radialGradient
			id="sm3_radial_{theme?.title ?? seed}"
			cx={!reveal ? center : 0}
			cy={!reveal ? center : 0.0}
			r="1"
			class="sm3_radial_{theme?.title ?? seed}_454"
			gradientTransform="rotate(111 69.4 124.6) scale(54.0183)"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color={c.sm3} stop-opacity="0" />
			<!-- <stop offset="1" stop-color={c.shadow} /> -->
			<stop offset="1" stop-color={c.shadow} />
		</radialGradient>

		<radialGradient
			id="sm4_radial_{theme?.title ?? seed}"
			cx={!reveal ? center : 0}
			cy={!reveal ? center : 0.0}
			r="1"
			class="sm4_radial_{theme?.title ?? seed}_454"
			gradientTransform="rotate(111 11.8 11.2) scale(38.5218 38.5219)"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color={c.sm4} stop-opacity="0" />
			<!-- <stop offset="1" stop-color={c.shadow} /> -->
			<stop offset="1" stop-color={c.shadow} />
		</radialGradient>

		<radialGradient
			id="sm5_radial_{theme?.title ?? seed}"
			cx={!reveal ? center : 0}
			cy={!reveal ? center : 0.0}
			r="1"
			class="sm5_radial_{theme?.title ?? seed}_454"
			gradientTransform="matrix(-8.903 23.19313 -23.19322 -8.90304 17 2.7)"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color={c.sm5} stop-opacity="0" />
			<!-- <stop offset="1" stop-color={c.shadow} /> -->
			<stop offset="1" stop-color={c.shadow} />
		</radialGradient>

		<radialGradient
			id="lg1_radial_{theme?.title ?? seed}"
			cx="0"
			cy="0"
			r="1"
			class="lg1_radial_{theme?.title ?? seed}_454"
			gradientTransform="rotate(104.2 20.2 73.4) scale(177.217)"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color={c.lg1.a} />
			<stop offset="1" stop-color={c.lg1.b} />
		</radialGradient>

		<radialGradient
			id="lg2_radial_{theme?.title ?? seed}"
			cx="0"
			cy="0"
			r="1"
			class="lg2_radial_{theme?.title ?? seed}_454"
			gradientTransform="rotate(123 42.4 75.1) scale(125.528)"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color={c.lg2} stop-opacity="0" />
			<!-- <stop offset="1" stop-color={c.shadow} /> -->
			<stop offset="1" stop-color={c.shadow} />
		</radialGradient>
	</defs>
</svg>

<style lang="scss">
	svg {
		background-color: transparent;
		// background-color: var(--bg-a);
		// outline: 0.5px solid color-mix(in oklch, var(--bg-b), var(--bg-c));
		// border-radius: 50%;
		// border-radius: var(--radius-sm);
		// border-top-left-radius: 0;
		// border-top-right-radius: 0;
		// z-index: -1;
		// transform: translateY(-100%) scale(1.5);
		// scale: 1.5;
		// opacity: 0;
		// padding: 0.25rem;

		animation: fly-in 0.15s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;

		&.hide {
			animation: fly-out-lg 0.15s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
		}

		&:has(.reveal) {
			animation: fly-in 0.15s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
			// background-color: var(--bg-a);
		}
	}

	@keyframes fly-in {
		to {
			transform: translateY(0) scale(1.5);
			opacity: 1;
		}
	}

	@keyframes fly-out-lg {
		from {
			transform: translateY(0) scale(1.5);
			opacity: 1;
		}
		to {
			transform: translateY(-100%) scale(1.5);
			opacity: 0;
		}
	}

	svg {
		position: relative;
		backface-visibility: hidden;
		overflow: visible;
		transform: scale(1.5);
	}

	g:not(.lg, .gooey-icon-gradient) {
		// all: unset;
		transform-origin: center;
		transform: scale(0);
	}
	.reveal g:not(.lg, .gooey-icon-gradient) {
		transform: scale(1);
	}

	g,
	circle,
	radialGradient {
		transition: 0.4s cubic-bezier(0.05, 1, 0.16, 0.99);
	}
</style>
