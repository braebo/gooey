import type { ElementMap, InputOptions } from './Input'
import type { State } from '../shared/state'
import type { Folder } from '../Folder'

import { create } from '../shared/create'
import { Logger } from '../shared/logger'
import { state } from '../shared/state'
import { Input } from './Input'

/**
 * The content mounted by an {@link InputElement}.  Either an existing element, or a mount function
 * that receives the input's container.  A mount function may return a cleanup function, which runs
 * when the content is replaced or the input is disposed.
 */
export type ElementContent =
	| HTMLElement
	| ((container: HTMLElement) => void | (() => void) | undefined)

export type ElementInputOptions = InputOptions<ElementContent> & {
	readonly __type?: 'ElementInputOptions'
	/**
	 * The element or mount function to render in the input's content area.
	 */
	value?: ElementContent
}

export const ELEMENT_INPUT_DEFAULTS = {
	__type: 'ElementInputOptions' as const,
	// Custom content has no serializable value, and nothing to reset to.
	saveable: false,
	resettable: false,
} as const satisfies ElementInputOptions

export interface ElementControllerElements extends ElementMap {
	container: HTMLElement
}

/**
 * An input that mounts arbitrary content in its content area instead of a controller.  Use it to
 * put consumer-rendered DOM -- a chart, a markdown card, a preview -- in a folder alongside normal
 * inputs.  It has no value to serialize, so it opts out of presets by default.
 *
 * @example
 * ```ts
 * const card = gooey.addElement('Notes', container => {
 * 	container.innerHTML = renderMarkdown(notes)
 * 	return () => container.replaceChildren()
 * })
 *
 * card.set(someOtherElement)
 * ```
 */
export class InputElement extends Input<
	ElementContent,
	ElementInputOptions,
	ElementControllerElements
> {
	readonly __type = 'InputElement' as const
	readonly initialValue: ElementContent
	readonly state: State<ElementContent>

	/**
	 * The cleanup function returned by the last mount function, if any.
	 */
	#cleanup?: () => void
	/**
	 * The content currently mounted, used to avoid re-mounting on every refresh.
	 */
	#mounted?: ElementContent
	#disposed = false
	#log: Logger

	constructor(options: Partial<ElementInputOptions>, folder: Folder) {
		const opts = Object.assign({}, ELEMENT_INPUT_DEFAULTS, options, {
			__type: 'ElementInputOptions' as const,
		})

		super(opts, folder)

		this.#log = new Logger(`InputElement ${opts.title}`, { fg: 'lightgreen' })
		this.#log.fn('constructor').debug({ opts, this: this })

		this.initialValue = opts.value!
		this.state = state(opts.value!)

		this.elements.controllers = {
			container: create('div', {
				classes: ['gooey-input-element-container'],
				parent: this.elements.content,
				// The content area is a centered flex row -- let the content own the width.
				style: { width: '100%' },
			}),
		} as const satisfies ElementControllerElements

		this.#mount(opts.value)

		this._evm.add(this.state.subscribe(this.refresh))
	}

	/**
	 * The container the content is mounted into.
	 */
	get container(): HTMLElement {
		return this.elements.controllers.container
	}

	/**
	 * Replaces the mounted content, running the previous mount function's cleanup first.
	 */
	set = (v: ElementContent): this => {
		this.state.set(v)
		this.#mount(v)
		this.emit('change', v)
		return this
	}

	refresh = (): this => {
		// A folder-wide refresh shouldn't resurrect content we've already torn down.
		if (this.#disposed) return this

		const v = this.state.value
		super.refresh(v)

		if (v !== this.#mounted) this.#mount(v)

		return this
	}

	#mount(content?: ElementContent): void {
		this.#unmount()

		if (!content) return

		if (typeof content === 'function') {
			this.#cleanup = content(this.container) ?? undefined
		} else {
			this.container.appendChild(content)
		}

		this.#mounted = content
	}

	#unmount(): void {
		this.#cleanup?.()
		this.#cleanup = undefined
		this.#mounted = undefined
		this.container.replaceChildren()
	}

	dispose(): void {
		this.#disposed = true
		this.#unmount()
		super.dispose()
	}
}
