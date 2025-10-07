<script lang="ts">
	import { mapRange } from '../../../../../src/shared/mapRange'
	import { clamp } from '../../../../../src/shared/clamp'
	import { Gooey } from '../../../../../src'

	import { device } from '$lib/device.svelte'
	import { onMount } from 'svelte'
	import { themer } from '$lib/themer/themer.svelte'

	interface Connector {
		id: string
		h2: HTMLElement
		li: HTMLElement
		active: boolean
		positions: {
			start: {
				x: number
				y: number
			}
			mid: {
				x: number
				y: number
			}
			end: {
				x: number
				y: number
			}
		}
		path: SVGPathElement | null
	}

	let nav = $state<HTMLElement>()
	// $inspect(nav, 'nav')
	let sidebar = $state<HTMLElement>()
	// $inspect(sidebar, 'sidebar')
	let h2s = $state<HTMLElement[]>([])
	// $inspect(h2s, 'h2s')
	let connectorSvg = $state<SVGElement>()
	// $inspect(connectorSvg, 'connectorSvg')
	let connectors = $state<Connector[]>([])
	// $inspect(connectors, 'connectors')

	$effect(() => {
		if (device.mobile) return

		nav ??= document.querySelector('nav')!
		assert(nav, 'nav')

		sidebar ??= document.querySelector('.sidebar-background') as HTMLElement
		assert(sidebar, 'sidebar')

		if (!h2s.length) {
			const _h2s = Array.from(document.querySelectorAll('h2'))
			if (!_h2s.length) return
			h2s = _h2s
		}

		for (let i = 0; i < h2s.length; i++) {
			assert(nav, 'nav')

			const h2 = h2s[i]
			const id = h2.id

			const li = nav.querySelector(`[href$="#${id}"]`) as HTMLElement
			assert(li, 'li')

			if (!connectors[i]) {
				const c = createConnector(h2, li)
				assert(c, 'c')
				connectors.push(c)
			}
		}
	})

	function assert<T extends unknown = unknown>(
		thing?: T,
		msg = '',
		cb = () => {
			throw new Error('ASSERTION FAILED: ' + msg)
		},
	): asserts thing is Exclude<T, undefined | null> {
		if (thing === null || typeof thing === 'undefined') {
			cb()
		}
	}

	function createConnector(h2: HTMLElement, li: HTMLElement): Connector {
		assert(sidebar, 'sidebar')
		assert(nav, 'nav')

		const connector: Connector = {
			id: h2.id,
			h2,
			li,
			active: false,
			positions: {} as any,
			path: null,
		}

		// prettier-ignore
		const positions = getPositions(connector) ?? {start:{x:0,y:0,},mid:{x:0,y:0,},end:{x:0,y:0}}
		assert(positions, 'positions')
		connector.positions = positions

		return connector
	}

	function getPositions(_: Connector) {
		_.active = _.li.classList.contains('active')

		const liRect = _.li.getBoundingClientRect()
		const h2Rect = _.h2.getBoundingClientRect()

		assert(nav, 'nav')
		assert(sidebar, 'sidebar')

		// const liY = liRect.top + liRect.height / 2
		const liY = liRect.top + liRect.height - 8

		const positions = {
			start: {
				// x: liRect.left + _.li.textContent!.length * 16,
				x: liRect.left,
				y: liY + 1,
			},
			mid: {
				x: sidebar.offsetWidth,
				y: liY,
			},
			end: {
				x: h2Rect.left - 2,
				y: h2Rect.top + h2Rect.height / 2 + 8,
			},
		} satisfies Connector['positions']

		for (const key in positions) {
			for (const prop in positions[key as keyof typeof positions]) {
				// @ts-expect-error - ok buddy
				positions[key][prop] = Math.round(positions[key][prop])
			}
		}

		return positions
	}

	function updateConnectors(_ = 0) {
		if (device.mobile) return
		if (!connectors.length) return

		connectors.forEach(connector => {
			connector.active = connector.li.classList.contains('active')
			const positions = getPositions(connector)
			connector.positions = positions
		})
	}

	let frame = 0
	function debounceUpdateConnectors(_?: any) {
		cancelAnimationFrame(frame)
		frame = requestAnimationFrame(() => {
			updateConnectors()
		})
	}

	$effect(() => {
		connectors
		debounceUpdateConnectors([device.scrollY, device.width])
		return () => {
			cancelAnimationFrame(frame)
		}
	})

	function intensity(n: number, max = 100) {
		return clamp(mapRange(n, 0, _$.max, max, 0), 0, max)
	}

	function opacity(c: Connector, _?: any) {
		const length = Math.abs(c.positions.end.y - c.positions.start.y)
		const n = intensity(length, 1)
		return n
	}

	const _$ = $state({
		len: 20,
		debug: 1.25,
		max: 1500,
	})
	let gooeyContainer = $state<HTMLElement>()
	onMount(() => {
		const gooey = new Gooey({
			title: 'Nav Connectors',
			container: gooeyContainer,
			themeMode: 'system',
			storage: {
				key: 'nav-connectors-gooey',
				position: true,
			},
		})
		const mms = { min: 0, max: 2, step: 0.01 }
		gooey.bind(_$, 'len')
		gooey.bind(_$, 'debug', mms)
		gooey.bind(_$, 'max')
		return gooey.dispose
	})
