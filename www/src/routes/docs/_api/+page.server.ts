import type { ParsedFile } from 'extractinator'
import type { Load } from '@sveltejs/kit'

export const prerender = true

export const load: Load = async () => {
	const modules = import.meta.glob<{ default: ParsedFile }>('../../../../docs/highlighted/*.doc.json', {
		eager: true,
	})

	return {
		docs: Object.values(modules).map((m) => m.default),
	}
}
