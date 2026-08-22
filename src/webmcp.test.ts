import type { ModelContext, WebMCPTool } from './webmcp'

import { describe, expect, test } from 'vitest'

import { registerWebMCP } from './webmcp'
import { Gooey } from './Gooey'

/**
 * A stand-in for `document.modelContext`, which only exists in Chrome's WebMCP origin trial.
 */
class MockModelContext implements ModelContext {
	tools = new Map<string, WebMCPTool>()
	unregistered: string[] = []

	registerTool(tool: WebMCPTool): Promise<void> {
		this.tools.set(tool.name, tool)
		return Promise.resolve()
	}

	unregisterTool(name: string): void {
		this.tools.delete(name)
		this.unregistered.push(name)
	}

	get names(): string[] {
		return [...this.tools.keys()]
	}

	tool(name: string): WebMCPTool {
		const tool = this.tools.get(name)
		if (!tool) throw new Error(`No such tool: ${name} (have: ${this.names.join(', ')})`)
		return tool
	}

	call(name: string, args: Record<string, unknown> = {}): string | Promise<string> {
		return this.tool(name).execute(args)
	}
}

function setup(title = 'panel') {
	const gooey = new Gooey({ title, storage: false })
	const mc = new MockModelContext()
	return { gooey, mc }
}

describe('registerWebMCP walk', () => {
	test('one tool per input, namespaced by gooey title and folder path', () => {
		const { gooey, mc } = setup('Scene')

		gooey.addNumber('speed', 1, { min: 0, max: 10, step: 0.5 })
		const colors = gooey.addFolder('Colors')
		colors.addColor('background', '#ff0000')
		colors.addFolder('Accent').addText('name', 'tomato')

		const handle = registerWebMCP(gooey, { modelContext: mc })

		expect(handle.enabled).toBe(true)
		expect(mc.names).toEqual([
			'scene.state',
			'scene.speed',
			'scene.colors.background',
			'scene.colors.accent.name',
		])
		expect(handle.tools).toEqual(mc.names)
	})

	test('skips the settings folder and element inputs', () => {
		const { gooey, mc } = setup()

		gooey.addText('kept', 'yes')
		gooey.addElement('custom', document.createElement('div'))

		registerWebMCP(gooey, { modelContext: mc })

		expect(mc.names).toEqual(['panel.state', 'panel.kept'])
	})

	test('an array is one tool, not one per rendered item', () => {
		const { gooey, mc } = setup()

		gooey.addArray('nums', [1, 2, 3])

		registerWebMCP(gooey, { modelContext: mc })

		expect(mc.names).toEqual(['panel.state', 'panel.nums'])
	})

	test('duplicate titles get numbered suffixes', () => {
		const { gooey, mc } = setup()

		gooey.addText('dupe', 'a')
		gooey.addText('dupe', 'b')

		registerWebMCP(gooey, { modelContext: mc })

		expect(mc.names).toEqual(['panel.state', 'panel.dupe', 'panel.dupe-2'])
	})

	test('refresh() picks up inputs added after registration', () => {
		const { gooey, mc } = setup()

		const handle = registerWebMCP(gooey, { modelContext: mc })
		expect(mc.names).toEqual(['panel.state'])

		gooey.addText('late', 'arrival')
		handle.refresh()

		expect(mc.names).toEqual(['panel.state', 'panel.late'])
	})
})

