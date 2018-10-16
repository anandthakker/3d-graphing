"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = require("gl-matrix");
var vertexArray = [[0, 0, 0], [10, 0, 0], [0, 10, 0], [0, 0, 10]];
var elements = [[0, 1], [0, 2], [0, 3]];
function default_1(regl) {
    return regl({
        vert: "\n    precision mediump float;\n    attribute vec3 position;\n    uniform mat4 model, view, projection;\n    void main() {\n      gl_Position = projection * view * model * vec4(position, 1);\n    }",
        frag: "\n    precision mediump float;\n    uniform vec4 color;\n    void main() {\n      gl_FragColor = vec4(color);\n    }",
        attributes: {
            position: vertexArray
        },
        elements: elements,
        uniforms: {
            color: regl.prop('color'),
            model: gl_matrix_1.mat4.fromRotation(gl_matrix_1.mat4.create(), -Math.PI / 2, [1, 0, 0])
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXhlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2F4ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx1Q0FBaUM7QUFFakMsSUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUVwRSxJQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFMUMsbUJBQXdCLElBQVU7SUFDaEMsT0FBTyxJQUFJLENBQUM7UUFDVixJQUFJLEVBQUUsdU1BTUo7UUFFRixJQUFJLEVBQUUsc0hBS0o7UUFFRixVQUFVLEVBQUU7WUFDVixRQUFRLEVBQUUsV0FBVztTQUN0QjtRQUVELFFBQVEsRUFBRSxRQUFRO1FBRWxCLFFBQVEsRUFBRTtZQUNOLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUE2QixPQUFPLENBQUM7WUFDckQsS0FBSyxFQUFFLGdCQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDbkU7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBNUJELDRCQTRCQyJ9