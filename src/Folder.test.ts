// import { tldr } from './shared/tldr'
import { Gooey } from './Gooey'
import { GooeyTest } from './tests/Gooey/GooeyTest'
import { describe, expect, test } from 'vitest'

const G = new GooeyTest()

describe('addMany', () => {
	const stuff = {
		switch: true,
		number: 123,
		string: 'foo',
		button: () => console.log('button clicked'),
		nested: {
			color: '#ff000011' as const,
			select: ['a', 'b', 'c'],
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
	test('input select', () => {
		const inputSelect = inputs.nested.select
		expect(inputSelect, '❌ Missing from allInputs.').toMatchObject(gooey.allInputs.get('select')!)
		expect(inputSelect?.__type, '❌ Incorrect input type.').toBe('InputSelect')
		expect(inputSelect?.value.value, '❌ Bad select value.').toBe('a')
	})

	inputs.number.on('change', v => console.log('number changed', v))
})

const wow = new Gooey()
const folder = wow.addFolder('asd')

folder.inputs.get('a')

folder.inputs.get('a')

folder.allInputs.get('a')

folder.children[0]

folder.allChildren[0]
