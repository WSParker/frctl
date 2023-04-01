<script>
    import { element, onMount } from "svelte/internal";
    import {
        showInfo,
        state,
        shufflePoints,
        canvasses,
        workers,
    } from "./stores.js";
    import { createEventDispatcher } from "svelte";
    import {
        asdf,
        renderFlex,
        initializeJulia,
        updateMouse,
    } from "./functions.js";
    const dispatch = createEventDispatcher();

    function parameterChange() {
        dispatch("parameterChange");
    }

    const xResMin = 128;
    let xResMax = window.innerWidth;
    const iterLimMin = 4,
        iterLimMax = 2048;
    $: $state.params.xres = Math.floor(
        xResMin + (resolution / 101) * (xResMax - xResMin)
    );
    $: $state.params.maxiter = Math.floor(
        iterLimMin + (iterLim / 101) * (iterLimMax - iterLimMin)
    );
    let resolution = 100;
    let iterLim = (100 / 2048) * 284;
    let separation = "0.25em";
    let w;
    let md = false;
    let mouseTarget;
    let settingsOpen = false;

    let handlers = {
        "res-touch": sliderUpHandler,
        "iter-touch": sliderUpHandler,
        "wf-touch": wfUpHandler,
        "toggle-touch": toggleUpHandler,
        "julia-touch": juliaUpHandler,
        "download-touch": downloadUpHandler,
        "center-touch": centerUpHandler,
        "shuffle-touch": shuffleUpHandler,
        "info-touch": infoUpHandler,
        "escape-julia": escUpHandler,
        "jPreview-touch": jPreviewUpHandler,
    };

    function jPreviewUpHandler(e) {
        if (!$state.mouse.moved) {
            let action = e.touches?.length < 1 ? goToJulia : () => {};
            action(e);
        }
    }
    function goToJulia(e) {
        let rect = $canvasses.manset.getBoundingClientRect();
        $state = initializeJulia($state, rect);
        $workers.finalworker?.terminate();
        $workers.finalworker = new Worker("/mainworker.js");
        renderFlex($workers.finalworker, $canvasses.manset, $state);
    }

    function sliderMove(e) {
        let rect = mouseTarget.getBoundingClientRect();
        let clientX = e.clientX ?? e.touches.item(0).clientX;
        let position = Math.max(
            Math.min(
                ((clientX - rect.left) / (rect.right - rect.left)) * 100,
                101
            ),
            0
        );
        return position;
    }
    function mouseDownHandler(e) {
        md = true;
        mouseTarget = e.target;
        if (mouseTarget.classList.contains("slider-touch")) {
            mouseMoveHandler(e);
        }
    }
    function mouseMoveHandler(e) {
        $state.mouse.moved = true;
        if (mouseTarget.id == "res-touch") {
            resolution = sliderMove(e);
        } else if (mouseTarget.id == "iter-touch") {
            iterLim = sliderMove(e);
        }
    }
    function escUpHandler(e) {
        window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
    }
    function sliderUpHandler(e) {
        parameterChange();
    }
    function centerUpHandler(e) {
        Object.assign($state.active, $state.defaults);
        parameterChange();
    }
    function infoUpHandler(e) {
        $showInfo = !$showInfo;
    }

    function downloadUpHandler(e) {
        let link = document.createElement("a");
        link.href = $canvasses.manset.toDataURL();
        link.download = "myImage.png";
        link.click();
    }

    function shuffleUpHandler(e) {
        let p = asdf.sample($shufflePoints[$state.params.whichfractal]);
        Object.assign($state.m, { cx: p[0], cy: p[1], xwidth: p[2] });
        Object.assign($state.j, { jx: p[0], jy: p[1] });
        parameterChange();
    }

    function toggleUpHandler(e) {
        settingsOpen = !settingsOpen;
    }

    function wfUpHandler(e) {
        $state.params.whichfractal =
            $state.params.whichfractal == "mandelbrot"
                ? "burningship"
                : "mandelbrot";
        parameterChange();
    }

    function juliaUpHandler(e) {
        window.dispatchEvent(new KeyboardEvent("keyup", { key: "j" }));
    }

    function mouseUpHandler(e) {
        md = false;
        handlers[mouseTarget.id](e);
        $state.mouse.moved = false;
    }
    function touchEndHandler(e) {
        mouseUpHandler(e);
    }
    function touchMoveHandler(e) {
        mouseMoveHandler(e.touches.item(0));
    }
    function touchDownHandler(e) {
        mouseDownHandler(e.touches.item(0));
    }
