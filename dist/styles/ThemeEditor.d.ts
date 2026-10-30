import { Folder } from "../Folder.js";
import { ColorTheme, VariableDefinition } from "./themer/types.js";
import { Themer } from "./themer/Themer.js";
import { Gooey } from "../Gooey.js";

//#region src/styles/ThemeEditor.d.ts

/**
 * A gooey window that edits the {@link targetGooey}'s themes.
 *
 * Edits land on a working copy of the active theme and preview live on every gooey the
 * themer styles.  Saving writes the copy into {@link Themer.userThemes}, which persists it.
 * A theme from code is never overwritten: saving one stores an edited copy beside it, since
 * the code is its record.
 */
declare class ThemeEditor {
  #private;
  targetGooey: Gooey;
  gooey: Gooey;
  private _log;
  /** The working copy of the active theme; edits land here until {@link save}. */
  private _draft;
  /** The title of the stored theme {@link _draft} was copied from. */
  private _source;
  /** The title the next {@link save} stores the draft under. */
  private _title;
  private _dirty;
  private _ready;
  /** {@link generate} is building inputs, which emit their starting values; those aren't edits. */
  private _generating;
  /** The first {@link generate}, a tick after construction. */
  private _firstGenerate;
  private _themeInput;
  private _titleInput;
  private _actions;
  private _varFolders;
  get folder(): Folder;
  get themer(): Themer;
  /** Whether the theme being edited is one of the {@link Themer.userThemes}. */
  get isUserTheme(): boolean;
  /** Whether the draft has edits that aren't saved. */
  get dirty(): boolean;
  constructor(targetGooey: Gooey);
  /** Closes the editor; unsaved edits stop painting. */
  dispose(): void;
  /**
   * The vars of the theme being edited.
   */
  get vars(): {
    color: ColorTheme;
  } & {
    [x: string]: VariableDefinition;
  };
  /**
   * Makes a theme the active one, dropping unsaved edits.
   */
  select(title: string): this;
  /**
   * Sets one var on the draft and previews it.
   * @param group - The theme's var group, i.e. `color` or `core`.
   * @param mode - `base`, `dark`, or `light`.
   * @param key - The var's key without the prefix, i.e. `bg-a`.
   */
  setVar(group: string, mode: keyof VariableDefinition, key: string, value: string): this;
  /**
   * Adds a new user theme copied from the draft (unsaved edits included) and selects it.
   * @param title - Defaults to the title field; suffixed if taken.
   */
  create(title?: string): this;
  /**
   * Stores the draft in {@link Themer.userThemes}.  A user theme is updated in place (and
   * renamed, if the title field changed); a theme from code is stored as a copy.
   */
  save(): this;
  /**
   * Drops unsaved edits.
   */
  revert(): this;
  /**
   * Deletes the theme being edited, if it's a user theme.  Themes from code can't be deleted.
   */
  delete(): this;
  /**
   * (Re)builds a folder of inputs per var group.
   */
  generate: () => void;
}
//#endregion
export { ThemeEditor };
//# sourceMappingURL=ThemeEditor.d.ts.map