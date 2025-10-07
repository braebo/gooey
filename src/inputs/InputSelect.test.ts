import { GooeyTest } from '../tests/Gooey/GooeyTest'
import { test, expect, describe } from 'vitest'

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
