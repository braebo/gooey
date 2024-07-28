import type { WindowInstance, WindowManagerOptions } from './shared/WindowManager'
import type { Theme, ThemeMode } from './styles/themer/types'
import type { ThemerOptions } from './styles/themer/Themer'
import type { FolderOptions, FolderPreset } from './Folder'
import type { ResizableOptions } from './shared/resizable'
import type { DraggableOptions } from './shared/draggable'
import type { Placement } from './shared/place'
import type { Commit } from './UndoManager'

import theme_default from './styles/themes/vanilla'
import theme_scout from './styles/themes/scout'
import theme_flat from './styles/themes/flat'
import style from './styles/gooey.css'

import { WindowManager, WINDOWMANAGER_DEFAULTS } from './shared/WindowManager'
import { persist, type PersistedValue } from './shared/persist'
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
	margin: number | { x?: number; y?: number }

	/**
	 * The initial width of the gooey in pixels.
	 *
	 * @remakrs This can also be set by overriding the `--gooey-root_width` CSS custom property on
	 * the {@link Gooey.element} element `.gooey-root`, which is responsible for the root width.
	 * @default undefined
	 */
	width?: number

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

	/**
	 * Any {@link FolderOptions} for the builtin global settings folder.
	 * @default { closed: true }
	 */
	settingsFolder?: Partial<FolderOptions>
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
	__version: string
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
	theme: 'vanilla',
	themeMode: 'dark',
	themes: [theme_default, theme_flat, theme_scout],
	resizable: true,
	draggable: true,
	loadDefaultFont: true,
	settingsFolder: { closed: true as boolean },
} as const satisfies GooeyOptions

/**
 * Methods inherited from {@link Folder} to forward to the gooey.
 * @remarks Gooey _used to_ extend {@link Folder}, but that caused more problems than it solved...
 */
// prettier-ignore
const FORWARDED_METHODS = ['on','add','addMany','addButtonGrid','addSelect','addButton','addText','addNumber','addSwitch','addColor','bind','bindMany','bindButtonGrid','bindSelect','bindButton','bindText','bindNumber','bindSwitch','bindColor'] as const satisfies Array<keyof Folder>
//⌟

export interface Gooey extends Pick<Folder, (typeof FORWARDED_METHODS)[number]> {}

/**
 * The root Gooey instance.  This is the entry point for creating
 * a gooey.  You can create multiple root gooeys, but each gooey
 * can only have one root.
 */
export class Gooey {
	__type = 'Gooey' as const

	id = nanoid()
	folder: Folder

	declare elements: GooeyElements

	/**
	 * The initial options passed to the gooey.
	 */
	opts: GooeyOptions & { storage: GooeyStorageOptions | false }

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

	/**
	 * The {@link UndoManager} instance for the gooey, handling undo/redo functionality.
	 * @internal
	 */
	_undoManager = new UndoManager()

	themer: Themer
	// themeEditor?: ThemeEditor
	windowManager?: WindowManager

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
	private _closedMap: PersistedValue<Record<string, boolean>>
	private static _initialized = false

