// todo - update this to use the new shiki API
import type { LanguageInput, ThemeInput } from 'shiki'
import type { HighlighterCore } from 'shiki/core'
import type { CodeToHastOptions } from 'shiki'

// import { transformerTwoSlash } from 'shiki-twoslash'
import { transformerNotationHighlight, transformerNotationFocus, transformerNotationDiff } from '@shikijs/transformers'
import { serendipity } from './highlight.serendipity'
import { getSingletonHighlighterCore } from 'shiki'

import { getWasmInlined, bundledLanguages } from 'shiki'
import { logger } from '../../../../src/index'
import { fmtTime } from './time.js'
import { dim, o } from './l'

const DEBUG = false
const log = logger('highlight', { fg: '#94b8ff', deferred: false, browser: DEBUG, server: DEBUG })

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
 * Converts text to HTML with syntax highlighting using shiki.
 */
export async function highlight(text: string, options?: Partial<HighlightOptions>) {
	const opts = { ...HIGHLIGHT_DEFAULTS, ...options } as HighlightOptions

	const lang = opts.lang === 'ts' ? 'typescript' : opts.lang
	const theme = opts.theme as ThemeInput

	log('highlighting', { lang, theme })
	const start = performance.now()

	const highlighter = await getHighlighterInstance()

	if (!highlighter) throw new Error('Unable to load highlighter')

	await loadLanguage(highlighter, lang)

	const all = highlighter.getLoadedLanguages()

	if (!all.includes(lang)) {
		log(o('Language not loaded:'), lang, all)

		await highlighter.loadLanguage(bundledLanguages[lang as keyof typeof bundledLanguages])

		log('loaded', lang)

		// if (!all.includes(lang)) {
		// 	throw new Error(`Unable to load language "${lang}"`)
		// }
	}

	if (!themes.has(theme)) {
		log('theme | missing |', theme)

		const { bundledThemes } = await import('shiki')

		// @ts-expect-error - // todo
		await highlighter.loadTheme(bundledThemes[theme])
		themes.add(theme)

		log('theme | loaded |', theme)
	}

	try {
		const highlighted = highlighter.codeToHtml(text, {
			...opts,
			transformers: [
				transformerNotationHighlight(),
				transformerNotationFocus(),
				transformerNotationDiff(),
				// transformerTwoSlash(),
			],
		})
		const time = fmtTime(performance.now() - start)
		log('complete', dim(time), { lang, theme, text, highlighted })
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
		highlighterInstance = await getSingletonHighlighterCore({
			loadWasm: getWasmInlined,
			themes: [serendipity],
			langs: [
				import('shiki/langs/svelte.mjs'),
				import('shiki/langs/typescript.mjs'),
				import('shiki/langs/javascript.mjs'),
			],
			// langs: [],
		})
	}
	return highlighterInstance
}

const langs = new Set<string>()
/**
 * Load a language into the highlighter.
 * @internal
 */
export async function loadLanguage(highlighter: HighlighterCore, lang: string) {
	if (langs.has(lang)) return

	log('pending | ' + lang)
	// @ts-expect-error - todo
	await highlighter.loadLanguage(bundledLanguages[lang])
	log('loaded | ' + lang)

	langs.add(lang)

	return lang
}
