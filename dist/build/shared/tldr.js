/**
 * Truncate objects by depth, sibling count, and string/number length.
 */
export function tldr(
/**
 * The object to simplify.
 */
object, 
/**
 * Optional {@link TldrOptions}.
 */
{ maxDepth = 2, maxLength = 30, maxSiblings = 4, preserveRootSiblings = false, preserveFunctions = false, preserveNumbers = false, } = {}) {
    return parse(object);
    function parse(obj, depth = 0) {
        const seen = new WeakSet();
        if (obj === null) {
            return obj;
        }
        if (typeof obj === 'object') {
            if (seen.has(obj))
                return '[Circular]';
            seen.add(obj);
        }
        switch (typeof obj) {
            case 'boolean':
            case 'symbol':
            case 'undefined': {
                return obj;
            }
            case 'function': {
                return preserveFunctions ? obj : `[Function: ${obj.name}]`;
            }
            case 'string': {
                // Trim strings that are too long.
                if (obj.length < maxLength + 3)
                    return obj;
                return obj.slice(0, maxLength) + '..';
            }
            case 'number': {
                // Trim numbers that are too long.
                const s = !preserveNumbers ? obj.toFixed(maxLength) : obj.toString();
                if (s.length > maxLength + 3) {
                    return +s.slice(0, maxLength) + '..';
                }
                return +s;
            }
            case 'bigint': {
                // Bigints can't be serialized, so we have to trim them.
                return +obj.toString().slice(0, maxLength);
            }
            case 'object': {
                const depthReached = depth > maxDepth;
                if (Array.isArray(obj)) {
                    // if (depthReached) return `[..${o.length} ${o.length === 1 ? 'item' : 'items'}]`
                    if (depthReached)
                        return `[ ..${obj.length} ]`;
                    if (obj.length <= maxSiblings || depth === 0)
                        return obj.map(s => parse(s, depth + 1));
                    return [
                        ...obj.slice(0, maxSiblings).map(s => parse(s, depth)),
                        `..${obj.length - maxSiblings} more`,
                    ];
                }
                const keyCount = Object.keys(obj).length;
                if (depthReached) {
                    return `{..${keyCount} ${keyCount === 1 ? 'entry' : 'entries'}}`;
                }
                if (keyCount <= maxSiblings || (preserveRootSiblings && depth === 0)) {
                    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, parse(v, depth + 1)]));
                }
                return Object.fromEntries(Object.entries(obj)
                    .slice(0, maxSiblings)
                    .concat([['..', `${keyCount - maxSiblings} more`]])
                    .map(([k, v]) => [k, parse(v, depth + 1)]));
            }
        }
        return obj;
    }
}
