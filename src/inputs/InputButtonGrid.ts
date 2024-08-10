import type { JavascriptStyleProperty } from '../shared/css-types'
import type { ElementMap, InputOptions } from './Input'
import type { TooltipOptions } from '../shared/Tooltip'
import type { CreateOptions } from '../shared/create'
import type { Folder } from '../Folder'
import type {
	ButtonControllerEvents,
	ButtonControllerOptions,
	ButtonEventPayload,
} from '../controllers/ButtonController'

import { ButtonController } from '../controllers/ButtonController'
import { getStyle } from '../shared/getStyle'
import { Logger } from '../shared/logger'
import { create } from '../shared/create'
import { state } from '../shared/state'
import { toFn } from '../shared/toFn'
import { Input } from './Input'

/**
 * @see {@link ButtonGridInputOptions.value}
 */
export type ButtonGridArrays = ButtonControllerOptions[][]

/**
 * A unique identifier for a button in a {@link ButtonGridArrays} array.  Used as the key in the
 * {@link InputButtonGrid.buttons} map, as the value in the {@link InputButtonGrid.state} property,
 * and as the `id` attribute on the button element.
 */
export type ButtonId = string

/**
 * A fully processed {@link ButtonGridArrays} entry with the generated {@link ButtonController}s.
 * Stored in the input's {@link InputButtonGrid.buttonGrid|`buttonGrid`} property.
 */
export type ButtonGrid = ButtonController[][]

/**
 * Options for the {@link InputButtonGrid} {@link Input}.
 */
export type ButtonGridInputOptions = {
	readonly __type?: 'ButtonGridInputOptions'

	/**
	 * A 2D array of {@link ButtonControllerOptions} objects, representing a grid of buttons. The inner
	 * arrays represent rows, and the outer array represents columns.
	 * @example
	 * ```ts
	 * [
	 *   // First row columns
	 *   [
	 *     { text: 'top-left', onClick: () => {} },
	 *     { text: 'top-right', onClick: () => {} }
	 *   ],
	 *   // Second row columns
	 *   [
	 *     { text: 'bottom-left', onClick: () => {} },
	 *     { text: 'bottom-right', onClick: () => {} }
	 *   ]
	 * ]
	 * ```
	 */
	value: ButtonGridArrays

	/**
	 * Optional css style overrides in {@link JavascriptStyleProperty} (camelCase) format.
	 */
	style?: CreateOptions['style']

	/**
	 * Whether to apply the `active` classname to the button when it is clicked.
	 *
	 * _note:_ The {@link InputButtonGrid.state} value will always be the `id` of the most recently
	 * clicked button.  The `id` is derived from `text` when unspecified.
	 * @default true
	 */
	applyActiveClass?: boolean

	/**
	 * When `false`, the `active` class will be removed from all buttons before applying it to the
	 * clicked button.  Whem `true`, each button's active class will toggle independently.
	 */
	multiple?: boolean

	/**
	 * Whether a button is clickable.  If a function is passed, it will be called whenever the
	 * button is refreshed.
	 * @default false
	 */
	disabled?: boolean | (() => boolean)
} & InputOptions<ButtonGridArrays>

export const BUTTONGRID_INPUT_DEFAULTS = {
	__type: 'ButtonGridInputOptions' as const,
	value: [[{ id: '', text: '', onClick: () => {} }]],
	style: {
		gap: '0.5em',
	},
	applyActiveClass: false,
	resettable: false,
} as const satisfies ButtonGridInputOptions

export interface ButtonGridControllerElements extends ElementMap {
	container: HTMLElement
	buttonGrid: HTMLButtonElement[]
}

export class InputButtonGrid extends Input<
	// ButtonController,
	Set<ButtonId>,
	ButtonGridInputOptions,
	ButtonGridControllerElements,
	ButtonControllerEvents
