<script lang="ts">
	import { page } from '$app/stores'

	const data = $page.data.routes
</script>

<ul>
	{#each $page.data.routes.filter(r => r.match(/_test/)) as route}
		<li>
			<a href={route}>{route.split('_test').at(-1)?.slice(1)}</a>
		</li>
	{/each}
</ul>

<style lang="scss">
	ul {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		margin: auto;
		padding: 0;

		list-style: none;
		text-align: center;
	}
</style>
