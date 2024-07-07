import { sassPlugin } from 'esbuild-sass-plugin'
import { defineConfig } from 'tsup'

export default defineConfig([
	{
		entry: {
			'index.min': 'src/index.ts',
		},
		minify: !0,
		name: 'minified',
		format: ['esm'],
		clean: true,
		dts: !!0,
		esbuildPlugins: [
			// @ts-expect-error broken type
			sassPlugin({
				type: 'css-text',
			}),
		],
	},
	{
		entry: ['src/index.ts'],
		name: 'standard',
		format: ['esm'],
		clean: true,
		dts: true,
		esbuildPlugins: [
			// @ts-expect-error broken type
			sassPlugin({
				type: 'css-text',
			}),
		],
	},
])
