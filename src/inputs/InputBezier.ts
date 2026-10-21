import type { ElementMap, InputOptions, InputPreset } from './Input'
import type { LabeledOption } from '../controllers/Select'
import type { State } from '../shared/state'
import type { Folder } from '../Folder'

import { NumberController } from '../controllers/NumberController'
import { cubicBezier } from '../shared/cubicBezier'
import { Select } from '../controllers/Select'
import { Logger } from '../shared/logger'
import { create } from '../shared/create'
import { state } from '../shared/state'
import { Input } from './Input'

//· Types ··············································································¬

/**
 * The control points of a cubic bézier easing curve, `[x1, y1, x2, y2]` -- the four arguments of
 * CSS `cubic-bezier()`.  The curve runs from `(0, 0)` to `(1, 1)`.
 */
export type BezierValue = [x1: number, y1: number, x2: number, y2: number]

/**
 * The CSS easing keywords that are cubic béziers.
 */
export type BezierKeyword = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'

/**
 * A CSS easing string an {@link InputBezier} accepts in place of a {@link BezierValue}:
 * `'cubic-bezier(0.25, 0.1, 0.25, 1)'`, or one of the {@link BezierKeyword}s.
 */
export type BezierString = `cubic-bezier(${string})` | BezierKeyword

export type BezierInputOptions = InputOptions<BezierValue> & {
	readonly __type?: 'BezierInputOptions'
	/**
	 * The named curves in the input's dropdown.  Picking one sets the curve; hovering one in the
	 * open dropdown previews it.  `false` hides the dropdown.
	 * @default {@link BEZIER_EASINGS}
	 */
	easings?: Record<string, BezierValue> | false
	/**
	 * The lowest `y` a control point can be dragged to.  Below `0` makes room for anticipation
	 * curves.  Only dragging is clamped -- `set` takes any `y`, as CSS does.
	 * @default -0.5
	 */
	yMin?: number
	/**
	 * The highest `y` a control point can be dragged to.  Above `1` makes room for overshoot
	 * ("back") curves.
	 * @default 1.5
	 */
	yMax?: number
	/**
	 * The increment a drag snaps to, and the step of the number fields.  Hold `shift` while
	 * dragging a control point to snap to `0.05`.
	 * @default 0.01
	 */
	step?: number
	/**
	 * Whether a dot runs along the curve after each change, to show how the easing feels.
	 * @default true
	 */
	preview?: boolean
	/**
	 * How long one `preview` run lasts, in milliseconds.
	 * @default 750
	 */
	previewDuration?: number
}

/**
 * The curves offered by default in an {@link InputBezier}'s dropdown: the CSS keywords, plus a few
 * common out-curves.
 */
export const BEZIER_EASINGS = Object.freeze({
	linear: [0, 0, 1, 1],
	ease: [0.25, 0.1, 0.25, 1],
	'ease-in': [0.42, 0, 1, 1],
	'ease-out': [0, 0, 0.58, 1],
	'ease-in-out': [0.42, 0, 0.58, 1],
	'out-expo': [0.16, 1, 0.3, 1],
	'out-quint': [0.22, 1, 0.36, 1],
	'out-back': [0.34, 1.56, 0.64, 1],
} as const satisfies Record<string, Readonly<BezierValue>>)

export const BEZIER_INPUT_DEFAULTS = {
	__type: 'BezierInputOptions' as const,
	value: [0.25, 0.1, 0.25, 1],
	yMin: -0.5,
	yMax: 1.5,
	step: 0.01,
	preview: true,
	previewDuration: 750,
} as const

export interface BezierInputElements extends ElementMap<SVGElement> {
	container: HTMLDivElement
	/** The named-easing dropdown's container, empty and hidden when `easings` is `false`. */
	select: HTMLDivElement
	graph: {
		svg: SVGSVGElement
		frame: SVGRectElement
		diagonal: SVGLineElement
		arm1: SVGLineElement
		arm2: SVGLineElement
		curve: SVGPathElement
		start: SVGCircleElement
		end: SVGCircleElement
		handle1: SVGCircleElement
		handle2: SVGCircleElement
		dot: SVGCircleElement
		railDot: SVGCircleElement
	}
	fields: {
		container: HTMLDivElement
		x1: HTMLInputElement
		y1: HTMLInputElement
		x2: HTMLInputElement
		y2: HTMLInputElement
	}
}
//⌟

