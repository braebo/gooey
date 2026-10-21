import { GooeyTest } from './tests/Gooey/GooeyTest'
import { afterEach, describe, expect, test } from 'vitest'

const G = new GooeyTest()

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/** What a gooey with presets on leaves behind: a non-default active preset, saved while shown. */
function seed_shown_active_preset(key: string): void {
	localStorage.setItem(`${key}::version`, JSON.stringify('2'))
	localStorage.setItem(
		`${key}::active`,
		JSON.stringify({
			__type: 'GooeyPreset',
			__version: '2',
			id: 'someone-elses-preset',
			title: 'someone else',
			data: { __type: 'FolderPreset', id: 'x', title: 'x', hidden: false, children: [], inputs: [] },
		}),
	)
}

describe('storage.presets: false', () => {
	afterEach(() => {
		for (const key of Object.keys(localStorage)) if (key.startsWith('gooey::presets')) localStorage.removeItem(key)
	})

	test('a gooey born hidden stays hidden whatever preset another gooey left active', async () => {
		seed_shown_active_preset('gooey::presets')

		const gooey = G.addGooey({ title: 'born hidden', hidden: true, storage: { key: 'born-hidden', presets: false } })
		await wait(300)

		expect(gooey.hidden).toBe(true)
		expect(gooey.element.classList.contains('hidden')).toBe(true)
		gooey.dispose()
	})

	test('writes no preset storage', async () => {
		const gooey = G.addGooey({ title: 'no presets', storage: { key: 'no-presets', presets: false } })
		await wait(50)

		expect(Object.keys(localStorage).filter(k => k.startsWith('gooey::presets') || k.includes('::presets'))).toEqual([])
		gooey.dispose()
	})
})
