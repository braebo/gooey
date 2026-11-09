<!-- based on Themer: "../../../../../src/styles/themer/Themer.ts" and ThemeEditor: "../../../../../src/styles/ThemeEditor.ts" -->

<script lang="ts">
	import type { Gooey } from 'gooey'

	import { ThemeEditor } from 'gooey'
	import LiveExample from '$lib/components/LiveExample.svelte'
	import H from '$lib/components/H.svelte'

	const THEMES = ['vanilla', 'flat', 'scout']

	/** A few inputs, so a theme change has something to show on. */
	function sampler(g: Gooey) {
		g.add('speed', 0.5)
		g.add('tint', '#ff4221')
		g.add('enabled', true)
		g.addSelect('shape', 'circle', { options: ['circle', 'square', 'triangle'] })
	}

	/** A button per built-in theme, kept on the active one however it was switched (the gear's picker too). */
	function themeButtons(g: Gooey) {
		const grid = g.addButtonGrid(
			'theme',
			[
				THEMES.map(title => ({
					text: title,
					onClick: () => (g.theme = title),
					active: () => g.theme === title,
				})),
			],
			{ applyActiveClass: true },
		)
		g.themer.theme.subscribe(t => {
			if (THEMES.includes(t.title)) grid.setActive(t.title)
		})
	}

	const VARS = [
		'--gooey-theme-a',
		'--gooey-bg-a',
		'--gooey-bg-b',
		'--gooey-fg-a',
		'--gooey-radius',
		'--gooey-font-family',
		'--gooey-folder-header_color',
		'--gooey-controller_background',
	]
</script>

<H l="1" id="theming">Theming</H>

<div class="br-lg" />

<!--? Themes -->

<H l="2" id="themes">Themes</H>

<section class="section">
	<div class="description">
		<span class="gooey">gooey</span> ships three themes: <code>vanilla</code> (the default), <code>flat</code>, and
		<code>scout</code>. Pick one with the <code>theme</code> option, or switch at any time by setting
		<code>gooey.theme</code>.
	</div>

	<div class="example">
		<!-- shiki-start
```ts
const gooey = new Gooey({ theme: 'scout' })

// switch it live
gooey.theme = 'flat'
```
shiki-end -->

		<LiveExample
			title="Switching Themes"
			theme="scout"
			height="12rem"
			onMount={g => {
				themeButtons(g)
				sampler(g)
			}}
			position="center"
		/>
	</div>

	<div class="description em">
		Every panel also carries a theme picker of its own: open the settings (the gear in its header) and look in the
		<code>ui</code> folder. This site follows its panels' themes, which is why the page recolors with them.
	</div>
</section>

<!--? Mode -->

<div class="br"></div>
<H l="2" id="mode">Mode</H>

<section class="section">
	<div class="description">
		Each theme has a <code>dark</code> and a <code>light</code> variant. The <code>themeMode</code> option picks one
		(<code>'dark'</code> by default), and <code>'system'</code> follows the visitor's
		<code>prefers-color-scheme</code>, live.
	</div>

	<div class="example">
		<!-- shiki-start
```ts
const gooey = new Gooey({ themeMode: 'system' })

gooey.themer.mode.set('light')

gooey.themer.mode.subscribe(mode => console.log(mode))
```
shiki-end -->

		<LiveExample
			title="Light and Dark"
			height="12rem"
			onMount={g => {
				const grid = g.addButtonGrid(
					'mode',
					[
						['light', 'dark', 'system'].map(mode => ({
							text: mode,
							onClick: () => g.themer.mode.set(mode as 'light' | 'dark' | 'system'),
							active: () => g.themer.mode.value === mode,
						})),
					],
					{ applyActiveClass: true },
				)
				g.themer.mode.subscribe(mode => grid.setActive(mode))
				sampler(g)
			}}
			position="center"
		/>
	</div>

	<div class="description em">
		This site keeps its own light / dark switch in step with the panels' modes, which is why the whole page follows.
	</div>
</section>

<!--? CSS variables -->

<div class="br"></div>
<H l="2" id="variables">CSS Variables</H>

<section class="section">
	<div class="description">
		A theme is a TypeScript object of CSS custom properties. Colors are a short palette: <code>theme-a</code> is the
		accent, <code>dark-a..e</code> and <code>light-a..e</code> are shades, and each mode derives its background
		(<code>bg-a..e</code>) and foreground (<code>fg-a..e</code>) from them. Every other variable nests by name, and
		<code>scout</code> overrides a few:
	</div>

	<div class="example">
		<!-- shiki-start
