// The custom-regions extension is recommended for this file.

import { DEV } from 'esm-env'

import type {
	Input,
	InputOptions,
	InputPreset,
	InputType,
	ValidInput,
	ValidInputValue,
} from './inputs/Input'
import type { ColorFormat } from './shared/color/types/colorFormat'
import type { LabeledOption, Option } from './controllers/Select'
import type { GooeyOptions, GooeyPreset } from './Gooey'
import type { Tooltip } from './shared/Tooltip'

import { InputSwitch, type SwitchInputOptions } from './inputs/InputSwitch'
import { InputButton, type ButtonInputOptions } from './inputs/InputButton'
import { InputSelect, type SelectInputOptions } from './inputs/InputSelect'
import { InputNumber, type NumberInputOptions } from './inputs/InputNumber'
import { InputColor, type ColorInputOptions } from './inputs/InputColor'
import { InputText, type TextInputOptions } from './inputs/InputText'
import { isLabeledOption } from './controllers/Select'
import {
	InputButtonGrid,
	type ButtonGridInputOptions,
	type ButtonGridArrays,
} from './inputs/InputButtonGrid'

import { animateConnector, createFolderConnector, createFolderSvg } from './svg/createFolderSVG'
import { Color, isColor, isColorFormat } from './shared/color/color'
import { composedPathContains } from './shared/cancelClassFound'
import { fromState, state, type State } from './shared/state'
import { EventManager } from './shared/EventManager'
import { TerminalSvg } from './svg/TerminalSvg'
import { Search } from './toolbar/Search'
import { create } from './shared/create'
import { select } from './shared/select'
import { Logger } from './shared/logger'
import { nanoid } from './shared/nanoid'
import { defer } from './shared/defer'
import { toFn } from './shared/toFn'
import { Gooey } from './Gooey'

//· Types ························································································¬

type InvalidBinding = never

/**
 * Resolves the provided value to the corresponding {@link InputOptions} type associated with the type
 * based on what type of {@link InputOptions.value|`value`} property it expects.
 */
export type InferOptions<T> = T extends number
	? NumberInputOptions
	: T extends boolean
		? SwitchInputOptions
		: T extends ColorFormat
			? ColorInputOptions
			: T extends string
				? TextInputOptions
				: T extends ButtonGridArrays
					? ButtonGridInputOptions
					: T extends Array<infer T>
						? SelectInputOptions<T>
						: T extends Option<infer T>
							? SelectInputOptions<T>
							: T extends () => void
								? ButtonInputOptions
								: InputOptions

/**
 * Resolves any provided value to the corresponding {@link ValidInput} associated with the type.
 */
export type InferInput<TValueType> = TValueType extends number
	? InputNumber
	: TValueType extends boolean
		? InputSwitch
		: TValueType extends ColorFormat
			? InputColor
			: TValueType extends string
				? InputText
				: TValueType extends () => void
					? InputButton
					: TValueType extends ButtonGridArrays
						? InputButtonGrid
						: TValueType extends Array<infer T>
							? InputSelect<T>
							: TValueType extends Option<infer T>
								? InputSelect<T>
								: ValidInput

/**
 * Resolves a target object to a type that represents the same structure, but with all values
 * replaced with the corresponding input options type accepted by the input type that would be
 * @template TTarget - The target object being used to generate inputs.
 * @example
 * ```typescript
 * const target = { foo: 5, bar: 'baz' }
 * // The inferred result:
 * type TargetOptions = InferTargetOptions<typeof target>
 * // Generates:
 * 	foo: NumberInputOptions,
 * 	bar: TextInputOptions,
 * }
 * ```
 */
export type InferTargetOptions<TTarget> = {
	[K in keyof TTarget]?: TTarget[K] extends Array<infer U>
		? Partial<SelectInputOptions<U>>
		: TTarget[K] extends LabeledOption<infer U>
			? Partial<SelectInputOptions<LabeledOption<U>>>
			: TTarget[K] extends Function
				? Partial<ButtonInputOptions>
				: TTarget[K] extends ColorFormat
					? Partial<ColorInputOptions>
					: TTarget[K] extends object
						? InferTargetOptions<TTarget[K]> & {
								folderOptions?: Partial<FolderOptions>
							}
						: Partial<InferOptions<TTarget[K]>>
}

/**
 * Recursively resolves a target object into a flat array of all keys at all depths.
 * @template TTarget - The target object being used to generate inputs.
 */
export type InferTargetKeys<TTarget> = TTarget extends object
	? {
			[K in keyof TTarget]:
				| K
				| InferTargetKeys<
						// Circular reference guard.
						Exclude<TTarget[K], TTarget>
				  >
		}[keyof TTarget]
	: never

export interface FolderOptions {
	__type?: 'FolderOptions'

	/**
	 * The element to append the folder to (usually
	 * the parent folder's content element).
	 */
	container: HTMLElement

	/**
	 * The title of the folder.
	 * @default ''
	 */
	title?: string

	/**
	 * A preset namespace to use for saving/loading.  By default, the {@link title|`title`}
	 * is used, in combiniation with the parent folder's title (and so on up the hierarchy).
	 * Therefore, if you want to use presets, you will only need to set this if you:
	 * - Use the same title for multiple inputs _in the same {@link Folder}_, or
	 * - Leave all titles empty
	 * Otherwise, this can be left as the default and presets will work as expected.
	 * @default The provided `title`.
	 */
	presetId?: string

	/**
	 * The child folders of this folder.
	 */
	children?: Folder[]

	/**
	 * Whether the folder should be collapsed by default.
	 * @default false
	 */
	closed?: boolean

	/**
	 * Whether the folder should be hidden by default.  If a function is
	 * provided, it will be called to determine the hidden state.  Use
	 * {@link Folder.refresh} to update the hidden state.
	 * @default false
	 */
	hidden?: boolean | (() => boolean)

	/**
	 * Any controls this folder should contain.
	 */
	controls?: Map<string, ValidInput>

	/**
	 * Whether this Folder should be saved as a {@link FolderPreset} when saving the
	 * {@link GooeyPreset} for the {@link Gooey} this Folder belongs to.  If `false`, this Input will
	 * be skipped.
	 * @default true
	 */
	saveable?: boolean

	/**
	 * The order in which this input should appear in its folder relative to the other inputs.
	 * - To force an input to be first *(at the top of its folder)*, set `order` to `0` or below.
	 * - To force an input to be last *(at the bottom of its folder)*, set `order` to any number
	 * greater than number of inputs + 1.
	 * @default folder.inputs.size + folder.children.size + 1
	 */
	order?: number

	/**
	 * When `true`, a search input will be added to the folder's toolbar, allowing users to search
	 * for inputs within the folder by title.  By default, only the root folder is searchable.
	 * @default false
	 */
	searchable?: boolean

	/**
	 * Disables all user interactions and dims the folder brightness.  If a function is provided,
	 * it will be called to update the disabled state each time the {@link refresh} method runs.
	 * @default false
	 */
	disabled?: boolean | (() => boolean)
}

/**
 * @internal
 */
export interface InternalFolderOptions {
	__type?: 'InternalFolderOptions'

