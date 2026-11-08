import { GooeyTest } from '../tests/Gooey/GooeyTest'
import { test, expect, expectTypeOf, describe } from 'vitest'
import type { InputSelect } from './InputSelect'

const g = new GooeyTest()

const options = [
	{ label: 'foo', value: 'foo' },
	{ label: 'bar', value: 'bar' },
]

test('InputSelect', () => {
	expect('todo').toBe('todo')
})

describe('addSelect', () => {
	const gui = g.addGooey()

	test('correctly adds the title', () => {
		const select = gui.addSelect('testing 123', { value: 'foo', options })
		expect(select.title).toBe('testing 123')
	})

	test('options with value', () => {
		const select = gui.addSelect('foobar', 'bar', { options: ['foo', 'bar'] })
		expect(select.options).toStrictEqual(options)
		expect(select.value).toBe('bar')
		expect(select.selected.value).toStrictEqual(options[1])
	})

	test('inline value+options object', () => {
		const select = gui.addSelect('select', { value: 'foo', options: ['foo', 'bar'] })

		expect(select.options).toStrictEqual([
			{ label: 'foo', value: 'foo' },
			{ label: 'bar', value: 'bar' },
		])

		expect(select.value, 'Incorrect value\n').toBe('foo')
		expect(select.selected.value, 'Incorrect selected option\n').toStrictEqual(options[0])
	})

	test('labeled options', () => {
		const select = gui.addSelect('select', {
			value: options[1].value,
			options,
		})

		expect(select.options).toStrictEqual(options)
		expect(select.value).toBe('bar')
		expect(select.selected.value).toStrictEqual(options[1])
	})

	test('infers InputSelect<string> for a string literal options array', () => {
		const sel1 = gui.addSelect('sel1', 'foo', { options: ['foo', 'bar', 'baz'] })
		const sel3 = gui.addSelect('sel3', { value: 'a', options: ['a', 'b', 'c'] })

		expectTypeOf(sel1).toEqualTypeOf<InputSelect<string>>()
		expectTypeOf(sel3).toEqualTypeOf<InputSelect<string>>()
	})
})

describe('bindSelect', () => {
	const gui = g.addGooey()

	test('correctly binds the title', () => {
		const target = { theme: 'foo' }
		const select = gui.bindSelect(target, 'theme', { options: ['foo', 'bar'] })
		expect(select.title).toBe('theme')
	})
})

describe('add', () => {
	const gui = g.addGooey()

	test('value + options config pattern', () => {
		const input = gui.add('select1', 'foo', { options: ['foo', 'bar', 'baz'] })
		expect(input.__type).toStrictEqual('InputSelect')
		expect(input.value).toBe('foo')
	})

	test('value + labeled options config pattern', () => {
		const input = gui.add('select2', 1, {
			options: [
				{ label: 'One', value: 1 },
				{ label: 'Two', value: 2 },
			],
		})
		expect(input.__type).toStrictEqual('InputSelect')
		expect(input.value).toBe(1)
	})

	test('inline value+options object pattern', () => {
		const input = gui.add('select3', { value: 'bar', options: ['foo', 'bar', 'baz'] })
		expect(input.__type).toStrictEqual('InputSelect')
		expect(input.value).toBe('bar')
	})

	test('inline labeled options pattern', () => {
		const input = gui.add('select4', {
			value: 2,
			options: [
				{ label: 'One', value: 1 },
				{ label: 'Two', value: 2 },
			],
		})
		expect(input.__type).toStrictEqual('InputSelect')
		expect(input.value).toBe(2)
	})
})

describe('addMany', () => {
	const gui = g.addGooey()

	test('from labeled option', () => {
		gui.addMany(
			{
				labeledSelect: {
					value: 1,
					options: [
						{ label: 'first', value: 1 },
						{ label: 'second', value: 2 },
						{ label: 'third', value: 3 },
					],
				},
			},
			/** This should not be necessary to generate an InputSelect, but it's useful to ensure
			    that the Input and InputOptions are correctly inferred by `addMany`. */
			{
				labeledSelect: {
					__type: 'SelectInputOptions',
				},
			},
		)

		const input = gui.inputs.get('labeledSelect')! as any
		expect(input.__type).toBe('InputSelect')
		expect(input.value).toBe(1)
		expect(input.selected.value).toMatchObject({ label: 'first', value: 1 })
	})

	test('from unlabeled string array', () => {
		gui.addMany(
			{
				stringSelect: {
					value: 'foo',
					options: ['foo', 'bar', 'baz'],
				},
			},
			/** This should not be necessary to generate an InputSelect, but it's useful to ensure
			    that the Input and InputOptions are correctly inferred by `addMany`. */
			{
				stringSelect: {
					__type: 'SelectInputOptions',
				},
			},
		)
		const input = gui.inputs.get('stringSelect')! as any
		expect(input.__type).toBe('InputSelect')
		expect(input.value).toBe('foo')
		expect(input.selected.value).toMatchObject({ label: 'foo', value: 'foo' })
	})
})

