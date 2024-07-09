/**
 * A linked-list node with a callback function.
 *
 * Original inspiration from {@link https://github.com/pixijs/pixijs/blob/dev/src/ticker/TickerListener.ts|pixijs}
 */
export class LinkedListener {
    cb;
    head = null;
    next = null;
    previous = null;
    ctx;
    _once;
    _disposed = false;
    constructor(cb, options) {
        this.cb = cb;
        this.head = this;
        this.ctx = options?.ctx ?? this;
        this._once = options?.once ?? false;
    }
    /**
     * Emit by calling the current callback function.
     * @param evm - The {@link EventManager} emitting.
     * @returns The next listener.
     */
    emit(...args) {
        this.assertNotDisposed();
        if (this.cb) {
            if (this.ctx) {
                this.cb.call(this.ctx, ...args);
            }
            else {
                ;
                this.cb(...args);
            }
        }
        const redirect = this.next;
        if (this._once)
            this.dispose();
        return redirect;
    }
    /**
     * Add a new callback to the list.  All new nodes should be created using this method.
     */
    add(cb, options) {
        const node = new LinkedListener(cb, options);
        node.head = this.head;
        this._connect(node);
        return node;
    }
    /**
     * Connect to the list.
     * @param previous - Input node, previous listener
     */
    _connect(previous) {
        this.assertNotDisposed();
        this.previous = previous;
        if (previous.next) {
            previous.next.previous = this;
        }
        this.next = previous.next;
        previous.next = this;
    }
    assertNotDisposed() {
        if (this._disposed)
            throw new Error('Illegal call to disposed LinkedListener.');
    }
    disconnect() {
        if (this.previous) {
            this.previous.next = this.next;
        }
        if (this.next) {
            this.next.previous = this.previous;
        }
        this.next = null;
        this.previous = null;
    }
    dispose() {
        this.assertNotDisposed();
        this._disposed = true;
        this.cb = null;
        // Disconnect, hook up next and previous
        if (this.previous) {
            this.previous.next = this.next;
        }
        if (this.next) {
            this.next.previous = this.previous;
        }
        // Redirect to the next item
        const redirect = this.next;
        // Remove references
        this.next = null;
        this.previous = null;
        return redirect;
    }
}
