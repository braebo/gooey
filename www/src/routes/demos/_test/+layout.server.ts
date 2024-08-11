import routes from '../../../../.svelte-kit/types/route_meta_data.json'

export function load({ locals, depends }) {
	depends('routes')
	return { theme: locals.theme, routes: Object.keys(routes) as Array<keyof typeof routes> }
}
