import _ from "lodash";

export const asdf = _;
export const renderFlex = (worker, canvas, state, options = {}) => {
  let extraOnMessage = options.onmessage || function (e) {};
  worker.onmessage = (e) => {
    worker.busy = false;
    extraOnMessage(e);
    putData(e.data, canvas);
  };
  if (!worker.busy || options.force) {
    worker.busy = true;
    worker.postMessage({
      cx: options.cx ?? state.active.cx,
      cy: options.cy ?? state.active.cy,
      jzx: options.jx ?? state.active.jx,
      jzy: options.jy ?? state.active.jy,
      xwidth: options.xwidth ?? state.active.xwidth,
      maxiter: options.maxiter ?? state.params.maxiter,
      whichfractal: options.whichfractal ?? state.params.whichfractal,
      julia: options.julia ?? state.params.julia,
      xres: options.xres ?? state.params.xres,
      yres: options.yres ?? state.params.yres,
    });
  }
};

function putData(data, canvas) {
  canvas.width = data.xres;
  canvas.height = data.yres;
  let context = canvas.getContext("2d");
  let idata = context.createImageData(data.xres, data.yres);
  idata.data.set(data.buffer);
  context.putImageData(idata, 0, 0);
}

export function getDiffX(state, rect) {
  let xdiff = (state.active.xwidth / (rect.right - rect.left)) * state.mouse.dX;
  return xdiff;
}

export function getDiffY(state, rect) {
  let ydiff =
    ((-state.params.yres * state.active.xwidth) /
      state.params.xres /
      (rect.bottom - rect.top)) *
    state.mouse.dY;
  return ydiff;
}

export function initializeJulia(state, rect) {
  state.j.jx = getX(state, rect);
  state.j.jy = getY(state, rect);
  state.j.cx = 0.0;
  state.j.cy = 0.0;
  state.j.xwidth = 3.6;
  state.params.julia = true;
  return state;
}

export const recordSeparation = (state, e1, e2) => {
  let separationX = e2.clientX - e1.clientX;
  let separationY = e2.clientY - e1.clientY;
  state.mouse.separation = Math.sqrt(separationX ** 2 + separationY ** 2);
  return state.mouse;
};

export const updateMouse = (state, e1, e2 = null) => {
  state.mouse.dX = state.mouse.X - e1.clientX;
  state.mouse.dY = state.mouse.Y - e1.clientY;
  state.mouse.X = e1.clientX;
  state.mouse.Y = e1.clientY;
  let newSeparation = e2
    ? Math.sqrt((e2.clientX - e1.clientX) ** 2 + (e2.clientY - e1.clientY) ** 2)
    : 0.0;
  state.mouse.separationRatio = e2
    ? newSeparation / state.mouse.separation
    : state.mouse.separationRatio;
  state.mouse.separation = e2 ? newSeparation : state.mouse.separation;
  return state.mouse;
};

export function getX(state, rect) {
  let xpos =
    state.m.cx -
    0.5 * state.m.xwidth +
    (state.m.xwidth * (state.mouse.X - rect.left)) / (rect.right - rect.left);
  return xpos;
}

export function getY(state, rect) {
  let ypos =
    state.m.cy +
    (0.5 * state.m.xwidth * state.params.yres) / state.params.xres -
    (((state.m.xwidth * state.params.yres) / state.params.xres) *
      (state.mouse.Y - rect.top)) /
      (rect.bottom - rect.top);
  return ypos;
}

export function getZoomedX(e, state, rect, tmp) {
  let newcx =
    state.active.cx -
    state.active.xwidth *
      ((e.clientX - rect.left) / (rect.right - rect.left) - 0.5) *
      (tmp - 1);
  return newcx;
}

export function getZoomedY(e, state, rect, tmp) {
  let newcy =
    state.active.cy +
    ((state.active.xwidth * state.params.yres) / state.params.xres) *
      ((e.clientY - rect.top) / (rect.bottom - rect.top) - 0.5) *
      (tmp - 1);
  return newcy;
}
