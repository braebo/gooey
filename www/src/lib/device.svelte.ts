function boilerplate() {
	const breakpoint = Number(globalThis.document?.documentElement.style.getPropertyValue('--mobile')) || 1000

	let state = $state({
		width: globalThis.window?.innerWidth || 0,
		height: globalThis.window?.innerHeight || 0,
		mobile: globalThis.window?.innerWidth < breakpoint,
		scrollY: globalThis.window?.scrollY || 0,
	})

	function onResize() {
		state.width = globalThis.window?.innerWidth || 0
		state.height = globalThis.window?.innerHeight || 0
		state.scrollY = globalThis.window?.scrollY || 0
		state.mobile = state.width < breakpoint
	}
	globalThis.removeEventListener?.('resize', onResize)
	globalThis.addEventListener?.('resize', onResize)

	function onScroll() {
		state.scrollY = globalThis.window?.scrollY || 0
	}
	globalThis.removeEventListener?.('scroll', onScroll)
	globalThis.addEventListener?.('scroll', onScroll)

	return state
}

export const device = boilerplate()
