<script lang="ts">
	import { Nav } from '$lib/components/Nav'
</script>

<Nav />

<div class="anim">
	<div class="slant" />
</div>

<style lang="scss">
	.anim {
		position: relative;
		display: flex;
		place-items: center;
		flex-grow: 1;

		width: 100%;
		margin-top: 50vh;
	}

	.slant {
		position: absolute;
		top: 0;
		bottom: 0;
		left: -50%;

		width: 200%;
		height: min(40vw, 11rem);
		margin: auto;

		background: var(--bg-b);
		background-image: linear-gradient(to right, var(--bw), color-mix(in lch, var(--bg-a), var(--bg-c)));

		clip-path: polygon(0 0, 100% 0, 100% 100%, 0 80%);
		transform: rotate(-5deg);
		z-index: -1;
	}
	:global(:root[theme='light'] .slant) {
		background-image: linear-gradient(to right, var(--bw), color-mix(in lch, var(--bg-a), var(--bg-e)));
	}
</style>
