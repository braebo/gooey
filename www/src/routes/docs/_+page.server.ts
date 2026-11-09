import type { CodeToHastOptions } from 'shiki'

import { data as import_ } from '$lib/data/docs/02_basics/Import.svelte'
import { data as basics } from '$lib/data/docs/02_basics/Basics.svelte'

import { transformerNotationHighlight, transformerNotationFocus, transformerNotationDiff } from '@shikijs/transformers'
import { getHighlighterInstance } from '$lib/utils/highlight.svelte'
// import { trimmer } from '$lib/utils/trimmer'

const highlighter = await getHighlighterInstance()

export async function load() {
	const highlightedEntries = await Promise.all(
		// Object.entries(Object.assign({}, { code: { code: '' } })).map(async ([key, { code }]) => {
		Object.entries(Object.assign({}, import_, basics)).map(async ([key, { code }]) => {
			try {
				// const trimmed = trimmer(code)
				const highlighted = highlighter.codeToHtml(code, {
					// const highlighted = highlighter.codeToHtml(trimmed, {
					lang: 'ts',
					theme: 'serendipity',
					transformers: [
						transformerNotationHighlight(),
						transformerNotationFocus(),
						transformerNotationDiff(),
					],
					// mergeWhitespaces: true,
				} as CodeToHastOptions<string, string>)
				return [key, highlighted]
			} catch (error) {
				return [key, code]
			}
		}),
	)

	return { highlighted: Object.fromEntries(highlightedEntries) }
}
