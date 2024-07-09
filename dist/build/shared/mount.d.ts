/**
 * Appends a list of elements to one another in the order they are passed.
 *
 * @example
 * ```typescript
 * append(foo, bar, baz, qux)
 * // is equivalent to:
 * foo.appendChild(bar)
 * bar.appendChild(baz)
 * baz.appendChild(qux)
 * ```
 */
export declare function append(...els: Element[]): void;
