import type { WindowInstance, WindowManagerOptions } from './shared/WindowManager'
import type { Theme, ThemeMode } from './styles/themer/types'
import type { ThemerOptions } from './styles/themer/Themer'
import type { FolderOptions, FolderPreset } from './Folder'
import type { ResizableOptions } from './shared/resizable'
import type { DraggableOptions } from './shared/draggable'
import type { PrimitiveState } from './shared/state'
import type { Placement } from './shared/place'
import type { Commit } from './UndoManager'

import theme_default from './styles/themes/default'
import theme_scout from './styles/themes/scout'
import theme_flat from './styles/themes/flat'
import style from './styles/gooey.css'

import { WindowManager, WINDOWMANAGER_DEFAULTS } from './shared/WindowManager'
import { deepMergeOpts } from './shared/deepMergeOpts'
import { resolveOpts } from './shared/resolveOpts'
import { PresetManager } from './PresetManager'
import { Themer } from './styles/themer/Themer'
import settingsIcon from './svg/settings-icon'
import { GUI_VARS } from './styles/GOOEY_VARS'
import { UndoManager } from './UndoManager'
import { select } from './shared/select'
import { nanoid } from './shared/nanoid'
import { Logger } from './shared/logger'
import { create } from './shared/create'
import { state } from './shared/state'
import { place } from './shared/place'
import { isSafari } from './shared/ua'
import { Folder } from './Folder'
import { o } from './shared/l'

//· Types ························································································¬

type GooeyTheme = 'default' | 'flat' | 'scour' | (string & {})

export interface GooeyElements {
	root: HTMLElement
}

export interface GooeyOptions {
	__type: 'GooeyOptions'

	/**
	 * The title of the Gooey.
	 * @default 'gooey'
	 */
	title: string

	/**
	 * Defines which properties to persist in localStorage, and under which
	 * key, if any.  If `true`, the {@link GUI_STORAGE_DEFAULTS} will be used.
	 * If `false`, no state will be persisted.
	 * @default true
	 */
	storage: boolean | Partial<GooeyStorageOptions>

	/**
	 * The container to append the gooey to.
	 * @default 'body'
	 */
	// container: HTMLElement
	container: string | HTMLElement | 'document' | 'body'

	/**
	 * Whether the gooey is draggable.
	 * @default true
	 */
	draggable: boolean

	/**
	 * Whether the gooey is resizable.
	 * @default true
	 */
	resizable: boolean

	/**
	 * The title of the theme to use for the gooey.  To add your own themes,
	 * use {@link themerOptions.themes}.
	 * @default 'default'
	 */
	theme: GooeyTheme

	/**
	 * The themes available to the gooey.
	 * @defaultValue [ {@link theme_default|default}, {@link theme_flat|flat}, {@link theme_scout|scout} ]
	 */
	themes: Theme[]

	/**
	 * The initial {@link Themer.mode|theme mode}.
	 * @default 'dark'
	 */
	themeMode: 'light' | 'dark' | 'system'

	/**
	 * The gooey's initial position on the screen.  If `undefined`, the gooey will
	 * be placed in the top-right corner of the screen.
	 *
	 * This value can either be a {@link Placement} string, or an object with
	 * `x` and `y` properties representing the position in pixels.
	 * @default 'top-right'
	 */
	position: Placement | { x: number; y: number }

	/**
	 * The margin in pixels to apply to the placement.  Can be a number
	 * to apply the same margin to both x and y, or an object with x
	 * and y properties to apply different margins to each axis.
	 * @default 16
	 */
	margin: number | { x: number; y: number }

	/**
	 * The initial expanded state of the gooey.
	 * @default false
	 */
	closed: boolean

	/**
	 * Presets to make available in the gooey.
	 * @default []
	 */
	presets?: GooeyPreset[]

	/**
	 * The default preset to load when the gooey is created, or the initial gooey state if undefined.
	 * @default undefined
	 */
	defaultPreset?: GooeyPreset

