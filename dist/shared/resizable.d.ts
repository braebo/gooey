import { State } from "./state.js";
import { ElementOrSelector, ElementsOrSelectors } from "./select.js";

//#region src/shared/resizable.d.ts

/**
 * The sides of an element that can be resized by the {@link resizable} action.
 */
type Side = 'top' | 'right' | 'bottom' | 'left';
/**
 * Options for the {@link resizable} action.
 */
interface ResizableOptions {
  __type?: 'ResizableOptions';
  /**
   * To only allow resizing on certain sides, specify them here.
   * @default ['right', 'bottom']
   */
  sides: Side[];
  /**
   * To only allow resizing on certain corners, specify them here.
   * @default ['bottom-right']
   */
  corners: ('top-left' | 'top-right' | 'bottom-right' | 'bottom-left')[];
  /**
   * The size of the resize handle in pixels.
   * @default 6
   */
  grabberSize: number;
  /**
   * Optional callback function that runs when the element is resized.
   * @default () => void
   */
  onResize: (size: {
    width: number;
    height: number;
  }) => void;
  /**
   * If provided, the size of the element will be persisted
   * to local storage under the specified key.
   * @default undefined
   */
  localStorageKey?: string;
  /**
   * Use a visible or invisible gutter.
   * @default false
   */
  visible: boolean;
  /**
   * Gutter css color (if visible = `true`)
   * @default 'var(--fg-d, #1d1d1d)'
   */
  color: string;
  /**
   * The max opacity (0-1) when hovering/dragging a grabber.
   * @default 1
   */
  opacity: number;
  /**
   * Border radius of the element.
   * @default '0.5rem'
   */
  borderRadius: string;
  /**
   * The element to use as the bounds for resizing.
   * @default window['document']['documentElement']
   */
  bounds: ElementOrSelector;
  /**
   * Element's or selectors which will act as collision obstacles for the draggable element.
   */
  obstacles: ElementsOrSelectors;
  /**
   * Whether to apply different `cursor` values to grabbers.
   */
  cursors: boolean;
  /**
   * The classnames to apply to the resize grabbers, used for styling.
   * @default { default: 'resize-grabber', active: 'resize-grabbing' }
   */
  classes: {
    /** @default 'resize-grabber' */
    default: string;
    /** @default 'resize-grabbing' */
    active: string;
  };
  /**
   * Whether the element is disabled.
   * @default false
   */
  disabled: boolean;
  /**
   * If provided, the element's initial size will be set to the provided width and/or height.
   * @default undefined
   */
  initialSize?: {
    width?: number;
    height?: number;
  };
}
/**
 * Makes an element resizable by dragging its edges.  For the
 * svelte-action version, see {@link resizable}.
 *
 * @param node - The element to make resizable.
 * @param options - {@link ResizableOptions}
 *
 * @example Basic
 * ```ts
 * import { Resizable } from 'fractils'
 *
 * const node = document.createElement('div')
 * new Resizable(node)
 * ```
 *
 * @example Advanced
 * ```ts
 * import { Resizable } from 'fractils'
 *
 * const node = document.createElement('div')
 * new Resizable(node, {
 * 	sides: ['left', 'bottom'],
 * 	grabberSize: 3,
 * 	onResize: () => console.log('resized'),
 * 	localStorageKey: 'resizableL::size',
 * 	visible: false,
 * 	color: 'var(--fg-d)',
 * 	borderRadius: '0.5rem',
 * })
 * ```
 */
declare class Resizable {
  #private;
  node: HTMLElement;
  static readonly type: "Resizable";
  static initialized: boolean;
  id: string;
  opts: ResizableOptions;
  disabled: boolean;
  bounds: HTMLElement;
  obstacleEls: HTMLElement[];
  size: State<{
    width: number;
    height: number;
  }>;
  constructor(node: HTMLElement, options?: Partial<ResizableOptions>);
  get boundsRect(): DOMRect;
  createGrabbers(): void;
  clickOffset: {
    x: number;
    y: number;
  };
  onGrab: (e: PointerEvent) => void;
  get translateX(): number;
  set translateX(v: number);
  get translateY(): number;
  set translateY(v: number);
  get rect(): DOMRect;
  resizeX: (x: number, borderleft?: boolean) => this;
  resizeY: (y: number, bordertop?: boolean) => this;
  /**
   * Resizes the {@link node} to the target size, clamped to the {@link bounds} and the
   * element's own computed `min-width` / `max-width` / `min-height` / `max-height` -- the same
   * clamps a drag on a grabber respects.  An omitted dimension is left alone, and `height` is
   * ignored unless a grabber could have changed it -- i.e. a vertical
   * {@link ResizableOptions.sides|side} or any {@link ResizableOptions.corners|corner}.
   *
   * @example
   * ```ts
   * resizable.resize({ width: 400 })
   * resizable.resize({ width: 400, height: 300 })
   * ```
   */
  resize(target: {
    width?: number;
    height?: number;
  }): this;
  /**
   * This is where all the resizing logic happens.
   */
  onMove: (e: PointerEvent) => void;
  onUp: () => void;
  /**
   * Creates the global stylesheet (but only once).
   */
  generateStyles(): void;
  dispose(): void;
}
//#endregion
export { Resizable, ResizableOptions };
//# sourceMappingURL=resizable.d.ts.map