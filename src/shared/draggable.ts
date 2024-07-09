import type { ElementOrSelector, ElementsOrSelectors } from './select'
import type { Placement, PlacementOptions } from './place'

import { isDefined, isHTMLElement, isString } from './is'
import { writable, type Writable } from './store'
import { EventManager } from './EventManager'
import { persist } from './persist'
import { select } from './select'
import { Logger } from './logger'
import { place } from './place'
import { clamp } from './clamp'
import { DEV } from 'esm-env'

/**
 * Represents a dom element's bounding rectangle.
 */
export interface VirtualRect {
	left: number
	top: number
	right: number
	bottom: number
}

export type DraggablePlacementOptions = PlacementOptions & {
	/**
	 * The position to place the gui.
	 */
	position: Placement | { x: number; y: number }
}

/**
 * Data passed to listeners of the {@link DraggableOptions.onDragStart|onDragStart},
 * {@link DraggableOptions.onDrag|onDrag}, {@link DraggableOptions.onDragEnd|onDragEnd}, and
 * {@link DraggableOptions.onCollision|onCollision} events.
 */
export type DragEventData = {
	/**
	 * The node on which the draggable is applied
	 */
	rootNode: HTMLElement
	/**
	 * Total horizontal movement from the node's original position.
	 */
	x: number
	/**
	 * Total vertical movement from the node's original position.
	 */
	y: number
	/**
	 * The complete event object.
	 */
	eventTarget: EventTarget
}

export type DraggableOptions = {
	__type?: 'DraggableOptions'
	/**
	 * The boundary to which the draggable element is limited to.
	 *
	 * Valid values:
	 *
	 * - `undefined` - defaults to `document.documentElement`
	 * - An `HTMLElement` or query selector string, _i.e. `.container` or `#container`_
	 * - `'parent'` - the element's {@link HTMLElement.offsetParent|offsetParent}
	 * - `'body'` - `document.body`
	 * - `false` - no boundary
	 * - `{ top: number, right: number, bottom: number, left: number }` - A custom {@link VirtualRect rect} relative to the viewport.
	 *
	 * **Note**: Make sure the bounds is smaller than the node's min size.
	 * @default undefined
	 */
	bounds?: ElementOrSelector

	/**
	 * Axis on which the element can be dragged on.
	 * - `both` - Element can move in any direction
	 * - `x` - Only horizontal movement possible
	 * - `y` - Only vertical movement possible
	 * - `none` - No movement at all
	 * @default 'both'
	 */
	axis: 'both' | 'x' | 'y' | 'none'

	/**
	 * Custom transform function. If provided, this function will be used to
	 * apply the DOM transformations to the root node to move it.
	 *
	 * You can return a {@link https://developer.mozilla.org/docs/Web/CSS/transform | transform} property
	 * return nothing to apply your own transformations via
	 * {@link https://developer.mozilla.org/docs/Web/CSS/transform | node.style.transform}
	 * @default undefined
	 */
	transform?: (data: DragEventData) => { x: number; y: number } | void | undefined

	/**
	 * Applies `user-select: none` to the `<body />` element when dragging. `false` disables it.
	 * @default true
	 */
	userSelectNone: boolean

	/**
	 * Ignore touch events with more than 1 touch. Helpful for preserving pinch-to-zoom behavior on a pages with multiple draggable's.
	 * @default false
	 */
	ignoreMultitouch: boolean

	/**
	 * Disables dragging altogether.
	 * @default false
	 */
	disabled: boolean

	/**
	 * The default position of the draggable element.
	 * @default { x: 0, y: 0 }
	 */
	position?: { x?: number; y?: number } | Placement

	/**
	 * If {@link position} is a {@link Placement} string, these
	 * {@link PlacementOptions} will be used to calculate the position.
	 * @default { margin: 0 }
	 */
	placementOptions: PlacementOptions

	/**
	 * An element or selector (or any combination of the two) for element(s) inside
	 * the parent node upon which dragging should be disabled when clicked.
	 * @default undefined
	 */
	cancel: ElementsOrSelectors

	/**
	 * CSS Selector of an element or multiple elements inside the parent node on
	 * which `use:draggable` is applied).  If provided, only clicking and dragging
	 * handles will activate dragging.
	 *
	 * @default undefined
	 */
	handle: ElementsOrSelectors

	/**
	 * Element's or selectors which will act as collision obstacles for the draggable element.
	 */
	obstacles: ElementsOrSelectors

	classes: {
		/**
		 * Class to apply on the element on which `use:draggable` is applied.
		 *
		 * __Note:__ If `handle` is provided, this class will still be applied
		 * to the draggable element itself, __NOT__ the handle element.
		 * @default 'fractils-draggable'
		 */
		default: string
		/**
		 * Class to apply on the element when it is dragging.
		 * @default 'fractils-dragging'
		 */
		dragging: string
		/**
		 * Class to apply on the element if it has been dragged at least once.
		 * @default 'fractils-dragged'
		 */
		dragged: string
		/**
		 * Elements with this class will disable dragging when clicked.
		 * @default 'fractils-cancel'
		 */
		cancel: string
	}

	/**
	 * Fires on `pointerdown` for the element / valid handle elements.
	 */
	onDragStart: (data: DragEventData) => void

	/**
	 * Fires on `pointermove` while dragging.
	 */
	onDrag: (data: DragEventData) => void

	/**
	 * Fires on `pointerup`.
	 */
	onDragEnd: (data: DragEventData) => void

	/**
	 * Fires when the element collides with an obstacle.
	 */
	onCollision: (data: { x: number; y: number }) => void

	/**
	 * If provided, the position will persist in local storage under this key.
	 * @default undefined
	 */
	localStorageKey?: string
}

