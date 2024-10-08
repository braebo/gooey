/**
 * Converts a hex color string to an array of rgb values.
 * @param hex - A css hex color string, i.e. `#fff` or `#ffffff`
 */
function hexToRgb(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b].join(', ');
}

export { hexToRgb };
//# sourceMappingURL=hexToRgb.js.map
