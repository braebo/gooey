import { describe, expect, test, vi, afterEach } from 'vitest'
import { GooeyTest } from './tests/Gooey/GooeyTest'
import type { Gooey } from './Gooey'

const G = new GooeyTest()

/** Cmd+Z on mac and Ctrl+Z elsewhere -- both modifiers set, so it reads as undo on either. */
function undoKey(target: EventTarget, init: KeyboardEventInit = {}) {
	const event = new KeyboardEvent('keydown', {
		key: 'z',
		metaKey: true,
		ctrlKey: true,
		bubbles: true,
		cancelable: true,
		composed: true,
		...init,
	})
	target.dispatchEvent(event)
	return event
}

function spyUndo(gooey: Gooey) {
	return {
		undo: vi.spyOn(gooey._undoManager, 'undo'),
		redo: vi.spyOn(gooey._undoManager, 'redo'),
	}
}

const fields: HTMLElement[] = []
function field<T extends HTMLElement>(el: T): T {
	document.body.append(el)
	fields.push(el)
	return el
}

afterEach(() => {
	for (const el of fields.splice(0)) el.remove()
})

describe('undo keys', () => {
	test('Cmd/Ctrl+Z outside a text field is gooey undo, and the browser default is stopped', () => {
		const gooey = G.addGooey({ title: 'undo-outside' })
		const spy = spyUndo(gooey)

		const e = undoKey(document.body)
		expect(e.defaultPrevented).toBe(true)
		expect(spy.undo).toHaveBeenCalledTimes(1)

		undoKey(document.body, { shiftKey: true })
		expect(spy.redo).toHaveBeenCalledTimes(1)
		gooey.dispose()
	})

	test.each([
		['textarea', () => document.createElement('textarea')],
		[
			'input[type=text]',
			() => Object.assign(document.createElement('input'), { type: 'text' }),
		],
		[
			'input[type=number]',
			() => Object.assign(document.createElement('input'), { type: 'number' }),
		],
		[
			'contenteditable',
			() => {
				const div = document.createElement('div')
				div.contentEditable = 'true'
				return div
			},
		],
	])('Cmd/Ctrl+Z in a %s is left to the browser', (_, make) => {
		const gooey = G.addGooey({ title: 'undo-text' })
		const spy = spyUndo(gooey)
		const el = field(make())

		const undo = undoKey(el)
		const redo = undoKey(el, { shiftKey: true })
		const ctrlY = undoKey(el, { key: 'y', metaKey: false })

		expect(undo.defaultPrevented).toBe(false)
		expect(redo.defaultPrevented).toBe(false)
		expect(ctrlY.defaultPrevented).toBe(false)
		expect(spy.undo).not.toHaveBeenCalled()
		expect(spy.redo).not.toHaveBeenCalled()
		gooey.dispose()
	})

	test('a text field inside a shadow root is still left to the browser', () => {
		const gooey = G.addGooey({ title: 'undo-shadow' })
		const spy = spyUndo(gooey)
		const host = field(document.createElement('div'))
		const textarea = document.createElement('textarea')
		host.attachShadow({ mode: 'open' }).append(textarea)

		expect(undoKey(textarea).defaultPrevented).toBe(false)
		expect(spy.undo).not.toHaveBeenCalled()
		gooey.dispose()
	})

	test("a slider, a checkbox and a read-only field keep gooey's undo", () => {
		const gooey = G.addGooey({ title: 'undo-controls' })
		const spy = spyUndo(gooey)
		const range = field(Object.assign(document.createElement('input'), { type: 'range' }))
		const check = field(Object.assign(document.createElement('input'), { type: 'checkbox' }))
		const readonly = field(
			Object.assign(document.createElement('textarea'), { readOnly: true }),
		)

		for (const el of [range, check, readonly]) expect(undoKey(el).defaultPrevented).toBe(true)
		expect(spy.undo).toHaveBeenCalledTimes(3)
		gooey.dispose()
	})

	test('a key a nearer handler already claimed is left alone', () => {
		const gooey = G.addGooey({ title: 'undo-claimed' })
		const spy = spyUndo(gooey)
		const editor = field(document.createElement('div'))
		editor.addEventListener('keydown', e => e.preventDefault())

		undoKey(editor)
		expect(spy.undo).not.toHaveBeenCalled()
		gooey.dispose()
	})

	test('dispose removes the window listener', () => {
		const gooey = G.addGooey({ title: 'undo-disposed' })
		const spy = spyUndo(gooey)
		gooey.dispose()

		undoKey(document.body)
		expect(spy.undo).not.toHaveBeenCalled()
	})
})
