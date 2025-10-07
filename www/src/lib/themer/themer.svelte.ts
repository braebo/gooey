import type { Theme } from './themer.types'
export type { Theme }

import vanilla from './themes/vanilla'
import scout from './themes/scout'
import flat from './themes/flat'

import { parse } from 'cookie'

type Preference = 'dark' | 'light' | 'system'
// const log = (...args: any[]) => console.log('\x1b[31m[themer]', ...args)

/**
 * Options for the {@link Themer} class.
 */
interface ThemerOptions {
	/**
	 * A default fallback for when local/cookie storage are unset/disabled.
	 * @default 'dark'
	 */
	defaultMode: 'light' | 'dark' | 'system'

	/**
	 * The key to use in local/cookie storage.  If `false`, storage will be
	 * disabled.
	 * @default 'themer-mode'
	 */
	storage: string | false
}

/**
 * A theme manager that handles theme preferences and system changes.
 */
class Themer {
	activeTheme = $state<Theme>(vanilla)
	preference = $state<'light' | 'dark' | 'system'>('system')
	mode = $derived.by(() => this.#resolveMode())
	colors = $derived.by(() =>
		Object.fromEntries(Object.entries(this.activeTheme.vars.color).map(([k, v]) => [k, this.resolveLightDark(v)])),
	)
	themes = { vanilla, flat, scout } satisfies Record<string, Theme>

	css?: CSSStyleSheet

	dispose: () => void

	/**
	 * Whether storage is enabled for the theme preference.
	 */
	#storage: boolean
	/**
	 * Whether `init` has been called at least once.
	 */
	#initialized = false
	/**
	 * The key to use in local/cookie storage.
	 */
	#storageKey = 'themer-mode'
	/**
	 * Used for OS-level preference change events.
	 */
	#prefersLight?: MediaQueryList

	constructor(options?: ThemerOptions) {
		this.#storage = options?.storage !== false

		this.preference = this.#resolveStorage(options?.defaultMode ?? 'dark')

		if (globalThis.window) {
			this.init()
		} else {
			console.warn('\x1b[96mthemer.svelte.ts\x1b[39m: window object not found - \x1b[33maborting\x1b[39m')
			// todo - what could be done server-side?
		}

		this.dispose = $effect.root(() => {
			$effect(() => {
				this.#updateStorage()
				this.applyTheme()
			})
		})
	}

	/**
	 * Runs once automatically if the `window` object is available, but can be called manually if
	 * needed without consequence.
	 */
	init() {
		if (this.#initialized) return
		this.#initialized = true

		this.#prefersLight = globalThis.window.matchMedia('(prefers-color-scheme: light)')

		this.#prefersLight.removeEventListener('change', this.#onSystemChange)
		this.#prefersLight.addEventListener('change', this.#onSystemChange)

		globalThis.window.removeEventListener('storage', this.#onStorageChange)
		globalThis.window.addEventListener('storage', this.#onStorageChange)

		this.css = new CSSStyleSheet()
		document.adoptedStyleSheets.push(this.css)
	}

	/**
	 * Applies the active theme variables to the themer's adopted style sheet, and sets the root
	 * `color-scheme` style property to the current mode.  This method is called automatically
	 * whenever the theme or mode changes.
	 */
	applyTheme = () => {
		if (!this.css) return

		let str = ':root {\n'
		for (const [k, v] of Object.entries(this.activeTheme.vars.color)) {
			const resolvedValue = this.resolveLightDark(v)
			str += `\t${k}: ${resolvedValue};\n`
		}
		str += '}'

		this.css.replaceSync(str)

		document.documentElement.style.setProperty('color-scheme', this.mode)

		this.#updateStorage()
	}

	/**
	 * Resolves a light-dark CSS function based on the current theme mode.
	 * @param value The light-dark CSS function as a string
	 * @returns The resolved value based on the current mode
	 */
	resolveLightDark(value: string): string {
		const lightDarkRegex = /light-dark\((.*?),(.*?)\)/
		const match = value.match(lightDarkRegex)

		if (match) {
			const [, lightValue, darkValue] = match
			return this.mode === 'light' ? lightValue.trim() : darkValue.trim()
		}

		return value // Return the original value if it's not a light-dark function
	}

	/**
	 * Retrieves the preference from local/cookie storage, falling back to the
	 * provided default if storage is disabled, unavailable, or unset.
	 */
	#resolveStorage(fallback: Preference): Preference {
		if (!this.#storage || !globalThis.localStorage) return fallback

		try {
			const localPref = localStorage.getItem(this.#storageKey)
			if (Themer.#isPref(localPref)) return localPref

			const cookiePref = parse(globalThis.document?.cookie)[this.#storageKey]
			if (Themer.#isPref(cookiePref)) return cookiePref
		} catch (e) {
			console.error(e)
			return fallback
		}

		return fallback
	}

	#updateStorage(): void {
		if (!this.#storage) throw new Error('Storage is disabled')

		globalThis.localStorage?.setItem(this.#storageKey, this.preference)
		const newMode = this.#resolveMode(this.preference)

		if (typeof globalThis.document !== 'undefined') {
			document.cookie = `${this.#storageKey}=${newMode}; path=/;`
			document.documentElement.setAttribute('theme', newMode)
			document.documentElement.setAttribute('color-scheme', newMode)
		}
	}

	#resolveMode(preference = this.preference): 'light' | 'dark' {
		return preference === 'system' ? (this.#prefersLight?.matches ? 'light' : 'dark') : preference
	}

	#onSystemChange = (_: MediaQueryListEvent) => {
		this.preference = 'system'
	}

	#onStorageChange = (e: StorageEvent) => {
		if (e.key === this.#storageKey) {
			this.preference = e.newValue as Preference
		}
	}

	static #isPref(thing: any): thing is Preference {
		return ['light', 'dark', 'system'].includes(thing)
	}
}

/**
 * A document-wide theme manager.
 */
export const themer = new Themer()
