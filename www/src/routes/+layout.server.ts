import routes from '../../.svelte-kit/types/route_meta_data.json'
import { redirect } from '@sveltejs/kit'

export function load({ locals, depends, url }) {
	depends('routes')

	switch (url.pathname) {
		case '/': {
			redirect(307, '/docs')
		}
		case '/demos': {
			redirect(307, '/demos/goo')
		}
	}

	const allRoutes = Object.keys(routes)

	return {
		theme: locals.theme,
		routes: allRoutes,
	}
}
