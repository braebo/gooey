import { entries } from './object.js';

/**
 * Converts a {@link ThemeVars} object into a flat object of CSS variables.
 * @example
 * ```ts
 * const vars = { root: { header: { width: '1rem' }, // etc... }
 *
 * destructureVars(vars) // { '--root-header_width': '1rem' }
 * ```
 */
function destructureVars(vars, _prefix) {
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

export { destructureVars };
//# sourceMappingURL=css-custom-properties.js.map
