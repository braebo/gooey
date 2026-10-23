import { describe, expect, test, vi, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { GooeyTest } from './tests/Gooey/GooeyTest'
import type { Gooey } from './Gooey'

const G = new GooeyTest()

/** Every gooey made here is disposed after its test, so a failed test can't leave its listener. */
const gooeys: Gooey[] = []
function addGooey(title: string) {
	const gooey = G.addGooey({ title })
	gooeys.push(gooey)
	return gooey
}

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

/**
 * A trusted Cmd+Z / Cmd+Shift+Z on mac, Ctrl+Z / Ctrl+Shift+Z elsewhere (Playwright's
 * `ControlOrMeta`), so the browser's own undo runs and gooey's platform check matches on any host.
 */
const realUndo = () => userEvent.keyboard('{ControlOrMeta>}z{/ControlOrMeta}')
const realRedo = () => userEvent.keyboard('{ControlOrMeta>}{Shift>}z{/Shift}{/ControlOrMeta}')

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
	for (const gooey of gooeys.splice(0)) gooey.dispose()
})

describe('undo keys', () => {
	test('Cmd/Ctrl+Z outside a text field is gooey undo, and the browser default is stopped', () => {
		const gooey = addGooey('undo-outside')
		const spy = spyUndo(gooey)

		const e = undoKey(document.body)
		expect(e.defaultPrevented).toBe(true)
		expect(spy.undo).toHaveBeenCalledTimes(1)

		undoKey(document.body, { shiftKey: true })
		expect(spy.redo).toHaveBeenCalledTimes(1)
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
		const gooey = addGooey('undo-text')
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
	})

	test('a text field inside a shadow root is still left to the browser', () => {
		const gooey = addGooey('undo-shadow')
		const spy = spyUndo(gooey)
		const host = field(document.createElement('div'))
		const textarea = document.createElement('textarea')
		host.attachShadow({ mode: 'open' }).append(textarea)

		expect(undoKey(textarea).defaultPrevented).toBe(false)
		expect(spy.undo).not.toHaveBeenCalled()
	})

	test("a slider, a checkbox and a read-only field keep gooey's undo", () => {
		const gooey = addGooey('undo-controls')
		const spy = spyUndo(gooey)
		const range = field(Object.assign(document.createElement('input'), { type: 'range' }))
		const check = field(Object.assign(document.createElement('input'), { type: 'checkbox' }))
		const readonly = field(
			Object.assign(document.createElement('textarea'), { readOnly: true }),
		)

		for (const el of [range, check, readonly]) expect(undoKey(el).defaultPrevented).toBe(true)
		expect(spy.undo).toHaveBeenCalledTimes(3)
	})

	test('a key a nearer handler already claimed is left alone', () => {
		const gooey = addGooey('undo-claimed')
		const spy = spyUndo(gooey)
		const editor = field(document.createElement('div'))
		editor.addEventListener('keydown', e => e.preventDefault())

		undoKey(editor)
		expect(spy.undo).not.toHaveBeenCalled()
	})

	test('a real Cmd+Shift+Z (key "Z") redoes on mac', () => {
		const ua = vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Macintosh')
		const gooey = addGooey('undo-mac-shift')
		const spy = spyUndo(gooey)

		const e = undoKey(document.body, { key: 'Z', shiftKey: true, ctrlKey: false })
		expect(e.defaultPrevented).toBe(true)
		expect(spy.redo).toHaveBeenCalledTimes(1)
		expect(spy.undo).not.toHaveBeenCalled()
		ua.mockRestore()
	})

	test('off mac, Ctrl+Z undoes, and Ctrl+Shift+Z and Ctrl+Y redo', () => {
		const ua = vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Windows NT 10.0')
		const gooey = addGooey('undo-off-mac')
		const spy = spyUndo(gooey)

		undoKey(document.body, { metaKey: false })
		undoKey(document.body, { key: 'Z', shiftKey: true, metaKey: false })
		undoKey(document.body, { key: 'y', metaKey: false })
		expect(spy.undo).toHaveBeenCalledTimes(1)
		expect(spy.redo).toHaveBeenCalledTimes(2)
		ua.mockRestore()
	})

	test('dispose removes the window listener', () => {
		const gooey = G.addGooey({ title: 'undo-disposed' })
		const spy = spyUndo(gooey)
		gooey.dispose()

		undoKey(document.body)
		expect(spy.undo).not.toHaveBeenCalled()
	})

	test('a text field inside a closed shadow root keeps its native undo', async () => {
		const gooey = addGooey('undo-closed-shadow')
		const spy = spyUndo(gooey)
		const host = field(document.createElement('x-closed-field'))
		const input = document.createElement('input')
		host.attachShadow({ mode: 'closed' }).append(input)

		// From window, the event's target is the host: the input is out of sight.
		expect(undoKey(input).defaultPrevented).toBe(false)
		expect(spy.undo).not.toHaveBeenCalled()

		input.focus()
		await userEvent.keyboard('abc')
		await realUndo()
		expect(input.value).toBe('')
		expect(spy.undo).not.toHaveBeenCalled()
	})

	test("a focusable custom element, a closed host's own focus, and body keep gooey's undo", () => {
		const gooey = addGooey('undo-focusable-host')
		const spy = spyUndo(gooey)
		const button = field(document.createElement('x-fancy-button'))
		button.tabIndex = 0
		const host = field(document.createElement('div'))
		host.attachShadow({ mode: 'closed' })
		host.tabIndex = 0

		for (const el of [button, host, document.body]) {
			expect(undoKey(el).defaultPrevented).toBe(true)
		}
		expect(spy.undo).toHaveBeenCalledTimes(3)
	})

	test('a clicked <main tabindex="-1"> keeps gooey\'s undo', async () => {
		const gooey = addGooey('undo-skip-link-main')
		const spy = spyUndo(gooey)
		const main = field(document.createElement('main'))
		main.tabIndex = -1
		main.textContent = 'content'
		main.style.cssText = 'display:block;width:200px;height:50px'

		await userEvent.click(main)
		expect(document.activeElement).toBe(main)
		await realUndo()
		expect(spy.undo).toHaveBeenCalledTimes(1)
	})

	test("gooey's number field keeps gooey's undo for arrow steps", async () => {
		const gooey = addGooey('undo-number-arrow')
		const n = gooey.addNumber('n', 5, { min: 0, max: 100, step: 1 })
		const el = n.elements.controllers.input

		await userEvent.click(el)
		await userEvent.keyboard('{ArrowUp}{ArrowUp}')
		expect(n.state.value).toBe(7)

		await realUndo()
		expect(n.state.value).toBe(6)
		expect(el.value).toBe('6')
		await realUndo()
		expect(n.state.value).toBe(5)
		await realRedo()
		expect(n.state.value).toBe(6)
	})

	test("gooey's number field keeps gooey's undo for typed digits", async () => {
		const gooey = addGooey('undo-number-typed')
		const n = gooey.addNumber('n', 5, { min: 0, max: 100, step: 1 })
		const el = n.elements.controllers.input
		const spy = spyUndo(gooey)

		await userEvent.click(el)
		await userEvent.keyboard('7')
		expect(n.state.value).toBe(57)

		await realUndo()
		expect(spy.undo).toHaveBeenCalledTimes(1)
		expect(n.state.value).toBe(5)
		expect(el.value).toBe('5')
	})

	test("gooey's text field keeps the browser's undo", async () => {
		const gooey = addGooey('undo-text-field')
		const t = gooey.addText('t', 'hi')
		const el = t.elements.controllers.input as HTMLInputElement
		const spy = spyUndo(gooey)

		await userEvent.click(el)
		await userEvent.keyboard('{End} there')
		await realUndo()
		expect(el.value).toBe('hi')
		expect(spy.undo).not.toHaveBeenCalled()
		await realRedo()
		expect(el.value).toBe('hi there')
	})
})
