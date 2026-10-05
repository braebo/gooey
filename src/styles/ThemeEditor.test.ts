import { describe, expect, test, afterEach } from 'vitest'

import { GooeyTest } from '../tests/Gooey/GooeyTest'
import { ThemeEditor } from './ThemeEditor'
import { Themer } from './themer/Themer'
import { Gooey } from '../Gooey'

const G = new GooeyTest()
const KEY = 'test-theme-editor'

const tick = () => new Promise(r => setTimeout(r, 10))

let disposables: Array<{ dispose(): void }> = []
afterEach(() => {
	for (const d of disposables.splice(0)) d.dispose()
	for (const k of Object.keys(localStorage)) if (k.startsWith(KEY)) localStorage.removeItem(k)
})

function setup(storage: Gooey['opts']['storage'] | { key: string } = false) {
	const gooey = G.addGooey({ title: 'target', storage })
	const editor = new ThemeEditor(gooey)
	disposables.push(editor, gooey)
	return { gooey, editor, themer: gooey.themer }
}

describe('ThemeEditor', () => {
	test('builds a folder per var group', async () => {
		const { editor } = setup()
		await tick()
		const titles = editor.folder.children.map(f => f.title)
		expect(titles).toContain('color')
		expect(titles).toContain('core')
	})

	test('an edit previews on the target without touching the stored theme', () => {
		const { gooey, editor, themer } = setup()
		const source = themer.theme.value.title

		editor.setVar('color', 'base', 'theme-a', '#ff0000')

		expect(editor.dirty).toBe(true)
		expect(gooey.wrapper.style.getPropertyValue('--gooey-theme-a')).toBe('#ff0000')
		expect(editor.gooey.wrapper.style.getPropertyValue('--gooey-theme-a')).toBe('#ff0000')
		expect(themer.getTheme(source)!.vars.color.base['theme-a']).not.toBe('#ff0000')
	})

	test('saving a code theme stores an edited copy in userThemes', () => {
		const { editor, themer } = setup()
		const source = themer.theme.value.title

		editor.setVar('color', 'base', 'theme-a', '#ff0000').save()

		expect(editor.dirty).toBe(false)
		expect(themer.theme.value.title).toBe(`${source} (1)`)
		expect(themer.userThemes.value.map(t => t.title)).toEqual([`${source} (1)`])
		expect(themer.userThemes.value[0].vars.color.base['theme-a']).toBe('#ff0000')
		expect(themer.getTheme(source)!.vars.color.base['theme-a']).not.toBe('#ff0000')
	})

	test('saving a user theme updates it in place', () => {
		const { editor, themer } = setup()
		editor.create('mine')
		expect(themer.theme.value.title).toBe('mine')

		editor.setVar('color', 'base', 'theme-a', '#00ff00').save()

		expect(themer.userThemes.value.map(t => t.title)).toEqual(['mine'])
		expect(themer.getTheme('mine')!.vars.color.base['theme-a']).toBe('#00ff00')
	})

	test('a changed title renames a user theme on save', () => {
		const { editor, themer } = setup()
		editor.create('mine')

		// The title field, as typed.
		;(editor as any)._titleInput.set('renamed')
		expect(editor.dirty).toBe(true)
		editor.save()

		expect(themer.userThemes.value.map(t => t.title)).toEqual(['renamed'])
		expect(themer.themes.value.map(t => t.title)).not.toContain('mine')
		expect(themer.theme.value.title).toBe('renamed')
	})

	test('revert drops unsaved edits', () => {
		const { gooey, editor, themer } = setup()
		const before = themer.theme.value.vars.color.base['theme-a']

		editor.setVar('color', 'base', 'theme-a', '#123456').revert()

		expect(editor.dirty).toBe(false)
		expect(themer.theme.value.vars.color.base['theme-a']).toBe(before)
		expect(gooey.wrapper.style.getPropertyValue('--gooey-theme-a')).toBe(before)
	})

	test('delete removes a user theme and leaves code themes alone', () => {
		const { editor, themer } = setup()
		const codeTitle = themer.theme.value.title

		editor.delete()
		expect(themer.getTheme(codeTitle)).toBeDefined()

		editor.create('doomed').delete()
		expect(themer.userThemes.value).toEqual([])
		expect(themer.getTheme('doomed')).toBeUndefined()
		expect(themer.theme.value.title).not.toBe('doomed')
	})

	test('select switches the active theme', () => {
		const { editor, themer } = setup()
		const other = themer.themes.value.find(t => t.title !== themer.theme.value.title)!

		editor.select(other.title)

		expect(themer.theme.value.title).toBe(other.title)
		expect(editor.vars).toEqual(other.vars)
	})

	test('a saved theme persists with the target gooey storage', () => {
		const { gooey, editor } = setup({ key: KEY })
		editor.create('kept')
		const key = gooey.opts.storage && gooey.opts.storage.key + '::themer'

		const next = new Themer(document.createElement('div'), { localStorageKey: key || '' })
		expect(next.themes.value.map(t => t.title)).toContain('kept')
		next.dispose()
	})
})