const DEFAULT_CLASSES = {
	default: 'fractils-draggable',
	dragging: 'fractils-dragging',
	dragged: 'fractils-dragged',
	cancel: 'fractils-cancel',
} as const

export const DRAGGABLE_DEFAULTS: DraggableOptions = {
	__type: 'DraggableOptions',
	bounds: 'body',
	axis: 'both',
	userSelectNone: true,
	ignoreMultitouch: false,
	disabled: false,
	position: { x: 0, y: 0 },
	placementOptions: { margin: 0 },
	cancel: undefined,
	handle: undefined,
	obstacles: undefined,
	classes: DEFAULT_CLASSES,
	onDragStart: () => {},
	onDrag: () => {},
	onDragEnd: () => {},
	onCollision: () => {},
	transform: undefined,
	localStorageKey: undefined,
} as const

/**
 * Make an element draggable.  Supports touch, mouse, and pointer events,
 * and has options for bounds / obstacle collision detection, programatic
 * position control, custom transforms, and more.
 *
 * @example
 * ```js
 * import { Draggable } from 'fractils'
 *
 * const element = document.createElement('div')
 *
 * const draggable = new Draggable(element, {
 * 	bounds: 'body'
 * })
 * ```
 */
export class Draggable {
	static initialized = false
	opts: DraggableOptions

	/**
	 * Disables user interaction with the draggable element.
	 */
	disabled = false

	/**
	 * Used in  {@link update} to account for the difference between
	 * the node's position and the user's exact click position on the node.
	 */
	clickOffset = { x: 0, y: 0 }

	/**
	 * The distance between the pointer's position and the node's position.
	 */
	clientToNodeOffset = {
		x: 0,
		y: 0,
	}

	// /**
	//  * An internal representation of the {@link node|node's} bounding rectangle.
	//  * Used for collision detection and animations.
	//  */
	// rect: VirtualRect = { top: 0, right: 0, bottom: 0, left: 0 }

	boundsEl?: HTMLElement
	handleEls: HTMLElement[]
	cancelEls: HTMLElement[]
	obstacleEls: HTMLElement[]

	/**
	 * A rectangle representing the draggable element's boundary, if any.
	 */
	bounds = {
		left: -Infinity,
		top: -Infinity,
		right: Infinity,
		bottom: Infinity,
	} satisfies VirtualRect

	private _storage?: ReturnType<typeof persist<{ x: number; y: number }>>
	private _position = { x: 0, y: 0 }

