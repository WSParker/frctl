<script>
  export let hide;
  export let jPreview = null;
</script>

<canvas
  id="jPreview"
  class:hide
  style:opacity={hide ? 0 : 0.9}
  bind:this={jPreview}
/>

<style>
  #jPreview {
    z-index: 2;
    grid-area: 1 / 1 / 1 / 1;
    justify-self: start;
    background-color: rgba(0, 0, 0, 0);
    align-self: end;
    /* width: 40%; */
    border: 1px solid hsl(0, 0%, 40%);
    margin: 1%;
  }
</style>
