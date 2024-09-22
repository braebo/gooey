import type { InputButtonGrid, ButtonGridInputOptions } from './InputButtonGrid'
import type { InputTextArea, TextAreaInputOptions } from './InputTextArea'
import type { InputButton, ButtonInputOptions } from './InputButton'
import type { InputSwitch, SwitchInputOptions } from './InputSwitch'
import type { InputSelect, SelectInputOptions } from './InputSelect'
import type { InputNumber, NumberInputOptions } from './InputNumber'
import type { InputColor, ColorInputOptions } from './InputColor'
import type { InputText, TextInputOptions } from './InputText'

import type { ColorFormat } from '../shared/color/types/colorFormat'
import type { LabeledOption, Option } from '../controllers/Select'
import type { EventCallback } from '../shared/EventManager'
import type { TooltipOptions } from '../shared/Tooltip'
import type { CreateOptions } from '../shared/create'
import type { Color } from '../shared/color/color'
import type { State } from '../shared/state'
import type { Commit } from '../UndoManager'
import type { Folder } from '../Folder'

import { EventManager } from '../shared/EventManager'
import { isState, state } from '../shared/state'
import { keys, values } from '../shared/object'
import { create } from '../shared/create'
import { Logger } from '../shared/logger'
import { toFn } from '../shared/toFn'
import { o } from '../shared/l'

//· Types ··············································································¬
export type InputType = (typeof INPUT_TYPES)[number]
export type InputOptionType = (typeof INPUT_OPTION_TYPES)[number]

export const INPUT_TYPE_MAP = Object.freeze({
	InputText: 'TextInputOptions',
	InputTextArea: 'TextAreaInputOptions',
	InputNumber: 'NumberInputOptions',
	InputColor: 'ColorInputOptions',
	InputSelect: 'SelectInputOptions',
	InputButton: 'ButtonInputOptions',
	InputButtonGrid: 'ButtonGridInputOptions',
	InputSwitch: 'SwitchInputOptions',
})

export const INPUT_TYPES = Object.freeze(keys(INPUT_TYPE_MAP))
export const INPUT_OPTION_TYPES = Object.freeze(values(INPUT_TYPE_MAP))

export type BindTarget = Record<any, any>
export type BindableObject<T extends BindTarget, K extends keyof T = keyof T> = {
	target: T
	key: K
	initial?: T[K]
}

/**
 * The initial value of an input can be either a raw value, or a "binding"
 */
export type ValueOrBinding<TValue = ValidInputValue, TBindTarget extends BindTarget = BindTarget> =
	// todo - this is silly
	| {
			value: TValue
			binding?: BindableObject<TBindTarget>
	  }
	| {
			value?: TValue
			binding: { target: TBindTarget; key: keyof TBindTarget; initial?: TValue }
	  }
	| {
			value?: TValue
			binding?: { target: TBindTarget; key: keyof TBindTarget; initial?: TValue }
	  }
	| {
			value: TValue
			binding?: { target: TBindTarget; key: keyof TBindTarget; initial?: TValue }
	  }

export type InputOptions<
	TValue = ValidInputValue,
	TBindTarget extends BindTarget = Record<any, any & TValue>,
> = {
	/**
	 * The title displayed to the left of the input.
	 */
	title?: string

	/**
	 * If provided, will be used as the key for the input's value in a preset.
	 * @defaultValue `<folder_title>:<input_type>:<input_title>`
	 */
	presetId?: string

	/**
	 * Whether the inputs are disabled.  A function can be used to dynamically determine the
	 * disabled state.
	 * @default false
	 */
	disabled?: boolean | (() => boolean)

	/**
	 * Whether the input is hidden. A function can be used to dynamically determine the hidden
	 * state.
	 * @default false
	 */
	hidden?: boolean

	/**
	 * The order in which this input should appear in its folder relative to the other inputs.
	 * - To force an input to be first *(at the top of its folder)*, set `order` to `0` or below.
	 * - To force an input to be last *(at the bottom of its folder)*, set `order` to any number greater than number of inputs + 1.
	 * @default folder.inputs.size + 1
	 */
	order?: number

	/**
	 * If true, the `reset to default` button will appear when the input's value is marked dirty.
	 * @default true
	 */
	resettable?: boolean

	/**
	 * Whether this Input should be saved as a {@link InputPreset} when saving the
	 * {@link FolderPreset} for the {@link Folder} this Input belongs to.  If `false`, this Input
	 * will be skipped.
	 * @default true
	 */
	saveable?: boolean

	/**
	 * An optional callback to run when this Input's state changes.  Also accessible via
	 * `Input.on('change', value => {})`.
	 */
	onChange?: (value: TValue) => void

	/**
	 * Optional tooltip text to display when hovering over the input's title.
	 */
	description?: string

	/**
	 * When {@link description} is provided, these options can be used to customize the tooltip.
	 */
	tooltipOptions?: Partial<TooltipOptions>
} & ValueOrBinding<TValue, TBindTarget>

