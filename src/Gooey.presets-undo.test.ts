import { afterEach, describe, expect, test } from 'vitest'
import { GooeyTest } from './tests/Gooey/GooeyTest'
import type { Gooey } from './Gooey'

const G = new GooeyTest()

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const gooeys: Gooey[] = []
async function addGooey(key: string) {
	const gooey = G.addGooey({ title: key, storage: { key, presets: true } })
	gooeys.push(gooey)
	const a = gooey.addNumber('a', 0)
	// The preset manager builds its menu a microtask after construction.
	await wait(50)
	return { gooey, a, um: gooey._undoManager, pm: gooey.presetManager }
}

/** Picks a preset the way a person does: a click on its option in the preset menu. */
function pick(gooey: Gooey, title: string) {
	// @ts-expect-error - private
	const select = gooey.presetManager._presetsInput.selectController
	for (const [, { option, element }] of select.optionMap) {
		if (option.label === title) return element.click()
	}
	throw new Error(`no preset titled ${title}`)
}

/** The preset menu's controller and an option's element by its title. */
function menu(gooey: Gooey) {
	// @ts-expect-error - private
	const select = gooey.presetManager._presetsInput.selectController
	const option = (title: string): HTMLElement => {
		for (const [, { option, element }] of select.optionMap)
			if (option.label === title) return element
		throw new Error(`no preset titled ${title}`)
	}
	return { select, option }
}

/** Opens the preset menu the way a person does, and moves the pointer over options on the way. */
async function openAndHover(gooey: Gooey, ...titles: string[]) {
	const { select, option } = menu(gooey)
	// The first save puts the menu in rename mode, which ignores clicks on it; Escape leaves it.
	window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
	select.elements.selected.click()
	expect(select.expanded).toBe(true)
	for (const title of titles) {
		option(title).dispatchEvent(new MouseEvent('mouseenter'))
		await wait(10)
	}
}

afterEach(() => {
	for (const gooey of gooeys.splice(0)) gooey.dispose()
	for (const key of Object.keys(localStorage))
		if (key.includes('presets-undo')) localStorage.removeItem(key)
})

describe('undo across a preset load', () => {
	test('a page that boots with a saved preset starts with nothing to undo', async () => {
		const first = await addGooey('presets-undo-boot')
		first.a.set(9)
		first.pm.put()
		await wait(10)
		first.gooey.dispose()

		const { a, um } = await addGooey('presets-undo-boot')
		expect(a.value).toBe(9)
		// The length, not the stack: a failure would serialize a commit's target, the whole gooey.
		expect(um.stack.length).toBe(0)
		expect(() => um.undo()).not.toThrow()
	})

	test('saving a preset is not an undo step', async () => {
		const { a, um, pm } = await addGooey('presets-undo-save')
		a.set(1)
		await wait(10)
		pm.put()
		await wait(10)

		expect(um.stack.map(c => c.to)).toEqual([1])
		um.undo()
		expect(a.value).toBe(0)
	})

	test('a load from code records nothing, and undo still walks the changes before it', async () => {
		const { gooey, a, um } = await addGooey('presets-undo-code')
		const saved = gooey.save('saved')
		a.set(5)
		gooey.load(saved)
		await wait(10)

		expect(a.value).toBe(0)
		expect(um.stack.map(c => c.to)).toEqual([5])
		expect(() => um.undo()).not.toThrow()
	})

	test('a pick in the preset menu is one undo step: undo brings back what was there, redo the pick', async () => {
		const { gooey, a, um, pm } = await addGooey('presets-undo-pick')
		a.set(7)
		await wait(10)
		pm.put()
		await wait(10)
		const seven = pm.activePreset.value
		expect(seven.title).not.toBe('default')

		// Unsaved tweaks on top of the saved preset, then a pick of the default one.
		a.set(3)
		await wait(10)
		pick(gooey, 'default')
		await wait(10)
		expect(a.value).toBe(0)
		expect(pm.activePreset.value.title).toBe('default')

		um.undo()
		await wait(10)
		expect(a.value).toBe(3)
		expect(pm.activePreset.value.id).toBe(seven.id)
		// @ts-expect-error - private
		expect(pm._presetsInput.selectController.selected.label).toBe(seven.title)

		um.redo()
		await wait(10)
		expect(a.value).toBe(0)
		expect(pm.activePreset.value.title).toBe('default')

		// The replays recorded nothing of their own, and the tweak before the pick is still there.
		um.undo()
		await wait(10)
		um.undo()
		await wait(10)
		expect(a.value).toBe(7)
	})

	test('hovering on the way to a pick previews, and the pick is still one undo step', async () => {
		const { gooey, a, um, pm } = await addGooey('presets-undo-hover')
		a.set(1)
		await wait(10)
		pm.put()
		await wait(10)
		a.set(2)
		await wait(10)
		pm.put()
		await wait(10)
		const two = pm.activePreset.value
		a.set(5)
		await wait(10)
		const before = um.stack.length

		await openAndHover(gooey, 'preset', 'default')
		expect(a.value).toBe(0)
		expect(um.stack.length).toBe(before)
		menu(gooey).option('default').click()
		await wait(10)
		expect(um.stack.length).toBe(before + 1)

		um.undo()
		await wait(10)
		expect(a.value).toBe(5)
		expect(pm.activePreset.value.id).toBe(two.id)

		um.redo()
		await wait(10)
		expect(a.value).toBe(0)
		expect(pm.activePreset.value.title).toBe('default')
	})

	test('a cancelled menu puts back what it opened over and records nothing', async () => {
		const { gooey, a, um, pm } = await addGooey('presets-undo-cancel')
		a.set(1)
		await wait(10)
		pm.put()
		await wait(10)
		const one = pm.activePreset.value
		a.set(5)
		await wait(10)
		const before = um.stack.length

		await openAndHover(gooey, 'default')
		expect(a.value).toBe(0)
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
		await wait(10)

		expect(a.value).toBe(5)
		expect(pm.activePreset.value.id).toBe(one.id)
		expect(menu(gooey).select.selected.label).toBe(one.title)
		expect(um.stack.length).toBe(before)
	})
})
