<script>
  import UI from "./UI.svelte";
  import { asdf } from "./functions.js";
  import { state, workers, canvasses } from "./stores.js";
  import {
    renderFlex,
    getX,
    getY,
    getDiffX,
    getDiffY,
    getZoomedX,
    getZoomedY,
    updateMouse,
    initializeJulia,
    recordSeparation,
  } from "./functions.js";
  import { onMount } from "svelte";
  export let heightPx;
  export let widthPx;

  $: $state.params.yres = Math.floor((heightPx / widthPx) * $state.params.xres);

  const jResX = 384;
  const jResY = 256;
  const xResTemp = 128;
  let yResTemp = 128;
  $: yResTemp = Math.floor((heightPx / widthPx) * xResTemp);
  const zoomScale = 1.002;

  $: if (widthPx || heightPx) {
    renderTemp();
    setTimeout(renderFinal, 50);
  }

  const renderFinal = (options) => {
    $workers.finalworker?.terminate();
    $workers.finalworker = new Worker("/mainworker.js");
    renderFlex($workers.finalworker, $canvasses.manset, $state, options);
  };

  const renderTemp = () => {
    $workers.finalworker?.terminate();
    renderFlex($workers.tmpworker, $canvasses.manset, $state, {
      xres: xResTemp,
      yres: yResTemp,
    });
  };

  function renderjPreview() {
    let rect = $canvasses.manset.getBoundingClientRect();
    let jx = getX($state, rect);
    let jy = getY($state, rect);
    renderFlex($workers.jPreviewWorker, $canvasses.jPreview, $state, {
      cx: 0,
      cy: 0,
      xwidth: 3.6,
      jx: jx,
      jy: jy,
      julia: true,
      xres: jResX,
      yres: jResY,
      onmessage: (e) => {
        $state.params.jPreview = true;
      },
    });
  }

  const goToJulia = () => {
    let rect = $canvasses.manset.getBoundingClientRect();
    $state = initializeJulia($state, rect);
    renderFinal();
  };

  const exitJulia = () => {
    $state.params.julia = false;
    let tmp = $state.params.jPreview;
    $state.params.jPreview = false;
    renderFinal({
      onmessage: (e) => {
        $state.params.jPreview = tmp;
      },
    });
  };

  const touchZoom = (e) => {
    $state.mouse = updateMouse($state, e.touches.item(0), e.touches.item(1));
    let tmp = 1 / $state.mouse.separationRatio;
    if (
      tmp * $state.active.xwidth > 3 / 500000000000 &&
      tmp * $state.active.xwidth < 12
    ) {
      let rect = $canvasses.manset.getBoundingClientRect();
      $state.active.cx = getZoomedX(e.touches.item(0), $state, rect, tmp);
      $state.active.cy = getZoomedY(e.touches.item(0), $state, rect, tmp);
      $state.active.xwidth = $state.active.xwidth * tmp;
    } else {
      $state.active.xwidth = Math.min(
        Math.max(tmp * $state.active.xwidth, 3 / 500000000000),
        12
      );
      renderTemp();
    }
    mouseDownMove();
  };

  const whileScrolling = (e) => {
    let rect = $canvasses.manset.getBoundingClientRect();
    let dY = Math.max(-150, Math.min(150, e.deltaY));
    let tmp = Math.pow(zoomScale, dY);
    if (
      tmp * $state.active.xwidth > 3 / 500000000000 &&
      tmp * $state.active.xwidth < 12
    ) {
      $state.active.cx = getZoomedX(e, $state, rect, tmp);
      $state.active.cy = getZoomedY(e, $state, rect, tmp);
      $state.active.xwidth = tmp * $state.active.xwidth;
      renderTemp();
    } else {
      $state.active.xwidth = Math.min(
        Math.max(tmp * $state.active.xwidth, 3 / 500000000000),
        12
      );
      renderTemp();
    }
  };

  const afterScrolling = asdf.debounce(renderFinal, 100, {
    leading: false,
    trailing: true,
  });

  // @ts-ignore
  $workers.tmpworker.busy = false;

  function mouseDownMove() {
    let rect = $canvasses.manset.getBoundingClientRect();
    $state.active.cx += getDiffX($state, rect);
    $state.active.cy += getDiffY($state, rect);
    renderTemp();
  }

  const wheelHandler = (e) => {
    whileScrolling(e);
    afterScrolling();
  };

  function saveStates() {
    sessionStorage.setItem("state", JSON.stringify($state));
  }

  function parameterChange() {
    if ($state.params.jPreview) {
      renderjPreview();
    }
    renderTemp();
    renderFinal();
  }

  const keyupHandler = (e) => {
    if (e.key == "Escape" && $state.params.julia) {
      exitJulia();
    } else if (e.key == "j" && !$state.params.julia) {
      // toggle julia preview in this block
      if (!$state.params.jPreview) {
        $workers.jPreviewWorker = new Worker("/mainworker.js");
        renderjPreview();
      } else {
        $state.params.jPreview = false;
        $workers.jPreviewWorker?.terminate();
      }
    } else if (e.key == "f") {
      if (!document.fullscreenElement) {
        document
          .getElementById("viewport")
          .requestFullscreen()
          .catch((err) => {
            console.log(
              "Error attempting to enable fullscreen mode: ${err.message}"
            );
          });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const mousedownHandler = (e) => {
    if (e.button == 0) {
      $state.mouse = updateMouse($state, e);
      $state.mouse.down = true;
      $state.mouse.moved = false;
    }
  };

  const mousemoveHandler = (e) => {
    $state.mouse = updateMouse($state, e);
    $state.mouse.moved = true;
    if ($state.mouse.down) {
      mouseDownMove();
      // julia preview but not in the actual julia set
    } else if ($state.params.jPreview && !$state.params.julia) {
      renderjPreview();
    }
  };

  const mouseupHandler = (e) => {
    $state.mouse.moved = false;
    // shift click on a spot
    if (!$state.params.julia && e.shiftKey && !$state.mouse.moved) {
      goToJulia();
    } else {
      renderFinal();
    }
    $state.mouse.down = false;
  };

  function touchstartHandler(e) {
    // normal movement
    if (!$state.params.jPreview || $state.params.julia) {
      // start mousedown mode
      $state.mouse.down = true;
      e.touches.item(0).button = 0;
      mousedownHandler(e.touches.item(0));
      // initialize a pinch movement
      if (e.touches.length == 2) {
        $state.mouse = recordSeparation(
          $state,
          e.touches.item(0),
          e.touches.item(1)
        );
      }
    } else {
      $state.mouse = updateMouse($state, e.touches.item(0));
      renderjPreview();
    }
  }

  function touchmoveHandler(e) {
    // normal movement
    if (!$state.params.jPreview || $state.params.julia) {
      // touch and drag
      if (e.touches.length == 1) {
        mousemoveHandler(e.touches.item(0));
        // pinch zoom
      } else if (e.touches.length == 2) {
        touchZoom(e);
      }
      // previewing julia sets
    } else if ($state.params.jPreview && !$state.params.julia) {
      $state.mouse = updateMouse($state, e.touches.item(0));
      renderjPreview();
    }
  }

  function touchendHandler(e) {
    // if last touch to go, render final image
    if (e.touches.length < 1) {
      renderFinal();
      $state.mouse.down = false;
      // else initialize the last touch as primary
    } else {
      touchstartHandler(e);
    }
  }

  onMount(() => {
    if ($state.params.jPreview) {
      $state.params.jPreview = false;
      $workers.jPreviewWorker = new Worker("/mainworker.js");
      renderjPreview();
    }
    renderFinal();
  });
</script>

<svelte:window
  on:mousemove={mousemoveHandler}
  on:touchmove|nonpassive|preventDefault={touchmoveHandler}
  on:mouseup={$state.mouse.down ? mouseupHandler : () => {}}
  on:touchend|nonpassive|preventDefault={$state.mouse.down
    ? touchendHandler
    : () => {}}
  on:keyup={keyupHandler}
  on:pagehide={() => {}}
/>

<div
  id="interface"
  on:wheel|nonpassive|preventDefault={wheelHandler}
  on:touchstart|nonpassive|preventDefault={touchstartHandler}
  on:mousedown={mousedownHandler}
>
  <UI on:parameterChange={parameterChange} />
</div>

<style>
  #interface {
    touch-action: none;
    background-color: rgba(0, 0, 0, 0);
    grid-area: 1 / 1 / 1 / 1;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
</style>
