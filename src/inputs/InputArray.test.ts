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

	test('refresh() re-reads a bound array changed in place, silently', () => {
		const target = { arr: [1, 2] }
		const input = gooey.bindArray(target, 'arr')
		let changes = 0
		input.on('change', () => changes++)
		const steps = gooey._undoManager.stack.length

		target.arr.push(3)
		input.refresh()

		expect(input.items.map(item => item.value)).toEqual([1, 2, 3])
		expect(changes).toBe(0)
		expect(gooey._undoManager.stack.length).toBe(steps)
	})

	test('an item edit on a bound array keeps the item inputs', () => {
		const target = { arr: ['a', 'b'] }
		const input = gooey.bindArray(target, 'arr')
		const first = input.items[0]

		;(first as InputText).set('z')
		input.refresh()

		expect(input.items[0]).toBe(first)
		expect(target.arr).toEqual(['z', 'b'])
	})

	test('maxItems caps rendered items without truncating the value', () => {
		const input = gooey.addArray('capped', [1, 2, 3, 4, 5], { maxItems: 2 })
		expect(input.items.length).toBe(2)
		expect(input.state.value.length).toBe(5)
	})
})
