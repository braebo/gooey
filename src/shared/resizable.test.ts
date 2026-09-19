import { describe, test, expect, afterEach, vi } from 'vitest'

import { Resizable } from './resizable'

const cleanup = [] as Array<() => void>

afterEach(() => {
	while (cleanup.length) cleanup.pop()!()
	localStorage.clear()
})

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

function createNode(bounds: HTMLElement) {
	const node = document.createElement('div')
	node.style.position = 'absolute'
	node.style.top = '0px'
	node.style.left = '0px'
	node.style.width = '100px'
	node.style.height = '100px'
	bounds.appendChild(node)
	cleanup.push(() => node.remove())
	return node
}

function createResizable(node: HTMLElement, bounds: HTMLElement, opts = {}) {
	const resizable = new Resizable(node, { bounds, ...opts })
	cleanup.push(() => resizable.dispose())
	return resizable
}

describe('resize', () => {
	// The min / max values are only computed on `onGrab`, so a resize before the first grab used
	// to clamp every dimension to 0.
	test('lands the requested size before any grab', () => {
		const bounds = createBounds()
		const node = createNode(bounds)
		const resizable = createResizable(node, bounds)

		resizable.resize({ width: 240, height: 180 })

		expect(node.offsetWidth).toBe(240)
		expect(node.offsetHeight).toBe(180)
		expect(resizable.size.value).toEqual({ width: 240, height: 180 })
	})

	test('an omitted dimension is left alone', () => {
		const bounds = createBounds()
		const node = createNode(bounds)
		const resizable = createResizable(node, bounds)

		resizable.resize({ width: 240 })

		expect(node.offsetWidth).toBe(240)
		expect(node.offsetHeight).toBe(100)
	})

	test('clamps to the bounds', () => {
		const bounds = createBounds(600, 400)
		const node = createNode(bounds)
		const resizable = createResizable(node, bounds)

		resizable.resize({ width: 5000, height: 5000 })

		expect(node.offsetWidth).toBe(600)
		expect(node.offsetHeight).toBe(400)
	})

	test('clamps to the css min / max values', () => {
		const bounds = createBounds()
		const node = createNode(bounds)
		node.style.minWidth = '120px'
		node.style.maxHeight = '150px'
		const resizable = createResizable(node, bounds)

		resizable.resize({ width: 50, height: 400 })

		expect(node.offsetWidth).toBe(120)
		expect(node.offsetHeight).toBe(150)
	})

	test('clamps to the 25px floor', () => {
		const bounds = createBounds()
		const node = createNode(bounds)
		const resizable = createResizable(node, bounds)

		resizable.resize({ width: 1, height: 1 })

		expect(node.offsetWidth).toBe(25)
		expect(node.offsetHeight).toBe(25)
	})

	test('persists to the localStorage key', () => {
		const bounds = createBounds()
		const node = createNode(bounds)
		const key = 'resizable-test::size'
		const resizable = createResizable(node, bounds, { localStorageKey: key })

		resizable.resize({ width: 240, height: 180 })

		expect(JSON.parse(localStorage.getItem(key)!)).toEqual({ width: 240, height: 180 })
	})

	test('fires `onResize` and the `resize` event', () => {
		const bounds = createBounds()
		const node = createNode(bounds)
		const onResize = vi.fn()
		const onEvent = vi.fn()
		const resizable = createResizable(node, bounds, { onResize })
		// After construction -- it dispatches a `resize` of its own.
		node.addEventListener('resize', onEvent)

		resizable.resize({ width: 240, height: 180 })

		expect(onResize).toHaveBeenCalledWith({ width: 240, height: 180 })
		expect(onEvent).toHaveBeenCalledTimes(1)
	})

	// An element with no vertical grabber must never be given an inline height -- one pins it
	// forever, so a folder that collapses inside it can never shrink it again.
	test('ignores `height` when no grabber could change it', () => {
		const bounds = createBounds()
		const node = createNode(bounds)
		const resizable = createResizable(node, bounds, { sides: ['right'], corners: [] })

		resizable.resize({ width: 240, height: 400 })

		expect(node.offsetWidth).toBe(240)
		expect(node.offsetHeight).toBe(100)
	})

	test('does nothing when disabled', () => {
		const bounds = createBounds()
		const node = createNode(bounds)
		const resizable = createResizable(node, bounds, { disabled: true })

		resizable.resize({ width: 240, height: 180 })

		expect(node.offsetWidth).toBe(100)
		expect(node.offsetHeight).toBe(100)
	})

	test('throws on a non-finite size', () => {
		const bounds = createBounds()
		const node = createNode(bounds)
		const resizable = createResizable(node, bounds)

		expect(() => resizable.resize({ width: NaN })).toThrow()
	})
})
