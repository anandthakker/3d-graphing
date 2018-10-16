import { Regl } from "regl";
import { mat4 } from "gl-matrix";

const vertexArray = [[0, 0, 0], [10, 0, 0], [0, 10, 0], [0, 0, 10]];

const elements = [[0, 1], [0, 2], [0, 3]];

export default function(regl: Regl) {
  return regl({
    vert: `
    precision mediump float;
    attribute vec3 position;
    uniform mat4 model, view, projection;
    void main() {
      gl_Position = projection * view * model * vec4(position, 1);
    }`,

    frag: `
    precision mediump float;
    uniform vec4 color;
    void main() {
      gl_FragColor = vec4(color);
    }`,

    attributes: {
      position: vertexArray
    },

    elements: elements,

    uniforms: {
        color: regl.prop<{color: number[]}, 'color'>('color'),
        model: mat4.fromRotation(mat4.create(), -Math.PI / 2, [1, 0, 0])
    }
  });
}
