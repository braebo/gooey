<script lang="ts">
	import Copy from '../../components/Copy.svelte'

	let hovering = $state(false)
	let phase: 'idle' | 'active' | 'outro' = $state('idle')
	let animating = $derived(phase !== 'idle')
</script>

<section>
	<br />

	<h1 class="hero-text text-gradient-animated">gooey</h1>

	<div class="br-sm"></div>

	<p class="description">A modern gui library for the web.</p>

	<br />

	<div class="install-wrapper" onpointerover={() => (hovering = true)} onpointerout={() => (hovering = false)}>
		<code class="install">
			<span style:color="var(--fg-c)">npm i</span>
			&nbsp;
			<span style="color:var(--fg-e)">-D</span>
			&nbsp;
			<div class="gooey">gooey</div>
		</code>

		<div class="copy" class:animating>
			<Copy
				bind:phase
				text="npm i -D gooey"
				style="box-sizing:border-box;position:absolute;inset:0;margin:0;width:100%;height:100%;"
			/>
		</div>
	</div>
</section>

<style lang="scss">
	.hero-text {
		contain: strict;

		width: 16rem;
		max-width: 100vw;
		height: 7rem;

		margin: 0 auto;
		padding: 0;

		font-size: clamp(4rem, 12vw, 5.5rem);
		font-variation-settings: 'wght' 400;
		white-space: nowrap;
	}

	.description {
		contain: content;
		box-sizing: border-box;
		position: relative;

		max-width: 27rem;
		text-align: center;
		margin: auto;

		border-radius: var(--radius);

		font-size: 1.15rem;
		font-variation-settings: 'wght' 400;
		letter-spacing: 0.3px;
		word-spacing: 2px;
		text-wrap: balance;
	}

	.install-wrapper {
		contain: layout style;

		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;

		height: 4rem;
		max-width: 100%;
		margin: auto;

		border-radius: 0.2rem;

		--blur: 4px;
	}

	code.install {
		contain: size style;

		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;

		width: 16rem;
		height: 1.5rem;
		max-width: 100%;

		background: var(--bg-a);
		outline: none;
		border-radius: 0.5rem;

		font-size: var(--font-md);

		transition: opacity 0.2s;

		@media (max-width: 700px) {
			gap: 0.5rem;
			white-space: nowrap;
			font-size: min(1.1rem, 3.5vw);
		}

		&::before {
			content: '';
			contain: strict;
			position: absolute;
			inset: unset;

			width: 101%;
			height: 105%;
			background-image: linear-gradient(to right, #111, #111, #222, #292929, #111);
			// box-shadow:
			// 	0 3px 5px #0004,
			// 	0 5px 10px #0002,
			// 	0 10px 20px #0001;
			box-shadow: var(--shadow-lg);

			transition: background-image 0.4s ease-out;
			animation: none;
			border-radius: inherit;
			z-index: -1;
		}
	}

	.gooey {
		display: inline-block;
		color: var(--theme-a);
	}

	.install-wrapper:hover .copy {
		pointer-events: all;
		z-index: 1;
		opacity: 1;
		backdrop-filter: blur(var(--blur));
		transition-duration: 0.2s, 0.2s;
		// transition-delay: 0s, 0s;
	}

	:global(:root[theme='light']) {
		.install-wrapper:hover .copy {
			backdrop-filter: blur(var(--blur));
		}
		.copy.animating {
			backdrop-filter: blur(var(--blur));
		}
		code.install::before {
			background-image: linear-gradient(to right, #999, #999, #ccc, #aaa, #999);
		}
	}

	.copy {
		contain: strict;

		position: absolute;
		inset: 0;

		height: 2rem;
		margin: auto;

		color: var(--light-a);
		background: transparent;
		border-radius: 1rem;
		backdrop-filter: blur(0px);
		opacity: 0;

		font-family: var(--font-mono);

		transition-property: opacity, backdrop-filter;
		transition-timing-function: cubic-bezier(0.29, 0.99, 0.45, 1.01);
		transition-duration: 0.5s, 0.5s;
		// transition-delay: 0s, 0.5s;

		z-index: 2;

		&.animating {
			opacity: 1;
			backdrop-filter: blur(var(--blur));
			transition-delay: 0s, 0.5s;

			&:hovering {
				transition-timing-function: ease-out;
				transition-duration: 0.2s, 0.2s;
			}
		}
	}

	:global(.icon.copy:not(.active) .back) {
		transition-duration: 0.5s;
		transition-delay: 0.1s;
		transform: translate(15%, 15%);
	}
	:global(.install-wrapper:hover .icon.copy:not(.active) .back) {
		transform: translate(0, 0) scale(0.9);
	}
</style>