	/**
	 * A unique id for the gooey's root element.
	 * @default {@link nanoid}
	 */
	id?: string

	/**
	 * Whether to load the default font for use.  Set to `false` if you're overwriting
	 * the `--fragcui-font` variable in your theme.
	 * @default true
	 */
	loadDefaultFont?: boolean

	/**
	 * @internal
	 */
	_windowManager?: WindowManager

	/**
	 * @internal
	 */
	_themer?: Themer
}

export interface GooeyStorageOptions {
	__type: 'GooeyStorageOptions'

	/**
	 * Prefix to use for localStorage keys.
	 * @default `"fractils::gooey"`
	 */
	key: string

	/**
	 * Whether to persist the folder's expanded state.
	 * @default true
	 */
	closed?: boolean

	/**
	 * Whether to persist the theme.
	 * @default true
	 */
	theme?: boolean

	/**
	 * Whether to persist the gooey's position.
	 * @default true
	 */
	position?: boolean

	/**
	 * Whether to persist the gooey's size.
	 * @default true
	 */
	size?: boolean

	/**
	 * Whether to persist the gooey's presets.
	 * @default true
	 */
	presets?: boolean
}

export interface GooeyPreset {
	__type: 'GooeyPreset'
	__version: number
	id: string
	title: string
	data: FolderPreset
}
//⌟

//· Constants ····················································································¬

export const GUI_STORAGE_DEFAULTS: GooeyStorageOptions = {
	__type: 'GooeyStorageOptions',
	key: 'gooey',
	closed: true,
	theme: true,
	presets: true,
	position: true,
	size: true,
} as const

export const GUI_WINDOWMANAGER_DEFAULTS = {
	__type: 'WindowManagerOptions',
	preserveZ: false,
	zFloor: 0,
	bounds: undefined,
	obstacles: undefined,
	resizable: {
		grabberSize: 9,
		color: 'var(--bg-d)',
		sides: ['right', 'left'],
		corners: [],
	},
	draggable: {
		bounds: undefined,
		classes: {
			default: 'gooey-draggable',
			dragging: 'gooey-dragging',
			cancel: 'gooey-cancel',
			dragged: 'gooey-dragged',
		},
	},
} as const satisfies WindowManagerOptions

export const GUI_DEFAULTS = {
	__type: 'GooeyOptions',
	title: 'gooey',
	storage: true,
	closed: false,
	position: 'top-right',
	margin: 16,
	container: 'body',
	theme: 'default',
	themeMode: 'dark',
	themes: [theme_default, theme_flat, theme_scout],
	resizable: true,
	draggable: true,
	loadDefaultFont: true,
} as const satisfies GooeyOptions
//⌟

/**
 * The root Gooey instance.  This is the entry point for creating
 * a gooey.  You can create multiple root gooeys, but each gooey
 * can only have one root.
 */
@styled
export class Gooey {
	__type = 'Gooey' as const

	id = nanoid()
	folder: Folder

	declare elements: GooeyElements

	static style = style

	/**
	 * The initial options passed to the gooey.
	 */
	opts: GooeyOptions & { storage: GooeyStorageOptions | false }

	/**
	 * Whether the gooey root folder is currently collapsed.
	 */
	closed: PrimitiveState<boolean>

	/**
	 * The {@link PresetManager} instance for the gooey.
	 */
	presetManager!: PresetManager

	/**
	 * Whether any of the inputs have been changed from their default values in the active preset.
	 */
	dirty = false

	wrapper!: HTMLElement
	container!: HTMLElement
	settingsFolder: Folder
	static settingsFolderTitle = 'gooey-settings-folder'

	/**
	 * The {@link UndoManager} instance for the gooey, handling undo/redo functionality.
	 * @internal
	 */
	_undoManager = new UndoManager()

	themer: Themer
	// themeEditor?: ThemeEditor
	windowManager?: WindowManager

