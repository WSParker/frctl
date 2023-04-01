<script>
    import Interface from "./lib/Interface.svelte";
    import { showInfo, canvasses } from "./lib/stores.js";
    let iH, iW;
    const imgUrl = new URL("./lib/icons/julia_inverted.svg", import.meta.url)
        .href;
</script>

<div id="viewport" bind:clientHeight={iH} bind:clientWidth={iW}>
    <div id="content-container" style:width="{iW}px" style:height="{iH}px">
        <div id="info" class="UI-atom" class:hide={!$showInfo}>
            <h1>Welcome to frctl!</h1>
            <p>Explore the Mandelbrot and Burning Ship fractals.</p>
            <table>
                <tr>
                    <th />
                    <th>Touchscreen</th>
                    <th>Keyboard</th>
                </tr>
                <tr>
                    <th>Move around</th>
                    <td>Touch and drag</td>
                    <td>Click and drag</td>
                </tr>
                <tr>
                    <th>Zoom in/out</th>
                    <td>Pinch</td>
                    <td>Scroll</td>
                </tr>
                <th>Preview Julia Set</th>
                <td
                    >Click <img
                        src="$imgUrl"
                        alt="Julia Icon"
                        width="16px"
                    /></td
                >
                <td>Press <code>J</code></td>
                <tr />
                <tr>
                    <th>Explore Julia Set</th>
                    <td>Click on its preview</td>
                    <td><code>Shift-click</code> on a point</td>
                </tr>
            </table>
            <h4>Tips</h4>
            <ul>
                <li>Lower the resolution for faster response.</li>
                <li>Increase the detail at high zooms.</li>
                <li>
                    Switch between the Mandelbrot and Burning Ship fractals by
                    clicking the button that says either "Mandelbrot" or
                    "Burning Ship".
                </li>
                <li>
                    Click shuffle to cycle through some interesting spots in
                    each.
                </li>
                <li>Click the crosshairs to re-center.</li>
                <li>Click the download button to save an image.</li>
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
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 2px;
    }
    td,
    th {
        border: 1px solid black;
        text-align: left;
        padding: 4px;
    }
    #info {
        grid-area: 1 / 1 / 1 / 1;
        border-radius: 0.9em;
        padding: 1em;
        background-color: hsla(0, 0%, 90%, 0.95);
        text-align: left;
        max-width: min(500px, 80%);
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