> {
	readonly __type = 'InputButtonGrid' as const
	readonly initialValue = {} as ButtonGridArrays
	// readonly state = state({} as ButtonController)

	/**
	 * An array of active button ids.
	 * @see {@link Input.state}
	 */
	readonly state = state(new Set<ButtonId>())

	buttons: Map<ButtonId, ButtonController> = new Map()
	buttonGrid: ButtonGrid

	// active = state<ButtonId>('')
	/**
	 * A Set of active button ids.
	 */
	get active(): Set<ButtonId> {
		return this.state.value
	}
	setActive(id: ButtonId) {
		const button = this.buttons.get(id)
		if (!button) {
			console.warn(`Button id "${id}" not found`)
			return
		}

		const cls = this.opts.applyActiveClass

		if (!this.opts.multiple) {
			for (const btn of this.buttons.values()) {
				btn.active = false
				if (cls) btn.element.classList.remove('active')
				this.state.value.delete(id)
			}

			button.active = true
			if (cls) button.element.classList.add('active')
			this.state.value.add(id)
		} else {
			const newState = !button.active
			button.active = newState
			if (cls) button.element.classList.toggle('active', newState)
			newState ? this.state.value.add(id) : this.state.value.delete(id)
		}
	}

	private _log: Logger

	constructor(options: Partial<ButtonGridInputOptions>, folder: Folder) {
		const opts = Object.assign({}, BUTTONGRID_INPUT_DEFAULTS, options)
		super(opts, folder)

		this._evm.registerEvents(['click'])

		this.initialValue = opts.value
		this._log = new Logger(`InputButtonGrid ${opts.title}`, { fg: 'cyan' })
		this._log.fn('constructor').debug({ opts, this: this })

		const container = create('div', {
			classes: ['gooey-input', 'gooey-input-buttongrid-container'],
			parent: this.elements.content,
		})

		this.elements.controllers = {
			container,
			buttonGrid: [],
		} as const satisfies ButtonGridControllerElements

		this.buttonGrid = this.toGrid(this.initialValue)

		this.refresh()
	}

	onClick(
		callback: (payload: {
			/** The original click event. */
			event: MouseEvent
			/** The individual {@link ButtonController} that was clicked. */
			button: ButtonController
		}) => void,
	): void {
		this._evm.on('click', ({ event, button }) => callback({ event, button }))
	}

	/**
	 * Converts a {@link ButtonGridArrays} into a a grid of {@link HTMLButtonElement}
	 * elements, and
	 *
	 * - appends them to the {@link InputButtonGrid.elements.controllers.container}
	 */
	toGrid(grid: ButtonGridArrays): ButtonGrid {
		const instanceGrid: ButtonGrid = []
		const seen = new Set<string>()

		const rows = grid.length
		const cols = Math.max(...grid.map(row => row.length))

		// Remove all buttons.
		for (const { element } of this.buttons.values()) {
			element.remove()
		}
		this.buttons.clear()

		for (let i = 0; i < rows; i++) {
			const row = create('div', {
				classes: ['gooey-controller-buttongrid-row'],
				parent: this.elements.controllers.container,
				style: { gap: '0.5em' },
			})

			instanceGrid[i] = []

			for (let j = 0; j < cols; j++) {
				const opts = grid[i]?.[j]
				if (opts) {
					const id = this._resolveId(opts, seen)

					// console.warn(id)
					seen.add(id)

					const button = this.addButton(opts, id, i, j)
					row.appendChild(button.element)
					instanceGrid[i][j] = button
				}
			}
		}

		this.elements.container.style.setProperty(
			'height',
			getStyle(this.elements.controllers.container, 'height'),
		)

		return instanceGrid
	}

	private _resolveId(opts: ButtonControllerOptions, seen: Set<ButtonId>) {
		let id = opts.id ?? (typeof opts.text === 'function' ? opts.text() : opts.text)
		let i = 0

		// const ids = new Set(this.buttons.keys())
		// while (ids.has(id + (i ? i : ''))) i++
		while (seen.has(id + (i ? i : ''))) i++

		if (i) id += i

		return id
	}

	addButton(opts: ButtonControllerOptions, id: string, i: number, j: number): ButtonController {
		const text = toFn(opts.text)

		const tooltip: Partial<TooltipOptions> | undefined = opts.tooltip
			? Object.assign(
					{
						placement: 'top',
						delay: 1000,
					},
					opts.tooltip,
				)
			: undefined

		opts.element = create('button', {
			id,
			classes: [
				'gooey-controller',
				'gooey-controller-button',
				'gooey-controller-buttongrid-button',
			],
			innerHTML: text(),
			dataset: {
				id,
				row: String(i),
				col: String(j),
			},
			style: {
				...opts.style,
				width: '100%',
			},
			tooltip,
		})

		if (typeof opts.active !== 'function') {
			opts.active = () => {
				// if (this.opts.multiple) {
				// 	return this.state.value.includes(id)
				// }
				// return this.state.value === btn.id
				return this.state.value.has(id)
			}
		}

		const btn = new ButtonController(opts)

		if (this.opts.applyActiveClass) {
			btn.element.classList.toggle('active', btn.active)
		}

		btn.on('click', payload => {
			this._set(payload)

			// this.set()

			// this._evm.emit('click', payload)
		})

		this.buttons.set(id, btn)

		return btn
	}

	private _set(payload: ButtonEventPayload) {
		// const { button } = payload
		// const cls = this.opts.applyActiveClass

		// btn.element.classList.toggle('active', this.state.value === btn.id)
		this.setActive(payload.button.id)

		this._evm.emit('click', payload)
	}

	set() {
		// this.state.add(id)

		// this._emit('click')
		this.refresh()
	}

	refresh() {
		this._log.fn('refresh').debug({ this: this })

		for (const btn of this.buttons.values()) {
			btn.refresh()
		}

		super.refresh()
		return this
	}

	enable() {
		for (const btn of this.buttons.values()) {
			btn.enable()
		}
		this.disabled = false
		return this
	}

	disable() {
		for (const btn of this.buttons.values()) {
			btn.disable()
		}
		this.disabled = true
		return this
	}

	dispose() {
		for (const btn of this.buttons.values()) {
			btn.dispose()
		}
		this.buttons.clear()
		super.dispose()
	}
}