	/**
	 * An observable store that updates the draggable element's position.
	 */
	positionStore: Writable<{ x: number; y: number }>

	/**
	 * @todo I think we can just remove this and let the user add their
	 * own event listeners if they want to target a specific element.
	 */
	eventTarget?: HTMLElement

	/**
	 * Whether the draggable element is currently being dragged.
	 */
	private _active = false

	/**
	 * The original value of `user-select` on the body element
	 * used to restore the original value after dragging when
	 * {@link DraggableOptions.userSelectNone|userSelectNone} is `true`.
	 */
	private _bodyOriginalUserSelectVal = ''

	/**
	 * Updates the {@link bounds} property to account for any changes in the
	 * DOM or this instance's {@link DraggableOptions.bounds|bounds} option.
	 */
	private _recomputeBounds: () => void

	/**
	 * This node's DOMRect, cached for use via {@link rect}.
	 */
	private _rect: DOMRect

	private _evm = new EventManager()
	// todo - isn't this redundant with the evm?
	private _listeners = new Set<() => void>()

	/**
	 * A callback to release the pointer capture using the
	 * {@link PointerEvent.pointerId | pointerId} and reset the cursor.
	 */
	private _releaseCapture = () => {}

	/**
	 * Internal logger for infoging. Automatically bypassed in non-dev environments.
	 */
	private _log: Logger

	constructor(
		public node: HTMLElement,
		options?: Partial<DraggableOptions>,
	) {
		this.opts = Object.assign({}, DRAGGABLE_DEFAULTS, options)

		this._log = new Logger('draggable ' + Array.from(this.node.classList).join('.'), {
			fg: 'SkyBlue',
		})
		this._log.fn('constructor').debug({ opts: this.opts, this: this })

		this._rect = this.node.getBoundingClientRect()
		this._recomputeBounds = this._resolveBounds(this.opts.bounds)

		this.opts.position = this.resolvePosition(this.opts.position)
		this.positionStore = writable(this.opts.position as { x: number; y: number })

		this.node.classList.add(this.opts.classes.default)

		const startPosition = this.opts.position as { x: number; y: number }

		// Setup local storage if the key is provided.
		if (options?.localStorageKey) {
			this._storage = persist(options.localStorageKey, startPosition)
			const storagePostion = this._storage.get()
			if (storagePostion) {
				startPosition.x = storagePostion.x
				startPosition.y = storagePostion.y
			}
		}

		this.x = startPosition.x
		this.y = startPosition.y

		// Prevents mobile touch-event jank.
		this.node.style.setProperty('touch-action', 'none')

		this.handleEls = this.opts.handle ? select(this.opts.handle, this.node) : [this.node]
		this.cancelEls = select(this.opts.cancel, this.node)
		this.obstacleEls = select(this.opts.obstacles)

		this._evm.listen(this.node, 'pointerdown', this.dragStart)
		this._evm.listen(window, 'pointerup', this.dragEnd)
		this._evm.listen(window, 'pointermove', this.drag)
		this._evm.listen(window, 'resize', this.resize)
		this._evm.add(
			this.positionStore.subscribe(({ x, y }) => {
				console.trace()
				this.node.style.setProperty('translate', `${x}px ${y}px 1px`)
			}),
		)

		if (startPosition !== DRAGGABLE_DEFAULTS.position) {
			this._recomputeBounds()
			this._position = { x: this.x, y: this.y }
			this.moveTo(startPosition)
		}
	}

	/**
	 * Programmatically sets the position of the draggable element.
	 */
	get position() {
		return this._position
	}
	set position(v) {
		this._position = v
		this.moveTo(v)
		this.updateLocalStorage()
	}

	/**
	 * The x position of the draggable element's transform offset.
	 */
	get x() {
		return +this.node.dataset['translateX']! || 0
	}
	set x(v: number) {
		this.node.dataset['translateX'] = String(v)
	}

	/**
	 * The y position of the draggable element's transform offset.
	 */
	get y() {
		return +this.node.dataset['translateY']! || 0
	}
	set y(v: number) {
		this.node.dataset['translateY'] = String(v)
	}

