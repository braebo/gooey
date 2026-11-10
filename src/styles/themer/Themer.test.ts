import { describe, expect, test, beforeEach } from 'vitest'

import theme_default from './defaultTheme'
import { Themer } from './Themer'

const KEY = 'test::themer'
const custom = { ...theme_default, title: 'custom' }

beforeEach(() => {
	for (const k of Object.keys(localStorage)) if (k.startsWith(KEY)) localStorage.removeItem(k)
})

describe('Themer persistence', () => {
	test('a created theme survives a new Themer on the same key', () => {
		const a = new Themer(document.createElement('div'), { localStorageKey: KEY })
		a.create(custom)
		a.theme.set(custom)
		a.dispose()

		const b = new Themer(document.createElement('div'), { localStorageKey: KEY })
		expect(b.themes.value.map(t => t.title)).toContain('custom')
		expect(b.theme.value.title).toBe('custom')
		b.dispose()
	})

	test('a deleted user theme stays gone', () => {
		const a = new Themer(document.createElement('div'), { localStorageKey: KEY })
		a.create(custom).delete('custom')
		a.dispose()

		const b = new Themer(document.createElement('div'), { localStorageKey: KEY })
		expect(b.themes.value.map(t => t.title)).not.toContain('custom')
		b.dispose()
	})

	// The first load used to store its defaults, so a later load's `mode` / `theme` options never
	// applied: the panel stayed on the first default (dark) whatever the code said.
	test("a default nobody picked isn't stored, so the next load's default applies", () => {
		const themes = [theme_default, custom]
		const a = new Themer(document.createElement('div'), {
			localStorageKey: KEY,
			mode: 'dark',
			theme: theme_default,
			themes,
		})
		a.dispose()

		const b = new Themer(document.createElement('div'), {
			localStorageKey: KEY,
			mode: 'light',
			theme: custom,
			themes,
		})
		expect(b.mode.value).toBe('light')
		expect(b.activeMode).toBe('light')
		expect(b.theme.value.title).toBe('custom')
		b.dispose()
	})

	test("a picked mode and theme still win over the next load's default", () => {
		const themes = [theme_default, custom]
		const a = new Themer(document.createElement('div'), {
			localStorageKey: KEY,
			mode: 'dark',
			theme: theme_default,
			themes,
		})
		a.mode.set('light')
		a.theme.set(a.getTheme('custom')!)
		a.dispose()

		const b = new Themer(document.createElement('div'), {
			localStorageKey: KEY,
			mode: 'dark',
			theme: theme_default,
			themes,
		})
		expect(b.mode.value).toBe('light')
		expect(b.theme.value.title).toBe('custom')
		b.dispose()
	})

	// An OS light/dark flip under 'system' re-sets the same theme; that isn't a pick.
	test("re-setting the active theme doesn't store it", () => {
		const themes = [theme_default, custom]
		const a = new Themer(document.createElement('div'), {
			localStorageKey: KEY,
			theme: theme_default,
			themes,
		})
		a.theme.set(a.theme.value)
		a.dispose()

		const b = new Themer(document.createElement('div'), {
			localStorageKey: KEY,
			theme: custom,
			themes,
		})
		expect(b.theme.value.title).toBe('custom')
		b.dispose()
	})

	test('a stored mode that is not one falls back to the code mode', () => {
		localStorage.setItem(KEY + '::mode', 'null')
		const t = new Themer(document.createElement('div'), { localStorageKey: KEY, mode: 'light' })
		expect(t.mode.value).toBe('light')
		expect(t.activeMode).toBe('light')
		expect(localStorage.getItem(KEY + '::mode')).toBe(null)
		t.dispose()
	})

	test('no key, no persistence', () => {
		const a = new Themer(document.createElement('div'))
		a.create(custom)
		a.dispose()

		expect(Object.keys(localStorage).some(k => k.startsWith('undefined'))).toBe(false)
		const b = new Themer(document.createElement('div'))
		expect(b.themes.value.map(t => t.title)).not.toContain('custom')
		b.dispose()
	})
})