export type InputPreset<T extends ValidInputOptions> = Omit<
	InputOptions<T>,
	'title' | 'saveable'
> & {
	__type: InputOptionType
	presetId: string
	title: string
	value: ValidInputValue
	disabled: boolean
	hidden: boolean
	order: number
	resettable: boolean
}

export interface ElementMap<T = unknown> {
	[key: string]: HTMLElement | HTMLInputElement | ElementMap | T
}

export type ValidInputValue =
	| string
	| number
	| Color
	| ColorFormat
	| Option<any>
	| LabeledOption<any>
	| any[]
	| (() => void)

export type ValidInputOptions =
	| TextInputOptions
	| TextAreaInputOptions
	| NumberInputOptions
	| ColorInputOptions
	| SelectInputOptions<Option<any>>
	| ButtonInputOptions
	| ButtonGridInputOptions
	| SwitchInputOptions

export type ValidInput =
	| InputText
	| InputTextArea
	| InputNumber
	| InputColor
	| InputSelect<Option<any>>
	| InputButton
	| InputButtonGrid
	| InputSwitch

export type InputEvents<T extends ValidInputValue = ValidInputValue> = {
	/**
	 * Called when the input's value changes, providing the new value.
	 */
	readonly change: T
	/**
	 * Called when a input's controllers are refreshed, providing the current value of the input.
	 */
	readonly refresh: T
}
//⌟

/**
 * An input that can be added to a {@link Folder}.  This class is extended by all
 * {@link ValidInput} classes. Inputs occupy a single row in a folder, and are in charge of
 * managing a single state value.  Inputs often combine multiple controllers to provide a rich
 * user interface for interacting with the input's value.
 *
 * @template TValueType - The type of value this input manages.
 * @template TOptions - The options object for this input, determined by the input class
 * responsible for the {@link TValueType}.
 * @template TElements - A map of all HTMLElement's created by this input.
 * @template TEvents - A map of all events emitted by this input.
 * @template TType - A string-literal type brand.  Identical to the input class name.
 */
export abstract class Input<
	TValueType extends ValidInputValue = ValidInputValue,
	TOptions extends ValidInputOptions = InputOptions,
	TElements extends ElementMap = ElementMap,
	TEvents extends InputEvents = InputEvents<TValueType>,
	TType extends InputType = InputType,
	T__TYPE = (typeof INPUT_TYPE_MAP)[TType],