	/**
	 * Whether the draggable element can move in the x direction,
	 * based on the {@link DraggableOptions.axis|axis} option.
	 */
	get canMoveX() {
		return /(both|x)/.test(this.opts.axis)
	}
	/**
	 * Whether the draggable element can move in the x direction,
	 * based on the {@link DraggableOptions.axis|axis} option.
	 */
	get canMoveY() {
		return /(both|y)/.test(this.opts.axis)
	}

	get eventData(): DragEventData {
		return {
			x: this.x,
			y: this.y,
			rootNode: this.node,
			eventTarget: this.eventTarget!,
		}
	}

	get isControlled() {
		return !!this.opts.position
	}

	dragStart = (e: PointerEvent) => {
		if (this.disabled) return
		// Ignore right-clicks.
		if (e.button === 2) return

		if (this.opts.ignoreMultitouch && !e.isPrimary) return
		// Abort if a cancel element was clicked.
		if (
			e
				.composedPath()
				.some(n => (n as HTMLElement).classList?.contains(this.opts.classes.cancel))
		) {
			return
		}

		// Refresh the obstacles.
		this.obstacleEls = select(this.opts.obstacles)

		if (DEV) {
			for (const el of this.obstacleEls) {
				el.dataset['outline'] = el.style.outline
				el.style.outline = '2px dotted #f007'
			}
		}

		// Error handling.
		if (
			isString(this.opts.handle) &&
			isString(this.opts.cancel) &&
			this.opts.handle === this.opts.cancel
		) {
			throw new Error("`handle` selector can't be same as `cancel` selector")
		}

		// Resolve the event target.

		if (this._cancelElementContains(this.handleEls)) {
			throw new Error(
				"Element being dragged can't be a child of the element on which `cancel` is applied",
			)
		}

		const eventTarget = e.composedPath()[0] as HTMLElement

		// Return if the event target is not a handle element.
		if (
			!this.handleEls.some(
				e => e.contains(eventTarget) || e.shadowRoot?.contains(eventTarget),
			)
		)
			return

		// Make sure it's not a cancel element.
		if (this._cancelElementContains([eventTarget])) {
			return
		}

		this._log.fn('dragStart').debug('Dragging initiated.')
		e.stopPropagation()

		// Resolve the event target.
		this.eventTarget =
			this.handleEls.length === 1
				? this.node
				: this.handleEls.find(el => el.contains(eventTarget))!

		this._active = true

		// Store the click offset
		if (this.canMoveX) this.clickOffset.x = e.clientX - this.x
		if (this.canMoveY) this.clickOffset.y = e.clientY - this.y

		// Update the virtual rectangle.
		// const { top, right, bottom, left } = this.node.getBoundingClientRect()
		// this.rect = { top, right, bottom, left }
		this._updateRect()

		// Update the clientToNodeOffset.
		if (this.bounds) {
			this.clientToNodeOffset = {
				x: e.clientX - this.rect.left,
				y: e.clientY - this.rect.top,
			}
		}

		// Set the initial position (with a forced duration of 0).
		this.positionStore.set({ x: this.x, y: this.y })
		// Update the bounds rect.
		this._recomputeBounds()
		// this.#updateBounds()

		this.node.dispatchEvent(new CustomEvent('grab'))

		// Capture the pointer and store the release callback.
		const { cursor } = getComputedStyle(this.node)
		this.node.setPointerCapture(e.pointerId)
		this.node.style.cursor = 'grabbing'
		this._releaseCapture = () => {
			// this.node.releasePointerCapture(e.pointerId)
			this.node.style.cursor = cursor
		}

		// Dispatch custom events
		this._fireSvelteDragStartEvent()
		this._fireUpdateEvent()
	}

	/**
	 * This target node's cached {@link DOMRect}
	 */
	get rect() {
		return this._rect
	}

	private _updateRect() {
		this._rect = this.node.getBoundingClientRect()
	}