describe('schema derivation', () => {
	test('number carries min/max/step as minimum/maximum/multipleOf', () => {
		const { gooey, mc } = setup()
		gooey.addNumber('speed', 5, { min: -1, max: 10, step: 0.25 })
		registerWebMCP(gooey, { modelContext: mc })

		expect(mc.tool('panel.speed').inputSchema).toEqual({
			type: 'object',
			properties: {
				value: { type: 'number', minimum: -1, maximum: 10, multipleOf: 0.25 },
			},
			required: ['value'],
			additionalProperties: false,
		})
	})

	test('select becomes an enum of option labels', () => {
		const { gooey, mc } = setup()
		gooey.addSelect('theme', 'light', { options: ['light', 'dark'] })
		registerWebMCP(gooey, { modelContext: mc })

		expect(mc.tool('panel.theme').inputSchema.properties['value']).toEqual({
			type: 'string',
			enum: ['light', 'dark'],
		})
	})

	test('switch is a boolean', () => {
		const { gooey, mc } = setup()
		gooey.addSwitch('enabled', true)
		registerWebMCP(gooey, { modelContext: mc })

		expect(mc.tool('panel.enabled').inputSchema.properties['value']).toEqual({
			type: 'boolean',
		})
	})

	test('text carries maxLength', () => {
		const { gooey, mc } = setup()
		gooey.addText('name', 'foo', { maxLength: 12 })
		registerWebMCP(gooey, { modelContext: mc })

		expect(mc.tool('panel.name').inputSchema.properties['value']).toEqual({
			type: 'string',
			maxLength: 12,
		})
	})

	test('color is a string', () => {
		const { gooey, mc } = setup()
		gooey.addColor('bg', '#ff0000')
		registerWebMCP(gooey, { modelContext: mc })

		expect(mc.tool('panel.bg').inputSchema.properties['value']?.['type']).toBe('string')
	})

	test('array is an array', () => {
		const { gooey, mc } = setup()
		gooey.addArray('nums', [1, 2])
		registerWebMCP(gooey, { modelContext: mc })

		expect(mc.tool('panel.nums').inputSchema.properties['value']?.['type']).toBe('array')
	})

	test('a button takes no arguments', () => {
		const { gooey, mc } = setup()
		gooey.addButton('go', () => {})
		registerWebMCP(gooey, { modelContext: mc })

		expect(mc.tool('panel.go').inputSchema).toEqual({
			type: 'object',
			properties: {},
			additionalProperties: false,
		})
	})

	test('a button grid becomes one tool per button', () => {
		const { gooey, mc } = setup()
		gooey.addButtonGrid('grid', [
			[
				{ text: 'copy', onClick: () => {} },
				{ text: 'paste', onClick: () => {} },
			],
		])
		registerWebMCP(gooey, { modelContext: mc })

		expect(mc.names).toEqual(['panel.state', 'panel.grid.copy', 'panel.grid.paste'])
		expect(mc.tool('panel.grid.copy').description).toContain('"copy"')
	})

	test('descriptions name the control and its folder trail', () => {
		const { gooey, mc } = setup('Scene')
		gooey.addFolder('Colors').addText('name', 'tomato')
		registerWebMCP(gooey, { modelContext: mc })

		expect(mc.tool('scene.colors.name').description).toBe(
			'Set the "name" text in Scene › Colors.',
		)
	})
})

describe('execute', () => {
	test('a number setter drives the real input and its binding', async () => {
		const { gooey, mc } = setup()
		const target = { speed: 1 }
		let changed = 0

		gooey.bindNumber(target, 'speed', { min: 0, max: 10, onChange: () => changed++ })
		registerWebMCP(gooey, { modelContext: mc })

		const result = await mc.call('panel.speed', { value: 7 })

		expect(target.speed).toBe(7)
		expect(changed).toBe(1)
		expect(result).toBe('speed = 7')
	})

	test('a select setter resolves the option by label', async () => {
		const { gooey, mc } = setup()
		const select = gooey.addSelect('theme', 'light', { options: ['light', 'dark'] })
		registerWebMCP(gooey, { modelContext: mc })

		expect(await mc.call('panel.theme', { value: 'dark' })).toBe('theme = dark')
		expect(select.value).toBe('dark')
	})

	test('an unknown select option returns an error string, not a throw', async () => {
		const { gooey, mc } = setup()
		gooey.addSelect('theme', 'light', { options: ['light', 'dark'] })
		registerWebMCP(gooey, { modelContext: mc })

		const result = await mc.call('panel.theme', { value: 'mauve' })

		expect(result).toContain('error:')
		expect(result).toContain('light, dark')
	})

	test('a switch setter flips the value', async () => {
		const { gooey, mc } = setup()
		const input = gooey.addSwitch('enabled', true)
		registerWebMCP(gooey, { modelContext: mc })

		expect(await mc.call('panel.enabled', { value: false })).toBe('enabled = false')
		expect(input.value).toBe(false)
	})

	test('a button tool clicks the button', async () => {
		const { gooey, mc } = setup()
		let clicked = 0
		gooey.addButton('go', () => clicked++)
		registerWebMCP(gooey, { modelContext: mc })

		expect(await mc.call('panel.go')).toBe('clicked go')
		expect(clicked).toBe(1)
	})

	test('a grid tool clicks its button and reports the active set', async () => {
		const { gooey, mc } = setup()
		let clicked = ''
		gooey.addButtonGrid('grid', [
			[
				{ text: 'copy', onClick: () => (clicked = 'copy') },
				{ text: 'paste', onClick: () => (clicked = 'paste') },
			],
		])
		registerWebMCP(gooey, { modelContext: mc })

		const result = await mc.call('panel.grid.paste')

		expect(clicked).toBe('paste')
		expect(result).toContain('active: paste')
	})

	test('a disabled input refuses instead of setting', async () => {
		const { gooey, mc } = setup()
		const input = gooey.addText('locked', 'original')
		input.disable()
		registerWebMCP(gooey, { modelContext: mc })

		expect(await mc.call('panel.locked', { value: 'hacked' })).toContain('error:')
		expect(input.value).toBe('original')
	})
})

