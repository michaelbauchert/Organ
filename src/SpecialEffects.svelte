<script>
  import Tone from 'tone';

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  Scale detune from cents to 0.5 to to 2
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  export let detune = new Tone.Signal(0, Tone.Type.Cents);

  let normalizeUpper = new Tone.Normalize(0, 2400);
  let scaleUpper = new Tone.Scale(0, 1);
  normalizeUpper.connect(scaleUpper);

  let normalizeLower = new Tone.Normalize(-2400, 0);
  let scaleLower = new Tone.Scale(0.5, 1);
  normalizeLower.connect(scaleLower);

  let add = new Tone.Add();

  detune.fan(normalizeUpper, normalizeLower);

  scaleUpper.connect(add, 0, 0);
  scaleLower.connect(add, 0, 1);

  //overwrite Tone.Sampler's triggerAttack
  Tone.Sampler.prototype.triggerAttack = function(notes, time, velocity) {
    this.log("triggerAttack", notes, time, velocity);
    if (!Array.isArray(notes)) {
      notes = [notes];
    }
    for (var i = 0; i < notes.length; i++) {
      var midi = Tone.Frequency(notes[i]).toMidi();
      // find the closest note pitch
      var difference = this._findClosest(midi);
      var closestNote = midi - difference;
      var buffer = this._buffers.get(closestNote);
      var playbackRate = Tone.intervalToFrequencyRatio(difference);
      // play that note
      var source = new Tone.BufferSource({
        "buffer": buffer,
        "playbackRate": playbackRate,
        "fadeIn": this.attack,
        "fadeOut": this.release,
        "curve": this.curve,
      }).connect(this.output);
      var detune = new Tone.Multiply(playbackRate).connect(source.playbackRate);
      add.connect(detune);
      source.start(time, 0, buffer.duration / playbackRate, velocity);
      // add it to the active sources
      if (!Tone.isArray(this._activeSources[midi])) {
        this._activeSources[midi] = [];
      }
      this._activeSources[midi].push(source);

      //remove it when it's done
      source.onended = function() {
        if (this._activeSources && this._activeSources[midi]) {
          var index = this._activeSources[midi].indexOf(source);
          if (index !== -1) {
            this._activeSources[midi].splice(index, 1);
            detune.dispose();
          }
        }
      }.bind(this);
    }
    return this;
  };

  export let piano = new Tone.Sampler({
    "C1": "../piano/C0-poff.mp3",
    "C3": "../piano/C2-poff.mp3",
    "C4": "../piano/C3-poff.mp3",
    "C5": "../piano/C4-poff.mp3",
    "C6": "../piano/C5-poff.mp3",
  });

  export let harpsichord = new Tone.Sampler({
    "B1": "../harpsichord/13-C1.mp3",
    "B2": "../harpsichord/25-C2.mp3",
    "B3": "../harpsichord/37-C3.mp3",
    "B4": "../harpsichord/49-C4.mp3",
    "B5": "../harpsichord/61-C5.mp3",
  });

  let pianoVolume = new Tone.Signal(0).chain(piano.volume);
  let harpsichordVolume = new Tone.Signal(0).chain(harpsichord.volume);

  export function playNote(event) {
    let note = Tone.Midi(event.detail.pitch).toNote();
    piano.triggerAttack(note);
    harpsichord.triggerAttack(note);
  }

  export function stopNote(event) {
    let note = Tone.Midi(event.detail.pitch).toNote();
    piano.triggerRelease(note);
    harpsichord.triggerRelease(note);
  }


  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  Vibrato
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  export const vibrato = new Tone.Vibrato(5, 0.15);
  let vibratoState;
  $: {
    vibrato.wet.rampTo(vibratoState ? 0.7 : 0);
  }


  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  Reverb
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let reverb = new Tone.Convolver ( "../reverb/The Barn.wav").toMaster();
  let currentBuffer = "The Barn";

  let reverbValue = "off";
  $: reverbState = (reverbValue === "off") ? true : false;
  $: {
    if(reverbValue !== "off" && currentBuffer !== reverbValue) {
      vibrato.disconnect().chain(reverb, Tone.Master);
      reverb.load(`../reverb/${reverbValue}.wav`);
      currentBuffer = reverbValue;
    } else if (reverbValue === "off") {
      vibrato.disconnect().toMaster();
      reverb.disconnect();
    } else {
      vibrato.disconnect().chain(reverb, Tone.Master);
    }
  }

  vibrato.chain(reverb);
</script>

<ion-card>
  <ion-card-header>
    <ion-card-title>SPECIAL EFFECTS</ion-card-title>
  </ion-card-header>

  <!--Main Control Section-->
  <ion-item lines="none">
    <ion-label position="stacked">Piano</ion-label>
    <ion-range mode="ios"
      value={Math.floor(pianoVolume.value * 100)}
      on:ionChange={e => pianoVolume.rampTo(e.target.value / 100, 0.1)}
    ></ion-range>
  </ion-item>
  <ion-item>
    <ion-label position="stacked">Harpsichord</ion-label>
    <ion-range mode="ios"
      value={Math.floor(harpsichordVolume.value * 900)}
      on:ionChange={e => harpsichordVolume.rampTo(e.target.value / 900, 0.1)}
    ></ion-range>
  </ion-item>

  <!--Chorus Section-->
  <ion-item lines="none">
    <ion-label slot="start">Vibrato</ion-label>
    <ion-toggle slot="end" mode="md"
      checked={vibratoState}
      on:ionChange={e=> vibratoState = e.target.checked}></ion-toggle>
  </ion-item>
  <ion-item>
    <ion-label position="stacked">Rate</ion-label>
    <ion-range min="1" max="8" pin mode="ios"
      disabled={!vibratoState}
      value={vibrato.frequency.value}
      on:ionChange={e => vibrato.frequency.rampTo(e.target.value)}>
    </ion-range>
  </ion-item>

  <!--Reverb Section-->
  <ion-item lines="none">
    <ion-label>Reverb</ion-label>
    <ion-select value={reverbValue} interface="popover" on:ionChange={e=> reverbValue = e.target.value}>
      <ion-select-option value="off">Off</ion-select-option>
      <ion-select-option value="The Barn">The Barn</ion-select-option>
      <ion-select-option value="Cathedral (Large)">Cathedral (Large)</ion-select-option>
      <ion-select-option value="Cathedral (Small)">Cathedral (Small)</ion-select-option>
      <ion-select-option value="Spring">Spring</ion-select-option>
    </ion-select>
  </ion-item>
  <ion-item lines="none">
    <ion-label position="stacked">Dry/Wet</ion-label>
    <ion-range mode="ios" disabled={reverbState}
      value={Math.floor(reverb.wet.value * 100)}
      on:ionChange={e => reverb.wet.rampTo(e.target.value / 100)}>
    </ion-range>
  </ion-item>

</ion-card>

<style>
  ion-card {
    --card-color: var(--ion-color-secondary);
    --card-color-shade: var(--ion-color-secondary-shade);
    --card-color-tint: var(--ion-color-secondary-tint);
    grid-area: fx;
  }
</style>
