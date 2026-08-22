import { describe, expect, test } from 'vitest'

import { InputElement } from './InputElement'
import { Gooey } from '../Gooey'

describe('InputElement', () => {
	const gooey = new Gooey({
		title: 'test',
		storage: false,
	})

	test('addElement mounts a provided element', () => {
		const el = document.createElement('div')
		el.textContent = 'custom'

		const input = gooey.addElement('mounted', el)

		expect(input).toBeInstanceOf(InputElement)
		expect(input.container.contains(el)).toBe(true)
		expect(gooey.folder.element.contains(el)).toBe(true)
	})

	test('a mount function receives the container', () => {
		let received: HTMLElement | undefined

		const input = gooey.addElement('mount fn', container => {
			received = container
			container.innerHTML = '<p>markdown</p>'
		})

		expect(received).toBe(input.container)
		expect(input.container.querySelector('p')?.textContent).toBe('markdown')
	})

	test('set() replaces content and runs the previous cleanup', () => {
		let cleaned = 0

		const input = gooey.addElement('replaced', container => {
			container.textContent = 'first'
			return () => cleaned++
		})

		let nextMounts = 0
		let nextCleaned = 0
		const next = (container: HTMLElement) => {
			nextMounts++
			container.textContent = 'second'
			return () => nextCleaned++
		}
		input.set(next)

		expect(cleaned).toBe(1) // the previous content's cleanup ran exactly once.
		expect(nextMounts).toBe(1) // the replacement mounts exactly once, not twice.
		expect(nextCleaned).toBe(0) // the replacement's own cleanup must not fire mid-set.
		expect(input.container.textContent).toBe('second')
		expect(input.state.value).toBe(next)
	})

	test('dispose() runs the cleanup and empties the container', () => {
		let cleaned = 0

		const input = gooey.addElement('disposed', container => {
			container.textContent = 'bye'
			return () => cleaned++
		})

		input.dispose()

		expect(cleaned).toBe(1)
		expect(input.container.childNodes.length).toBe(0)

		// A folder refresh shouldn't remount disposed content.
		input.refresh()
		expect(input.container.childNodes.length).toBe(0)
	})

	test('presets skip element inputs', () => {
		const folder = gooey.addFolder('presets')
		folder.addText('text', 'foo')
		const element = folder.addElement('element', document.createElement('div'))

		expect(element.opts.saveable).toBe(false)

		const preset = folder.save()

		expect(preset.inputs.map(i => i.title)).toEqual(['text'])
		expect(() => folder.load(preset)).not.toThrow()
	})
})
