import type { State } from '../../shared/state';
import type { ElementOrSelector } from '../../shared/select';
import type { ThemeDefinition, ExtendedVars, ThemeTitle, ModeColors, ThemeMode, Theme } from './types';
/**
 * A JSON representation of the {@link Themer} class. Used in the
 * {@link Themer.toJSON | toJSON()} and {@link Themer.fromJSON | fromJSON()},
 * methods, and subsequently, in {@link Themer.save | save()}
 * and {@link Themer.load | load()}.
 */
export interface ThemerJSON {
    themes: Theme[];
    activeTheme: ThemeTitle;
    mode: ThemeMode;
}
/**
 * Options for the {@link Themer} class.
 */
export interface ThemerOptions {
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
    mode?: ThemeMode;
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
 * Default {@link ThemerOptions} object.
 */
export declare const THEMER_DEFAULTS: ThemerOptions;
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
export declare class Themer {
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
    private _prefersDark;
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
