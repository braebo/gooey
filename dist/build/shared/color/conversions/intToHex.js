/**
 * Convert number into to 2-digit hex
 * @param int - number to convert
 */
export function intToHex(int) {
    return int.toString(16).padStart(2, '0');
}