</script>

<svelte:window
    on:mousemove={md ? mouseMoveHandler : () => {}}
    on:touchmove={md ? touchMoveHandler : () => {}}
    on:mouseup={md ? mouseUpHandler : () => {}}
    on:touchend={md ? touchEndHandler : () => {}}
    bind:innerWidth={xResMax}
/>

<div
    title="Go back (Esc)"
    id="escape-julia"
    class="UI-atom"
    style="--separation: {separation}"
    class:hide={!$state.params.julia}
    class:md-button={mouseTarget?.id == "escape-julia" && md}
    on:mousedown|preventDefault|stopPropagation={mouseDownHandler}
    on:touchstart|preventDefault|stopPropagation={touchDownHandler}
/>

<div
    id="UI-wrapper"
    style="--separation: {separation}; --resolution: {resolution}; height: {settingsOpen
        ? 0.75 * w
        : 2 * w}px"
    bind:clientWidth={w}
    on:mousedown|preventDefault|stopPropagation={mouseDownHandler}
    on:touchstart|preventDefault|stopPropagation={touchDownHandler}
    class:hidden={!settingsOpen}
>
    <div
        title="Resolution"
        id="res-background"
        class="UI-atom slider-background"
        style="--resolution: {resolution}%"
    >
        <div class="slider-label"><p>Resolution</p></div>
        <div id="res-touch" class="slider-touch" />
    </div>
    <div
        title="Maximum Iterations"
        id="iter-background"
        class="UI-atom slider-background"
        style="--iterLim: {iterLim}%"
    >
        <div class="slider-label"><p>Detail</p></div>
        <div id="iter-touch" class="slider-touch" />
    </div>
    <div
        title="Re-center"
        id="center-touch"
        class="UI-atom icon-container"
        class:md-button={mouseTarget?.id == "center-touch" && md}
    />
    <div
        title="Settings"
        id="toggle-touch"
        class="UI-atom icon-container"
        class:md-button={mouseTarget?.id == "toggle-touch" && md}
    />
    <div
        title="Shuffle"
        id="shuffle-touch"
        class="UI-atom icon-container"
        class:md-button={mouseTarget?.id == "shuffle-touch" && md}
    />
    <div
        title="Save image"
        id="download-touch"
        class="UI-atom icon-container"
        class:md-button={mouseTarget?.id == "download-touch" && md}
    />
    <div
        title="Show julia set preview (J)"
        id="julia-touch"
        class="UI-atom icon-container"
        class:hide={$state.params.julia}
        style={$state.params.jPreview
            ? "background-color: hsla(215, 61%, 89%, 0.9)"
            : "background-color: auto"}
        class:md-button={mouseTarget?.id == "julia-touch" && md}
    />
    <div
        title="Info"
        id="info-touch"
        class="UI-atom icon-container"
        class:md-button={mouseTarget?.id == "info-touch" && md}
        style={$showInfo
            ? "background-color: hsla(215, 61%, 89%, 0.9)"
            : "background-color: auto"}
    />
    <div
        title="Switch fractals"
        id="wf-background"
        class="UI-atom"
        class:md-button={mouseTarget?.id == "wf-touch" && md}
    >
        <div id="wf-label">
            <p>
                {$state.params.whichfractal == "mandelbrot"
                    ? "Mandelbrot"
                    : "Burning Ship"}
            </p>
        </div>
        <div id="wf-touch" />
    </div>
</div>

<div
    id="jPreview-wrapper"
    style="--separation: {separation}"
    on:mousedown|preventDefault|stopPropagation={mouseDownHandler}
    on:touchstart|preventDefault|stopPropagation={touchDownHandler}
>
    <canvas
        id="jPreview-touch"
        class:hide={!$state.params.jPreview || $state.params.julia}
        bind:this={$canvasses.jPreview}
    />
