import type { WindowInstance } from './shared/WindowManager';
import type { Theme } from './styles/themer/types';
import type { FolderOptions, FolderPreset } from './Folder';
import type { Placement } from './shared/place';
import { WindowManager } from './shared/WindowManager';
import { PresetManager } from './PresetManager';
import { Themer } from './styles/themer/Themer';
import { UndoManager } from './UndoManager';
import { Folder } from './Folder';
type GooeyTheme = 'default' | 'flat' | 'scout' | (string & {});
export interface GooeyElements {
    root: HTMLElement;
    container: HTMLElement;
    wrapper: HTMLElement;
    settingsFolder: Folder;
}
export interface GooeyOptions {
    __type: 'GooeyOptions';
    /**
     * The title of the Gooey.
     * @default 'gooey'
     */
    title: string;
    /**
     * Defines which properties to persist in localStorage, and under which
     * key, if any.  If `true`, the {@link GUI_STORAGE_DEFAULTS} will be used.
     * If `false`, no state will be persisted.
     * @default true
     */
    storage: boolean | Partial<GooeyStorageOptions>;
    /**
     * The container to append the gooey to.
     * @default 'body'
     */
    container: string | HTMLElement | 'document' | 'body';
    /**
     * Whether the gooey is draggable.
     * @default true
     */
    draggable: boolean;
    /**
     * Whether the gooey is resizable.
     * @default true
     */
    resizable: boolean;
    /**
     * The title of the theme to use for the gooey.  To add your own themes,
     * use {@link themerOptions.themes}.
     * @default 'default'
     */
    theme: GooeyTheme;
    /**
     * The themes available to the gooey.
     * @defaultValue [ {@link theme_default|default}, {@link theme_flat|flat}, {@link theme_scout|scout} ]
     */
    themes: Theme[];
    /**
     * The initial {@link Themer.mode|theme mode}.
     * @default 'dark'
     */
    themeMode: 'light' | 'dark' | 'system';
    /**
     * The gooey's initial position on the screen.  If `undefined`, the gooey will
     * be placed in the top-right corner of the screen.
     *
     * This value can either be a {@link Placement} string, or an object with
     * `x` and `y` properties representing the position in pixels.
     * @default 'top-right'
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
        x?: number;
        y?: number;
    };
    /**
     * The initial width of the gooey in pixels.
     *
     * @remakrs This can also be set by overriding the `--gooey-root_width` CSS custom property on
     * the {@link Gooey.element} element `.gooey-root`, which is responsible for the root width.
     * @default undefined
     */
    width?: number;
    /**
     * The initial expanded state of the gooey.
     * @default false
     */
    closed: boolean;
    /**
     * The initial hidden state of the gooey.
     * @default false
     */
    hidden?: boolean;
    /**
     * Presets to make available in the gooey.
     * @default []
     */
    presets?: GooeyPreset[];
    /**
     * The default preset to load when the gooey is created, or the initial gooey state if undefined.
     * @default undefined
     */
    defaultPreset?: GooeyPreset;
    /**
     * A unique id for the gooey's root element.
     * @default {@link nanoid}
     */
    id?: string;
    /**
     * Whether to load the default font for use.  Set to `false` if you're overwriting
     * the `--fragcui-font` variable in your theme.
     * @default true
     */
    loadDefaultFont?: boolean;
    /**
     * Any {@link FolderOptions} for the builtin global settings folder.  It also accepts 2
     * additional settings, `uiFolder` and `presetsFolder`, which are {@link FolderOptions}
     * for the 2 sub-folders.
     * @default { closed: true }
     */
    settingsFolder?: Partial<FolderOptions> & {
        uiFolder?: Partial<FolderOptions>;
        presetsFolder?: Partial<FolderOptions>;
    };
    /**
     * An offset to apply to the initial position of the gooey.
     * @default { x: 0, y: 0 }
     */
    offset?: {
        x?: number;
        y?: number;
    };
}
export interface GooeyOptionsInternal extends GooeyOptions {
    /**
     * todo - this needs to be public, maybe as `GooeyOptions.parentGooey` so the user doesn't
     * todo - have to think about the window manager?
     * @internal
     */
    _windowManager?: WindowManager;
    /**
     * @internal
     */
    _themer?: Themer;
}
/**
 * Defines which properties to persist in localStorage, and under which
 * key.
 * @example
 * // defaults:
 * {
 *   key: 'gooey',
 *   closed: true,
 *   theme: true,
 *   presets: true,
 *   position: false,
 *   size: false,
 * }
 */
