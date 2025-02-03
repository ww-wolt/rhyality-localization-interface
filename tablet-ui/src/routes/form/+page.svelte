<script>
    import { connected, createSocket } from '$lib/services/SocketIOClient.js';
	import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import { submitFormData } from "$lib/services/SocketIOClient.js"

	onMount(async () => {
		createSocket();
	});

    let { data } = $props();
    let checked = $state(false);;
    let name = $state('');
    let submitted = $state(false);

    function submitForm() {
        console.log('submitting form');
        data = {name: name};
        submitFormData(data);
        submitted = true;

        setTimeout(() => {
            submitted = false;
            name = '';
            checked = false;
        }, 5000);
    }

</script>


{#if $connected}
    {#if !submitted}
        <div class="container" in:fade={{ duration: 1000 }}>
            <h1>Welcome to Wave-Caster Entertainment™ !</h1>
            <p>To join the beta testing program please fill out the form.</p>
            <form>
                <label for="fname">First Name</label><br>
                <input bind:value={name} type="text" id="fname" name="fname" required><br>
                <div class="checkbox-container">
                    <input type="checkbox" bind:checked={checked} id="terms" required>
                    <label for="terms">I hereby accept and confirm that I have read all <a href="#" style="color: #00d4a9;">terms and conditions</a>.</label>
                </div>
                <button disabled={!(name && checked)} type="submit" class="button" onclick={submitForm}>Enter ➜</button>
                
            </form>
        </div>
    {:else}
        <div class="container2" in:fly={{ y: 200, duration: 2000 }}>
            <img src="/arrow.svg" alt="">
            <h1 in:fly={{ y: 200, duration: 3000 }}>Thank you for being so generous with your data!</h1>
        </div>
    {/if}
    
{:else}
	<div class="error-wrapper">
		<h1>-.-</h1>
		<p>No Connection</p>
	</div>
{/if}



<style>

    .container, .container2 {
        max-width: 500px;
        margin: auto;
        margin-top: 180px;
        font-size: large;
    }

    img {
        width: 50%;
        margin: 0 auto;
        display: block;
    }

    h1 {
        font-size: 3.6rem;
        /* margin-bottom: 10px; */
        line-height: 1.25;
    }
    form {
        margin-top: 30px;
    }
    input[type="text"] {
        width: 100%;
        padding: 10px;
        margin-top: 10px;
        margin-bottom: 5px;
    }
    .checkbox-container {
        display: flex;
        align-items: top;
        justify-content: start;
        margin-top: 10px;
        margin-bottom: 20px;
    }
    input[type="checkbox"] {
        margin-right: 10px;
        margin-left: 0px;
        width: 30px;
        height: 30px;
    }
    .button {
        background-color: #00d4a9;
        color: black;
        padding: 10px 20px;
        border: none;
        cursor: pointer;
        margin-top: 20px;
        display: inline-block;
        border-radius: 5px;
    }
    .button:disabled {
        background-color: grey;
        cursor: not-allowed;
    }
    .button:not(:disabled):active {
        background-color: #008f73;
    }

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
</style>