import { parse } from 'cookie'

type Preference = 'dark' | 'light' | 'system'

// const log = (...args: any[]) => console.log('\x1b[31m[themer]', ...args)

class Theme {
	preference = $state<Preference>('dark')
	#prefersDark: MediaQueryList

	constructor(
		public readonly defaultTheme: Preference = 'dark',
		public readonly storageKey: string = 'global-theme',
	) {
		this.preference = (globalThis.localStorage?.getItem(this.storageKey) as Preference) || defaultTheme

		this.#prefersDark = globalThis.window?.matchMedia('(prefers-color-scheme: dark)')
		this.#prefersDark.removeEventListener('change', this.#onSystemChange)
		this.#prefersDark.addEventListener('change', this.#onSystemChange)

		const cookieTheme = parse(globalThis.document?.cookie)[this.storageKey]

		if (['light', 'dark', 'system'].includes(cookieTheme)) {
			this.preference = cookieTheme as Preference
		}

		this.theme = this.preference

		globalThis.window.removeEventListener('storage', this.#onStorageChange)
		globalThis.window.addEventListener('storage', this.#onStorageChange)
	}

	get theme(): 'light' | 'dark' {
		return this.#resolvePreference(this.preference)
	}
	set theme(newPreference: Preference) {
		// log(`New theme preference incoming: ${newPreference}`)

		globalThis.localStorage?.setItem(this.storageKey, newPreference)
		this.preference = newPreference
		// log(`Updated preference: ${newPreference}`)

		const theme = this.theme
		// log(`Setting theme to ${theme}`)

		if (typeof globalThis.document !== 'undefined') {
			document.cookie = `${this.storageKey}=${theme}; path=/;`

			if (document.documentElement.getAttribute('theme') !== theme) {
				globalThis.document?.documentElement.setAttribute('theme', theme)
			}
		}
	}

	#resolvePreference(preference: Preference): 'light' | 'dark' {
		return preference === 'system' ? (this.#prefersDark.matches ? 'dark' : 'light') : preference
	}

	#onSystemChange = (e: MediaQueryListEvent) => {
		this.theme = 'system'
	}

	#onStorageChange = (e: StorageEvent) => {
		if (e.key === this.storageKey) {
			this.theme = e.newValue as Preference
		}
	}
}

export const themer = new Theme()
