<script>
  import Interface from "./lib/Interface.svelte";
  import { workers, state, canvasses } from "./lib/stores.js";
  let iH, iW;
</script>

<div id="viewport" bind:clientHeight={iH} bind:clientWidth={iW}>
  <div id="content-container" style:width="{iW}px" style:height="{iH}px">
    <canvas id="manset" bind:this={$canvasses.manset} />
    <Interface widthPx={iW} heightPx={iH} />
  </div>
</div>

<style>
  #viewport {
    width: 100%;
    height: 100%;
    background-color: black;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #content-container {
    background-color: black;
    display: grid;
    justify-items: center;
    align-items: center;
  }
  #manset {
    grid-area: 1 / 1 / 1 / 1;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
</style>
