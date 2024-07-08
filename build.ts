import { sassPlugin } from 'esbuild-sass-plugin'
import esbuild from 'esbuild'
import { $ } from 'bun'

console.log('removing old build')
await $`rm -r dist`

console.log('building')
await $`tsc --declaration`

console.log('building gooey esm bundle')
await esbuild.build({
	plugins: [sassPlugin({ type: 'css-text' })],
	entryPoints: ['src/index.ts'],
	outfile: 'dist/gooey.esm.min.js',
	bundle: true,
	minify: true,
	platform: 'browser',
	format: 'esm',
})

console.log('building gooey iife bundle')
await esbuild.build({
	plugins: [sassPlugin({ type: 'css-text' })],
	entryPoints: ['src/index.ts'],
	outfile: 'dist/gooey.min.js',
	bundle: true,
	minify: true,
	platform: 'browser',
	format: 'iife',
	globalName: 'gooey',
	logOverride: {
		'empty-import-meta': 'silent',
	},
})