	private static _initialized = false
	/**
	 * `false` if this {@link Gooey}'s {@link WindowManager} belongs to an existing, external
	 * instance _(i.e. a separate {@link Gooey} instance or custom {@link WindowManager})_.  The
	 * {@link WindowManager} will be disposed when this {@link Gooey} is disposed.
	 * @internal
	 */
	private _isWindowManagerOwner = false
	/**
	 * The time of the gooey's creation.
	 * @internal
	 */
	private readonly _birthday = Date.now()
	/**
	 * The number of milliseconds post-instantiation to watch for adders for repositioning.
	 * @internal
	 */
	private _honeymoon: false | 1000 = 1000
	private _theme!: GooeyOptions['theme']
	private _log: Logger

	// Forwarding the Folder API...
	on: Folder['on']
	addFolder(title: string, options?: Partial<FolderOptions>) {
		if (this._honeymoon && this._birthday - Date.now() < 1000) {
			this._honeymoon = false
			this._reveal(true)
		}

		return this.folder.addFolder(title, {
			...options,
			// @ts-expect-error @internal
			gooey: this,
		})
	}
	bind: Folder['bind']
	add: Folder['add']
	addMany: Folder['addMany']
	addButtonGrid: Folder['addButtonGrid']
	addSelect: Folder['addSelect']
	addButton: Folder['addButton']
	addText: Folder['addText']
	addNumber: Folder['addNumber']
	addSwitch: Folder['addSwitch']
	addColor: Folder['addColor']

	constructor(options?: Partial<GooeyOptions>) {
		//· Setup ················································································¬

		const opts = deepMergeOpts([GUI_DEFAULTS, options ?? {}], {
			concatArrays: false,
		}) as GooeyOptions

		opts.container ??= document.body

		let reposition = false
		/** Resolve storage separately since {@link GUI_DEFAULTS.storage} is `false`.  */
		if (typeof opts.storage === 'object') {
			opts.storage = Object.assign({}, GUI_STORAGE_DEFAULTS, opts.storage)
		}

		const storageOpts = resolveOpts(opts.storage, GUI_STORAGE_DEFAULTS)
		if (storageOpts) {
			opts.storage = {
				...storageOpts,
				key: `${storageOpts.key}::${opts.title?.toLowerCase().replaceAll(/\s/g, '-')}`,
			}
			// When storage is on, repositioning after animating-in is disabled unless this is the
			// _very_ first page load.
			if (!(`${opts.storage.key}::wm::0::position` in localStorage)) {
				reposition = true
			}
		} else {
			reposition = true
		}

		this.opts = opts as GooeyOptions & { storage: GooeyStorageOptions | false }

		this._log = new Logger(`Gooey ${this.opts.title}`, { fg: 'palevioletred' })
		this._log.fn('constructor').info({ options, opts })

		if (this.opts.loadDefaultFont !== false) {
			const ff = new FontFace(
				'fredoka',
				`url(${encodeURI?.(
					'https://cdn.jsdelivr.net/fontsource/fonts/fredoka:vf@latest/latin-wdth-normal.woff2',
				)})`,
				{
					style: 'normal',
					display: 'swap',
					weight: '300 700',
					stretch: '75% 125%',
					unicodeRange:
						'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
				},
			)

			ff.load().then(font => {
				// @ts-expect-error - ¯\_(ツ)_/¯
				document.fonts.add(font)
			})
		}

		this.container = select(this.opts.container)[0]

		this.wrapper = create('div', {
			classes: ['gooey-wrapper'],
			style: {
				display: 'contents',
			},
			parent: this.container,
		})

		this.folder = new Folder({
			...this.opts,
			__type: 'FolderOptions',
			container: this.wrapper,
			// @ts-expect-error @internal
			gooey: this,
		})

		// Not stoked about this.
		this.on = this.folder.on.bind(this.folder)
		// this.addFolder = this.folder.addFolder.bind(this.folder)
		this.bind = this.folder.bind.bind(this.folder)
		this.add = this.folder.add.bind(this.folder)
		this.addMany = this.folder.addMany.bind(this.folder)
		this.addButtonGrid = this.folder.addButtonGrid.bind(this.folder)
		this.addSelect = this.folder.addSelect.bind(this.folder)
		this.addButton = this.folder.addButton.bind(this.folder)
		this.addText = this.folder.addText.bind(this.folder)
		this.addNumber = this.folder.addNumber.bind(this.folder)
		this.addSwitch = this.folder.addSwitch.bind(this.folder)
		this.addColor = this.folder.addColor.bind(this.folder)

		const handleUndoRedo = (e: KeyboardEvent) => {
			if (globalThis.navigator?.userAgent?.match(/mac/i)) {
				if (e.metaKey && e.key === 'z') {
					e.preventDefault()
					e.shiftKey ? this._undoManager.redo() : this._undoManager.undo()
				}
			} else if (e.ctrlKey) {
				if (e.key === 'z') {
					e.preventDefault()
					this._undoManager.undo()
				}

				if (e.key === 'y') {
					e.preventDefault()
					this._undoManager.redo()
				}
			}
		}

		removeEventListener('keydown', handleUndoRedo)
		addEventListener('keydown', handleUndoRedo)
		//⌟

		this.closed = state(!!this.opts.closed, {
			key: this.opts.storage ? `${this.opts.storage.key}::closed` : undefined,
		})

		this.folder.elements.toolbar.settingsButton = this._createSettingsButton(
			this.folder.elements.toolbar.container,
		)

		this.settingsFolder = this.addFolder(Gooey.settingsFolderTitle, {
			closed: false,
			// @ts-expect-error @internal
			_headerless: true,
		})
		this.settingsFolder.element.classList.add('gooey-folder-alt')

		this.themer = this.opts._themer ?? this._createThemer(this.settingsFolder)
		this.theme = this.opts.theme
		this.presetManager = this._createPresetManager(this.settingsFolder)

		this.windowManager ??= this._createWindowManager(this.opts, this.opts.storage)

		// Give the user a chance to add folders / inputs before positioning.
		this._reveal(reposition)

		return this
	}

