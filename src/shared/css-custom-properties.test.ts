import type { DestructuredVars } from './css-custom-properties'
import type { GooeyCoreVars } from '../styles/GOOEY_VARS'

import { describe, expect, expectTypeOf, test } from 'vitest'

import { GUI_VARS, VAR_PREFIX } from '../styles/GOOEY_VARS'
import { destructureVars } from './css-custom-properties'

describe('destructureVars names its keys the way it builds them', () => {
	const vars = { a: '1', b: { c: '2', d: { e: '3' } } } as const

	test('a nested key joins with `-`, the leaf with `_`, and a top-level leaf is its key', () => {
		const flat = destructureVars(vars, 'gooey')

		expect(flat).toEqual({ a: '1', b_c: '2', 'b-d_e': '3' })
		expectTypeOf(flat).toEqualTypeOf<Record<'a' | 'b_c' | 'b-d_e', string>>()
	})

	test('DestructuredVars is the same names as CSS variables', () => {
		expectTypeOf<keyof DestructuredVars<typeof vars, 'gooey'>>().toEqualTypeOf<
			'--gooey-a' | '--gooey-b_c' | '--gooey-b-d_e'
		>()
	})
})

describe('GooeyCoreVars tracks the names the themer writes', () => {
	const names = Object.values(GUI_VARS['core']).flatMap(mode =>
		Object.keys(mode ?? {}).map(k => `--${VAR_PREFIX}-${k}`),
	)

	test('a core variable is one of its keys, and an arbitrary string is not', () => {
		expect(names).toContain('--gooey-root_opacity')
		expect(names).toContain('--gooey-controller-dim_color')

		expectTypeOf<'--gooey-root_opacity'>().toExtend<keyof GooeyCoreVars>()
		expectTypeOf<'--gooey-controller-dim_color'>().toExtend<keyof GooeyCoreVars>()
		expectTypeOf<'--gooey-base-root_opacity'>().not.toExtend<keyof GooeyCoreVars>()
		expectTypeOf<string>().not.toExtend<keyof GooeyCoreVars>()
	})
})
