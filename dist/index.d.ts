type ThemeTitle = string;
type ThemeVariant = 'light' | 'dark';
type ThemeMode = ThemeVariant | 'system';
/**
 * A collection of css custom properties that can be added to {@link ThemeDefinition.vars | theme vars}.
 *
 * @remarks Defining `base`, then adding mode-specific overrides, is the intended
 * pattern for defining themes, as `dark` and `light` are typically an
 * optional `Partial` of `base`.
 */
interface VariableDefinition {
    /** Variables applied to all modes. */
    base: Record<string, string>;
    /** Optional dark-mode overrides. */
    dark: Record<string, string>;
    /** Optional light-mode overrides. */
    light: Record<string, string>;
}
/**
 * All themes come with a default color definition that can be overridden with partials.
 *
 * All shades have light and dark variants, allowing all other colors to adapt to the mode.
 *
 * The `light` and `dark` variables are automatically generated from the `base` colors
 * if not overridden manually.
 */
interface ColorDefinition extends VariableDefinition {
    base: BaseColors;
    dark: Partial<ModeColors> & Record<string, string>;
    light: Partial<ModeColors> & Record<string, string>;
}
interface ColorTheme extends VariableDefinition {
    base: BaseColors;
    dark: ModeColors & Record<string, string>;
    light: ModeColors & Record<string, string>;
}
/**
 * Arbitrary variables that can be added to a theme.
 */
type ExtendedVars = {
    [key: string]: Partial<VariableDefinition>;
};
/**
 * The minimum required definition for a theme.
 */
type ThemeDefinition<T extends ExtendedVars = Record<string, any>> = {
    title: string;
    prefix?: string;
    vars: T & {
        color: ColorDefinition;
    };
    /**
     * Whether the theme dark/light modes have been generated
     * from the base colors, and should not be regenerated.
     * @internal
     */
    resolved?: boolean;
};
/**
 * A fully resolved theme with all variables applied.
 */
type Theme<T extends ExtendedVars = Record<string, any>> = {
    title: string;
    prefix: string;
    vars: {
        color: ColorTheme;
    } & {
        [key in keyof T]: VariableDefinition;
    };
    /**
     * Whether the theme dark/light modes have been generated
     * from the base colors, and should not be regenerated.
     * @internal
     */
    resolved?: boolean;
};
interface BaseColors {
    [key: string]: string;
    'theme-a': string;
    'dark-a': string;
    'dark-b': string;
    'dark-c': string;
    'dark-d': string;
    'dark-e': string;
    'light-a': string;
    'light-b': string;
    'light-c': string;
    'light-d': string;
    'light-e': string;
}
interface ModeColors {
    [key: string]: string;
    'bg-a': string;
    'bg-b': string;
    'bg-c': string;
    'bg-d': string;
    'bg-e': string;
    'fg-a': string;
    'fg-b': string;
    'fg-c': string;
    'fg-d': string;
    'fg-e': string;
}

type EventCallback<T = any> = (...args: T[]) => void;
/**
 * Represents an event manager that provides methods for adding and removing event listeners.
 */
