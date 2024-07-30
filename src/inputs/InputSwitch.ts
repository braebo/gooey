import type { ElementMap, InputOptions } from './Input'
import type { Tooltip } from '../shared/Tooltip'
import type { State } from '../shared/state'
import type { Folder } from '../Folder'

import { Logger } from '../shared/logger'
import { create } from '../shared/create'
import { state } from '../shared/state'
import { Input } from './Input'

/**
 * Options for the {@link InputSwitch} class.
 */
export type SwitchInputOptions = InputOptions<boolean> & {
	readonly __type?: 'SwitchInputOptions'
	/** Text to display in various parts of the switch. */
	labels?: {
		/** Text to display when the state is `true` */
		true: {
			/**
			 * Represents the `true` state, i.e. `'on' | 'active' | 'enabled'`
			 * @default 'on'
			 */
			state?: string
			/**
			 * Represents, i.e. `'turn on' | 'activate' | 'enable'`.
			 * Displayed on the tooltip when the switch is `false`.
			 * @default 'Enable'
			 */
			verb?: string
		}
		/** Text to display when the state is `false` */
		false: {
			/**
			 * Represents the `false` state, i.e. `'off' | 'inactive' | 'disabled'`
			 * @default 'off'
			 */
			state?: string
			/**
			 * Represents the action, i.e. `'turn off' | 'deactivate' | 'disable'`.
			 * Displayed on the tooltip when the switch is `true`.
			 * @default 'Disable'
			 */
			verb?: string
		}
	}
}

export const SWITCH_INPUT_DEFAULTS = {
	__type: 'SwitchInputOptions' as const,
	value: true,
	labels: {
		true: {
			state: 'on',
			verb: 'Enable',
		},
		false: {
			state: 'off',
			verb: 'Disable',
		},
	},
} as const satisfies SwitchInputOptions

export interface SwitchInputElements extends ElementMap {
	container: HTMLElement
	input: HTMLButtonElement & { tooltip: Tooltip }
	thumb: HTMLDivElement
	stateText: HTMLDivElement
}

/**
 * A switch {@link Input} for booleans.
 */
export class InputSwitch extends Input<boolean, SwitchInputOptions, SwitchInputElements> {
	readonly __type = 'InputSwitch' as const
	readonly state: State<boolean>

	initialValue: boolean
	#log: Logger

	constructor(options: Partial<SwitchInputOptions>, folder: Folder) {
		const opts = Object.assign({}, SWITCH_INPUT_DEFAULTS, options)
		super(opts, folder)

		this.#log = new Logger(`InputSwitch ${opts.title}`, { fg: 'cyan' })
		this.#log.fn('constructor').debug({ opts, this: this })

		if (opts.binding) {
			// Bind the state to the target object.
			this.initialValue = opts.binding.target[opts.binding.key]
			this.state = state(!!this.initialValue)

			this._evm.add(
				this.state.subscribe(v => {
					opts.binding!.target[opts.binding!.key] = v
				}),
			)
		} else {
			// Create a new observable state.
			this.initialValue = opts.value!
			this.state = state(!!opts.value!)
		}

		//- Container
		const container = create('div', {
			classes: ['gooey-input-switch-container'],
			parent: this.elements.content,
		})

		//- Switch Button
		const input = create('button', {
			classes: ['gooey-controller', 'gooey-controller-switch'],
			parent: container,
			tooltip: {
				text: () => {
					return (
						(this.state.value ? opts.labels?.false.verb : opts.labels?.true.verb) || ''
					)
				},
				// @ts-expect-error
				style: this.folder.gooey?._getStyles,
				anchor: '.gooey-controller-switch-thumb',
				delay: 750,
			},
		})
		const thumb = create('div', {
			classes: ['gooey-controller-switch-thumb'],
			parent: input,
		})

		//- State Text
		const stateText = create('div', {
			classes: ['gooey-controller-switch-state-text'],
			parent: container,
			innerText: this.state.value ? opts.labels?.true.state : opts.labels?.false.state,
			style: {
				opacity: '0.75',
			},
		})

		this.elements.controllers = {
			container,
			input,
			thumb,
			stateText,
		} as const satisfies SwitchInputElements

		this._evm.listen(this.elements.controllers.input, 'click', () => this.set())
		this._evm.add(this.state.subscribe(this.refresh.bind(this)))
	}

	set(v = !this.state.value): this {
		this.#log.fn('set').debug({ v, this: this })

		if (typeof v === 'boolean') {
			this.undoManager?.commit({
				// @ts-expect-error - ¯\_(ツ)_/¯
				target: this,
				from: this.state.value,
				to: v,
			})
			this.state.set(v)
		} else {
			throw new Error(
				`InputBoolean.set() received an invalid value: ${JSON.stringify(v)} (${typeof v})`,
			)
		}

		this._emit('change', v)
		return this
	}

	refresh(v?: boolean): this {
		if (this.disabled) return this
		this.#log.fn('refresh').debug({ v, this: this })

		if (typeof v === 'undefined') {
			v = this.opts.binding
				? this.opts.binding.target[this.opts.binding.key]
				: this.state.value
		}

		this.elements.controllers.input.classList.toggle('active', v)
		this.elements.controllers.input?.tooltip?.refresh()
		this.elements.controllers.stateText.innerText =
			(this.state.value ? this.opts.labels?.true.state : this.opts.labels?.false.state) ?? ''

		this._emit('refresh', v)
		return this
	}

	enable(): this {
		this.elements.controllers.input.disabled = false
		this.disabled = false
		// super.enable()
		return this
	}
	disable(): this {
		this.elements.controllers.input.disabled = true
		this.disabled = true
		// super.disable()
		return this
	}

	dispose(): void {
		this.elements.controllers.input.tooltip?.dispose()
		super.dispose()
	}
}
