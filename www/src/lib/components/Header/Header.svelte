<script lang="ts">
	import HomeIcon from '$lib/components/Header/HomeIcon.svelte'
	import ThemeSwitch from '../ThemeSwitch.svelte'
	import { page } from '$app/stores'
	import { mobile } from 'fractils'
</script>

<header>
	<div id="home" class="corner" class:active={$page.url.pathname === '/'}>
		<a href="/">
			<HomeIcon />
		</a>
	</div>

	{#if !$mobile}
		<div id="theme" class="corner" class:mobile={$mobile}>
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

	#home {
		position: absolute;
		top: 0.33rem;
		bottom: 0;
		left: 0.66rem;

		margin: auto;

		z-index: 21;

		&.active a {
			color: var(--theme-a);
		}
	}

	#theme {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		z-index: 30;
	}
</style>
