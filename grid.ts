import { Regl } from "regl";

export type Props = {
  color: number[];
  min: [number, number, number];
  max: [number, number, number];
};

const cubePositions = [
  [-1.0, +1.0, +1.0], [+1.0, +1.0, +1.0], [+1.0, -1.0, +1.0], [-1.0, -1.0, +1.0], // positive z face.
  [+1.0, +1.0, +1.0], [+1.0, +1.0, -1.0], [+1.0, -1.0, -1.0], [+1.0, -1.0, +1.0], // positive x face
  [+1.0, +1.0, -1.0], [-1.0, +1.0, -1.0], [-1.0, -1.0, -1.0], [+1.0, -1.0, -1.0], // negative z face
  [-1.0, +1.0, -1.0], [-1.0, +1.0, +1.0], [-1.0, -1.0, +1.0], [-1.0, -1.0, -1.0], // negative x face.
  [-1.0, +1.0, -1.0], [+1.0, +1.0, -1.0], [+1.0, +1.0, +1.0], [-1.0, +1.0, +1.0], // top face
  [-1.0, -1.0, -1.0], [+1.0, -1.0, -1.0], [+1.0, -1.0, +1.0], [-1.0, -1.0, +1.0]  // bottom face
];

// 'texture' coordinates
const cubeAxis = [
  2, 2, 2, 2,
  0, 0, 0, 0,
  2, 2, 2, 2,
  0, 0, 0, 0,
  1, 1, 1, 1,
  1, 1, 1, 1
];

const attributes = {
  position: cubePositions,
  axis: cubeAxis
};

export default function(regl: Regl) {
  const uniforms = {
    color: regl.prop<Props, 'color'>('color'),
    boxmin: regl.prop<Props, 'min'>('min'),
    boxmax: regl.prop<Props, 'max'>('max'),
  };

  return regl<typeof uniforms, typeof attributes, Props>({
    vert: `
    precision mediump float;
    attribute vec3 position;
    attribute float axis;
    varying vec2 v_uv;
    uniform mat4 view, projection;
    uniform vec3 boxmin, boxmax;

    void main() {
      // transform +/-1.0 to corresponding boxmin/boxmax component
      vec3 zero =  vec3(0.0, 0.0, 0.0);
      vec3 scaled = step(zero, position) * boxmin + step(zero, -position) * boxmax;
      if (axis == 0.0) {
        v_uv = scaled.yz;
      } else if (axis == 1.0) {
        v_uv = scaled.xz;
      } else if (axis == 2.0) {
        v_uv = scaled.xy;
      }

      gl_Position = projection * view * vec4(scaled, 1);
    }`,

    frag: `
    precision mediump float;
    uniform vec3 color;
    varying vec2 v_uv;
    void main() {
      float distance_from_grid = min(abs(v_uv[0] - floor(v_uv[0] + 0.5)), abs(v_uv[1] - floor(v_uv[1] + 0.5)));
      // TODO: customize this width (Q: what units would we want to control it in?)
      float opacity = 1.0 * (1.0 - smoothstep(0.0, 0.05, distance_from_grid));
      gl_FragColor = vec4(color, opacity);
    }`,

    attributes,

    elements: [
      [2, 1, 0], [2, 0, 3],       // positive z face.
      [6, 5, 4], [6, 4, 7],       // positive x face.
      [10, 9, 8], [10, 8, 11],    // negative z face.
      [14, 13, 12], [14, 12, 15], // negative x face.
      [18, 17, 16], [18, 16, 19], // top face.
      [20, 21, 22], [23, 20, 22]  // bottom face
    ],

    uniforms,

    cull: {
      enable: true,
      face: 'back'
    },
    depth: {
      enable: false
    },
    blend:  {
      enable: true,
      func: {
        src: 'src alpha',
        dst: 'one'
      }
    }
  });
}