//· Helpers ············································································¬

const KEYWORDS: Record<BezierKeyword, BezierValue> = {
	linear: [0, 0, 1, 1],
	ease: [0.25, 0.1, 0.25, 1],
	'ease-in': [0.42, 0, 1, 1],
	'ease-out': [0, 0, 0.58, 1],
	'ease-in-out': [0.42, 0, 0.58, 1],
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/**
 * Normalizes a {@link BezierValue} or {@link BezierString} into a fresh `[x1, y1, x2, y2]` array,
 * clamping `x1` and `x2` into `0..1`.  Throws on anything else.
 */
export function toBezier(v: unknown): BezierValue {
	let nums: unknown[] | undefined

	if (Array.isArray(v)) {
		nums = v
	} else if (typeof v === 'string') {
		const s = v.trim().toLowerCase()
		if (Object.hasOwn(KEYWORDS, s)) {
			nums = KEYWORDS[s as BezierKeyword]
		} else {
			const match = /^cubic-bezier\(([^)]*)\)$/.exec(s)
			if (match) nums = match[1].split(',').map(n => (n.trim() === '' ? NaN : Number(n)))
		}
	}

	if (
		!nums ||
		nums.length !== 4 ||
		!nums.every(n => typeof n === 'number' && Number.isFinite(n))
	) {
		throw new Error(
			`InputBezier received an invalid curve: ${JSON.stringify(v)} -- expected [x1, y1, x2, y2] or a 'cubic-bezier(...)' string.`,
		)
	}

	const [x1, y1, x2, y2] = nums as number[]
	return [clamp(x1, 0, 1), y1, clamp(x2, 0, 1), y2]
}

/**
 * Renders a {@link BezierValue} as a CSS `cubic-bezier()` string.
 */
export function bezierToString(v: Readonly<BezierValue>): `cubic-bezier(${string})` {
	return `cubic-bezier(${v.map(n => +n.toFixed(4)).join(', ')})`
}

function bezierEqual(a: ArrayLike<number> | undefined, b: ArrayLike<number> | undefined) {
	if (!a || !b) return false
	for (let i = 0; i < 4; i++) {
		if (Math.abs(a[i] - b[i]) > 1e-9) return false
	}
	return true
}

const SVG_NS = 'http://www.w3.org/2000/svg'

function svg<K extends keyof SVGElementTagNameMap>(
	tag: K,
	parent: Element,
	classes: string[] = [],
	attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
	const el = document.createElementNS(SVG_NS, tag)
	if (classes.length) el.classList.add(...classes)
	for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v))
	parent.appendChild(el)
	return el
}

/** A drag within this many pixels of a control point grabs it. */
const GRAB_RADIUS = 16
/** The `x` margin either side of the unit square. */
const VIEW_PAD_X = 0.1
/** The `y` the view always shows below `0` and above `1`. */
const VIEW_PAD_Y = 0.25
//⌟

/**
 * A cubic bézier curve editor: a graph with two draggable control points, a field for each of the
 * four numbers, and a dropdown of named easings.  Its value is `[x1, y1, x2, y2]`, the arguments
 * of CSS `cubic-bezier()`; it also accepts a `'cubic-bezier(...)'` string or a CSS easing keyword.
 *
 * A field bound with {@link Folder.bindBezier|`bindBezier`} keeps the shape it started in -- an
 * array stays an array, a string is written back as a `cubic-bezier()` string.
 *
 * @example
 * ```ts
 * const ease = gooey.addBezier('ease', [0.16, 1, 0.3, 1])
 * ease.on('change', v => (el.style.transitionTimingFunction = bezierToString(v)))
 *
 * const params = { ease: 'cubic-bezier(0.4, 0, 0.2, 1)' }
 * gooey.bindBezier(params, 'ease')
 * ```
 */
export class InputBezier extends Input<BezierValue, BezierInputOptions, BezierInputElements> {
	readonly __type = 'InputBezier' as const
	readonly state: State<BezierValue>
	initialValue: BezierValue

