import { resolveTheme } from './resolveTheme.js';
import theme_default from './defaultTheme.js';
import { deepMergeOpts } from '../../shared/deepMergeOpts.js';
import { partition } from '../../shared/partition.js';
import { hexToRgb } from '../../shared/hexToRgb.js';
import { entries } from '../../shared/object.js';
import { Logger } from '../../shared/logger.js';
import { select } from '../../shared/select.js';
import { g, o, c, r } from '../../shared/l.js';
import { state } from '../../shared/state.js';

/**
 * Default {@link ThemerOptions} object.
 */
const THEMER_DEFAULTS = {
    autoInit: true,
    persistent: true,
    theme: theme_default,
    themes: [],
    mode: 'system',
    localStorageKey: 'fractils::themer',
    vars: {},
};
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
class Themer {
    /**
     * The element to theme.
     */
    node;
    /**
     * The currently active theme.  When `theme.set` is called, the new theme
     * passed in is automatically applied.
     */
    theme;
    /**
     * All themes available to the themer.
     */
    themes;
    /**
     * The title of the currently active {@link theme}.
     *
     * When {@link ThemerOptions.persistent} is `true`, this value is
     * saved to localStorage and used to restore the theme on page load.
     */
    activeThemeTitle;
    /**
     * The current mode ('light', 'dark', or 'system').
     *
     * When this state value is re-assigned with `mode.set`, the current theme
     * is automatically updated.
     *
     * When {@link ThemerOptions.persistent} is `true`, this value is saved
     * to localStorage and used to restore the mode on page load.
     */
    mode;
    /**
     * If provided, theme css vars will be added to the wrapper.
     */
    wrapper;
    _initialized = false;
    _prefersDark;
    _persistent;
    _key;
    _unsubs = [];
    _targets = new Set();
    _log;
    constructor(
    /**
     * The element to theme.  Can be a selector, id (`#id`), a
     * DOM element, or the string literal `'document'` to use
     * the document element.
     * @default 'document'
     */
    node = 'document', options) {
        const opts = deepMergeOpts([THEMER_DEFAULTS, options]);
        this._key = String(opts.localStorageKey);
        if (opts.wrapper) {
            this.wrapper = opts.wrapper;
        }
        this.node =
            node === 'document'
                ? document.documentElement
                : typeof node === 'string'
                    ? (select(node)[0] ?? document.documentElement)
                    : node;
        this._log = new Logger(`themer ${this.node.classList[0]}`, { fg: 'DarkCyan' });
        this._log.fn(g('constructor')).debug({ node, opts, this: this });
        this.theme = state(resolveTheme(opts.theme, opts.vars));
        this.themes = state(opts.themes.map(t => {
            return resolveTheme(t, opts.vars);
        }));
        this.activeThemeTitle = state(opts.theme.title, {
            key: this._key + '::activeTheme',
        });
        const storedTitle = this.activeThemeTitle.value;
        if (opts.theme.title !== storedTitle) {
            const theme = this.themes.value.find(t => t.title === storedTitle);
            if (theme)
                this.theme.set(theme);
        }
        this.mode = state(opts.mode, {
            key: this._key + '::mode',
        });
        this._prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this._prefersDark.addEventListener('change', this.#handlePrefChange);
        this._unsubs.push(() => this._prefersDark.removeEventListener('change', this.#handlePrefChange));
        this._persistent = opts.persistent ?? true;
        this.#addSub(this.theme, v => {
            this._log.fn(o('theme.subscribe')).debug({ v, this: this });
            if (this._initialized) {
                this.activeThemeTitle.set(v.title);
                this.applyTheme();
            }
        });
        this.#addSub(this.mode, v => {
            this._log.fn(o('mode.subscribe')).debug('v', v, { this: this });
            if (typeof v === 'undefined')
                throw new Error('Mode is undefined.');
            if (this._initialized)
                this.applyTheme();
        });
        this._targets.add(this.wrapper ?? this.node.parentElement ?? this.node);
        if (opts.autoInit) {
            this.init();
        }
    }
    #addSub(state, cb) {
        this._unsubs.push(state.subscribe(v => cb(v)));
    }
    init() {
        const themes = this.themes.value;
        const theme = this.theme.value;
        this._log.fn(c('init')).debug({ theme: this.theme, this: this });
        if (typeof document === 'undefined')
            return;
        if (this._initialized)
            return this;
        this._initialized = true;
        // Make sure the initial theme is in the themes array.
        if (!themes.find(t => t.title === theme.title)) {
            this.create(theme, { overwrite: true, save: false });
        }
        this.load()?.applyTheme();
        return this;
    }
    /**
     * The active theme's variables based on the current mode.
     */
    get modeColors() {
        return Object.assign({}, this.theme.value.vars.color.base, this.theme.value.vars.color[this.activeMode]);
    }
    /**
     * The current mode, taking into account the system preferences.
     */
    get activeMode() {
        const _mode = this.mode.value;
        const mode = typeof _mode === 'object' && 'value' in _mode
            ? _mode.value
            : _mode;
        if (mode === 'system') {
            return this.#systemPreference;
        }
        return mode;
    }
    get #systemPreference() {
        return this._prefersDark.matches ? 'dark' : 'light';
    }
    #handlePrefChange = () => {
        if (this.mode.value === 'system')
            this.theme.set(this.theme.value);
    };
    /**
     * Adds a new theme to the Themer and optionally saves it to localStorage.
     */
    create = (
    /**
     * The theme to add.
     * @remarks If a theme with the same title already exists, its title
     * will be incremented with a number suffix (i.e. `my-theme (1)`).
     */
    newTheme, options) => {
        this._log.fn(c('addTheme')).debug({ newTheme, options, this: this });
        const theme = structuredClone(newTheme);
        const overwrite = options?.overwrite ?? false;
        const save = options?.save ?? true;
        const [dupes, existing] = partition(this.themes.value, t => t.title === theme.title);
        const alreadyExists = dupes.length > 0;
        if (!overwrite && alreadyExists) {
            // Preserve the existing theme while de-duping it.
            existing.push(structuredClone(dupes[0]));
            // Increment the title.
            let i = 0;
            while (true) {
                const newTitle = `${theme.title} (${i++})`;
                if (!existing.some(t => t.title === newTitle)) {
                    theme.title = newTitle;
                    break;
                }
                if (i > 100) {
                    this._log.fn(c('addTheme')).debug(r('Runaway loop detected.') + ' Aborting.', {
                        this: this,
                    });
                    break;
                }
            }
        }
        if (save)
            this.save();
        return this;
    };
    delete(themeOrTitle) {
        this._log.fn(c('deleteTheme')).debug({ themeOrTitle, this: this });
        const themeTitle = typeof themeOrTitle === 'string' ? themeOrTitle : themeOrTitle.title;
        const themes = this.themes.value;
        const theme = themes.find(t => t.title === themeTitle);
        if (!theme) {
            this._log.error('`themeTitle` not found in `themes` array.', {
                themeTitle,
                this: this,
            });
            throw new Error(`Theme not found.`);
        }
        const nextIndex = themes.indexOf(theme) - 1;
        const isActive = this.theme.value.title === themeTitle;
        this.themes.set(this.themes.value.filter(t => t.title !== themeTitle));
        if (isActive) {
            this.theme.set(themes[nextIndex] ?? themes.at(-1));
        }
        this.save();
        return this;
    }
    /**
     * Resolves a {@link Theme} by title.
     */
    getTheme(themeTitle) {
        return this.themes.value.find(t => t.title === themeTitle);
    }
    /**
     * Applies the current theme to the document.
     */
    applyTheme = (targets) => {
        this._log
            .fn(c('applyTheme'))
            .debug({ theme: this.theme.value.title, targets: this._targets, this: this });
        if (!('document' in globalThis))
            return;
        const theme = this.theme.value;
        if (!theme) {
            this._log.error('theme not found').debug({ theme, this: this });
            throw new Error(`Theme not found.`);
        }
        this.#applyStyleProps(theme, targets);
        this.node.setAttribute('theme', theme.title);
        this.node.setAttribute('mode', this.activeMode);
        this.wrapper?.setAttribute('theme', theme.title);
        this.wrapper?.setAttribute('mode', this.activeMode);
        return this;
    };
    /**
     * Updates Themer state from JSON.
     */
    fromJSON(json) {
        const isNewTheme = this.theme.value.title !== json.activeTheme;
        let theme = json.themes.find(t => t.title === json.activeTheme);
        theme ??= this.themes.value.find(t => t.title === json.activeTheme);
        if (!theme) {
            this._log.error('`activeTheme` not found in `themes` array.', {
                activeTheme: json.activeTheme,
                json,
                this: this,
            });
            throw new Error(`Theme not found.`);
        }
        this.themes.set(json.themes);
        this.mode.set(json.mode);
        if (isNewTheme) {
            this.applyTheme();
        }
    }
    /**
     * Serializes the current Themer state to JSON.
     */
    toJSON() {
        return {
            themes: this.themes.value,
            activeTheme: this.theme.value.title,
            mode: this.mode.value,
        };
    }
    /**
     * Loads Themer state from localStorage.
     * @returns The JSON that was loaded (if found).
     */
    load = () => {
        this._log.fn(c('load')).debug({ this: this });
        if (this._persistent && 'localStorage' in globalThis) {
            const json = localStorage.getItem(this._key + '::themer');
            if (json) {
                this.fromJSON(JSON.parse(json));
            }
        }
        return this;
    };
    /**
     * Saves the current Themer state to localStorage.
     * @returns The JSON that was saved.
     */
    save() {
        this._log.fn(c('save')).debug({ this: this });
        if (!('localStorage' in globalThis))
            return;
        if (!this._persistent)
            return;
        const json = this.toJSON();
        const exists = `${this._key}themer` in localStorage;
        try {
            const identical = exists &&
                JSON.parse(JSON.stringify(json)) ===
                    JSON.parse(localStorage.getItem(`${this._key}themer`) || '');
            if (!identical) {
                localStorage.setItem(`${this._key}themer`, JSON.stringify(json));
            }
        }
        catch (error) {
            console.error(r('Error') + ': Failed to save to localStorage.', { error, this: this });
            throw new Error(`Failed to save to localStorage.`);
        }
        return json;
    }
    /**
     * Removes the current Themer state from localStorage.
     */
    clear() {
        this._log.fn(c('clear')).debug({ this: this });
        if (!('localStorage' in globalThis))
            return;
        localStorage.removeItem(`${this._key}themer`);
        this.themes.set([theme_default]);
        this.theme.set(theme_default);
        this.mode.set('system');
    }
    addTarget(target) {
        this._targets.add(target);
        this.applyTheme([target]);
    }
    /**
     * Generates CSS custom properties from a theme config.
     * @param config - The theme config to generate CSS from.
     * @returns A string of CSS custom properties.
     * @internal
     */
    #applyStyleProps = (themeConfig, targets = this._targets) => {
        const config = themeConfig;
        this._log.fn(c('applyStyleProps')).debug({ config, this: this });
        const themeColors = config.vars.color[this.activeMode];
        if (!themeColors) {
            this._log.error('`theme` not found in `config`.', {
                theme: themeColors,
                config,
                'this.activeMode': this.activeMode,
                this: this,
            });
            throw new Error(`Theme not found.`);
        }
        const allVars = new Map();
        for (const target of targets) {
            for (const [key, value] of entries(config.vars)) {
                if (key === 'color') {
                    for (const [k, v] of [
                        ...entries(value.base),
                        ...entries(value[this.activeMode]),
                    ]) {
                        target.style.setProperty(`--${config.prefix}-${k}`, v);
                        target.style.setProperty(`--${config.prefix}-${k}-rgb`, hexToRgb(v));
                    }
                }
                else {
                    const x = config.vars[key];
                    for (const [mode, vars] of entries(x)) {
                        if (mode === 'base') {
                            for (const [k, v] of entries(vars)) {
                                allVars.set(k, v);
                            }
                        }
                        else if (mode === this.activeMode) {
                            for (const [k, v] of entries(vars)) {
                                allVars.set(k, v);
                            }
                        }
                    }
                }
            }
            for (const [k, v] of allVars) {
                target.style.setProperty(`--${config.prefix}-${k}`, v);
            }
        }
    };
    dispose() {
        for (const unsub of this._unsubs) {
            unsub();
        }
    }
}

export { THEMER_DEFAULTS, Themer };
//# sourceMappingURL=Themer.js.map