	/**
	 * The parent folder of this folder (or a circular reference if this is the root folder).
	 */
	parentFolder?: Folder

	/**
	 * The GUI instance this folder belongs to.
	 */
	gooey?: Gooey

	/**
	 * Whether this folder is the root folder.  Always true when
	 * creating a `new Folder()`. Always false inside of the
	 * `gooey.addFolder` and `folder.addFolder` methods.
	 * Be wary of infinite loops when setting manually.
	 * @default true
	 * @internal
	 */
	isRoot: boolean

	/**
	 * Temporarily bypasses the folder open/close animations upon creation.
	 * @internal
	 */
	_skipAnimations: boolean

	/**
	 * Hides the folder header.
	 * @default false
	 * @internal
	 */
	_headerless: boolean
}

/**
 * A folder preset stores the state of a folder and all of its inputs, as well as the state of all
 * child folders and their inputs.
 */
export interface FolderPreset {
	__type: 'FolderPreset'
	id: string
	title: string
	hidden: boolean
	children: FolderPreset[]
	inputs: InputPreset<any>[]
}

export interface FolderElements {
	header: HTMLElement
	title: HTMLElement
	contentWrapper: HTMLElement
	content: HTMLElement
	toolbar: {
		container: HTMLElement
		settingsButton?: HTMLButtonElement & { tooltip?: Tooltip }
	}
}

export interface FolderEvents {
	/**
	 * When any input in the folder changes, this event emits the input that changed.
	 */
	change: ValidInput

	/**
	 * When the folder is opened or closed, this event emits the new
	 * {@link Folder.closed | `closed`} state.
	 */
	toggle: Folder['closed']['value']

	/**
	 * Fires when {@link Folder.refresh} is called.
	 */
	refresh: void

	/**
	 * Fired after the folder and all of it's children/graphics have been mounted.
	 */
	mount: void
}
//⌟

//· Contants ·····················································································¬

const FOLDER_DEFAULTS = Object.freeze({
	presetId: '',
	title: '',
	children: [],
	closed: false,
	hidden: false,
	controls: new Map(),
	saveable: true,
	disabled: false,
}) satisfies Omit<FolderOptions, 'container'>

/**
 * Internal folder creation api defaults.
 */
const INTERNAL_FOLDER_DEFAULTS = {
	__type: 'InternalFolderOptions',
	parentFolder: undefined,
	isRoot: true,
	_skipAnimations: true,
	gooey: undefined,
	_headerless: false,
} as const satisfies InternalFolderOptions
//⌟

/**
 * Folder is a container for organizing and grouping {@link Input|Inputs} and child Folders.
 *
 * This class should not be instantiated directly.  Instead, use the {@link Gooey.addFolder} method.
 *
 * @example
 * ```typescript
 * const gooey = new Gooey()
 * const folder = gooey.addFolder({ title: 'My Folder' })
 * folder.addNumber({ title: 'foo', value: 5 })
 * ```
 */
export class Folder {
	//· Props ····················································································¬
	__type = 'Folder' as const
	isRoot = true
	id = nanoid()
	gooey?: Gooey

	/**
	 * A preset namespace to use for saving/loading.  By default, the {@link title|`title`}
	 * is used, in combiniation with the parent folder's title (and so on up the hierarchy).
	 * Therefore, if you want to use presets, you will only need to set this if you:
	 * - Use the same title for multiple inputs _in the same {@link Folder}_, or
	 * - Leave all titles empty
	 * Otherwise, this can be left as the default and presets will work as expected.
	 * @default The provided `title`.
	 */
	presetId: string

	/**
	 * Whether this Folder should be saved as a {@link FolderPreset} when saving the
	 * {@link GooeyPreset} for the {@link Gooey} this Folder belongs to.  If `false`, this Input will
	 * be skipped.
	 * @default true
	 */
	saveable: boolean

	/**
	 * The child folders of this folder.
	 */
	children = [] as Folder[]

	/**
	 * All inputs added to this folder.
	 */
	inputs = new Map<string, ValidInput>()

	/**
	 * The root folder.  All folders share a reference to the same root folder.
	 */
	root: Folder

	/**
	 * The parent folder of this folder (or a circular reference if this is the root folder).
	 */
	parentFolder: Folder

	/**
	 * The folder containing Gooey instance settings, like the `ui` and `presets` sections.
	 */
	settingsFolder!: Folder

	/**
	 * An observable responsible for the folder's open/closed state.  Setting this value will
	 * open/close the folder, and subscribing to this value will allow you to listen for
	 * open/close events.
	 */
	closed: State<boolean>

	/**
	 * The folder's root container element, containing all other related folder {@link elements}.
	 */
	element: HTMLDivElement

	/**
	 * All HTMLElements that make up the folder's UI.
	 */
	elements = {} as {
		header: HTMLElement
		title: HTMLElement
		contentWrapper: HTMLElement
		content: HTMLElement
		toolbar: {
			container: HTMLElement
			settingsButton?: HTMLButtonElement & { tooltip?: Tooltip }
		}
	}

	/**
	 * The animated svg graphics belonging to the folder.
	 */
	graphics?: {
		icon: HTMLDivElement
		connector?: {
			container: HTMLDivElement
			svg: SVGElement
			path: SVGPathElement
			update: () => void
		}
	}

	/**
	 * The event manager for the folder.  This should rarely need to be accessed directly, since
	 * subscribing to events can be done with a Folder's {@link on} method.
	 * @internal
	 */
	evm = new EventManager<FolderEvents>(['change', 'refresh', 'toggle', 'mount'])

	/**
	 * Equivalent to `addEventListener`.
	 */
	on = this.evm.on.bind(this.evm)

	/**
	 * The pixel height of the folder header element.
	 * @internal
	 */
	private initialHeaderHeight = 0

