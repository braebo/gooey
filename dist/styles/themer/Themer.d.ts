import { State } from "../../shared/state.js";
import { ElementOrSelector } from "../../shared/select.js";
import { ExtendedVars, ModeColors, Theme, ThemeDefinition, ThemeMode, ThemeTitle } from "./types.js";

//#region src/styles/themer/Themer.d.ts

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
   * Whether to persist the active theme title and mode in localStorage.
   * Needs a {@link localStorageKey}; without one nothing persists.
   * @default true
   */
  persistent: boolean;
  /**
   * The default theme to use.
   * @default A theme titled 'default'.
   */
  theme: ThemeDefinition;
  themes: Array<Theme>;
  mode?: ThemeMode;
  /**
   * The localStorage key prefix for the persisted title and mode.
   * @default undefined
   */
  localStorageKey?: string;
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
 * ```ts
 * import { Themer } from 'gooey'
 * import my_theme from './themes/my_theme'
 *
 * const themer = new Themer('document', { theme: my_theme, themes: [my_theme], mode: 'dark' })
 *
 * themer.mode.set('light')
 * themer.create({ ...my_theme, title: 'my_theme_2' })
 * ```
 */
declare class Themer {
  #private;
  /**
   * The first target — every target gets the theme's css vars and the `theme` / `mode`
   * attributes on each apply; {@link attach} adds more.
   */
  node: HTMLElement;
  /**
   * The currently active theme.  When `theme.set` is called, the new theme
   * passed in is automatically applied.
   */
  theme: State<Theme>;
  /**
   * All themes available to the themer — {@link ThemerOptions.themes} plus {@link userThemes}.
   */
  themes: State<Theme[]>;
  /**
   * Themes added at runtime with {@link create}.  Persisted under `<key>::themes` when
   * {@link ThemerOptions.persistent}, and merged over the code's themes by title on load.
   * Code themes are never stored — their source is their record.
   */
  userThemes: State<Theme[]>;
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
  private _initialized;
  private _prefersDark;
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
  /**
   * The current mode, taking into account the system preferences.
   */
  get activeMode(): 'light' | 'dark';
  /**
   * Adds a new theme to the Themer and to {@link userThemes}.
   */
  create: (
  /**
   * The theme to add.
   * @remarks If a theme with the same title already exists, its title
   * will be incremented with a number suffix (i.e. `my-theme (1)`).
   */
  newTheme: Theme, options?: {
    /**
     * Whether to overwrite an existing theme with the same title,
     * or increment the title with a number suffix.
     * @default false
     */
    overwrite?: boolean;
  }) => this;
  delete(themeOrTitle: ThemeTitle | Theme): this;
  /**
   * Resolves a {@link Theme} by title.
   */
  getTheme(themeTitle: ThemeTitle): Theme | undefined;
  /**
   * Applies the current theme to every target (or just the ones given).
   */
  applyTheme: (targets?: HTMLElement[]) => this | undefined;
  /**
   * Resets to the default theme, 'system' mode, and no other themes; forgets {@link userThemes}.
   */
  clear(): void;
  /**
   * Adds a target and applies the current theme to it now.
   */
  attach(target: HTMLElement): this;
  /**
   * Stops theming a target.  Its vars and attributes stay as they were until something
   * else writes them.
   */
  detach(target: HTMLElement): this;
  dispose(): void;
}
//#endregion
export { Themer };
//# sourceMappingURL=Themer.d.ts.map