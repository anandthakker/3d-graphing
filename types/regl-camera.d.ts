
declare module 'regl-camera' {
    function camera(regl: any, options?: any): (block: (state: any) => void) => void;
    export = camera;
}