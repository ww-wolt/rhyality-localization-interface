<script>
	
    const LATENCY_GOOD_THRESHOLD = 5;
    const LATENCY_OK_THRESHOLD = 10;
    
    import { clientList } from '$lib/services/SocketIOClient.js';

    function getColorClass(latency) {
        latency = Math.round(latency);
        if (latency <= LATENCY_GOOD_THRESHOLD) {
            return 'green';
        } else if (latency <= LATENCY_OK_THRESHOLD) {
            return 'orange';
        } else {
            return 'red';
        }
    }
</script>


<div class="wrapper">

    {#if $clientList.length > 0}
        <p>Clients</p>
        <div class="list">
            {#each $clientList as client}
                <p>{client.name} &nbsp; <span class={getColorClass(client.latency)}>{ Math.round(client.latency)} ms</span></p>
            {/each}
        </div>
    {/if}
</div>

<style>
	.wrapper {
		position: fixed;
		left: 2rem;
		bottom: 2rem;
	}

	.list > * {
		margin: 0;
	}

    .green {
        color: #08C4A1;
    }

    .orange {
        color: #FFBB38;
    }

    .red {
        color: #FF003D;
    }
</style>
