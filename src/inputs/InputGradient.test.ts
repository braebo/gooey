import type { GradientValue } from './InputGradient'

import { describe, expect, test } from 'vitest'

import { InputGradient, gradientToString, sampleGradient, toGradient } from './InputGradient'
import { Gooey } from '../Gooey'

const gooey = new Gooey({ title: 'InputGradient', storage: false })

const BW: GradientValue = [
	{ offset: 0, color: '#000000' },
	{ offset: 1, color: '#ffffff' },
]

const HEAT: GradientValue = [
	{ offset: 0, color: '#0000ff' },
	{ offset: 0.5, color: '#00ff00' },
	{ offset: 1, color: '#ff0000' },
]

/** Fires a pointer event at `x` (0..1 along the stop lane) and `dy` pixels below the track's middle. */
function pointer(input: InputGradient, type: string, x: number, dy = 0, shiftKey = false) {
	const { track, stops } = input.elements.controllers
	const lane = stops.getBoundingClientRect()
	const r = track.getBoundingClientRect()
	// A press lands on the stop under it, if there is one -- the way a real press would.
	const target =
		type === 'pointerdown'
			? (input.elements.controllers.handles.find(
					h => Math.abs(parseFloat(h.style.left) / 100 - x) < 0.005,
				) ?? stops)
			: track
	target.dispatchEvent(
		new PointerEvent(type, {
			bubbles: true,
			button: 0,
			pointerId: 1,
			clientX: lane.left + lane.width * x,
			clientY: r.top + r.height / 2 + dy,
			shiftKey,
		}),
	)
}

const frame = () => new Promise(r => requestAnimationFrame(r))

describe('value', () => {
	test('addGradient builds an InputGradient holding { offset, color } stops', () => {
		const input = gooey.addGradient('stops', HEAT)
		expect(input).toBeInstanceOf(InputGradient)
		expect(input.value).toEqual(HEAT)
	})

	test('defaults to black to white', () => {
		expect(gooey.addGradient('default').value).toEqual(BW)
	})

	test('bare colours are spaced evenly, and colours become hex', () => {
		const input = gooey.addGradient('bare', ['blue', 'rgb(0, 255, 0)', '#f00'])
		expect(input.value).toEqual(HEAT)
	})

	test('a translucent colour keeps its alpha as #rrggbbaa', () => {
		const input = gooey.addGradient('alpha', ['rgba(255, 0, 0, 0.5)', '#00ff00'])
		expect(input.value[0].color).toBe('#ff00007f')
	})

	test('a hex already in the stored shape is kept exactly, through repeated sets', () => {
		const stops = [
			{ offset: 0, color: '#a0d195' },
			{ offset: 1, color: '#FF5F56' },
		]
		const input = gooey.addGradient('hex', stops)
		for (let i = 0; i < 5; i++) input.set(input.value)
		expect(input.value.map(s => s.color)).toEqual(['#a0d195', '#ff5f56'])
		expect(
			gooey.addGradient('opaque8', ['#112233ff', '#11223380']).value.map(s => s.color),
		).toEqual(['#112233', '#11223380'])
	})

	test('stops are sorted by offset and clamped into 0..1', () => {
		const input = gooey.addGradient('sort', [
			{ offset: 2, color: '#ff0000' },
			{ offset: -1, color: '#0000ff' },
			{ offset: 0.5, color: '#00ff00' },
		])
		expect(input.value).toEqual(HEAT)
	})

	test('rejects what is not a gradient', () => {
		const input = gooey.addGradient('invalid', BW)
		expect(() => input.set(['#000'] as any)).toThrow()
		expect(() => input.set([{ offset: 0, color: 'nope' }, '#fff'] as any)).toThrow()
		expect(() => input.set([{ offset: NaN, color: '#000' }, '#fff'] as any)).toThrow()
		expect(() => input.set('#000' as any)).toThrow()
		expect(input.value).toEqual(BW)
	})

	test('the stops passed in are never the state, nor the default', () => {
		const value = HEAT.map(s => ({ ...s }))
		const input = gooey.addGradient('alias', value)
		value[0].color = '#123456'
		expect(input.value[0].color).toBe('#0000ff')
		expect(input.initialValue).not.toBe(input.value)

		input.set(BW)
		expect(input.initialValue).toEqual(HEAT)
	})

	test('add() builds a gradient when the options say so', () => {
		const input = gooey.add('via add', HEAT, { __type: 'GradientInputOptions' } as any)
		expect(input).toBeInstanceOf(InputGradient)
		expect((input as unknown as InputGradient).value).toEqual(HEAT)
	})

	test('change listeners receive the stops', () => {
		const input = gooey.addGradient('change', BW)
		const seen: GradientValue[] = []
		input.on('change', v => seen.push(v))
		input.set(HEAT)
		expect(seen).toEqual([HEAT])
	})

	test('the value serializes as plain data', () => {
		const input = gooey.addGradient('json', HEAT)
		expect(JSON.parse(JSON.stringify(input.value))).toEqual(HEAT)
	})
})

