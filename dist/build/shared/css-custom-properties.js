import { entries } from './object';
/**
 * Converts a {@link ThemeVars} object into a flat object of CSS variables.
 * @example
 * ```ts
 * const vars = { root: { header: { width: '1rem' }, // etc... }
 *
 * destructureVars(vars) // { '--root-header_width': '1rem' }
 * ```
 */
export function destructureVars(vars, _prefix) {
    const flatVars = {};
    function destructure(o, prefix = '') {
        for (const [k, v] of entries(o)) {
            if (typeof v === 'object') {
                destructure(v, `${prefix ? prefix + '-' : ''}${k}`);
            }
            else {
                flatVars[`${prefix ? prefix + '_' : ''}${k}`] = v;
            }
        }
    }
    destructure(vars);
    return flatVars;
}
/**
 * Converts a flat object/map/entries of CSS variables into a {@link ThemeVars} object.
 *
 * @example
 * ```ts
 * // This array of entries:
 * restructure([[ '--root-folder_max-height', '1rem' ]])
 * // is structured into:
 * { root: { folder: { 'max-height': '1rem' } }
 * ```
 */
export function restructureVars(entries) {
    if (entries instanceof Map) {
        return unroll(entries.entries());
    }
    else if (Array.isArray(entries)) {
        return unroll(entries);
    }
    else {
        return unroll(Object.entries(entries));
    }
}
function unroll(entries) {
    const structuredVars = {};
    for (const [key, value] of entries) {
        const parts = key.split(/[_-]/);
        let current = structuredVars;
        for (let i = 0; i < parts.length - 1; i++) {
            current[parts[i]] ||= {};
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
    }
    return structuredVars;
}
/**
 * Regex to extract the inner variable name from a CSS variable.
 * @example
 * | `rgba(var(--my-color), 0.5)`.match(CSS_VAR_INNER)[0]
 * > '--my-color'
 */
export const CSS_VAR_INNER = /\bvar\((--[a-zA-Z0-9_-]+)\)/g;
/**
 * Regex to match a CSS variable.
 * @example
 * | `rgba(var(--my-color), 0.5)`.match(CSS_VAR)[0]
 * > 'var(--my-color)'
 */
export const CSS_VAR_OUTER = /(?:var\()(!?[a-z-]+)/g;
