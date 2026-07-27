import { describe, expect, test } from 'vitest'

import { InputArray } from './InputArray'
import { InputText } from './InputText'
import { Gooey } from '../Gooey'

describe('InputArray', () => {
	const gooey = new Gooey({
		title: 'test',
		storage: false,
	})

	test('add infers InputArray from a data array', () => {
		const input = gooey.add('inferred', ['a', 'b', 'c'])
		expect(input).toBeInstanceOf(InputArray)
		expect(input.items.length).toBe(3)
	})

	test('addArray creates one input per item', () => {
		const input = gooey.addArray('items', ['foo', 'bar'])
		expect(input.items.length).toBe(2)
		expect(input.items[0]).toBeInstanceOf(InputText)
	})

	test('item change updates state and bound target', () => {
		const target = { arr: ['a', 'b'] }
		const input = gooey.bindArray(target, 'arr')

		;(input.items[0] as InputText).set('z')

		expect(input.state.value[0]).toBe('z')
		expect(target.arr[0]).toBe('z')
	})

	test('set() does not revert a bound target to stale values', () => {
		const target = { arr: [1, 2, 3] }
		const input = gooey.bindArray(target, 'arr')

		input.set([4, 5, 6])

		expect(target.arr).toEqual([4, 5, 6])
		expect(input.state.value).toEqual([4, 5, 6])
		expect(input.items.length).toBe(3)
	})

	test('maxItems caps rendered items without truncating the value', () => {
		const input = gooey.addArray('capped', [1, 2, 3, 4, 5], { maxItems: 2 })
		expect(input.items.length).toBe(2)
		expect(input.state.value.length).toBe(5)
	})
})