declare class EventManager<EventMap extends Record<string, any>> {
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

/** Cleanup logic callback. */
type Invalidator<T> = (value?: T) => void;
/** Callback to inform of a value updates. */
type Subscriber<T> = (value: T) => void;
/** Unsubscribes from value updates. */
type Unsubscriber = () => void;
/** Callback to update a value. */
type Updater<T> = (value: T) => T;
/** Readable interface for subscribing. */
interface Readable<T> {
    /**
     * Subscribe on value changes.
     * @param run subscription callback
     * @param invalidate cleanup callback
     */
    subscribe(this: void, run: Subscriber<T>, invalidate?: Invalidator<T>): Unsubscriber;
}
/** Writable interface for both updating and subscribing. */
interface Writable<T> extends Readable<T> {
    /**
     * Set value and inform subscribers.
     * @param value to set
     */
    set(this: void, value: T): void;
    /**
     * Update value using callback and inform subscribers.
     * @param updater callback
     */
    update(this: void, updater: Updater<T>): void;
}

interface PrimitiveState<T> extends Writable<T> {
    readonly isState: true;
    readonly value: T;
    onChange: (cb: (v: T) => void) => void;
    set(this: void, value: T): void;
    refresh(): void;
}
interface ArrayState<T> extends PrimitiveState<T[]> {
    push: (item: T) => void;
}
interface MapState<K, V> extends PrimitiveState<Map<K, V>> {
    /**
     * Set value and inform subscribers.
     *
     * Note: To update a map, use the `setKey` and `deleteKey` methods.
     */
    set: (value: Map<K, V>) => void;
    setKey: (key: K, value: V) => void;
    deleteKey: (key: K) => void;
}
interface SetState<T> extends PrimitiveState<Set<T>> {
    add: (item: T) => void;
    delete: (item: T) => void;
}
type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
type UnionState<T> = {
    set: (value: T) => void;
} & Omit<PrimitiveState<T>, 'set'>;
type State<T> = IsUnion<T> extends true ? UnionState<T> : T extends Array<infer U> ? ArrayState<U> : T extends Map<infer K, infer V> ? MapState<K, V> : T extends Set<infer U> ? SetState<U> : PrimitiveState<T>;
interface StateOptions<T> extends Partial<Writable<T>> {
    /**
     * If provided, the store will be persisted to local storage
     * under the specified key.
     * @default undefined
     */
    key?: string;
    /**
     * If provided, localStorage updates will be debounced by
     * the specified number of milliseconds. If both `debounce`
     * and `throttle` are provided, `debounce` will take precedence.
     */
    debounce?: number;
    /**
     * Optional callback function that runs after the store is
     * updated and all subscribers have been notified.
     */
    onChange?: (v: T) => void;
}
/**
 * An advanced store factory with additional features:
 *
 * - Support for Maps, Sets, and Arrays (enabling methods like `.push` and `.add`).
 * - A `.get` method for retrieving the current value of the store.
 * - Optional `onChange` callback for adding side effects without subscribing.
 * - Optional `key` argument for persisting the store to local storage.
 *
 * @param defaultValue - The default value of the store.
 * @param options - {@link StateOptions}
 *
 * @example
 * ```svelte
 * <script lang="ts">
 * 	import { state } from 'fractils'
 *
 * 	const foo = state([1, 2, 3], { key: 'foo' }) // persisted to local storage
 * 	foo.push(4)
 * 	foo.push('5') // Type error
 *
 * 	const bar = state(new Map<string, number>())
 * 	bar.setKey('count', 21) // `set` is taken, so we use `setKey` and `deleteKey`
 *
 * 	const baz = state(new Set<number>())
 * 	baz.add(5)
 * 	baz.push(6) // Type error
 * </script>
 *
 * <h1>{$foo} {$bar} {$baz}</h1>
 * ```
 */
declare function state<T>(defaultValue: T, options?: StateOptions<T>): State<T>;

/**
 * A recorded "action" callback that can be re-played forwards or backwards.
 */
type Commit<V extends ValidInputValue = ValidInputValue> = {
    from: V;
    to: V;
    target: Input<V>;
    setter?: (v: V) => void;
};
declare class UndoManager {
    pointer: number;
    maxHistory: number;
    stack: Commit[];
    /**
     * Ignores's all commits while `true`.
     */
    lockedExternally: boolean;
    /**
     * Ignores's all commits while `true`.
     */
    private _lockedInternally;
    constructor();
    commit<V>(commit: Commit<V>, _debounce?: number): void;
    undo: () => void;
    redo: () => void;
    clear(): void;
}

/**
 * All valid Javascript Style Properties names (e.g. `backgroundColor`).
 */
type JavascriptStyleProperty = {
    [K in keyof CSSStyleDeclaration]: CSSStyleDeclaration[K] extends string ? K : never;
}[keyof CSSStyleDeclaration] & string;

type Selector = `#${string}` | `.${string}`;
type Anchor = Element | Selector | 'mouse' | 'node' | null;
type Anchors = {
    x: Anchor;
    y: Anchor;
};
/**
 * Options for the tooltip.
 */
interface TooltipOptions {
    readonly __type?: 'TooltipOptions';
    /**
     * The text to display in the tooltip.  Can be a string, number, or a function that returns a string or number.
     */
    text: string | (() => string);
    /**
     * The placement of the tooltip relative to the element.  Can be `'top'`, `'bottom'`, `'left'`, or `'right'`.
     */
    placement: 'top' | 'bottom' | 'left' | 'right';
    /**
     * The element to which the tooltip is placed relative to.  Can be a selector,
     * an element, or the string literal `'mouse'` to use the pointer position.
     *
     * Can also be an object with unique `x` and `y` anchors for each axis.
     *
     * By default, the node that the tooltip is attached to will be used as the anchor.
     *
     * @example { x: 'mouse', y: undefined }
     */
    anchor: Anchor | Anchors;
    /**
     * Delay in milliseconds before the tooltip is shown.
     * @defaultValue 250
     */
    delay: number;
    /**
     * Delay in milliseconds before the tooltip is hidden.
     * @defaultValue 0
     */
    delayOut: number;
    /**
     * An optional x-axis offset (any valid css unit).
     * @defaultValue '0%'
     */
    offsetX: string;
    /**
     * An optional y-axis offset (any valid css unit).
     * @defaultValue '0%'
     */
    offsetY: string;
    /**
     * Animation in/out duration times / easing.
     */
    animation: {
        /**
         * The tooltip reveal animation duration in ms.
         * @defaultValue 300
         */
        duration: KeyframeAnimationOptions['duration'];
        /**
         * The tooltip hide animation duration in ms.
         * @defaultValue 150
         */
        durationOut: KeyframeAnimationOptions['duration'];
        /**
         * The tooltip reveal and hide animation easing.
         * @defaultValue 'cubic-bezier(0.23, 1, 0.320, 1)'
         */
        easing: KeyframeAnimationOptions['easing'];
    };
    /**
     * Custom style overrides for the tooltip element (all valid CSS properties are allowed).
     * i.e. { padding: '4px 8px', color: 'var(--fg-a, #fff)' }
     * @defaultValue undefined
     */
    style?: Partial<Record<JavascriptStyleProperty, string>>;
    /**
     * If specified, the container element for the tooltip.
     * @defaultValue document.body
     */
    parent?: HTMLElement;
    /**
     * Hides the tooltip on click if `true`.
     * @defaultValue false
     */
    hideOnClick: boolean;
}
declare class Tooltip {
    /**
     * The node that the tooltip is attached to.
     */
    node: HTMLElement | undefined | null;
    readonly __type: "Tooltip";
    /**
     * The tooltip element itself.
     */
    element: HTMLDivElement | undefined | null;
    /**
     * The parent element of the tooltip.
     */
    parent: HTMLElement | undefined | null;
    /**
     * Whether the tooltip is currently showing.
     */
    showing: boolean;
    opts: TooltipOptions;
    private _text;
    private _evm;
    private _animPositions;
    private _delayInTimer;
    private _delayOutTimer;
    /**
     * removeEventListener callbacks for listeners with particularly short lifecycles.
     */
    constructor(
    /**
     * The node that the tooltip is attached to.
     */
    node: HTMLElement | undefined | null, options?: Partial<TooltipOptions>);
    refresh(): void;
    /**
     * The text to display in the tooltip.  Assigning a new value will update the tooltip text.
     */
    get text(): string | (() => string);
    set text(text: string | (() => string));
    get placement(): "top" | "bottom" | "left" | "right";
    set placement(v: "top" | "bottom" | "left" | "right");
    get offsetX(): string;
    set offsetX(v: string);
    get offsetY(): string;
    set offsetY(v: string);
    /**
     * Animates the tooltip into view.
     */
    show: () => void;
    /**
     * Animates the tooltip out of view.
     */
    hide: () => void;
    /**
     * Whether the tooltip is currently mounted to the DOM.
     * @internal
     */
    private _mounted;
    mount(): void;
    unmount(): void;
    private _updatePosition;
    private _mouse;
    private _getAnchorRects;
    private _watcherId?;
    /**
     * Determines if the tooltip should watch any anchors for movement.
     */
    private _maybeWatchAnchor;
    private _watchingAnchor;
    private _watchingFinished;
    private _watchTimeout;
    /**
     * Keeps the tooltip position in sync with the anchor when an anchor's
     * transform is in transition while the tooltip is showing.
     * @todo - watch animation events too?
     */
    private _watch;
    dispose(): void;
    static style: string;
}

type CreateOptions<T extends HTMLElement | HTMLInputElement = HTMLElement, K extends keyof T = keyof T, TK extends T[K] = T[K]> = {
    parent?: Element | Document;
    classes?: string[];
    id?: string;
    dataset?: Record<string, string>;
    textContent?: string;
    innerText?: string;
    cssText?: string;
    style?: Partial<Record<JavascriptStyleProperty, string | number>>;
    variables?: Record<`--${string}`, string | number>;
    type?: string;
    attributes?: Record<string, string>;
    value?: any;
    tooltip?: Partial<TooltipOptions>;
    innerHTML?: string;
    children?: HTMLElement[];
    min?: number;
    max?: number;
    step?: number;
    tooltipInstance?: Tooltip;
    onclick?: (e: MouseEvent) => void;
} & Partial<Record<K, TK | unknown>>;

type ButtonEventPayload = {
    e: MouseEvent & {
        target: HTMLButtonElement;
    };
    button: ButtonController;
};
type ButtonControllerOptions = {
    readonly __type?: 'ButtonControllerOptions';
    /**
     * The text or HTML to display on the button.  If a function is passed, it will be called
     * on {@link ButtonController.refresh|`refresh`}.
     * @defaultValue `'click me'`
     */
    text: string | (() => string);
    /**
     * Callback function to run when the button is clicked.  It is passed an object containing the
     * click event, and individual instance of the {@link ButtonController} that was clicked.
     *
     * If not provided, the click event can still be listened to via the `click` event on the
     * {@link ButtonController.on} method.
     * @defaultValue `undefined`
     */
    onClick?: (data: ButtonEventPayload) => void;
    /**
     * Set this option to override the default id applied to the button element.  By default, the
     * id is generated by the {@link Logger} class.
     *
     * In an {@link InputButtonGrid}, the id is also used as the key in the
     * {@link InputButtonGrid.buttons} map for easy access.
     */
    id?: string;
    /**
     * If true, the button will be disabled.  A function can be passed for dynamic disabling, as it
     * will be called whenever the button is refreshed.
     * @defaultValue `false`
     */
    disabled?: boolean | (() => boolean);
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
    style?: CreateOptions['style'];
    /**
     * Optional {@link TooltipOptions}.
     * @defaultValue `undefined`
     */
    tooltip?: Partial<TooltipOptions>;
    /**
     * Optional function to determine if the button is active.  If the function returns `true`,
     * the button will have the `active` class added to it, and removed if `false`.  This updates
     * in the {@link InputButtonGrid.refresh|`refresh`} method.
     * @defaultValue `false`
     */
    active?: boolean | (() => boolean);
    /**
     * The button element to wrap.  If not provided, a new button element is created.
     * @defaultValue `undefined`
     */
    element?: HTMLButtonElement;
    /**
     * If provided, the button will be appended to this parent element.
     * @defaultValue `undefined`
     */
    parent?: HTMLElement;
};
interface ButtonControllerEvents {
    /**
     * Fires when the button is updated externally via the {@link ButtonController.set} method.
     */
    change: ButtonController;
    /**
     * Fires when the button is clicked.
     */
    click: ButtonEventPayload;
    /**
     * Fires when the button is refreshed via the {@link ButtonController.refresh} method.
     */
    refresh: void;
}
declare class ButtonController {
    readonly __type: "ButtonController";
    static is(v: any): v is ButtonController;
    private _text;
    private _active;
    private _disabled;
    element: HTMLButtonElement;
    private _evm;
    on: <K extends keyof ButtonControllerEvents>(event: K, callback: EventCallback<ButtonControllerEvents[K]>) => string;
    private _log;
    parent: HTMLElement | undefined;
    constructor(options: Partial<ButtonControllerOptions>);
    get text(): string;
    set text(value: string | (() => string));
    get active(): boolean;
    set active(value: boolean | (() => boolean) | undefined);
    /**
     * Set this to `true` to disable the button.  If a function is assigned, it will be called
     * whenever the button is refreshed.
     */
    get disabled(): boolean;
    set disabled(value: boolean | (() => boolean) | undefined);
    /**
     * Update the button with new options.
     */
    set(options: Partial<ButtonControllerOptions>): void;
    click: (e: MouseEvent & {
        target: HTMLButtonElement;
    }) => void;
    enable: () => false | this;
    disable: () => true | this;
    refresh: () => this;
    dispose(): void;
}

/**
 * A 2D array of {@link ButtonControllerOptions} objects, representing a grid of buttons. The inner
 * arrays represent rows, and the outer array represents columns.
 * @example
 * ```ts
 * [
 *   // First row columns
 *   [
 *     { text: 'top-left', onClick: () => {} },
 *     { text: 'top-right', onClick: () => {} }
 *   ],
 *   // Second row columns
 *   [
 *     { text: 'bottom-left', onClick: () => {} },
 *     { text: 'bottom-right', onClick: () => {} }
 *   ]
 * ]
 * ```
 */
type ButtonGridArrays = ButtonControllerOptions[][];
/**
 * A fully processed {@link ButtonGridArrays} entry with the generated {@link ButtonController}s.
 * Stored in the input's {@link InputButtonGrid.buttonGrid|`buttonGrid`} property.
 */
type ButtonGrid = ButtonController[][];
type ButtonGridInputOptions = {
    readonly __type?: 'ButtonGridInputOptions';
    value: ButtonGridArrays;
    /**
     * Optional css style overrides in {@link JavascriptStyleProperty} (camelCase) format.
     */
    style?: CreateOptions['style'];
    /**
     * If `true`, the `active` class will be added to the last clicked button, and removed from
     * all other buttons.  This is useful for indicating the currently selected button in a grid.
     * @default true
     */
    activeOnClick?: boolean;
    disabled?: boolean | (() => boolean);
} & InputOptions<ButtonGridArrays>;
interface ButtonGridControllerElements extends ElementMap {
    container: HTMLElement;
    buttonGrid: HTMLButtonElement[];
}
type ButtonId = string;
declare class InputButtonGrid extends Input<ButtonController, ButtonGridInputOptions, ButtonGridControllerElements, ButtonControllerEvents> {
    readonly __type: "InputButtonGrid";
    readonly initialValue: ButtonGridArrays;
    readonly state: PrimitiveState<ButtonController>;
    buttons: Map<ButtonId, ButtonController>;
    buttonGrid: ButtonGrid;
    private _log;
    constructor(options: Partial<ButtonGridInputOptions>, folder: Folder);
    onClick(callback: (payload: ButtonController) => void): void;
    /**
     * Converts a {@link ButtonGridArrays} into a a grid of {@link HTMLButtonElement}
     * elements, and
     *
     * - appends them to the {@link InputButtonGrid.elements.controllers.container}
     */
    toGrid(grid: ButtonGridArrays): ButtonGrid;
    addButton(opts: ButtonControllerOptions, id: string, i: number, j: number): ButtonController;
    set(button: ButtonController): void;
    refresh(): this;
    enable(): this;
    disable(): this;
    dispose(): void;
}

type TextAreaInputOptions = {
    readonly __type?: 'TextAreaInputOptions';
    /**
     * The maximum number of characters that can be entered.
     * @default 50
     */
    maxLength?: number;
} & InputOptions<string>;
interface TextAreaControllerElements extends ElementMap {
    container: HTMLElement;
    input: HTMLInputElement;
}
declare class InputTextArea extends Input<string, TextAreaInputOptions, TextAreaControllerElements> {
    #private;
    readonly __type: "InputTextArea";
    readonly initialValue: string;
    readonly state: State<string>;
    constructor(options: Partial<TextAreaInputOptions>, folder: Folder);
    enable(): this;
    disable(): this;
    set: (v?: string | Event) => this | undefined;
    refresh: () => this;
    dispose(): void;
}

type ButtonClickFunction = (this: InputButton) => void;
type ButtonInputOptions = InputOptions<ButtonClickFunction> & {
    readonly __type?: 'ButtonInputOptions';
    text: string | (() => string);
    /**
     * The function to call when the button is clicked.
     */
    value?: ButtonClickFunction;
    /**
     * An alias for {@link value} (does the same thing).
     */
    onClick?: ButtonClickFunction;
};
interface ButtonControllerElements extends ElementMap {
    container: HTMLElement;
    button: HTMLButtonElement;
}
interface ButtonInputEvents extends InputEvents<InputButton> {
    click: void;
}
declare class InputButton extends Input<ButtonController, ButtonInputOptions, ButtonControllerElements, ButtonInputEvents> {
    readonly __type: "InputButton";
    readonly initialValue: ButtonController;
    readonly state: State<ButtonController>;
    onClick: ButtonClickFunction;
    button: ButtonController;
    private _log;
    constructor(options: Partial<ButtonInputOptions>, folder: Folder);
    get text(): string | (() => string);
    set text(v: string | (() => string));
    /**
     * Manually calls the {@link onClick} function.
     */
    click(): void;
    enable(): this;
    disable(): this;
    /**
     * Overwrites the
     */
    set: (v: ButtonController | unknown) => void;
    /**
     * Refreshes the button text.
     */
    refresh(): this;
    dispose(): void;
}

/**
 * Options for the {@link InputSwitch} class.
 */
type SwitchInputOptions = InputOptions<boolean> & {
    readonly __type?: 'SwitchInputOptions';
    /** Text to display in various parts of the switch. */
    labels?: {
        /** Text to display when the state is `true` */
        true: {
            /**
             * Represents the `true` state, i.e. `'on' | 'active' | 'enabled'`
             * @default 'on'
             */
            state?: string;
            /**
             * Represents, i.e. `'turn on' | 'activate' | 'enable'`.
             * Displayed on the tooltip when the switch is `false`.
             * @default 'Enable'
             */
            verb?: string;
        };
        /** Text to display when the state is `false` */
        false: {
            /**
             * Represents the `false` state, i.e. `'off' | 'inactive' | 'disabled'`
             * @default 'off'
             */
            state?: string;
            /**
             * Represents the action, i.e. `'turn off' | 'deactivate' | 'disable'`.
             * Displayed on the tooltip when the switch is `true`.
             * @default 'Disable'
             */
            verb?: string;
        };
    };
};
interface SwitchInputElements extends ElementMap {
    container: HTMLElement;
    input: HTMLButtonElement & {
        tooltip: Tooltip;
    };
    thumb: HTMLDivElement;
    stateText: HTMLDivElement;
}
/**
 * A switch {@link Input} for booleans.
 */
declare class InputSwitch extends Input<boolean, SwitchInputOptions, SwitchInputElements> {
    #private;
    readonly __type: "InputSwitch";
    readonly state: State<boolean>;
    initialValue: boolean;
    constructor(options: Partial<SwitchInputOptions>, folder: Folder);
    set(v?: boolean): this;
    refresh(v?: boolean): this;
    enable(): this;
    disable(): this;
    dispose(): void;
}

interface Disableable {
    /**
     * Whether the controller is disabled.  Assign it to a function to
     * dynamically determine the disabled state.  Reading it will always
     * return a boolean.
     */
    get disabled(): boolean;
    set disabled(value: boolean | (() => boolean));
}

type LabeledOption<T> = {
    label: string;
    value: T;
};
type Option<T> = T | LabeledOption<T>;
interface SelectInputOptions$1<T> {
    readonly __type?: 'SelectInputOptions';
    input: Input;
    container: HTMLDivElement;
    disabled: boolean | (() => boolean);
    /**
     * The default selected option. If not provided, the first option in
     * the `options` array will be selected.
     * @todo - We need a 'blank' state where no option is selected.
     */
    selected?: Option<T>;
    /**
     * The options to display in the select controller.  Pass each
     * option as a {@link LabeledOption} (`{ label: string, value: T }`)
     * to specify text to display for each option.  Alternatively, if the
     * label you want to display is already on the option object, use the
     * `labelKey` property to specify the key to use as the label.
     */
    options: Option<T>[];
    /**
     * An optional key on each {@link Option} to use as the `label` when
     * converting to a {@link LabeledOption}.
     */
    labelKey?: T extends Record<infer K, any> ? K : never;
    /**
     * When `true`, options will be automatically selected when a user
     * hovers over them in the dropdown.  If none are selected, the
     * original value will be restored.
     * @default true
     */
    selectOnHover?: boolean;
    /**
     * Just used internally for the logger label.
     * @internal
     */
    title?: string;
}
type SelectElements = {
    container: HTMLDivElement;
    selected: HTMLDivElement;
    dropdown: HTMLDivElement;
    options: HTMLDivElement[];
};
interface SelectInputEvents$1<T> {
    change: LabeledOption<T>;
    refresh: void;
    open: void;
    close: void;
    cancel: void;
}
interface Select<T> extends Disableable {
}
declare class Select<T> {
    readonly __type: "Select";
    element: HTMLDivElement;
    private _opts;
    elements: SelectElements;
    /**
     * All options in the select controller.
     */
    options: LabeledOption<T>[];
    /**
     * A map of all options by their (internally generated) id.
     */
    optionMap: Map<string, {
        option: LabeledOption<T>;
        element: HTMLDivElement;
    }>;
    /**
     * Whether the dropdown is currently visible.
     */
    expanded: boolean;
    /**
     * The initial selected option.
     */
    initialValue: LabeledOption<T>;
    /**
     * The initial options array.
     */
    initialOptions: LabeledOption<T>[];
    /**
     * When true, clicking clicks will be ignored.
     */
    disableClicks: boolean;
    /**
     * Used to prevent infinite loops when updating internally.
     */
    bubble: boolean;
    /**
     * The currently selected option.
     */
    private _selected;
    /**
     * The currently selected option preserved when hot-swapping on:hover.
     */
    private _currentSelection;
    /**
     * The parent element that the selected element is scrolling in.
     */
    private _scrollParent;
    private _evm;
    /**
     * Used to subscribe to {@link SelectInputEvents}.
     */
    on: <K extends keyof SelectInputEvents$1<T>>(event: K, handler: (v: SelectInputEvents$1<T>[K]) => void) => void;
    private _log;
    constructor(options: SelectInputOptions$1<T>);
    /**
     * The currently selected option. Assigning a new value will update the UI.
     */
    get selected(): LabeledOption<T>;
    set selected(v: Option<T> | State<Option<T>>);
    getLabel(v: LabeledOption<T> | State<LabeledOption<T>>): string;
    /**
     * Adds an option to the select controller.
     * @param option The option to add.
     * @returns The id of the added option.
     */
    add(option: Option<T>): this;
    /**
     * Removes an option from the select controller by id.
     */
    remove(
    /**
     * The id of the option to remove.
     */
    id: string, 
    /**
     * If false, the select controller will not attempt to select a new fallback option
     * when the removed option is also the currently selection one.
     * @default false
     */
    autoSelectFallback?: boolean): void;
    /**
     * Removes all options and their elements.
     */
    clear(): void;
    select: (v: LabeledOption<T> | Event, bubble?: boolean) => this;
    /**
     * Updates the UI to reflect the current state of the source.
     */
    refresh: () => this;
    /**
     * Toggles the dropdown's visibility.
     */
    toggle: () => void;
    /**
     * Shows the dropdown.
     */
    open: () => void;
    /**
     * Positions the dropdown to the selected element.
     */
    updatePosition: () => void;
    /**
     * Hides the dropdown.
     */
    close: () => void;
    /**
     * Closes the dropdown if the escape key was pressed.  If {@link selectOnHover}
     * is enabled, the current selection will be re-selected to restore the original
     * value.
     */
    private _closeOnEscape;
    private _clickOutside;
    private _cancel;
    enable(): this;
    disable(): this;
    dispose(): void;
}

type SelectInputOptions<T = ValidInputValue> = Omit<InputOptions<T | {
    label: string;
    value: T;
}>, 'onChange' | 'value'> & {
    __type?: 'SelectInputOptions';
    onChange?: (value: LabeledOption<T>) => void;
} & ({
    labelKey?: never;
    value?: {
        label: string;
        value: T;
    };
    options: {
        label: string;
        value: T;
    }[] | (() => {
        label: string;
        value: T;
    }[]);
} | {
    labelKey: keyof T;
    value?: T;
    options: T[] | (() => T[]);
});
interface SelectControllerElements<T> extends ElementMap {
    container: HTMLElement;
    select: Select<T>['elements'];
}
interface SelectInputEvents<T> extends InputEvents<LabeledOption<T>> {
    preview: LabeledOption<T>;
    open: void;
    close: void;
    cancel: void;
}
interface InputSelect extends Disableable {
}
declare class InputSelect<T = unknown> extends Input<LabeledOption<T>, SelectInputOptions<T>, SelectControllerElements<T>, SelectInputEvents<T>> {
    #private;
    readonly __type: "InputSelect";
    readonly initialValue: LabeledOption<T>;
    state: State<LabeledOption<T>>;
    set options(v: SelectInputOptions['options']);
    get options(): LabeledOption<T>[];
    /**
     * The select controller instance.
     */
    select: Select<T>;
    /**
     * The currently selected option as a labeled option.
     */
    labeledSelection: LabeledOption<T>;
    private _log;
    constructor(options: Partial<SelectInputOptions<T>>, folder: Folder);
    resolveOptions(providedOptions: SelectInputOptions['options']): LabeledOption<T>[];
    resolveInitialValue(opts: SelectInputOptions<T>): {
        label: any;
        value: any;
    };
    resolveInitialLabel(initialValue: this['initialValue'], opts: SelectInputOptions<T>): string;
    get targetObject(): Record<any, any> | undefined;
    get targetKey(): any;
    get targetValue(): T;
    set targetValue(v: T);
    /**
     * Selects the given {@link LabeledOption} and updates the ui.
     */
    set(value: LabeledOption<T>): this;
    enable(): this;
    disable(): this;
    refresh: () => this;
    dispose(): void;
}

declare class NumberButtonsController {
    input: InputNumber;
    opts: NumberInputOptions;
    parent?: HTMLElement | undefined;
    elements: {
        container: HTMLDivElement;
        increment: HTMLDivElement;
        decrement: HTMLDivElement;
    };
    constructor(input: InputNumber, opts: NumberInputOptions, parent?: HTMLElement | undefined);
    rampChange(direction?: number): void;
    rampChangeUp(): void;
    rampChangeDown(): void;
}

declare class NumberController<TInput extends ValidInput = ValidInput, TOptions extends InputOptions<any> = InputOptions> {
    input: TInput;
    opts: TOptions;
    parent?: HTMLElement | undefined;
    element: HTMLInputElement & {
        tooltip: Tooltip;
    };
    dragEnabled: boolean;
    dragging: boolean;
    hovering: boolean;
    delta: number;
    private _log;
    constructor(input: TInput, opts: TOptions, parent?: HTMLElement | undefined);
    hoverStart: (e: PointerEvent) => void;
    hoverEnd: (e: PointerEvent) => void;
    dragKeyHeld: (e: KeyboardEvent | PointerEvent) => boolean;
    cancelDrag: (e: KeyboardEvent | PointerEvent) => void;
    maybeEnableDrag: (e: KeyboardEvent | PointerEvent) => void;
    maybeDragStart: () => void;
    dragStart: () => Promise<void>;
    dragEnd: () => void;
    drag: (e: PointerEvent) => void;
    dispose(): void;
}

interface NumberControllerElements extends ElementMap {
    container: HTMLElement;
    buttons: {
        container: HTMLDivElement;
        increment: HTMLDivElement;
        decrement: HTMLDivElement;
    };
    input: HTMLInputElement;
    range: HTMLInputElement;
}
type NumberInputOptions = {
    readonly __type?: 'NumberInputOptions';
    min?: number;
    max?: number;
    step?: number;
} & InputOptions<number>;
declare class InputNumber extends Input<number, NumberInputOptions, NumberControllerElements> {
    readonly __type: "InputNumber";
    private _log;
    initialValue: number;
    state: State<number>;
    dragEnabled: boolean;
    numberController: NumberController;
    numberButtonsController: NumberButtonsController;
    constructor(options: Partial<NumberInputOptions>, folder: Folder);
    set: (v?: number | Event) => this | undefined;
    enable(): this;
    disable(): this;
    refresh: () => this;
    dispose(): void;
}

type ColorObject = HsvColor | HsvaColor | RgbColor | RgbaColor | HslColor | HslaColor | KelvinColor;
interface HsvColor {
    h: number;
    s: number;
    v: number;
}
interface HsvaColor extends HsvColor {
    a: number;
}
interface RgbColor {
    r: number;
    g: number;
    b: number;
}
interface RgbaColor extends RgbColor {
    a: number;
}
interface HslColor {
    h: number;
    s: number;
    l: number;
}
interface HslaColor extends HslColor {
    a: number;
}
interface KelvinColor {
    kelvin: number;
}

/**
 * All valid color objects and strings.
 */
type ColorString = HexString | HexAlphaString | HexStringShorthand | HexAlphaStringShorthand | RgbString | RgbaString | PercentageRgbString | PercentageRgbaString | RgbObject | RgbaObject | HslString | HslaString | HslObject | HslaObject | HsvObject | HsvaObject;
/** A 6-character hex color string: `'#5500ee'` */
type HexString = `#${string}${string}${string}${string}${string}${string}`;
/** An 8-character hex color string with alpha: `'#5500eeff'` */
type HexAlphaString = `#${string}${string}${string}${string}${string}${string}${string}${string}`;
/** A 3-character hex color string: `'#50e'` */
type HexStringShorthand = `#${string}${string}${string}`;
/** A 4-character hex color string with alpha: `'#50ef'` */
type HexAlphaStringShorthand = `#${string}${string}${string}${string}`;
/** An rgb color string: `rgb(85, 0, 238)` */
type RgbString = `rgb(${number}, ${number}, ${number})`;
/** An rgba color string: `rgba(85, 0, 238, 1)` */
type RgbaString = `rgba(${number}, ${number}, ${number}, ${number})`;
/** A percentage rgb color string: `rgb(33%, 0%, 93%)` */
type PercentageRgbString = `rgb(${number}%, ${number}%, ${number}%)`;
/** A percentage rgba color string: `rgba(33%, 0%, 93%, 1)` */
type PercentageRgbaString = `rgba(${number}%, ${number}%, ${number}%, ${number}%)`;
/** An object representing an rgb color: `{ r: 85, g: 0, b: 238 }` */
type RgbObject = {
    r: number;
    g: number;
    b: number;
};
/** An object representing an rgba color: `{ r: 85, g: 0, b: 238, a: 1 }` */
type RgbaObject = {
    r: number;
    g: number;
    b: number;
    a: number;
};
/** An hsl color string: `hsl(261, 100%, 47%)` */
type HslString = `hsl(${number}, ${number}%, ${number}%)`;
/** An hsla color string: `hsla(261, 100%, 47%, 1)` */
type HslaString = `hsla(${number}, ${number}%, ${number}%, ${number})`;
/** An object representing an hsl color: `{ h: 261, s: 100, l: 47 }` */
type HslObject = {
    h: number;
    s: number;
    l: number;
};
/** An object representing an hsla color: `{ h: 261, s: 100, l: 47, a: 1 }` */
type HslaObject = {
    h: number;
    s: number;
    l: number;
    a: number;
};
/** An object representing an hsv color: `{ h: 261, s: 100, v: 47 }` */
type HsvObject = {
    h: number;
    s: number;
    v: number;
};
/** An object representing an hsva color: `{ h: 261, s: 100, v: 47, a: 1 }` */
type HsvaObject = {
    h: number;
    s: number;
    v: number;
    a: number;
};

type ColorFormat = ColorObject | ColorString;

type ColorMode$1 = 'hsv' | 'hsl' | 'rgb';
type ColorValue = Color | ColorString | ColorObject;
/**
 * A color class with rgb, hsl, hsv, and kelvin color objects, strings, and conversion methods.
 */
declare class Color {
    #private;
    readonly isColor: true;
    /**
     * @param color - The initial color value.
     * The value can be any valid color representation:
     * - A hex string: '#5500ee' | '#5500eeff'
     * - An rgba string: 'rgba(85, 0, 238, 1)' | 'rgba(85, 0, 238, 1.0)'
     * - An hsla string: 'hsla(261, 100%, 47%, 1)' | 'hsla(261, 100%, 47%, 1.0)'
     * - An {@link RgbvColor}: { r: 85, g: 0, b: 238, a: 1 }
     * - An {@link HsvColor}: { h: 261, s: 100, v: 47, a: 1 }
     * - An {@link HslColor}: { h: 261, s: 100, l: 47, a: 1 }
     * - An {@link KelvinColor}: { kelvin: 6500 }
     */
    constructor(color?: ColorValue | (string & {}));
    /**
     * Sets the Color from any valid {@link ColorValue}.
     */
    set(color: ColorValue): void;
    /**
     * Shortcut to set a specific channel value.
     * @param format - hsv | hsl | rgb
     * @param channel - Individual channel to set, for example, if format = hsl, chanel = h | s | l
     * @param value - New value for the channel.
     */
    setChannel<Mode extends ColorMode$1>(format: Mode, channel: Mode extends 'hsv' ? 'h' | 's' | 'v' : Mode extends 'hsl' ? 'h' | 's' | 'l' : Mode extends 'rgb' ? 'r' | 'g' | 'b' : never, value: number): void;
    /**
     * Reset color back to its initial value
     */
    reset(): void;
    /**
     * Returns a new Color instance with the same values as this one.
     */
    clone(): Color;
    /** i.e. `{ h: 261, s: 100, v: 47 }` */
    get hsv(): HsvColor;
    set hsv(value: Partial<HsvaColor>);
    /** i.e. `{ h: 261, s: 100, v: 47, a: 1 }` */
    get hsva(): HsvaColor;
    set hsva(value: HsvaColor);
    /** The value of `H` in `HSVA`. */
    get hue(): number;
    set hue(value: number);
    /** The value of `S` in `HSVA`. */
    get saturation(): number;
    set saturation(value: number);
    /** The value of `V` in `HSVA`. */
    get value(): number;
    set value(value: number);
    /** The value of `L` in `HSLA`. */
    get lightness(): number;
    set lightness(value: number);
    get alpha(): number;
    set alpha(value: number);
    get kelvin(): number;
    set kelvin(value: number);
    get red(): number;
    set red(value: number);
    /**
     * A float version of the {@link red} channel value as a fraction of 1 (0-1 vs 0-255).
     */
    get r(): number;
    set r(value: number);
    get green(): number;
    set green(value: number);
    /**
     * A float version of the {@link green} channel value as a fraction of 1 (0-1 vs 0-255).
     */
    get g(): number;
    set g(value: number);
    get blue(): number;
    set blue(value: number);
    /**
     * A float version of the {@link blue} channel value as a fraction of 1 (0-1 vs 0-255).
     */
    get b(): number;
    set b(value: number);
    /** i.e. `{ r: 85, g: 0, b: 238 }` */
    get rgb(): RgbColor;
    set rgb(value: RgbColor | RgbaColor);
    /**
     * A float version of {@link rgb} values as a fraction of 1 (0-1 vs 0-255).
     */
    get rgbf(): RgbColor;
    set rgbf(value: RgbColor);
    /** i.e. `'rgba(85, 0, 238, 1)'` */
    get rgba(): RgbaColor;
    set rgba(value: RgbColor | RgbaColor);
    /** i.e. `'hsl(261, 100%, 47%)'` */
    get hsl(): HslColor;
    set hsl(value: HslColor | HslaColor);
    /** i.e. `'hsla(261, 100%, 47%, 1)'` */
    get hsla(): HslaColor;
    set hsla(value: HslColor | HslaColor);
    /** i.e. `'rgb(85, 0, 238)'` */
    get rgbString(): RgbString;
    set rgbString(value: RgbString | RgbaString | (string & {}));
    /** i.e. `'rgba(85, 0, 238, 1)'` */
    get rgbaString(): RgbaString;
    set rgbaString(value: RgbaString | (string & {}));
    /**
     * Hex string with an alpha channel, i.e. `'#5500eeff'`. Identical to {@link hex8String}.
     */
    get hex(): HexString;
    /** Hex string with no alpha channel, i.e. `'#5500ee'` */
    get hexString(): HexString;
    set hexString(value: HexString | HexAlphaString | (string & {}));
    get hex8(): HexAlphaString;
    /** i.e. `'#5500eeff'` */
    get hex8String(): HexAlphaString;
    set hex8String(value: HexAlphaString | (string & {}));
    /** i.e. `'rgb(85, 0, 238)'` */
    get hslString(): HslString;
    set hslString(value: HslString | (string & {}));
    /** i.e. `'hsla(261, 100%, 47%, 1)'` */
    get hslaString(): string;
    set hslaString(value: HslaString | (string & {}));
    toString(): `#${string}${string}${string}${string}${string}${string}${string}${string}`;
    toJSON(): {
        hex: `#${string}${string}${string}${string}${string}${string}${string}${string}`;
        a: number;
        r: number;
        g: number;
        b: number;
        isColor: boolean;
    };
}
declare function isColor(color: any): color is Color;
declare function isColorFormat(color: any): color is ColorFormat;
declare function parseColorFormat(color: ColorFormat | (string & {})): "number" | "HexString" | "Hex8String" | "RgbaString" | "HslaString" | "Color" | "RgbColor" | "HsvColor" | "HslColor" | undefined;

interface ColorComponentsOptions {
    container?: HTMLDivElement;
    disabled: boolean | (() => boolean);
}
type ColorComponentsElements = {
    container: HTMLDivElement;
    title: HTMLDivElement;
    select: Select<ColorMode>['elements'];
    numbers: {
        a: HTMLInputElement;
        b: HTMLInputElement;
        c: HTMLInputElement;
        d: HTMLInputElement;
    };
    text: HTMLInputElement;
};
interface ColorComponents extends Disableable {
}
declare class ColorComponents {
    #private;
    input: InputColor;
    opts: ColorComponentsOptions;
    element: HTMLDivElement;
    elements: ColorComponentsElements;
    select: Select<ColorMode>;
    private _evm;
    private _mode;
    /**
     * Used to prevent inputs from being refreshed externally after they're updated internally.
     */
    private _locked;
    private _log;
    constructor(input: InputColor, options?: Partial<ColorComponentsOptions>);
    get color(): Color;
    get mode(): ColorMode;
    set mode(v: ColorMode);
    updateMode: (v?: "rgba" | "hsla" | "hsva" | "rgbaString" | "hex" | "hex8" | "hslaString" | "hsvaString" | "array") => void;
    get a(): number;
    set a(v: number);
    get b(): number;
    set b(v: number);
    get c(): number;
    set c(v: number);
    get d(): number;
    set d(v: number);
    /**
     * Updates the UI to reflect the current state of the source color.
     */
    refresh: () => this;
    disable(): this;
    enable(): this;
    dispose(): void;
}

interface ColorPickerOptions {
    /**
     * The initial color of the color picker.  Can be any valid {@link ColorValue}.
     * @default '#fff'
     */
    color: ColorValue;
    /**
     * The container element for the color picker.
     */
    container?: HTMLElement;
    /**
     * An array of color swatches.
     */
    swatches: ColorValue[];
    /**
     * The radius of the color picker handle (the little circle
     * that moves around the color picker) in pixels.
     * @default 10
     */
    handleSize: number;
    disabled: boolean | (() => boolean);
}
type ColorPickerElements = {
    container: HTMLDivElement;
    canvas: HTMLCanvasElement;
    handle: HTMLDivElement;
    hueSlider: HTMLInputElement;
    alphaSlider: HTMLInputElement;
};
interface ColorPicker extends Disableable {
}
declare class ColorPicker {
    input: InputColor;
    opts: ColorPickerOptions;
    elements: ColorPickerElements;
    element: HTMLDivElement;
    private _ctx;
    private _height;
    private _width;
    private _resizeObserver;
    private _gradientWhite;
    private _gradientBlack;
    private _dragging;
    private _lockCursorPosition;
    private _lastColor;
    private _log;
    private _evm;
    on: <K extends "pointerdown" | "pointerup">(event: K, callback: EventCallback<{
        pointerdown: any;
        pointerup: any;
    }[K]>) => string;
    constructor(input: InputColor, options?: Partial<ColorPickerOptions>);
    get canvas(): HTMLCanvasElement;
    get hue(): number;
    get alpha(): number;
    enable: () => this;
    disable: () => this;
    set(v: ColorValue): void;
    setAlpha: (e: InputEvent) => void;
    /**
     * Updates the UI to reflect the current state of the color picker.
     */
    refresh: () => this;
    draw: () => void;
    private _fill;
    private _updateGradients;
    private _pointerUpClickLatch;
    private _onPointerDown;
    private _onPointerMove;
    private _onPointerUp;
    private _onClick;
    /**
     * Updates the color picker's state based on the current mouse position.
     */
    private _updateFromMousePosition;
    /**
     * Maps canvas `x` and `y` coordinates to their respective `s` and `v` color values.
     */
    private _getColorAtPosition;
    private _updateStateFromHue;
    private _updateHandle;
    /**
     * Get the current handle position for a given color.
     */
    private _getHandlePosition;
    private _drawHandle;
    dispose(): void;
}

declare class CopySVG {
    svg: SVGSVGElement;
    back: SVGRectElement;
    front: SVGRectElement;
    check: SVGPathElement;
    constructor();
    appendTo(container: HTMLElement): void;
}

declare class CopyButton {
    #private;
    container: HTMLElement;
    text: () => string;
    message: string;
    button: HTMLDivElement;
    icon: CopySVG;
    /**
     * When the copy animation is active, this is `true` and the button has an `active` class.
     */
    active: boolean;
    /**
     * When the copy animation is outroing, this is `true` and the button has an `outro` class.
     */
    outro: boolean;
    tooltip: Tooltip;
    constructor(container: HTMLElement, text: () => string, message?: string);
    copy: () => void;
}

type ColorMode = (typeof COLOR_MODES)[number];
declare const COLOR_MODES: readonly ["rgba", "rgbaString", "hsla", "hslaString", "hsva", "hsvaString", "hex", "hex8", "array"];
interface ColorControllerElements extends ElementMap<ColorPicker> {
    container: HTMLDivElement;
    /**
     * A color swatch that displays the current color and toggles the color-picker when clicked.
     */
    currentColor: {
        container: HTMLDivElement;
        displayBackground: HTMLDivElement;
        display: HTMLDivElement;
        copyButton: CopyButton;
    };
    /**
     * The main input content body.
     */
    body: {
        container: HTMLDivElement;
        /**
         * All elements related to the color picker.
         */
        picker: ColorPickerElements;
        /**
         * Number controllers for rgb/hsl/hsv components.
         */
        components: ColorComponentsElements;
    };
}
type ColorInputOptions = {
    __type?: 'ColorInputOptions';
    mode?: ColorMode;
    expanded?: boolean;
    onChange?: (value: Color) => void;
} & InputOptions<ColorFormat | Color>;
declare class InputColor extends Input<Color, ColorInputOptions, ColorControllerElements> {
    #private;
    readonly __type: "InputColor";
    initialValue: Color;
    state: State<Color>;
    /**
     * The color picker instance.
     */
    picker: ColorPicker;
    /**
     * RGBA/HSLA/HSVA number component inputs.
     */
    components: ColorComponents;
    /**
     * When `true`, the color picker is visible.
     */
    expanded: boolean;
    private _mode;
    get mode(): ColorMode;
    set mode(v: ColorMode);
    private _log;
    constructor(options: Partial<ColorInputOptions>, folder: Folder);
    set(v: ColorFormat | Color): this;
    refresh: (v?: Color) => this;
    get aTitle(): "r" | "h";
    get bTitle(): "g" | "s";
    get cTitle(): "v" | "b" | "l";
    get dTitle(): string;
    private _createCurrentColor;
    private get _pickerContainer();
    togglePicker: () => Promise<void>;
    open: () => Promise<void>;
    close: (duration?: number) => Promise<void>;
    /**
     * Prevents the range slider from registering undo history commits while dragging on the
     * canvas, storing the initial value on pointerdown for the eventual commit in {@link unlock}.
     */
    private _lock;
    /**
     * Saves the commit stored in #lock on pointerup.
     */
    private _unlock;
    enable(): this;
    disable(): this;
    save(): Omit<InputOptions<any, Record<any, any>>, "title" | "saveable"> & {
        __type: InputOptionType;
        presetId: string;
        title: string;
        value: ValidInputValue;
        disabled: boolean;
        hidden: boolean;
        order: number;
        resettable: boolean;
    } & Partial<InputPreset<ColorInputOptions>>;
    load(json: string | InputPreset<ColorInputOptions>): void;
    dispose(): void;
}

type TextInputOptions = InputOptions<string> & {
    readonly __type?: 'TextInputOptions';
    /**
     * The maximum number of characters that can be entered.
     * @default 50
     */
    maxLength?: number;
};
interface TextControllerElements extends ElementMap {
    container: HTMLElement;
    input: HTMLInputElement;
}
declare class InputText extends Input<string, TextInputOptions, TextControllerElements> {
    #private;
    readonly __type: "InputText";
    readonly initialValue: string;
    readonly state: State<string>;
    constructor(options: Partial<TextInputOptions>, folder: Folder);
    enable(): this;
    disable(): this;
    set: (v?: string | Event) => this | undefined;
    refresh: () => this;
    dispose(): void;
}

type InputType = (typeof INPUT_TYPES)[number];
type InputOptionType = (typeof INPUT_OPTION_TYPES)[number];
declare const INPUT_TYPE_MAP: Readonly<{
    InputText: "TextInputOptions";
    InputTextArea: "TextAreaInputOptions";
    InputNumber: "NumberInputOptions";
    InputColor: "ColorInputOptions";
    InputSelect: "SelectInputOptions";
    InputButton: "ButtonInputOptions";
    InputButtonGrid: "ButtonGridInputOptions";
    InputSwitch: "SwitchInputOptions";
}>;
declare const INPUT_TYPES: readonly ("InputText" | "InputTextArea" | "InputNumber" | "InputColor" | "InputSelect" | "InputButton" | "InputButtonGrid" | "InputSwitch")[];
declare const INPUT_OPTION_TYPES: readonly ("TextInputOptions" | "TextAreaInputOptions" | "NumberInputOptions" | "ColorInputOptions" | "SelectInputOptions" | "ButtonInputOptions" | "ButtonGridInputOptions" | "SwitchInputOptions")[];
type BindTarget = Record<any, any>;
type BindableObject<T extends BindTarget, K extends keyof T = keyof T> = {
    target: T;
    key: K;
    initial?: T[K];
};
/**
 * The initial value of an input can be either a raw value, or a "binding"
 */
type ValueOrBinding<TValue = ValidInputValue, TBindTarget extends BindTarget = BindTarget> = {
    value: TValue;
    binding?: BindableObject<TBindTarget>;
} | {
    value?: TValue;
    binding: {
        target: TBindTarget;
        key: keyof TBindTarget;
        initial?: TValue;
    };
} | {
    value?: TValue;
    binding?: {
        target: TBindTarget;
        key: keyof TBindTarget;
        initial?: TValue;
    };
} | {
    value: TValue;
    binding?: {
        target: TBindTarget;
        key: keyof TBindTarget;
        initial?: TValue;
    };
};
type InputOptions<TValue = ValidInputValue, TBindTarget extends BindTarget = Record<any, any & TValue>> = {
    /**
     * The title displayed to the left of the input.
     */
    title?: string;
    /**
     * If provided, will be used as the key for the input's value in a preset.
     * @defaultValue `<folder_title>:<input_type>:<input_title>`
     */
    presetId?: string;
    /**
     * Whether the inputs are disabled.  A function can be used to dynamically determine the
     * disabled state.
     * @default false
     */
    disabled?: boolean | (() => boolean);
    /**
     * Whether the input is hidden. A function can be used to dynamically determine the hidden
     * state.
     * @default false
     */
    hidden?: boolean;
    /**
     * The order in which this input should appear in its folder relative to the other inputs.
     * - To force an input to be first *(at the top of its folder)*, set `order` to `0` or below.
     * - To force an input to be last *(at the bottom of its folder)*, set `order` to any number greater than number of inputs + 1.
     * @default folder.inputs.size + 1
     */
    order?: number;
    /**
     * If true, the `reset to default` button will appear when the input's value is marked dirty.
     * @default true
     */
    resettable?: boolean;
    /**
     * Whether this Input should be saved as a {@link InputPreset} when saving the
     * {@link FolderPreset} for the {@link Folder} this Input belongs to.  If `false`, this Input
     * will be skipped.
     * @default true
     */
    saveable?: boolean;
    /**
     * An optional callback to run when this Input's state changes.  Also accessible via
     * `Input.on('change', value => {})`.
     */
    onChange?: (value: TValue) => void;
} & ValueOrBinding<TValue, TBindTarget>;
type InputPreset<T extends ValidInputOptions> = Omit<InputOptions<T>, 'title' | 'saveable'> & {
    __type: InputOptionType;
    presetId: string;
    title: string;
    value: ValidInputValue;
    disabled: boolean;
    hidden: boolean;
    order: number;
    resettable: boolean;
};
interface ElementMap<T = unknown> {
    [key: string]: HTMLElement | HTMLInputElement | ElementMap | T;
}
type ValidInputValue = string | number | Color | ColorFormat | Option<any>;
type ValidInputOptions = TextInputOptions | TextAreaInputOptions | NumberInputOptions | ColorInputOptions | SelectInputOptions<Option<any>> | ButtonInputOptions | ButtonGridInputOptions | SwitchInputOptions;
type ValidInput = InputText | InputTextArea | InputNumber | InputColor | InputSelect<Option<any>> | InputButton | InputButtonGrid | InputSwitch;
type InputEvents<T extends ValidInputValue = ValidInputValue> = {
    /**
     * Called when the input's value changes, providing the new value.
     */
    readonly change: T;
    /**
     * Called when a input's controllers are refreshed, providing the current value of the input.
     */
    readonly refresh: T;
};
/**
 * An input that can be added to a {@link Folder}.  This class is extended by all
 * {@link ValidInput} classes. Inputs occupy a single row in a folder, and are in charge of
 * managing a single state value.  Inputs often combine multiple controllers to provide a rich
 * user interface for interacting with the input's value.
 *
 * @template TValueType - The type of value this input manages.
 * @template TOptions - The options object for this input, determined by the input class
 * responsible for the {@link TValueType}.
 * @template TElements - A map of all HTMLElement's created by this input.
 * @template TEvents - A map of all events emitted by this input.
 * @template TType - A string-literal type brand.  Identical to the input class name.
 */
declare abstract class Input<TValueType extends ValidInputValue = ValidInputValue, TOptions extends ValidInputOptions = InputOptions, TElements extends ElementMap = ElementMap, TEvents extends InputEvents = InputEvents<TValueType>, TType extends InputType = InputType, T__TYPE = (typeof INPUT_TYPE_MAP)[TType]> {
    folder: Folder;
    abstract readonly __type: TType;
    abstract state: State<TValueType>;
    abstract initialValue: ValidInputValue;
    readonly opts: TOptions & {
        __type: T__TYPE;
    };
    /**
     * Unique identifier for the input. Also used for saving and loading presets.
     * @default `<folder_title>:<input_type>:<input_title>`
     */
    id: string;
    /**
     * Whether the input was initialized with a bind target/key.
     * @default false
     */
    bound: boolean;
    /**
     * All HTMLElement's created by this input.
     */
    elements: {
        container: HTMLElement;
        title: HTMLElement;
        content: HTMLElement;
        drawer: HTMLElement;
        drawerToggle: HTMLElement;
        controllers: TElements;
        resetBtn: HTMLElement;
    };
    /**
     * Whether the controllers should bubble their events up to the input and it's listeners.
     * If false, the next update will be silent, after which the flag will be reset to true.
     */
    bubble: boolean;
    private _title;
    private _index;
    private _disabled;
    private _hidden;
    /**
     * Prevents the input from registering commits to undo history until
     * {@link unlock} is called.
     */
    private _undoLock;
    /**
     * The commit object used to store the initial value of the input when
     * {@link lock} is called.
     */
    private lockCommit;
    /**
     * The input's {@link EventManager}.
     */
    protected _dirty: () => boolean;
    protected _evm: EventManager<TEvents>;
    listen: <TTarget extends Element | Window | Document, TEventName extends keyof GlobalEventHandlersEventMap | (string & {}), TEventInstance extends TEventName extends keyof GlobalEventHandlersEventMap ? GlobalEventHandlersEventMap[TEventName] & {
        target: TTarget;
    } : Event>(element: TTarget, event: TEventName, callback: (e: TEventInstance) => void, options?: AddEventListenerOptions, groupId?: string) => string;
    on: <K extends keyof TEvents>(event: K, callback: EventCallback<TEvents[K]>) => string;
    private __log;
    constructor(options: TOptions & {
        __type: T__TYPE;
    }, folder: Folder);
    get value(): TValueType;
    /**
     * The title displayed on this Input's label.
     */
    get title(): string;
    set title(v: string);
    /**
     * The main Element.  Usually a container div for the rest of the Input's
     * {@link Input.elements|`elements`}.
     */
    get element(): HTMLElement;
    get index(): number;
    set index(v: number);
    get undoManager(): UndoManager | undefined;
    /**
     * Whether the input is disabled.  A function can be used to dynamically determine the
     * disabled state.
     */
    get disabled(): boolean;
    set disabled(v: boolean | (() => boolean));
    /**
     * Completely hides the Input from view when set to `true`.
     */
    get hidden(): boolean;
    set hidden(v: boolean | (() => boolean));
    /**
     * Wether the current state value differs from the initial state value.
     * @internal
     */
    protected get dirty(): boolean;
    /**
     * Updates the Input's state to the given value.
     */
    abstract set(v: TValueType): void;
    protected resolveState<T = TValueType>(opts: TOptions): State<T>;
    protected resolveInitialValue(opts: TOptions): any;
    /**
     * Called from subclasses at the end of their `set` method to emit the `change` event.
     */
    _emit(event: keyof TEvents, v?: TValueType): this;
    /**
     * Prevents the input from registering undo history, storing the initial
     * for the eventual commit in {@link unlock}.
     */
    protected lock: (from?: unknown) => void;
    /**
     * Unlocks commits and saves the current commit stored in lock.
     */
    protected unlock: (commit?: Partial<Commit>) => void;
    /**
     * Commits a change to the input's value to the undo manager.
     */
    commit(commit: Partial<Commit>): void;
    /**
     * Enables the input and any associated controllers.
     */
    enable(): this;
    /**
     * Disables the input and any associated controllers. A disabled input's state can't be
     * changed or interacted with.
     */
    disable(): this;
    /**
     * Refreshes the value of any controllers to match the current input state.
     */
    refresh(v?: TValueType): this | undefined;
    save(overrides?: Partial<InputPreset<TOptions>>): Omit<InputOptions<any, Record<any, any>>, "title" | "saveable"> & {
        __type: InputOptionType;
        presetId: string;
        title: string;
        value: ValidInputValue;
        disabled: boolean;
        hidden: boolean;
        order: number;
        resettable: boolean;
    } & Partial<InputPreset<TOptions>>;
    load(json: InputPreset<TOptions> | string): void;
    dispose(): void;
}

type InferOptions<T> = T extends number ? NumberInputOptions : T extends boolean ? SwitchInputOptions : T extends Array<infer T> ? SelectInputOptions<T> : T extends Option<infer T> ? SelectInputOptions<T> : T extends ColorFormat ? ColorInputOptions : T extends string ? TextInputOptions : InputOptions;
type InferInput<T> = T extends number ? InputNumber : T extends boolean ? InputSwitch : T extends Array<infer T> ? InputSelect<T> : T extends Option<infer T> ? InputSelect<T> : T extends ColorFormat ? InputColor : T extends string ? InputText : ValidInput;
interface FolderOptions {
    __type?: 'FolderOptions';
    /**
     * The element to append the folder to (usually
     * the parent folder's content element).
     */
    container: HTMLElement;
    /**
     * The title of the folder.
     * @defaultValue `''`
     */
    title?: string;
    /**
     * A preset namespace to use for saving/loading.  By default, the {@link title|`title`}
     * is used, in combiniation with the parent folder's title (and so on up the hierarchy).
     * Therefore, if you want to use presets, you will only need to set this if you:
     * - Use the same title for multiple inputs _in the same {@link Folder}_, or
     * - Leave all titles empty
     * Otherwise, this can be left as the default and presets will work as expected.
     * @defaultValue {@link title|`title`}
     */
    presetId?: string;
    /**
     * The child folders of this folder.
     */
    children?: Folder[];
    /**
     * Whether the folder should be collapsed by default.
     * @defaultValue `false`
     */
    closed?: boolean;
    /**
     * Whether the folder should be hidden by default.  If a function is
     * provided, it will be called to determine the hidden state.  Use
     * {@link refresh} to update the hidden state.
     * @defaultValue `false`
     */
    hidden?: boolean | (() => boolean);
    /**
     * Any controls this folder should contain.
     */
    controls?: Map<string, ValidInput>;
    /**
     * Whether this Folder should be saved as a {@link FolderPreset} when saving the
     * {@link GuiPreset} for the {@link Gui} this Folder belongs to.  If `false`, this Input will
     * be skipped.
     * @defaultValue `true`
     */
    saveable?: boolean;
    /**
     * When `true`, a search input will be added to the folder's toolbar, allowing users to search
     * for inputs within the folder by title.  By default, only the root folder is searchable.
     * @defaultValue `false`
     */
    searchable?: boolean;
}
/**
 * A folder preset stores the state of a folder and all of its inputs, as well as the state of all
 * child folders and their inputs.
 */
interface FolderPreset {
    __type: 'FolderPreset';
    id: string;
    title: string;
    closed: boolean;
    hidden: boolean;
    children: FolderPreset[];
    inputs: InputPreset<any>[];
}
interface FolderElements {
    header: HTMLElement;
    title: HTMLElement;
    contentWrapper: HTMLElement;
    content: HTMLElement;
    toolbar: {
        container: HTMLElement;
        settingsButton?: HTMLButtonElement & {
            tooltip?: Tooltip;
        };
    };
}
interface FolderEvents {
    /**
     * When any input in the folder changes, this event emits the input that changed.
     */
    change: ValidInput;
    /**
     * When the folder is opened or closed, this event emits the new
     * {@link Folder.closed | `closed`} state.
     */
    toggle: Folder['closed']['value'];
    /**
     * Fires when {@link Folder.refresh} is called.
     */
    refresh: void;
    /**
     * Fired after the folder and all of it's children/graphics have been mounted.
     */
    mount: void;
}
/**
 * Folder is a container for organizing and grouping {@link Input|Inputs} and child Folders.
 *
 * This class should not be instantiated directly.  Instead, use the {@link Gui.addFolder} method.
 *
 * @example
 * ```typescript
 * const gui = new Gui()
 * const folder = gui.addFolder({ title: 'My Folder' })
 * folder.addNumber({ title: 'foo', value: 5 })
 * ```
 */
declare class Folder {
    #private;
    __type: "Folder";
    isRoot: boolean;
    id: string;
    gui?: Gui;
    /**
     * A preset namespace to use for saving/loading.  By default, the {@link title|`title`}
     * is used, in combiniation with the parent folder's title (and so on up the hierarchy).
     * Therefore, if you want to use presets, you will only need to set this if you:
     * - Use the same title for multiple inputs _in the same {@link Folder}_, or
     * - Leave all titles empty
     * Otherwise, this can be left as the default and presets will work as expected.
     * @defaultValue {@link title|`title`}
     */
    presetId: string;
    /**
     * Whether this Folder should be saved as a {@link FolderPreset} when saving the
     * {@link GuiPreset} for the {@link Gui} this Folder belongs to.  If `false`, this Input will
     * be skipped.
     * @defaultValue `true`
     */
    saveable: boolean;
    /**
     * The child folders of this folder.
     */
    children: Folder[];
    /**
     * All inputs added to this folder.
     */
    inputs: Map<string, ValidInput>;
    /**
     * The root folder.  All folders have a reference to the same root folder.
     */
    root: Folder;
    parentFolder: Folder;
    settingsFolder: Folder;
    closed: {
        set: (value: boolean) => void;
    } & Omit<PrimitiveState<boolean>, "set">;
    element: HTMLElement;
    elements: FolderElements;
    graphics?: {
        icon: HTMLDivElement;
        connector?: {
            container: HTMLDivElement;
            svg: SVGElement;
            path: SVGPathElement;
        };
    };
    evm: EventManager<FolderEvents>;
    on: <K extends keyof FolderEvents>(event: K, callback: EventCallback<FolderEvents[K]>) => string;
    private _title;
    private _hidden;
    private _log;
    /** Used to disable clicking the header to open/close the folder. */
    private _disabledTimer?;
    /** The time in ms to wait after mousedown before disabling toggle for a potential drag. */
    private _clickTime;
    /** Whether clicking the header to open/close the folder is disabled. */
    private _clicksDisabled;
    private _depth;
    constructor(options: FolderOptions);
    /**
     * The folder's title.  Changing this will update the UI.
     */
    get title(): string;
    set title(v: string);
    /**
     * Whether the folder is visible.
     */
    get hidden(): boolean | (() => boolean);
    set hidden(v: boolean | (() => boolean));
    /**
     * A flat array of all child folders of this folder (and their children, etc).
     */
    get allChildren(): Folder[];
    /**
     * A flat array of all inputs in all child folders of this folder (and their children, etc).
     * See Input Generators region.
     */
    get allInputs(): Map<string, ValidInput>;
    isRootFolder(): this is Folder & {
        isRoot: true;
    };
    addFolder(title?: string, options?: Partial<FolderOptions>): Folder;
    private _handleClick;
    private _disableClicks;
    private _resetClicks;
    toggle: () => void;
    open(updateState?: boolean): void;
    close(updateState?: boolean): void;
    toggleHidden(): void;
    hide(): void;
    show(): void;
    resolvePresetId: (opts?: FolderOptions) => string;
    save(): FolderPreset;
    /**
     * Updates all inputs with values from the {@link FolderPreset}.  If the preset has children,
     * those presets will also be passed to the corresponding child folders'
     * {@link Folder.load|`load`} method.
     */
    load(preset: FolderPreset): void;
    /**
     * Updates the ui for all inputs belonging to this folder to reflect their current values.
     */
    refresh(): void;
    /**
     * Updates the ui for all inputs in this folder and all child folders recursively.
     */
    refreshAll(): void;
    addMany(obj: Record<string, any>, options?: {
        folder?: Folder;
    }): void;
    add(title: string, options: SwitchInputOptions): InputSwitch;
    add(options: SwitchInputOptions, never?: never): InputSwitch;
    add(title: string, options: NumberInputOptions): InputNumber;
    add(options: NumberInputOptions, never?: never): InputNumber;
    add(title: string, options: TextInputOptions): InputText;
    add(options: TextInputOptions, never?: never): InputText;
    add(title: string, options: ColorInputOptions): InputColor;
    add(options: ColorInputOptions, never?: never): InputColor;
    add(title: string, options: ButtonInputOptions): InputButton;
    add(options: ButtonInputOptions, never?: never): InputButton;
    add(title: string, options: ButtonGridInputOptions): InputButtonGrid;
    add(options: ButtonGridInputOptions, never?: never): InputButtonGrid;
    add<T>(title: string, options: SelectInputOptions<T>): InputSelect<T>;
    add<T>(options: SelectInputOptions<T>, never?: never): InputSelect<T>;
    add(options: InputOptions, never?: never): ValidInput;
    /**
     * Binds an input to a target object and key.  The input will automatically update the target
     * object's key when the input value changes.
     * @param target - The object to bind the input to.
     * @param key - The key of the target object to bind the input to.
     * @param options - The {@link InputOptions}, the type of which is inferred based on the type
     * of the value at the {@link target} object's {@link key}.
     * @example
     * ```ts
     * const gui = new Gui()
     * const params = { foo: 5, bar: 'baz' }
     * const folder = gui.addFolder('params')
     *
     * const numberInput = folder.bind(params, 'foo', { min: 0, max: 10, step: 1 })
     * //    ^? `InputNumber`
     *
     * const textInput = folder.bind(params, 'bar', { maxLength: 50 })
     * //    ^? `InputText`
     */
    bind<TTarget extends Record<string, any>, TKey extends keyof TTarget, TValue extends TTarget[TKey], TOptions extends InferOptions<TValue>, TInput extends InferInput<TValue>>(target: TTarget, key: TKey, options?: Partial<TOptions>): TInput;
    /**
     * Explicitly adds an {@link InputNumber} to the folder.
     */
    addNumber(title: string, options: NumberInputOptions): InputNumber;
    addNumber(options: NumberInputOptions, never?: never): InputNumber;
    /**
     * Explicitly binds an {@link InputNumber} to the provided key on the given target object.
     */
    bindNumber<T extends Record<string, any>, K extends keyof T>(target: T, key: K, options?: Partial<NumberInputOptions>): InputNumber;
    bindNumber(title: string, options: Partial<NumberInputOptions>): InputNumber;
    /**
     * Explicitly adds an {@link InputText} to the folder.
     */
    addText(title: string, options: TextInputOptions): InputText;
    addText(options: TextInputOptions, never?: never): InputText;
    /**
     * Explicitly binds an {@link InputText} to the provided key on the given target object.
     */
    bindText<T extends Record<string, any>, K extends keyof T>(target: T, key: K, options?: Partial<TextInputOptions>): InputText;
    bindText(title: string, options: Partial<TextInputOptions>): InputText;
    /**
     * Explicitly adds an {@link InputColor} to the folder.
     */
    addColor(title: string, options: ColorInputOptions): InputColor;
    addColor(options: ColorInputOptions, never?: never): InputColor;
    /**
     * Explicitly binds an {@link InputColor} to the provided key on the given target object.
     */
    bindColor<T extends Record<string, any>, K extends keyof T>(target: T, key: K, options?: Partial<ColorInputOptions>): InputColor;
    bindColor(title: string, options: Partial<ColorInputOptions>): InputColor;
    /**
     * Explicitly adds an {@link InputButton} to the folder.
     */
    addButton(title: string, options: ButtonInputOptions): InputButton;
    addButton(options: ButtonInputOptions, never?: never): InputButton;
    /**
     * Explicitly binds an {@link InputButton} to the provided key on the given target object.
     */
    bindButton<T extends Record<string, any>, K extends keyof T>(target: T, key: K, options?: Partial<ButtonInputOptions>): InputButton;
    bindButton(title: string, options: Partial<ButtonInputOptions>): InputButton;
    /**
     * Explicitly adds an {@link InputButtonGrid} to the folder.
     */
    addButtonGrid(title: string, options: ButtonGridInputOptions): InputButtonGrid;
    addButtonGrid(options: ButtonGridInputOptions, never?: never): InputButtonGrid;
    /**
     * Explicitly binds an {@link InputButtonGrid} to the provided key on the given target object.
     */
    bindButtonGrid<T extends Record<string, any>, K extends keyof T>(target: T, key: K, options?: Partial<ButtonGridInputOptions>): InputButtonGrid;
    bindButtonGrid(title: string, options: Partial<ButtonGridInputOptions>): InputButtonGrid;
    /**
     * Explicitly adds an {@link InputSelect} to the folder.
     */
    addSelect<T>(title: string, options: SelectInputOptions<T>): InputSelect<T>;
    addSelect<T>(options: SelectInputOptions<T>, never?: never): InputSelect<T>;
    /**
     * Explicitly binds an {@link InputSelect} to the provided key on the given target object.
     */
    bindSelect<T extends Record<any, any> = Record<any, any>, K extends keyof T = keyof T>(target: T, key: K, options?: Partial<SelectInputOptions<T>>): InputSelect<T>;
    bindSelect<T>(title: string, options: Partial<SelectInputOptions<T>>): InputSelect<T>;
    /**
     * Explicitly adds an {@link InputSwitch} to the folder.
     */
    addSwitch(title: string, options: SwitchInputOptions): InputSwitch;
    addSwitch(options: SwitchInputOptions, never?: never): InputSwitch;
    /**
     * Explicitly binds an {@link InputSwitch} to the provided key on the given target object.
     */
    bindSwitch<T, K extends keyof T>(target: T, key: K, options?: Partial<SwitchInputOptions>): InputSwitch;
    bindSwitch(title: string, options: Partial<SwitchInputOptions>): InputSwitch;
    /**
     * Does validation / error handling.
     * If no title was provided, this method will also assign the binding key to the title.
     * @returns The processed options.
     */
    private _validateOptions;
    private _createInput;
    private _resolveOptions;
    private _resolveBinding;
    private _resolveType;
    private _createElement;
    private _createElements;
    private _createGraphics;
    private _createSvgs;
    get hue(): number;
    private _refreshIcon;
    disposed: boolean;
    dispose(): void;
}

type ElementOrSelector = string | HTMLElement | undefined | 'document' | 'window';
type ElementsOrSelectors = ElementOrSelector | ElementOrSelector[];

type Placement = 'center' | `${TBC}-${LRC}` | `${LRC}-${TBC}`;
type LeftRight = 'left' | 'right';
type LRC = LeftRight | 'center';
type TopBottom = 'top' | 'bottom';
type TBC = TopBottom | 'center';
type VirtualRect$1 = Record<string, any> & {
    x: number;
    y: number;
    width: number;
    height: number;
};
type Vec2 = {
    x: number;
    y: number;
};
type PlacementOptions = Parameters<typeof place>[2];
/**
 * Determines the x and y position of an element relative to
 * a bounding box based on a given {@link Placement} string.
 * Optional {@link PlacementOptions} can be provided to specify
 * the bounding box and a margin.
 *
 * @param node - The element to place.
 * @param placement - The {@link Placement} string.
 * @param options - The {@link PlacementOptions}.
 * @param options.bounds - The bounding box to place the element within.
 * @param options.margin - The margin in pixels to apply to the placement.
 *
 * @example
 * ```ts
 * const { x, y } = place(node, 'top-right', { bounds: window, margin: 10 })
 * ```
 */
declare function place(node: DOMRect | VirtualRect$1 | (Record<string, any> & {
    width: number;
    height: number;
}) | ElementOrSelector, placement?: string, options?: {
    /**
     * The bounding box to place the element within.  Can be a
     * DOMRect, custom {@link VirtualRect}, or `'window'`.
     * @default 'window'
     */
    bounds?: DOMRect | VirtualRect$1 | 'window' | ElementOrSelector;
    /**
     * The margin in pixels to apply to the placement.  Can be a number
     * to apply the same margin to both x and y, or an object with x
     * and y properties to apply different margins to each axis.
     * @default 16
     */
    margin?: number | Vec2;
}): Vec2;

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
     * @defaultValue ['right', 'bottom']
     */
    sides: Side[];
    /**
     * To only allow resizing on certain corners, specify them here.
     * @defaultValue ['bottom-right']
     */
    corners: ('top-left' | 'top-right' | 'bottom-right' | 'bottom-left')[];
    /**
     * The size of the resize handle in pixels.
     * @defaultValue 6
     */
    grabberSize: number;
    /**
     * Optional callback function that runs when the element is resized.
     * @defaultValue () => void
     */
    onResize: (size: {
        width: number;
        height: number;
    }) => void;
    /**
     * If provided, the size of the element will be persisted
     * to local storage under the specified key.
     * @defaultValue undefined
     */
    localStorageKey?: string;
    /**
     * Use a visible or invisible gutter.
     * @defaultValue false
     */
    visible: boolean;
    /**
     * Gutter css color (if visible = `true`)
     * @defaultValue 'var(--fg-d, #1d1d1d)'
     */
    color: string;
    /**
     * The max opacity (0-1) when hovering/dragging a grabber.
     * @defaultValue 1
     */
    opacity: number;
    /**
     * Border radius of the element.
     * @defaultValue '0.5rem'
     */
    borderRadius: string;
    /**
     * The element to use as the bounds for resizing.
     * @defaultValue window['document']['documentElement']
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
     * @defaultValue { default: 'resize-grabber', active: 'resize-grabbing' }
     */
    classes: {
        /** @defaultValue 'resize-grabber' */
        default: string;
        /** @defaultValue 'resize-grabbing' */
        active: string;
    };
    /**
     * Whether the element is disabled.
     * @defaultValue false
     */
    disabled: boolean;
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

/**
 * Represents a dom element's bounding rectangle.
 */
interface VirtualRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
/**
 * Data passed to listeners of the {@link DraggableOptions.onDragStart|onDragStart},
 * {@link DraggableOptions.onDrag|onDrag}, {@link DraggableOptions.onDragEnd|onDragEnd}, and
 * {@link DraggableOptions.onCollision|onCollision} events.
 */
type DragEventData = {
    /**
     * The node on which the draggable is applied
     */
    rootNode: HTMLElement;
    /**
     * Total horizontal movement from the node's original position.
     */
    x: number;
    /**
     * Total vertical movement from the node's original position.
     */
    y: number;
    /**
     * The complete event object.
     */
    eventTarget: EventTarget;
};
type DraggableOptions = {
    __type?: 'DraggableOptions';
    /**
     * The boundary to which the draggable element is limited to.
     *
     * Valid values:
     *
     * - `undefined` - defaults to `document.documentElement`
     * - An `HTMLElement` or query selector string, _i.e. `.container` or `#container`_
     * - `'parent'` - the element's {@link HTMLElement.offsetParent|offsetParent}
     * - `'body'` - `document.body`
     * - `false` - no boundary
     * - `{ top: number, right: number, bottom: number, left: number }` - A custom {@link VirtualRect rect} relative to the viewport.
     *
     * **Note**: Make sure the bounds is smaller than the node's min size.
     * @default undefined
     */
    bounds?: ElementOrSelector;
    /**
     * Axis on which the element can be dragged on.
     * - `both` - Element can move in any direction
     * - `x` - Only horizontal movement possible
     * - `y` - Only vertical movement possible
     * - `none` - No movement at all
     * @default 'both'
     */
    axis: 'both' | 'x' | 'y' | 'none';
    /**
     * Custom transform function. If provided, this function will be used to
     * apply the DOM transformations to the root node to move it.
     *
     * You can return a {@link https://developer.mozilla.org/docs/Web/CSS/transform | transform} property
     * return nothing to apply your own transformations via
     * {@link https://developer.mozilla.org/docs/Web/CSS/transform | node.style.transform}
     * @default undefined
     */
    transform?: (data: DragEventData) => {
        x: number;
        y: number;
    } | void | undefined;
    /**
     * Applies `user-select: none` to the `<body />` element when dragging. `false` disables it.
     * @default true
     */
    userSelectNone: boolean;
    /**
     * Ignore touch events with more than 1 touch. Helpful for preserving pinch-to-zoom behavior on a pages with multiple draggable's.
     * @default false
     */
    ignoreMultitouch: boolean;
    /**
     * Disables dragging altogether.
     * @default false
     */
    disabled: boolean;
    /**
     * The default position of the draggable element.
     * @default { x: 0, y: 0 }
     */
    position?: {
        x?: number;
        y?: number;
    } | Placement;
    /**
     * If {@link position} is a {@link Placement} string, these
     * {@link PlacementOptions} will be used to calculate the position.
     * @default { margin: 0 }
     */
    placementOptions: PlacementOptions;
    /**
     * An element or selector (or any combination of the two) for element(s) inside
     * the parent node upon which dragging should be disabled when clicked.
     * @default undefined
     */
    cancel: ElementsOrSelectors;
    /**
     * CSS Selector of an element or multiple elements inside the parent node on
     * which `use:draggable` is applied).  If provided, only clicking and dragging
     * handles will activate dragging.
     *
     * @default undefined
     */
    handle: ElementsOrSelectors;
    /**
     * Element's or selectors which will act as collision obstacles for the draggable element.
     */
    obstacles: ElementsOrSelectors;
    classes: {
        /**
         * Class to apply on the element on which `use:draggable` is applied.
         *
         * __Note:__ If `handle` is provided, this class will still be applied
         * to the draggable element itself, __NOT__ the handle element.
         * @default 'fractils-draggable'
         */
        default: string;
        /**
         * Class to apply on the element when it is dragging.
         * @default 'fractils-dragging'
         */
        dragging: string;
        /**
         * Class to apply on the element if it has been dragged at least once.
         * @default 'fractils-dragged'
         */
        dragged: string;
        /**
         * Elements with this class will disable dragging when clicked.
         * @default 'fractils-cancel'
         */
        cancel: string;
    };
    /**
     * Fires on `pointerdown` for the element / valid handle elements.
     */
    onDragStart: (data: DragEventData) => void;
    /**
     * Fires on `pointermove` while dragging.
     */
    onDrag: (data: DragEventData) => void;
    /**
     * Fires on `pointerup`.
     */
    onDragEnd: (data: DragEventData) => void;
    /**
     * Fires when the element collides with an obstacle.
     */
    onCollision: (data: {
        x: number;
        y: number;
    }) => void;
    /**
     * If provided, the position will persist in local storage under this key.
     * @default undefined
     */
    localStorageKey?: string;
};
/**
 * Make an element draggable.  Supports touch, mouse, and pointer events,
 * and has options for bounds / obstacle collision detection, programatic
 * position control, custom transforms, and more.
 *
 * @example
 * ```js
 * import { Draggable } from 'fractils'
 *
 * const element = document.createElement('div')
 *
 * const draggable = new Draggable(element, {
 * 	bounds: 'body'
 * })
 * ```
 */
declare class Draggable {
    #private;
    node: HTMLElement;
    static initialized: boolean;
    opts: DraggableOptions;
    /**
     * Disables user interaction with the draggable element.
     */
    disabled: boolean;
    /**
     * Used in  {@link update} to account for the difference between
     * the node's position and the user's exact click position on the node.
     */
    clickOffset: {
        x: number;
        y: number;
    };
    /**
     * The distance between the pointer's position and the node's position.
     */
    clientToNodeOffset: {
        x: number;
        y: number;
    };
    /**
     * An internal representation of the {@link node|node's} bounding rectangle.
     * Used for collision detection and animations.
     */
    rect: VirtualRect;
    boundsEl?: HTMLElement;
    handleEls: HTMLElement[];
    cancelEls: HTMLElement[];
    obstacleEls: HTMLElement[];
    /**
     * A rectangle representing the draggable element's boundary, if any.
     */
    bounds: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    private _storage?;
    private _position;
    /**
     * Programmatically sets the position of the draggable element.
     */
    get position(): {
        x: number;
        y: number;
    };
    set position(v: {
        x: number;
        y: number;
    });
    /**
     * @todo I think we can just remove this and let the user add their
     * own event listeners if they want to target a specific element.
     */
    eventTarget?: HTMLElement;
    /**
     * An observable store that updates the draggable element's position.
     */
    positionStore: Writable<{
        x: number;
        y: number;
    }>;
    constructor(node: HTMLElement, options?: Partial<DraggableOptions>);
    /**
     * The x position of the draggable element's transform offset.
     */
    get x(): number;
    set x(v: number);
    /**
     * The y position of the draggable element's transform offset.
     */
    get y(): number;
    set y(v: number);
    /**
     * Whether the draggable element can move in the x direction,
     * based on the {@link DraggableOptions.axis|axis} option.
     */
    get canMoveX(): boolean;
    /**
     * Whether the draggable element can move in the x direction,
     * based on the {@link DraggableOptions.axis|axis} option.
     */
    get canMoveY(): boolean;
    get eventData(): DragEventData;
    get isControlled(): boolean;
    dragStart: (e: PointerEvent) => void;
    drag: (e: PointerEvent) => void;
    dragEnd: () => void;
    resize: () => void;
    /**
     * Moves the {@link node|draggable element} to the specified position, adjusted
     * for collisions with {@link obstacleEls obstacles} or {@link boundsRect bounds}.
     */
    moveTo(target: {
        x: number;
        y: number;
    }): void;
    update(v?: {
        x: number;
        y: number;
    }): void;
    /**
     * Updates the {@link position} property in local storage.
     */
    updateLocalStorage: () => void;
    clearLocalStorage: () => void;
    /**
     * Resolves a {@link DraggableOptions.position} option into an `{x,y}` vector
     * depending on its type:
     * - `undefined` -> {@link DRAGGABLE_DEFAULTS.position}
     * - {@link Placement} -> {@link place}
     * - `{x,y}` -> itself *(merged with {@link DRAGGABLE_DEFAULTS.position}*
     * if it's a partial.)
     */
    resolvePosition(pos: DraggableOptions['position']): Vec2;
    dispose(): void;
}

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
    position: PrimitiveState<{
        x: number;
        y: number;
    }>;
    size: PrimitiveState<{
        width: number;
        height: number;
    }>;
    constructor(manager: WindowManager, node: HTMLElement, options?: WindowInstanceOptions);
    dispose(): void;
}