	private async _reveal(reposition: boolean) {
		// In case dispose() was called before this resolved...
		if (!this.container) return

		// Append a non-animating, full-size clone to get the proper rect.
		const ghost = this.wrapper.cloneNode(true) as HTMLElement
		ghost.style.visibility = 'hidden'
		this.container.prepend(ghost)

		// This is the only way to get the correct future rect afaik 😅
		const rect = ghost.children[0].getBoundingClientRect()

		ghost.remove()

		if (typeof this.opts.position === 'string') {
			const placementPosition = place(rect, this.opts.position, {
				bounds: this.opts.container,
				margin: this.opts.margin,
			})

			// Use the rect to correct the window manager's positioning when storage is off.
			if (reposition || (this.opts.storage && this.opts.storage.position === false)) {
				const win = this.windowManager?.windows.get(this.folder.element.id)
				if (win?.draggableInstance) {
					win.draggableInstance.position = placementPosition
				}
			}
		}

		// Now that we're in position and inputs are loaded, we can animate-in.
		this.container.appendChild(this.wrapper)
		this.folder.element.animate([{ opacity: 0 }, { opacity: 1 }], {
			fill: 'none',
			duration: 400,
		})

		// Ugly hack to force repaint on Safari to workaround its buggy ass blur filter...
		if (isSafari()) {
			setTimeout(() => {
				this.folder.element.style.display = 'table'
				this.folder.element.offsetHeight
				this.folder.element.style.display = 'flex'
			}, 500)
		}
	}

