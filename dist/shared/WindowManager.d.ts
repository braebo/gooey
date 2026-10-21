import { State } from "./state.js";
import { ElementOrSelector, ElementsOrSelectors } from "./select.js";
import { Resizable, ResizableOptions } from "./resizable.js";
import { Draggable, DraggableOptions } from "./draggable.js";

//#region src/shared/WindowManager.d.ts
interface WindowManagerOptions {
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
   * Prefix to use for localStorage keys.  Each window appends its own
   * {@link WindowInstanceOptions.storageId|storageId}, i.e.
   * `"window-manager::wm::inspector::position"`.
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
declare const WINDOWMANGER_STORAGE_DEFAULTS: {
  readonly __type: "WindowManagerStorageOptions";
  readonly key: "window-manager";
  readonly size: true;
  readonly position: true;
  readonly debounce: 50;
};
declare const WINDOWMANAGER_DEFAULTS: {
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
declare class WindowManager {
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
type WindowInstanceOptions = Partial<WindowManagerOptions> & {
  /**
   * A unique identifier for the window, making it accessible via the
   * {@link WindowManager.windows|`windows`} map (i.e. `windowManager.windows.get(id)`).
   *
   * If not provided, a random id will be generated.
   * @default nanoid()
   */
  id?: string;
  /**
   * A _stable_ identifier used to key this window's persisted position / size in
   * localStorage.  Unlike {@link id}, it must be the same on every page load -- it is the
   * only way for a window to find its own saved layout again.
   *
   * Resolution order, highest priority first:
   *
   * 1. this option
   * 2. the `id` attribute already present on the node when it was added
   * 3. the window's insertion index _(fallback)_
   *
   * The insertion-index fallback is only stable for apps that always create the same
   * windows in the same order.  If the number or order of windows can vary between page
   * loads, windows will read each other's saved layouts -- pass a `storageId` (or give the
   * element an `id`) to avoid it.
   *
   * @remarks {@link id} is deliberately _not_ used, since it's often generated per-session
   * (i.e. {@link nanoid}), which would silently orphan every write.
   *
   * @default undefined
   */
  storageId?: string;
};
/**
 * A single window in a window manager.
 */
declare class WindowInstance {
  manager: WindowManager;
  node: HTMLElement;
  draggableInstance?: Draggable;
  resizableInstance?: Resizable;
  id: string;
  /**
   * The stable identity used to key this window's persisted position / size.
   * @see {@link WindowInstanceOptions.storageId}
   */
  storageId: string;
  /**
   * The window's current size -- the {@link Resizable.size|resizable's own state}, so it
   * follows both a drag on a grabber and a call to {@link resize}, and persists with it.
   */
  size: State<{
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
  /**
   * Resizes the window, clamped to the bounds and the node's own css min / max values.  An
   * omitted dimension is left alone.
   * @see {@link Resizable.resize}
   */
  resize: (size: {
    width?: number;
    height?: number;
  }) => void;
  constructor(manager: WindowManager, node: HTMLElement, options?: WindowInstanceOptions);
  dispose(): void;
}
//#endregion
export { WINDOWMANAGER_DEFAULTS, WINDOWMANGER_STORAGE_DEFAULTS, WindowInstance, WindowInstanceOptions, WindowManager, WindowManagerOptions };
//# sourceMappingURL=WindowManager.d.ts.map