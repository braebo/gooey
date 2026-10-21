import type { BezierValue } from './InputBezier'

import { describe, expect, test } from 'vitest'

import { InputBezier, bezierToString, toBezier } from './InputBezier'
import { cubicBezier } from '../shared/cubicBezier'
import { Gooey } from '../Gooey'

const gooey = new Gooey({ title: 'InputBezier', storage: false })

/** Fires a pointer event at a control point's center, offset by `dx`/`dy` pixels. */
function pointer(target: Element, type: string, at: Element, dx = 0, dy = 0, shiftKey = false) {
	const r = at.getBoundingClientRect()
	target.dispatchEvent(
		new PointerEvent(type, {
			bubbles: true,
			button: 0,
			pointerId: 1,
			clientX: r.left + r.width / 2 + dx,
			clientY: r.top + r.height / 2 + dy,
			shiftKey,
		}),
	)
}

describe('value', () => {
	test('addBezier builds an InputBezier holding [x1, y1, x2, y2]', () => {
		const input = gooey.addBezier('tuple', [0.16, 1, 0.3, 1])
		expect(input).toBeInstanceOf(InputBezier)
		expect(input.value).toEqual([0.16, 1, 0.3, 1])
	})

	test('defaults to ease', () => {
		expect(gooey.addBezier('default').value).toEqual([0.25, 0.1, 0.25, 1])
	})

	test('takes a cubic-bezier() string or a CSS keyword', () => {
		expect(gooey.addBezier('string', 'cubic-bezier(0.4, 0, 0.2, 1)').value).toEqual([
			0.4, 0, 0.2, 1,
		])
		expect(gooey.addBezier('keyword', 'ease-in-out').value).toEqual([0.42, 0, 0.58, 1])

		const input = gooey.addBezier('set string')
		input.set('cubic-bezier(.1, -0.4, .9, 1.4)')
		expect(input.value).toEqual([0.1, -0.4, 0.9, 1.4])
	})

	test('clamps x into 0..1 and leaves y free', () => {
		const input = gooey.addBezier('clamp', [-1, -2, 2, 3])
		expect(input.value).toEqual([0, -2, 1, 3])
	})

	test('rejects what is not a curve', () => {
		const input = gooey.addBezier('invalid')
		expect(() => input.set([1, 2, 3] as any)).toThrow()
		expect(() => input.set('cubic-bezier(1, 2, 3)' as any)).toThrow()
		expect(() => input.set('bounce' as any)).toThrow()
		expect(input.value).toEqual([0.25, 0.1, 0.25, 1])
	})

	test('the array passed in is never the state, nor the default', () => {
		const value: BezierValue = [0.1, 0.2, 0.3, 0.4]
		const input = gooey.addBezier('alias', value)
		value[0] = 0.9
		expect(input.value[0]).toBe(0.1)
		expect(input.initialValue).not.toBe(input.value)

		input.set([0.5, 0.5, 0.5, 0.5])
		expect(input.initialValue).toEqual([0.1, 0.2, 0.3, 0.4])
	})

	test('change listeners receive the curve', () => {
		const input = gooey.addBezier('change')
		const seen: BezierValue[] = []
		input.on('change', v => seen.push(v))
		input.set([0, 0, 1, 1])
		expect(seen).toEqual([[0, 0, 1, 1]])
	})
})

describe('dirty and reset', () => {
	test('equal curves are clean, different ones dirty', () => {
		const input = gooey.addBezier('dirty', [0.25, 0.1, 0.25, 1])
		const btn = input.elements.resetBtn

		input.set([0.42, 0, 1, 1])
		expect(btn.classList.contains('dirty')).toBe(true)

		// A fresh array with the same numbers is the default again.
		input.set([0.25, 0.1, 0.25, 1])
		expect(btn.classList.contains('dirty')).toBe(false)
	})

	test('the reset button restores the default', () => {
		const input = gooey.addBezier('reset', [0.16, 1, 0.3, 1])
		input.set([0, 0, 1, 1])

		input.elements.resetBtn.click()

		expect(input.value).toEqual([0.16, 1, 0.3, 1])
		expect(input.elements.resetBtn.classList.contains('dirty')).toBe(false)
	})
})

describe('binding', () => {
	test('an array field stays an array', () => {
		const target = { ease: [0.4, 0, 0.2, 1] }
		const input = gooey.bindBezier(target, 'ease')
		input.set([0, 0, 1, 1])
		expect(target.ease).toEqual([0, 0, 1, 1])
		expect(target.ease).not.toBe(input.value)
	})

	test('a string field is written back as cubic-bezier()', () => {
		const target = { ease: 'ease-out' }
		const input = gooey.bindBezier(target, 'ease')

		// Untouched until the curve changes.
		expect(target.ease).toBe('ease-out')
		expect(input.value).toEqual([0, 0, 0.58, 1])

		input.set([0.16, 1, 0.3, 1])
		expect(target.ease).toBe('cubic-bezier(0.16, 1, 0.3, 1)')
	})

	test('refresh reads an outside write to the field', () => {
		const target = { ease: [0.4, 0, 0.2, 1] }
		const input = gooey.bindBezier(target, 'ease')

		target.ease = [0.1, 0.2, 0.3, 0.4]
		input.refresh()

		expect(input.value).toEqual([0.1, 0.2, 0.3, 0.4])
		expect(input.elements.controllers.fields.x1.value).toBe('0.1')
	})
})