describe('events', () => {
	const gui = g.addGooey()

	/** Records every menu event the input emits, in order, with its payload. */
	function record(select: InputSelect<string>) {
		const heard: [string, unknown][] = []
		for (const event of ['open', 'close', 'cancel', 'preview'] as const) {
			select.on(event, (v: unknown) => heard.push([event, v]))
		}
		return heard
	}

	function option(select: InputSelect<string>, label: string): HTMLElement {
		for (const [, { option, element }] of select.selectController.optionMap)
			if (option.label === label) return element
		throw new Error(`no option labeled ${label}`)
	}

	test('opening, hovering and picking emit open, preview and close', () => {
		const select = gui.addSelect('picked', { value: 'foo', options: ['foo', 'bar', 'baz'] })
		const heard = record(select)

		select.selectController.elements.selected.click()
		option(select, 'bar').dispatchEvent(new MouseEvent('mouseenter'))
		option(select, 'baz').click()

		expect(heard).toEqual([
			['open', undefined],
			['preview', { label: 'bar', value: 'bar' }],
			['close', undefined],
		])
		expect(select.value).toBe('baz')
	})

	test('escape cancels: close, then cancel, and the value is what the menu opened over', () => {
		const select = gui.addSelect('cancelled', { value: 'foo', options: ['foo', 'bar'] })
		const heard = record(select)

		select.selectController.elements.selected.click()
		option(select, 'bar').dispatchEvent(new MouseEvent('mouseenter'))
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

		expect(heard.map(([event]) => event)).toEqual(['open', 'preview', 'close', 'cancel'])
		expect(select.value).toBe('foo')
	})

	test('a click outside or on the menu itself cancels the way escape does', () => {
		const select = gui.addSelect('dismissed', { value: 'foo', options: ['foo', 'bar'] })
		const heard = record(select)

		select.selectController.elements.selected.click()
		option(select, 'bar').dispatchEvent(new MouseEvent('mouseenter'))
		document.body.click()

		expect(heard.map(([event]) => event)).toEqual(['open', 'preview', 'close', 'cancel'])
		expect(select.value).toBe('foo')

		heard.length = 0
		select.selectController.elements.selected.click()
		option(select, 'bar').dispatchEvent(new MouseEvent('mouseenter'))
		select.selectController.elements.selected.click()

		expect(heard.map(([event]) => event)).toEqual(['open', 'preview', 'close', 'cancel'])
		expect(select.value).toBe('foo')
	})
})

describe('a bound select after an outside write', () => {
	const gui = g.addGooey()

	test('refresh() moves value, selected and the menu to what the target holds, silently', () => {
		const target = { mode: 'a' }
		const select = gui.bindSelect(target, 'mode', { options: ['a', 'b', 'c'] })
		const changes: unknown[] = []
		select.on('change', v => changes.push(v))

		select.value = 'c'
		expect(target.mode).toBe('c')
		changes.length = 0

		target.mode = 'b'
		select.refresh()

		expect(select.value).toBe('b')
		expect(select.selected.value).toStrictEqual({ label: 'b', value: 'b' })
		expect(select.selectController.selected).toStrictEqual({ label: 'b', value: 'b' })
		expect(select.selectController.elements.selected.innerHTML).toBe('b')
		expect(target.mode).toBe('b')
		expect(changes).toEqual([])
	})

	test('a pick after the refresh writes the target as before', () => {
		const target = { mode: 'a' }
		const select = gui.bindSelect(target, 'mode', { options: ['a', 'b', 'c'] })

		target.mode = 'b'
		select.refresh()
		select.value = 'c'

		expect(target.mode).toBe('c')
		expect(select.selectController.selected.label).toBe('c')
	})
})

describe('undo', () => {
	const gui = g.addGooey()
	const um = gui._undoManager

	function option(select: InputSelect<string>, label: string): HTMLElement {
		for (const [, { option, element }] of select.selectController.optionMap)
			if (option.label === label) return element
		throw new Error(`no option labeled ${label}`)
	}

	/** Opens the menu, hovers each of `hovers`, then clicks `pick`, the way a person does. */
	async function pick(select: InputSelect<string>, pick: string, ...hovers: string[]) {
		select.selectController.elements.selected.click()
		for (const label of hovers)
			option(select, label).dispatchEvent(new MouseEvent('mouseenter'))
		option(select, pick).click()
		// The pick is committed a microtask after the menu closes.
		await Promise.resolve()
	}

	test('a pick in the menu is one undo step, however many options it hovered', async () => {
		um.clear()
		const target = { mode: 'a' }
		const select = gui.bindSelect(target, 'mode', { options: ['a', 'b', 'c'] })

		await pick(select, 'c', 'b', 'c')
		expect(um.stack).toHaveLength(1)

		um.undo()
		expect(select.value).toBe('a')
		expect(target.mode).toBe('a')
		expect(select.selectController.selected.label).toBe('a')

		um.redo()
		expect(select.value).toBe('c')
		expect(target.mode).toBe('c')
	})

	test('a cancelled menu records nothing', async () => {
		um.clear()
		const select = gui.addSelect('cancel-undo', { value: 'a', options: ['a', 'b'] })

		select.selectController.elements.selected.click()
		option(select, 'b').dispatchEvent(new MouseEvent('mouseenter'))
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
		await Promise.resolve()

		expect(select.value).toBe('a')
		expect(um.stack).toHaveLength(0)
	})

	test("the panel's theme picker records nothing, like the mode buttons beside it", () => {
		um.clear()
		const theme = [...gui.folder.allInputs.values()].find(
			i => i.__type === 'InputSelect' && i.title === 'theme',
		) as InputSelect<any>
		expect(theme).toBeDefined()

		const other = theme.options.find(o => o.label !== theme.selected.value.label)!
		theme.set(other.value)
		expect(theme.selected.value.label).toBe(other.label)
		expect(um.stack).toHaveLength(0)
	})

	test('set() from code is an undo step, like the other inputs; a refresh is not', () => {
		um.clear()
		const target = { mode: 'a' }
		const select = gui.bindSelect(target, 'mode', { options: ['a', 'b', 'c'] })

		select.set('b')
		target.mode = 'c'
		select.refresh()
		expect(um.stack.map(c => [c.from, c.to])).toEqual([['a', 'b']])

		um.undo()
		expect(select.value).toBe('a')
		expect(target.mode).toBe('a')
	})
})
