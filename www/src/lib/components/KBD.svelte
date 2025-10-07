<script lang="ts">
	import type { ModifierKey } from '$lib/utils/keys'

	import { getModifierKey } from '$lib/utils/keys'

	let { key } = $props<{ key: ModifierKey }>()

	const keyData = getModifierKey(key)
</script>

<kbd title={keyData.name}>{keyData.key} {keyData.icon}</kbd>

<style>
	kbd {
		display: inline-flex;
		align-items: center;
		justify-content: center;

        vertical-align: middle;

		padding: 0.2em 0.4em;
		margin: 0 0.2em;

		color: var(--fg-a);
		background-color: var(--bg-b);
		border-radius: 3px;
		box-shadow: 0 1px 1px color-mix(in sRGB, var(--dark-b), transparent);

		font-size: var(--font-xs);
		font-weight: 700;
		line-height: 1;
	}
</style>
