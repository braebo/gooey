import { REGEX_FUNCTIONAL_RGB, REGEX_FUNCTIONAL_RGBA, REGEX_HEX_3, REGEX_HEX_4, REGEX_HEX_6, REGEX_HEX_8, REGEX_FUNCTIONAL_HSL, REGEX_FUNCTIONAL_HSLA } from './regex.js';
import { kelvinToRgb } from './conversions/kelvinToRgb.js';
import { rgbToKelvin } from './conversions/rgbToKelvin.js';
import { rgbToHsv } from './conversions/rgbToHsv.js';
import { hslToHsv } from './conversions/hslToHsv.js';
import { hsvToHsl } from './conversions/hsvToHsl.js';
import { hsvToRgb } from './conversions/hsvToRgb.js';
import { parseHexInt } from './conversions/parseHexInt.js';
import { parseUnit } from './conversions/parseUnit.js';
import { intToHex } from './conversions/intToHex.js';

const DEFAULT_COLOR = { h: 0, s: 0, v: 0, a: 1 };
/**
 * A color class with rgb, hsl, hsv, and kelvin color objects, strings, and conversion methods.
 */
class Color {
    isColor = true;
    #hsva; // The primary internal color value (source of truth).
    #initialValue;
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
    constructor(color) {
        this.#hsva = DEFAULT_COLOR;
        if (color)
            this.set(color);
        this.#initialValue = structuredClone(this.#hsva);
        return this;
    }
    /**
     * Sets the Color from any valid {@link ColorValue}.
     */
    set(color) {
        if (typeof color === 'string') {
            if (/^(?:#?|0x?)[0-9a-fA-F]{3,8}$/.test(color)) {
                this.hexString = color;
            }
            else if (/^rgba?/.test(color)) {
                this.rgbString = color;
            }
            else if (/^hsla?/.test(color)) {
                this.hslString = color;
            }
        }
        else if (typeof color === 'object') {
            if (color instanceof Color) {
                this.hsva = color.hsva;
            }
            else if ('r' in color && 'g' in color && 'b' in color) {
                this.rgb = color;
            }
            else if ('h' in color && 's' in color && 'v' in color) {
                this.hsv = color;
            }
            else if ('h' in color && 's' in color && 'l' in color) {
                this.hsl = color;
            }
            else if ('kelvin' in color) {
                this.kelvin = color.kelvin;
            }
        }
        else {
            throw new Error('Invalid color value: ' + color);
        }
    }
    /**
     * Shortcut to set a specific channel value.
     * @param format - hsv | hsl | rgb
     * @param channel - Individual channel to set, for example, if format = hsl, chanel = h | s | l
     * @param value - New value for the channel.
     */
    setChannel(format, 
    // prettier-ignore
    channel, value) {
        this[format] = { ...this[format], [channel]: value };
    }
    /**
     * Reset color back to its initial value
     */
    reset() {
        this.hsva = this.#initialValue;
    }
    /**
     * Returns a new Color instance with the same values as this one.
     */
    clone() {
        return new Color(this);
    }
    /** i.e. `{ h: 261, s: 100, v: 47 }` */
    get hsv() {
        const { h, s, v } = this.#hsva;
        return { h, s, v };
    }
    // All other setters go through this one.
    set hsv(value) {
        const oldValue = this.#hsva;
        const mergedValue = { ...oldValue, ...value };
        if (this.#hsva.h === mergedValue.h &&
            this.#hsva.s === mergedValue.s &&
            this.#hsva.v === mergedValue.v &&
            this.#hsva.a === mergedValue.a) {
            return;
        }
        this.#hsva = {
            h: Math.round(mergedValue.h),
            s: Math.round(mergedValue.s),
            v: Math.round(mergedValue.v),
            a: mergedValue.a,
        };
        // this.#hsva = mergedValue
    }
    /** i.e. `{ h: 261, s: 100, v: 47, a: 1 }` */
    get hsva() {
        return structuredClone(this.#hsva);
    }
    set hsva(value) {
        this.hsv = value;
    }
    /** The value of `H` in `HSVA`. */
    get hue() {
        return this.#hsva.h;
    }
    set hue(value) {
        this.hsv = { h: value };
    }
    /** The value of `S` in `HSVA`. */
    get saturation() {
        return this.#hsva.s;
    }
    set saturation(value) {
        this.hsv = { s: value };
    }
    /** The value of `V` in `HSVA`. */
    get value() {
        return this.#hsva.v;
    }
    set value(value) {
        this.hsv = { v: value };
    }
    /** The value of `L` in `HSLA`. */
    get lightness() {
        return this.hsl.l;
    }
    set lightness(value) {
        this.hsl = { ...this.hsl, l: value };
    }
    get alpha() {
        return this.#hsva.a ?? 1;
    }
    set alpha(value) {
        this.hsv = { ...this.hsv, a: value };
    }
    get kelvin() {
        return rgbToKelvin(this.rgb);
    }
    set kelvin(value) {
        this.rgb = kelvinToRgb(value);
    }
    get red() {
        return this.rgb.r;
    }
    set red(value) {
        this.rgb = { ...this.rgb, r: value };
    }
    /**
     * A float version of the {@link red} channel value as a fraction of 1 (0-1 vs 0-255).
     */
    get r() {
        // return this.red
        return this.rgb.r / 255;
    }
    set r(value) {
        this.red = value * 255;
    }
    get green() {
        return this.rgb.g;
    }
    set green(value) {
        this.rgb = { ...this.rgb, g: value };
    }
    /**
     * A float version of the {@link green} channel value as a fraction of 1 (0-1 vs 0-255).
     */
    get g() {
        // return this.green
        return this.rgb.g / 255;
    }
    set g(value) {
        this.green = value * 255;
    }
    get blue() {
        return this.rgb.b;
    }
    set blue(value) {
        this.rgb = { ...this.rgb, b: value };
    }
    /**
     * A float version of the {@link blue} channel value as a fraction of 1 (0-1 vs 0-255).
     */
    get b() {
        return this.rgb.b / 255;
    }
    set b(value) {
        this.blue = value * 255;
    }
    /** i.e. `{ r: 85, g: 0, b: 238 }` */
    get rgb() {
        const { r, g, b } = hsvToRgb(this.#hsva);
        return {
            r: Math.round(r),
            g: Math.round(g),
            b: Math.round(b),
        };
    }
    set rgb(value) {
        this.hsv = {
            ...rgbToHsv(value),
            a: 'a' in value ? value.a : 1,
        };
    }
    /**
     * A float version of {@link rgb} values as a fraction of 1 (0-1 vs 0-255).
     */
    get rgbf() {
        return {
            r: this.r,
            g: this.g,
            b: this.b,
        };
    }
    set rgbf(value) {
        this.rgb = {
            r: value.r,
            g: value.g,
            b: value.b,
        };
    }
    /** i.e. `'rgba(85, 0, 238, 1)'` */
    get rgba() {
        return { ...this.rgb, a: this.alpha };
    }
    set rgba(value) {
        this.rgb = value;
    }
    /** i.e. `'hsl(261, 100%, 47%)'` */
    get hsl() {
        const { h, s, l } = hsvToHsl(this.#hsva);
        return {
            h: Math.round(h),
            s: Math.round(s),
            l: Math.round(l),
        };
    }
    set hsl(value) {
        this.hsv = {
            ...hslToHsv(value),
            a: 'a' in value ? value.a : 1,
        };
    }
    /** i.e. `'hsla(261, 100%, 47%, 1)'` */
    get hsla() {
        return { ...this.hsl, a: this.alpha };
    }
    set hsla(value) {
        this.hsl = value;
    }
    /** i.e. `'rgb(85, 0, 238)'` */
    get rgbString() {
        return `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`;
    }
    set rgbString(value) {
        let match;
        let r;
        let g;
        let b;
        let a = 1;
        if ((match = REGEX_FUNCTIONAL_RGB.exec(value))) {
            r = parseUnit(match[1], 255);
            g = parseUnit(match[2], 255);
            b = parseUnit(match[3], 255);
        }
        else if ((match = REGEX_FUNCTIONAL_RGBA.exec(value))) {
            r = parseUnit(match[1], 255);
            g = parseUnit(match[2], 255);
            b = parseUnit(match[3], 255);
            a = parseUnit(match[4], 1);
        }
        else {
            throw new Error('Invalid rgb string: ' + value);
        }
        this.rgb = { r, g, b, a };
    }
    /** i.e. `'rgba(85, 0, 238, 1)'` */
    get rgbaString() {
        const rgba = this.rgba;
        return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    }
    set rgbaString(value) {
        this.rgbString = value;
    }
    /**
     * Hex string with an alpha channel, i.e. `'#5500eeff'`. Identical to {@link hex8String}.
     */
    get hex() {
        return this.hex8String;
    }
    set hex(value) {
        this.hexString = value;
    }
    get color() {
        return this;
    }
    set color(value) {
        this.hsva = value.hsva;
    }
    /** Hex string with no alpha channel, i.e. `'#5500ee'` */
    get hexString() {
        const rgb = this.rgb;
        return `#${intToHex(rgb.r)}${intToHex(rgb.g)}${intToHex(rgb.b)}`;
    }
    set hexString(value) {
        const match = value.match(REGEX_HEX_3) ||
            value.match(REGEX_HEX_4) ||
            value.match(REGEX_HEX_6) ||
            value.match(REGEX_HEX_8);
        if (!match)
            throw new Error('Invalid hex string');
        const [r, g, b, a = 255] = match
            .slice(1)
            .map(c => parseHexInt(c.length === 1 ? `${c}${c}` : c));
        this.rgb = { r, g, b, a: +a / 255 };
    }
    get hex8() {
        return this.hex8String;
    }
    /** i.e. `'#5500eeff'` */
    get hex8String() {
        const rgba = this.rgba;
        return `#${intToHex(rgba.r)}${intToHex(rgba.g)}${intToHex(rgba.b)}${intToHex(Math.floor((rgba.a ?? 1) * 255))}`;
    }
    set hex8String(value) {
        this.hexString = value;
    }
    /** i.e. `'rgb(85, 0, 238)'` */
    get hslString() {
        const hsl = this.hsl;
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    set hslString(value) {
        const match = REGEX_FUNCTIONAL_HSL.exec(value) || REGEX_FUNCTIONAL_HSLA.exec(value);
        if (!match)
            throw new Error('Invalid rgb string: ' + value);
        const [r, g, b, a = 1] = match
            .slice(1)
            .map((val, index) => parseUnit(val, index < 3 ? 255 : 1));
        this.rgb = { r, g, b, a };
    }
    /** i.e. `'hsla(261, 100%, 47%, 1)'` */
    get hslaString() {
        const hsla = this.hsla;
        return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`;
    }
    set hslaString(value) {
        this.hslString = value;
    }
    toString() {
        return this.hex8String;
    }
    toJSON() {
        return {
            isColor: true,
            ...this.rgba,
            hex: this.hex8String,
        };
    }
}
function isColor(color) {
    return !!color.isColor;
}
function isColorFormat(color) {
    return typeof parseColorFormat(color) !== 'undefined';
}
function parseColorFormat(color) {
    if (typeof color === 'string') {
        if (color.match(/^#?[0-9a-fA-F]{6}$/)) {
            return 'HexString';
        }
        else if (color.match(/^#?[0-9a-fA-F]{8}$/)) {
            return 'Hex8String';
        }
        else if (color.match(/^rgba?/)) {
            return 'RgbaString';
        }
        else if (color.match(/^hsla?/)) {
            return 'HslaString';
        }
    }
    else if (typeof color === 'object') {
        if (color instanceof Color) {
            return 'Color';
        }
        else if ('r' in color && 'g' in color && 'b' in color) {
            return 'RgbColor';
        }
        else if ('h' in color && 's' in color && 'v' in color) {
            return 'HsvColor';
        }
        else if ('h' in color && 's' in color && 'l' in color) {
            return 'HslColor';
        }
        else if ('kelvin' in color) {
            return 'number';
        }
    }
    return undefined;
}

export { Color, isColor, isColorFormat, parseColorFormat };
//# sourceMappingURL=color.js.map
