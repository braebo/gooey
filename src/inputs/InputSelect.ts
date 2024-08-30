import type { ElementMap, InputEvents, InputOptions, ValidInputValue } from './Input'
import type { Option, LabeledOption } from '../controllers/Select'
import type { State } from '../shared/state'
import type { Folder } from '../Folder'

import { Select, isLabeledOption, toLabeledOption, fromLabeledOption } from '../controllers/Select'
import { fromState, isState, state } from '../shared/state'
import { stringify } from '../shared/stringify'
import { Logger } from '../shared/logger'
import { create } from '../shared/create'
import { toFn } from '../shared/toFn'
import { Input } from './Input'

export type SelectInputOptions<T = ValidInputValue> = Omit<
	InputOptions<T | { label: string; value: T }>,
	'onChange' | 'value'
> & {
	__type?: 'SelectInputOptions'
	onChange?: (value: LabeledOption<T>) => void
} & {
	labelKey?: string
	value?: T
	options?: Array<T>
}

export const SELECT_INPUT_DEFAULTS: SelectInputOptions = {
	__type: 'SelectInputOptions' as const,
	options: [],
} as const

export interface SelectControllerElements<T> extends ElementMap {
	container: HTMLElement
	select: Select<T>['elements']
}

export interface SelectInputEvents<T> extends InputEvents<LabeledOption<T>> {
	preview: LabeledOption<T>
	open: void
	close: void
	cancel: void
}

export class InputSelect<TValueType extends ValidInputValue = any> extends Input<
	LabeledOption<TValueType>,
	SelectInputOptions<TValueType>,
	SelectControllerElements<TValueType>,
	SelectInputEvents<TValueType>
