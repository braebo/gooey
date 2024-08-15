<!-- title:API -->

<script lang="ts">
	import Doc from '$lib/components/doc/Doc.svelte'

	export let data
</script>

<section>
	{#each data.docs as doc}
		<Doc {doc} />
	{/each}
</section>