declare class ThemeEditor {
    targetGui: Gui;
    gui: Gui;
    private _log;
    get folder(): Folder;
    constructor(targetGui: Gui);
    dispose(): void;
    get vars(): {
        color: ColorTheme;
    } & {
        [x: string]: VariableDefinition;
    };
    generate: () => void;
}

interface PresetManagerOptions {
    __type?: 'PresetManagerOptions';
    disabled?: boolean;
    /**
     * Optionsal existing presets.
     * @default []
     */
    presets?: GuiPreset[];
    /**
     * The default preset to use.
     * @default undefined
     */
    defaultPreset?: GuiPreset;
    /**
     * The key to use for storage.  If not provided, storage is disabled.
     * @default undefined
     */
    localStorageKey?: string;
    autoInit?: boolean;
}
declare class PresetManager {
    gui: Gui;
    parentFolder: Folder;
    readonly __type: string;
    readonly __version: string;
    defaultPreset: GuiPreset;
    activePreset: State<GuiPreset>;
    presets: State<GuiPreset[]>;
    folder: Folder;
    private _defaultPresetId;
    private _defaultPresetTitle;
    private _presetSnapshot?;
    private _presetsInput;
    private _manageInput;
    private _renamePresetButton;
    private _initialized;
    private _log;
    constructor(gui: Gui, parentFolder: Folder, options: PresetManagerOptions);
    opts: PresetManagerOptions;
    get defaultPresetIsActive(): boolean;
    init(): Promise<this | undefined>;
    /**
     * Set the active preset.
     */
    set(value: GuiPreset): void;
    private _renamePreset;
    private _resolveUnusedTitle;
    private _resolveDefaultPreset;
    addGui(parentFolder: Folder, defaultPreset?: GuiPreset): Promise<Folder>;
    /**
     * Updates a preset if it exists, adds it as a new preset if not, or creates a new one from the
     * current state and adds it if none is provided.
     */
    put(
    /**
     * The preset to update or add.  If not provided, a new preset is created from the current state.
     */
    preset?: GuiPreset): void;
    /**
     * Delete a preset.
     */
    delete(preset: GuiPreset | GuiPreset['id']): void;
    private _isInitialized;
    private _toggleRename;
    /**
     * When the rename button is active, clicking it to disable triggers a blur event which
     * disables it immediately before the click event is triggered, re-enabling it.
     *
     * The latch and timer prevent that from happening.
     */
    private _blurLatch;
    private _blurLatchTimer;
    /**
     * Disables the dropdown, making the select's text editable.
     */
    private _enableRename;
    private _handleRename;
    private _handleKeydown;
    private _refreshInputs;
    /**
     * Refresh the presets input.
     */
    private _refresh;
    dispose(): void;
}