describe('dirty and reset', () => {
	test('equal stops are clean, different ones dirty', () => {
		const input = gooey.addGradient('dirty', BW)
		const btn = input.elements.resetBtn

		input.set(HEAT)
		expect(btn.classList.contains('dirty')).toBe(true)

		input.set(BW.map(s => ({ ...s })))
		expect(btn.classList.contains('dirty')).toBe(false)
	})

	test('the reset button restores the default', () => {
		const input = gooey.addGradient('reset', HEAT)
		input.set(BW)
		input.elements.resetBtn.click()
		expect(input.value).toEqual(HEAT)
	})
})

describe('binding', () => {
	test('the field is written back as stops, never the state itself', () => {
		const target = { ramp: BW.map(s => ({ ...s })) }
		const input = gooey.bindGradient(target, 'ramp')
		input.set(HEAT)
		expect(target.ramp).toEqual(HEAT)
		expect(target.ramp).not.toBe(input.value)
	})

	test('refresh reads an outside write to the field', () => {
		const target = { ramp: BW.map(s => ({ ...s })) }
		const input = gooey.bindGradient(target, 'ramp')

		target.ramp = HEAT.map(s => ({ ...s }))
		input.refresh()

		expect(input.value).toEqual(HEAT)
		expect(input.elements.controllers.handles).toHaveLength(3)
	})
})

describe('presets', () => {
	test('a folder preset round-trips the stops', () => {
		const folder = gooey.addFolder('gradient presets')
		const input = folder.addGradient('ramp', BW)

		input.set(HEAT)
		const preset = JSON.parse(JSON.stringify(folder.save()))
		expect(preset.inputs[0].value).toEqual(HEAT)
		expect(preset.inputs[0].__type).toBe('GradientInputOptions')

		input.set(BW)
		folder.load(preset)
		expect(input.value).toEqual(HEAT)
	})

	test("a saved preset doesn't move with the input", () => {
		const input = gooey.addGradient('preset alias', BW)
		const preset = input.save()
		input.set(HEAT)
		expect(preset.value).toEqual(BW)
	})
})

