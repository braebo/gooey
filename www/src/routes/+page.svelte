<script lang="ts">
	import { Nav } from '$lib/components/Nav'
</script>

<Nav />

<div class="anim">
	<div class="slant" />
	<!-- <GooeyAnim /> -->
</div>

<style lang="scss">
	.anim {
		display: flex;
		// align-items: center;
		place-items: center;
		width: 100%;
		margin-top: 50vh;
		// max-height: 50vh;
		flex-grow: 1;
		position: relative;
	}

	.slant {
		position: absolute;
		top: 0;
		bottom: 0;
		margin: auto;
		left: -50%;
		width: 200%;
		height: min(40vw, 11rem);
		transform: rotate(-5deg);
		z-index: -1;
		background: var(--bg-b);
		background-image: linear-gradient(to right, var(--bw), color-mix(in lch, var(--bg-a), var(--bg-c)));
		clip-path: polygon(0 0, 100% 0, 100% 100%, 0 80%);
	}
	:global(:root[theme='light'] .slant) {
		background-image: linear-gradient(to right, var(--bw), color-mix(in lch, var(--bg-a), var(--bg-e)));
	}
</style>
