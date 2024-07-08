import type { Gui, GuiPreset } from './Gui';
import type { State } from './shared/state';
import type { Folder } from './Folder';
export interface PresetManagerOptions {
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
export declare class PresetManager {
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
