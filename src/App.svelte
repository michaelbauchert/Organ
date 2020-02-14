<script>
  import Tone from 'tone';
  import PercussionStops from './PercussionStops.svelte';
  import FluteStops from './FluteStops.svelte';
  import SpecialEffects from './SpecialEffects.svelte';
  import SyntheSlalom from './SyntheSlalom.svelte';
  import BassSplit from './BassSplit.svelte';
  import {
    onMount
  }
  from 'svelte';

  let flutes;
  let perc;
  let bass;
  let slalom;

  let bassSplit;

  function playNote(event) {
    if (bassSplit && event.detail.pitch < 48) {
      bass.playNote(event);
    } else {
      flutes.playNote(event);
      perc.playNote(event);
    }
  }

  function stopNote(event) {
    if (bassSplit && event.detail.pitch < 48) {
      bass.stopNote(event);
    } else {
      flutes.stopNote(event);
      perc.stopNote(event);
    }
  }

  let slalomSignal;
  let flutesSynth;
  let percSynth;
  let bassSynth;
  $: {
    if (typeof slalomSignal !== 'undefined')
      slalomSignal.fan(flutesSynth.detune, percSynth.detune, bassSynth.detune);
  };

  function flushAll(event) {
    flutesSynth.releaseAll();
    percSynth.releaseAll();
    bassSynth.releaseAll();
  }

  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'hidden') {
      flushAll();
    }
  });
</script>

<svelte:head>
  <script type="module" src="midi-input.js"></script>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js"></script>
  <script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core/css/ionic.bundle.css" />
	<link href="https://fonts.googleapis.com/css?family=Roboto:500,900i&display=swap" rel="stylesheet">

  <style>
    :root {
      --ion-color-primary: #edb3ba;
      --ion-color-primary-rgb: 237, 179, 186;
      --ion-color-primary-contrast: #000000;
      --ion-color-primary-contrast-rgb: 0, 0, 0;
      --ion-color-primary-shade: #d19ea4;
      --ion-color-primary-tint: #efbbc1;
      --ion-color-secondary: #0CFCEB;
      --ion-color-secondary-rgb: 12, 252, 235;
      --ion-color-secondary-contrast: #000000;
      --ion-color-secondary-contrast-rgb: 0, 0, 0;
      --ion-color-secondary-shade: #0bdecf;
      --ion-color-secondary-tint: #24fced;
      --ion-color-tertiary: #DEE8C8;
      --ion-color-tertiary-rgb: 222, 232, 200;
      --ion-color-tertiary-contrast: #000000;
      --ion-color-tertiary-contrast-rgb: 0, 0, 0;
      --ion-color-tertiary-shade: #c3ccb0;
      --ion-color-tertiary-tint: #e1eace;
      --ion-color-success: #10dc60;
      --ion-color-success-rgb: 16, 220, 96;
      --ion-color-success-contrast: #ffffff;
      --ion-color-success-contrast-rgb: 255, 255, 255;
      --ion-color-success-shade: #0ec254;
      --ion-color-success-tint: #28e070;
      --ion-color-warning: #ffce00;
      --ion-color-warning-rgb: 255, 206, 0;
      --ion-color-warning-contrast: #ffffff;
      --ion-color-warning-contrast-rgb: 255, 255, 255;
      --ion-color-warning-shade: #e0b500;
      --ion-color-warning-tint: #ffd31a;
      --ion-color-danger: #f04141;
      --ion-color-danger-rgb: 245, 61, 61;
      --ion-color-danger-contrast: #ffffff;
      --ion-color-danger-contrast-rgb: 255, 255, 255;
      --ion-color-danger-shade: #d33939;
      --ion-color-danger-tint: #f25454;
      --ion-color-dark: #000000;
      --ion-color-dark-rgb: 0, 0, 0;
      --ion-color-dark-contrast: #ffffff;
      --ion-color-dark-contrast-rgb: 255, 255, 255;
      --ion-color-dark-shade: #000000;
      --ion-color-dark-tint: #1a1a1a;
      --ion-color-medium: #29353b;
      --ion-color-medium-rgb: 41, 53, 59;
      --ion-color-medium-contrast: #ffffff;
      --ion-color-medium-contrast-rgb: 255, 255, 255;
      --ion-color-medium-shade: #242f34;
      --ion-color-medium-tint: #3e494f;
      --ion-color-light: #f4f5f8;
      --ion-color-light-rgb: 244, 244, 244;
      --ion-color-light-contrast: #000000;
      --ion-color-light-contrast-rgb: 0, 0, 0;
      --ion-color-light-shade: #d7d8da;
      --ion-color-light-tint: #f5f6f9;

			--ion-font-family: 'Roboto', sans-serif;
    }

		ion-card, ion-select {
			--background: var(--ion-color-medium);
			color: var(--card-color);
		}

		ion-card ion-item {
			--background: var(--ion-color-medium);
			--border-color: var(--ion-color-dark);
		}

		ion-card-title {
			--color: var(--card-color);
			font-family: 'Roboto', sans-serif;
			font-weight: 900;
			font-style: italic;
			font-size: 2.5vmin;
		}

	  ion-range {
	    --bar-background: var(--ion-color-dark);
	    --bar-background-active: var(--card-color-shade);
	    --knob-background: var(--card-color);
	    --pin-color: var(--card-color-tint);
	  }

		ion-toggle {
			--background-checked: var(--card-color-shade);
			--handle-background-checked: var(--card-color-tint);
			--handle-background: var(--card-color-tint);
		}

		ion-label {
			--color: var(--card-color) !important;
		}

    ion-content {
      perspective: 1000px;
    }

    @media only screen and (min-width: 768px) {
      ion-card {
        margin: 0 !important;
      }
      ion-content {
        perspective: 1500px;
      }
    }
  </style>
</svelte:head>




<ion-app>
  <midi-input on:noteon={playNote} on:noteoff={stopNote} on:firston={(slalom.startSlalom)} on:flush={flushAll}></midi-input>
  <ion-content class="ion-justify-content-center ion-wrap" color="dark">
    <div>
      <FluteStops bind:this={flutes} bind:flutes={flutesSynth}/>
      <PercussionStops bind:this={perc} bind:percussion={percSynth}/>
			<BassSplit bind:this={bass} bind:bassSplitState={bassSplit} bind:bass={bassSynth}/>
      <SpecialEffects />
			<SyntheSlalom bind:this={slalom} bind:slalomSignal={slalomSignal}/>
    </div>
  </ion-content>
</ion-app>

<button type="button" name="button" on:click={async ()=> { await Tone.start()}}>Start Audio</button>

<style>
  @media only screen and (min-width: 768px) {
    div {
      margin: 10px;
      display: grid;
      grid-gap: 10px;
      grid-template-areas: 'flutes flutes' 'perc fx' 'bass slalom';
    }
  }

  @media only screen and (min-width: 1200px) {
    div {
      grid-template-areas: 'flutes flutes perc' 'fx bass perc' 'fx bass slalom';
      height: calc(100% - 20px);
    }
  }
</style>
