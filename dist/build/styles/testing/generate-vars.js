import { VAR_PREFIX, GUI_VARS } from '../GOOEY_VARS';
import { readFileSync, writeFileSync } from 'fs';
import { hexToRgb } from '../../shared/hexToRgb';
import { entries } from '../../shared/object';
import { join } from 'path';
const j = (o) => JSON.stringify(o, null, 2).replaceAll(/"/g, '');
const here = new URL('.', import.meta.url).pathname;
console.clear();
const test = flattenAllVars(GUI_VARS, VAR_PREFIX);
const css = `
.gooey-root ${j(test['base'])}

.gooey-root[mode='dark'] ${j(test['dark'])}

.gooey-root[mode='light'] ${j(test['light'])}
`;
writeFileSync(join(here, 'gooey-vars.scss'), css);
const gooeyScss = readFileSync(join(here, 'gooey.scss'), 'utf-8')
    .split('\n')
    .filter(line => !line.trim().startsWith('//'))
    .join('\n');
const counts = [test['base'], test['dark'], test['light']].map(vars => Object.entries(vars).reduce((acc, [k]) => {
    const count = (gooeyScss.match(new RegExp(k, 'g')) || []).length;
    acc[k] = count;
    return acc;
}, {}));
// @ts-expect-error
const all = Object.assign(...counts);
// @ts-expect-error
const sorted = Object.fromEntries(Object.entries(all).sort((a, b) => b[1] - a[1]));
// console.log(sorted)
writeFileSync(join(here, 'gooey-vars-counts.json'), JSON.stringify(sorted, null, 2));
/**
 * Destructures theme vars into a flat object of CSS variables.
 */
function flattenAllVars(vars, prefix) {
    const destructureMode = (mode) => {
        const allVars = {};
        for (const [key, value] of entries(vars)) {
            if (key === 'color') {
                for (const [k, v] of [
                    ...entries(value['base']),
                    ...entries(value[mode]),
                ]) {
                    allVars[`--${prefix}-${k}`] = v;
                    allVars[`--${prefix}-${k}-rgb`] = hexToRgb(v);
                }
            }
            else {
                const x = vars[key];
                for (const [_mode, vars] of entries(x)) {
                    if (_mode === 'base') {
                        for (const [k, v] of entries(vars)) {
                            allVars[`--${prefix}-${k}`] = v;
                        }
                    }
                    else if (_mode === mode) {
                        for (const [k, v] of entries(vars)) {
                            allVars[`--${prefix}-${k}`] = v;
                        }
                    }
                }
            }
        }
        return allVars;
    };
    const res = {};
    for (const mode of ['base', 'dark', 'light']) {
        res[mode] = destructureMode(mode);
    }
    return res;
}
