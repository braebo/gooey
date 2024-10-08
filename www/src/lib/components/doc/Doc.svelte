<script lang="ts">
	import type { ParsedSvelteFile, ParsedTSFile } from 'extractinator'
	import type { Snippet } from 'svelte'

	import Examples from './Examples.svelte'
	import Bits from './Bits.svelte'

	type Exp = ParsedTSFile['exports'][0]
	type Bits = 'props' | 'events' | 'slots' | 'exports'

	// ## Svelte 4
	// export let doc: ParsedSvelteFile | ParsedTSFile | Exp
	// export let filePath = (doc as ParsedSvelteFile | ParsedTSFile).filePath
	// export let exclude: Bits[] = []
	// export let depth = 0

	// ## Svelte 5

	const {
		doc,
		filePath = (doc as ParsedSvelteFile | ParsedTSFile).filePath,
		exclude = [],
		depth = 0,
		children,
		description,
	}: {
		doc: ParsedSvelteFile | ParsedTSFile | Exp
		filePath?: string
		exclude?: Bits[]
		depth?: number
		children?: Snippet
		description?: Snippet
	} = $props()

	const type = doc.type === 'svelte' ? 'Svelte Component' : 'Module'
	const title = doc.type === 'svelte' ? (doc as ParsedSvelteFile).componentName : (doc as Exp).name

	const comment = (doc as ParsedSvelteFile | Exp).comment

	const _props = (doc as ParsedSvelteFile).props
	const events = (doc as ParsedSvelteFile).events
	const slots = (doc as ParsedSvelteFile).slots

	const exports = (doc as ParsedSvelteFile | ParsedTSFile).exports

	function isTs(doc: ParsedSvelteFile | ParsedTSFile | Exp): doc is ParsedTSFile {
		return doc.type === 'ts'
	}

	function isSvelte(doc: ParsedSvelteFile | ParsedTSFile | Exp): doc is ParsedSvelteFile {
		return doc.type === 'svelte'
	}

	function pluralize(arr: any[], word: string) {
		const n = arr.length
		return n === 1 ? word : word + 's'
	}

	/**
	 * Filter out empty and excluded sections.
	 */
	function include(key: 'props' | 'events' | 'slots' | 'exports') {
		if (!isSvelte(doc)) return false
		if (exclude.includes(key)) return false
		return doc[key]?.length
	}

	let mobile = $state(false)
	$effect(() => {
		mobile = window.innerWidth < 1000
	})
</script>

<!-- <pre>{stringify(doc, 2)}</pre> -->

{#if isTs(doc)}
	{#each exports as d}
		<svelte:self doc={d} {filePath} depth={depth + 1} />
	{/each}
{:else if doc.comment && !doc.comment.internal}
	<div class="doc" class:mobile>
		<header>
			<a href="#{title}"><h1 id={title}>{title}</h1></a>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<p class="code" onclick={() => console.log(doc)}>{type}</p>
		</header>

		<!-- svelte-ignore slot_element_deprecated -->
		<div class="description" class:mobile>
			{#snippet description()}
				{#if comment}
					<div class="summary">
						{@html comment.summary}
					</div>

					{#if comment.examples}
						<h3>{pluralize(comment.examples, 'Example')}</h3>
						<Examples examples={comment.examples} />
					{/if}
				{/if}
			{/snippet}
			{@render description()}
		</div>

		{#if include('props')}
			<h3>{pluralize(_props, 'Prop')}</h3>
			<Bits bits={_props} />
		{/if}

		{#if include('events')}
			<h3>{pluralize(events, 'Event')}</h3>
			<Bits bits={events} />
		{/if}

		{#if include('slots')}
			<h3>{pluralize(slots, 'Slot')}</h3>
			<Bits bits={slots} />
		{/if}

		{#if include('exports')}
			<h3>{pluralize(exports, 'Export')}</h3>
			<Bits bits={exports} />
		{/if}

		{@render children?.()}

		<a
			class="link"
			target="_blank"
			title="View source on GitHub"
			href="https://github.com/braebo/gooey/tree/main/{filePath}"
		>
			{'</>'}
		</a>
	</div>
{/if}

<style lang="scss">
	.doc {
		display: flex;
		position: relative;
		flex-direction: column;
		gap: 0.5rem;

		// width: var(--col);
		width: clamp(20rem, 100%, 50rem);
		margin: 3rem auto;
		padding: 1.5rem;
		padding-bottom: 3rem;

		color: var(--fg-c);
		// background: hsl(228, 15%, 7%);
		background: var(--bg-b);

		border-radius: var(--radius);

		font-family: var(--font-b);
		font-variation-settings: 'wght' 300;
		letter-spacing: 0.5px;

		outline: none;
		z-index: 1;

		font-size: var(--font-sm);
	}

	:global(body[theme='theme-a']) {
		.doc {
			background: rgba(var(--bg-b-rgb), 0.5);
			box-shadow: var(--shadow-lg);
		}
	}

	.summary {
		padding-top: 1rem;

		font-size: 1rem;
		line-height: 1.6rem;
		letter-spacing: 0.6px;
		word-spacing: 1px;

		:global(code:not(pre code)) {
			background: var(--bg-a);
			// color: var(--theme-b);
			color: var(--theme-c);
			font-size: 13px !important;

			padding: 0.1rem 0.4rem;
			margin: 0 0.2rem;
			border-radius: 0.2rem;
		}

		:global(a) {
			color: var(--theme-a) !important;
		}
	}

	h1 {
		color: var(--fg-a);

		font-size: 1.5rem;

		scroll-padding-top: 3rem !important;
	}

	h3 {
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;

		text-align: center;
		font-size: var(--font-md);
		color: var(--fg-a);
	}

	.doc a {
		font-family: var(--font-a);
		text-decoration: none;

		scroll-padding-top: 3rem;

		&:target {
			scroll-padding-top: 3rem;
		}
	}
	.doc a:hover {
		text-decoration: underline;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	:global(.doc .param) {
		display: flex;
		gap: 0.5rem;

		margin-top: 0.5rem;
	}

	:global(.doc ul) {
		margin-top: 0.5rem;
		margin-left: 1rem;
	}
	:global(.doc li) {
		margin-top: 0.5rem;
		margin-left: 1rem;
		line-height: 1.25rem;
	}

	.link {
		position: absolute;
		bottom: 0.75rem;
		right: 1.25rem;

		// padding: 1.2rem;

		color: var(--bg-c);

		font-family: var(--font-mono) !important;
		font-variation-settings: 'wght' 500 !important;

		transition: 0.15s;
	}
	.link:hover {
		font-variation-settings: 'wght' 900 !important;
		text-decoration: none !important;
	}
</style>
