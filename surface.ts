import { Regl, Buffer, Elements, Vec3 } from "regl";
import { surfaceNets } from "isosurface";
import { mat4 } from "gl-matrix";

export type Props = {
  fn: (x: number, y: number, z: number) => number;
  bounds: {
    min: [number, number, number];
    max: [number, number, number];
  };
};

type Uniforms = {
  model: mat4;
  boxmin: Vec3;
  boxmax: Vec3;
};

type Attributes = {
  position: Buffer;
};

type Context = {
  mesh: {
    positions: Buffer;
    cells: Elements;
    edges: Elements;
  }
}

const sampleGrid = [64, 64, 64];

export default function(regl: Regl) {
  const computeMesh = memoizeMeshCreation(regl);
  const context = {
    mesh: (_: any, props: Props) => computeMesh(sampleGrid, props.fn, [props.bounds.min, props.bounds.max])
  };

  const model = mat4.fromRotation(mat4.create(), -Math.PI / 2, [1, 0, 0]);

  const drawSurface = regl<Uniforms, Attributes, Props, Context>({
    context,
    vert: `
    precision mediump float;
    attribute vec3 position;
    uniform mat4 view, projection, model;
    uniform vec3 boxmin, boxmax;
    varying vec3 v_uvw;
    void main() {
          v_uvw = (position - boxmin) / (boxmax - boxmin);
          gl_Position = projection * view * model * vec4(position, 1);
    }`,
    frag: `
    precision mediump float;
    varying vec3 v_uvw;
    void main() {
        gl_FragColor = vec4(v_uvw, 1.0);
    }`,
    attributes: {
      position: (ctx: Context) => ctx.mesh.positions
    },
    uniforms: {
      model,
      boxmin: (_: any, props: Props) => props.bounds.min,
      boxmax: (_: any, props: Props) => props.bounds.max
    },
    elements: (ctx: Context) => ctx.mesh.cells
  });

  const drawWireframe = regl<{model: mat4}, Attributes, Props, Context>({
    context,
    vert: `
    precision mediump float;
    attribute vec3 position;
    uniform mat4 model, view, projection;
    void main() {
          gl_Position = projection * view * model * vec4(position, 1);
    }`,
    frag: `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0);
    }`,
    attributes: {
      position: (ctx: Context) => ctx.mesh.positions
    },
    uniforms: {
      model
    },
    elements: (ctx: Context) => ctx.mesh.edges
  })

  return (props: Props) => {
    drawSurface(props);
    drawWireframe(props);
  }
}

function memoizeMeshCreation(regl: Regl) {
  // Memoize vertex/element buffer creation
  let _dims: any;
  let _potential: any;
  let _bounds: any;

  let positions: Buffer;
  let cells: Elements;
  let edges: Elements;

  return (dims: any, potential: any, bounds: any) => {
    if (
      JSON.stringify(dims) !== JSON.stringify(_dims) ||
      potential !== _potential ||
      JSON.stringify(bounds) !== JSON.stringify(_bounds)
    ) {
      _dims = dims;
      _potential = potential;
      _bounds = bounds;
      const net = surfaceNets(dims, potential, bounds);
      positions = regl.buffer(net.positions);
      cells = regl.elements(net.cells);

      const edgesArray: [number, number][] = [];
      for (const cell of net.cells) {
        edgesArray.push(
          [cell[0], cell[1]],
          [cell[1], cell[2]],
          [cell[2], cell[0]]
        );
      }
      edges = regl.elements(edgesArray);
      console.log("recomputed mesh", net);
    }
    return { positions, cells, edges };
  };
}
