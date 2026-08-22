/**
 * The DOM that the Labs demo hands to `folder.addElement()`.
 *
 * Every widget here is plain DOM built by hand -- no framework, no gooey internals -- because
 * that's the whole point of `addElement`: a folder row can hold anything you can build.
 *
 * Two shapes are on display:
 *
 * - a **mount function** `(container) => cleanup`, for content that owns a timer, an animation
 *   frame, or a listener.  The returned cleanup runs when the input is replaced via `set()` or
 *   disposed -- that contract is what the {@link Ledger} panel visualizes.
 * - a **bare element**, for content with nothing to tear down.
 */

import type { ElementContent, WebMCPHandle } from '../../../../../src/index'
import type { Scene } from './scene'

/** A mount function, spelled out for readability. */
export type Mount = (container: HTMLElement) => () => void

//· Ledger ····························································································¬

export interface LedgerEntry {
	id: number
	label: string
	kind: 'mount' | 'cleanup'
	at: number
}

const LEDGER_LIMIT = 5

/**
 * Counts mounts and cleanups so the demo can *show* the `addElement` lifecycle contract instead
 * of asserting it in a comment.  Swap the content with `set()` and the counts stay matched.
 */
export class Ledger {
	entries: LedgerEntry[] = []
	mounts = 0
	cleanups = 0

	#id = 0
	#subscribers = new Set<(ledger: Ledger) => void>()

	/** Records a mount and returns the matching cleanup recorder. */
	track(label: string, cleanup?: () => void): () => void {
		this.mounts++
		this.#push(label, 'mount')

		return () => {
			cleanup?.()
			this.cleanups++
			this.#push(label, 'cleanup')
		}
	}

	subscribe(fn: (ledger: Ledger) => void): () => void {
		this.#subscribers.add(fn)
		fn(this)
		return () => this.#subscribers.delete(fn)
	}

