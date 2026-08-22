import type { InputButtonGrid } from './inputs/InputButtonGrid'
import type { InputSelect } from './inputs/InputSelect'
import type { InputNumber } from './inputs/InputNumber'
import type { InputSwitch } from './inputs/InputSwitch'
import type { InputButton } from './inputs/InputButton'
import type { InputColor } from './inputs/InputColor'
import type { InputArray } from './inputs/InputArray'
import type { InputText } from './inputs/InputText'
import type { ColorFormat } from './shared/color/types/colorFormat'
import type { ValidInput } from './inputs/Input'
import type { Folder } from './Folder'
import type { Gooey } from './Gooey'

import { Logger } from './shared/logger'

//· WebMCP types ······································································¬

/**
 * The subset of a WebMCP tool declaration that gooey produces.
 *
 * WebMCP is a
 * {@link https://webmachinelearning.github.io/webmcp/|W3C Community Group draft} and ships behind
 * a Chrome origin trial, so the DOM lib has no types for it yet.  These declarations are
 * deliberately minimal -- just enough to call `registerTool` -- and are not a global augmentation,
 * so they can't conflict with the real thing once browsers ship it.
 */
export interface WebMCPTool {
	/** A unique, stable identifier the agent calls. */
	name: string
	/** A one-line, human-readable explanation of what calling the tool does. */
	description: string
	/** A JSON Schema describing the tool's argument object. */
	inputSchema: WebMCPInputSchema
	/** Runs the tool and returns a string result for the agent. */
	execute: (args: Record<string, unknown>) => string | Promise<string>
}

/**
 * A JSON Schema object describing a {@link WebMCPTool}'s arguments.
 */
export interface WebMCPInputSchema {
	type: 'object'
	properties: Record<string, Record<string, unknown>>
	required?: string[]
	additionalProperties?: boolean
}

/**
 * The `document.modelContext` surface gooey uses.  The real object has more on it
 * (`getTools`, `executeTool`), but registration is the only half a page needs.
 */
export interface ModelContext {
	registerTool(tool: WebMCPTool, options?: { signal?: AbortSignal }): unknown
	unregisterTool?(name: string): unknown
}
//⌟

//· Options / handle ··································································¬

export interface WebMCPOptions {
	/**
	 * The namespace prepended to every tool name.  Tools are named
	 * `<prefix>.<folder-path>.<input-title>`, slugified.
	 * @defaultValue The gooey's title, slugified.
	 */
	prefix?: string
	/**
	 * The model context to register with.  Provide one to target a polyfill, an iframe's document,
	 * or a test double.
	 * @defaultValue `document.modelContext`
	 */
	modelContext?: ModelContext
	/**
	 * Whether to expose gooey's builtin settings folder (theme, presets, ui).
	 * @default false
	 */
	includeSettings?: boolean
	/**
	 * Whether to expose a single `<prefix>.state` tool that reads every control at once.  Agents
	 * that can read the whole panel in one call don't have to probe it control by control.
	 * @default true
	 */
	stateTool?: boolean
	/**
	 * Whether to unregister the tools when the gooey is disposed.  Wraps {@link Gooey.dispose}.
	 * @default true
	 */
	disposeWithGooey?: boolean
}

/**
 * The return value of {@link registerWebMCP}.  Always a real object -- in a browser without
 * WebMCP, {@link WebMCPHandle.enabled|`enabled`} is `false` and everything else is inert.
 */
export interface WebMCPHandle {
	/** Whether a model context was found and tools were registered. */
	readonly enabled: boolean
	/** The names of the registered tools, in registration order. */
	readonly tools: readonly string[]
	/** Re-walks the gooey and re-registers its tools.  Call after adding or removing inputs. */
	refresh(): void
	/** Unregisters every tool.  Idempotent. */
	dispose(): void
}

const DISABLED_HANDLE: WebMCPHandle = Object.freeze({
	enabled: false,
	tools: Object.freeze([]) as readonly string[],
	refresh() {},
	dispose() {},
})
//⌟

/**
 * Exposes a {@link Gooey}'s controls to in-browser AI agents as
 * {@link https://webmachinelearning.github.io/webmcp/|WebMCP} tools -- one setter per input, plus
 * a `state` tool that reads the whole panel in a single call.  Setters go through each input's own
 * `set`, so bindings, `onChange` handlers, and undo history behave exactly as they do for a click.
 *
 * In a browser without `document.modelContext` this registers nothing and returns a disabled
 * handle.  It never throws, and nothing imports it, so it costs nothing until you call it.
 *
 * @example
 * ```ts
 * import { Gooey, registerWebMCP } from 'gooey'
 *
 * const gooey = new Gooey('Scene')
 * gooey.addNumber('speed', 1, { min: 0, max: 10 })
 *
 * const agentDoor = registerWebMCP(gooey)
 * // → tools: scene.state, scene.speed
 * ```
 */
