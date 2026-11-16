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
		expect(resizable.size.value).toEqual({ width: 240, height: 0, picked_height: false })
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

		expect(JSON.parse(localStorage.getItem(key)!)).toEqual({
			width: 240,
			height: 0,
			picked_height: false,
		})
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

function dragGrabber(resizable: Resizable, side: string, clientX: number, clientY: number) {
	const grabber = resizable.node.querySelector(`[data-side="${side}"]`) as HTMLElement
	const box = grabber.getBoundingClientRect()
	grabber.dispatchEvent(
		new PointerEvent('pointerdown', {
			bubbles: true,
			clientX: box.x + box.width / 2,
			clientY: box.y + box.height / 2,
			pointerId: 1,
			button: 0,
		}),
	)
	document.dispatchEvent(
		new PointerEvent('pointermove', { bubbles: true, clientX, clientY, pointerId: 1 }),
	)
	document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }))
}

describe('stored height', () => {
	test('ignores stored height without picked_height', () => {
		const bounds = createBounds()
		const node = createNode(bounds)
		const key = 'resizable-test::stale-h'
		localStorage.setItem(key, JSON.stringify({ width: 880, height: 700 }))

		createResizable(node, bounds, {
			localStorageKey: key,
			sides: ['left', 'right', 'bottom'],
			corners: [],
		})

		expect(node.style.width).toBe('880px')
		// The node's own 100px stays; the stale 700 from storage never lands.
		expect(node.style.height).toBe('100px')
	})

	test('applies stored height when picked_height is set', () => {
		const bounds = createBounds()
		const node = createNode(bounds)
		const key = 'resizable-test::picked-h'
		localStorage.setItem(
			key,
			JSON.stringify({ width: 880, height: 700, picked_height: true }),
		)

		createResizable(node, bounds, {
			localStorageKey: key,
			sides: ['left', 'right', 'bottom'],
			corners: [],
		})

		expect(node.style.width).toBe('880px')
		expect(node.style.height).toBe('700px')
	})

	test('a horizontal drag does not persist height', () => {
		const bounds = createBounds()
		const node = createNode(bounds)
		const key = 'resizable-test::stored-h'
		const resizable = createResizable(node, bounds, {
			localStorageKey: key,
			sides: ['left', 'right', 'bottom'],
			corners: [],
		})

		const right = resizable.node.querySelector('[data-side="right"]')!.getBoundingClientRect()
		dragGrabber(resizable, 'right', right.right + 40, right.y + right.height / 2)

		expect(resizable.size.value.height).toBe(0)
		expect(JSON.parse(localStorage.getItem(key)!).height).toBe(0)
	})

	test('a bottom drag persists the picked height', () => {
		const bounds = createBounds()
		const node = createNode(bounds)
		const key = 'resizable-test::stored-h-drag'
		const resizable = createResizable(node, bounds, {
			localStorageKey: key,
			sides: ['left', 'right', 'bottom'],
			corners: [],
		})

		const bottom = resizable.node.querySelector('[data-side="bottom"]')!.getBoundingClientRect()
		dragGrabber(resizable, 'bottom', bottom.x + bottom.width / 2, bottom.bottom + 50)

		expect(resizable.size.value.height).toBeGreaterThan(100)
		const stored = JSON.parse(localStorage.getItem(key)!)
		expect(stored.height).toBe(resizable.size.value.height)
		expect(stored.picked_height).toBe(true)
	})
})
