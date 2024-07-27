<script>
	import { connected, createSocket } from '$lib/services/SocketIOClient.js';
	import LocalizationUICanvas from '$lib/components/LocalizationUICanvas.svelte';
	import ClientList from '$lib/components/ClientList.svelte';
	import LocalizationInfo from '$lib/components/LocalizationInfo.svelte';
	import { onMount } from 'svelte';

	onMount(async () => {
		createSocket();
	});
</script>

<div class="title-wrapper">
	<h1>Rhyality<br> Localization</h1>
</div>

{#if $connected}
	<LocalizationUICanvas />
	<ClientList/>
	<LocalizationInfo/>
{:else}
	<div class="error-wrapper">
		<h1>-.-</h1>
		<p>No Connection</p>
	</div>
{/if}

<style>
	.error-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}

	.error-wrapper h1 {
		font-size: 3rem;
		font-weight: normal !important;
		margin: 0;
	}

	.title-wrapper {
		position: fixed;
		left: 2rem;
		top: 2rem;
	}

	.title-wrapper h1{
		font-size: 1.5rem;
		font-weight: 500;
		margin: 0;
	}
</style>
