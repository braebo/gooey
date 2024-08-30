import type { JavascriptStyleProperty } from '../shared/css-types'
import type { InputButtonGrid } from '../inputs/InputButtonGrid'
import type { TooltipOptions } from '../shared/Tooltip'

import { create, type CreateOptions } from '../shared/create'
import { EventManager } from '../shared/EventManager'
import { Logger } from '../shared/logger'
import { nanoid } from '../shared/nanoid'
import { toFn } from '../shared/toFn'

export type ButtonClickFunction = () => void

export type ButtonEventPayload = {
	event: MouseEvent & { target: HTMLButtonElement }
	button: ButtonController
}

export interface ButtonControllerOptions {
	readonly __type?: 'ButtonControllerOptions'

	/**
	 * The text or HTML to display on the button.  If a function is passed, it will be called
	 * on {@link ButtonController.refresh|`refresh`}.
	 * @defaultValue `'click me'`
	 */
	text: string | (() => string)

	/**
	 * Callback function to run when the button is clicked.  It is passed an object containing the
	 * click event, and individual instance of the {@link ButtonController} that was clicked.
	 *
	 * If not provided, the click event can still be listened to via the `click` event on the
	 * {@link ButtonController.on} method.
	 * @defaultValue `undefined`
	 */
	onClick?: (data: ButtonEventPayload) => void

	/**
	 * Set this option to override the default id applied to the button element.  By default, the
	 * id is generated by the {@link Logger} class.
	 *
	 * In an {@link InputButtonGrid}, the id is also used as the key in the
	 * {@link InputButtonGrid.buttons} map for easy access.
	 */
	id?: string

	/**
	 * If true, the button will be disabled.  A function can be passed for dynamic disabling, as it
	 * will be called whenever the button is refreshed.
	 * @defaultValue `false`
	 */
	disabled?: boolean | (() => boolean)

	/**
	 * Optional css style overrides in {@link JavascriptStyleProperty} (camelCase) format.
	 * @example
	 * ```ts
	 * {
	 *   width: '50%',
	 *   'backgroundColor': 'red',
	 *   border: '1px solid #000',
	 * }
	 * ```
	 * @defaultValue `undefined`
	 */
	style?: CreateOptions['style']

	/**
	 * Optional {@link TooltipOptions}.
	 * @defaultValue `undefined`
	 */
	tooltip?: Partial<TooltipOptions>

	/**
	 * An arbitrary value used externally by {@link InputButtonGrid}.  If a function is passed, it
	 * will be called whenever the button is refreshed.
	 * @defaultValue `false`
	 */
	active?: boolean | (() => boolean)

	/**
	 * The button element to wrap.  If not provided, a new button element is created.
	 * @defaultValue `undefined`
	 */
	element?: HTMLButtonElement

	/**
	 * If provided, the button will be appended to this parent element.
	 * @defaultValue `undefined`
	 */
	parent?: HTMLElement
}

export interface ButtonControllerEvents {
	/**
	 * Fires when the button is updated externally via the {@link ButtonController.set} method.
	 */
	change: ButtonController
	/**
	 * Fires when the button is clicked.
	 */
	click: ButtonEventPayload
	/**
	 * Fires when the button is refreshed via the {@link ButtonController.refresh} method.
	 */
	refresh: void
}

export const BUTTON_INPUT_DEFAULTS: ButtonControllerOptions = {
	__type: 'ButtonControllerOptions' as const,
	text: () => 'click me',
	onClick: () => void 0,
	id: nanoid(8),
	disabled: false,
	style: undefined,
	tooltip: undefined,
	active: false,
	element: undefined,
	parent: undefined,
} as const

export class ButtonController {
	readonly __type = 'ButtonController' as const
	static is(v: any): v is ButtonController {
		return v?.__type === 'ButtonController' && v instanceof ButtonController
	}

	private _text!: () => string
	private _active = () => false
	private _disabled = () => false

	element: HTMLButtonElement
	parent: HTMLElement | undefined

	private _evm = new EventManager<ButtonControllerEvents>(['change', 'refresh', 'click'])
	on = this._evm.on.bind(this._evm)

	private _log = new Logger('ButtonController', { fg: 'coral' })

	constructor(options: Partial<ButtonControllerOptions>) {
		const opts = Object.assign({}, BUTTON_INPUT_DEFAULTS, options)
		this._log.fn('constructor').debug({ opts, this: this })

		this.element = opts.element
			? opts.element
			: create('button', {
					id: opts.id ?? nanoid(8),
					classes: ['gooey-controller', 'gooey-controller-button'],
					parent: opts.parent,
				})

		this.text = opts.text
		this.active = opts.active
		if (typeof opts.disabled !== 'undefined') this.disabled = opts.disabled

		this._evm.listen(this.element, 'click', this.click)

		if (opts.onClick) {
			this._evm.on('click', opts.onClick)
		}
	}

	get id() {
		return this.element.id
	}

	get text(): string {
		return this._text()
	}
	set text(value: string | (() => string)) {
		this._text = toFn(value)
		this.element.innerHTML = this._text()
	}

	get active(): boolean {
		return this._active()
	}
	set active(value: boolean | (() => boolean) | undefined) {
		if (typeof value === 'undefined') return
		this._active = toFn(value)
		// this.element.classList.toggle('active', this._active())
	}

	/**
	 * Set this to `true` to disable the button.  If a function is assigned, it will be called
	 * whenever the button is refreshed.
	 */
	get disabled(): boolean {
		return this._disabled()
	}
	set disabled(value: boolean | (() => boolean) | undefined) {
		if (typeof value === 'undefined') return
		this._disabled = toFn(value)
		this._disabled() ? this.disable() : this.enable()
	}

	/**
	 * Update the button with new options.
	 */
	set(options: Partial<ButtonControllerOptions>) {
		Object.assign(this, options)
		this._evm.emit('change', this)
		this.refresh()
	}

	click = (event: MouseEvent & { target: HTMLButtonElement }) => {
		this._log.fn('click').debug({ this: this })
		this._evm.emit('click', { event, button: this })
		this.refresh()
	}

	enable = () => {
		if (this.disabled) return (this.disabled = false)
		this.element.classList.remove('disabled')
		this.element.removeAttribute('disabled')
		return this
	}

	disable = () => {
		if (!this.disabled) return (this.disabled = true)
		this.element.classList.add('disabled')
		this.element.setAttribute('disabled', 'true')
		return this
	}

	refresh = () => {
		this.element.toggleAttribute('disabled', this.disabled)
		this.element.classList.toggle('disabled', this.disabled)
		this.element.innerHTML = this.text
		// this.element.classList.toggle('active', this.active)
		this._evm.emit('refresh')
		return this
	}

	toJSON() {
		return {
			__type: this.__type,
			id: this.id,
			text: this.text,
			active: this.active,
			disabled: this.disabled,
		}
	}

	dispose() {
		this.element.remove()
		this._evm.dispose()
	}
}
