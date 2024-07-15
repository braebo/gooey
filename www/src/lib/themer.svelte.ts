import { parse } from 'cookie'

type Mode = 'dark' | 'light' | 'system'

class Theme {
	#preference = $state<Mode>('dark')

	systemPreference = $state<'light' | 'dark' | null>(
		globalThis?.window.matchMedia('prefers-color-scheme: dark').matches ? 'dark' : 'light' || null
	)

	constructor(
		public readonly defaultTheme: Mode = 'dark',
		public readonly storageKey: string = 'global-theme'
	) {
		this.#preference = (globalThis.localStorage?.getItem(this.storageKey) as Mode) || defaultTheme

		globalThis.window?.matchMedia('prefers-color-scheme: dark').addEventListener('change', (event) => {
			this.systemPreference = event.matches ? 'dark' : 'light'
		})

		const cookieTheme = parse(globalThis.document?.cookie)[this.storageKey]

		if (['light', 'dark', 'system'].includes(cookieTheme)) {
			this.theme = cookieTheme as Mode
		}
	}

	get theme(): 'light' | 'dark' {
		return this._resolveTheme(this.#preference)
	}
	set theme(newMode: Mode) {
		globalThis.localStorage?.setItem(this.storageKey, newMode)
		this.#preference = newMode

		const theme = this.theme

		globalThis.document?.documentElement.setAttribute('theme', theme)

		if (typeof globalThis.window !== 'undefined') {
			document.cookie = `${this.storageKey}=${theme}; path=/;`
		}
	}

	private _resolveTheme(mode: Mode, defaultTheme = this.defaultTheme): 'light' | 'dark' {
		return mode === 'system' ? this._resolveTheme(defaultTheme, 'dark') : mode
	}
}

export const themer = new Theme()
