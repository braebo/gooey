import { describe, expect, test } from 'vitest'

import { InputNumber } from './InputNumber'
import { InputSwitch } from './InputSwitch'
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

	test('an array JSON can not hold still builds, and a bound one still re-reads', () => {
		const loop: { self?: unknown } = {}
		loop.self = loop
		// A cycle past `maxItems` is never shown, and a bigint shows as text.
		expect(() => gooey.addArray('cycle', [1, loop], { maxItems: 1 })).not.toThrow()

		const target = { arr: [1n, 2n] as unknown[] }
		const input = gooey.bindArray(target, 'arr')
		expect(input.items.map(item => item.value)).toEqual(['1', '2'])

		target.arr.push(3n)
		input.refresh()
		expect(input.items.map(item => item.value)).toEqual(['1', '2', '3'])
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

	describe('an item edit is the array’s undo step', () => {
		const fresh = () => new Gooey({ title: 'array undo', storage: false })

		test('undo and redo set the array, items and target', () => {
			const g = fresh()
			const target = { arr: [1, 2] }
			const input = g.bindArray(target, 'arr')

			;(input.items[0] as InputNumber).set(5)
			expect(g._undoManager.stack).toHaveLength(1)

			g._undoManager.undo()
			expect(target.arr).toEqual([1, 2])
			expect(input.items.map(item => item.value)).toEqual([1, 2])

			g._undoManager.redo()
			expect(target.arr).toEqual([5, 2])
			expect(input.items.map(item => item.value)).toEqual([5, 2])
		})

		test('a drag on a number item is one step', () => {
			const g = fresh()
			const input = g.addArray('arr', [1, 2])
			const item = input.items[0] as InputNumber
			const slider = item.elements.controllers.input

			slider.dispatchEvent(new Event('dragStart'))
			item.set(3)
			item.set(4)
			slider.dispatchEvent(new Event('dragEnd'))
			expect(g._undoManager.stack).toHaveLength(1)

			input.set([0])
			g._undoManager.undo()
			expect(input.value).toEqual([1, 2])
		})

		test('after an outside write and refresh rebuilt the items', () => {
			const g = fresh()
			const target = { arr: [1, 2] }
			const input = g.bindArray(target, 'arr')

			;(input.items[0] as InputNumber).set(5)
			target.arr = [7, 8, 9]
			input.refresh()

			g._undoManager.undo()
			expect(target.arr).toEqual([1, 2])
			expect(input.items.map(item => item.value)).toEqual([1, 2])
			expect(g._undoManager.pointer).toBe(-1)
		})

		test('after set() rebuilt the items', () => {
			const g = fresh()
			const input = g.addArray('arr', [1, 2])

			;(input.items[1] as InputNumber).set(5)
			input.set([9])

			g._undoManager.undo()
			expect(input.value).toEqual([1, 2])
			expect(input.items.map(item => item.value)).toEqual([1, 2])
		})

		test('a switch item and a JSON object item undo to the array’s own values', () => {
			const g = fresh()
			const target = { flags: [true], objs: [{ a: 1 }] }
			const flags = g.bindArray(target, 'flags')
			const objs = g.bindArray(target, 'objs')

			;(flags.items[0] as InputSwitch).set(false)
			;(objs.items[0] as InputText).set('{"a":2}')
			expect(target).toEqual({ flags: [false], objs: [{ a: 2 }] })

			target.flags = [false, false]
			flags.refresh()
			g._undoManager.undo()
			g._undoManager.undo()
			expect(target).toEqual({ flags: [true], objs: [{ a: 1 }] })
		})

		test('an undo gives back the items exactly, not as their text', () => {
			const g = fresh()
			const when = new Date(0)
			const target = { arr: [null, { when }] as unknown[] }
			const input = g.bindArray(target, 'arr')

			;(input.items[0] as InputText).set('x')
			;(input.items[1] as InputText).set('{}')
			g._undoManager.undo()
			g._undoManager.undo()
			expect(target.arr[0]).toBeNull()
			expect((target.arr[1] as { when: Date }).when).toBe(when)
		})

		test('an outside write to an array an undo restored leaves the history alone', () => {
			const g = fresh()
			const target = { arr: [1, 2] }
			const input = g.bindArray(target, 'arr')

			;(input.items[0] as InputNumber).set(5)
			g._undoManager.undo()
			target.arr.push(3)
			input.refresh()

			g._undoManager.redo()
			g._undoManager.undo()
			expect(target.arr).toEqual([1, 2])
		})
	})

	test('maxItems caps rendered items without truncating the value', () => {
		const input = gooey.addArray('capped', [1, 2, 3, 4, 5], { maxItems: 2 })
		expect(input.items.length).toBe(2)
		expect(input.state.value.length).toBe(5)
	})
})
