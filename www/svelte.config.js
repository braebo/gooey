import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { sveltePreprocess } from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-auto'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		sveltePreprocess(),
		vitePreprocess({
			style: {
				css: {
					postcss: join(__dirname, 'postcss.config.cjs'),
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