</script>

<div class="gooey-container" bind:this={gooeyContainer}></div>

<div class="nav-connectors">
	<svg class="nav-connector-svg" width="100%" height="100%" bind:this={connectorSvg}>
		{#each connectors as c}
			{@const { start, mid, end } = c.positions}
			{@const len = c.path?.getTotalLength() ?? 1}
			{@const op = clamp(opacity(c), 0.01, 0.2)}
			{@const o1 = clamp(((mid.x - start.x) / len) * _$.debug, 0, 1)}
			{@const relativeLeft = (mid.x - start.x) / len / _$.len}

			<defs>
				<linearGradient
					id="nc-g-{c.id}"
					x1={start.x}
					y1={start.y}
					x2={end.x}
					y2={end.y}
					gradientUnits="userSpaceOnUse"
				>
					<stop offset={relativeLeft} stop-color="transparent" stop-opacity={op}> </stop>
					<stop offset={relativeLeft + o1} stop-color={themer.colors['--theme-a']} stop-opacity={op}> </stop>
					<stop offset={1} stop-color="transparent" stop-opacity={op} />
				</linearGradient>
			</defs>

			<path
				fill="none"
				bind:this={c.path}
				stroke="url(#nc-g-{c.id})"
				stroke-width=".1rem"
				d="
						M {start.x} {start.y}
						L {mid.x} {mid.y}
						L {end.x} {end.y}
						L {end.x + 5} {end.y}
					"
			/>

			<!-- <text
				class="debug-text"
				style="opacity: 0.2"
				x={Math.round(c.positions.start.x)}
				y={Math.round(c.positions.start.y)}
			>
				op: {op.toFixed(2)}
				o1: {o1.toFixed(2)}
			</text> -->
		{/each}
	</svg>
</div>

<style>
	.gooey-container {
		position: fixed;
		inset: 0;
		width: 100dvw;
		height: 100dvh;
		pointer-events: none;
		:global(*) {
			pointer-events: all;
		}
	}

	.nav-connectors {
		position: fixed;
		inset: 0;
		width: 100dvw;
		height: 100dvh;
		pointer-events: none;
		user-select: none;

		opacity: 0;

		animation: fade 0.2s cubic-bezier(0, 1, 0, 1) 0.5s forwards;
	}

	@keyframes fade {
		from {
			opacity: 0;
			transform: translateX(-4rem);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	:global(.nav-connector) {
		position: absolute;
		height: 0.1rem;
		width: 100%;
	}

	:global(.nav-connector.active) {
		background-color: var(--theme-a);
	}
</style>
