import { GooeyTest } from './tests/Gooey/GooeyTest'
import { describe, expect, test } from 'vitest'
import { Gooey } from './Gooey'

const G = new GooeyTest()

describe('Gooey constructor', () => {
	let gooey: Gooey
	test('empty init', () => {
		gooey = new Gooey()
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

	test('container: "body"', () => {
		const gooey = G.addGooey({ container: 'body' })
		expect(gooey.container).toBe(document.body)
		setTimeout(gooey.dispose)
	})
})

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

describe('addMany', () => {
	const stuff = {
		switch: true,
		number: 123,
		string: 'foo',
		nested: {
			color: '#ff0000',
			select: ['a', 'b', 'c'],
		},
	}

	const gooey = G.addGooey({ height: 1000 })
	gooey.addMany(stuff)

	console.log('allInputs.keys()', [...gooey.allInputs.keys()])
	console.log(
		'children',
		gooey.folder.children.map(c => c.title),
	)

	test('input switch', () => {
		const inputSwitch = gooey.allInputs.get('switch')
		expect(inputSwitch?.element, 'Failed to find input switch.').toBeDefined()
		expect(inputSwitch?.__type, 'Generated wrong input A type.').toBe('InputSwitch')
		expect(inputSwitch?.value, 'Bad input A value.').toBe(true)
	})

	test('input number', () => {
		const inputNumber = gooey.allInputs.get('number')
		expect(inputNumber?.element, 'Failed to find input number.').toBeDefined()
		expect(inputNumber?.__type, 'Generated wrong input A type.').toBe('InputNumber')
		expect(inputNumber?.value, 'Bad input A value.').toBe(123)
	})

	test('input string', () => {
		const inputString = gooey.allInputs.get('string')
		expect(inputString?.element, 'Failed to find input string.').toBeDefined()
		expect(inputString?.__type, 'Generated wrong input A type.').toBe('InputText')
		expect(inputString?.value, 'Bad input A value.').toBe('foo')
	})

	test('input nested folder', () => {
		const inputNested = gooey.folder.children.find(c => c.title === 'nested')
		expect(inputNested?.element, 'Failed to find input nested.').toBeDefined()
		expect(inputNested?.__type, 'Generated wrong input A type').toBe('Folder')
	})

	test('input color', () => {
		const inputColor = gooey.allInputs.get('color')
		expect(inputColor?.element, 'Failed to find input color.').toBeDefined()
		expect(inputColor?.__type, 'Generated wrong input A type.').toBe('InputColor')
		expect(inputColor?.value, 'Bad input A value.').toBe('#ff0000')
	})

	test('input select', () => {
		const inputSelect = gooey.allInputs.get('select')
		expect(inputSelect?.element, 'Failed to find input select.').toBeDefined()
		expect(inputSelect?.__type, 'Generated wrong input A type.').toBe('InputSelect')
		expect(inputSelect?.value, 'Bad input A value.').toBe('a')
	})
})
