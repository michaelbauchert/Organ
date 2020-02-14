<script>
	export let stopType;
	export let name;
	export let active;

	$: id = stopType + "-" + name;

	let x = Math.random() * 100;
	let y = Math.random() * 100;

	$: color = (stopType === "flute") ? "primary" : "secondary";
</script>




<label style="background-position: {x}% {y}% !important;
							background-color: var(--ion-color-{color});" for={id} class:active>
		<p>{name}</p>
</label>
<input type="checkbox" id={id} bind:checked={active}>



<style>
	p {
		color: var(--ion-color-dark);
		font-size: calc(3vmin * var(--mod));
		font-family: 'Roboto', sans-serif;
		font-weight: 900;
	}

	input {
		display: none;
	}

	label {
		--mod: 1;
		cursor: pointer;
		user-select: none;
		transform:rotateX(21deg);
		margin: calc(0.4vmin * var(--mod));
		margin-top: calc(2.5vmin * var(--mod));
		margin-bottom: calc(2.5vmin * var(--mod));
		width: calc(20vmin * var(--mod));
		height: calc(28vmin * var(--mod));
		border-radius: 8% 8% 40% 40%;
		text-align: center;
		padding-top: calc(5vmin * var(--mod));
		position: relative;
		box-shadow: inset 0px -10px 6px 3px rgba(0,0,0,0.30);
		z-index: 2;
		transition: all 0.07s;
	}

	.active {
		z-index: 0;
		transform:rotateX(9deg) translateZ(calc(-3vmin * var(--mod)));
		filter: brightness(0.95);
		box-shadow: inset 0px -3px 5px 3px rgba(0,0,0,0.60);
		background-blend-mode: difference;
		background: white url("../bg.gif") !important;
		filter: saturate(110%);
		background-size: 350% auto;
	}

	label:after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		box-shadow: 0 14px 28px rgba(0,0,0,0.25),
								0 10px 10px rgba(0,0,0,0.22);
		z-index: 1;
		transition: all 0.07s;
	}

	.active:after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
		z-index: 1;
	}

	label, label:after {
		border-radius: 8% 8% 40% 40%;
	}

	@media only screen and (min-width: 768px) {
		label {
			--mod: 0.45;
		}
	}

	@media only screen and (min-width: 1920px) {
		label {
			--mod: 0.7;
		}
	}
</style>
