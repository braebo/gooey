import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = ({ locals }) => {
	return { theme: locals.theme }
}
