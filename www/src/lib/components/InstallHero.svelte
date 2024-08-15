<script lang="ts">
	import { onDestroy } from 'svelte'
	import Copy from './Copy.svelte'

	let hovering = $state(false)
	let variant = $state<'npm' | 'jsr' | 'pnpm'>('npm')

	const interval = setInterval(() => {
		variant = variant === 'npm' ? 'jsr' : variant === 'jsr' ? 'pnpm' : 'npm'
	}, 3000)

	onDestroy(() => clearInterval(interval))
</script>

<section>
	<br />

	<h1 class="hero-text text-gradient-animated">gooey</h1>

	<p class="description">A modern gui library for the web.</p>

	<div class="install-wrapper" onpointerover={() => (hovering = true)} onpointerout={() => (hovering = false)}>
		<code class="install">
			<span>npm i</span>
			&nbsp;
			<span style="color:var(--light-e)">-D</span>
			&nbsp;
			<div class="gooey">gooey</div>
		</code>

		<div class="copy">
			<Copy
				text="npm i -D gooey"
				--dark-active="transparent"
				--dark-hover="transparent"
				--blur="0"
				--width="1.5rem"
				style="box-sizing:border-box;position:absolute;inset:0;margin:0;width:100%;height:100%;outline:1px solid red;"
			/>
		</div>
	</div>
</section>

<style>
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
		/* contain: strict; */
		contain: layout style;

		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;

		width: 21rem;
		height: 4rem;
		max-width: 100%;
		margin: auto;

		border-radius: 0.2rem;
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

		outline: none;
		border-radius: 0.5rem;
		transition: opacity 0.2s;

		font-size: var(--font-md);

		@media (max-width: 600px) {
			gap: 0.5rem;
			white-space: nowrap;
			font-size: min(1.1rem, 3.5vw);
		}

		&::before {
			content: '';
			contain: strict;
			border-radius: inherit;
			width: 101%;
			height: 105%;
			position: absolute;
			inset: unset;
			animation: none;
			background-image: linear-gradient(to right, #111, #111, #222, #292929, #111);
			transition: background-image 0.4s ease-out;
			z-index: -1;
			box-shadow:
				0 3px 5px #0004,
				0 5px 10px #0002,
				0 10px 20px #0001;
		}

		div {
			filter: saturate(0.75);
		}
	}

	.gooey {
		display: inline-block;
		color: var(--theme-a);
	}

	.copy {
		contain: strict;

		position: absolute;
		inset: 0;

		height: 2rem;
		width: 22rem;
		margin: auto;

		color: var(--light-a);
		background: transparent;
		border-radius: 1rem;
		opacity: 0;

		font-family: var(--font-mono);

		backdrop-filter: blur(0px);
		transition:
			opacity 0.2s,
			backdrop-filter 0.2s;

		z-index: 2;
	}

	.install-wrapper:hover {
		code.install {
			background: var(--dark-b);

			div {
				cursor: pointer;
				z-index: 0;
				filter: saturate(1) brightness(0.88);
			}

			&::before {
				background-image: linear-gradient(to right, #111, #222, #292929, #111, #111);
			}
		}

		.copy {
			pointer-events: all;
			opacity: 1;
			z-index: 1;
			backdrop-filter: blur(2px);
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
