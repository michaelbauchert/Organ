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
  });

  export let strings = new Tone.PolySynth(4, Tone.Synth, {
    oscillator : {
      type : "sawtooth"
    },
    envelope : {
      attack: 0.005,
      decay: 0.01,
      sustain: 0.2,
      release: 0.005
    }
  });

  let mono = false;
  function monoToggle(event) {
    mono = event.target.checked;
    bass.releaseAll();
    strings.releaseAll();
  }

  let volumeBass = new Tone.Signal(0).chain(bass.volume);
  let volumeStrings = new Tone.Signal(0).chain(strings.volume);

  function setAttack(event) {
    bass.set({
      "envelope" : {
        "decay" : event.target.value / 1000
      }
    });

    strings.set({
      "envelope" : {
        "decay" : event.target.value / 1000
      }
    });
  }

  export function playNote(event) {
    let note = Tone.Midi(event.detail.pitch).toNote();
    if(mono) {
      bass.voices[0].triggerAttack(note);
      strings.voices[0].triggerAttack(note);
    } else {
      bass.triggerAttack(note);
      strings.triggerAttack(note);
    }
  }

  export function stopNote(event) {
    let note = Tone.Midi(event.detail.pitch).toNote();
    bass.triggerRelease(note);
    strings.triggerRelease(note);
  }
</script>

<ion-card>

  <ion-item  lines="none">
    <ion-card-title >BASS SPLIT</ion-card-title>
    <ion-toggle slot="end" mode="md" on:ionChange={e => bassSplitState = e.target.checked}></ion-toggle>
  </ion-item>

  <ion-item lines="none">
    <ion-label position="stacked">Bass</ion-label>
    <ion-range mode="ios" disabled={!bassSplitState}
      value={Math.floor(volumeBass.value * 1000)}
      on:ionChange={e => volumeBass.rampTo(e.target.value /1000, 0.1)}>
    </ion-range>
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Strings</ion-label>
    <ion-range mode="ios" disabled={!bassSplitState}
      value={Math.floor(volumeStrings.value * 1000)}
      on:ionChange={e => volumeStrings.rampTo(e.target.value /1000, 0.1)}>
    </ion-range>
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Attack</ion-label>
    <ion-range mode="ios"
    disabled={!bassSplitState}
    min="10"
    max="1000"
    on:ionChange={setAttack}>
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
