//#region src/shared/color/types/strings.d.ts
/**
 * All valid color objects and strings.
 */
type ColorString = HexString | HexAlphaString | HexStringShorthand | HexAlphaStringShorthand | RgbString | RgbaString | PercentageRgbString | PercentageRgbaString | HslString | HslaString;
/** A 6-character hex color string: `'#5500ee'` */
type HexString = `#${string}${string}${string}${string}${string}${string}`;
/** An 8-character hex color string with alpha: `'#5500eeff'` */
type HexAlphaString = `#${string}${string}${string}${string}${string}${string}${string}${string}`;
/** A 3-character hex color string: `'#50e'` */
type HexStringShorthand = `#${string}${string}${string}`;
/** A 4-character hex color string with alpha: `'#50ef'` */
type HexAlphaStringShorthand = `#${string}${string}${string}${string}`;
/** An rgb color string: `rgb(85, 0, 238)` */
type RgbString = `rgb(${number}, ${number}, ${number})`;
/** An rgba color string: `rgba(85, 0, 238, 1)` */
type RgbaString = `rgba(${number}, ${number}, ${number}, ${number})`;
/** A percentage rgb color string: `rgb(33%, 0%, 93%)` */
type PercentageRgbString = `rgb(${number}%, ${number}%, ${number}%)`;
/** A percentage rgba color string: `rgba(33%, 0%, 93%, 1)` */
type PercentageRgbaString = `rgba(${number}%, ${number}%, ${number}%, ${number}%)`;
/** An hsl color string: `hsl(261, 100%, 47%)` */
type HslString = `hsl(${number}, ${number}%, ${number}%)`;
/** An hsla color string: `hsla(261, 100%, 47%, 1)` */
type HslaString = `hsla(${number}, ${number}%, ${number}%, ${number})`;
//#endregion
export { ColorString, HexAlphaString, HexAlphaStringShorthand, HexString, HexStringShorthand, HslString, HslaString, RgbString, RgbaString };
//# sourceMappingURL=strings.d.ts.map