export interface GooeyStorageOptions {
    __type: 'GooeyStorageOptions';
    /**
     * Prefix to use for localStorage keys.
     *
     * @remarks The provided string is prepended to the gooey's title, lowercased, and hyphens
     * are replaced with spaces.  For example, a gooey titled `"Foo Bar"` is stored as
     * `"foo-bar::gooey"`.
     *
     * @default "default"
     */
    key: string;
    /**
     * Whether to persist the folder's expanded state.
     * @default true
     */
    closed?: boolean;
    /**
     * Whether to persist the theme.
     * @default true
     */
    theme?: boolean;
    /**
     * Whether to persist the gooey's position.
     * @default false
     */
    position?: boolean;
    /**
     * Whether to persist the gooey's size.
     * @default false
     */
    size?: boolean;
    /**
     * Whether to persist the gooey's presets.
     * @default true
     */
    presets?: boolean;
}
export interface GooeyPreset {
    __type: 'GooeyPreset';
    __version: string;
    id: string;
    title: string;
    data: FolderPreset;
}
export declare const GUI_STORAGE_DEFAULTS: GooeyStorageOptions;
/**
 * The default {@link WindowManagerOptions} for a {@link Gooey}'s
 * {@link Gooey.windowManager|window manager}.  These are handled internally via the private
 * {@link GooeyOptionsInternal._windowManager|gooey options}.
 * @internal
 */
export declare const GUI_WINDOWMANAGER_DEFAULTS: {
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
            readonly default: "gooey-draggable";
            readonly dragging: "gooey-dragging";
            readonly cancel: "gooey-cancel";
            readonly dragged: "gooey-dragged";
        };
    };
};
/**
 * The default values for {@link GooeyOptions}.
 */
export declare const GUI_DEFAULTS: {
    readonly __type: "GooeyOptions";
    readonly title: "gooey";
    readonly storage: true;
    readonly closed: false;
    readonly position: "top-right";
    readonly margin: 16;
    readonly container: "body";
    readonly theme: "vanilla";
    readonly themeMode: "dark";
    readonly themes: [Theme, Theme, Theme];
    readonly resizable: true;
    readonly draggable: true;
    readonly loadDefaultFont: true;
    readonly settingsFolder: {
        readonly closed: boolean;
        readonly uiFolder: {
            readonly closed: true;
            readonly presetId: "gooey_settings__ui_folder";
        };
        readonly presetsFolder: {
            readonly closed: true;
            readonly presetId: "gooey_settings__presets_folder";
        };
    };
    readonly offset: {
        readonly x: 0;
        readonly y: 0;
    };
};
/**
 * Methods inherited from {@link Folder} to forward to the gooey.
 * @remarks Gooey _used to_ extend {@link Folder}, but that caused more problems than it solved...
 */
declare const FORWARDED_METHODS: ["on", "add", "addMany", "addButtonGrid", "addSelect", "addButton", "addText", "addNumber", "addSwitch", "addColor", "bind", "bindMany", "bindButtonGrid", "bindSelect", "bindButton", "bindText", "bindNumber", "bindSwitch", "bindColor", "open", "close", "show", "hide", "toggle", "toggleHidden"];
export interface Gooey extends Pick<Folder, (typeof FORWARDED_METHODS)[number]> {
}
/**
 * A customizable GUI toolkit for quickly creating interactive controls panels.
 */