	drag = (e: PointerEvent) => {
		if (!this._active) return

		e.preventDefault()
		e.stopPropagation()

		// Apply dragging and dragged classes.
		this.node.classList.add(this.opts.classes.dragging)
		this.node.classList.add(this.opts.classes.dragged)

		const x = e.clientX - this.clickOffset.x
		const y = e.clientY - this.clickOffset.y
		const target = { x, y }
		// if (this.bounds) this.#clampToBounds(target)
		this.moveTo(target)

		this._fireSvelteDragEvent()
	}

	dragEnd = () => {
		if (!this._active) return

		// todo - delete!
		if (DEV) {
			for (const el of this.obstacleEls) {
				el.style.outline = el.dataset['outline'] ?? 'none'
			}
		}

		this.node.classList.remove(this.opts.classes.dragging)

		if (this.opts.userSelectNone) {
			document.body.style.userSelect = this._bodyOriginalUserSelectVal
		}

		this.clickOffset = { x: 0, y: 0 }
		this.clientToNodeOffset = { x: 0, y: 0 }
		this._position = { x: this.x, y: this.y }
		// if (this._storage) this._storage.value = this._position

		this._active = false

		this._releaseCapture()

		this.node.dispatchEvent(new CustomEvent('release'))

		setTimeout(() => this.node.classList.remove(this.opts.classes.dragged), 0)

		this._fireSvelteDragEndEvent()

		this.updateLocalStorage()
	}

	resize = () => {
		this._recomputeBounds()
		// this.#updateBounds()

		this.moveTo(this.position) // works but doesn't preserve original position
	}

	// #updateBounds = () => {
	// 	// refresh style left & top
	// 	const styleLeft = parseFloat(this.node.style.left) || 0
	// 	this.#leftBound = -styleLeft
	// 	this.#rightBound =
	// 		this.bounds.right - this.bounds.left - (this.rect.right - this.rect.left) - styleLeft

	// 	const styleTop = parseFloat(this.node.style.top) || 0
	// 	this.#topBound = -styleTop
	// 	this.#bottomBound =
	// 		this.bounds.bottom - this.bounds.top - styleTop - (this.rect.bottom - this.rect.top)
	// 	// refresh bounds element padding ...
	// 	if (this.boundsEl) {
	// 		const styleMap = getStyleMap(this.boundsEl)
	// 		// const { paddingLeft, paddingRight, paddingTop, paddingBottom } =
	// 		// 	getStyleMap(this.boundsEl)
	// 		this.#leftBound -= parseFloat(styleMap.get('padding-left'))
	// 		this.#rightBound -= parseFloat(styleMap.get('padding-right'))
	// 		this.#topBound -= parseFloat(styleMap.get('padding-top'))
	// 		this.#bottomBound -= parseFloat(styleMap.get('padding-bottom'))
	// 	}
	// }

	/**
	 * Moves the {@link node|draggable element} to the specified position, adjusted
	 * for collisions with {@link obstacleEls obstacles} or {@link boundsRect bounds}.
	 */
	moveTo(target: { x: number; y: number }) {
		this._log.fn('moveTo').debug('Moving to:', target, { bounds: this.bounds })

		if (this.bounds) {
			const TESTING = target.x
			target.x = clamp(
				target.x,
				this.bounds.left,
				this.bounds.right - (this.rect.right - this.rect.left),
			)
			target.y = clamp(
				target.y,
				this.bounds.top,
				this.bounds.bottom - (this.rect.bottom - this.rect.top),
			)
			if (target.x !== TESTING) {
				// this._log.fn('moveTo').debug(`Clamped x from ${TESTING} to ${target.x}`, {
				// 	rect: this.rect,
				// 	bounds: this.bounds,
				// })
			}
		}

		if (this.canMoveX) {
			const deltaX = target.x - this.x

			if (deltaX !== 0) {
				this.x += deltaX
			}
		}

		if (this.canMoveY) {
			if (this.bounds) target.y = clamp(target.y, this.bounds.top, this.bounds.bottom)
			const deltaY = target.y - this.y
			if (deltaY !== 0) {
				// const y = this.#collisionClampY(deltaY)
				// const y = collisionClampY(deltaY, this.rect, this.obstacleEls)
				// // Apply delta to y / virtual rect.
				// this.rect.top += y
				// this.rect.bottom += y
				// this.y += y
				this.y += deltaY
			}
		}

		// Check for a custom user transform function before applying ours.
		if (!this.opts.transform) {
			// Set the tween and let it animate the position.
			this.positionStore.set({ x: this.x, y: this.y })
		} else {
			// Call the user's custom transform function.
			const customTransformResult = this.opts.transform?.({
				x: this.x,
				y: this.y,
				rootNode: this.node,
				eventTarget: this.eventTarget!,
			})

			// If the user's custom transform function returns an `{x,y}` object, use it.
			if (
				customTransformResult &&
				'x' in customTransformResult &&
				'y' in customTransformResult
			) {
				const { x, y } = customTransformResult
				this.positionStore.set({ x, y })
			}
		}

		// this.updateLocalStorage()

		this._fireUpdateEvent()
	}

