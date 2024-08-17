<script lang="ts">
	import { Nav } from '$lib/components/Nav'
	// import { page } from '$app/stores'

	const { children } = $props()

	// const isDocsPage = $derived($page.url.pathname.includes('/docs'))
</script>

<div class="sidebar-background"></div>

<div class="docs-page">
	<div class="sidebar">
		<Nav />
	</div>

	{@render children?.()}
</div>

<style lang="scss" global>
	.docs-page {
		display: flex;
		flex-direction: column;

		width: var(--page-width);
		max-width: calc(100% - 2rem);
		margin: 0 auto;

		:global(section.section) {
			box-sizing: border-box;
			padding: 0.5rem 2rem 1rem;
			width: 100%;

			:global(.card) {
				padding: 0 var(--padding-lg);
				background: var(--primary);
				border-radius: var(--radius);
				box-shadow: var(--shadow);
			}
		}

		code:not(p code) {
			color: var(--light-c);
			contain: content;
			font-size: var(--font-sm); 
			white-space: '';
			height: fit-content;
		}

		p code {
			padding: 0.1rem 0.5rem;
		}

		.gooey {
			color: var(--theme-a);
			font-family: var(--font-a);
			font-variation-settings: 'wght' 500;
		}

		p .gooey {
			position: relative;
			display: inline-block;
			transform: translateY(-0.075rem) rotate(-1deg) skew(-1deg) scale(1.1);
			padding-right: 0.1rem;
		}
	}

	.sidebar {
		width: 13rem;
		z-index: 3;
	}

	.sidebar-background {
		view-transition-name: sidebar-background;
		contain: strict;

		position: relative;
		// position: fixed;
		left: 0;
		top: 0;

		height: 100dvh;
		width: 13rem;

		background: var(--bg-a);
		z-index: 1;

		transform: translateX(-100%);
		animation: slide 0.3s cubic-bezier(0, 0.82, 0, 1.08) forwards;

		&::after {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			width: 0.2rem;
			height: 100%;
			background: inherit;
			background-image: linear-gradient(in lab to right, transparent, var(--bg-b) 200%);
			z-index: 2;
		}
	}

	@keyframes slide {
		to {
			transform: translateX(0);
		}
	}
</style>
