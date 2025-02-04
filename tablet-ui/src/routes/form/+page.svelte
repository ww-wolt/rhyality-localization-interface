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
            <div>
                <img src="/finalLogo_Black.png" alt="" class="logo">
            </div>
            <h1>Welcome to Wave-Caster Entertainment™Labs!</h1>
            <p>To sign up for the beta testing program please fill out the form, and read our terms & conditions.</p>
            <form>
                <label for="fname">First Name(Username?)</label><br>
                <input bind:value={name} type="text" id="fname" name="fname" required><br>
                <div class="checkbox-container">
                    <input type="checkbox" bind:checked={checked} id="terms" required>
                    <label for="terms">I hereby confirm that I have read, understood and accepted <a href="#" style="color: #00d4a9;">the terms and conditions</a>.</label>
                </div>
                <button disabled={!(name && checked)} type="submit" class="button" onclick={submitForm}>Sign up ➜</button>
                
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

@font-face {
    font-family: "Univers";
    src: url("/fonts/UniversRegular.ttf");
    font-style: normal;
    font-weight:normal;
}

@font-face {
    font-family: "Univers";
    src: url("/fonts/UniversBold.ttf");
    font-style:normal;
    font-weight:bold;
}
 
 

    .container, .container2 {
        max-width: 500px;
        margin: auto;
        margin-top: 80px;
        font-size: large;
    }

    img {
        width: 50%;
        margin: 0 auto;
        display: block;
    }
    
    .logo {
      width:15%;
      margin: 0 auto;
      margin-bottom: 130px;
    }

    h1 {
        font-size: 2rem;
        /* margin-bottom: 10px; */
        line-height: 1.25;
        font-family:"Univers";
        margin-bottom:60px;
    }

    p {
        font-family:"Univers";
        font-weight:normal;
        font-size: 1rem;
        margin-bottom:90px;
    }

    form {
        font-family:"Univers";
        font-size: 1rem;
        font-weight:normal;
        margin-top: 30px;
    }
    input[type="text"] {
        width: 90%;
        height:1rem;
        font-size:1rem;
        padding: 10px;
        margin-top: 10px;
        margin-bottom: 5px;
        background-color: rgb(23, 23, 23);
        border-radius: 5px;
        border:none;
        color:white;
    }
    .checkbox-container {
        display: flex;
        align-items: top;
        justify-content: start;
        margin-top: 60px;
        margin-bottom: 20px;
    }
    input[type="checkbox"] {
        margin-right: 10px;
        margin-left: 0px;
        width: 25px;
        height: 25px;
        accent-color:  #00d4a9;
        background-color: rgb(23, 23, 23);
       
        
       
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