describe('controls', () => {
	test('a handle per stop, placed at its offset', async () => {
		const input = gooey.addGradient('handles', HEAT)
		await frame()
		const { handles, stops } = input.elements.controllers
		expect(handles).toHaveLength(3)
		const lane = stops.getBoundingClientRect()
		const mid = handles[1].getBoundingClientRect()
		expect(mid.left + mid.width / 2).toBeCloseTo(lane.left + lane.width / 2, 0)
	})

	test('dragging a stop moves it, and lands as one undo step', async () => {
		const input = gooey.addGradient('drag', HEAT)
		await frame()
		const undo = input.undoManager!
		const steps = undo.stack.length

		pointer(input, 'pointerdown', 0.5)
		pointer(input, 'pointermove', 0.6)
		pointer(input, 'pointermove', 0.7)
		pointer(input, 'pointerup', 0.7)

		expect(input.value[1].offset).toBeCloseTo(0.7, 2)
		expect(input.selected).toBe(1)
		expect(undo.stack.length).toBe(steps + 1)

		undo.undo()
		expect(input.value).toEqual(HEAT)
	})

	test('a stop dragged past its neighbour re-sorts, and stays selected', async () => {
		const input = gooey.addGradient('reorder', HEAT)
		await frame()

		pointer(input, 'pointerdown', 0)
		pointer(input, 'pointermove', 0.75)
		pointer(input, 'pointerup', 0.75)

		expect(input.value.map(s => s.color)).toEqual(['#00ff00', '#0000ff', '#ff0000'])
		expect(input.value[1].offset).toBeCloseTo(0.75, 2)
		expect(input.selected).toBe(1)
	})

	test('a press on the strip adds a stop coloured as the gradient was there', async () => {
		const input = gooey.addGradient('add', BW)
		await frame()
		const steps = input.undoManager!.stack.length

		pointer(input, 'pointerdown', 0.5)
		pointer(input, 'pointerup', 0.5)

		expect(input.value).toHaveLength(3)
		expect(input.value[1].offset).toBeCloseTo(0.5, 2)
		expect(input.value[1].color).toBe(sampleGradient(BW, input.value[1].offset))
		expect(input.selected).toBe(1)
		expect(input.undoManager!.stack.length).toBe(steps + 1)
	})

	test('a stop dragged off the strip is removed on release', async () => {
		const input = gooey.addGradient('drag off', HEAT)
		await frame()

		pointer(input, 'pointerdown', 0.5)
		pointer(input, 'pointermove', 0.5, 60)
		expect(input.elements.controllers.handles[1].classList.contains('removing')).toBe(true)
		pointer(input, 'pointerup', 0.5, 60)

		expect(input.value).toEqual([HEAT[0], HEAT[2]])
	})

	test('a stop dragged off and back stays', async () => {
		const input = gooey.addGradient('drag back', HEAT)
		await frame()

		pointer(input, 'pointerdown', 0.5)
		pointer(input, 'pointermove', 0.5, 60)
		pointer(input, 'pointermove', 0.5, 0)
		pointer(input, 'pointerup', 0.5, 0)

		expect(input.value).toEqual(HEAT)
	})

	test('a cancelled drag off the strip keeps the stop', async () => {
		const input = gooey.addGradient('cancel off', HEAT)
		await frame()

		pointer(input, 'pointerdown', 0.5)
		pointer(input, 'pointermove', 0.5, 60)
		pointer(input, 'pointercancel', 0.5, 60)

		expect(input.value).toEqual(HEAT)
		expect(input.elements.controllers.handles[1].classList.contains('removing')).toBe(false)
	})

	test('a second pointer mid-drag is ignored', async () => {
		const input = gooey.addGradient('two pointers', BW)
		await frame()
		const { stops } = input.elements.controllers

		pointer(input, 'pointerdown', 0)
		const lane = stops.getBoundingClientRect()
		stops.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				button: 0,
				pointerId: 2,
				clientX: lane.left + lane.width * 0.5,
				clientY: lane.top + lane.height / 2,
			}),
		)
		pointer(input, 'pointerup', 0)

		expect(input.value).toEqual(BW)
	})

	test('a colour-picker gesture is one undo step, and undoing it leaves the history whole', async () => {
		const input = gooey.addGradient('color gesture', HEAT)
		const other = gooey.addNumber('after gesture', 0)
		await frame()
		input.select(1)
		const undo = input.undoManager!
		const steps = undo.stack.length

		input.colorInput.element.dispatchEvent(
			new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 3 }),
		)
		input.colorInput.set('#ff00ff')
		input.colorInput.set('#ffff00')
		dispatchEvent(new PointerEvent('pointerup', { pointerId: 3 }))

		expect(input.value[1].color).toBe('#ffff00')
		expect(undo.stack.length).toBe(steps + 1)

		undo.undo()
		expect(input.value).toEqual(HEAT)

		// The undo's own set consumed the manager's lock, so the next edit still lands.
		other.set(1)
		expect(undo.stack.at(-1)!.target).toBe(other)
	})

	test('the last two stops are never removed', async () => {
		const input = gooey.addGradient('min stops', BW)
		await frame()

		pointer(input, 'pointerdown', 0)
		pointer(input, 'pointermove', 0, 60)
		pointer(input, 'pointerup', 0, 60)
		expect(input.value).toEqual(BW)

		input.elements.controllers.handles[0].dispatchEvent(
			new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }),
		)
		expect(input.value).toEqual(BW)
	})

	test('Delete or Backspace removes a focused stop', () => {
		const input = gooey.addGradient('keys remove', HEAT)
		const key = (key: string) =>
			input.elements.controllers.handles[1].dispatchEvent(
				new KeyboardEvent('keydown', { key, bubbles: true }),
			)
		key('Backspace')
		expect(input.value).toEqual([HEAT[0], HEAT[2]])
	})

	test('arrow keys move a focused stop by a step, ten with shift', () => {
		const input = gooey.addGradient('keys move', HEAT)
		const handle = () => input.elements.controllers.handles[1]
		const key = (key: string, shiftKey = false) =>
			handle().dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true }))

		key('ArrowRight')
		expect(input.value[1].offset).toBeCloseTo(0.51, 5)
		key('ArrowLeft', true)
		expect(input.value[1].offset).toBeCloseTo(0.41, 5)
		key('Home')
		expect(input.value[1].offset).toBe(0)
		expect(input.value.map(s => s.color)).toEqual(['#0000ff', '#00ff00', '#ff0000'])
	})

	test('selecting a stop points the editor at it', () => {
		const input = gooey.addGradient('select', HEAT)
		const { offset, color } = input.elements.controllers.editor

		input.select(2)
		expect(offset.value).toBe('1')
		expect(color.state.value.hexString).toBe('#ff0000')
	})

	test('the offset field moves the selected stop', () => {
		const input = gooey.addGradient('offset field', HEAT)
		input.select(1)
		const { offset } = input.elements.controllers.editor

		offset.value = '0.25'
		offset.dispatchEvent(new Event('input'))

		expect(input.value[1].offset).toBe(0.25)
	})

	test("the colour picker edits the selected stop, one undo step under the gradient's name", () => {
		const input = gooey.addGradient('color edit', HEAT)
		input.select(1)
		const undo = input.undoManager!
		const steps = undo.stack.length

		input.colorInput.set('#ff00ff')

		expect(input.value[1].color).toBe('#ff00ff')
		expect(undo.stack.length).toBe(steps + 1)
		expect(undo.stack.at(-1)!.target).toBe(input)

		undo.undo()
		expect(input.value).toEqual(HEAT)
		expect(input.colorInput.state.value.hexString).toBe('#00ff00')
	})

	test("the stop's colour input is not one of the folder's inputs", () => {
		const folder = gooey.addFolder('gradient inner')
		folder.addGradient('ramp', HEAT)
		expect([...folder.inputs.values()].map(i => i.__type)).toEqual(['InputGradient'])
	})
})