</div>

<style>
    #escape-julia {
        border: 1px solid hsla(215, 61%, 89%, 0.9);
        position: absolute;
        bottom: calc(2 * var(--separation));
        left: calc(2 * var(--separation));
    }
    #res-background {
        background-image: linear-gradient(
            90deg,
            hsla(0, 0%, 80%, 0.8) var(--resolution),
            rgba(0, 0, 0, 0) var(--resolution)
        );
        background-size: calc(100% + 1px) 100%;
        grid-area: 1 / 1 / span 1 / span 2;
    }
    #iter-background {
        background-image: linear-gradient(
            90deg,
            hsla(0, 0%, 80%, 0.8) var(--iterLim),
            rgba(0, 0, 0, 0) var(--iterLim)
        );
        background-size: calc(100% + 1px) 100%;
        grid-area: 2 / 1 / span 1 / span 2;
    }
    .slider-background,
    #wf-background {
        text-align: center;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        padding: 0px;
    }
    #wf-background {
        grid-area: 3 / 3 / span 1 / span 2;
    }
    .slider-touch,
    .slider-label,
    #wf-touch,
    #wf-label {
        padding: 0px;
        margin: 0px;
        width: 100%;
        height: 100%;
        grid-area: 1 / 1;
    }
    .slider-touch,
    #wf-touch {
        z-index: 10;
    }
    #julia-touch {
        border: 1px solid hsla(215, 61%, 89%, 0.9);
        grid-area: 3 / 1 / span 1 / span 1;
    }
    #download-touch {
        grid-area: 3 / 2 / span 1 / span 1;
    }
    .slider-label,
    #wf-label {
        z-index: 9;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
    #UI-wrapper {
        position: absolute;
        top: 0px;
        right: 0px;
        margin: calc(2 * var(--separation));
        background-color: rgba(0, 0, 0, 0);
        display: grid;
        color: hsl(0, 0%, 100%);
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(3, 1fr);
        grid-gap: calc(2 * var(--separation));
    }
    #UI-wrapper.hidden {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
    }
    .UI-atom {
        background-color: hsla(0, 0%, 90%, 0.3);
        border-radius: 0.9em;
        border: 1px solid rgba(0, 0, 0, 0.1);
        height: 3.1em;
        z-index: 2;
        background-repeat: no-repeat;
        background-size: 70%;
        background-position: center;
    }
    .UI-atom:not(.slider-background, #wf-background, #info) {
        width: 3.1em;
    }
    .md-button {
        filter: brightness(0.5);
        opacity: 0.9;
    }
    p,
    div,
    canvas {
        user-select: none;
        -webkit-user-select: none;
    }
    #UI-wrapper.hidden div:not(#toggle-touch, #info-touch) {
        display: none;
    }
    #UI-wrapper.hidden #toggle-touch,
    #UI-wrapper.hidden #info-touch {
        border: 1px solid hsla(215, 61%, 89%, 0.9);
    }
    #jPreview-touch {
        z-index: 2;
        opacity: 0.9;
        background-color: rgba(0, 0, 0, 0);
        outline: 1px solid hsl(0, 0%, 40%);
        margin: 0px;
        padding: 0px;
        width: 100%;
    }
    #jPreview-wrapper {
        min-width: 192px;
        width: 30%;
        margin: 0px;
        padding: 0px;
        position: absolute;
        left: calc(4 * var(--separation));
        bottom: calc(4 * var(--separation));
    }
    #jPreview-touch.hide {
        opacity: 0;
    }
    #shuffle-touch {
        background-image: url("/icons/shuffle.svg");
    }
    #toggle-touch {
        background-image: url("/icons/settings.svg");
    }
    #info-touch {
        background-image: url("/icons/info.svg");
    }
    #center-touch {
        background-image: url("/icons/crosshairs.svg");
    }
    #julia-touch {
        background-image: url("/icons/julia.svg");
        /* background-size: 60%; */
    }
    #download-touch {
        background-image: url("/icons/download.svg");
    }
    #escape-julia {
        background-image: url("/icons/left-arrow.svg");
        background-size: 50%;
    }
</style>
