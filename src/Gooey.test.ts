import { GooeyTest } from './tests/Gooey/GooeyTest'
import { describe, expect, test, vi } from 'vitest'
import { page } from '@vitest/browser/context'
import { Gooey } from './Gooey'

const G = new GooeyTest()

describe('Gooey constructor', () => {
	let gooey: Gooey
	test('empty init', () => {
		gooey = G.addGooey()
	})

	test('updating title and dispose', () => {
		gooey.title = 'testing 123'
		expect(gooey.title).toBe('testing 123')

		setTimeout(() => {
			expect(gooey.folder.elements.header.innerText).toBe('testing 123')
			gooey.dispose()
		}, 500) // gotta wait for the animation..
	})

	test('container', () => {
		G.addGooey()
	})

	test('title', () => {
		G.addGooey({ title: 'test' })
	})

	test('no storage', () => {
		G.addGooey({ title: 'no storage', storage: false })
	})
})

describe('position', () => {
	test('center', async () => {
		const gooey = G.addGooey()

		await new Promise(resolve => setTimeout(resolve, 100))

		const pos = gooey.window?.position as any
		gooey.title = JSON.stringify(pos).replaceAll(/"|{|}|/g, '')

		expect(pos.x).not.toBe(0)
		expect(pos.y).not.toBe(0)
	})

	test('a persisted position outranks the placement', async () => {
		const a = G.addGooey({
			title: 'persisted-position',
			position: 'top-right',
			storage: { key: 'pp', position: true },
		})
		await new Promise(resolve => setTimeout(resolve, 150))
		const key = a.window!.draggableInstance!.opts.localStorageKey!
		localStorage.setItem(key, JSON.stringify({ x: 7, y: 11 }))
		a.dispose()

		const b = G.addGooey({
			title: 'persisted-position',
			position: 'top-right',
			storage: { key: 'pp', position: true },
		})
		// Past the reveal's 100ms `_updatePosition`, which used to re-apply the placement.
		await new Promise(resolve => setTimeout(resolve, 200))

		expect(b.position).toEqual({ x: 7, y: 11 })
		localStorage.removeItem(key)
		b.dispose()
	})

	test('container: "body"', () => {
		const gooey = G.addGooey({ container: 'body' })
		expect(gooey.container).toBe(document.body)
		setTimeout(gooey.dispose)
	})
})

describe('window persistence identity', () => {
	test('storageId is stable across constructions despite the random root id', () => {
		// `folder.element.id` is `gooey-root_${nanoid()}` -- a fresh id every construction.
		// Persistence must key off the slugged-title storage key instead, or every page
		// load orphans the previous run's saved position/size.
		const a = G.addGooey({ title: 'stable-storage', storage: true })
		const idA = a.folder.element.id
		const storageIdA = a.window?.storageId

		a.dispose()

		const b = G.addGooey({ title: 'stable-storage', storage: true })
		const idB = b.folder.element.id
		const storageIdB = b.window?.storageId

		expect(idA).not.toBe(idB) // sanity: the random root id really does change.
		expect(storageIdA).toBeTruthy()
		expect(storageIdA).toBe(storageIdB)

		b.dispose()
	})
})

describe('width', () => {
	test('width is respected', async () => {
		const gooey = G.addGooey({ title: 'width', width: 345 })
		expect(gooey.element.clientWidth).toBe(345)
	})

	test('the default 35rem max-width still clamps a wider width', async () => {
		const gooey = G.addGooey({ title: 'clamped', width: 700 })
		expect(gooey.element.clientWidth).toBe(560)
	})

	test('width: 700 holds once maxWidth lifts the clamp', async () => {
		const gooey = G.addGooey({ title: 'wide', width: 700, maxWidth: 'none' })
		expect(gooey.element.clientWidth).toBe(700)
	})

	// An element input taller than the room left under the root's max-height centered on its
	// overflow and bled upward over the inputs above it (the board's card over the settings rows).
	test('a tall element input starts at its row and the content scrolls', async () => {
		const gooey = G.addGooey({ title: 'tall', maxHeight: 300 })
		gooey.addNumber('above', 1)
		const input = gooey.addElement('tall', el => {
			el.style.height = '800px'
		})
		const row = input.elements.container.getBoundingClientRect()
		const content = input.elements.content.getBoundingClientRect()
		expect(content.top).toBeGreaterThanOrEqual(row.top)
		const scroller = gooey.element.querySelector(':scope > .gooey-content-wrapper > .gooey-content')!
		expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)
	})

	// The 35rem cap used to keep a gooey inside any viewport by accident; with the cap
	// lifted, the resizer has to follow its bounds itself.
	test('a gooey wider than its bounds shrinks when the viewport does', async () => {
		const gooey = G.addGooey({ title: 'fit', width: 700, maxWidth: 'none' })
		expect(gooey.element.clientWidth).toBe(700)
		try {
			await page.viewport(400, 600)
			await vi.waitFor(() => expect(gooey.element.clientWidth).toBeLessThanOrEqual(400))
		} finally {
			await page.viewport(800, 1000)
		}
	})

	test("maxWidth: 'none' computes to none", async () => {
		const gooey = G.addGooey({ title: 'unbounded', maxWidth: 'none' })
		expect(getComputedStyle(gooey.element).maxWidth).toBe('none')
	})

	test('100px correctly reduces minimum width, and survives a mode flip', async () => {
		const gooey = G.addGooey({ title: '100px', width: 100 })
		expect(gooey.element.clientWidth).toBe(100)

		// The lowered min-width used to be written on the wrapper, which the themer rewrites on
		// every apply -- so a mode change snapped the gooey back out to the 20rem default.
		gooey.themer.mode.set('light')
		gooey.themer.mode.set('dark')
		expect(gooey.element.clientWidth).toBe(100)
	})
})
