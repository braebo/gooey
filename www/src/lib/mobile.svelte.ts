function boilerplate() {
	let state = $state(false)

	function onResize() {
		state = globalThis.window?.innerWidth < 1000
	}

	window.removeEventListener('resize', onResize)
	window.addEventListener('resize', onResize)

	return state
}

export const mobile = boilerplate()
