"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var regl_1 = __importDefault(require("regl"));
var regl_camera_1 = __importDefault(require("regl-camera"));
var grid_1 = __importDefault(require("./grid"));
var surface_1 = __importDefault(require("./surface"));
var axes_1 = __importDefault(require("./axes"));
var regl = regl_1.default();
var camera = regl_camera_1.default(regl, {
    center: [0, 0, 0],
    // theta: 0,
    // phi: 0,
    distance: 50
});
var drawAxes = axes_1.default(regl);
var drawGrid = grid_1.default(regl);
var drawSurface = surface_1.default(regl);
var expression = function (x, y, z) { return Math.cos(x) + Math.cos(y) + Math.cos(z); };
regl.frame(function () {
    camera(function (state) {
        if (!state.dirty)
            return;
        regl.clear({ color: [0, 0, 0, 1] });
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
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhDQUF3QjtBQUN4Qiw0REFBcUM7QUFDckMsZ0RBQTJCO0FBQzNCLHNEQUFnQztBQUNoQyxnREFBMEI7QUFFMUIsSUFBTSxJQUFJLEdBQUcsY0FBSSxFQUFFLENBQUM7QUFFcEIsSUFBTSxNQUFNLEdBQUcscUJBQVUsQ0FBQyxJQUFJLEVBQUU7SUFDOUIsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDakIsWUFBWTtJQUNaLFVBQVU7SUFDVixRQUFRLEVBQUUsRUFBRTtDQUNiLENBQUMsQ0FBQTtBQUVGLElBQU0sUUFBUSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QixJQUFNLFFBQVEsR0FBRyxjQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0IsSUFBTSxXQUFXLEdBQUcsaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUVsQyxJQUFNLFVBQVUsR0FBRyxVQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxJQUFLLE9BQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQXZDLENBQXVDLENBQUM7QUFFaEcsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNULE1BQU0sQ0FBQyxVQUFBLEtBQUs7UUFDVixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUs7WUFBRSxPQUFPO1FBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDbEMsUUFBUSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLFFBQVEsQ0FBQztZQUNQLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hCLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3BCLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1NBQ2xCLENBQUMsQ0FBQztRQUNILFdBQVcsQ0FBQztZQUNWLEVBQUUsRUFBRSxVQUFVO1lBQ2QsTUFBTSxFQUFFO2dCQUNOLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNwQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQzthQUNsQjtTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEifQ==