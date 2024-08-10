import { describe, expect, test } from 'vitest'

import { Gooey } from '../Gooey'

document.body.style.background = 'black'

describe('InputButtonGrid', () => {
	const gooey = new Gooey({
		title: 'test',
		themeMode: 'system',
		position: 'top-center',
		storage: false,
	})

	test('addButtonGrid', () => {
		gooey.addButtonGrid(
			'addButtonGrid',
			[
				[
					{
						text: 'foo',
						onClick: v => {
							console.log('foo', v)
						},
					},
					{
						text: 'bar',
						onClick: v => {
							console.log('bar', v)
						},
					},
					{
						text: 'baz',
						onClick: v => {
							console.log('baz', v)
						},
					},
				],
			],
			{
				applyActiveClass: true,
			},
		)
	})

	test('id collisions', () => {
		const grid = gooey.addButtonGrid(
			'id collisions',
			[
				[
					{
						text: 'foo',
						onClick: console.log,
					},
					{
						text: 'foo',
						onClick: console.log,
					},
				],
			],
			{
				applyActiveClass: true,
			},
		)

		const [, b] = grid.buttons.values()
		expect(b.id).toBe('foo1')

		const foo = grid.buttons.get('foo')
		expect(foo).toBeDefined()

		const foo1 = grid.buttons.get('foo1')
		expect(foo1).toBeDefined()

		const foo2 = grid.buttons.get('foo2')
		expect(foo2).toBeDefined()

		const foo3 = grid.buttons.get('foo3')
		expect(foo3).toBeUndefined()
	})

	test('multiple', () => {
		gooey.addButtonGrid(
			'multiple',
			[
				[
					{
						text: 'activate me',
						onClick: v => {
							console.log(v.button.id)
							console.log(v)
						},
					},
					{
						text: 'and me too',
						onClick: v => {
							console.log(v.button.id)
							console.log(v)
						},
					},
				],
			],
			{
				applyActiveClass: true,
				multiple: true,
			},
		)
	})
})
