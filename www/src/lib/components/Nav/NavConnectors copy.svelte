<script lang="ts">
	import { mapRange } from '../../../../../src/shared/mapRange'
	import { clamp } from '../../../../../src/shared/clamp'
	import { device } from '$lib/device.svelte'

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
		svg: {
			line1: SVGLineElement | null
			line2: SVGLineElement | null
		}
	}

	let nav = $state<HTMLElement>()
	let sidebar = $state<HTMLElement>()
	let h2s = $state<HTMLElement[]>([])
	let connectorSvg = $state<SVGElement>()
	let connectors = $state<Connector[]>([])

	$effect(() => {
		if (device.mobile) return

		nav ??= document.querySelector('nav')!
		assert(nav, 'nav')

		sidebar ??= document.querySelector('.sidebar-background') as HTMLElement
		assert(sidebar, 'sidebar')

		if (!h2s.length) {
			h2s = Array.from(document.querySelectorAll('h2')).filter(h2 => !!h2.id)
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

			i++
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
			svg: {
				line1: null,
				line2: null,
			},
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

		const liY = liRect.top + liRect.height / 2

		const positions = {
			start: {
				x: liRect.left + _.li.textContent!.length * 16,
				y: liY + 1,
			},
			mid: {
				x: sidebar.offsetWidth,
				y: liY,
			},
			end: {
				// x: h2Rect.left + 3.5,
				// y: h2Rect.top + h2Rect.height / 2 + 7.5,
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

	let timeout: ReturnType<typeof setTimeout>
	function debounceUpdateConnectors(_?: any) {
		clearTimeout(timeout)
		timeout = setTimeout(() => {
			updateConnectors()
		}, 1)
	}

	$effect(() => {
		connectors
		debounceUpdateConnectors(device.scrollY)
		return () => {
			clearTimeout(timeout)
		}
	})

	function intensity(n: number, max = 100) {
		return clamp(mapRange(n, 0, globalThis.window?.innerHeight ?? 0, max, 0), 0, max)
	}

	function opacity(c: Connector, _?: any) {
		const length = c.svg?.line2?.getTotalLength() ?? 10
		const n = intensity(length, 1)
		return n
	}
</script>

<div class="nav-connectors">
	<svg class="nav-connector-svg" width="100%" height="100%" bind:this={connectorSvg}>
		{#each connectors as c}
			{@const o = +opacity(c, device.scrollY).toFixed(2)}
			{@const offset = 1 - o}
			<defs>
				<linearGradient id="nc-g1-{c.id}" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stop-color="var(--theme-a)" stop-opacity={o} />
					<stop {offset} stop-color="var(--bg-c)" stop-opacity={o} />
				</linearGradient>
				<linearGradient id="nc-g2-{c.id}" x1="1" y1="0" x2="0" y2="0">
					<stop {offset} stop-color="var(--bg-b)" stop-opacity={o} />
					<stop offset={offset + 0.2} stop-color="var(--bg-c)" stop-opacity={o} />
					<stop offset={offset + 1} stop-color="var(--theme-a)" stop-opacity={o} />
				</linearGradient>
			</defs>

			<text
				class="debug-text"
				style="opacity: 0.2"
				x={Math.round(c.svg.line1?.getBoundingClientRect().left ?? 0)}
				y={Math.round(c.svg.line1?.getBoundingClientRect().top ?? 0)}
			>
				{o}
			</text>

			<line
				bind:this={c.svg.line1}
				x1={c.positions.start.x}
				y1={c.positions.start.y}
				x2={c.positions.mid.x}
				y2={c.positions.mid.y}
				stroke-width=".1rem"
				stroke="url(#nc-g1-{c.id})"
			/>
			<line
				bind:this={c.svg.line2}
				x1={c.positions.mid.x}
				y1={c.positions.mid.y}
				x2={c.positions.end.x}
				y2={c.positions.end.y}
				stroke-width=".1rem"
				stroke="url(#nc-g2-{c.id})"
			/>

			<line
				x1={c.positions.end.x}
				y1={c.positions.end.y}
				x2={c.positions.end.x + 5}
				y2={c.positions.end.y}
				stroke-width=".1rem"
				stroke="color-mix(in hsl, var(--bg-c), var(--theme-a) {o}%)"
				opacity={o / 2}
			/>
		{/each}
	</svg>
</div>

<style>
	.nav-connectors {
		position: fixed;
		inset: 0;
		width: 100dvw;
		height: 100dvh;
		pointer-events: none;
		user-select: none;

		opacity: 0;

		outline: 1px solid red;
		outline-offset: -1px;

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
		background-color: var(--bg-c);
	}

	:global(.nav-connector.active) {
		background-color: var(--theme-a);
	}
</style>
