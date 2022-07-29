<script>
  import Interface from "./lib/Interface.svelte";
  import { showInfo, workers, state, canvasses } from "./lib/stores.js";
  let iH, iW;
</script>

<div id="viewport" bind:clientHeight={iH} bind:clientWidth={iW}>
  <div id="content-container" style:width="{iW}px" style:height="{iH}px">
    <div id="info" class="UI-atom" class:hide={!$showInfo}>
      <h1>Welcome to the fractal explorer!</h1>
      <p>Explore the Mandelbrot and Burning Ship fractals.</p>
      <h4>Tips</h4>
      <ul>
        <li>click the 'j' icon to preview Julia Sets (or press 'j')</li>
        <li>
          shift-click on a point to explore its Julia Set
          <ul>
            <li>on mobile, tap the preview</li>
          </ul>
        </li>
        <li>click on "Mandelbrot" to switch to the Burning Ship fractal</li>
      </ul>
      <hr />
      <div class="col-container">
        <div class="col-2">
          <div>
            <p id="credit">Created by William S. Parker</p>
          </div>
        </div>
        <div class="col-2">
          <button
            type="button"
            on:pointerup={() => {
              $showInfo = false;
            }}>Close</button
          >
        </div>
      </div>
    </div>
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
  #credit {
    font-size: 0.8em;
  }
  hr {
    border: 1px solid black;
  }
  #info {
    grid-area: 1 / 1 / 1 / 1;
    border-radius: 0.9em;
    padding: 1em;
    background-color: hsla(0, 0%, 90%, 0.95);
    text-align: left;
    max-width: 80%;
    z-index: 50;
  }
  .col-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-around;
  }
  .col-2 {
    flex: 50%;
    display: flex;
    justify-content: space-around;
  }
</style>
