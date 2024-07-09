/**
 * A structured object representing a theme's CSS custom properties.
 */
export interface ThemeVars {
    [key: string]: StructuredVars;
    base: StructuredVars;
    light: StructuredVars;
    dark: StructuredVars;
}
/**
 * A structured object representing CSS custom properties using the following rules:
 * - Each key represents a fragment of the CSS variable name. Fragments are
 *   concatenated with a hyphen `-`,  except for the last fragment, which is
 *   concatenated with an underscore `_` to the preceding fragment(s).
 * - The last key in each branch (each leaf node) must be a valid CSS property,
 *   such as `color`, `min-width`, etc.
 * - The value assigned to the last fragment represents the CSS variable's value.
 *
 * For example, the following object:
 * ```ts
 * { button: { secondary: { color: 'red' } } }
 * ```
 * Maps this CSS variable:
 * ```css
 * { --button-secondary_color: red; }
 * ```
 *
 * @remarks This interface is intended to be used in contexts where CSS variables are
 * dynamically generated or  managed in Typescript, such as the {@link Themer}.
 */
export interface StructuredVars {
    [key: string]: string | StructuredVars;
}
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
/**
 * @internal
 * Unrolls a {@link ThemeVars} object into a flat object of strongly inferred CSS variables
 * where the last key in each branch is concatenated with an underscore `_` to the preceding
 * fragment(s), while all other keys are concatenated with a hyphen `-`.
 */
type AccumulateKeys<T, Prefix extends string = '', Depth extends number = 10> = Depth extends 0 ? never : T extends object ? {
    [K in keyof T]: K extends string ? T[K] extends Record<string, any> ? `${Prefix}${K}-` extends `${infer Rest}-` ? AccumulateKeys<T[K], `${Rest}-`, Prev[Depth]> : never : `${Prefix}${K}` extends `${infer Rest}` ? `${Rest}_${K}` : never : never;
}[keyof T] : '';
type FlattenStructuredVars<T, P extends string> = {
    [K in AccumulateKeys<T> as `--${P}-${K}`]: string;
};
/**
 * Converts a {@link ThemeVars} object into a flat object of CSS variables.
 */
export type DestructuredVars<Obj extends StructuredVars, Prefix extends string = ''> = FlattenStructuredVars<Obj, Prefix>;
/**
 * Converts a {@link ThemeVars} object into a flat object of CSS variables.
 * @example
 * ```ts
 * const vars = { root: { header: { width: '1rem' }, // etc... }
 *
 * destructureVars(vars) // { '--root-header_width': '1rem' }
 * ```
 */
export declare function destructureVars<const Obj extends StructuredVars, const Prefix extends string>(vars: Obj, _prefix: Prefix): Partial<DestructuredVars<Obj, Prefix>>;
/**
 * Converts a flat object/map/entries of CSS variables into a {@link ThemeVars} object.
 *
 * @example
 * ```ts
 * // This array of entries:
 * restructure([[ '--root-folder_max-height', '1rem' ]])
 * // is structured into:
 * { root: { folder: { 'max-height': '1rem' } }
 * ```
 */
export declare function restructureVars(entries: [string, string][] | Map<string, string> | Record<string, string>): StructuredVars;
/**
 * Regex to extract the inner variable name from a CSS variable.
 * @example
 * | `rgba(var(--my-color), 0.5)`.match(CSS_VAR_INNER)[0]
 * > '--my-color'
 */
export declare const CSS_VAR_INNER: RegExp;
/**
 * Regex to match a CSS variable.
 * @example
 * | `rgba(var(--my-color), 0.5)`.match(CSS_VAR)[0]
 * > 'var(--my-color)'
 */
export declare const CSS_VAR_OUTER: RegExp;
export {};
