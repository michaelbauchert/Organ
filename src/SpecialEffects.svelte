<script>
  import Tone from 'tone';

  let chorusState;

  let reverb;
  $: reverbState = (reverb === "off") ? true : false;

  //export let piano = new Tone.PolySynth(6, Tone.Sampler).toMaster();
</script>

<ion-card>
  <ion-card-header>
    <ion-card-title>SPECIAL EFFECTS</ion-card-title>
  </ion-card-header>

  <!--Main Control Section-->
    <ion-item lines="none">
      <ion-label position="stacked">Piano</ion-label>
      <ion-range mode="ios"></ion-range>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">Harpsichord</ion-label>
      <ion-range mode="ios"></ion-range>
    </ion-item>

    <!--Chorus Section-->
    <ion-item lines="none">
      <ion-label slot="start">Chorus</ion-label>
      <ion-toggle slot="end" mode="md"
        on:ionChange={e => chorusState = e.target.checked}></ion-toggle>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">Rate</ion-label>
      <ion-range min="10" max="1000" pin mode="ios"
       disabled={!chorusState}>
      </ion-range>
    </ion-item>

    <!--Reverb Section-->
    <ion-item lines="none">
      <ion-label>Reverb</ion-label>
      <ion-select value="barn" interface="popover"
        on:ionChange={e => reverb = e.target.value}>
        <ion-select-option value="off">Off</ion-select-option>
        <ion-select-option value="barn">The Barn</ion-select-option>
        <ion-select-option value="cathedral">Cathedral</ion-select-option>
        <ion-select-option value="spring">Spring</ion-select-option>
        <ion-select-option value="plate">Plate</ion-select-option>
      </ion-select>
    </ion-item>
    <ion-item lines="none">
      <ion-label position="stacked">Dry/Wet</ion-label>
      <ion-range mode="ios" disabled={reverbState}>
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
