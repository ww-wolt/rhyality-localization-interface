<script>
    import { x, y, angle, radius } from '$lib/services/SocketIOClient.js';
</script>

{#if $x != null && $y != null && $angle != null && $radius != null}
    <div class="wrapper">
        <p>x: {$x.toFixed(2)} &nbsp; y: {$y.toFixed(2)}</p>
        <p>a: {$angle.toFixed(0)}° &nbsp; r: {$radius.toFixed(2)}</p>
    </div>
{/if}



<style>
    .wrapper{
        position: fixed;
        right: 2rem;
        bottom: 2rem;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .wrapper > *{
        margin: 0;
    }
</style>