	private _title: string
	private _hidden = false
	private _hiddenFn?: () => boolean
	private _disabled = () => false
	private _log: Logger
	/**
	 * Used to disable clicking the header to open/close the folder.
	 */
	private _disabledTimer?: ReturnType<typeof setTimeout>
	/**
	 * The time in ms to wait after mousedown before disabling toggle for a potential drag.
	 */
	private _clickTime = 200
	/**
	 * Whether clicking the header to open/close the folder is disabled.
	 */
	private _clicksDisabled = false
	private _depth = -1
	/**
	 * Maps preset ids to their inputs.
	 */
	private static _presetIdMap = new Map<string, string>()
	/**
	 * The duration of the open/close and hide/show animations in ms.
	 * @default 350
	 *
	 * @todo This needs to sync with the animation duration in the css.
	 */
	private _animDuration = 350
	//⌟
	constructor(options: FolderOptions) {
		if (!('container' in options)) {
			throw new Error('Folder must have a container.')
		}

		const opts = Object.assign(
			{},
			FOLDER_DEFAULTS,
			INTERNAL_FOLDER_DEFAULTS,
			{
				gooey: this.gooey,
				isRoot: true,
			} as const,
			options,
		) as FolderOptions & InternalFolderOptions

		this._log = new Logger(`Folder ${opts.title}`, { fg: 'DarkSalmon' })
		this._log.fn('constructor').debug({ opts, this: this })

		this.isRoot = opts.isRoot

		if (this.isRoot) {
			this._depth = 0
			this.parentFolder = this
			this.root = this
		} else {
			if (!opts.parentFolder) {
				throw new Error('Non-root folders must have a parent folder.')
			}
			this.parentFolder = opts.parentFolder
			this._depth = this.parentFolder._depth + 1
			this.root = this.parentFolder.root
		}

		this.gooey = opts.gooey
		this._title = opts.title ?? ''

		this.element = this._createElement(opts)
		this.element.style.setProperty(
			'order',
			opts.order?.toString() ??
				`${this.parentFolder.children.length + this.parentFolder.inputs.size + 1}`,
		)
		this.elements = this._createElements(this.element)

		this.presetId = opts.presetId || this._resolvePresetId()

		opts.closed ??= false
		if (
			typeof this.gooey!.opts.storage === 'object' &&
			typeof this.gooey!.opts.storage.closed === 'boolean'
		) {
			// @ts-expect-error @internal
			let closedStorage = this.gooey!._closedMap.get()[this.presetId]
			if (typeof closedStorage !== 'undefined') opts.closed = closedStorage
		}
		this.closed = state(opts.closed)

		this.saveable = !!opts.saveable

		if (this.isRoot || opts.searchable) {
			new Search(this)
		}

		this.element.classList.add('instant')
		this.initialHeaderHeight = this.elements.header.scrollHeight

		if (typeof opts.hidden === 'function') {
			this._hiddenFn = opts.hidden
			this._hidden = this._hiddenFn()
		} else {
			this._hidden = !!opts.hidden
		}

		this._disabled = toFn(opts.disabled ?? false)

		this._createGraphics(opts._headerless).then(() => {
			if (opts.closed) {
				this.close({ updateState: true, instant: true })
			}

			this.evm.emit('mount')

			// Open/close the folder when the closed state changes.
			this.evm.add(
				this.closed.subscribe(v => {
					v ? this.close() : this.open()
					this.evm.emit('toggle', v)
					// @ts-expect-error @internal
					this.gooey._closedMap.update(m => {
						m[this.presetId] = v
						return m
					})
				}),
			)

			if (this._hidden) this.hide(true)
		})

		setTimeout(() => {
			this.element.classList.toggle('disabled', this._disabled())
		}, 100)
	}

	//· Getters/Setters ··········································································¬

	/**
	 * The folder's title.  Changing this will update the UI.
	 */
	get title(): string {
		return this._title
	}
	set title(v: string) {
		if (v === this._title) return
		this._title = v
		this.elements.title.animate(
			{
				opacity: 0,
				transform: 'translateY(-0.33rem)',
			},
			{
				duration: 75,
				easing: 'ease-out',
				fill: 'forwards',
			},
		).onfinish = () => {
			this.elements.title.innerHTML = v
			this.elements.title.animate(
				[
					{
						opacity: 0,
						transform: 'translateY(.33rem)',
					},
					{
						opacity: 1,
						transform: 'translateY(0rem)',
					},
				],
				{
					delay: 0,
					duration: 75,
					easing: 'ease-in',
					fill: 'forwards',
				},
			)
		}
	}

	/**
	 * Whether the folder is visible.
	 */
	get hidden(): boolean {
		return this._hidden
	}

	/**
	 * Whether the input is disabled.  Modifying this value will update the UI.
	 */
	get disabled(): boolean {
		return this.element.classList.contains('disabled')
	}
	set disabled(v: boolean | (() => boolean)) {
		this.element.classList.toggle('disabled', toFn(v)())
	}

	/**
	 * A flat array of all child folders of this folder (and their children, etc).
	 */
	get allChildren(): Folder[] {
		return this.children.flatMap<Folder>(child => [child, ...child.allChildren])
	}

	/**
	 * A flat array of all inputs in all child folders of this folder (and their children, etc).
	 * See Input Generators region.
	 */
	get allInputs(): Map<string, ValidInput> {
		const allControls = new Map<string, ValidInput>()
		for (const child of [this, ...this.allChildren]) {
			for (const [key, value] of child.inputs.entries()) {
				allControls.set(key, value)
			}
		}
		return allControls
	}

	isRootFolder(): this is Folder & { isRoot: true } {
		return this.isRoot
	}
	//⌟

	//· Folders ··················································································¬

	addFolder(title?: string, options?: Partial<FolderOptions>): Folder {
		options ??= {}
		options.title ??= title
		this._log.fn('addFolder').debug({ options, this: this })

		const defaults = Object.assign({}, INTERNAL_FOLDER_DEFAULTS, {
			parentFolder: this,
			depth: this._depth + 1,
			gooey: this.gooey,
		})

		const overrides = {
			__type: 'InternalFolderOptions',
			container: this.elements.content,
			gooey: this.gooey,
			isRoot: false,
		}

		const opts = Object.assign({}, defaults, options, overrides) as FolderOptions &
			InternalFolderOptions

		const folder = new Folder(opts)
		folder.on('change', v => this.evm.emit('change', v))

		this.children.push(folder)

		if (opts._headerless) {
			folder.initialHeaderHeight ??= folder.elements.header.scrollHeight
			folder.elements.header.style.display = 'none'
		}

		this.gooey?.refreshPosition()

		return folder
	}

	private _handleClick(event: PointerEvent): void {
		if (event.button !== 0) return

		this._log.fn('#handleClick').debug({ event, this: this })

		this.element.removeEventListener('pointerup', this.toggle)
		this.element.addEventListener('pointerup', this.toggle, { once: true })

		// Abort if a toolbar button was clicked.
		if (composedPathContains(event, 'gooey-cancel')) return this._disableClicks()

		// We need to watch for the mouseup event within a certain timeframe
		// to make sure we don't accidentally trigger a click after dragging.
		clearTimeout(this._disabledTimer)
		// First we delay the drag check to allow for messy clicks.
		this._disabledTimer = setTimeout(() => {
			this.elements.header.removeEventListener('pointermove', this._disableClicks)
			this.elements.header.addEventListener('pointermove', this._disableClicks, {
				once: true,
			})

			// Then we set a timer to disable the drag check.
			this._disabledTimer = setTimeout(() => {
				this.elements.header.removeEventListener('pointermove', this._disableClicks)
				this.element.removeEventListener('pointerup', this.toggle)
				this._clicksDisabled = false
			}, this._clickTime)
		}, 150)

		if (this._clicksDisabled) return
	}
	private _disableClicks = (): void => {
		if (!this._clicksDisabled) {
			this._clicksDisabled = true
			this._log.fn('disable').debug('Clicks DISABLED')
		}
		this._clicksDisabled = true
		clearTimeout(this._disabledTimer)
	}
	private _resetClicks(): void {
		this._log.fn('cancel').debug('Clicks ENABLED')
		removeEventListener('pointerup', this.toggle)
		this._clicksDisabled = false
	}

	//·· Open/Close ······································································¬

	toggle = (): this => {
		this._log.fn('toggle').debug()
		clearTimeout(this._disabledTimer)
		if (this._clicksDisabled) {
			this._resetClicks()
			return this
		}

		// If the folder is being dragged, don't toggle.
		if (this.element.classList.contains('gooey-dragged')) {
			this.element.classList.remove('gooey-dragged')
			return this
		}

		const state = !this.closed.value

		this.closed.set(state)

		this.evm.emit('toggle', state)

		return this
	}

