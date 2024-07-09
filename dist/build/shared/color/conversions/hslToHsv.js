import { clamp } from '../../clamp.js';

/**
 * Converts {@link HslColor} object to an {@link HsvColor} object.
 * @param hsl - {@link HslColor} object to convert.
 */
function hslToHsv(hsl) {
    const l = hsl.l * 2;
    const s = (hsl.s * (l <= 100 ? l : 200 - l)) / 100;
    // Avoid division by zero when l + s is near 0
    const saturation = l + s < 1e-9 ? 0 : (2 * s) / (l + s);
    return {
        h: hsl.h,
        s: clamp(saturation * 100, 0, 100),
        v: clamp((l + s) / 2, 0, 100),
    };
}

export { hslToHsv };
//# sourceMappingURL=hslToHsv.js.map
