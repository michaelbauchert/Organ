<script>
  import Tone from 'tone';
  export let slalomSignal = new Tone.Signal(0);

  let range = 0;
  let timer = 0;
  let direction = -1;//-1 is low to high, 1 is high to low

  $: adjustedRange = range * direction;

  export function startSlalom() {
    if (range !== 0 && timer !== 0) {
      slalomSignal.value = adjustedRange;
      slalomSignal.targetRampTo(0, timer);
    }
  }
</script>

<ion-card>
  <ion-card-header>
    <ion-card-title>SYNTHESLALOM</ion-card-title>
  </ion-card-header>

  <ion-item lines="none">
    <ion-label position="stacked">Range</ion-label>
    <ion-range min="0" max="24" mode="ios"
      snaps
      value={range / 100}
      on:ionChange={e => range = e.target.value * 100}>
    </ion-range>
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Timer</ion-label>
    <ion-range min="0" max="5000" pin mode="ios"
      value={Math.floor(timer * 1000)}
      on:ionChange={e => timer = e.target.value / 1000}>
    </ion-range>
  </ion-item>

  <ion-item lines="none">
    <ion-label>Direction</ion-label>
    <ion-select interface="popover"
      value={(direction === -1) ? "up" : "down"}
      on:ionChange={e => direction = (e.target.value === "up") ? -1 : 1}>
      <ion-select-option value="up">Up</ion-select-option>
      <ion-select-option value="down">Down</ion-select-option>
    </ion-select>
  </ion-item>
</ion-card>


<style>
  ion-card {
    --card-color: var(--ion-color-primary);
    --card-color-shade: var(--ion-color-primary-shade);
    --card-color-tint: var(--ion-color-primary-tint);
    grid-area: slalom;
  }
</style>
