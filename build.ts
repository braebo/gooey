import renameNodeModules from 'rollup-plugin-rename-node-modules'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import { rollup } from 'rollup'

import { writeFile } from 'node:fs/promises'
import { compileAsync } from 'sass'
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

spinner.start(pc.magenta('sass') + ' build')

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
	'src/styles/gooey.css.ts',
	`export default String.raw\`${css.outputFiles[0].text}\``,
	'utf-8',
)

spinner.succeed()

if (!Bun.argv.includes('-w')) {
	// 2
	spinner.start(pc.dim('rm -rf dist'))

	await $`rm -rf dist`
	spinner.succeed()

	// 3
	spinner.start(pc.yellow('esbuild') + ' gooey.min')

	await esbuild.build({
		entryPoints: ['src/index.ts'],
		outfile: 'dist/gooey.min.js',
		bundle: true,
		minify: true,
		platform: 'browser',
		format: 'esm',
	})
	spinner.succeed()

	// 4
	spinner.start(pc.blue('tsc') + pc.dim(' --declaration'))

	await $`tsc --declaration`
	spinner.succeed()
}

// 5
spinner.start(pc.red('rollup') + ' /build\n')

const bundle = await rollup({
	input: 'src/index.ts',
	plugins: [resolve(), renameNodeModules(), typescript()],
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
