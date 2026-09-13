import { GooeyTest } from './tests/Gooey/GooeyTest'
import { describe, expect, test } from 'vitest'
// import { stringify } from './shared/stringify'
// import { paint } from '@braebo/ansi'
// import { tldr } from './shared/tldr'
import { Gooey } from './Gooey'

const G = new GooeyTest()

// testing

describe('addMany', () => {
	const stuff = {
		switch: true,
		number: 123,
		string: 'foo',
		button: () => console.log('button clicked'),
		nested: {
			color: '#ff000011' as const,
			array: ['a', 'b', 'c'],
			select: { value: 'a', options: ['a', 'b', 'c'] },
			doubleNested: {
				foobar: 'baz',
			},
		},
	}

	const gooey = G.addGooey({ height: 1000 })
	const { inputs, folders } = gooey.addMany(stuff)

	// prettier-ignore
	test('input switch', () => {
		const inputSwitch = inputs.switch
		expect(inputSwitch, '❌ Missing from allInputs.').toMatchObject(gooey.allInputs.get('switch')!)
		expect(inputSwitch?.__type, '❌ Incorrect input type.').toBe('InputSwitch')
		expect(inputSwitch?.value, '❌ Bad switch value.').toBe(true)
	})

	// prettier-ignore
	test('input number', () => {
		const inputNumber = inputs.number
		expect(inputNumber, '❌ Missing from allInputs.').toMatchObject(gooey.allInputs.get('number')!)
		expect(inputNumber?.__type, '❌ Incorrect input type.').toBe('InputNumber')
		expect(inputNumber?.value, '❌ Bad number value.').toBe(123)
	})

	// prettier-ignore
	test('input string', () => {
		const inputString = inputs.string
		expect(inputString, '❌ Missing from allInputs.').toMatchObject(gooey.allInputs.get('string')!)
		expect(inputString?.__type, '❌ Incorrect input type.').toBe('InputText')
		expect(inputString?.value, '❌ Bad string value.').toBe('foo')
	})

	// prettier-ignore
	test('input button', () => {
		const inputButton = inputs.button
		expect(inputButton, '❌ Missing from allInputs.').toMatchObject(gooey.allInputs.get('button')!)
		expect(inputButton?.__type, '❌ Incorrect input type.').toBe('InputButton')
		expect(inputButton?.value, '❌ Bad button value.').toMatchObject({})
	})

	// prettier-ignore
	test('input nested folder', () => {
		const folder = gooey.folder.allChildren.find(f => f.title === 'doubleNested')
		expect(folder, '❌ Missing from allChildren.').toMatchObject(
			gooey.folder.allChildren.find(f => f.title === 'doubleNested')!
		)
		expect(folders.nested.folder?.__type, '❌ Failed to find generated Folder.').toBe('Folder')
	})

	// prettier-ignore
	test('input color', () => {
		const inputColor = inputs.nested.color
		expect(inputColor, '❌ Missing from allInputs.').toMatchObject(gooey.allInputs.get('color')!)
		expect(inputColor?.__type, '❌ Incorrect input type.').toBe('InputColor')
		expect(inputColor?.value.hex, '❌ Bad color value.').toBe('#ff000011')
	})

	// prettier-ignore
	test('input array', () => {
		const inputArray = inputs.nested.array
		expect(inputArray, '❌ Missing from allInputs.').toMatchObject(gooey.allInputs.get('array')!)
		expect(inputArray?.__type, '❌ Incorrect input type.').toBe('InputArray')
		// InputArray now returns the full array, not a selected value
		expect(inputArray?.value, '❌ Bad array value.').toEqual(['a', 'b', 'c'])
	})

	// prettier-ignore
	test('input select', () => {
		const inputSelect = inputs.nested.select
		expect(inputSelect, '❌ Missing from allInputs.').toMatchObject(gooey.allInputs.get('select')!)
		expect(inputSelect?.__type, '❌ Incorrect input type.').toBe('InputSelect')
		expect(inputSelect?.value, '❌ Bad select raw value.').toBe('a')
		expect(inputSelect?.state.value, '❌ Bad state value.').toBe('a')
		expect(inputSelect?.selected.value, '❌ Bad selected option.').toMatchObject({ label: 'a', value: 'a' })
	})

	inputs.number.on('change', v => console.log('number changed', v))
})

describe('nested folder collapse', () => {
	const settle = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms))

	const nest = (gooey: Gooey) => {
		const parent = gooey.addFolder('parent')
		const child = parent.addFolder('child')
		child.addNumber('a', 1)
		child.addNumber('b', 2)
		child.addNumber('c', 3)
		return { parent, child }
	}

	test('parent shrinks when its child collapses', async () => {
		const gooey = G.addGooey({ height: 1000, title: 'collapse' })
		const { parent, child } = nest(gooey)
		await settle()

		const before = parent.elements.content.getBoundingClientRect().height
		child.close()
		await settle(800)
		const after = parent.elements.content.getBoundingClientRect().height

		expect(after, '❌ Parent content did not shrink.').toBeLessThan(before)
	})

	// A persisted size used to be re-applied as an inline `height` on the root element, pinning
	// the gooey at its tallest so no folder collapse could ever shrink it again.
	test('a persisted size does not pin the root height', async () => {
		localStorage.clear()
		const container = document.createElement('div')
		container.style.cssText = 'position: relative; height: 1000px;'
		document.body.append(container)

		const opts = {
			title: 'persisted',
			container,
			position: 'center',
			storage: { key: 'persisted-size', size: true },
		} as const

		const first = new Gooey(opts)
		nest(first)
		await settle()
		// Stand in for a width drag, which persists the current height along with the width.
		const resizable = first.window!.resizableInstance!
		resizable.size.set({
			width: first.folder.element.offsetWidth,
			height: first.folder.element.offsetHeight,
		})
		await settle(100)
		first.dispose()

		const second = new Gooey(opts)
		const { child } = nest(second)
		await settle()

		const before = second.folder.element.getBoundingClientRect().height
		child.close()
		await settle(800)
		const after = second.folder.element.getBoundingClientRect().height

		expect(second.folder.element.style.height, '❌ Root was given an inline height.').toBe('')
		expect(after, '❌ Root height is stuck at its tallest.').toBeLessThan(before)
	})
})

const wow = new Gooey()
const folder = wow.addFolder('asd')

folder.inputs.get('a')

folder.inputs.get('a')

folder.allInputs.get('a')

folder.children[0]

folder.allChildren[0]
