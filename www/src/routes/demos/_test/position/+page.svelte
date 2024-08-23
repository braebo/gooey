<script lang="ts">
	import { place, PLACEMENTS } from '../../../../../../src/shared/place'
	import Gooish from '$lib/components/Gooish.svelte'

	const positions = PLACEMENTS.map((p) => {
		return p
	})
</script>

<section class="section">
	{#each PLACEMENTS as position}
		<!-- <h2>Center</h2> -->

		<div class="container">
			<Gooish {position} storage={false} title={position}>
				<!-- <Gooish.number /> -->
			</Gooish>
		</div>
	{/each}
</section>

<style>
	.section {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		
		/* width: 40rem; */
		min-width: 100vw;
		/* margin: 0; */
	}
	
	.container {
		/* display: flex;
		flex-direction: column;
		align-items: center; */
		
		border-radius: var(--radius-lg);
		height: 25rem;
		width: 40rem;
		/* width: 100%; */
		/* margin: auto; */
	}
</style>