	#push(label: string, kind: LedgerEntry['kind']): void {
		this.entries.unshift({ id: this.#id++, label, kind, at: Date.now() })
		if (this.entries.length > LEDGER_LIMIT) this.entries.length = LEDGER_LIMIT
		for (const fn of this.#subscribers) fn(this)
	}
}
//⌟

//· DOM helpers ·······················································································¬

function el<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	className?: string,
	text?: string,
): HTMLElementTagNameMap[K] {
	const node = document.createElement(tag)
	if (className) node.className = className
	if (text !== undefined) node.textContent = text
	return node
}

const STYLE_ID = 'gooey-labs-widgets'

/**
 * The widgets live inside the gooey, which mounts to `<body>` -- outside any component's scoped
 * CSS -- so they bring their own stylesheet.  They inherit the gooey's theme variables.
 */
export function injectWidgetStyles(): void {
	if (document.getElementById(STYLE_ID)) return

	const style = el('style')
	style.id = STYLE_ID
	style.textContent = /*css*/ `
		.labs {
			display: flex;
			flex-direction: column;
			gap: 0.35rem;
			width: 100%;
			padding: 0.35rem 0.1rem;
			font-family: var(--gooey-font-family);
			font-size: 0.7rem;
			color: var(--gooey-fg-c);
			line-height: 1.35;
		}
		.labs-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 0.5rem;
		}
		.labs-title {
			font-size: 0.62rem;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--gooey-fg-d);
		}
		.labs-mono {
			font-family: var(--gooey-font-family-mono, ui-monospace, monospace);
			font-size: 0.62rem;
			overflow-wrap: anywhere;
		}
		.labs-pill {
			padding: 0.1rem 0.4rem;
			border-radius: var(--gooey-radius-sm, 4px);
			background: var(--gooey-bg-c);
			color: var(--gooey-fg-b);
			font-size: 0.6rem;
			white-space: nowrap;
		}
		.labs-pill.on { background: color-mix(in srgb, limegreen 30%, var(--gooey-bg-c)); }
		.labs-pill.off { background: color-mix(in srgb, tomato 30%, var(--gooey-bg-c)); }

		.labs-card {
			padding: 0.4rem 0.5rem;
			border-radius: var(--gooey-radius-sm, 4px);
			background: var(--gooey-bg-b);
			box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--gooey-fg-e) 25%, transparent);
		}
		.labs-empty { color: var(--gooey-fg-d); font-style: italic; }

		.labs-sparkline {
			display: block;
			width: 100%;
			height: 42px;
			border-radius: var(--gooey-radius-sm, 4px);
			background: var(--gooey-bg-b);
		}

		.labs-swatches { display: flex; gap: 0.25rem; width: 100%; }
		.labs-swatch {
			flex: 1;
			height: 26px;
			border: none;
			border-radius: var(--gooey-radius-sm, 4px);
			cursor: pointer;
			transition: transform 0.15s ease, filter 0.15s ease;
		}
		.labs-swatch:hover { transform: translateY(-2px); filter: brightness(1.15); }
		.labs-swatch:active { transform: translateY(0); }

		.labs-goo {
			position: relative;
			width: 100%;
			height: 64px;
			overflow: hidden;
			border-radius: var(--gooey-radius-sm, 4px);
			/* The metaball trick needs an opaque backdrop for contrast() to bite. */
			background: #0b0b11;
			filter: contrast(11) blur(0.3px);
		}
		.labs-goo-blob {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 34px;
			height: 34px;
			margin: -17px 0 0 -17px;
			border-radius: 50%;
			filter: blur(7px);
			animation: labs-goo-drift 4s ease-in-out infinite alternate;
		}
		@keyframes labs-goo-drift {
			from { translate: calc(-1 * var(--labs-x)) var(--labs-y); scale: 0.7; }
			to   { translate: var(--labs-x) calc(-1 * var(--labs-y)); scale: 1.25; }
		}
		@media (prefers-reduced-motion: reduce) {
			.labs-goo-blob { animation: none; }
		}

		.labs-list { display: flex; flex-direction: column; gap: 0.15rem; }
		.labs-list.scroll { max-height: 8.5rem; overflow-y: auto; }
		.labs-entry { display: flex; gap: 0.4rem; align-items: baseline; }
		.labs-entry .glyph { width: 0.8rem; text-align: center; }
		.labs-entry.mount .glyph { color: mediumspringgreen; }
		.labs-entry.cleanup .glyph { color: tomato; }
	`
	document.head.appendChild(style)
}
//⌟

//· addElement content ················································································¬

/**
 * A live readout of the lead blob's altitude, redrawn every animation frame.  The mount function
 * owns the rAF loop, so its cleanup has to cancel it -- exactly the case `addElement`'s cleanup
 * contract exists for.
 */
export function sparkline(scene: Scene, ledger: Ledger): Mount {
	return container => {
		const canvas = el('canvas', 'labs-sparkline')
		const ctx = canvas.getContext('2d')
		container.appendChild(canvas)

		let frame = 0

		const draw = () => {
			frame = requestAnimationFrame(draw)
			if (!ctx) return

			const dpr = Math.min(globalThis.devicePixelRatio || 1, 2)
			const { width, height } = canvas.getBoundingClientRect()
			if (!width || !height) return

			canvas.width = Math.round(width * dpr)
			canvas.height = Math.round(height * dpr)
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
			ctx.clearRect(0, 0, width, height)

			const samples = scene.samples
			if (samples.length < 2) return

			// Samples are already normalized 0..1, so the scale is fixed -- rescaling to the
			// window's own peak would make a flat run look like a mountain range.
			const step = width / (samples.length - 1)
			const hue = scene.params.hue

			// A midline, so an idle stretch still reads as a chart rather than an empty box.
			ctx.strokeStyle = `hsl(${hue} 30% 60% / 0.2)`
			ctx.lineWidth = 1
			ctx.beginPath()
			ctx.moveTo(0, height / 2)
			ctx.lineTo(width, height / 2)
			ctx.stroke()

			ctx.beginPath()
			ctx.moveTo(0, height)
			for (let i = 0; i < samples.length; i++) {
				ctx.lineTo(i * step, height - samples[i] * (height - 6) - 3)
			}

			ctx.strokeStyle = `hsl(${hue} 90% 65%)`
			ctx.lineWidth = 1.5
			ctx.stroke()

			ctx.lineTo(width, height)
			ctx.closePath()
			ctx.fillStyle = `hsl(${hue} 90% 65% / 0.18)`
			ctx.fill()
		}

		draw()

		return ledger.track('sparkline', () => {
			cancelAnimationFrame(frame)
			container.replaceChildren()
		})
	}
}

/**
 * The other content shape: a bare element, handed over as-is.  Nothing to tear down, so no mount
 * function is needed -- `InputElement` clears the container for you.
 */
export function swatches(hues: number[], onPick: (hue: number) => void): ElementContent {
	const row = el('div', 'labs labs-swatches')

	for (const hue of hues) {
		const button = el('button', 'labs-swatch')
		button.type = 'button'
		button.style.background = `linear-gradient(160deg, hsl(${hue} 90% 62%), hsl(${hue + 40} 85% 45%))`
		button.title = `hue ${hue}`
		button.addEventListener('click', () => onPick(hue))
		row.appendChild(button)
	}

	return row
}

/** A CSS-only metaball blob, for the `set()` swap to land on. */
export function goo(ledger: Ledger, hue: number): Mount {
	return container => {
		const stage = el('div', 'labs-goo')

		const offsets = [
			[18, 10],
			[-22, 14],
			[6, -16],
		]

		for (let i = 0; i < offsets.length; i++) {
			const blob = el('div', 'labs-goo-blob')
			blob.style.setProperty('--labs-x', `${offsets[i][0]}px`)
			blob.style.setProperty('--labs-y', `${offsets[i][1]}px`)
			blob.style.background = `hsl(${hue + i * 28} 90% 60%)`
			blob.style.animationDelay = `${i * -0.9}s`
			stage.appendChild(blob)
		}

		container.appendChild(stage)

		return ledger.track('goo', () => container.replaceChildren())
	}
}

/**
 * The lifecycle receipt: every mount and cleanup this demo has run, newest first.  If the counts
 * ever drift apart, `addElement` is leaking.
 */
export function ledgerCard(ledger: Ledger): Mount {
	return container => {
		const root = el('div', 'labs')
		const header = el('div', 'labs-row')
		const label = el('span', 'labs-title', 'lifecycle')
		const counts = el('span', 'labs-pill')
		const list = el('div', 'labs-list')

		header.append(label, counts)
		root.append(header, list)
		container.appendChild(root)

		const unsubscribe = ledger.subscribe(l => {
			counts.textContent = `${l.mounts} up · ${l.cleanups} down · ${l.mounts - l.cleanups} live`

			list.replaceChildren(
				...l.entries.map(entry => {
					const row = el('div', `labs-entry ${entry.kind}`)
					row.append(
						el('span', 'glyph', entry.kind === 'mount' ? '▲' : '▼'),
						el('span', 'labs-mono', `${entry.kind} ${entry.label}`),
					)
					return row
				}),
			)
		})

		return ledger.track('ledger', unsubscribe)
	}
}

/**
 * Every localStorage key the gooey owns, polled live.  Reload the page after dragging the panel:
 * the keys are identical, which is the whole point of `WindowManager`'s `storageId` -- before it,
 * the `wm::` segment was a fresh nanoid on every load and the saved layout was orphaned.
 */
export function storageCard(prefix: string, ledger: Ledger): Mount {
	return container => {
		const root = el('div', 'labs')
		const header = el('div', 'labs-row')
		const count = el('span', 'labs-pill')
		const list = el('div', 'labs-list scroll')

		header.append(el('span', 'labs-title', 'localStorage'), count)
		root.append(header, list)
		container.appendChild(root)

		const render = () => {
			const keys: string[] = []
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i)
				if (key?.startsWith(prefix)) keys.push(key)
			}
			keys.sort()

			count.textContent = `${keys.length} key${keys.length === 1 ? '' : 's'}`

			if (!keys.length) {
				const empty = el('div', 'labs-mono labs-empty', 'nothing saved yet — drag me')
				list.replaceChildren(empty)
				return
			}

			list.replaceChildren(
				...keys.map(key => {
					const row = el('div', 'labs-card labs-mono')
					row.appendChild(el('div', undefined, key.slice(prefix.length) || key))

					// Only the window-manager keys get their value shown -- those are the ones
					// `storageId` keeps stable, and the rest are long JSON blobs.
					if (key.includes('::wm::')) {
						row.appendChild(el('div', 'labs-empty', truncate(localStorage.getItem(key) ?? '')))
					}

					return row
				}),
			)
		}