	update(v = this.position) {
		this._log.fn('update').debug('Updating position:', v, this)
		this.moveTo(v)
	}

	/**
	 * Updates the {@link position} property in local storage.
	 */
	updateLocalStorage = () => {
		if (!this.opts.localStorageKey) return

		this._log
			.fn('updateLocalStorage')
			.debug(
				'Updating position in localStorage:',
				`{ x: ${this._position.x}, y: ${this._position.y} }`,
				this,
			)

		if (this._storage) {
			this._storage.set(this._position)
		}
	}

	clearLocalStorage = () => {
		if (this._storage && this.opts.localStorageKey) {
			localStorage.removeItem(this.opts.localStorageKey)
		}
	}

	/**
	 * Resolves a {@link DraggableOptions.position} option into an `{x,y}` vector
	 * depending on its type:
	 * - `undefined` -> {@link DRAGGABLE_DEFAULTS.position}
	 * - {@link Placement} -> {@link place}
	 * - `{x,y}` -> itself *(merged with {@link DRAGGABLE_DEFAULTS.position}*
	 * if it's a partial.)
	 */
	resolvePosition(pos: DraggableOptions['position']) {
		const defaultPos = DRAGGABLE_DEFAULTS.position as { x: number; y: number }

		if (!pos) {
			return defaultPos
		}

		if (typeof pos === 'string') {
			return place(this.node, pos, {
				bounds: this.boundsEl?.getBoundingClientRect(),
				...this.opts.placementOptions,
			})
		}

		if (typeof pos === 'object' && ('x' in pos || 'y' in pos)) {
			return { ...defaultPos, ...pos }
		}

		throw new Error('Invalid position: ' + JSON.stringify(pos), {
			cause: {
				defaultPos,
				pos,
			},
		})
	}

	/**
	 * Resolves the {@link DraggableOptions.bounds|bounds} and returns a
	 * function that updates the {@link bounds} property when called.
	 */
	private _resolveBounds(optsBounds: DraggableOptions['bounds']): () => void {
		const resolveUpdater = () => {
			if (!optsBounds) return () => void 0

			// Check for a custom bounds rect.
			if (
				optsBounds &&
				typeof optsBounds === 'object' &&
				('left' in optsBounds ||
					'right' in optsBounds ||
					'top' in optsBounds ||
					'bottom' in optsBounds)
			) {
				return () => {
					Object.assign(this.bounds, optsBounds)
				}
			}

			// prettier-ignore
			const node =
			isHTMLElement(optsBounds) ? optsBounds
			: optsBounds === 'body' 	? document.body
			: optsBounds === 'parent' ? this.node.offsetParent
			: isString(optsBounds) 	? select(optsBounds)[0]
			: !isDefined(optsBounds) 	? document.documentElement
			: undefined

			// Error handling.
			if (!node) throw new Error('Invalid bounds option provided: ' + optsBounds)

			this.boundsEl = node as HTMLElement

			// Add a resize observer to the bounds element to automatically update the bounds.
			const boundsResizeObserver = new ResizeObserver(() => {
				// this.clickOffset = { x: this.rect.left, y: this.rect.top }
				this.resize()
				this._fireUpdateEvent()
			})
			boundsResizeObserver.observe(node)
			this._listeners.add(() => boundsResizeObserver.disconnect())

			this._fireUpdateEvent()

			return () => {
				const rect = node.getBoundingClientRect()
				this.bounds.left = rect.left
				this.bounds.top = rect.top
				this.bounds.right = rect.right
				this.bounds.bottom = rect.bottom
			}
		}
		const updateBounds = resolveUpdater()
		return () => {
			updateBounds()
			this._updateRect()
		}
	}

