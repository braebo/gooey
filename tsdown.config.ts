import { lintJsrExports } from 'jsr-exports-lint/tsdown'
import { writeFile } from 'node:fs/promises'
import { defineConfig } from 'tsdown'
import { compileAsync } from 'sass'
import esbuild from 'esbuild'

export default defineConfig({
	entry: ['./src/index.ts'],
	tsconfig: 'tsconfig.json',
	platform: 'browser',
	format: ['esm'],
	minify: false,
	sourcemap: true,
	dts: { sourcemap: true },
	publint: true,
	attw: true,
	unbundle: true,
	skipNodeModulesBundle: true,
	exports: { devExports: 'development' },
	hooks: {
		'build:done': lintJsrExports(),
		'build:before': async () => {
			const css = await esbuild.build({
				stdin: {
					contents: (await compileAsync('src/styles/gooey.scss')).css,
					loader: 'css',
				},
				bundle: true,
				minify: true,
				write: false,
			})

			await writeFile(
				'src/styles/gooey-css.ts',
				`export default String.raw\`${css.outputFiles[0].text}\``,
				'utf-8',
			)
		},
	},
})
