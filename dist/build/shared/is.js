export function isTouchEvent(e) {
    return e.type.startsWith('touch');
}
export function isMouseEvent(e) {
    return e.type.startsWith('mouse');
}
export function isDefined(value) {
    return value !== undefined;
}
export function isString(value) {
    return typeof value === 'string';
}
export function isHTMLElement(value) {
    return value instanceof HTMLElement;
}
export function isObject(value) {
    return !!value && typeof value === 'object';
}