	private _cancelElementContains = (dragElements: HTMLElement[]) => {
		return this.cancelEls.some(cancelEl => dragElements.some(el => cancelEl.contains(el)))
	}

	private _callEvent = (
		eventName: 'dragstart' | 'drag' | 'dragend',
		fn: (data: DragEventData) => void,
	) => {
		const data = this.eventData
		this.node.dispatchEvent(new CustomEvent(eventName, { detail: data }))
		fn?.(data)
	}

	private _fireSvelteDragStartEvent = () => {
		this._callEvent('dragstart', this.opts.onDragStart)
	}

	private _fireSvelteDragEndEvent = () => {
		this._callEvent('dragend', this.opts.onDragEnd)
	}

	private _fireSvelteDragEvent = () => {
		this._callEvent('drag', this.opts.onDrag)
	}

	private _fireUpdateEvent = () => {
		this.node.dispatchEvent(new CustomEvent('update', { detail: this }))
	}

	dispose() {
		this._evm.dispose()
	}
}

/**
 * Events fired by the draggable svelte action.
 */
export interface DragEvents {
	'on:dragStart': (e: DragEventData) => void
	'on:drag': (e: DragEventData) => void
	'on:dragEnd': (e: DragEventData) => void
	'on:collision': (e: { x: number; y: number }) => void
	'on:update': (e: CustomEvent<Draggable>) => void
}

/**
 * A svelte action to make an element draggable.
 *
 * @example
 * ```svelte
 * <script>
 * 	import { draggable } from 'fractils'
 * </script>
 *
 * <div use:draggable> Drag Me </div>
 * ```
 */
export function draggable(node: HTMLElement, options?: Partial<DraggableOptions>) {
	const d = new Draggable(node, options ?? {})

	return {
		destroy: () => {
			d.dispose()
		},
		// The update function of a svelte action automatically fires whenever the
		// options object is changed externally, enabling easy reactivity.
		update: (options: Partial<DraggableOptions> | undefined) => {
			if (!options) return

			// Update all the values that need to be changed
			d.opts.axis = options.axis || DRAGGABLE_DEFAULTS.axis
			d.disabled = options.disabled ?? DRAGGABLE_DEFAULTS.disabled
			d.opts.ignoreMultitouch =
				options.ignoreMultitouch ?? DRAGGABLE_DEFAULTS.ignoreMultitouch
			d.opts.handle = options.handle
			d.opts.bounds = options.bounds!
			d.opts.cancel = options.cancel
			d.opts.userSelectNone = options.userSelectNone ?? DRAGGABLE_DEFAULTS.userSelectNone
			d.opts.transform = options.transform

			const dragged = d.node.classList.contains(d.opts.classes.dragged)

			d.node.classList.remove(d.opts.classes.default, d.opts.classes.dragged)

			d.opts.classes.default = options?.classes?.default ?? DEFAULT_CLASSES.default
			d.opts.classes.dragging = options?.classes?.dragging ?? DEFAULT_CLASSES.dragging
			d.opts.classes.dragged = options?.classes?.dragged ?? DEFAULT_CLASSES.dragged

			d.node.classList.add(d.opts.classes.default)

			if (dragged) d.node.classList.add(d.opts.classes.default)

			if (d.isControlled) {
				if (options.position) {
					const pos = d.resolvePosition(options.position)
					d.x = pos.x
					d.y = pos.y
				}

				d.moveTo({ x: d.x, y: d.y })
			}
		},
	}
}
