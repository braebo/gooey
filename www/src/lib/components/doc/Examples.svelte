<script lang="ts">
	import type { HighlightedBlock } from 'docinator'
	import type { ParsedExample } from 'extractinator'

	import Code from '../Code.svelte'

	export let examples: ParsedExample[]

	const hasHTMLBlocks = (comment: any) => {
		return comment as { name: string; content: string; blocks: HighlightedBlock[] }
	}
</script>

<div class="examples col">
	{#each examples as example}
		{@const { name, blocks } = hasHTMLBlocks(example)}
		<div class="example col">
			{#if name}
				<h4 class="name">
					{name}
				</h4>
			{/if}

			{#each blocks as block}
				{#if block.type === 'code'}
					<div class="block">
						<Code
							title={block.title || block.lang || ''}
							text={block.raw}
							highlightedText={block.content}
							lang={block.lang}
						/>
					</div>
				{:else}
					<div class="block">
						{@html block.content}
					</div>
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	.examples {
		gap: 1rem;
	}
	.example {
		gap: 0.5rem;
	}

	h4 {
		font-size: var(--font);
	}

	.block {
		font-size: var(--font-sm);
	}
</style>
