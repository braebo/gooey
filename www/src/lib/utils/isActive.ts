export function isActive(path: string, current: string) {
	return !path
		.split('/')
		.filter((p) => p && p !== '/')
		.some(() => {
			return !path.split('/').some((p) => current.includes(p))
		})
}
