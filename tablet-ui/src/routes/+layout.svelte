<script>
    import '../app.css';
</script>

<div class="app">
	<main>
		<slot />
	</main>
</div>


<style>
    .app{
        height:100%; 
        overflow:hidden;
        color: white;
    }
</style>