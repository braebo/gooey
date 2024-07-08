/**
 * A callback that can be added to a ticker.
 */
export type EventCallback<T extends any = any> = (...args: T[]) => void;
/**
 * Options for {@link LinkedListener}.
 */
export interface LinkedListenerOptions {
    /**
     * The context to call the callback with.
     * @default this
     */
    ctx?: any;
    /**
     * If `true`, the listener will be removed after the first emit.
     * @default false
     */
    once?: boolean;
}
/**
 * A linked-list node with a callback function.
 *
 * Original inspiration from {@link https://github.com/pixijs/pixijs/blob/dev/src/ticker/TickerListener.ts|pixijs}
 */
export declare class LinkedListener {
    cb: EventCallback | null;
    head: LinkedListener | null;
    next: LinkedListener | null;
    previous: LinkedListener | null;
    private ctx;
    private _once;
    private _disposed;
    constructor(cb: EventCallback | null, options?: Partial<LinkedListenerOptions>);
    /**
     * Emit by calling the current callback function.
     * @param evm - The {@link EventManager} emitting.
     * @returns The next listener.
     */
    emit(...args: any[]): LinkedListener | null;
    /**
     * Add a new callback to the list.  All new nodes should be created using this method.
     */
    add(cb: EventCallback, options?: LinkedListenerOptions): LinkedListener;
    /**
     * Connect to the list.
     * @param previous - Input node, previous listener
     */
    private _connect;
    assertNotDisposed(): void;
    disconnect(): void;
    dispose(): LinkedListener | null;
}
