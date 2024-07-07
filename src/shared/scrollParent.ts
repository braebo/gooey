/**
 * Checks if a node is scrollable.
 */
export const isScrollable = (node: Element) => {
	if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
		return false
	}
	const style = getComputedStyle(node)
	return ['overflow', 'overflow-x', 'overflow-y'].some((propertyName) => {
		const value = style.getPropertyValue(propertyName)
		return value === 'auto' || value === 'scroll'
	})
}

/**
 * Resolves the nearest scroll parent of a node.
 */
export const getScrollParent = (node: Element): Element => {
	let currentParent = node.parentElement
	while (currentParent) {
		if (isScrollable(currentParent)) {
			return currentParent
		}
		currentParent = currentParent.parentElement
	}
	return document.scrollingElement || document.documentElement
}
