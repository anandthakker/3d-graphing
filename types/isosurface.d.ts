declare module 'isosurface' {
    type v3 = [number, number, number];
    type getSurface = (
        dims: v3,
        potential: (x: number, y: number, z: number) => number,
        bounds?: [v3, v3]
    ) => { positions: v3[], cells: v3[] };

    export const surfaceNets: getSurface;
    export const marchingCubes: getSurface;
    export const marchingTetrahedra: getSurface;
}