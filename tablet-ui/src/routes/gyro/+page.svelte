<!-- <svelte:head>
    <script src="/NexusUI.js"></script>
</svelte:head> -->

<script>
	import { onMount } from 'svelte';
    import { handleGyroActivationClick, SensorAccess , OrientationData} from "$lib/services/GyroHandler";

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();

    $inspect("SensorAccess", $SensorAccess);
    $inspect("OrientationData", $OrientationData);

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    onMount(async () => {
        await loadScript('/NexusUI.js');
        // var dial = new Nexus.Dial('#dial')
        const slider = new Nexus.Slider('#slider',{
            'size': [50,400],
            'mode': 'relative',  // 'relative' or 'absolute'
            'min': 0,
            'max': 1,
            'step': 0,
            'value': 0
        })
    });
    
</script>


<div class="flex-container">
    <h1>Gyro</h1>
    {#if $SensorAccess}
        <div id="slider"></div>
        <p>Sensor Acess: {JSON.stringify($SensorAccess)} Orientation Data: {JSON.stringify($OrientationData)}</p>
    {:else if $SensorAccess === false}
        <p>No Gyroscope Data available</p>
    {:else}
        <button onclick={handleGyroActivationClick}>Activate Gyroscope</button>
    {/if}

    
    
</div>

<style>
    .flex-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    p {
        width: 100vw;
        text-align: center;
    }
</style>
