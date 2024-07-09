import type { JavascriptStyleProperty } from './css-types';
/**
 * A polyfill for `element.computeStyleMap()` that falls back to `getComputedStyle()` until
 * firefox catches up.
 *
 * @see {@link https://bugzilla.mozilla.org/show_bug.cgi?id=1857849|Bugzilla}
 */
export declare const getStyleMap: (element: Element) => Map<any, any> | StylePropertyMapReadOnly;
export declare const getStyle: (element: Element, property: JavascriptStyleProperty) => any;
