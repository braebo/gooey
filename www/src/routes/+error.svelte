<script lang="ts">
	import { dev } from '$app/environment'
	import { page } from '$app/stores'

	if (dev) console.log($page.error)
</script>

<div class="error-page">
	<h1>{$page.status}</h1>

	<a href={'/' + $page.url.pathname.split('/').at(1)} data-sveltekit-preload-code>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="icon"
		>
			<path d="m15 18-6-6 6-6"></path>
		</svg>
		Go Back
	</a>

	{#if dev}
		<div class="error">
			<pre class="message">{$page.error?.message}</pre>

			{#if $page.error && 'stack' in $page.error}
				<pre class="stack">{$page.error.stack}</pre>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.error-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;

		height: 100vh;
		margin: 0 auto;
	}

	h1 {
		margin: 15vh auto 0;

		color: var(--warn);

		font-size: 10rem;
		font-weight: 100;
	}

	a {
		position: relative;

		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;

		width: fit-content;
		height: fit-content;
		padding: 0.4rem 1.75rem;
		padding-left: 2.25rem;

		color: var(--fg-b);
		background: color-mix(in hsl, var(--bg-a), var(--bg-b) 50%);
		border-radius: 1rem;
		border: 1px solid color-mix(in hsl, var(--bg-a), var(--bg-c) 45%);
		margin: 1rem auto;

		font-family: var(--font-mono);
		font-size: var(--font-md);
		font-variation-settings:
			'wght' 320,
			'wdth' 100;
		transition-duration: 0.15s;

		text-decoration: none !important;

		svg {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0.5rem;

			margin: auto;

			color: var(--bg-b);

			transform: translateX(0) scale(1.1);
			transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		}

		&:hover,
		&:active,
		&:focus-visible {
			color: var(--fg-a);
			border-color: var(--bg-e);

			font-style: bold;
			font-synthesis: style;
			font-weight: 500;
			font-variation-settings:
				'wght' 500,
				'wdth' 100;

			svg {
				color: var(--fg-b);
				transform: scale(0.8) translateX(-0.3rem);
			}
		}

		&:active {
			color: var(--theme-a);
		}
	}

	.error {
		display: flex;
		flex-direction: column;
		align-items: center;

		margin-top: 10vh;
		text-align: center;

		pre {
			max-width: 90vw;

			text-align: left;
			line-height: 1.5rem;
		}

		.message {
			width: max-content;
			height: max-content;
			margin: 1rem auto;
			padding: 0.5rem 1rem;

			color: var(--fg-d);
			border-radius: var(--radius-lg);
		}

		.stack {
			color: color-mix(in hsl, var(--fg-d), transparent 50%);
			max-height: 40vh;
			overflow-y: auto;
		}

		::-webkit-scrollbar {
			background-color: var(--bg-a);
			width: 10px;
			height: 10px;
		}
		::-webkit-scrollbar-thumb {
			background-color: color-mix(in hsl, var(--bg-d), transparent 50%);
			border-radius: 5px;
		}
		::-webkit-scrollbar-track {
			background-color: color-mix(in hsl, var(--bg-d), transparent 10%);
		}
		::-webkit-scrollbar-corner {
			background-color: color-mix(in hsl, var(--bg-d), transparent 10%);
		}
	}
</style>
