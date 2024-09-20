<script lang="ts">
	import HomeIcon from '$lib/components/Header/HomeIcon.svelte'
	import ThemeSwitch from '../ThemeSwitch.svelte'
	import { device } from '$lib/device.svelte'
</script>

<header>
	<img width="24" height="24" src="/assets/gooey-icon-gradient@512.png" alt="logo" />

	<div id="home" class="corner">
		<a href="/">
			<HomeIcon />
		</a>
	</div>

	{#if !device.mobile}
		<div id="theme" class="corner" class:mobile={device.mobile}>
			<ThemeSwitch />
		</div>
	{/if}
</header>

<style lang="scss">
	$padding: 1rem;
	header {
		position: absolute;
		top: 0;

		display: flex;
		justify-content: space-between;

		width: 100%;
		height: 3rem;

		pointer-events: none;
		z-index: 20;
	}

	.corner {
		position: absolute;

		display: flex;
		position: relative;
		align-items: center;
		justify-content: center;

		pointer-events: auto;
	}

	img {
		position: fixed;
		top: 0.6rem;
		left: 0.5rem;
	}

	#home {
		z-index: 21;

		position: fixed;
		top: 0.7rem;
		left: 2.5rem;

		margin: auto;

		transition: 0.15s cubic-bezier(0.12, 0.69, 0.02, 1.98);
	}

	.hidden {
		transition: 0.15s cubic-bezier(0.12, 0.69, 0.02, 1.98);
		opacity: 0;
		transform: translateX(-0.5rem);
	}

	#theme {
		z-index: 30;

		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
	}
</style>
