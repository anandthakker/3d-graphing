"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cubePositions = [
    [-1.0, +1.0, +1.0], [+1.0, +1.0, +1.0], [+1.0, -1.0, +1.0], [-1.0, -1.0, +1.0],
    [+1.0, +1.0, +1.0], [+1.0, +1.0, -1.0], [+1.0, -1.0, -1.0], [+1.0, -1.0, +1.0],
    [+1.0, +1.0, -1.0], [-1.0, +1.0, -1.0], [-1.0, -1.0, -1.0], [+1.0, -1.0, -1.0],
    [-1.0, +1.0, -1.0], [-1.0, +1.0, +1.0], [-1.0, -1.0, +1.0], [-1.0, -1.0, -1.0],
    [-1.0, +1.0, -1.0], [+1.0, +1.0, -1.0], [+1.0, +1.0, +1.0], [-1.0, +1.0, +1.0],
    [-1.0, -1.0, -1.0], [+1.0, -1.0, -1.0], [+1.0, -1.0, +1.0], [-1.0, -1.0, +1.0] // bottom face
];
// 'texture' coordinates
var cubeAxis = [
    2, 2, 2, 2,
    0, 0, 0, 0,
    2, 2, 2, 2,
    0, 0, 0, 0,
    1, 1, 1, 1,
    1, 1, 1, 1
];
var attributes = {
    position: cubePositions,
    axis: cubeAxis
};
function default_1(regl) {
    var uniforms = {
        color: regl.prop('color'),
        boxmin: regl.prop('min'),
        boxmax: regl.prop('max'),
    };
    return regl({
        vert: "\n    precision mediump float;\n    attribute vec3 position;\n    attribute float axis;\n    varying vec2 v_uv;\n    uniform mat4 view, projection;\n    uniform vec3 boxmin, boxmax;\n\n    void main() {\n      // transform +/-1.0 to corresponding boxmin/boxmax component\n      vec3 zero =  vec3(0.0, 0.0, 0.0);\n      vec3 scaled = step(zero, position) * boxmin + step(zero, -position) * boxmax;\n      if (axis == 0.0) {\n        v_uv = scaled.yz;\n      } else if (axis == 1.0) {\n        v_uv = scaled.xz;\n      } else if (axis == 2.0) {\n        v_uv = scaled.xy;\n      }\n\n      gl_Position = projection * view * vec4(scaled, 1);\n    }",
        frag: "\n    precision mediump float;\n    uniform vec3 color;\n    varying vec2 v_uv;\n    void main() {\n      float distance_from_grid = min(abs(v_uv[0] - floor(v_uv[0] + 0.5)), abs(v_uv[1] - floor(v_uv[1] + 0.5)));\n      // TODO: customize this width (Q: what units would we want to control it in?)\n      float opacity = 1.0 * (1.0 - smoothstep(0.0, 0.05, distance_from_grid));\n      gl_FragColor = vec4(color, opacity);\n    }",
        attributes: attributes,
        elements: [
            [2, 1, 0], [2, 0, 3],
            [6, 5, 4], [6, 4, 7],
            [10, 9, 8], [10, 8, 11],
            [14, 13, 12], [14, 12, 15],
            [18, 17, 16], [18, 16, 19],
            [20, 21, 22], [23, 20, 22] // bottom face
        ],
        uniforms: uniforms,
        cull: {
            enable: true,
            face: 'back'
        },
        depth: {
            enable: false
        },
        blend: {
            enable: true,
            func: {
                src: 'src alpha',
                dst: 'one'
            }
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2dyaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSxJQUFNLGFBQWEsR0FBRztJQUNwQixDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQzlFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDOUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUM5RSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQzlFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDOUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFFLGNBQWM7Q0FDL0YsQ0FBQztBQUVGLHdCQUF3QjtBQUN4QixJQUFNLFFBQVEsR0FBRztJQUNmLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDVixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQ1YsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNWLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDVixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQ1YsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztDQUNYLENBQUM7QUFFRixJQUFNLFVBQVUsR0FBRztJQUNqQixRQUFRLEVBQUUsYUFBYTtJQUN2QixJQUFJLEVBQUUsUUFBUTtDQUNmLENBQUM7QUFFRixtQkFBd0IsSUFBVTtJQUNoQyxJQUFNLFFBQVEsR0FBRztRQUNmLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFpQixPQUFPLENBQUM7UUFDekMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQWUsS0FBSyxDQUFDO1FBQ3RDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFlLEtBQUssQ0FBQztLQUN2QyxDQUFDO0lBRUYsT0FBTyxJQUFJLENBQTRDO1FBQ3JELElBQUksRUFBRSx1b0JBcUJKO1FBRUYsSUFBSSxFQUFFLDZhQVNKO1FBRUYsVUFBVSxZQUFBO1FBRVYsUUFBUSxFQUFFO1lBQ1IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDMUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDMUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBRSxjQUFjO1NBQzNDO1FBRUQsUUFBUSxVQUFBO1FBRVIsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLElBQUk7WUFDWixJQUFJLEVBQUUsTUFBTTtTQUNiO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLEtBQUs7U0FDZDtRQUNELEtBQUssRUFBRztZQUNOLE1BQU0sRUFBRSxJQUFJO1lBQ1osSUFBSSxFQUFFO2dCQUNKLEdBQUcsRUFBRSxXQUFXO2dCQUNoQixHQUFHLEVBQUUsS0FBSzthQUNYO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBdEVELDRCQXNFQyJ9