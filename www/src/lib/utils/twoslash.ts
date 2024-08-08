// todo - update this to use the new shiki API
import svelte from 'shiki/langs/svelte.mjs'
import typescript from 'shiki/langs/typescript.mjs'
import javascript from 'shiki/langs/javascript.mjs'

import type { LanguageInput, ThemeInput } from 'shiki'
import type { HighlighterCore } from 'shiki/core'
import type { CodeToHastOptions } from 'shiki'

import { transformerNotationHighlight, transformerNotationFocus, transformerNotationDiff } from '@shikijs/transformers'
import { transformerTwoslash, rendererRich } from '@shikijs/twoslash'
import { serendipity } from './highlight.serendipity'
import { createHighlighterCore } from 'shiki/core'
import getWasm from 'shiki/wasm'

export type HighlightOptions = CodeToHastOptions<string, string> & {
	/**
	 * The language to highlight.
	 * @defaultValue 'svelte'
	 */
	lang: LanguageInput | string
	/**
	 * The language to highlight.
	 * @defaultValue 'javascript'
	 */
	theme: ThemeInput | 'serendipity'
}

export const HIGHLIGHT_DEFAULTS: HighlightOptions = {
	lang: 'svelte',
	theme: 'serendipity',
} as const

const themes = new Set<ThemeInput>()

// The default theme.
themes.add('serendipity' as ThemeInput)

/**
 * Converts text to HTML with syntax highlighting using shikiji.
 */
export async function highlight(text: string, options?: Partial<HighlightOptions>) {
	const opts = { ...HIGHLIGHT_DEFAULTS, ...options } as HighlightOptions

	const highlighter = await getHighlighterInstance()

	try {
		const highlighted = highlighter.codeToHtml(text, {
			...opts,
			transformers: [
				transformerTwoslash({
					renderer: rendererRich(),
				}),
				transformerNotationHighlight(),
				transformerNotationFocus(),
				transformerNotationDiff(),
			],
		})
		return highlighted
	} catch (error) {
		console.error(error)
		return text
	}
}

let highlighterInstance: HighlighterCore
/**
 * Highlighter instance singleton used internally.
 */
export async function getHighlighterInstance() {
	if (!highlighterInstance) {
		highlighterInstance = await createHighlighterCore({
			loadWasm: getWasm,
			themes: [serendipity],
			langs: [svelte, typescript, javascript],
		})
	}
	return highlighterInstance
}
