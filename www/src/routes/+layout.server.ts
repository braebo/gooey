import routes from '../../.svelte-kit/types/route_meta_data.json'
import { redirect } from '@sveltejs/kit'

export function load({ locals, depends, url }) {
	depends('routes')

	switch (url.pathname) {
		case '/':
		case '/demos': {
			redirect(307, '/demos/goo')
		}
		case '/docs': {
			redirect(307, '/docs/getting-started')
		}
	}

	return { theme: locals.theme, routes: Object.keys(routes) as Array<keyof typeof routes> }
}
