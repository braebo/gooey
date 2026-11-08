import { State } from "./shared/state.js";
import { Folder, FolderOptions } from "./Folder.js";
import { Gooey, GooeyPreset } from "./Gooey.js";

//#region src/PresetManager.d.ts
interface PresetManagerOptions {
  __type?: 'PresetManagerOptions';
  /**
   * Whether the preset manager should be disabled entirely *(no presets/gui/storage/etc)*.
   */
  disabled?: boolean;
  /**
   * Optionsal existing presets.
   * @default []
   */
  presets?: GooeyPreset[];
  /**
   * The default preset to use.
   * @default undefined
   */
  defaultPreset?: GooeyPreset;
  /**
   * The key to use for storage.  If not provided, storage is disabled.
   * @default undefined
   */
  localStorageKey?: string;
  /**
   * Whether to automatically call {@link PresetManager.init|init()} (which mainly adds the gui).
   */
  autoInit?: boolean;
  /**
   * Options for the "presets" folder that is added to the
   * {@link Gooey.elements.settingsFolder|settings folder}.
   */
  folderOptions?: Partial<FolderOptions>;
}
declare class PresetManager {
  gooey: Gooey;
  parentFolder: Folder;
  readonly __type: string;
  readonly __version = "2";
  defaultPreset: GooeyPreset;
  activePreset: State<GooeyPreset>;
  presets: State<GooeyPreset[]>;
  folder: Folder;
  private _version;
  private _defaultPresetId;
  private _defaultPresetTitle;
  /** What the preset menu opened over, until a pick or a cancel ends the gesture. */
  private _presetSnapshot?;
  private _presetsInput;
  private _manageInput;
  private _renamePresetButton;
  private _initialized;
  private _log;
  constructor(gooey: Gooey, parentFolder: Folder, options: PresetManagerOptions);
  opts: PresetManagerOptions;
  get defaultPresetIsActive(): boolean;
  init(): Promise<this | undefined>;
  /**
   * Set the active preset.
   */
  set(value: GooeyPreset): void;
  private _renamePreset;
  private _resolveUnusedTitle;
  private _resolveDefaultPreset;
  addGui(parentFolder: Folder, defaultPreset?: GooeyPreset): Promise<Folder>;
  /**
   * Updates a preset if it exists, adds it as a new preset if not, or creates a new one from the
   * current state and adds it if none is provided.
   */
  put(
  /**
   * The preset to update or add.  If not provided, a new preset is created from the current
   * state.
   */
  preset?: GooeyPreset): void;
  /**
   * Delete a preset.
   */
  delete(preset: GooeyPreset | GooeyPreset['id']): void;
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
  private _validateVersion;
  private _refreshInputs;
  /**
   * `true` while {@link _refresh} moves the preset menu to the active preset: that change still
   * loads it, but it's the manager's bookkeeping (a save, a rename, a delete), not a person's pick.
   */
  private _refreshing;
  /**
   * `true` while an undo, a redo or a cancel puts a state back, so the menu's change doesn't
   * load the active preset over it.
   */
  private _replaying;
  /**
   * `true` while a click on one of the menu's options is dispatched: the one change a person's
   * pick makes, where a hover's or a cancel's change is a preview.
   */
  private _clicking;
  /** The values and the active preset as they stand. */
  private _pickState;
  /** Puts back a {@link _pickState}: its values, its active preset, and the menu on it. */
  private _restore;
  /**
   * Records a person's pick in the preset menu as one undo step: undo brings back the values and
   * the active preset from before it, unsaved changes included, and redo the pick.
   */
  private _recordPick;
  /**
   * Refresh the presets input.
   */
  private _refresh;
  dispose(): void;
}
//#endregion
export { PresetManager };
//# sourceMappingURL=PresetManager.d.ts.map