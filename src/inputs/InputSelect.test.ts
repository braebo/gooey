import { test, expect, describe } from 'vitest'
import { Gooey } from '../Gooey'

document.body.style.background = 'black'

const options = [
	{ label: 'foo', value: 'foo' },
	{ label: 'bar', value: 'bar' },
]

test('InputSelect', () => {
	expect('todo').toBe('todo')
})

describe('addSelect', () => {
	const gui = new Gooey()

	test('correctly adds the title', () => {
		const select = gui.addSelect('testing 123', options)
		expect(select.title).toBe('testing 123')
	})

	test('options with initialValue', () => {
		const select = gui.addSelect('foobar', ['foo', 'bar'], { initialValue: 'bar' })
		expect(select.options).toStrictEqual(options)
		expect(select.state.value).toStrictEqual(options[1])
	})

	test('options without initialValue', () => {
		const select = gui.addSelect('select', ['foo', 'bar'])

		expect(select.options).toStrictEqual([
			{ label: 'foo', value: 'foo' },
			{ label: 'bar', value: 'bar' },
		])

		expect(
			select.state.value,
			'Incorrect fallback - expected the option at index 0\n',
		).toStrictEqual(options[0])
	})

	test('all options', () => {
		const select = gui.addSelect('select', options, {
			initialValue: options[1],
		})

		expect(select.options).toStrictEqual(options)
		expect(select.state.value).toStrictEqual(options[1])
	})
})
