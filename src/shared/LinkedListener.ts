/**
 * A callback that can be added to a ticker.
 */
export type EventCallback<T extends any = any> = (...args: T[]) => void

/**
 * Options for {@link LinkedListener}.
 */
export interface LinkedListenerOptions {
	/**
	 * The context to call the callback with.
	 * @default this
	 */
	ctx?: any
	/**
	 * If `true`, the listener will be removed after the first emit.
	 * @default false
	 */
	once?: boolean
}

/**
 * A linked-list node with a callback function.
 *
 * Original inspiration from {@link https://github.com/pixijs/pixijs/blob/dev/src/ticker/TickerListener.ts|pixijs}
 */
export class LinkedListener {
	head: LinkedListener | null = null
	next: LinkedListener | null = null
	previous: LinkedListener | null = null

	private ctx: LinkedListener | null
	private _once: boolean
	private _disposed = false

	constructor(
		public cb: EventCallback | null,
		options?: Partial<LinkedListenerOptions>,
	) {
		this.head = this
		this.ctx = options?.ctx ?? this
		this._once = options?.once ?? false
	}

	/**
	 * Emit by calling the current callback function.
	 * @param evm - The {@link EventManager} emitting.
	 * @returns The next listener.
	 */
	emit(...args: any[]): LinkedListener | null {
		this.assertNotDisposed()
		if (this.cb) {
			if (this.ctx) {
				this.cb.call(this.ctx, ...args)
			} else {
				;(this as LinkedListener).cb!(...args)
			}
		}

		const redirect = this.next

		if (this._once) this.dispose()

		return redirect
	}

	/**
	 * Add a new callback to the list.  All new nodes should be created using this method.
	 */
	add(cb: EventCallback, options?: LinkedListenerOptions): LinkedListener {
		const node = new LinkedListener(cb, options)
		node.head = this.head
		this._connect(node)
		return node
	}

	/**
	 * Connect to the list.
	 * @param previous - Input node, previous listener
	 */
	private _connect(previous: LinkedListener): void {
		this.assertNotDisposed()
		this.previous = previous
		if (previous.next) {
			previous.next.previous = this
		}
		this.next = previous.next
		previous.next = this
	}

	assertNotDisposed(): void {
		if (this._disposed) throw new Error('Illegal call to disposed LinkedListener.')
	}

	disconnect(): void {
		if (this.previous) {
			this.previous.next = this.next
		}
		if (this.next) {
			this.next.previous = this.previous
		}
		this.next = null
		this.previous = null
	}

	dispose() {
		this.assertNotDisposed()
		this._disposed = true
		this.cb = null

		// Disconnect, hook up next and previous
		if (this.previous) {
			this.previous.next = this.next
		}

		if (this.next) {
			this.next.previous = this.previous
		}

		// Redirect to the next item
		const redirect = this.next

		// Remove references
		this.next = null
		this.previous = null

		return redirect
	}
}
