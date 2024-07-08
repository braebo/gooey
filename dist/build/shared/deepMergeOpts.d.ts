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
export declare function deepMergeOpts<T, U>(objects: [target: T, ...sources: U[]], options?: {
    /**
     * If `true`, arrays are concatenated and de-duplicated.
     *
     * If `false`, arrays are replaced.
     * @defaultValue `false`
     */
    concatArrays?: boolean;
}): T & U;
