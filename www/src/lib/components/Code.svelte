<!-- 
	@component

	A styled code block with syntax highlighting.  On the client, the code is 
	highlighted using [Shikiji](https://github.com/antfu/shikiji) using the 
	{@link highlight} util unless the `ssr` prop is set to true and the highlighted 
	text is provided as the `highlightedText` prop.  The raw `text` prop is still 
	required in this case, as it's used for screen readers and the copy button.

	@example CSR

	A simple browser example:

	```svelte
	<script>
		import Code from 'fractils'

		const text = `console.log('hello world')`
	</script>

	<Code {text} />
	```

	@example SSR
	
	+page.svelte
	```svelte
	<script>
		import Code from 'fractils'

		const { highlightedText } = data
	</script>

	<Code ssr {highlightedText} lang="js" />
	```
	
	+page.ts
	```typescript
	import { highlight } from 'fractils/utils/highlight'

	export async function load({ page, fetch }) {
		const text = `console.log('hello world')`
		const highlightedText = await highlight(text, { lang: 'js' })

		return { highlightedText }
	}
	```
-->

<script lang="ts" module>
	import type { highlight as highlightFn } from '$lib/utils/highlight.svelte'

	export type Tab = {
		text: string
		onclick?: (payload: { text: string; el: HTMLElement }) => void
		active?: boolean
	}

	function log(...args: any[]) {
		if (!DEV) return
		console.log(`\x1b[1m\x1b[33mCode.svelte\x1b[0m\n↳ `, ...args)
	}

	let highlight = $state<typeof highlightFn>()

	async function getHighlighter() {
		if (!highlight) {
			const module = await import('../utils/highlight.svelte')

			if (!highlight) log('Lazy loading highlight() function.')

			highlight ??= module.highlight
		}

		return highlight
	}
</script>

<!-- svelte-ignore state_referenced_locally -->
<script lang="ts">
	import type { ValidLanguage } from '$lib/utils/highlight.svelte'
	import type { LanguageRegistration, ThemeInput } from 'shiki'
	import type { Snippet } from 'svelte'

	// import { trimmer } from '$lib/utils/trimmer'
	import Copy from './Copy.svelte'
	import { DEV } from 'esm-env'
	import './code.scss'

	type Boilerplate = {
		/**
		 * Effectively just disables the client-side highlighting, assuming the text has already
		 * been highlighted on the server.
		 * @default false
		 */
		ssr?: boolean
		/**
		 * An optional title to display above the code block.
		 * @default 'code'
		 */
		title?: string
		/**
		 * The language to use.  Must be a {@link LanguageRegistration}, ideally important
		 * directly from the corresponding `shiki/langs/<lang>.mjs' module.
		 * @default 'json'
		 */
		lang?: ValidLanguage | ({} & string)
		/**
		 * The theme to use.
		 * @default 'serendipity'
		 */
		theme?: 'serendipity' | ThemeInput
		/**
		 * If true, a button will be displayed to copy the code to the clipboard.
		 * @default true
		 */
		copyButton?: boolean
		/**
		 * If true, the code block will be collapsed by default.
		 * @default false
		 */
		collapsed?: boolean
		/**
		 * If true, noise like `"` and `;` will be stripped (nice for JSON).
		 * @default false
		 */
		pretty?: boolean
		/**
		 * If true, leading whitespace will be trimmed based on the minimum indentation level.
		 * @default false
		 */
		trim?: boolean
		close?: () => void
		minimize?: () => void
		maximize?: () => void
		/**
		 * Hides the header element when `false`.
		 * @default true
		 */
		headless?: boolean
		tabs?: Tab[]
		/**
		 * Bypasses the `.code-window` and `.codeblock` wrappers.
		 * @default false
		 */
		nowrap?: boolean
	} & (
		| {
				/**
				 * The string to highlight.
				 */
				text: string
				/**
				 * Optional pre-highlighted text.  If this is provided _and_ the {@link ssr}
				 * prop is `true`, the highlighter will not be loaded / run on the client.
				 */
				highlightedText?: string
				children?: Snippet
		  }
		| {
				/**
				 * The string to highlight.
				 */
				text?: string
				/**
				 * Optional pre-highlighted text.  If this is provided _and_ the {@link ssr}
				 * prop is `true`, the highlighter will not be loaded / run on the client.
				 */
				highlightedText: string
				children?: Snippet
		  }
		| {
				/**
				 * The string to highlight.
				 */
				text?: string
				/**
				 * Optional pre-highlighted text.  If this is provided _and_ the {@link ssr}
				 * prop is `true`, the highlighter will not be loaded / run on the client.
				 */
				highlightedText?: string
				children: Snippet
		  }
	)

	let {
		ssr = false,
		text = $bindable(''),
		highlightedText: _highlightedText = $bindable(''),
		title = 'code',
		lang = 'json',
		theme = 'serendipity',
		copyButton = true,
		collapsed: _collapsed = false,
		pretty = false,
		headless = true,
		tabs = $bindable([]),
		children = undefined,
		nowrap = false,
	}: Boilerplate = $props()

	let highlightedText = $state(_highlightedText ?? (ssr ? text : sanitize(text ?? '')))
	const alreadyHighlighted = highlightedText === text

	let collapsed = $state(_collapsed)
	let codeblock: HTMLElement | undefined = undefined
	let loopGuard = false

	$effect(() => {
		if (loopGuard) return
		loopGuard = true

		highlightedText = _highlightedText ?? (ssr ? text : sanitize(text ?? ''))
		if (!alreadyHighlighted && !ssr) {
			highlightCode()
		}
	})

	async function highlightCode() {
		loopGuard = true
		log('Highlighter called client-side!')

		const highlighter = await getHighlighter()
		let result = await highlighter(text ?? '', { lang: lang as ValidLanguage, theme })

		if (pretty) result = result.replaceAll(/"/g, '')

		highlightedText = result
	}

	// if (DEV && !text && !highlightedText) {
	// 	// console.error('<Code /> component requires either the `text` or `highlightedText` prop.')
	// 	// if (!text && highlightedText) {
	// 	// 	console.warn(
	// 	// 		'`highlightedText` was provided, but unhighlighted `text` prop is required for copy/paste and screen-reader support.',
	// 	// 	)
	// 	// }
	// }

	/**
	 * Replace all `<` and `>` with their HTML entities to avoid
	 * early script tag termination.
	 */
	function sanitize(text: string) {
		return text.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
	}
</script>

<!-- invisible plain text version for screen readers -->
<div class="sr-only" aria-label={`code snippet titled ${title}`}>{text}</div>

<div class:code-window={!nowrap} class:nowrap>
	<div class="nav" class:headless>
		{#each tabs as t}
			<button
				class="btn tab"
				class:active={t.active}
				onclick={() =>
					t.onclick?.({
						text: t.text,
						el: codeblock!,
					})}
			>
				{t.text}
			</button>
		{/each}
	</div>

	<div class:codeblock={!nowrap} class:nowrap class:collapsed bind:this={codeblock}>
		{#if text && copyButton}
			<div class="copy-container">
				<div class="sticky">
					<Copy {text} />
				</div>
			</div>
		{/if}

		{#if highlightedText}1
			<pre class="shiki-wrapper">{@html highlightedText}</pre>
		{:else if text}
			<pre class="shiki-wrapper">{text}</pre>
		{:else if children}
			{@render children()}
		{/if}
	</div>
</div>

<style lang="scss">
	.sr-only {
		position: absolute;
		clip: rect(1px, 1px, 1px, 1px);
		clip-path: inset(50%);
		overflow: hidden;
		width: 1px;
		height: 1px;
	}

	.headless {
		display: none;
	}

	.nowrap {
		display: contents;
	}
</style>
