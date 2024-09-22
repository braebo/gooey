import type { ElementMap, InputEvents, InputOptions } from './Input'
import type { State } from '../shared/state'
import type { Folder } from '../Folder'

import { ButtonController } from '../controllers/ButtonController'
import { Logger } from '../shared/logger'
import { create } from '../shared/create'
import { state } from '../shared/state'
import { Input } from './Input'
import { DEV } from 'esm-env'

export type ButtonClickFunction = (this: InputButton) => void

export type ButtonInputOptions = InputOptions<ButtonClickFunction> & {
	readonly __type?: 'ButtonInputOptions'
	text?: string | (() => string)
	/**
	 * The function to call when the button is clicked.
	 */
	value?: ButtonClickFunction
	/**
	 * An alias for {@link value} (does the same thing).
	 */
	onClick?: ButtonClickFunction
}

export const BUTTON_INPUT_DEFAULTS: ButtonInputOptions = {
	__type: 'ButtonInputOptions' as const,
	text: () => 'click me',
} as const

export interface ButtonControllerElements extends ElementMap {
	container: HTMLElement
	button: HTMLButtonElement
}

interface ButtonInputEvents extends InputEvents<InputButton> {
	click: void
}

export class InputButton extends Input<
	ButtonController,
	ButtonInputOptions,
	ButtonControllerElements,
	ButtonInputEvents
> {
	readonly __type = 'InputButton' as const
	readonly initialValue = {} as ButtonController
	readonly state = state({}) as State<ButtonController>

	onClick: ButtonClickFunction = () => {}

	button: ButtonController

	private _log: Logger

	constructor(options: Partial<ButtonInputOptions>, folder: Folder) {
		const opts = Object.assign({}, BUTTON_INPUT_DEFAULTS, options, {
			__type: 'ButtonInputOptions' as const,
		})
		opts.resettable ??= false

		super(opts, folder)
		this._evm.registerEvents(['change', 'refresh', 'click'])
		this._log = new Logger(`InputButton ${opts.title}`, { fg: 'cyan' })
		this._log.fn('constructor').debug({ opts, this: this })

		if (opts.value) this.onClick = opts.value
		else if (opts.onClick) this.onClick = opts.onClick
		else {
			if (DEV) {
				console.error(
					`${this.title} created with no onClick function. Use the 'value' or 'onClick' property to assign one.`,
				)
			}
		}

		const container = create('div', {
			classes: ['gooey-input-button-container'],
			parent: this.elements.content,
		})

		this.button = new ButtonController({
			text: opts.text,
			onClick: this.onClick.bind(this),
			parent: container,
		})

		this.elements.controllers = {
			container,
			button: this.button.element,
		} as const satisfies ButtonControllerElements

		this._evm.add(this.state.subscribe(this.refresh.bind(this)))
	}

	get text() {
		return this.button.text
	}
	set text(v: string | (() => string)) {
		this.button.text = v
	}

	/**
	 * Manually calls the {@link onClick} function.
	 */
	click() {
		this.button.click.call(this, { ...new MouseEvent('click'), target: this.button.element })
	}

	enable() {
		this.button.enable()
		super.enable()
		return this
	}

	disable() {
		this.button.disable()
		super.disable()
		return this
	}

	/**
	 * Overwrites the button state.
	 */
	set = (v: ButtonController | unknown) => {
		if (ButtonController.is(v)) {
			this.state.set(v)
		}
	}

	/**
	 * Refreshes the button text.
	 */
	refresh() {
		this.button.refresh()
		super.refresh()
		return this
	}

	dispose() {
		this.button.dispose()
		super.dispose()
	}
}
