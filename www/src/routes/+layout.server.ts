import routes from '../../.svelte-kit/types/route_meta_data.json'
import { redirect } from '@sveltejs/kit'
import { readdirSync } from 'fs'
import { resolve } from 'path'

export function load({ locals, depends, url }) {
	depends('routes')

	switch (url.pathname) {
		case '/':
		case '/demos': {
			redirect(307, '/demos/goo')
		}
	}

	const allRoutes = Object.keys(routes)
	// const allRoutes = Object.keys(routes).filter((r) => !r.includes('/_'))

	// `/docs` URI Fragments
	const path = resolve('./src/lib/data/docs')

	try {
		const dir = readdirSync(path, { withFileTypes: true, encoding: 'utf-8' })
		for (const file of dir) {
			if (file.isDirectory() && !file.name.startsWith('_')) allRoutes.push(`/docs#${file.name}`)
		}
	} catch (e) {
		console.error(e)
	}

	return {
		theme: locals.theme,
		routes: allRoutes,
	}
}
