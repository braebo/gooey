import type { InputColor } from './InputColor'

import { describe, expect, expectTypeOf, test } from 'vitest'

import { Color, isColor } from '../shared/color/color'
import { Gooey } from '../Gooey'

const gooey = new Gooey({ title: 'InputColor', storage: false })

describe('a bound field keeps the format it started in', () => {
	test('#rrggbb', () => {
		const target = { color: '#0000FF' }
		gooey.bindColor(target, 'color').set('#ff0000')
		expect(target.color).toBe('#ff0000')
	})

	test('#rrggbbaa', () => {
		const target = { color: '#0000ffcc' }
		gooey.bindColor(target, 'color').set('#ff0000cc')
		expect(target.color).toBe('#ff0000cc')
	})

	test('#rgb', () => {
		const target = { color: '#00f' }
		gooey.bindColor(target, 'color').set('#ff0000')
		expect(target.color).toBe('#f00')
	})

	test('#rgba', () => {
		const target = { color: '#00f8' }
		gooey.bindColor(target, 'color').set('#ff0000')
		expect(target.color).toBe('#f00f')
	})

	test('rgb()', () => {
		const target = { color: 'rgb(0, 0, 255)' }
		gooey.bindColor(target, 'color').set('#ff0000')
		expect(target.color).toBe('rgb(255, 0, 0)')
	})

	test('rgba()', () => {
		const target = { color: 'rgba(0, 0, 255, 0.5)' }
		gooey.bindColor(target, 'color').set('rgba(255, 0, 0, 0.5)')
		expect(target.color).toBe('rgba(255, 0, 0, 0.5)')
	})

	test('hsl()', () => {
		const target = { color: 'hsl(240, 100%, 50%)' }
		const input = gooey.bindColor(target, 'color')
		expect(input.state.value.hexString).toBe('#0000ff')

		input.set('#ff0000')
		expect(target.color).toBe('hsl(0, 100%, 50%)')
	})

	test('hsla()', () => {
		const target = { color: 'hsla(240, 100%, 50%, 0.5)' }
		gooey.bindColor(target, 'color').set('rgba(255, 0, 0, 0.5)')
		expect(target.color).toBe('hsla(0, 100%, 50%, 0.5)')
	})

	test('{ r, g, b }', () => {
		const target = { color: { r: 0, g: 0, b: 255 } }
		gooey.bindColor(target, 'color').set('#ff0000')
		expect(target.color).toEqual({ r: 255, g: 0, b: 0 })
	})

	test('{ r, g, b, a }', () => {
		const target = { color: { r: 0, g: 0, b: 255, a: 0.5 } }
		gooey.bindColor(target, 'color').set('rgba(255, 0, 0, 0.5)')
		expect(target.color).toEqual({ r: 255, g: 0, b: 0, a: 0.5 })
	})

	test('{ h, s, l }', () => {
		const target = { color: { h: 240, s: 100, l: 50 } }
		gooey.bindColor(target, 'color').set('#ff0000')
		expect(target.color).toEqual({ h: 0, s: 100, l: 50 })
	})

	test('{ h, s, l, a }', () => {
		const target = { color: { h: 240, s: 100, l: 50, a: 0.5 } }
		gooey.bindColor(target, 'color').set('rgba(255, 0, 0, 0.5)')
		expect(target.color).toEqual({ h: 0, s: 100, l: 50, a: 0.5 })
	})

	test('{ h, s, v }', () => {
		const target = { color: { h: 240, s: 100, v: 100 } }
		gooey.bindColor(target, 'color').set('#ff0000')
		expect(target.color).toEqual({ h: 0, s: 100, v: 100 })
	})

	test('{ h, s, v, a }', () => {
		const target = { color: { h: 240, s: 100, v: 100, a: 0.5 } }
		gooey.bindColor(target, 'color').set('rgba(255, 0, 0, 0.5)')
		expect(target.color).toEqual({ h: 0, s: 100, v: 100, a: 0.5 })
	})

	test('{ kelvin } holds the nearest kelvin', () => {
		const target = { color: { kelvin: 6500 } }
		gooey.bindColor(target, 'color').set('#ffb46b')
		expect(target.color).toEqual({ kelvin: new Color('#ffb46b').kelvin })
	})

	test('a Color stays a Color', () => {
		const target = { color: new Color('#0000ff') }
		gooey.bindColor(target, 'color').set('#ff0000')
		expect(isColor(target.color)).toBe(true)
		expect(target.color.hexString).toBe('#ff0000')
	})
})

describe('the input owns the color; the field is its projection', () => {
	test('alpha set through the picker holds on a field that has no alpha', () => {
		const target = { color: '#0000FF' }
		const input = gooey.bindColor(target, 'color')

		const slider = input.picker.elements.alphaSlider
		slider.value = '0.5'
		slider.dispatchEvent(new Event('input'))
		input.refresh()

		expect(input.state.value.alpha).toBe(0.5)
		expect(target.color).toBe('#0000ff')
	})

	test('an outside write to the field lands on refresh', () => {
		const target = { color: '#0000FF' }
		const input = gooey.bindColor(target, 'color')

		target.color = '#00ff00'
		input.refresh()

		expect(input.state.value.hexString).toBe('#00ff00')
		expect(target.color).toBe('#00ff00')
	})

	test('a preset load writes the field in its own format', () => {
		const target = { color: '#0000FF' }
		const input = gooey.bindColor(target, 'color')

		input.set('#ff0000')
		const preset = input.save()
		input.set('#00ff00')
		input.load(preset)

		expect(target.color).toBe('#ff0000')
	})

	test('reset writes the initial color back in the field format', () => {
		const target = { color: '#0000FF' }
		const input = gooey.bindColor(target, 'color')

		input.set('#ff0000')
		input.elements.resetBtn.click()

		expect(target.color).toBe('#0000ff')
	})

	test('change listeners still receive a Color', () => {
		const target = { color: '#0000FF' }
		const input = gooey.bindColor(target, 'color')

		const received: Color[] = []
		input.on('change', color => received.push(color))
		input.set('#ff0000')

		expect(received.every(isColor)).toBe(true)
		expect(received.at(-1)?.hexString).toBe('#ff0000')
	})
})

describe('bindColor types', () => {
	test('string, color-object, and Color fields bind with no cast, and keep their types', () => {
		const target = {
			hex: '#0000ff',
			rgb: { r: 0, g: 0, b: 255 },
			tint: new Color('#0000ff'),
		}

		expectTypeOf(gooey.bindColor(target, 'hex')).toEqualTypeOf<InputColor>()
		expectTypeOf(gooey.bindColor(target, 'rgb')).toEqualTypeOf<InputColor>()
		expectTypeOf(gooey.bindColor(target, 'tint')).toEqualTypeOf<InputColor>()

		expectTypeOf(target.hex).toEqualTypeOf<string>()
		expectTypeOf(target.rgb).toEqualTypeOf<{ r: number; g: number; b: number }>()
		expectTypeOf(target.tint).toEqualTypeOf<Color>()
	})

	test('a field that is not color-shaped is a type error', () => {
		const target = { count: 5, on: true }

		// @ts-expect-error - a number is not a color
		expectTypeOf(() => gooey.bindColor(target, 'count')).toBeFunction()
		// @ts-expect-error - a boolean is not a color
		expectTypeOf(() => gooey.bindColor(target, 'on')).toBeFunction()
	})
})
