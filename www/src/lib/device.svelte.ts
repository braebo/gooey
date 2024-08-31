function boilerplate() {
	const breakpoint = Number(globalThis.document?.documentElement.style.getPropertyValue('--mobile')) || 1000

	let state = $state({ mobile: globalThis.window?.innerWidth < breakpoint })

	function onResize() {
		state.mobile = globalThis.window?.innerWidth < breakpoint
	}

	globalThis.removeEventListener?.('resize', onResize)
	globalThis.addEventListener?.('resize', onResize)

	return state
}

export const device = boilerplate()
