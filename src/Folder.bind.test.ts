import type { ButtonGridArrays } from './inputs/InputButtonGrid'
import type { HexString } from './shared/color/types/strings'

import { describe, expect, expectTypeOf, test } from 'vitest'

import { InputButtonGrid } from './inputs/InputButtonGrid'
import { InputButton } from './inputs/InputButton'
import { InputSelect } from './inputs/InputSelect'
import { InputSwitch } from './inputs/InputSwitch'
import { InputNumber } from './inputs/InputNumber'
import { InputArray } from './inputs/InputArray'
import { InputColor } from './inputs/InputColor'
import { InputText } from './inputs/InputText'
import { Gooey } from './Gooey'

const gooey = new Gooey({ title: 'bind', storage: false })

describe('bind() on a string field says what runtime builds', () => {
	test('a color-typed string field is an InputColor', () => {
		const target: { bg: HexString; fg: '#00ff00' } = { bg: '#ff0000', fg: '#00ff00' }

		const bg = gooey.bind(target, 'bg')
		const fg = gooey.bind(target, 'fg')

		expectTypeOf(bg).toEqualTypeOf<InputColor>()
		expectTypeOf(fg).toEqualTypeOf<InputColor>()
		expect(bg).toBeInstanceOf(InputColor)
		expect(fg).toBeInstanceOf(InputColor)
	})

	test('a plain string field holding a color is typed as either, and is an InputColor', () => {
		const target = { bg: '#ff0000' }

		const input = gooey.bind(target, 'bg')

		expectTypeOf(input).toEqualTypeOf<InputText | InputColor>()
		expect(input).toBeInstanceOf(InputColor)
	})

	test('a plain string field holding text is typed as either, and is an InputText', () => {
		const target = { name: 'gooey' }

		const input = gooey.bind(target, 'name')

		expectTypeOf(input).toEqualTypeOf<InputText | InputColor>()
		expect(input).toBeInstanceOf(InputText)
	})

	test('a text literal field is an InputText', () => {
		const target: { mode: 'light' | 'dark' } = { mode: 'light' }

		expectTypeOf(gooey.bind(target, 'mode')).toEqualTypeOf<InputText>()
	})

	test('add() on a plain string is typed as either, a literal by its shape', () => {
		const loose: string = '#ff0000'

		expectTypeOf(gooey.add('loose', loose)).toEqualTypeOf<InputText | InputColor>()
		expectTypeOf(gooey.add('hex', '#ff0000')).toEqualTypeOf<InputColor>()
		expectTypeOf(gooey.add('text', 'gooey')).toEqualTypeOf<InputText>()
		expect(gooey.add('loose', loose)).toBeInstanceOf(InputColor)
	})
})

describe('bind* siblings accept only the field type they bind', () => {
	const target = {
		count: 5,
		on: true,
		name: 'gooey',
		items: ['a', 'b'],
		click: () => {},
		grid: [[{ text: 'a', onClick: () => {} }]] as ButtonGridArrays,
		mode: 'light' as 'light' | 'dark',
	}

	test('each binds its own field type with no cast, and returns its input', () => {
		expectTypeOf(gooey.bindNumber(target, 'count')).toEqualTypeOf<InputNumber>()
		expectTypeOf(gooey.bindSwitch(target, 'on')).toEqualTypeOf<InputSwitch>()
		expectTypeOf(gooey.bindText(target, 'name')).toEqualTypeOf<InputText>()
		expectTypeOf(gooey.bindArray(target, 'items')).toEqualTypeOf<InputArray<string>>()
		expectTypeOf(gooey.bindButton(target, 'click')).toEqualTypeOf<InputButton>()
		expectTypeOf(gooey.bindButtonGrid(target, 'grid')).toEqualTypeOf<InputButtonGrid>()
		expectTypeOf(
			gooey.bindSelect(target, 'mode', { options: ['light', 'dark'] }),
		).toEqualTypeOf<InputSelect<'light' | 'dark'>>()
	})

	test('a field of another type is a type error', () => {
		// @ts-expect-error - a string is not a number
		expectTypeOf(() => gooey.bindNumber(target, 'name')).toBeFunction()
		// @ts-expect-error - a number is not a boolean
		expectTypeOf(() => gooey.bindSwitch(target, 'count')).toBeFunction()
		// @ts-expect-error - a number is not a string
		expectTypeOf(() => gooey.bindText(target, 'count')).toBeFunction()
		// @ts-expect-error - a string is not an array
		expectTypeOf(() => gooey.bindArray(target, 'name')).toBeFunction()
		// @ts-expect-error - a string is not a function
		expectTypeOf(() => gooey.bindButton(target, 'name')).toBeFunction()
		// @ts-expect-error - a string array is not a button grid
		expectTypeOf(() => gooey.bindButtonGrid(target, 'items')).toBeFunction()
		// @ts-expect-error - an option outside the field's type
		expectTypeOf(() => gooey.bindSelect(target, 'mode', { options: ['blue'] })).toBeFunction()
	})
})
