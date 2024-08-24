function boilerplate() {
	const breakpoint = Number(document.documentElement.style.getPropertyValue('--mobile')) || 1000

	let state = $state({ mobile: globalThis.window?.innerWidth < breakpoint })

	function onResize() {
		state.mobile = globalThis.window?.innerWidth < breakpoint
	}

	window.removeEventListener('resize', onResize)
	window.addEventListener('resize', onResize)

	return state
}

export const device = boilerplate()