	/** The dropdown of named easings, absent when `easings` is `false`. */
	selectController?: Select<BezierValue>
	/** The four number fields, in `[x1, y1, x2, y2]` order. */
	numberControllers: NumberController[] = []

	#log: Logger
	/** Whether the bound field holds a string, so writes go back as a string. */
	#stringField = false
	/** The value a drag, a field drag, or an open dropdown started from; `null` between them. */
	#gestureFrom: BezierValue | null = null
	#drag: { handle: 1 | 2; pointerId: number; dx: number; dy: number } | null = null
	#size = { width: 0, height: 0 }
	#view = { x0: -VIEW_PAD_X, x1: 1 + VIEW_PAD_X, y0: -VIEW_PAD_Y, y1: 1 + VIEW_PAD_Y }
	#resizeObserver?: ResizeObserver
	#previewFrame = 0

	constructor(options: Partial<BezierInputOptions>, folder: Folder) {
		const opts = Object.assign({}, BEZIER_INPUT_DEFAULTS, options, {
			__type: 'BezierInputOptions' as const,
		}) as BezierInputOptions & { __type: 'BezierInputOptions' }
		super(opts, folder)

		this.#log = new Logger(`InputBezier ${opts.title}`, { fg: 'orchid' })
		this.#log.fn('constructor').debug({ opts, this: this })

		const raw = this.resolveInitialValue(opts)
		this.#stringField = !!opts.binding && typeof raw === 'string'
		this.initialValue = toBezier(raw)
		this.state = state<BezierValue>(toBezier(raw))

		if (opts.binding) {
			const { target, key } = opts.binding
			this._evm.add(
				this.state.subscribe(v => {
					// Leave the field alone when it already says this curve -- a keyword stays a
					// keyword until the curve actually changes.
					if (bezierEqual(this.#read(target[key]), v)) return
					target[key] = this.#stringField ? bezierToString(v as BezierValue) : [...v]
				}),
			)
		}

		this._dirty = () => !bezierEqual(this.state.value as BezierValue, this.initialValue)

		//- Container
		const container = create('div', {
			classes: ['gooey-input-bezier-container'],
			parent: this.elements.content,
		})

		//- Named easings
		const selectEl = create('div', {
			classes: ['gooey-input-bezier-select', 'gooey-input-select-container'],
			parent: container,
		})
		selectEl.hidden = opts.easings === false
		if (opts.easings !== false) {
			const easings = opts.easings ?? BEZIER_EASINGS
			this.selectController = new Select<BezierValue>({
				input: this,
				container: selectEl,
				disabled: false,
				options: Object.entries(easings).map(([label, value]) => ({
					label,
					value: [...value] as BezierValue,
				})),
				selected: this.#labelFor(this.state.value as BezierValue),
				title: this.title,
			})

			// An open dropdown is one gesture: hovering previews each curve without an undo step,
			// and closing commits whatever it landed on.  `close` fires before a click's or a
			// cancel's own selection lands, so the commit waits a microtask for it.
			this.selectController.on('open', () => this.#beginGesture())
			this.selectController.on('close', () => queueMicrotask(() => this.#endGesture()))
			this.selectController.on('change', option => this.set(option.value))
		}

		//- Graph
		const svgEl = svg('svg', container, ['gooey-input-bezier-graph'])
		const graph = {
			svg: svgEl,
			frame: svg('rect', svgEl, ['gooey-input-bezier-frame']),
			diagonal: svg('line', svgEl, ['gooey-input-bezier-diagonal']),
			arm1: svg('line', svgEl, ['gooey-input-bezier-arm']),
			arm2: svg('line', svgEl, ['gooey-input-bezier-arm']),
			curve: svg('path', svgEl, ['gooey-input-bezier-curve']),
			start: svg('circle', svgEl, ['gooey-input-bezier-anchor'], { r: 2.5 }),
			end: svg('circle', svgEl, ['gooey-input-bezier-anchor'], { r: 2.5 }),
			railDot: svg(
				'circle',
				svgEl,
				['gooey-input-bezier-dot', 'gooey-input-bezier-rail-dot'],
				{
					r: 2.5,
				},
			),
			dot: svg('circle', svgEl, ['gooey-input-bezier-dot'], { r: 3 }),
			handle1: svg('circle', svgEl, ['gooey-input-bezier-handle'], { r: 5 }),
			handle2: svg('circle', svgEl, ['gooey-input-bezier-handle'], { r: 5 }),
		}

		//- Fields
		const fieldsContainer = create('div', {
			classes: ['gooey-input-bezier-fields'],
			parent: container,
		})
		const names = ['x1', 'y1', 'x2', 'y2'] as const
		for (const [i, name] of names.entries()) {
			const isX = i % 2 === 0
			const field = new NumberController(this, opts, fieldsContainer)
			field.element.setAttribute('aria-label', name)
			if (isX) {
				field.element.min = '0'
				field.element.max = '1'
			}
			this.numberControllers.push(field)

			this._evm.listen(field.element, 'input', () => {
				const n = field.element.valueAsNumber
				if (!Number.isFinite(n)) return
				const next = [...this.state.value] as BezierValue
				next[i] = isX ? clamp(n, 0, 1) : n
				this.set(next)
			})
			this._evm.listen(field.element, 'dragStart', () => this.#beginGesture())
			this._evm.listen(field.element, 'dragEnd', () => this.#endGesture())
		}
		const [x1, y1, x2, y2] = this.numberControllers.map(c => c.element)

		this.elements.controllers = {
			container,
			select: selectEl,
			graph,
			fields: { container: fieldsContainer, x1, y1, x2, y2 },
		} satisfies BezierInputElements

		//- Dragging
		this._evm.listen(svgEl, 'pointerdown', this.#onPointerDown)
		this._evm.listen(svgEl, 'pointermove', this.#onPointerMove)
		this._evm.listen(svgEl, 'pointerup', this.#onPointerUp)
		this._evm.listen(svgEl, 'pointercancel', this.#onPointerUp)
		// A lost capture means the pointerup may land elsewhere; end the drag here so it can't stick.
		this._evm.listen(svgEl, 'lostpointercapture', this.#onPointerUp)

		//- Sizing
		if (typeof ResizeObserver !== 'undefined') {
			this.#resizeObserver = new ResizeObserver(() => this.#draw())
			this.#resizeObserver.observe(svgEl)
		}

		this._evm.add(this.state.subscribe(() => this.refresh()))
	}

	/**
	 * Sets the curve.  Takes `[x1, y1, x2, y2]`, a `'cubic-bezier(...)'` string, or a CSS easing
	 * keyword; `x1` and `x2` are clamped into `0..1`.
	 */
	set(v: BezierValue | BezierString | Readonly<BezierValue> | number[]): this {
		this.#log.fn('set').debug({ v, this: this })

		const next = toBezier(v)

		// Inside a gesture the whole drag lands as one undo step, in `#endGesture`.
		if (!this.#gestureFrom) {
			this.commit({ from: [...this.state.value], to: [...next] })
		}

		this.state.set(next)
		this.emit('change', [...next] as BezierValue)

		if (!this.#gestureFrom) this.#preview()
		return this
	}

	refresh(v?: BezierValue): this {
		this.#log.fn('refresh').debug({ v, this: this })

		this.#draw()

		const value = this.state.value as BezierValue
		for (const [i, field] of this.numberControllers.entries()) {
			const el = field.element
			// Don't rewrite a field mid-typing (`0.` reads back as `0`) unless its number is stale.
			if (document.activeElement === el && el.valueAsNumber === value[i]) continue
			el.value = String(+value[i].toFixed(4))
		}

		if (this.selectController) {
			const label = this.#labelFor(value)
			if (label.label !== this.selectController.selected.label || label.label === 'custom') {
				this.selectController.select(label, false)
			}
		}

		super.refresh(value)
		return this
	}

	/**
	 * Pulls the bound field into state on {@link refresh} -- only when it says a different curve,
	 * since an array never compares equal in the store and would re-notify forever.
	 */
	protected readBinding() {
		if (!this.opts.binding) return
		const next = this.#read(this.opts.binding.target[this.opts.binding.key])
		if (next && !bezierEqual(next, this.state.value as BezierValue)) {
			this.state.set(next)
		}
	}

	save(overrides: Partial<InputPreset<BezierInputOptions>> = {}) {
		return super.save({ value: [...this.state.value], ...overrides })
	}

	load(json: InputPreset<BezierInputOptions> | string) {
		super.load(json)
		// The preset's array would otherwise be shared with the input as its new default.
		this.initialValue = [...this.state.value] as BezierValue
		this.elements.resetBtn.classList.toggle('dirty', this._dirty())
	}

	dispose() {
		cancelAnimationFrame(this.#previewFrame)
		this.#resizeObserver?.disconnect()
		for (const field of this.numberControllers) field.dispose()
		this.selectController?.dispose()
		super.dispose()
	}

	//· Internals ······································································¬

	/** Parses a bound field's value, or `undefined` if it isn't a curve. */
	#read(v: unknown): BezierValue | undefined {
		try {
			return toBezier(v)
		} catch {
			return undefined
		}
	}

	#labelFor(v: BezierValue): LabeledOption<BezierValue> {
		const easings = this.opts.easings || BEZIER_EASINGS
		for (const [label, value] of Object.entries(easings)) {
			if (bezierEqual(value, v)) return { label, value: [...value] as BezierValue }
		}
		// Not a named curve.  Its value is the curve itself, so a cancelled dropdown restores it.
		return { label: 'custom', value: [...v] as BezierValue }
	}

	#beginGesture() {
		this.#gestureFrom ??= [...this.state.value] as BezierValue
	}

	#endGesture() {
		const from = this.#gestureFrom
		if (!from) return
		this.#gestureFrom = null

		const to = [...this.state.value] as BezierValue
		if (!bezierEqual(from, to)) {
			this.commit({ from, to })
			this.#preview()
		}
	}

	/** Maps a curve-space point to SVG pixels. */
	#toPx(x: number, y: number): [number, number] {
		const { width, height } = this.#size
		const v = this.#view
		return [
			((x - v.x0) / (v.x1 - v.x0)) * width,
			height - ((y - v.y0) / (v.y1 - v.y0)) * height,
		]
	}

	/** Maps SVG pixels to a curve-space point. */
	#fromPx(px: number, py: number): [number, number] {
		const { width, height } = this.#size
		const v = this.#view
		return [
			v.x0 + (px / (width || 1)) * (v.x1 - v.x0),
			v.y0 + ((height - py) / (height || 1)) * (v.y1 - v.y0),
		]
	}

	/** Grows the view to fit control points outside the default range.  Held still mid-drag. */
	#fitView() {
		if (this.#drag) return
		const [, y1, , y2] = this.state.value
		const margin = 0.1
		this.#view.y0 = Math.min(-VIEW_PAD_Y, y1 - margin, y2 - margin)
		this.#view.y1 = Math.max(1 + VIEW_PAD_Y, y1 + margin, y2 + margin)
	}

	#draw() {
		const g = this.elements.controllers.graph
		if (!g) return

		const rect = g.svg.getBoundingClientRect()
		// Before layout (or while hidden) draw into a placeholder box so nothing is NaN.
		this.#size.width = rect.width || 100
		this.#size.height = rect.height || 100
		g.svg.setAttribute('viewBox', `0 0 ${this.#size.width} ${this.#size.height}`)

		this.#fitView()

		const [x1, y1, x2, y2] = this.state.value
		const p0 = this.#toPx(0, 0)
		const p1 = this.#toPx(x1, y1)
		const p2 = this.#toPx(x2, y2)
		const p3 = this.#toPx(1, 1)

		const set = (el: Element, attrs: Record<string, number | string>) => {
			for (const k in attrs) el.setAttribute(k, String(attrs[k]))
		}

		set(g.frame, {
			x: p0[0],
			y: p3[1],
			width: p3[0] - p0[0],
			height: p0[1] - p3[1],
		})
		set(g.diagonal, { x1: p0[0], y1: p0[1], x2: p3[0], y2: p3[1] })
		set(g.arm1, { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1] })
		set(g.arm2, { x1: p3[0], y1: p3[1], x2: p2[0], y2: p2[1] })
		set(g.curve, {
			d: `M ${p0[0]} ${p0[1]} C ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`,
		})
		set(g.start, { cx: p0[0], cy: p0[1] })
		set(g.end, { cx: p3[0], cy: p3[1] })
		set(g.handle1, { cx: p1[0], cy: p1[1] })
		set(g.handle2, { cx: p2[0], cy: p2[1] })
	}

	/** Runs a dot along the curve once, so a change can be felt as well as seen. */
	#preview() {
		if (!this.opts.preview || typeof requestAnimationFrame === 'undefined') return

		const g = this.elements.controllers.graph
		if (!g) return

		cancelAnimationFrame(this.#previewFrame)

		const ease = cubicBezier(...(this.state.value as BezierValue))
		const duration = this.opts.previewDuration ?? BEZIER_INPUT_DEFAULTS.previewDuration
		const start = performance.now()
		const railX = this.#toPx(1 + VIEW_PAD_X * 0.5, 0)[0]

		g.svg.classList.add('previewing')

		const frame = (now: number) => {
			const t = Math.min(1, (now - start) / duration)
			const y = ease(t)
			const [px, py] = this.#toPx(t, y)
			g.dot.setAttribute('cx', String(px))
			g.dot.setAttribute('cy', String(py))
			g.railDot.setAttribute('cx', String(railX))
			g.railDot.setAttribute('cy', String(py))

			if (t < 1) {
				this.#previewFrame = requestAnimationFrame(frame)
			} else {
				g.svg.classList.remove('previewing')
			}
		}

		this.#previewFrame = requestAnimationFrame(frame)
	}

	#onPointerDown = (e: PointerEvent) => {
		if (this.disabled || e.button !== 0) return

		const g = this.elements.controllers.graph
		const rect = g.svg.getBoundingClientRect()
		const px = e.clientX - rect.left
		const py = e.clientY - rect.top

		const [x1, y1, x2, y2] = this.state.value
		const h1 = this.#toPx(x1, y1)
		const h2 = this.#toPx(x2, y2)
		const d1 = Math.hypot(h1[0] - px, h1[1] - py)
		const d2 = Math.hypot(h2[0] - px, h2[1] - py)

		// The nearer control point, if the press is close enough to either.
		const handle = d1 <= d2 ? 1 : 2
		const [hx, hy] = handle === 1 ? h1 : h2
		if (Math.min(d1, d2) > GRAB_RADIUS) return

		e.preventDefault()
		// Capture keeps the drag alive outside the graph.  A synthetic pointer has no capture to take.
		try {
			g.svg.setPointerCapture(e.pointerId)
		} catch {}

		// Keep the grab offset so the point doesn't jump to the cursor.
		this.#drag = { handle, pointerId: e.pointerId, dx: hx - px, dy: hy - py }
		this.#beginGesture()

		g.svg.classList.add('dragging')
		g[handle === 1 ? 'handle1' : 'handle2'].classList.add('active')
	}

	#onPointerMove = (e: PointerEvent) => {
		const drag = this.#drag
		if (!drag || e.pointerId !== drag.pointerId) return

		const rect = this.elements.controllers.graph.svg.getBoundingClientRect()
		let [x, y] = this.#fromPx(e.clientX - rect.left + drag.dx, e.clientY - rect.top + drag.dy)

		const step = e.shiftKey ? 0.05 : (this.opts.step ?? BEZIER_INPUT_DEFAULTS.step)
		const snap = (n: number) => +(Math.round(n / step) * step).toFixed(4)

		x = clamp(snap(x), 0, 1)
		y = clamp(
			snap(y),
			this.opts.yMin ?? BEZIER_INPUT_DEFAULTS.yMin,
			this.opts.yMax ?? BEZIER_INPUT_DEFAULTS.yMax,
		)

		const next = [...this.state.value] as BezierValue
		const i = drag.handle === 1 ? 0 : 2
		if (next[i] === x && next[i + 1] === y) return
		next[i] = x
		next[i + 1] = y

		this.set(next)
	}

	#onPointerUp = (e: PointerEvent) => {
		const drag = this.#drag
		if (!drag || e.pointerId !== drag.pointerId) return

		const g = this.elements.controllers.graph
		if (g.svg.hasPointerCapture(e.pointerId)) g.svg.releasePointerCapture(e.pointerId)
		g.svg.classList.remove('dragging')
		g.handle1.classList.remove('active')
		g.handle2.classList.remove('active')

		this.#drag = null
		this.#endGesture()
		// The view held still during the drag -- let it fit a point that left the box.
		this.#draw()
	}
	//⌟
}
