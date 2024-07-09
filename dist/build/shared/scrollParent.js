/**
 * Checks if a node is scrollable.
 */
const isScrollable = (node) => {
    if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
        return false;
    }
    const style = getComputedStyle(node);
    return ['overflow', 'overflow-x', 'overflow-y'].some(propertyName => {
        const value = style.getPropertyValue(propertyName);
        return value === 'auto' || value === 'scroll';
    });
};
/**
 * Resolves the nearest scroll parent of a node.
 */
const getScrollParent = (node) => {
    let currentParent = node.parentElement;
    while (currentParent) {
        if (isScrollable(currentParent)) {
            return currentParent;
        }
        currentParent = currentParent.parentElement;
    }
    return document.scrollingElement || document.documentElement;
};

export { getScrollParent, isScrollable };
//# sourceMappingURL=scrollParent.js.map