/**
 * A JSON representation of the {@link Themer} class. Used in the
 * {@link Themer.toJSON | toJSON()} and {@link Themer.fromJSON | fromJSON()},
 * methods, and subsequently, in {@link Themer.save | save()}
 * and {@link Themer.load | load()}.
 */
interface ThemerJSON {
    themes: Theme[];
    activeTheme: ThemeTitle;
    mode: ThemeMode;
}
/**
 * Options for the {@link Themer} class.
 */
interface ThemerOptions {
    /**
     * Whether to automatically initialize the theme.
     * @default true
     */
    autoInit: boolean;
    /**
     * Whether to persist the Themer state in localStorage.
     * @default true
     */
    persistent: boolean;
    /**
     * The default theme to use.
     * @default A theme titled 'default'.
     */
    theme: ThemeDefinition;
    themes: Array<Theme>;
    mode: ThemeMode;
    /**
     * The key to store the theme in localStorage.
     * @default 'fractils::themer'
     */
    localStorageKey?: string;
    wrapper?: HTMLElement;
    /**
     * Additional variables to apply to the theme.
     * @default {}
     */
    vars?: ExtendedVars;
}
/**
 * The `Themer` class manages multiple customizable themes.  These themes
 * can be applied globally to the document, or scoped to a specific node.
 *
 * A {@link Theme} is a collection of CSS custom properties, most
 * importantly, shades / colors.  Themes can be created as JavaScript
 * objects or JSON in the form of a {@link ThemeDefinition}, which is
 * just a Partial<{@link Theme}> run through {@link resolveTheme} to
 * generate `theme.colors.dark` and `theme.colors.light` variants from
 * `theme.colors.base`.  This can be extended arbitrarily (// todo //).
 *
 * It can be used to store, retrieve, create, and apply themes. It can
 * apply themes to either the root document, or a specific node and
 * its children. Each {@link ThemeDefinition} has light and dark
 * variants (auto-generated if not specified), and the active
 * variant isdetermined by the current {@link ThemeMode},
 * which can be set to 'light', 'dark', or 'system'.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 * 	import { Themer } from 'fractils'
 * 	import my_theme from './themes/my_theme'
 *
 * 	const themer = new Themer('document', {
 * 		theme: my_theme,    // optional theme definition (JS object or JSON)
 * 		themes: [my_theme], // optional array of themes
 * 		mode: 'dark',       // optional initial mode ('light', 'dark', or 'system')
 * 	})
 * </script>
 *
 * <h1>{themer.theme.title}</h1>
 * <button on:click={() => themer.mode = 'dark'}>dark mode</button>
 * <button on:click={() => themer.addTheme({...})}>add theme</button>
 * ```
 */