describe('the state tool', () => {
	test('reads the whole panel in one call', async () => {
		const { gooey, mc } = setup('Scene')
		gooey.addNumber('speed', 2, { min: 0, max: 10 })
		gooey.addFolder('Colors').addText('name', 'tomato')
		registerWebMCP(gooey, { modelContext: mc })

		const state = await mc.call('scene.state')

		expect(state.split('\n')).toEqual([
			'Scene · 2 controls · 2 folders',
			'(set one with the tool named scene.<path>)',
			'speed = 2',
			'colors.name = tomato',
		])
	})

	test('reflects changes made through the setters', async () => {
		const { gooey, mc } = setup()
		gooey.addNumber('speed', 2, { min: 0, max: 10 })
		registerWebMCP(gooey, { modelContext: mc })

		await mc.call('panel.speed', { value: 9 })

		expect(await mc.call('panel.state')).toContain('speed = 9')
	})

	test('an empty panel says so', async () => {
		const { gooey, mc } = setup()
		registerWebMCP(gooey, { modelContext: mc })

		expect(await mc.call('panel.state')).toContain('(no controls)')
	})

	test('can be turned off', () => {
		const { gooey, mc } = setup()
		gooey.addText('a', 'b')
		registerWebMCP(gooey, { modelContext: mc, stateTool: false })

		expect(mc.names).toEqual(['panel.a'])
	})
})

describe('feature detection', () => {
	test('no document.modelContext is a no-op, not a throw', () => {
		const gooey = new Gooey({ title: 'panel', storage: false })

		expect('modelContext' in document).toBe(false)

		const handle = registerWebMCP(gooey)

		expect(handle.enabled).toBe(false)
		expect(handle.tools).toEqual([])
		expect(() => handle.refresh()).not.toThrow()
		expect(() => handle.dispose()).not.toThrow()
	})

	test('document.modelContext is found automatically', () => {
		const gooey = new Gooey({ title: 'panel', storage: false })
		gooey.addText('a', 'b')

		const mc = new MockModelContext()
		Object.defineProperty(document, 'modelContext', { value: mc, configurable: true })

		try {
			const handle = registerWebMCP(gooey)
			expect(handle.enabled).toBe(true)
			expect(mc.names).toEqual(['panel.state', 'panel.a'])
		} finally {
			// @ts-expect-error - not a real Document member
			delete document.modelContext
		}
	})
})

describe('dispose', () => {
	test('unregisters every tool, idempotently', () => {
		const { gooey, mc } = setup()
		gooey.addText('a', 'b')

		const handle = registerWebMCP(gooey, { modelContext: mc })
		expect(mc.names.length).toBe(2)

		handle.dispose()

		expect(mc.names).toEqual([])
		expect(mc.unregistered).toEqual(['panel.state', 'panel.a'])
		expect(handle.tools).toEqual([])

		handle.dispose()
		expect(mc.unregistered.length).toBe(2)
	})

	test('disposing the gooey unregisters the tools', () => {
		const { gooey, mc } = setup()
		gooey.addText('a', 'b')

		registerWebMCP(gooey, { modelContext: mc })
		gooey.dispose()

		expect(mc.names).toEqual([])
	})

	test('disposeWithGooey: false leaves gooey.dispose alone', () => {
		const { gooey, mc } = setup()
		gooey.addText('a', 'b')

		registerWebMCP(gooey, { modelContext: mc, disposeWithGooey: false })
		gooey.dispose()

		expect(mc.names.length).toBe(2)
	})
})
