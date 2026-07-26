<script lang="ts">
	import { installer, INSTALLERS, bundler, jsr } from './installer.svelte'
	import CopyInstallCommand from './CopyInstallCommand.svelte'
	import Info from '$lib/components/Info.svelte'
	import H from '$lib/components/H.svelte'
	import { onMount } from 'svelte'
	import { Gooey } from 'gooey'

	let infoTarget = $state<HTMLElement>()
	let container = $state<HTMLElement>()
	let gooey = $state<Gooey>()
	// let minHeight = $derived(gooey?.elements.container?.clientHeight || 500)

	onMount(() => {
		gooey = new Gooey('choose your weapon', {
			container,
		})
		const installers = gooey.addButtonGrid('', [
			INSTALLERS.map(i => {
				return {
					text: i,
					onClick: () => (installer.current = i),
				}
			}),
		])

		// const bundlerSwitch = gooey.addSwitch('Bundler', bundler.current, {
		// 	onChange: v => (bundler.current = v),
		// 	description: 'Use <code>devDependencies</code> for<br> bundlers like Vite.',
		// })
		// const jsrSwitch = gooey.addSwitch('JSR', jsr.current, { onChange: v => (jsr.current = v) })

		installers.on('click', v => {
			let text = v.button.text
			// bundlerSwitch.disabled = text === 'CDN'
			// jsrSwitch.disabled = text === 'CDN'
			for (const button of options.buttons.values()) {
				button.disabled = text === 'CDN'
				if (button.disabled) button.active = false
			}
		})

		const options = gooey.addButtonGrid(
			'options',
			[
				[
					{ text: 'JSR', onClick: ({ button }) => (jsr.current = button.active) },
					{ text: 'Bundler', onClick: ({ button }) => (bundler.current = button.active) },
				],
			],
			{
				multiple: true,
			},
		)
	})
</script>

<H l="2" id="install">Install</H>

<section class="section">
	<div class="installation-options">
		<!-- <div class="selectors">
			<div id="choose-your-weapon" class="description em">choose your weapon</div>
			{#each INSTALLERS as i}
				<button
					class="btn selector"
					class:active={installer.current === i}
					onclick={() => (installer.current = i)}>{i}</button
				>
			{/each}
		</div> -->

		<div class="gooey-container selectors" bind:this={container} style="min-height: 10rem"></div>

		<!-- TODO Simplified: -->

		<div class="installers">
			{#each INSTALLERS as i}
				{@const active = installer.current === i}

				<div class:active class="installer">
					<CopyInstallCommand installer={i} {active} />
				</div>
			{/each}
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
	#choose-your-weapon {
		font-family: var(--font-a);
		font-variation-settings:
			'wght' 380,
			'wdth' 105;
		font-synthesis: style;
		font-style: oblique 17deg;
	}

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
			transform: translateY(-0.125rem) rotate(-1deg) skew(-1deg) scale(1.05);
			// padding-right: 0.1rem;
			padding: 0 0.33rem;
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
	}
</style>
