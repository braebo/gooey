<script lang="ts">
	import LogoFull from '$lib/components/graphics/LogoFull.svelte'
</script>

<section>
	<div class="br-md"></div>

	<div class="logo">
		<LogoFull />
	</div>

	<p class="description" id="hero-description">floating gui library for the web</p>
</section>

<style lang="scss">
	.logo {
		width: clamp(10rem, 31rem, calc(100% - 1rem));
		margin: 0 auto;
	}

	#hero-description {
		contain: content;

		margin: 0 auto !important;

		border-radius: var(--radius);

		font-size: 1.25rem;
		font-family: var(--font-a);
		font-variation-settings:
			'wght' 380,
			'wdth' 104;
		word-spacing: 2px;
		white-space: nowrap;
	}

	@media (width < 1000px) {
		#hero-description {
			font-variation-settings:
				'wght' 400,
				'wdth' 110;
			font-size: 1.2rem;
		}
	}
</style>
