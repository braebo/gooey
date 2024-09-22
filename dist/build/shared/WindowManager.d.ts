import type { ElementOrSelector, ElementsOrSelectors } from './select';
import { Resizable, type ResizableOptions } from './resizable';
import { Draggable, type DraggableOptions } from './draggable';
export interface WindowManagerOptions {
    __type?: 'WindowManagerOptions';
    /**
     * Whether to make windows draggable. Can be a boolean, or your own
     * {@link DraggableOptions}.  Set to `false` to disable dragging.
     * @default true
     */
    draggable: boolean | Partial<DraggableOptions>;
    /**
     * Whether to make windows resizable. Can be a boolean, or your own
     * {@link ResizableOptions}.  Set to `false` to disable resizing.
     * @default true
     */
    resizable: boolean | Partial<ResizableOptions>;
    /**
     * Element's or selectors which will act as collision obstacles for the element.
     * @default ''
     */
    obstacles: ElementsOrSelectors;
    /**
     * Element's or selectors which will act as bounds obstacles for the element.
     * @default ''
     */
    bounds: ElementOrSelector;
    /**
     * The base z-index value.
     * @default 10
     */
    zFloor: number;
    /**
     * Restores a selected window's z-index immediately upon release.
     * @default false
     */
    preserveZ: boolean;
    /**
     * If defined, position and/or size will be persisted to localStorage.
     *
     * `true` to use the {@link WINDOWMANGER_STORAGE_DEFAULTS}.
     *
     * @defaultValue `undefined`
     *
     * @see WindowManagerStorageOptions
     */
    localStorage?: boolean | WindowManagerStorageOptions;
}
interface WindowManagerStorageOptions {
    __type?: 'WindowManagerStorageOptions';
    /**
     * Prefix to use for localStorage keys.
     * @default "window-manager"
     */
    key: string;
    /**
     * Whether to persist the size of {@link resizable} windows.
     * @default true
     */
    size?: boolean;
    /**
     * Whether to persist the position of {@link draggable} windows.
     * @default true
     */
    position?: boolean;
    /**
     * How long to debounce writes to localStorage (0 to disable).
     * @default 50
     */
    debounce?: number;
}
export declare const WINDOWMANGER_STORAGE_DEFAULTS: {
    readonly __type: "WindowManagerStorageOptions";
    readonly key: "window-manager";
    readonly size: true;
    readonly position: true;
    readonly debounce: 50;
};
export declare const WINDOWMANAGER_DEFAULTS: {
    readonly __type: "WindowManagerOptions";
    readonly resizable: ResizableOptions;
    readonly draggable: DraggableOptions;
    readonly zFloor: 10;
    readonly preserveZ: false;
    readonly bounds: undefined;
    readonly obstacles: undefined;
    readonly localStorage: undefined;
};
/**
 * Manages multiple draggable and/or resizable {@link WindowInstance}s.
 *
 * {@link WindowManager.windows|`windows`} can be added, removed, and their
 * z-index values are managed to ensure the most recently selected element is on top.
 * @todo Add examples
 */
export declare class WindowManager {
    /**
     * A map of all windows managed by the instance.  The key is the window's id specified in the
     * options for each window.
     */
    windows: Map<string, WindowInstance>;
    /**
     * The initial {@link WindowManagerOptions} provided.
     */
    readonly opts: WindowManagerOptions;
    private _log;
    private _evm;
    constructor(options?: Partial<WindowManagerOptions>);
    add: (node: HTMLElement, options?: Partial<WindowInstanceOptions>) => {
        window: WindowInstance;
        destroy: () => void;
    };
    update(): void;
    applyZ(): this;
    select: (e: PointerEvent) => this;
    private _resolveOptions;
    /**
     * Dispose of the instance and all windows.
     */
    dispose(): void;
}
export type WindowInstanceOptions = Partial<WindowManagerOptions> & {
    /**
     * A unique identifier for the window, making it accessible via the
     * {@link WindowManager.windows|`windows`} map (i.e. `windowManager.windows.get(id)`).
     *
     * If not provided, a random id will be generated.
     * @default nanoid()
     */
    id?: string;
};
/**
 * A single window in a window manager.
 */
export declare class WindowInstance {
    manager: WindowManager;
    node: HTMLElement;
    draggableInstance?: Draggable;
    resizableInstance?: Resizable;
    id: string;
    size: import("./state").PrimitiveState<{
        width: number;
        height: number;
    }>;
    get position(): {
        x: number;
        y: number;
    };
    set position(position: {
        x?: number;
        y?: number;
    });
    moveTo: (position: {
        x: number;
        y: number;
    }) => void;
    moveBy: (delta: {
        x?: number;
        y?: number;
    }) => void;
    constructor(manager: WindowManager, node: HTMLElement, options?: WindowInstanceOptions);
    dispose(): void;
}
export {};