	open(options?: {
		/**
		 * Whether to update the folder's {@link closed} state.  Defaults to `false` to avoid
		 * getting caught in a feedback loop.
		 * @default false
		 */
		updateState?: boolean
		/**
		 * Whether to open the folder instantly, bypassing the animation.
		 * @default false
		 */
		instant?: boolean
	}): this {
		const { updateState = false, instant = false } = options ?? {}
		this._log.fn('open').debug(updateState || instant ? { updateState, instant } : '')

		this.element.classList.remove('closed')
		this.evm.emit('toggle', false)
		if (updateState) this.closed.set(false)

		this._clicksDisabled = false

		this._toggleClass()
		animateConnector(this, 'open', { instant })
		return this
	}

	close(options?: {
		/**
		 * Whether to update the folder's {@link closed} state.  Defaults to `false` to avoid
		 * getting caught in a feedback loop.
		 * @default false
		 */
		updateState?: boolean
		/**
		 * Whether to open the folder instantly, bypassing the animation.
		 * @default false
		 */
		instant?: boolean
	}): this {
		const { updateState = false, instant = false } = options ?? {}
		this._log.fn('close').debug(updateState || instant ? { updateState, instant } : '')

		this.element.classList.add('closed')
		if (updateState) this.closed.set(true)
		this.evm.emit('toggle', true)
		this._clicksDisabled = false

		this._toggleClass()
		animateConnector(this, 'close', { instant })
		return this
	}

	private static _EASE = {
		show: 'cubic-bezier(.05,1,.56,.91)',
		hide: 'cubic-bezier(0.9, 0, 0.9, 0)',
		slow: 'cubic-bezier(.41,.77,.36,.96)',
	}

	private static _SHOW_ANIM = [
		{
			offset: 0,
			gridTemplateRows: '0fr',
			clipPath: 'inset(50%)',
			webkitClipPath: 'inset(50%)',
			easing: Folder._EASE.show,
		},
		{
			offset: 0.1,
			clipPath: 'inset(49% 50%)',
			webkitClipPath: 'inset(49% 50%)',
			easing: Folder._EASE.show,
			filter: 'brightness(10)',
		},
		{
			offset: 0.35,
			clipPath: 'inset(49% 0%)',
			webkitClipPath: 'inset(49% 0%)',
			easing: 'linear',
			filter: 'brightness(1)',
		},
		{
			offset: 0.36,
			clipPath: 'inset(49% 0%)',
			webkitClipPath: 'inset(49% 0%)',
			easing: Folder._EASE.slow,
		},
		{
			offset: 1,
			gridTemplateRows: '1fr',
			clipPath: 'inset(0%)',
			webkitClipPath: 'inset(0%)',
		},
	]

	private static _HIDE_ANIM = [
		{
			offset: 0,
			gridTemplateRows: '0fr',
			clipPath: 'inset(50%)',
			webkitClipPath: 'inset(50%)',
			easing: Folder._EASE.hide,
		},
		{
			offset: 0.1,
			clipPath: 'inset(49% 50%)',
			webkitClipPath: 'inset(49% 50%)',
			filter: 'brightness(10)',
		},
		{
			offset: 0.42,
			clipPath: 'inset(49% 0%)',
			webkitClipPath: 'inset(49% 0%)',
			filter: 'brightness(1)',
		},
		{
			offset: 0.43,
			clipPath: 'inset(49% 0%)',
			webkitClipPath: 'inset(49% 0%)',
			easing: Folder._EASE.slow,
		},
		{
			offset: 1,
			gridTemplateRows: '1fr',
			clipPath: 'inset(0%)',
			webkitClipPath: 'inset(0%)',
		},
	]

	toggleHidden(
		/**
		 * Whether to show the folder instantly, bypassing the animation.
		 * @default false
		 */
		instant = false,
	): this {
		this._log.fn('toggleHidden').debug()
		this.hidden ? this.show(instant) : this.hide(instant)
		return this
	}

	async show(
		/**
		 * Whether to show the folder instantly, bypassing the animation.
		 * @default false
		 */
		instant = false,
	): Promise<this> {
		this._log.fn('show').debug({ instant })
		this._hidden = false

		const anim = await this.element.animate(Folder._SHOW_ANIM, {
			duration: instant ? 0 : this._animDuration,
			fill: 'forwards',
		}).finished

		if (!this._hidden && this.element) anim.commitStyles()

		return this
	}

	async hide(
		/**
		 * Whether to show the folder instantly, bypassing the animation.
		 * @default false
		 */
		instant = false,
	): Promise<this> {
		this._log.fn('hide').debug({ instant })
		this._hidden = true

		const anim = await this.element.animate(Folder._HIDE_ANIM, {
			duration: instant ? 0 : this._animDuration,
			direction: 'reverse',
			fill: 'forwards',
		}).finished

		if (this._hidden && this.element) anim.commitStyles()

		return this
	}

	private _toggleTimeout!: ReturnType<typeof setTimeout>
	private _toggleClass = (classname = 'animating' as string | string[]): void => {
		const classes = Array.isArray(classname) ? classname : [classname]
		this.element.classList.add(...classes)

		clearTimeout(this._toggleTimeout)
		this._toggleTimeout = setTimeout(() => {
			this.element.classList.remove(...classes)
		}, this._animDuration)
	}
	//⌟

	//·· Save/Load ···············································································¬

	private _resolvePresetId = (identifiers: string[] = [], opts?: InputOptions): string => {
		const parts = [] as string[]

		let id = opts?.presetId

		if (!id) {
			let folder: Folder = this
			while (!folder.isRoot) {
				parts.unshift(folder.title)
				folder = folder.parentFolder
			}

			parts.unshift(this.root.title)
		}

		id ??= [...parts, ...identifiers].join('__')

		let i = 0
		while (this.inputs.has(id)) {
			i++
			id = i ? `${id}_${i}` : id
		}

		this._log.fn('resolvePresetId', this.title, ...identifiers).debug({ id, opts, this: this })
		return id
	}

	save(): FolderPreset {
		this._log.fn('save').debug({ this: this })

		if (this.saveable !== true) {
			throw new Error('Attempted to save unsaveable Folder: ' + this.title)
		}

		const preset: FolderPreset = {
			__type: 'FolderPreset',
			id: this.presetId,
			title: this.title,
			// closed: this.closed.value,
			hidden: toFn(this._hidden)(),
			children: this.children
				.filter(c => c.title !== this.gooey!.elements.settingsFolder.title && c.saveable)
				.map(child => child.save()),
			inputs: Array.from(this.inputs.values())
				.filter(i => i.opts.saveable)
				.map(input => input.save()),
		}

		return preset
	}

