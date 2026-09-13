import { describe, expect, test } from 'vitest'

import { Gooey } from '../Gooey'

describe('dynamic disabled / hidden state', () => {
	const gooey = new Gooey({
		title: 'test',
		storage: false,
	})

	test('a disabled function re-evaluates on refresh', () => {
		let locked = true
		const input = gooey.addSwitch('switch', true, { disabled: () => locked })

		input.refresh()
		expect(input.disabled).toBe(true)

		locked = false
		input.refresh()
		expect(input.disabled).toBe(false) // the flip back has to wake the input.

		locked = true
		input.refresh()
		expect(input.disabled).toBe(true)
	})

	test('a disabled switch still refreshes its controller', () => {
		const input = gooey.addSwitch('switch controller', false, { disabled: () => true })

		input.refresh()
		input.state.set(true)

		expect(input.elements.controllers.input.classList.contains('active')).toBe(true)
	})

	test('the disabled function survives disable() and enable()', () => {
		let locked = false
		const input = gooey.addNumber('number', 1, { disabled: () => locked })

		input.disable()
		expect(input.disabled).toBe(true)

		// A manual override is transient -- the state function re-asserts on the next refresh.
		input.refresh()
		expect(input.disabled).toBe(false)

		locked = true
		input.enable()
		expect(input.disabled).toBe(false)
		input.refresh()
		expect(input.disabled).toBe(true)
	})

	test('assigning a function to `disabled` makes it the new source of truth', () => {
		let locked = true
		const input = gooey.addText('text', 'foo')

		input.disabled = () => locked
		expect(input.disabled).toBe(true)

		locked = false
		input.refresh()
		expect(input.disabled).toBe(false)
	})

	test('a hidden function re-evaluates on refresh', () => {
		let gone = true
		const input = gooey.addText('hidden text', 'foo', { hidden: () => gone })

		expect(input.hidden).toBe(true)

		gone = false
		input.refresh()
		expect(input.hidden).toBe(false)

		gone = true
		input.refresh()
		expect(input.hidden).toBe(true)
	})

	test('a static hidden option applies', () => {
		expect(gooey.addText('hidden static', 'foo', { hidden: true }).hidden).toBe(true)
		expect(gooey.addText('shown static', 'foo', { hidden: false }).hidden).toBe(false)
	})

	test('non-resettable inputs still refresh their disabled state', () => {
		let locked = true
		const input = gooey.addText('unresettable', 'foo', {
			resettable: false,
			disabled: () => locked,
		})

		input.refresh()
		expect(input.disabled).toBe(true)

		locked = false
		input.refresh()
		expect(input.disabled).toBe(false)
	})

	test('folder.refresh() propagates to every input', () => {
		let locked = true
		const folder = gooey.addFolder('folder')
		const a = folder.addSwitch('a', true, { disabled: () => locked })
		const b = folder.addNumber('b', 1, { disabled: () => locked })

		folder.refresh()
		expect([a.disabled, b.disabled]).toEqual([true, true])

		locked = false
		folder.refresh()
		expect([a.disabled, b.disabled]).toEqual([false, false])
	})
})
