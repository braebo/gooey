import { describe, test, expect, afterEach } from 'vitest'

import { WindowManager, type WindowInstanceOptions } from './WindowManager'

const cleanup = [] as Array<() => void>

afterEach(() => {
	while (cleanup.length) cleanup.pop()!()
	localStorage.clear()
})

function createNode(id?: string, parent: HTMLElement = document.body) {
	const node = document.createElement('div')
	if (id) node.id = id
	node.style.position = 'absolute'
	node.style.top = '0px'
	node.style.left = '0px'
	node.style.width = '100px'
	node.style.height = '100px'
	parent.appendChild(node)
	cleanup.push(() => node.remove())
	return node
}

/** A sized, positioned container to use as `bounds`. */
function createBounds(width = 600, height = 600) {
	const el = document.createElement('div')
	el.style.position = 'relative'
	el.style.width = `${width}px`
	el.style.height = `${height}px`
	document.body.appendChild(el)
	cleanup.push(() => el.remove())
	return el
}

function createManager(key = 'test-wm', bounds: HTMLElement = document.documentElement) {
	const manager = new WindowManager({
		localStorage: { key },
		bounds,
	})
	cleanup.push(() => manager.dispose())
	return manager
}

function addWindow(manager: WindowManager, node: HTMLElement, opts?: WindowInstanceOptions) {
	return manager.add(node, opts).window
}

describe('localStorage keys', () => {
	test('uses the provided storageId', () => {
		const manager = createManager()
		const window = addWindow(manager, createNode(), { storageId: 'inspector' })

		expect(window.draggableInstance?.opts.localStorageKey).toBe(
			'test-wm::wm::inspector::position',
		)
		expect(window.resizableInstance?.opts.localStorageKey).toBe('test-wm::wm::inspector::size')
	})

	test('falls back to an authored element id', () => {
		const manager = createManager()
		const window = addWindow(manager, createNode('timeline'))

		expect(window.storageId).toBe('timeline')
		expect(window.draggableInstance?.opts.localStorageKey).toBe(
			'test-wm::wm::timeline::position',
		)
	})

	test('falls back to the insertion index when there is no stable id', () => {
		const manager = createManager()
		const a = addWindow(manager, createNode())
		const b = addWindow(manager, createNode())

		expect([a.storageId, b.storageId]).toEqual(['0', '1'])
	})

	test('each window gets its own key', () => {
		const manager = createManager()
		const a = addWindow(manager, createNode(), { storageId: 'a' })
		const b = addWindow(manager, createNode(), { storageId: 'b' })

		expect(a.draggableInstance?.opts.localStorageKey).toBe('test-wm::wm::a::position')
		expect(b.draggableInstance?.opts.localStorageKey).toBe('test-wm::wm::b::position')
	})

	test('a generated window id is never used as a storage key', () => {
		const manager = createManager()
		// Consumers (i.e. `Gooey`) pass a per-session random id -- keying on it would orphan
		// every write.
		const window = addWindow(manager, createNode(), { id: `random-${Math.random()}` })

		expect(window.draggableInstance?.opts.localStorageKey).toBe('test-wm::wm::0::position')
	})
})

describe('resize', () => {
	test('a window resizes before any grabber is touched', () => {
		const bounds = createBounds()
		const manager = createManager('test-wm', bounds)
		const window = addWindow(manager, createNode(undefined, bounds), {
			storageId: 'inspector',
		})

		window.resize({ width: 240, height: 180 })

		expect(window.node.offsetWidth).toBe(240)
		expect(window.node.offsetHeight).toBe(180)
	})

	test('`size` reflects the resizable', () => {
		const bounds = createBounds()
		const manager = createManager('test-wm', bounds)
		const window = addWindow(manager, createNode(undefined, bounds), { storageId: 'inspector' })

		expect(window.size).toBe(window.resizableInstance!.size)

		window.resize({ width: 240, height: 180 })

		expect(window.size.value).toEqual({ width: 240, height: 180 })
	})

	test('clamps to the bounds', () => {
		const bounds = createBounds(600, 400)
		const manager = createManager('test-wm', bounds)
		const window = addWindow(manager, createNode(undefined, bounds), { storageId: 'inspector' })

		window.resize({ width: 5000, height: 5000 })

		// The window is draggable, so its edges are wherever the drag margin left them -- what
		// matters is that they grew, and stopped at the bounds.
		const node = window.node.getBoundingClientRect()
		const box = bounds.getBoundingClientRect()

		expect(node.width).toBeGreaterThan(100)
		expect(node.height).toBeGreaterThan(100)
		expect(node.right).toBeCloseTo(box.right, 0)
		expect(node.bottom).toBeCloseTo(box.bottom, 0)
	})

	test('persists under the window size key', () => {
		const bounds = createBounds()
		const manager = createManager('test-wm', bounds)
		const window = addWindow(manager, createNode(undefined, bounds), { storageId: 'inspector' })

		window.resize({ width: 240, height: 180 })

		expect(JSON.parse(localStorage.getItem('test-wm::wm::inspector::size')!)).toEqual({
			width: 240,
			height: 180,
		})
	})
})

describe('persistence identity', () => {
	test('windows restore their own position when the insertion order changes', () => {
		localStorage.setItem('test-wm::wm::a::position', JSON.stringify({ x: 120, y: 140 }))
		localStorage.setItem('test-wm::wm::b::position', JSON.stringify({ x: 220, y: 260 }))

		// `b` is added first this run -- under index keying it would have read `a`'s layout.
		const manager = createManager()
		const b = addWindow(manager, createNode(), { storageId: 'b' })
		const a = addWindow(manager, createNode(), { storageId: 'a' })

		expect(a.position).toEqual({ x: 120, y: 140 })
		expect(b.position).toEqual({ x: 220, y: 260 })
	})
})
