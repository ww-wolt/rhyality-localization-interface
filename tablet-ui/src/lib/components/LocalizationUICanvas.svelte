<script>
	import { onMount } from 'svelte';
	// import { p5 } from '$lib/scripts/p5.js';
	import { sendLocalization } from "$lib/services/SocketIOClient.js"
	import p5 from 'p5';

	const NUM_CIRCLES = 4;
	const CIRCLE_DIAMETER =  0.8;
	const TOUCHPOINT_DIAMETER = 0.1;

	let canvasWrapper;

	let circleDiameter;
	let localizationX = 0, localizationY = 0;
	let centerX, centerY;

	let touched = false;

	onMount(async () => {
		let sketch = function (p5) {

			p5.setup = function () {
				p5.createCanvas(window.innerWidth, window.innerHeight);

				initVariables();

				localizationX = centerX;
				localizationY = centerY;

				// sendLocalizationData();
			};

			function initVariables () {
				circleDiameter = Math.min(window.innerWidth, window.innerHeight) * CIRCLE_DIAMETER
				centerX = p5.width / 2;
				centerY = p5.height / 2;
			}

			p5.draw = () => {
				let backgroundColor = p5.color(0, 0, 0, 255);
				p5.background(backgroundColor);

				p5.noStroke();
				p5.fill(255);
				p5.circle(centerX, centerY, 4);

				for (let i = 0; i < NUM_CIRCLES; i++) {
					p5.stroke(255);
					p5.strokeWeight(1);
					p5.noFill();

					const diameter = circleDiameter * (i + 1) / NUM_CIRCLES;
					p5.circle(centerX, centerY, diameter);
				}

				
				
				if(p5.touches.length > 0){

					// Update localization variables and send data
					localizationX = p5.touches[0].x 
					localizationY = p5.touches[0].y 
					sendLocalizationData();
					touched = true;
				}

				p5.mousePressed = () => {
					localizationX = p5.mouseX;
					localizationY = p5.mouseY;
					sendLocalizationData();
					touched = true;
				}

				p5.mouseDragged = () => {
					localizationX = p5.mouseX;
					localizationY = p5.mouseY;
					sendLocalizationData();
					touched = true;
				}

				// Draw touchpoint circle
				if(touched){
					p5.strokeWeight(4);
					p5.stroke(198, 42, 136);
					p5.fill(198, 42, 136, 127);
					p5.circle(localizationX, localizationY, circleDiameter * 0.1);
				}


			};

			p5.windowResized = () => {
                p5.resizeCanvas(window.innerWidth, window.innerHeight);
				initVariables();
            };

			function sendLocalizationData(){
				// Normalized localization
				const normalizedX = (localizationX - centerX) / (circleDiameter/2);
				const normalizedY = (localizationY - centerY) / (circleDiameter/2);
				sendLocalization(normalizedX, normalizedY);
			}
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
