/**
 * Options for {@link tldr}.
 */
export interface TldrOptions {
    /**
     * The max depth to traverse.
     * @default 2
     */
    maxDepth?: number;
    /**
     * The max number of string characters before truncating th..
     * @default 30
     */
    maxLength?: number;
    /**
     * The max number of object or array entries before truncating.
     * @default 4
     */
    maxSiblings?: number;
    /**
     * Bypasses the {@link maxSiblings} limit for the top level if `true`.
     * @default false
     */
    preserveRootSiblings?: boolean;
    /**
     * Whether to preserve numbers instead of truncating them according to {@link maxLength}.
     * @default false
     */
    preserveNumbers?: boolean;
    /**
     * Preserve functions instead of serializing them to `[Function: name]`.
     * @default false
     */
    preserveFunctions?: boolean;
}
/**
 * Truncate objects by depth, sibling count, and string/number length.
 */
export declare function tldr<T>(
/**
 * The object to simplify.
 */
object: unknown, 
/**
 * Optional {@link TldrOptions}.
 */
{ maxDepth, maxLength, maxSiblings, preserveRootSiblings, preserveFunctions, preserveNumbers, }?: TldrOptions): T;