declare class Themer {
    #private;
    /**
     * The element to theme.
     */
    node: HTMLElement;
    /**
     * The currently active theme.  When `theme.set` is called, the new theme
     * passed in is automatically applied.
     */
    theme: State<Theme>;
    /**
     * All themes available to the themer.
     */
    themes: State<Theme[]>;
    /**
     * The title of the currently active {@link theme}.
     *
     * When {@link ThemerOptions.persistent} is `true`, this value is
     * saved to localStorage and used to restore the theme on page load.
     */
    activeThemeTitle: State<ThemeTitle>;
    /**
     * The current mode ('light', 'dark', or 'system').
     *
     * When this state value is re-assigned with `mode.set`, the current theme
     * is automatically updated.
     *
     * When {@link ThemerOptions.persistent} is `true`, this value is saved
     * to localStorage and used to restore the mode on page load.
     */
    mode: State<'light' | 'dark' | 'system'>;
    /**
     * If provided, theme css vars will be added to the wrapper.
     */
    wrapper?: HTMLElement;
    private _initialized;
    private _persistent;
    private _key;
    private _unsubs;
    private _targets;
    private _log;
    constructor(
    /**
     * The element to theme.  Can be a selector, id (`#id`), a
     * DOM element, or the string literal `'document'` to use
     * the document element.
     * @default 'document'
     */
    node?: ElementOrSelector | Document | 'document', options?: Partial<ThemerOptions>);
    init(): this | undefined;
    /**
     * The active theme's variables based on the current mode.
     */
    get modeColors(): ModeColors;
    get baseColors(): BaseColors;
    get allColors(): ModeColors & BaseColors;
    /**
     * The current mode, taking into account the system preferences.
     */
    get activeMode(): 'light' | 'dark';
    /**
     * Adds a new theme to the Themer and optionally saves it to localStorage.
     */
    create: (newTheme: Theme, options?: {
        /**
         * Whether to overwrite an existing theme with the same title,
         * or increment the title with a number suffix.
         * @default false
         */
        overwrite?: boolean;
        /**
         * Whether to re-save the Themer state to localStorage
         * after adding the new theme.  If {@link ThemerOptions.persistent}
         * is `false`, this option is ignored.
         * @default true
         */
        save?: boolean;
    }) => this;
    delete(themeOrTitle: ThemeTitle | Theme): this;
    /**
     * Resolves a {@link Theme} by title.
     */
    getTheme(themeTitle: ThemeTitle): Theme | undefined;
    /**
     * Applies the current theme to the document.
     */
    applyTheme: (targets?: HTMLElement[]) => this | undefined;
    /**
     * Updates Themer state from JSON.
     */
    fromJSON(json: ThemerJSON): void;
    /**
     * Serializes the current Themer state to JSON.
     */
    toJSON(): {
        themes: Theme[];
        activeTheme: string;
        mode: "light" | "dark" | "system";
    };
    /**
     * Loads Themer state from localStorage.
     * @returns The JSON that was loaded (if found).
     */
    load: () => this;
    /**
     * Saves the current Themer state to localStorage.
     * @returns The JSON that was saved.
     */
    save(): {
        themes: Theme[];
        activeTheme: string;
        mode: "light" | "dark" | "system";
    } | undefined;
    /**
     * Removes the current Themer state from localStorage.
     */
    clear(): void;
    addTarget(target: HTMLElement): void;
    dispose(): void;
}

