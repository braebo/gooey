<h2 id="installation" class="section-title">Install</h2>

<div class="description">
	<p>
		<span class="gooey">gooey</span>
		is available on both
		<code>NPM</code>
		and
		<code>JSR</code>
		registries via your package manager of choice:
	</p>
</div>

<div class="installation-options">
	<div class="installer">
		<p>NPM</p>
		<code>
			npm i
			<span style:color="var(--light-d)">-D</span>
			<span class="gooey">gooey</span>
		</code>
	</div>

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

	<div class="installer">
		<p>PNPM</p>
		<code>
			pnpm i
			<span style:color="var(--light-d)">-D</span>
			<span class="gooey">gooey</span>
		</code>
	</div>

	<div class="installer">
		<p>Yarn</p>
		<code>
			yarn add
			<span style:color="var(--light-d)">-D</span>
			<span class="gooey">gooey</span>
		</code>
	</div>
</div>

<style>
	.installation-options {
		contain: content;
		display: flex;
		justify-content: center;
		gap: 2rem;
		padding-bottom: 2rem; /* shadows */
	}

	code:not(p code) {
		color: var(--light-c);
		contain: strict;
		font-size: var(--font-sm);
		white-space: '';
		filter: saturate(0.4) brightness(0.9) contrast(1.1);
	}

	p code {
		padding: 0.1rem 0.5rem;
		font-variation-settings:
			'wght' 500,
			'wdth' 110;
	}

	.gooey {
		color: var(--theme-a);
		font-family: var(--font-a);
		font-variation-settings: 'wght' 500;
	}

	p .gooey {
		position: relative;
		display: inline-block;
		transform: translateY(-0.075rem);
	}
</style>