> {
	abstract readonly __type: TType
	/**
	 * A {@link State} observable, the source of truth for the input's value.  It can be subscribed
	 * to with {@link State.subscribe} to listen for changes.
	 */
	abstract state: State<TValueType>
	/**
	 * The initial value of the input when it was created, used for things like dirty checking and
	 * the "reset to default" button.
	 */
	abstract initialValue: ValidInputValue

	/**
	 * The options object used to create this input.  More specifically, the input's default
	 * options merged with the options passed by the consumer.
	 */
	readonly opts: TOptions & { __type: T__TYPE }

	/**
	 * Unique identifier for the input. Also used for saving and loading presets.
	 * @default `<folder_title>:<input_type>:<input_title>`
	 */
	id: string

	/**
	 * Whether the input was initialized with a bind target/key.
	 * @default false
	 */
	bound = false

	/**
	 * All HTMLElement's created by this input.
	 */
	elements = {
		controllers: {},
	} as {
		container: HTMLElement
		title: HTMLElement
		content: HTMLElement
		drawer: HTMLElement
		drawerToggle: HTMLElement
		controllers: TElements
		resetBtn: HTMLElement
	}

	/**
	 * Whether the controllers should bubble their events up to the input and it's listeners.
	 * If false, the next update will be silent, after which the flag will be reset to true.
	 */
	bubble = false

	private _title = ''
	private _index: number
	private _description: () => string = () => ''
	private _disabled: () => boolean
	private _hidden: () => boolean

	/**
	 * Prevents the input from registering commits to undo history until
	 * {@link unlock} is called.
	 */
	private _undoLock = false

	/**
	 * The commit object used to store the initial value of the input when
	 * {@link lock} is called.
	 */
	private lockCommit = {} as Commit

	/**
	 * The input's {@link EventManager}.
	 */
	protected _dirty: () => boolean
	protected _evm = new EventManager<TEvents>(['change', 'refresh'])
	listen = this._evm.listen.bind(this._evm)
	on = this._evm.on.bind(this._evm)

	private __log: Logger

	constructor(
		options: TOptions & { __type: T__TYPE },
		public folder: Folder,
	) {
		this.opts = options
		this.opts.saveable ??= true
		this.opts.resettable ??= true

		this.id = this.opts.presetId ?? `${folder.presetId}_${this.opts.title}__${this.opts.__type}`

		this.__log = new Logger(
			`SuperInput${this.opts.__type!.replaceAll(/Options|Input/g, '')} ${this.opts.title}`,
			{ fg: 'skyblue' },
		)
		this.__log.fn('super constructor').debug({ presetId: this.id, options, this: this })

		this._title = this.opts.title ?? ''

		this._description =
			typeof this.opts.description === 'function'
				? this.opts.description
				: typeof this.opts.description === 'string'
					? () => `${this.opts.description}`
					: () => (this.disabled ? '🚫 disabled' : '')

		this._disabled =
			typeof this.opts.disabled === 'function'
				? this.opts.disabled
				: typeof this.opts.disabled === 'boolean'
					? () => !!this.opts.disabled
					: () => this.elements.container.classList.contains('disabled')

		this._hidden =
			typeof this.opts.hidden === 'function'
				? this.opts.hidden
				: () => this.elements.container.classList.contains('hidden')

		this._index = this.opts.order ?? this.folder.inputs.size
		this._index += 1

		this._dirty = () => this.value !== this.initialValue

		this.bound = 'binding' in this.opts

		this.elements.container = create('div', {
			classes: ['gooey-input-container'],
			parent: this.folder.elements.content,
		})

		// Make the right side full-width if the title is empty.
		if (!this.title) {
			this.element.style.setProperty('--gooey-input-section-1_width', '0px')
		}

		const drawerToggleOptions: Partial<CreateOptions> = {
			classes: ['gooey-input-drawer-toggle'],
			parent: this.elements.container,
		}

		if (this.opts.description) {
			drawerToggleOptions.classes!.push('has-description')
		}

			drawerToggleOptions.tooltip = {
			text: this._description,
				placement: 'left',
				delay: 0,
				offsetX: '-4px',
				...this.opts.tooltipOptions,
				style: () => ({
					'text-align': 'left',
					'padding-left': '8px',
					// @ts-expect-error @internal
					...this.folder.gooey?._getStyles(),
				}),
		}

		this.elements.drawerToggle = create('div', drawerToggleOptions)

		this.elements.title = create('div', {
			classes: ['gooey-input-title'],
			parent: this.elements.container,
			innerHTML: this.title.replaceAll(/-|_/g, ' '),
		})

		this.elements.content = create('div', {
			classes: ['gooey-input-content'],
			parent: this.elements.container,
		})

		this.elements.resetBtn = create('div', {
			classes: ['gooey-input-reset-btn'],
			parent: this.elements.title,
			tooltip: {
				text: !this.opts.resettable
					? undefined
					: () => {
							let text = this.initialValue

							if (typeof text === 'object') {
								switch (this.__type) {
									case 'InputSelect': {
										if ('labelKey' in this.opts) {
											text = text[this.opts.labelKey as keyof typeof text]
											break
										}
										if ('label' in text) {
											text = text.label
											break
										}
									}
									case 'InputColor': {
										if ('hex' in text) {
											text = text[(this as any as InputColor).mode] as string

											if (CSS.supports('color', text)) {
												return `Reset · <em style="color:${text}">${text}</em>`
											}
											break
										}
									}
									default: {
										try {
											text = JSON.stringify(text)
										} catch (e) {
											console.error(e, { text, this: this })
											throw new Error(e as any)
										}
									}
								}
							} else if (typeof text === 'boolean') {
								if (this.__type === 'InputSwitch') {
									text = `${text}`
									text =
										(this as any as InputSwitch).opts.labels?.[
											text as 'true' | 'false'
										].state ?? text
									return `Reset · <em>${text}</em>`
								}
							}

							return `Reset · <em style="opacity:0.5;">${text}</em>`
						},
				placement: 'left',
				delay: 0,
				// @ts-expect-error
				style: this.folder.gooey?._getStyles,
			},
			onclick: () => {
				this.__log.fn('reset').debug('resetting to initial value', this.initialValue)
				this.set(this.initialValue as TValueType)
			},
		})

		this.elements.drawer = create('div', {
			classes: ['gooey-input-drawer'],
			parent: this.elements.content,
		})

		this._evm.listen(this.elements.drawerToggle, 'click', () => {
			console.log(this)
		})

		if ('onChange' in options) {
			this._evm.on('change', options.onChange as EventCallback<TEvents['change']>)
		}

		this.index = this.index
		this.elements.container.classList.toggle('hidden', this._hidden())

		setTimeout(() => {
			this._refreshDisabled()
			if (this.description) {
				this.elements.drawerToggle.classList.add('has-description')
			}
		}, 1)
	}

	get value() {
		return this.state.value as TValueType
	}
	set value(v: TValueType) {
		// @ts-expect-error - grr
		this.state.set(v)
	}

	/**
	 * The title displayed on this Input's label.
	 */
	get title() {
		return this._title
	}
	set title(v: string) {
		this._title = v
		this.elements.title.innerHTML = v.replaceAll(/-|_/g, ' ')
	}

	/**
	 * The main Element.  Usually a container div for the rest of the Input's
	 * {@link Input.elements|`elements`}.
	 */
	get element() {
		return this.elements.container
	}

	/**
	 * The index of the input in the folder relative to other inputs.  Setting or changing this
	 * value will update the input's {@link element|`element`}'s order style property.
	 */
	get index() {
		return this._index
	}
	set index(v: number) {
		this._index = v
		this.elements.container.style.order = v.toString()
	}

	get undoManager() {
		return this.folder.gooey?._undoManager
	}

	/**
	 * The description of the input, displayed when hovering over the thin
	 * tab element found on the far left of the input's row.
	 */
	get description(): string {
		return this._description()
	}
	set description(v: string) {
		this._description = toFn(v)
		this.elements.drawerToggle.classList.add('has-description')
	}

	/**
	 * Whether the input is disabled (non-interactive / dimmed).
	 *
	 * For dynamic disabled states, assign this to a function and it will be called whenever
	 * {@link refresh} is called.  Keep in mind that calling {@link enable} or {@link disable}
	 * will not prevent a dynamic disabled state function from running on the next {@link refresh}.
	 */
	get disabled(): boolean {
		return this.elements.container.classList.contains('disabled')
	}
	set disabled(v: boolean | (() => boolean)) {
		if (typeof v === 'function') {
			this._disabled = v
			this._refreshDisabled(v())
		} else {
			this._refreshDisabled(v)
		}

		if (!this.description) {
			this._description = () => (this.disabled ? '🚫 disabled' : '')
			this.elements.drawerToggle.classList.add('has-description')
		} else if (v && this.elements.drawerToggle.classList.contains('has-description')) {
			this.elements.drawerToggle.classList.remove('has-description')
		}
	}

	/**
	 * Disables the input and any associated controllers. A disabled input can't be interacted
	 * with, and its state can't be changed.
	 */
	disable() {
		this.disabled = true
		return this
	}

	/**
	 * Removes the disabled state from the input and any associated controllers.
	 */
	enable() {
		this.disabled = false
		return this
	}

	/**
	 * Updates the disabled state of the input container and the main input element if it exists.
	 */
	private _refreshDisabled(disabled = this._disabled()) {
		this.element.toggleAttribute('disabled', disabled)
		this.element.classList.toggle('disabled', disabled)

		if ('input' in this.elements.controllers) {
			const input = this.elements.controllers['input']
			if (input instanceof HTMLInputElement) {
				input.disabled = disabled
			}
		}
	}

	/**
	 * Completely hides the Input from view when set to `true`.
	 */
	get hidden(): boolean {
		return this.elements.container.classList.contains('hidden')
	}
	set hidden(v: boolean | (() => boolean)) {
		this._hidden = toFn(v)
		this.elements.container.classList.toggle('hidden', this._hidden())
	}

	/**
	 * Wether the current state value differs from the initial state value.
	 * @internal
	 */
	protected get dirty() {
		return this._dirty()
	}

	/**
	 * Updates the Input's state to the given value.
	 */
	abstract set(v: TValueType): void

	protected resolveState<T = TValueType>(opts: TOptions): State<T> {
		if (opts.binding) {
			const s = state<T>(opts.binding.target[opts.binding.key])

			this._evm.add(
				s.subscribe(v => {
					opts.binding!.target[opts.binding!.key] = v
				}),
			)

			return s
		} else {
			return state<T>(opts.value!)
		}
	}

	protected resolveInitialValue(opts: TOptions) {
		const value = opts.binding ? opts.binding.target[opts.binding.key] : opts.value!
		return isState(value) ? value.value : value
	}

	/**
	 * Called from subclasses at the end of their `set` method to emit the `change` event.
	 */
	_emit(event: keyof TEvents, v = this.state.value as TValueType) {
		if (this.opts.resettable) {
			this.elements.resetBtn.classList.toggle('dirty', this._dirty())
		}

		// @ts-expect-error
		this._evm.emit(event, v)

		// Let the folder know one of its inputs has changed.
		if (event === 'change') {
			this.folder.evm.emit('change', this as any as ValidInput)
		}

		return this
	}

	/**
	 * Prevents the input from registering undo history, storing the initial
	 * for the eventual commit in {@link unlock}.
	 */
	protected lock = (from = this.state.value) => {
		this._undoLock = true
		this.lockCommit.from = from
		this.__log.fn(o('lock')).debug('lockCommit:', this.lockCommit)
	}
	/**
	 * Unlocks commits and saves the current commit stored in lock.
	 */
	protected unlock = (commit?: Partial<Commit>) => {
		this.__log.fn(o('unlock')).debug('commit', { commit, lockCommit: this.lockCommit })
		commit ??= {}
		commit.target ??= this as unknown as Input<TValueType>
		commit.to ??= this.state.value as TValueType
		commit.from ??= this.lockCommit.from
		this._undoLock = false
		this.commit(commit)
	}

	/**
	 * Commits a change to the input's value to the undo manager.
	 */
	commit(commit: Partial<Commit>) {
		commit.from ??= this.state.value
		commit.target ??= this as unknown as Input<TValueType>
		if (this._undoLock) {
			this.__log.fn('commit').debug('prevented commit while locked')
			return
		}
		this.__log.fn('commit').debug('commited', commit)
		this.undoManager?.commit(commit as Commit)
	}

	/**
	 * Refreshes the value of any controllers to match the current input state.
	 */
	refresh(v = this.state.value as TValueType) {
		if (!this.opts.resettable) return

		if (this.opts.binding) {
			this.state.set(this.opts.binding.target[this.opts.binding.key])
		}

		this._refreshDisabled()

		this.elements.resetBtn.classList.toggle('dirty', this._dirty())

		this._evm.emit('refresh', v as TValueType)
		return this
	}

	save(overrides: Partial<InputPreset<TOptions>> = {}) {
		if (this.opts.saveable !== true) {
			throw new Error('Attempted to save unsaveable Input: ' + this.title)
		}

		const preset: InputPreset<any> = {
			__type: INPUT_TYPE_MAP[this.__type],
			title: this.title,
			value: this.state.value,
			disabled: this.disabled,
			presetId: this.id,
			hidden: this.hidden,
			order: this.index,
			resettable: this.opts.resettable ?? true,
		}

		this.__log.fn('save').debug(preset)

		return Object.assign(preset, overrides)
	}

	load(json: InputPreset<TOptions> | string) {
		const data = typeof json === 'string' ? (JSON.parse(json) as InputPreset<TOptions>) : json
		this.id = data.presetId
		this.disabled = data.disabled
		this.hidden = data.hidden
		this.initialValue = data.value
		this.set(data.value as TValueType)
	}

	dispose() {
		this.__log.fn('dispose').debug(this)
		this._evm.dispose()
	}
}
