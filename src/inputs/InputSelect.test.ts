import { test, expect, describe } from 'vitest'
import { Gooey } from '../Gooey'

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

// import { describe, expect, it, beforeEach, test } from 'vitest'
// import { isState, state } from '../shared/state'
// import { Gooey } from '../Gooey'

// // cases to test:
// // for both bound and unbound, test:
// // Raw Value | State<Raw Value> | LabeledOption<Raw Value> | State<LabeledOption<Raw Value>>

// const gooey = new Gooey()

// const RAW_VALUE = 1
// const RAW_OPTIONS = [RAW_VALUE, 2]

// const LABELED_VALUE = { label: '1', value: RAW_VALUE }
// const LABELED_OPTIONS = [LABELED_VALUE, { label: '2', value: 2 }]

// const DEFS = {
// 	RAW_RAW: {
// 		value: RAW_VALUE,
// 		options: RAW_OPTIONS,
// 	},
// 	RAW_LABELED: {
// 		value: RAW_VALUE,
// 		options: LABELED_OPTIONS,
// 	},
// 	LABELED_RAW: {
// 		value: LABELED_VALUE,
// 		options: RAW_OPTIONS,
// 	},
// 	LABELED_LABELED: {
// 		value: LABELED_VALUE,
// 		options: LABELED_OPTIONS,
// 	},
// 	StateRAW_RAW: {
// 		value: state(RAW_VALUE),
// 		options: RAW_OPTIONS,
// 	},
// 	StateRAW_LABELED: {
// 		value: state(RAW_VALUE),
// 		options: LABELED_OPTIONS,
// 	},
// 	StateLABELED_RAW: {
// 		value: state(LABELED_VALUE),
// 		options: RAW_OPTIONS,
// 	},
// 	StateLABELED_LABELED: {
// 		value: state(LABELED_VALUE),
// 		options: LABELED_OPTIONS,
// 	},
// 	RAW_StateRAW: {
// 		value: RAW_VALUE,
// 		options: RAW_OPTIONS,
// 	},
// 	RAW_StateLABELED: {
// 		value: RAW_VALUE,
// 		options: LABELED_OPTIONS,
// 	},
// 	LABELED_StateRAW: {
// 		value: LABELED_VALUE,
// 		options: RAW_OPTIONS,
// 	},
// 	LABELED_StateLABELED: {
// 		value: LABELED_VALUE,
// 		options: LABELED_OPTIONS,
// 	},
// 	StateRAW_StateRAW: {
// 		value: state(RAW_VALUE),
// 		options: RAW_OPTIONS,
// 	},
// 	StateRAW_StateLABELED: {
// 		value: state(RAW_VALUE),
// 		options: LABELED_OPTIONS,
// 	},
// 	StateLABELED_StateRAW: {
// 		value: state(LABELED_VALUE),
// 		options: RAW_OPTIONS,
// 	},
// 	StateLABELED_StateLABELED: {
// 		value: state(LABELED_VALUE),
// 		options: LABELED_OPTIONS,
// 	},
// } as const

// // function valueFormat(value: any) {
// // 	return value === RAW_VALUE ? 'raw' : 'labeled'
// // }

// function testDef(key: keyof typeof DEFS) {
// 	describe(key, () => {
// 		const def = DEFS[key]
// 		const { value, options } = def

// 		if ('error' in def) {
// 			it('should throw an error', () => {
// 				expect(() => {
// 					gooey.addSelect({ value, options })
// 				}).toThrow()
// 			})
// 			return
// 		}

// 		const select = gooey.addSelect({ value, options })

// 		const v = isState(value) ? value.value : value

// 		it('should have the correct `valueFormat`', () => {
// 			expect(select.valueFormat).toStrictEqual(v === RAW_VALUE ? 'raw' : 'labeled')
// 		})

// 		it('should have the correct `initialValue`', () => {
// 			expect(select.initialValue).toStrictEqual(v)
// 		})

// 		it('should have the correct `state.value`', () => {
// 			expect(select.state.value).toStrictEqual(v)
// 		})

// 		it('should have the correct `labeledSelection`', () => {
// 			expect(select.labeledSelection).toStrictEqual(LABELED_VALUE)
// 		})

// 		it('should have the correct `options`', () => {
// 			expect(JSON.stringify(select.options)).toStrictEqual(JSON.stringify(options))
// 		})

// 		it('should have the correct `value` after a new selection', () => {
// 			select.set
// 		})
// 	})
// }

// describe('InputSelect', () => {
// 	for (const key in DEFS) {
// 		testDef(key as keyof typeof DEFS)
// 	}

// 	it("should use opts.binding.initial if opts.value isn't provided", () => {
// 		const params = {
// 			foo: {
// 				bar: 'baz',
// 			},
// 		}

// 		const select = gooey.addSelect({
// 			options: ['baz', 'qux'],
// 			binding: {
// 				target: params.foo,
// 				key: 'bar',
// 			},
// 		})

// 		console.log(select.options)

// 		expect(select.state.value).toStrictEqual('baz')
// 	})

// 	it("should use opts.binding.initial if opts.value isn't provided", () => {
// 		const params = {
// 			a: {
// 				b: 0,
// 			},
// 		}

// 		const select = gooey.addSelect({
// 			options: [
// 				{ label: 'baz', value: 1 },
// 				{ label: 'qux', value: 2 },
// 			],
// 			binding: {
// 				target: params.a,
// 				key: 'b',
// 				initial: { label: 'foo', value: 0 },
// 			},
// 		})

// 		console.log(select.options)

// 		// select.set({ label: 'baz', value: 1 })

// 		expect(select.state.value).toStrictEqual(1)
// 	})
// })
