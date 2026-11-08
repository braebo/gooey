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

/**
 * An array as JSON that can't throw, for comparing what's on screen with the field: a bigint
 * item writes as its digits, and an object met twice (a cycle) as a marker.  Plain
 * `JSON.stringify` throws on both, and the array is snapshotted whole, past `maxItems` too.
 */
function snapshot(array: unknown[]): string {
	const seen = new WeakSet<object>()
	return JSON.stringify(array, (_, v) => {
		if (typeof v === 'bigint') return `${v}n`
		if (typeof v === 'object' && v !== null) {
			if (seen.has(v)) return '[seen]'
			seen.add(v)
		}
		return v
	})
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
	/**
	 * The array the items were built from, as JSON, so a {@link readBinding} can tell an outside
	 * write (a new array, or the same one changed in place) from what's already on screen.
	 */
	#rendered = ''

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

	private _createArrayItems(array = this.state.value): void {
		this.#rendered = snapshot(array)
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
		let input: ValidInput
		/** The array item an item input's value stands for. */
		let toItem = (v: any): T => v

		if (typeof value === 'boolean') {
			input = this.folder.addSwitch(title, value)
		} else if (typeof value === 'number') {
			input = this.folder.addNumber(title, value)
		} else if (typeof value === 'string') {
			input = this.folder.addText(title, value)
		} else if (typeof value === 'object' && value !== null) {
			// Objects are edited as JSON text until nested folders are supported.
			input = this.folder.addText(title, JSON.stringify(value))
			toItem = v => {
				try {
					return JSON.parse(v)
				} catch {
					// Invalid JSON - keep the raw string so the user's typing isn't lost.
					return v
				}
			}
		} else {
			input = this.folder.addText(title, String(value))
		}

		input.on('change', (newValue: unknown) => this._updateArrayItem(index, toItem(newValue)))

		// The item's undo step is the array's: an undo sets the whole array back, so it still lands
		// after the items are rebuilt (an outside write, or `set`) and this input is gone.  Each
		// replay sets a shallow copy, so a push or an index write to the array it restored can't
		// rewrite the step (a write inside an object item still can).
		const commit = input.commit.bind(input)
		input.commit = ({ from, to = input.state.value }) =>
			commit({
				// A plain edit commits before it lands and names no `from`, so the array as it stands
				// is the one before, its items exact.  A drag names the item value it started from.
				from:
					from === undefined
						? [...this.state.value]
						: this._withItem(index, toItem(from)),
				to: this._withItem(index, toItem(to)),
				target: this as Input<any>,
				setter: v => this.set([...(v as T[])]),
			})

		return input
	}

	/** The array as it stands, with one item swapped. */
	private _withItem(index: number, item: T): T[] {
		const array = [...this.state.value]
		array[index] = item
		return array
	}

	private _updateArrayItem(index: number, newValue: T): void {
		const currentArray = this._withItem(index, newValue)
		// The item already shows it, so the refresh this set runs doesn't rebuild it mid-edit.
		this.#rendered = snapshot(currentArray)

		// The binding target (if any) is synced by the state subscription in the constructor.
		this.state.set(currentArray)
		this.emit('change', currentArray)
	}

	set = (v: T[]): this => {
		// Items first: the set's refresh then finds `v` on screen and leaves it.
		this._recreateItems(v)
		this.state.set(v)
		this.emit('change', v)
		return this
	}

	private _recreateItems(array = this.state.value): void {
		for (const item of this.items) {
			item.dispose()
		}
		this.items = []
		this.folder.inputs.clear()
		this.#overflowNote?.remove()
		this.#overflowNote = undefined

		this._createArrayItems(array)
	}

	/**
	 * Reads the bound field on {@link refresh} only when it holds something other than what the
	 * items show: the store never finds two arrays equal, so an unconditional read would
	 * re-notify forever.  Silent: no `change`, and no undo step.
	 */
	protected override readBinding() {
		const binding = this.opts.binding
		if (!binding) return

		const next = binding.target[binding.key]
		if (!Array.isArray(next) || snapshot(next) === this.#rendered) return

		this._recreateItems(next)
		this.state.set(next)
	}

	dispose(): void {
		for (const item of this.items) {
			item.dispose()
		}
		this.folder.dispose()
		super.dispose()
	}
}
