import Regl from 'regl';
import makeCamera from 'regl-camera';
import plane from './grid';
import surface from './surface';
import axes from './axes';

const regl = Regl();

const camera = makeCamera(regl, {
  center: [0, 0, 0],
  // theta: 0,
  // phi: 0,
  distance: 50
})

const drawAxes = axes(regl);
const drawGrid = plane(regl);
const drawSurface = surface(regl);

const expression = (x: number, y: number, z: number) => Math.cos(x) + Math.cos(y) + Math.cos(z);

regl.frame(() => {
  camera(state => {
    if (!state.dirty) return;
    regl.clear({color: [0, 0, 0, 1]});
    drawAxes({ color: [1, 1, 0, 1] });
    drawGrid({
      color: [1, 1, 1],
      min: [-10, -10, -10],
      max: [10, 10, 10]
    });
    drawSurface({
      fn: expression,
      bounds: {
        min: [-10, -10, -10],
        max: [10, 10, 10]
      }
    })
  })
})
