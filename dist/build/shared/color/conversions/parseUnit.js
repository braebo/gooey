/**
 * Parse a css unit string - either regular int or a percentage number
 * @param str - css unit string
 * @param max - max unit value, used for calculating percentages
 */
function parseUnit(str, max) {
    const isPercentage = str.indexOf('%') > -1;
    const num = parseFloat(str);
    return isPercentage ? (max / 100) * num : num;
}

export { parseUnit };
//# sourceMappingURL=parseUnit.js.map
