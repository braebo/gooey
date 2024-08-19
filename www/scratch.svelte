<div class="wrapper">
	<div class="left"></div>
	<div class="right">
		{#each Array.from({ length: 50 }) as _, i}
			<div class="content">{i}</div>
		{/each}
	</div>
</div>

<style>
	* {
		box-sizing: border-box;
	}

	.wrapper {
		position: relative;
		display: flex;
		gap: 1rem;

		height: 90vh;
		padding: 1rem;

		border: 2px solid red;
	}

	.left {
		width: 100%;
		height: 10rem;
		border: 2px solid blue;
	}

	.right {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		width: 30rem;
		height: 100%;
		padding: 1rem;

		border: 2px solid green;
		overflow: auto;
	}

	.content {
		min-height: 5rem;
		border: 5px solid #0002;
	}
</style>