describe('presets', () => {
	test('a folder preset round-trips the curve', () => {
		const folder = gooey.addFolder('bezier presets')
		const input = folder.addBezier('curve', [0.16, 1, 0.3, 1])

		input.set([0.1, -0.3, 0.9, 1.3])
		const preset = JSON.parse(JSON.stringify(folder.save()))
		expect(preset.inputs[0].value).toEqual([0.1, -0.3, 0.9, 1.3])
		expect(preset.inputs[0].__type).toBe('BezierInputOptions')

		input.set([0, 0, 1, 1])
		folder.load(preset)

		expect(input.value).toEqual([0.1, -0.3, 0.9, 1.3])
	})

	test("a saved preset doesn't move with the input", () => {
		const input = gooey.addBezier('preset alias', [0, 0, 1, 1])
		const preset = input.save()
		input.set([0.5, 0, 0.5, 1])
		expect(preset.value).toEqual([0, 0, 1, 1])
	})
})

describe('controls', () => {
	test('the dropdown sets a named curve and names a set one', () => {
		const input = gooey.addBezier('select')
		const select = input.selectController!

		expect(select.selected.label).toBe('ease')

		select.select(select.options.find(o => o.label === 'out-expo')!)
		expect(input.value).toEqual([0.16, 1, 0.3, 1])

		input.set([0.1, 0.2, 0.3, 0.4])
		expect(select.selected.label).toBe('custom')

		input.set([0.42, 0, 1, 1])
		expect(select.selected.label).toBe('ease-in')
	})

	test('easings: false hides the dropdown', () => {
		const input = gooey.addBezier('no select', undefined, { easings: false })
		expect(input.selectController).toBeUndefined()
		expect(input.elements.controllers.select.hidden).toBe(true)
	})

	test('a number field edits its coordinate', () => {
		const input = gooey.addBezier('fields', [0.25, 0.1, 0.25, 1])
		const y1 = input.elements.controllers.fields.y1

		y1.value = '1.5'
		y1.dispatchEvent(new Event('input'))

		expect(input.value).toEqual([0.25, 1.5, 0.25, 1])
	})

	test('dragging a control point moves it and lands as one undo step', async () => {
		const input = gooey.addBezier('drag', [0.25, 0.25, 0.75, 0.75], { preview: false })
		const { svg, handle1 } = input.elements.controllers.graph
		const undo = input.undoManager!

		// Let the graph lay out at its real size.
		await new Promise(r => requestAnimationFrame(r))
		input.refresh()

		const steps = undo.stack.length

		pointer(svg, 'pointerdown', handle1)
		pointer(svg, 'pointermove', handle1, 10, -10)
		pointer(svg, 'pointermove', handle1, 10, -10)
		pointer(svg, 'pointerup', handle1)

		const [x1, y1, x2, y2] = input.value
		expect(x1).toBeGreaterThan(0.25)
		expect(y1).toBeGreaterThan(0.25)
		expect([x2, y2]).toEqual([0.75, 0.75])
		expect(undo.stack.length).toBe(steps + 1)

		undo.undo()
		expect(input.value).toEqual([0.25, 0.25, 0.75, 0.75])
	})

	test('a press away from both control points does nothing', async () => {
		const input = gooey.addBezier('miss', [0.25, 0.25, 0.75, 0.75], { preview: false })
		const { svg, start } = input.elements.controllers.graph
		await new Promise(r => requestAnimationFrame(r))
		input.refresh()

		const steps = input.undoManager!.stack.length
		pointer(svg, 'pointerdown', start)
		pointer(svg, 'pointermove', start, 20, -20)
		pointer(svg, 'pointerup', start)

		expect(input.value).toEqual([0.25, 0.25, 0.75, 0.75])
		expect(input.undoManager!.stack.length).toBe(steps)
	})

	test('dragging a y past yMax clamps it', async () => {
		const input = gooey.addBezier('clamp drag', [0.25, 0.25, 0.75, 0.75], {
			preview: false,
			yMax: 1.2,
		})
		const { svg, handle1 } = input.elements.controllers.graph
		await new Promise(r => requestAnimationFrame(r))
		input.refresh()

		pointer(svg, 'pointerdown', handle1)
		pointer(svg, 'pointermove', handle1, 0, -5000)
		pointer(svg, 'pointerup', handle1)

		expect(input.value[1]).toBe(1.2)
	})
})

describe('cubicBezier', () => {
	test('linear is the identity', () => {
		const linear = cubicBezier(0, 0, 1, 1)
		for (const t of [0, 0.25, 0.5, 0.9, 1]) expect(linear(t)).toBe(t)
	})

	test('matches CSS ease at the midpoint', () => {
		// Chrome's `ease` at 50% progress.
		expect(cubicBezier(0.25, 0.1, 0.25, 1)(0.5)).toBeCloseTo(0.8024, 3)
	})

	test('pins the endpoints and allows overshoot between', () => {
		const back = cubicBezier(0.34, 1.56, 0.64, 1)
		expect(back(0)).toBe(0)
		expect(back(1)).toBe(1)
		expect(Math.max(...[0.5, 0.6, 0.7, 0.8].map(back))).toBeGreaterThan(1)
	})
})

describe('helpers', () => {
	test('toBezier and bezierToString round-trip', () => {
		const v = toBezier('cubic-bezier(0.16, 1, 0.3, 1)')
		expect(bezierToString(v)).toBe('cubic-bezier(0.16, 1, 0.3, 1)')
	})
})
