import { defineConfig } from 'tsup'

export default defineConfig([
	{
		entry: {
			'index.min': 'src/index.ts',
		},
		minify: !0,
		name: 'standard',
		format: ['esm'],
		clean: true,
		dts: !!0,
	},
	{
		entry: ['src/index.ts'],
		name: 'standard',
		format: ['esm'],
		clean: true,
		dts: true,
	},
])
