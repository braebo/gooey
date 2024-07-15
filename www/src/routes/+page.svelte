<script lang="ts">
	import GooeyAnim from '$lib/components/graphics/GooeyAnim.svelte'
</script>

<div class="anim">
	<div class="slant" />
	<GooeyAnim />
</div>

<style lang="scss">
	:global(body) {
		overflow: hidden;
		max-height: 100vh;
	}
	:global(:root[theme='light'] body) {
		background-image: linear-gradient(75deg, var(--bw), var(--bg-c));
	}

	:global(:root[theme='dark'] body) {
		// background-image: linear-gradient(24deg, var(--bw) -51%, color-mix(in lch, var(--bg-b) 15%, var(--bg-c)));
		background-image: linear-gradient(
			24deg,
			color-mix(in lab, var(--bw), var(--bg-a)) 0%,
			color-mix(in lch, var(--bg-b) 20%, var(--bg-c) 45%)
		);
	}

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
