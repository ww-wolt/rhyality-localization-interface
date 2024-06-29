<script>
	import { onMount } from 'svelte';
	// import { p5 } from '$lib/scripts/p5.js';
  import p5 from 'p5';


	const CIRCLE_RADIUS = window.innerWidth * 0.1;
	const WOBBLE_RADIUS = CIRCLE_RADIUS * 3;

	let canvasWrapper;

	onMount(async () => {
		let sketch = function (p5) {
			p5.setup = function () {
				p5.createCanvas(window.innerWidth, window.innerHeight);
				p5.frameRate(30);
			};

			p5.draw = () => {
				p5.drawingContext.shadowOffsetX = 20;
				p5.drawingContext.shadowOffsetY = 20;
				p5.drawingContext.shadowBlur = 200;
				p5.drawingContext.shadowColor = p5.color(108, 0, 246);

				p5.drawingContext.filter = 'blur(2px)';

				let backgroundColor = p5.color(0, 0, 0, 255);
				p5.background(backgroundColor);
				p5.fill(p5.color(108, 0, 246));
				p5.noStroke();
				let xPos = p5.width / 2;
				let yPos = p5.height / 2;

				const POINTS_NUMBER = 200;
				const step = p5.TWO_PI / POINTS_NUMBER;
				let x, y;
				p5.beginShape();
				for (let angle = 0; angle < p5.TWO_PI; angle += step) {
					x = p5.cos(angle);
					y = p5.sin(angle);
					const noise = p5.map(
						p5.noise(x * 0.3 + 1 + p5.frameCount / 500, y * 0.3 + 1 + p5.frameCount / 500),
						0,
						1,
						0,
						WOBBLE_RADIUS
					);
					const point = p5.createVector(x, y).mult(CIRCLE_RADIUS + noise);
					p5.vertex(xPos + point.x, yPos + y + point.y);
				}
				p5.endShape(p5.CLOSE);
			};
		};
		new p5(sketch, canvasWrapper);
	});
</script>

<div bind:this={canvasWrapper} id="canvasWrapper" />

<style>
	div {
		height: 100vh;
		width: 100vh;
		margin: 0 auto;
		text-align: center;
		max-width: 240px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
</style>
