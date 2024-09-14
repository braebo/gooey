<script lang="ts">
	import { IMPORT_MODES, importMode } from '../../importMode.svelte'
	import InstallButton from './InstallButton.svelte'
	import Info from '$lib/components/Info.svelte'
	import { fly } from 'svelte/transition'

	let infoTarget = $state<HTMLElement>()

	const tooltipOptions = { placement: 'bottom' as const, offsetY: '-5px', delay: 500 }
</script>

<h2 id="install" class="section-title">Install</h2>

<section class="section">
	<div class="installation-options">
		<div class="installers">
			<div class="installer" transition:fly={{ opacity: 1 }}>
				<p>NPM</p>

				<InstallButton
					text={`
					<span>npm install </span>
					<span class="gooey">&nbsp;gooey</span>
				`}
					copyText={`npm install gooey`}
					onclick={() => (importMode.value = 'NPM')}
				/>
			</div>

			<div class="installer" transition:fly={{ opacity: 1 }}>
				<p>JSR</p>

				<InstallButton
					text={`
						npx jsr add
						<span>
							&nbsp;<span style="color:color-mix(in lch, var(--theme-a), var(--light-e) 25%)">@braebo</span><span
								style="color:color-mix(in lch, var(--theme-a), var(--light-e) 75%)"><div
								style="display: inline-block; transform: translateX(2px);">/</span
							><span class="gooey" style="transform: translateX(1px);">gooey</span></div>
						</span>
					`}
					{tooltipOptions}
					copyText={`npx jsr add @braebo/gooey`}
					onclick={() => (importMode.value = 'JSR')}
				/>
			</div>

			<div class="installer" transition:fly={{ opacity: 1 }}>
				<p>CDN</p>

				<InstallButton
					text={`</div><span style="color: var(--fg-d);">${IMPORT_MODES.CDN}</span>`}
					copyText={`${IMPORT_MODES.CDN}`}
					onclick={() => (importMode.value = 'CDN')}
				/>
			</div>
		</div>

		<div class="info">
			{#if infoTarget}
				<Info tooltipText={['more info', 'less info']} target={infoTarget}>
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
		display: flex;
		gap: 1rem;

		justify-content: center;
		align-items: center;
		flex-wrap: wrap;

		width: fit-content;
		height: 100%;
		margin: auto;

		border-radius: var(--radius);

		user-select: none;
	}

	.installer {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;

		width: fit-content;
		height: fit-content;
		padding-left: 1rem;
		gap: 1rem;
		
		color: var(--fg-c);
		outline: 1px solid var(--bg-a);
		outline-offset: -1px;
		border-radius: var(--radius);

		white-space: nowrap;

		p {
			min-width: 2.5rem;
			margin: 0;

			color: var(--fg-a);

			font-variation-settings:
				'wght' 500,
				'wdth' 120;
		}
	}

	.installers :global(code) {
		max-width: 100%;

		padding: 0.5rem 1rem;

		font-family: var(--font-mono);
		font-variation-settings:
			'wght' 600,
			'wdth' 100;

		pointer-events: all;
		user-select: text;
	}

	code:not(p code) {
		background: var(--bg-a);
	}

	@media screen and (width < 1000px) {
		.installers {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 1rem;

			padding: 0;
		}

		.installer {
			gap: 1rem;

			width: fit-content;
			padding: none;

			:global(code) {
				min-width: 18rem;
				padding: 0.25rem 0;

				font-size: var(--font-sm);
			}
		}
	}
</style>
