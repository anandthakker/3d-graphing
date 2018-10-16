"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = require("gl-matrix");
var attributes = {
    position: function (_context, props) {
        var v1 = gl_matrix_1.vec3.fromValues(1, 0, 0);
        [[0, -1, -1], [0, 1, -1], [0, 1, 1], [0, -1, 1]];
    }
};
var uniforms = {
    model: function (_context, _props) {
        // TODO: compute this from props (for choice of which plane) and camera state (for view box bounds -> scaling)
        return gl_matrix_1.mat4.fromScaling(gl_matrix_1.mat4.create(), [10000, 10000, 10000]);
    },
    color: function (_context, props) { return props.color; }
};
function default_1(regl) {
    return regl({
        vert: "\n    precision mediump float;\n    attribute vec3 position;\n    uniform mat4 model, view, projection;\n    varying vec2 uv;\n    void main() {\n      gl_Position = projection * view * model * vec4(position, 1);\n      uv = (model * vec4(position, 1)).yz;\n    }",
        frag: "\n    precision mediump float;\n    uniform vec3 color;\n    varying vec2 uv;\n    void main() {\n      float distance_from_grid = min(abs(uv[0] - floor(uv[0] + 0.5)), abs(uv[1] - floor(uv[1] + 0.5)));\n      // TODO: customize this width (Q: what units would we want to control it in?)\n      float opacity = 1.0 * (1.0 - smoothstep(0.0, 0.025, distance_from_grid));\n      gl_FragColor = vec4(color * opacity, opacity);\n    }",
        attributes: attributes,
        elements: [[0, 1, 2], [0, 2, 3]],
        uniforms: uniforms,
        depth: {
            enable: false
        },
        blend: {
            enable: true
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9wbGFuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHVDQUF1QztBQVN2QyxJQUFNLFVBQVUsR0FBRztJQUNqQixRQUFRLEVBQUUsVUFBQyxRQUFhLEVBQUUsS0FBWTtRQUNwQyxJQUFJLEVBQUUsR0FBRyxnQkFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNsRCxDQUFDO0NBQ0YsQ0FBQztBQUVGLElBQU0sUUFBUSxHQUFHO0lBQ2YsS0FBSyxFQUFFLFVBQUMsUUFBYSxFQUFFLE1BQWE7UUFDbEMsOEdBQThHO1FBQzlHLE9BQU8sZ0JBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBQ0QsS0FBSyxFQUFFLFVBQUMsUUFBYSxFQUFFLEtBQVksSUFBSyxPQUFBLEtBQUssQ0FBQyxLQUFLLEVBQVgsQ0FBVztDQUNwRCxDQUFDO0FBRUYsbUJBQXdCLElBQVU7SUFDaEMsT0FBTyxJQUFJLENBQTRDO1FBQ3JELElBQUksRUFBRSx5UUFRSjtRQUVGLElBQUksRUFBRSw4YUFTSjtRQUVGLFVBQVUsWUFBQTtRQUVWLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFaEMsUUFBUSxVQUFBO1FBRVIsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLEtBQUs7U0FDZDtRQUNELEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxJQUFJO1NBQ2I7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBcENELDRCQW9DQyJ9