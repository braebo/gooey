<script lang="ts">
	import Info from '$lib/components/Info.svelte'
	import { fly } from 'svelte/transition'

	let target = $state<HTMLElement>()
	let jsrEl = $state<HTMLElement>()
</script>

<h2 id="installation" class="section-title">Install</h2>

<section class="section">
	<div class="description" bind:this={target}>
		<p>
			Install
			<span class="gooey">gooey</span>
			via
			<a href="https://www.npmjs.com/package/gooey" target="_blank" rel="noopener">
				<code>NPM</code>
			</a>
			or

			<a bind:this={jsrEl} id="install_jsr" href="https://jsr.io/@braebo/gooey" target="_blank" rel="noopener">
				<code>JSR</code>
			</a>.
		</p>
	</div>

	<div class="br"></div>

	<div class="installation-options">
		<div class="installers">
			<div class="installer" transition:fly={{ opacity: 1 }}>
				<p>NPM</p>
				<code>
					npm install
					<span class="gooey">gooey</span>
				</code>
			</div>

			<div class="installer">
				<p>JSR</p>
				<code>
					npx jsr add
					<span>
						<span style="color:color-mix(in lch, var(--theme-a), var(--light-e) 25%)">@braebo</span><span
							style="color:color-mix(in lch, var(--theme-a), var(--light-e) 75%)">/</span
						><span class="gooey">gooey</span>
					</span>
				</code>
			</div>
		</div>

		<div class="info">
			{#if jsrEl}
				<Info tooltipText={['more info', 'less info']} target={jsrEl}>
					<p>
						The <span class="gooey">gooey</span> package is available as an ES module (ESM), which is
						compatible with modern bundlers like
						<a href="https://vitejs.dev/" target="_blank" rel="noopener"><code>Vite</code></a>, as well as
						runtimes like
						<a href="https://bun.sh/" target="_blank" rel="noopener"><code>Bun</code></a> and
						<a href="https://deno.com/" target="_blank" rel="noopener"><code>Deno</code></a>. For use in
						environments without a module bundler, the minified CDN build is recommended.
					</p>
				</Info>
			{/if}
		</div>
	</div>
</section>

<style>
	.installation-options {
		display: grid;
		grid: 1/1;
	}

	.info {
		pointer-events: none;
		user-select: none;
	}

	.info,
	.installers {
		grid-area: 1/1;
	}

	.installers {
		contain: content;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0 2rem;

		height: 100%;

		border-radius: var(--radius);

		pointer-events: none;
		user-select: none;
	}

	.installer {
		display: flex;
		align-items: center;
		gap: 1rem;

		width: fit-content;
		height: fit-content;
		padding: 0;
		padding-left: 1rem;
		margin: 0;
		margin-top: 1px;

		outline: 1px solid var(--bg-b);
		border-radius: var(--radius);

		flex-wrap: nowrap;

		* {
			flex-wrap: nowrap;
			white-space: nowrap;
		}

		p {
			margin: 0;
			font-variation-settings:
				'wght' 700,
				'wdth' 120;
		}
	}

	.installers code {
		pointer-events: all;
		user-select: text;
	}

	code:not(p code) {
		background: var(--bg-a);
	}
</style>