describe('helpers', () => {
	test('gradientToString renders a CSS linear-gradient', () => {
		expect(gradientToString(HEAT)).toBe(
			'linear-gradient(to right, #0000ff 0%, #00ff00 50%, #ff0000 100%)',
		)
		expect(gradientToString(BW, '45deg')).toBe(
			'linear-gradient(45deg, #000000 0%, #ffffff 100%)',
		)
	})

	test('sampleGradient blends between stops and holds past the ends', () => {
		expect(sampleGradient(HEAT, 0)).toBe('#0000ff')
		expect(sampleGradient(HEAT, 0.5)).toBe('#00ff00')
		expect(sampleGradient(HEAT, 0.25)).toBe('#008080')
		expect(sampleGradient(HEAT, -1)).toBe('#0000ff')
		expect(sampleGradient(HEAT, 2)).toBe('#ff0000')

		const inset = toGradient([
			{ offset: 0.2, color: '#000000' },
			{ offset: 0.8, color: '#ffffff' },
		])
		expect(sampleGradient(inset, 0.1)).toBe('#000000')
		expect(sampleGradient(inset, 0.9)).toBe('#ffffff')
	})

	test('sampleGradient blends alpha premultiplied, as CSS paints it', () => {
		// Half-way to transparent keeps the opaque colour's hue instead of greying toward black.
		const fade = toGradient(['#ff0000', 'rgba(0, 0, 0, 0)'])
		expect(sampleGradient(fade, 0.5)).toBe('#ff00007f')
	})
})
