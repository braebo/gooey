/**
 * Parse a css unit string - either regular int or a percentage number
 * @param str - css unit string
 * @param max - max unit value, used for calculating percentages
 */
export declare function parseUnit(str: string, max: number): number;
