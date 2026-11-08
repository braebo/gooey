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

describe('refresh() re-reads a bound field, resettable or not', () => {
	const gooey = new Gooey({ title: 'refresh binding', storage: false })

	/** Each bound kind: a target, the field, the outside write, and how the input reads back. */
	const kinds = [
		{
			kind: 'number',
			bind: (t: any, o: object) => gooey.bindNumber(t, 'v', o),
			from: 1,
			to: 5,
			read: (i: any) => [i.value, i.elements.controllers.input.value],
			want: [5, '5'],
		},
		{
			kind: 'text',
			bind: (t: any, o: object) => gooey.bindText(t, 'v', o),
			from: 'a',
			to: 'b',
			read: (i: any) => [i.value, i.elements.controllers.input.value],
			want: ['b', 'b'],
		},
		{
			kind: 'switch',
			bind: (t: any, o: object) => gooey.bindSwitch(t, 'v', o),
			from: false,
			to: true,
			read: (i: any) => [i.value, i.elements.controllers.input.classList.contains('active')],
			want: [true, true],
		},
		{
			kind: 'color',
			bind: (t: any, o: object) => gooey.bindColor(t, 'v', o),
			from: '#0000ff',
			to: '#00ff00',
			read: (i: any) => [i.state.value.hexString],
			want: ['#00ff00'],
		},
		{
			kind: 'select',
			bind: (t: any, o: object) => gooey.bindSelect(t, 'v', { options: ['a', 'b'], ...o }),
			from: 'a',
			to: 'b',
			read: (i: any) => [i.value, i.selectController.selected.label],
			want: ['b', 'b'],
		},
		{
			kind: 'bezier',
			bind: (t: any, o: object) => gooey.bindBezier(t, 'v', o),
			from: [0.4, 0, 0.2, 1],
			to: [0.1, 0.2, 0.3, 0.4],
			read: (i: any) => [i.value, i.elements.controllers.fields.x1.value],
			want: [[0.1, 0.2, 0.3, 0.4], '0.1'],
		},
		{
			kind: 'gradient',
			bind: (t: any, o: object) => gooey.bindGradient(t, 'v', o),
			from: [
				{ offset: 0, color: '#000000' },
				{ offset: 1, color: '#ffffff' },
			],
			to: [
				{ offset: 0, color: '#ff0000' },
				{ offset: 1, color: '#0000ff' },
			],
			read: (i: any) => [i.value.map((s: any) => s.color)],
			want: [['#ff0000', '#0000ff']],
		},
	]

	for (const { kind, bind, from, to, read, want } of kinds) {
		for (const resettable of [true, false]) {
			test(`${kind}, resettable: ${resettable}`, () => {
				const target = { v: from }
				const input: any = bind(target, { resettable })
				let changes = 0
				let refreshes = 0
				input.on('change', () => changes++)
				input.on('refresh', () => refreshes++)

				target.v = to
				input.refresh()

				expect(read(input)).toEqual(want)
				expect(changes).toBe(0)
				expect(refreshes).toBeGreaterThan(0)
			})
		}
	}
})