type GuiTheme = 'default' | 'flat' | 'scour' | (string & {});
interface GuiElements {
    root: HTMLElement;
}
interface GuiOptions {
    __type: 'GuiOptions';
    /**
     * The title of the Gui.
     * @defaultValue 'gooey'
     */
    title: string;
    /**
     * Defines which properties to persist in localStorage, and under which
     * key, if any.  If `true`, the {@link GUI_STORAGE_DEFAULTS} will be used.
     * If `false`, no state will be persisted.
     * @defaultValue false
     */
    storage: boolean | Partial<GuiStorageOptions>;
    /**
     * The container to append the gui to.
     * @defaultValue 'body'
     */
    container: string | HTMLElement | 'document' | 'body';
    /**
     * Whether the gui is draggable.
     * @defaultValue `true`
     */
    draggable: boolean;
    /**
     * Whether the gui is resizable.
     * @defaultValue `true`
     */
    resizable: boolean;
    /**
     * The title of the theme to use for the gui.  To add your own themes,
     * use {@link themerOptions.themes}.
     * @defaultValue 'default'
     */
    theme: GuiTheme;
    /**
     * The themes available to the gui.
     */
    themes: Theme[];
    /**
     * The initial {@link Themer.mode|theme mode}.
     */
    themeMode: 'light' | 'dark' | 'system';
    /**
     * The gui's initial position on the screen.  If `undefined`, the gui will
     * be placed in the top-right corner of the screen.
     *
     * This value can either be a {@link Placement} string, or an object with
     * `x` and `y` properties representing the position in pixels.
     * @defaultValue 'top-right'
     */
    position: Placement | {
        x: number;
        y: number;
    };
    /**
     * The margin in pixels to apply to the placement.  Can be a number
     * to apply the same margin to both x and y, or an object with x
     * and y properties to apply different margins to each axis.
     * @default 16
     */
    margin: number | {
        x: number;
        y: number;
    };
    /**
     * The initial expanded state of the gui.
     * @defaultValue `false`
     */
    closed: boolean;
    /**
     * Presets to make available in the gui.
     * @defaultValue `[]`
     */
    presets?: GuiPreset[];
    /**
     * The default preset to load when the gui is created, or the initial gui state if undefined.
     * @defaultValue `undefined`
     */
    defaultPreset?: GuiPreset;
    /**
     * A unique id for the gui's root element.
     * @defaultValue {@link nanoid}
     */
    id?: string;
    /**
     * @internal
     */
    _windowManager?: WindowManager;
    /**
     * @internal
     */
    _themer?: Themer;
}
interface GuiStorageOptions {
    __type: 'GuiStorageOptions';
    /**
     * Prefix to use for localStorage keys.
     * @defaultValue `"fractils::gui"`
     */
    key: string;
    /**
     * Whether to persist the folder's expanded state.
     * @defaultValue `true`
     */
    closed?: boolean;
    /**
     * Whether to persist the theme.
     * @defaultValue `true`
     */
    theme?: boolean;
    /**
     * Whether to persist the gui's position.
     * @defaultValue `false`
     */
    position?: boolean;
    /**
     * Whether to persist the gui's size.
     * @defaultValue `false`
     */
    size?: boolean;
    /**
     * Whether to persist the gui's presets.
     * @defaultValue `true`
     */
    presets?: boolean;
}
interface GuiPreset {
    __type: 'GuiPreset';
    __version: number;
    id: string;
    title: string;
    data: FolderPreset;
}
declare const GUI_STORAGE_DEFAULTS: GuiStorageOptions;
declare const GUI_WINDOWMANAGER_DEFAULTS: {
    readonly __type: "WindowManagerOptions";
    readonly preserveZ: false;
    readonly zFloor: 0;
    readonly bounds: undefined;
    readonly obstacles: undefined;
    readonly resizable: {
        readonly grabberSize: 9;
        readonly color: "var(--bg-d)";
        readonly sides: ["right", "left"];
        readonly corners: [];
    };
    readonly draggable: {
        readonly bounds: undefined;
        readonly classes: {
            readonly default: "fracgui-draggable";
            readonly dragging: "fracgui-dragging";
            readonly cancel: "fracgui-cancel";
            readonly dragged: "fracgui-dragged";
        };
    };
};
declare const GUI_DEFAULTS: {
    readonly __type: "GuiOptions";
    readonly title: "gui";
    readonly storage: false;
    readonly closed: false;
    readonly position: "top-right";
    readonly margin: 16;
    readonly container: "body";
    readonly theme: "default";
    readonly themeMode: "dark";
    readonly themes: [Theme, Theme, Theme];
    readonly resizable: true;
    readonly draggable: true;
};
/**
 * The root Gui instance.  This is the entry point for creating
 * a gui.  You can create multiple root guis, but each gui
 * can only have one root.
 */
