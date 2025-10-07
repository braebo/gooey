<script lang="ts" module>
	export type Prop = {
		name: string
		description: string
		default?: string
	}
</script>

<script lang="ts">
	const { props }: { props: Prop[] } = $props()

	function parseBackticks(str: string) {
		return str.replace(/`([^`\n]+)`/g, '<code>$1</code>')
	}

	function parseEm(str: string) {
		return str.replace(/\b_([^_\n]+)_\b/g, '<em>$1</em>')
	}

	function parse(str: string) {
		return parseEm(parseBackticks(str))
	}
</script>

<ul class="props">
	{#each props as prop}
		{@const padding = Array.from({ length: Math.max(0, 8 - prop.name.length) }, () => '&nbsp;').join('')}
		<li>
			<!-- <code>{prop.name}</code> &nbsp; {@html parse(prop.description)} -->
			<!-- <code>{prop.name}</code> &nbsp;&nbsp;<span class="sep">|</span>&nbsp; {@html parse(prop.description)} -->
			<span class="name"><code class="name">{prop.name}</code>{@html padding}</span><span class="sep">|</span
			>&nbsp; {@html parse(prop.description)}
			{#if prop.default}
				<ul>
					<li class="default">
						<!-- <div class="default">@default <span class="sep">|</span>&nbsp;</div> -->
						<div class="default">@default&nbsp;</div>
						{@html parse(prop.default)}
					</li>
				</ul>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.props {
		list-style-type: none;
		padding-left: 0;
	}

	.props li:not(:last-of-type) {
		margin-bottom: 0.75rem;
	}

	.props ul {
		list-style-type: none;
		padding-left: 1rem;
		li {
			margin-left: 0;
		}
	}

	li {
		font-size: var(--font-sm);
	}

	li.default {
		color: var(--fg-b);

		font-size: var(--font-xs);

		div.default {
			color: var(--fg-c);

			font-style: normal;
			font-synthesis: none;

			font-family: var(--font-code);
			font-variation-settings:
				'wdth' 100,
				'wght' 500;

			/* font-family: var(--font-a);
			font-variation-settings:
				'wdth' 100,
				'wght' 500; */
			/* font-size: var(--font); */
		}

		:global(code:not(.default)) {
			color: var(--fg-b);
			background: var(--bg-b);
			outline: 0.5px solid var(--bg-c);
			box-shadow: none;

			font-synthesis: none;
			font-variation-settings: 'wght' 500;

			font-family: var(--font-code);
			font-variation-settings: 'wght' 400;
			font-size: var(--font-xxs);
		}
	}

	.name:not(code) {
		font-family: var(--font-mono);
	}

	span.sep {
		display: inline-block;

		color: var(--bg-c) !important;

		font-variation-settings: 'wght' 300;

		scale: 1 1.5;
	}

	.default {
		display: inline-block;

		color: var(--theme-a);
		color: var(--fg-b);
		background: none;
		box-shadow: none;
	}

	.props ul li {
		font-family: var(--font-mono);
		/* font-family: var(--font-code); */
		font-size: var(--font-xs);
	}
</style>
