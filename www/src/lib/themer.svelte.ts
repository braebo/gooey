import { parse } from 'cookie'

type Preference = 'dark' | 'light' | 'system'

// const log = (...args: any[]) => console.log('\x1b[31m[themer]', ...args)
const log = (...args: any[]) => {}

class Theme {
	preference = $state<Preference>('dark')

	constructor(
		public readonly defaultTheme: Preference = 'dark',
		public readonly storageKey: string = 'global-theme',
	) {
		this.preference = (globalThis.localStorage?.getItem(this.storageKey) as Preference) || defaultTheme

		const systemPref = globalThis.window?.matchMedia('(prefers-color-scheme: dark)')
		systemPref.removeEventListener('change', this._onSystemChange)
		systemPref.addEventListener('change', this._onSystemChange)

		const cookieTheme = parse(globalThis.document?.cookie)[this.storageKey]

		if (['light', 'dark', 'system'].includes(cookieTheme)) {
			this.preference = cookieTheme as Preference
		}

		this.theme = this.preference

		globalThis.window.removeEventListener('storage', this._onStorageChange)
		globalThis.window.addEventListener('storage', this._onStorageChange)
	}

	get theme(): 'light' | 'dark' {
		return this._resolveTheme(this.preference)
	}
	set theme(newPreference: Preference) {
		log(`New theme preference incoming: ${newPreference}`)

		globalThis.localStorage?.setItem(this.storageKey, newPreference)
		this.preference = newPreference
		log(`Updated preference: ${newPreference}`)

		const theme = this.theme
		log(`Setting theme to ${theme}`)

		if (typeof globalThis.document !== 'undefined') {
			document.cookie = `${this.storageKey}=${theme}; path=/;`

			if (document.documentElement.getAttribute('theme') !== theme) {
				globalThis.document?.documentElement.setAttribute('theme', theme)
			}
		}
	}

	private _resolveTheme(preference: Preference): 'light' | 'dark' {
		// return mode === 'system' ? this._resolveTheme(defaultTheme, 'dark') : mode
		return preference === 'system'
			? globalThis.window?.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light'
			: preference
	}

	private _onSystemChange = (e: MediaQueryListEvent) => {
		this.theme = 'system'
	}

	private _onStorageChange = (e: StorageEvent) => {
		if (e.key === this.storageKey) {
			this.theme = e.newValue as Preference
		}
	}
}

export const themer = new Theme()
