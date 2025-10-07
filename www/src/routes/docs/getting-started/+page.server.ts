// import type { CodeToHastOptions } from 'shiki'

// import { data as import_ } from '$lib/data/docs/02_basics/Import.svelte'
// import { data as basics } from '$lib/data/docs/02_basics/Basics.svelte'

// import { transformerNotationHighlight, transformerNotationFocus, transformerNotationDiff } from '@shikijs/transformers'
// import { getHighlighterInstance } from '$lib/utils/highlight.svelte'

// export const prerender = true
// export const ssr = false

// /**
//  * todo - When this was in an external file, it refused to re-use the highlighter instance,
//  * todo - instead creating a new one each time... what was that about?
//  */
// const highlighter = await getHighlighterInstance()

// export async function load() {
// 	const highlightedEntries = await Promise.all(
// 		Object.entries(Object.assign({}, basics, import_)).map(async ([key, { code }]) => {
// 			try {
// 				const highlighted = highlighter.codeToHtml(code, {
// 					lang: 'ts',
// 					theme: 'serendipity',
// 					transformers: [
// 						transformerNotationHighlight(),
// 						transformerNotationFocus(),
// 						transformerNotationDiff(),
// 					],
// 				} as CodeToHastOptions<string, string>)
// 				return [key, highlighted]
// 			} catch (error) {
// 				console.error(error)
// 				return [key, code]
// 			}
// 		}),
// 	)

// 	return { highlighted: Object.fromEntries(highlightedEntries) }

// 	return {}
// }