export function registerWebMCP(gooey: Gooey, options: WebMCPOptions = {}): WebMCPHandle {
	const modelContext = options.modelContext ?? resolveModelContext()
	if (!modelContext) return DISABLED_HANDLE

	return new WebMCPRegistration(gooey, modelContext, options)
}

/**
 * Reads `document.modelContext`, returning `undefined` unless it's usable.  The API moved off
 * `navigator` in the 2026-05-27 draft, so a `navigator.modelContext` fallback would only find
 * deprecated implementations -- we don't look there.
 */
function resolveModelContext(): ModelContext | undefined {
	const doc = globalThis.document as (Document & { modelContext?: ModelContext }) | undefined
	const mc = doc?.modelContext
	return typeof mc?.registerTool === 'function' ? mc : undefined
}

class WebMCPRegistration implements WebMCPHandle {
	readonly enabled = true
	#tools: string[] = []

	/** A frozen snapshot, consistent with the disabled handle's frozen-array contract. */
	get tools(): readonly string[] {
		return Object.freeze([...this.#tools])
	}

	#gooey: Gooey
	#mc: ModelContext
	#opts: WebMCPOptions
	#prefix: string
	#controller = new AbortController()
	#disposed = false
	#restoreDispose?: () => void
	#log: Logger

	constructor(gooey: Gooey, modelContext: ModelContext, options: WebMCPOptions) {
		this.#gooey = gooey
		this.#mc = modelContext
		this.#opts = options
		this.#prefix = slug(options.prefix ?? gooey.title ?? 'gooey')
		this.#log = new Logger(`webmcp ${this.#prefix}`, { fg: 'mediumspringgreen' })

		if (options.disposeWithGooey !== false) {
			const original = gooey.dispose
			gooey.dispose = () => {
				this.dispose()
				original()
			}
			this.#restoreDispose = () => {
				gooey.dispose = original
			}
		}

		this.#register()
	}

	refresh(): void {
		if (this.#disposed) return
		this.#unregister()
		this.#controller = new AbortController()
		this.#register()
	}

	dispose(): void {
		if (this.#disposed) return
		this.#disposed = true
		this.#unregister()
		this.#restoreDispose?.()
		this.#restoreDispose = undefined
	}

	#register(): void {
		const targets = collectInputs(this.#gooey, this.#opts.includeSettings === true)

		if (this.#opts.stateTool !== false) {
			this.#add({
				name: this.#name('state'),
				description: `Read every control in the "${this.#gooey.title}" panel: current values, their tool paths, and how many there are.`,
				inputSchema: { type: 'object', properties: {} },
				execute: () => this.#readState(),
			})
		}

		for (const target of targets) {
			for (const tool of toolsFor(target, this.#name(target.path))) {
				this.#add(tool)
			}
		}

		this.#log.fn('register').debug({ tools: this.tools })
	}

	/** Registers one tool, de-duping its name and swallowing whatever the browser throws. */
	#add(tool: WebMCPTool): void {
		let name = tool.name
		for (let i = 2; this.#tools.includes(name); i++) name = `${tool.name}-${i}`
		tool.name = name

		try {
			// `registerTool`'s options bag isn't pinned down in the draft.  If `signal` isn't a
			// member, WebIDL drops it and we fall back to `unregisterTool` on dispose.
			const result = this.#mc.registerTool(tool, { signal: this.#controller.signal })
			this.#tools.push(name)
			if (isPromise(result)) {
				result.catch(err => {
					this.#log.fn('register').error(err)
					// Registration never actually landed -- don't leave a phantom name behind.
					const i = this.#tools.indexOf(name)
					if (i !== -1) this.#tools.splice(i, 1)
				})
			}
		} catch (err) {
			this.#log.fn('register').error('Failed to register tool', { name, err })
		}
	}

	/**
	 * Best-effort teardown.  The draft doesn't spell out how a page revokes a tool, so we try both
	 * plausible mechanisms: abort the signal handed to `registerTool`, then call `unregisterTool`
	 * if the implementation has one.
	 */
	#unregister(): void {
		try {
			this.#controller.abort()
		} catch (err) {
			this.#log.fn('unregister').error(err)
		}

		if (typeof this.#mc.unregisterTool === 'function') {
			for (const name of this.#tools) {
				try {
					this.#mc.unregisterTool(name)
				} catch (err) {
					this.#log.fn('unregister').error('Failed to unregister tool', { name, err })
				}
			}
		}

		this.#tools = []
	}

	#name(path: string): string {
		return `${this.#prefix}.${path}`
	}

