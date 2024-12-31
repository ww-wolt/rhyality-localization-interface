<script>
    import '../app.css';
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children } = $props();
</script>

<div class="app">
	<main>
		{@render children?.()}
	</main>
</div>


<style>
    .app{
        height:100%; 
        overflow:hidden;
        color: white;
        font-weight: 500;
    }
</style>