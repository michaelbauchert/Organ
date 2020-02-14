<script>
  import Tone from 'tone';
  import OrganStopButton from './OrganStopButton.svelte';

  export let percussion = new Tone.PolySynth(6, Tone.Synth, {
    oscillator : {
      type : "sine"
    },
    envelope : {
      attack: 0.005,
      decay: 0.1,
      sustain: 0,
      release: 0
    }
  });

  let percussionStops = [{name: '8', active: false},
                         {name: '5 1/3', active: false},
                         {name: '2 2/3', active: false},
                         {name: '2', active: false}];

   $: percussion.set({
   "oscillator" : {
     "partials" : [0,
                   percussionStops[0].active ? 1 : 0,
                   percussionStops[1].active ? 0.5 : 0,
                   0,
                   percussionStops[2].active ? 0.125 : 0,
                   percussionStops[3].active ? 0.0625 : 0]
     }
   });

  let volumeSignal = new Tone.Signal(0).chain(percussion.volume);

  //reapeat dsp
  let gain = new Tone.Gain().toMaster();
  let scale = new Tone.ScaleExp();
  let lfo = new Tone.LFO(3, 1, 0).chain(scale, gain.gain);
  lfo.type = "sawtooth80";
  percussion.connect(gain);

  //Toggle Repeat
  let repeat = false;
  $: {
    percussion.releaseAll();

    if (repeat) {
      lfo.start();
      percussion.set({
        "envelope" : {
          "decay" : 0,
          "sustain": 1,
          "release": 0.005
        }
      });
    } else {
      lfo.stop();
      gain.gain.value = 1;
      percussion.set({
        "envelope" : {
          "sustain" : 0,
          "release" : 0
        }
      });
    }//end if else
  }

  function setDecay(event) {
    let value = event.target.value;

    if (!repeat)
      percussion.set({
        "envelope" : {
          "decay" : value / 1000
      }});

    scale.exponent = ((value - 50) / 250 * 7.25 + 0.75);
  }

  export function playNote(event) {
    let note = Tone.Midi(event.detail.pitch).toNote();
    percussion.triggerAttack(note);
    lfo.restart();
  }

  export function stopNote(event) {
    let note = Tone.Midi(event.detail.pitch).toNote();
    percussion.triggerRelease(note);
  }
</script>

<ion-card>
  <ion-card-header>
    <ion-card-title>PERCUSSION</ion-card-title>
  </ion-card-header>

  <ion-card-content>
    {#each percussionStops as stop}
      <OrganStopButton stopType={"percussion"} name={stop.name} bind:active={stop.active} />
    {/each}
  </ion-card-content>

    <!--Volume Slider-->
    <ion-item lines="none">
      <ion-label position="stacked">Volume</ion-label>
      <ion-range min="0" max="100" pin mode="ios"
        on:ionChange={e =>  volumeSignal.rampTo(e.target.value / 1000)}></ion-range>
    </ion-item>

    <!--Decay Slider-->
    <ion-item>
      <ion-label position="stacked">Decay</ion-label>
      <ion-range
        mode="ios"
        min="50"
        max="300"
        on:ionChange={setDecay}></ion-range>
    </ion-item>

    <!--Repeat Section-->
    <ion-item lines="none">
      <ion-label>Note Repeat</ion-label>
      <ion-toggle slot="end" mode="md" on:ionChange={e => repeat = e.target.checked}></ion-toggle>
    </ion-item>
    <ion-item lines="none">
      <ion-label position="stacked">Rate</ion-label>
      <ion-range
        mode="ios"
        min="200" max="1500" step="25"
        disabled={!repeat}
        on:ionChange={ e => lfo.frequency.rampTo(e.target.value / 100) }>
      </ion-range>
    </ion-item>

</ion-card>

<style>
  ion-card-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  ion-card {
    --card-color: var(--ion-color-secondary);
    --card-color-shade: var(--ion-color-secondary-shade);
    --card-color-tint: var(--ion-color-secondary-shade);
    grid-area: perc;
  }
</style>