		render()
		const interval = setInterval(render, 500)

		return ledger.track('storage', () => {
			clearInterval(interval)
			container.replaceChildren()
		})
	}
}

/**
 * Whether this browser exposes `document.modelContext`, and which tools the gooey registered on
 * it.  WebMCP is a W3C draft behind a Chrome origin trial, so most visitors land on the graceful
 * fallback -- `registerWebMCP` returns a disabled handle rather than throwing.
 */
export function mcpCard(getHandle: () => WebMCPHandle, ledger: Ledger): Mount {
	return container => {
		const root = el('div', 'labs')
		const header = el('div', 'labs-row')
		const status = el('span', 'labs-pill')
		const note = el('div', 'labs-mono labs-empty')
		const list = el('div', 'labs-list')

		header.append(el('span', 'labs-title', 'document.modelContext'), status)
		root.append(header, note, list)
		container.appendChild(root)

		const render = () => {
			const handle = getHandle()
			const present = typeof (document as Document & { modelContext?: unknown }).modelContext === 'object'

			status.textContent = present ? 'present' : 'absent'
			status.classList.toggle('on', present)
			status.classList.toggle('off', !present)

			note.textContent = handle.enabled
				? `${handle.tools.length} tools registered — an in-browser agent can drive this panel.`
				: 'No model context here, so nothing was registered. registerWebMCP returned a disabled handle instead of throwing; the tool names below are what it would have published.'

			list.replaceChildren(
				...(handle.tools.length ? handle.tools : PREVIEW_TOOLS).map(name => {
					const row = el('div', 'labs-card labs-mono', name)
					if (!handle.enabled) row.style.opacity = '0.6'
					return row
				}),
			)
		}

		render()
		// Cheap: re-render on focus in case the origin trial token landed after first paint.
		globalThis.addEventListener('focus', render)

		return ledger.track('webmcp', () => {
			globalThis.removeEventListener('focus', render)
			container.replaceChildren()
		})
	}
}

/** Shown when WebMCP is unavailable, so the panel still teaches the tool-naming scheme. */
const PREVIEW_TOOLS = [
	'labs.state',
	'labs.scene.count',
	'labs.scene.speed',
	'labs.scene.radius',
	'labs.scene.hue',
	'labs.scene.glow',
]

function truncate(value: string, max = 48): string {
	return value.length > max ? value.slice(0, max) + '…' : value
}
//⌟
