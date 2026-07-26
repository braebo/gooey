// @ts-check
import { getHighlighterInstance } from './src/lib/highlighter/highlight.js'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { sveltePreprocess } from 'svelte-preprocess'
import postcssConfig from './postcss.config.js'
import adapter from '@sveltejs/adapter-auto'
import MagicString from 'magic-string'
import {
	processCodeblockSync,
	defaultTransformMap,
	createShikiLogger,
	getOrLoadOpts,
} from '@samplekit/preprocess-shiki'

const highlighter = await getHighlighterInstance()

const preprocessorRoot = `${import.meta.dirname}/src/routes/`
const formatFilename = (/** @type {string} */ filename) => filename.replace(preprocessorRoot, '')

const shikiWrapper = {
	start: `<Code ssr>`,
	end: `</Code>`,
}

const transforms = {
	block: {
		addDefaultProps: defaultTransformMap.block.addDefaultProps,
		transforms: [
			{
				postprocess: /** @param {string} html */ html => {
					if (html.includes('nowrap')) {
						html = html.replaceAll('nowrap', '')
						return html.trim()
					}
					const wrapped = shikiWrapper.start + html + shikiWrapper.end
					return wrapped
				},
			},
		],
	},
}

const opts = await getOrLoadOpts({
	transformMap: Object.assign(defaultTransformMap, transforms),
	highlighter: {
		core: highlighter,
		cssVarToThemeName: {
			dark: 'serendipity',
			light: 'serendipity-light',
		},
	},
})

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		/** @type {import('svelte/compiler').PreprocessorGroup} */
		{
			name: 'auto-import-code-component',
			script: ({ content, markup, filename, attributes }) => {
				if (!attributes.module && markup.includes('<!-- shiki-start') && !filename?.endsWith('Code.svelte')) {
					if (!content.match(/import Code from/)) {
						const s = new MagicString(content)
						s.prepend('import Code from "$lib/components/Code.svelte";\n')
						return {
							code: s.toString(),
							map: s.generateMap(),
						}
					}
				}
				return {
					code: content,
					map: undefined,
				}
			},
		},
		processCodeblockSync({
			include: filename => filename.startsWith(preprocessorRoot),
			logger: createShikiLogger(formatFilename),
			opts,
		}),
		sveltePreprocess({
			scss: { silenceDeprecations: ['legacy-js-api'] },
			postcss: postcssConfig,
		}),
		vitePreprocess(),
	],
	kit: { adapter: adapter() },
	vitePlugin: {
		inspector: {
			toggleButtonPos: 'bottom-left',
			toggleKeyCombo: 'control-alt',
		},
	},
	onwarn: (/** @type {{ code: string; }} */ warning, /** @type {(arg0: any) => void} */ handler) => {
		if (warning.code === 'element_invalid_self_closing_tag') return
		handler(warning)
	},
}

export default config
