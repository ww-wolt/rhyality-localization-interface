<script>
	import { connected, createSocket } from '$lib/services/SocketIOClient.js';
	import { io } from 'socket.io-client';
	import LocalizationUICanvas from '$lib/components/LocalizationUICanvas.svelte';
</script>

{#if $connected}
	<LocalizationUICanvas/>
{:else}
	<div class="server-setup">
		<h2>Connect to server</h2>
		<!-- <input type="text" bind:value="{socketServerAdress}" placeholder="Enter server IP address"> -->
		<button on:click={() => createSocket()}>Connect</button>
	</div>
	 
{/if}

<style>
	.server-setup{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		/* gap: 1rem; */
	}

	.server-setup h2{
		margin-bottom: 1rem;
	}

	.server-setup input{
		margin-bottom: 1rem;
	}

	.server-setup button{
		padding: 0.5rem 1rem;
	}
</style>

<!-- <h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={socket.emit('hello', { hi: 'yo' })}>Say Hello</button> -->
