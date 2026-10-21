//#region src/shared/l.ts
const CONSOLE_COLOR_CODES = {
	reset: "\x1B[0m",
	black: "\x1B[30m",
	red: "\x1B[31m",
	green: "\x1B[32m",
	yellow: "\x1B[33m",
	blue: "\x1B[34m",
	magenta: "\x1B[35m",
	cyan: "\x1B[36m",
	white: "\x1B[37m",
	gray: "\x1B[90m",
	bgBlack: "\x1B[40m",
	bgRed: "\x1B[41m",
	bgGreen: "\x1B[42m",
	bgYellow: "\x1B[43m",
	bgBlue: "\x1B[44m",
	bgMagenta: "\x1B[45m",
	bgCyan: "\x1B[46m",
	bgWhite: "\x1B[47m",
	bold: "\x1B[1m",
	dim: "\x1B[2m",
	italic: "\x1B[3m",
	underline: "\x1B[4m"
};
const hexToRgb = (hex$1) => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex$1);
	return result ? [
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16)
	] : null;
};
const hex = (hexColor) => (str) => {
	const rgb = hexToRgb(hexColor);
	if (!rgb) return str;
	return `\x1b[38;2;${rgb[0]};${rgb[1]};${rgb[2]}m${str}\x1b[0m`;
};
const color = (colorName) => (str) => `${CONSOLE_COLOR_CODES[colorName]}${str}${CONSOLE_COLOR_CODES.reset}`;
const r = color("red");
const g = color("green");
const y = color("yellow");
const b = color("blue");
const m = color("magenta");
const c = color("cyan");
const gr = color("gray");
const dim = color("dim");
const o = hex("#ff7f50");

//#endregion
export { c, dim, g, gr, hex, o, r, y };
//# sourceMappingURL=l.js.map