> {
	readonly __type = 'InputSelect' as const
	readonly initialValue: LabeledOption<TValueType>
	state: State<LabeledOption<TValueType>>

	#options: () => TValueType[]
	set options(v: SelectInputOptions['options']) {
		this._log.fn('set options').debug(v)
		v ??= []
		this.#options = toFn(v)

		this.select.clear()

		for (const option of fromState(this.#options())) {
			this.select.add(option as Option<TValueType>)
		}
	}
	get options(): LabeledOption<TValueType>[] {
		return this.resolveOptions(this.#options())
	}

	/**
	 * The select controller instance.
	 */
	select: Select<TValueType>

	/**
	 * A latch for event propagation. Toggled off everytime an event aborted.
	 */
	#stopPropagation = true

	/**
	 * The currently selected option as a labeled option.
	 */
	labeledSelection: LabeledOption<TValueType>

	private _log: Logger

	constructor(options: Partial<SelectInputOptions<TValueType>>, folder: Folder) {
		const opts = Object.assign(
			{},
			SELECT_INPUT_DEFAULTS as SelectInputOptions<TValueType>,
			options,
			{
				__type: 'SelectInputOptions' as const,
			},
		)

		super(opts, folder)

		this._evm.registerEvents(['preview', 'open', 'close', 'cancel'])

		this._log = new Logger(`InputSelect ${opts.title}`, { fg: 'slategrey' })
		this._log.fn('constructor').debug({ opts, this: this })

		opts.value ??= opts.binding?.initial ?? fromState(this.targetValue)
		this.initialValue = this.resolveInitialValue(opts)

		this.labeledSelection = {
			value: fromLabeledOption(this.initialValue),
			label: this.resolveInitialLabel(this.initialValue, opts),
		}

		this.#options = toFn(this.opts.options ?? [])

		this.state = state(this.initialValue)

		const container = create('div', {
			classes: ['gooey-input-select-container'],
			parent: this.elements.content,
		})

		this.select = new Select({
			// @ts-expect-error - ¯\_(ツ)_/¯
			input: this,
			container,
			options: this.options,
			selected: this.labeledSelection,
			title: this.title,
		})

		this.elements.controllers = {
			container,
			select: this.select.elements,
		} as const satisfies SelectControllerElements<TValueType>

		this.disabled = opts.disabled ?? false

		this._evm.add(
			this.state.subscribe(v => {
				if (!this.select.bubble) return

				if (this.targetObject) {
					if (isState(this.targetValue)) {
						this._log
							.fn('updating binding')
							.debug({ from: this.targetValue.value, to: v.value })
						this.targetValue.set(v.value)
					} else {
						this.targetValue = v.value
					}
				}

				if (this.#stopPropagation) {
					this.#stopPropagation = false
					this._log
						.fn('state.subscribe')
						.debug('Stopped propagation.  Subscribers will not be notified.')
					return
				}

				this.set(v)
			}),
		)

		if (options.onChange) {
			this._evm.on('change', v => {
				this._log.fn('calling options onChange').debug(v)
				options.onChange?.(toLabeledOption(v))
			})
		}

		// Bind our state to the select controller.
		this.select.on('change', v => {
			this._log.fn('select.onChange').debug(v)
			if (this.#stopPropagation) return
			// Make sure the select controller doesn't react to its own changes.
			this.#stopPropagation = true
			this.set(v)
		})

		// todo - bind to options if it's observable ?
		// if (isState(options.options)) {
		// 	this.evm.add(
		// 		options.options.subscribe(v => {
		// 			if (isState(v)) {
		// 				this.options = v.value as T[]
		// 			}
		// 		}),
		// 	)
		// }

		this.listen(this.select.element, 'preview', () => {
			this._emit('preview')
		})
		this.listen(this.select.element, 'open', () => {
			this._emit('open')
		})
		this.listen(this.select.element, 'close', () => {
			this._emit('close')
		})
		this.listen(this.select.element, 'cancel', () => {
			this._emit('cancel')
		})

		this._dirty = () => this.value.label !== this.initialValue.label

		this._log.fn('constructor').debug({ this: this })
	}

	resolveOptions(providedOptions: TValueType[]): LabeledOption<TValueType>[] {
		function isLabeledOptionsArray(v: any): v is LabeledOption<TValueType>[] {
			return isLabeledOption(v[0])
		}

		let selectOptions = toFn(fromState(providedOptions))() as
			| TValueType[]
			| LabeledOption<TValueType>[]

		if (!isLabeledOptionsArray(selectOptions)) {
			if (!Array.isArray(selectOptions)) {
				throw new Error(`gooey: Invalid options array: "${selectOptions}"`)
			}

			if (selectOptions.every(o => typeof o === 'string')) {
				return selectOptions.map(o => ({
					label: o,
					value: o,
				}))
			}

			if (!this.opts.labelKey) {
				throw new Error(
					'Recieved unlabeled options with no `labelKey` specified.  Please label your options or provide the `labelKey` to use as a label.',
				)
			}

			return selectOptions.map(o => ({
				label: o[this.opts.labelKey as keyof typeof o] as string,
				value: o,
			}))
		}

		return selectOptions
	}

	resolveInitialValue(opts: SelectInputOptions<TValueType>): LabeledOption<TValueType> {
		const value = opts.binding ? opts.binding.target[opts.binding.key] : opts.value!
		const v = fromState(value)
		if (!isLabeledOption(v)) {
			if (typeof v === 'string') {
				return {
					label: v,
					value: v as unknown as TValueType,
				}
			}

			if (!opts.labelKey) {
				console.error('Error:', { v, value, opts })
				throw new Error(
					'Cannot resolve initial value.  Please provide a `labelKey` or use labeled options.',
				)
			}

			return {
				label: v[opts.labelKey],
				value: v,
			}
		}

		return v as LabeledOption<TValueType>
	}

	resolveInitialLabel(
		initialValue: this['initialValue'],
		opts: SelectInputOptions<TValueType>,
	): string {
		const v = isState(initialValue) ? initialValue.value : initialValue

		this._log.fn('resolveInitialLabel').debug({ v, initialValue, opts })

		if (isLabeledOption(v)) {
			return v.label
		}

		if (opts.labelKey) {
			return initialValue[opts.labelKey as keyof this['initialValue']] as string
		}

		return stringify(v)
	}

	get targetObject() {
		return this.opts.binding?.target
	}
	get targetKey() {
		return this.opts.binding?.key
	}
	get targetValue(): TValueType {
		return this.targetObject?.[this.targetKey as keyof typeof this.targetObject]
	}
	set targetValue(v: TValueType) {
		if (isLabeledOption(v)) v = fromLabeledOption(v) as TValueType
		this._log.fn('set targetValue').debug(v)

		if (typeof v === 'undefined') {
			console.error('Cannot set target value to undefined')
			console.error('this', this)
			throw new Error('Cannot set target value to undefined')
		}

		const to = this.targetObject
		const tk = this.targetKey as keyof typeof this.targetObject

		if (to && tk) {
			if (isState(to[tk])) {
				to[tk].set(v)
			} else {
				to[tk] = v
			}
		}
	}

	/**
	 * Selects the given {@link LabeledOption} and updates the ui.
	 */
	set(value: LabeledOption<TValueType>) {
		this._log.fn('set').debug(value)

		this.#stopPropagation = true
		this.select.select(value, false)
		this.state.set(value)
		this._emit('change', value)

		return this
	}

	enable() {
		this._log.fn('enable').debug()
		this.disabled = false
		this.select.enable()
		return this
	}

	disable() {
		this._log.fn('disable').debug()
		this.disabled = true
		this.select.disable()
		return this
	}

	refresh = () => {
		const v = this.state.value
		this._log.fn('refresh').debug({ v, this: this })

		if (!this.labeledSelection) {
			throw new Error('Failed to find labeled selection.')
		}

		const newOptions = this.options.filter(
			o => !this.select.options.some(oo => oo.label === o.label),
		)

		for (const option of newOptions) {
			this.select.add(option)
		}
		this.select.select(this.labeledSelection, false)

		super.refresh()
		return this
	}

	dispose() {
		super.dispose()
	}
}
