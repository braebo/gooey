/**
 * A stringify replacer that handles circular references, undefined values, and functions.
 * - Circular references are replaced with the string `[Circular ~<path>]`
 * where `<path>` is the path to the circular reference relative to the
 * root object, i.e. `[Circular ~.b.c]`.
 * - Functions are replaced with the string `"[Function]"`.
 * - `undefined` values are replaced with the string `"undefined"`.
 *
 * @param obj - The object to stringify.
 * @param indentation - Number of spaces for indentation. Optional.
 */
const stringify = (input, indentation = 0) => {
    const stack = [];
    return JSON.stringify(input, serialize(stack), indentation);
};
/**
 * A replacer function for `JSON.stringify` that handles circular references,
 * undefined values, and functions with strings.
 * @see {@link stringify}
 */
function serialize(stack) {
    const keys = [];
    return function (key, value) {
        if (typeof value === 'undefined')
            return;
        if (typeof value === 'function')
            return '[Function]';
        let thisPos = stack.indexOf(this);
        if (thisPos !== -1) {
            stack.length = thisPos + 1;
            keys.length = thisPos;
            keys[thisPos] = key;
        }
        else {
            stack.push(this);
            keys.push(key);
        }
        let valuePos = stack.indexOf(value);
        if (valuePos !== -1) {
            return '[Circular ~' + keys.slice(0, valuePos).join('.') + ']';
        }
        if (value instanceof Set) {
            return Array.from(value);
        }
        if (value instanceof Map) {
            return Object.fromEntries(Array.from(value.entries()).map(([k, v]) => {
                const newStack = [...stack];
                return [k, JSON.parse(JSON.stringify(v, serialize(newStack)))];
            }));
        }
        if (value instanceof Element) {
            return `${value.tagName}.${Array.from(value.classList)
                .filter(s => !s.startsWith('s-'))
                .join('.')}#${value.id}`;
        }
        if (stack.length > 0) {
            stack.push(value);
        }
        return value;
    };
}

export { serialize, stringify };
//# sourceMappingURL=stringify.js.map