	private _createPresetManager(settingsFolder: Folder) {
		const { presets, defaultPreset, storage } = this.opts
		let localStorageKey: string | undefined
		if (typeof storage === 'object' && storage.presets) {
			localStorageKey = storage.key + '::presets'
		}

		return new PresetManager(this, settingsFolder, {
			presets,
			defaultPreset,
			localStorageKey,
		})
	}

	private _createWindowManager(
		options: Partial<GooeyOptions>,
		storageOpts: typeof this.opts.storage,
	) {
		if (this.windowManager) return this.windowManager // ??

		let dragOpts = undefined as Partial<DraggableOptions> | undefined
		if (this.opts.draggable) {
			dragOpts = Object.assign({}, GUI_WINDOWMANAGER_DEFAULTS.draggable)
			dragOpts.handle = this.folder.elements.header
			dragOpts.position = this.opts.position
			dragOpts.localStorageKey = storageOpts && storageOpts.key ? storageOpts.key : undefined
			dragOpts.bounds = this.container
			if (storageOpts && storageOpts.position === false) {
				dragOpts.localStorageKey = undefined
			}
		}

		let resizeOpts = undefined as Partial<ResizableOptions> | undefined
		if (this.opts.resizable) {
			resizeOpts = Object.assign({}, GUI_WINDOWMANAGER_DEFAULTS.resizable)
			resizeOpts.bounds = this.container
			resizeOpts.localStorageKey =
				storageOpts && storageOpts.key ? storageOpts.key : undefined
			if (storageOpts && storageOpts.size === false) {
				resizeOpts.localStorageKey = undefined
			}
		}

		// Use the provided window manager if it's an instance.
		if (options?._windowManager instanceof WindowManager) {
			const windowManager = options._windowManager

			windowManager.add(this.folder.element, {
				id: this.id,
				resizable: resizeOpts,
				draggable: dragOpts,
			})

			return windowManager
		}

		const windowManagerOpts = resolveOpts<WindowManagerOptions>(
			{
				...GUI_WINDOWMANAGER_DEFAULTS,
				draggable: dragOpts,
				resizable: resizeOpts,
			},
			WINDOWMANAGER_DEFAULTS,
		)

		this._log
			.fn('_createWindowManager')
			.info({ windowManagerOpts, options, opts: this.opts, dragOpts, resizeOpts })

		const windowManager = new WindowManager({
			...windowManagerOpts,
			draggable: dragOpts,
			resizable: resizeOpts,
		})
		this._isWindowManagerOwner = true

		windowManager.add(this.folder.element, {
			id: this.id,
			// The rest of the options will inherit from the WindowManager instance.
		})

		return windowManager
	}

	set theme(theme: GooeyTheme) {
		this._theme = theme
		this.folder.element.setAttribute('theme', theme)
		this.folder.element.setAttribute('mode', this.themer.mode.value)
	}
	get theme() {
		return this._theme!
	}

	/**
	 * Saves the current gooey state as a preset.
	 */
	save(
		/**
		 * The title of the preset.
		 */
		title: string,

		/**
		 * A unique id for the preset.
		 * @defaultValue {@link nanoid|nanoid(10)}
		 */
		id = nanoid(10),
	) {
		const preset: GooeyPreset = {
			__type: 'GooeyPreset',
			__version: 0,
			id,
			title,
			data: this.folder.save(),
		} as const

		return preset
	}

	/**
	 * Loads a given preset into the gooey, updating all inputs.
	 */
	load(preset: GooeyPreset) {
		this._log.fn('load').info({ preset })

		// todo - this isn't working, it's being unset immediately somewhere...
		this.dirty = false

		this.lockCommits(preset)
		this.folder.load(preset.data)
		Promise.resolve().then(() => this.unlockCommits())
	}

	_undoLock = false
	lockCommit: { from: GooeyPreset | undefined } = { from: undefined }