	/**
	 * Updates all inputs with values from the {@link FolderPreset}.  If the preset has children,
	 * those presets will also be passed to the corresponding child folders'
	 * {@link Folder.load|`load`} method.
	 */
	load(preset: FolderPreset): this {
		this._log.fn('load').debug({ preset, this: this })

		// this.closed.set(preset.closed) // todo - global settings?

		if (preset.hidden !== this.hidden) {
			preset.hidden ? this.hide() : this.show(true)
		}

		for (const input of this.inputs.values()) {
			const inputPreset = preset.inputs.find(c => c.presetId === input.opts.presetId)
			if (!inputPreset) {
				console.warn(`Missing input for preset: ${preset.title}`, {
					preset,
					input,
					this: this,
				})
				continue
			}

			input.load(inputPreset)
		}

		for (const child of this.children) {
			if (!child.saveable) continue

			const folderPreset = preset.children?.find(f => f.id === child.presetId)
			if (!folderPreset) {
				console.warn(`No folder found with presetId: ${preset.id}`, {
					child,
					preset,
					this: this,
				})
				continue
			}

			child.load(folderPreset)
		}

		return this
	}
	//⌟
	//⌟

	//· Input Generators ·········································································¬

	/**
	 * Updates the ui for all inputs belonging to this folder to reflect their current values.
	 */
	refresh(): this {
		this._log.fn('refresh').debug(this)

		const disabledState = this._disabled()
		if (disabledState !== this.disabled) {
			this.disabled = disabledState
		}
		const hiddenState = this._hiddenFn?.()
		if (typeof hiddenState !== 'undefined' && hiddenState !== this._hidden) {
			hiddenState ? this.hide() : this.show()
		}

		for (const input of this.inputs.values()) {
			input.refresh()
		}
		return this
	}

	/**
	 * Updates the ui for all inputs in this folder and all child folders recursively.
	 */
	refreshAll(): this {
		for (const input of this.allInputs.values()) {
			input.refresh()
		}

		this.evm.emit('refresh')
		return this
	}

	/**
	 * Registers all new inputs by adding them to the {@link inputs|folder inputs} map, updating
	 * the internal preset-id map, and and refreshing the folder icon (debounced slightly).
	 */
	private _registerInput<T extends ValidInput>(input: T, presetId: string): T {
		let i = 0
		let titleId = input.title || input.id
		while (this.inputs.has(titleId)) {
			titleId = `${input.title}_${i}`
			i++
		}
		this.inputs.set(titleId, input)
		Folder._presetIdMap.set(input.id, presetId)
		this._refreshIcon()
		this.gooey?.refreshPosition()
		return input
	}

	/**
	 * Takes in a title, value, and options, and return an updated options object.
	 *
	 * Updates:
	 * - {@link InputOptions.title|`title`}
	 * - {@link InputOptions.value|`value`}
	 * - {@link InputOptions.presetId|`presetId`}
	 */
	private _resolveOpts<TValue extends ValidInputValue, TOptions extends InputOptions>(
		t: string,
		v?: TValue,
		o?: TOptions,
	): TOptions & { title: string; value: TValue; presetId: string } {
		o ??= {} as TOptions
		o.title ??= t
		if (typeof v !== 'undefined') o.value ??= v
		o.presetId ??= this._resolvePresetId([t])
		return o as TOptions & { title: string; value: TValue; presetId: string }
	}

	//·· Add ···································································¬

	add(title: string, initialValue: boolean, options?: SwitchInputOptions): InputSwitch
	add(title: string, initialValue: number, options?: NumberInputOptions): InputNumber
	add(title: string, initialValue: string, options?: TextInputOptions): InputText
	add(title: string, initialValue: () => void, options?: ButtonInputOptions): InputButton
	add(title: string, initialValue: ColorFormat, options?: ColorInputOptions): InputColor
	// add<T>(title: string, initialValue: Option<T>, options: SelectInputOptions<T>): InputSelect<T>
	// prettier-ignore
	add<T>(title: string, initialValue: LabeledOption<T>, options: SelectInputOptions<T>): InputSelect<T>
	// prettier-ignore
	add(title: string, initialValue: ButtonGridArrays, options?: ButtonGridInputOptions ): InputButtonGrid
	/**
	 * Adds an input to the folder based on typoe of the `initialValue` parameter.
	 * @param title - The title of the input to display in the label area of the input's "row".
	 * @param initialValue - The initial value of the input.  The type of this value will determine
	 * the type of input created.
	 */
	add(title: string, initialValue: ValidInputValue, options?: InputOptions): ValidInput {
		const opts = this._resolveOpts(title, initialValue, options)
		const input = this._createInput(opts)
		this._registerInput(input, opts.presetId)
		this._log.fn('add').debug({ input, opts })
		return input
	}
	//⌟

	//·· Bind ···································································¬

	/**
	 * Binds an input to a target object and key.  The input will automatically update the target
	 * object's key when the input value changes.
	 * @param target - The object to bind the input to.
	 * @param key - The key of the target object to bind the input to.
	 * @param options - The {@link InputOptions}, the type of which is inferred based on the type
	 * of the value at the {@link target} object's {@link key}.
	 * @example
	 * ```ts
	 * const gui = new Gooey()
	 *
	 * // Some state.
	 * const params = { foo: 5, bar: 'baz', qux: true }
	 *
	 * const numberInput = gui.bind(params, 'foo', { min: 0, max: 10, step: 1 })
	 * //    ^? InputNumber
	 *
	 * // By default, the `title` is inferred from the key.
	 * // To override it, use the `title` option:
	 * const switchInput = gui.bind(params, 'qux', { title: 'Kwucks' })
	 * ```
	 */
	bind<
		TTarget extends Record<string, any>,
		TKey extends keyof TTarget,
		const TValue extends TTarget[TKey],
		TOptions extends InferOptions<TValue>,
		TInput extends InferInput<TValue>,
	>(target: TTarget, key: TKey, options: Partial<TOptions> = {}): TInput {
		const title = options.title ?? (key as string)
		const opts = this._resolveOpts(title, target[key] as TValue, options)

		opts.value ??= target[key] as TValue
		opts.binding = { target, key, initial: opts.value }

		const input = this._createInput(opts)
		this._registerInput(input, opts.presetId)

		return input as unknown as TInput
	}

	/**
	 * Used to store a ref to the top level folder of a nested generator like `bindMany`.
	 */
	#transientRoot: Folder | null = null

	/**
	 * Takes an object and generates a set of inputs based on the object's keys and values.  Any
	 * nested objects will result in child folders being created.  Options can be passed to
	 * customize the inputs generated, and to exclude/include specific keys.
	 * @param target - The object to generate inputs from.
	 * @param options - Options to customize the inputs generated, as well as `include` and
	 * `exclude` arrays to omit certain keys.
	 * @example
	 * ```ts
	 * const gui = new Gooey()
	 *
	 * const params = {
	 *  myNumber: 5,
	 * 	myFolder: {
	 *    myOptions: 'foo',
	 * 	}
	 * }
	 *
	 * gui.addMany(params, {
	 *   myFolder: {
	 * folderOptions: title: 'My Folder' }}, // optional folder controls
	 * })
	 */
	addMany<
		T extends object,
		TOptions extends InferTargetOptions<T> = InferTargetOptions<T>,
		TInputs extends InferTarget<T> = this & InferTarget<T>,
	>(
		target: T,
		options?: TOptions & {
			/**
			 * An array of keys to exclude from a target object when generating inputs.
			 */
			exclude?: InferTargetKeys<T>[]
			/**
			 * An array of keys to include in a target object when generating inputs.
			 */
			include?: InferTargetKeys<T>[]
		},
	): TInputs {
		this._log.fn('addMany').debug({ target, options }, this)
		let rootFolder: Folder = this

		if (!this.#transientRoot) {
			this.#transientRoot = rootFolder
		}

		this._walk(target, ((options as any) || undefined) ?? {}, rootFolder, new Set(), 'add')

		const finalRoot = this.#transientRoot
		this.#transientRoot = null

		return finalRoot as this & TInputs
	}

