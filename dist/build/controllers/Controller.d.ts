import type { ElementMap } from '../inputs/Input';
import { EventManager } from '../shared/EventManager';
export declare abstract class Controller<TValue, TElements extends ElementMap = ElementMap, TEvents extends Record<string, any> = {
    change: TValue;
    refresh: void;
}> {
    abstract _evm: EventManager<TEvents>;
    /**
     * All elements created by the controller.
     */
    abstract elements: TElements;
    /**
     * Usually the 'container' element for the controller if it has one.
     * Otherwise, the main element of the controller if there's only one.
     */
    abstract element: Element;
    /**
     * Whether the controller has been disposed.
     */
    disposed: boolean;
    private _disabled;
    /**
     * Whether the controller is disabled.  A function can be used to
     * dynamically determine the disabled state.
     */
    get disabled(): boolean;
    set disabled(v: boolean | (() => boolean));
    constructor(opts: Record<string, any> & {
        disabled: boolean | (() => boolean);
    });
    get on(): <K extends keyof TEvents>(event: K, callback: import("../shared/EventManager").EventCallback<TEvents[K]>) => string;
    get listen(): <K extends keyof TEvents>(event: K, callback: import("../shared/EventManager").EventCallback<TEvents[K]>) => string;
    get emit(): <K extends keyof TEvents>(event: K, ...args: TEvents[K][]) => void;
    enable(): void;
    disable(): void;
    abstract refresh: () => this;
    dispose(): void;
}