	constructor(options?: Partial<GooeyOptions>) {
		//· Setup ················································································¬

		if (!Gooey._initialized && globalThis.document) {
			Gooey._initialized = true
			const sheet = new CSSStyleSheet()
			sheet.replaceSync(style)
			globalThis.document.adoptedStyleSheets.push(sheet)
		}

		const opts = deepMergeOpts([GUI_DEFAULTS, options ?? {}], {
			concatArrays: false,
		}) as GooeyOptions

		opts.container ??= document.body
		if (typeof opts.storage === 'object') {
			opts.storage = Object.assign({}, GUI_STORAGE_DEFAULTS, opts.storage)
		}

		let reposition = false
		const storageOpts = resolveOpts(opts.storage, GUI_STORAGE_DEFAULTS)
		if (!storageOpts) {
			reposition = true
		} else {
			opts.storage = {
				...storageOpts,
				key: `${storageOpts.key}::${opts.title?.toLowerCase().replaceAll(/\s/g, '-')}`,
			}
			// When storage is on, repositioning after animating-in is disabled unless this is the
			// _very_ first page load.
			if (!(`${opts.storage.key}::wm::0::position` in localStorage)) {
				reposition = true
			}
		}

		this.opts = opts as GooeyOptions & { storage: GooeyStorageOptions | false }

		this._log = new Logger(`Gooey ${this.opts.title}`, { fg: 'palevioletred' })
		this._log.fn('constructor').debug({ options, opts })

		if (this.opts.loadDefaultFont !== false) {
			const fredoka = new FontFace(
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

			fredoka.load().then(font => {
				// @ts-expect-error - ¯\_(ツ)_/¯
				document.fonts.add(font)
			})

			const inconsolata = new FontFace(
				'inconsolata',
				`url(${encodeURI?.(
					'https://cdn.jsdelivr.net/fontsource/fonts/inconsolata:vf@latest/latin-wdth-normal.woff2',
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

			inconsolata.load().then(font => {
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

		this._closedMap = persist('gooey::closed-map', {})
		this._closedMap

		this.folder = new Folder({
			...this.opts,
			__type: 'FolderOptions',
			container: this.wrapper,
			// @ts-expect-error @internal
			gooey: this,
		})

		// Poor-mans inheritance...
		for (const key of FORWARDED_METHODS) {
			// @ts-expect-error - ¯\_(ツ)_/¯
			this[key] = this.folder[key].bind(this.folder)
		}

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

		const { button, updateIcon } = this._createSettingsButton(
			this.folder.elements.toolbar.container,
		)
		this.folder.elements.toolbar.settingsButton = button

		let settingsFolderClosed = GUI_DEFAULTS.settingsFolder.closed
		// Use localstorage, if enabled.
		if (typeof opts.storage === 'object' && opts.storage.closed !== false) {
			settingsFolderClosed =
				this._closedMap.value[`${this.title}__gooey_settings_folder`] ?? true
		} else if (opts.settingsFolder?.closed) {
			settingsFolderClosed = opts.settingsFolder.closed
		}

		this.settingsFolder = this.addFolder('gooey_settings_folder', {
			// @ts-expect-error @internal
			_headerless: true,
			...opts.settingsFolder,
			closed: settingsFolderClosed,
			saveable: false,
		})
		this.settingsFolder.element.classList.add('gooey-folder-alt')
		updateIcon()

		this.themer = this.opts._themer ?? this._createThemer(this.settingsFolder)
		this.theme = this.opts.theme
		this.presetManager = this._createPresetManager(this.settingsFolder)

		this.windowManager ??= this._createWindowManager(this.opts, this.opts.storage)

		// Give the user a chance to add folders / inputs before positioning.
		this._reveal(reposition)

		return this
	}

	private async _reveal(reposition: boolean): Promise<void> {
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
				const win = this.window
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

	get title(): string {
		return this.folder.title
	}
	set title(v: string) {
		this.folder.title = v
	}

	get closed(): Folder['closed'] {
		return this.folder.closed
	}

	get inputs() {
		return this.folder.inputs
	}
	get allInputs() {
		// todo - Don't love this..
		return new Map(
			[...this.folder.allInputs.entries()].filter(
				([k]) => !k.startsWith('ui') && !k.startsWith('presets'),
			),
		)
	}

	get window(): WindowInstance | undefined {
		return this.windowManager?.windows.get(this.folder.element.id)
	}

	set theme(theme: GooeyTheme) {
		this._theme = theme
		this.folder.element.setAttribute('theme', theme)
		this.folder.element.setAttribute('mode', this.themer.mode.value)
	}
	get theme() {
		return this._theme!
	}

	public addFolder(title: string, options?: Partial<FolderOptions>) {
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
		version?: string,
	) {
		this._log.fn('save').debug({ title, id })
		const preset: GooeyPreset = {
			__type: 'GooeyPreset',
			__version: version ?? this.presetManager.__version,
			id,
			title,
			data: this.folder.save(),
		} as const

		return preset
	}

	/**
	 * Loads a given preset into the gooey, updating all inputs.
	 */
	load(preset: GooeyPreset | Record<string, any>) {
		this._log.fn('load').debug({ preset })

		// todo - this isn't working, it's being unset immediately somewhere...
		this.dirty = false

		this._lockCommits(preset as GooeyPreset)
		this.folder.load(preset.data)
		Promise.resolve().then(() => this._unlockCommits())
	}

	private _undoLock = false
	private _lockCommit: { from: GooeyPreset | undefined } = { from: undefined }

	/**
	 * Commits a change to the input's value to the undo manager.
	 */
	private _commit(commit: Partial<Commit>) {
		if (this._undoLock) {
			this._log.fn('commit').debug('LOCKED: prevented commit while locked')
			return
		}
		this._log.fn('commit').debug('commited', commit)
		this._undoManager?.commit(commit as Commit)
	}

	/**
	 * Prevents the input from registering undo history, storing the initial
	 * for the eventual commit in {@link _unlockCommits}.
	 */
	private _lockCommits = (from: GooeyPreset) => {
		this._undoManager.lockedExternally = true
		this._lockCommit.from = from
		this._log.fn(o('lock')).debug('commit', { from, lockCommit: this._lockCommit })
	}

	/**
	 * Unlocks commits and saves the current commit stored in lock.
	 */
	private _unlockCommits = (commit?: Partial<Commit>) => {
		commit ??= {}
		commit.target ??= this as any
		commit.from ??= this._lockCommit.from

		this._undoManager.lockedExternally = false
		this._commit(commit)

		this._log.fn(o('unlock')).debug('commit', { commit, lockCommit: this._lockCommit })
	}

	private _createThemer(folder: Folder) {
		this._log.fn('createThemer').debug({ folder })
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

		const uiFolder = folder.addFolder('ui')

		// Fully desaturate the ui folder's header connector to svg.
		uiFolder.on('mount', () => {
			uiFolder.graphics?.connector?.svg.style.setProperty('filter', 'saturate(0.1)')
			uiFolder.graphics?.icon.style.setProperty('filter', 'saturate(0)')
		})

		if (folder) {
			const themeInput = uiFolder.addSelect('theme', finalThemer.themes.value, {
				labelKey: 'title',
				initialValue: finalThemer.theme.value,
			})
			themeInput.on('change', v => {
				finalThemer.theme.set(v.value)
			})

			uiFolder.addButtonGrid(
				'mode',
				[
					['light', 'dark', 'system'].map(m => ({
						text: m,
						onClick: () => finalThemer?.mode.set(m as ThemeMode),
						active: () => finalThemer?.mode.value === m,
					})),
				],
				{
					activeOnClick: true,
				},
			)
		}

		return finalThemer
	}

	private _createSettingsButton(parent: HTMLElement): {
		button: HTMLButtonElement
		updateIcon: () => void
	} {
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

		const updateIcon = () => {
			this.folder.elements.toolbar.settingsButton?.classList.toggle(
				'open',
				!this.settingsFolder.closed.value,
			)
		}

		button.addEventListener('click', () => {
			this.settingsFolder.toggle()

			updateIcon()

			if (this.folder.closed) this.folder.open()
		})

		return { button, updateIcon }
	}

	private _createPresetManager(settingsFolder: Folder): PresetManager {
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
	): WindowManager {
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
			.debug({ windowManagerOpts, options, opts: this.opts, dragOpts, resizeOpts })

		const windowManager = new WindowManager({
			...windowManagerOpts,
			draggable: dragOpts,
			resizable: resizeOpts,
		})
		this._isWindowManagerOwner = true

		windowManager.add(this.folder.element, {
			// The rest of the options will be inherited from the WindowManager instance.
			id: this.id,
		})

		return windowManager
	}

	dispose = () => {
		this._log.fn('dispose').debug(this)
		this.themer?.dispose()
		// this.themeEditor?.dispose()
		if (this._isWindowManagerOwner) {
			this.windowManager?.dispose()
		}
		this.presetManager.folder.dispose()
		this.settingsFolder?.dispose()
		this.folder?.dispose()
	}
}
