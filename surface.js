"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isosurface_1 = require("isosurface");
var gl_matrix_1 = require("gl-matrix");
var sampleGrid = [64, 64, 64];
function default_1(regl) {
    var computeMesh = memoizeMeshCreation(regl);
    var context = {
        mesh: function (_, props) { return computeMesh(sampleGrid, props.fn, [props.bounds.min, props.bounds.max]); }
    };
    var model = gl_matrix_1.mat4.fromRotation(gl_matrix_1.mat4.create(), -Math.PI / 2, [1, 0, 0]);
    var drawSurface = regl({
        context: context,
        vert: "\n    precision mediump float;\n    attribute vec3 position;\n    uniform mat4 view, projection, model;\n    uniform vec3 boxmin, boxmax;\n    varying vec3 v_uvw;\n    void main() {\n          v_uvw = (position - boxmin) / (boxmax - boxmin);\n          gl_Position = projection * view * model * vec4(position, 1);\n    }",
        frag: "\n    precision mediump float;\n    varying vec3 v_uvw;\n    void main() {\n        gl_FragColor = vec4(v_uvw, 1.0);\n    }",
        attributes: {
            position: function (ctx) { return ctx.mesh.positions; }
        },
        uniforms: {
            model: model,
            boxmin: function (_, props) { return props.bounds.min; },
            boxmax: function (_, props) { return props.bounds.max; }
        },
        elements: function (ctx) { return ctx.mesh.cells; }
    });
    var drawWireframe = regl({
        context: context,
        vert: "\n    precision mediump float;\n    attribute vec3 position;\n    uniform mat4 model, view, projection;\n    void main() {\n          gl_Position = projection * view * model * vec4(position, 1);\n    }",
        frag: "\n    precision mediump float;\n    void main() {\n        gl_FragColor = vec4(1.0);\n    }",
        attributes: {
            position: function (ctx) { return ctx.mesh.positions; }
        },
        uniforms: {
            model: model
        },
        elements: function (ctx) { return ctx.mesh.edges; }
    });
    return function (props) {
        drawSurface(props);
        drawWireframe(props);
    };
}
exports.default = default_1;
function memoizeMeshCreation(regl) {
    // Memoize vertex/element buffer creation
    var _dims;
    var _potential;
    var _bounds;
    var positions;
    var cells;
    var edges;
    return function (dims, potential, bounds) {
        if (JSON.stringify(dims) !== JSON.stringify(_dims) ||
            potential !== _potential ||
            JSON.stringify(bounds) !== JSON.stringify(_bounds)) {
            _dims = dims;
            _potential = potential;
            _bounds = bounds;
            var net = isosurface_1.surfaceNets(dims, potential, bounds);
            positions = regl.buffer(net.positions);
            cells = regl.elements(net.cells);
            var edgesArray = [];
            for (var _i = 0, _a = net.cells; _i < _a.length; _i++) {
                var cell = _a[_i];
                edgesArray.push([cell[0], cell[1]], [cell[1], cell[2]], [cell[2], cell[0]]);
            }
            edges = regl.elements(edgesArray);
            console.log("recomputed mesh", net);
        }
        return { positions: positions, cells: cells, edges: edges };
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VyZmFjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3N1cmZhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx5Q0FBeUM7QUFDekMsdUNBQWlDO0FBNEJqQyxJQUFNLFVBQVUsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFFaEMsbUJBQXdCLElBQVU7SUFDaEMsSUFBTSxXQUFXLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUMsSUFBTSxPQUFPLEdBQUc7UUFDZCxJQUFJLEVBQUUsVUFBQyxDQUFNLEVBQUUsS0FBWSxJQUFLLE9BQUEsV0FBVyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUF2RSxDQUF1RTtLQUN4RyxDQUFDO0lBRUYsSUFBTSxLQUFLLEdBQUcsZ0JBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXhFLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBdUM7UUFDN0QsT0FBTyxTQUFBO1FBQ1AsSUFBSSxFQUFFLGtVQVNKO1FBQ0YsSUFBSSxFQUFFLDZIQUtKO1FBQ0YsVUFBVSxFQUFFO1lBQ1YsUUFBUSxFQUFFLFVBQUMsR0FBWSxJQUFLLE9BQUEsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQWxCLENBQWtCO1NBQy9DO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsS0FBSyxPQUFBO1lBQ0wsTUFBTSxFQUFFLFVBQUMsQ0FBTSxFQUFFLEtBQVksSUFBSyxPQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFoQixDQUFnQjtZQUNs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