<script>
	import { clientList } from '$lib/services/SocketIOClient.js';

	$: console.log('clientList:', $clientList);

    function getColorClass(latency) {
        if (latency < 5) {
            return 'green';
        } else if (latency < 10) {
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
                <p>{client.name} &nbsp; <span class={getColorClass(client.latency)}>{client.latency.toFixed(0)} ms</span></p>
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
