/**
 * TODO Failing tests: `bun run vitest --browser.headless src/Folder.test.ts`
 */

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
	'onChange'
> & {
	__type?: 'SelectInputOptions'
	onChange?: (value: LabeledOption<T>) => void
	/**
	 * For arrays of unlabeled objects, labelKey specifies a key to use as the label.
	 * If none is provided, select will attempt to use a `label` or `title` key if they exist.
	 * If neither exist, an error will be thrown.
	 */
	labelKey?: T extends Record<infer K, any> ? K : string
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

export interface SelectInputEvents<T> extends InputEvents<T> {
	/**
	 * Emitted when an option is selected, providing the full LabeledOption.
	 * Use this when you need access to both the value and label.
	 */
	select: LabeledOption<T>
	/**
	 * Emitted when hovering over an option (preview).
	 */
	preview: LabeledOption<T>
	open: void
	close: void
	cancel: void
}

export class InputSelect<TValueType extends ValidInputValue = any> extends Input<
	TValueType,
	SelectInputOptions<TValueType>,
	SelectControllerElements<TValueType>,
	SelectInputEvents<TValueType>
> {
	readonly __type = 'InputSelect' as const
	readonly initialValue: TValueType

	/**
	 * Reactive state containing the raw value (T, not LabeledOption<T>).
	 * This is automatically kept in sync with `selected`.
	 * Consistent with other Input types.
	 */
	state: State<TValueType>

	/**
	 * The currently selected option (full LabeledOption<T> with both label and value).
	 * This is the source of truth for the selection. When this changes, `state` is
	 * automatically updated with the raw value.
	 */
	selected: State<LabeledOption<TValueType>>

	/**
	 * The raw value of the currently selected option (just T, not LabeledOption<T>).
	 * Consistent with other Input types.
	 */
	override get value(): TValueType {
		// @ts-expect-error - Safe: TValueType extends ValidInputValue which includes arrays, but InputSelect
		// only receives primitive values. TypeScript can't narrow the State<T> conditional type for generics.
		return this.state.value
	}

	override set value(v: TValueType) {
		// For primitives, use strict equality
		if (typeof v !== 'object' || v === null) {
			const option = this.options.find(o => o.value === v)
			if (option) {
				this.selected.set(option)
				return
			}
		}

		let value = isLabeledOption(v) ? v.value : v

		// For objects, use JSON stringify for deep comparison.
		const vStr = JSON.stringify(value)
		const option = this.options.find(o => JSON.stringify(o.value) === vStr)

		if (option) {
			this.selected.set(option)
		} else {
			console.warn(
				`InputSelect: Could not find option with value`,
				value,
				'in options',
				this.options,
			)
		}
	}

	#options: () => TValueType[]
	set options(v: SelectInputOptions['options']) {
		this._log.fn('set options').debug(v)
		v ??= []
		this.#options = toFn(v)

		this.selectController.clear()

		for (const option of fromState(this.#options())) {
			this.selectController.add(option as Option<TValueType>)
		}
	}
	/**
	 * The options array of valid values for this select input.
	 */
	get options(): LabeledOption<TValueType>[] {
		return this.resolveOptions(this.#options())
	}

	/**
	 * The select controller instance.
	 */
	selectController: Select<TValueType>

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

		this._evm.registerEvents(['select', 'preview', 'open', 'close', 'cancel'])

		this._log = new Logger(`InputSelect ${opts.title}`, { fg: 'slategrey' })
		this._log.fn('constructor').debug({ opts, this: this })

		// Handle the inline { value, options } pattern.
		// When the value itself is an object with both 'value' and 'options' properties,
		// extract them and use them instead of treating the whole object as the value.
		const v = opts.value
		if (v && typeof v === 'object' && !Array.isArray(v) && 'value' in v && 'options' in v) {
			const config = v as { value: TValueType; options: Array<any> }
			opts.value = config.value
			opts.options = config.options
		}

		opts.value ??= opts.binding?.initial ?? fromState(this.targetValue)
		this.initialValue = this.resolveInitialValue(opts)

		this.labeledSelection = {
			value: fromLabeledOption(this.initialValue),
			label: this.resolveInitialLabel(this.initialValue, opts),
		}

		this.#options = toFn(this.opts.options ?? [])

		// Initialize selected with the full LabeledOption
		this.selected = state(this.labeledSelection)

		// Initialize state as a derived state that extracts the raw value from selected
		this.state = state(this.selected.value.value)

		// Keep state in sync with selected
		this._evm.add(
			this.selected.subscribe(labeledOption => {
				// @ts-expect-error - Safe: labeledOption.value is TValueType, but TypeScript can't narrow
				// the State<T> conditional type for generics (sees union of ArrayState | MapState | etc)
				this.state.set(labeledOption.value)
			}),
		)

		const container = create('div', {
			classes: ['gooey-input-select-container'],
			parent: this.elements.content,
		})

		this.selectController = new Select({
			// @ts-expect-error - ¯\_(ツ)_/¯
			input: this,
			container,
			options: this.options,
			selected: this.labeledSelection,
			title: this.title,
		})

		this.elements.controllers = {
			container,
			select: this.selectController.elements,
		} as const satisfies SelectControllerElements<TValueType>

		this.disabled = opts.disabled ?? false

		this._evm.add(
			this.selected.subscribe(v => {
				if (!this.selectController.bubble) return

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
						.fn('selected.subscribe')
						.debug('Stopped propagation.  Subscribers will not be notified.')
					return
				}

				this.select(v)
			}),
		)

		if (options.onChange) {
			this._evm.on('change', v => {
				this._log.fn('calling options onChange').debug(v)
				options.onChange?.(toLabeledOption(v))
			})
		}

		// Bind our state to the select controller.
		this.selectController.on('change', v => {
			this._log.fn('select.onChange').debug(v)
			if (this.#stopPropagation) return
			// Make sure the select controller doesn't react to its own changes.
			this.#stopPropagation = true
			this.select(v)
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

		this.listen(this.selectController.element, 'preview', () => {
			this.emit('preview')
		})
		this.listen(this.selectController.element, 'open', () => {
			this.emit('open')
		})
		this.listen(this.selectController.element, 'close', () => {
			this.emit('close')
		})
		this.listen(this.selectController.element, 'cancel', () => {
			this.emit('cancel')
		})

		// Override the default dirty check to use an option's `label` for equality checks.
		this._dirty = () => this.selected.value.label !== this.labeledSelection.label

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
				// prettier-ignore
				// Try to fallback to 'label' key if it exists.
				if (selectOptions.every(o => o && typeof o === 'object' && 'label' in o && typeof o.label === 'string')) {
					return selectOptions.map(o => ({
						label: (o as TValueType & { label: string }).label,
						value: o,
					}))
				}

				// prettier-ignore
				// Try to fallback to 'title' key if it exists.
				if (selectOptions.every(o => o && typeof o === 'object' && 'title' in o && typeof o.title === 'string')) {
					return selectOptions.map(o => ({
						label: (o as TValueType & { title: string }).title,
						value: o,
					}))
				}

				throw new Error(
					'Recieved unlabeled options with no `labelKey` specified.  Please label your options or provide the `labelKey` to use as a label.',
				)
			}

			return selectOptions.map(o => ({
				label: o[this.opts.labelKey as unknown as keyof typeof o] as string,
				value: o,
			}))
		}

		return selectOptions
	}

	resolveInitialValue(opts: SelectInputOptions<TValueType>): TValueType {
		const value = opts.binding ? opts.binding.target[opts.binding.key] : opts.value!
		return fromState(value)
	}

	resolveInitialLabel(initialValue: TValueType, opts: SelectInputOptions<TValueType>): string {
		const v = isState(initialValue) ? initialValue.value : initialValue

		this._log.fn('resolveInitialLabel').debug({ v, initialValue, opts })

		if (isLabeledOption(v)) {
			return v.label
		}

		// If we have options, try to find a matching labeled option for the initialValue.
		if (opts.options && Array.isArray(opts.options) && opts.options.length > 0) {
			// Check if the first option is already a labeled option.
			if (isLabeledOption(opts.options[0])) {
				const labeledOptions = opts.options as LabeledOption<TValueType>[]
				// For primitives, use strict equality.
				if (typeof v !== 'object' || v === null) {
					const match = labeledOptions.find(o => o.value === v)
					if (match) return match.label
				} else {
					// For objects, use JSON stringify for deep comparison.
					const vStr = JSON.stringify(v)
					const match = labeledOptions.find(o => JSON.stringify(o.value) === vStr)
					if (match) return match.label
				}
			}
		}

		if (opts.labelKey) {
			return initialValue[opts.labelKey as unknown as keyof typeof initialValue] as string
		}

		if (v && typeof v === 'object') {
			if ('title' in v && typeof v.title === 'string') return v.title
			if ('label' in v && typeof v.label === 'string') return v.label
			return stringify(v)
		}

		return String(v)
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
	 * Sets the value (required by base Input class).
	 * This accepts the raw value and finds the corresponding option.
	 */
	set(v: TValueType): void {
		this.value = v
	}

	/**
	 * Selects the given {@link LabeledOption} and updates the ui.
	 * Use this when you have the full labeled option.
	 */
	select(value: LabeledOption<TValueType>) {
		this._log.fn('select').debug(value)

		this.#stopPropagation = true
		this.selectController.select(value, false)
		this.selected.set(value)
		this.emit('change', value.value)
		// @ts-expect-error - Safe: 'select' event expects LabeledOption<T>, but TypeScript's event
		// manager type inference doesn't properly handle custom event types in extended interfaces
		this.emit('select', value)

		return this
	}

	enable() {
		this._log.fn('enable').debug()
		this.disabled = false
		this.selectController.enable()
		return this
	}

	disable() {
		this._log.fn('disable').debug()
		this.disabled = true
		this.selectController.disable()
		return this
	}

	refresh = () => {
		const v = this.selected.value
		this._log.fn('refresh').debug({ v, this: this })

		if (!this.labeledSelection) {
			throw new Error('Failed to find labeled selection.')
		}

		const newOptions = this.options.filter(
			o => !this.selectController.options.some(oo => oo.label === o.label),
		)

		for (const option of newOptions) {
			this.selectController.add(option)
		}
		this.selectController.select(this.labeledSelection, false)

		super.refresh()
		return this
	}

	dispose() {
		super.dispose()
	}
}