	/**
	 * Commits a change to the input's value to the undo manager.
	 */
	commit(commit: Partial<Commit>) {
		if (this._undoLock) {
			this._log.fn('commit').info('LOCKED: prevented commit while locked')
			return
		}
		this._log.fn('commit').info('commited', commit)
		this._undoManager?.commit(commit as Commit)
	}

	/**
	 * Prevents the input from registering undo history, storing the initial
	 * for the eventual commit in {@link unlockCommits}.
	 */
	private lockCommits = (from: GooeyPreset) => {
		this._undoManager.lockedExternally = true
		this.lockCommit.from = from
		this._log.fn(o('lock')).info('commit', { from, lockCommit: this.lockCommit })
	}

	/**
	 * Unlocks commits and saves the current commit stored in lock.
	 */
	private unlockCommits = (commit?: Partial<Commit>) => {
		commit ??= {}
		commit.target ??= this as any
		commit.from ??= this.lockCommit.from

		// this._undoLock = false
		this._undoManager.lockedExternally = false
		this.commit(commit)

		this._log.fn(o('unlock')).info('commit', { commit, lockCommit: this.lockCommit })
	}

	private _createThemer(folder: Folder) {
		this._log.fn('createThemer').info({ folder })
		let finalThemer = undefined as Themer | undefined
		const themer = this.opts._themer
		const themerOptions: Partial<ThemerOptions> = {
			localStorageKey: this.opts.storage ? this.opts.storage.key + '::themer' : undefined,
			mode: this.opts.themeMode,
			autoInit: !this.themer,
			persistent: !!(this.opts.storage && this.opts.storage.theme),
			themes: this.opts.themes,
			theme: this.opts.themes.find(t => t.title === this.opts.theme),
			vars: GUI_VARS,
		}
		themerOptions.vars = deepMergeOpts([GUI_VARS, themerOptions.vars])

		if (themer) {
			finalThemer = themer
		} else {
			themerOptions.wrapper = this.wrapper
			finalThemer = new Themer(this.folder.element, themerOptions)
		}

		const uiFolder = folder.addFolder('ui', { closed: true })

		// Fully desaturate the ui folder's header connector to svg.
		uiFolder.on('mount', () => {
			uiFolder.graphics?.connector?.svg.style.setProperty('filter', 'saturate(0.1)')
			uiFolder.graphics?.icon.style.setProperty('filter', 'saturate(0)')
		})

		if (folder) {
			uiFolder.addSelect<Theme>({
				title: 'theme',
				labelKey: 'title',
				options: finalThemer.themes.value,
				binding: {
					target: finalThemer,
					key: 'theme',
				},
			})

			uiFolder.addButtonGrid({
				title: 'mode',
				activeOnClick: true,
				value: [
					['light', 'dark', 'system'].map(m => ({
						text: m,
						onClick: () => finalThemer?.mode.set(m as ThemeMode),
						active: () => finalThemer?.mode.value === m,
					})),
				],
			})
		}

		return finalThemer
	}

	private _createSettingsButton(parent: HTMLElement) {
		const button = create<'button', any, HTMLButtonElement>('button', {
			parent,
			classes: ['gooey-toolbar-item', 'gooey-settings-button'],
			innerHTML: settingsIcon,
			tooltip: {
				text: () => {
					return this.settingsFolder?.closed.value ? 'Open Settings' : 'Close Settings'
				},
				placement: 'left',
				delay: 750,
				delayOut: 0,
				hideOnClick: true,
			},
		})

		button.addEventListener('click', () => {
			this.settingsFolder.toggle()

			this.folder.elements.toolbar.settingsButton?.classList.toggle(
				'open',
				!this.settingsFolder.closed.value,
			)
		})

		return button
	}

	dispose = () => {
		this._log.fn('dispose').info(this)
		this.themer?.dispose()
		// this.themeEditor?.dispose()
		if (this._isWindowManagerOwner) {
			this.windowManager?.dispose()
			this.container?.remove()
		}
		this.settingsFolder?.dispose()
		this.folder?.dispose()
	}
}
