<script lang="ts">
	import type { Branch } from '$lib/utils/tree'

	import { isActive } from '$lib/utils/isActive'
	// import PageFill from './PageFill.svelte'
	import { fly } from 'svelte/transition'
	import { page } from '$app/stores'

	let { links, showMenu = $bindable(true) }: { links: Branch[]; showMenu?: boolean } = $props()
</script>

<!-- <PageFill bind:showMenu /> -->

<!-- {#if showMenu} -->
	{#snippet subnav(link: Branch, i = 0, depth = 1)}
		<ul>
			{#each link.children?.filter((c) => !c.name.startsWith('_')) ?? [] as child, j (child.name)}
				<div
					class="li depth-{depth}"
					class:active={isActive(child.name, $page.url.pathname)}
					in:fly={{ y: -10 - 5 * i - j * 2.5 }}
					style:view-transition-name="li-{child.name}"
				>
					<a data-sveltekit-prefetch href={child.path}>
						{child.name}
					</a>
					{@render subnav(child, i, depth + 1)}
				</div>
			{/each}
		</ul>
	{/snippet}

	<nav class="overlay" class:showMenu>
		<ul>
			{#each links ?? [] as link, i (link.name)}
				<div class="li depth-0" in:fly={{ y: -10 - 5 * i }} style:view-transition-name="li-{link.name}">
					<a data-sveltekit-prefetch href={link.path} class:active={isActive(link.name, $page.url.pathname)}>
						{link.name}
					</a>
					{@render subnav(link, i)}
				</div>
			{/each}
		</ul>
	</nav>
<!-- {/if} -->

<style lang="scss">
	@mixin flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	nav.overlay {
		@include flex-center;

		view-transition-name: overlay;

		position: fixed;
		top: 0;
		left: 0;

		width: 100%;
		height: 100%;

		opacity: 0;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(0);
		
		z-index: 100;
		transition: 0.3s cubic-bezier(0.23, 1, 0.320, 1);
		user-select: none;
		pointer-events: none;

		* {
			pointer-events: none;
		}
	}

	nav.overlay.showMenu {
		opacity: 1;
		backdrop-filter: blur(20px);
		// transform: translate(0, 0);
		transform: translate3d(0, 0, 0);
		pointer-events: auto;

		* {
			pointer-events: auto;
		}
	}

	ul {
		@include flex-center;

		margin: auto;
		padding: 0;

		// outline: 1px solid orange;
		width: 100%;
	}

	nav > ul {
		gap: 4rem;
	}
	.li {
		width: 100%;

		// outline: 1px solid green;
		
		transition: 1s cubic-bezier(0.23, 1, 0.320, 1);
		transform: translate(0, 10%);
		opacity: 1;

		@starting-style {
			opacity: 0;
			transform: translate(0, 10%);
		}

		> a {
			font-family: var(--font-a);
			font-size: 1.2rem;
			font-variation-settings:
				'wght' 400,
				'wdth' 110;
			text-transform: capitalize;
		}
	}

	.li.depth-0 {
		// outline: 1px solid red;

		line-height: 3;

		> a {
			font-family: var(--font-b);
			font-size: 2rem;
			font-variation-settings:
				'wght' 900,
				'wdth' 120;
			text-transform: uppercase;
		}
	}

	a {
		// outline: 1px solid blue;
		// outline-offset: -4px;

		display: flex;

		justify-content: center;

		color: currentColor;
		text-decoration: none;
		text-align: center;

		transition: color 0.15s linear;
		pointer-events: all;

		opacity: 0;

		@starting-style {
			opacity: 0;
		}
	}

	nav.overlay.showMenu a {
		opacity: 1;
	}

	a:hover {
		color: var(--theme-a);

		text-decoration: none;
	}

	.active {
		color: var(--theme-a);
	}
</style>
