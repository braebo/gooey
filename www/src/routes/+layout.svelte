<script lang="ts">
	import 'greset/greset.css'

	import Header from '$lib/components/Header/Header.svelte'
	import PageTitle from '$lib/components/PageTitle.svelte'
	import { Fractils } from 'fractils'
	import '../styles/app.scss'
	
	// $inspect(themer.theme)
	
	// import { themer } from '$lib/themer.svelte'
	// Keeps the theme cookie in sync.
	// $: if (browser && $theme !== parse(document.cookie).theme) {
	// 	documthemerookie = `theme=${$theme}`
	// }
</script>

<PageTitle />

<Fractils />

<Header />

<!-- svelte-ignore slot_element_deprecated -->
<slot />