	#readState(): string {
		const targets = collectInputs(this.#gooey, this.#opts.includeSettings === true)
		const folders = new Set(targets.map(t => t.breadcrumb))

		const header = `${this.#gooey.title} · ${targets.length} controls · ${folders.size} folders`
		if (!targets.length) return `${header}\n(no controls)`

		return [
			header,
			`(set one with the tool named ${this.#prefix}.<path>)`,
			...targets.map(t => `${t.path} = ${readValue(t.input)}`),
		].join('\n')
	}
}

//· The walk ··········································································¬

interface Target {
	input: ValidInput
	/** The tool-name path, sans prefix: slugified folder titles + the input title. */
	path: string
	/** Human-readable folder trail, for descriptions. */
	breadcrumb: string
}

/**
 * Flattens a gooey into the inputs worth exposing.  Skipped: the builtin settings folder (unless
 * asked for), element inputs (arbitrary DOM has no value to get or set), and the throwaway item
 * inputs an {@link InputArray} renders -- the array itself is one tool.
 */
function collectInputs(gooey: Gooey, includeSettings: boolean): Target[] {
	const root = gooey.folder
	const skipped = new Set<Folder>()

	const settings = gooey.elements?.settingsFolder
	if (settings && !includeSettings) {
		skipped.add(settings)
		for (const child of settings.allChildren) skipped.add(child)
	}

	const targets: Target[] = []
	const taken = new Set<string>()

	for (const folder of [root, ...root.allChildren]) {
		if (skipped.has(folder)) continue

		const trail = folderTrail(folder, root)
		const prefix = trail.map(slug)

		for (const input of folder.inputs.values()) {
			if (input.__type === 'InputElement') continue

			if (input.__type === 'InputArray') {
				// The array's item inputs live in a folder of their own -- keep the array, drop
				// the folder.
				const itemFolder = (input as InputArray).folder
				skipped.add(itemFolder)
				for (const child of itemFolder.allChildren) skipped.add(child)
			}

			const base = [...prefix, slug(input.title || input.__type.replace('Input', ''))].join(
				'.',
			)

			let path = base
			for (let i = 2; taken.has(path); i++) path = `${base}-${i}`
			taken.add(path)

			targets.push({ input, path, breadcrumb: [root.title, ...trail].join(' › ') })
		}
	}

	return targets
}

function folderTrail(folder: Folder, root: Folder): string[] {
	const trail: string[] = []
	let f: Folder | undefined = folder

	while (f && f !== root) {
		trail.unshift(f.title)
		f = f.parentFolder === f ? undefined : f.parentFolder
	}

	return trail
}
//⌟

//· Schema derivation ·································································¬

/**
 * Derives the tool(s) for one input.  Every type but {@link InputButtonGrid} produces exactly one
 * tool; a grid produces one per button, because each button is a distinct action with its own name
 * and an agent picks tools more reliably than it picks enum values.
 */
