/**
 * A type-preserving version of `Object.entries`.
 * @param obj - Any object.
 * @returns An array of key-value pairs with their types preserved.
 *
 * @example Immutable
 * ```ts
 * const foo2 = { a: 1, b: '✨' } as const
 * entries(foo2) // (['a', 1] | ['b', '✨'])[]
 * Object.entries(foo2) // [string, 1 | '✨'][]
 * ```
 *
 * @example Mutable
 * ```ts
 * const foo1 = { a: 1, b: '✨' }
 * entries(foo1) // ['a', number] | ['b', string])[]
 * Object.entries(foo1) // [string, string | number][]
 * ```
 */
function entries(object) {
    if (typeof object !== 'object' || object === null) {
        console.error('Error: Invalid object', object);
        throw new Error('`entries()` util called with invalid object: ' + object);
    }
    return Object.entries(object);
}
/**
 * A type-preserving version of `Object.keys`.
 * @param obj - Any object.
 * @returns An array of the keys with their types preserved.
 *
 * @example Immutable
 * ```ts
 * const foo2 = { a: 1, b: '✨' } as const
 * keys(foo2) // ('a' | 'b')[]
 * Object.keys(foo2) // string[]
 * ```
 *
 * @example Mutable
 * ```ts
 * const foo1 = { a: 1, b: '✨' }
 * keys(foo1) // readonly ('a' | 'b')[]
 * Object.keys(foo1) // string[]
 * ```
 */
function keys(object) {
    if (typeof object !== 'object' && object === null) {
        console.error('Error: Invalid object', object);
        throw new Error('`keys()` util called with invalid object.');
    }
    return Object.keys(object);
}
/**
 * A type-preserving version of `Object.values`.
 * @param obj - Any object.
 * @returns An array of values with their types preserved.
 *
 * @example Immutable
 * ```ts
 * const foo2 = { a: 1, b: '✨' } as const
 * values(foo2) // (1 | '✨')[]
 * Object.values(foo2) // (1 | '✨')[]
 * ```
 *
 * @example Mutable
 * ```ts
 * const foo1 = { a: 1, b: '✨' }
 * values(foo1) // readonly (number | string)[]
 * Object.values(foo1) // (number | string)[]
 * ```
 */
function values(object) {
    if (typeof object !== 'object' && object === null) {
        console.error('Error: Invalid object', object);
        throw new Error('`values()` util called with invalid object.');
    }
    return Object.values(object);
}

export { entries, keys, values };
//# sourceMappingURL=object.js.map
