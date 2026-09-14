import type { PrimitiveState, State } from '../../shared/state'
import type { ElementOrSelector } from '../../shared/select'
import type {
	VariableDefinition,
	ThemeDefinition,
	ExtendedVars,
	ThemeTitle,
	ModeColors,
	ThemeMode,
	Theme,
} from './types'

import { resolveTheme } from './resolveTheme'
import theme_default from './defaultTheme'

import { deepMergeOpts } from '../../shared/deepMergeOpts'
import { partition } from '../../shared/partition'
import { hexToRgb } from '../../shared/hexToRgb'
import { entries } from '../../shared/object'
import { Logger } from '../../shared/logger'
import { select } from '../../shared/select'
import { c, g, o } from '../../shared/l'
import { state } from '../../shared/state'

/**
 * Options for the {@link Themer} class.
 */
export interface ThemerOptions {
	/**
	 * Whether to automatically initialize the theme.
	 * @default true
	 */
	autoInit: boolean
	/**
	 * Whether to persist the active theme title and mode in localStorage.
	 * Needs a {@link localStorageKey}; without one nothing persists.
	 * @default true
	 */
	persistent: boolean
	/**
	 * The default theme to use.
	 * @default A theme titled 'default'.
	 */
	theme: ThemeDefinition
	themes: Array<Theme>
	mode?: ThemeMode
	/**
	 * The localStorage key prefix for the persisted title and mode.
	 * @default undefined
	 */
	localStorageKey?: string
	/**
	 * Additional variables to apply to the theme.
	 * @default {}
	 */
	vars?: ExtendedVars
}

/**
 * Default {@link ThemerOptions} object.
 */
export const THEMER_DEFAULTS: ThemerOptions = {
	autoInit: true,
	persistent: true,
	theme: theme_default,
	themes: [],
	mode: undefined,
	localStorageKey: undefined,
	vars: {},
}

/**
 * The `Themer` class manages multiple customizable themes.  These themes
 * can be applied globally to the document, or scoped to a specific node.
 *
 * A {@link Theme} is a collection of CSS custom properties, most
 * importantly, shades / colors.  Themes can be created as JavaScript
 * objects or JSON in the form of a {@link ThemeDefinition}, which is
 * just a Partial<{@link Theme}> run through {@link resolveTheme} to
 * generate `theme.colors.dark` and `theme.colors.light` variants from
 * `theme.colors.base`.  This can be extended arbitrarily (// todo //).
 *
 * It can be used to store, retrieve, create, and apply themes. It can
 * apply themes to either the root document, or a specific node and
 * its children. Each {@link ThemeDefinition} has light and dark
 * variants (auto-generated if not specified), and the active
 * variant isdetermined by the current {@link ThemeMode},
 * which can be set to 'light', 'dark', or 'system'.
 *
 * @example
 * ```ts
 * import { Themer } from 'gooey'
 * import my_theme from './themes/my_theme'
 *
 * const themer = new Themer('document', { theme: my_theme, themes: [my_theme], mode: 'dark' })
 *
 * themer.mode.set('light')
 * themer.create({ ...my_theme, title: 'my_theme_2' })
 * ```
 */
export class Themer {
	/**
	 * The first target — every target gets the theme's css vars and the `theme` / `mode`
	 * attributes on each apply; {@link attach} adds more.
	 */
	node: HTMLElement

	/**
	 * The currently active theme.  When `theme.set` is called, the new theme
	 * passed in is automatically applied.
	 */
	theme: State<Theme>

	/**
	 * All themes available to the themer — {@link ThemerOptions.themes} plus {@link userThemes}.
	 */
	themes: State<Theme[]>

	/**
	 * Themes added at runtime with {@link create}.  Persisted under `<key>::themes` when
	 * {@link ThemerOptions.persistent}, and merged over the code's themes by title on load.
	 * Code themes are never stored — their source is their record.
	 */
	userThemes: State<Theme[]>

	/**
	 * The title of the currently active {@link theme}.
	 *
	 * When {@link ThemerOptions.persistent} is `true`, this value is
	 * saved to localStorage and used to restore the theme on page load.
	 */
	activeThemeTitle: State<ThemeTitle>

	/**
	 * The current mode ('light', 'dark', or 'system').
	 *
	 * When this state value is re-assigned with `mode.set`, the current theme
	 * is automatically updated.
	 *
	 * When {@link ThemerOptions.persistent} is `true`, this value is saved
	 * to localStorage and used to restore the mode on page load.
	 */
	mode: State<'light' | 'dark' | 'system'>

	private _initialized = false
	private _prefersDark: MediaQueryList
	private _unsubs: Array<() => void> = []
	private _targets = new Set<HTMLElement>()
	private _log: Logger

