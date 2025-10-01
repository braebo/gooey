import type { ElementMap, InputOptions } from './Input'
import type { Tooltip } from '../shared/Tooltip'
import type { State } from '../shared/state'
import type { Folder } from '../Folder'

import { NumberButtonsController } from '../controllers/NumberButtonsController'
import { NumberController } from '../controllers/NumberController'
import { rangeController } from '../controllers/number'
import { Logger } from '../shared/logger'
import { create } from '../shared/create'
import { Input } from './Input'

export interface NumberControllerElements extends ElementMap {
	/** The main container for the number input. */
	container: HTMLElement
	/** Increment/decrement buttons. */
	buttons: {
		container: HTMLDivElement
		increment: HTMLDivElement
		decrement: HTMLDivElement
	}
	/** The text input. */
	input: HTMLInputElement & { tooltip: Tooltip }
	/** The range slider. */
	slider: HTMLInputElement
}

export type NumberInputOptions = {
	readonly __type?: 'NumberInputOptions'
	/**
	 * The minimum value (lowest/inclusive).
	 * @defaultValue 0 for positive numbers, `initialValue * 2` for negative numbers.
	 */
	min?: number
	/**
	 * The maximum value (highest/inclusive).
	 * @defaultValue `initialValue * 2` for positive numbers, `initialValue * -2` for negative numbers.
	 */
	max?: number
	/**
	 * The amount to increment/decrement by.
	 * @defaultValue 0.001 if the value is small (less than 10), otherwise 0.1
	 */
	step?: number
} & InputOptions<number>

export const NUMBER_INPUT_DEFAULTS: NumberInputOptions = {
	__type: 'NumberInputOptions' as const,
} as const

/**
 * A combined input with a traditional text input, increment/decrement buttons, and a slider.
 *
 * @example
 * ```ts
 * gooey.add('foo', 0)
 * gooey.addNumber('bar', 10)
 * gooey.bind({ baz: 100 }, 'baz')
 * ```
 *
 * Hold down `cmd`/`ctrl` to snap to drag the number text input.
 *
 * Hold down `shift` to double the step, and `option`/`alt` to halve it (this works both on the slider, and when dragging the text input).
 */
export class InputNumber extends Input<number, NumberInputOptions, NumberControllerElements> {
	readonly __type = 'InputNumber' as const
	private _log: Logger
	initialValue: number
	state: State<number>

	dragEnabled = false // todo - Move this into the number controller?
	numberController: NumberController
	numberButtonsController: NumberButtonsController

	constructor(options: Partial<NumberInputOptions>, folder: Folder) {
		const opts = Object.assign({}, NUMBER_INPUT_DEFAULTS, options, {
			__type: 'NumberInputOptions' as const,
		})

		// Smart defaults.
		let v = opts.binding?.initial ?? opts.value ?? 1
		opts.value ??= v

		let min = 0
		let max = 1
		let step = 0.01

		// If the value is between [0..1], then it's nicer to keep the defaults.
		// Otherwise, we can adjust them dynamically to be more useful.
		if (v < 0 || v > 1) {
			min = v <= 0 ? v * 2 : 0
			max = v <= 0 ? v * -2 : v * 2
			step = Math.abs(v) < 10 ? 0.001 : 0.1
		}

		opts.min ??= min
		opts.max ??= max
		opts.step ??= step

		super(opts, folder)

		this._log = new Logger(`InputNumber ${opts.title}`, { fg: 'cyan' })
		this._log.fn('constructor').debug({ opts, this: this })

		this.initialValue = this.resolveInitialValue(opts)
		this.state = this.resolveState(opts)

		const container = create('div', {
			classes: ['gooey-input-number-container'],
			parent: this.elements.content,
		})

		this.numberController = new NumberController(this, opts, container)
		this.numberButtonsController = new NumberButtonsController(this, opts, container)

		this.elements.controllers = {
			container,
			input: this.numberController.element,
			buttons: this.numberButtonsController.elements,
			slider: rangeController(this, opts, container),
		} as const satisfies NumberControllerElements

		this._evm.add(this.state.subscribe(this.refresh))

		this._evm.listen(this.elements.controllers.slider, 'pointerdown', this.lock)
		this._evm.listen(this.elements.controllers.slider, 'pointerup', () => this.unlock())

		this._evm.listen(this.elements.controllers.input, 'input', this.set)

		this._evm.listen(this.elements.controllers.input, 'dragStart', this.lock)
		this._evm.listen(this.elements.controllers.input, 'dragEnd', () => this.unlock())
	}

	set = (v?: number | Event) => {
		this._log.fn('set').debug(v)

		if (typeof v === 'undefined') return

		let newValue = v as number

		if (v instanceof Event && v?.target && 'valueAsNumber' in v.target) {
			newValue = +(v.target as HTMLInputElement).value || 0
		}

		this.commit({ to: newValue })
		this.state.set(newValue)

		this.emit('change', newValue)
		return this
	}

	refresh = () => {
		const v = this.state.value
		this._log.fn('refresh').debug(v)
		this.elements.controllers.slider.value = String(v)
		this.elements.controllers.input.value = String(v)
		super.refresh(v)
		return this
	}

	dispose() {
		this._log.fn('dispose').debug()
		super.dispose()
	}
}
