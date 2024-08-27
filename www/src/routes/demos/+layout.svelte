<script>
	import Nav from '$lib/components/Nav/Nav.svelte'

	const { children } = $props()
</script>

<div class="sidebar-background"></div>

<div class="sidebar">
	<Nav />
</div>

<div class="demo-page">
	{@render children?.()}
</div>

<style>
	.sidebar {
		position: fixed;
		left: 0;
		width: 13rem;
		z-index: 3;
	}

	.sidebar-background {
		transition: 1s cubic-bezier(0, 0.82, 0, 1.08);
	}

	@media (width < 900px) {
		.sidebar-background {
			width: 0%;
		}
	}

	.demo-page {
		display: flex;
		min-height: 100vh;
		height: 100%;
		width: 100%;
	}

	.sidebar-background {
		view-transition-name: sidebar-background;

		position: fixed;
		left: 0;
		top: 0;

		height: 100dvh;
		width: 13rem;

		background: var(--bg-a);
		z-index: 1;

		transform: translateX(0);
		transition: transform 0.3s cubic-bezier(0, 0.82, 0, 1.08);
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
			transform: translateX(-100%);
		}
	}
</style>