```ts
{
  title: 'scout',
  prefix: 'gooey',
  vars: {
    color: {
      base: {
        'theme-a': '#ff4221',
        'dark-a': '#15161d',
        'light-a': '#dfe1e9',
        // ...theme-b, theme-c, dark-b..e, light-b..e
      },
      dark: {},
      light: {},
    },
    utility: {
      dark: {
        filter: 'contrast(1.05) brightness(1.05)',
      },
    },
    core: {
      dark: {
        'folder-header_background':
          'color-mix(in sRGB, var(--gooey-bg-a) 100%, transparent)',
      },
      light: {
        'controller-dim_background': '#96a09c',
      },
    },
  },
}
```
shiki-end -->
	</div>

	<div class="description">
		The themer writes them onto the panel's wrapper as <code>--gooey-*</code> properties, choosing the
		<code>base</code> values plus the active mode's. Nested keys join with <code>-</code> and the last one with
		<code>_</code>, so <code>{'{ folder: { header: { color } } }'}</code> becomes
		<code>--gooey-folder-header_color</code>. Switch the theme below and watch the values change:
	</div>

	<div class="example">
		<!-- shiki-start
```ts
const vars = ['--gooey-theme-a', '--gooey-bg-a']
const { style } = gooey.wrapper

const show = () => {
  for (const name of vars) {
    console.log(name, style.getPropertyValue(name))
  }
}
gooey.themer.theme.subscribe(show)
gooey.themer.mode.subscribe(show)
```
shiki-end -->

		<LiveExample
			title="Live Variables"
			height="22rem"
			onMount={g => {
				themeButtons(g)

				const table = document.createElement('div')
				table.style.cssText =
					'display: grid; grid-template-columns: auto 1fr; gap: 0.2rem 0.75rem; font-size: 0.7rem; width: 100%; overflow: hidden;'
				g.addElement('vars', table)

				const show = () => {
					table.replaceChildren()
					for (const name of VARS) {
						const value = g.wrapper.style.getPropertyValue(name).trim()
						const key = document.createElement('code')
						key.textContent = name.replace('--gooey-', '')
						const val = document.createElement('span')
						val.style.cssText = 'display: flex; align-items: center; gap: 0.4rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'
						if (/^#[0-9a-f]{3,8}$/i.test(value)) {
							const chip = document.createElement('span')
							chip.style.cssText = `flex: none; width: 0.7rem; height: 0.7rem; border-radius: 2px; background: ${value};`
							val.append(chip)
						}
						val.append(value)
						val.title = value
						table.append(key, val)
					}
				}
				g.themer.theme.subscribe(show)
				g.themer.mode.subscribe(show)
			}}
			position="center"
		/>
	</div>

	<div class="description em">
		The variables land on the wrapper, so a rule of your own on <code>.gooey-root</code> shadows them, and survives
		every theme and mode change:
	</div>

	<div class="example">
		<!-- shiki-start
```css
.gooey-root {
  --gooey-theme-a: hotpink;
  --gooey-radius-sm: 0;
}
```
shiki-end -->
	</div>

	<div class="description em">
		A variable built from another, like <code>folder-header_color</code> (<code>var(--gooey-fg-c)</code>), is
		resolved on the wrapper, so shadow the variable a rule reads rather than the palette color under it.
	</div>
</section>

<!--? Theme editor -->

<div class="br"></div>
<H l="2" id="editor">Theme Editor</H>

<section class="section">
	<div class="description">
		<code>ThemeEditor</code> opens a second <span class="gooey">gooey</span> that edits the active theme, with a
		folder of inputs per variable group (<code>color</code>, <code>utility</code>, <code>core</code>), each split by
		mode. Edits preview live on the panel. <code>save</code> stores the theme as one of the themer's user themes,
		and saving a built-in theme stores an edited copy beside it, so the original is never overwritten.
	</div>

	<div class="example">
		<!-- shiki-start
```ts
import { Gooey, ThemeEditor } from 'gooey'

const gooey = new Gooey({
  position: 'bottom-left',
})

const editor = new ThemeEditor(gooey)
```
shiki-end -->

		<LiveExample
			title="My Panel"
			height="40rem"
			onMount={g => {
				sampler(g)
				new ThemeEditor(g)
			}}
			position="bottom-left"
		/>
	</div>

	<div class="description em">
		Open <code>color › base</code> in the editor and change <code>theme-a</code>: the panel beside it recolors as you
		drag. User themes persist in <code>localStorage</code> when the panel has <code>storage</code> on.
	</div>
</section>

<div class="br-xl" />
<div class="br-xl" />
<div class="br-xl" />
