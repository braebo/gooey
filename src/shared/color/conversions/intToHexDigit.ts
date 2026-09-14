/**
 * Convert a 0-255 channel into its nearest single hex digit, as shorthand hex spells it.
 * @param int - number to convert
 */
export function intToHexDigit(int: number) {
	return Math.round(int / 17).toString(16)
}
