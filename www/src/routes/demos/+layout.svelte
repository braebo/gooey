<script lang="ts">
	import { Nav } from '$lib/components/Nav'
</script>

<Nav />

<div class="demo-page">
	<slot />
</div>

<style>
	.demo-page {
		/* overflow: hidden; */
		display: flex;
		min-height: 100vh;
		height: 100%;
	}
	:global(:root[theme='light'] .demo-page) {
		background-image: linear-gradient(75deg, var(--bw), var(--bg-c));
	}

	:global(:root[theme='dark'] .demo-page) {
		background-image: linear-gradient(
			24deg,
			color-mix(in lab, var(--bw), var(--bg-a)) 0%,
			color-mix(in lch, var(--bg-b) 20%, var(--bg-c) 45%)
		);
	}
</style>
