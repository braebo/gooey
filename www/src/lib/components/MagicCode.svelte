<script lang="ts">
	import type { LanguageRegistration, ThemeInput } from 'shiki'
	import type { ValidLanguage } from '../utils/highlight'

	import { ShikiMagicMove } from 'shiki-magic-move/svelte'
	import 'shiki-magic-move/dist/style.css'
	import Copy from './Copy.svelte'
	import { DEV } from 'esm-env'
	import './code.scss'

	type Props = {
		/**
		 * Effectively just disables the client-side highlighting, assuming the text has already
		 * been highlighted on the server.
		 * @defaultValue false
		 */
		ssr?: boolean
		/**
		 * An optional title to display above the code block.
		 * @defaultValue 'code'
		 */
		title?: string
		/**
		 * The language to use.  Must be a {@link LanguageRegistration}, ideally important
		 * directly from the corresponding `shiki/langs/<lang>.mjs' module.
		 * @defaultValue 'json'
		 */
		lang?: ValidLanguage
		/**
		 * The theme to use.
		 * @defaultValue 'github'
		 */
		theme?: 'serendipity' | ThemeInput
		/**
		 * If true, a button will be displayed to copy the code to the clipboard.
		 * @defaultValue true
		 */
		copyButton?: boolean
		/**
		 * If true, the code block will be collapsed by default.
		 * @defaultValue false
		 */
		collapsed?: boolean
		/**
		 * If true, noise like `"` and `;` will be stripped (nice for JSON).
		 * @defaultValue false
		 */
		pretty?: boolean
		close?: () => void
		minimize?: () => void
		maximize?: () => void
		/**
		 * Hides the header element when `false`.
		 * @default 'wow'
		 */
		headless?: boolean
		tabs?: { text: string; onclick?: (text: string) => void }[]
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
		  }
	)

	let {
		ssr = false,
		text = $bindable(''),
		highlightedText: _highlightedText = '',
		title = 'code',
		lang = 'json',
		theme = 'serendipity',
		copyButton = true,
		collapsed: _collapsed = false,
		pretty = false,
		headless = false,
		tabs = [],
	}: Props = $props()

	// let text = $state(_text ?? '')
	let highlightedText = $state(_highlightedText ?? (ssr ? text : sanitize(text ?? '')))
	const alreadyHighlighted = highlightedText === text
	let collapsed = $state(_collapsed)
	let highlight: typeof import('../utils/highlight').highlight | undefined = undefined
	// $inspect('highlightedText', '\n', new DOMParser().parseFromString(highlightedText, 'text/html').documentElement)

	$effect(() => {
		if (alreadyHighlighted || ssr) return

		if (!highlight) {
			import('../utils/highlight').then(m => {
				highlight = m.highlight
				highlight(text ?? '', { lang, theme }).then(t => {
					highlightedText = pretty ? t.replaceAll(/"/g, '') : t
				})
			})
		} else {
			highlight(text ?? '', { lang, theme }).then(t => {
				highlightedText = pretty ? t.replaceAll(/"/g, '') : t
			})
		}
	})

	if (DEV && !text && !highlightedText) {
		console.error('<Code /> component requires either the `text` or `highlightedText` prop.')

		if (!text && highlightedText) {
			console.warn(
				'`highlightedText` was provided, but unhighlighted `text` prop is required for copy/paste and screen-reader support.',
			)
		}
	}

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

<div class="code-window">
	<div class="nav" class:headless>
		{#each tabs as t}
			<button class="tab" onclick={() => t.onclick?.(t.text)}>
				{t.text}
			</button>
		{/each}
	</div>

	<div class="codeblock" class:collapsed>
		{#if text && copyButton}
			<div class="copy-container">
				<div class="sticky">
					<Copy {text} />
				</div>
			</div>
		{/if}

		{#if highlightedText}
			<pre class="shiki-wrapper">{@html highlightedText}</pre>
		{:else}
			<pre class="shiki-wrapper">{text}</pre>
		{/if}
	</div>
</div>
<ShikiMagicMove
lang='ts'
theme='nord'
{highlighter}
code={text}
options={{ duration: 800, stagger: 0.3, lineNumbers: true }}
/>
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
</style>
