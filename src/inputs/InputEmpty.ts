//! wip
// @ts-nocheck

import type { InputOptions, ValidInput } from './Input'
import type { State } from '../shared/state'
import type { Folder } from '../Folder'

import { textController } from '../controllers/text'
import { create } from '../shared/create'
import { Logger } from '../shared/logger'
import { state } from '../shared/state'
import { Input } from './Input'

export type EmptyInputOptions = InputOptions<string> & {
	readonly __type?: 'EmptyInputOptions'
	readonly type: 'empty'
}

export interface EmptyControllerElements {
	container: HTMLElement
}

export const EMPTY_INPUT_DEFAULTS = {
	__type: 'EmptyInputOptions' as const,
	type: 'empty' as const,

	value: '',
} as const satisfies EmptyInputOptions

export class InputEmpty extends Input {
	readonly __type = 'InputEmpty' as const
	readonly type = 'empty' as const

	readonly initialValue: string
	readonly state: State<string>

	#log: Logger

	constructor(options: Partial<EmptyInputOptions>, folder: Folder) {
		const opts = Object.assign({}, EMPTY_INPUT_DEFAULTS, options)
		super(opts, folder)

		this.#log = new Logger(`InputText ${opts.title}`, { fg: 'cyan' })
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

		this.elements.container = create('div', {
			classes: ['gooey-input-text-container'],
			parent: this.elements.content,
		})

		this._evm.add(
			this.state.subscribe(() => {
				this.refresh()
			}),
		)
	}

	addText(text: string) {
		const input = textController(this as unknown as ValidInput, {
			value: text,
			binding: {
				target: this.elements.controllers,
				key: 'text',
			},
		})
		this._evm.listen(input, 'input', this.set)
	}

	enable() {
		this.disabled = false
		this.elements.container.classList.remove('disabled')
		return this
	}

	disable() {
		this.disabled = true
		this.elements.container.classList.add('disabled')
		return this
	}

	set = (v?: string | Event) => {
		if (typeof v === 'undefined') return

		if (typeof v !== 'string') {
			if (v?.target && 'value' in v.target) {
				this.commit({ to: v.target.value as string })
				this.state.set(v.target.value as string)
			}
		} else {
			this.commit({ to: v })
			this.state.set(v)
		}

		this.emit('change', this.state.value)
		return this
	}

	refresh = () => {
		const v = this.state.value
		this.elements.container.innerHTML = v
		super.refresh(v)
		return this
	}

	dispose() {
		super.dispose()
	}
}