function toolsFor(target: Target, name: string): WebMCPTool[] {
	const { input, breadcrumb } = target
	const label = input.title || name
	const where = `in ${breadcrumb}`
	const note = input.opts.description ? ` ${input.description}` : ''

	const setter = (kind: string, value: Record<string, unknown>, set: (v: any) => void) => [
		{
			name,
			description: `Set the "${label}" ${kind} ${where}.${note}`,
			inputSchema: {
				type: 'object' as const,
				properties: { value },
				required: ['value'],
				additionalProperties: false,
			},
			execute: (args: Record<string, unknown>) => {
				if (input.disabled) return `error: "${label}" is disabled`
				set(args['value'])
				return `${target.path} = ${readValue(input)}`
			},
		},
	]

	switch (input.__type) {
		case 'InputNumber': {
			const opts = (input as InputNumber).opts
			return setter(
				'number',
				{
					type: 'number',
					...(typeof opts.min === 'number' ? { minimum: opts.min } : {}),
					...(typeof opts.max === 'number' ? { maximum: opts.max } : {}),
					...(typeof opts.step === 'number' && opts.step > 0
						? { multipleOf: opts.step }
						: {}),
				},
				v => (input as InputNumber).set(Number(v)),
			)
		}

		case 'InputSwitch': {
			const labels = (input as InputSwitch).opts.labels
			const states = labels ? ` (${labels.true.state} / ${labels.false.state})` : ''
			return setter(`switch${states}`, { type: 'boolean' }, v =>
				(input as InputSwitch).set(Boolean(v)),
			)
		}

		case 'InputText':
		case 'InputTextArea': {
			// Identical shapes -- one cast covers both.
			const text = input as InputText
			const max = text.opts.maxLength
			return setter(
				'text',
				{ type: 'string', ...(typeof max === 'number' ? { maxLength: max } : {}) },
				v => text.set(String(v)),
			)
		}

		case 'InputColor':
			return setter(
				'color',
				{ type: 'string', description: 'A css color string, i.e. "#ff0000" or "tomato".' },
				v => (input as InputColor).set(String(v) as ColorFormat),
			)

		case 'InputSelect': {
			const select = input as InputSelect
			const labels = select.options.map(o => o.label)
			return [
				{
					name,
					description: `Choose an option for the "${label}" select ${where}.${note}`,
					inputSchema: {
						type: 'object',
						properties: { value: { type: 'string', enum: labels } },
						required: ['value'],
						additionalProperties: false,
					},
					execute: (args: Record<string, unknown>) => {
						if (select.disabled) return `error: "${label}" is disabled`

						const wanted = String(args['value'])
						const option = select.options.find(o => o.label === wanted)

						if (!option) {
							return `error: no option "${wanted}" — options: ${labels.join(', ') || '(none)'}`
						}

						select.select(option)
						return `${target.path} = ${readValue(input)}`
					},
				},
			]
		}

		case 'InputArray':
			return setter(
				'array',
				{ type: 'array', description: 'The full replacement array.' },
				v => (input as InputArray).set(Array.isArray(v) ? v : [v]),
			)

		case 'InputButton':
			return [
				{
					name,
					description: `Click the "${label}" button ${where}.${note}`,
					inputSchema: { type: 'object', properties: {}, additionalProperties: false },
					execute: () => {
						if (input.disabled) return `error: "${label}" is disabled`
						;(input as InputButton).click()
						return `clicked ${target.path}`
					},
				},
			]

		case 'InputButtonGrid': {
			const grid = input as InputButtonGrid
			return [...grid.buttons.entries()].map(([id, button]) => ({
				name: `${name}.${slug(id)}`,
				description: `Click the "${button.text || id}" button in the "${label}" grid ${where}.`,
				inputSchema: {
					type: 'object' as const,
					properties: {},
					additionalProperties: false,
				},
				execute: () => {
					// A real click so the grid's active-state bookkeeping runs, and so a disabled
					// button stays inert.
					button.element.click()
					return `clicked ${target.path}.${slug(id)} · active: ${readValue(input)}`
				},
			}))
		}
	}

	return []
}
//⌟

//· Value rendering ···································································¬

const MAX_VALUE_LENGTH = 120

/**
 * Renders an input's current value as one compact line -- no JSON envelope, no quoting, just what
 * the agent needs to decide its next call.
 */
function readValue(input: ValidInput): string {
	switch (input.__type) {
		// `Color.hex` is the 8-digit form, so alpha never gets silently dropped.
		case 'InputColor':
			return (input as InputColor).state.value.hex8

		case 'InputSelect':
			return (input as InputSelect).selected.value?.label ?? '(none)'

		case 'InputButton':
			return '(button)'

		case 'InputButtonGrid': {
			const active = [...(input as InputButtonGrid).active]
			return active.length ? active.join(', ') : '(none active)'
		}

		case 'InputArray':
			return truncate(JSON.stringify((input as InputArray).state.value))

		default:
			return truncate(String(input.state.value))
	}
}

function truncate(v: string): string {
	return v.length <= MAX_VALUE_LENGTH ? v : `${v.slice(0, MAX_VALUE_LENGTH)}…(${v.length} chars)`
}
//⌟

/** Lowercases and dash-joins a title into a tool-name segment. */
function slug(v: string): string {
	const s = v
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
	return s || 'untitled'
}

function isPromise(v: unknown): v is Promise<unknown> {
	return typeof (v as Promise<unknown> | undefined)?.catch === 'function'
}
