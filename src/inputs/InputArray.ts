import type { ElementMap, InputOptions, ValidInput } from './Input'
import type { State } from '../shared/state'
import type { Folder } from '../Folder'

import { create } from '../shared/create'
import { Logger } from '../shared/logger'
import { state } from '../shared/state'
import { Input } from './Input'

export type ArrayInputOptions<T = any> = InputOptions<T[]> & {
	readonly __type?: 'ArrayInputOptions'
	/**
	 * The maximum number of items to display.  Items beyond this count are not rendered, and a
	 * small note is displayed instead.  They remain part of the array's value.
	 * @default 20
	 */
	maxItems?: number
	/**
	 * Whether the array folder should be closed by default.
	 * @default true
	 */
	closed?: boolean
}

export const ARRAY_INPUT_DEFAULTS = {
	__type: 'ArrayInputOptions' as const,
	value: [],
	maxItems: 20,
	closed: true,
} as const satisfies ArrayInputOptions

export interface ArrayControllerElements extends ElementMap {
	container: HTMLElement
	content: HTMLElement
}

export class InputArray<T = any> extends Input<T[], ArrayInputOptions<T>, ArrayControllerElements> {
	readonly __type = 'InputArray' as const
	readonly initialValue: T[]
	readonly state: State<T[]>

	/**
	 * The internal folder that contains the individual array item inputs.
	 */
	folder: Folder

	/**
	 * Individual inputs for each (rendered) array item.
	 */
	items: ValidInput[] = []

	#overflowNote?: HTMLElement
	#log: Logger

	constructor(options: Partial<ArrayInputOptions<T>>, folder: Folder) {
		const opts = Object.assign({}, ARRAY_INPUT_DEFAULTS, options)
		super(opts, folder)

		this.#log = new Logger(`InputArray ${opts.title}`, { fg: 'purple' })
		this.#log.fn('constructor').debug({ opts, this: this })

		if (opts.binding) {
			this.initialValue = opts.binding.target[opts.binding.key]
			this.state = state(this.initialValue)

			this._evm.add(
				this.state.subscribe(v => {
					opts.binding!.target[opts.binding!.key] = v
				}),
			)
		} else {
			this.initialValue = opts.value!
			this.state = state(opts.value!)
		}

		this.folder = folder.addFolder(opts.title || 'Array', {
			closed: opts.closed,
		})

		this.elements.container = create('div', {
			classes: ['gooey-input-array-container'],
			parent: this.elements.content,
		})

		this.elements.content = this.folder.elements.content

		this._createArrayItems()

		this._evm.add(
			this.state.subscribe(() => {
				this.refresh()
			}),
		)
	}

	private _createArrayItems(): void {
		const array = this.state.value
		const count = Math.min(array.length, this.opts.maxItems!)
		this.items = []

		for (let i = 0; i < count; i++) {
			this.items.push(this._createItemInput(i, array[i]))
		}

		if (array.length > count) {
			this.#overflowNote = create('div', {
				classes: ['gooey-input-array-overflow'],
				parent: this.folder.elements.content,
				textContent: `+ ${array.length - count} more…`,
			})
		}
	}

	private _createItemInput(index: number, value: T): ValidInput {
		// Empty titles keep the controllers full-width.  `_registerInput` de-dupes the keys.
		const title = ''

		if (typeof value === 'boolean') {
			const input = this.folder.addSwitch(title, value)
			input.on('change', newValue => this._updateArrayItem(index, newValue))
			return input
		} else if (typeof value === 'number') {
			const input = this.folder.addNumber(title, value)
			input.on('change', newValue => this._updateArrayItem(index, newValue))
			return input
		} else if (typeof value === 'string') {
			const input = this.folder.addText(title, value)
			input.on('change', newValue => this._updateArrayItem(index, newValue))
			return input
		} else if (typeof value === 'object' && value !== null) {
			// Objects are edited as JSON text until nested folders are supported.
			const input = this.folder.addText(title, JSON.stringify(value))
			input.on('change', newValue => {
				try {
					this._updateArrayItem(index, JSON.parse(newValue))
				} catch {
					// Invalid JSON - keep the raw string so the user's typing isn't lost.
					this._updateArrayItem(index, newValue as any)
				}
			})
			return input
		} else {
			const input = this.folder.addText(title, String(value))
			input.on('change', newValue => this._updateArrayItem(index, newValue as any))
			return input
		}
	}

	private _updateArrayItem(index: number, newValue: any): void {
		const currentArray = [...this.state.value]
		currentArray[index] = newValue

		// The binding target (if any) is synced by the state subscription in the constructor.
		this.state.set(currentArray)
		this.emit('change', currentArray)
	}

	set = (v: T[]): this => {
		this.state.set(v)
		this._recreateItems()
		this.emit('change', v)
		return this
	}

	private _recreateItems(): void {
		for (const item of this.items) {
			item.dispose()
		}
		this.items = []
		this.folder.inputs.clear()
		this.#overflowNote?.remove()
		this.#overflowNote = undefined

		this._createArrayItems()
	}

	refresh = (): this => {
		// Suspend the binding around `super.refresh` - it pulls the target back into state, and
		// arrays always fail the store's `safe_not_equal` check, re-notifying subscribers (and
		// this method) infinitely.  State -> target sync is handled by our own subscription.
		const binding = this.opts.binding
		this.opts.binding = undefined
		super.refresh(this.state.value)
		this.opts.binding = binding
		return this
	}

	dispose(): void {
		for (const item of this.items) {
			item.dispose()
		}
		this.folder.dispose()
		super.dispose()
	}
}
