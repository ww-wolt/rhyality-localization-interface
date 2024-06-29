<script>
	import { io } from 'socket.io-client';

	import { onMount } from 'svelte';

	let socket;

	onMount(async () => {
		// const socket = io();
		socket = io('http://localhost:4444/', {
			reconnection: true,
			transports: ['websocket'],
			query: { clientType: 'mobile' },
			reconnectionDelay: 100
		});
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={socket.emit('hello', { hi: 'yo' })}>Say Hello</button>
