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
		expect(resizable.size.value).toEqual({ width: 240, height: 0, pinned: false })
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

		expect(JSON.parse(localStorage.getItem(key)!)).toEqual({ width: 240, height: 0, pinned: false })
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
		expect(JSON.parse(localStorage.getItem(key)!).height).toBe(resizable.size.value.height)
	})

	test('a bottom drag pins; a reload keeps it; a double-click on the edge unpins', () => {
		const bounds = createBounds()
		const key = 'resizable-test::pin'
		const opts = { localStorageKey: key, sides: ['left', 'right', 'bottom'], corners: [] }
		const node = createNode(bounds)
		const resizable = createResizable(node, bounds, opts)

		const bottom = resizable.node.querySelector('[data-side="bottom"]')!.getBoundingClientRect()
		dragGrabber(resizable, 'bottom', bottom.x + bottom.width / 2, bottom.bottom + 50)
		expect(resizable.size.value.pinned).toBe(true)
		expect(node.hasAttribute('data-height-pinned')).toBe(true)
		const picked = resizable.size.value.height
		resizable.dispose()

		const again = createNode(bounds)
		again.style.height = ''
		const reloaded = createResizable(again, bounds, opts)
		expect(again.style.height).toBe(`${picked}px`)

		const grabber = again.querySelector('[data-side="bottom"]') as HTMLElement
		const press = () =>
			grabber.dispatchEvent(
				new PointerEvent('pointerdown', { bubbles: true, clientX: 5, clientY: 5, pointerId: 1 }),
			)
		press()
		document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }))
		press()
		expect(again.style.height).toBe('')
		expect(reloaded.size.value).toMatchObject({ height: 0, pinned: false })
		expect(again.hasAttribute('data-height-pinned')).toBe(false)
	})

	test('a corner drag that only widens does not pin', () => {
		const bounds = createBounds()
		const node = createNode(bounds)
		const resizable = createResizable(node, bounds, {
			localStorageKey: 'resizable-test::corner',
			sides: ['left', 'right', 'bottom'],
			corners: ['bottom-right'],
		})
		const box = resizable.node.querySelector('[data-side="bottom-right"]')!.getBoundingClientRect()
		dragGrabber(resizable, 'bottom-right', box.x + box.width / 2 + 60, box.y + box.height / 2)
		expect(resizable.size.value.pinned).toBeFalsy()
		expect(resizable.size.value.height).toBe(0)
	})

	test('a height saved before pinning existed loads unpinned', () => {
		const bounds = createBounds()
		const key = 'resizable-test::legacy'
		localStorage.setItem(key, JSON.stringify({ width: 200, height: 900 }))
		const node = createNode(bounds)
		node.style.height = ''
		const resizable = createResizable(node, bounds, {
			localStorageKey: key,
			sides: ['left', 'right', 'bottom'],
			corners: [],
		})
		expect(node.style.height).toBe('')
		expect(node.style.width).toBe('200px')
		expect(JSON.parse(localStorage.getItem(key)!)).toMatchObject({ width: 200, height: 0, pinned: false })
		expect(resizable.size.value.pinned).toBe(false)
	})
})
