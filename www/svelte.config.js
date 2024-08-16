import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { sveltePreprocess } from 'svelte-preprocess'
import mdsvexConfig from './mdsvex.config.js'
import adapter from '@sveltejs/adapter-auto'
import { mdsvex } from 'mdsvex'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	preprocess: [
		sveltePreprocess(),
		mdsvex(mdsvexConfig),
		vitePreprocess({
			style: {
				css: {
					postcss: join(__dirname, 'postcss.config.cjs'),
					// postcss: postcssConfig,
				},
			},
		}),
	],
	kit: { adapter: adapter(), alias: {} },
	vitePlugin: {
		inspector: {
			toggleButtonPos: 'bottom-left',
			toggleKeyCombo: 'control-alt',
			showToggleButton: 'active',
			holdMode: true,
		},
	},
	onwarn: (warning, handler) => {
		if (warning.code === 'element_invalid_self_closing_tag') return
		handler(warning)
	},
}

export default config
