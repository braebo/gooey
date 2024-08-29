<script lang="ts">
	// import InstallButton from '$lib/components/InstallButton.svelte'
	import LogoFull from '$lib/components/graphics/LogoFull.svelte'
</script>

<section>
	<div class="br-lg"></div>

	<div class="logo">
		<LogoFull />
	</div>

	<p class="description">gui library for the web</p>

	<!-- <InstallButton /> -->
</section>

<style lang="scss">
	.logo {
		width: clamp(10rem, 42rem, calc(100% - 1rem));
		margin: 0 auto;
	}

	.description {
		contain: content;

		margin: 0 auto;

		border-radius: var(--radius);

		font-size: 1.5rem;
		letter-spacing: 0.3px;
		word-spacing: 2px;
		text-wrap: balance;
		white-space: nowrap;

		font-family: var(--font-a);
		font-variation-settings:
			'wght' 300,
			'wdth' 110;
	}

	@media (width < 1000px) {
		.description {
			font-variation-settings:
				'wght' 400,
				'wdth' 110;
			font-size: 1.2rem;
		}
	}
</style>
