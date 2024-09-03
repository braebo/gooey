// TLDR; Use the `highlight` function on the server and return the HTML to the client.

import { data as basics } from '$lib/data/docs/02_basics/Basics.svelte'

import { highlight } from '$lib/utils/highlight'

export const prerender = true
export const ssr = false

export async function load() {
	const highlightedEntries = await Promise.all(
		Object.entries(basics).map(async ([key, { code }]) => {
			const highlightedText = await highlight(code, { lang: 'ts' })
			return [key, highlightedText]
		}),
	)

	const highlighted = Object.fromEntries(highlightedEntries)

	return { highlighted }
}