declare class Gui {
    __type: "Gui";
    id: string;
    folder: Folder;
    elements: GuiElements;
    /**
     * The initial options passed to the gui.
     */
    opts: GuiOptions & {
        storage: GuiStorageOptions | false;
    };
    /**
     * Whether the gui root folder is currently collapsed.
     */
    closed: PrimitiveState<boolean>;
    /**
     * The {@link PresetManager} instance for the gui.
     */
    presetManager: PresetManager;
    /**
     * Whether any of the inputs have been changed from their default values in the active preset.
     */
    dirty: boolean;
    wrapper: HTMLElement;
    container: HTMLElement;
    settingsFolder: Folder;
    static settingsFolderTitle: string;
    /**
     * The {@link UndoManager} instance for the gui, handling undo/redo functionality.
     * @internal
     */
    _undoManager: UndoManager;
    themer: Themer;
    themeEditor?: ThemeEditor;
    windowManager?: WindowManager;
    /**
     * `false` if this {@link Gui}'s {@link WindowManager} belongs to an existing, external
     * instance _(i.e. a separate {@link Gui} instance or custom {@link WindowManager})_.  The
     * {@link WindowManager} will be disposed when this {@link Gui} is disposed.
     * @internal
     */
    private _isWindowManagerOwner;
    /**
     * The time of the gui's creation.
     * @internal
     */
    private readonly _birthday;
    /**
     * The number of milliseconds post-instantiation to watch for adders for repositioning.
     * @internal
     */
    private _honeymoon;
    private _theme;
    private _log;
    on: Folder['on'];
    addFolder(title: string, options?: Partial<FolderOptions>): Folder;
    add: Folder['add'];
    addMany: Folder['addMany'];
    addButtonGrid: Folder['addButtonGrid'];
    addSelect: Folder['addSelect'];
    addButton: Folder['addButton'];
    addText: Folder['addText'];
    addNumber: Folder['addNumber'];
    addSwitch: Folder['addSwitch'];
    addColor: Folder['addColor'];
    constructor(options?: Partial<GuiOptions>);
    private _reveal;
    private _createPresetManager;
    private _createWindowManager;
    set theme(theme: GuiTheme);
    get theme(): GuiTheme;
    /**
     * Saves the current gui state as a preset.
     */
    save(
    /**
     * The title of the preset.
     */
    title: string, 
    /**
     * A unique id for the preset.
     * @defaultValue {@link nanoid|nanoid(10)}
     */
    id?: string): GuiPreset;
    /**
     * Loads a given preset into the gui, updating all inputs.
     */
    load(preset: GuiPreset): void;
    _undoLock: boolean;
    lockCommit: {
        from: GuiPreset | undefined;
    };
    /**
     * Commits a change to the input's value to the undo manager.
     */
    commit(commit: Partial<Commit>): void;
    /**
     * Prevents the input from registering undo history, storing the initial
     * for the eventual commit in {@link unlockCommits}.
     */
    private lockCommits;
    /**
     * Unlocks commits and saves the current commit stored in lock.
     */
    private unlockCommits;
    private _createThemer;
    isGui(): this is Gui;
    private _createSettingsButton;
    applyAltStyle(folder: Folder): void;
    private _setProps;
    private _setVar;
    private _setVars;
    dispose: () => void;
}

export { Color, type ColorMode$1 as ColorMode, type ColorValue, Folder, GUI_DEFAULTS, GUI_STORAGE_DEFAULTS, GUI_WINDOWMANAGER_DEFAULTS, Gui, type GuiElements, type GuiOptions, type GuiPreset, type GuiStorageOptions, type State, isColor, isColorFormat, parseColorFormat, state };
