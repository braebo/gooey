/**
 * Fast, fuzzy string search.
 * @param needle - The query string to search for.
 * @param haystack - The string to search in.
 * @returns `true` if the needle is found in the haystack, `false` otherwise.
 * @example
 * ```ts
 * fuzzysearch('needle', 'haystackneedlehaystack') // true
 * ```
 * @see https://github.com/helyo-world/fuzzysearch-ts
 */
export declare function fuzzysearch(needle: string, haystack: string): boolean;
