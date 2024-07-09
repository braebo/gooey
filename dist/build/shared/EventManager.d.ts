export type EventCallback<T = any> = (...args: T[]) => void;
/**
 * Represents an event manager that provides methods for adding and removing event listeners.
 */
export declare class EventManager<EventMap extends Record<string, any>> {
    private _unlisteners;
    /**
     * The event handlers for each registered custom event type, and their respective callbacks.
     */
    private _handlers;
    private _listenerGroups;
    private _log;
    constructor(events?: Array<keyof EventMap>);
    /**
     * Register new event type(s) for use via {@link on}.
     */
    registerEvents(events: Array<keyof EventMap>): void;
    /**
     * Register a new event listener.
     * @param event - The name of the event to listen for.
     * @param callback - The callback function to execute when the event is fired.
     * @returns The ID of the listener (for use via {@link unlisten} to remove the listener).
     */
    on<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): string;
    /**
     * Emit an event to all registered listeners.
     * @param event - The name of the event to emit.
     * @param args - The arguments to pass to the event listeners.
     */
    emit<K extends keyof EventMap>(event: K, ...args: EventMap[K][]): void;
    /**
     * Add an event listener to an HTMLElement that will be removed when {@link dispose} is called.
     * @param element - The element to add the listener to.
     * @param event - The event to listen for.
     * @param callback - The callback function to execute when the event is fired.
     * @param options - Optional event listener options.
     * @param groupId - Optional group ID to add the listener to (for batch removal).
     */
    listen: <TTarget extends Element | Window | Document, TEventName extends keyof GlobalEventHandlersEventMap | (string & {}), TEventInstance extends TEventName extends keyof GlobalEventHandlersEventMap ? GlobalEventHandlersEventMap[TEventName] & {
        target: TTarget;
    } : Event>(element: TTarget, event: TEventName, callback: (e: TEventInstance) => void, options?: AddEventListenerOptions, groupId?: string) => string;
    /**
     * Add a listener to the event manager without attaching it to an element.
     * @param cb - The callback function to execute when the event is fired.
     * @param groupId - Optional group ID to add the listener to (for batch
     * removal via {@link clearGroup}).
     * @returns The ID generated for the listener (for removal via {@link unlisten}).
     */
    add: (cb: () => void, groupId?: string) => string;
    /**
     * Add a listener to a group by id, enabling batch removal via {@link clearGroup}.
     * @param groupId - The ID of the group to add the listener ID to.
     * @param listenerId - The ID of the listener to add to the group.
     */
    group(groupId: string, listenerId: string): this;
    /**
     * Call the listener callback with the specified ID, then remove it.
     * @param id - The ID of the listener to remove.
     * @returns `true` if the listener was removed, `false` if it was not found.
     */
    unlisten(id: string): boolean;
    /**
     * Calls all cleanup callbacks and clears the event manager.
     */
    clear(): this;
    /**
     * Remove all registered event handlers.
     */
    clearHandlers(): this;
    /**
     * Remove all listeners in a group by ID.
     * @param groupId - The ID of the group to clear.
     */
    clearGroup(groupId: string): this;
    /**
     * Removes all registered listeners.
     */
    dispose(): void;
}
