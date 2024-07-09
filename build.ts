import { sassPlugin } from 'esbuild-sass-plugin'
import esbuild from 'esbuild'
import { $ } from 'bun'

import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import sass from 'rollup-plugin-sass'
import { rollup } from 'rollup'

// Spin a file watcher with bun for the src directory.

console.log('\nremoving old build')
await $`rm -rf dist`

// Quick and dirty esbuild blob.
console.log('\nesbuild gooey.min...')
await esbuild.build({
	plugins: [sassPlugin({ type: 'css-text' })],
	entryPoints: ['src/index.ts'],
	outfile: 'dist/gooey.min.js',
	bundle: true,
	minify: true,
	platform: 'browser',
	format: 'esm',
})

// Full rollup build for code splitting / tree shaking.
console.log('\ngenerating .d.ts...')
await $`tsc --declaration`

console.log('\nrollup /build...')
const bundle = await rollup({
	input: 'src/index.ts',
	plugins: [
		resolve(),
		typescript(),
		sass(),
	],
})

await bundle.write({
	dir: 'dist/build',
	format: 'esm',
	sourcemap: true,
	preserveModules: true,
	preserveModulesRoot: 'src',
})

await bundle.close()

await $`publint`.nothrow()
