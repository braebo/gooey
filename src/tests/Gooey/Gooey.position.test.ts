import { describe, test, expect } from 'vitest'
import { GooeyTest } from './GooeyTest'

const G = new GooeyTest()

describe('width', () => {
	test('width is respected', async () => {
		const gooey = G.addGooey({ title: 'width', width: 345 })
		expect(gooey.element.clientWidth).toBe(345)
	})

	test('100px', async () => {
		const gooey = G.addGooey({ title: '100px', width: 100 })
		expect(gooey.element.clientWidth).toBe(100)
	})
})
