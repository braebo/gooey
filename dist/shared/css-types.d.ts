import { PropertiesHyphen } from "csstype";

//#region src/shared/css-types.d.ts

/**
 * All valid CSS Property names (e.g. `background-color`).
 */
type CSSProperty = keyof PropertiesHyphen;
/**
 * All valid Javascript Style Properties names (e.g. `backgroundColor`).
 */
type JavascriptStyleProperty = { [K in keyof CSSStyleDeclaration]: CSSStyleDeclaration[K] extends string ? K : never }[keyof CSSStyleDeclaration] & string;
/**
 * An object containing CSS property names and their values.
 */
type StyleDefinition = Partial<Record<CSSProperty | `--${string}`, string>>;
//#endregion
export { JavascriptStyleProperty, StyleDefinition };
//# sourceMappingURL=css-types.d.ts.map