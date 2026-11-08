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
import { Color } from './shared/color/color'
import { Folder } from './Folder'
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

	test('addMany() types an inline string by its literal, like add()', () => {
		const { inputs } = gooey.addMany({
			bg: '#ff0000',
			name: 'gooey',
			nested: { fg: '#00ff00' },
		})

		expectTypeOf(inputs.bg).toEqualTypeOf<InputColor>()
		expectTypeOf(inputs.name).toEqualTypeOf<InputText>()
		expectTypeOf(inputs.nested.fg).toEqualTypeOf<InputColor>()
		expect(inputs.bg).toBeInstanceOf(InputColor)
		expect(inputs.name).toBeInstanceOf(InputText)
		expect(inputs.nested.fg).toBeInstanceOf(InputColor)
	})

	test("the README's addMany() example, as written", () => {
		const { inputs, folders } = gooey.addMany({
			myNumber: 5,
			myFolder: {
				myColor: '#4aa7ff',
			},
		})

		expectTypeOf(inputs.myNumber).toEqualTypeOf<InputNumber>()
		expectTypeOf(inputs.myFolder.myColor).toEqualTypeOf<InputColor>()
		expectTypeOf(folders.myFolder.folder).toEqualTypeOf<Folder>()
		expect(inputs.myNumber).toBeInstanceOf(InputNumber)
		expect(inputs.myFolder.myColor).toBeInstanceOf(InputColor)
		expect(folders.myFolder.folder).toBeInstanceOf(Folder)
	})

	test('a nested folder is typed where it is: folders.a.subFolders.b.folder', () => {
		const target = {
			n: 1,
			a: {
				sel: { value: 'x', options: ['x', 'y'] },
				b: { c: 2 },
			},
		}

		for (const { folders } of [gooey.addMany(target), gooey.bindMany(target)]) {
			expectTypeOf(folders.a.folder).toEqualTypeOf<Folder>()
			expectTypeOf(folders.a.subFolders.b.folder).toEqualTypeOf<Folder>()
			expectTypeOf(folders.a.subFolders.b.subFolders).toEqualTypeOf<{}>()
			expect(folders.a.folder).toBeInstanceOf(Folder)
			expect(folders.a.subFolders.b.folder).toBeInstanceOf(Folder)
			expect(folders.a.subFolders.b.folder.title).toBe('b')
			expect(Object.keys(folders)).toEqual(['a'])
			expect(Object.keys(folders.a.subFolders)).toEqual(['b'])
		}
	})

	test('only a field that makes a folder is in folders', () => {
		const { folders } = gooey.addMany({
			n: 1,
			on: true,
			text: 'gooey',
			color: '#ff0000',
			list: [1, 2],
			sel: { value: 'x', options: ['x', 'y'] },
			click: () => {},
			f: { n: 2 },
		})

		expectTypeOf(folders).toEqualTypeOf<{ f: { folder: Folder; subFolders: {} } }>()
		expect(Object.keys(folders)).toEqual(['f'])
	})

	test("a nested folder's inputs hold its inputs only; its Folder is in folders", () => {
		const { inputs, folders } = gooey.addMany({ a: { n: 1 } })

		expectTypeOf(inputs.a).toEqualTypeOf<{ n: InputNumber }>()
		expect(Object.keys(inputs.a)).toEqual(['n'])
		expect(folders.a.folder).toBeInstanceOf(Folder)
	})

	test('a Color is a color input, and a plain { r, g, b } is a folder of numbers', () => {
		const { inputs, folders } = gooey.addMany({
			c: new Color('#ff0000'),
			rgb: { r: 255, g: 0, b: 0 },
		})

		expectTypeOf(inputs.c).toEqualTypeOf<InputColor>()
		expectTypeOf(inputs.rgb.r).toEqualTypeOf<InputNumber>()
		expectTypeOf(folders).toEqualTypeOf<{ rgb: { folder: Folder; subFolders: {} } }>()
		expect(inputs.c).toBeInstanceOf(InputColor)
		expect(inputs.rgb.r).toBeInstanceOf(InputNumber)
		expect(Object.keys(folders)).toEqual(['rgb'])
	})

	test('addMany() on a plain string field is typed as either, like add()', () => {
		const target: { bg: string } = { bg: '#ff0000' }

		const { inputs } = gooey.addMany(target)

		expectTypeOf(inputs.bg).toEqualTypeOf<InputText | InputColor>()
		expect(inputs.bg).toBeInstanceOf(InputColor)
	})

	test('addMany() on a color-typed field is an InputColor', () => {
		const target: { bg: HexString; fg: '#00ff00' } = { bg: '#ff0000', fg: '#00ff00' }

		const { inputs } = gooey.addMany(target)

		expectTypeOf(inputs.bg).toEqualTypeOf<InputColor>()
		expectTypeOf(inputs.fg).toEqualTypeOf<InputColor>()
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

describe('addMany() and bindMany() on inline selects and arrays', () => {
	const inline = () => ({
		sel: { value: 'a', options: ['a', 'b'] },
		lab: {
			value: 1,
			options: [
				{ label: 'one', value: 1 },
				{ label: 'two', value: 2 },
			],
		},
		arr: [1, 2],
	})

	test('an inline select or array is typed by its widened items, like add()', () => {
		const added = gooey.addMany({
			sel: { value: 'a', options: ['a', 'b'] },
			lab: {
				value: 1,
				options: [
					{ label: 'one', value: 1 },
					{ label: 'two', value: 2 },
				],
			},
			arr: [1, 2],
		}).inputs
		const bound = gooey.bindMany({
			sel: { value: 'a', options: ['a', 'b'] },
			lab: {
				value: 1,
				options: [
					{ label: 'one', value: 1 },
					{ label: 'two', value: 2 },
				],
			},
			arr: [1, 2],
		}).inputs

		for (const inputs of [added, bound]) {
			expectTypeOf(inputs.sel).toEqualTypeOf<InputSelect<string>>()
			expectTypeOf(inputs.lab).toEqualTypeOf<InputSelect<number>>()
			expectTypeOf(inputs.arr).toEqualTypeOf<InputArray<number>>()
			expect(inputs.sel).toBeInstanceOf(InputSelect)
			expect(inputs.lab).toBeInstanceOf(InputSelect)
			expect(inputs.arr).toBeInstanceOf(InputArray)
		}
		expect(added.lab.value).toBe(1)
	})

	test('a declared select or array keeps its item type', () => {
		type Mode = 'light' | 'dark'
		const target: { mode: { value: Mode; options: Mode[] }; modes: Mode[] } = {
			mode: { value: 'light', options: ['light', 'dark'] },
			modes: ['light'],
		}

		for (const { inputs } of [gooey.addMany(target), gooey.bindMany(target)]) {
			expectTypeOf(inputs.mode).toEqualTypeOf<InputSelect<Mode>>()
			expectTypeOf(inputs.modes).toEqualTypeOf<InputArray<Mode>>()
		}
	})

	test('a declared readonly select or array keeps its item type too', () => {
		type Mode = 'light' | 'dark'
		type Target = { mode: { value: Mode; options: readonly Mode[] }; modes: readonly Mode[] }

		expectTypeOf(() => gooey.addMany({} as Target).inputs.mode).returns.toEqualTypeOf<
			InputSelect<Mode>
		>()
		expectTypeOf(() => gooey.bindMany({} as Target).inputs.modes).returns.toEqualTypeOf<
			InputArray<Mode>
		>()
	})

	test('an inline select with no options yet is typed by its value', () => {
		expectTypeOf(
			() => gooey.addMany({ sel: { value: 'a', options: [] } }).inputs.sel,
		).returns.toEqualTypeOf<InputSelect<string>>()
	})

	test("bindMany() binds an inline select to its config's value, the value addMany gives", () => {
		const target = inline()
		const { inputs } = gooey.bindMany(target)

		expect(inputs.sel.value).toBe('a')
		expect(inputs.lab.value).toBe(1)
		// Titled by the field, not the `value` key it binds, so each keeps its own presetId.
		expect(inputs.sel.title).toBe('sel')
		expect(inputs.sel.id).not.toBe(inputs.lab.id)

		inputs.sel.value = 'b'
		inputs.lab.value = 2
		expect(target.sel).toEqual({ value: 'b', options: ['a', 'b'] })
		expect(target.lab.value).toBe(2)
		expect(target.lab.options).toHaveLength(2)

		target.sel.value = 'a'
		inputs.sel.refresh()
		expect(inputs.sel.value).toBe('a')
	})

	test('a bare labeled-options array is a select in addMany, and refused by bindMany', () => {
		const labeled = () => ({
			arr: [
				{ label: 'one', value: 1 },
				{ label: 'two', value: 2 },
			],
		})

		const added = gooey.addMany(labeled()).inputs.arr
		expectTypeOf(added).toEqualTypeOf<InputSelect<number>>()
		expect(added.value).toBe(1)

		// There's no field to write the pick to, so a bind would write it over the options.
		// @ts-expect-error - a bare labeled-options array can't be bound
		expectTypeOf(() => gooey.bindMany(labeled())).toBeFunction()
		// @ts-expect-error - nor one in a nested folder
		expectTypeOf(() => gooey.bindMany({ f: labeled() })).toBeFunction()
		const declared: { arr: { label: string; value: number }[] } = labeled()
		// @ts-expect-error - nor a declared one
		expectTypeOf(() => gooey.bindMany(declared)).toBeFunction()

		const target = labeled()
		expect(() => gooey.bindMany(target as any)).toThrow(/labeled options/)
		expect(target.arr).toHaveLength(2)

		// An empty array, a plain array and an inline select still bind.
		const ok = gooey.bindMany({
			empty: [] as number[],
			nums: [1, 2],
			sel: { value: 'a', options: ['a', 'b'] },
		})
		expectTypeOf(ok.inputs.nums).toEqualTypeOf<InputArray<number>>()
		expect(ok.inputs.sel.value).toBe('a')
	})

	test('a key the walk skips lifts the refusal: exclude, or left out of include', () => {
		const labeled = () => ({
			n: 1,
			arr: [
				{ label: 'one', value: 1 },
				{ label: 'two', value: 2 },
			],
		})

		expect(Object.keys(gooey.bindMany(labeled(), { exclude: ['arr'] }).inputs)).toEqual(['n'])
		expect(Object.keys(gooey.bindMany(labeled(), { include: ['n'] }).inputs)).toEqual(['n'])
		expect(gooey.bindMany({ f: labeled() }, { exclude: ['f'] }).inputs).toEqual({})

		// @ts-expect-error - excluding another key leaves the array refused
		expectTypeOf(() => gooey.bindMany(labeled(), { exclude: ['n'] })).toBeFunction()
		// @ts-expect-error - and so does including it
		expectTypeOf(() => gooey.bindMany(labeled(), { include: ['arr'] })).toBeFunction()
		// @ts-expect-error - an exclude still names a key of the target
		expectTypeOf(() => gooey.bindMany({ n: 1 }, { exclude: ['nope'] })).toBeFunction()

		// An index signature's keys can't be listed, so an include there lifts nothing.
		const index: Record<string, { label: string; value: number }[]> = {}
		// @ts-expect-error - include doesn't lift the refusal from an index signature
		expectTypeOf(() => gooey.bindMany(index, { include: ['a'] })).toBeFunction()

		// A type argument given by hand takes the exclude it always did.
		expect(gooey.bindMany<{ n: number }>({ n: 1 }, { exclude: ['n'] }).inputs).toEqual({})
	})

	test('a target bindMany refuses throws before any of it is built', () => {
		const folder = gooey.addFolder('refused')

		const labeled = { n: 1, f: { m: 2 }, arr: [{ label: 'one', value: 1 }] }
		expect(() => folder.bindMany(labeled as any)).toThrow(/labeled options/)
		expect(() => folder.bindMany({ n: 1, f: { m: 2, arr: labeled.arr } } as any)).toThrow(
			/labeled options/,
		)
		expect(() => folder.bindMany({ n: 1, f: { m: 2 }, nothing: null })).toThrow(
			/Invalid binding/,
		)

		expect(folder.inputs.size).toBe(0)
		expect(folder.children).toHaveLength(0)

		// A refused key the walk never reaches doesn't throw.
		expect(Object.keys(folder.bindMany(labeled as any, { maxSize: 2 }).inputs)).toEqual([
			'n',
			'f',
		])
	})

	test('a generic wrapper gets past the type-level refusal with a type argument and a cast', () => {
		function bindAll<V extends { n: number }>(v: { x: V; list: V[] }) {
			return gooey.bindMany<typeof v>(v as any)
		}
		const { inputs } = bindAll({ x: { n: 1 }, list: [{ n: 2 }] })
		expectTypeOf(inputs.list).toEqualTypeOf<InputArray<{ n: number }>>()
		expect(inputs.x.n.value).toBe(1)
	})

	test('an array of { label, value, ...more } is data, an InputArray, and binds', () => {
		const rows = () => ({ rows: [{ label: 'one', value: 1, note: 'x' }] })

		const added = gooey.addMany(rows()).inputs.rows
		expectTypeOf(added).toEqualTypeOf<
			InputArray<{ label: string; value: number; note: string }>
		>()
		expect(added).toBeInstanceOf(InputArray)

		const bound = gooey.bindMany(rows()).inputs.rows
		expect(bound).toBeInstanceOf(InputArray)
	})

	test('an any[] field binds; nothing is known about its items', () => {
		const target = { list: [1, 2] as any[] }
		expect(gooey.bindMany(target).inputs.list).toBeInstanceOf(InputArray)
	})

	test('the options bag takes a mutable options array for an inline select', () => {
		const { inputs } = gooey.addMany(inline(), {
			sel: { __type: 'SelectInputOptions', options: ['a', 'b', 'c'] },
			arr: { title: 'numbers' },
		})

		expectTypeOf(inputs.sel).toEqualTypeOf<InputSelect<string>>()
		expect(inputs.sel).toBeInstanceOf(InputSelect)
	})
})