export declare class Gooey {
    __type: "Gooey";
    id: string;
    folder: Folder;
    elements: GooeyElements;
    /**
     * The initial options passed to the gooey.
     */
    opts: GooeyOptions & {
        storage: GooeyStorageOptions | false;
    };
    /**
     * The {@link PresetManager} instance for the gooey.
     */
    presetManager: PresetManager;
    /**
     * Whether any of the inputs have been changed from their default values in the active preset.
     */
    dirty: boolean;
    /**
     * A transparent (display:contents) wrapper for the Gooey.  Used for the global style variables.
     */
    wrapper: HTMLElement;
    /**
     * The main div containing the a Gooey — specifically, the {@link Folder.element}.
     */
    container: HTMLElement;
    /**
     * The {@link UndoManager} instance for the gooey, handling undo/redo functionality.
     * @internal
     */
    _undoManager: UndoManager;
    themer: Themer;
    windowManager?: WindowManager;
    moveTo: (position: {
        x: number;
        y: number;
    }) => void;
    moveBy: (delta: {
        x?: number;
        y?: number;
    }) => void;
    /**
     * `false` if this {@link Gooey}'s {@link WindowManager} belongs to an existing, external
     * instance _(i.e. a separate {@link Gooey} instance or custom {@link WindowManager})_.  The
     * {@link WindowManager} will be disposed when this {@link Gooey} is disposed.
     * @internal
     */
    private _isWindowManagerOwner;
    private _theme;
    private _log;
    private _closedMap;
    private static _initialized;
    constructor(title?: Partial<GooeyOptions>, options?: Partial<GooeyOptions>);
    constructor(options?: Partial<GooeyOptions>, never?: never);
    get title(): string;
    set title(v: string);
    get closed(): Folder['closed'];
    get hidden(): boolean;
    get inputs(): Map<string, import("./inputs/Input").ValidInput>;
    get allInputs(): Map<string, import("./inputs/Input").ValidInput>;
    get window(): WindowInstance | undefined;
    set theme(theme: GooeyTheme);
    get theme(): GooeyTheme;
    /**
     * The root {@link folder} {@link Folder.element|element}.
     */
    get element(): HTMLElement;
    /**
     * The position of the window relative to the {@link container}.
     */
    get position(): {
        x: number;
        y: number;
    };
    set position(v: {
        x: number;
        y: number;
    });
    revealTimeout: ReturnType<typeof setTimeout> | undefined;
    revealIdle: ReturnType<typeof requestIdleCallback> | undefined;
    addFolder(title: string, options?: Partial<FolderOptions>): Folder;
    /**
     * Saves the current gooey state as a preset.
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
    id?: string, version?: string): GooeyPreset;
    /**
     * Loads a given preset into the gooey, updating all inputs.
     */
    load(preset: GooeyPreset | Record<string, any>): void;
    private _undoLock;
    private _lockCommit;
    /**
     * Commits a change to the input's value to the undo manager.
     */
    private _commit;
    /**
     * Prevents the input from registering undo history, storing the initial
     * for the eventual commit in {@link _unlockCommits}.
     */
    private _lockCommits;
    /**
     * Unlocks commits and saves the current commit stored in lock.
     */
    private _unlockCommits;
    private _loadFonts;
    private _createThemer;
    private _createSettingsButton;
    private _createPresetManager;
    private static _parseWidth;
    private _createWindowManager;
    private _revealing;
    private _repositionTimeout;
    refreshPosition(): void;
    /**
     * Resolves and sets the position of the root Gooey {@link element}.
     * This function calculates the correct position based on the specified options,
     * container bounds, and storage settings. It then updates the position of the
     * draggable instance if necessary.d
     */
    private _updatePosition;
    /**
     * todo - Add the public resolved vars to `Themer` and remove this.
     * @internal
     */
    private _getStyles;
    dispose: () => void;
}
export {};
