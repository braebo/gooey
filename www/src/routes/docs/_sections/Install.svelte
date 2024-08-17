<script lang="ts">
	import { fly } from 'svelte/transition'

	type PM = (typeof PMS)[number]
	const PMS = ['npm', 'jsr', 'pnpm', 'yarn'] as const

	let pm: PM = $state('npm')
</script>

<h2 id="installation" class="section-title">Install</h2>

<section class="section">
	<div class="description card">
		<p>
			Install
			<span class="gooey">gooey</span>
			via
			<a href="https://www.npmjs.com/package/gooey" target="_blank" rel="noopener">
				<code>NPM</code>
			</a>
			or

			<a href="https://jsr.io/@braebo/gooey" target="_blank" rel="noopener">
				<code>JSR</code>
			</a>
		</p>
	</div>

	<div class="br"></div>

	<div class="installation-options">
		<!-- {#if pm === 'npm'} -->
		<div class="installer" transition:fly={{ opacity: 1 }}>
			<p>NPM</p>
			<code>
				npm i
				<span style:color="var(--light-d)">-D</span>
				<span class="gooey">gooey</span>
			</code>
		</div>
		<!-- {:else if pm === 'jsr'} -->
		<div class="installer">
			<p>JSR</p>
			<code>
				npx jsr add
				<!-- prettier-ignore -->
				<span>
				<span
                style="color:color-mix(in lch, var(--theme-a), var(--light-e) 25%)">@braebo</span><span
                style="color:color-mix(in lch, var(--theme-a), var(--light-e) 75%)">/</span><span
                class="gooey">gooey</span>
			</span>
			</code>
		</div>
		<!-- {:else if pm === 'pnpm'}
			<div class="installer">
				<p>PNPM</p>
				<code>
					pnpm i
					<span style:color="var(--light-d)">-D</span>
					<span class="gooey">gooey</span>
				</code>
			</div>
		{:else if pm === 'yarn'}
			<div class="installer">
				<p>Yarn</p>
				<code>
					yarn add
					<span style:color="var(--light-d)">-D</span>
					<span class="gooey">gooey</span>
				</code>
			</div>
		{/if} -->
	</div>
</section>

<style>
	.installation-options {
		contain: content;
		display: flex;
		justify-content: center;
		gap: 2rem;
		padding-bottom: 1rem; /* shadows */
		border-radius: var(--radius);
	}

	.installer {
		display: flex;
		align-items: center;
		width: fit-content;
		height: fit-content;
		gap: 1rem;
		/* outline: 1px solid var(--bg-c); */
		outline: 1px solid var(--bg-b);
		padding: 0;
		margin: 0;
		margin-top: 1px;
		border-radius: var(--radius);
		padding-left: 1rem;
		/* background: var(--bg-b); */

		p {
			margin: 0;
			font-variation-settings:
				'wght' 700,
				'wdth' 120;
		}
	}

	code:not(p code) {
		background: var(--bg-a);
	}
</style>
