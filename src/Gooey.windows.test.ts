import { describe, test, expect, afterEach } from 'vitest'

import { userEvent } from '@vitest/browser/context'

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

	test("a child's window resizes from code", () => {
		const parent = make({ title: 'parent', storage: false })
		const child = make({ title: 'child', storage: false, parentGooey: parent, width: 400 })

		expect(child.element.offsetWidth).toBe(400)

		windowOf(child)!.resize({ width: 360 })

		expect(child.element.offsetWidth).toBe(360)
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

	// A disposed child stayed in the shared manager: its entry, its grab listener, and the
	// drag/resize ResizeObservers on its detached element, one more set per open and close.
	test('disposing a child takes its window out of the shared manager', () => {
		const parent = make({ title: 'parent', storage: false })
		const before = parent.windowManager!.windows.size

		for (let i = 0; i < 5; i++) {
			const child = new Gooey({ title: `child ${i}`, storage: false, parentGooey: parent })
			expect(parent.windowManager!.windows.size).toBe(before + 1)
			child.dispose()
		}

		expect(parent.windowManager!.windows.size).toBe(before)
	})

	test('disposing a child leaves no <style> of its own in the head', () => {
		const parent = make({ title: 'parent', storage: false })
		const styles = document.head.querySelectorAll('style').length

		for (let i = 0; i < 5; i++) {
			new Gooey({ title: `child ${i}`, storage: false, parentGooey: parent }).dispose()
		}

		expect(document.head.querySelectorAll('style').length).toBe(styles)
	})

	// The child's root folder subscribed to the shared themer through its evm, and dispose never
	// cleared it: the parent's themer held every disposed child alive.
	test("a disposed child stops following the shared themer", () => {
		const parent = make({ title: 'parent', storage: false })
		const child = new Gooey({ title: 'child', storage: false, parentGooey: parent })
		child.dispose()

		const stamped = child.folder.element.getAttribute('mode')
		parent.themer.mode.set(stamped === 'light' ? 'dark' : 'light')

		expect(child.folder.element.getAttribute('mode')).toBe(stamped)
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

describe('draggable: false / resizable: false', () => {
	test('leaves the window neither draggable nor resizable', () => {
		const gooey = make({ title: 'still', storage: false, draggable: false, resizable: false })
		const w = windowOf(gooey)!

		expect(w.draggableInstance?.disabled).toBe(true)
		expect(w.resizableInstance?.disabled).toBe(true)
	})

	test('a real click on an input reset button resets it', async () => {
		const gooey = make({ title: 'still', storage: false, draggable: false, resizable: false })
		const n = gooey.addNumber('n', 1, { min: 0, max: 10, step: 1 })
		n.set(5)

		await userEvent.click(n.elements.resetBtn)

		expect(n.value).toBe(1)
	})
})

describe('resizable object form', () => {
	test('adds a bottom grabber when sides include bottom', () => {
		const gooey = make({
			title: 'tall',
			storage: false,
			resizable: {
				sides: ['left', 'right', 'bottom'],
				corners: ['bottom-left', 'bottom-right'],
			},
		})

		expect(windowOf(gooey)?.resizableInstance?.opts.sides).toContain('bottom')
		expect(windowOf(gooey)?.resizableInstance?.opts.corners).toEqual([
			'bottom-left',
			'bottom-right',
		])
	})

	test('`true` keeps left/right grabbers only', () => {
		const gooey = make({ title: 'wide', storage: false, resizable: true })

		expect(windowOf(gooey)?.resizableInstance?.opts.sides).toEqual(['right', 'left'])
		expect(windowOf(gooey)?.resizableInstance?.opts.corners).toEqual([])
	})

	test('restores stored height when a vertical grabber exists', () => {
		const opts = {
			title: 'persist-h',
			storage: { key: 'persist-h', size: true, position: false },
			resizable: {
				sides: ['left', 'right', 'bottom'],
				corners: ['bottom-left', 'bottom-right'],
			},
		} as const satisfies Partial<GooeyOptions>

		const probe = new Gooey(opts)
		const key = windowOf(probe)!.resizableInstance!.opts.localStorageKey!
		probe.dispose()

		localStorage.setItem(key, JSON.stringify({ width: 200, height: 280, pinned: true }))

		const gooey = make(opts)

		expect(gooey.folder.element.style.height).toBe('280px')
	})

	test('width-only storage leaves height unset on reload', () => {
		const opts = {
			title: 'persist-w',
			storage: { key: 'persist-w', size: true, position: false },
			resizable: {
				sides: ['left', 'right', 'bottom'],
				corners: ['bottom-left', 'bottom-right'],
			},
		} as const satisfies Partial<GooeyOptions>

		const probe = new Gooey(opts)
		const key = windowOf(probe)!.resizableInstance!.opts.localStorageKey!
		probe.dispose()

		localStorage.setItem(key, JSON.stringify({ width: 200, height: 0 }))

		const gooey = make(opts)

		expect(gooey.folder.element.style.height).toBe('')
	})
})

describe('onClose', () => {
	test('renders one close button that calls the callback', async () => {
		let closed = 0
		const gooey = make({ title: 'closable', storage: false, onClose: () => closed++ })

		expect(gooey.folder.elements.toolbar.closeButton).toBeTruthy()
		expect(gooey.folder.element.querySelectorAll('.gooey-close-button')).toHaveLength(1)

		await userEvent.click(gooey.folder.elements.toolbar.closeButton!)

		expect(closed).toBe(1)
	})

	test('omits the close button when onClose is not given', () => {
		const gooey = make({ title: 'open', storage: false })

		expect(gooey.folder.elements.toolbar.closeButton).toBeUndefined()
		expect(gooey.folder.element.querySelector('.gooey-close-button')).toBeNull()
	})

	test('close stays rightmost when a host appends toolbar buttons later', () => {
		const gooey = make({ title: 'closable', storage: false, onClose: () => {} })
		const toolbar = gooey.folder.elements.toolbar.container
		const hostButton = document.createElement('button')
		hostButton.className = 'gooey-toolbar-item'
		toolbar.appendChild(hostButton)

		const close = gooey.folder.elements.toolbar.closeButton!
		expect(hostButton.getBoundingClientRect().left).toBeLessThan(close.getBoundingClientRect().left)
	})
})

describe('terminal icon removed', () => {
	test('no folder has a terminal icon', () => {
		const gooey = make({ title: 'clean', storage: false })
		gooey.addFolder('child', {})

		expect(gooey.folder.element.querySelector('.gooey-terminal-icon')).toBeNull()
		expect(document.querySelector('.gooey-terminal-icon')).toBeNull()
	})
})