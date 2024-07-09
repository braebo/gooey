import type { Theme } from './styles/themer/types';
import type { FolderOptions, FolderPreset } from './Folder';
import type { PrimitiveState } from './shared/state';
import type { Placement } from './shared/place';
import type { Commit } from './UndoManager';
import { WindowManager } from './shared/WindowManager';
import { PresetManager } from './PresetManager';
import { Themer } from './styles/themer/Themer';
import { UndoManager } from './UndoManager';
import { Folder } from './Folder';
type GuiTheme = 'default' | 'flat' | 'scour' | (string & {});
export interface GuiElements {
    root: HTMLElement;
}
export interface GuiOptions {
    __type: 'GuiOptions';
    /**
     * The title of the Gui.
     * @default 'gooey'
     */
    title: string;
    /**
     * Defines which properties to persist in localStorage, and under which
     * key, if any.  If `true`, the {@link GUI_STORAGE_DEFAULTS} will be used.
     * If `false`, no state will be persisted.
     * @default false
     */
    storage: boolean | Partial<GuiStorageOptions>;
    /**
     * The container to append the gui to.
     * @default 'body'
     */
    container: string | HTMLElement | 'document' | 'body';
    /**
     * Whether the gui is draggable.
     * @default true
     */
    draggable: boolean;
    /**
     * Whether the gui is resizable.
     * @default true
     */
    resizable: boolean;
    /**
     * The title of the theme to use for the gui.  To add your own themes,
     * use {@link themerOptions.themes}.
     * @default 'default'
     */
    theme: GuiTheme;
    /**
     * The themes available to the gui.
     * @defaultValue [ {@link theme_default|default}, {@link theme_flat|flat}, {@link theme_scout|scout} ]
     */
    themes: Theme[];
    /**
     * The initial {@link Themer.mode|theme mode}.
     * @default 'dark'
     */
    themeMode: 'light' | 'dark' | 'system';
    /**
     * The gui's initial position on the screen.  If `undefined`, the gui will
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
        x: number;
        y: number;
    };
    /**
     * The initial expanded state of the gui.
     * @default false
     */
    closed: boolean;
    /**
     * Presets to make available in the gui.
     * @default []
     */
    presets?: GuiPreset[];
    /**
     * The default preset to load when the gui is created, or the initial gui state if undefined.
     * @default undefined
     */
    defaultPreset?: GuiPreset;
    /**
     * A unique id for the gui's root element.
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
     * @internal
     */
    _windowManager?: WindowManager;
    /**
     * @internal
     */
    _themer?: Themer;
}
export interface GuiStorageOptions {
    __type: 'GuiStorageOptions';
    /**
     * Prefix to use for localStorage keys.
     * @default `"fractils::gui"`
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
     * Whether to persist the gui's position.
     * @default false
     */
    position?: boolean;
    /**
     * Whether to persist the gui's size.
     * @default false
     */
    size?: boolean;
    /**
     * Whether to persist the gui's presets.
     * @default true
     */
    presets?: boolean;
}
export interface GuiPreset {
    __type: 'GuiPreset';
    __version: number;
    id: string;
    title: string;
    data: FolderPreset;
}
export declare const GUI_STORAGE_DEFAULTS: GuiStorageOptions;
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
            readonly default: "fracgui-draggable";
            readonly dragging: "fracgui-dragging";
            readonly cancel: "fracgui-cancel";
            readonly dragged: "fracgui-dragged";
        };
    };
};
export declare const GUI_DEFAULTS: {
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
    readonly loadDefaultFont: true;
};
/**
 * The root Gui instance.  This is the entry point for creating
 * a gui.  You can create multiple root guis, but each gui
 * can only have one root.
 */
export declare class Gui {
    __type: "Gui";
    id: string;
    folder: Folder;
    elements: GuiElements;
    static style: string;
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
    private _createSettingsButton;
    dispose: () => void;
}
export {};
