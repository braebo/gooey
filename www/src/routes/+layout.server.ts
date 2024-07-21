import routes from '../../.svelte-kit/types/route_meta_data.json'
import { redirect } from '@sveltejs/kit'

export function load({ locals, depends, url }) {
	depends('routes')

	// todo - remove these once we have a proper homepage
	if (['/', '/demos'].includes(url.pathname)) {
		redirect(307, '/demos/goo')
	}
	return { theme: locals.theme, routes: Object.keys(routes) as Array<keyof typeof routes> }
}
