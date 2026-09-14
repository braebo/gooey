import { describe, test, expect, afterEach } from 'vitest'

import { Gooey, type GooeyOptions } from './Gooey'

const guis = [] as Gooey[]

afterEach(() => {
	while (guis.length) guis.pop()!.dispose()
	localStorage.clear()
})

function make(opts: Partial<GooeyOptions>) {
	const gooey = new Gooey(opts)
	guis.push(gooey)
	return gooey
}

/** The {@link WindowInstance} a gooey's root element belongs to. */
function windowOf(gooey: Gooey) {
	return [...gooey.windowManager!.windows.values()].find(w => w.node === gooey.folder.element)
}

describe('parentGooey', () => {
	test('a child shares its parent window manager and themer', () => {
		const parent = make({ title: 'parent', storage: { key: 'p' } })
		const child = make({ title: 'child', storage: { key: 'c' }, parentGooey: parent })

		expect(child.windowManager).toBe(parent.windowManager)
		expect(child.themer).toBe(parent.themer)
		expect(parent.windowManager!.windows.size).toBe(2)
	})

	test('each child keeps its own persisted position and size', () => {
		const parent = make({ title: 'parent', storage: { key: 'p' } })
		const a = make({
			title: 'a',
			storage: { key: 'a', position: true, size: true },
			parentGooey: parent,
		})
		const b = make({
			title: 'b',
			storage: { key: 'b', position: true, size: true },
			parentGooey: parent,
		})

		const keyA = windowOf(a)?.draggableInstance?.opts.localStorageKey
		const keyB = windowOf(b)?.draggableInstance?.opts.localStorageKey

		expect(keyA).toBeTruthy()
		expect(keyA).not.toBe(keyB)
		expect(windowOf(a)?.resizableInstance?.opts.localStorageKey).not.toBe(
			windowOf(b)?.resizableInstance?.opts.localStorageKey,
		)
	})

	// The no-op `moveTo` / `moveBy` defaults used to survive on the shared path, so a child
	// gooey silently refused to be moved.
	test("a child's moveTo is its own window's", () => {
		const parent = make({ title: 'parent', storage: false })
		const child = make({ title: 'child', storage: false, parentGooey: parent })

		expect(child.moveTo).toBe(windowOf(child)!.moveTo)
		expect(child.moveBy).toBe(windowOf(child)!.moveBy)
	})

	// A shared themer was built around the parent's wrapper, so it wrote its css vars only
	// there — a child rendered with no vars at all, header height included.
	test("a child's wrapper is a target of the shared themer", () => {
		const parent = make({ title: 'parent', storage: false })
		const child = make({ title: 'child', storage: false, parentGooey: parent })

		const headerHeight = (gooey: Gooey) =>
			getComputedStyle(gooey.wrapper).getPropertyValue('--gooey-header_height')

		expect(headerHeight(parent)).toBeTruthy()
		expect(headerHeight(child)).toBe(headerHeight(parent))
	})

	// The child root was stamped once from its own `theme` option (vanilla) and raw
	// `mode.value` (possibly 'system'), then never again — its `.gooey-root[mode]` rules
	// went stale on every flip.
	test("a child's root follows the shared themer's theme and mode", () => {
		const parent = make({ title: 'parent', storage: false, theme: 'scout' })
		const child = make({ title: 'child', storage: false, parentGooey: parent })

		const stamp = (gooey: Gooey) => [
			gooey.folder.element.getAttribute('theme'),
			gooey.folder.element.getAttribute('mode'),
			gooey.wrapper.getAttribute('mode'),
		]

		expect(child.theme).toBe('scout')
		expect(stamp(child)).toEqual(['scout', parent.themer.activeMode, parent.themer.activeMode])

		parent.themer.mode.set('light')
		expect(stamp(child)).toEqual(['scout', 'light', 'light'])

		child.theme = 'flat'
		expect(parent.theme).toBe('flat')
		expect(stamp(parent)).toEqual(['flat', 'light', 'light'])
	})

	test('disposing a child leaves the parent alive', () => {
		const parent = make({ title: 'parent', storage: false })
		const child = make({ title: 'child', storage: false, parentGooey: parent })

		child.dispose()
		guis.splice(guis.indexOf(child), 1)

		expect(parent.folder.element.isConnected).toBe(true)
		expect(parent.windowManager!.windows.size).toBeGreaterThanOrEqual(1)
	})
})

describe('settingsFolder: false', () => {
	test('omits the settings button and hides the folder', () => {
		const gooey = make({ title: 'plain', storage: false, settingsFolder: false })

		expect(gooey.folder.elements.toolbar.settingsButton).toBeUndefined()
		expect(gooey.folder.element.querySelector('.gooey-settings-button')).toBeNull()
		expect(gooey.elements.settingsFolder.hidden).toBe(true)
	})

	test('the themer and preset manager are still built', () => {
		const gooey = make({ title: 'plain2', storage: false, settingsFolder: false })

		expect(gooey.themer).toBeTruthy()
		expect(gooey.presetManager).toBeTruthy()
	})

	test('the default still renders the settings button', () => {
		const gooey = make({ title: 'panel', storage: false })

		expect(gooey.folder.element.querySelector('.gooey-settings-button')).toBeTruthy()
		expect(gooey.elements.settingsFolder.hidden).toBe(false)
	})
})
