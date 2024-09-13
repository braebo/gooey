<script lang="ts">
	import { IMPORT_MODES, importMode } from '../../importMode.svelte'
	import InstallButton from './InstallButton.svelte'
	import Info from '$lib/components/Info.svelte'

	let infoTarget = $state<HTMLElement>()
</script>

<h2 id="install" class="section-title">Install</h2>

<section class="section">
	<div class="installation-options">
		<!-- prettier-ignore -->
		<div class="selectors">
			<div class="description em">Choose your weapon</div>
			<button class="btn selector" class:active={importMode.value === 'JSR'} onclick={() => (importMode.value = 'JSR')}>JSR</button>
			<button class="btn selector" class:active={importMode.value === 'NPM'} onclick={() => (importMode.value = 'NPM')}>NPM</button>
			<button class="btn selector" class:active={importMode.value === 'CDN'} onclick={() => (importMode.value = 'CDN')}>CDN</button>
		</div>

		<div class="installers">
			<div class:active={importMode.value === 'NPM'} class="installer">
				<InstallButton
					tabindex={importMode.value === 'NPM' ? 0 : -1}
					text={`
					<span>npm install </span>
					<span class="gooey">&nbsp;gooey</span>
				`}
					copyText={`npm install gooey`}
					onclick={() => (importMode.value = 'NPM')}
				/>
			</div>
			<div class:active={importMode.value === 'JSR'} class="installer">
				<InstallButton
					tabindex={importMode.value === 'JSR' ? 0 : -1}
					text={`
						npx jsr add
						<span>
							&nbsp;<span style="color:color-mix(in lch, var(--theme-a), var(--light-e) 25%)">@braebo</span><span
								style="color:color-mix(in lch, var(--theme-a), var(--light-e) 75%)"><div
								style="display: inline-block; transform: translateX(2px);">/</span
							><span class="gooey" style="transform: translateX(1px);">gooey</span></div>
						</span>
					`}
					copyText={`npx jsr add @braebo/gooey`}
					onclick={() => (importMode.value = 'JSR')}
				/>
			</div>
			<div class:active={importMode.value === 'CDN'} class="installer">
				<InstallButton
					tabindex={importMode.value === 'CDN' ? 0 : -1}
					text={IMPORT_MODES.CDN.replace('gooey', '<div class="gooey">gooey&nbsp;</div>')}
					copyText={IMPORT_MODES.CDN}
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

<style lang="scss">
	.installation-options {
		display: grid;
		grid: 1/1;
		gap: 2rem;

		// outline: 1px solid red;
	}

	.info {
		pointer-events: none;
		user-select: none;
	}

	.installer,
	.selectors,
	.info {
		grid-area: 1/1;
	}

	.installers {
		position: relative;
		display: grid;
		grid: 1/1;
		place-content: center;

		border-radius: var(--radius);

		user-select: none;
	}

	.installer {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;

		width: fit-content;
		height: fit-content;
		margin: auto;
		gap: 1rem;

		color: var(--light-c);
		outline: 1px solid var(--bg-a);
		outline-offset: -1px;
		border-radius: var(--radius);

		white-space: nowrap;

		backface-visibility: hidden;
		transition: transform 0.6s;
		transform-style: preserve-3d;
		transform: rotateY(120deg);

		&.active {
			transform: rotateY(0deg);
		}

		:global(.gooey) {
			transform: translateY(-0.1rem) rotate(-1deg) skew(-1deg) scale(1.1);
			padding-right: 0.1rem;
			padding-left: 0.2rem;
		}
	}

	.installers {
		perspective: 1000px;
	}

	@keyframes rotateIn {
		from {
			transform: rotateY(120deg);
		}
		to {
			transform: rotateY(0deg);
		}
	}

	@keyframes rotateOut {
		from {
			transform: rotateY(0deg);
		}
		to {
			transform: rotateY(-120deg);
		}
	}

	.installer {
		&.active {
			animation: rotateIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
		}
		&:not(.active) {
			animation: rotateOut 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
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

	.selectors {
		position: relative;
		display: flex;
		gap: 1rem;

		width: 26rem;
		margin: 0 auto;

		.description.em {
			position: absolute;
			left: 0;
			right: 0;
			width: fit-content;
			margin: auto;
			top: -2.5rem;
			color: var(--fg-c);
		}
	}

	button {
		box-sizing: border-box;
		contain: content;

		width: 8rem;
		height: 2.5rem;
		margin: 0;

		color: var(--fg-b);
		border-radius: var(--radius);
		box-shadow: var(--shadow);

		font-variation-settings:
			'wght' 700,
			'wdth' 120;

		transition: background 0.15s;

		&:hover {
			background: color-mix(in lch, var(--bg-c), var(--bg-a) 40%);
			outline: 1px solid var(--fg-d);
		}

		&.active {
			background: color-mix(in lch, var(--bg-c), var(--bg-a) 20%);
			color: var(--fg-a);
			outline: 1px solid color-mix(in lch, var(--theme-a), transparent 50%);
		}
	}

	@media screen and (width < 1000px) {
		.selectors {
			margin-top: 2rem;
			max-width: calc(100vw - 2rem);
		}

		.installers {
			max-width: calc(100vw - 2rem);
		}

		.installer {
			:global(code) {
				min-width: 18rem;
				padding: 0.25rem 0;

				font-size: var(--font-sm);
			}

			:global(.gooey) {
				margin: 0;
				padding: 0;
			}
		}
	}
</style>
