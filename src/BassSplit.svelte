<script>
  import Tone from 'tone';
  export let bassSplitState = false;

  export let bass = new Tone.PolySynth(4, Tone.Synth, {
    oscillator : {
      type : "sine"
    },
    envelope : {
      attack: 0.005,
      decay: 0.01,
      sustain: 0.2,
      release: 0.005
    }
  }).toMaster();

  let mono = false;
  function monoToggle(event) {
    mono = event.target.checked;
    bass.releaseAll();
  }

  export function playNote(event) {
    let note = Tone.Midi(event.detail.pitch).toNote();
    if(mono) {
      bass.voices[0].triggerAttack(note);
    } else {
      bass.triggerAttack(note);
    }
  }

  export function stopNote(event) {
    let note = Tone.Midi(event.detail.pitch).toNote();
    bass.triggerRelease(note);
  }
</script>

<ion-card>

  <ion-item  lines="none">
    <ion-card-title >BASS SPLIT</ion-card-title>
    <ion-toggle slot="end" mode="md" on:ionChange={e => bassSplitState = e.target.checked}></ion-toggle>
  </ion-item>

  <ion-item lines="none">
    <ion-label position="stacked">Bass</ion-label>
    <ion-range mode="ios" disabled={!bassSplitState}>
    </ion-range>
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Strings</ion-label>
    <ion-range mode="ios" disabled={!bassSplitState}>
    </ion-range>
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Attack</ion-label>
    <ion-range mode="ios"
    disabled={!bassSplitState}
    min="10"
    max="1000"
    on:ionChange={
      e =>  bass.set({
        "envelope" : {
          "decay" : e.target.value / 1000
        }
      })}>
    </ion-range>
  </ion-item>

  <ion-item lines="none">
    <ion-label>Monophonic</ion-label>
    <ion-toggle slot="end" mode="md"
    disabled={!bassSplitState}
    on:ionChange={monoToggle}></ion-toggle>
  </ion-item>

</ion-card>

<style>
  ion-card {
    --card-color: var(--ion-color-tertiary);
    --card-color-shade: var(--ion-color-tertiary-shade);
    --card-color-tint: var(--ion-color-tertiary-tint);
    grid-area: bass;
  }
</style>
