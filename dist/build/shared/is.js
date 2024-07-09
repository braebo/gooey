function isDefined(value) {
    return value !== undefined;
}
function isString(value) {
    return typeof value === 'string';
}
function isHTMLElement(value) {
    return value instanceof HTMLElement;
}
function isObject(value) {
    return !!value && typeof value === 'object';
}

export { isDefined, isHTMLElement, isObject, isString };
//# sourceMappingURL=is.js.map
