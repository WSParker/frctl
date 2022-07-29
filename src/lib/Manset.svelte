<script>
  import Interface from "./Interface.svelte";
  import _ from "lodash";
  import { state, canvasses } from "./stores.js";
</script>

<div id="manset-container">
  <canvas id="manset" bind:this={$canvasses.manset} />
  <canvas
    id="jPreview"
    class:hide={!$state.params.jPreview || $state.params.julia}
    bind:this={$canvasses.jPreview}
  />
  <Interface />
</div>

<style>
  #manset-container {
    grid-area: 1 / 1 / 1 / 1;
    width: 100%;
    height: 100%;
    display: grid;
    background-color: aqua;
    z-index: 1;
  }
  #manset {
    grid-area: 1 / 1 / 1 / 1;
    width: 100%;
    z-index: 2;
  }
  #jPreview {
    z-index: 2;
    opacity: 0.9;
    grid-area: 1 / 1 / 1 / 1;
    justify-self: start;
    background-color: rgba(0, 0, 0, 0);
    align-self: end;
    width: 40%;
    border: 1px solid hsl(0, 0%, 40%);
    margin: 1%;
    padding: 0px;
  }
  #jPreview.hide {
    opacity: 0;
  }
</style>
