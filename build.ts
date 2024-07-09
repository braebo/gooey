import renameNodeModules from 'rollup-plugin-rename-node-modules'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import sass from 'rollup-plugin-sass'
import { rollup } from 'rollup'

import { sassPlugin } from 'esbuild-sass-plugin'
import esbuild from 'esbuild'
import pc from 'picocolors'
import { $ } from 'bun'
import ora from 'ora'

const start = performance.now()

const spinner = ora({
	color: 'cyan',
	prefixText: pc.cyan('gooey') + pc.dim(' build'),
	stream: process.stdout,
}).start()

if (!Bun.argv.includes('-w')) {
	// 1
	spinner.start(pc.dim('rm -rf dist'))

	await $`rm -rf dist`
	spinner.succeed()

	// 2
	spinner.start(pc.yellow('esbuild') + ' gooey.min')

	await esbuild.build({
		plugins: [sassPlugin({ type: 'css-text' })],
		entryPoints: ['src/index.ts'],
		outfile: 'dist/gooey.min.js',
		bundle: true,
		minify: true,
		platform: 'browser',
		format: 'esm',
	})
	spinner.succeed()

	// 3
	spinner.start(pc.blue('tsc') + pc.dim(' --declaration'))

	await $`tsc --declaration`
	spinner.succeed()
}

// 4
spinner.start(pc.red('rollup') + ' /build\n')

const bundle = await rollup({
	input: 'src/index.ts',
	plugins: [resolve(), renameNodeModules(), typescript(), sass()],
})

spinner.text = pc.red('rollup') + ' /build'

await bundle.write({
	dir: 'dist/build',
	format: 'esm',
	sourcemap: true,
	preserveModules: true,
	preserveModulesRoot: 'src',
})

await bundle.close()
spinner.succeed()

// 5
spinner.start(pc.magenta('publint\n'))
await $`publint`
spinner.text = pc.magenta('publint')

spinner.succeed(pc.green('done') + pc.dim(` in ${((performance.now() - start) / 1000).toFixed()}s`))
