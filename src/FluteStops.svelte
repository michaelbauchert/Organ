<script>
  import Tone from 'tone';
  import OrganStopButton from './OrganStopButton.svelte';

  export let flutes = new Tone.PolySynth(6, Tone.Synth, {
    oscillator : {
      type : "sine"
    },
    envelope : {
      attack: 0.005,
      decay: 0,
      sustain: 1,
      release: 0.005
    }
  });

  let fluteStops = [{name: '16', active: true},
                    {name: '8', active: false},
                    {name: '5 1/3', active: false},
                    {name: '4', active: false},
                    {name: '2 2/3', active: true},
                    {name: '2', active: false},
                    {name: '1 3/5', active: false},
                    {name: '1 1/3', active: false}];


  $: flutes.set({
  "oscillator" : {
    "partials" : [fluteStops[0].active ? 1 : 0,
                  fluteStops[1].active ? 1 : 0,
                  fluteStops[2].active ? 0.5 : 0,
                  fluteStops[3].active ? 0.25 : 0,
                  fluteStops[4].active ? 0.125 : 0,
                  fluteStops[5].active ? 0.0625 : 0,
                  fluteStops[6].active ? 0.03125 : 0,
                  fluteStops[7].active ? 0.015625 : 0]
    }
  });

  let volumeSignal = new Tone.Signal(0).chain(flutes.volume);

  export function playNote(event) {
    let note = Tone.Midi(event.detail.pitch).toNote();
    flutes.triggerAttack(note);

  }

  export function stopNote(event) {
    let note = Tone.Midi(event.detail.pitch).toNote();
    flutes.triggerRelease(note);
  }
</script>

<ion-card>
  <ion-card-header>
    <ion-card-title >FLUTES</ion-card-title>
  </ion-card-header>
  <ion-card-content>
    {#each fluteStops as stop}
      <OrganStopButton stopType={"flute"} name={stop.name} bind:active={stop.active} />
    {/each}
  </ion-card-content>

  <ion-item lines="none">
    <ion-label position="stacked">Volume</ion-label>
    <ion-range pin mode="ios"
      value={Math.floor(volumeSignal.value * 1000)}
      on:ionChange={e => volumeSignal.rampTo(e.target.value /1000, 0.1)}
    ></ion-range>
  </ion-item>
</ion-card>

<style>
  ion-card-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  ion-card {
    --card-color: var(--ion-color-primary);
    --card-color-shade: var(--ion-color-primary-shade);
    --card-color-tint: var(--ion-color-primary-tint);
    grid-area: flutes;
  }
</style>
