import typescript from 'shiki/langs/typescript.mjs'
import svelte from 'shiki/langs/svelte.mjs'
import json from 'shiki/langs/json.mjs'

import { transformerNotationHighlight, transformerNotationFocus, transformerNotationDiff } from '@shikijs/transformers'
import { dark, light } from './highlight.serendipity.js'
import { createHighlighterCore } from 'shiki/core'

import { createOnigurumaEngine } from 'shiki'
// import getWasm from 'shiki/wasm'

/**
 * @type {import("shiki").CodeToHastOptions}
 */
const highlightOptions = {
	lang: 'typescript',
	themes: {
		dark: 'serendipity',
		light: 'serendipity-light',
	},
	transformers: [transformerNotationHighlight(), transformerNotationFocus(), transformerNotationDiff()],
}

/**
 * Generates syntax highlighted HTML from text using {@link https://shiki.style/|shiki}.
 *
 * @param {any} text The text to highlight.
 * @param {any} options {@link HighlightOptions} to customize the highlighting.
 * @returns An `HTML` string.
 *
 * @example ```ts
 * const html = highlight('let x = 1', { lang: 'javascript' })
 * ```
 */
export async function highlight(text, options) {
	const opts = Object.assign(Object.assign({}, highlightOptions), options)
	const highlighter = await getHighlighterInstance()
	try {
		const highlighted = highlighter.codeToHtml(text, opts)
		return highlighted
	} catch (error) {
		console.error(error)
		return text
	}
}

/**
 * @type {import("shiki").HighlighterCore | null}
 */
let highlighterInstance = null

/**
 * Highlighter instance singleton used internally.
 */
export async function getHighlighterInstance() {
	if (!highlighterInstance) {
		highlighterInstance = await createHighlighterCore({
			// loadWasm: getWasm, // Object literal may only specify known properties, and 'loadWasm' does not exist in type 'HighlighterCoreOptions<false>'.ts(2353)
			themes: [dark, light],
			langs: [svelte, typescript, json],
			engine: createOnigurumaEngine()
		})
		return highlighterInstance
	} else {
		return highlighterInstance
	}
}

// export async function highlight(text, options) {
// 	return highlightCode(text, options)
// }
