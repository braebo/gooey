<script lang="ts">
	import HomeIcon from '$lib/components/Header/HomeIcon.svelte'
	import ThemeSwitch from '../ThemeSwitch.svelte'
	import { page } from '$app/stores'
	import Nav from './Nav/Nav.svelte'
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

<Nav />

<style lang="scss">
	$padding: 1rem;
	header {
		position: relative;
		height: 3rem;
		
		display: flex;
		justify-content: space-between;
		
		pointer-events: none;
		z-index: 50;
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
		margin: auto;
		left: $padding;

		&.active a {
			color: var(--theme-a);
		}
	}

	#theme {
		position: absolute;
		top: $padding;
		right: $padding;
		z-index: 30;
	}
</style>