	constructor(
		/**
		 * The element to theme.  Can be a selector, id (`#id`), a
		 * DOM element, or the string literal `'document'` to use
		 * the document element.
		 * @default 'document'
		 */
		node: ElementOrSelector | Document | 'document' = 'document',
		options?: Partial<ThemerOptions>,
	) {
		const opts = deepMergeOpts([THEMER_DEFAULTS, options])
		// Persistence needs both the flag and a key — `String(undefined)` used to mint a shared
		// 'undefined::…' key for every storage-less themer on the origin.
		const key = opts.persistent && opts.localStorageKey ? opts.localStorageKey : undefined

		this.node =
			node === 'document'
				? document.documentElement
				: typeof node === 'string'
					? (select(node)[0] ?? document.documentElement)
					: (node as HTMLElement)

		this._log = new Logger(`themer ${this.node.classList[0]}`, { fg: 'DarkCyan' })

		this._log.fn(g('constructor')).debug({ node, opts, this: this })

		this.theme = state(resolveTheme(opts.theme, opts.vars))

		this.userThemes = state<Theme[]>([], { key: key && key + '::themes' })

		const user = this.userThemes.value
		const code = opts.themes
			.map(t => resolveTheme(t, opts.vars))
			.filter(t => !user.some(u => u.title === t.title))
		this.themes = state([...code, ...user])

		this.activeThemeTitle = state(opts.theme.title, {
			key: key && key + '::activeTheme',
		})

		const storedTitle = this.activeThemeTitle.value
		if (opts.theme.title !== storedTitle) {
			const theme = this.themes.value.find(t => t.title === storedTitle)
			if (theme) this.theme.set(theme)
		}

		this.mode = state(opts.mode ?? 'system', {
			key: key && key + '::mode',
		})

		this._prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

		this._prefersDark.addEventListener('change', this.#handlePrefChange)
		this._unsubs.push(() =>
			this._prefersDark.removeEventListener('change', this.#handlePrefChange),
		)

		this.#addSub(this.theme, v => {
			this._log.fn(o('theme.subscribe')).debug({ v, this: this })
			if (this._initialized) {
				this.activeThemeTitle.set(v.title)
				this.applyTheme()
			}
		})

		this.#addSub(this.mode, v => {
			this._log
				.fn(o('mode.subscribe'))
				.debug('mode change ->', v + (v === 'dark' ? ' 🌙' : ' 🔆'), { this: this })

			if (typeof v === 'undefined') throw new Error('Mode is undefined.')

			if (this._initialized) this.applyTheme()
		})

		this._targets.add(this.node)

		if (opts.autoInit) {
			this.init()
		}
	}

	#addSub<
		S extends PrimitiveState<unknown>,
		V extends Parameters<Parameters<S['subscribe']>[0]>[0],
	>(state: S, cb: (v: V) => void) {
		this._unsubs.push(state.subscribe(v => cb(v as V)))
	}

	init() {
		const themes = this.themes.value
		const theme = this.theme.value

		this._log.fn(c('init')).debug({ theme: this.theme, this: this })
		if (typeof document === 'undefined') return

		if (this._initialized) return this
		this._initialized = true

		// Make sure the initial theme is in the themes array — a code theme, so not via `create`.
		if (!themes.find(t => t.title === theme.title)) {
			this.themes.set([...themes, theme])
		}

		this.applyTheme()

		return this
	}

	/**
	 * The active theme's variables based on the current mode.
	 */
	get modeColors(): ModeColors {
		return Object.assign(
			{},
			this.theme.value.vars.color.base,
			this.theme.value.vars.color[this.activeMode],
		)
	}

	/**
	 * The current mode, taking into account the system preferences.
	 */
	get activeMode(): 'light' | 'dark' {
		const mode = this.mode.value
		return mode === 'system' ? this.#systemPreference : mode
	}

	get #systemPreference() {
		return this._prefersDark.matches ? 'dark' : 'light'
	}

	#handlePrefChange = () => {
		if (this.mode.value === 'system') this.theme.set(this.theme.value)
	}

	/**
	 * Adds a new theme to the Themer and to {@link userThemes}.
	 */
	create = (
		/**
		 * The theme to add.
		 * @remarks If a theme with the same title already exists, its title
		 * will be incremented with a number suffix (i.e. `my-theme (1)`).
		 */
		newTheme: Theme,
		options?: {
			/**
			 * Whether to overwrite an existing theme with the same title,
			 * or increment the title with a number suffix.
			 * @default false
			 */
			overwrite?: boolean
		},
	) => {
		this._log.fn(c('create')).debug({ newTheme, options, this: this })

		const theme = structuredClone(newTheme)
		const overwrite = options?.overwrite ?? false

		const [dupes, existing] = partition(this.themes.value, t => t.title === theme.title)

		if (!overwrite && dupes.length > 0) {
			// Keep the existing theme and give the new one a suffixed title.
			existing.push(dupes[0])

			let i = 1
			while (existing.some(t => t.title === `${theme.title} (${i})`)) i++
			theme.title = `${theme.title} (${i})`
		}

		this.themes.set([...existing, theme])
		this.userThemes.set([...this.userThemes.value.filter(t => t.title !== theme.title), theme])

		return this
	}

	delete(themeOrTitle: ThemeTitle | Theme) {
		this._log.fn(c('deleteTheme')).debug({ themeOrTitle, this: this })

		const themeTitle = typeof themeOrTitle === 'string' ? themeOrTitle : themeOrTitle.title

		const themes = this.themes.value

		const theme = themes.find(t => t.title === themeTitle)

		if (!theme) {
			this._log.error('`themeTitle` not found in `themes` array.', {
				themeTitle,
				this: this,
			})
			throw new Error(`Theme not found.`)
		}

		const nextIndex = themes.indexOf(theme) - 1

		const isActive = this.theme.value.title === themeTitle

		this.themes.set(this.themes.value.filter(t => t.title !== themeTitle))
		this.userThemes.set(this.userThemes.value.filter(t => t.title !== themeTitle))

		if (isActive) {
			this.theme.set(themes[nextIndex] ?? themes.at(-1))
		}

		return this
	}

	/**
	 * Resolves a {@link Theme} by title.
	 */
	getTheme(themeTitle: ThemeTitle) {
		return this.themes.value.find(t => t.title === themeTitle)
	}

	/**
	 * Applies the current theme to every target (or just the ones given).
	 */
	applyTheme = (targets: HTMLElement[] = [...this._targets]) => {
		this._log
			.fn(c('applyTheme'))
			.debug({ theme: this.theme.value.title, targets: this._targets, this: this })

		if (!('document' in globalThis)) return

		const theme = this.theme.value

		if (!theme) {
			this._log.error('theme not found').debug({ theme, this: this })
			throw new Error(`Theme not found.`)
		}

		this.#applyStyleProps(theme, targets)
		for (const target of targets) {
			target.setAttribute('theme', theme.title)
			target.setAttribute('mode', this.activeMode)
		}

		return this
	}

	/**
	 * Resets to the default theme, 'system' mode, and no other themes; forgets {@link userThemes}.
	 */
	clear() {
		this._log.fn(c('clear')).debug({ this: this })
		this.userThemes.set([])
		this.themes.set([theme_default])
		this.theme.set(theme_default)
		this.mode.set('system')
	}

	/**
	 * Adds a target and applies the current theme to it now.
	 */
	attach(target: HTMLElement) {
		this._targets.add(target)
		this.applyTheme([target])
		return this
	}

	/**
	 * Stops theming a target.  Its vars and attributes stay as they were until something
	 * else writes them.
	 */
	detach(target: HTMLElement) {
		this._targets.delete(target)
		return this
	}

	/**
	 * Writes a theme's css vars onto the targets.
	 * @internal
	 */
	#applyStyleProps = (themeConfig: Theme, targets: HTMLElement[]): void => {
		const config = themeConfig
		this._log.fn(c('applyStyleProps')).debug({ config, this: this })

		const themeColors = config.vars.color[this.activeMode]
		if (!themeColors) {
			this._log.error('`theme` not found in `config`.', {
				theme: themeColors,
				config,
				'this.activeMode': this.activeMode,
				this: this,
			})
			throw new Error(`Theme not found.`)
		}

		const allVars = new Map<string, string>()

		for (const target of targets) {
			for (const [key, value] of entries(config.vars)) {
				if (key === 'color') {
					for (const [k, v] of [
						...entries(value.base),
						...entries(value[this.activeMode]),
					]) {
						target.style.setProperty(`--${config.prefix}-${k}`, v)
						target.style.setProperty(`--${config.prefix}-${k}-rgb`, hexToRgb(v))
					}
				} else {
					const x: VariableDefinition = config.vars[key]

					for (const [mode, vars] of entries(x)) {
						if (mode === 'base') {
							for (const [k, v] of entries(vars)) {
								allVars.set(k, v)
							}
						} else if (mode === this.activeMode) {
							for (const [k, v] of entries(vars)) {
								allVars.set(k, v)
							}
						}
					}
				}
			}

			for (const [k, v] of allVars) {
				target.style.setProperty(`--${config.prefix}-${k}`, v)
			}
		}
	}

	dispose() {
		for (const unsub of this._unsubs) {
			unsub()
		}
	}
}
