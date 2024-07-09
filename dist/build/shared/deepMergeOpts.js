/**
 * Deep merges objects together, with some special rules:
 * - Arrays are concatenated and de-duplicated unless {@link concatArrays|`concatArrays`} is `false`.
 * - Objects are recursively merged.
 * - `false` is only replaced with `true`
 * - An object is never replaced with `true`, `false`, or `undefined`.
 * - The original objects are not mutated.
 * - `undefined` is always overwritten.
 * - `0` is accepted.
 * @todo More options would be nice.
 */
function deepMergeOpts(objects, options) {
    const [target, ...sources] = objects;
    const { concatArrays = true } = options ?? {};
    return sources.reduce((acc, curr) => {
        if (!curr)
            return acc;
        const keys = Object.keys(curr);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            const v = acc[k];
            const newV = curr[k];
            if (Array.isArray(v) && Array.isArray(newV)) {
                if (concatArrays) {
                    acc[k] = [...new Set([...v, ...newV])];
                }
                else {
                    acc[k] = newV;
                }
            }
            else if (v && typeof v === 'object') {
                if (newV !== true) {
                    if (newV && typeof newV === 'object') {
                        if (typeof globalThis.window !== 'undefined' &&
                            newV instanceof Element) {
                            acc[k] = newV;
                        }
                        else {
                            acc[k] = deepMergeOpts([{ ...v }, newV], options);
                        }
                    }
                    else if (newV || newV === false) {
                        acc[k] = newV;
                    }
                }
            }
            else if (newV !== undefined) {
                acc[k] = newV;
            }
        }
        return acc;
    }, { ...target });
}

export { deepMergeOpts };
//# sourceMappingURL=deepMergeOpts.js.map
