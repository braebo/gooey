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
