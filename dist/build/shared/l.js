const CONSOLE_COLOR_CODES = {
    reset: '\x1b[0m',
    // Foreground colors
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    // Background colors
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
    // Styles
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    italic: '\x1b[3m',
    underline: '\x1b[4m',
};
// Simple hex to RGB conversion
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
        : null;
};
// Function to create hex color
const hex = (hexColor) => (str) => {
    const rgb = hexToRgb(hexColor);
    if (!rgb)
        return str;
    return `\x1b[38;2;${rgb[0]};${rgb[1]};${rgb[2]}m${str}\x1b[0m`;
};
const color = (colorName) => (str) => `${CONSOLE_COLOR_CODES[colorName]}${str}${CONSOLE_COLOR_CODES.reset}`;
const r = color('red');
const g = color('green');
const y = color('yellow');
const c = color('cyan');
const gr = color('gray');
const dim = color('dim');
const o = hex('#ff7f50');

export { CONSOLE_COLOR_CODES, c, color, dim, g, gr, hex, o, r, y };
//# sourceMappingURL=l.js.map