	bindMany<
		T extends object,
		TOptions extends InferTargetOptions<T> = InferTargetOptions<T>,
		TInputs extends InferTarget<T> = this & InferTarget<T>,
	>(
		target: T,
		options?: TOptions & {
			/**
			 * An array of keys to exclude from a target object when generating inputs.
			 */
			exclude?: InferTargetKeys<T>[]
			/**
			 * An array of keys to include in a target object when generating inputs.
			 */
			include?: InferTargetKeys<T>[]
		},
	): TInputs {
		this._log.fn('bindMany').debug({ target, options }, this)
		let rootFolder: Folder = this

		if (!this.#transientRoot) {
			this.#transientRoot = rootFolder
		}

		this._walk(target, ((options as any) || undefined) ?? {}, rootFolder, new Set(), 'bind')

		const finalRoot = this.#transientRoot
		this.#transientRoot = null
		return finalRoot as this & TInputs
	}
	//⌟

	private _walk<T extends object, TOptions extends InferTargetOptions<T> = InferTargetOptions<T>>(
		target: T,
		options: TOptions & {
			/**
			 * An array of keys to exclude from a target object when generating inputs.
			 */
			exclude?: InferTargetKeys<T>[]
			/**
			 * An array of keys to include in a target object when generating inputs.
			 */
			include?: InferTargetKeys<T>[]
		},
		folder: Folder,
		seen: Set<any>,
		mode: 'bind' | 'add',
	) {
		if (seen.has(target)) return
		seen.add(target)

		for (let [key, value] of Object.entries(target)) {
			if (
				(Array.isArray(options['exclude']) && options['exclude'].includes(key as any)) ||
				(Array.isArray(options['include']) && !options['include'].includes(key as any))
			) {
				continue
			}

			const inputOptions = (options[key as keyof T] as any as TOptions) || ({} as TOptions)

			let folderOptions = {} as FolderOptions

			if (value === null) {
				const hasValue = 'value' in inputOptions

				if (!hasValue && mode === 'bind') {
					console.error(
						`bindMany() error: target object's key "${key}" is \`null\`, and no valid "value" option was provided as a fallback.`,
						{ key, value, inputOptions },
					)
					throw new Error('Invalid binding.')
				}

				if (hasValue) {
					value = inputOptions['value']
				}
			}

			if (typeof value === 'object') {
				if ('options' in inputOptions) {
					//? InputSelect
					mode === 'bind'
						? folder.bindSelect(
								target,
								key as keyof T,
								inputOptions as SelectInputOptions,
							)
						: folder.addSelect(
								key,
								(inputOptions as SelectInputOptions).options!,
								inputOptions,
							)
				} else if (isColor(value)) {
					//? InputColor
					mode === 'bind'
						? folder.bindColor(value, 'color', { title: key, ...inputOptions })
						: folder.addColor(key, value, inputOptions)
				} else {
					//? Folder
					if ('folderOptions' in inputOptions) {
						folderOptions = inputOptions['folderOptions'] as FolderOptions
					} else if ('folderOptions' in value) {
						folderOptions = value.folderOptions
					}
					const subFolder = folder.addFolder(key, folderOptions)
					this._walk(value, inputOptions, subFolder, seen, mode)
				}
			} else {
				//? InputNumber | InputText | InputButton | InputColor
				mode === 'bind'
					? folder.bind(target, key as keyof T, inputOptions as any)
					: folder.add(key, value, inputOptions)
			}
		}
	}

	//·· Adders ···································································¬

	/**
	 * Adds a new {@link InputNumber} to the folder.
	 * @example
	 * ```ts
	 * const number = gui.addNumber('Foo', true)
	 * number.on('change', console.log)
	 * ```
	 */
	addNumber(
		title: string,
		value?: number,
		options = {} as Partial<NumberInputOptions>,
	): InputNumber {
		const opts = this._resolveOpts(title, value, options)
		const input = new InputNumber(opts, this)
		return this._registerInput(input, opts.presetId)
	}
	bindNumber<
		const T extends Record<string, any>,
		const K extends keyof T,
		V extends T[K] extends number ? number : InvalidBinding,
	>(target: T, key: K, options?: Partial<NumberInputOptions>): InputNumber {
		const opts = this._resolveBinding(target, key, options)
		return this.addNumber(key as string, opts.value as V, opts)
	}

	addText(title: string, value?: string, options?: TextInputOptions): InputText {
		const opts = this._resolveOpts(title, value, options)
		const input = new InputText(opts, this)
		return this._registerInput(input, opts.presetId)
	}
	bindText<
		T extends Record<string, any>,
		K extends keyof T,
		TValue extends T[K] extends string ? string : InvalidBinding,
	>(target: T, key: K, options?: Partial<TextInputOptions>): InputText {
		const opts = this._resolveBinding(target, key, options)
		return this.addText(key as string, opts.value as TValue, opts)
	}

	addColor(title: string, value?: ColorFormat, options?: ColorInputOptions): InputColor {
		const opts = this._resolveOpts(title, value, options)
		const input = new InputColor(opts, this)
		return this._registerInput(input, opts.presetId)
	}
	bindColor<
		T extends Record<string, any> | Color,
		K extends keyof T,
		TValue extends T[K] extends ColorFormat ? Color : InvalidBinding,
	>(target: T, key: K, options?: Partial<ColorInputOptions>): InputColor {
		const opts = this._resolveBinding(target, key, options)
		return this.addColor(key as string, opts.value as TValue, opts)
	}

	addButton(title: string, onclick: () => void, options?: ButtonInputOptions): InputButton {
		const opts = this._resolveOpts(title, onclick, options)
		opts.onClick = onclick || opts.value
		const input = new InputButton(opts, this)
		return this._registerInput(input, opts.presetId)
	}
	/**
	 * Passes the function at `target[key]` to {@link addButton} as the `onclick` handler.
	 */
	bindButton<
		T extends Record<string, any>,
		K extends keyof T,
		TValue extends T[K] extends Function ? () => void : InvalidBinding,
	>(target: T, key: K, options?: Partial<ButtonInputOptions>): InputButton {
		return this.addButton(key as string, target[key] as TValue, options)
	}

	addButtonGrid(
		title: string,
		value: ButtonGridArrays,
		options?: Partial<ButtonGridInputOptions>,
	): InputButtonGrid {
		const opts = this._resolveOpts(title, value, options)
		const input = new InputButtonGrid(opts, this)
		return this._registerInput(input, opts.presetId)
	}
	bindButtonGrid<
		T extends Record<string, any>,
		K extends keyof T,
		V extends T[K] extends ButtonGridArrays ? ButtonGridArrays : never,
	>(target: T, key: K, options?: Partial<ButtonGridInputOptions>): InputButtonGrid {
		return this.addButtonGrid(key as string, target[key] as V, options)
	}

