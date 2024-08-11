import typescript from 'shiki/langs/typescript.mjs'
import svelte from 'shiki/langs/svelte.mjs'
import json from 'shiki/langs/json.mjs'

import type { HighlighterCore } from 'shiki/core'
import type { CodeToHastOptions } from 'shiki'
import type { ThemeInput } from 'shiki'

import { transformerNotationHighlight, transformerNotationFocus, transformerNotationDiff } from '@shikijs/transformers'
import { serendipity } from './highlight.serendipity'
import { createHighlighterCore } from 'shiki/core'
import getWasm from 'shiki/wasm'

export type HighlightOptions = Partial<Omit<CodeToHastOptions<string, string>, 'lang' | 'theme'>> & {
	/**
	 * The language to use for highlighting.
	 * @default 'typescript'
	 */
	lang: ValidLanguage
	/**
	 * The theme to use for highlighting.
	 * @default 'serendipity'
	 */
	theme: ThemeInput | 'serendipity'
}

export const HIGHLIGHT_DEFAULTS: HighlightOptions = {
	lang: 'typescript',
	theme: 'serendipity',
} as const

const themes = new Set<ThemeInput>()

export type ValidLanguage = (typeof LANGUAGES)[number]
const LANGUAGES = [
	'json',
	'javascript',
	'typescript',
	'stylus',
	'sass',
	'css',
	'less',
	'postcss',
	'coffee',
	'scss',
	'html',
	'pug',
	'markdown',
	'svelte',
	'js',
	'ts',
	'styl',
	'coffeescript',
	'jade',
	'md',
]

// The default theme.
themes.add('serendipity' as ThemeInput)

/**
 * Generates syntax highlighted HTML from text using {@link https://shiki.style/|shiki}.
 *
 * @param text The text to highlight.
 * @param options {@link HighlightOptions} to customize the highlighting.
 * @returns An `HTML` string.
 *
 * @example
 * ```ts
 * const html = highlight('let x = 1', { lang: 'javascript' })
 * ```
 */
export async function highlight(text: string, options?: Partial<HighlightOptions>): Promise<string> {
	const opts = { ...HIGHLIGHT_DEFAULTS, ...options } as HighlightOptions

	const highlighter = await getHighlighterInstance()

	const langs = highlighter.getLoadedLanguages()

	try {
		const highlighted = highlighter.codeToHtml(text, {
			...opts,
			transformers: [transformerNotationHighlight(), transformerNotationFocus(), transformerNotationDiff()],
		} as CodeToHastOptions<string, string>)
		return highlighted
	} catch (error) {
		console.error(error)
		return text
	}
}

let highlighterInstance: HighlighterCore

/**
 * Highlighter instance singleton used internally.
 * @internal
 */
async function getHighlighterInstance() {
	if (!highlighterInstance) {
		highlighterInstance = await createHighlighterCore({
			loadWasm: getWasm,
			themes: [serendipity],
			langs: [svelte, typescript, json],
		})
	}
	return highlighterInstance
}
