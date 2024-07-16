import { parse } from 'cookie'

type Preference = 'dark' | 'light' | 'system'

class Theme {
	#preference = $state<Preference>('dark')
	get() {
		return this.#preference
	}

	systemPreference = $state<'light' | 'dark' | null>(
		globalThis?.window.matchMedia('prefers-color-scheme: dark').matches ? 'dark' : 'light' || null,
	)

	constructor(
		public readonly defaultTheme: Preference = 'dark',
		public readonly storageKey: string = 'global-theme',
	) {
		this.#preference = (globalThis.localStorage?.getItem(this.storageKey) as Preference) || defaultTheme

		globalThis.window?.matchMedia('prefers-color-scheme: dark').addEventListener('change', (event) => {
			this.systemPreference = event.matches ? 'dark' : 'light'
		})

		const cookieTheme = parse(globalThis.document?.cookie)[this.storageKey]

		if (['light', 'dark', 'system'].includes(cookieTheme)) {
			this.#preference = cookieTheme as Preference
		}

		this.theme = this.#preference
	}

	get theme(): 'light' | 'dark' {
		return this._resolveTheme(this.#preference)
	}
	set theme(newPreference: Preference) {
		if (globalThis.document?.documentElement.getAttribute('theme') === newPreference) {
			console.error('theme already set to', this.theme)
			return
		}

		globalThis.localStorage?.setItem(this.storageKey, newPreference)
		this.#preference = newPreference

		const theme = this.theme

		globalThis.document?.documentElement.setAttribute('theme', theme)

		if (typeof globalThis.window !== 'undefined') {
			document.cookie = `${this.storageKey}=${theme}; path=/;`
		}
	}

	private _resolveTheme(mode: Preference, defaultTheme = this.defaultTheme): 'light' | 'dark' {
		return mode === 'system' ? this._resolveTheme(defaultTheme, 'dark') : mode
	}
}

export const themer = new Theme()