	/**
	 * Adds a new {@link InputSelect} to the folder.
	 * @example
	 * ```ts
	 * // For primitives:
	 * gui.addSelect('theme', ['light', 'dark'], { initialValue: 'light' })
	 *
	 * // For objects:
	 * const options = {
	 *   foo: { id: 0 },
	 *   bar: { id: 1 },
	 * }
	 *
	 * todo - Implement this -- will need to detect that the list has objects and pass a union of
	 * todo - their keys to the initialValue type or something?
	 * gui.addSelect('foobar', options, { initialValue: 'foo' })
	 * ```
	 */
	addSelect<T>(
		title: string,
		array: T[],
		options?: SelectInputOptions<NoInfer<T>> & {
			initialValue?: NoInfer<T>
		},
	): InputSelect<T> {
		const opts = this._resolveOpts(title, array, options)
		opts.options = array
		opts.value =
			options?.initialValue ?? (fromState(array)?.at(0) as T) ?? options?.binding?.initial

		if (!opts.value) {
			console.warn('No value provided for select:', { title, array, options, opts })
		}
		return this._registerInput(new InputSelect(opts, this), opts.presetId) as InputSelect<T>
	}
	/**
	 * todo - Does this work / make sense?  It's just wrapping the list in a function.. which
	 * happens internally anyways... I'm not sure what binding to a select should do, other than
	 * ensure that the options array is regularly refreshed after interactions... but without a
	 * way to listen to changes on the target object's array (i.e. forcing or wrapping with a
	 * store), I'm not sure what the behavior should be.
	 */
	bindSelect<
		T extends Record<string, any>,
		K extends keyof T,
		V extends T[K] extends Option<infer U> ? U : InvalidBinding,
		A extends Array<V>,
		O extends SelectInputOptions<V> = SelectInputOptions<V> & {
			options: A
			initialValue?: V
			targetKey?: keyof T
		},
		// >(target: T, key: K, options: Partial<O> = {}): InputSelect<V> {
	>(target: T, key: K, options = {} as O): InputSelect<V> {
		const opts = this._resolveBinding(target, key, options)
		opts.value = target[key]
		return this.addSelect(key as string, opts.options as A, opts as O)
	}

	/**
	 * Adds a new {@link InputSwitch} to the folder.
	 * @example
	 * ```ts
	 * const switch = gui.addSwitch('Foo', true)
	 * switch.on('change', console.log)
	 * ```
	 */
	addSwitch(title: string, value: boolean, options?: SwitchInputOptions): InputSwitch {
		const opts = this._resolveOpts(title, value, options)
		const input = new InputSwitch(opts, this)
		return this._registerInput(input, opts.presetId)
	}
	/**
	 * Binds an {@link InputSwitch} to the `boolean` at the target object's key.
	 * @example
	 * ```ts
	 * const params = { foo: true }
	 * const switch = gui.bindSwitch(params, 'foo')
	 * ```
	 */
	bindSwitch<
		T extends Record<string, any>,
		K extends keyof T,
		V extends T[K] extends boolean ? boolean : InvalidBinding,
	>(target: T, key: K, options?: Partial<SwitchInputOptions>): InputSwitch {
		const opts = this._resolveBinding(target, key, options)
		return this.addSwitch(key as string, opts.value as V, opts)
	}
	//⌟

	//·· Helpers ···································································¬

	/**
	 * Does validation / error handling.
	 * If no title was provided, this method will also assign the binding key to the title.
	 * @returns The processed options.
	 */
	private _validateBinding<T extends InputOptions>(options: T, validate?: boolean): T {
		options.title ??= options.binding?.key

		// Some (hopefully) helpful error handling.
		if (validate) {
			const b = options.binding
			let value = options.value

			if (!value) {
				value = b?.target[b?.key]
			}

			if (!value) {
				if (b) {
					let err = false

					if (typeof b.target === 'undefined') {
						err = true
						console.error(
							`\x1b[96mgooey\x1b[39m ~ \x1b[91mError\x1b[39m Binding "target" is undefined:`,
							b,
						)
					}

					if (typeof b.key === 'undefined') {
						err = true
						console.error(
							`\x1b[96mgooey\x1b[39m ~ \x1b[91mError\x1b[39m Binding "key" is undefined:`,
							b,
						)
					}

					if (typeof b.target[b.key] === 'undefined') {
						err = true
						console.error(
							`\x1b[96mgooey\x1b[39m ~ \x1b[91mError\x1b[39m The provided binding key \x1b[33m"${b.key}"\x1b[39m does not exist on provided \x1b[33mtarget\x1b[39m:`,
							b,
						)
					}

					if (err) {
						throw new Error(
							'gooey ~ Failed to bind input to the provided target object.',
							{
								cause: options,
							},
						)
					}
				} else {
					throw new Error('gooey ~ No value or binding provided.', { cause: options })
				}
			}
		}

		return options
	}

	private _createInput<TOptions extends InputOptions>(options: TOptions): ValidInput {
		this._log.fn('#createInput').debug(this)
		const type = this._resolveType(options)
		options = this._validateBinding(options, false)

		switch (type) {
			case 'InputText':
				return new InputText(options as TextInputOptions, this)
			case 'InputNumber':
				return new InputNumber(options as NumberInputOptions, this)
			case 'InputColor':
				return new InputColor(options as ColorInputOptions, this)
			case 'InputSelect':
				return new InputSelect(options as SelectInputOptions<Option<any>>, this)
			case 'InputButton':
				return new InputButton(options as ButtonInputOptions, this)
			case 'InputSwitch':
				return new InputSwitch(options as SwitchInputOptions, this)
		}

		throw new Error('Invalid input type: ' + type + ' for options: ' + options)
	}

	private _resolveBinding<
		TTarget extends Record<string, any> = Record<string, any>,
		TKey extends keyof TTarget = keyof TTarget,
		TValue extends TTarget[TKey] = TTarget[TKey],
		TOptions extends InputOptions = InputOptions,
		TResolvedOptions = Partial<TOptions> & {
			title: string
			value: TValue
			presetId: string
			binding: {
				target: TTarget
				key: TKey
				initial: TValue
			}
		},
	>(target: TTarget, key: TKey, options: Partial<TOptions> | undefined = {}): TResolvedOptions {
		const title = options.title ?? (key as string)
		const opts = this._resolveOpts(title, target[key], options)

		opts.binding = { target, key, initial: opts.value }
		const res = this._validateBinding(opts, true)

		return res as TResolvedOptions
	}

