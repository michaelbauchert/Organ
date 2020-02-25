<script>
  import Tone from 'tone';
  import OrganStopButton from './OrganStopButton.svelte';

  export let percussion = new Tone.PolySynth(6, Tone.Synth, {
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
  export let percOutput = new Tone.Gain(1);
  let scale = new Tone.ScaleExp();
  let lfo = new Tone.LFO(3, 1, 0).stop().connect(scale);
  lfo.type = "sawtooth80";
  percussion.connect(percOutput);

  //Toggle Repeat
  let repeat = false;
  $: if (repeat) {
    lfo.connect(percOutput.gain).start(0)
    percOutput.gain.rampTo(1);
    percussion.set( {
      "oscillator" : {
        "decay" : 0,
        "sustain" : 1,
        "release" : 0.005
      }
    });
  } else {//reset the envelope decay
    lfo.disconnect().stop(0);
    percussion.set( {
      "oscillator" : {
        "decay" : envelopeDecay / 1000,
        "sustain" : 0,
        "release" : 0
      }
    });
  }//end if else

  function setExponentDecay(event) {
    let value = event.target.value;

    if (value < -9) {
      scale.exponent = Math.abs(value + 9);
    } else {
      scale.exponent = Math.abs(value / 10);
    }
  }//end setExponentDecay

  let envelopeDecay = 10;
  function setEnvelopeDecay(event) {
    envelopeDecay = event.target.value;
    percussion.set( {
      "oscillator" : {
        "decay" : envelopeDecay / 100
      }
    });
  }//end setEnvelopeDecay

  export function playNote(event) {
    console.log("perc attack");
    let note = Tone.Midi(event.detail.pitch).toNote();
    percussion.triggerAttack(note);
    //Tone.Transport.start(0);
  }

  export function stopNote(event) {
    console.log("perc release");
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
        value={Math.floor(volumeSignal.value * 1000)}
        on:ionChange={e =>  volumeSignal.rampTo(e.target.value / 1000)}></ion-range>
    </ion-item>

    <!--Decay Slider-->
    <ion-item>
      <ion-label position="stacked">Decay</ion-label>
      {#if repeat}
        <ion-range
          mode="ios"
          min="-15"
          max="-5"
          value={Math.floor((envelopeDecay - 5) / 295 * 10) - 15}
          on:ionChange={setExponentDecay}></ion-range>
      {:else}
        <ion-range
          mode="ios"
          min="5"
          max="300"
          value={envelopeDecay}
          on:ionChange={setEnvelopeDecay}></ion-range>
      {/if}
    </ion-item>

    <!--Repeat Section-->
    <ion-item lines="none">
      <ion-label>Note Repeat</ion-label>
      <ion-toggle slot="end" mode="md"
        value={repeat}
        on:ionChange={e => repeat = e.target.checked}></ion-toggle>
    </ion-item>
    <ion-item lines="none">
      <ion-label position="stacked">Rate</ion-label>
      <ion-range
        mode="ios"
        min="2" max="15"
        disabled={!repeat}
        value={lfo.frequency.value}
        on:ionChange={ e => lfo.frequency.rampTo(e.target.value) }>
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
