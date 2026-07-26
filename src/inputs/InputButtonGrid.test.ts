import type { ButtonGridArrays } from './InputButtonGrid'

import { describe, expect, test } from 'vitest'
import { Gooey } from '../Gooey'

document.body.style.background = 'black'

const BUTTONS = [
	[
		{
			text: 'foo 0',
			onClick: ({ button }: { button: any }) => {
				const [text, count] = button.id.split(' ')
				button.text = `${text} ${Number(count) + 1}`
			},
		},
		{
			text: 'bar',
			onClick: (v: any) => {
				console.log('bar', v)
			},
		},
	],
] as const satisfies ButtonGridArrays

describe('InputButtonGrid', () => {
	const gooey = new Gooey({
		title: 'test',
		themeMode: 'system',
		position: 'top-center',
		storage: false,
	})

	test('addButtonGrid', () => {
		gooey.addButtonGrid('addButtonGrid', BUTTONS, {
			applyActiveClass: true,
		})
	})

	test('id collisions', () => {
		const grid = gooey.addButtonGrid('id collisions', [
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
		])

		const [, b] = grid.buttons.values()
		expect(b.id).toBe('foo1')

		// TODO Make `buttons.get()` typesafe.
		const foo = grid.buttons.get('foo')
		expect(foo).toBeDefined()

		const foo1 = grid.buttons.get('foo1')
		expect(foo1).toBeDefined()

		const foo2 = grid.buttons.get('foo2')
		expect(foo2).toBeUndefined()
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
