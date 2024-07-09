import type { ColorFormat } from './types/colorFormat';
import type { ColorObject, HslColor, HslaColor, HsvColor, HsvaColor, RgbColor, RgbaColor } from './types/objects';
import type { ColorString, HexAlphaString, HexString, HslString, HslaString, RgbString, RgbaString } from './types/strings';
export type ColorMode = 'hsv' | 'hsl' | 'rgb';
export type ColorValue = Color | ColorString | ColorObject;
/**
 * A color class with rgb, hsl, hsv, and kelvin color objects, strings, and conversion methods.
 */
export declare class Color {
    #private;
    readonly isColor: true;
    /**
     * @param color - The initial color value.
     * The value can be any valid color representation:
     * - A hex string: '#5500ee' | '#5500eeff'
     * - An rgba string: 'rgba(85, 0, 238, 1)' | 'rgba(85, 0, 238, 1.0)'
     * - An hsla string: 'hsla(261, 100%, 47%, 1)' | 'hsla(261, 100%, 47%, 1.0)'
     * - An {@link RgbvColor}: { r: 85, g: 0, b: 238, a: 1 }
     * - An {@link HsvColor}: { h: 261, s: 100, v: 47, a: 1 }
     * - An {@link HslColor}: { h: 261, s: 100, l: 47, a: 1 }
     * - An {@link KelvinColor}: { kelvin: 6500 }
     */
    constructor(color?: ColorValue | (string & {}));
    /**
     * Sets the Color from any valid {@link ColorValue}.
     */
    set(color: ColorValue): void;
    /**
     * Shortcut to set a specific channel value.
     * @param format - hsv | hsl | rgb
     * @param channel - Individual channel to set, for example, if format = hsl, chanel = h | s | l
     * @param value - New value for the channel.
     */
    setChannel<Mode extends ColorMode>(format: Mode, channel: Mode extends 'hsv' ? 'h' | 's' | 'v' : Mode extends 'hsl' ? 'h' | 's' | 'l' : Mode extends 'rgb' ? 'r' | 'g' | 'b' : never, value: number): void;
    /**
     * Reset color back to its initial value
     */
    reset(): void;
    /**
     * Returns a new Color instance with the same values as this one.
     */
    clone(): Color;
    /** i.e. `{ h: 261, s: 100, v: 47 }` */
    get hsv(): HsvColor;
    set hsv(value: Partial<HsvaColor>);
    /** i.e. `{ h: 261, s: 100, v: 47, a: 1 }` */
    get hsva(): HsvaColor;
    set hsva(value: HsvaColor);
    /** The value of `H` in `HSVA`. */
    get hue(): number;
    set hue(value: number);
    /** The value of `S` in `HSVA`. */
    get saturation(): number;
    set saturation(value: number);
    /** The value of `V` in `HSVA`. */
    get value(): number;
    set value(value: number);
    /** The value of `L` in `HSLA`. */
    get lightness(): number;
    set lightness(value: number);
    get alpha(): number;
    set alpha(value: number);
    get kelvin(): number;
    set kelvin(value: number);
    get red(): number;
    set red(value: number);
    /**
     * A float version of the {@link red} channel value as a fraction of 1 (0-1 vs 0-255).
     */
    get r(): number;
    set r(value: number);
    get green(): number;
    set green(value: number);
    /**
     * A float version of the {@link green} channel value as a fraction of 1 (0-1 vs 0-255).
     */
    get g(): number;
    set g(value: number);
    get blue(): number;
    set blue(value: number);
    /**
     * A float version of the {@link blue} channel value as a fraction of 1 (0-1 vs 0-255).
     */
    get b(): number;
    set b(value: number);
    /** i.e. `{ r: 85, g: 0, b: 238 }` */
    get rgb(): RgbColor;
    set rgb(value: RgbColor | RgbaColor);
    /**
     * A float version of {@link rgb} values as a fraction of 1 (0-1 vs 0-255).
     */
    get rgbf(): RgbColor;
    set rgbf(value: RgbColor);
    /** i.e. `'rgba(85, 0, 238, 1)'` */
    get rgba(): RgbaColor;
    set rgba(value: RgbColor | RgbaColor);
    /** i.e. `'hsl(261, 100%, 47%)'` */
    get hsl(): HslColor;
    set hsl(value: HslColor | HslaColor);
    /** i.e. `'hsla(261, 100%, 47%, 1)'` */
    get hsla(): HslaColor;
    set hsla(value: HslColor | HslaColor);
    /** i.e. `'rgb(85, 0, 238)'` */
    get rgbString(): RgbString;
    set rgbString(value: RgbString | RgbaString | (string & {}));
    /** i.e. `'rgba(85, 0, 238, 1)'` */
    get rgbaString(): RgbaString;
    set rgbaString(value: RgbaString | (string & {}));
    /**
     * Hex string with an alpha channel, i.e. `'#5500eeff'`. Identical to {@link hex8String}.
     */
    get hex(): HexString;
    /** Hex string with no alpha channel, i.e. `'#5500ee'` */
    get hexString(): HexString;
    set hexString(value: HexString | HexAlphaString | (string & {}));
    get hex8(): HexAlphaString;
    /** i.e. `'#5500eeff'` */
    get hex8String(): HexAlphaString;
    set hex8String(value: HexAlphaString | (string & {}));
    /** i.e. `'rgb(85, 0, 238)'` */
    get hslString(): HslString;
    set hslString(value: HslString | (string & {}));
    /** i.e. `'hsla(261, 100%, 47%, 1)'` */
    get hslaString(): string;
    set hslaString(value: HslaString | (string & {}));
    toString(): `#${string}${string}${string}${string}${string}${string}${string}${string}`;
    toJSON(): {
        hex: `#${string}${string}${string}${string}${string}${string}${string}${string}`;
        a: number;
        r: number;
        g: number;
        b: number;
        isColor: boolean;
    };
}
export declare function isColor(color: any): color is Color;
export declare function isColorFormat(color: any): color is ColorFormat;
export declare function parseColorFormat(color: ColorFormat | (string & {})): "number" | "HexString" | "Hex8String" | "RgbaString" | "HslaString" | "Color" | "RgbColor" | "HsvColor" | "HslColor" | undefined;