	private _resolveType(options: any): InputType {
		this._log.fn('resolveType').debug({ options, this: this })
		let value = options.value ?? options.binding?.target[options.binding!.key]

		if ('onClick' in options) {
			return 'InputButton'
		}

		if (('options' in options && Array.isArray(options.options)) || isLabeledOption(value)) {
			value ??= options.options[0]
			options.value ??= value
			return 'InputSelect'
		}

		switch (typeof value) {
			case 'boolean': {
				// todo:
				// We need some way to differentiate between a switch and a checkbox once the checkbox is added.
				// ^ Why do we need a checkbox?
				return 'InputSwitch'
			}
			case 'number': {
				return 'InputNumber'
			}
			case 'string': {
				if (isColorFormat(value)) return 'InputColor'
				// todo:
				// Could detect CSS units like `rem` and `-5px 0 0 3px` for an advanced `CSSTextInput` or something.
				// Or like a "TextComponents" input that can have any number of "components" (like a color picker, number, select, etc) inside a string.
				return 'InputText'
			}
			case 'function': {
				return 'InputButton'
			}
			case 'object': {
				if (Array.isArray(value)) {
					return 'InputSelect'
				}
				if (isColor(value)) {
					return 'InputColor'
				}
				if (isLabeledOption(value)) {
					return 'InputSelect'
				}
				throw new Error('Invalid input view: ' + JSON.stringify(value))
			}
			default: {
				throw new Error('Invalid input view: ' + value)
			}
		}
	}
	//⌟
	//⌟

	//· Elements ·················································································¬

	private _createElement(opts: FolderOptions | GooeyOptions): HTMLDivElement {
		this._log.fn('#createElement').debug({ el: opts.container, this: this })
		if (this.isRoot) {
			const width = (opts as GooeyOptions).width
			return create('div', {
				id: `gooey-root_${this.id}`,
				classes: ['gooey-root', 'gooey-folder', 'closed'],
				dataset: { theme: this.gooey!.theme ?? 'default' },
				parent: select(opts.container)[0],
				style: width ? { width } : undefined,
			})
		}

		return create('div', {
			parent: this.parentFolder.elements.content,
			classes: ['gooey-folder', 'closed'],
		})
	}

	private _createElements(element: HTMLElement): FolderElements {
		this._log.fn('#createElements').debug({ element, this: this })
		const header = create('div', {
			parent: element,
			classes: ['gooey-header'],
		})
		header.addEventListener('pointerdown', this._handleClick.bind(this))

		const title = create('div', {
			parent: header,
			classes: ['gooey-title'],
			innerHTML: this.title,
		})

		const toolbar = create('div', {
			parent: header,
			classes: ['gooey-toolbar'],
		})

		const contentWrapper = create('div', {
			classes: ['gooey-content-wrapper'],
			parent: element,
		})
		const content = create('div', {
			classes: ['gooey-content'],
			parent: contentWrapper,
		})

		return {
			header,
			toolbar: { container: toolbar },
			title,
			contentWrapper,
			content,
		}
	}
	//⌟

	//· SVG's ····················································································¬

	private async _createGraphics(headerless = false): Promise<void> {
		setTimeout(() => {
			new TerminalSvg(this)
		}, 10)

		if (this.isRootFolder()) return
		this._log.fn('createGraphics').debug({ this: this })

		if (!this.isRootFolder()) {
			this.graphics = { icon: createFolderSvg(this) }
			this.elements.header.prepend(this.graphics.icon)

			if (!headerless) {
				this.initialHeaderHeight ??= this._resolveHeaderHeight()
				this.graphics.connector = createFolderConnector(this, this.graphics.icon)
				animateConnector(this, this.closed.value ? 'close' : 'open')
			}
		}
	}

	private _resolveHeaderHeight(): number {
		let height = 16 * 1.75
		const wrapper = this.root?.gooey?.wrapper
		if (!wrapper) {
			throw new Error('No wrapper found!  This should never happen...')
		}
		const prop = getComputedStyle(wrapper).getPropertyValue('--gooey-header_height')
		if (prop.endsWith('px')) {
			height = parseFloat(prop)
		} else if (prop.endsWith('em')) {
			let fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
			height = parseFloat(prop) * fontSize
		}
		return height
	}

	// todo - Add `hue` to the `Theme` interface and make it easily customizable.
	get hue(): number {
		const localIndex = this.parentFolder.children.indexOf(this)

		//- Breaks if another folder other than the Settings Folder is added as a built-in...!
		const i = this.parentFolder.isRootFolder() ? localIndex - 1 : localIndex

		// Don't count the root folder.
		const depth = this._depth - 1

		if (depth === 0) {
			return i * 30
		} else {
			return this.parentFolder.hue + i * -20
		}
	}

	get scrollHeight(): number {
		let height = this.element.scrollHeight
		height += this.elements.header.scrollHeight
		for (const child of this.allChildren) {
			height += child.scrollHeight
			height += this.elements.header.scrollHeight
		}
		return height
	}

	#timeout?: ReturnType<typeof setTimeout>
	#first = true
	private _refreshIcon(): void {
		this._log.fn('#refreshIcon').debug(this)

		// Really don't love this...
		if (this.graphics) {
			defer(() => {
				clearTimeout(this.#timeout)
				this.#timeout = setTimeout(() => {
					const svg = createFolderSvg(this)
					this.graphics?.icon.replaceWith(svg)
					if (this.graphics) this.graphics.icon = svg
					if (this.#first) {
						this.graphics?.connector?.update()
						this.#first = false
					} else {
						this.graphics?.connector?.update()
					}
				}, 1)
			})
		}
	}
	//⌟

	disposed = false
	dispose(): void {
		if (this.disposed && DEV) {
			this._log.fn('dispose').debug('Already disposed.', this)
			return
		}
		this.elements.header.removeEventListener('click', this.toggle)
		this.elements.header.addEventListener('pointerdown', this._handleClick)

		this.element.remove()

		for (const input of this.inputs.values()) {
			input.dispose()
		}

		for (const child of this.children) {
			child.dispose()
		}

		try {
			this.parentFolder.children.splice(this.parentFolder.children.indexOf(this), 1)
		} catch (err) {
			this._log.fn('dispose').error('Error removing folder from parent', { err })
		}

		this.disposed = true
	}
}

//#region Type Tests ···································································¬

// const testTargetInferer = <T>(_target: T): InferTarget<T> => {
// 	return {} as InferTarget<T>
// }

// const testTarget = {
// 	// number
// 	foo: 5,
// 	// text
// 	bar: 'baz',
// 	// switch
// 	baz: false,
// 	// select
// 	qux: [1, 2, 3],
// 	// nested
// 	quux: { a: 'a', b: 'b' },
// 	// color
// 	quuz: new Color('red'),
// 	// nested
// 	parent: {
// 		child: 'foo',
// 	},
// }

// interface ExpectedTargetInference {
// 	foo: InputNumber
// 	bar: InputText
// 	baz: InputSwitch
// 	qux: InputSelect<number>
// 	quux: {
// 		a: InputText
// 		b: InputText
// 	}
// 	quuz: InputColor
// 	parent: {
// 		child: InputText
// 	}
// }

// function test() {
// 	const inference: ExpectedTargetInference = testTargetInferer(testTarget)
// 	inference // works!

// 	const gui = {} as Gooey

// 	const bindManyTest = gui.bindMany(testTarget, {
// 		foo: { min: 0, max: 10, step: 1 },
// 		parent: {
// 			child: { title: 'Child' },
// 		},
// 	})
// 	bindManyTest
// }
// test
//#endregion
