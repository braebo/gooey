import { afterEach, describe, expect, test } from 'vitest'
import { GooeyTest } from './tests/Gooey/GooeyTest'
import type { Gooey } from './Gooey'

const G = new GooeyTest()

const gooeys: Gooey[] = []
function addGooey(title: string) {
	const gooey = G.addGooey({ title })
	gooeys.push(gooey)
	return gooey
}

afterEach(() => {
	for (const gooey of gooeys.splice(0)) gooey.dispose()
})

describe('UndoManager', () => {
	test('change two inputs, undo once, change one: the history follows', () => {
		const gooey = addGooey('undo-two-numbers')
		const um = gooey._undoManager
		const a = gooey.addNumber('a', 0)
		const b = gooey.addNumber('b', 0)

		a.set(1)
		b.set(2)
		um.undo()
		expect(b.value).toBe(0)

		a.set(3)
		expect(um.stack.map(c => c.to)).toEqual([1, 3])

		um.undo()
		expect(a.value).toBe(1)
		um.undo()
		expect(a.value).toBe(0)
		expect(b.value).toBe(0)
	})

	test('an undo whose replay commits nothing leaves the next change on the record', () => {
		const gooey = addGooey('undo-color-then-number')
		const um = gooey._undoManager
		const a = gooey.addNumber('a', 0)
		const c = gooey.addColor('c', '#000000')

		a.set(1)
		c.set('#ff0000')
		// A color's undo replays through its setter, which writes the state without a commit.
		um.undo()
		expect(c.value.hex).toBe('#000000ff')

		a.set(2)
		expect(um.stack.map(commit => commit.to)).toEqual([1, 2])

		um.undo()
		expect(a.value).toBe(1)
		um.undo()
		expect(a.value).toBe(0)
	})

	test('a redo whose replay commits nothing leaves the next change on the record', () => {
		const gooey = addGooey('redo-color-then-number')
		const um = gooey._undoManager
		const a = gooey.addNumber('a', 0)
		const c = gooey.addColor('c', '#000000')

		c.set('#ff0000')
		um.undo()
		um.redo()
		expect(c.value.hex).toBe('#ff0000ff')

		a.set(1)
		um.undo()
		expect(a.value).toBe(0)
		expect(c.value.hex).toBe('#ff0000ff')
	})

	test('an undo replay is never recorded as a change of its own', () => {
		const gooey = addGooey('undo-replay-not-recorded')
		const um = gooey._undoManager
		const a = gooey.addNumber('a', 0)

		a.set(1)
		a.set(2)
		um.undo()
		um.undo()
		expect(um.stack).toHaveLength(2)
		expect(um.pointer).toBe(-1)

		um.redo()
		um.redo()
		expect(a.value).toBe(2)
		expect(um.stack).toHaveLength(2)
		expect(um.pointer).toBe(1)
	})
})
