(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.threed = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var regl_1 = __importDefault(require("regl"));
exports.Regl = regl_1.default;
var regl_camera_1 = __importDefault(require("regl-camera"));
exports.makeCamera = regl_camera_1.default;
__export(require("isosurface"));
__export(require("gl-matrix"));

},{"gl-matrix":5,"isosurface":6,"regl":15,"regl-camera":14}],2:[function(require,module,exports){
module.exports = identity;

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
},{}],3:[function(require,module,exports){
var identity = require('./identity');

module.exports = lookAt;

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < 0.000001 &&
        Math.abs(eyey - centery) < 0.000001 &&
        Math.abs(eyez - centerz) < 0.000001) {
        return identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};
},{"./identity":2}],4:[function(require,module,exports){
module.exports = perspective;

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};
},{}],5:[function(require,module,exports){
/*!
@fileoverview gl-matrix - High performance matrix and vector operations
@author Brandon Jones
@author Colin MacKenzie IV
@version 2.7.0

Copyright (c) 2015-2018, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
!function(t,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var r=n();for(var a in r)("object"==typeof exports?exports:t)[a]=r[a]}}("undefined"!=typeof self?self:this,function(){return function(t){var n={};function r(a){if(n[a])return n[a].exports;var e=n[a]={i:a,l:!1,exports:{}};return t[a].call(e.exports,e,e.exports,r),e.l=!0,e.exports}return r.m=t,r.c=n,r.d=function(t,n,a){r.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:a})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,n){if(1&n&&(t=r(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var e in t)r.d(a,e,function(n){return t[n]}.bind(null,e));return a},r.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(n,"a",n),n},r.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},r.p="",r(r.s=10)}([function(t,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.setMatrixArrayType=function(t){n.ARRAY_TYPE=t},n.toRadian=function(t){return t*e},n.equals=function(t,n){return Math.abs(t-n)<=a*Math.max(1,Math.abs(t),Math.abs(n))};var a=n.EPSILON=1e-6;n.ARRAY_TYPE="undefined"!=typeof Float32Array?Float32Array:Array,n.RANDOM=Math.random;var e=Math.PI/180},function(t,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.forEach=n.sqrLen=n.len=n.sqrDist=n.dist=n.div=n.mul=n.sub=void 0,n.create=e,n.clone=function(t){var n=new a.ARRAY_TYPE(4);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n},n.fromValues=function(t,n,r,e){var u=new a.ARRAY_TYPE(4);return u[0]=t,u[1]=n,u[2]=r,u[3]=e,u},n.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t},n.set=function(t,n,r,a,e){return t[0]=n,t[1]=r,t[2]=a,t[3]=e,t},n.add=function(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t[3]=n[3]+r[3],t},n.subtract=u,n.multiply=o,n.divide=i,n.ceil=function(t,n){return t[0]=Math.ceil(n[0]),t[1]=Math.ceil(n[1]),t[2]=Math.ceil(n[2]),t[3]=Math.ceil(n[3]),t},n.floor=function(t,n){return t[0]=Math.floor(n[0]),t[1]=Math.floor(n[1]),t[2]=Math.floor(n[2]),t[3]=Math.floor(n[3]),t},n.min=function(t,n,r){return t[0]=Math.min(n[0],r[0]),t[1]=Math.min(n[1],r[1]),t[2]=Math.min(n[2],r[2]),t[3]=Math.min(n[3],r[3]),t},n.max=function(t,n,r){return t[0]=Math.max(n[0],r[0]),t[1]=Math.max(n[1],r[1]),t[2]=Math.max(n[2],r[2]),t[3]=Math.max(n[3],r[3]),t},n.round=function(t,n){return t[0]=Math.round(n[0]),t[1]=Math.round(n[1]),t[2]=Math.round(n[2]),t[3]=Math.round(n[3]),t},n.scale=function(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=n[3]*r,t},n.scaleAndAdd=function(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t[2]=n[2]+r[2]*a,t[3]=n[3]+r[3]*a,t},n.distance=s,n.squaredDistance=c,n.length=f,n.squaredLength=M,n.negate=function(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t[3]=-n[3],t},n.inverse=function(t,n){return t[0]=1/n[0],t[1]=1/n[1],t[2]=1/n[2],t[3]=1/n[3],t},n.normalize=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r*r+a*a+e*e+u*u;o>0&&(o=1/Math.sqrt(o),t[0]=r*o,t[1]=a*o,t[2]=e*o,t[3]=u*o);return t},n.dot=function(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]+t[3]*n[3]},n.lerp=function(t,n,r,a){var e=n[0],u=n[1],o=n[2],i=n[3];return t[0]=e+a*(r[0]-e),t[1]=u+a*(r[1]-u),t[2]=o+a*(r[2]-o),t[3]=i+a*(r[3]-i),t},n.random=function(t,n){var r,e,u,o,i,s;n=n||1;do{r=2*a.RANDOM()-1,e=2*a.RANDOM()-1,i=r*r+e*e}while(i>=1);do{u=2*a.RANDOM()-1,o=2*a.RANDOM()-1,s=u*u+o*o}while(s>=1);var c=Math.sqrt((1-i)/s);return t[0]=n*r,t[1]=n*e,t[2]=n*u*c,t[3]=n*o*c,t},n.transformMat4=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3];return t[0]=r[0]*a+r[4]*e+r[8]*u+r[12]*o,t[1]=r[1]*a+r[5]*e+r[9]*u+r[13]*o,t[2]=r[2]*a+r[6]*e+r[10]*u+r[14]*o,t[3]=r[3]*a+r[7]*e+r[11]*u+r[15]*o,t},n.transformQuat=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=r[0],i=r[1],s=r[2],c=r[3],f=c*a+i*u-s*e,M=c*e+s*a-o*u,h=c*u+o*e-i*a,l=-o*a-i*e-s*u;return t[0]=f*c+l*-o+M*-s-h*-i,t[1]=M*c+l*-i+h*-o-f*-s,t[2]=h*c+l*-s+f*-i-M*-o,t[3]=n[3],t},n.str=function(t){return"vec4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},n.exactEquals=function(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]},n.equals=function(t,n){var r=t[0],e=t[1],u=t[2],o=t[3],i=n[0],s=n[1],c=n[2],f=n[3];return Math.abs(r-i)<=a.EPSILON*Math.max(1,Math.abs(r),Math.abs(i))&&Math.abs(e-s)<=a.EPSILON*Math.max(1,Math.abs(e),Math.abs(s))&&Math.abs(u-c)<=a.EPSILON*Math.max(1,Math.abs(u),Math.abs(c))&&Math.abs(o-f)<=a.EPSILON*Math.max(1,Math.abs(o),Math.abs(f))};var a=function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}(r(0));function e(){var t=new a.ARRAY_TYPE(4);return a.ARRAY_TYPE!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[3]=0),t}function u(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t[3]=n[3]-r[3],t}function o(t,n,r){return t[0]=n[0]*r[0],t[1]=n[1]*r[1],t[2]=n[2]*r[2],t[3]=n[3]*r[3],t}function i(t,n,r){return t[0]=n[0]/r[0],t[1]=n[1]/r[1],t[2]=n[2]/r[2],t[3]=n[3]/r[3],t}function s(t,n){var r=n[0]-t[0],a=n[1]-t[1],e=n[2]-t[2],u=n[3]-t[3];return Math.sqrt(r*r+a*a+e*e+u*u)}function c(t,n){var r=n[0]-t[0],a=n[1]-t[1],e=n[2]-t[2],u=n[3]-t[3];return r*r+a*a+e*e+u*u}function f(t){var n=t[0],r=t[1],a=t[2],e=t[3];return Math.sqrt(n*n+r*r+a*a+e*e)}function M(t){var n=t[0],r=t[1],a=t[2],e=t[3];return n*n+r*r+a*a+e*e}n.sub=u,n.mul=o,n.div=i,n.dist=s,n.sqrDist=c,n.len=f,n.sqrLen=M,n.forEach=function(){var t=e();return function(n,r,a,e,u,o){var i=void 0,s=void 0;for(r||(r=4),a||(a=0),s=e?Math.min(e*r+a,n.length):n.length,i=a;i<s;i+=r)t[0]=n[i],t[1]=n[i+1],t[2]=n[i+2],t[3]=n[i+3],u(t,t,o),n[i]=t[0],n[i+1]=t[1],n[i+2]=t[2],n[i+3]=t[3];return n}}()},function(t,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.forEach=n.sqrLen=n.len=n.sqrDist=n.dist=n.div=n.mul=n.sub=void 0,n.create=e,n.clone=function(t){var n=new a.ARRAY_TYPE(3);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n},n.length=u,n.fromValues=o,n.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t},n.set=function(t,n,r,a){return t[0]=n,t[1]=r,t[2]=a,t},n.add=function(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t},n.subtract=i,n.multiply=s,n.divide=c,n.ceil=function(t,n){return t[0]=Math.ceil(n[0]),t[1]=Math.ceil(n[1]),t[2]=Math.ceil(n[2]),t},n.floor=function(t,n){return t[0]=Math.floor(n[0]),t[1]=Math.floor(n[1]),t[2]=Math.floor(n[2]),t},n.min=function(t,n,r){return t[0]=Math.min(n[0],r[0]),t[1]=Math.min(n[1],r[1]),t[2]=Math.min(n[2],r[2]),t},n.max=function(t,n,r){return t[0]=Math.max(n[0],r[0]),t[1]=Math.max(n[1],r[1]),t[2]=Math.max(n[2],r[2]),t},n.round=function(t,n){return t[0]=Math.round(n[0]),t[1]=Math.round(n[1]),t[2]=Math.round(n[2]),t},n.scale=function(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t},n.scaleAndAdd=function(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t[2]=n[2]+r[2]*a,t},n.distance=f,n.squaredDistance=M,n.squaredLength=h,n.negate=function(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t},n.inverse=function(t,n){return t[0]=1/n[0],t[1]=1/n[1],t[2]=1/n[2],t},n.normalize=l,n.dot=v,n.cross=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=r[0],i=r[1],s=r[2];return t[0]=e*s-u*i,t[1]=u*o-a*s,t[2]=a*i-e*o,t},n.lerp=function(t,n,r,a){var e=n[0],u=n[1],o=n[2];return t[0]=e+a*(r[0]-e),t[1]=u+a*(r[1]-u),t[2]=o+a*(r[2]-o),t},n.hermite=function(t,n,r,a,e,u){var o=u*u,i=o*(2*u-3)+1,s=o*(u-2)+u,c=o*(u-1),f=o*(3-2*u);return t[0]=n[0]*i+r[0]*s+a[0]*c+e[0]*f,t[1]=n[1]*i+r[1]*s+a[1]*c+e[1]*f,t[2]=n[2]*i+r[2]*s+a[2]*c+e[2]*f,t},n.bezier=function(t,n,r,a,e,u){var o=1-u,i=o*o,s=u*u,c=i*o,f=3*u*i,M=3*s*o,h=s*u;return t[0]=n[0]*c+r[0]*f+a[0]*M+e[0]*h,t[1]=n[1]*c+r[1]*f+a[1]*M+e[1]*h,t[2]=n[2]*c+r[2]*f+a[2]*M+e[2]*h,t},n.random=function(t,n){n=n||1;var r=2*a.RANDOM()*Math.PI,e=2*a.RANDOM()-1,u=Math.sqrt(1-e*e)*n;return t[0]=Math.cos(r)*u,t[1]=Math.sin(r)*u,t[2]=e*n,t},n.transformMat4=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=r[3]*a+r[7]*e+r[11]*u+r[15];return o=o||1,t[0]=(r[0]*a+r[4]*e+r[8]*u+r[12])/o,t[1]=(r[1]*a+r[5]*e+r[9]*u+r[13])/o,t[2]=(r[2]*a+r[6]*e+r[10]*u+r[14])/o,t},n.transformMat3=function(t,n,r){var a=n[0],e=n[1],u=n[2];return t[0]=a*r[0]+e*r[3]+u*r[6],t[1]=a*r[1]+e*r[4]+u*r[7],t[2]=a*r[2]+e*r[5]+u*r[8],t},n.transformQuat=function(t,n,r){var a=r[0],e=r[1],u=r[2],o=r[3],i=n[0],s=n[1],c=n[2],f=e*c-u*s,M=u*i-a*c,h=a*s-e*i,l=e*h-u*M,v=u*f-a*h,d=a*M-e*f,b=2*o;return f*=b,M*=b,h*=b,l*=2,v*=2,d*=2,t[0]=i+f+l,t[1]=s+M+v,t[2]=c+h+d,t},n.rotateX=function(t,n,r,a){var e=[],u=[];return e[0]=n[0]-r[0],e[1]=n[1]-r[1],e[2]=n[2]-r[2],u[0]=e[0],u[1]=e[1]*Math.cos(a)-e[2]*Math.sin(a),u[2]=e[1]*Math.sin(a)+e[2]*Math.cos(a),t[0]=u[0]+r[0],t[1]=u[1]+r[1],t[2]=u[2]+r[2],t},n.rotateY=function(t,n,r,a){var e=[],u=[];return e[0]=n[0]-r[0],e[1]=n[1]-r[1],e[2]=n[2]-r[2],u[0]=e[2]*Math.sin(a)+e[0]*Math.cos(a),u[1]=e[1],u[2]=e[2]*Math.cos(a)-e[0]*Math.sin(a),t[0]=u[0]+r[0],t[1]=u[1]+r[1],t[2]=u[2]+r[2],t},n.rotateZ=function(t,n,r,a){var e=[],u=[];return e[0]=n[0]-r[0],e[1]=n[1]-r[1],e[2]=n[2]-r[2],u[0]=e[0]*Math.cos(a)-e[1]*Math.sin(a),u[1]=e[0]*Math.sin(a)+e[1]*Math.cos(a),u[2]=e[2],t[0]=u[0]+r[0],t[1]=u[1]+r[1],t[2]=u[2]+r[2],t},n.angle=function(t,n){var r=o(t[0],t[1],t[2]),a=o(n[0],n[1],n[2]);l(r,r),l(a,a);var e=v(r,a);return e>1?0:e<-1?Math.PI:Math.acos(e)},n.str=function(t){return"vec3("+t[0]+", "+t[1]+", "+t[2]+")"},n.exactEquals=function(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]},n.equals=function(t,n){var r=t[0],e=t[1],u=t[2],o=n[0],i=n[1],s=n[2];return Math.abs(r-o)<=a.EPSILON*Math.max(1,Math.abs(r),Math.abs(o))&&Math.abs(e-i)<=a.EPSILON*Math.max(1,Math.abs(e),Math.abs(i))&&Math.abs(u-s)<=a.EPSILON*Math.max(1,Math.abs(u),Math.abs(s))};var a=function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}(r(0));function e(){var t=new a.ARRAY_TYPE(3);return a.ARRAY_TYPE!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t}function u(t){var n=t[0],r=t[1],a=t[2];return Math.sqrt(n*n+r*r+a*a)}function o(t,n,r){var e=new a.ARRAY_TYPE(3);return e[0]=t,e[1]=n,e[2]=r,e}function i(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t}function s(t,n,r){return t[0]=n[0]*r[0],t[1]=n[1]*r[1],t[2]=n[2]*r[2],t}function c(t,n,r){return t[0]=n[0]/r[0],t[1]=n[1]/r[1],t[2]=n[2]/r[2],t}function f(t,n){var r=n[0]-t[0],a=n[1]-t[1],e=n[2]-t[2];return Math.sqrt(r*r+a*a+e*e)}function M(t,n){var r=n[0]-t[0],a=n[1]-t[1],e=n[2]-t[2];return r*r+a*a+e*e}function h(t){var n=t[0],r=t[1],a=t[2];return n*n+r*r+a*a}function l(t,n){var r=n[0],a=n[1],e=n[2],u=r*r+a*a+e*e;return u>0&&(u=1/Math.sqrt(u),t[0]=n[0]*u,t[1]=n[1]*u,t[2]=n[2]*u),t}function v(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]}n.sub=i,n.mul=s,n.div=c,n.dist=f,n.sqrDist=M,n.len=u,n.sqrLen=h,n.forEach=function(){var t=e();return function(n,r,a,e,u,o){var i=void 0,s=void 0;for(r||(r=3),a||(a=0),s=e?Math.min(e*r+a,n.length):n.length,i=a;i<s;i+=r)t[0]=n[i],t[1]=n[i+1],t[2]=n[i+2],u(t,t,o),n[i]=t[0],n[i+1]=t[1],n[i+2]=t[2];return n}}()},function(t,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.setAxes=n.sqlerp=n.rotationTo=n.equals=n.exactEquals=n.normalize=n.sqrLen=n.squaredLength=n.len=n.length=n.lerp=n.dot=n.scale=n.mul=n.add=n.set=n.copy=n.fromValues=n.clone=void 0,n.create=s,n.identity=function(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},n.setAxisAngle=c,n.getAxisAngle=function(t,n){var r=2*Math.acos(n[3]),e=Math.sin(r/2);e>a.EPSILON?(t[0]=n[0]/e,t[1]=n[1]/e,t[2]=n[2]/e):(t[0]=1,t[1]=0,t[2]=0);return r},n.multiply=f,n.rotateX=function(t,n,r){r*=.5;var a=n[0],e=n[1],u=n[2],o=n[3],i=Math.sin(r),s=Math.cos(r);return t[0]=a*s+o*i,t[1]=e*s+u*i,t[2]=u*s-e*i,t[3]=o*s-a*i,t},n.rotateY=function(t,n,r){r*=.5;var a=n[0],e=n[1],u=n[2],o=n[3],i=Math.sin(r),s=Math.cos(r);return t[0]=a*s-u*i,t[1]=e*s+o*i,t[2]=u*s+a*i,t[3]=o*s-e*i,t},n.rotateZ=function(t,n,r){r*=.5;var a=n[0],e=n[1],u=n[2],o=n[3],i=Math.sin(r),s=Math.cos(r);return t[0]=a*s+e*i,t[1]=e*s-a*i,t[2]=u*s+o*i,t[3]=o*s-u*i,t},n.calculateW=function(t,n){var r=n[0],a=n[1],e=n[2];return t[0]=r,t[1]=a,t[2]=e,t[3]=Math.sqrt(Math.abs(1-r*r-a*a-e*e)),t},n.slerp=M,n.random=function(t){var n=a.RANDOM(),r=a.RANDOM(),e=a.RANDOM(),u=Math.sqrt(1-n),o=Math.sqrt(n);return t[0]=u*Math.sin(2*Math.PI*r),t[1]=u*Math.cos(2*Math.PI*r),t[2]=o*Math.sin(2*Math.PI*e),t[3]=o*Math.cos(2*Math.PI*e),t},n.invert=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r*r+a*a+e*e+u*u,i=o?1/o:0;return t[0]=-r*i,t[1]=-a*i,t[2]=-e*i,t[3]=u*i,t},n.conjugate=function(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t[3]=n[3],t},n.fromMat3=h,n.fromEuler=function(t,n,r,a){var e=.5*Math.PI/180;n*=e,r*=e,a*=e;var u=Math.sin(n),o=Math.cos(n),i=Math.sin(r),s=Math.cos(r),c=Math.sin(a),f=Math.cos(a);return t[0]=u*s*f-o*i*c,t[1]=o*i*f+u*s*c,t[2]=o*s*c-u*i*f,t[3]=o*s*f+u*i*c,t},n.str=function(t){return"quat("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"};var a=i(r(0)),e=i(r(5)),u=i(r(2)),o=i(r(1));function i(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}function s(){var t=new a.ARRAY_TYPE(4);return a.ARRAY_TYPE!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t[3]=1,t}function c(t,n,r){r*=.5;var a=Math.sin(r);return t[0]=a*n[0],t[1]=a*n[1],t[2]=a*n[2],t[3]=Math.cos(r),t}function f(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=r[0],s=r[1],c=r[2],f=r[3];return t[0]=a*f+o*i+e*c-u*s,t[1]=e*f+o*s+u*i-a*c,t[2]=u*f+o*c+a*s-e*i,t[3]=o*f-a*i-e*s-u*c,t}function M(t,n,r,e){var u=n[0],o=n[1],i=n[2],s=n[3],c=r[0],f=r[1],M=r[2],h=r[3],l=void 0,v=void 0,d=void 0,b=void 0,m=void 0;return(v=u*c+o*f+i*M+s*h)<0&&(v=-v,c=-c,f=-f,M=-M,h=-h),1-v>a.EPSILON?(l=Math.acos(v),d=Math.sin(l),b=Math.sin((1-e)*l)/d,m=Math.sin(e*l)/d):(b=1-e,m=e),t[0]=b*u+m*c,t[1]=b*o+m*f,t[2]=b*i+m*M,t[3]=b*s+m*h,t}function h(t,n){var r=n[0]+n[4]+n[8],a=void 0;if(r>0)a=Math.sqrt(r+1),t[3]=.5*a,a=.5/a,t[0]=(n[5]-n[7])*a,t[1]=(n[6]-n[2])*a,t[2]=(n[1]-n[3])*a;else{var e=0;n[4]>n[0]&&(e=1),n[8]>n[3*e+e]&&(e=2);var u=(e+1)%3,o=(e+2)%3;a=Math.sqrt(n[3*e+e]-n[3*u+u]-n[3*o+o]+1),t[e]=.5*a,a=.5/a,t[3]=(n[3*u+o]-n[3*o+u])*a,t[u]=(n[3*u+e]+n[3*e+u])*a,t[o]=(n[3*o+e]+n[3*e+o])*a}return t}n.clone=o.clone,n.fromValues=o.fromValues,n.copy=o.copy,n.set=o.set,n.add=o.add,n.mul=f,n.scale=o.scale,n.dot=o.dot,n.lerp=o.lerp;var l=n.length=o.length,v=(n.len=l,n.squaredLength=o.squaredLength),d=(n.sqrLen=v,n.normalize=o.normalize);n.exactEquals=o.exactEquals,n.equals=o.equals,n.rotationTo=function(){var t=u.create(),n=u.fromValues(1,0,0),r=u.fromValues(0,1,0);return function(a,e,o){var i=u.dot(e,o);return i<-.999999?(u.cross(t,n,e),u.len(t)<1e-6&&u.cross(t,r,e),u.normalize(t,t),c(a,t,Math.PI),a):i>.999999?(a[0]=0,a[1]=0,a[2]=0,a[3]=1,a):(u.cross(t,e,o),a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=1+i,d(a,a))}}(),n.sqlerp=function(){var t=s(),n=s();return function(r,a,e,u,o,i){return M(t,a,o,i),M(n,e,u,i),M(r,t,n,2*i*(1-i)),r}}(),n.setAxes=function(){var t=e.create();return function(n,r,a,e){return t[0]=a[0],t[3]=a[1],t[6]=a[2],t[1]=e[0],t[4]=e[1],t[7]=e[2],t[2]=-r[0],t[5]=-r[1],t[8]=-r[2],d(n,h(n,t))}}()},function(t,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.sub=n.mul=void 0,n.create=function(){var t=new a.ARRAY_TYPE(16);a.ARRAY_TYPE!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0);return t[0]=1,t[5]=1,t[10]=1,t[15]=1,t},n.clone=function(t){var n=new a.ARRAY_TYPE(16);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15],n},n.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],t},n.fromValues=function(t,n,r,e,u,o,i,s,c,f,M,h,l,v,d,b){var m=new a.ARRAY_TYPE(16);return m[0]=t,m[1]=n,m[2]=r,m[3]=e,m[4]=u,m[5]=o,m[6]=i,m[7]=s,m[8]=c,m[9]=f,m[10]=M,m[11]=h,m[12]=l,m[13]=v,m[14]=d,m[15]=b,m},n.set=function(t,n,r,a,e,u,o,i,s,c,f,M,h,l,v,d,b){return t[0]=n,t[1]=r,t[2]=a,t[3]=e,t[4]=u,t[5]=o,t[6]=i,t[7]=s,t[8]=c,t[9]=f,t[10]=M,t[11]=h,t[12]=l,t[13]=v,t[14]=d,t[15]=b,t},n.identity=e,n.transpose=function(t,n){if(t===n){var r=n[1],a=n[2],e=n[3],u=n[6],o=n[7],i=n[11];t[1]=n[4],t[2]=n[8],t[3]=n[12],t[4]=r,t[6]=n[9],t[7]=n[13],t[8]=a,t[9]=u,t[11]=n[14],t[12]=e,t[13]=o,t[14]=i}else t[0]=n[0],t[1]=n[4],t[2]=n[8],t[3]=n[12],t[4]=n[1],t[5]=n[5],t[6]=n[9],t[7]=n[13],t[8]=n[2],t[9]=n[6],t[10]=n[10],t[11]=n[14],t[12]=n[3],t[13]=n[7],t[14]=n[11],t[15]=n[15];return t},n.invert=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],s=n[6],c=n[7],f=n[8],M=n[9],h=n[10],l=n[11],v=n[12],d=n[13],b=n[14],m=n[15],p=r*i-a*o,P=r*s-e*o,A=r*c-u*o,E=a*s-e*i,O=a*c-u*i,R=e*c-u*s,y=f*d-M*v,q=f*b-h*v,x=f*m-l*v,_=M*b-h*d,Y=M*m-l*d,L=h*m-l*b,S=p*L-P*Y+A*_+E*x-O*q+R*y;if(!S)return null;return S=1/S,t[0]=(i*L-s*Y+c*_)*S,t[1]=(e*Y-a*L-u*_)*S,t[2]=(d*R-b*O+m*E)*S,t[3]=(h*O-M*R-l*E)*S,t[4]=(s*x-o*L-c*q)*S,t[5]=(r*L-e*x+u*q)*S,t[6]=(b*A-v*R-m*P)*S,t[7]=(f*R-h*A+l*P)*S,t[8]=(o*Y-i*x+c*y)*S,t[9]=(a*x-r*Y-u*y)*S,t[10]=(v*O-d*A+m*p)*S,t[11]=(M*A-f*O-l*p)*S,t[12]=(i*q-o*_-s*y)*S,t[13]=(r*_-a*q+e*y)*S,t[14]=(d*P-v*E-b*p)*S,t[15]=(f*E-M*P+h*p)*S,t},n.adjoint=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],s=n[6],c=n[7],f=n[8],M=n[9],h=n[10],l=n[11],v=n[12],d=n[13],b=n[14],m=n[15];return t[0]=i*(h*m-l*b)-M*(s*m-c*b)+d*(s*l-c*h),t[1]=-(a*(h*m-l*b)-M*(e*m-u*b)+d*(e*l-u*h)),t[2]=a*(s*m-c*b)-i*(e*m-u*b)+d*(e*c-u*s),t[3]=-(a*(s*l-c*h)-i*(e*l-u*h)+M*(e*c-u*s)),t[4]=-(o*(h*m-l*b)-f*(s*m-c*b)+v*(s*l-c*h)),t[5]=r*(h*m-l*b)-f*(e*m-u*b)+v*(e*l-u*h),t[6]=-(r*(s*m-c*b)-o*(e*m-u*b)+v*(e*c-u*s)),t[7]=r*(s*l-c*h)-o*(e*l-u*h)+f*(e*c-u*s),t[8]=o*(M*m-l*d)-f*(i*m-c*d)+v*(i*l-c*M),t[9]=-(r*(M*m-l*d)-f*(a*m-u*d)+v*(a*l-u*M)),t[10]=r*(i*m-c*d)-o*(a*m-u*d)+v*(a*c-u*i),t[11]=-(r*(i*l-c*M)-o*(a*l-u*M)+f*(a*c-u*i)),t[12]=-(o*(M*b-h*d)-f*(i*b-s*d)+v*(i*h-s*M)),t[13]=r*(M*b-h*d)-f*(a*b-e*d)+v*(a*h-e*M),t[14]=-(r*(i*b-s*d)-o*(a*b-e*d)+v*(a*s-e*i)),t[15]=r*(i*h-s*M)-o*(a*h-e*M)+f*(a*s-e*i),t},n.determinant=function(t){var n=t[0],r=t[1],a=t[2],e=t[3],u=t[4],o=t[5],i=t[6],s=t[7],c=t[8],f=t[9],M=t[10],h=t[11],l=t[12],v=t[13],d=t[14],b=t[15];return(n*o-r*u)*(M*b-h*d)-(n*i-a*u)*(f*b-h*v)+(n*s-e*u)*(f*d-M*v)+(r*i-a*o)*(c*b-h*l)-(r*s-e*o)*(c*d-M*l)+(a*s-e*i)*(c*v-f*l)},n.multiply=u,n.translate=function(t,n,r){var a=r[0],e=r[1],u=r[2],o=void 0,i=void 0,s=void 0,c=void 0,f=void 0,M=void 0,h=void 0,l=void 0,v=void 0,d=void 0,b=void 0,m=void 0;n===t?(t[12]=n[0]*a+n[4]*e+n[8]*u+n[12],t[13]=n[1]*a+n[5]*e+n[9]*u+n[13],t[14]=n[2]*a+n[6]*e+n[10]*u+n[14],t[15]=n[3]*a+n[7]*e+n[11]*u+n[15]):(o=n[0],i=n[1],s=n[2],c=n[3],f=n[4],M=n[5],h=n[6],l=n[7],v=n[8],d=n[9],b=n[10],m=n[11],t[0]=o,t[1]=i,t[2]=s,t[3]=c,t[4]=f,t[5]=M,t[6]=h,t[7]=l,t[8]=v,t[9]=d,t[10]=b,t[11]=m,t[12]=o*a+f*e+v*u+n[12],t[13]=i*a+M*e+d*u+n[13],t[14]=s*a+h*e+b*u+n[14],t[15]=c*a+l*e+m*u+n[15]);return t},n.scale=function(t,n,r){var a=r[0],e=r[1],u=r[2];return t[0]=n[0]*a,t[1]=n[1]*a,t[2]=n[2]*a,t[3]=n[3]*a,t[4]=n[4]*e,t[5]=n[5]*e,t[6]=n[6]*e,t[7]=n[7]*e,t[8]=n[8]*u,t[9]=n[9]*u,t[10]=n[10]*u,t[11]=n[11]*u,t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],t},n.rotate=function(t,n,r,e){var u=e[0],o=e[1],i=e[2],s=Math.sqrt(u*u+o*o+i*i),c=void 0,f=void 0,M=void 0,h=void 0,l=void 0,v=void 0,d=void 0,b=void 0,m=void 0,p=void 0,P=void 0,A=void 0,E=void 0,O=void 0,R=void 0,y=void 0,q=void 0,x=void 0,_=void 0,Y=void 0,L=void 0,S=void 0,w=void 0,I=void 0;if(s<a.EPSILON)return null;u*=s=1/s,o*=s,i*=s,c=Math.sin(r),f=Math.cos(r),M=1-f,h=n[0],l=n[1],v=n[2],d=n[3],b=n[4],m=n[5],p=n[6],P=n[7],A=n[8],E=n[9],O=n[10],R=n[11],y=u*u*M+f,q=o*u*M+i*c,x=i*u*M-o*c,_=u*o*M-i*c,Y=o*o*M+f,L=i*o*M+u*c,S=u*i*M+o*c,w=o*i*M-u*c,I=i*i*M+f,t[0]=h*y+b*q+A*x,t[1]=l*y+m*q+E*x,t[2]=v*y+p*q+O*x,t[3]=d*y+P*q+R*x,t[4]=h*_+b*Y+A*L,t[5]=l*_+m*Y+E*L,t[6]=v*_+p*Y+O*L,t[7]=d*_+P*Y+R*L,t[8]=h*S+b*w+A*I,t[9]=l*S+m*w+E*I,t[10]=v*S+p*w+O*I,t[11]=d*S+P*w+R*I,n!==t&&(t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]);return t},n.rotateX=function(t,n,r){var a=Math.sin(r),e=Math.cos(r),u=n[4],o=n[5],i=n[6],s=n[7],c=n[8],f=n[9],M=n[10],h=n[11];n!==t&&(t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]);return t[4]=u*e+c*a,t[5]=o*e+f*a,t[6]=i*e+M*a,t[7]=s*e+h*a,t[8]=c*e-u*a,t[9]=f*e-o*a,t[10]=M*e-i*a,t[11]=h*e-s*a,t},n.rotateY=function(t,n,r){var a=Math.sin(r),e=Math.cos(r),u=n[0],o=n[1],i=n[2],s=n[3],c=n[8],f=n[9],M=n[10],h=n[11];n!==t&&(t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]);return t[0]=u*e-c*a,t[1]=o*e-f*a,t[2]=i*e-M*a,t[3]=s*e-h*a,t[8]=u*a+c*e,t[9]=o*a+f*e,t[10]=i*a+M*e,t[11]=s*a+h*e,t},n.rotateZ=function(t,n,r){var a=Math.sin(r),e=Math.cos(r),u=n[0],o=n[1],i=n[2],s=n[3],c=n[4],f=n[5],M=n[6],h=n[7];n!==t&&(t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]);return t[0]=u*e+c*a,t[1]=o*e+f*a,t[2]=i*e+M*a,t[3]=s*e+h*a,t[4]=c*e-u*a,t[5]=f*e-o*a,t[6]=M*e-i*a,t[7]=h*e-s*a,t},n.fromTranslation=function(t,n){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=n[0],t[13]=n[1],t[14]=n[2],t[15]=1,t},n.fromScaling=function(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=n[1],t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=n[2],t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},n.fromRotation=function(t,n,r){var e=r[0],u=r[1],o=r[2],i=Math.sqrt(e*e+u*u+o*o),s=void 0,c=void 0,f=void 0;if(i<a.EPSILON)return null;return e*=i=1/i,u*=i,o*=i,s=Math.sin(n),c=Math.cos(n),f=1-c,t[0]=e*e*f+c,t[1]=u*e*f+o*s,t[2]=o*e*f-u*s,t[3]=0,t[4]=e*u*f-o*s,t[5]=u*u*f+c,t[6]=o*u*f+e*s,t[7]=0,t[8]=e*o*f+u*s,t[9]=u*o*f-e*s,t[10]=o*o*f+c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},n.fromXRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=a,t[6]=r,t[7]=0,t[8]=0,t[9]=-r,t[10]=a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},n.fromYRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=0,t[2]=-r,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=r,t[9]=0,t[10]=a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},n.fromZRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=r,t[2]=0,t[3]=0,t[4]=-r,t[5]=a,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},n.fromRotationTranslation=o,n.fromQuat2=function(t,n){var r=new a.ARRAY_TYPE(3),e=-n[0],u=-n[1],i=-n[2],s=n[3],c=n[4],f=n[5],M=n[6],h=n[7],l=e*e+u*u+i*i+s*s;l>0?(r[0]=2*(c*s+h*e+f*i-M*u)/l,r[1]=2*(f*s+h*u+M*e-c*i)/l,r[2]=2*(M*s+h*i+c*u-f*e)/l):(r[0]=2*(c*s+h*e+f*i-M*u),r[1]=2*(f*s+h*u+M*e-c*i),r[2]=2*(M*s+h*i+c*u-f*e));return o(t,n,r),t},n.getTranslation=function(t,n){return t[0]=n[12],t[1]=n[13],t[2]=n[14],t},n.getScaling=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[4],o=n[5],i=n[6],s=n[8],c=n[9],f=n[10];return t[0]=Math.sqrt(r*r+a*a+e*e),t[1]=Math.sqrt(u*u+o*o+i*i),t[2]=Math.sqrt(s*s+c*c+f*f),t},n.getRotation=function(t,n){var r=n[0]+n[5]+n[10],a=0;r>0?(a=2*Math.sqrt(r+1),t[3]=.25*a,t[0]=(n[6]-n[9])/a,t[1]=(n[8]-n[2])/a,t[2]=(n[1]-n[4])/a):n[0]>n[5]&&n[0]>n[10]?(a=2*Math.sqrt(1+n[0]-n[5]-n[10]),t[3]=(n[6]-n[9])/a,t[0]=.25*a,t[1]=(n[1]+n[4])/a,t[2]=(n[8]+n[2])/a):n[5]>n[10]?(a=2*Math.sqrt(1+n[5]-n[0]-n[10]),t[3]=(n[8]-n[2])/a,t[0]=(n[1]+n[4])/a,t[1]=.25*a,t[2]=(n[6]+n[9])/a):(a=2*Math.sqrt(1+n[10]-n[0]-n[5]),t[3]=(n[1]-n[4])/a,t[0]=(n[8]+n[2])/a,t[1]=(n[6]+n[9])/a,t[2]=.25*a);return t},n.fromRotationTranslationScale=function(t,n,r,a){var e=n[0],u=n[1],o=n[2],i=n[3],s=e+e,c=u+u,f=o+o,M=e*s,h=e*c,l=e*f,v=u*c,d=u*f,b=o*f,m=i*s,p=i*c,P=i*f,A=a[0],E=a[1],O=a[2];return t[0]=(1-(v+b))*A,t[1]=(h+P)*A,t[2]=(l-p)*A,t[3]=0,t[4]=(h-P)*E,t[5]=(1-(M+b))*E,t[6]=(d+m)*E,t[7]=0,t[8]=(l+p)*O,t[9]=(d-m)*O,t[10]=(1-(M+v))*O,t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t},n.fromRotationTranslationScaleOrigin=function(t,n,r,a,e){var u=n[0],o=n[1],i=n[2],s=n[3],c=u+u,f=o+o,M=i+i,h=u*c,l=u*f,v=u*M,d=o*f,b=o*M,m=i*M,p=s*c,P=s*f,A=s*M,E=a[0],O=a[1],R=a[2],y=e[0],q=e[1],x=e[2],_=(1-(d+m))*E,Y=(l+A)*E,L=(v-P)*E,S=(l-A)*O,w=(1-(h+m))*O,I=(b+p)*O,N=(v+P)*R,g=(b-p)*R,T=(1-(h+d))*R;return t[0]=_,t[1]=Y,t[2]=L,t[3]=0,t[4]=S,t[5]=w,t[6]=I,t[7]=0,t[8]=N,t[9]=g,t[10]=T,t[11]=0,t[12]=r[0]+y-(_*y+S*q+N*x),t[13]=r[1]+q-(Y*y+w*q+g*x),t[14]=r[2]+x-(L*y+I*q+T*x),t[15]=1,t},n.fromQuat=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r+r,i=a+a,s=e+e,c=r*o,f=a*o,M=a*i,h=e*o,l=e*i,v=e*s,d=u*o,b=u*i,m=u*s;return t[0]=1-M-v,t[1]=f+m,t[2]=h-b,t[3]=0,t[4]=f-m,t[5]=1-c-v,t[6]=l+d,t[7]=0,t[8]=h+b,t[9]=l-d,t[10]=1-c-M,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},n.frustum=function(t,n,r,a,e,u,o){var i=1/(r-n),s=1/(e-a),c=1/(u-o);return t[0]=2*u*i,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=2*u*s,t[6]=0,t[7]=0,t[8]=(r+n)*i,t[9]=(e+a)*s,t[10]=(o+u)*c,t[11]=-1,t[12]=0,t[13]=0,t[14]=o*u*2*c,t[15]=0,t},n.perspective=function(t,n,r,a,e){var u=1/Math.tan(n/2),o=void 0;t[0]=u/r,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=u,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,null!=e&&e!==1/0?(o=1/(a-e),t[10]=(e+a)*o,t[14]=2*e*a*o):(t[10]=-1,t[14]=-2*a);return t},n.perspectiveFromFieldOfView=function(t,n,r,a){var e=Math.tan(n.upDegrees*Math.PI/180),u=Math.tan(n.downDegrees*Math.PI/180),o=Math.tan(n.leftDegrees*Math.PI/180),i=Math.tan(n.rightDegrees*Math.PI/180),s=2/(o+i),c=2/(e+u);return t[0]=s,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=c,t[6]=0,t[7]=0,t[8]=-(o-i)*s*.5,t[9]=(e-u)*c*.5,t[10]=a/(r-a),t[11]=-1,t[12]=0,t[13]=0,t[14]=a*r/(r-a),t[15]=0,t},n.ortho=function(t,n,r,a,e,u,o){var i=1/(n-r),s=1/(a-e),c=1/(u-o);return t[0]=-2*i,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*s,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*c,t[11]=0,t[12]=(n+r)*i,t[13]=(e+a)*s,t[14]=(o+u)*c,t[15]=1,t},n.lookAt=function(t,n,r,u){var o=void 0,i=void 0,s=void 0,c=void 0,f=void 0,M=void 0,h=void 0,l=void 0,v=void 0,d=void 0,b=n[0],m=n[1],p=n[2],P=u[0],A=u[1],E=u[2],O=r[0],R=r[1],y=r[2];if(Math.abs(b-O)<a.EPSILON&&Math.abs(m-R)<a.EPSILON&&Math.abs(p-y)<a.EPSILON)return e(t);h=b-O,l=m-R,v=p-y,d=1/Math.sqrt(h*h+l*l+v*v),o=A*(v*=d)-E*(l*=d),i=E*(h*=d)-P*v,s=P*l-A*h,(d=Math.sqrt(o*o+i*i+s*s))?(o*=d=1/d,i*=d,s*=d):(o=0,i=0,s=0);c=l*s-v*i,f=v*o-h*s,M=h*i-l*o,(d=Math.sqrt(c*c+f*f+M*M))?(c*=d=1/d,f*=d,M*=d):(c=0,f=0,M=0);return t[0]=o,t[1]=c,t[2]=h,t[3]=0,t[4]=i,t[5]=f,t[6]=l,t[7]=0,t[8]=s,t[9]=M,t[10]=v,t[11]=0,t[12]=-(o*b+i*m+s*p),t[13]=-(c*b+f*m+M*p),t[14]=-(h*b+l*m+v*p),t[15]=1,t},n.targetTo=function(t,n,r,a){var e=n[0],u=n[1],o=n[2],i=a[0],s=a[1],c=a[2],f=e-r[0],M=u-r[1],h=o-r[2],l=f*f+M*M+h*h;l>0&&(l=1/Math.sqrt(l),f*=l,M*=l,h*=l);var v=s*h-c*M,d=c*f-i*h,b=i*M-s*f;(l=v*v+d*d+b*b)>0&&(l=1/Math.sqrt(l),v*=l,d*=l,b*=l);return t[0]=v,t[1]=d,t[2]=b,t[3]=0,t[4]=M*b-h*d,t[5]=h*v-f*b,t[6]=f*d-M*v,t[7]=0,t[8]=f,t[9]=M,t[10]=h,t[11]=0,t[12]=e,t[13]=u,t[14]=o,t[15]=1,t},n.str=function(t){return"mat4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+", "+t[9]+", "+t[10]+", "+t[11]+", "+t[12]+", "+t[13]+", "+t[14]+", "+t[15]+")"},n.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2)+Math.pow(t[9],2)+Math.pow(t[10],2)+Math.pow(t[11],2)+Math.pow(t[12],2)+Math.pow(t[13],2)+Math.pow(t[14],2)+Math.pow(t[15],2))},n.add=function(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t[3]=n[3]+r[3],t[4]=n[4]+r[4],t[5]=n[5]+r[5],t[6]=n[6]+r[6],t[7]=n[7]+r[7],t[8]=n[8]+r[8],t[9]=n[9]+r[9],t[10]=n[10]+r[10],t[11]=n[11]+r[11],t[12]=n[12]+r[12],t[13]=n[13]+r[13],t[14]=n[14]+r[14],t[15]=n[15]+r[15],t},n.subtract=i,n.multiplyScalar=function(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=n[3]*r,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=n[7]*r,t[8]=n[8]*r,t[9]=n[9]*r,t[10]=n[10]*r,t[11]=n[11]*r,t[12]=n[12]*r,t[13]=n[13]*r,t[14]=n[14]*r,t[15]=n[15]*r,t},n.multiplyScalarAndAdd=function(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t[2]=n[2]+r[2]*a,t[3]=n[3]+r[3]*a,t[4]=n[4]+r[4]*a,t[5]=n[5]+r[5]*a,t[6]=n[6]+r[6]*a,t[7]=n[7]+r[7]*a,t[8]=n[8]+r[8]*a,t[9]=n[9]+r[9]*a,t[10]=n[10]+r[10]*a,t[11]=n[11]+r[11]*a,t[12]=n[12]+r[12]*a,t[13]=n[13]+r[13]*a,t[14]=n[14]+r[14]*a,t[15]=n[15]+r[15]*a,t},n.exactEquals=function(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]&&t[4]===n[4]&&t[5]===n[5]&&t[6]===n[6]&&t[7]===n[7]&&t[8]===n[8]&&t[9]===n[9]&&t[10]===n[10]&&t[11]===n[11]&&t[12]===n[12]&&t[13]===n[13]&&t[14]===n[14]&&t[15]===n[15]},n.equals=function(t,n){var r=t[0],e=t[1],u=t[2],o=t[3],i=t[4],s=t[5],c=t[6],f=t[7],M=t[8],h=t[9],l=t[10],v=t[11],d=t[12],b=t[13],m=t[14],p=t[15],P=n[0],A=n[1],E=n[2],O=n[3],R=n[4],y=n[5],q=n[6],x=n[7],_=n[8],Y=n[9],L=n[10],S=n[11],w=n[12],I=n[13],N=n[14],g=n[15];return Math.abs(r-P)<=a.EPSILON*Math.max(1,Math.abs(r),Math.abs(P))&&Math.abs(e-A)<=a.EPSILON*Math.max(1,Math.abs(e),Math.abs(A))&&Math.abs(u-E)<=a.EPSILON*Math.max(1,Math.abs(u),Math.abs(E))&&Math.abs(o-O)<=a.EPSILON*Math.max(1,Math.abs(o),Math.abs(O))&&Math.abs(i-R)<=a.EPSILON*Math.max(1,Math.abs(i),Math.abs(R))&&Math.abs(s-y)<=a.EPSILON*Math.max(1,Math.abs(s),Math.abs(y))&&Math.abs(c-q)<=a.EPSILON*Math.max(1,Math.abs(c),Math.abs(q))&&Math.abs(f-x)<=a.EPSILON*Math.max(1,Math.abs(f),Math.abs(x))&&Math.abs(M-_)<=a.EPSILON*Math.max(1,Math.abs(M),Math.abs(_))&&Math.abs(h-Y)<=a.EPSILON*Math.max(1,Math.abs(h),Math.abs(Y))&&Math.abs(l-L)<=a.EPSILON*Math.max(1,Math.abs(l),Math.abs(L))&&Math.abs(v-S)<=a.EPSILON*Math.max(1,Math.abs(v),Math.abs(S))&&Math.abs(d-w)<=a.EPSILON*Math.max(1,Math.abs(d),Math.abs(w))&&Math.abs(b-I)<=a.EPSILON*Math.max(1,Math.abs(b),Math.abs(I))&&Math.abs(m-N)<=a.EPSILON*Math.max(1,Math.abs(m),Math.abs(N))&&Math.abs(p-g)<=a.EPSILON*Math.max(1,Math.abs(p),Math.abs(g))};var a=function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}(r(0));function e(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function u(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],s=n[5],c=n[6],f=n[7],M=n[8],h=n[9],l=n[10],v=n[11],d=n[12],b=n[13],m=n[14],p=n[15],P=r[0],A=r[1],E=r[2],O=r[3];return t[0]=P*a+A*i+E*M+O*d,t[1]=P*e+A*s+E*h+O*b,t[2]=P*u+A*c+E*l+O*m,t[3]=P*o+A*f+E*v+O*p,P=r[4],A=r[5],E=r[6],O=r[7],t[4]=P*a+A*i+E*M+O*d,t[5]=P*e+A*s+E*h+O*b,t[6]=P*u+A*c+E*l+O*m,t[7]=P*o+A*f+E*v+O*p,P=r[8],A=r[9],E=r[10],O=r[11],t[8]=P*a+A*i+E*M+O*d,t[9]=P*e+A*s+E*h+O*b,t[10]=P*u+A*c+E*l+O*m,t[11]=P*o+A*f+E*v+O*p,P=r[12],A=r[13],E=r[14],O=r[15],t[12]=P*a+A*i+E*M+O*d,t[13]=P*e+A*s+E*h+O*b,t[14]=P*u+A*c+E*l+O*m,t[15]=P*o+A*f+E*v+O*p,t}function o(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=a+a,s=e+e,c=u+u,f=a*i,M=a*s,h=a*c,l=e*s,v=e*c,d=u*c,b=o*i,m=o*s,p=o*c;return t[0]=1-(l+d),t[1]=M+p,t[2]=h-m,t[3]=0,t[4]=M-p,t[5]=1-(f+d),t[6]=v+b,t[7]=0,t[8]=h+m,t[9]=v-b,t[10]=1-(f+l),t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t}function i(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t[3]=n[3]-r[3],t[4]=n[4]-r[4],t[5]=n[5]-r[5],t[6]=n[6]-r[6],t[7]=n[7]-r[7],t[8]=n[8]-r[8],t[9]=n[9]-r[9],t[10]=n[10]-r[10],t[11]=n[11]-r[11],t[12]=n[12]-r[12],t[13]=n[13]-r[13],t[14]=n[14]-r[14],t[15]=n[15]-r[15],t}n.mul=u,n.sub=i},function(t,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.sub=n.mul=void 0,n.create=function(){var t=new a.ARRAY_TYPE(9);a.ARRAY_TYPE!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[5]=0,t[6]=0,t[7]=0);return t[0]=1,t[4]=1,t[8]=1,t},n.fromMat4=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[4],t[4]=n[5],t[5]=n[6],t[6]=n[8],t[7]=n[9],t[8]=n[10],t},n.clone=function(t){var n=new a.ARRAY_TYPE(9);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n},n.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t},n.fromValues=function(t,n,r,e,u,o,i,s,c){var f=new a.ARRAY_TYPE(9);return f[0]=t,f[1]=n,f[2]=r,f[3]=e,f[4]=u,f[5]=o,f[6]=i,f[7]=s,f[8]=c,f},n.set=function(t,n,r,a,e,u,o,i,s,c){return t[0]=n,t[1]=r,t[2]=a,t[3]=e,t[4]=u,t[5]=o,t[6]=i,t[7]=s,t[8]=c,t},n.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},n.transpose=function(t,n){if(t===n){var r=n[1],a=n[2],e=n[5];t[1]=n[3],t[2]=n[6],t[3]=r,t[5]=n[7],t[6]=a,t[7]=e}else t[0]=n[0],t[1]=n[3],t[2]=n[6],t[3]=n[1],t[4]=n[4],t[5]=n[7],t[6]=n[2],t[7]=n[5],t[8]=n[8];return t},n.invert=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],s=n[6],c=n[7],f=n[8],M=f*o-i*c,h=-f*u+i*s,l=c*u-o*s,v=r*M+a*h+e*l;if(!v)return null;return v=1/v,t[0]=M*v,t[1]=(-f*a+e*c)*v,t[2]=(i*a-e*o)*v,t[3]=h*v,t[4]=(f*r-e*s)*v,t[5]=(-i*r+e*u)*v,t[6]=l*v,t[7]=(-c*r+a*s)*v,t[8]=(o*r-a*u)*v,t},n.adjoint=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],s=n[6],c=n[7],f=n[8];return t[0]=o*f-i*c,t[1]=e*c-a*f,t[2]=a*i-e*o,t[3]=i*s-u*f,t[4]=r*f-e*s,t[5]=e*u-r*i,t[6]=u*c-o*s,t[7]=a*s-r*c,t[8]=r*o-a*u,t},n.determinant=function(t){var n=t[0],r=t[1],a=t[2],e=t[3],u=t[4],o=t[5],i=t[6],s=t[7],c=t[8];return n*(c*u-o*s)+r*(-c*e+o*i)+a*(s*e-u*i)},n.multiply=e,n.translate=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],s=n[5],c=n[6],f=n[7],M=n[8],h=r[0],l=r[1];return t[0]=a,t[1]=e,t[2]=u,t[3]=o,t[4]=i,t[5]=s,t[6]=h*a+l*o+c,t[7]=h*e+l*i+f,t[8]=h*u+l*s+M,t},n.rotate=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],s=n[5],c=n[6],f=n[7],M=n[8],h=Math.sin(r),l=Math.cos(r);return t[0]=l*a+h*o,t[1]=l*e+h*i,t[2]=l*u+h*s,t[3]=l*o-h*a,t[4]=l*i-h*e,t[5]=l*s-h*u,t[6]=c,t[7]=f,t[8]=M,t},n.scale=function(t,n,r){var a=r[0],e=r[1];return t[0]=a*n[0],t[1]=a*n[1],t[2]=a*n[2],t[3]=e*n[3],t[4]=e*n[4],t[5]=e*n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t},n.fromTranslation=function(t,n){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=n[0],t[7]=n[1],t[8]=1,t},n.fromRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=r,t[2]=0,t[3]=-r,t[4]=a,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},n.fromScaling=function(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=0,t[4]=n[1],t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},n.fromMat2d=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=0,t[3]=n[2],t[4]=n[3],t[5]=0,t[6]=n[4],t[7]=n[5],t[8]=1,t},n.fromQuat=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r+r,i=a+a,s=e+e,c=r*o,f=a*o,M=a*i,h=e*o,l=e*i,v=e*s,d=u*o,b=u*i,m=u*s;return t[0]=1-M-v,t[3]=f-m,t[6]=h+b,t[1]=f+m,t[4]=1-c-v,t[7]=l-d,t[2]=h-b,t[5]=l+d,t[8]=1-c-M,t},n.normalFromMat4=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],s=n[6],c=n[7],f=n[8],M=n[9],h=n[10],l=n[11],v=n[12],d=n[13],b=n[14],m=n[15],p=r*i-a*o,P=r*s-e*o,A=r*c-u*o,E=a*s-e*i,O=a*c-u*i,R=e*c-u*s,y=f*d-M*v,q=f*b-h*v,x=f*m-l*v,_=M*b-h*d,Y=M*m-l*d,L=h*m-l*b,S=p*L-P*Y+A*_+E*x-O*q+R*y;if(!S)return null;return S=1/S,t[0]=(i*L-s*Y+c*_)*S,t[1]=(s*x-o*L-c*q)*S,t[2]=(o*Y-i*x+c*y)*S,t[3]=(e*Y-a*L-u*_)*S,t[4]=(r*L-e*x+u*q)*S,t[5]=(a*x-r*Y-u*y)*S,t[6]=(d*R-b*O+m*E)*S,t[7]=(b*A-v*R-m*P)*S,t[8]=(v*O-d*A+m*p)*S,t},n.projection=function(t,n,r){return t[0]=2/n,t[1]=0,t[2]=0,t[3]=0,t[4]=-2/r,t[5]=0,t[6]=-1,t[7]=1,t[8]=1,t},n.str=function(t){return"mat3("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+")"},n.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2))},n.add=function(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t[3]=n[3]+r[3],t[4]=n[4]+r[4],t[5]=n[5]+r[5],t[6]=n[6]+r[6],t[7]=n[7]+r[7],t[8]=n[8]+r[8],t},n.subtract=u,n.multiplyScalar=function(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=n[3]*r,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=n[7]*r,t[8]=n[8]*r,t},n.multiplyScalarAndAdd=function(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t[2]=n[2]+r[2]*a,t[3]=n[3]+r[3]*a,t[4]=n[4]+r[4]*a,t[5]=n[5]+r[5]*a,t[6]=n[6]+r[6]*a,t[7]=n[7]+r[7]*a,t[8]=n[8]+r[8]*a,t},n.exactEquals=function(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]&&t[4]===n[4]&&t[5]===n[5]&&t[6]===n[6]&&t[7]===n[7]&&t[8]===n[8]},n.equals=function(t,n){var r=t[0],e=t[1],u=t[2],o=t[3],i=t[4],s=t[5],c=t[6],f=t[7],M=t[8],h=n[0],l=n[1],v=n[2],d=n[3],b=n[4],m=n[5],p=n[6],P=n[7],A=n[8];return Math.abs(r-h)<=a.EPSILON*Math.max(1,Math.abs(r),Math.abs(h))&&Math.abs(e-l)<=a.EPSILON*Math.max(1,Math.abs(e),Math.abs(l))&&Math.abs(u-v)<=a.EPSILON*Math.max(1,Math.abs(u),Math.abs(v))&&Math.abs(o-d)<=a.EPSILON*Math.max(1,Math.abs(o),Math.abs(d))&&Math.abs(i-b)<=a.EPSILON*Math.max(1,Math.abs(i),Math.abs(b))&&Math.abs(s-m)<=a.EPSILON*Math.max(1,Math.abs(s),Math.abs(m))&&Math.abs(c-p)<=a.EPSILON*Math.max(1,Math.abs(c),Math.abs(p))&&Math.abs(f-P)<=a.EPSILON*Math.max(1,Math.abs(f),Math.abs(P))&&Math.abs(M-A)<=a.EPSILON*Math.max(1,Math.abs(M),Math.abs(A))};var a=function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}(r(0));function e(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],s=n[5],c=n[6],f=n[7],M=n[8],h=r[0],l=r[1],v=r[2],d=r[3],b=r[4],m=r[5],p=r[6],P=r[7],A=r[8];return t[0]=h*a+l*o+v*c,t[1]=h*e+l*i+v*f,t[2]=h*u+l*s+v*M,t[3]=d*a+b*o+m*c,t[4]=d*e+b*i+m*f,t[5]=d*u+b*s+m*M,t[6]=p*a+P*o+A*c,t[7]=p*e+P*i+A*f,t[8]=p*u+P*s+A*M,t}function u(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t[3]=n[3]-r[3],t[4]=n[4]-r[4],t[5]=n[5]-r[5],t[6]=n[6]-r[6],t[7]=n[7]-r[7],t[8]=n[8]-r[8],t}n.mul=e,n.sub=u},function(t,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.forEach=n.sqrLen=n.sqrDist=n.dist=n.div=n.mul=n.sub=n.len=void 0,n.create=e,n.clone=function(t){var n=new a.ARRAY_TYPE(2);return n[0]=t[0],n[1]=t[1],n},n.fromValues=function(t,n){var r=new a.ARRAY_TYPE(2);return r[0]=t,r[1]=n,r},n.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t},n.set=function(t,n,r){return t[0]=n,t[1]=r,t},n.add=function(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t},n.subtract=u,n.multiply=o,n.divide=i,n.ceil=function(t,n){return t[0]=Math.ceil(n[0]),t[1]=Math.ceil(n[1]),t},n.floor=function(t,n){return t[0]=Math.floor(n[0]),t[1]=Math.floor(n[1]),t},n.min=function(t,n,r){return t[0]=Math.min(n[0],r[0]),t[1]=Math.min(n[1],r[1]),t},n.max=function(t,n,r){return t[0]=Math.max(n[0],r[0]),t[1]=Math.max(n[1],r[1]),t},n.round=function(t,n){return t[0]=Math.round(n[0]),t[1]=Math.round(n[1]),t},n.scale=function(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t},n.scaleAndAdd=function(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t},n.distance=s,n.squaredDistance=c,n.length=f,n.squaredLength=M,n.negate=function(t,n){return t[0]=-n[0],t[1]=-n[1],t},n.inverse=function(t,n){return t[0]=1/n[0],t[1]=1/n[1],t},n.normalize=function(t,n){var r=n[0],a=n[1],e=r*r+a*a;e>0&&(e=1/Math.sqrt(e),t[0]=n[0]*e,t[1]=n[1]*e);return t},n.dot=function(t,n){return t[0]*n[0]+t[1]*n[1]},n.cross=function(t,n,r){var a=n[0]*r[1]-n[1]*r[0];return t[0]=t[1]=0,t[2]=a,t},n.lerp=function(t,n,r,a){var e=n[0],u=n[1];return t[0]=e+a*(r[0]-e),t[1]=u+a*(r[1]-u),t},n.random=function(t,n){n=n||1;var r=2*a.RANDOM()*Math.PI;return t[0]=Math.cos(r)*n,t[1]=Math.sin(r)*n,t},n.transformMat2=function(t,n,r){var a=n[0],e=n[1];return t[0]=r[0]*a+r[2]*e,t[1]=r[1]*a+r[3]*e,t},n.transformMat2d=function(t,n,r){var a=n[0],e=n[1];return t[0]=r[0]*a+r[2]*e+r[4],t[1]=r[1]*a+r[3]*e+r[5],t},n.transformMat3=function(t,n,r){var a=n[0],e=n[1];return t[0]=r[0]*a+r[3]*e+r[6],t[1]=r[1]*a+r[4]*e+r[7],t},n.transformMat4=function(t,n,r){var a=n[0],e=n[1];return t[0]=r[0]*a+r[4]*e+r[12],t[1]=r[1]*a+r[5]*e+r[13],t},n.rotate=function(t,n,r,a){var e=n[0]-r[0],u=n[1]-r[1],o=Math.sin(a),i=Math.cos(a);return t[0]=e*i-u*o+r[0],t[1]=e*o+u*i+r[1],t},n.angle=function(t,n){var r=t[0],a=t[1],e=n[0],u=n[1],o=r*r+a*a;o>0&&(o=1/Math.sqrt(o));var i=e*e+u*u;i>0&&(i=1/Math.sqrt(i));var s=(r*e+a*u)*o*i;return s>1?0:s<-1?Math.PI:Math.acos(s)},n.str=function(t){return"vec2("+t[0]+", "+t[1]+")"},n.exactEquals=function(t,n){return t[0]===n[0]&&t[1]===n[1]},n.equals=function(t,n){var r=t[0],e=t[1],u=n[0],o=n[1];return Math.abs(r-u)<=a.EPSILON*Math.max(1,Math.abs(r),Math.abs(u))&&Math.abs(e-o)<=a.EPSILON*Math.max(1,Math.abs(e),Math.abs(o))};var a=function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}(r(0));function e(){var t=new a.ARRAY_TYPE(2);return a.ARRAY_TYPE!=Float32Array&&(t[0]=0,t[1]=0),t}function u(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t}function o(t,n,r){return t[0]=n[0]*r[0],t[1]=n[1]*r[1],t}function i(t,n,r){return t[0]=n[0]/r[0],t[1]=n[1]/r[1],t}function s(t,n){var r=n[0]-t[0],a=n[1]-t[1];return Math.sqrt(r*r+a*a)}function c(t,n){var r=n[0]-t[0],a=n[1]-t[1];return r*r+a*a}function f(t){var n=t[0],r=t[1];return Math.sqrt(n*n+r*r)}function M(t){var n=t[0],r=t[1];return n*n+r*r}n.len=f,n.sub=u,n.mul=o,n.div=i,n.dist=s,n.sqrDist=c,n.sqrLen=M,n.forEach=function(){var t=e();return function(n,r,a,e,u,o){var i=void 0,s=void 0;for(r||(r=2),a||(a=0),s=e?Math.min(e*r+a,n.length):n.length,i=a;i<s;i+=r)t[0]=n[i],t[1]=n[i+1],u(t,t,o),n[i]=t[0],n[i+1]=t[1];return n}}()},function(t,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.sqrLen=n.squaredLength=n.len=n.length=n.dot=n.mul=n.setReal=n.getReal=void 0,n.create=function(){var t=new a.ARRAY_TYPE(8);a.ARRAY_TYPE!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[4]=0,t[5]=0,t[6]=0,t[7]=0);return t[3]=1,t},n.clone=function(t){var n=new a.ARRAY_TYPE(8);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n},n.fromValues=function(t,n,r,e,u,o,i,s){var c=new a.ARRAY_TYPE(8);return c[0]=t,c[1]=n,c[2]=r,c[3]=e,c[4]=u,c[5]=o,c[6]=i,c[7]=s,c},n.fromRotationTranslationValues=function(t,n,r,e,u,o,i){var s=new a.ARRAY_TYPE(8);s[0]=t,s[1]=n,s[2]=r,s[3]=e;var c=.5*u,f=.5*o,M=.5*i;return s[4]=c*e+f*r-M*n,s[5]=f*e+M*t-c*r,s[6]=M*e+c*n-f*t,s[7]=-c*t-f*n-M*r,s},n.fromRotationTranslation=i,n.fromTranslation=function(t,n){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t[4]=.5*n[0],t[5]=.5*n[1],t[6]=.5*n[2],t[7]=0,t},n.fromRotation=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=0,t[5]=0,t[6]=0,t[7]=0,t},n.fromMat4=function(t,n){var r=e.create();u.getRotation(r,n);var o=new a.ARRAY_TYPE(3);return u.getTranslation(o,n),i(t,r,o),t},n.copy=s,n.identity=function(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t[6]=0,t[7]=0,t},n.set=function(t,n,r,a,e,u,o,i,s){return t[0]=n,t[1]=r,t[2]=a,t[3]=e,t[4]=u,t[5]=o,t[6]=i,t[7]=s,t},n.getDual=function(t,n){return t[0]=n[4],t[1]=n[5],t[2]=n[6],t[3]=n[7],t},n.setDual=function(t,n){return t[4]=n[0],t[5]=n[1],t[6]=n[2],t[7]=n[3],t},n.getTranslation=function(t,n){var r=n[4],a=n[5],e=n[6],u=n[7],o=-n[0],i=-n[1],s=-n[2],c=n[3];return t[0]=2*(r*c+u*o+a*s-e*i),t[1]=2*(a*c+u*i+e*o-r*s),t[2]=2*(e*c+u*s+r*i-a*o),t},n.translate=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=.5*r[0],s=.5*r[1],c=.5*r[2],f=n[4],M=n[5],h=n[6],l=n[7];return t[0]=a,t[1]=e,t[2]=u,t[3]=o,t[4]=o*i+e*c-u*s+f,t[5]=o*s+u*i-a*c+M,t[6]=o*c+a*s-e*i+h,t[7]=-a*i-e*s-u*c+l,t},n.rotateX=function(t,n,r){var a=-n[0],u=-n[1],o=-n[2],i=n[3],s=n[4],c=n[5],f=n[6],M=n[7],h=s*i+M*a+c*o-f*u,l=c*i+M*u+f*a-s*o,v=f*i+M*o+s*u-c*a,d=M*i-s*a-c*u-f*o;return e.rotateX(t,n,r),a=t[0],u=t[1],o=t[2],i=t[3],t[4]=h*i+d*a+l*o-v*u,t[5]=l*i+d*u+v*a-h*o,t[6]=v*i+d*o+h*u-l*a,t[7]=d*i-h*a-l*u-v*o,t},n.rotateY=function(t,n,r){var a=-n[0],u=-n[1],o=-n[2],i=n[3],s=n[4],c=n[5],f=n[6],M=n[7],h=s*i+M*a+c*o-f*u,l=c*i+M*u+f*a-s*o,v=f*i+M*o+s*u-c*a,d=M*i-s*a-c*u-f*o;return e.rotateY(t,n,r),a=t[0],u=t[1],o=t[2],i=t[3],t[4]=h*i+d*a+l*o-v*u,t[5]=l*i+d*u+v*a-h*o,t[6]=v*i+d*o+h*u-l*a,t[7]=d*i-h*a-l*u-v*o,t},n.rotateZ=function(t,n,r){var a=-n[0],u=-n[1],o=-n[2],i=n[3],s=n[4],c=n[5],f=n[6],M=n[7],h=s*i+M*a+c*o-f*u,l=c*i+M*u+f*a-s*o,v=f*i+M*o+s*u-c*a,d=M*i-s*a-c*u-f*o;return e.rotateZ(t,n,r),a=t[0],u=t[1],o=t[2],i=t[3],t[4]=h*i+d*a+l*o-v*u,t[5]=l*i+d*u+v*a-h*o,t[6]=v*i+d*o+h*u-l*a,t[7]=d*i-h*a-l*u-v*o,t},n.rotateByQuatAppend=function(t,n,r){var a=r[0],e=r[1],u=r[2],o=r[3],i=n[0],s=n[1],c=n[2],f=n[3];return t[0]=i*o+f*a+s*u-c*e,t[1]=s*o+f*e+c*a-i*u,t[2]=c*o+f*u+i*e-s*a,t[3]=f*o-i*a-s*e-c*u,i=n[4],s=n[5],c=n[6],f=n[7],t[4]=i*o+f*a+s*u-c*e,t[5]=s*o+f*e+c*a-i*u,t[6]=c*o+f*u+i*e-s*a,t[7]=f*o-i*a-s*e-c*u,t},n.rotateByQuatPrepend=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=r[0],s=r[1],c=r[2],f=r[3];return t[0]=a*f+o*i+e*c-u*s,t[1]=e*f+o*s+u*i-a*c,t[2]=u*f+o*c+a*s-e*i,t[3]=o*f-a*i-e*s-u*c,i=r[4],s=r[5],c=r[6],f=r[7],t[4]=a*f+o*i+e*c-u*s,t[5]=e*f+o*s+u*i-a*c,t[6]=u*f+o*c+a*s-e*i,t[7]=o*f-a*i-e*s-u*c,t},n.rotateAroundAxis=function(t,n,r,e){if(Math.abs(e)<a.EPSILON)return s(t,n);var u=Math.sqrt(r[0]*r[0]+r[1]*r[1]+r[2]*r[2]);e*=.5;var o=Math.sin(e),i=o*r[0]/u,c=o*r[1]/u,f=o*r[2]/u,M=Math.cos(e),h=n[0],l=n[1],v=n[2],d=n[3];t[0]=h*M+d*i+l*f-v*c,t[1]=l*M+d*c+v*i-h*f,t[2]=v*M+d*f+h*c-l*i,t[3]=d*M-h*i-l*c-v*f;var b=n[4],m=n[5],p=n[6],P=n[7];return t[4]=b*M+P*i+m*f-p*c,t[5]=m*M+P*c+p*i-b*f,t[6]=p*M+P*f+b*c-m*i,t[7]=P*M-b*i-m*c-p*f,t},n.add=function(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t[3]=n[3]+r[3],t[4]=n[4]+r[4],t[5]=n[5]+r[5],t[6]=n[6]+r[6],t[7]=n[7]+r[7],t},n.multiply=c,n.scale=function(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=n[3]*r,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=n[7]*r,t},n.lerp=function(t,n,r,a){var e=1-a;f(n,r)<0&&(a=-a);return t[0]=n[0]*e+r[0]*a,t[1]=n[1]*e+r[1]*a,t[2]=n[2]*e+r[2]*a,t[3]=n[3]*e+r[3]*a,t[4]=n[4]*e+r[4]*a,t[5]=n[5]*e+r[5]*a,t[6]=n[6]*e+r[6]*a,t[7]=n[7]*e+r[7]*a,t},n.invert=function(t,n){var r=h(n);return t[0]=-n[0]/r,t[1]=-n[1]/r,t[2]=-n[2]/r,t[3]=n[3]/r,t[4]=-n[4]/r,t[5]=-n[5]/r,t[6]=-n[6]/r,t[7]=n[7]/r,t},n.conjugate=function(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t[3]=n[3],t[4]=-n[4],t[5]=-n[5],t[6]=-n[6],t[7]=n[7],t},n.normalize=function(t,n){var r=h(n);if(r>0){r=Math.sqrt(r);var a=n[0]/r,e=n[1]/r,u=n[2]/r,o=n[3]/r,i=n[4],s=n[5],c=n[6],f=n[7],M=a*i+e*s+u*c+o*f;t[0]=a,t[1]=e,t[2]=u,t[3]=o,t[4]=(i-a*M)/r,t[5]=(s-e*M)/r,t[6]=(c-u*M)/r,t[7]=(f-o*M)/r}return t},n.str=function(t){return"quat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+")"},n.exactEquals=function(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]&&t[4]===n[4]&&t[5]===n[5]&&t[6]===n[6]&&t[7]===n[7]},n.equals=function(t,n){var r=t[0],e=t[1],u=t[2],o=t[3],i=t[4],s=t[5],c=t[6],f=t[7],M=n[0],h=n[1],l=n[2],v=n[3],d=n[4],b=n[5],m=n[6],p=n[7];return Math.abs(r-M)<=a.EPSILON*Math.max(1,Math.abs(r),Math.abs(M))&&Math.abs(e-h)<=a.EPSILON*Math.max(1,Math.abs(e),Math.abs(h))&&Math.abs(u-l)<=a.EPSILON*Math.max(1,Math.abs(u),Math.abs(l))&&Math.abs(o-v)<=a.EPSILON*Math.max(1,Math.abs(o),Math.abs(v))&&Math.abs(i-d)<=a.EPSILON*Math.max(1,Math.abs(i),Math.abs(d))&&Math.abs(s-b)<=a.EPSILON*Math.max(1,Math.abs(s),Math.abs(b))&&Math.abs(c-m)<=a.EPSILON*Math.max(1,Math.abs(c),Math.abs(m))&&Math.abs(f-p)<=a.EPSILON*Math.max(1,Math.abs(f),Math.abs(p))};var a=o(r(0)),e=o(r(3)),u=o(r(4));function o(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}function i(t,n,r){var a=.5*r[0],e=.5*r[1],u=.5*r[2],o=n[0],i=n[1],s=n[2],c=n[3];return t[0]=o,t[1]=i,t[2]=s,t[3]=c,t[4]=a*c+e*s-u*i,t[5]=e*c+u*o-a*s,t[6]=u*c+a*i-e*o,t[7]=-a*o-e*i-u*s,t}function s(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t}n.getReal=e.copy;n.setReal=e.copy;function c(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=r[4],s=r[5],c=r[6],f=r[7],M=n[4],h=n[5],l=n[6],v=n[7],d=r[0],b=r[1],m=r[2],p=r[3];return t[0]=a*p+o*d+e*m-u*b,t[1]=e*p+o*b+u*d-a*m,t[2]=u*p+o*m+a*b-e*d,t[3]=o*p-a*d-e*b-u*m,t[4]=a*f+o*i+e*c-u*s+M*p+v*d+h*m-l*b,t[5]=e*f+o*s+u*i-a*c+h*p+v*b+l*d-M*m,t[6]=u*f+o*c+a*s-e*i+l*p+v*m+M*b-h*d,t[7]=o*f-a*i-e*s-u*c+v*p-M*d-h*b-l*m,t}n.mul=c;var f=n.dot=e.dot;var M=n.length=e.length,h=(n.len=M,n.squaredLength=e.squaredLength);n.sqrLen=h},function(t,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.sub=n.mul=void 0,n.create=function(){var t=new a.ARRAY_TYPE(6);a.ARRAY_TYPE!=Float32Array&&(t[1]=0,t[2]=0,t[4]=0,t[5]=0);return t[0]=1,t[3]=1,t},n.clone=function(t){var n=new a.ARRAY_TYPE(6);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n},n.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t},n.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},n.fromValues=function(t,n,r,e,u,o){var i=new a.ARRAY_TYPE(6);return i[0]=t,i[1]=n,i[2]=r,i[3]=e,i[4]=u,i[5]=o,i},n.set=function(t,n,r,a,e,u,o){return t[0]=n,t[1]=r,t[2]=a,t[3]=e,t[4]=u,t[5]=o,t},n.invert=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],s=r*u-a*e;if(!s)return null;return s=1/s,t[0]=u*s,t[1]=-a*s,t[2]=-e*s,t[3]=r*s,t[4]=(e*i-u*o)*s,t[5]=(a*o-r*i)*s,t},n.determinant=function(t){return t[0]*t[3]-t[1]*t[2]},n.multiply=e,n.rotate=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],s=n[5],c=Math.sin(r),f=Math.cos(r);return t[0]=a*f+u*c,t[1]=e*f+o*c,t[2]=a*-c+u*f,t[3]=e*-c+o*f,t[4]=i,t[5]=s,t},n.scale=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],s=n[5],c=r[0],f=r[1];return t[0]=a*c,t[1]=e*c,t[2]=u*f,t[3]=o*f,t[4]=i,t[5]=s,t},n.translate=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],s=n[5],c=r[0],f=r[1];return t[0]=a,t[1]=e,t[2]=u,t[3]=o,t[4]=a*c+u*f+i,t[5]=e*c+o*f+s,t},n.fromRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=r,t[2]=-r,t[3]=a,t[4]=0,t[5]=0,t},n.fromScaling=function(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=n[1],t[4]=0,t[5]=0,t},n.fromTranslation=function(t,n){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=n[0],t[5]=n[1],t},n.str=function(t){return"mat2d("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+")"},n.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+1)},n.add=function(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t[3]=n[3]+r[3],t[4]=n[4]+r[4],t[5]=n[5]+r[5],t},n.subtract=u,n.multiplyScalar=function(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=n[3]*r,t[4]=n[4]*r,t[5]=n[5]*r,t},n.multiplyScalarAndAdd=function(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t[2]=n[2]+r[2]*a,t[3]=n[3]+r[3]*a,t[4]=n[4]+r[4]*a,t[5]=n[5]+r[5]*a,t},n.exactEquals=function(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]&&t[4]===n[4]&&t[5]===n[5]},n.equals=function(t,n){var r=t[0],e=t[1],u=t[2],o=t[3],i=t[4],s=t[5],c=n[0],f=n[1],M=n[2],h=n[3],l=n[4],v=n[5];return Math.abs(r-c)<=a.EPSILON*Math.max(1,Math.abs(r),Math.abs(c))&&Math.abs(e-f)<=a.EPSILON*Math.max(1,Math.abs(e),Math.abs(f))&&Math.abs(u-M)<=a.EPSILON*Math.max(1,Math.abs(u),Math.abs(M))&&Math.abs(o-h)<=a.EPSILON*Math.max(1,Math.abs(o),Math.abs(h))&&Math.abs(i-l)<=a.EPSILON*Math.max(1,Math.abs(i),Math.abs(l))&&Math.abs(s-v)<=a.EPSILON*Math.max(1,Math.abs(s),Math.abs(v))};var a=function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}(r(0));function e(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],s=n[5],c=r[0],f=r[1],M=r[2],h=r[3],l=r[4],v=r[5];return t[0]=a*c+u*f,t[1]=e*c+o*f,t[2]=a*M+u*h,t[3]=e*M+o*h,t[4]=a*l+u*v+i,t[5]=e*l+o*v+s,t}function u(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t[3]=n[3]-r[3],t[4]=n[4]-r[4],t[5]=n[5]-r[5],t}n.mul=e,n.sub=u},function(t,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.sub=n.mul=void 0,n.create=function(){var t=new a.ARRAY_TYPE(4);a.ARRAY_TYPE!=Float32Array&&(t[1]=0,t[2]=0);return t[0]=1,t[3]=1,t},n.clone=function(t){var n=new a.ARRAY_TYPE(4);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n},n.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t},n.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},n.fromValues=function(t,n,r,e){var u=new a.ARRAY_TYPE(4);return u[0]=t,u[1]=n,u[2]=r,u[3]=e,u},n.set=function(t,n,r,a,e){return t[0]=n,t[1]=r,t[2]=a,t[3]=e,t},n.transpose=function(t,n){if(t===n){var r=n[1];t[1]=n[2],t[2]=r}else t[0]=n[0],t[1]=n[2],t[2]=n[1],t[3]=n[3];return t},n.invert=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r*u-e*a;if(!o)return null;return o=1/o,t[0]=u*o,t[1]=-a*o,t[2]=-e*o,t[3]=r*o,t},n.adjoint=function(t,n){var r=n[0];return t[0]=n[3],t[1]=-n[1],t[2]=-n[2],t[3]=r,t},n.determinant=function(t){return t[0]*t[3]-t[2]*t[1]},n.multiply=e,n.rotate=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=Math.sin(r),s=Math.cos(r);return t[0]=a*s+u*i,t[1]=e*s+o*i,t[2]=a*-i+u*s,t[3]=e*-i+o*s,t},n.scale=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=r[0],s=r[1];return t[0]=a*i,t[1]=e*i,t[2]=u*s,t[3]=o*s,t},n.fromRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=r,t[2]=-r,t[3]=a,t},n.fromScaling=function(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=n[1],t},n.str=function(t){return"mat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},n.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2))},n.LDU=function(t,n,r,a){return t[2]=a[2]/a[0],r[0]=a[0],r[1]=a[1],r[3]=a[3]-t[2]*r[1],[t,n,r]},n.add=function(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t[3]=n[3]+r[3],t},n.subtract=u,n.exactEquals=function(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]},n.equals=function(t,n){var r=t[0],e=t[1],u=t[2],o=t[3],i=n[0],s=n[1],c=n[2],f=n[3];return Math.abs(r-i)<=a.EPSILON*Math.max(1,Math.abs(r),Math.abs(i))&&Math.abs(e-s)<=a.EPSILON*Math.max(1,Math.abs(e),Math.abs(s))&&Math.abs(u-c)<=a.EPSILON*Math.max(1,Math.abs(u),Math.abs(c))&&Math.abs(o-f)<=a.EPSILON*Math.max(1,Math.abs(o),Math.abs(f))},n.multiplyScalar=function(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=n[3]*r,t},n.multiplyScalarAndAdd=function(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t[2]=n[2]+r[2]*a,t[3]=n[3]+r[3]*a,t};var a=function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}(r(0));function e(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=r[0],s=r[1],c=r[2],f=r[3];return t[0]=a*i+u*s,t[1]=e*i+o*s,t[2]=a*c+u*f,t[3]=e*c+o*f,t}function u(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t[3]=n[3]-r[3],t}n.mul=e,n.sub=u},function(t,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.vec4=n.vec3=n.vec2=n.quat2=n.quat=n.mat4=n.mat3=n.mat2d=n.mat2=n.glMatrix=void 0;var a=l(r(0)),e=l(r(9)),u=l(r(8)),o=l(r(5)),i=l(r(4)),s=l(r(3)),c=l(r(7)),f=l(r(6)),M=l(r(2)),h=l(r(1));function l(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}n.glMatrix=a,n.mat2=e,n.mat2d=u,n.mat3=o,n.mat4=i,n.quat=s,n.quat2=c,n.vec2=f,n.vec3=M,n.vec4=h}])});
},{}],6:[function(require,module,exports){
exports.surfaceNets         = require("./lib/surfacenets.js").surfaceNets;
exports.marchingCubes       = require("./lib/marchingcubes.js").marchingCubes;
exports.marchingTetrahedra  = require("./lib/marchingtetrahedra.js").marchingTetrahedra;

},{"./lib/marchingcubes.js":7,"./lib/marchingtetrahedra.js":8,"./lib/surfacenets.js":9}],7:[function(require,module,exports){
/**
 * Javascript Marching Cubes
 *
 * Based on Paul Bourke's classic implementation:
 *    http://local.wasp.uwa.edu.au/~pbourke/geometry/polygonise/
 *
 * JS port by Mikola Lysenko
 */

var edgeTable= new Uint32Array([
      0x0  , 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c,
      0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00,
      0x190, 0x99 , 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c,
      0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90,
      0x230, 0x339, 0x33 , 0x13a, 0x636, 0x73f, 0x435, 0x53c,
      0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30,
      0x3a0, 0x2a9, 0x1a3, 0xaa , 0x7a6, 0x6af, 0x5a5, 0x4ac,
      0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0,
      0x460, 0x569, 0x663, 0x76a, 0x66 , 0x16f, 0x265, 0x36c,
      0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60,
      0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff , 0x3f5, 0x2fc,
      0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0,
      0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55 , 0x15c,
      0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950,
      0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc ,
      0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0,
      0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc,
      0xcc , 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0,
      0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c,
      0x15c, 0x55 , 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650,
      0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc,
      0x2fc, 0x3f5, 0xff , 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
      0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c,
      0x36c, 0x265, 0x16f, 0x66 , 0x76a, 0x663, 0x569, 0x460,
      0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac,
      0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa , 0x1a3, 0x2a9, 0x3a0,
      0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c,
      0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33 , 0x339, 0x230,
      0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c,
      0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99 , 0x190,
      0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c,
      0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0   ])
  , triTable = [
      [],
      [0, 8, 3],
      [0, 1, 9],
      [1, 8, 3, 9, 8, 1],
      [1, 2, 10],
      [0, 8, 3, 1, 2, 10],
      [9, 2, 10, 0, 2, 9],
      [2, 8, 3, 2, 10, 8, 10, 9, 8],
      [3, 11, 2],
      [0, 11, 2, 8, 11, 0],
      [1, 9, 0, 2, 3, 11],
      [1, 11, 2, 1, 9, 11, 9, 8, 11],
      [3, 10, 1, 11, 10, 3],
      [0, 10, 1, 0, 8, 10, 8, 11, 10],
      [3, 9, 0, 3, 11, 9, 11, 10, 9],
      [9, 8, 10, 10, 8, 11],
      [4, 7, 8],
      [4, 3, 0, 7, 3, 4],
      [0, 1, 9, 8, 4, 7],
      [4, 1, 9, 4, 7, 1, 7, 3, 1],
      [1, 2, 10, 8, 4, 7],
      [3, 4, 7, 3, 0, 4, 1, 2, 10],
      [9, 2, 10, 9, 0, 2, 8, 4, 7],
      [2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4],
      [8, 4, 7, 3, 11, 2],
      [11, 4, 7, 11, 2, 4, 2, 0, 4],
      [9, 0, 1, 8, 4, 7, 2, 3, 11],
      [4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1],
      [3, 10, 1, 3, 11, 10, 7, 8, 4],
      [1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4],
      [4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3],
      [4, 7, 11, 4, 11, 9, 9, 11, 10],
      [9, 5, 4],
      [9, 5, 4, 0, 8, 3],
      [0, 5, 4, 1, 5, 0],
      [8, 5, 4, 8, 3, 5, 3, 1, 5],
      [1, 2, 10, 9, 5, 4],
      [3, 0, 8, 1, 2, 10, 4, 9, 5],
      [5, 2, 10, 5, 4, 2, 4, 0, 2],
      [2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8],
      [9, 5, 4, 2, 3, 11],
      [0, 11, 2, 0, 8, 11, 4, 9, 5],
      [0, 5, 4, 0, 1, 5, 2, 3, 11],
      [2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5],
      [10, 3, 11, 10, 1, 3, 9, 5, 4],
      [4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10],
      [5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3],
      [5, 4, 8, 5, 8, 10, 10, 8, 11],
      [9, 7, 8, 5, 7, 9],
      [9, 3, 0, 9, 5, 3, 5, 7, 3],
      [0, 7, 8, 0, 1, 7, 1, 5, 7],
      [1, 5, 3, 3, 5, 7],
      [9, 7, 8, 9, 5, 7, 10, 1, 2],
      [10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3],
      [8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2],
      [2, 10, 5, 2, 5, 3, 3, 5, 7],
      [7, 9, 5, 7, 8, 9, 3, 11, 2],
      [9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11],
      [2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7],
      [11, 2, 1, 11, 1, 7, 7, 1, 5],
      [9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11],
      [5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0],
      [11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0],
      [11, 10, 5, 7, 11, 5],
      [10, 6, 5],
      [0, 8, 3, 5, 10, 6],
      [9, 0, 1, 5, 10, 6],
      [1, 8, 3, 1, 9, 8, 5, 10, 6],
      [1, 6, 5, 2, 6, 1],
      [1, 6, 5, 1, 2, 6, 3, 0, 8],
      [9, 6, 5, 9, 0, 6, 0, 2, 6],
      [5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8],
      [2, 3, 11, 10, 6, 5],
      [11, 0, 8, 11, 2, 0, 10, 6, 5],
      [0, 1, 9, 2, 3, 11, 5, 10, 6],
      [5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11],
      [6, 3, 11, 6, 5, 3, 5, 1, 3],
      [0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6],
      [3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9],
      [6, 5, 9, 6, 9, 11, 11, 9, 8],
      [5, 10, 6, 4, 7, 8],
      [4, 3, 0, 4, 7, 3, 6, 5, 10],
      [1, 9, 0, 5, 10, 6, 8, 4, 7],
      [10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4],
      [6, 1, 2, 6, 5, 1, 4, 7, 8],
      [1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7],
      [8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6],
      [7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9],
      [3, 11, 2, 7, 8, 4, 10, 6, 5],
      [5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11],
      [0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6],
      [9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6],
      [8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6],
      [5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11],
      [0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7],
      [6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9],
      [10, 4, 9, 6, 4, 10],
      [4, 10, 6, 4, 9, 10, 0, 8, 3],
      [10, 0, 1, 10, 6, 0, 6, 4, 0],
      [8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10],
      [1, 4, 9, 1, 2, 4, 2, 6, 4],
      [3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4],
      [0, 2, 4, 4, 2, 6],
      [8, 3, 2, 8, 2, 4, 4, 2, 6],
      [10, 4, 9, 10, 6, 4, 11, 2, 3],
      [0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6],
      [3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10],
      [6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1],
      [9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3],
      [8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1],
      [3, 11, 6, 3, 6, 0, 0, 6, 4],
      [6, 4, 8, 11, 6, 8],
      [7, 10, 6, 7, 8, 10, 8, 9, 10],
      [0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10],
      [10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0],
      [10, 6, 7, 10, 7, 1, 1, 7, 3],
      [1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7],
      [2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9],
      [7, 8, 0, 7, 0, 6, 6, 0, 2],
      [7, 3, 2, 6, 7, 2],
      [2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7],
      [2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7],
      [1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11],
      [11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1],
      [8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6],
      [0, 9, 1, 11, 6, 7],
      [7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0],
      [7, 11, 6],
      [7, 6, 11],
      [3, 0, 8, 11, 7, 6],
      [0, 1, 9, 11, 7, 6],
      [8, 1, 9, 8, 3, 1, 11, 7, 6],
      [10, 1, 2, 6, 11, 7],
      [1, 2, 10, 3, 0, 8, 6, 11, 7],
      [2, 9, 0, 2, 10, 9, 6, 11, 7],
      [6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8],
      [7, 2, 3, 6, 2, 7],
      [7, 0, 8, 7, 6, 0, 6, 2, 0],
      [2, 7, 6, 2, 3, 7, 0, 1, 9],
      [1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6],
      [10, 7, 6, 10, 1, 7, 1, 3, 7],
      [10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8],
      [0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7],
      [7, 6, 10, 7, 10, 8, 8, 10, 9],
      [6, 8, 4, 11, 8, 6],
      [3, 6, 11, 3, 0, 6, 0, 4, 6],
      [8, 6, 11, 8, 4, 6, 9, 0, 1],
      [9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6],
      [6, 8, 4, 6, 11, 8, 2, 10, 1],
      [1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6],
      [4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9],
      [10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3],
      [8, 2, 3, 8, 4, 2, 4, 6, 2],
      [0, 4, 2, 4, 6, 2],
      [1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8],
      [1, 9, 4, 1, 4, 2, 2, 4, 6],
      [8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1],
      [10, 1, 0, 10, 0, 6, 6, 0, 4],
      [4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3],
      [10, 9, 4, 6, 10, 4],
      [4, 9, 5, 7, 6, 11],
      [0, 8, 3, 4, 9, 5, 11, 7, 6],
      [5, 0, 1, 5, 4, 0, 7, 6, 11],
      [11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5],
      [9, 5, 4, 10, 1, 2, 7, 6, 11],
      [6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5],
      [7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2],
      [3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6],
      [7, 2, 3, 7, 6, 2, 5, 4, 9],
      [9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7],
      [3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0],
      [6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8],
      [9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7],
      [1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4],
      [4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10],
      [7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10],
      [6, 9, 5, 6, 11, 9, 11, 8, 9],
      [3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5],
      [0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11],
      [6, 11, 3, 6, 3, 5, 5, 3, 1],
      [1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6],
      [0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10],
      [11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5],
      [6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3],
      [5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2],
      [9, 5, 6, 9, 6, 0, 0, 6, 2],
      [1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8],
      [1, 5, 6, 2, 1, 6],
      [1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6],
      [10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0],
      [0, 3, 8, 5, 6, 10],
      [10, 5, 6],
      [11, 5, 10, 7, 5, 11],
      [11, 5, 10, 11, 7, 5, 8, 3, 0],
      [5, 11, 7, 5, 10, 11, 1, 9, 0],
      [10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1],
      [11, 1, 2, 11, 7, 1, 7, 5, 1],
      [0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11],
      [9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7],
      [7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2],
      [2, 5, 10, 2, 3, 5, 3, 7, 5],
      [8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5],
      [9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2],
      [9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2],
      [1, 3, 5, 3, 7, 5],
      [0, 8, 7, 0, 7, 1, 1, 7, 5],
      [9, 0, 3, 9, 3, 5, 5, 3, 7],
      [9, 8, 7, 5, 9, 7],
      [5, 8, 4, 5, 10, 8, 10, 11, 8],
      [5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0],
      [0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5],
      [10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4],
      [2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8],
      [0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11],
      [0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5],
      [9, 4, 5, 2, 11, 3],
      [2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4],
      [5, 10, 2, 5, 2, 4, 4, 2, 0],
      [3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9],
      [5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2],
      [8, 4, 5, 8, 5, 3, 3, 5, 1],
      [0, 4, 5, 1, 0, 5],
      [8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5],
      [9, 4, 5],
      [4, 11, 7, 4, 9, 11, 9, 10, 11],
      [0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11],
      [1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11],
      [3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4],
      [4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2],
      [9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3],
      [11, 7, 4, 11, 4, 2, 2, 4, 0],
      [11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4],
      [2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9],
      [9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7],
      [3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10],
      [1, 10, 2, 8, 7, 4],
      [4, 9, 1, 4, 1, 7, 7, 1, 3],
      [4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1],
      [4, 0, 3, 7, 4, 3],
      [4, 8, 7],
      [9, 10, 8, 10, 11, 8],
      [3, 0, 9, 3, 9, 11, 11, 9, 10],
      [0, 1, 10, 0, 10, 8, 8, 10, 11],
      [3, 1, 10, 11, 3, 10],
      [1, 2, 11, 1, 11, 9, 9, 11, 8],
      [3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9],
      [0, 2, 11, 8, 0, 11],
      [3, 2, 11],
      [2, 3, 8, 2, 8, 10, 10, 8, 9],
      [9, 10, 2, 0, 9, 2],
      [2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8],
      [1, 10, 2],
      [1, 3, 8, 9, 1, 8],
      [0, 9, 1],
      [0, 3, 8],
      []]
  , cubeVerts = [
     [0,0,0]
    ,[1,0,0]
    ,[1,1,0]
    ,[0,1,0]
    ,[0,0,1]
    ,[1,0,1]
    ,[1,1,1]
    ,[0,1,1]]
  , edgeIndex = [ [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7] ];



exports.marchingCubes = function(dims, potential, bounds) {
  if(!bounds) {
    bounds = [[0,0,0], dims];
  }
  var scale     = [0,0,0];
  var shift     = [0,0,0];
  for(var i=0; i<3; ++i) {
    scale[i] = (bounds[1][i] - bounds[0][i]) / dims[i];
    shift[i] = bounds[0][i];
  }

  var vertices = []
    , faces = []
    , n = 0
    , grid = new Array(8)
    , edges = new Array(12)
    , x = [0,0,0];
  //March over the volume
  for(x[2]=0; x[2]<dims[2]-1; ++x[2], n+=dims[0])
  for(x[1]=0; x[1]<dims[1]-1; ++x[1], ++n)
  for(x[0]=0; x[0]<dims[0]-1; ++x[0], ++n) {
    //For each cell, compute cube mask
    var cube_index = 0;
    for(var i=0; i<8; ++i) {
      var v = cubeVerts[i]
        , s = potential(
          scale[0]*(x[0]+v[0])+shift[0],
          scale[1]*(x[1]+v[1])+shift[1],
          scale[2]*(x[2]+v[2])+shift[2]);
      grid[i] = s;
      cube_index |= (s > 0) ? 1 << i : 0;
    }
    //Compute vertices
    var edge_mask = edgeTable[cube_index];
    if(edge_mask === 0) {
      continue;
    }
    for(var i=0; i<12; ++i) {
      if((edge_mask & (1<<i)) === 0) {
        continue;
      }
      edges[i] = vertices.length;
      var nv = [0,0,0]
        , e = edgeIndex[i]
        , p0 = cubeVerts[e[0]]
        , p1 = cubeVerts[e[1]]
        , a = grid[e[0]]
        , b = grid[e[1]]
        , d = a - b
        , t = 0;
      if(Math.abs(d) > 1e-6) {
        t = a / d;
      }
      for(var j=0; j<3; ++j) {
        nv[j] = scale[j] * ((x[j] + p0[j]) + t * (p1[j] - p0[j])) + shift[j];
      }
      vertices.push(nv);
    }
    //Add faces
    var f = triTable[cube_index];
    for(var i=0; i<f.length; i += 3) {
      faces.push([edges[f[i]], edges[f[i+1]], edges[f[i+2]]]);
    }
  }
  return { positions: vertices, cells: faces };
};


},{}],8:[function(require,module,exports){
/**
 * Marching Tetrahedra in Javascript
 *
 * Based on Paul Bourke's implementation
 *  http://local.wasp.uwa.edu.au/~pbourke/geometry/polygonise/
 *
 * (Several bug fixes were made to deal with oriented faces)
 *
 * Javascript port by Mikola Lysenko
 */
var cube_vertices = [
        [0,0,0]
      , [1,0,0]
      , [1,1,0]
      , [0,1,0]
      , [0,0,1]
      , [1,0,1]
      , [1,1,1]
      , [0,1,1] ]
  , tetra_list = [
        [0,2,3,7]
      , [0,6,2,7]
      , [0,4,6,7]
      , [0,6,1,2]
      , [0,1,6,4]
      , [5,6,1,4] ];

exports.marchingTetrahedra = function(dims, potential, bounds) {

  if(!bounds) {
    bounds = [[0,0,0], dims];
  }
  
  var scale     = [0,0,0];
  var shift     = [0,0,0];
  for(var i=0; i<3; ++i) {
    scale[i] = (bounds[1][i] - bounds[0][i]) / dims[i];
    shift[i] = bounds[0][i];
  }
   
   var vertices = []
    , faces = []
    , n = 0
    , grid = new Float32Array(8)
    , edges = new Int32Array(12)
    , x = [0,0,0];
    
  function interp(i0, i1) {
    var g0 = grid[i0]
      , g1 = grid[i1]
      , p0 = cube_vertices[i0]
      , p1 = cube_vertices[i1]
      , v  = [x[0], x[1], x[2]]
      , t = g0 - g1;
    if(Math.abs(t) > 1e-6) {
      t = g0 / t;
    }
    for(var i=0; i<3; ++i) {
      v[i] = scale[i] * (v[i] + p0[i] + t * (p1[i] - p0[i])) + shift[i];
    }
    vertices.push(v);
    return vertices.length - 1;
  }
  
  //March over the volume
  for(x[2]=0; x[2]<dims[2]-1; ++x[2], n+=dims[0])
  for(x[1]=0; x[1]<dims[1]-1; ++x[1], ++n)
  for(x[0]=0; x[0]<dims[0]-1; ++x[0], ++n) {
    //Read in cube  
    for(var i=0; i<8; ++i) {
      var cube_vert = cube_vertices[i];
      grid[i] = potential(
        scale[0]*(x[0]+cube_vert[0])+shift[0],
        scale[1]*(x[1]+cube_vert[1])+shift[1],
        scale[2]*(x[2]+cube_vert[2])+shift[2]);
    }
    for(var i=0; i<tetra_list.length; ++i) {
      var T = tetra_list[i]
        , triindex = 0;
      if (grid[T[0]] < 0) triindex |= 1;
      if (grid[T[1]] < 0) triindex |= 2;
      if (grid[T[2]] < 0) triindex |= 4;
      if (grid[T[3]] < 0) triindex |= 8;
      
      //Handle each case
      switch (triindex) {
        case 0x00:
        case 0x0F:
        break;
        case 0x0E:
          faces.push([ 
              interp(T[0], T[1])
            , interp(T[0], T[3]) 
            , interp(T[0], T[2]) ]);
        break;
        case 0x01:
          faces.push([ 
              interp(T[0], T[1])
            , interp(T[0], T[2])
            , interp(T[0], T[3])  ]);
        break;
        case 0x0D:
          faces.push([ 
              interp(T[1], T[0])
            , interp(T[1], T[2]) 
            , interp(T[1], T[3]) ]);
        break;
        case 0x02:
          faces.push([ 
              interp(T[1], T[0])
            , interp(T[1], T[3])
            , interp(T[1], T[2]) ]);
        break;
        case 0x0C:
          faces.push([ 
                interp(T[1], T[2])
              , interp(T[1], T[3])
              , interp(T[0], T[3])
              , interp(T[0], T[2]) ]);
        break;
        case 0x03:
          faces.push([ 
                interp(T[1], T[2])
              , interp(T[0], T[2])
              , interp(T[0], T[3])
              , interp(T[1], T[3]) ]);
        break;
        case 0x04:
          faces.push([ 
                interp(T[2], T[0])
              , interp(T[2], T[1])
              , interp(T[2], T[3]) ]);
        break;
        case 0x0B:
          faces.push([ 
                interp(T[2], T[0])
              , interp(T[2], T[3]) 
              , interp(T[2], T[1]) ]);
        break;
        case 0x05:
          faces.push([ 
                interp(T[0], T[1])
              , interp(T[1], T[2])
              , interp(T[2], T[3])
              , interp(T[0], T[3]) ]);
        break;
        case 0x0A:
          faces.push([ 
                interp(T[0], T[1])
              , interp(T[0], T[3])
              , interp(T[2], T[3])
              , interp(T[1], T[2]) ]);
        break;
        case 0x06:
          faces.push([ 
                interp(T[2], T[3])
              , interp(T[0], T[2])
              , interp(T[0], T[1])
              , interp(T[1], T[3]) ]);
        break;
        case 0x09:
          faces.push([ 
                interp(T[2], T[3])
              , interp(T[1], T[3])
              , interp(T[0], T[1])
              , interp(T[0], T[2]) ]);
        break;
        case 0x07:
          faces.push([ 
                interp(T[3], T[0])
              , interp(T[3], T[1])
              , interp(T[3], T[2]) ]);
        break;
        case 0x08:
          faces.push([ 
                interp(T[3], T[0])
              , interp(T[3], T[2])
              , interp(T[3], T[1]) ]);
        break;
      }
    }
  }
  
  return { positions: vertices, cells: faces };
}


},{}],9:[function(require,module,exports){
/**
 * SurfaceNets in JavaScript
 *
 * Written by Mikola Lysenko (C) 2012
 *
 * MIT License
 *
 * Based on: S.F. Gibson, "Constrained Elastic Surface Nets". (1998) MERL Tech Report.
 */
"use strict";

//Precompute edge table, like Paul Bourke does.
// This saves a bit of time when computing the centroid of each boundary cell
var cube_edges = new Int32Array(24)
  , edge_table = new Int32Array(256);
(function() {

  //Initialize the cube_edges table
  // This is just the vertex number of each cube
  var k = 0;
  for(var i=0; i<8; ++i) {
    for(var j=1; j<=4; j<<=1) {
      var p = i^j;
      if(i <= p) {
        cube_edges[k++] = i;
        cube_edges[k++] = p;
      }
    }
  }

  //Initialize the intersection table.
  //  This is a 2^(cube configuration) ->  2^(edge configuration) map
  //  There is one entry for each possible cube configuration, and the output is a 12-bit vector enumerating all edges crossing the 0-level.
  for(var i=0; i<256; ++i) {
    var em = 0;
    for(var j=0; j<24; j+=2) {
      var a = !!(i & (1<<cube_edges[j]))
        , b = !!(i & (1<<cube_edges[j+1]));
      em |= a !== b ? (1 << (j >> 1)) : 0;
    }
    edge_table[i] = em;
  }
})();

//Internal buffer, this may get resized at run time
var buffer = new Array(4096);
(function() {
  for(var i=0; i<buffer.length; ++i) {
    buffer[i] = 0;
  }
})();

exports.surfaceNets = function(dims, potential, bounds) {
  if(!bounds) {
    bounds = [[0,0,0],dims];
  }
  
  var scale     = [0,0,0];
  var shift     = [0,0,0];
  for(var i=0; i<3; ++i) {
    scale[i] = (bounds[1][i] - bounds[0][i]) / dims[i];
    shift[i] = bounds[0][i];
  }
  
  var vertices = []
    , faces = []
    , n = 0
    , x = [0, 0, 0]
    , R = [1, (dims[0]+1), (dims[0]+1)*(dims[1]+1)]
    , grid = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    , buf_no = 1;
  
   
  //Resize buffer if necessary 
  if(R[2] * 2 > buffer.length) {
    var ol = buffer.length;
    buffer.length = R[2] * 2;
    while(ol < buffer.length) {
      buffer[ol++] = 0;
    }
  }
  
  //March over the voxel grid
  for(x[2]=0; x[2]<dims[2]-1; ++x[2], n+=dims[0], buf_no ^= 1, R[2]=-R[2]) {
  
    //m is the pointer into the buffer we are going to use.  
    //This is slightly obtuse because javascript does not have good support for packed data structures, so we must use typed arrays :(
    //The contents of the buffer will be the indices of the vertices on the previous x/y slice of the volume
    var m = 1 + (dims[0]+1) * (1 + buf_no * (dims[1]+1));
    
    for(x[1]=0; x[1]<dims[1]-1; ++x[1], ++n, m+=2)
    for(x[0]=0; x[0]<dims[0]-1; ++x[0], ++n, ++m) {
    
      //Read in 8 field values around this vertex and store them in an array
      //Also calculate 8-bit mask, like in marching cubes, so we can speed up sign checks later
      var mask = 0, g = 0;
      for(var k=0; k<2; ++k)
      for(var j=0; j<2; ++j)      
      for(var i=0; i<2; ++i, ++g) {
        var p = potential(
          scale[0]*(x[0]+i)+shift[0],
          scale[1]*(x[1]+j)+shift[1],
          scale[2]*(x[2]+k)+shift[2]);
        grid[g] = p;
        mask |= (p < 0) ? (1<<g) : 0;
      }
      
      //Check for early termination if cell does not intersect boundary
      if(mask === 0 || mask === 0xff) {
        continue;
      }
      
      //Sum up edge intersections
      var edge_mask = edge_table[mask]
        , v = [0.0,0.0,0.0]
        , e_count = 0;
        
      //For every edge of the cube...
      for(var i=0; i<12; ++i) {
      
        //Use edge mask to check if it is crossed
        if(!(edge_mask & (1<<i))) {
          continue;
        }
        
        //If it did, increment number of edge crossings
        ++e_count;
        
        //Now find the point of intersection
        var e0 = cube_edges[ i<<1 ]       //Unpack vertices
          , e1 = cube_edges[(i<<1)+1]
          , g0 = grid[e0]                 //Unpack grid values
          , g1 = grid[e1]
          , t  = g0 - g1;                 //Compute point of intersection
        if(Math.abs(t) > 1e-6) {
          t = g0 / t;
        } else {
          continue;
        }
        
        //Interpolate vertices and add up intersections (this can be done without multiplying)
        for(var j=0, k=1; j<3; ++j, k<<=1) {
          var a = e0 & k
            , b = e1 & k;
          if(a !== b) {
            v[j] += a ? 1.0 - t : t;
          } else {
            v[j] += a ? 1.0 : 0;
          }
        }
      }
      
      //Now we just average the edge intersections and add them to coordinate
      var s = 1.0 / e_count;
      for(var i=0; i<3; ++i) {
        v[i] = scale[i] * (x[i] + s * v[i]) + shift[i];
      }
      
      //Add vertex to buffer, store pointer to vertex index in buffer
      buffer[m] = vertices.length;
      vertices.push(v);
      
      //Now we need to add faces together, to do this we just loop over 3 basis components
      for(var i=0; i<3; ++i) {
        //The first three entries of the edge_mask count the crossings along the edge
        if(!(edge_mask & (1<<i)) ) {
          continue;
        }
        
        // i = axes we are point along.  iu, iv = orthogonal axes
        var iu = (i+1)%3
          , iv = (i+2)%3;
          
        //If we are on a boundary, skip it
        if(x[iu] === 0 || x[iv] === 0) {
          continue;
        }
        
        //Otherwise, look up adjacent edges in buffer
        var du = R[iu]
          , dv = R[iv];
        
        //Remember to flip orientation depending on the sign of the corner.
        if(mask & 1) {
          faces.push([buffer[m],    buffer[m-du],    buffer[m-dv]]);
          faces.push([buffer[m-dv], buffer[m-du],    buffer[m-du-dv]]);
        } else {
          faces.push([buffer[m],    buffer[m-dv],    buffer[m-du]]);
          faces.push([buffer[m-du], buffer[m-dv],    buffer[m-du-dv]]);
        }
      }
    }
  }
  
  //All done!  Return the result
  return { positions: vertices, cells: faces };
};

},{}],10:[function(require,module,exports){
'use strict'

module.exports = mouseListen

var mouse = require('mouse-event')

function mouseListen (element, callback) {
  if (!callback) {
    callback = element
    element = window
  }

  var buttonState = 0
  var x = 0
  var y = 0
  var mods = {
    shift: false,
    alt: false,
    control: false,
    meta: false
  }
  var attached = false

  function updateMods (ev) {
    var changed = false
    if ('altKey' in ev) {
      changed = changed || ev.altKey !== mods.alt
      mods.alt = !!ev.altKey
    }
    if ('shiftKey' in ev) {
      changed = changed || ev.shiftKey !== mods.shift
      mods.shift = !!ev.shiftKey
    }
    if ('ctrlKey' in ev) {
      changed = changed || ev.ctrlKey !== mods.control
      mods.control = !!ev.ctrlKey
    }
    if ('metaKey' in ev) {
      changed = changed || ev.metaKey !== mods.meta
      mods.meta = !!ev.metaKey
    }
    return changed
  }

  function handleEvent (nextButtons, ev) {
    var nextX = mouse.x(ev)
    var nextY = mouse.y(ev)
    if ('buttons' in ev) {
      nextButtons = ev.buttons | 0
    }
    if (nextButtons !== buttonState ||
      nextX !== x ||
      nextY !== y ||
      updateMods(ev)) {
      buttonState = nextButtons | 0
      x = nextX || 0
      y = nextY || 0
      callback && callback(buttonState, x, y, mods)
    }
  }

  function clearState (ev) {
    handleEvent(0, ev)
  }

  function handleBlur () {
    if (buttonState ||
      x ||
      y ||
      mods.shift ||
      mods.alt ||
      mods.meta ||
      mods.control) {
      x = y = 0
      buttonState = 0
      mods.shift = mods.alt = mods.control = mods.meta = false
      callback && callback(0, 0, 0, mods)
    }
  }

  function handleMods (ev) {
    if (updateMods(ev)) {
      callback && callback(buttonState, x, y, mods)
    }
  }

  function handleMouseMove (ev) {
    if (mouse.buttons(ev) === 0) {
      handleEvent(0, ev)
    } else {
      handleEvent(buttonState, ev)
    }
  }

  function handleMouseDown (ev) {
    handleEvent(buttonState | mouse.buttons(ev), ev)
  }

  function handleMouseUp (ev) {
    handleEvent(buttonState & ~mouse.buttons(ev), ev)
  }

  function attachListeners () {
    if (attached) {
      return
    }
    attached = true

    element.addEventListener('mousemove', handleMouseMove)

    element.addEventListener('mousedown', handleMouseDown)

    element.addEventListener('mouseup', handleMouseUp)

    element.addEventListener('mouseleave', clearState)
    element.addEventListener('mouseenter', clearState)
    element.addEventListener('mouseout', clearState)
    element.addEventListener('mouseover', clearState)

    element.addEventListener('blur', handleBlur)

    element.addEventListener('keyup', handleMods)
    element.addEventListener('keydown', handleMods)
    element.addEventListener('keypress', handleMods)

    if (element !== window) {
      window.addEventListener('blur', handleBlur)

      window.addEventListener('keyup', handleMods)
      window.addEventListener('keydown', handleMods)
      window.addEventListener('keypress', handleMods)
    }
  }

  function detachListeners () {
    if (!attached) {
      return
    }
    attached = false

    element.removeEventListener('mousemove', handleMouseMove)

    element.removeEventListener('mousedown', handleMouseDown)

    element.removeEventListener('mouseup', handleMouseUp)

    element.removeEventListener('mouseleave', clearState)
    element.removeEventListener('mouseenter', clearState)
    element.removeEventListener('mouseout', clearState)
    element.removeEventListener('mouseover', clearState)

    element.removeEventListener('blur', handleBlur)

    element.removeEventListener('keyup', handleMods)
    element.removeEventListener('keydown', handleMods)
    element.removeEventListener('keypress', handleMods)

    if (element !== window) {
      window.removeEventListener('blur', handleBlur)

      window.removeEventListener('keyup', handleMods)
      window.removeEventListener('keydown', handleMods)
      window.removeEventListener('keypress', handleMods)
    }
  }

  // Attach listeners
  attachListeners()

  var result = {
    element: element
  }

  Object.defineProperties(result, {
    enabled: {
      get: function () { return attached },
      set: function (f) {
        if (f) {
          attachListeners()
        } else {
          detachListeners()
        }
      },
      enumerable: true
    },
    buttons: {
      get: function () { return buttonState },
      enumerable: true
    },
    x: {
      get: function () { return x },
      enumerable: true
    },
    y: {
      get: function () { return y },
      enumerable: true
    },
    mods: {
      get: function () { return mods },
      enumerable: true
    }
  })

  return result
}

},{"mouse-event":11}],11:[function(require,module,exports){
'use strict'

function mouseButtons(ev) {
  if(typeof ev === 'object') {
    if('buttons' in ev) {
      return ev.buttons
    } else if('which' in ev) {
      var b = ev.which
      if(b === 2) {
        return 4
      } else if(b === 3) {
        return 2
      } else if(b > 0) {
        return 1<<(b-1)
      }
    } else if('button' in ev) {
      var b = ev.button
      if(b === 1) {
        return 4
      } else if(b === 2) {
        return 2
      } else if(b >= 0) {
        return 1<<b
      }
    }
  }
  return 0
}
exports.buttons = mouseButtons

function mouseElement(ev) {
  return ev.target || ev.srcElement || window
}
exports.element = mouseElement

function mouseRelativeX(ev) {
  if(typeof ev === 'object') {
    if('offsetX' in ev) {
      return ev.offsetX
    }
    var target = mouseElement(ev)
    var bounds = target.getBoundingClientRect()
    return ev.clientX - bounds.left
  }
  return 0
}
exports.x = mouseRelativeX

function mouseRelativeY(ev) {
  if(typeof ev === 'object') {
    if('offsetY' in ev) {
      return ev.offsetY
    }
    var target = mouseElement(ev)
    var bounds = target.getBoundingClientRect()
    return ev.clientY - bounds.top
  }
  return 0
}
exports.y = mouseRelativeY

},{}],12:[function(require,module,exports){
'use strict'

var toPX = require('to-px')

module.exports = mouseWheelListen

function mouseWheelListen(element, callback, noScroll) {
  if(typeof element === 'function') {
    noScroll = !!callback
    callback = element
    element = window
  }
  var lineHeight = toPX('ex', element)
  var listener = function(ev) {
    if(noScroll) {
      ev.preventDefault()
    }
    var dx = ev.deltaX || 0
    var dy = ev.deltaY || 0
    var dz = ev.deltaZ || 0
    var mode = ev.deltaMode
    var scale = 1
    switch(mode) {
      case 1:
        scale = lineHeight
      break
      case 2:
        scale = window.innerHeight
      break
    }
    dx *= scale
    dy *= scale
    dz *= scale
    if(dx || dy || dz) {
      return callback(dx, dy, dz, ev)
    }
  }
  element.addEventListener('wheel', listener)
  return listener
}

},{"to-px":16}],13:[function(require,module,exports){
module.exports = function parseUnit(str, out) {
    if (!out)
        out = [ 0, '' ]

    str = String(str)
    var num = parseFloat(str, 10)
    out[0] = num
    out[1] = str.match(/[\d.\-\+]*\s*(.*)/)[1] || ''
    return out
}
},{}],14:[function(require,module,exports){
var mouseChange = require('mouse-change')
var mouseWheel = require('mouse-wheel')
var identity = require('gl-mat4/identity')
var perspective = require('gl-mat4/perspective')
var lookAt = require('gl-mat4/lookAt')

module.exports = createCamera

var isBrowser = typeof window !== 'undefined'

function createCamera (regl, props_) {
  var props = props_ || {}

  // Preserve backward-compatibilty while renaming preventDefault -> noScroll
  if (typeof props.noScroll === 'undefined') {
    props.noScroll = props.preventDefault;
  }

  var cameraState = {
    view: identity(new Float32Array(16)),
    projection: identity(new Float32Array(16)),
    center: new Float32Array(props.center || 3),
    theta: props.theta || 0,
    phi: props.phi || 0,
    distance: Math.log(props.distance || 10.0),
    eye: new Float32Array(3),
    up: new Float32Array(props.up || [0, 1, 0]),
    fovy: props.fovy || Math.PI / 4.0,
    near: typeof props.near !== 'undefined' ? props.near : 0.01,
    far: typeof props.far !== 'undefined' ? props.far : 1000.0,
    noScroll: typeof props.noScroll !== 'undefined' ? props.noScroll : false,
    flipY: !!props.flipY,
    dtheta: 0,
    dphi: 0,
    rotationSpeed: typeof props.rotationSpeed !== 'undefined' ? props.rotationSpeed : 1,
    zoomSpeed: typeof props.zoomSpeed !== 'undefined' ? props.zoomSpeed : 1,
    renderOnDirty: typeof props.renderOnDirty !== undefined ? !!props.renderOnDirty : false
  }

  var element = props.element
  var damping = typeof props.damping !== 'undefined' ? props.damping : 0.9

  var right = new Float32Array([1, 0, 0])
  var front = new Float32Array([0, 0, 1])

  var minDistance = Math.log('minDistance' in props ? props.minDistance : 0.1)
  var maxDistance = Math.log('maxDistance' in props ? props.maxDistance : 1000)

  var ddistance = 0

  var prevX = 0
  var prevY = 0

  if (isBrowser && props.mouse !== false) {
    var source = element || regl._gl.canvas

    function getWidth () {
      return element ? element.offsetWidth : window.innerWidth
    }

    function getHeight () {
      return element ? element.offsetHeight : window.innerHeight
    }

    mouseChange(source, function (buttons, x, y) {
      if (buttons & 1) {
        var dx = (x - prevX) / getWidth()
        var dy = (y - prevY) / getHeight()

        cameraState.dtheta += cameraState.rotationSpeed * 4.0 * dx
        cameraState.dphi += cameraState.rotationSpeed * 4.0 * dy
        cameraState.dirty = true;
      }
      prevX = x
      prevY = y
    })

    mouseWheel(source, function (dx, dy) {
      ddistance += dy / getHeight() * cameraState.zoomSpeed
      cameraState.dirty = true;
    }, props.noScroll)
  }

  function damp (x) {
    var xd = x * damping
    if (Math.abs(xd) < 0.1) {
      return 0
    }
    cameraState.dirty = true;
    return xd
  }

  function clamp (x, lo, hi) {
    return Math.min(Math.max(x, lo), hi)
  }

  function updateCamera (props) {
    Object.keys(props).forEach(function (prop) {
      cameraState[prop] = props[prop]
    })

    var center = cameraState.center
    var eye = cameraState.eye
    var up = cameraState.up
    var dtheta = cameraState.dtheta
    var dphi = cameraState.dphi

    cameraState.theta += dtheta
    cameraState.phi = clamp(
      cameraState.phi + dphi,
      -Math.PI / 2.0,
      Math.PI / 2.0)
    cameraState.distance = clamp(
      cameraState.distance + ddistance,
      minDistance,
      maxDistance)

    cameraState.dtheta = damp(dtheta)
    cameraState.dphi = damp(dphi)
    ddistance = damp(ddistance)

    var theta = cameraState.theta
    var phi = cameraState.phi
    var r = Math.exp(cameraState.distance)

    var vf = r * Math.sin(theta) * Math.cos(phi)
    var vr = r * Math.cos(theta) * Math.cos(phi)
    var vu = r * Math.sin(phi)

    for (var i = 0; i < 3; ++i) {
      eye[i] = center[i] + vf * front[i] + vr * right[i] + vu * up[i]
    }

    lookAt(cameraState.view, eye, center, up)
  }

  cameraState.dirty = true;

  var injectContext = regl({
    context: Object.assign({}, cameraState, {
      dirty: function () {
        return cameraState.dirty;
      },
      projection: function (context) {
        perspective(cameraState.projection,
          cameraState.fovy,
          context.viewportWidth / context.viewportHeight,
          cameraState.near,
          cameraState.far)
        if (cameraState.flipY) { cameraState.projection[5] *= -1 }
        return cameraState.projection
      }
    }),
    uniforms: Object.keys(cameraState).reduce(function (uniforms, name) {
      uniforms[name] = regl.context(name)
      return uniforms
    }, {})
  })

  function setupCamera (props, block) {
    if (typeof setupCamera.dirty !== 'undefined') {
      cameraState.dirty = setupCamera.dirty || cameraState.dirty
      setupCamera.dirty = undefined;
    }

    if (props && block) {
      cameraState.dirty = true;
    }

    if (cameraState.renderOnDirty && !cameraState.dirty) return;

    if (!block) {
      block = props
      props = {}
    }

    updateCamera(props)
    injectContext(block)
    cameraState.dirty = false;
  }

  Object.keys(cameraState).forEach(function (name) {
    setupCamera[name] = cameraState[name]
  })

  return setupCamera
}

},{"gl-mat4/identity":2,"gl-mat4/lookAt":3,"gl-mat4/perspective":4,"mouse-change":10,"mouse-wheel":12}],15:[function(require,module,exports){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.createREGL = factory());
}(this, (function () { 'use strict';

var isTypedArray = function (x) {
  return (
    x instanceof Uint8Array ||
    x instanceof Uint16Array ||
    x instanceof Uint32Array ||
    x instanceof Int8Array ||
    x instanceof Int16Array ||
    x instanceof Int32Array ||
    x instanceof Float32Array ||
    x instanceof Float64Array ||
    x instanceof Uint8ClampedArray
  )
};

var extend = function (base, opts) {
  var keys = Object.keys(opts);
  for (var i = 0; i < keys.length; ++i) {
    base[keys[i]] = opts[keys[i]];
  }
  return base
};

// Error checking and parameter validation.
//
// Statements for the form `check.someProcedure(...)` get removed by
// a browserify transform for optimized/minified bundles.
//
/* globals atob */
var endl = '\n';

// only used for extracting shader names.  if atob not present, then errors
// will be slightly crappier
function decodeB64 (str) {
  if (typeof atob !== 'undefined') {
    return atob(str)
  }
  return 'base64:' + str
}

function raise (message) {
  var error = new Error('(regl) ' + message);
  console.error(error);
  throw error
}

function check (pred, message) {
  if (!pred) {
    raise(message);
  }
}

function encolon (message) {
  if (message) {
    return ': ' + message
  }
  return ''
}

function checkParameter (param, possibilities, message) {
  if (!(param in possibilities)) {
    raise('unknown parameter (' + param + ')' + encolon(message) +
          '. possible values: ' + Object.keys(possibilities).join());
  }
}

function checkIsTypedArray (data, message) {
  if (!isTypedArray(data)) {
    raise(
      'invalid parameter type' + encolon(message) +
      '. must be a typed array');
  }
}

function checkTypeOf (value, type, message) {
  if (typeof value !== type) {
    raise(
      'invalid parameter type' + encolon(message) +
      '. expected ' + type + ', got ' + (typeof value));
  }
}

function checkNonNegativeInt (value, message) {
  if (!((value >= 0) &&
        ((value | 0) === value))) {
    raise('invalid parameter type, (' + value + ')' + encolon(message) +
          '. must be a nonnegative integer');
  }
}

function checkOneOf (value, list, message) {
  if (list.indexOf(value) < 0) {
    raise('invalid value' + encolon(message) + '. must be one of: ' + list);
  }
}

var constructorKeys = [
  'gl',
  'canvas',
  'container',
  'attributes',
  'pixelRatio',
  'extensions',
  'optionalExtensions',
  'profile',
  'onDone'
];

function checkConstructor (obj) {
  Object.keys(obj).forEach(function (key) {
    if (constructorKeys.indexOf(key) < 0) {
      raise('invalid regl constructor argument "' + key + '". must be one of ' + constructorKeys);
    }
  });
}

function leftPad (str, n) {
  str = str + '';
  while (str.length < n) {
    str = ' ' + str;
  }
  return str
}

function ShaderFile () {
  this.name = 'unknown';
  this.lines = [];
  this.index = {};
  this.hasErrors = false;
}

function ShaderLine (number, line) {
  this.number = number;
  this.line = line;
  this.errors = [];
}

function ShaderError (fileNumber, lineNumber, message) {
  this.file = fileNumber;
  this.line = lineNumber;
  this.message = message;
}

function guessCommand () {
  var error = new Error();
  var stack = (error.stack || error).toString();
  var pat = /compileProcedure.*\n\s*at.*\((.*)\)/.exec(stack);
  if (pat) {
    return pat[1]
  }
  var pat2 = /compileProcedure.*\n\s*at\s+(.*)(\n|$)/.exec(stack);
  if (pat2) {
    return pat2[1]
  }
  return 'unknown'
}

function guessCallSite () {
  var error = new Error();
  var stack = (error.stack || error).toString();
  var pat = /at REGLCommand.*\n\s+at.*\((.*)\)/.exec(stack);
  if (pat) {
    return pat[1]
  }
  var pat2 = /at REGLCommand.*\n\s+at\s+(.*)\n/.exec(stack);
  if (pat2) {
    return pat2[1]
  }
  return 'unknown'
}

function parseSource (source, command) {
  var lines = source.split('\n');
  var lineNumber = 1;
  var fileNumber = 0;
  var files = {
    unknown: new ShaderFile(),
    0: new ShaderFile()
  };
  files.unknown.name = files[0].name = command || guessCommand();
  files.unknown.lines.push(new ShaderLine(0, ''));
  for (var i = 0; i < lines.length; ++i) {
    var line = lines[i];
    var parts = /^\s*\#\s*(\w+)\s+(.+)\s*$/.exec(line);
    if (parts) {
      switch (parts[1]) {
        case 'line':
          var lineNumberInfo = /(\d+)(\s+\d+)?/.exec(parts[2]);
          if (lineNumberInfo) {
            lineNumber = lineNumberInfo[1] | 0;
            if (lineNumberInfo[2]) {
              fileNumber = lineNumberInfo[2] | 0;
              if (!(fileNumber in files)) {
                files[fileNumber] = new ShaderFile();
              }
            }
          }
          break
        case 'define':
          var nameInfo = /SHADER_NAME(_B64)?\s+(.*)$/.exec(parts[2]);
          if (nameInfo) {
            files[fileNumber].name = (nameInfo[1]
                ? decodeB64(nameInfo[2])
                : nameInfo[2]);
          }
          break
      }
    }
    files[fileNumber].lines.push(new ShaderLine(lineNumber++, line));
  }
  Object.keys(files).forEach(function (fileNumber) {
    var file = files[fileNumber];
    file.lines.forEach(function (line) {
      file.index[line.number] = line;
    });
  });
  return files
}

function parseErrorLog (errLog) {
  var result = [];
  errLog.split('\n').forEach(function (errMsg) {
    if (errMsg.length < 5) {
      return
    }
    var parts = /^ERROR\:\s+(\d+)\:(\d+)\:\s*(.*)$/.exec(errMsg);
    if (parts) {
      result.push(new ShaderError(
        parts[1] | 0,
        parts[2] | 0,
        parts[3].trim()));
    } else if (errMsg.length > 0) {
      result.push(new ShaderError('unknown', 0, errMsg));
    }
  });
  return result
}

function annotateFiles (files, errors) {
  errors.forEach(function (error) {
    var file = files[error.file];
    if (file) {
      var line = file.index[error.line];
      if (line) {
        line.errors.push(error);
        file.hasErrors = true;
        return
      }
    }
    files.unknown.hasErrors = true;
    files.unknown.lines[0].errors.push(error);
  });
}

function checkShaderError (gl, shader, source, type, command) {
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    var errLog = gl.getShaderInfoLog(shader);
    var typeName = type === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex';
    checkCommandType(source, 'string', typeName + ' shader source must be a string', command);
    var files = parseSource(source, command);
    var errors = parseErrorLog(errLog);
    annotateFiles(files, errors);

    Object.keys(files).forEach(function (fileNumber) {
      var file = files[fileNumber];
      if (!file.hasErrors) {
        return
      }

      var strings = [''];
      var styles = [''];

      function push (str, style) {
        strings.push(str);
        styles.push(style || '');
      }

      push('file number ' + fileNumber + ': ' + file.name + '\n', 'color:red;text-decoration:underline;font-weight:bold');

      file.lines.forEach(function (line) {
        if (line.errors.length > 0) {
          push(leftPad(line.number, 4) + '|  ', 'background-color:yellow; font-weight:bold');
          push(line.line + endl, 'color:red; background-color:yellow; font-weight:bold');

          // try to guess token
          var offset = 0;
          line.errors.forEach(function (error) {
            var message = error.message;
            var token = /^\s*\'(.*)\'\s*\:\s*(.*)$/.exec(message);
            if (token) {
              var tokenPat = token[1];
              message = token[2];
              switch (tokenPat) {
                case 'assign':
                  tokenPat = '=';
                  break
              }
              offset = Math.max(line.line.indexOf(tokenPat, offset), 0);
            } else {
              offset = 0;
            }

            push(leftPad('| ', 6));
            push(leftPad('^^^', offset + 3) + endl, 'font-weight:bold');
            push(leftPad('| ', 6));
            push(message + endl, 'font-weight:bold');
          });
          push(leftPad('| ', 6) + endl);
        } else {
          push(leftPad(line.number, 4) + '|  ');
          push(line.line + endl, 'color:red');
        }
      });
      if (typeof document !== 'undefined' && !window.chrome) {
        styles[0] = strings.join('%c');
        console.log.apply(console, styles);
      } else {
        console.log(strings.join(''));
      }
    });

    check.raise('Error compiling ' + typeName + ' shader, ' + files[0].name);
  }
}

function checkLinkError (gl, program, fragShader, vertShader, command) {
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    var errLog = gl.getProgramInfoLog(program);
    var fragParse = parseSource(fragShader, command);
    var vertParse = parseSource(vertShader, command);

    var header = 'Error linking program with vertex shader, "' +
      vertParse[0].name + '", and fragment shader "' + fragParse[0].name + '"';

    if (typeof document !== 'undefined') {
      console.log('%c' + header + endl + '%c' + errLog,
        'color:red;text-decoration:underline;font-weight:bold',
        'color:red');
    } else {
      console.log(header + endl + errLog);
    }
    check.raise(header);
  }
}

function saveCommandRef (object) {
  object._commandRef = guessCommand();
}

function saveDrawCommandInfo (opts, uniforms, attributes, stringStore) {
  saveCommandRef(opts);

  function id (str) {
    if (str) {
      return stringStore.id(str)
    }
    return 0
  }
  opts._fragId = id(opts.static.frag);
  opts._vertId = id(opts.static.vert);

  function addProps (dict, set) {
    Object.keys(set).forEach(function (u) {
      dict[stringStore.id(u)] = true;
    });
  }

  var uniformSet = opts._uniformSet = {};
  addProps(uniformSet, uniforms.static);
  addProps(uniformSet, uniforms.dynamic);

  var attributeSet = opts._attributeSet = {};
  addProps(attributeSet, attributes.static);
  addProps(attributeSet, attributes.dynamic);

  opts._hasCount = (
    'count' in opts.static ||
    'count' in opts.dynamic ||
    'elements' in opts.static ||
    'elements' in opts.dynamic);
}

function commandRaise (message, command) {
  var callSite = guessCallSite();
  raise(message +
    ' in command ' + (command || guessCommand()) +
    (callSite === 'unknown' ? '' : ' called from ' + callSite));
}

function checkCommand (pred, message, command) {
  if (!pred) {
    commandRaise(message, command || guessCommand());
  }
}

function checkParameterCommand (param, possibilities, message, command) {
  if (!(param in possibilities)) {
    commandRaise(
      'unknown parameter (' + param + ')' + encolon(message) +
      '. possible values: ' + Object.keys(possibilities).join(),
      command || guessCommand());
  }
}

function checkCommandType (value, type, message, command) {
  if (typeof value !== type) {
    commandRaise(
      'invalid parameter type' + encolon(message) +
      '. expected ' + type + ', got ' + (typeof value),
      command || guessCommand());
  }
}

function checkOptional (block) {
  block();
}

function checkFramebufferFormat (attachment, texFormats, rbFormats) {
  if (attachment.texture) {
    checkOneOf(
      attachment.texture._texture.internalformat,
      texFormats,
      'unsupported texture format for attachment');
  } else {
    checkOneOf(
      attachment.renderbuffer._renderbuffer.format,
      rbFormats,
      'unsupported renderbuffer format for attachment');
  }
}

var GL_CLAMP_TO_EDGE = 0x812F;

var GL_NEAREST = 0x2600;
var GL_NEAREST_MIPMAP_NEAREST = 0x2700;
var GL_LINEAR_MIPMAP_NEAREST = 0x2701;
var GL_NEAREST_MIPMAP_LINEAR = 0x2702;
var GL_LINEAR_MIPMAP_LINEAR = 0x2703;

var GL_BYTE = 5120;
var GL_UNSIGNED_BYTE = 5121;
var GL_SHORT = 5122;
var GL_UNSIGNED_SHORT = 5123;
var GL_INT = 5124;
var GL_UNSIGNED_INT = 5125;
var GL_FLOAT = 5126;

var GL_UNSIGNED_SHORT_4_4_4_4 = 0x8033;
var GL_UNSIGNED_SHORT_5_5_5_1 = 0x8034;
var GL_UNSIGNED_SHORT_5_6_5 = 0x8363;
var GL_UNSIGNED_INT_24_8_WEBGL = 0x84FA;

var GL_HALF_FLOAT_OES = 0x8D61;

var TYPE_SIZE = {};

TYPE_SIZE[GL_BYTE] =
TYPE_SIZE[GL_UNSIGNED_BYTE] = 1;

TYPE_SIZE[GL_SHORT] =
TYPE_SIZE[GL_UNSIGNED_SHORT] =
TYPE_SIZE[GL_HALF_FLOAT_OES] =
TYPE_SIZE[GL_UNSIGNED_SHORT_5_6_5] =
TYPE_SIZE[GL_UNSIGNED_SHORT_4_4_4_4] =
TYPE_SIZE[GL_UNSIGNED_SHORT_5_5_5_1] = 2;

TYPE_SIZE[GL_INT] =
TYPE_SIZE[GL_UNSIGNED_INT] =
TYPE_SIZE[GL_FLOAT] =
TYPE_SIZE[GL_UNSIGNED_INT_24_8_WEBGL] = 4;

function pixelSize (type, channels) {
  if (type === GL_UNSIGNED_SHORT_5_5_5_1 ||
      type === GL_UNSIGNED_SHORT_4_4_4_4 ||
      type === GL_UNSIGNED_SHORT_5_6_5) {
    return 2
  } else if (type === GL_UNSIGNED_INT_24_8_WEBGL) {
    return 4
  } else {
    return TYPE_SIZE[type] * channels
  }
}

function isPow2 (v) {
  return !(v & (v - 1)) && (!!v)
}

function checkTexture2D (info, mipData, limits) {
  var i;
  var w = mipData.width;
  var h = mipData.height;
  var c = mipData.channels;

  // Check texture shape
  check(w > 0 && w <= limits.maxTextureSize &&
        h > 0 && h <= limits.maxTextureSize,
        'invalid texture shape');

  // check wrap mode
  if (info.wrapS !== GL_CLAMP_TO_EDGE || info.wrapT !== GL_CLAMP_TO_EDGE) {
    check(isPow2(w) && isPow2(h),
      'incompatible wrap mode for texture, both width and height must be power of 2');
  }

  if (mipData.mipmask === 1) {
    if (w !== 1 && h !== 1) {
      check(
        info.minFilter !== GL_NEAREST_MIPMAP_NEAREST &&
        info.minFilter !== GL_NEAREST_MIPMAP_LINEAR &&
        info.minFilter !== GL_LINEAR_MIPMAP_NEAREST &&
        info.minFilter !== GL_LINEAR_MIPMAP_LINEAR,
        'min filter requires mipmap');
    }
  } else {
    // texture must be power of 2
    check(isPow2(w) && isPow2(h),
      'texture must be a square power of 2 to support mipmapping');
    check(mipData.mipmask === (w << 1) - 1,
      'missing or incomplete mipmap data');
  }

  if (mipData.type === GL_FLOAT) {
    if (limits.extensions.indexOf('oes_texture_float_linear') < 0) {
      check(info.minFilter === GL_NEAREST && info.magFilter === GL_NEAREST,
        'filter not supported, must enable oes_texture_float_linear');
    }
    check(!info.genMipmaps,
      'mipmap generation not supported with float textures');
  }

  // check image complete
  var mipimages = mipData.images;
  for (i = 0; i < 16; ++i) {
    if (mipimages[i]) {
      var mw = w >> i;
      var mh = h >> i;
      check(mipData.mipmask & (1 << i), 'missing mipmap data');

      var img = mipimages[i];

      check(
        img.width === mw &&
        img.height === mh,
        'invalid shape for mip images');

      check(
        img.format === mipData.format &&
        img.internalformat === mipData.internalformat &&
        img.type === mipData.type,
        'incompatible type for mip image');

      if (img.compressed) {
        // TODO: check size for compressed images
      } else if (img.data) {
        // check(img.data.byteLength === mw * mh *
        // Math.max(pixelSize(img.type, c), img.unpackAlignment),
        var rowSize = Math.ceil(pixelSize(img.type, c) * mw / img.unpackAlignment) * img.unpackAlignment;
        check(img.data.byteLength === rowSize * mh,
          'invalid data for image, buffer size is inconsistent with image format');
      } else if (img.element) {
        // TODO: check element can be loaded
      } else if (img.copy) {
        // TODO: check compatible format and type
      }
    } else if (!info.genMipmaps) {
      check((mipData.mipmask & (1 << i)) === 0, 'extra mipmap data');
    }
  }

  if (mipData.compressed) {
    check(!info.genMipmaps,
      'mipmap generation for compressed images not supported');
  }
}

function checkTextureCube (texture, info, faces, limits) {
  var w = texture.width;
  var h = texture.height;
  var c = texture.channels;

  // Check texture shape
  check(
    w > 0 && w <= limits.maxTextureSize && h > 0 && h <= limits.maxTextureSize,
    'invalid texture shape');
  check(
    w === h,
    'cube map must be square');
  check(
    info.wrapS === GL_CLAMP_TO_EDGE && info.wrapT === GL_CLAMP_TO_EDGE,
    'wrap mode not supported by cube map');

  for (var i = 0; i < faces.length; ++i) {
    var face = faces[i];
    check(
      face.width === w && face.height === h,
      'inconsistent cube map face shape');

    if (info.genMipmaps) {
      check(!face.compressed,
        'can not generate mipmap for compressed textures');
      check(face.mipmask === 1,
        'can not specify mipmaps and generate mipmaps');
    } else {
      // TODO: check mip and filter mode
    }

    var mipmaps = face.images;
    for (var j = 0; j < 16; ++j) {
      var img = mipmaps[j];
      if (img) {
        var mw = w >> j;
        var mh = h >> j;
        check(face.mipmask & (1 << j), 'missing mipmap data');
        check(
          img.width === mw &&
          img.height === mh,
          'invalid shape for mip images');
        check(
          img.format === texture.format &&
          img.internalformat === texture.internalformat &&
          img.type === texture.type,
          'incompatible type for mip image');

        if (img.compressed) {
          // TODO: check size for compressed images
        } else if (img.data) {
          check(img.data.byteLength === mw * mh *
            Math.max(pixelSize(img.type, c), img.unpackAlignment),
            'invalid data for image, buffer size is inconsistent with image format');
        } else if (img.element) {
          // TODO: check element can be loaded
        } else if (img.copy) {
          // TODO: check compatible format and type
        }
      }
    }
  }
}

var check$1 = extend(check, {
  optional: checkOptional,
  raise: raise,
  commandRaise: commandRaise,
  command: checkCommand,
  parameter: checkParameter,
  commandParameter: checkParameterCommand,
  constructor: checkConstructor,
  type: checkTypeOf,
  commandType: checkCommandType,
  isTypedArray: checkIsTypedArray,
  nni: checkNonNegativeInt,
  oneOf: checkOneOf,
  shaderError: checkShaderError,
  linkError: checkLinkError,
  callSite: guessCallSite,
  saveCommandRef: saveCommandRef,
  saveDrawInfo: saveDrawCommandInfo,
  framebufferFormat: checkFramebufferFormat,
  guessCommand: guessCommand,
  texture2D: checkTexture2D,
  textureCube: checkTextureCube
});

var VARIABLE_COUNTER = 0;

var DYN_FUNC = 0;

function DynamicVariable (type, data) {
  this.id = (VARIABLE_COUNTER++);
  this.type = type;
  this.data = data;
}

function escapeStr (str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function splitParts (str) {
  if (str.length === 0) {
    return []
  }

  var firstChar = str.charAt(0);
  var lastChar = str.charAt(str.length - 1);

  if (str.length > 1 &&
      firstChar === lastChar &&
      (firstChar === '"' || firstChar === "'")) {
    return ['"' + escapeStr(str.substr(1, str.length - 2)) + '"']
  }

  var parts = /\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(str);
  if (parts) {
    return (
      splitParts(str.substr(0, parts.index))
      .concat(splitParts(parts[1]))
      .concat(splitParts(str.substr(parts.index + parts[0].length)))
    )
  }

  var subparts = str.split('.');
  if (subparts.length === 1) {
    return ['"' + escapeStr(str) + '"']
  }

  var result = [];
  for (var i = 0; i < subparts.length; ++i) {
    result = result.concat(splitParts(subparts[i]));
  }
  return result
}

function toAccessorString (str) {
  return '[' + splitParts(str).join('][') + ']'
}

function defineDynamic (type, data) {
  return new DynamicVariable(type, toAccessorString(data + ''))
}

function isDynamic (x) {
  return (typeof x === 'function' && !x._reglType) ||
         x instanceof DynamicVariable
}

function unbox (x, path) {
  if (typeof x === 'function') {
    return new DynamicVariable(DYN_FUNC, x)
  }
  return x
}

var dynamic = {
  DynamicVariable: DynamicVariable,
  define: defineDynamic,
  isDynamic: isDynamic,
  unbox: unbox,
  accessor: toAccessorString
};

/* globals requestAnimationFrame, cancelAnimationFrame */
var raf = {
  next: typeof requestAnimationFrame === 'function'
    ? function (cb) { return requestAnimationFrame(cb) }
    : function (cb) { return setTimeout(cb, 16) },
  cancel: typeof cancelAnimationFrame === 'function'
    ? function (raf) { return cancelAnimationFrame(raf) }
    : clearTimeout
};

/* globals performance */
var clock = (typeof performance !== 'undefined' && performance.now)
  ? function () { return performance.now() }
  : function () { return +(new Date()) };

function createStringStore () {
  var stringIds = {'': 0};
  var stringValues = [''];
  return {
    id: function (str) {
      var result = stringIds[str];
      if (result) {
        return result
      }
      result = stringIds[str] = stringValues.length;
      stringValues.push(str);
      return result
    },

    str: function (id) {
      return stringValues[id]
    }
  }
}

// Context and canvas creation helper functions
function createCanvas (element, onDone, pixelRatio) {
  var canvas = document.createElement('canvas');
  extend(canvas.style, {
    border: 0,
    margin: 0,
    padding: 0,
    top: 0,
    left: 0
  });
  element.appendChild(canvas);

  if (element === document.body) {
    canvas.style.position = 'absolute';
    extend(element.style, {
      margin: 0,
      padding: 0
    });
  }

  function resize () {
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (element !== document.body) {
      var bounds = element.getBoundingClientRect();
      w = bounds.right - bounds.left;
      h = bounds.bottom - bounds.top;
    }
    canvas.width = pixelRatio * w;
    canvas.height = pixelRatio * h;
    extend(canvas.style, {
      width: w + 'px',
      height: h + 'px'
    });
  }

  window.addEventListener('resize', resize, false);

  function onDestroy () {
    window.removeEventListener('resize', resize);
    element.removeChild(canvas);
  }

  resize();

  return {
    canvas: canvas,
    onDestroy: onDestroy
  }
}

function createContext (canvas, contextAttributes) {
  function get (name) {
    try {
      return canvas.getContext(name, contextAttributes)
    } catch (e) {
      return null
    }
  }
  return (
    get('webgl') ||
    get('experimental-webgl') ||
    get('webgl-experimental')
  )
}

function isHTMLElement (obj) {
  return (
    typeof obj.nodeName === 'string' &&
    typeof obj.appendChild === 'function' &&
    typeof obj.getBoundingClientRect === 'function'
  )
}

function isWebGLContext (obj) {
  return (
    typeof obj.drawArrays === 'function' ||
    typeof obj.drawElements === 'function'
  )
}

function parseExtensions (input) {
  if (typeof input === 'string') {
    return input.split()
  }
  check$1(Array.isArray(input), 'invalid extension array');
  return input
}

function getElement (desc) {
  if (typeof desc === 'string') {
    check$1(typeof document !== 'undefined', 'not supported outside of DOM');
    return document.querySelector(desc)
  }
  return desc
}

function parseArgs (args_) {
  var args = args_ || {};
  var element, container, canvas, gl;
  var contextAttributes = {};
  var extensions = [];
  var optionalExtensions = [];
  var pixelRatio = (typeof window === 'undefined' ? 1 : window.devicePixelRatio);
  var profile = false;
  var onDone = function (err) {
    if (err) {
      check$1.raise(err);
    }
  };
  var onDestroy = function () {};
  if (typeof args === 'string') {
    check$1(
      typeof document !== 'undefined',
      'selector queries only supported in DOM enviroments');
    element = document.querySelector(args);
    check$1(element, 'invalid query string for element');
  } else if (typeof args === 'object') {
    if (isHTMLElement(args)) {
      element = args;
    } else if (isWebGLContext(args)) {
      gl = args;
      canvas = gl.canvas;
    } else {
      check$1.constructor(args);
      if ('gl' in args) {
        gl = args.gl;
      } else if ('canvas' in args) {
        canvas = getElement(args.canvas);
      } else if ('container' in args) {
        container = getElement(args.container);
      }
      if ('attributes' in args) {
        contextAttributes = args.attributes;
        check$1.type(contextAttributes, 'object', 'invalid context attributes');
      }
      if ('extensions' in args) {
        extensions = parseExtensions(args.extensions);
      }
      if ('optionalExtensions' in args) {
        optionalExtensions = parseExtensions(args.optionalExtensions);
      }
      if ('onDone' in args) {
        check$1.type(
          args.onDone, 'function',
          'invalid or missing onDone callback');
        onDone = args.onDone;
      }
      if ('profile' in args) {
        profile = !!args.profile;
      }
      if ('pixelRatio' in args) {
        pixelRatio = +args.pixelRatio;
        check$1(pixelRatio > 0, 'invalid pixel ratio');
      }
    }
  } else {
    check$1.raise('invalid arguments to regl');
  }

  if (element) {
    if (element.nodeName.toLowerCase() === 'canvas') {
      canvas = element;
    } else {
      container = element;
    }
  }

  if (!gl) {
    if (!canvas) {
      check$1(
        typeof document !== 'undefined',
        'must manually specify webgl context outside of DOM environments');
      var result = createCanvas(container || document.body, onDone, pixelRatio);
      if (!result) {
        return null
      }
      canvas = result.canvas;
      onDestroy = result.onDestroy;
    }
    gl = createContext(canvas, contextAttributes);
  }

  if (!gl) {
    onDestroy();
    onDone('webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org');
    return null
  }

  return {
    gl: gl,
    canvas: canvas,
    container: container,
    extensions: extensions,
    optionalExtensions: optionalExtensions,
    pixelRatio: pixelRatio,
    profile: profile,
    onDone: onDone,
    onDestroy: onDestroy
  }
}

function createExtensionCache (gl, config) {
  var extensions = {};

  function tryLoadExtension (name_) {
    check$1.type(name_, 'string', 'extension name must be string');
    var name = name_.toLowerCase();
    var ext;
    try {
      ext = extensions[name] = gl.getExtension(name);
    } catch (e) {}
    return !!ext
  }

  for (var i = 0; i < config.extensions.length; ++i) {
    var name = config.extensions[i];
    if (!tryLoadExtension(name)) {
      config.onDestroy();
      config.onDone('"' + name + '" extension is not supported by the current WebGL context, try upgrading your system or a different browser');
      return null
    }
  }

  config.optionalExtensions.forEach(tryLoadExtension);

  return {
    extensions: extensions,
    restore: function () {
      Object.keys(extensions).forEach(function (name) {
        if (!tryLoadExtension(name)) {
          throw new Error('(regl): error restoring extension ' + name)
        }
      });
    }
  }
}

function loop (n, f) {
  var result = Array(n);
  for (var i = 0; i < n; ++i) {
    result[i] = f(i);
  }
  return result
}

var GL_BYTE$1 = 5120;
var GL_UNSIGNED_BYTE$2 = 5121;
var GL_SHORT$1 = 5122;
var GL_UNSIGNED_SHORT$1 = 5123;
var GL_INT$1 = 5124;
var GL_UNSIGNED_INT$1 = 5125;
var GL_FLOAT$2 = 5126;

function nextPow16 (v) {
  for (var i = 16; i <= (1 << 28); i *= 16) {
    if (v <= i) {
      return i
    }
  }
  return 0
}

function log2 (v) {
  var r, shift;
  r = (v > 0xFFFF) << 4;
  v >>>= r;
  shift = (v > 0xFF) << 3;
  v >>>= shift; r |= shift;
  shift = (v > 0xF) << 2;
  v >>>= shift; r |= shift;
  shift = (v > 0x3) << 1;
  v >>>= shift; r |= shift;
  return r | (v >> 1)
}

function createPool () {
  var bufferPool = loop(8, function () {
    return []
  });

  function alloc (n) {
    var sz = nextPow16(n);
    var bin = bufferPool[log2(sz) >> 2];
    if (bin.length > 0) {
      return bin.pop()
    }
    return new ArrayBuffer(sz)
  }

  function free (buf) {
    bufferPool[log2(buf.byteLength) >> 2].push(buf);
  }

  function allocType (type, n) {
    var result = null;
    switch (type) {
      case GL_BYTE$1:
        result = new Int8Array(alloc(n), 0, n);
        break
      case GL_UNSIGNED_BYTE$2:
        result = new Uint8Array(alloc(n), 0, n);
        break
      case GL_SHORT$1:
        result = new Int16Array(alloc(2 * n), 0, n);
        break
      case GL_UNSIGNED_SHORT$1:
        result = new Uint16Array(alloc(2 * n), 0, n);
        break
      case GL_INT$1:
        result = new Int32Array(alloc(4 * n), 0, n);
        break
      case GL_UNSIGNED_INT$1:
        result = new Uint32Array(alloc(4 * n), 0, n);
        break
      case GL_FLOAT$2:
        result = new Float32Array(alloc(4 * n), 0, n);
        break
      default:
        return null
    }
    if (result.length !== n) {
      return result.subarray(0, n)
    }
    return result
  }

  function freeType (array) {
    free(array.buffer);
  }

  return {
    alloc: alloc,
    free: free,
    allocType: allocType,
    freeType: freeType
  }
}

var pool = createPool();

// zero pool for initial zero data
pool.zero = createPool();

var GL_SUBPIXEL_BITS = 0x0D50;
var GL_RED_BITS = 0x0D52;
var GL_GREEN_BITS = 0x0D53;
var GL_BLUE_BITS = 0x0D54;
var GL_ALPHA_BITS = 0x0D55;
var GL_DEPTH_BITS = 0x0D56;
var GL_STENCIL_BITS = 0x0D57;

var GL_ALIASED_POINT_SIZE_RANGE = 0x846D;
var GL_ALIASED_LINE_WIDTH_RANGE = 0x846E;

var GL_MAX_TEXTURE_SIZE = 0x0D33;
var GL_MAX_VIEWPORT_DIMS = 0x0D3A;
var GL_MAX_VERTEX_ATTRIBS = 0x8869;
var GL_MAX_VERTEX_UNIFORM_VECTORS = 0x8DFB;
var GL_MAX_VARYING_VECTORS = 0x8DFC;
var GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D;
var GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8B4C;
var GL_MAX_TEXTURE_IMAGE_UNITS = 0x8872;
var GL_MAX_FRAGMENT_UNIFORM_VECTORS = 0x8DFD;
var GL_MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C;
var GL_MAX_RENDERBUFFER_SIZE = 0x84E8;

var GL_VENDOR = 0x1F00;
var GL_RENDERER = 0x1F01;
var GL_VERSION = 0x1F02;
var GL_SHADING_LANGUAGE_VERSION = 0x8B8C;

var GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF;

var GL_MAX_COLOR_ATTACHMENTS_WEBGL = 0x8CDF;
var GL_MAX_DRAW_BUFFERS_WEBGL = 0x8824;

var GL_TEXTURE_2D = 0x0DE1;
var GL_TEXTURE_CUBE_MAP = 0x8513;
var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
var GL_TEXTURE0 = 0x84C0;
var GL_RGBA = 0x1908;
var GL_FLOAT$1 = 0x1406;
var GL_UNSIGNED_BYTE$1 = 0x1401;
var GL_FRAMEBUFFER = 0x8D40;
var GL_FRAMEBUFFER_COMPLETE = 0x8CD5;
var GL_COLOR_ATTACHMENT0 = 0x8CE0;
var GL_COLOR_BUFFER_BIT$1 = 0x4000;

var wrapLimits = function (gl, extensions) {
  var maxAnisotropic = 1;
  if (extensions.ext_texture_filter_anisotropic) {
    maxAnisotropic = gl.getParameter(GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT);
  }

  var maxDrawbuffers = 1;
  var maxColorAttachments = 1;
  if (extensions.webgl_draw_buffers) {
    maxDrawbuffers = gl.getParameter(GL_MAX_DRAW_BUFFERS_WEBGL);
    maxColorAttachments = gl.getParameter(GL_MAX_COLOR_ATTACHMENTS_WEBGL);
  }

  // detect if reading float textures is available (Safari doesn't support)
  var readFloat = !!extensions.oes_texture_float;
  if (readFloat) {
    var readFloatTexture = gl.createTexture();
    gl.bindTexture(GL_TEXTURE_2D, readFloatTexture);
    gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, 1, 1, 0, GL_RGBA, GL_FLOAT$1, null);

    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(GL_FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, readFloatTexture, 0);
    gl.bindTexture(GL_TEXTURE_2D, null);

    if (gl.checkFramebufferStatus(GL_FRAMEBUFFER) !== GL_FRAMEBUFFER_COMPLETE) readFloat = false;

    else {
      gl.viewport(0, 0, 1, 1);
      gl.clearColor(1.0, 0.0, 0.0, 1.0);
      gl.clear(GL_COLOR_BUFFER_BIT$1);
      var pixels = pool.allocType(GL_FLOAT$1, 4);
      gl.readPixels(0, 0, 1, 1, GL_RGBA, GL_FLOAT$1, pixels);

      if (gl.getError()) readFloat = false;
      else {
        gl.deleteFramebuffer(fbo);
        gl.deleteTexture(readFloatTexture);

        readFloat = pixels[0] === 1.0;
      }

      pool.freeType(pixels);
    }
  }

  // detect non power of two cube textures support (IE doesn't support)
  var npotTextureCube = true;
  var cubeTexture = gl.createTexture();
  var data = pool.allocType(GL_UNSIGNED_BYTE$1, 36);
  gl.activeTexture(GL_TEXTURE0);
  gl.bindTexture(GL_TEXTURE_CUBE_MAP, cubeTexture);
  gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X, 0, GL_RGBA, 3, 3, 0, GL_RGBA, GL_UNSIGNED_BYTE$1, data);
  pool.freeType(data);
  gl.bindTexture(GL_TEXTURE_CUBE_MAP, null);
  gl.deleteTexture(cubeTexture);
  npotTextureCube = !gl.getError();

  return {
    // drawing buffer bit depth
    colorBits: [
      gl.getParameter(GL_RED_BITS),
      gl.getParameter(GL_GREEN_BITS),
      gl.getParameter(GL_BLUE_BITS),
      gl.getParameter(GL_ALPHA_BITS)
    ],
    depthBits: gl.getParameter(GL_DEPTH_BITS),
    stencilBits: gl.getParameter(GL_STENCIL_BITS),
    subpixelBits: gl.getParameter(GL_SUBPIXEL_BITS),

    // supported extensions
    extensions: Object.keys(extensions).filter(function (ext) {
      return !!extensions[ext]
    }),

    // max aniso samples
    maxAnisotropic: maxAnisotropic,

    // max draw buffers
    maxDrawbuffers: maxDrawbuffers,
    maxColorAttachments: maxColorAttachments,

    // point and line size ranges
    pointSizeDims: gl.getParameter(GL_ALIASED_POINT_SIZE_RANGE),
    lineWidthDims: gl.getParameter(GL_ALIASED_LINE_WIDTH_RANGE),
    maxViewportDims: gl.getParameter(GL_MAX_VIEWPORT_DIMS),
    maxCombinedTextureUnits: gl.getParameter(GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS),
    maxCubeMapSize: gl.getParameter(GL_MAX_CUBE_MAP_TEXTURE_SIZE),
    maxRenderbufferSize: gl.getParameter(GL_MAX_RENDERBUFFER_SIZE),
    maxTextureUnits: gl.getParameter(GL_MAX_TEXTURE_IMAGE_UNITS),
    maxTextureSize: gl.getParameter(GL_MAX_TEXTURE_SIZE),
    maxAttributes: gl.getParameter(GL_MAX_VERTEX_ATTRIBS),
    maxVertexUniforms: gl.getParameter(GL_MAX_VERTEX_UNIFORM_VECTORS),
    maxVertexTextureUnits: gl.getParameter(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS),
    maxVaryingVectors: gl.getParameter(GL_MAX_VARYING_VECTORS),
    maxFragmentUniforms: gl.getParameter(GL_MAX_FRAGMENT_UNIFORM_VECTORS),

    // vendor info
    glsl: gl.getParameter(GL_SHADING_LANGUAGE_VERSION),
    renderer: gl.getParameter(GL_RENDERER),
    vendor: gl.getParameter(GL_VENDOR),
    version: gl.getParameter(GL_VERSION),

    // quirks
    readFloat: readFloat,
    npotTextureCube: npotTextureCube
  }
};

function isNDArrayLike (obj) {
  return (
    !!obj &&
    typeof obj === 'object' &&
    Array.isArray(obj.shape) &&
    Array.isArray(obj.stride) &&
    typeof obj.offset === 'number' &&
    obj.shape.length === obj.stride.length &&
    (Array.isArray(obj.data) ||
      isTypedArray(obj.data)))
}

var values = function (obj) {
  return Object.keys(obj).map(function (key) { return obj[key] })
};

var flattenUtils = {
  shape: arrayShape$1,
  flatten: flattenArray
};

function flatten1D (array, nx, out) {
  for (var i = 0; i < nx; ++i) {
    out[i] = array[i];
  }
}

function flatten2D (array, nx, ny, out) {
  var ptr = 0;
  for (var i = 0; i < nx; ++i) {
    var row = array[i];
    for (var j = 0; j < ny; ++j) {
      out[ptr++] = row[j];
    }
  }
}

function flatten3D (array, nx, ny, nz, out, ptr_) {
  var ptr = ptr_;
  for (var i = 0; i < nx; ++i) {
    var row = array[i];
    for (var j = 0; j < ny; ++j) {
      var col = row[j];
      for (var k = 0; k < nz; ++k) {
        out[ptr++] = col[k];
      }
    }
  }
}

function flattenRec (array, shape, level, out, ptr) {
  var stride = 1;
  for (var i = level + 1; i < shape.length; ++i) {
    stride *= shape[i];
  }
  var n = shape[level];
  if (shape.length - level === 4) {
    var nx = shape[level + 1];
    var ny = shape[level + 2];
    var nz = shape[level + 3];
    for (i = 0; i < n; ++i) {
      flatten3D(array[i], nx, ny, nz, out, ptr);
      ptr += stride;
    }
  } else {
    for (i = 0; i < n; ++i) {
      flattenRec(array[i], shape, level + 1, out, ptr);
      ptr += stride;
    }
  }
}

function flattenArray (array, shape, type, out_) {
  var sz = 1;
  if (shape.length) {
    for (var i = 0; i < shape.length; ++i) {
      sz *= shape[i];
    }
  } else {
    sz = 0;
  }
  var out = out_ || pool.allocType(type, sz);
  switch (shape.length) {
    case 0:
      break
    case 1:
      flatten1D(array, shape[0], out);
      break
    case 2:
      flatten2D(array, shape[0], shape[1], out);
      break
    case 3:
      flatten3D(array, shape[0], shape[1], shape[2], out, 0);
      break
    default:
      flattenRec(array, shape, 0, out, 0);
  }
  return out
}

function arrayShape$1 (array_) {
  var shape = [];
  for (var array = array_; array.length; array = array[0]) {
    shape.push(array.length);
  }
  return shape
}

var arrayTypes = {
	"[object Int8Array]": 5120,
	"[object Int16Array]": 5122,
	"[object Int32Array]": 5124,
	"[object Uint8Array]": 5121,
	"[object Uint8ClampedArray]": 5121,
	"[object Uint16Array]": 5123,
	"[object Uint32Array]": 5125,
	"[object Float32Array]": 5126,
	"[object Float64Array]": 5121,
	"[object ArrayBuffer]": 5121
};

var int8 = 5120;
var int16 = 5122;
var int32 = 5124;
var uint8 = 5121;
var uint16 = 5123;
var uint32 = 5125;
var float = 5126;
var float32 = 5126;
var glTypes = {
	int8: int8,
	int16: int16,
	int32: int32,
	uint8: uint8,
	uint16: uint16,
	uint32: uint32,
	float: float,
	float32: float32
};

var dynamic$1 = 35048;
var stream = 35040;
var usageTypes = {
	dynamic: dynamic$1,
	stream: stream,
	"static": 35044
};

var arrayFlatten = flattenUtils.flatten;
var arrayShape = flattenUtils.shape;

var GL_STATIC_DRAW = 0x88E4;
var GL_STREAM_DRAW = 0x88E0;

var GL_UNSIGNED_BYTE$3 = 5121;
var GL_FLOAT$3 = 5126;

var DTYPES_SIZES = [];
DTYPES_SIZES[5120] = 1; // int8
DTYPES_SIZES[5122] = 2; // int16
DTYPES_SIZES[5124] = 4; // int32
DTYPES_SIZES[5121] = 1; // uint8
DTYPES_SIZES[5123] = 2; // uint16
DTYPES_SIZES[5125] = 4; // uint32
DTYPES_SIZES[5126] = 4; // float32

function typedArrayCode (data) {
  return arrayTypes[Object.prototype.toString.call(data)] | 0
}

function copyArray (out, inp) {
  for (var i = 0; i < inp.length; ++i) {
    out[i] = inp[i];
  }
}

function transpose (
  result, data, shapeX, shapeY, strideX, strideY, offset) {
  var ptr = 0;
  for (var i = 0; i < shapeX; ++i) {
    for (var j = 0; j < shapeY; ++j) {
      result[ptr++] = data[strideX * i + strideY * j + offset];
    }
  }
}

function wrapBufferState (gl, stats, config, attributeState) {
  var bufferCount = 0;
  var bufferSet = {};

  function REGLBuffer (type) {
    this.id = bufferCount++;
    this.buffer = gl.createBuffer();
    this.type = type;
    this.usage = GL_STATIC_DRAW;
    this.byteLength = 0;
    this.dimension = 1;
    this.dtype = GL_UNSIGNED_BYTE$3;

    this.persistentData = null;

    if (config.profile) {
      this.stats = {size: 0};
    }
  }

  REGLBuffer.prototype.bind = function () {
    gl.bindBuffer(this.type, this.buffer);
  };

  REGLBuffer.prototype.destroy = function () {
    destroy(this);
  };

  var streamPool = [];

  function createStream (type, data) {
    var buffer = streamPool.pop();
    if (!buffer) {
      buffer = new REGLBuffer(type);
    }
    buffer.bind();
    initBufferFromData(buffer, data, GL_STREAM_DRAW, 0, 1, false);
    return buffer
  }

  function destroyStream (stream$$1) {
    streamPool.push(stream$$1);
  }

  function initBufferFromTypedArray (buffer, data, usage) {
    buffer.byteLength = data.byteLength;
    gl.bufferData(buffer.type, data, usage);
  }

  function initBufferFromData (buffer, data, usage, dtype, dimension, persist) {
    var shape;
    buffer.usage = usage;
    if (Array.isArray(data)) {
      buffer.dtype = dtype || GL_FLOAT$3;
      if (data.length > 0) {
        var flatData;
        if (Array.isArray(data[0])) {
          shape = arrayShape(data);
          var dim = 1;
          for (var i = 1; i < shape.length; ++i) {
            dim *= shape[i];
          }
          buffer.dimension = dim;
          flatData = arrayFlatten(data, shape, buffer.dtype);
          initBufferFromTypedArray(buffer, flatData, usage);
          if (persist) {
            buffer.persistentData = flatData;
          } else {
            pool.freeType(flatData);
          }
        } else if (typeof data[0] === 'number') {
          buffer.dimension = dimension;
          var typedData = pool.allocType(buffer.dtype, data.length);
          copyArray(typedData, data);
          initBufferFromTypedArray(buffer, typedData, usage);
          if (persist) {
            buffer.persistentData = typedData;
          } else {
            pool.freeType(typedData);
          }
        } else if (isTypedArray(data[0])) {
          buffer.dimension = data[0].length;
          buffer.dtype = dtype || typedArrayCode(data[0]) || GL_FLOAT$3;
          flatData = arrayFlatten(
            data,
            [data.length, data[0].length],
            buffer.dtype);
          initBufferFromTypedArray(buffer, flatData, usage);
          if (persist) {
            buffer.persistentData = flatData;
          } else {
            pool.freeType(flatData);
          }
        } else {
          check$1.raise('invalid buffer data');
        }
      }
    } else if (isTypedArray(data)) {
      buffer.dtype = dtype || typedArrayCode(data);
      buffer.dimension = dimension;
      initBufferFromTypedArray(buffer, data, usage);
      if (persist) {
        buffer.persistentData = new Uint8Array(new Uint8Array(data.buffer));
      }
    } else if (isNDArrayLike(data)) {
      shape = data.shape;
      var stride = data.stride;
      var offset = data.offset;

      var shapeX = 0;
      var shapeY = 0;
      var strideX = 0;
      var strideY = 0;
      if (shape.length === 1) {
        shapeX = shape[0];
        shapeY = 1;
        strideX = stride[0];
        strideY = 0;
      } else if (shape.length === 2) {
        shapeX = shape[0];
        shapeY = shape[1];
        strideX = stride[0];
        strideY = stride[1];
      } else {
        check$1.raise('invalid shape');
      }

      buffer.dtype = dtype || typedArrayCode(data.data) || GL_FLOAT$3;
      buffer.dimension = shapeY;

      var transposeData = pool.allocType(buffer.dtype, shapeX * shapeY);
      transpose(transposeData,
        data.data,
        shapeX, shapeY,
        strideX, strideY,
        offset);
      initBufferFromTypedArray(buffer, transposeData, usage);
      if (persist) {
        buffer.persistentData = transposeData;
      } else {
        pool.freeType(transposeData);
      }
    } else {
      check$1.raise('invalid buffer data');
    }
  }

  function destroy (buffer) {
    stats.bufferCount--;

    for (var i = 0; i < attributeState.state.length; ++i) {
      var record = attributeState.state[i];
      if (record.buffer === buffer) {
        gl.disableVertexAttribArray(i);
        record.buffer = null;
      }
    }

    var handle = buffer.buffer;
    check$1(handle, 'buffer must not be deleted already');
    gl.deleteBuffer(handle);
    buffer.buffer = null;
    delete bufferSet[buffer.id];
  }

  function createBuffer (options, type, deferInit, persistent) {
    stats.bufferCount++;

    var buffer = new REGLBuffer(type);
    bufferSet[buffer.id] = buffer;

    function reglBuffer (options) {
      var usage = GL_STATIC_DRAW;
      var data = null;
      var byteLength = 0;
      var dtype = 0;
      var dimension = 1;
      if (Array.isArray(options) ||
          isTypedArray(options) ||
          isNDArrayLike(options)) {
        data = options;
      } else if (typeof options === 'number') {
        byteLength = options | 0;
      } else if (options) {
        check$1.type(
          options, 'object',
          'buffer arguments must be an object, a number or an array');

        if ('data' in options) {
          check$1(
            data === null ||
            Array.isArray(data) ||
            isTypedArray(data) ||
            isNDArrayLike(data),
            'invalid data for buffer');
          data = options.data;
        }

        if ('usage' in options) {
          check$1.parameter(options.usage, usageTypes, 'invalid buffer usage');
          usage = usageTypes[options.usage];
        }

        if ('type' in options) {
          check$1.parameter(options.type, glTypes, 'invalid buffer type');
          dtype = glTypes[options.type];
        }

        if ('dimension' in options) {
          check$1.type(options.dimension, 'number', 'invalid dimension');
          dimension = options.dimension | 0;
        }

        if ('length' in options) {
          check$1.nni(byteLength, 'buffer length must be a nonnegative integer');
          byteLength = options.length | 0;
        }
      }

      buffer.bind();
      if (!data) {
        // #475
        if (byteLength) gl.bufferData(buffer.type, byteLength, usage);
        buffer.dtype = dtype || GL_UNSIGNED_BYTE$3;
        buffer.usage = usage;
        buffer.dimension = dimension;
        buffer.byteLength = byteLength;
      } else {
        initBufferFromData(buffer, data, usage, dtype, dimension, persistent);
      }

      if (config.profile) {
        buffer.stats.size = buffer.byteLength * DTYPES_SIZES[buffer.dtype];
      }

      return reglBuffer
    }

    function setSubData (data, offset) {
      check$1(offset + data.byteLength <= buffer.byteLength,
        'invalid buffer subdata call, buffer is too small. ' + ' Can\'t write data of size ' + data.byteLength + ' starting from offset ' + offset + ' to a buffer of size ' + buffer.byteLength);

      gl.bufferSubData(buffer.type, offset, data);
    }

    function subdata (data, offset_) {
      var offset = (offset_ || 0) | 0;
      var shape;
      buffer.bind();
      if (isTypedArray(data)) {
        setSubData(data, offset);
      } else if (Array.isArray(data)) {
        if (data.length > 0) {
          if (typeof data[0] === 'number') {
            var converted = pool.allocType(buffer.dtype, data.length);
            copyArray(converted, data);
            setSubData(converted, offset);
            pool.freeType(converted);
          } else if (Array.isArray(data[0]) || isTypedArray(data[0])) {
            shape = arrayShape(data);
            var flatData = arrayFlatten(data, shape, buffer.dtype);
            setSubData(flatData, offset);
            pool.freeType(flatData);
          } else {
            check$1.raise('invalid buffer data');
          }
        }
      } else if (isNDArrayLike(data)) {
        shape = data.shape;
        var stride = data.stride;

        var shapeX = 0;
        var shapeY = 0;
        var strideX = 0;
        var strideY = 0;
        if (shape.length === 1) {
          shapeX = shape[0];
          shapeY = 1;
          strideX = stride[0];
          strideY = 0;
        } else if (shape.length === 2) {
          shapeX = shape[0];
          shapeY = shape[1];
          strideX = stride[0];
          strideY = stride[1];
        } else {
          check$1.raise('invalid shape');
        }
        var dtype = Array.isArray(data.data)
          ? buffer.dtype
          : typedArrayCode(data.data);

        var transposeData = pool.allocType(dtype, shapeX * shapeY);
        transpose(transposeData,
          data.data,
          shapeX, shapeY,
          strideX, strideY,
          data.offset);
        setSubData(transposeData, offset);
        pool.freeType(transposeData);
      } else {
        check$1.raise('invalid data for buffer subdata');
      }
      return reglBuffer
    }

    if (!deferInit) {
      reglBuffer(options);
    }

    reglBuffer._reglType = 'buffer';
    reglBuffer._buffer = buffer;
    reglBuffer.subdata = subdata;
    if (config.profile) {
      reglBuffer.stats = buffer.stats;
    }
    reglBuffer.destroy = function () { destroy(buffer); };

    return reglBuffer
  }

  function restoreBuffers () {
    values(bufferSet).forEach(function (buffer) {
      buffer.buffer = gl.createBuffer();
      gl.bindBuffer(buffer.type, buffer.buffer);
      gl.bufferData(
        buffer.type, buffer.persistentData || buffer.byteLength, buffer.usage);
    });
  }

  if (config.profile) {
    stats.getTotalBufferSize = function () {
      var total = 0;
      // TODO: Right now, the streams are not part of the total count.
      Object.keys(bufferSet).forEach(function (key) {
        total += bufferSet[key].stats.size;
      });
      return total
    };
  }

  return {
    create: createBuffer,

    createStream: createStream,
    destroyStream: destroyStream,

    clear: function () {
      values(bufferSet).forEach(destroy);
      streamPool.forEach(destroy);
    },

    getBuffer: function (wrapper) {
      if (wrapper && wrapper._buffer instanceof REGLBuffer) {
        return wrapper._buffer
      }
      return null
    },

    restore: restoreBuffers,

    _initBuffer: initBufferFromData
  }
}

var points = 0;
var point = 0;
var lines = 1;
var line = 1;
var triangles = 4;
var triangle = 4;
var primTypes = {
	points: points,
	point: point,
	lines: lines,
	line: line,
	triangles: triangles,
	triangle: triangle,
	"line loop": 2,
	"line strip": 3,
	"triangle strip": 5,
	"triangle fan": 6
};

var GL_POINTS = 0;
var GL_LINES = 1;
var GL_TRIANGLES = 4;

var GL_BYTE$2 = 5120;
var GL_UNSIGNED_BYTE$4 = 5121;
var GL_SHORT$2 = 5122;
var GL_UNSIGNED_SHORT$2 = 5123;
var GL_INT$2 = 5124;
var GL_UNSIGNED_INT$2 = 5125;

var GL_ELEMENT_ARRAY_BUFFER = 34963;

var GL_STREAM_DRAW$1 = 0x88E0;
var GL_STATIC_DRAW$1 = 0x88E4;

function wrapElementsState (gl, extensions, bufferState, stats) {
  var elementSet = {};
  var elementCount = 0;

  var elementTypes = {
    'uint8': GL_UNSIGNED_BYTE$4,
    'uint16': GL_UNSIGNED_SHORT$2
  };

  if (extensions.oes_element_index_uint) {
    elementTypes.uint32 = GL_UNSIGNED_INT$2;
  }

  function REGLElementBuffer (buffer) {
    this.id = elementCount++;
    elementSet[this.id] = this;
    this.buffer = buffer;
    this.primType = GL_TRIANGLES;
    this.vertCount = 0;
    this.type = 0;
  }

  REGLElementBuffer.prototype.bind = function () {
    this.buffer.bind();
  };

  var bufferPool = [];

  function createElementStream (data) {
    var result = bufferPool.pop();
    if (!result) {
      result = new REGLElementBuffer(bufferState.create(
        null,
        GL_ELEMENT_ARRAY_BUFFER,
        true,
        false)._buffer);
    }
    initElements(result, data, GL_STREAM_DRAW$1, -1, -1, 0, 0);
    return result
  }

  function destroyElementStream (elements) {
    bufferPool.push(elements);
  }

  function initElements (
    elements,
    data,
    usage,
    prim,
    count,
    byteLength,
    type) {
    elements.buffer.bind();
    if (data) {
      var predictedType = type;
      if (!type && (
          !isTypedArray(data) ||
         (isNDArrayLike(data) && !isTypedArray(data.data)))) {
        predictedType = extensions.oes_element_index_uint
          ? GL_UNSIGNED_INT$2
          : GL_UNSIGNED_SHORT$2;
      }
      bufferState._initBuffer(
        elements.buffer,
        data,
        usage,
        predictedType,
        3);
    } else {
      gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, byteLength, usage);
      elements.buffer.dtype = dtype || GL_UNSIGNED_BYTE$4;
      elements.buffer.usage = usage;
      elements.buffer.dimension = 3;
      elements.buffer.byteLength = byteLength;
    }

    var dtype = type;
    if (!type) {
      switch (elements.buffer.dtype) {
        case GL_UNSIGNED_BYTE$4:
        case GL_BYTE$2:
          dtype = GL_UNSIGNED_BYTE$4;
          break

        case GL_UNSIGNED_SHORT$2:
        case GL_SHORT$2:
          dtype = GL_UNSIGNED_SHORT$2;
          break

        case GL_UNSIGNED_INT$2:
        case GL_INT$2:
          dtype = GL_UNSIGNED_INT$2;
          break

        default:
          check$1.raise('unsupported type for element array');
      }
      elements.buffer.dtype = dtype;
    }
    elements.type = dtype;

    // Check oes_element_index_uint extension
    check$1(
      dtype !== GL_UNSIGNED_INT$2 ||
      !!extensions.oes_element_index_uint,
      '32 bit element buffers not supported, enable oes_element_index_uint first');

    // try to guess default primitive type and arguments
    var vertCount = count;
    if (vertCount < 0) {
      vertCount = elements.buffer.byteLength;
      if (dtype === GL_UNSIGNED_SHORT$2) {
        vertCount >>= 1;
      } else if (dtype === GL_UNSIGNED_INT$2) {
        vertCount >>= 2;
      }
    }
    elements.vertCount = vertCount;

    // try to guess primitive type from cell dimension
    var primType = prim;
    if (prim < 0) {
      primType = GL_TRIANGLES;
      var dimension = elements.buffer.dimension;
      if (dimension === 1) primType = GL_POINTS;
      if (dimension === 2) primType = GL_LINES;
      if (dimension === 3) primType = GL_TRIANGLES;
    }
    elements.primType = primType;
  }

  function destroyElements (elements) {
    stats.elementsCount--;

    check$1(elements.buffer !== null, 'must not double destroy elements');
    delete elementSet[elements.id];
    elements.buffer.destroy();
    elements.buffer = null;
  }

  function createElements (options, persistent) {
    var buffer = bufferState.create(null, GL_ELEMENT_ARRAY_BUFFER, true);
    var elements = new REGLElementBuffer(buffer._buffer);
    stats.elementsCount++;

    function reglElements (options) {
      if (!options) {
        buffer();
        elements.primType = GL_TRIANGLES;
        elements.vertCount = 0;
        elements.type = GL_UNSIGNED_BYTE$4;
      } else if (typeof options === 'number') {
        buffer(options);
        elements.primType = GL_TRIANGLES;
        elements.vertCount = options | 0;
        elements.type = GL_UNSIGNED_BYTE$4;
      } else {
        var data = null;
        var usage = GL_STATIC_DRAW$1;
        var primType = -1;
        var vertCount = -1;
        var byteLength = 0;
        var dtype = 0;
        if (Array.isArray(options) ||
            isTypedArray(options) ||
            isNDArrayLike(options)) {
          data = options;
        } else {
          check$1.type(options, 'object', 'invalid arguments for elements');
          if ('data' in options) {
            data = options.data;
            check$1(
                Array.isArray(data) ||
                isTypedArray(data) ||
                isNDArrayLike(data),
                'invalid data for element buffer');
          }
          if ('usage' in options) {
            check$1.parameter(
              options.usage,
              usageTypes,
              'invalid element buffer usage');
            usage = usageTypes[options.usage];
          }
          if ('primitive' in options) {
            check$1.parameter(
              options.primitive,
              primTypes,
              'invalid element buffer primitive');
            primType = primTypes[options.primitive];
          }
          if ('count' in options) {
            check$1(
              typeof options.count === 'number' && options.count >= 0,
              'invalid vertex count for elements');
            vertCount = options.count | 0;
          }
          if ('type' in options) {
            check$1.parameter(
              options.type,
              elementTypes,
              'invalid buffer type');
            dtype = elementTypes[options.type];
          }
          if ('length' in options) {
            byteLength = options.length | 0;
          } else {
            byteLength = vertCount;
            if (dtype === GL_UNSIGNED_SHORT$2 || dtype === GL_SHORT$2) {
              byteLength *= 2;
            } else if (dtype === GL_UNSIGNED_INT$2 || dtype === GL_INT$2) {
              byteLength *= 4;
            }
          }
        }
        initElements(
          elements,
          data,
          usage,
          primType,
          vertCount,
          byteLength,
          dtype);
      }

      return reglElements
    }

    reglElements(options);

    reglElements._reglType = 'elements';
    reglElements._elements = elements;
    reglElements.subdata = function (data, offset) {
      buffer.subdata(data, offset);
      return reglElements
    };
    reglElements.destroy = function () {
      destroyElements(elements);
    };

    return reglElements
  }

  return {
    create: createElements,
    createStream: createElementStream,
    destroyStream: destroyElementStream,
    getElements: function (elements) {
      if (typeof elements === 'function' &&
          elements._elements instanceof REGLElementBuffer) {
        return elements._elements
      }
      return null
    },
    clear: function () {
      values(elementSet).forEach(destroyElements);
    }
  }
}

var FLOAT = new Float32Array(1);
var INT = new Uint32Array(FLOAT.buffer);

var GL_UNSIGNED_SHORT$4 = 5123;

function convertToHalfFloat (array) {
  var ushorts = pool.allocType(GL_UNSIGNED_SHORT$4, array.length);

  for (var i = 0; i < array.length; ++i) {
    if (isNaN(array[i])) {
      ushorts[i] = 0xffff;
    } else if (array[i] === Infinity) {
      ushorts[i] = 0x7c00;
    } else if (array[i] === -Infinity) {
      ushorts[i] = 0xfc00;
    } else {
      FLOAT[0] = array[i];
      var x = INT[0];

      var sgn = (x >>> 31) << 15;
      var exp = ((x << 1) >>> 24) - 127;
      var frac = (x >> 13) & ((1 << 10) - 1);

      if (exp < -24) {
        // round non-representable denormals to 0
        ushorts[i] = sgn;
      } else if (exp < -14) {
        // handle denormals
        var s = -14 - exp;
        ushorts[i] = sgn + ((frac + (1 << 10)) >> s);
      } else if (exp > 15) {
        // round overflow to +/- Infinity
        ushorts[i] = sgn + 0x7c00;
      } else {
        // otherwise convert directly
        ushorts[i] = sgn + ((exp + 15) << 10) + frac;
      }
    }
  }

  return ushorts
}

function isArrayLike (s) {
  return Array.isArray(s) || isTypedArray(s)
}

var isPow2$1 = function (v) {
  return !(v & (v - 1)) && (!!v)
};

var GL_COMPRESSED_TEXTURE_FORMATS = 0x86A3;

var GL_TEXTURE_2D$1 = 0x0DE1;
var GL_TEXTURE_CUBE_MAP$1 = 0x8513;
var GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 = 0x8515;

var GL_RGBA$1 = 0x1908;
var GL_ALPHA = 0x1906;
var GL_RGB = 0x1907;
var GL_LUMINANCE = 0x1909;
var GL_LUMINANCE_ALPHA = 0x190A;

var GL_RGBA4 = 0x8056;
var GL_RGB5_A1 = 0x8057;
var GL_RGB565 = 0x8D62;

var GL_UNSIGNED_SHORT_4_4_4_4$1 = 0x8033;
var GL_UNSIGNED_SHORT_5_5_5_1$1 = 0x8034;
var GL_UNSIGNED_SHORT_5_6_5$1 = 0x8363;
var GL_UNSIGNED_INT_24_8_WEBGL$1 = 0x84FA;

var GL_DEPTH_COMPONENT = 0x1902;
var GL_DEPTH_STENCIL = 0x84F9;

var GL_SRGB_EXT = 0x8C40;
var GL_SRGB_ALPHA_EXT = 0x8C42;

var GL_HALF_FLOAT_OES$1 = 0x8D61;

var GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0;
var GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1;
var GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2;
var GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;

var GL_COMPRESSED_RGB_ATC_WEBGL = 0x8C92;
var GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 0x8C93;
var GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 0x87EE;

var GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;
var GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;
var GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
var GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;

var GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8D64;

var GL_UNSIGNED_BYTE$5 = 0x1401;
var GL_UNSIGNED_SHORT$3 = 0x1403;
var GL_UNSIGNED_INT$3 = 0x1405;
var GL_FLOAT$4 = 0x1406;

var GL_TEXTURE_WRAP_S = 0x2802;
var GL_TEXTURE_WRAP_T = 0x2803;

var GL_REPEAT = 0x2901;
var GL_CLAMP_TO_EDGE$1 = 0x812F;
var GL_MIRRORED_REPEAT = 0x8370;

var GL_TEXTURE_MAG_FILTER = 0x2800;
var GL_TEXTURE_MIN_FILTER = 0x2801;

var GL_NEAREST$1 = 0x2600;
var GL_LINEAR = 0x2601;
var GL_NEAREST_MIPMAP_NEAREST$1 = 0x2700;
var GL_LINEAR_MIPMAP_NEAREST$1 = 0x2701;
var GL_NEAREST_MIPMAP_LINEAR$1 = 0x2702;
var GL_LINEAR_MIPMAP_LINEAR$1 = 0x2703;

var GL_GENERATE_MIPMAP_HINT = 0x8192;
var GL_DONT_CARE = 0x1100;
var GL_FASTEST = 0x1101;
var GL_NICEST = 0x1102;

var GL_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FE;

var GL_UNPACK_ALIGNMENT = 0x0CF5;
var GL_UNPACK_FLIP_Y_WEBGL = 0x9240;
var GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
var GL_UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;

var GL_BROWSER_DEFAULT_WEBGL = 0x9244;

var GL_TEXTURE0$1 = 0x84C0;

var MIPMAP_FILTERS = [
  GL_NEAREST_MIPMAP_NEAREST$1,
  GL_NEAREST_MIPMAP_LINEAR$1,
  GL_LINEAR_MIPMAP_NEAREST$1,
  GL_LINEAR_MIPMAP_LINEAR$1
];

var CHANNELS_FORMAT = [
  0,
  GL_LUMINANCE,
  GL_LUMINANCE_ALPHA,
  GL_RGB,
  GL_RGBA$1
];

var FORMAT_CHANNELS = {};
FORMAT_CHANNELS[GL_LUMINANCE] =
FORMAT_CHANNELS[GL_ALPHA] =
FORMAT_CHANNELS[GL_DEPTH_COMPONENT] = 1;
FORMAT_CHANNELS[GL_DEPTH_STENCIL] =
FORMAT_CHANNELS[GL_LUMINANCE_ALPHA] = 2;
FORMAT_CHANNELS[GL_RGB] =
FORMAT_CHANNELS[GL_SRGB_EXT] = 3;
FORMAT_CHANNELS[GL_RGBA$1] =
FORMAT_CHANNELS[GL_SRGB_ALPHA_EXT] = 4;

function objectName (str) {
  return '[object ' + str + ']'
}

var CANVAS_CLASS = objectName('HTMLCanvasElement');
var CONTEXT2D_CLASS = objectName('CanvasRenderingContext2D');
var BITMAP_CLASS = objectName('ImageBitmap');
var IMAGE_CLASS = objectName('HTMLImageElement');
var VIDEO_CLASS = objectName('HTMLVideoElement');

var PIXEL_CLASSES = Object.keys(arrayTypes).concat([
  CANVAS_CLASS,
  CONTEXT2D_CLASS,
  BITMAP_CLASS,
  IMAGE_CLASS,
  VIDEO_CLASS
]);

// for every texture type, store
// the size in bytes.
var TYPE_SIZES = [];
TYPE_SIZES[GL_UNSIGNED_BYTE$5] = 1;
TYPE_SIZES[GL_FLOAT$4] = 4;
TYPE_SIZES[GL_HALF_FLOAT_OES$1] = 2;

TYPE_SIZES[GL_UNSIGNED_SHORT$3] = 2;
TYPE_SIZES[GL_UNSIGNED_INT$3] = 4;

var FORMAT_SIZES_SPECIAL = [];
FORMAT_SIZES_SPECIAL[GL_RGBA4] = 2;
FORMAT_SIZES_SPECIAL[GL_RGB5_A1] = 2;
FORMAT_SIZES_SPECIAL[GL_RGB565] = 2;
FORMAT_SIZES_SPECIAL[GL_DEPTH_STENCIL] = 4;

FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1;

FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ATC_WEBGL] = 0.5;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1;

FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25;

FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ETC1_WEBGL] = 0.5;

function isNumericArray (arr) {
  return (
    Array.isArray(arr) &&
    (arr.length === 0 ||
    typeof arr[0] === 'number'))
}

function isRectArray (arr) {
  if (!Array.isArray(arr)) {
    return false
  }
  var width = arr.length;
  if (width === 0 || !isArrayLike(arr[0])) {
    return false
  }
  return true
}

function classString (x) {
  return Object.prototype.toString.call(x)
}

function isCanvasElement (object) {
  return classString(object) === CANVAS_CLASS
}

function isContext2D (object) {
  return classString(object) === CONTEXT2D_CLASS
}

function isBitmap (object) {
  return classString(object) === BITMAP_CLASS
}

function isImageElement (object) {
  return classString(object) === IMAGE_CLASS
}

function isVideoElement (object) {
  return classString(object) === VIDEO_CLASS
}

function isPixelData (object) {
  if (!object) {
    return false
  }
  var className = classString(object);
  if (PIXEL_CLASSES.indexOf(className) >= 0) {
    return true
  }
  return (
    isNumericArray(object) ||
    isRectArray(object) ||
    isNDArrayLike(object))
}

function typedArrayCode$1 (data) {
  return arrayTypes[Object.prototype.toString.call(data)] | 0
}

function convertData (result, data) {
  var n = data.length;
  switch (result.type) {
    case GL_UNSIGNED_BYTE$5:
    case GL_UNSIGNED_SHORT$3:
    case GL_UNSIGNED_INT$3:
    case GL_FLOAT$4:
      var converted = pool.allocType(result.type, n);
      converted.set(data);
      result.data = converted;
      break

    case GL_HALF_FLOAT_OES$1:
      result.data = convertToHalfFloat(data);
      break

    default:
      check$1.raise('unsupported texture type, must specify a typed array');
  }
}

function preConvert (image, n) {
  return pool.allocType(
    image.type === GL_HALF_FLOAT_OES$1
      ? GL_FLOAT$4
      : image.type, n)
}

function postConvert (image, data) {
  if (image.type === GL_HALF_FLOAT_OES$1) {
    image.data = convertToHalfFloat(data);
    pool.freeType(data);
  } else {
    image.data = data;
  }
}

function transposeData (image, array, strideX, strideY, strideC, offset) {
  var w = image.width;
  var h = image.height;
  var c = image.channels;
  var n = w * h * c;
  var data = preConvert(image, n);

  var p = 0;
  for (var i = 0; i < h; ++i) {
    for (var j = 0; j < w; ++j) {
      for (var k = 0; k < c; ++k) {
        data[p++] = array[strideX * j + strideY * i + strideC * k + offset];
      }
    }
  }

  postConvert(image, data);
}

function getTextureSize (format, type, width, height, isMipmap, isCube) {
  var s;
  if (typeof FORMAT_SIZES_SPECIAL[format] !== 'undefined') {
    // we have a special array for dealing with weird color formats such as RGB5A1
    s = FORMAT_SIZES_SPECIAL[format];
  } else {
    s = FORMAT_CHANNELS[format] * TYPE_SIZES[type];
  }

  if (isCube) {
    s *= 6;
  }

  if (isMipmap) {
    // compute the total size of all the mipmaps.
    var total = 0;

    var w = width;
    while (w >= 1) {
      // we can only use mipmaps on a square image,
      // so we can simply use the width and ignore the height:
      total += s * w * w;
      w /= 2;
    }
    return total
  } else {
    return s * width * height
  }
}

function createTextureSet (
  gl, extensions, limits, reglPoll, contextState, stats, config) {
  // -------------------------------------------------------
  // Initialize constants and parameter tables here
  // -------------------------------------------------------
  var mipmapHint = {
    "don't care": GL_DONT_CARE,
    'dont care': GL_DONT_CARE,
    'nice': GL_NICEST,
    'fast': GL_FASTEST
  };

  var wrapModes = {
    'repeat': GL_REPEAT,
    'clamp': GL_CLAMP_TO_EDGE$1,
    'mirror': GL_MIRRORED_REPEAT
  };

  var magFilters = {
    'nearest': GL_NEAREST$1,
    'linear': GL_LINEAR
  };

  var minFilters = extend({
    'mipmap': GL_LINEAR_MIPMAP_LINEAR$1,
    'nearest mipmap nearest': GL_NEAREST_MIPMAP_NEAREST$1,
    'linear mipmap nearest': GL_LINEAR_MIPMAP_NEAREST$1,
    'nearest mipmap linear': GL_NEAREST_MIPMAP_LINEAR$1,
    'linear mipmap linear': GL_LINEAR_MIPMAP_LINEAR$1
  }, magFilters);

  var colorSpace = {
    'none': 0,
    'browser': GL_BROWSER_DEFAULT_WEBGL
  };

  var textureTypes = {
    'uint8': GL_UNSIGNED_BYTE$5,
    'rgba4': GL_UNSIGNED_SHORT_4_4_4_4$1,
    'rgb565': GL_UNSIGNED_SHORT_5_6_5$1,
    'rgb5 a1': GL_UNSIGNED_SHORT_5_5_5_1$1
  };

  var textureFormats = {
    'alpha': GL_ALPHA,
    'luminance': GL_LUMINANCE,
    'luminance alpha': GL_LUMINANCE_ALPHA,
    'rgb': GL_RGB,
    'rgba': GL_RGBA$1,
    'rgba4': GL_RGBA4,
    'rgb5 a1': GL_RGB5_A1,
    'rgb565': GL_RGB565
  };

  var compressedTextureFormats = {};

  if (extensions.ext_srgb) {
    textureFormats.srgb = GL_SRGB_EXT;
    textureFormats.srgba = GL_SRGB_ALPHA_EXT;
  }

  if (extensions.oes_texture_float) {
    textureTypes.float32 = textureTypes.float = GL_FLOAT$4;
  }

  if (extensions.oes_texture_half_float) {
    textureTypes['float16'] = textureTypes['half float'] = GL_HALF_FLOAT_OES$1;
  }

  if (extensions.webgl_depth_texture) {
    extend(textureFormats, {
      'depth': GL_DEPTH_COMPONENT,
      'depth stencil': GL_DEPTH_STENCIL
    });

    extend(textureTypes, {
      'uint16': GL_UNSIGNED_SHORT$3,
      'uint32': GL_UNSIGNED_INT$3,
      'depth stencil': GL_UNSIGNED_INT_24_8_WEBGL$1
    });
  }

  if (extensions.webgl_compressed_texture_s3tc) {
    extend(compressedTextureFormats, {
      'rgb s3tc dxt1': GL_COMPRESSED_RGB_S3TC_DXT1_EXT,
      'rgba s3tc dxt1': GL_COMPRESSED_RGBA_S3TC_DXT1_EXT,
      'rgba s3tc dxt3': GL_COMPRESSED_RGBA_S3TC_DXT3_EXT,
      'rgba s3tc dxt5': GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
    });
  }

  if (extensions.webgl_compressed_texture_atc) {
    extend(compressedTextureFormats, {
      'rgb atc': GL_COMPRESSED_RGB_ATC_WEBGL,
      'rgba atc explicit alpha': GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL,
      'rgba atc interpolated alpha': GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL
    });
  }

  if (extensions.webgl_compressed_texture_pvrtc) {
    extend(compressedTextureFormats, {
      'rgb pvrtc 4bppv1': GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
      'rgb pvrtc 2bppv1': GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
      'rgba pvrtc 4bppv1': GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
      'rgba pvrtc 2bppv1': GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
    });
  }

  if (extensions.webgl_compressed_texture_etc1) {
    compressedTextureFormats['rgb etc1'] = GL_COMPRESSED_RGB_ETC1_WEBGL;
  }

  // Copy over all texture formats
  var supportedCompressedFormats = Array.prototype.slice.call(
    gl.getParameter(GL_COMPRESSED_TEXTURE_FORMATS));
  Object.keys(compressedTextureFormats).forEach(function (name) {
    var format = compressedTextureFormats[name];
    if (supportedCompressedFormats.indexOf(format) >= 0) {
      textureFormats[name] = format;
    }
  });

  var supportedFormats = Object.keys(textureFormats);
  limits.textureFormats = supportedFormats;

  // associate with every format string its
  // corresponding GL-value.
  var textureFormatsInvert = [];
  Object.keys(textureFormats).forEach(function (key) {
    var val = textureFormats[key];
    textureFormatsInvert[val] = key;
  });

  // associate with every type string its
  // corresponding GL-value.
  var textureTypesInvert = [];
  Object.keys(textureTypes).forEach(function (key) {
    var val = textureTypes[key];
    textureTypesInvert[val] = key;
  });

  var magFiltersInvert = [];
  Object.keys(magFilters).forEach(function (key) {
    var val = magFilters[key];
    magFiltersInvert[val] = key;
  });

  var minFiltersInvert = [];
  Object.keys(minFilters).forEach(function (key) {
    var val = minFilters[key];
    minFiltersInvert[val] = key;
  });

  var wrapModesInvert = [];
  Object.keys(wrapModes).forEach(function (key) {
    var val = wrapModes[key];
    wrapModesInvert[val] = key;
  });

  // colorFormats[] gives the format (channels) associated to an
  // internalformat
  var colorFormats = supportedFormats.reduce(function (color, key) {
    var glenum = textureFormats[key];
    if (glenum === GL_LUMINANCE ||
        glenum === GL_ALPHA ||
        glenum === GL_LUMINANCE ||
        glenum === GL_LUMINANCE_ALPHA ||
        glenum === GL_DEPTH_COMPONENT ||
        glenum === GL_DEPTH_STENCIL) {
      color[glenum] = glenum;
    } else if (glenum === GL_RGB5_A1 || key.indexOf('rgba') >= 0) {
      color[glenum] = GL_RGBA$1;
    } else {
      color[glenum] = GL_RGB;
    }
    return color
  }, {});

  function TexFlags () {
    // format info
    this.internalformat = GL_RGBA$1;
    this.format = GL_RGBA$1;
    this.type = GL_UNSIGNED_BYTE$5;
    this.compressed = false;

    // pixel storage
    this.premultiplyAlpha = false;
    this.flipY = false;
    this.unpackAlignment = 1;
    this.colorSpace = GL_BROWSER_DEFAULT_WEBGL;

    // shape info
    this.width = 0;
    this.height = 0;
    this.channels = 0;
  }

  function copyFlags (result, other) {
    result.internalformat = other.internalformat;
    result.format = other.format;
    result.type = other.type;
    result.compressed = other.compressed;

    result.premultiplyAlpha = other.premultiplyAlpha;
    result.flipY = other.flipY;
    result.unpackAlignment = other.unpackAlignment;
    result.colorSpace = other.colorSpace;

    result.width = other.width;
    result.height = other.height;
    result.channels = other.channels;
  }

  function parseFlags (flags, options) {
    if (typeof options !== 'object' || !options) {
      return
    }

    if ('premultiplyAlpha' in options) {
      check$1.type(options.premultiplyAlpha, 'boolean',
        'invalid premultiplyAlpha');
      flags.premultiplyAlpha = options.premultiplyAlpha;
    }

    if ('flipY' in options) {
      check$1.type(options.flipY, 'boolean',
        'invalid texture flip');
      flags.flipY = options.flipY;
    }

    if ('alignment' in options) {
      check$1.oneOf(options.alignment, [1, 2, 4, 8],
        'invalid texture unpack alignment');
      flags.unpackAlignment = options.alignment;
    }

    if ('colorSpace' in options) {
      check$1.parameter(options.colorSpace, colorSpace,
        'invalid colorSpace');
      flags.colorSpace = colorSpace[options.colorSpace];
    }

    if ('type' in options) {
      var type = options.type;
      check$1(extensions.oes_texture_float ||
        !(type === 'float' || type === 'float32'),
        'you must enable the OES_texture_float extension in order to use floating point textures.');
      check$1(extensions.oes_texture_half_float ||
        !(type === 'half float' || type === 'float16'),
        'you must enable the OES_texture_half_float extension in order to use 16-bit floating point textures.');
      check$1(extensions.webgl_depth_texture ||
        !(type === 'uint16' || type === 'uint32' || type === 'depth stencil'),
        'you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.');
      check$1.parameter(type, textureTypes,
        'invalid texture type');
      flags.type = textureTypes[type];
    }

    var w = flags.width;
    var h = flags.height;
    var c = flags.channels;
    var hasChannels = false;
    if ('shape' in options) {
      check$1(Array.isArray(options.shape) && options.shape.length >= 2,
        'shape must be an array');
      w = options.shape[0];
      h = options.shape[1];
      if (options.shape.length === 3) {
        c = options.shape[2];
        check$1(c > 0 && c <= 4, 'invalid number of channels');
        hasChannels = true;
      }
      check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid width');
      check$1(h >= 0 && h <= limits.maxTextureSize, 'invalid height');
    } else {
      if ('radius' in options) {
        w = h = options.radius;
        check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid radius');
      }
      if ('width' in options) {
        w = options.width;
        check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid width');
      }
      if ('height' in options) {
        h = options.height;
        check$1(h >= 0 && h <= limits.maxTextureSize, 'invalid height');
      }
      if ('channels' in options) {
        c = options.channels;
        check$1(c > 0 && c <= 4, 'invalid number of channels');
        hasChannels = true;
      }
    }
    flags.width = w | 0;
    flags.height = h | 0;
    flags.channels = c | 0;

    var hasFormat = false;
    if ('format' in options) {
      var formatStr = options.format;
      check$1(extensions.webgl_depth_texture ||
        !(formatStr === 'depth' || formatStr === 'depth stencil'),
        'you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.');
      check$1.parameter(formatStr, textureFormats,
        'invalid texture format');
      var internalformat = flags.internalformat = textureFormats[formatStr];
      flags.format = colorFormats[internalformat];
      if (formatStr in textureTypes) {
        if (!('type' in options)) {
          flags.type = textureTypes[formatStr];
        }
      }
      if (formatStr in compressedTextureFormats) {
        flags.compressed = true;
      }
      hasFormat = true;
    }

    // Reconcile channels and format
    if (!hasChannels && hasFormat) {
      flags.channels = FORMAT_CHANNELS[flags.format];
    } else if (hasChannels && !hasFormat) {
      if (flags.channels !== CHANNELS_FORMAT[flags.format]) {
        flags.format = flags.internalformat = CHANNELS_FORMAT[flags.channels];
      }
    } else if (hasFormat && hasChannels) {
      check$1(
        flags.channels === FORMAT_CHANNELS[flags.format],
        'number of channels inconsistent with specified format');
    }
  }

  function setFlags (flags) {
    gl.pixelStorei(GL_UNPACK_FLIP_Y_WEBGL, flags.flipY);
    gl.pixelStorei(GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL, flags.premultiplyAlpha);
    gl.pixelStorei(GL_UNPACK_COLORSPACE_CONVERSION_WEBGL, flags.colorSpace);
    gl.pixelStorei(GL_UNPACK_ALIGNMENT, flags.unpackAlignment);
  }

  // -------------------------------------------------------
  // Tex image data
  // -------------------------------------------------------
  function TexImage () {
    TexFlags.call(this);

    this.xOffset = 0;
    this.yOffset = 0;

    // data
    this.data = null;
    this.needsFree = false;

    // html element
    this.element = null;

    // copyTexImage info
    this.needsCopy = false;
  }

  function parseImage (image, options) {
    var data = null;
    if (isPixelData(options)) {
      data = options;
    } else if (options) {
      check$1.type(options, 'object', 'invalid pixel data type');
      parseFlags(image, options);
      if ('x' in options) {
        image.xOffset = options.x | 0;
      }
      if ('y' in options) {
        image.yOffset = options.y | 0;
      }
      if (isPixelData(options.data)) {
        data = options.data;
      }
    }

    check$1(
      !image.compressed ||
      data instanceof Uint8Array,
      'compressed texture data must be stored in a uint8array');

    if (options.copy) {
      check$1(!data, 'can not specify copy and data field for the same texture');
      var viewW = contextState.viewportWidth;
      var viewH = contextState.viewportHeight;
      image.width = image.width || (viewW - image.xOffset);
      image.height = image.height || (viewH - image.yOffset);
      image.needsCopy = true;
      check$1(image.xOffset >= 0 && image.xOffset < viewW &&
            image.yOffset >= 0 && image.yOffset < viewH &&
            image.width > 0 && image.width <= viewW &&
            image.height > 0 && image.height <= viewH,
            'copy texture read out of bounds');
    } else if (!data) {
      image.width = image.width || 1;
      image.height = image.height || 1;
      image.channels = image.channels || 4;
    } else if (isTypedArray(data)) {
      image.channels = image.channels || 4;
      image.data = data;
      if (!('type' in options) && image.type === GL_UNSIGNED_BYTE$5) {
        image.type = typedArrayCode$1(data);
      }
    } else if (isNumericArray(data)) {
      image.channels = image.channels || 4;
      convertData(image, data);
      image.alignment = 1;
      image.needsFree = true;
    } else if (isNDArrayLike(data)) {
      var array = data.data;
      if (!Array.isArray(array) && image.type === GL_UNSIGNED_BYTE$5) {
        image.type = typedArrayCode$1(array);
      }
      var shape = data.shape;
      var stride = data.stride;
      var shapeX, shapeY, shapeC, strideX, strideY, strideC;
      if (shape.length === 3) {
        shapeC = shape[2];
        strideC = stride[2];
      } else {
        check$1(shape.length === 2, 'invalid ndarray pixel data, must be 2 or 3D');
        shapeC = 1;
        strideC = 1;
      }
      shapeX = shape[0];
      shapeY = shape[1];
      strideX = stride[0];
      strideY = stride[1];
      image.alignment = 1;
      image.width = shapeX;
      image.height = shapeY;
      image.channels = shapeC;
      image.format = image.internalformat = CHANNELS_FORMAT[shapeC];
      image.needsFree = true;
      transposeData(image, array, strideX, strideY, strideC, data.offset);
    } else if (isCanvasElement(data) || isContext2D(data)) {
      if (isCanvasElement(data)) {
        image.element = data;
      } else {
        image.element = data.canvas;
      }
      image.width = image.element.width;
      image.height = image.element.height;
      image.channels = 4;
    } else if (isBitmap(data)) {
      image.element = data;
      image.width = data.width;
      image.height = data.height;
      image.channels = 4;
    } else if (isImageElement(data)) {
      image.element = data;
      image.width = data.naturalWidth;
      image.height = data.naturalHeight;
      image.channels = 4;
    } else if (isVideoElement(data)) {
      image.element = data;
      image.width = data.videoWidth;
      image.height = data.videoHeight;
      image.channels = 4;
    } else if (isRectArray(data)) {
      var w = image.width || data[0].length;
      var h = image.height || data.length;
      var c = image.channels;
      if (isArrayLike(data[0][0])) {
        c = c || data[0][0].length;
      } else {
        c = c || 1;
      }
      var arrayShape = flattenUtils.shape(data);
      var n = 1;
      for (var dd = 0; dd < arrayShape.length; ++dd) {
        n *= arrayShape[dd];
      }
      var allocData = preConvert(image, n);
      flattenUtils.flatten(data, arrayShape, '', allocData);
      postConvert(image, allocData);
      image.alignment = 1;
      image.width = w;
      image.height = h;
      image.channels = c;
      image.format = image.internalformat = CHANNELS_FORMAT[c];
      image.needsFree = true;
    }

    if (image.type === GL_FLOAT$4) {
      check$1(limits.extensions.indexOf('oes_texture_float') >= 0,
        'oes_texture_float extension not enabled');
    } else if (image.type === GL_HALF_FLOAT_OES$1) {
      check$1(limits.extensions.indexOf('oes_texture_half_float') >= 0,
        'oes_texture_half_float extension not enabled');
    }

    // do compressed texture  validation here.
  }

  function setImage (info, target, miplevel) {
    var element = info.element;
    var data = info.data;
    var internalformat = info.internalformat;
    var format = info.format;
    var type = info.type;
    var width = info.width;
    var height = info.height;
    var channels = info.channels;

    setFlags(info);

    if (element) {
      gl.texImage2D(target, miplevel, format, format, type, element);
    } else if (info.compressed) {
      gl.compressedTexImage2D(target, miplevel, internalformat, width, height, 0, data);
    } else if (info.needsCopy) {
      reglPoll();
      gl.copyTexImage2D(
        target, miplevel, format, info.xOffset, info.yOffset, width, height, 0);
    } else {
      var nullData = !data;
      if (nullData) {
        data = pool.zero.allocType(type, width * height * channels);
      }

      gl.texImage2D(target, miplevel, format, width, height, 0, format, type, data);

      if (nullData && data) {
        pool.zero.freeType(data);
      }
    }
  }

  function setSubImage (info, target, x, y, miplevel) {
    var element = info.element;
    var data = info.data;
    var internalformat = info.internalformat;
    var format = info.format;
    var type = info.type;
    var width = info.width;
    var height = info.height;

    setFlags(info);

    if (element) {
      gl.texSubImage2D(
        target, miplevel, x, y, format, type, element);
    } else if (info.compressed) {
      gl.compressedTexSubImage2D(
        target, miplevel, x, y, internalformat, width, height, data);
    } else if (info.needsCopy) {
      reglPoll();
      gl.copyTexSubImage2D(
        target, miplevel, x, y, info.xOffset, info.yOffset, width, height);
    } else {
      gl.texSubImage2D(
        target, miplevel, x, y, width, height, format, type, data);
    }
  }

  // texImage pool
  var imagePool = [];

  function allocImage () {
    return imagePool.pop() || new TexImage()
  }

  function freeImage (image) {
    if (image.needsFree) {
      pool.freeType(image.data);
    }
    TexImage.call(image);
    imagePool.push(image);
  }

  // -------------------------------------------------------
  // Mip map
  // -------------------------------------------------------
  function MipMap () {
    TexFlags.call(this);

    this.genMipmaps = false;
    this.mipmapHint = GL_DONT_CARE;
    this.mipmask = 0;
    this.images = Array(16);
  }

  function parseMipMapFromShape (mipmap, width, height) {
    var img = mipmap.images[0] = allocImage();
    mipmap.mipmask = 1;
    img.width = mipmap.width = width;
    img.height = mipmap.height = height;
    img.channels = mipmap.channels = 4;
  }

  function parseMipMapFromObject (mipmap, options) {
    var imgData = null;
    if (isPixelData(options)) {
      imgData = mipmap.images[0] = allocImage();
      copyFlags(imgData, mipmap);
      parseImage(imgData, options);
      mipmap.mipmask = 1;
    } else {
      parseFlags(mipmap, options);
      if (Array.isArray(options.mipmap)) {
        var mipData = options.mipmap;
        for (var i = 0; i < mipData.length; ++i) {
          imgData = mipmap.images[i] = allocImage();
          copyFlags(imgData, mipmap);
          imgData.width >>= i;
          imgData.height >>= i;
          parseImage(imgData, mipData[i]);
          mipmap.mipmask |= (1 << i);
        }
      } else {
        imgData = mipmap.images[0] = allocImage();
        copyFlags(imgData, mipmap);
        parseImage(imgData, options);
        mipmap.mipmask = 1;
      }
    }
    copyFlags(mipmap, mipmap.images[0]);

    // For textures of the compressed format WEBGL_compressed_texture_s3tc
    // we must have that
    //
    // "When level equals zero width and height must be a multiple of 4.
    // When level is greater than 0 width and height must be 0, 1, 2 or a multiple of 4. "
    //
    // but we do not yet support having multiple mipmap levels for compressed textures,
    // so we only test for level zero.

    if (mipmap.compressed &&
        (mipmap.internalformat === GL_COMPRESSED_RGB_S3TC_DXT1_EXT) ||
        (mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT1_EXT) ||
        (mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT3_EXT) ||
        (mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT5_EXT)) {
      check$1(mipmap.width % 4 === 0 &&
            mipmap.height % 4 === 0,
            'for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4');
    }
  }

  function setMipMap (mipmap, target) {
    var images = mipmap.images;
    for (var i = 0; i < images.length; ++i) {
      if (!images[i]) {
        return
      }
      setImage(images[i], target, i);
    }
  }

  var mipPool = [];

  function allocMipMap () {
    var result = mipPool.pop() || new MipMap();
    TexFlags.call(result);
    result.mipmask = 0;
    for (var i = 0; i < 16; ++i) {
      result.images[i] = null;
    }
    return result
  }

  function freeMipMap (mipmap) {
    var images = mipmap.images;
    for (var i = 0; i < images.length; ++i) {
      if (images[i]) {
        freeImage(images[i]);
      }
      images[i] = null;
    }
    mipPool.push(mipmap);
  }

  // -------------------------------------------------------
  // Tex info
  // -------------------------------------------------------
  function TexInfo () {
    this.minFilter = GL_NEAREST$1;
    this.magFilter = GL_NEAREST$1;

    this.wrapS = GL_CLAMP_TO_EDGE$1;
    this.wrapT = GL_CLAMP_TO_EDGE$1;

    this.anisotropic = 1;

    this.genMipmaps = false;
    this.mipmapHint = GL_DONT_CARE;
  }

  function parseTexInfo (info, options) {
    if ('min' in options) {
      var minFilter = options.min;
      check$1.parameter(minFilter, minFilters);
      info.minFilter = minFilters[minFilter];
      if (MIPMAP_FILTERS.indexOf(info.minFilter) >= 0 && !('faces' in options)) {
        info.genMipmaps = true;
      }
    }

    if ('mag' in options) {
      var magFilter = options.mag;
      check$1.parameter(magFilter, magFilters);
      info.magFilter = magFilters[magFilter];
    }

    var wrapS = info.wrapS;
    var wrapT = info.wrapT;
    if ('wrap' in options) {
      var wrap = options.wrap;
      if (typeof wrap === 'string') {
        check$1.parameter(wrap, wrapModes);
        wrapS = wrapT = wrapModes[wrap];
      } else if (Array.isArray(wrap)) {
        check$1.parameter(wrap[0], wrapModes);
        check$1.parameter(wrap[1], wrapModes);
        wrapS = wrapModes[wrap[0]];
        wrapT = wrapModes[wrap[1]];
      }
    } else {
      if ('wrapS' in options) {
        var optWrapS = options.wrapS;
        check$1.parameter(optWrapS, wrapModes);
        wrapS = wrapModes[optWrapS];
      }
      if ('wrapT' in options) {
        var optWrapT = options.wrapT;
        check$1.parameter(optWrapT, wrapModes);
        wrapT = wrapModes[optWrapT];
      }
    }
    info.wrapS = wrapS;
    info.wrapT = wrapT;

    if ('anisotropic' in options) {
      var anisotropic = options.anisotropic;
      check$1(typeof anisotropic === 'number' &&
         anisotropic >= 1 && anisotropic <= limits.maxAnisotropic,
        'aniso samples must be between 1 and ');
      info.anisotropic = options.anisotropic;
    }

    if ('mipmap' in options) {
      var hasMipMap = false;
      switch (typeof options.mipmap) {
        case 'string':
          check$1.parameter(options.mipmap, mipmapHint,
            'invalid mipmap hint');
          info.mipmapHint = mipmapHint[options.mipmap];
          info.genMipmaps = true;
          hasMipMap = true;
          break

        case 'boolean':
          hasMipMap = info.genMipmaps = options.mipmap;
          break

        case 'object':
          check$1(Array.isArray(options.mipmap), 'invalid mipmap type');
          info.genMipmaps = false;
          hasMipMap = true;
          break

        default:
          check$1.raise('invalid mipmap type');
      }
      if (hasMipMap && !('min' in options)) {
        info.minFilter = GL_NEAREST_MIPMAP_NEAREST$1;
      }
    }
  }

  function setTexInfo (info, target) {
    gl.texParameteri(target, GL_TEXTURE_MIN_FILTER, info.minFilter);
    gl.texParameteri(target, GL_TEXTURE_MAG_FILTER, info.magFilter);
    gl.texParameteri(target, GL_TEXTURE_WRAP_S, info.wrapS);
    gl.texParameteri(target, GL_TEXTURE_WRAP_T, info.wrapT);
    if (extensions.ext_texture_filter_anisotropic) {
      gl.texParameteri(target, GL_TEXTURE_MAX_ANISOTROPY_EXT, info.anisotropic);
    }
    if (info.genMipmaps) {
      gl.hint(GL_GENERATE_MIPMAP_HINT, info.mipmapHint);
      gl.generateMipmap(target);
    }
  }

  // -------------------------------------------------------
  // Full texture object
  // -------------------------------------------------------
  var textureCount = 0;
  var textureSet = {};
  var numTexUnits = limits.maxTextureUnits;
  var textureUnits = Array(numTexUnits).map(function () {
    return null
  });

  function REGLTexture (target) {
    TexFlags.call(this);
    this.mipmask = 0;
    this.internalformat = GL_RGBA$1;

    this.id = textureCount++;

    this.refCount = 1;

    this.target = target;
    this.texture = gl.createTexture();

    this.unit = -1;
    this.bindCount = 0;

    this.texInfo = new TexInfo();

    if (config.profile) {
      this.stats = {size: 0};
    }
  }

  function tempBind (texture) {
    gl.activeTexture(GL_TEXTURE0$1);
    gl.bindTexture(texture.target, texture.texture);
  }

  function tempRestore () {
    var prev = textureUnits[0];
    if (prev) {
      gl.bindTexture(prev.target, prev.texture);
    } else {
      gl.bindTexture(GL_TEXTURE_2D$1, null);
    }
  }

  function destroy (texture) {
    var handle = texture.texture;
    check$1(handle, 'must not double destroy texture');
    var unit = texture.unit;
    var target = texture.target;
    if (unit >= 0) {
      gl.activeTexture(GL_TEXTURE0$1 + unit);
      gl.bindTexture(target, null);
      textureUnits[unit] = null;
    }
    gl.deleteTexture(handle);
    texture.texture = null;
    texture.params = null;
    texture.pixels = null;
    texture.refCount = 0;
    delete textureSet[texture.id];
    stats.textureCount--;
  }

  extend(REGLTexture.prototype, {
    bind: function () {
      var texture = this;
      texture.bindCount += 1;
      var unit = texture.unit;
      if (unit < 0) {
        for (var i = 0; i < numTexUnits; ++i) {
          var other = textureUnits[i];
          if (other) {
            if (other.bindCount > 0) {
              continue
            }
            other.unit = -1;
          }
          textureUnits[i] = texture;
          unit = i;
          break
        }
        if (unit >= numTexUnits) {
          check$1.raise('insufficient number of texture units');
        }
        if (config.profile && stats.maxTextureUnits < (unit + 1)) {
          stats.maxTextureUnits = unit + 1; // +1, since the units are zero-based
        }
        texture.unit = unit;
        gl.activeTexture(GL_TEXTURE0$1 + unit);
        gl.bindTexture(texture.target, texture.texture);
      }
      return unit
    },

    unbind: function () {
      this.bindCount -= 1;
    },

    decRef: function () {
      if (--this.refCount <= 0) {
        destroy(this);
      }
    }
  });

  function createTexture2D (a, b) {
    var texture = new REGLTexture(GL_TEXTURE_2D$1);
    textureSet[texture.id] = texture;
    stats.textureCount++;

    function reglTexture2D (a, b) {
      var texInfo = texture.texInfo;
      TexInfo.call(texInfo);
      var mipData = allocMipMap();

      if (typeof a === 'number') {
        if (typeof b === 'number') {
          parseMipMapFromShape(mipData, a | 0, b | 0);
        } else {
          parseMipMapFromShape(mipData, a | 0, a | 0);
        }
      } else if (a) {
        check$1.type(a, 'object', 'invalid arguments to regl.texture');
        parseTexInfo(texInfo, a);
        parseMipMapFromObject(mipData, a);
      } else {
        // empty textures get assigned a default shape of 1x1
        parseMipMapFromShape(mipData, 1, 1);
      }

      if (texInfo.genMipmaps) {
        mipData.mipmask = (mipData.width << 1) - 1;
      }
      texture.mipmask = mipData.mipmask;

      copyFlags(texture, mipData);

      check$1.texture2D(texInfo, mipData, limits);
      texture.internalformat = mipData.internalformat;

      reglTexture2D.width = mipData.width;
      reglTexture2D.height = mipData.height;

      tempBind(texture);
      setMipMap(mipData, GL_TEXTURE_2D$1);
      setTexInfo(texInfo, GL_TEXTURE_2D$1);
      tempRestore();

      freeMipMap(mipData);

      if (config.profile) {
        texture.stats.size = getTextureSize(
          texture.internalformat,
          texture.type,
          mipData.width,
          mipData.height,
          texInfo.genMipmaps,
          false);
      }
      reglTexture2D.format = textureFormatsInvert[texture.internalformat];
      reglTexture2D.type = textureTypesInvert[texture.type];

      reglTexture2D.mag = magFiltersInvert[texInfo.magFilter];
      reglTexture2D.min = minFiltersInvert[texInfo.minFilter];

      reglTexture2D.wrapS = wrapModesInvert[texInfo.wrapS];
      reglTexture2D.wrapT = wrapModesInvert[texInfo.wrapT];

      return reglTexture2D
    }

    function subimage (image, x_, y_, level_) {
      check$1(!!image, 'must specify image data');

      var x = x_ | 0;
      var y = y_ | 0;
      var level = level_ | 0;

      var imageData = allocImage();
      copyFlags(imageData, texture);
      imageData.width = 0;
      imageData.height = 0;
      parseImage(imageData, image);
      imageData.width = imageData.width || ((texture.width >> level) - x);
      imageData.height = imageData.height || ((texture.height >> level) - y);

      check$1(
        texture.type === imageData.type &&
        texture.format === imageData.format &&
        texture.internalformat === imageData.internalformat,
        'incompatible format for texture.subimage');
      check$1(
        x >= 0 && y >= 0 &&
        x + imageData.width <= texture.width &&
        y + imageData.height <= texture.height,
        'texture.subimage write out of bounds');
      check$1(
        texture.mipmask & (1 << level),
        'missing mipmap data');
      check$1(
        imageData.data || imageData.element || imageData.needsCopy,
        'missing image data');

      tempBind(texture);
      setSubImage(imageData, GL_TEXTURE_2D$1, x, y, level);
      tempRestore();

      freeImage(imageData);

      return reglTexture2D
    }

    function resize (w_, h_) {
      var w = w_ | 0;
      var h = (h_ | 0) || w;
      if (w === texture.width && h === texture.height) {
        return reglTexture2D
      }

      reglTexture2D.width = texture.width = w;
      reglTexture2D.height = texture.height = h;

      tempBind(texture);

      var data;
      var channels = texture.channels;
      var type = texture.type;

      for (var i = 0; texture.mipmask >> i; ++i) {
        var _w = w >> i;
        var _h = h >> i;
        if (!_w || !_h) break
        data = pool.zero.allocType(type, _w * _h * channels);
        gl.texImage2D(
          GL_TEXTURE_2D$1,
          i,
          texture.format,
          _w,
          _h,
          0,
          texture.format,
          texture.type,
          data);
        if (data) pool.zero.freeType(data);
      }
      tempRestore();

      // also, recompute the texture size.
      if (config.profile) {
        texture.stats.size = getTextureSize(
          texture.internalformat,
          texture.type,
          w,
          h,
          false,
          false);
      }

      return reglTexture2D
    }

    reglTexture2D(a, b);

    reglTexture2D.subimage = subimage;
    reglTexture2D.resize = resize;
    reglTexture2D._reglType = 'texture2d';
    reglTexture2D._texture = texture;
    if (config.profile) {
      reglTexture2D.stats = texture.stats;
    }
    reglTexture2D.destroy = function () {
      texture.decRef();
    };

    return reglTexture2D
  }

  function createTextureCube (a0, a1, a2, a3, a4, a5) {
    var texture = new REGLTexture(GL_TEXTURE_CUBE_MAP$1);
    textureSet[texture.id] = texture;
    stats.cubeCount++;

    var faces = new Array(6);

    function reglTextureCube (a0, a1, a2, a3, a4, a5) {
      var i;
      var texInfo = texture.texInfo;
      TexInfo.call(texInfo);
      for (i = 0; i < 6; ++i) {
        faces[i] = allocMipMap();
      }

      if (typeof a0 === 'number' || !a0) {
        var s = (a0 | 0) || 1;
        for (i = 0; i < 6; ++i) {
          parseMipMapFromShape(faces[i], s, s);
        }
      } else if (typeof a0 === 'object') {
        if (a1) {
          parseMipMapFromObject(faces[0], a0);
          parseMipMapFromObject(faces[1], a1);
          parseMipMapFromObject(faces[2], a2);
          parseMipMapFromObject(faces[3], a3);
          parseMipMapFromObject(faces[4], a4);
          parseMipMapFromObject(faces[5], a5);
        } else {
          parseTexInfo(texInfo, a0);
          parseFlags(texture, a0);
          if ('faces' in a0) {
            var face_input = a0.faces;
            check$1(Array.isArray(face_input) && face_input.length === 6,
              'cube faces must be a length 6 array');
            for (i = 0; i < 6; ++i) {
              check$1(typeof face_input[i] === 'object' && !!face_input[i],
                'invalid input for cube map face');
              copyFlags(faces[i], texture);
              parseMipMapFromObject(faces[i], face_input[i]);
            }
          } else {
            for (i = 0; i < 6; ++i) {
              parseMipMapFromObject(faces[i], a0);
            }
          }
        }
      } else {
        check$1.raise('invalid arguments to cube map');
      }

      copyFlags(texture, faces[0]);

      if (!limits.npotTextureCube) {
        check$1(isPow2$1(texture.width) && isPow2$1(texture.height), 'your browser does not support non power or two texture dimensions');
      }

      if (texInfo.genMipmaps) {
        texture.mipmask = (faces[0].width << 1) - 1;
      } else {
        texture.mipmask = faces[0].mipmask;
      }

      check$1.textureCube(texture, texInfo, faces, limits);
      texture.internalformat = faces[0].internalformat;

      reglTextureCube.width = faces[0].width;
      reglTextureCube.height = faces[0].height;

      tempBind(texture);
      for (i = 0; i < 6; ++i) {
        setMipMap(faces[i], GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i);
      }
      setTexInfo(texInfo, GL_TEXTURE_CUBE_MAP$1);
      tempRestore();

      if (config.profile) {
        texture.stats.size = getTextureSize(
          texture.internalformat,
          texture.type,
          reglTextureCube.width,
          reglTextureCube.height,
          texInfo.genMipmaps,
          true);
      }

      reglTextureCube.format = textureFormatsInvert[texture.internalformat];
      reglTextureCube.type = textureTypesInvert[texture.type];

      reglTextureCube.mag = magFiltersInvert[texInfo.magFilter];
      reglTextureCube.min = minFiltersInvert[texInfo.minFilter];

      reglTextureCube.wrapS = wrapModesInvert[texInfo.wrapS];
      reglTextureCube.wrapT = wrapModesInvert[texInfo.wrapT];

      for (i = 0; i < 6; ++i) {
        freeMipMap(faces[i]);
      }

      return reglTextureCube
    }

    function subimage (face, image, x_, y_, level_) {
      check$1(!!image, 'must specify image data');
      check$1(typeof face === 'number' && face === (face | 0) &&
        face >= 0 && face < 6, 'invalid face');

      var x = x_ | 0;
      var y = y_ | 0;
      var level = level_ | 0;

      var imageData = allocImage();
      copyFlags(imageData, texture);
      imageData.width = 0;
      imageData.height = 0;
      parseImage(imageData, image);
      imageData.width = imageData.width || ((texture.width >> level) - x);
      imageData.height = imageData.height || ((texture.height >> level) - y);

      check$1(
        texture.type === imageData.type &&
        texture.format === imageData.format &&
        texture.internalformat === imageData.internalformat,
        'incompatible format for texture.subimage');
      check$1(
        x >= 0 && y >= 0 &&
        x + imageData.width <= texture.width &&
        y + imageData.height <= texture.height,
        'texture.subimage write out of bounds');
      check$1(
        texture.mipmask & (1 << level),
        'missing mipmap data');
      check$1(
        imageData.data || imageData.element || imageData.needsCopy,
        'missing image data');

      tempBind(texture);
      setSubImage(imageData, GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + face, x, y, level);
      tempRestore();

      freeImage(imageData);

      return reglTextureCube
    }

    function resize (radius_) {
      var radius = radius_ | 0;
      if (radius === texture.width) {
        return
      }

      reglTextureCube.width = texture.width = radius;
      reglTextureCube.height = texture.height = radius;

      tempBind(texture);
      for (var i = 0; i < 6; ++i) {
        for (var j = 0; texture.mipmask >> j; ++j) {
          gl.texImage2D(
            GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i,
            j,
            texture.format,
            radius >> j,
            radius >> j,
            0,
            texture.format,
            texture.type,
            null);
        }
      }
      tempRestore();

      if (config.profile) {
        texture.stats.size = getTextureSize(
          texture.internalformat,
          texture.type,
          reglTextureCube.width,
          reglTextureCube.height,
          false,
          true);
      }

      return reglTextureCube
    }

    reglTextureCube(a0, a1, a2, a3, a4, a5);

    reglTextureCube.subimage = subimage;
    reglTextureCube.resize = resize;
    reglTextureCube._reglType = 'textureCube';
    reglTextureCube._texture = texture;
    if (config.profile) {
      reglTextureCube.stats = texture.stats;
    }
    reglTextureCube.destroy = function () {
      texture.decRef();
    };

    return reglTextureCube
  }

  // Called when regl is destroyed
  function destroyTextures () {
    for (var i = 0; i < numTexUnits; ++i) {
      gl.activeTexture(GL_TEXTURE0$1 + i);
      gl.bindTexture(GL_TEXTURE_2D$1, null);
      textureUnits[i] = null;
    }
    values(textureSet).forEach(destroy);

    stats.cubeCount = 0;
    stats.textureCount = 0;
  }

  if (config.profile) {
    stats.getTotalTextureSize = function () {
      var total = 0;
      Object.keys(textureSet).forEach(function (key) {
        total += textureSet[key].stats.size;
      });
      return total
    };
  }

  function restoreTextures () {
    values(textureSet).forEach(function (texture) {
      texture.texture = gl.createTexture();
      gl.bindTexture(texture.target, texture.texture);
      for (var i = 0; i < 32; ++i) {
        if ((texture.mipmask & (1 << i)) === 0) {
          continue
        }
        if (texture.target === GL_TEXTURE_2D$1) {
          gl.texImage2D(GL_TEXTURE_2D$1,
            i,
            texture.internalformat,
            texture.width >> i,
            texture.height >> i,
            0,
            texture.internalformat,
            texture.type,
            null);
        } else {
          for (var j = 0; j < 6; ++j) {
            gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + j,
              i,
              texture.internalformat,
              texture.width >> i,
              texture.height >> i,
              0,
              texture.internalformat,
              texture.type,
              null);
          }
        }
      }
      setTexInfo(texture.texInfo, texture.target);
    });
  }

  return {
    create2D: createTexture2D,
    createCube: createTextureCube,
    clear: destroyTextures,
    getTexture: function (wrapper) {
      return null
    },
    restore: restoreTextures
  }
}

var GL_RENDERBUFFER = 0x8D41;

var GL_RGBA4$1 = 0x8056;
var GL_RGB5_A1$1 = 0x8057;
var GL_RGB565$1 = 0x8D62;
var GL_DEPTH_COMPONENT16 = 0x81A5;
var GL_STENCIL_INDEX8 = 0x8D48;
var GL_DEPTH_STENCIL$1 = 0x84F9;

var GL_SRGB8_ALPHA8_EXT = 0x8C43;

var GL_RGBA32F_EXT = 0x8814;

var GL_RGBA16F_EXT = 0x881A;
var GL_RGB16F_EXT = 0x881B;

var FORMAT_SIZES = [];

FORMAT_SIZES[GL_RGBA4$1] = 2;
FORMAT_SIZES[GL_RGB5_A1$1] = 2;
FORMAT_SIZES[GL_RGB565$1] = 2;

FORMAT_SIZES[GL_DEPTH_COMPONENT16] = 2;
FORMAT_SIZES[GL_STENCIL_INDEX8] = 1;
FORMAT_SIZES[GL_DEPTH_STENCIL$1] = 4;

FORMAT_SIZES[GL_SRGB8_ALPHA8_EXT] = 4;
FORMAT_SIZES[GL_RGBA32F_EXT] = 16;
FORMAT_SIZES[GL_RGBA16F_EXT] = 8;
FORMAT_SIZES[GL_RGB16F_EXT] = 6;

function getRenderbufferSize (format, width, height) {
  return FORMAT_SIZES[format] * width * height
}

var wrapRenderbuffers = function (gl, extensions, limits, stats, config) {
  var formatTypes = {
    'rgba4': GL_RGBA4$1,
    'rgb565': GL_RGB565$1,
    'rgb5 a1': GL_RGB5_A1$1,
    'depth': GL_DEPTH_COMPONENT16,
    'stencil': GL_STENCIL_INDEX8,
    'depth stencil': GL_DEPTH_STENCIL$1
  };

  if (extensions.ext_srgb) {
    formatTypes['srgba'] = GL_SRGB8_ALPHA8_EXT;
  }

  if (extensions.ext_color_buffer_half_float) {
    formatTypes['rgba16f'] = GL_RGBA16F_EXT;
    formatTypes['rgb16f'] = GL_RGB16F_EXT;
  }

  if (extensions.webgl_color_buffer_float) {
    formatTypes['rgba32f'] = GL_RGBA32F_EXT;
  }

  var formatTypesInvert = [];
  Object.keys(formatTypes).forEach(function (key) {
    var val = formatTypes[key];
    formatTypesInvert[val] = key;
  });

  var renderbufferCount = 0;
  var renderbufferSet = {};

  function REGLRenderbuffer (renderbuffer) {
    this.id = renderbufferCount++;
    this.refCount = 1;

    this.renderbuffer = renderbuffer;

    this.format = GL_RGBA4$1;
    this.width = 0;
    this.height = 0;

    if (config.profile) {
      this.stats = {size: 0};
    }
  }

  REGLRenderbuffer.prototype.decRef = function () {
    if (--this.refCount <= 0) {
      destroy(this);
    }
  };

  function destroy (rb) {
    var handle = rb.renderbuffer;
    check$1(handle, 'must not double destroy renderbuffer');
    gl.bindRenderbuffer(GL_RENDERBUFFER, null);
    gl.deleteRenderbuffer(handle);
    rb.renderbuffer = null;
    rb.refCount = 0;
    delete renderbufferSet[rb.id];
    stats.renderbufferCount--;
  }

  function createRenderbuffer (a, b) {
    var renderbuffer = new REGLRenderbuffer(gl.createRenderbuffer());
    renderbufferSet[renderbuffer.id] = renderbuffer;
    stats.renderbufferCount++;

    function reglRenderbuffer (a, b) {
      var w = 0;
      var h = 0;
      var format = GL_RGBA4$1;

      if (typeof a === 'object' && a) {
        var options = a;
        if ('shape' in options) {
          var shape = options.shape;
          check$1(Array.isArray(shape) && shape.length >= 2,
            'invalid renderbuffer shape');
          w = shape[0] | 0;
          h = shape[1] | 0;
        } else {
          if ('radius' in options) {
            w = h = options.radius | 0;
          }
          if ('width' in options) {
            w = options.width | 0;
          }
          if ('height' in options) {
            h = options.height | 0;
          }
        }
        if ('format' in options) {
          check$1.parameter(options.format, formatTypes,
            'invalid renderbuffer format');
          format = formatTypes[options.format];
        }
      } else if (typeof a === 'number') {
        w = a | 0;
        if (typeof b === 'number') {
          h = b | 0;
        } else {
          h = w;
        }
      } else if (!a) {
        w = h = 1;
      } else {
        check$1.raise('invalid arguments to renderbuffer constructor');
      }

      // check shape
      check$1(
        w > 0 && h > 0 &&
        w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize,
        'invalid renderbuffer size');

      if (w === renderbuffer.width &&
          h === renderbuffer.height &&
          format === renderbuffer.format) {
        return
      }

      reglRenderbuffer.width = renderbuffer.width = w;
      reglRenderbuffer.height = renderbuffer.height = h;
      renderbuffer.format = format;

      gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
      gl.renderbufferStorage(GL_RENDERBUFFER, format, w, h);

      check$1(
        gl.getError() === 0,
        'invalid render buffer format');

      if (config.profile) {
        renderbuffer.stats.size = getRenderbufferSize(renderbuffer.format, renderbuffer.width, renderbuffer.height);
      }
      reglRenderbuffer.format = formatTypesInvert[renderbuffer.format];

      return reglRenderbuffer
    }

    function resize (w_, h_) {
      var w = w_ | 0;
      var h = (h_ | 0) || w;

      if (w === renderbuffer.width && h === renderbuffer.height) {
        return reglRenderbuffer
      }

      // check shape
      check$1(
        w > 0 && h > 0 &&
        w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize,
        'invalid renderbuffer size');

      reglRenderbuffer.width = renderbuffer.width = w;
      reglRenderbuffer.height = renderbuffer.height = h;

      gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
      gl.renderbufferStorage(GL_RENDERBUFFER, renderbuffer.format, w, h);

      check$1(
        gl.getError() === 0,
        'invalid render buffer format');

      // also, recompute size.
      if (config.profile) {
        renderbuffer.stats.size = getRenderbufferSize(
          renderbuffer.format, renderbuffer.width, renderbuffer.height);
      }

      return reglRenderbuffer
    }

    reglRenderbuffer(a, b);

    reglRenderbuffer.resize = resize;
    reglRenderbuffer._reglType = 'renderbuffer';
    reglRenderbuffer._renderbuffer = renderbuffer;
    if (config.profile) {
      reglRenderbuffer.stats = renderbuffer.stats;
    }
    reglRenderbuffer.destroy = function () {
      renderbuffer.decRef();
    };

    return reglRenderbuffer
  }

  if (config.profile) {
    stats.getTotalRenderbufferSize = function () {
      var total = 0;
      Object.keys(renderbufferSet).forEach(function (key) {
        total += renderbufferSet[key].stats.size;
      });
      return total
    };
  }

  function restoreRenderbuffers () {
    values(renderbufferSet).forEach(function (rb) {
      rb.renderbuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(GL_RENDERBUFFER, rb.renderbuffer);
      gl.renderbufferStorage(GL_RENDERBUFFER, rb.format, rb.width, rb.height);
    });
    gl.bindRenderbuffer(GL_RENDERBUFFER, null);
  }

  return {
    create: createRenderbuffer,
    clear: function () {
      values(renderbufferSet).forEach(destroy);
    },
    restore: restoreRenderbuffers
  }
};

// We store these constants so that the minifier can inline them
var GL_FRAMEBUFFER$1 = 0x8D40;
var GL_RENDERBUFFER$1 = 0x8D41;

var GL_TEXTURE_2D$2 = 0x0DE1;
var GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 = 0x8515;

var GL_COLOR_ATTACHMENT0$1 = 0x8CE0;
var GL_DEPTH_ATTACHMENT = 0x8D00;
var GL_STENCIL_ATTACHMENT = 0x8D20;
var GL_DEPTH_STENCIL_ATTACHMENT = 0x821A;

var GL_FRAMEBUFFER_COMPLETE$1 = 0x8CD5;
var GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6;
var GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7;
var GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9;
var GL_FRAMEBUFFER_UNSUPPORTED = 0x8CDD;

var GL_HALF_FLOAT_OES$2 = 0x8D61;
var GL_UNSIGNED_BYTE$6 = 0x1401;
var GL_FLOAT$5 = 0x1406;

var GL_RGB$1 = 0x1907;
var GL_RGBA$2 = 0x1908;

var GL_DEPTH_COMPONENT$1 = 0x1902;

var colorTextureFormatEnums = [
  GL_RGB$1,
  GL_RGBA$2
];

// for every texture format, store
// the number of channels
var textureFormatChannels = [];
textureFormatChannels[GL_RGBA$2] = 4;
textureFormatChannels[GL_RGB$1] = 3;

// for every texture type, store
// the size in bytes.
var textureTypeSizes = [];
textureTypeSizes[GL_UNSIGNED_BYTE$6] = 1;
textureTypeSizes[GL_FLOAT$5] = 4;
textureTypeSizes[GL_HALF_FLOAT_OES$2] = 2;

var GL_RGBA4$2 = 0x8056;
var GL_RGB5_A1$2 = 0x8057;
var GL_RGB565$2 = 0x8D62;
var GL_DEPTH_COMPONENT16$1 = 0x81A5;
var GL_STENCIL_INDEX8$1 = 0x8D48;
var GL_DEPTH_STENCIL$2 = 0x84F9;

var GL_SRGB8_ALPHA8_EXT$1 = 0x8C43;

var GL_RGBA32F_EXT$1 = 0x8814;

var GL_RGBA16F_EXT$1 = 0x881A;
var GL_RGB16F_EXT$1 = 0x881B;

var colorRenderbufferFormatEnums = [
  GL_RGBA4$2,
  GL_RGB5_A1$2,
  GL_RGB565$2,
  GL_SRGB8_ALPHA8_EXT$1,
  GL_RGBA16F_EXT$1,
  GL_RGB16F_EXT$1,
  GL_RGBA32F_EXT$1
];

var statusCode = {};
statusCode[GL_FRAMEBUFFER_COMPLETE$1] = 'complete';
statusCode[GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT] = 'incomplete attachment';
statusCode[GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS] = 'incomplete dimensions';
statusCode[GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT] = 'incomplete, missing attachment';
statusCode[GL_FRAMEBUFFER_UNSUPPORTED] = 'unsupported';

function wrapFBOState (
  gl,
  extensions,
  limits,
  textureState,
  renderbufferState,
  stats) {
  var framebufferState = {
    cur: null,
    next: null,
    dirty: false,
    setFBO: null
  };

  var colorTextureFormats = ['rgba'];
  var colorRenderbufferFormats = ['rgba4', 'rgb565', 'rgb5 a1'];

  if (extensions.ext_srgb) {
    colorRenderbufferFormats.push('srgba');
  }

  if (extensions.ext_color_buffer_half_float) {
    colorRenderbufferFormats.push('rgba16f', 'rgb16f');
  }

  if (extensions.webgl_color_buffer_float) {
    colorRenderbufferFormats.push('rgba32f');
  }

  var colorTypes = ['uint8'];
  if (extensions.oes_texture_half_float) {
    colorTypes.push('half float', 'float16');
  }
  if (extensions.oes_texture_float) {
    colorTypes.push('float', 'float32');
  }

  function FramebufferAttachment (target, texture, renderbuffer) {
    this.target = target;
    this.texture = texture;
    this.renderbuffer = renderbuffer;

    var w = 0;
    var h = 0;
    if (texture) {
      w = texture.width;
      h = texture.height;
    } else if (renderbuffer) {
      w = renderbuffer.width;
      h = renderbuffer.height;
    }
    this.width = w;
    this.height = h;
  }

  function decRef (attachment) {
    if (attachment) {
      if (attachment.texture) {
        attachment.texture._texture.decRef();
      }
      if (attachment.renderbuffer) {
        attachment.renderbuffer._renderbuffer.decRef();
      }
    }
  }

  function incRefAndCheckShape (attachment, width, height) {
    if (!attachment) {
      return
    }
    if (attachment.texture) {
      var texture = attachment.texture._texture;
      var tw = Math.max(1, texture.width);
      var th = Math.max(1, texture.height);
      check$1(tw === width && th === height,
        'inconsistent width/height for supplied texture');
      texture.refCount += 1;
    } else {
      var renderbuffer = attachment.renderbuffer._renderbuffer;
      check$1(
        renderbuffer.width === width && renderbuffer.height === height,
        'inconsistent width/height for renderbuffer');
      renderbuffer.refCount += 1;
    }
  }

  function attach (location, attachment) {
    if (attachment) {
      if (attachment.texture) {
        gl.framebufferTexture2D(
          GL_FRAMEBUFFER$1,
          location,
          attachment.target,
          attachment.texture._texture.texture,
          0);
      } else {
        gl.framebufferRenderbuffer(
          GL_FRAMEBUFFER$1,
          location,
          GL_RENDERBUFFER$1,
          attachment.renderbuffer._renderbuffer.renderbuffer);
      }
    }
  }

  function parseAttachment (attachment) {
    var target = GL_TEXTURE_2D$2;
    var texture = null;
    var renderbuffer = null;

    var data = attachment;
    if (typeof attachment === 'object') {
      data = attachment.data;
      if ('target' in attachment) {
        target = attachment.target | 0;
      }
    }

    check$1.type(data, 'function', 'invalid attachment data');

    var type = data._reglType;
    if (type === 'texture2d') {
      texture = data;
      check$1(target === GL_TEXTURE_2D$2);
    } else if (type === 'textureCube') {
      texture = data;
      check$1(
        target >= GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 &&
        target < GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + 6,
        'invalid cube map target');
    } else if (type === 'renderbuffer') {
      renderbuffer = data;
      target = GL_RENDERBUFFER$1;
    } else {
      check$1.raise('invalid regl object for attachment');
    }

    return new FramebufferAttachment(target, texture, renderbuffer)
  }

  function allocAttachment (
    width,
    height,
    isTexture,
    format,
    type) {
    if (isTexture) {
      var texture = textureState.create2D({
        width: width,
        height: height,
        format: format,
        type: type
      });
      texture._texture.refCount = 0;
      return new FramebufferAttachment(GL_TEXTURE_2D$2, texture, null)
    } else {
      var rb = renderbufferState.create({
        width: width,
        height: height,
        format: format
      });
      rb._renderbuffer.refCount = 0;
      return new FramebufferAttachment(GL_RENDERBUFFER$1, null, rb)
    }
  }

  function unwrapAttachment (attachment) {
    return attachment && (attachment.texture || attachment.renderbuffer)
  }

  function resizeAttachment (attachment, w, h) {
    if (attachment) {
      if (attachment.texture) {
        attachment.texture.resize(w, h);
      } else if (attachment.renderbuffer) {
        attachment.renderbuffer.resize(w, h);
      }
    }
  }

  var framebufferCount = 0;
  var framebufferSet = {};

  function REGLFramebuffer () {
    this.id = framebufferCount++;
    framebufferSet[this.id] = this;

    this.framebuffer = gl.createFramebuffer();
    this.width = 0;
    this.height = 0;

    this.colorAttachments = [];
    this.depthAttachment = null;
    this.stencilAttachment = null;
    this.depthStencilAttachment = null;
  }

  function decFBORefs (framebuffer) {
    framebuffer.colorAttachments.forEach(decRef);
    decRef(framebuffer.depthAttachment);
    decRef(framebuffer.stencilAttachment);
    decRef(framebuffer.depthStencilAttachment);
  }

  function destroy (framebuffer) {
    var handle = framebuffer.framebuffer;
    check$1(handle, 'must not double destroy framebuffer');
    gl.deleteFramebuffer(handle);
    framebuffer.framebuffer = null;
    stats.framebufferCount--;
    delete framebufferSet[framebuffer.id];
  }

  function updateFramebuffer (framebuffer) {
    var i;

    gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebuffer.framebuffer);
    var colorAttachments = framebuffer.colorAttachments;
    for (i = 0; i < colorAttachments.length; ++i) {
      attach(GL_COLOR_ATTACHMENT0$1 + i, colorAttachments[i]);
    }
    for (i = colorAttachments.length; i < limits.maxColorAttachments; ++i) {
      gl.framebufferTexture2D(
        GL_FRAMEBUFFER$1,
        GL_COLOR_ATTACHMENT0$1 + i,
        GL_TEXTURE_2D$2,
        null,
        0);
    }

    gl.framebufferTexture2D(
      GL_FRAMEBUFFER$1,
      GL_DEPTH_STENCIL_ATTACHMENT,
      GL_TEXTURE_2D$2,
      null,
      0);
    gl.framebufferTexture2D(
      GL_FRAMEBUFFER$1,
      GL_DEPTH_ATTACHMENT,
      GL_TEXTURE_2D$2,
      null,
      0);
    gl.framebufferTexture2D(
      GL_FRAMEBUFFER$1,
      GL_STENCIL_ATTACHMENT,
      GL_TEXTURE_2D$2,
      null,
      0);

    attach(GL_DEPTH_ATTACHMENT, framebuffer.depthAttachment);
    attach(GL_STENCIL_ATTACHMENT, framebuffer.stencilAttachment);
    attach(GL_DEPTH_STENCIL_ATTACHMENT, framebuffer.depthStencilAttachment);

    // Check status code
    var status = gl.checkFramebufferStatus(GL_FRAMEBUFFER$1);
    if (status !== GL_FRAMEBUFFER_COMPLETE$1) {
      check$1.raise('framebuffer configuration not supported, status = ' +
        statusCode[status]);
    }


    gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebufferState.next ? framebufferState.next.framebuffer : null);
    framebufferState.cur = framebufferState.next;

    // FIXME: Clear error code here.  This is a work around for a bug in
    // headless-gl
    gl.getError();
  }

  function createFBO (a0, a1) {
    var framebuffer = new REGLFramebuffer();
    stats.framebufferCount++;

    function reglFramebuffer (a, b) {
      var i;

      check$1(framebufferState.next !== framebuffer,
        'can not update framebuffer which is currently in use');

      var extDrawBuffers = extensions.webgl_draw_buffers;

      var width = 0;
      var height = 0;

      var needsDepth = true;
      var needsStencil = true;

      var colorBuffer = null;
      var colorTexture = true;
      var colorFormat = 'rgba';
      var colorType = 'uint8';
      var colorCount = 1;

      var depthBuffer = null;
      var stencilBuffer = null;
      var depthStencilBuffer = null;
      var depthStencilTexture = false;

      if (typeof a === 'number') {
        width = a | 0;
        height = (b | 0) || width;
      } else if (!a) {
        width = height = 1;
      } else {
        check$1.type(a, 'object', 'invalid arguments for framebuffer');
        var options = a;

        if ('shape' in options) {
          var shape = options.shape;
          check$1(Array.isArray(shape) && shape.length >= 2,
            'invalid shape for framebuffer');
          width = shape[0];
          height = shape[1];
        } else {
          if ('radius' in options) {
            width = height = options.radius;
          }
          if ('width' in options) {
            width = options.width;
          }
          if ('height' in options) {
            height = options.height;
          }
        }

        if ('color' in options ||
            'colors' in options) {
          colorBuffer =
            options.color ||
            options.colors;
          if (Array.isArray(colorBuffer)) {
            check$1(
              colorBuffer.length === 1 || extDrawBuffers,
              'multiple render targets not supported');
          }
        }

        if (!colorBuffer) {
          if ('colorCount' in options) {
            colorCount = options.colorCount | 0;
            check$1(colorCount > 0, 'invalid color buffer count');
          }

          if ('colorTexture' in options) {
            colorTexture = !!options.colorTexture;
            colorFormat = 'rgba4';
          }

          if ('colorType' in options) {
            colorType = options.colorType;
            if (!colorTexture) {
              if (colorType === 'half float' || colorType === 'float16') {
                check$1(extensions.ext_color_buffer_half_float,
                  'you must enable EXT_color_buffer_half_float to use 16-bit render buffers');
                colorFormat = 'rgba16f';
              } else if (colorType === 'float' || colorType === 'float32') {
                check$1(extensions.webgl_color_buffer_float,
                  'you must enable WEBGL_color_buffer_float in order to use 32-bit floating point renderbuffers');
                colorFormat = 'rgba32f';
              }
            } else {
              check$1(extensions.oes_texture_float ||
                !(colorType === 'float' || colorType === 'float32'),
                'you must enable OES_texture_float in order to use floating point framebuffer objects');
              check$1(extensions.oes_texture_half_float ||
                !(colorType === 'half float' || colorType === 'float16'),
                'you must enable OES_texture_half_float in order to use 16-bit floating point framebuffer objects');
            }
            check$1.oneOf(colorType, colorTypes, 'invalid color type');
          }

          if ('colorFormat' in options) {
            colorFormat = options.colorFormat;
            if (colorTextureFormats.indexOf(colorFormat) >= 0) {
              colorTexture = true;
            } else if (colorRenderbufferFormats.indexOf(colorFormat) >= 0) {
              colorTexture = false;
            } else {
              if (colorTexture) {
                check$1.oneOf(
                  options.colorFormat, colorTextureFormats,
                  'invalid color format for texture');
              } else {
                check$1.oneOf(
                  options.colorFormat, colorRenderbufferFormats,
                  'invalid color format for renderbuffer');
              }
            }
          }
        }

        if ('depthTexture' in options || 'depthStencilTexture' in options) {
          depthStencilTexture = !!(options.depthTexture ||
            options.depthStencilTexture);
          check$1(!depthStencilTexture || extensions.webgl_depth_texture,
            'webgl_depth_texture extension not supported');
        }

        if ('depth' in options) {
          if (typeof options.depth === 'boolean') {
            needsDepth = options.depth;
          } else {
            depthBuffer = options.depth;
            needsStencil = false;
          }
        }

        if ('stencil' in options) {
          if (typeof options.stencil === 'boolean') {
            needsStencil = options.stencil;
          } else {
            stencilBuffer = options.stencil;
            needsDepth = false;
          }
        }

        if ('depthStencil' in options) {
          if (typeof options.depthStencil === 'boolean') {
            needsDepth = needsStencil = options.depthStencil;
          } else {
            depthStencilBuffer = options.depthStencil;
            needsDepth = false;
            needsStencil = false;
          }
        }
      }

      // parse attachments
      var colorAttachments = null;
      var depthAttachment = null;
      var stencilAttachment = null;
      var depthStencilAttachment = null;

      // Set up color attachments
      if (Array.isArray(colorBuffer)) {
        colorAttachments = colorBuffer.map(parseAttachment);
      } else if (colorBuffer) {
        colorAttachments = [parseAttachment(colorBuffer)];
      } else {
        colorAttachments = new Array(colorCount);
        for (i = 0; i < colorCount; ++i) {
          colorAttachments[i] = allocAttachment(
            width,
            height,
            colorTexture,
            colorFormat,
            colorType);
        }
      }

      check$1(extensions.webgl_draw_buffers || colorAttachments.length <= 1,
        'you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers.');
      check$1(colorAttachments.length <= limits.maxColorAttachments,
        'too many color attachments, not supported');

      width = width || colorAttachments[0].width;
      height = height || colorAttachments[0].height;

      if (depthBuffer) {
        depthAttachment = parseAttachment(depthBuffer);
      } else if (needsDepth && !needsStencil) {
        depthAttachment = allocAttachment(
          width,
          height,
          depthStencilTexture,
          'depth',
          'uint32');
      }

      if (stencilBuffer) {
        stencilAttachment = parseAttachment(stencilBuffer);
      } else if (needsStencil && !needsDepth) {
        stencilAttachment = allocAttachment(
          width,
          height,
          false,
          'stencil',
          'uint8');
      }

      if (depthStencilBuffer) {
        depthStencilAttachment = parseAttachment(depthStencilBuffer);
      } else if (!depthBuffer && !stencilBuffer && needsStencil && needsDepth) {
        depthStencilAttachment = allocAttachment(
          width,
          height,
          depthStencilTexture,
          'depth stencil',
          'depth stencil');
      }

      check$1(
        (!!depthBuffer) + (!!stencilBuffer) + (!!depthStencilBuffer) <= 1,
        'invalid framebuffer configuration, can specify exactly one depth/stencil attachment');

      var commonColorAttachmentSize = null;

      for (i = 0; i < colorAttachments.length; ++i) {
        incRefAndCheckShape(colorAttachments[i], width, height);
        check$1(!colorAttachments[i] ||
          (colorAttachments[i].texture &&
            colorTextureFormatEnums.indexOf(colorAttachments[i].texture._texture.format) >= 0) ||
          (colorAttachments[i].renderbuffer &&
            colorRenderbufferFormatEnums.indexOf(colorAttachments[i].renderbuffer._renderbuffer.format) >= 0),
          'framebuffer color attachment ' + i + ' is invalid');

        if (colorAttachments[i] && colorAttachments[i].texture) {
          var colorAttachmentSize =
              textureFormatChannels[colorAttachments[i].texture._texture.format] *
              textureTypeSizes[colorAttachments[i].texture._texture.type];

          if (commonColorAttachmentSize === null) {
            commonColorAttachmentSize = colorAttachmentSize;
          } else {
            // We need to make sure that all color attachments have the same number of bitplanes
            // (that is, the same numer of bits per pixel)
            // This is required by the GLES2.0 standard. See the beginning of Chapter 4 in that document.
            check$1(commonColorAttachmentSize === colorAttachmentSize,
                  'all color attachments much have the same number of bits per pixel.');
          }
        }
      }
      incRefAndCheckShape(depthAttachment, width, height);
      check$1(!depthAttachment ||
        (depthAttachment.texture &&
          depthAttachment.texture._texture.format === GL_DEPTH_COMPONENT$1) ||
        (depthAttachment.renderbuffer &&
          depthAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_COMPONENT16$1),
        'invalid depth attachment for framebuffer object');
      incRefAndCheckShape(stencilAttachment, width, height);
      check$1(!stencilAttachment ||
        (stencilAttachment.renderbuffer &&
          stencilAttachment.renderbuffer._renderbuffer.format === GL_STENCIL_INDEX8$1),
        'invalid stencil attachment for framebuffer object');
      incRefAndCheckShape(depthStencilAttachment, width, height);
      check$1(!depthStencilAttachment ||
        (depthStencilAttachment.texture &&
          depthStencilAttachment.texture._texture.format === GL_DEPTH_STENCIL$2) ||
        (depthStencilAttachment.renderbuffer &&
          depthStencilAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_STENCIL$2),
        'invalid depth-stencil attachment for framebuffer object');

      // decrement references
      decFBORefs(framebuffer);

      framebuffer.width = width;
      framebuffer.height = height;

      framebuffer.colorAttachments = colorAttachments;
      framebuffer.depthAttachment = depthAttachment;
      framebuffer.stencilAttachment = stencilAttachment;
      framebuffer.depthStencilAttachment = depthStencilAttachment;

      reglFramebuffer.color = colorAttachments.map(unwrapAttachment);
      reglFramebuffer.depth = unwrapAttachment(depthAttachment);
      reglFramebuffer.stencil = unwrapAttachment(stencilAttachment);
      reglFramebuffer.depthStencil = unwrapAttachment(depthStencilAttachment);

      reglFramebuffer.width = framebuffer.width;
      reglFramebuffer.height = framebuffer.height;

      updateFramebuffer(framebuffer);

      return reglFramebuffer
    }

    function resize (w_, h_) {
      check$1(framebufferState.next !== framebuffer,
        'can not resize a framebuffer which is currently in use');

      var w = w_ | 0;
      var h = (h_ | 0) || w;
      if (w === framebuffer.width && h === framebuffer.height) {
        return reglFramebuffer
      }

      // resize all buffers
      var colorAttachments = framebuffer.colorAttachments;
      for (var i = 0; i < colorAttachments.length; ++i) {
        resizeAttachment(colorAttachments[i], w, h);
      }
      resizeAttachment(framebuffer.depthAttachment, w, h);
      resizeAttachment(framebuffer.stencilAttachment, w, h);
      resizeAttachment(framebuffer.depthStencilAttachment, w, h);

      framebuffer.width = reglFramebuffer.width = w;
      framebuffer.height = reglFramebuffer.height = h;

      updateFramebuffer(framebuffer);

      return reglFramebuffer
    }

    reglFramebuffer(a0, a1);

    return extend(reglFramebuffer, {
      resize: resize,
      _reglType: 'framebuffer',
      _framebuffer: framebuffer,
      destroy: function () {
        destroy(framebuffer);
        decFBORefs(framebuffer);
      },
      use: function (block) {
        framebufferState.setFBO({
          framebuffer: reglFramebuffer
        }, block);
      }
    })
  }

  function createCubeFBO (options) {
    var faces = Array(6);

    function reglFramebufferCube (a) {
      var i;

      check$1(faces.indexOf(framebufferState.next) < 0,
        'can not update framebuffer which is currently in use');

      var extDrawBuffers = extensions.webgl_draw_buffers;

      var params = {
        color: null
      };

      var radius = 0;

      var colorBuffer = null;
      var colorFormat = 'rgba';
      var colorType = 'uint8';
      var colorCount = 1;

      if (typeof a === 'number') {
        radius = a | 0;
      } else if (!a) {
        radius = 1;
      } else {
        check$1.type(a, 'object', 'invalid arguments for framebuffer');
        var options = a;

        if ('shape' in options) {
          var shape = options.shape;
          check$1(
            Array.isArray(shape) && shape.length >= 2,
            'invalid shape for framebuffer');
          check$1(
            shape[0] === shape[1],
            'cube framebuffer must be square');
          radius = shape[0];
        } else {
          if ('radius' in options) {
            radius = options.radius | 0;
          }
          if ('width' in options) {
            radius = options.width | 0;
            if ('height' in options) {
              check$1(options.height === radius, 'must be square');
            }
          } else if ('height' in options) {
            radius = options.height | 0;
          }
        }

        if ('color' in options ||
            'colors' in options) {
          colorBuffer =
            options.color ||
            options.colors;
          if (Array.isArray(colorBuffer)) {
            check$1(
              colorBuffer.length === 1 || extDrawBuffers,
              'multiple render targets not supported');
          }
        }

        if (!colorBuffer) {
          if ('colorCount' in options) {
            colorCount = options.colorCount | 0;
            check$1(colorCount > 0, 'invalid color buffer count');
          }

          if ('colorType' in options) {
            check$1.oneOf(
              options.colorType, colorTypes,
              'invalid color type');
            colorType = options.colorType;
          }

          if ('colorFormat' in options) {
            colorFormat = options.colorFormat;
            check$1.oneOf(
              options.colorFormat, colorTextureFormats,
              'invalid color format for texture');
          }
        }

        if ('depth' in options) {
          params.depth = options.depth;
        }

        if ('stencil' in options) {
          params.stencil = options.stencil;
        }

        if ('depthStencil' in options) {
          params.depthStencil = options.depthStencil;
        }
      }

      var colorCubes;
      if (colorBuffer) {
        if (Array.isArray(colorBuffer)) {
          colorCubes = [];
          for (i = 0; i < colorBuffer.length; ++i) {
            colorCubes[i] = colorBuffer[i];
          }
        } else {
          colorCubes = [ colorBuffer ];
        }
      } else {
        colorCubes = Array(colorCount);
        var cubeMapParams = {
          radius: radius,
          format: colorFormat,
          type: colorType
        };
        for (i = 0; i < colorCount; ++i) {
          colorCubes[i] = textureState.createCube(cubeMapParams);
        }
      }

      // Check color cubes
      params.color = Array(colorCubes.length);
      for (i = 0; i < colorCubes.length; ++i) {
        var cube = colorCubes[i];
        check$1(
          typeof cube === 'function' && cube._reglType === 'textureCube',
          'invalid cube map');
        radius = radius || cube.width;
        check$1(
          cube.width === radius && cube.height === radius,
          'invalid cube map shape');
        params.color[i] = {
          target: GL_TEXTURE_CUBE_MAP_POSITIVE_X$2,
          data: colorCubes[i]
        };
      }

      for (i = 0; i < 6; ++i) {
        for (var j = 0; j < colorCubes.length; ++j) {
          params.color[j].target = GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + i;
        }
        // reuse depth-stencil attachments across all cube maps
        if (i > 0) {
          params.depth = faces[0].depth;
          params.stencil = faces[0].stencil;
          params.depthStencil = faces[0].depthStencil;
        }
        if (faces[i]) {
          (faces[i])(params);
        } else {
          faces[i] = createFBO(params);
        }
      }

      return extend(reglFramebufferCube, {
        width: radius,
        height: radius,
        color: colorCubes
      })
    }

    function resize (radius_) {
      var i;
      var radius = radius_ | 0;
      check$1(radius > 0 && radius <= limits.maxCubeMapSize,
        'invalid radius for cube fbo');

      if (radius === reglFramebufferCube.width) {
        return reglFramebufferCube
      }

      var colors = reglFramebufferCube.color;
      for (i = 0; i < colors.length; ++i) {
        colors[i].resize(radius);
      }

      for (i = 0; i < 6; ++i) {
        faces[i].resize(radius);
      }

      reglFramebufferCube.width = reglFramebufferCube.height = radius;

      return reglFramebufferCube
    }

    reglFramebufferCube(options);

    return extend(reglFramebufferCube, {
      faces: faces,
      resize: resize,
      _reglType: 'framebufferCube',
      destroy: function () {
        faces.forEach(function (f) {
          f.destroy();
        });
      }
    })
  }

  function restoreFramebuffers () {
    values(framebufferSet).forEach(function (fb) {
      fb.framebuffer = gl.createFramebuffer();
      updateFramebuffer(fb);
    });
  }

  return extend(framebufferState, {
    getFramebuffer: function (object) {
      if (typeof object === 'function' && object._reglType === 'framebuffer') {
        var fbo = object._framebuffer;
        if (fbo instanceof REGLFramebuffer) {
          return fbo
        }
      }
      return null
    },
    create: createFBO,
    createCube: createCubeFBO,
    clear: function () {
      values(framebufferSet).forEach(destroy);
    },
    restore: restoreFramebuffers
  })
}

var GL_FLOAT$6 = 5126;

function AttributeRecord () {
  this.state = 0;

  this.x = 0.0;
  this.y = 0.0;
  this.z = 0.0;
  this.w = 0.0;

  this.buffer = null;
  this.size = 0;
  this.normalized = false;
  this.type = GL_FLOAT$6;
  this.offset = 0;
  this.stride = 0;
  this.divisor = 0;
}

function wrapAttributeState (
  gl,
  extensions,
  limits,
  stringStore) {
  var NUM_ATTRIBUTES = limits.maxAttributes;
  var attributeBindings = new Array(NUM_ATTRIBUTES);
  for (var i = 0; i < NUM_ATTRIBUTES; ++i) {
    attributeBindings[i] = new AttributeRecord();
  }

  return {
    Record: AttributeRecord,
    scope: {},
    state: attributeBindings
  }
}

var GL_FRAGMENT_SHADER = 35632;
var GL_VERTEX_SHADER = 35633;

var GL_ACTIVE_UNIFORMS = 0x8B86;
var GL_ACTIVE_ATTRIBUTES = 0x8B89;

function wrapShaderState (gl, stringStore, stats, config) {
  // ===================================================
  // glsl compilation and linking
  // ===================================================
  var fragShaders = {};
  var vertShaders = {};

  function ActiveInfo (name, id, location, info) {
    this.name = name;
    this.id = id;
    this.location = location;
    this.info = info;
  }

  function insertActiveInfo (list, info) {
    for (var i = 0; i < list.length; ++i) {
      if (list[i].id === info.id) {
        list[i].location = info.location;
        return
      }
    }
    list.push(info);
  }

  function getShader (type, id, command) {
    var cache = type === GL_FRAGMENT_SHADER ? fragShaders : vertShaders;
    var shader = cache[id];

    if (!shader) {
      var source = stringStore.str(id);
      shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      check$1.shaderError(gl, shader, source, type, command);
      cache[id] = shader;
    }

    return shader
  }

  // ===================================================
  // program linking
  // ===================================================
  var programCache = {};
  var programList = [];

  var PROGRAM_COUNTER = 0;

  function REGLProgram (fragId, vertId) {
    this.id = PROGRAM_COUNTER++;
    this.fragId = fragId;
    this.vertId = vertId;
    this.program = null;
    this.uniforms = [];
    this.attributes = [];

    if (config.profile) {
      this.stats = {
        uniformsCount: 0,
        attributesCount: 0
      };
    }
  }

  function linkProgram (desc, command) {
    var i, info;

    // -------------------------------
    // compile & link
    // -------------------------------
    var fragShader = getShader(GL_FRAGMENT_SHADER, desc.fragId);
    var vertShader = getShader(GL_VERTEX_SHADER, desc.vertId);

    var program = desc.program = gl.createProgram();
    gl.attachShader(program, fragShader);
    gl.attachShader(program, vertShader);
    gl.linkProgram(program);
    check$1.linkError(
      gl,
      program,
      stringStore.str(desc.fragId),
      stringStore.str(desc.vertId),
      command);

    // -------------------------------
    // grab uniforms
    // -------------------------------
    var numUniforms = gl.getProgramParameter(program, GL_ACTIVE_UNIFORMS);
    if (config.profile) {
      desc.stats.uniformsCount = numUniforms;
    }
    var uniforms = desc.uniforms;
    for (i = 0; i < numUniforms; ++i) {
      info = gl.getActiveUniform(program, i);
      if (info) {
        if (info.size > 1) {
          for (var j = 0; j < info.size; ++j) {
            var name = info.name.replace('[0]', '[' + j + ']');
            insertActiveInfo(uniforms, new ActiveInfo(
              name,
              stringStore.id(name),
              gl.getUniformLocation(program, name),
              info));
          }
        } else {
          insertActiveInfo(uniforms, new ActiveInfo(
            info.name,
            stringStore.id(info.name),
            gl.getUniformLocation(program, info.name),
            info));
        }
      }
    }

    // -------------------------------
    // grab attributes
    // -------------------------------
    var numAttributes = gl.getProgramParameter(program, GL_ACTIVE_ATTRIBUTES);
    if (config.profile) {
      desc.stats.attributesCount = numAttributes;
    }

    var attributes = desc.attributes;
    for (i = 0; i < numAttributes; ++i) {
      info = gl.getActiveAttrib(program, i);
      if (info) {
        insertActiveInfo(attributes, new ActiveInfo(
          info.name,
          stringStore.id(info.name),
          gl.getAttribLocation(program, info.name),
          info));
      }
    }
  }

  if (config.profile) {
    stats.getMaxUniformsCount = function () {
      var m = 0;
      programList.forEach(function (desc) {
        if (desc.stats.uniformsCount > m) {
          m = desc.stats.uniformsCount;
        }
      });
      return m
    };

    stats.getMaxAttributesCount = function () {
      var m = 0;
      programList.forEach(function (desc) {
        if (desc.stats.attributesCount > m) {
          m = desc.stats.attributesCount;
        }
      });
      return m
    };
  }

  function restoreShaders () {
    fragShaders = {};
    vertShaders = {};
    for (var i = 0; i < programList.length; ++i) {
      linkProgram(programList[i]);
    }
  }

  return {
    clear: function () {
      var deleteShader = gl.deleteShader.bind(gl);
      values(fragShaders).forEach(deleteShader);
      fragShaders = {};
      values(vertShaders).forEach(deleteShader);
      vertShaders = {};

      programList.forEach(function (desc) {
        gl.deleteProgram(desc.program);
      });
      programList.length = 0;
      programCache = {};

      stats.shaderCount = 0;
    },

    program: function (vertId, fragId, command) {
      check$1.command(vertId >= 0, 'missing vertex shader', command);
      check$1.command(fragId >= 0, 'missing fragment shader', command);

      var cache = programCache[fragId];
      if (!cache) {
        cache = programCache[fragId] = {};
      }
      var program = cache[vertId];
      if (!program) {
        program = new REGLProgram(fragId, vertId);
        stats.shaderCount++;

        linkProgram(program, command);
        cache[vertId] = program;
        programList.push(program);
      }
      return program
    },

    restore: restoreShaders,

    shader: getShader,

    frag: -1,
    vert: -1
  }
}

var GL_RGBA$3 = 6408;
var GL_UNSIGNED_BYTE$7 = 5121;
var GL_PACK_ALIGNMENT = 0x0D05;
var GL_FLOAT$7 = 0x1406; // 5126

function wrapReadPixels (
  gl,
  framebufferState,
  reglPoll,
  context,
  glAttributes,
  extensions,
  limits) {
  function readPixelsImpl (input) {
    var type;
    if (framebufferState.next === null) {
      check$1(
        glAttributes.preserveDrawingBuffer,
        'you must create a webgl context with "preserveDrawingBuffer":true in order to read pixels from the drawing buffer');
      type = GL_UNSIGNED_BYTE$7;
    } else {
      check$1(
        framebufferState.next.colorAttachments[0].texture !== null,
          'You cannot read from a renderbuffer');
      type = framebufferState.next.colorAttachments[0].texture._texture.type;

      if (extensions.oes_texture_float) {
        check$1(
          type === GL_UNSIGNED_BYTE$7 || type === GL_FLOAT$7,
          'Reading from a framebuffer is only allowed for the types \'uint8\' and \'float\'');

        if (type === GL_FLOAT$7) {
          check$1(limits.readFloat, 'Reading \'float\' values is not permitted in your browser. For a fallback, please see: https://www.npmjs.com/package/glsl-read-float');
        }
      } else {
        check$1(
          type === GL_UNSIGNED_BYTE$7,
          'Reading from a framebuffer is only allowed for the type \'uint8\'');
      }
    }

    var x = 0;
    var y = 0;
    var width = context.framebufferWidth;
    var height = context.framebufferHeight;
    var data = null;

    if (isTypedArray(input)) {
      data = input;
    } else if (input) {
      check$1.type(input, 'object', 'invalid arguments to regl.read()');
      x = input.x | 0;
      y = input.y | 0;
      check$1(
        x >= 0 && x < context.framebufferWidth,
        'invalid x offset for regl.read');
      check$1(
        y >= 0 && y < context.framebufferHeight,
        'invalid y offset for regl.read');
      width = (input.width || (context.framebufferWidth - x)) | 0;
      height = (input.height || (context.framebufferHeight - y)) | 0;
      data = input.data || null;
    }

    // sanity check input.data
    if (data) {
      if (type === GL_UNSIGNED_BYTE$7) {
        check$1(
          data instanceof Uint8Array,
          'buffer must be \'Uint8Array\' when reading from a framebuffer of type \'uint8\'');
      } else if (type === GL_FLOAT$7) {
        check$1(
          data instanceof Float32Array,
          'buffer must be \'Float32Array\' when reading from a framebuffer of type \'float\'');
      }
    }

    check$1(
      width > 0 && width + x <= context.framebufferWidth,
      'invalid width for read pixels');
    check$1(
      height > 0 && height + y <= context.framebufferHeight,
      'invalid height for read pixels');

    // Update WebGL state
    reglPoll();

    // Compute size
    var size = width * height * 4;

    // Allocate data
    if (!data) {
      if (type === GL_UNSIGNED_BYTE$7) {
        data = new Uint8Array(size);
      } else if (type === GL_FLOAT$7) {
        data = data || new Float32Array(size);
      }
    }

    // Type check
    check$1.isTypedArray(data, 'data buffer for regl.read() must be a typedarray');
    check$1(data.byteLength >= size, 'data buffer for regl.read() too small');

    // Run read pixels
    gl.pixelStorei(GL_PACK_ALIGNMENT, 4);
    gl.readPixels(x, y, width, height, GL_RGBA$3,
                  type,
                  data);

    return data
  }

  function readPixelsFBO (options) {
    var result;
    framebufferState.setFBO({
      framebuffer: options.framebuffer
    }, function () {
      result = readPixelsImpl(options);
    });
    return result
  }

  function readPixels (options) {
    if (!options || !('framebuffer' in options)) {
      return readPixelsImpl(options)
    } else {
      return readPixelsFBO(options)
    }
  }

  return readPixels
}

function slice (x) {
  return Array.prototype.slice.call(x)
}

function join (x) {
  return slice(x).join('')
}

function createEnvironment () {
  // Unique variable id counter
  var varCounter = 0;

  // Linked values are passed from this scope into the generated code block
  // Calling link() passes a value into the generated scope and returns
  // the variable name which it is bound to
  var linkedNames = [];
  var linkedValues = [];
  function link (value) {
    for (var i = 0; i < linkedValues.length; ++i) {
      if (linkedValues[i] === value) {
        return linkedNames[i]
      }
    }

    var name = 'g' + (varCounter++);
    linkedNames.push(name);
    linkedValues.push(value);
    return name
  }

  // create a code block
  function block () {
    var code = [];
    function push () {
      code.push.apply(code, slice(arguments));
    }

    var vars = [];
    function def () {
      var name = 'v' + (varCounter++);
      vars.push(name);

      if (arguments.length > 0) {
        code.push(name, '=');
        code.push.apply(code, slice(arguments));
        code.push(';');
      }

      return name
    }

    return extend(push, {
      def: def,
      toString: function () {
        return join([
          (vars.length > 0 ? 'var ' + vars + ';' : ''),
          join(code)
        ])
      }
    })
  }

  function scope () {
    var entry = block();
    var exit = block();

    var entryToString = entry.toString;
    var exitToString = exit.toString;

    function save (object, prop) {
      exit(object, prop, '=', entry.def(object, prop), ';');
    }

    return extend(function () {
      entry.apply(entry, slice(arguments));
    }, {
      def: entry.def,
      entry: entry,
      exit: exit,
      save: save,
      set: function (object, prop, value) {
        save(object, prop);
        entry(object, prop, '=', value, ';');
      },
      toString: function () {
        return entryToString() + exitToString()
      }
    })
  }

  function conditional () {
    var pred = join(arguments);
    var thenBlock = scope();
    var elseBlock = scope();

    var thenToString = thenBlock.toString;
    var elseToString = elseBlock.toString;

    return extend(thenBlock, {
      then: function () {
        thenBlock.apply(thenBlock, slice(arguments));
        return this
      },
      else: function () {
        elseBlock.apply(elseBlock, slice(arguments));
        return this
      },
      toString: function () {
        var elseClause = elseToString();
        if (elseClause) {
          elseClause = 'else{' + elseClause + '}';
        }
        return join([
          'if(', pred, '){',
          thenToString(),
          '}', elseClause
        ])
      }
    })
  }

  // procedure list
  var globalBlock = block();
  var procedures = {};
  function proc (name, count) {
    var args = [];
    function arg () {
      var name = 'a' + args.length;
      args.push(name);
      return name
    }

    count = count || 0;
    for (var i = 0; i < count; ++i) {
      arg();
    }

    var body = scope();
    var bodyToString = body.toString;

    var result = procedures[name] = extend(body, {
      arg: arg,
      toString: function () {
        return join([
          'function(', args.join(), '){',
          bodyToString(),
          '}'
        ])
      }
    });

    return result
  }

  function compile () {
    var code = ['"use strict";',
      globalBlock,
      'return {'];
    Object.keys(procedures).forEach(function (name) {
      code.push('"', name, '":', procedures[name].toString(), ',');
    });
    code.push('}');
    var src = join(code)
      .replace(/;/g, ';\n')
      .replace(/}/g, '}\n')
      .replace(/{/g, '{\n');
    var proc = Function.apply(null, linkedNames.concat(src));
    return proc.apply(null, linkedValues)
  }

  return {
    global: globalBlock,
    link: link,
    block: block,
    proc: proc,
    scope: scope,
    cond: conditional,
    compile: compile
  }
}

// "cute" names for vector components
var CUTE_COMPONENTS = 'xyzw'.split('');

var GL_UNSIGNED_BYTE$8 = 5121;

var ATTRIB_STATE_POINTER = 1;
var ATTRIB_STATE_CONSTANT = 2;

var DYN_FUNC$1 = 0;
var DYN_PROP$1 = 1;
var DYN_CONTEXT$1 = 2;
var DYN_STATE$1 = 3;
var DYN_THUNK = 4;

var S_DITHER = 'dither';
var S_BLEND_ENABLE = 'blend.enable';
var S_BLEND_COLOR = 'blend.color';
var S_BLEND_EQUATION = 'blend.equation';
var S_BLEND_FUNC = 'blend.func';
var S_DEPTH_ENABLE = 'depth.enable';
var S_DEPTH_FUNC = 'depth.func';
var S_DEPTH_RANGE = 'depth.range';
var S_DEPTH_MASK = 'depth.mask';
var S_COLOR_MASK = 'colorMask';
var S_CULL_ENABLE = 'cull.enable';
var S_CULL_FACE = 'cull.face';
var S_FRONT_FACE = 'frontFace';
var S_LINE_WIDTH = 'lineWidth';
var S_POLYGON_OFFSET_ENABLE = 'polygonOffset.enable';
var S_POLYGON_OFFSET_OFFSET = 'polygonOffset.offset';
var S_SAMPLE_ALPHA = 'sample.alpha';
var S_SAMPLE_ENABLE = 'sample.enable';
var S_SAMPLE_COVERAGE = 'sample.coverage';
var S_STENCIL_ENABLE = 'stencil.enable';
var S_STENCIL_MASK = 'stencil.mask';
var S_STENCIL_FUNC = 'stencil.func';
var S_STENCIL_OPFRONT = 'stencil.opFront';
var S_STENCIL_OPBACK = 'stencil.opBack';
var S_SCISSOR_ENABLE = 'scissor.enable';
var S_SCISSOR_BOX = 'scissor.box';
var S_VIEWPORT = 'viewport';

var S_PROFILE = 'profile';

var S_FRAMEBUFFER = 'framebuffer';
var S_VERT = 'vert';
var S_FRAG = 'frag';
var S_ELEMENTS = 'elements';
var S_PRIMITIVE = 'primitive';
var S_COUNT = 'count';
var S_OFFSET = 'offset';
var S_INSTANCES = 'instances';

var SUFFIX_WIDTH = 'Width';
var SUFFIX_HEIGHT = 'Height';

var S_FRAMEBUFFER_WIDTH = S_FRAMEBUFFER + SUFFIX_WIDTH;
var S_FRAMEBUFFER_HEIGHT = S_FRAMEBUFFER + SUFFIX_HEIGHT;
var S_VIEWPORT_WIDTH = S_VIEWPORT + SUFFIX_WIDTH;
var S_VIEWPORT_HEIGHT = S_VIEWPORT + SUFFIX_HEIGHT;
var S_DRAWINGBUFFER = 'drawingBuffer';
var S_DRAWINGBUFFER_WIDTH = S_DRAWINGBUFFER + SUFFIX_WIDTH;
var S_DRAWINGBUFFER_HEIGHT = S_DRAWINGBUFFER + SUFFIX_HEIGHT;

var NESTED_OPTIONS = [
  S_BLEND_FUNC,
  S_BLEND_EQUATION,
  S_STENCIL_FUNC,
  S_STENCIL_OPFRONT,
  S_STENCIL_OPBACK,
  S_SAMPLE_COVERAGE,
  S_VIEWPORT,
  S_SCISSOR_BOX,
  S_POLYGON_OFFSET_OFFSET
];

var GL_ARRAY_BUFFER$1 = 34962;
var GL_ELEMENT_ARRAY_BUFFER$1 = 34963;

var GL_FRAGMENT_SHADER$1 = 35632;
var GL_VERTEX_SHADER$1 = 35633;

var GL_TEXTURE_2D$3 = 0x0DE1;
var GL_TEXTURE_CUBE_MAP$2 = 0x8513;

var GL_CULL_FACE = 0x0B44;
var GL_BLEND = 0x0BE2;
var GL_DITHER = 0x0BD0;
var GL_STENCIL_TEST = 0x0B90;
var GL_DEPTH_TEST = 0x0B71;
var GL_SCISSOR_TEST = 0x0C11;
var GL_POLYGON_OFFSET_FILL = 0x8037;
var GL_SAMPLE_ALPHA_TO_COVERAGE = 0x809E;
var GL_SAMPLE_COVERAGE = 0x80A0;

var GL_FLOAT$8 = 5126;
var GL_FLOAT_VEC2 = 35664;
var GL_FLOAT_VEC3 = 35665;
var GL_FLOAT_VEC4 = 35666;
var GL_INT$3 = 5124;
var GL_INT_VEC2 = 35667;
var GL_INT_VEC3 = 35668;
var GL_INT_VEC4 = 35669;
var GL_BOOL = 35670;
var GL_BOOL_VEC2 = 35671;
var GL_BOOL_VEC3 = 35672;
var GL_BOOL_VEC4 = 35673;
var GL_FLOAT_MAT2 = 35674;
var GL_FLOAT_MAT3 = 35675;
var GL_FLOAT_MAT4 = 35676;
var GL_SAMPLER_2D = 35678;
var GL_SAMPLER_CUBE = 35680;

var GL_TRIANGLES$1 = 4;

var GL_FRONT = 1028;
var GL_BACK = 1029;
var GL_CW = 0x0900;
var GL_CCW = 0x0901;
var GL_MIN_EXT = 0x8007;
var GL_MAX_EXT = 0x8008;
var GL_ALWAYS = 519;
var GL_KEEP = 7680;
var GL_ZERO = 0;
var GL_ONE = 1;
var GL_FUNC_ADD = 0x8006;
var GL_LESS = 513;

var GL_FRAMEBUFFER$2 = 0x8D40;
var GL_COLOR_ATTACHMENT0$2 = 0x8CE0;

var blendFuncs = {
  '0': 0,
  '1': 1,
  'zero': 0,
  'one': 1,
  'src color': 768,
  'one minus src color': 769,
  'src alpha': 770,
  'one minus src alpha': 771,
  'dst color': 774,
  'one minus dst color': 775,
  'dst alpha': 772,
  'one minus dst alpha': 773,
  'constant color': 32769,
  'one minus constant color': 32770,
  'constant alpha': 32771,
  'one minus constant alpha': 32772,
  'src alpha saturate': 776
};

// There are invalid values for srcRGB and dstRGB. See:
// https://www.khronos.org/registry/webgl/specs/1.0/#6.13
// https://github.com/KhronosGroup/WebGL/blob/0d3201f5f7ec3c0060bc1f04077461541f1987b9/conformance-suites/1.0.3/conformance/misc/webgl-specific.html#L56
var invalidBlendCombinations = [
  'constant color, constant alpha',
  'one minus constant color, constant alpha',
  'constant color, one minus constant alpha',
  'one minus constant color, one minus constant alpha',
  'constant alpha, constant color',
  'constant alpha, one minus constant color',
  'one minus constant alpha, constant color',
  'one minus constant alpha, one minus constant color'
];

var compareFuncs = {
  'never': 512,
  'less': 513,
  '<': 513,
  'equal': 514,
  '=': 514,
  '==': 514,
  '===': 514,
  'lequal': 515,
  '<=': 515,
  'greater': 516,
  '>': 516,
  'notequal': 517,
  '!=': 517,
  '!==': 517,
  'gequal': 518,
  '>=': 518,
  'always': 519
};

var stencilOps = {
  '0': 0,
  'zero': 0,
  'keep': 7680,
  'replace': 7681,
  'increment': 7682,
  'decrement': 7683,
  'increment wrap': 34055,
  'decrement wrap': 34056,
  'invert': 5386
};

var shaderType = {
  'frag': GL_FRAGMENT_SHADER$1,
  'vert': GL_VERTEX_SHADER$1
};

var orientationType = {
  'cw': GL_CW,
  'ccw': GL_CCW
};

function isBufferArgs (x) {
  return Array.isArray(x) ||
    isTypedArray(x) ||
    isNDArrayLike(x)
}

// Make sure viewport is processed first
function sortState (state) {
  return state.sort(function (a, b) {
    if (a === S_VIEWPORT) {
      return -1
    } else if (b === S_VIEWPORT) {
      return 1
    }
    return (a < b) ? -1 : 1
  })
}

function Declaration (thisDep, contextDep, propDep, append) {
  this.thisDep = thisDep;
  this.contextDep = contextDep;
  this.propDep = propDep;
  this.append = append;
}

function isStatic (decl) {
  return decl && !(decl.thisDep || decl.contextDep || decl.propDep)
}

function createStaticDecl (append) {
  return new Declaration(false, false, false, append)
}

function createDynamicDecl (dyn, append) {
  var type = dyn.type;
  if (type === DYN_FUNC$1) {
    var numArgs = dyn.data.length;
    return new Declaration(
      true,
      numArgs >= 1,
      numArgs >= 2,
      append)
  } else if (type === DYN_THUNK) {
    var data = dyn.data;
    return new Declaration(
      data.thisDep,
      data.contextDep,
      data.propDep,
      append)
  } else {
    return new Declaration(
      type === DYN_STATE$1,
      type === DYN_CONTEXT$1,
      type === DYN_PROP$1,
      append)
  }
}

var SCOPE_DECL = new Declaration(false, false, false, function () {});

function reglCore (
  gl,
  stringStore,
  extensions,
  limits,
  bufferState,
  elementState,
  textureState,
  framebufferState,
  uniformState,
  attributeState,
  shaderState,
  drawState,
  contextState,
  timer,
  config) {
  var AttributeRecord = attributeState.Record;

  var blendEquations = {
    'add': 32774,
    'subtract': 32778,
    'reverse subtract': 32779
  };
  if (extensions.ext_blend_minmax) {
    blendEquations.min = GL_MIN_EXT;
    blendEquations.max = GL_MAX_EXT;
  }

  var extInstancing = extensions.angle_instanced_arrays;
  var extDrawBuffers = extensions.webgl_draw_buffers;

  // ===================================================
  // ===================================================
  // WEBGL STATE
  // ===================================================
  // ===================================================
  var currentState = {
    dirty: true,
    profile: config.profile
  };
  var nextState = {};
  var GL_STATE_NAMES = [];
  var GL_FLAGS = {};
  var GL_VARIABLES = {};

  function propName (name) {
    return name.replace('.', '_')
  }

  function stateFlag (sname, cap, init) {
    var name = propName(sname);
    GL_STATE_NAMES.push(sname);
    nextState[name] = currentState[name] = !!init;
    GL_FLAGS[name] = cap;
  }

  function stateVariable (sname, func, init) {
    var name = propName(sname);
    GL_STATE_NAMES.push(sname);
    if (Array.isArray(init)) {
      currentState[name] = init.slice();
      nextState[name] = init.slice();
    } else {
      currentState[name] = nextState[name] = init;
    }
    GL_VARIABLES[name] = func;
  }

  // Dithering
  stateFlag(S_DITHER, GL_DITHER);

  // Blending
  stateFlag(S_BLEND_ENABLE, GL_BLEND);
  stateVariable(S_BLEND_COLOR, 'blendColor', [0, 0, 0, 0]);
  stateVariable(S_BLEND_EQUATION, 'blendEquationSeparate',
    [GL_FUNC_ADD, GL_FUNC_ADD]);
  stateVariable(S_BLEND_FUNC, 'blendFuncSeparate',
    [GL_ONE, GL_ZERO, GL_ONE, GL_ZERO]);

  // Depth
  stateFlag(S_DEPTH_ENABLE, GL_DEPTH_TEST, true);
  stateVariable(S_DEPTH_FUNC, 'depthFunc', GL_LESS);
  stateVariable(S_DEPTH_RANGE, 'depthRange', [0, 1]);
  stateVariable(S_DEPTH_MASK, 'depthMask', true);

  // Color mask
  stateVariable(S_COLOR_MASK, S_COLOR_MASK, [true, true, true, true]);

  // Face culling
  stateFlag(S_CULL_ENABLE, GL_CULL_FACE);
  stateVariable(S_CULL_FACE, 'cullFace', GL_BACK);

  // Front face orientation
  stateVariable(S_FRONT_FACE, S_FRONT_FACE, GL_CCW);

  // Line width
  stateVariable(S_LINE_WIDTH, S_LINE_WIDTH, 1);

  // Polygon offset
  stateFlag(S_POLYGON_OFFSET_ENABLE, GL_POLYGON_OFFSET_FILL);
  stateVariable(S_POLYGON_OFFSET_OFFSET, 'polygonOffset', [0, 0]);

  // Sample coverage
  stateFlag(S_SAMPLE_ALPHA, GL_SAMPLE_ALPHA_TO_COVERAGE);
  stateFlag(S_SAMPLE_ENABLE, GL_SAMPLE_COVERAGE);
  stateVariable(S_SAMPLE_COVERAGE, 'sampleCoverage', [1, false]);

  // Stencil
  stateFlag(S_STENCIL_ENABLE, GL_STENCIL_TEST);
  stateVariable(S_STENCIL_MASK, 'stencilMask', -1);
  stateVariable(S_STENCIL_FUNC, 'stencilFunc', [GL_ALWAYS, 0, -1]);
  stateVariable(S_STENCIL_OPFRONT, 'stencilOpSeparate',
    [GL_FRONT, GL_KEEP, GL_KEEP, GL_KEEP]);
  stateVariable(S_STENCIL_OPBACK, 'stencilOpSeparate',
    [GL_BACK, GL_KEEP, GL_KEEP, GL_KEEP]);

  // Scissor
  stateFlag(S_SCISSOR_ENABLE, GL_SCISSOR_TEST);
  stateVariable(S_SCISSOR_BOX, 'scissor',
    [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);

  // Viewport
  stateVariable(S_VIEWPORT, S_VIEWPORT,
    [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);

  // ===================================================
  // ===================================================
  // ENVIRONMENT
  // ===================================================
  // ===================================================
  var sharedState = {
    gl: gl,
    context: contextState,
    strings: stringStore,
    next: nextState,
    current: currentState,
    draw: drawState,
    elements: elementState,
    buffer: bufferState,
    shader: shaderState,
    attributes: attributeState.state,
    uniforms: uniformState,
    framebuffer: framebufferState,
    extensions: extensions,

    timer: timer,
    isBufferArgs: isBufferArgs
  };

  var sharedConstants = {
    primTypes: primTypes,
    compareFuncs: compareFuncs,
    blendFuncs: blendFuncs,
    blendEquations: blendEquations,
    stencilOps: stencilOps,
    glTypes: glTypes,
    orientationType: orientationType
  };

  check$1.optional(function () {
    sharedState.isArrayLike = isArrayLike;
  });

  if (extDrawBuffers) {
    sharedConstants.backBuffer = [GL_BACK];
    sharedConstants.drawBuffer = loop(limits.maxDrawbuffers, function (i) {
      if (i === 0) {
        return [0]
      }
      return loop(i, function (j) {
        return GL_COLOR_ATTACHMENT0$2 + j
      })
    });
  }

  var drawCallCounter = 0;
  function createREGLEnvironment () {
    var env = createEnvironment();
    var link = env.link;
    var global = env.global;
    env.id = drawCallCounter++;

    env.batchId = '0';

    // link shared state
    var SHARED = link(sharedState);
    var shared = env.shared = {
      props: 'a0'
    };
    Object.keys(sharedState).forEach(function (prop) {
      shared[prop] = global.def(SHARED, '.', prop);
    });

    // Inject runtime assertion stuff for debug builds
    check$1.optional(function () {
      env.CHECK = link(check$1);
      env.commandStr = check$1.guessCommand();
      env.command = link(env.commandStr);
      env.assert = function (block, pred, message) {
        block(
          'if(!(', pred, '))',
          this.CHECK, '.commandRaise(', link(message), ',', this.command, ');');
      };

      sharedConstants.invalidBlendCombinations = invalidBlendCombinations;
    });

    // Copy GL state variables over
    var nextVars = env.next = {};
    var currentVars = env.current = {};
    Object.keys(GL_VARIABLES).forEach(function (variable) {
      if (Array.isArray(currentState[variable])) {
        nextVars[variable] = global.def(shared.next, '.', variable);
        currentVars[variable] = global.def(shared.current, '.', variable);
      }
    });

    // Initialize shared constants
    var constants = env.constants = {};
    Object.keys(sharedConstants).forEach(function (name) {
      constants[name] = global.def(JSON.stringify(sharedConstants[name]));
    });

    // Helper function for calling a block
    env.invoke = function (block, x) {
      switch (x.type) {
        case DYN_FUNC$1:
          var argList = [
            'this',
            shared.context,
            shared.props,
            env.batchId
          ];
          return block.def(
            link(x.data), '.call(',
              argList.slice(0, Math.max(x.data.length + 1, 4)),
             ')')
        case DYN_PROP$1:
          return block.def(shared.props, x.data)
        case DYN_CONTEXT$1:
          return block.def(shared.context, x.data)
        case DYN_STATE$1:
          return block.def('this', x.data)
        case DYN_THUNK:
          x.data.append(env, block);
          return x.data.ref
      }
    };

    env.attribCache = {};

    var scopeAttribs = {};
    env.scopeAttrib = function (name) {
      var id = stringStore.id(name);
      if (id in scopeAttribs) {
        return scopeAttribs[id]
      }
      var binding = attributeState.scope[id];
      if (!binding) {
        binding = attributeState.scope[id] = new AttributeRecord();
      }
      var result = scopeAttribs[id] = link(binding);
      return result
    };

    return env
  }

  // ===================================================
  // ===================================================
  // PARSING
  // ===================================================
  // ===================================================
  function parseProfile (options) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    var profileEnable;
    if (S_PROFILE in staticOptions) {
      var value = !!staticOptions[S_PROFILE];
      profileEnable = createStaticDecl(function (env, scope) {
        return value
      });
      profileEnable.enable = value;
    } else if (S_PROFILE in dynamicOptions) {
      var dyn = dynamicOptions[S_PROFILE];
      profileEnable = createDynamicDecl(dyn, function (env, scope) {
        return env.invoke(scope, dyn)
      });
    }

    return profileEnable
  }

  function parseFramebuffer (options, env) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    if (S_FRAMEBUFFER in staticOptions) {
      var framebuffer = staticOptions[S_FRAMEBUFFER];
      if (framebuffer) {
        framebuffer = framebufferState.getFramebuffer(framebuffer);
        check$1.command(framebuffer, 'invalid framebuffer object');
        return createStaticDecl(function (env, block) {
          var FRAMEBUFFER = env.link(framebuffer);
          var shared = env.shared;
          block.set(
            shared.framebuffer,
            '.next',
            FRAMEBUFFER);
          var CONTEXT = shared.context;
          block.set(
            CONTEXT,
            '.' + S_FRAMEBUFFER_WIDTH,
            FRAMEBUFFER + '.width');
          block.set(
            CONTEXT,
            '.' + S_FRAMEBUFFER_HEIGHT,
            FRAMEBUFFER + '.height');
          return FRAMEBUFFER
        })
      } else {
        return createStaticDecl(function (env, scope) {
          var shared = env.shared;
          scope.set(
            shared.framebuffer,
            '.next',
            'null');
          var CONTEXT = shared.context;
          scope.set(
            CONTEXT,
            '.' + S_FRAMEBUFFER_WIDTH,
            CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
          scope.set(
            CONTEXT,
            '.' + S_FRAMEBUFFER_HEIGHT,
            CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
          return 'null'
        })
      }
    } else if (S_FRAMEBUFFER in dynamicOptions) {
      var dyn = dynamicOptions[S_FRAMEBUFFER];
      return createDynamicDecl(dyn, function (env, scope) {
        var FRAMEBUFFER_FUNC = env.invoke(scope, dyn);
        var shared = env.shared;
        var FRAMEBUFFER_STATE = shared.framebuffer;
        var FRAMEBUFFER = scope.def(
          FRAMEBUFFER_STATE, '.getFramebuffer(', FRAMEBUFFER_FUNC, ')');

        check$1.optional(function () {
          env.assert(scope,
            '!' + FRAMEBUFFER_FUNC + '||' + FRAMEBUFFER,
            'invalid framebuffer object');
        });

        scope.set(
          FRAMEBUFFER_STATE,
          '.next',
          FRAMEBUFFER);
        var CONTEXT = shared.context;
        scope.set(
          CONTEXT,
          '.' + S_FRAMEBUFFER_WIDTH,
          FRAMEBUFFER + '?' + FRAMEBUFFER + '.width:' +
          CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
        scope.set(
          CONTEXT,
          '.' + S_FRAMEBUFFER_HEIGHT,
          FRAMEBUFFER +
          '?' + FRAMEBUFFER + '.height:' +
          CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
        return FRAMEBUFFER
      })
    } else {
      return null
    }
  }

  function parseViewportScissor (options, framebuffer, env) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    function parseBox (param) {
      if (param in staticOptions) {
        var box = staticOptions[param];
        check$1.commandType(box, 'object', 'invalid ' + param, env.commandStr);

        var isStatic = true;
        var x = box.x | 0;
        var y = box.y | 0;
        var w, h;
        if ('width' in box) {
          w = box.width | 0;
          check$1.command(w >= 0, 'invalid ' + param, env.commandStr);
        } else {
          isStatic = false;
        }
        if ('height' in box) {
          h = box.height | 0;
          check$1.command(h >= 0, 'invalid ' + param, env.commandStr);
        } else {
          isStatic = false;
        }

        return new Declaration(
          !isStatic && framebuffer && framebuffer.thisDep,
          !isStatic && framebuffer && framebuffer.contextDep,
          !isStatic && framebuffer && framebuffer.propDep,
          function (env, scope) {
            var CONTEXT = env.shared.context;
            var BOX_W = w;
            if (!('width' in box)) {
              BOX_W = scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', x);
            }
            var BOX_H = h;
            if (!('height' in box)) {
              BOX_H = scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', y);
            }
            return [x, y, BOX_W, BOX_H]
          })
      } else if (param in dynamicOptions) {
        var dynBox = dynamicOptions[param];
        var result = createDynamicDecl(dynBox, function (env, scope) {
          var BOX = env.invoke(scope, dynBox);

          check$1.optional(function () {
            env.assert(scope,
              BOX + '&&typeof ' + BOX + '==="object"',
              'invalid ' + param);
          });

          var CONTEXT = env.shared.context;
          var BOX_X = scope.def(BOX, '.x|0');
          var BOX_Y = scope.def(BOX, '.y|0');
          var BOX_W = scope.def(
            '"width" in ', BOX, '?', BOX, '.width|0:',
            '(', CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', BOX_X, ')');
          var BOX_H = scope.def(
            '"height" in ', BOX, '?', BOX, '.height|0:',
            '(', CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', BOX_Y, ')');

          check$1.optional(function () {
            env.assert(scope,
              BOX_W + '>=0&&' +
              BOX_H + '>=0',
              'invalid ' + param);
          });

          return [BOX_X, BOX_Y, BOX_W, BOX_H]
        });
        if (framebuffer) {
          result.thisDep = result.thisDep || framebuffer.thisDep;
          result.contextDep = result.contextDep || framebuffer.contextDep;
          result.propDep = result.propDep || framebuffer.propDep;
        }
        return result
      } else if (framebuffer) {
        return new Declaration(
          framebuffer.thisDep,
          framebuffer.contextDep,
          framebuffer.propDep,
          function (env, scope) {
            var CONTEXT = env.shared.context;
            return [
              0, 0,
              scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH),
              scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT)]
          })
      } else {
        return null
      }
    }

    var viewport = parseBox(S_VIEWPORT);

    if (viewport) {
      var prevViewport = viewport;
      viewport = new Declaration(
        viewport.thisDep,
        viewport.contextDep,
        viewport.propDep,
        function (env, scope) {
          var VIEWPORT = prevViewport.append(env, scope);
          var CONTEXT = env.shared.context;
          scope.set(
            CONTEXT,
            '.' + S_VIEWPORT_WIDTH,
            VIEWPORT[2]);
          scope.set(
            CONTEXT,
            '.' + S_VIEWPORT_HEIGHT,
            VIEWPORT[3]);
          return VIEWPORT
        });
    }

    return {
      viewport: viewport,
      scissor_box: parseBox(S_SCISSOR_BOX)
    }
  }

  function parseProgram (options) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    function parseShader (name) {
      if (name in staticOptions) {
        var id = stringStore.id(staticOptions[name]);
        check$1.optional(function () {
          shaderState.shader(shaderType[name], id, check$1.guessCommand());
        });
        var result = createStaticDecl(function () {
          return id
        });
        result.id = id;
        return result
      } else if (name in dynamicOptions) {
        var dyn = dynamicOptions[name];
        return createDynamicDecl(dyn, function (env, scope) {
          var str = env.invoke(scope, dyn);
          var id = scope.def(env.shared.strings, '.id(', str, ')');
          check$1.optional(function () {
            scope(
              env.shared.shader, '.shader(',
              shaderType[name], ',',
              id, ',',
              env.command, ');');
          });
          return id
        })
      }
      return null
    }

    var frag = parseShader(S_FRAG);
    var vert = parseShader(S_VERT);

    var program = null;
    var progVar;
    if (isStatic(frag) && isStatic(vert)) {
      program = shaderState.program(vert.id, frag.id);
      progVar = createStaticDecl(function (env, scope) {
        return env.link(program)
      });
    } else {
      progVar = new Declaration(
        (frag && frag.thisDep) || (vert && vert.thisDep),
        (frag && frag.contextDep) || (vert && vert.contextDep),
        (frag && frag.propDep) || (vert && vert.propDep),
        function (env, scope) {
          var SHADER_STATE = env.shared.shader;
          var fragId;
          if (frag) {
            fragId = frag.append(env, scope);
          } else {
            fragId = scope.def(SHADER_STATE, '.', S_FRAG);
          }
          var vertId;
          if (vert) {
            vertId = vert.append(env, scope);
          } else {
            vertId = scope.def(SHADER_STATE, '.', S_VERT);
          }
          var progDef = SHADER_STATE + '.program(' + vertId + ',' + fragId;
          check$1.optional(function () {
            progDef += ',' + env.command;
          });
          return scope.def(progDef + ')')
        });
    }

    return {
      frag: frag,
      vert: vert,
      progVar: progVar,
      program: program
    }
  }

  function parseDraw (options, env) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    function parseElements () {
      if (S_ELEMENTS in staticOptions) {
        var elements = staticOptions[S_ELEMENTS];
        if (isBufferArgs(elements)) {
          elements = elementState.getElements(elementState.create(elements, true));
        } else if (elements) {
          elements = elementState.getElements(elements);
          check$1.command(elements, 'invalid elements', env.commandStr);
        }
        var result = createStaticDecl(function (env, scope) {
          if (elements) {
            var result = env.link(elements);
            env.ELEMENTS = result;
            return result
          }
          env.ELEMENTS = null;
          return null
        });
        result.value = elements;
        return result
      } else if (S_ELEMENTS in dynamicOptions) {
        var dyn = dynamicOptions[S_ELEMENTS];
        return createDynamicDecl(dyn, function (env, scope) {
          var shared = env.shared;

          var IS_BUFFER_ARGS = shared.isBufferArgs;
          var ELEMENT_STATE = shared.elements;

          var elementDefn = env.invoke(scope, dyn);
          var elements = scope.def('null');
          var elementStream = scope.def(IS_BUFFER_ARGS, '(', elementDefn, ')');

          var ifte = env.cond(elementStream)
            .then(elements, '=', ELEMENT_STATE, '.createStream(', elementDefn, ');')
            .else(elements, '=', ELEMENT_STATE, '.getElements(', elementDefn, ');');

          check$1.optional(function () {
            env.assert(ifte.else,
              '!' + elementDefn + '||' + elements,
              'invalid elements');
          });

          scope.entry(ifte);
          scope.exit(
            env.cond(elementStream)
              .then(ELEMENT_STATE, '.destroyStream(', elements, ');'));

          env.ELEMENTS = elements;

          return elements
        })
      }

      return null
    }

    var elements = parseElements();

    function parsePrimitive () {
      if (S_PRIMITIVE in staticOptions) {
        var primitive = staticOptions[S_PRIMITIVE];
        check$1.commandParameter(primitive, primTypes, 'invalid primitve', env.commandStr);
        return createStaticDecl(function (env, scope) {
          return primTypes[primitive]
        })
      } else if (S_PRIMITIVE in dynamicOptions) {
        var dynPrimitive = dynamicOptions[S_PRIMITIVE];
        return createDynamicDecl(dynPrimitive, function (env, scope) {
          var PRIM_TYPES = env.constants.primTypes;
          var prim = env.invoke(scope, dynPrimitive);
          check$1.optional(function () {
            env.assert(scope,
              prim + ' in ' + PRIM_TYPES,
              'invalid primitive, must be one of ' + Object.keys(primTypes));
          });
          return scope.def(PRIM_TYPES, '[', prim, ']')
        })
      } else if (elements) {
        if (isStatic(elements)) {
          if (elements.value) {
            return createStaticDecl(function (env, scope) {
              return scope.def(env.ELEMENTS, '.primType')
            })
          } else {
            return createStaticDecl(function () {
              return GL_TRIANGLES$1
            })
          }
        } else {
          return new Declaration(
            elements.thisDep,
            elements.contextDep,
            elements.propDep,
            function (env, scope) {
              var elements = env.ELEMENTS;
              return scope.def(elements, '?', elements, '.primType:', GL_TRIANGLES$1)
            })
        }
      }
      return null
    }

    function parseParam (param, isOffset) {
      if (param in staticOptions) {
        var value = staticOptions[param] | 0;
        check$1.command(!isOffset || value >= 0, 'invalid ' + param, env.commandStr);
        return createStaticDecl(function (env, scope) {
          if (isOffset) {
            env.OFFSET = value;
          }
          return value
        })
      } else if (param in dynamicOptions) {
        var dynValue = dynamicOptions[param];
        return createDynamicDecl(dynValue, function (env, scope) {
          var result = env.invoke(scope, dynValue);
          if (isOffset) {
            env.OFFSET = result;
            check$1.optional(function () {
              env.assert(scope,
                result + '>=0',
                'invalid ' + param);
            });
          }
          return result
        })
      } else if (isOffset && elements) {
        return createStaticDecl(function (env, scope) {
          env.OFFSET = '0';
          return 0
        })
      }
      return null
    }

    var OFFSET = parseParam(S_OFFSET, true);

    function parseVertCount () {
      if (S_COUNT in staticOptions) {
        var count = staticOptions[S_COUNT] | 0;
        check$1.command(
          typeof count === 'number' && count >= 0, 'invalid vertex count', env.commandStr);
        return createStaticDecl(function () {
          return count
        })
      } else if (S_COUNT in dynamicOptions) {
        var dynCount = dynamicOptions[S_COUNT];
        return createDynamicDecl(dynCount, function (env, scope) {
          var result = env.invoke(scope, dynCount);
          check$1.optional(function () {
            env.assert(scope,
              'typeof ' + result + '==="number"&&' +
              result + '>=0&&' +
              result + '===(' + result + '|0)',
              'invalid vertex count');
          });
          return result
        })
      } else if (elements) {
        if (isStatic(elements)) {
          if (elements) {
            if (OFFSET) {
              return new Declaration(
                OFFSET.thisDep,
                OFFSET.contextDep,
                OFFSET.propDep,
                function (env, scope) {
                  var result = scope.def(
                    env.ELEMENTS, '.vertCount-', env.OFFSET);

                  check$1.optional(function () {
                    env.assert(scope,
                      result + '>=0',
                      'invalid vertex offset/element buffer too small');
                  });

                  return result
                })
            } else {
              return createStaticDecl(function (env, scope) {
                return scope.def(env.ELEMENTS, '.vertCount')
              })
            }
          } else {
            var result = createStaticDecl(function () {
              return -1
            });
            check$1.optional(function () {
              result.MISSING = true;
            });
            return result
          }
        } else {
          var variable = new Declaration(
            elements.thisDep || OFFSET.thisDep,
            elements.contextDep || OFFSET.contextDep,
            elements.propDep || OFFSET.propDep,
            function (env, scope) {
              var elements = env.ELEMENTS;
              if (env.OFFSET) {
                return scope.def(elements, '?', elements, '.vertCount-',
                  env.OFFSET, ':-1')
              }
              return scope.def(elements, '?', elements, '.vertCount:-1')
            });
          check$1.optional(function () {
            variable.DYNAMIC = true;
          });
          return variable
        }
      }
      return null
    }

    return {
      elements: elements,
      primitive: parsePrimitive(),
      count: parseVertCount(),
      instances: parseParam(S_INSTANCES, false),
      offset: OFFSET
    }
  }

  function parseGLState (options, env) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    var STATE = {};

    GL_STATE_NAMES.forEach(function (prop) {
      var param = propName(prop);

      function parseParam (parseStatic, parseDynamic) {
        if (prop in staticOptions) {
          var value = parseStatic(staticOptions[prop]);
          STATE[param] = createStaticDecl(function () {
            return value
          });
        } else if (prop in dynamicOptions) {
          var dyn = dynamicOptions[prop];
          STATE[param] = createDynamicDecl(dyn, function (env, scope) {
            return parseDynamic(env, scope, env.invoke(scope, dyn))
          });
        }
      }

      switch (prop) {
        case S_CULL_ENABLE:
        case S_BLEND_ENABLE:
        case S_DITHER:
        case S_STENCIL_ENABLE:
        case S_DEPTH_ENABLE:
        case S_SCISSOR_ENABLE:
        case S_POLYGON_OFFSET_ENABLE:
        case S_SAMPLE_ALPHA:
        case S_SAMPLE_ENABLE:
        case S_DEPTH_MASK:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'boolean', prop, env.commandStr);
              return value
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  'typeof ' + value + '==="boolean"',
                  'invalid flag ' + prop, env.commandStr);
              });
              return value
            })

        case S_DEPTH_FUNC:
          return parseParam(
            function (value) {
              check$1.commandParameter(value, compareFuncs, 'invalid ' + prop, env.commandStr);
              return compareFuncs[value]
            },
            function (env, scope, value) {
              var COMPARE_FUNCS = env.constants.compareFuncs;
              check$1.optional(function () {
                env.assert(scope,
                  value + ' in ' + COMPARE_FUNCS,
                  'invalid ' + prop + ', must be one of ' + Object.keys(compareFuncs));
              });
              return scope.def(COMPARE_FUNCS, '[', value, ']')
            })

        case S_DEPTH_RANGE:
          return parseParam(
            function (value) {
              check$1.command(
                isArrayLike(value) &&
                value.length === 2 &&
                typeof value[0] === 'number' &&
                typeof value[1] === 'number' &&
                value[0] <= value[1],
                'depth range is 2d array',
                env.commandStr);
              return value
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  env.shared.isArrayLike + '(' + value + ')&&' +
                  value + '.length===2&&' +
                  'typeof ' + value + '[0]==="number"&&' +
                  'typeof ' + value + '[1]==="number"&&' +
                  value + '[0]<=' + value + '[1]',
                  'depth range must be a 2d array');
              });

              var Z_NEAR = scope.def('+', value, '[0]');
              var Z_FAR = scope.def('+', value, '[1]');
              return [Z_NEAR, Z_FAR]
            })

        case S_BLEND_FUNC:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'object', 'blend.func', env.commandStr);
              var srcRGB = ('srcRGB' in value ? value.srcRGB : value.src);
              var srcAlpha = ('srcAlpha' in value ? value.srcAlpha : value.src);
              var dstRGB = ('dstRGB' in value ? value.dstRGB : value.dst);
              var dstAlpha = ('dstAlpha' in value ? value.dstAlpha : value.dst);
              check$1.commandParameter(srcRGB, blendFuncs, param + '.srcRGB', env.commandStr);
              check$1.commandParameter(srcAlpha, blendFuncs, param + '.srcAlpha', env.commandStr);
              check$1.commandParameter(dstRGB, blendFuncs, param + '.dstRGB', env.commandStr);
              check$1.commandParameter(dstAlpha, blendFuncs, param + '.dstAlpha', env.commandStr);

              check$1.command(
                (invalidBlendCombinations.indexOf(srcRGB + ', ' + dstRGB) === -1),
                'unallowed blending combination (srcRGB, dstRGB) = (' + srcRGB + ', ' + dstRGB + ')', env.commandStr);

              return [
                blendFuncs[srcRGB],
                blendFuncs[dstRGB],
                blendFuncs[srcAlpha],
                blendFuncs[dstAlpha]
              ]
            },
            function (env, scope, value) {
              var BLEND_FUNCS = env.constants.blendFuncs;

              check$1.optional(function () {
                env.assert(scope,
                  value + '&&typeof ' + value + '==="object"',
                  'invalid blend func, must be an object');
              });

              function read (prefix, suffix) {
                var func = scope.def(
                  '"', prefix, suffix, '" in ', value,
                  '?', value, '.', prefix, suffix,
                  ':', value, '.', prefix);

                check$1.optional(function () {
                  env.assert(scope,
                    func + ' in ' + BLEND_FUNCS,
                    'invalid ' + prop + '.' + prefix + suffix + ', must be one of ' + Object.keys(blendFuncs));
                });

                return func
              }

              var srcRGB = read('src', 'RGB');
              var dstRGB = read('dst', 'RGB');

              check$1.optional(function () {
                var INVALID_BLEND_COMBINATIONS = env.constants.invalidBlendCombinations;

                env.assert(scope,
                           INVALID_BLEND_COMBINATIONS +
                           '.indexOf(' + srcRGB + '+", "+' + dstRGB + ') === -1 ',
                           'unallowed blending combination for (srcRGB, dstRGB)'
                          );
              });

              var SRC_RGB = scope.def(BLEND_FUNCS, '[', srcRGB, ']');
              var SRC_ALPHA = scope.def(BLEND_FUNCS, '[', read('src', 'Alpha'), ']');
              var DST_RGB = scope.def(BLEND_FUNCS, '[', dstRGB, ']');
              var DST_ALPHA = scope.def(BLEND_FUNCS, '[', read('dst', 'Alpha'), ']');

              return [SRC_RGB, DST_RGB, SRC_ALPHA, DST_ALPHA]
            })

        case S_BLEND_EQUATION:
          return parseParam(
            function (value) {
              if (typeof value === 'string') {
                check$1.commandParameter(value, blendEquations, 'invalid ' + prop, env.commandStr);
                return [
                  blendEquations[value],
                  blendEquations[value]
                ]
              } else if (typeof value === 'object') {
                check$1.commandParameter(
                  value.rgb, blendEquations, prop + '.rgb', env.commandStr);
                check$1.commandParameter(
                  value.alpha, blendEquations, prop + '.alpha', env.commandStr);
                return [
                  blendEquations[value.rgb],
                  blendEquations[value.alpha]
                ]
              } else {
                check$1.commandRaise('invalid blend.equation', env.commandStr);
              }
            },
            function (env, scope, value) {
              var BLEND_EQUATIONS = env.constants.blendEquations;

              var RGB = scope.def();
              var ALPHA = scope.def();

              var ifte = env.cond('typeof ', value, '==="string"');

              check$1.optional(function () {
                function checkProp (block, name, value) {
                  env.assert(block,
                    value + ' in ' + BLEND_EQUATIONS,
                    'invalid ' + name + ', must be one of ' + Object.keys(blendEquations));
                }
                checkProp(ifte.then, prop, value);

                env.assert(ifte.else,
                  value + '&&typeof ' + value + '==="object"',
                  'invalid ' + prop);
                checkProp(ifte.else, prop + '.rgb', value + '.rgb');
                checkProp(ifte.else, prop + '.alpha', value + '.alpha');
              });

              ifte.then(
                RGB, '=', ALPHA, '=', BLEND_EQUATIONS, '[', value, '];');
              ifte.else(
                RGB, '=', BLEND_EQUATIONS, '[', value, '.rgb];',
                ALPHA, '=', BLEND_EQUATIONS, '[', value, '.alpha];');

              scope(ifte);

              return [RGB, ALPHA]
            })

        case S_BLEND_COLOR:
          return parseParam(
            function (value) {
              check$1.command(
                isArrayLike(value) &&
                value.length === 4,
                'blend.color must be a 4d array', env.commandStr);
              return loop(4, function (i) {
                return +value[i]
              })
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  env.shared.isArrayLike + '(' + value + ')&&' +
                  value + '.length===4',
                  'blend.color must be a 4d array');
              });
              return loop(4, function (i) {
                return scope.def('+', value, '[', i, ']')
              })
            })

        case S_STENCIL_MASK:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'number', param, env.commandStr);
              return value | 0
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  'typeof ' + value + '==="number"',
                  'invalid stencil.mask');
              });
              return scope.def(value, '|0')
            })

        case S_STENCIL_FUNC:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'object', param, env.commandStr);
              var cmp = value.cmp || 'keep';
              var ref = value.ref || 0;
              var mask = 'mask' in value ? value.mask : -1;
              check$1.commandParameter(cmp, compareFuncs, prop + '.cmp', env.commandStr);
              check$1.commandType(ref, 'number', prop + '.ref', env.commandStr);
              check$1.commandType(mask, 'number', prop + '.mask', env.commandStr);
              return [
                compareFuncs[cmp],
                ref,
                mask
              ]
            },
            function (env, scope, value) {
              var COMPARE_FUNCS = env.constants.compareFuncs;
              check$1.optional(function () {
                function assert () {
                  env.assert(scope,
                    Array.prototype.join.call(arguments, ''),
                    'invalid stencil.func');
                }
                assert(value + '&&typeof ', value, '==="object"');
                assert('!("cmp" in ', value, ')||(',
                  value, '.cmp in ', COMPARE_FUNCS, ')');
              });
              var cmp = scope.def(
                '"cmp" in ', value,
                '?', COMPARE_FUNCS, '[', value, '.cmp]',
                ':', GL_KEEP);
              var ref = scope.def(value, '.ref|0');
              var mask = scope.def(
                '"mask" in ', value,
                '?', value, '.mask|0:-1');
              return [cmp, ref, mask]
            })

        case S_STENCIL_OPFRONT:
        case S_STENCIL_OPBACK:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'object', param, env.commandStr);
              var fail = value.fail || 'keep';
              var zfail = value.zfail || 'keep';
              var zpass = value.zpass || 'keep';
              check$1.commandParameter(fail, stencilOps, prop + '.fail', env.commandStr);
              check$1.commandParameter(zfail, stencilOps, prop + '.zfail', env.commandStr);
              check$1.commandParameter(zpass, stencilOps, prop + '.zpass', env.commandStr);
              return [
                prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                stencilOps[fail],
                stencilOps[zfail],
                stencilOps[zpass]
              ]
            },
            function (env, scope, value) {
              var STENCIL_OPS = env.constants.stencilOps;

              check$1.optional(function () {
                env.assert(scope,
                  value + '&&typeof ' + value + '==="object"',
                  'invalid ' + prop);
              });

              function read (name) {
                check$1.optional(function () {
                  env.assert(scope,
                    '!("' + name + '" in ' + value + ')||' +
                    '(' + value + '.' + name + ' in ' + STENCIL_OPS + ')',
                    'invalid ' + prop + '.' + name + ', must be one of ' + Object.keys(stencilOps));
                });

                return scope.def(
                  '"', name, '" in ', value,
                  '?', STENCIL_OPS, '[', value, '.', name, ']:',
                  GL_KEEP)
              }

              return [
                prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                read('fail'),
                read('zfail'),
                read('zpass')
              ]
            })

        case S_POLYGON_OFFSET_OFFSET:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'object', param, env.commandStr);
              var factor = value.factor | 0;
              var units = value.units | 0;
              check$1.commandType(factor, 'number', param + '.factor', env.commandStr);
              check$1.commandType(units, 'number', param + '.units', env.commandStr);
              return [factor, units]
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  value + '&&typeof ' + value + '==="object"',
                  'invalid ' + prop);
              });

              var FACTOR = scope.def(value, '.factor|0');
              var UNITS = scope.def(value, '.units|0');

              return [FACTOR, UNITS]
            })

        case S_CULL_FACE:
          return parseParam(
            function (value) {
              var face = 0;
              if (value === 'front') {
                face = GL_FRONT;
              } else if (value === 'back') {
                face = GL_BACK;
              }
              check$1.command(!!face, param, env.commandStr);
              return face
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  value + '==="front"||' +
                  value + '==="back"',
                  'invalid cull.face');
              });
              return scope.def(value, '==="front"?', GL_FRONT, ':', GL_BACK)
            })

        case S_LINE_WIDTH:
          return parseParam(
            function (value) {
              check$1.command(
                typeof value === 'number' &&
                value >= limits.lineWidthDims[0] &&
                value <= limits.lineWidthDims[1],
                'invalid line width, must be a positive number between ' +
                limits.lineWidthDims[0] + ' and ' + limits.lineWidthDims[1], env.commandStr);
              return value
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  'typeof ' + value + '==="number"&&' +
                  value + '>=' + limits.lineWidthDims[0] + '&&' +
                  value + '<=' + limits.lineWidthDims[1],
                  'invalid line width');
              });

              return value
            })

        case S_FRONT_FACE:
          return parseParam(
            function (value) {
              check$1.commandParameter(value, orientationType, param, env.commandStr);
              return orientationType[value]
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  value + '==="cw"||' +
                  value + '==="ccw"',
                  'invalid frontFace, must be one of cw,ccw');
              });
              return scope.def(value + '==="cw"?' + GL_CW + ':' + GL_CCW)
            })

        case S_COLOR_MASK:
          return parseParam(
            function (value) {
              check$1.command(
                isArrayLike(value) && value.length === 4,
                'color.mask must be length 4 array', env.commandStr);
              return value.map(function (v) { return !!v })
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  env.shared.isArrayLike + '(' + value + ')&&' +
                  value + '.length===4',
                  'invalid color.mask');
              });
              return loop(4, function (i) {
                return '!!' + value + '[' + i + ']'
              })
            })

        case S_SAMPLE_COVERAGE:
          return parseParam(
            function (value) {
              check$1.command(typeof value === 'object' && value, param, env.commandStr);
              var sampleValue = 'value' in value ? value.value : 1;
              var sampleInvert = !!value.invert;
              check$1.command(
                typeof sampleValue === 'number' &&
                sampleValue >= 0 && sampleValue <= 1,
                'sample.coverage.value must be a number between 0 and 1', env.commandStr);
              return [sampleValue, sampleInvert]
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  value + '&&typeof ' + value + '==="object"',
                  'invalid sample.coverage');
              });
              var VALUE = scope.def(
                '"value" in ', value, '?+', value, '.value:1');
              var INVERT = scope.def('!!', value, '.invert');
              return [VALUE, INVERT]
            })
      }
    });

    return STATE
  }

  function parseUniforms (uniforms, env) {
    var staticUniforms = uniforms.static;
    var dynamicUniforms = uniforms.dynamic;

    var UNIFORMS = {};

    Object.keys(staticUniforms).forEach(function (name) {
      var value = staticUniforms[name];
      var result;
      if (typeof value === 'number' ||
          typeof value === 'boolean') {
        result = createStaticDecl(function () {
          return value
        });
      } else if (typeof value === 'function') {
        var reglType = value._reglType;
        if (reglType === 'texture2d' ||
            reglType === 'textureCube') {
          result = createStaticDecl(function (env) {
            return env.link(value)
          });
        } else if (reglType === 'framebuffer' ||
                   reglType === 'framebufferCube') {
          check$1.command(value.color.length > 0,
            'missing color attachment for framebuffer sent to uniform "' + name + '"', env.commandStr);
          result = createStaticDecl(function (env) {
            return env.link(value.color[0])
          });
        } else {
          check$1.commandRaise('invalid data for uniform "' + name + '"', env.commandStr);
        }
      } else if (isArrayLike(value)) {
        result = createStaticDecl(function (env) {
          var ITEM = env.global.def('[',
            loop(value.length, function (i) {
              check$1.command(
                typeof value[i] === 'number' ||
                typeof value[i] === 'boolean',
                'invalid uniform ' + name, env.commandStr);
              return value[i]
            }), ']');
          return ITEM
        });
      } else {
        check$1.commandRaise('invalid or missing data for uniform "' + name + '"', env.commandStr);
      }
      result.value = value;
      UNIFORMS[name] = result;
    });

    Object.keys(dynamicUniforms).forEach(function (key) {
      var dyn = dynamicUniforms[key];
      UNIFORMS[key] = createDynamicDecl(dyn, function (env, scope) {
        return env.invoke(scope, dyn)
      });
    });

    return UNIFORMS
  }

  function parseAttributes (attributes, env) {
    var staticAttributes = attributes.static;
    var dynamicAttributes = attributes.dynamic;

    var attributeDefs = {};

    Object.keys(staticAttributes).forEach(function (attribute) {
      var value = staticAttributes[attribute];
      var id = stringStore.id(attribute);

      var record = new AttributeRecord();
      if (isBufferArgs(value)) {
        record.state = ATTRIB_STATE_POINTER;
        record.buffer = bufferState.getBuffer(
          bufferState.create(value, GL_ARRAY_BUFFER$1, false, true));
        record.type = 0;
      } else {
        var buffer = bufferState.getBuffer(value);
        if (buffer) {
          record.state = ATTRIB_STATE_POINTER;
          record.buffer = buffer;
          record.type = 0;
        } else {
          check$1.command(typeof value === 'object' && value,
            'invalid data for attribute ' + attribute, env.commandStr);
          if ('constant' in value) {
            var constant = value.constant;
            record.buffer = 'null';
            record.state = ATTRIB_STATE_CONSTANT;
            if (typeof constant === 'number') {
              record.x = constant;
            } else {
              check$1.command(
                isArrayLike(constant) &&
                constant.length > 0 &&
                constant.length <= 4,
                'invalid constant for attribute ' + attribute, env.commandStr);
              CUTE_COMPONENTS.forEach(function (c, i) {
                if (i < constant.length) {
                  record[c] = constant[i];
                }
              });
            }
          } else {
            if (isBufferArgs(value.buffer)) {
              buffer = bufferState.getBuffer(
                bufferState.create(value.buffer, GL_ARRAY_BUFFER$1, false, true));
            } else {
              buffer = bufferState.getBuffer(value.buffer);
            }
            check$1.command(!!buffer, 'missing buffer for attribute "' + attribute + '"', env.commandStr);

            var offset = value.offset | 0;
            check$1.command(offset >= 0,
              'invalid offset for attribute "' + attribute + '"', env.commandStr);

            var stride = value.stride | 0;
            check$1.command(stride >= 0 && stride < 256,
              'invalid stride for attribute "' + attribute + '", must be integer betweeen [0, 255]', env.commandStr);

            var size = value.size | 0;
            check$1.command(!('size' in value) || (size > 0 && size <= 4),
              'invalid size for attribute "' + attribute + '", must be 1,2,3,4', env.commandStr);

            var normalized = !!value.normalized;

            var type = 0;
            if ('type' in value) {
              check$1.commandParameter(
                value.type, glTypes,
                'invalid type for attribute ' + attribute, env.commandStr);
              type = glTypes[value.type];
            }

            var divisor = value.divisor | 0;
            if ('divisor' in value) {
              check$1.command(divisor === 0 || extInstancing,
                'cannot specify divisor for attribute "' + attribute + '", instancing not supported', env.commandStr);
              check$1.command(divisor >= 0,
                'invalid divisor for attribute "' + attribute + '"', env.commandStr);
            }

            check$1.optional(function () {
              var command = env.commandStr;

              var VALID_KEYS = [
                'buffer',
                'offset',
                'divisor',
                'normalized',
                'type',
                'size',
                'stride'
              ];

              Object.keys(value).forEach(function (prop) {
                check$1.command(
                  VALID_KEYS.indexOf(prop) >= 0,
                  'unknown parameter "' + prop + '" for attribute pointer "' + attribute + '" (valid parameters are ' + VALID_KEYS + ')',
                  command);
              });
            });

            record.buffer = buffer;
            record.state = ATTRIB_STATE_POINTER;
            record.size = size;
            record.normalized = normalized;
            record.type = type || buffer.dtype;
            record.offset = offset;
            record.stride = stride;
            record.divisor = divisor;
          }
        }
      }

      attributeDefs[attribute] = createStaticDecl(function (env, scope) {
        var cache = env.attribCache;
        if (id in cache) {
          return cache[id]
        }
        var result = {
          isStream: false
        };
        Object.keys(record).forEach(function (key) {
          result[key] = record[key];
        });
        if (record.buffer) {
          result.buffer = env.link(record.buffer);
          result.type = result.type || (result.buffer + '.dtype');
        }
        cache[id] = result;
        return result
      });
    });

    Object.keys(dynamicAttributes).forEach(function (attribute) {
      var dyn = dynamicAttributes[attribute];

      function appendAttributeCode (env, block) {
        var VALUE = env.invoke(block, dyn);

        var shared = env.shared;

        var IS_BUFFER_ARGS = shared.isBufferArgs;
        var BUFFER_STATE = shared.buffer;

        // Perform validation on attribute
        check$1.optional(function () {
          env.assert(block,
            VALUE + '&&(typeof ' + VALUE + '==="object"||typeof ' +
            VALUE + '==="function")&&(' +
            IS_BUFFER_ARGS + '(' + VALUE + ')||' +
            BUFFER_STATE + '.getBuffer(' + VALUE + ')||' +
            BUFFER_STATE + '.getBuffer(' + VALUE + '.buffer)||' +
            IS_BUFFER_ARGS + '(' + VALUE + '.buffer)||' +
            '("constant" in ' + VALUE +
            '&&(typeof ' + VALUE + '.constant==="number"||' +
            shared.isArrayLike + '(' + VALUE + '.constant))))',
            'invalid dynamic attribute "' + attribute + '"');
        });

        // allocate names for result
        var result = {
          isStream: block.def(false)
        };
        var defaultRecord = new AttributeRecord();
        defaultRecord.state = ATTRIB_STATE_POINTER;
        Object.keys(defaultRecord).forEach(function (key) {
          result[key] = block.def('' + defaultRecord[key]);
        });

        var BUFFER = result.buffer;
        var TYPE = result.type;
        block(
          'if(', IS_BUFFER_ARGS, '(', VALUE, ')){',
          result.isStream, '=true;',
          BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$1, ',', VALUE, ');',
          TYPE, '=', BUFFER, '.dtype;',
          '}else{',
          BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, ');',
          'if(', BUFFER, '){',
          TYPE, '=', BUFFER, '.dtype;',
          '}else if("constant" in ', VALUE, '){',
          result.state, '=', ATTRIB_STATE_CONSTANT, ';',
          'if(typeof ' + VALUE + '.constant === "number"){',
          result[CUTE_COMPONENTS[0]], '=', VALUE, '.constant;',
          CUTE_COMPONENTS.slice(1).map(function (n) {
            return result[n]
          }).join('='), '=0;',
          '}else{',
          CUTE_COMPONENTS.map(function (name, i) {
            return (
              result[name] + '=' + VALUE + '.constant.length>' + i +
              '?' + VALUE + '.constant[' + i + ']:0;'
            )
          }).join(''),
          '}}else{',
          'if(', IS_BUFFER_ARGS, '(', VALUE, '.buffer)){',
          BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$1, ',', VALUE, '.buffer);',
          '}else{',
          BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, '.buffer);',
          '}',
          TYPE, '="type" in ', VALUE, '?',
          shared.glTypes, '[', VALUE, '.type]:', BUFFER, '.dtype;',
          result.normalized, '=!!', VALUE, '.normalized;');
        function emitReadRecord (name) {
          block(result[name], '=', VALUE, '.', name, '|0;');
        }
        emitReadRecord('size');
        emitReadRecord('offset');
        emitReadRecord('stride');
        emitReadRecord('divisor');

        block('}}');

        block.exit(
          'if(', result.isStream, '){',
          BUFFER_STATE, '.destroyStream(', BUFFER, ');',
          '}');

        return result
      }

      attributeDefs[attribute] = createDynamicDecl(dyn, appendAttributeCode);
    });

    return attributeDefs
  }

  function parseContext (context) {
    var staticContext = context.static;
    var dynamicContext = context.dynamic;
    var result = {};

    Object.keys(staticContext).forEach(function (name) {
      var value = staticContext[name];
      result[name] = createStaticDecl(function (env, scope) {
        if (typeof value === 'number' || typeof value === 'boolean') {
          return '' + value
        } else {
          return env.link(value)
        }
      });
    });

    Object.keys(dynamicContext).forEach(function (name) {
      var dyn = dynamicContext[name];
      result[name] = createDynamicDecl(dyn, function (env, scope) {
        return env.invoke(scope, dyn)
      });
    });

    return result
  }

  function parseArguments (options, attributes, uniforms, context, env) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    check$1.optional(function () {
      var KEY_NAMES = [
        S_FRAMEBUFFER,
        S_VERT,
        S_FRAG,
        S_ELEMENTS,
        S_PRIMITIVE,
        S_OFFSET,
        S_COUNT,
        S_INSTANCES,
        S_PROFILE
      ].concat(GL_STATE_NAMES);

      function checkKeys (dict) {
        Object.keys(dict).forEach(function (key) {
          check$1.command(
            KEY_NAMES.indexOf(key) >= 0,
            'unknown parameter "' + key + '"',
            env.commandStr);
        });
      }

      checkKeys(staticOptions);
      checkKeys(dynamicOptions);
    });

    var framebuffer = parseFramebuffer(options, env);
    var viewportAndScissor = parseViewportScissor(options, framebuffer, env);
    var draw = parseDraw(options, env);
    var state = parseGLState(options, env);
    var shader = parseProgram(options, env);

    function copyBox (name) {
      var defn = viewportAndScissor[name];
      if (defn) {
        state[name] = defn;
      }
    }
    copyBox(S_VIEWPORT);
    copyBox(propName(S_SCISSOR_BOX));

    var dirty = Object.keys(state).length > 0;

    var result = {
      framebuffer: framebuffer,
      draw: draw,
      shader: shader,
      state: state,
      dirty: dirty
    };

    result.profile = parseProfile(options, env);
    result.uniforms = parseUniforms(uniforms, env);
    result.attributes = parseAttributes(attributes, env);
    result.context = parseContext(context, env);
    return result
  }

  // ===================================================
  // ===================================================
  // COMMON UPDATE FUNCTIONS
  // ===================================================
  // ===================================================
  function emitContext (env, scope, context) {
    var shared = env.shared;
    var CONTEXT = shared.context;

    var contextEnter = env.scope();

    Object.keys(context).forEach(function (name) {
      scope.save(CONTEXT, '.' + name);
      var defn = context[name];
      contextEnter(CONTEXT, '.', name, '=', defn.append(env, scope), ';');
    });

    scope(contextEnter);
  }

  // ===================================================
  // ===================================================
  // COMMON DRAWING FUNCTIONS
  // ===================================================
  // ===================================================
  function emitPollFramebuffer (env, scope, framebuffer, skipCheck) {
    var shared = env.shared;

    var GL = shared.gl;
    var FRAMEBUFFER_STATE = shared.framebuffer;
    var EXT_DRAW_BUFFERS;
    if (extDrawBuffers) {
      EXT_DRAW_BUFFERS = scope.def(shared.extensions, '.webgl_draw_buffers');
    }

    var constants = env.constants;

    var DRAW_BUFFERS = constants.drawBuffer;
    var BACK_BUFFER = constants.backBuffer;

    var NEXT;
    if (framebuffer) {
      NEXT = framebuffer.append(env, scope);
    } else {
      NEXT = scope.def(FRAMEBUFFER_STATE, '.next');
    }

    if (!skipCheck) {
      scope('if(', NEXT, '!==', FRAMEBUFFER_STATE, '.cur){');
    }
    scope(
      'if(', NEXT, '){',
      GL, '.bindFramebuffer(', GL_FRAMEBUFFER$2, ',', NEXT, '.framebuffer);');
    if (extDrawBuffers) {
      scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(',
        DRAW_BUFFERS, '[', NEXT, '.colorAttachments.length]);');
    }
    scope('}else{',
      GL, '.bindFramebuffer(', GL_FRAMEBUFFER$2, ',null);');
    if (extDrawBuffers) {
      scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(', BACK_BUFFER, ');');
    }
    scope(
      '}',
      FRAMEBUFFER_STATE, '.cur=', NEXT, ';');
    if (!skipCheck) {
      scope('}');
    }
  }

  function emitPollState (env, scope, args) {
    var shared = env.shared;

    var GL = shared.gl;

    var CURRENT_VARS = env.current;
    var NEXT_VARS = env.next;
    var CURRENT_STATE = shared.current;
    var NEXT_STATE = shared.next;

    var block = env.cond(CURRENT_STATE, '.dirty');

    GL_STATE_NAMES.forEach(function (prop) {
      var param = propName(prop);
      if (param in args.state) {
        return
      }

      var NEXT, CURRENT;
      if (param in NEXT_VARS) {
        NEXT = NEXT_VARS[param];
        CURRENT = CURRENT_VARS[param];
        var parts = loop(currentState[param].length, function (i) {
          return block.def(NEXT, '[', i, ']')
        });
        block(env.cond(parts.map(function (p, i) {
          return p + '!==' + CURRENT + '[' + i + ']'
        }).join('||'))
          .then(
            GL, '.', GL_VARIABLES[param], '(', parts, ');',
            parts.map(function (p, i) {
              return CURRENT + '[' + i + ']=' + p
            }).join(';'), ';'));
      } else {
        NEXT = block.def(NEXT_STATE, '.', param);
        var ifte = env.cond(NEXT, '!==', CURRENT_STATE, '.', param);
        block(ifte);
        if (param in GL_FLAGS) {
          ifte(
            env.cond(NEXT)
                .then(GL, '.enable(', GL_FLAGS[param], ');')
                .else(GL, '.disable(', GL_FLAGS[param], ');'),
            CURRENT_STATE, '.', param, '=', NEXT, ';');
        } else {
          ifte(
            GL, '.', GL_VARIABLES[param], '(', NEXT, ');',
            CURRENT_STATE, '.', param, '=', NEXT, ';');
        }
      }
    });
    if (Object.keys(args.state).length === 0) {
      block(CURRENT_STATE, '.dirty=false;');
    }
    scope(block);
  }

  function emitSetOptions (env, scope, options, filter) {
    var shared = env.shared;
    var CURRENT_VARS = env.current;
    var CURRENT_STATE = shared.current;
    var GL = shared.gl;
    sortState(Object.keys(options)).forEach(function (param) {
      var defn = options[param];
      if (filter && !filter(defn)) {
        return
      }
      var variable = defn.append(env, scope);
      if (GL_FLAGS[param]) {
        var flag = GL_FLAGS[param];
        if (isStatic(defn)) {
          if (variable) {
            scope(GL, '.enable(', flag, ');');
          } else {
            scope(GL, '.disable(', flag, ');');
          }
        } else {
          scope(env.cond(variable)
            .then(GL, '.enable(', flag, ');')
            .else(GL, '.disable(', flag, ');'));
        }
        scope(CURRENT_STATE, '.', param, '=', variable, ';');
      } else if (isArrayLike(variable)) {
        var CURRENT = CURRENT_VARS[param];
        scope(
          GL, '.', GL_VARIABLES[param], '(', variable, ');',
          variable.map(function (v, i) {
            return CURRENT + '[' + i + ']=' + v
          }).join(';'), ';');
      } else {
        scope(
          GL, '.', GL_VARIABLES[param], '(', variable, ');',
          CURRENT_STATE, '.', param, '=', variable, ';');
      }
    });
  }

  function injectExtensions (env, scope) {
    if (extInstancing) {
      env.instancing = scope.def(
        env.shared.extensions, '.angle_instanced_arrays');
    }
  }

  function emitProfile (env, scope, args, useScope, incrementCounter) {
    var shared = env.shared;
    var STATS = env.stats;
    var CURRENT_STATE = shared.current;
    var TIMER = shared.timer;
    var profileArg = args.profile;

    function perfCounter () {
      if (typeof performance === 'undefined') {
        return 'Date.now()'
      } else {
        return 'performance.now()'
      }
    }

    var CPU_START, QUERY_COUNTER;
    function emitProfileStart (block) {
      CPU_START = scope.def();
      block(CPU_START, '=', perfCounter(), ';');
      if (typeof incrementCounter === 'string') {
        block(STATS, '.count+=', incrementCounter, ';');
      } else {
        block(STATS, '.count++;');
      }
      if (timer) {
        if (useScope) {
          QUERY_COUNTER = scope.def();
          block(QUERY_COUNTER, '=', TIMER, '.getNumPendingQueries();');
        } else {
          block(TIMER, '.beginQuery(', STATS, ');');
        }
      }
    }

    function emitProfileEnd (block) {
      block(STATS, '.cpuTime+=', perfCounter(), '-', CPU_START, ';');
      if (timer) {
        if (useScope) {
          block(TIMER, '.pushScopeStats(',
            QUERY_COUNTER, ',',
            TIMER, '.getNumPendingQueries(),',
            STATS, ');');
        } else {
          block(TIMER, '.endQuery();');
        }
      }
    }

    function scopeProfile (value) {
      var prev = scope.def(CURRENT_STATE, '.profile');
      scope(CURRENT_STATE, '.profile=', value, ';');
      scope.exit(CURRENT_STATE, '.profile=', prev, ';');
    }

    var USE_PROFILE;
    if (profileArg) {
      if (isStatic(profileArg)) {
        if (profileArg.enable) {
          emitProfileStart(scope);
          emitProfileEnd(scope.exit);
          scopeProfile('true');
        } else {
          scopeProfile('false');
        }
        return
      }
      USE_PROFILE = profileArg.append(env, scope);
      scopeProfile(USE_PROFILE);
    } else {
      USE_PROFILE = scope.def(CURRENT_STATE, '.profile');
    }

    var start = env.block();
    emitProfileStart(start);
    scope('if(', USE_PROFILE, '){', start, '}');
    var end = env.block();
    emitProfileEnd(end);
    scope.exit('if(', USE_PROFILE, '){', end, '}');
  }

  function emitAttributes (env, scope, args, attributes, filter) {
    var shared = env.shared;

    function typeLength (x) {
      switch (x) {
        case GL_FLOAT_VEC2:
        case GL_INT_VEC2:
        case GL_BOOL_VEC2:
          return 2
        case GL_FLOAT_VEC3:
        case GL_INT_VEC3:
        case GL_BOOL_VEC3:
          return 3
        case GL_FLOAT_VEC4:
        case GL_INT_VEC4:
        case GL_BOOL_VEC4:
          return 4
        default:
          return 1
      }
    }

    function emitBindAttribute (ATTRIBUTE, size, record) {
      var GL = shared.gl;

      var LOCATION = scope.def(ATTRIBUTE, '.location');
      var BINDING = scope.def(shared.attributes, '[', LOCATION, ']');

      var STATE = record.state;
      var BUFFER = record.buffer;
      var CONST_COMPONENTS = [
        record.x,
        record.y,
        record.z,
        record.w
      ];

      var COMMON_KEYS = [
        'buffer',
        'normalized',
        'offset',
        'stride'
      ];

      function emitBuffer () {
        scope(
          'if(!', BINDING, '.buffer){',
          GL, '.enableVertexAttribArray(', LOCATION, ');}');

        var TYPE = record.type;
        var SIZE;
        if (!record.size) {
          SIZE = size;
        } else {
          SIZE = scope.def(record.size, '||', size);
        }

        scope('if(',
          BINDING, '.type!==', TYPE, '||',
          BINDING, '.size!==', SIZE, '||',
          COMMON_KEYS.map(function (key) {
            return BINDING + '.' + key + '!==' + record[key]
          }).join('||'),
          '){',
          GL, '.bindBuffer(', GL_ARRAY_BUFFER$1, ',', BUFFER, '.buffer);',
          GL, '.vertexAttribPointer(', [
            LOCATION,
            SIZE,
            TYPE,
            record.normalized,
            record.stride,
            record.offset
          ], ');',
          BINDING, '.type=', TYPE, ';',
          BINDING, '.size=', SIZE, ';',
          COMMON_KEYS.map(function (key) {
            return BINDING + '.' + key + '=' + record[key] + ';'
          }).join(''),
          '}');

        if (extInstancing) {
          var DIVISOR = record.divisor;
          scope(
            'if(', BINDING, '.divisor!==', DIVISOR, '){',
            env.instancing, '.vertexAttribDivisorANGLE(', [LOCATION, DIVISOR], ');',
            BINDING, '.divisor=', DIVISOR, ';}');
        }
      }

      function emitConstant () {
        scope(
          'if(', BINDING, '.buffer){',
          GL, '.disableVertexAttribArray(', LOCATION, ');',
          '}if(', CUTE_COMPONENTS.map(function (c, i) {
            return BINDING + '.' + c + '!==' + CONST_COMPONENTS[i]
          }).join('||'), '){',
          GL, '.vertexAttrib4f(', LOCATION, ',', CONST_COMPONENTS, ');',
          CUTE_COMPONENTS.map(function (c, i) {
            return BINDING + '.' + c + '=' + CONST_COMPONENTS[i] + ';'
          }).join(''),
          '}');
      }

      if (STATE === ATTRIB_STATE_POINTER) {
        emitBuffer();
      } else if (STATE === ATTRIB_STATE_CONSTANT) {
        emitConstant();
      } else {
        scope('if(', STATE, '===', ATTRIB_STATE_POINTER, '){');
        emitBuffer();
        scope('}else{');
        emitConstant();
        scope('}');
      }
    }

    attributes.forEach(function (attribute) {
      var name = attribute.name;
      var arg = args.attributes[name];
      var record;
      if (arg) {
        if (!filter(arg)) {
          return
        }
        record = arg.append(env, scope);
      } else {
        if (!filter(SCOPE_DECL)) {
          return
        }
        var scopeAttrib = env.scopeAttrib(name);
        check$1.optional(function () {
          env.assert(scope,
            scopeAttrib + '.state',
            'missing attribute ' + name);
        });
        record = {};
        Object.keys(new AttributeRecord()).forEach(function (key) {
          record[key] = scope.def(scopeAttrib, '.', key);
        });
      }
      emitBindAttribute(
        env.link(attribute), typeLength(attribute.info.type), record);
    });
  }

  function emitUniforms (env, scope, args, uniforms, filter) {
    var shared = env.shared;
    var GL = shared.gl;

    var infix;
    for (var i = 0; i < uniforms.length; ++i) {
      var uniform = uniforms[i];
      var name = uniform.name;
      var type = uniform.info.type;
      var arg = args.uniforms[name];
      var UNIFORM = env.link(uniform);
      var LOCATION = UNIFORM + '.location';

      var VALUE;
      if (arg) {
        if (!filter(arg)) {
          continue
        }
        if (isStatic(arg)) {
          var value = arg.value;
          check$1.command(
            value !== null && typeof value !== 'undefined',
            'missing uniform "' + name + '"', env.commandStr);
          if (type === GL_SAMPLER_2D || type === GL_SAMPLER_CUBE) {
            check$1.command(
              typeof value === 'function' &&
              ((type === GL_SAMPLER_2D &&
                (value._reglType === 'texture2d' ||
                value._reglType === 'framebuffer')) ||
              (type === GL_SAMPLER_CUBE &&
                (value._reglType === 'textureCube' ||
                value._reglType === 'framebufferCube'))),
              'invalid texture for uniform ' + name, env.commandStr);
            var TEX_VALUE = env.link(value._texture || value.color[0]._texture);
            scope(GL, '.uniform1i(', LOCATION, ',', TEX_VALUE + '.bind());');
            scope.exit(TEX_VALUE, '.unbind();');
          } else if (
            type === GL_FLOAT_MAT2 ||
            type === GL_FLOAT_MAT3 ||
            type === GL_FLOAT_MAT4) {
            check$1.optional(function () {
              check$1.command(isArrayLike(value),
                'invalid matrix for uniform ' + name, env.commandStr);
              check$1.command(
                (type === GL_FLOAT_MAT2 && value.length === 4) ||
                (type === GL_FLOAT_MAT3 && value.length === 9) ||
                (type === GL_FLOAT_MAT4 && value.length === 16),
                'invalid length for matrix uniform ' + name, env.commandStr);
            });
            var MAT_VALUE = env.global.def('new Float32Array([' +
              Array.prototype.slice.call(value) + '])');
            var dim = 2;
            if (type === GL_FLOAT_MAT3) {
              dim = 3;
            } else if (type === GL_FLOAT_MAT4) {
              dim = 4;
            }
            scope(
              GL, '.uniformMatrix', dim, 'fv(',
              LOCATION, ',false,', MAT_VALUE, ');');
          } else {
            switch (type) {
              case GL_FLOAT$8:
                check$1.commandType(value, 'number', 'uniform ' + name, env.commandStr);
                infix = '1f';
                break
              case GL_FLOAT_VEC2:
                check$1.command(
                  isArrayLike(value) && value.length === 2,
                  'uniform ' + name, env.commandStr);
                infix = '2f';
                break
              case GL_FLOAT_VEC3:
                check$1.command(
                  isArrayLike(value) && value.length === 3,
                  'uniform ' + name, env.commandStr);
                infix = '3f';
                break
              case GL_FLOAT_VEC4:
                check$1.command(
                  isArrayLike(value) && value.length === 4,
                  'uniform ' + name, env.commandStr);
                infix = '4f';
                break
              case GL_BOOL:
                check$1.commandType(value, 'boolean', 'uniform ' + name, env.commandStr);
                infix = '1i';
                break
              case GL_INT$3:
                check$1.commandType(value, 'number', 'uniform ' + name, env.commandStr);
                infix = '1i';
                break
              case GL_BOOL_VEC2:
                check$1.command(
                  isArrayLike(value) && value.length === 2,
                  'uniform ' + name, env.commandStr);
                infix = '2i';
                break
              case GL_INT_VEC2:
                check$1.command(
                  isArrayLike(value) && value.length === 2,
                  'uniform ' + name, env.commandStr);
                infix = '2i';
                break
              case GL_BOOL_VEC3:
                check$1.command(
                  isArrayLike(value) && value.length === 3,
                  'uniform ' + name, env.commandStr);
                infix = '3i';
                break
              case GL_INT_VEC3:
                check$1.command(
                  isArrayLike(value) && value.length === 3,
                  'uniform ' + name, env.commandStr);
                infix = '3i';
                break
              case GL_BOOL_VEC4:
                check$1.command(
                  isArrayLike(value) && value.length === 4,
                  'uniform ' + name, env.commandStr);
                infix = '4i';
                break
              case GL_INT_VEC4:
                check$1.command(
                  isArrayLike(value) && value.length === 4,
                  'uniform ' + name, env.commandStr);
                infix = '4i';
                break
            }
            scope(GL, '.uniform', infix, '(', LOCATION, ',',
              isArrayLike(value) ? Array.prototype.slice.call(value) : value,
              ');');
          }
          continue
        } else {
          VALUE = arg.append(env, scope);
        }
      } else {
        if (!filter(SCOPE_DECL)) {
          continue
        }
        VALUE = scope.def(shared.uniforms, '[', stringStore.id(name), ']');
      }

      if (type === GL_SAMPLER_2D) {
        scope(
          'if(', VALUE, '&&', VALUE, '._reglType==="framebuffer"){',
          VALUE, '=', VALUE, '.color[0];',
          '}');
      } else if (type === GL_SAMPLER_CUBE) {
        scope(
          'if(', VALUE, '&&', VALUE, '._reglType==="framebufferCube"){',
          VALUE, '=', VALUE, '.color[0];',
          '}');
      }

      // perform type validation
      check$1.optional(function () {
        function check (pred, message) {
          env.assert(scope, pred,
            'bad data or missing for uniform "' + name + '".  ' + message);
        }

        function checkType (type) {
          check(
            'typeof ' + VALUE + '==="' + type + '"',
            'invalid type, expected ' + type);
        }

        function checkVector (n, type) {
          check(
            shared.isArrayLike + '(' + VALUE + ')&&' + VALUE + '.length===' + n,
            'invalid vector, should have length ' + n, env.commandStr);
        }

        function checkTexture (target) {
          check(
            'typeof ' + VALUE + '==="function"&&' +
            VALUE + '._reglType==="texture' +
            (target === GL_TEXTURE_2D$3 ? '2d' : 'Cube') + '"',
            'invalid texture type', env.commandStr);
        }

        switch (type) {
          case GL_INT$3:
            checkType('number');
            break
          case GL_INT_VEC2:
            checkVector(2, 'number');
            break
          case GL_INT_VEC3:
            checkVector(3, 'number');
            break
          case GL_INT_VEC4:
            checkVector(4, 'number');
            break
          case GL_FLOAT$8:
            checkType('number');
            break
          case GL_FLOAT_VEC2:
            checkVector(2, 'number');
            break
          case GL_FLOAT_VEC3:
            checkVector(3, 'number');
            break
          case GL_FLOAT_VEC4:
            checkVector(4, 'number');
            break
          case GL_BOOL:
            checkType('boolean');
            break
          case GL_BOOL_VEC2:
            checkVector(2, 'boolean');
            break
          case GL_BOOL_VEC3:
            checkVector(3, 'boolean');
            break
          case GL_BOOL_VEC4:
            checkVector(4, 'boolean');
            break
          case GL_FLOAT_MAT2:
            checkVector(4, 'number');
            break
          case GL_FLOAT_MAT3:
            checkVector(9, 'number');
            break
          case GL_FLOAT_MAT4:
            checkVector(16, 'number');
            break
          case GL_SAMPLER_2D:
            checkTexture(GL_TEXTURE_2D$3);
            break
          case GL_SAMPLER_CUBE:
            checkTexture(GL_TEXTURE_CUBE_MAP$2);
            break
        }
      });

      var unroll = 1;
      switch (type) {
        case GL_SAMPLER_2D:
        case GL_SAMPLER_CUBE:
          var TEX = scope.def(VALUE, '._texture');
          scope(GL, '.uniform1i(', LOCATION, ',', TEX, '.bind());');
          scope.exit(TEX, '.unbind();');
          continue

        case GL_INT$3:
        case GL_BOOL:
          infix = '1i';
          break

        case GL_INT_VEC2:
        case GL_BOOL_VEC2:
          infix = '2i';
          unroll = 2;
          break

        case GL_INT_VEC3:
        case GL_BOOL_VEC3:
          infix = '3i';
          unroll = 3;
          break

        case GL_INT_VEC4:
        case GL_BOOL_VEC4:
          infix = '4i';
          unroll = 4;
          break

        case GL_FLOAT$8:
          infix = '1f';
          break

        case GL_FLOAT_VEC2:
          infix = '2f';
          unroll = 2;
          break

        case GL_FLOAT_VEC3:
          infix = '3f';
          unroll = 3;
          break

        case GL_FLOAT_VEC4:
          infix = '4f';
          unroll = 4;
          break

        case GL_FLOAT_MAT2:
          infix = 'Matrix2fv';
          break

        case GL_FLOAT_MAT3:
          infix = 'Matrix3fv';
          break

        case GL_FLOAT_MAT4:
          infix = 'Matrix4fv';
          break
      }

      scope(GL, '.uniform', infix, '(', LOCATION, ',');
      if (infix.charAt(0) === 'M') {
        var matSize = Math.pow(type - GL_FLOAT_MAT2 + 2, 2);
        var STORAGE = env.global.def('new Float32Array(', matSize, ')');
        scope(
          'false,(Array.isArray(', VALUE, ')||', VALUE, ' instanceof Float32Array)?', VALUE, ':(',
          loop(matSize, function (i) {
            return STORAGE + '[' + i + ']=' + VALUE + '[' + i + ']'
          }), ',', STORAGE, ')');
      } else if (unroll > 1) {
        scope(loop(unroll, function (i) {
          return VALUE + '[' + i + ']'
        }));
      } else {
        scope(VALUE);
      }
      scope(');');
    }
  }

  function emitDraw (env, outer, inner, args) {
    var shared = env.shared;
    var GL = shared.gl;
    var DRAW_STATE = shared.draw;

    var drawOptions = args.draw;

    function emitElements () {
      var defn = drawOptions.elements;
      var ELEMENTS;
      var scope = outer;
      if (defn) {
        if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
          scope = inner;
        }
        ELEMENTS = defn.append(env, scope);
      } else {
        ELEMENTS = scope.def(DRAW_STATE, '.', S_ELEMENTS);
      }
      if (ELEMENTS) {
        scope(
          'if(' + ELEMENTS + ')' +
          GL + '.bindBuffer(' + GL_ELEMENT_ARRAY_BUFFER$1 + ',' + ELEMENTS + '.buffer.buffer);');
      }
      return ELEMENTS
    }

    function emitCount () {
      var defn = drawOptions.count;
      var COUNT;
      var scope = outer;
      if (defn) {
        if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
          scope = inner;
        }
        COUNT = defn.append(env, scope);
        check$1.optional(function () {
          if (defn.MISSING) {
            env.assert(outer, 'false', 'missing vertex count');
          }
          if (defn.DYNAMIC) {
            env.assert(scope, COUNT + '>=0', 'missing vertex count');
          }
        });
      } else {
        COUNT = scope.def(DRAW_STATE, '.', S_COUNT);
        check$1.optional(function () {
          env.assert(scope, COUNT + '>=0', 'missing vertex count');
        });
      }
      return COUNT
    }

    var ELEMENTS = emitElements();
    function emitValue (name) {
      var defn = drawOptions[name];
      if (defn) {
        if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
          return defn.append(env, inner)
        } else {
          return defn.append(env, outer)
        }
      } else {
        return outer.def(DRAW_STATE, '.', name)
      }
    }

    var PRIMITIVE = emitValue(S_PRIMITIVE);
    var OFFSET = emitValue(S_OFFSET);

    var COUNT = emitCount();
    if (typeof COUNT === 'number') {
      if (COUNT === 0) {
        return
      }
    } else {
      inner('if(', COUNT, '){');
      inner.exit('}');
    }

    var INSTANCES, EXT_INSTANCING;
    if (extInstancing) {
      INSTANCES = emitValue(S_INSTANCES);
      EXT_INSTANCING = env.instancing;
    }

    var ELEMENT_TYPE = ELEMENTS + '.type';

    var elementsStatic = drawOptions.elements && isStatic(drawOptions.elements);

    function emitInstancing () {
      function drawElements () {
        inner(EXT_INSTANCING, '.drawElementsInstancedANGLE(', [
          PRIMITIVE,
          COUNT,
          ELEMENT_TYPE,
          OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$8 + ')>>1)',
          INSTANCES
        ], ');');
      }

      function drawArrays () {
        inner(EXT_INSTANCING, '.drawArraysInstancedANGLE(',
          [PRIMITIVE, OFFSET, COUNT, INSTANCES], ');');
      }

      if (ELEMENTS) {
        if (!elementsStatic) {
          inner('if(', ELEMENTS, '){');
          drawElements();
          inner('}else{');
          drawArrays();
          inner('}');
        } else {
          drawElements();
        }
      } else {
        drawArrays();
      }
    }

    function emitRegular () {
      function drawElements () {
        inner(GL + '.drawElements(' + [
          PRIMITIVE,
          COUNT,
          ELEMENT_TYPE,
          OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$8 + ')>>1)'
        ] + ');');
      }

      function drawArrays () {
        inner(GL + '.drawArrays(' + [PRIMITIVE, OFFSET, COUNT] + ');');
      }

      if (ELEMENTS) {
        if (!elementsStatic) {
          inner('if(', ELEMENTS, '){');
          drawElements();
          inner('}else{');
          drawArrays();
          inner('}');
        } else {
          drawElements();
        }
      } else {
        drawArrays();
      }
    }

    if (extInstancing && (typeof INSTANCES !== 'number' || INSTANCES >= 0)) {
      if (typeof INSTANCES === 'string') {
        inner('if(', INSTANCES, '>0){');
        emitInstancing();
        inner('}else if(', INSTANCES, '<0){');
        emitRegular();
        inner('}');
      } else {
        emitInstancing();
      }
    } else {
      emitRegular();
    }
  }

  function createBody (emitBody, parentEnv, args, program, count) {
    var env = createREGLEnvironment();
    var scope = env.proc('body', count);
    check$1.optional(function () {
      env.commandStr = parentEnv.commandStr;
      env.command = env.link(parentEnv.commandStr);
    });
    if (extInstancing) {
      env.instancing = scope.def(
        env.shared.extensions, '.angle_instanced_arrays');
    }
    emitBody(env, scope, args, program);
    return env.compile().body
  }

  // ===================================================
  // ===================================================
  // DRAW PROC
  // ===================================================
  // ===================================================
  function emitDrawBody (env, draw, args, program) {
    injectExtensions(env, draw);
    emitAttributes(env, draw, args, program.attributes, function () {
      return true
    });
    emitUniforms(env, draw, args, program.uniforms, function () {
      return true
    });
    emitDraw(env, draw, draw, args);
  }

  function emitDrawProc (env, args) {
    var draw = env.proc('draw', 1);

    injectExtensions(env, draw);

    emitContext(env, draw, args.context);
    emitPollFramebuffer(env, draw, args.framebuffer);

    emitPollState(env, draw, args);
    emitSetOptions(env, draw, args.state);

    emitProfile(env, draw, args, false, true);

    var program = args.shader.progVar.append(env, draw);
    draw(env.shared.gl, '.useProgram(', program, '.program);');

    if (args.shader.program) {
      emitDrawBody(env, draw, args, args.shader.program);
    } else {
      var drawCache = env.global.def('{}');
      var PROG_ID = draw.def(program, '.id');
      var CACHED_PROC = draw.def(drawCache, '[', PROG_ID, ']');
      draw(
        env.cond(CACHED_PROC)
          .then(CACHED_PROC, '.call(this,a0);')
          .else(
            CACHED_PROC, '=', drawCache, '[', PROG_ID, ']=',
            env.link(function (program) {
              return createBody(emitDrawBody, env, args, program, 1)
            }), '(', program, ');',
            CACHED_PROC, '.call(this,a0);'));
    }

    if (Object.keys(args.state).length > 0) {
      draw(env.shared.current, '.dirty=true;');
    }
  }

  // ===================================================
  // ===================================================
  // BATCH PROC
  // ===================================================
  // ===================================================

  function emitBatchDynamicShaderBody (env, scope, args, program) {
    env.batchId = 'a1';

    injectExtensions(env, scope);

    function all () {
      return true
    }

    emitAttributes(env, scope, args, program.attributes, all);
    emitUniforms(env, scope, args, program.uniforms, all);
    emitDraw(env, scope, scope, args);
  }

  function emitBatchBody (env, scope, args, program) {
    injectExtensions(env, scope);

    var contextDynamic = args.contextDep;

    var BATCH_ID = scope.def();
    var PROP_LIST = 'a0';
    var NUM_PROPS = 'a1';
    var PROPS = scope.def();
    env.shared.props = PROPS;
    env.batchId = BATCH_ID;

    var outer = env.scope();
    var inner = env.scope();

    scope(
      outer.entry,
      'for(', BATCH_ID, '=0;', BATCH_ID, '<', NUM_PROPS, ';++', BATCH_ID, '){',
      PROPS, '=', PROP_LIST, '[', BATCH_ID, '];',
      inner,
      '}',
      outer.exit);

    function isInnerDefn (defn) {
      return ((defn.contextDep && contextDynamic) || defn.propDep)
    }

    function isOuterDefn (defn) {
      return !isInnerDefn(defn)
    }

    if (args.needsContext) {
      emitContext(env, inner, args.context);
    }
    if (args.needsFramebuffer) {
      emitPollFramebuffer(env, inner, args.framebuffer);
    }
    emitSetOptions(env, inner, args.state, isInnerDefn);

    if (args.profile && isInnerDefn(args.profile)) {
      emitProfile(env, inner, args, false, true);
    }

    if (!program) {
      var progCache = env.global.def('{}');
      var PROGRAM = args.shader.progVar.append(env, inner);
      var PROG_ID = inner.def(PROGRAM, '.id');
      var CACHED_PROC = inner.def(progCache, '[', PROG_ID, ']');
      inner(
        env.shared.gl, '.useProgram(', PROGRAM, '.program);',
        'if(!', CACHED_PROC, '){',
        CACHED_PROC, '=', progCache, '[', PROG_ID, ']=',
        env.link(function (program) {
          return createBody(
            emitBatchDynamicShaderBody, env, args, program, 2)
        }), '(', PROGRAM, ');}',
        CACHED_PROC, '.call(this,a0[', BATCH_ID, '],', BATCH_ID, ');');
    } else {
      emitAttributes(env, outer, args, program.attributes, isOuterDefn);
      emitAttributes(env, inner, args, program.attributes, isInnerDefn);
      emitUniforms(env, outer, args, program.uniforms, isOuterDefn);
      emitUniforms(env, inner, args, program.uniforms, isInnerDefn);
      emitDraw(env, outer, inner, args);
    }
  }

  function emitBatchProc (env, args) {
    var batch = env.proc('batch', 2);
    env.batchId = '0';

    injectExtensions(env, batch);

    // Check if any context variables depend on props
    var contextDynamic = false;
    var needsContext = true;
    Object.keys(args.context).forEach(function (name) {
      contextDynamic = contextDynamic || args.context[name].propDep;
    });
    if (!contextDynamic) {
      emitContext(env, batch, args.context);
      needsContext = false;
    }

    // framebuffer state affects framebufferWidth/height context vars
    var framebuffer = args.framebuffer;
    var needsFramebuffer = false;
    if (framebuffer) {
      if (framebuffer.propDep) {
        contextDynamic = needsFramebuffer = true;
      } else if (framebuffer.contextDep && contextDynamic) {
        needsFramebuffer = true;
      }
      if (!needsFramebuffer) {
        emitPollFramebuffer(env, batch, framebuffer);
      }
    } else {
      emitPollFramebuffer(env, batch, null);
    }

    // viewport is weird because it can affect context vars
    if (args.state.viewport && args.state.viewport.propDep) {
      contextDynamic = true;
    }

    function isInnerDefn (defn) {
      return (defn.contextDep && contextDynamic) || defn.propDep
    }

    // set webgl options
    emitPollState(env, batch, args);
    emitSetOptions(env, batch, args.state, function (defn) {
      return !isInnerDefn(defn)
    });

    if (!args.profile || !isInnerDefn(args.profile)) {
      emitProfile(env, batch, args, false, 'a1');
    }

    // Save these values to args so that the batch body routine can use them
    args.contextDep = contextDynamic;
    args.needsContext = needsContext;
    args.needsFramebuffer = needsFramebuffer;

    // determine if shader is dynamic
    var progDefn = args.shader.progVar;
    if ((progDefn.contextDep && contextDynamic) || progDefn.propDep) {
      emitBatchBody(
        env,
        batch,
        args,
        null);
    } else {
      var PROGRAM = progDefn.append(env, batch);
      batch(env.shared.gl, '.useProgram(', PROGRAM, '.program);');
      if (args.shader.program) {
        emitBatchBody(
          env,
          batch,
          args,
          args.shader.program);
      } else {
        var batchCache = env.global.def('{}');
        var PROG_ID = batch.def(PROGRAM, '.id');
        var CACHED_PROC = batch.def(batchCache, '[', PROG_ID, ']');
        batch(
          env.cond(CACHED_PROC)
            .then(CACHED_PROC, '.call(this,a0,a1);')
            .else(
              CACHED_PROC, '=', batchCache, '[', PROG_ID, ']=',
              env.link(function (program) {
                return createBody(emitBatchBody, env, args, program, 2)
              }), '(', PROGRAM, ');',
              CACHED_PROC, '.call(this,a0,a1);'));
      }
    }

    if (Object.keys(args.state).length > 0) {
      batch(env.shared.current, '.dirty=true;');
    }
  }

  // ===================================================
  // ===================================================
  // SCOPE COMMAND
  // ===================================================
  // ===================================================
  function emitScopeProc (env, args) {
    var scope = env.proc('scope', 3);
    env.batchId = 'a2';

    var shared = env.shared;
    var CURRENT_STATE = shared.current;

    emitContext(env, scope, args.context);

    if (args.framebuffer) {
      args.framebuffer.append(env, scope);
    }

    sortState(Object.keys(args.state)).forEach(function (name) {
      var defn = args.state[name];
      var value = defn.append(env, scope);
      if (isArrayLike(value)) {
        value.forEach(function (v, i) {
          scope.set(env.next[name], '[' + i + ']', v);
        });
      } else {
        scope.set(shared.next, '.' + name, value);
      }
    });

    emitProfile(env, scope, args, true, true)

    ;[S_ELEMENTS, S_OFFSET, S_COUNT, S_INSTANCES, S_PRIMITIVE].forEach(
      function (opt) {
        var variable = args.draw[opt];
        if (!variable) {
          return
        }
        scope.set(shared.draw, '.' + opt, '' + variable.append(env, scope));
      });

    Object.keys(args.uniforms).forEach(function (opt) {
      scope.set(
        shared.uniforms,
        '[' + stringStore.id(opt) + ']',
        args.uniforms[opt].append(env, scope));
    });

    Object.keys(args.attributes).forEach(function (name) {
      var record = args.attributes[name].append(env, scope);
      var scopeAttrib = env.scopeAttrib(name);
      Object.keys(new AttributeRecord()).forEach(function (prop) {
        scope.set(scopeAttrib, '.' + prop, record[prop]);
      });
    });

    function saveShader (name) {
      var shader = args.shader[name];
      if (shader) {
        scope.set(shared.shader, '.' + name, shader.append(env, scope));
      }
    }
    saveShader(S_VERT);
    saveShader(S_FRAG);

    if (Object.keys(args.state).length > 0) {
      scope(CURRENT_STATE, '.dirty=true;');
      scope.exit(CURRENT_STATE, '.dirty=true;');
    }

    scope('a1(', env.shared.context, ',a0,', env.batchId, ');');
  }

  function isDynamicObject (object) {
    if (typeof object !== 'object' || isArrayLike(object)) {
      return
    }
    var props = Object.keys(object);
    for (var i = 0; i < props.length; ++i) {
      if (dynamic.isDynamic(object[props[i]])) {
        return true
      }
    }
    return false
  }

  function splatObject (env, options, name) {
    var object = options.static[name];
    if (!object || !isDynamicObject(object)) {
      return
    }

    var globals = env.global;
    var keys = Object.keys(object);
    var thisDep = false;
    var contextDep = false;
    var propDep = false;
    var objectRef = env.global.def('{}');
    keys.forEach(function (key) {
      var value = object[key];
      if (dynamic.isDynamic(value)) {
        if (typeof value === 'function') {
          value = object[key] = dynamic.unbox(value);
        }
        var deps = createDynamicDecl(value, null);
        thisDep = thisDep || deps.thisDep;
        propDep = propDep || deps.propDep;
        contextDep = contextDep || deps.contextDep;
      } else {
        globals(objectRef, '.', key, '=');
        switch (typeof value) {
          case 'number':
            globals(value);
            break
          case 'string':
            globals('"', value, '"');
            break
          case 'object':
            if (Array.isArray(value)) {
              globals('[', value.join(), ']');
            }
            break
          default:
            globals(env.link(value));
            break
        }
        globals(';');
      }
    });

    function appendBlock (env, block) {
      keys.forEach(function (key) {
        var value = object[key];
        if (!dynamic.isDynamic(value)) {
          return
        }
        var ref = env.invoke(block, value);
        block(objectRef, '.', key, '=', ref, ';');
      });
    }

    options.dynamic[name] = new dynamic.DynamicVariable(DYN_THUNK, {
      thisDep: thisDep,
      contextDep: contextDep,
      propDep: propDep,
      ref: objectRef,
      append: appendBlock
    });
    delete options.static[name];
  }

  // ===========================================================================
  // ===========================================================================
  // MAIN DRAW COMMAND
  // ===========================================================================
  // ===========================================================================
  function compileCommand (options, attributes, uniforms, context, stats) {
    var env = createREGLEnvironment();

    // link stats, so that we can easily access it in the program.
    env.stats = env.link(stats);

    // splat options and attributes to allow for dynamic nested properties
    Object.keys(attributes.static).forEach(function (key) {
      splatObject(env, attributes, key);
    });
    NESTED_OPTIONS.forEach(function (name) {
      splatObject(env, options, name);
    });

    var args = parseArguments(options, attributes, uniforms, context, env);

    emitDrawProc(env, args);
    emitScopeProc(env, args);
    emitBatchProc(env, args);

    return env.compile()
  }

  // ===========================================================================
  // ===========================================================================
  // POLL / REFRESH
  // ===========================================================================
  // ===========================================================================
  return {
    next: nextState,
    current: currentState,
    procs: (function () {
      var env = createREGLEnvironment();
      var poll = env.proc('poll');
      var refresh = env.proc('refresh');
      var common = env.block();
      poll(common);
      refresh(common);

      var shared = env.shared;
      var GL = shared.gl;
      var NEXT_STATE = shared.next;
      var CURRENT_STATE = shared.current;

      common(CURRENT_STATE, '.dirty=false;');

      emitPollFramebuffer(env, poll);
      emitPollFramebuffer(env, refresh, null, true);

      // Refresh updates all attribute state changes
      var INSTANCING;
      if (extInstancing) {
        INSTANCING = env.link(extInstancing);
      }
      for (var i = 0; i < limits.maxAttributes; ++i) {
        var BINDING = refresh.def(shared.attributes, '[', i, ']');
        var ifte = env.cond(BINDING, '.buffer');
        ifte.then(
          GL, '.enableVertexAttribArray(', i, ');',
          GL, '.bindBuffer(',
            GL_ARRAY_BUFFER$1, ',',
            BINDING, '.buffer.buffer);',
          GL, '.vertexAttribPointer(',
            i, ',',
            BINDING, '.size,',
            BINDING, '.type,',
            BINDING, '.normalized,',
            BINDING, '.stride,',
            BINDING, '.offset);'
        ).else(
          GL, '.disableVertexAttribArray(', i, ');',
          GL, '.vertexAttrib4f(',
            i, ',',
            BINDING, '.x,',
            BINDING, '.y,',
            BINDING, '.z,',
            BINDING, '.w);',
          BINDING, '.buffer=null;');
        refresh(ifte);
        if (extInstancing) {
          refresh(
            INSTANCING, '.vertexAttribDivisorANGLE(',
            i, ',',
            BINDING, '.divisor);');
        }
      }

      Object.keys(GL_FLAGS).forEach(function (flag) {
        var cap = GL_FLAGS[flag];
        var NEXT = common.def(NEXT_STATE, '.', flag);
        var block = env.block();
        block('if(', NEXT, '){',
          GL, '.enable(', cap, ')}else{',
          GL, '.disable(', cap, ')}',
          CURRENT_STATE, '.', flag, '=', NEXT, ';');
        refresh(block);
        poll(
          'if(', NEXT, '!==', CURRENT_STATE, '.', flag, '){',
          block,
          '}');
      });

      Object.keys(GL_VARIABLES).forEach(function (name) {
        var func = GL_VARIABLES[name];
        var init = currentState[name];
        var NEXT, CURRENT;
        var block = env.block();
        block(GL, '.', func, '(');
        if (isArrayLike(init)) {
          var n = init.length;
          NEXT = env.global.def(NEXT_STATE, '.', name);
          CURRENT = env.global.def(CURRENT_STATE, '.', name);
          block(
            loop(n, function (i) {
              return NEXT + '[' + i + ']'
            }), ');',
            loop(n, function (i) {
              return CURRENT + '[' + i + ']=' + NEXT + '[' + i + '];'
            }).join(''));
          poll(
            'if(', loop(n, function (i) {
              return NEXT + '[' + i + ']!==' + CURRENT + '[' + i + ']'
            }).join('||'), '){',
            block,
            '}');
        } else {
          NEXT = common.def(NEXT_STATE, '.', name);
          CURRENT = common.def(CURRENT_STATE, '.', name);
          block(
            NEXT, ');',
            CURRENT_STATE, '.', name, '=', NEXT, ';');
          poll(
            'if(', NEXT, '!==', CURRENT, '){',
            block,
            '}');
        }
        refresh(block);
      });

      return env.compile()
    })(),
    compile: compileCommand
  }
}

function stats () {
  return {
    bufferCount: 0,
    elementsCount: 0,
    framebufferCount: 0,
    shaderCount: 0,
    textureCount: 0,
    cubeCount: 0,
    renderbufferCount: 0,
    maxTextureUnits: 0
  }
}

var GL_QUERY_RESULT_EXT = 0x8866;
var GL_QUERY_RESULT_AVAILABLE_EXT = 0x8867;
var GL_TIME_ELAPSED_EXT = 0x88BF;

var createTimer = function (gl, extensions) {
  var extTimer = extensions.ext_disjoint_timer_query;

  if (!extTimer) {
    return null
  }

  // QUERY POOL BEGIN
  var queryPool = [];
  function allocQuery () {
    return queryPool.pop() || extTimer.createQueryEXT()
  }
  function freeQuery (query) {
    queryPool.push(query);
  }
  // QUERY POOL END

  var pendingQueries = [];
  function beginQuery (stats) {
    var query = allocQuery();
    extTimer.beginQueryEXT(GL_TIME_ELAPSED_EXT, query);
    pendingQueries.push(query);
    pushScopeStats(pendingQueries.length - 1, pendingQueries.length, stats);
  }

  function endQuery () {
    extTimer.endQueryEXT(GL_TIME_ELAPSED_EXT);
  }

  //
  // Pending stats pool.
  //
  function PendingStats () {
    this.startQueryIndex = -1;
    this.endQueryIndex = -1;
    this.sum = 0;
    this.stats = null;
  }
  var pendingStatsPool = [];
  function allocPendingStats () {
    return pendingStatsPool.pop() || new PendingStats()
  }
  function freePendingStats (pendingStats) {
    pendingStatsPool.push(pendingStats);
  }
  // Pending stats pool end

  var pendingStats = [];
  function pushScopeStats (start, end, stats) {
    var ps = allocPendingStats();
    ps.startQueryIndex = start;
    ps.endQueryIndex = end;
    ps.sum = 0;
    ps.stats = stats;
    pendingStats.push(ps);
  }

  // we should call this at the beginning of the frame,
  // in order to update gpuTime
  var timeSum = [];
  var queryPtr = [];
  function update () {
    var ptr, i;

    var n = pendingQueries.length;
    if (n === 0) {
      return
    }

    // Reserve space
    queryPtr.length = Math.max(queryPtr.length, n + 1);
    timeSum.length = Math.max(timeSum.length, n + 1);
    timeSum[0] = 0;
    queryPtr[0] = 0;

    // Update all pending timer queries
    var queryTime = 0;
    ptr = 0;
    for (i = 0; i < pendingQueries.length; ++i) {
      var query = pendingQueries[i];
      if (extTimer.getQueryObjectEXT(query, GL_QUERY_RESULT_AVAILABLE_EXT)) {
        queryTime += extTimer.getQueryObjectEXT(query, GL_QUERY_RESULT_EXT);
        freeQuery(query);
      } else {
        pendingQueries[ptr++] = query;
      }
      timeSum[i + 1] = queryTime;
      queryPtr[i + 1] = ptr;
    }
    pendingQueries.length = ptr;

    // Update all pending stat queries
    ptr = 0;
    for (i = 0; i < pendingStats.length; ++i) {
      var stats = pendingStats[i];
      var start = stats.startQueryIndex;
      var end = stats.endQueryIndex;
      stats.sum += timeSum[end] - timeSum[start];
      var startPtr = queryPtr[start];
      var endPtr = queryPtr[end];
      if (endPtr === startPtr) {
        stats.stats.gpuTime += stats.sum / 1e6;
        freePendingStats(stats);
      } else {
        stats.startQueryIndex = startPtr;
        stats.endQueryIndex = endPtr;
        pendingStats[ptr++] = stats;
      }
    }
    pendingStats.length = ptr;
  }

  return {
    beginQuery: beginQuery,
    endQuery: endQuery,
    pushScopeStats: pushScopeStats,
    update: update,
    getNumPendingQueries: function () {
      return pendingQueries.length
    },
    clear: function () {
      queryPool.push.apply(queryPool, pendingQueries);
      for (var i = 0; i < queryPool.length; i++) {
        extTimer.deleteQueryEXT(queryPool[i]);
      }
      pendingQueries.length = 0;
      queryPool.length = 0;
    },
    restore: function () {
      pendingQueries.length = 0;
      queryPool.length = 0;
    }
  }
};

var GL_COLOR_BUFFER_BIT = 16384;
var GL_DEPTH_BUFFER_BIT = 256;
var GL_STENCIL_BUFFER_BIT = 1024;

var GL_ARRAY_BUFFER = 34962;

var CONTEXT_LOST_EVENT = 'webglcontextlost';
var CONTEXT_RESTORED_EVENT = 'webglcontextrestored';

var DYN_PROP = 1;
var DYN_CONTEXT = 2;
var DYN_STATE = 3;

function find (haystack, needle) {
  for (var i = 0; i < haystack.length; ++i) {
    if (haystack[i] === needle) {
      return i
    }
  }
  return -1
}

function wrapREGL (args) {
  var config = parseArgs(args);
  if (!config) {
    return null
  }

  var gl = config.gl;
  var glAttributes = gl.getContextAttributes();
  var contextLost = gl.isContextLost();

  var extensionState = createExtensionCache(gl, config);
  if (!extensionState) {
    return null
  }

  var stringStore = createStringStore();
  var stats$$1 = stats();
  var extensions = extensionState.extensions;
  var timer = createTimer(gl, extensions);

  var START_TIME = clock();
  var WIDTH = gl.drawingBufferWidth;
  var HEIGHT = gl.drawingBufferHeight;

  var contextState = {
    tick: 0,
    time: 0,
    viewportWidth: WIDTH,
    viewportHeight: HEIGHT,
    framebufferWidth: WIDTH,
    framebufferHeight: HEIGHT,
    drawingBufferWidth: WIDTH,
    drawingBufferHeight: HEIGHT,
    pixelRatio: config.pixelRatio
  };
  var uniformState = {};
  var drawState = {
    elements: null,
    primitive: 4, // GL_TRIANGLES
    count: -1,
    offset: 0,
    instances: -1
  };

  var limits = wrapLimits(gl, extensions);
  var attributeState = wrapAttributeState(
    gl,
    extensions,
    limits,
    stringStore);
  var bufferState = wrapBufferState(
    gl,
    stats$$1,
    config,
    attributeState);
  var elementState = wrapElementsState(gl, extensions, bufferState, stats$$1);
  var shaderState = wrapShaderState(gl, stringStore, stats$$1, config);
  var textureState = createTextureSet(
    gl,
    extensions,
    limits,
    function () { core.procs.poll(); },
    contextState,
    stats$$1,
    config);
  var renderbufferState = wrapRenderbuffers(gl, extensions, limits, stats$$1, config);
  var framebufferState = wrapFBOState(
    gl,
    extensions,
    limits,
    textureState,
    renderbufferState,
    stats$$1);
  var core = reglCore(
    gl,
    stringStore,
    extensions,
    limits,
    bufferState,
    elementState,
    textureState,
    framebufferState,
    uniformState,
    attributeState,
    shaderState,
    drawState,
    contextState,
    timer,
    config);
  var readPixels = wrapReadPixels(
    gl,
    framebufferState,
    core.procs.poll,
    contextState,
    glAttributes, extensions, limits);

  var nextState = core.next;
  var canvas = gl.canvas;

  var rafCallbacks = [];
  var lossCallbacks = [];
  var restoreCallbacks = [];
  var destroyCallbacks = [config.onDestroy];

  var activeRAF = null;
  function handleRAF () {
    if (rafCallbacks.length === 0) {
      if (timer) {
        timer.update();
      }
      activeRAF = null;
      return
    }

    // schedule next animation frame
    activeRAF = raf.next(handleRAF);

    // poll for changes
    poll();

    // fire a callback for all pending rafs
    for (var i = rafCallbacks.length - 1; i >= 0; --i) {
      var cb = rafCallbacks[i];
      if (cb) {
        cb(contextState, null, 0);
      }
    }

    // flush all pending webgl calls
    gl.flush();

    // poll GPU timers *after* gl.flush so we don't delay command dispatch
    if (timer) {
      timer.update();
    }
  }

  function startRAF () {
    if (!activeRAF && rafCallbacks.length > 0) {
      activeRAF = raf.next(handleRAF);
    }
  }

  function stopRAF () {
    if (activeRAF) {
      raf.cancel(handleRAF);
      activeRAF = null;
    }
  }

  function handleContextLoss (event) {
    event.preventDefault();

    // set context lost flag
    contextLost = true;

    // pause request animation frame
    stopRAF();

    // lose context
    lossCallbacks.forEach(function (cb) {
      cb();
    });
  }

  function handleContextRestored (event) {
    // clear error code
    gl.getError();

    // clear context lost flag
    contextLost = false;

    // refresh state
    extensionState.restore();
    shaderState.restore();
    bufferState.restore();
    textureState.restore();
    renderbufferState.restore();
    framebufferState.restore();
    if (timer) {
      timer.restore();
    }

    // refresh state
    core.procs.refresh();

    // restart RAF
    startRAF();

    // restore context
    restoreCallbacks.forEach(function (cb) {
      cb();
    });
  }

  if (canvas) {
    canvas.addEventListener(CONTEXT_LOST_EVENT, handleContextLoss, false);
    canvas.addEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored, false);
  }

  function destroy () {
    rafCallbacks.length = 0;
    stopRAF();

    if (canvas) {
      canvas.removeEventListener(CONTEXT_LOST_EVENT, handleContextLoss);
      canvas.removeEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored);
    }

    shaderState.clear();
    framebufferState.clear();
    renderbufferState.clear();
    textureState.clear();
    elementState.clear();
    bufferState.clear();

    if (timer) {
      timer.clear();
    }

    destroyCallbacks.forEach(function (cb) {
      cb();
    });
  }

  function compileProcedure (options) {
    check$1(!!options, 'invalid args to regl({...})');
    check$1.type(options, 'object', 'invalid args to regl({...})');

    function flattenNestedOptions (options) {
      var result = extend({}, options);
      delete result.uniforms;
      delete result.attributes;
      delete result.context;

      if ('stencil' in result && result.stencil.op) {
        result.stencil.opBack = result.stencil.opFront = result.stencil.op;
        delete result.stencil.op;
      }

      function merge (name) {
        if (name in result) {
          var child = result[name];
          delete result[name];
          Object.keys(child).forEach(function (prop) {
            result[name + '.' + prop] = child[prop];
          });
        }
      }
      merge('blend');
      merge('depth');
      merge('cull');
      merge('stencil');
      merge('polygonOffset');
      merge('scissor');
      merge('sample');

      return result
    }

    function separateDynamic (object) {
      var staticItems = {};
      var dynamicItems = {};
      Object.keys(object).forEach(function (option) {
        var value = object[option];
        if (dynamic.isDynamic(value)) {
          dynamicItems[option] = dynamic.unbox(value, option);
        } else {
          staticItems[option] = value;
        }
      });
      return {
        dynamic: dynamicItems,
        static: staticItems
      }
    }

    // Treat context variables separate from other dynamic variables
    var context = separateDynamic(options.context || {});
    var uniforms = separateDynamic(options.uniforms || {});
    var attributes = separateDynamic(options.attributes || {});
    var opts = separateDynamic(flattenNestedOptions(options));

    var stats$$1 = {
      gpuTime: 0.0,
      cpuTime: 0.0,
      count: 0
    };

    var compiled = core.compile(opts, attributes, uniforms, context, stats$$1);

    var draw = compiled.draw;
    var batch = compiled.batch;
    var scope = compiled.scope;

    // FIXME: we should modify code generation for batch commands so this
    // isn't necessary
    var EMPTY_ARRAY = [];
    function reserve (count) {
      while (EMPTY_ARRAY.length < count) {
        EMPTY_ARRAY.push(null);
      }
      return EMPTY_ARRAY
    }

    function REGLCommand (args, body) {
      var i;
      if (contextLost) {
        check$1.raise('context lost');
      }
      if (typeof args === 'function') {
        return scope.call(this, null, args, 0)
      } else if (typeof body === 'function') {
        if (typeof args === 'number') {
          for (i = 0; i < args; ++i) {
            scope.call(this, null, body, i);
          }
          return
        } else if (Array.isArray(args)) {
          for (i = 0; i < args.length; ++i) {
            scope.call(this, args[i], body, i);
          }
          return
        } else {
          return scope.call(this, args, body, 0)
        }
      } else if (typeof args === 'number') {
        if (args > 0) {
          return batch.call(this, reserve(args | 0), args | 0)
        }
      } else if (Array.isArray(args)) {
        if (args.length) {
          return batch.call(this, args, args.length)
        }
      } else {
        return draw.call(this, args)
      }
    }

    return extend(REGLCommand, {
      stats: stats$$1
    })
  }

  var setFBO = framebufferState.setFBO = compileProcedure({
    framebuffer: dynamic.define.call(null, DYN_PROP, 'framebuffer')
  });

  function clearImpl (_, options) {
    var clearFlags = 0;
    core.procs.poll();

    var c = options.color;
    if (c) {
      gl.clearColor(+c[0] || 0, +c[1] || 0, +c[2] || 0, +c[3] || 0);
      clearFlags |= GL_COLOR_BUFFER_BIT;
    }
    if ('depth' in options) {
      gl.clearDepth(+options.depth);
      clearFlags |= GL_DEPTH_BUFFER_BIT;
    }
    if ('stencil' in options) {
      gl.clearStencil(options.stencil | 0);
      clearFlags |= GL_STENCIL_BUFFER_BIT;
    }

    check$1(!!clearFlags, 'called regl.clear with no buffer specified');
    gl.clear(clearFlags);
  }

  function clear (options) {
    check$1(
      typeof options === 'object' && options,
      'regl.clear() takes an object as input');
    if ('framebuffer' in options) {
      if (options.framebuffer &&
          options.framebuffer_reglType === 'framebufferCube') {
        for (var i = 0; i < 6; ++i) {
          setFBO(extend({
            framebuffer: options.framebuffer.faces[i]
          }, options), clearImpl);
        }
      } else {
        setFBO(options, clearImpl);
      }
    } else {
      clearImpl(null, options);
    }
  }

  function frame (cb) {
    check$1.type(cb, 'function', 'regl.frame() callback must be a function');
    rafCallbacks.push(cb);

    function cancel () {
      // FIXME:  should we check something other than equals cb here?
      // what if a user calls frame twice with the same callback...
      //
      var i = find(rafCallbacks, cb);
      check$1(i >= 0, 'cannot cancel a frame twice');
      function pendingCancel () {
        var index = find(rafCallbacks, pendingCancel);
        rafCallbacks[index] = rafCallbacks[rafCallbacks.length - 1];
        rafCallbacks.length -= 1;
        if (rafCallbacks.length <= 0) {
          stopRAF();
        }
      }
      rafCallbacks[i] = pendingCancel;
    }

    startRAF();

    return {
      cancel: cancel
    }
  }

  // poll viewport
  function pollViewport () {
    var viewport = nextState.viewport;
    var scissorBox = nextState.scissor_box;
    viewport[0] = viewport[1] = scissorBox[0] = scissorBox[1] = 0;
    contextState.viewportWidth =
      contextState.framebufferWidth =
      contextState.drawingBufferWidth =
      viewport[2] =
      scissorBox[2] = gl.drawingBufferWidth;
    contextState.viewportHeight =
      contextState.framebufferHeight =
      contextState.drawingBufferHeight =
      viewport[3] =
      scissorBox[3] = gl.drawingBufferHeight;
  }

  function poll () {
    contextState.tick += 1;
    contextState.time = now();
    pollViewport();
    core.procs.poll();
  }

  function refresh () {
    pollViewport();
    core.procs.refresh();
    if (timer) {
      timer.update();
    }
  }

  function now () {
    return (clock() - START_TIME) / 1000.0
  }

  refresh();

  function addListener (event, callback) {
    check$1.type(callback, 'function', 'listener callback must be a function');

    var callbacks;
    switch (event) {
      case 'frame':
        return frame(callback)
      case 'lost':
        callbacks = lossCallbacks;
        break
      case 'restore':
        callbacks = restoreCallbacks;
        break
      case 'destroy':
        callbacks = destroyCallbacks;
        break
      default:
        check$1.raise('invalid event, must be one of frame,lost,restore,destroy');
    }

    callbacks.push(callback);
    return {
      cancel: function () {
        for (var i = 0; i < callbacks.length; ++i) {
          if (callbacks[i] === callback) {
            callbacks[i] = callbacks[callbacks.length - 1];
            callbacks.pop();
            return
          }
        }
      }
    }
  }

  var regl = extend(compileProcedure, {
    // Clear current FBO
    clear: clear,

    // Short cuts for dynamic variables
    prop: dynamic.define.bind(null, DYN_PROP),
    context: dynamic.define.bind(null, DYN_CONTEXT),
    this: dynamic.define.bind(null, DYN_STATE),

    // executes an empty draw command
    draw: compileProcedure({}),

    // Resources
    buffer: function (options) {
      return bufferState.create(options, GL_ARRAY_BUFFER, false, false)
    },
    elements: function (options) {
      return elementState.create(options, false)
    },
    texture: textureState.create2D,
    cube: textureState.createCube,
    renderbuffer: renderbufferState.create,
    framebuffer: framebufferState.create,
    framebufferCube: framebufferState.createCube,

    // Expose context attributes
    attributes: glAttributes,

    // Frame rendering
    frame: frame,
    on: addListener,

    // System limits
    limits: limits,
    hasExtension: function (name) {
      return limits.extensions.indexOf(name.toLowerCase()) >= 0
    },

    // Read pixels
    read: readPixels,

    // Destroy regl and all associated resources
    destroy: destroy,

    // Direct GL state manipulation
    _gl: gl,
    _refresh: refresh,

    poll: function () {
      poll();
      if (timer) {
        timer.update();
      }
    },

    // Current time
    now: now,

    // regl Statistics Information
    stats: stats$$1
  });

  config.onDone(null, regl);

  return regl
}

return wrapREGL;

})));


},{}],16:[function(require,module,exports){
'use strict'

var parseUnit = require('parse-unit')

module.exports = toPX

var PIXELS_PER_INCH = 96

function getPropertyInPX(element, prop) {
  var parts = parseUnit(getComputedStyle(element).getPropertyValue(prop))
  return parts[0] * toPX(parts[1], element)
}

//This brutal hack is needed
function getSizeBrutal(unit, element) {
  var testDIV = document.createElement('div')
  testDIV.style['font-size'] = '128' + unit
  element.appendChild(testDIV)
  var size = getPropertyInPX(testDIV, 'font-size') / 128
  element.removeChild(testDIV)
  return size
}

function toPX(str, element) {
  element = element || document.body
  str = (str || 'px').trim().toLowerCase()
  if(element === window || element === document) {
    element = document.body 
  }
  switch(str) {
    case '%':  //Ambiguous, not sure if we should use width or height
      return element.clientHeight / 100.0
    case 'ch':
    case 'ex':
      return getSizeBrutal(str, element)
    case 'em':
      return getPropertyInPX(element, 'font-size')
    case 'rem':
      return getPropertyInPX(document.body, 'font-size')
    case 'vw':
      return window.innerWidth/100
    case 'vh':
      return window.innerHeight/100
    case 'vmin':
      return Math.min(window.innerWidth, window.innerHeight) / 100
    case 'vmax':
      return Math.max(window.innerWidth, window.innerHeight) / 100
    case 'in':
      return PIXELS_PER_INCH
    case 'cm':
      return PIXELS_PER_INCH / 2.54
    case 'mm':
      return PIXELS_PER_INCH / 25.4
    case 'pt':
      return PIXELS_PER_INCH / 72
    case 'pc':
      return PIXELS_PER_INCH / 6
  }
  return 1
}
},{"parse-unit":13}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2RlcHMtYnVuZGxlLmpzIiwibm9kZV9tb2R1bGVzL2dsLW1hdDQvaWRlbnRpdHkuanMiLCJub2RlX21vZHVsZXMvZ2wtbWF0NC9sb29rQXQuanMiLCJub2RlX21vZHVsZXMvZ2wtbWF0NC9wZXJzcGVjdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXRyaXgvZGlzdC9nbC1tYXRyaXguanMiLCJub2RlX21vZHVsZXMvaXNvc3VyZmFjZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pc29zdXJmYWNlL2xpYi9tYXJjaGluZ2N1YmVzLmpzIiwibm9kZV9tb2R1bGVzL2lzb3N1cmZhY2UvbGliL21hcmNoaW5ndGV0cmFoZWRyYS5qcyIsIm5vZGVfbW9kdWxlcy9pc29zdXJmYWNlL2xpYi9zdXJmYWNlbmV0cy5qcyIsIm5vZGVfbW9kdWxlcy9tb3VzZS1jaGFuZ2UvbW91c2UtbGlzdGVuLmpzIiwibm9kZV9tb2R1bGVzL21vdXNlLWV2ZW50L21vdXNlLmpzIiwibm9kZV9tb2R1bGVzL21vdXNlLXdoZWVsL3doZWVsLmpzIiwibm9kZV9tb2R1bGVzL3BhcnNlLXVuaXQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVnbC1jYW1lcmEvcmVnbC1jYW1lcmEuanMiLCJub2RlX21vZHVsZXMvcmVnbC9kaXN0L3JlZ2wuanMiLCJub2RlX21vZHVsZXMvdG8tcHgvdG9weC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2g3U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XG5mdW5jdGlvbiBfX2V4cG9ydChtKSB7XG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xufVxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHJlZ2xfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwicmVnbFwiKSk7XG5leHBvcnRzLlJlZ2wgPSByZWdsXzEuZGVmYXVsdDtcbnZhciByZWdsX2NhbWVyYV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJyZWdsLWNhbWVyYVwiKSk7XG5leHBvcnRzLm1ha2VDYW1lcmEgPSByZWdsX2NhbWVyYV8xLmRlZmF1bHQ7XG5fX2V4cG9ydChyZXF1aXJlKFwiaXNvc3VyZmFjZVwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiZ2wtbWF0cml4XCIpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVpHVndjeTFpZFc1a2JHVXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOWtaWEJ6TFdKMWJtUnNaUzUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenRCUVVGQkxEaERRVUYzUWp0QlFVMXdRaXhsUVU1SExHTkJRVWtzUTBGTlNEdEJRVXhTTERSRVFVRnhRenRCUVUxcVF5eHhRa0ZPUnl4eFFrRkJWU3hEUVUxSU8wRkJUR1FzWjBOQlFUSkNPMEZCUXpOQ0xDdENRVUV3UWlKOSIsIm1vZHVsZS5leHBvcnRzID0gaWRlbnRpdHk7XG5cbi8qKlxuICogU2V0IGEgbWF0NCB0byB0aGUgaWRlbnRpdHkgbWF0cml4XG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkob3V0KSB7XG4gICAgb3V0WzBdID0gMTtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAwO1xuICAgIG91dFs1XSA9IDE7XG4gICAgb3V0WzZdID0gMDtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IDA7XG4gICAgb3V0WzldID0gMDtcbiAgICBvdXRbMTBdID0gMTtcbiAgICBvdXRbMTFdID0gMDtcbiAgICBvdXRbMTJdID0gMDtcbiAgICBvdXRbMTNdID0gMDtcbiAgICBvdXRbMTRdID0gMDtcbiAgICBvdXRbMTVdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufTsiLCJ2YXIgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbG9va0F0O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIGxvb2stYXQgbWF0cml4IHdpdGggdGhlIGdpdmVuIGV5ZSBwb3NpdGlvbiwgZm9jYWwgcG9pbnQsIGFuZCB1cCBheGlzXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xuICogQHBhcmFtIHt2ZWMzfSBleWUgUG9zaXRpb24gb2YgdGhlIHZpZXdlclxuICogQHBhcmFtIHt2ZWMzfSBjZW50ZXIgUG9pbnQgdGhlIHZpZXdlciBpcyBsb29raW5nIGF0XG4gKiBAcGFyYW0ge3ZlYzN9IHVwIHZlYzMgcG9pbnRpbmcgdXBcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xuZnVuY3Rpb24gbG9va0F0KG91dCwgZXllLCBjZW50ZXIsIHVwKSB7XG4gICAgdmFyIHgwLCB4MSwgeDIsIHkwLCB5MSwgeTIsIHowLCB6MSwgejIsIGxlbixcbiAgICAgICAgZXlleCA9IGV5ZVswXSxcbiAgICAgICAgZXlleSA9IGV5ZVsxXSxcbiAgICAgICAgZXlleiA9IGV5ZVsyXSxcbiAgICAgICAgdXB4ID0gdXBbMF0sXG4gICAgICAgIHVweSA9IHVwWzFdLFxuICAgICAgICB1cHogPSB1cFsyXSxcbiAgICAgICAgY2VudGVyeCA9IGNlbnRlclswXSxcbiAgICAgICAgY2VudGVyeSA9IGNlbnRlclsxXSxcbiAgICAgICAgY2VudGVyeiA9IGNlbnRlclsyXTtcblxuICAgIGlmIChNYXRoLmFicyhleWV4IC0gY2VudGVyeCkgPCAwLjAwMDAwMSAmJlxuICAgICAgICBNYXRoLmFicyhleWV5IC0gY2VudGVyeSkgPCAwLjAwMDAwMSAmJlxuICAgICAgICBNYXRoLmFicyhleWV6IC0gY2VudGVyeikgPCAwLjAwMDAwMSkge1xuICAgICAgICByZXR1cm4gaWRlbnRpdHkob3V0KTtcbiAgICB9XG5cbiAgICB6MCA9IGV5ZXggLSBjZW50ZXJ4O1xuICAgIHoxID0gZXlleSAtIGNlbnRlcnk7XG4gICAgejIgPSBleWV6IC0gY2VudGVyejtcblxuICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQoejAgKiB6MCArIHoxICogejEgKyB6MiAqIHoyKTtcbiAgICB6MCAqPSBsZW47XG4gICAgejEgKj0gbGVuO1xuICAgIHoyICo9IGxlbjtcblxuICAgIHgwID0gdXB5ICogejIgLSB1cHogKiB6MTtcbiAgICB4MSA9IHVweiAqIHowIC0gdXB4ICogejI7XG4gICAgeDIgPSB1cHggKiB6MSAtIHVweSAqIHowO1xuICAgIGxlbiA9IE1hdGguc3FydCh4MCAqIHgwICsgeDEgKiB4MSArIHgyICogeDIpO1xuICAgIGlmICghbGVuKSB7XG4gICAgICAgIHgwID0gMDtcbiAgICAgICAgeDEgPSAwO1xuICAgICAgICB4MiA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGVuID0gMSAvIGxlbjtcbiAgICAgICAgeDAgKj0gbGVuO1xuICAgICAgICB4MSAqPSBsZW47XG4gICAgICAgIHgyICo9IGxlbjtcbiAgICB9XG5cbiAgICB5MCA9IHoxICogeDIgLSB6MiAqIHgxO1xuICAgIHkxID0gejIgKiB4MCAtIHowICogeDI7XG4gICAgeTIgPSB6MCAqIHgxIC0gejEgKiB4MDtcblxuICAgIGxlbiA9IE1hdGguc3FydCh5MCAqIHkwICsgeTEgKiB5MSArIHkyICogeTIpO1xuICAgIGlmICghbGVuKSB7XG4gICAgICAgIHkwID0gMDtcbiAgICAgICAgeTEgPSAwO1xuICAgICAgICB5MiA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGVuID0gMSAvIGxlbjtcbiAgICAgICAgeTAgKj0gbGVuO1xuICAgICAgICB5MSAqPSBsZW47XG4gICAgICAgIHkyICo9IGxlbjtcbiAgICB9XG5cbiAgICBvdXRbMF0gPSB4MDtcbiAgICBvdXRbMV0gPSB5MDtcbiAgICBvdXRbMl0gPSB6MDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IHgxO1xuICAgIG91dFs1XSA9IHkxO1xuICAgIG91dFs2XSA9IHoxO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0geDI7XG4gICAgb3V0WzldID0geTI7XG4gICAgb3V0WzEwXSA9IHoyO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSAtKHgwICogZXlleCArIHgxICogZXlleSArIHgyICogZXlleik7XG4gICAgb3V0WzEzXSA9IC0oeTAgKiBleWV4ICsgeTEgKiBleWV5ICsgeTIgKiBleWV6KTtcbiAgICBvdXRbMTRdID0gLSh6MCAqIGV5ZXggKyB6MSAqIGV5ZXkgKyB6MiAqIGV5ZXopO1xuICAgIG91dFsxNV0gPSAxO1xuXG4gICAgcmV0dXJuIG91dDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBwZXJzcGVjdGl2ZTtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBwZXJzcGVjdGl2ZSBwcm9qZWN0aW9uIG1hdHJpeCB3aXRoIHRoZSBnaXZlbiBib3VuZHNcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IGZydXN0dW0gbWF0cml4IHdpbGwgYmUgd3JpdHRlbiBpbnRvXG4gKiBAcGFyYW0ge251bWJlcn0gZm92eSBWZXJ0aWNhbCBmaWVsZCBvZiB2aWV3IGluIHJhZGlhbnNcbiAqIEBwYXJhbSB7bnVtYmVyfSBhc3BlY3QgQXNwZWN0IHJhdGlvLiB0eXBpY2FsbHkgdmlld3BvcnQgd2lkdGgvaGVpZ2h0XG4gKiBAcGFyYW0ge251bWJlcn0gbmVhciBOZWFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge251bWJlcn0gZmFyIEZhciBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5mdW5jdGlvbiBwZXJzcGVjdGl2ZShvdXQsIGZvdnksIGFzcGVjdCwgbmVhciwgZmFyKSB7XG4gICAgdmFyIGYgPSAxLjAgLyBNYXRoLnRhbihmb3Z5IC8gMiksXG4gICAgICAgIG5mID0gMSAvIChuZWFyIC0gZmFyKTtcbiAgICBvdXRbMF0gPSBmIC8gYXNwZWN0O1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gZjtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gMDtcbiAgICBvdXRbOV0gPSAwO1xuICAgIG91dFsxMF0gPSAoZmFyICsgbmVhcikgKiBuZjtcbiAgICBvdXRbMTFdID0gLTE7XG4gICAgb3V0WzEyXSA9IDA7XG4gICAgb3V0WzEzXSA9IDA7XG4gICAgb3V0WzE0XSA9ICgyICogZmFyICogbmVhcikgKiBuZjtcbiAgICBvdXRbMTVdID0gMDtcbiAgICByZXR1cm4gb3V0O1xufTsiLCIvKiFcbkBmaWxlb3ZlcnZpZXcgZ2wtbWF0cml4IC0gSGlnaCBwZXJmb3JtYW5jZSBtYXRyaXggYW5kIHZlY3RvciBvcGVyYXRpb25zXG5AYXV0aG9yIEJyYW5kb24gSm9uZXNcbkBhdXRob3IgQ29saW4gTWFjS2VuemllIElWXG5AdmVyc2lvbiAyLjcuMFxuXG5Db3B5cmlnaHQgKGMpIDIwMTUtMjAxOCwgQnJhbmRvbiBKb25lcywgQ29saW4gTWFjS2VuemllIElWLlxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG5hbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG5USEUgU09GVFdBUkUuXG5cbiovXG4hZnVuY3Rpb24odCxuKXtpZihcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZSltb2R1bGUuZXhwb3J0cz1uKCk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKFtdLG4pO2Vsc2V7dmFyIHI9bigpO2Zvcih2YXIgYSBpbiByKShcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzOnQpW2FdPXJbYV19fShcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOnRoaXMsZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7dmFyIG49e307ZnVuY3Rpb24gcihhKXtpZihuW2FdKXJldHVybiBuW2FdLmV4cG9ydHM7dmFyIGU9blthXT17aTphLGw6ITEsZXhwb3J0czp7fX07cmV0dXJuIHRbYV0uY2FsbChlLmV4cG9ydHMsZSxlLmV4cG9ydHMsciksZS5sPSEwLGUuZXhwb3J0c31yZXR1cm4gci5tPXQsci5jPW4sci5kPWZ1bmN0aW9uKHQsbixhKXtyLm8odCxuKXx8T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsbix7ZW51bWVyYWJsZTohMCxnZXQ6YX0pfSxyLnI9ZnVuY3Rpb24odCl7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFN5bWJvbCYmU3ltYm9sLnRvU3RyaW5nVGFnJiZPYmplY3QuZGVmaW5lUHJvcGVydHkodCxTeW1ib2wudG9TdHJpbmdUYWcse3ZhbHVlOlwiTW9kdWxlXCJ9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0sci50PWZ1bmN0aW9uKHQsbil7aWYoMSZuJiYodD1yKHQpKSw4Jm4pcmV0dXJuIHQ7aWYoNCZuJiZcIm9iamVjdFwiPT10eXBlb2YgdCYmdCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O3ZhciBhPU9iamVjdC5jcmVhdGUobnVsbCk7aWYoci5yKGEpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhLFwiZGVmYXVsdFwiLHtlbnVtZXJhYmxlOiEwLHZhbHVlOnR9KSwyJm4mJlwic3RyaW5nXCIhPXR5cGVvZiB0KWZvcih2YXIgZSBpbiB0KXIuZChhLGUsZnVuY3Rpb24obil7cmV0dXJuIHRbbl19LmJpbmQobnVsbCxlKSk7cmV0dXJuIGF9LHIubj1mdW5jdGlvbih0KXt2YXIgbj10JiZ0Ll9fZXNNb2R1bGU/ZnVuY3Rpb24oKXtyZXR1cm4gdC5kZWZhdWx0fTpmdW5jdGlvbigpe3JldHVybiB0fTtyZXR1cm4gci5kKG4sXCJhXCIsbiksbn0sci5vPWZ1bmN0aW9uKHQsbil7cmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG4pfSxyLnA9XCJcIixyKHIucz0xMCl9KFtmdW5jdGlvbih0LG4scil7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksbi5zZXRNYXRyaXhBcnJheVR5cGU9ZnVuY3Rpb24odCl7bi5BUlJBWV9UWVBFPXR9LG4udG9SYWRpYW49ZnVuY3Rpb24odCl7cmV0dXJuIHQqZX0sbi5lcXVhbHM9ZnVuY3Rpb24odCxuKXtyZXR1cm4gTWF0aC5hYnModC1uKTw9YSpNYXRoLm1heCgxLE1hdGguYWJzKHQpLE1hdGguYWJzKG4pKX07dmFyIGE9bi5FUFNJTE9OPTFlLTY7bi5BUlJBWV9UWVBFPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBGbG9hdDMyQXJyYXk/RmxvYXQzMkFycmF5OkFycmF5LG4uUkFORE9NPU1hdGgucmFuZG9tO3ZhciBlPU1hdGguUEkvMTgwfSxmdW5jdGlvbih0LG4scil7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksbi5mb3JFYWNoPW4uc3FyTGVuPW4ubGVuPW4uc3FyRGlzdD1uLmRpc3Q9bi5kaXY9bi5tdWw9bi5zdWI9dm9pZCAwLG4uY3JlYXRlPWUsbi5jbG9uZT1mdW5jdGlvbih0KXt2YXIgbj1uZXcgYS5BUlJBWV9UWVBFKDQpO3JldHVybiBuWzBdPXRbMF0sblsxXT10WzFdLG5bMl09dFsyXSxuWzNdPXRbM10sbn0sbi5mcm9tVmFsdWVzPWZ1bmN0aW9uKHQsbixyLGUpe3ZhciB1PW5ldyBhLkFSUkFZX1RZUEUoNCk7cmV0dXJuIHVbMF09dCx1WzFdPW4sdVsyXT1yLHVbM109ZSx1fSxuLmNvcHk9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdFswXT1uWzBdLHRbMV09blsxXSx0WzJdPW5bMl0sdFszXT1uWzNdLHR9LG4uc2V0PWZ1bmN0aW9uKHQsbixyLGEsZSl7cmV0dXJuIHRbMF09bix0WzFdPXIsdFsyXT1hLHRbM109ZSx0fSxuLmFkZD1mdW5jdGlvbih0LG4scil7cmV0dXJuIHRbMF09blswXStyWzBdLHRbMV09blsxXStyWzFdLHRbMl09blsyXStyWzJdLHRbM109blszXStyWzNdLHR9LG4uc3VidHJhY3Q9dSxuLm11bHRpcGx5PW8sbi5kaXZpZGU9aSxuLmNlaWw9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdFswXT1NYXRoLmNlaWwoblswXSksdFsxXT1NYXRoLmNlaWwoblsxXSksdFsyXT1NYXRoLmNlaWwoblsyXSksdFszXT1NYXRoLmNlaWwoblszXSksdH0sbi5mbG9vcj1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPU1hdGguZmxvb3IoblswXSksdFsxXT1NYXRoLmZsb29yKG5bMV0pLHRbMl09TWF0aC5mbG9vcihuWzJdKSx0WzNdPU1hdGguZmxvb3IoblszXSksdH0sbi5taW49ZnVuY3Rpb24odCxuLHIpe3JldHVybiB0WzBdPU1hdGgubWluKG5bMF0sclswXSksdFsxXT1NYXRoLm1pbihuWzFdLHJbMV0pLHRbMl09TWF0aC5taW4oblsyXSxyWzJdKSx0WzNdPU1hdGgubWluKG5bM10sclszXSksdH0sbi5tYXg9ZnVuY3Rpb24odCxuLHIpe3JldHVybiB0WzBdPU1hdGgubWF4KG5bMF0sclswXSksdFsxXT1NYXRoLm1heChuWzFdLHJbMV0pLHRbMl09TWF0aC5tYXgoblsyXSxyWzJdKSx0WzNdPU1hdGgubWF4KG5bM10sclszXSksdH0sbi5yb3VuZD1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPU1hdGgucm91bmQoblswXSksdFsxXT1NYXRoLnJvdW5kKG5bMV0pLHRbMl09TWF0aC5yb3VuZChuWzJdKSx0WzNdPU1hdGgucm91bmQoblszXSksdH0sbi5zY2FsZT1mdW5jdGlvbih0LG4scil7cmV0dXJuIHRbMF09blswXSpyLHRbMV09blsxXSpyLHRbMl09blsyXSpyLHRbM109blszXSpyLHR9LG4uc2NhbGVBbmRBZGQ9ZnVuY3Rpb24odCxuLHIsYSl7cmV0dXJuIHRbMF09blswXStyWzBdKmEsdFsxXT1uWzFdK3JbMV0qYSx0WzJdPW5bMl0rclsyXSphLHRbM109blszXStyWzNdKmEsdH0sbi5kaXN0YW5jZT1zLG4uc3F1YXJlZERpc3RhbmNlPWMsbi5sZW5ndGg9ZixuLnNxdWFyZWRMZW5ndGg9TSxuLm5lZ2F0ZT1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPS1uWzBdLHRbMV09LW5bMV0sdFsyXT0tblsyXSx0WzNdPS1uWzNdLHR9LG4uaW52ZXJzZT1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPTEvblswXSx0WzFdPTEvblsxXSx0WzJdPTEvblsyXSx0WzNdPTEvblszXSx0fSxuLm5vcm1hbGl6ZT1mdW5jdGlvbih0LG4pe3ZhciByPW5bMF0sYT1uWzFdLGU9blsyXSx1PW5bM10sbz1yKnIrYSphK2UqZSt1KnU7bz4wJiYobz0xL01hdGguc3FydChvKSx0WzBdPXIqbyx0WzFdPWEqbyx0WzJdPWUqbyx0WzNdPXUqbyk7cmV0dXJuIHR9LG4uZG90PWZ1bmN0aW9uKHQsbil7cmV0dXJuIHRbMF0qblswXSt0WzFdKm5bMV0rdFsyXSpuWzJdK3RbM10qblszXX0sbi5sZXJwPWZ1bmN0aW9uKHQsbixyLGEpe3ZhciBlPW5bMF0sdT1uWzFdLG89blsyXSxpPW5bM107cmV0dXJuIHRbMF09ZSthKihyWzBdLWUpLHRbMV09dSthKihyWzFdLXUpLHRbMl09bythKihyWzJdLW8pLHRbM109aSthKihyWzNdLWkpLHR9LG4ucmFuZG9tPWZ1bmN0aW9uKHQsbil7dmFyIHIsZSx1LG8saSxzO249bnx8MTtkb3tyPTIqYS5SQU5ET00oKS0xLGU9MiphLlJBTkRPTSgpLTEsaT1yKnIrZSplfXdoaWxlKGk+PTEpO2Rve3U9MiphLlJBTkRPTSgpLTEsbz0yKmEuUkFORE9NKCktMSxzPXUqdStvKm99d2hpbGUocz49MSk7dmFyIGM9TWF0aC5zcXJ0KCgxLWkpL3MpO3JldHVybiB0WzBdPW4qcix0WzFdPW4qZSx0WzJdPW4qdSpjLHRbM109bipvKmMsdH0sbi50cmFuc2Zvcm1NYXQ0PWZ1bmN0aW9uKHQsbixyKXt2YXIgYT1uWzBdLGU9blsxXSx1PW5bMl0sbz1uWzNdO3JldHVybiB0WzBdPXJbMF0qYStyWzRdKmUrcls4XSp1K3JbMTJdKm8sdFsxXT1yWzFdKmErcls1XSplK3JbOV0qdStyWzEzXSpvLHRbMl09clsyXSphK3JbNl0qZStyWzEwXSp1K3JbMTRdKm8sdFszXT1yWzNdKmErcls3XSplK3JbMTFdKnUrclsxNV0qbyx0fSxuLnRyYW5zZm9ybVF1YXQ9ZnVuY3Rpb24odCxuLHIpe3ZhciBhPW5bMF0sZT1uWzFdLHU9blsyXSxvPXJbMF0saT1yWzFdLHM9clsyXSxjPXJbM10sZj1jKmEraSp1LXMqZSxNPWMqZStzKmEtbyp1LGg9Yyp1K28qZS1pKmEsbD0tbyphLWkqZS1zKnU7cmV0dXJuIHRbMF09ZipjK2wqLW8rTSotcy1oKi1pLHRbMV09TSpjK2wqLWkraCotby1mKi1zLHRbMl09aCpjK2wqLXMrZiotaS1NKi1vLHRbM109blszXSx0fSxuLnN0cj1mdW5jdGlvbih0KXtyZXR1cm5cInZlYzQoXCIrdFswXStcIiwgXCIrdFsxXStcIiwgXCIrdFsyXStcIiwgXCIrdFszXStcIilcIn0sbi5leGFjdEVxdWFscz1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPT09blswXSYmdFsxXT09PW5bMV0mJnRbMl09PT1uWzJdJiZ0WzNdPT09blszXX0sbi5lcXVhbHM9ZnVuY3Rpb24odCxuKXt2YXIgcj10WzBdLGU9dFsxXSx1PXRbMl0sbz10WzNdLGk9blswXSxzPW5bMV0sYz1uWzJdLGY9blszXTtyZXR1cm4gTWF0aC5hYnMoci1pKTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnMociksTWF0aC5hYnMoaSkpJiZNYXRoLmFicyhlLXMpPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyhlKSxNYXRoLmFicyhzKSkmJk1hdGguYWJzKHUtYyk8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKHUpLE1hdGguYWJzKGMpKSYmTWF0aC5hYnMoby1mKTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnMobyksTWF0aC5hYnMoZikpfTt2YXIgYT1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7dmFyIG49e307aWYobnVsbCE9dClmb3IodmFyIHIgaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxyKSYmKG5bcl09dFtyXSk7cmV0dXJuIG4uZGVmYXVsdD10LG59KHIoMCkpO2Z1bmN0aW9uIGUoKXt2YXIgdD1uZXcgYS5BUlJBWV9UWVBFKDQpO3JldHVybiBhLkFSUkFZX1RZUEUhPUZsb2F0MzJBcnJheSYmKHRbMF09MCx0WzFdPTAsdFsyXT0wLHRbM109MCksdH1mdW5jdGlvbiB1KHQsbixyKXtyZXR1cm4gdFswXT1uWzBdLXJbMF0sdFsxXT1uWzFdLXJbMV0sdFsyXT1uWzJdLXJbMl0sdFszXT1uWzNdLXJbM10sdH1mdW5jdGlvbiBvKHQsbixyKXtyZXR1cm4gdFswXT1uWzBdKnJbMF0sdFsxXT1uWzFdKnJbMV0sdFsyXT1uWzJdKnJbMl0sdFszXT1uWzNdKnJbM10sdH1mdW5jdGlvbiBpKHQsbixyKXtyZXR1cm4gdFswXT1uWzBdL3JbMF0sdFsxXT1uWzFdL3JbMV0sdFsyXT1uWzJdL3JbMl0sdFszXT1uWzNdL3JbM10sdH1mdW5jdGlvbiBzKHQsbil7dmFyIHI9blswXS10WzBdLGE9blsxXS10WzFdLGU9blsyXS10WzJdLHU9blszXS10WzNdO3JldHVybiBNYXRoLnNxcnQocipyK2EqYStlKmUrdSp1KX1mdW5jdGlvbiBjKHQsbil7dmFyIHI9blswXS10WzBdLGE9blsxXS10WzFdLGU9blsyXS10WzJdLHU9blszXS10WzNdO3JldHVybiByKnIrYSphK2UqZSt1KnV9ZnVuY3Rpb24gZih0KXt2YXIgbj10WzBdLHI9dFsxXSxhPXRbMl0sZT10WzNdO3JldHVybiBNYXRoLnNxcnQobipuK3IqcithKmErZSplKX1mdW5jdGlvbiBNKHQpe3ZhciBuPXRbMF0scj10WzFdLGE9dFsyXSxlPXRbM107cmV0dXJuIG4qbityKnIrYSphK2UqZX1uLnN1Yj11LG4ubXVsPW8sbi5kaXY9aSxuLmRpc3Q9cyxuLnNxckRpc3Q9YyxuLmxlbj1mLG4uc3FyTGVuPU0sbi5mb3JFYWNoPWZ1bmN0aW9uKCl7dmFyIHQ9ZSgpO3JldHVybiBmdW5jdGlvbihuLHIsYSxlLHUsbyl7dmFyIGk9dm9pZCAwLHM9dm9pZCAwO2ZvcihyfHwocj00KSxhfHwoYT0wKSxzPWU/TWF0aC5taW4oZSpyK2Esbi5sZW5ndGgpOm4ubGVuZ3RoLGk9YTtpPHM7aSs9cil0WzBdPW5baV0sdFsxXT1uW2krMV0sdFsyXT1uW2krMl0sdFszXT1uW2krM10sdSh0LHQsbyksbltpXT10WzBdLG5baSsxXT10WzFdLG5baSsyXT10WzJdLG5baSszXT10WzNdO3JldHVybiBufX0oKX0sZnVuY3Rpb24odCxuLHIpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLG4uZm9yRWFjaD1uLnNxckxlbj1uLmxlbj1uLnNxckRpc3Q9bi5kaXN0PW4uZGl2PW4ubXVsPW4uc3ViPXZvaWQgMCxuLmNyZWF0ZT1lLG4uY2xvbmU9ZnVuY3Rpb24odCl7dmFyIG49bmV3IGEuQVJSQVlfVFlQRSgzKTtyZXR1cm4gblswXT10WzBdLG5bMV09dFsxXSxuWzJdPXRbMl0sbn0sbi5sZW5ndGg9dSxuLmZyb21WYWx1ZXM9byxuLmNvcHk9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdFswXT1uWzBdLHRbMV09blsxXSx0WzJdPW5bMl0sdH0sbi5zZXQ9ZnVuY3Rpb24odCxuLHIsYSl7cmV0dXJuIHRbMF09bix0WzFdPXIsdFsyXT1hLHR9LG4uYWRkPWZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gdFswXT1uWzBdK3JbMF0sdFsxXT1uWzFdK3JbMV0sdFsyXT1uWzJdK3JbMl0sdH0sbi5zdWJ0cmFjdD1pLG4ubXVsdGlwbHk9cyxuLmRpdmlkZT1jLG4uY2VpbD1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPU1hdGguY2VpbChuWzBdKSx0WzFdPU1hdGguY2VpbChuWzFdKSx0WzJdPU1hdGguY2VpbChuWzJdKSx0fSxuLmZsb29yPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHRbMF09TWF0aC5mbG9vcihuWzBdKSx0WzFdPU1hdGguZmxvb3IoblsxXSksdFsyXT1NYXRoLmZsb29yKG5bMl0pLHR9LG4ubWluPWZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gdFswXT1NYXRoLm1pbihuWzBdLHJbMF0pLHRbMV09TWF0aC5taW4oblsxXSxyWzFdKSx0WzJdPU1hdGgubWluKG5bMl0sclsyXSksdH0sbi5tYXg9ZnVuY3Rpb24odCxuLHIpe3JldHVybiB0WzBdPU1hdGgubWF4KG5bMF0sclswXSksdFsxXT1NYXRoLm1heChuWzFdLHJbMV0pLHRbMl09TWF0aC5tYXgoblsyXSxyWzJdKSx0fSxuLnJvdW5kPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHRbMF09TWF0aC5yb3VuZChuWzBdKSx0WzFdPU1hdGgucm91bmQoblsxXSksdFsyXT1NYXRoLnJvdW5kKG5bMl0pLHR9LG4uc2NhbGU9ZnVuY3Rpb24odCxuLHIpe3JldHVybiB0WzBdPW5bMF0qcix0WzFdPW5bMV0qcix0WzJdPW5bMl0qcix0fSxuLnNjYWxlQW5kQWRkPWZ1bmN0aW9uKHQsbixyLGEpe3JldHVybiB0WzBdPW5bMF0rclswXSphLHRbMV09blsxXStyWzFdKmEsdFsyXT1uWzJdK3JbMl0qYSx0fSxuLmRpc3RhbmNlPWYsbi5zcXVhcmVkRGlzdGFuY2U9TSxuLnNxdWFyZWRMZW5ndGg9aCxuLm5lZ2F0ZT1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPS1uWzBdLHRbMV09LW5bMV0sdFsyXT0tblsyXSx0fSxuLmludmVyc2U9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdFswXT0xL25bMF0sdFsxXT0xL25bMV0sdFsyXT0xL25bMl0sdH0sbi5ub3JtYWxpemU9bCxuLmRvdD12LG4uY3Jvc3M9ZnVuY3Rpb24odCxuLHIpe3ZhciBhPW5bMF0sZT1uWzFdLHU9blsyXSxvPXJbMF0saT1yWzFdLHM9clsyXTtyZXR1cm4gdFswXT1lKnMtdSppLHRbMV09dSpvLWEqcyx0WzJdPWEqaS1lKm8sdH0sbi5sZXJwPWZ1bmN0aW9uKHQsbixyLGEpe3ZhciBlPW5bMF0sdT1uWzFdLG89blsyXTtyZXR1cm4gdFswXT1lK2EqKHJbMF0tZSksdFsxXT11K2EqKHJbMV0tdSksdFsyXT1vK2EqKHJbMl0tbyksdH0sbi5oZXJtaXRlPWZ1bmN0aW9uKHQsbixyLGEsZSx1KXt2YXIgbz11KnUsaT1vKigyKnUtMykrMSxzPW8qKHUtMikrdSxjPW8qKHUtMSksZj1vKigzLTIqdSk7cmV0dXJuIHRbMF09blswXSppK3JbMF0qcythWzBdKmMrZVswXSpmLHRbMV09blsxXSppK3JbMV0qcythWzFdKmMrZVsxXSpmLHRbMl09blsyXSppK3JbMl0qcythWzJdKmMrZVsyXSpmLHR9LG4uYmV6aWVyPWZ1bmN0aW9uKHQsbixyLGEsZSx1KXt2YXIgbz0xLXUsaT1vKm8scz11KnUsYz1pKm8sZj0zKnUqaSxNPTMqcypvLGg9cyp1O3JldHVybiB0WzBdPW5bMF0qYytyWzBdKmYrYVswXSpNK2VbMF0qaCx0WzFdPW5bMV0qYytyWzFdKmYrYVsxXSpNK2VbMV0qaCx0WzJdPW5bMl0qYytyWzJdKmYrYVsyXSpNK2VbMl0qaCx0fSxuLnJhbmRvbT1mdW5jdGlvbih0LG4pe249bnx8MTt2YXIgcj0yKmEuUkFORE9NKCkqTWF0aC5QSSxlPTIqYS5SQU5ET00oKS0xLHU9TWF0aC5zcXJ0KDEtZSplKSpuO3JldHVybiB0WzBdPU1hdGguY29zKHIpKnUsdFsxXT1NYXRoLnNpbihyKSp1LHRbMl09ZSpuLHR9LG4udHJhbnNmb3JtTWF0ND1mdW5jdGlvbih0LG4scil7dmFyIGE9blswXSxlPW5bMV0sdT1uWzJdLG89clszXSphK3JbN10qZStyWzExXSp1K3JbMTVdO3JldHVybiBvPW98fDEsdFswXT0oclswXSphK3JbNF0qZStyWzhdKnUrclsxMl0pL28sdFsxXT0oclsxXSphK3JbNV0qZStyWzldKnUrclsxM10pL28sdFsyXT0oclsyXSphK3JbNl0qZStyWzEwXSp1K3JbMTRdKS9vLHR9LG4udHJhbnNmb3JtTWF0Mz1mdW5jdGlvbih0LG4scil7dmFyIGE9blswXSxlPW5bMV0sdT1uWzJdO3JldHVybiB0WzBdPWEqclswXStlKnJbM10rdSpyWzZdLHRbMV09YSpyWzFdK2Uqcls0XSt1KnJbN10sdFsyXT1hKnJbMl0rZSpyWzVdK3Uqcls4XSx0fSxuLnRyYW5zZm9ybVF1YXQ9ZnVuY3Rpb24odCxuLHIpe3ZhciBhPXJbMF0sZT1yWzFdLHU9clsyXSxvPXJbM10saT1uWzBdLHM9blsxXSxjPW5bMl0sZj1lKmMtdSpzLE09dSppLWEqYyxoPWEqcy1lKmksbD1lKmgtdSpNLHY9dSpmLWEqaCxkPWEqTS1lKmYsYj0yKm87cmV0dXJuIGYqPWIsTSo9YixoKj1iLGwqPTIsdio9MixkKj0yLHRbMF09aStmK2wsdFsxXT1zK00rdix0WzJdPWMraCtkLHR9LG4ucm90YXRlWD1mdW5jdGlvbih0LG4scixhKXt2YXIgZT1bXSx1PVtdO3JldHVybiBlWzBdPW5bMF0tclswXSxlWzFdPW5bMV0tclsxXSxlWzJdPW5bMl0tclsyXSx1WzBdPWVbMF0sdVsxXT1lWzFdKk1hdGguY29zKGEpLWVbMl0qTWF0aC5zaW4oYSksdVsyXT1lWzFdKk1hdGguc2luKGEpK2VbMl0qTWF0aC5jb3MoYSksdFswXT11WzBdK3JbMF0sdFsxXT11WzFdK3JbMV0sdFsyXT11WzJdK3JbMl0sdH0sbi5yb3RhdGVZPWZ1bmN0aW9uKHQsbixyLGEpe3ZhciBlPVtdLHU9W107cmV0dXJuIGVbMF09blswXS1yWzBdLGVbMV09blsxXS1yWzFdLGVbMl09blsyXS1yWzJdLHVbMF09ZVsyXSpNYXRoLnNpbihhKStlWzBdKk1hdGguY29zKGEpLHVbMV09ZVsxXSx1WzJdPWVbMl0qTWF0aC5jb3MoYSktZVswXSpNYXRoLnNpbihhKSx0WzBdPXVbMF0rclswXSx0WzFdPXVbMV0rclsxXSx0WzJdPXVbMl0rclsyXSx0fSxuLnJvdGF0ZVo9ZnVuY3Rpb24odCxuLHIsYSl7dmFyIGU9W10sdT1bXTtyZXR1cm4gZVswXT1uWzBdLXJbMF0sZVsxXT1uWzFdLXJbMV0sZVsyXT1uWzJdLXJbMl0sdVswXT1lWzBdKk1hdGguY29zKGEpLWVbMV0qTWF0aC5zaW4oYSksdVsxXT1lWzBdKk1hdGguc2luKGEpK2VbMV0qTWF0aC5jb3MoYSksdVsyXT1lWzJdLHRbMF09dVswXStyWzBdLHRbMV09dVsxXStyWzFdLHRbMl09dVsyXStyWzJdLHR9LG4uYW5nbGU9ZnVuY3Rpb24odCxuKXt2YXIgcj1vKHRbMF0sdFsxXSx0WzJdKSxhPW8oblswXSxuWzFdLG5bMl0pO2wocixyKSxsKGEsYSk7dmFyIGU9dihyLGEpO3JldHVybiBlPjE/MDplPC0xP01hdGguUEk6TWF0aC5hY29zKGUpfSxuLnN0cj1mdW5jdGlvbih0KXtyZXR1cm5cInZlYzMoXCIrdFswXStcIiwgXCIrdFsxXStcIiwgXCIrdFsyXStcIilcIn0sbi5leGFjdEVxdWFscz1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPT09blswXSYmdFsxXT09PW5bMV0mJnRbMl09PT1uWzJdfSxuLmVxdWFscz1mdW5jdGlvbih0LG4pe3ZhciByPXRbMF0sZT10WzFdLHU9dFsyXSxvPW5bMF0saT1uWzFdLHM9blsyXTtyZXR1cm4gTWF0aC5hYnMoci1vKTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnMociksTWF0aC5hYnMobykpJiZNYXRoLmFicyhlLWkpPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyhlKSxNYXRoLmFicyhpKSkmJk1hdGguYWJzKHUtcyk8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKHUpLE1hdGguYWJzKHMpKX07dmFyIGE9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O3ZhciBuPXt9O2lmKG51bGwhPXQpZm9yKHZhciByIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQscikmJihuW3JdPXRbcl0pO3JldHVybiBuLmRlZmF1bHQ9dCxufShyKDApKTtmdW5jdGlvbiBlKCl7dmFyIHQ9bmV3IGEuQVJSQVlfVFlQRSgzKTtyZXR1cm4gYS5BUlJBWV9UWVBFIT1GbG9hdDMyQXJyYXkmJih0WzBdPTAsdFsxXT0wLHRbMl09MCksdH1mdW5jdGlvbiB1KHQpe3ZhciBuPXRbMF0scj10WzFdLGE9dFsyXTtyZXR1cm4gTWF0aC5zcXJ0KG4qbityKnIrYSphKX1mdW5jdGlvbiBvKHQsbixyKXt2YXIgZT1uZXcgYS5BUlJBWV9UWVBFKDMpO3JldHVybiBlWzBdPXQsZVsxXT1uLGVbMl09cixlfWZ1bmN0aW9uIGkodCxuLHIpe3JldHVybiB0WzBdPW5bMF0tclswXSx0WzFdPW5bMV0tclsxXSx0WzJdPW5bMl0tclsyXSx0fWZ1bmN0aW9uIHModCxuLHIpe3JldHVybiB0WzBdPW5bMF0qclswXSx0WzFdPW5bMV0qclsxXSx0WzJdPW5bMl0qclsyXSx0fWZ1bmN0aW9uIGModCxuLHIpe3JldHVybiB0WzBdPW5bMF0vclswXSx0WzFdPW5bMV0vclsxXSx0WzJdPW5bMl0vclsyXSx0fWZ1bmN0aW9uIGYodCxuKXt2YXIgcj1uWzBdLXRbMF0sYT1uWzFdLXRbMV0sZT1uWzJdLXRbMl07cmV0dXJuIE1hdGguc3FydChyKnIrYSphK2UqZSl9ZnVuY3Rpb24gTSh0LG4pe3ZhciByPW5bMF0tdFswXSxhPW5bMV0tdFsxXSxlPW5bMl0tdFsyXTtyZXR1cm4gcipyK2EqYStlKmV9ZnVuY3Rpb24gaCh0KXt2YXIgbj10WzBdLHI9dFsxXSxhPXRbMl07cmV0dXJuIG4qbityKnIrYSphfWZ1bmN0aW9uIGwodCxuKXt2YXIgcj1uWzBdLGE9blsxXSxlPW5bMl0sdT1yKnIrYSphK2UqZTtyZXR1cm4gdT4wJiYodT0xL01hdGguc3FydCh1KSx0WzBdPW5bMF0qdSx0WzFdPW5bMV0qdSx0WzJdPW5bMl0qdSksdH1mdW5jdGlvbiB2KHQsbil7cmV0dXJuIHRbMF0qblswXSt0WzFdKm5bMV0rdFsyXSpuWzJdfW4uc3ViPWksbi5tdWw9cyxuLmRpdj1jLG4uZGlzdD1mLG4uc3FyRGlzdD1NLG4ubGVuPXUsbi5zcXJMZW49aCxuLmZvckVhY2g9ZnVuY3Rpb24oKXt2YXIgdD1lKCk7cmV0dXJuIGZ1bmN0aW9uKG4scixhLGUsdSxvKXt2YXIgaT12b2lkIDAscz12b2lkIDA7Zm9yKHJ8fChyPTMpLGF8fChhPTApLHM9ZT9NYXRoLm1pbihlKnIrYSxuLmxlbmd0aCk6bi5sZW5ndGgsaT1hO2k8cztpKz1yKXRbMF09bltpXSx0WzFdPW5baSsxXSx0WzJdPW5baSsyXSx1KHQsdCxvKSxuW2ldPXRbMF0sbltpKzFdPXRbMV0sbltpKzJdPXRbMl07cmV0dXJuIG59fSgpfSxmdW5jdGlvbih0LG4scil7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksbi5zZXRBeGVzPW4uc3FsZXJwPW4ucm90YXRpb25Ubz1uLmVxdWFscz1uLmV4YWN0RXF1YWxzPW4ubm9ybWFsaXplPW4uc3FyTGVuPW4uc3F1YXJlZExlbmd0aD1uLmxlbj1uLmxlbmd0aD1uLmxlcnA9bi5kb3Q9bi5zY2FsZT1uLm11bD1uLmFkZD1uLnNldD1uLmNvcHk9bi5mcm9tVmFsdWVzPW4uY2xvbmU9dm9pZCAwLG4uY3JlYXRlPXMsbi5pZGVudGl0eT1mdW5jdGlvbih0KXtyZXR1cm4gdFswXT0wLHRbMV09MCx0WzJdPTAsdFszXT0xLHR9LG4uc2V0QXhpc0FuZ2xlPWMsbi5nZXRBeGlzQW5nbGU9ZnVuY3Rpb24odCxuKXt2YXIgcj0yKk1hdGguYWNvcyhuWzNdKSxlPU1hdGguc2luKHIvMik7ZT5hLkVQU0lMT04/KHRbMF09blswXS9lLHRbMV09blsxXS9lLHRbMl09blsyXS9lKToodFswXT0xLHRbMV09MCx0WzJdPTApO3JldHVybiByfSxuLm11bHRpcGx5PWYsbi5yb3RhdGVYPWZ1bmN0aW9uKHQsbixyKXtyKj0uNTt2YXIgYT1uWzBdLGU9blsxXSx1PW5bMl0sbz1uWzNdLGk9TWF0aC5zaW4ocikscz1NYXRoLmNvcyhyKTtyZXR1cm4gdFswXT1hKnMrbyppLHRbMV09ZSpzK3UqaSx0WzJdPXUqcy1lKmksdFszXT1vKnMtYSppLHR9LG4ucm90YXRlWT1mdW5jdGlvbih0LG4scil7cio9LjU7dmFyIGE9blswXSxlPW5bMV0sdT1uWzJdLG89blszXSxpPU1hdGguc2luKHIpLHM9TWF0aC5jb3Mocik7cmV0dXJuIHRbMF09YSpzLXUqaSx0WzFdPWUqcytvKmksdFsyXT11KnMrYSppLHRbM109bypzLWUqaSx0fSxuLnJvdGF0ZVo9ZnVuY3Rpb24odCxuLHIpe3IqPS41O3ZhciBhPW5bMF0sZT1uWzFdLHU9blsyXSxvPW5bM10saT1NYXRoLnNpbihyKSxzPU1hdGguY29zKHIpO3JldHVybiB0WzBdPWEqcytlKmksdFsxXT1lKnMtYSppLHRbMl09dSpzK28qaSx0WzNdPW8qcy11KmksdH0sbi5jYWxjdWxhdGVXPWZ1bmN0aW9uKHQsbil7dmFyIHI9blswXSxhPW5bMV0sZT1uWzJdO3JldHVybiB0WzBdPXIsdFsxXT1hLHRbMl09ZSx0WzNdPU1hdGguc3FydChNYXRoLmFicygxLXIqci1hKmEtZSplKSksdH0sbi5zbGVycD1NLG4ucmFuZG9tPWZ1bmN0aW9uKHQpe3ZhciBuPWEuUkFORE9NKCkscj1hLlJBTkRPTSgpLGU9YS5SQU5ET00oKSx1PU1hdGguc3FydCgxLW4pLG89TWF0aC5zcXJ0KG4pO3JldHVybiB0WzBdPXUqTWF0aC5zaW4oMipNYXRoLlBJKnIpLHRbMV09dSpNYXRoLmNvcygyKk1hdGguUEkqciksdFsyXT1vKk1hdGguc2luKDIqTWF0aC5QSSplKSx0WzNdPW8qTWF0aC5jb3MoMipNYXRoLlBJKmUpLHR9LG4uaW52ZXJ0PWZ1bmN0aW9uKHQsbil7dmFyIHI9blswXSxhPW5bMV0sZT1uWzJdLHU9blszXSxvPXIqcithKmErZSplK3UqdSxpPW8/MS9vOjA7cmV0dXJuIHRbMF09LXIqaSx0WzFdPS1hKmksdFsyXT0tZSppLHRbM109dSppLHR9LG4uY29uanVnYXRlPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHRbMF09LW5bMF0sdFsxXT0tblsxXSx0WzJdPS1uWzJdLHRbM109blszXSx0fSxuLmZyb21NYXQzPWgsbi5mcm9tRXVsZXI9ZnVuY3Rpb24odCxuLHIsYSl7dmFyIGU9LjUqTWF0aC5QSS8xODA7bio9ZSxyKj1lLGEqPWU7dmFyIHU9TWF0aC5zaW4obiksbz1NYXRoLmNvcyhuKSxpPU1hdGguc2luKHIpLHM9TWF0aC5jb3MociksYz1NYXRoLnNpbihhKSxmPU1hdGguY29zKGEpO3JldHVybiB0WzBdPXUqcypmLW8qaSpjLHRbMV09byppKmYrdSpzKmMsdFsyXT1vKnMqYy11KmkqZix0WzNdPW8qcypmK3UqaSpjLHR9LG4uc3RyPWZ1bmN0aW9uKHQpe3JldHVyblwicXVhdChcIit0WzBdK1wiLCBcIit0WzFdK1wiLCBcIit0WzJdK1wiLCBcIit0WzNdK1wiKVwifTt2YXIgYT1pKHIoMCkpLGU9aShyKDUpKSx1PWkocigyKSksbz1pKHIoMSkpO2Z1bmN0aW9uIGkodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O3ZhciBuPXt9O2lmKG51bGwhPXQpZm9yKHZhciByIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQscikmJihuW3JdPXRbcl0pO3JldHVybiBuLmRlZmF1bHQ9dCxufWZ1bmN0aW9uIHMoKXt2YXIgdD1uZXcgYS5BUlJBWV9UWVBFKDQpO3JldHVybiBhLkFSUkFZX1RZUEUhPUZsb2F0MzJBcnJheSYmKHRbMF09MCx0WzFdPTAsdFsyXT0wKSx0WzNdPTEsdH1mdW5jdGlvbiBjKHQsbixyKXtyKj0uNTt2YXIgYT1NYXRoLnNpbihyKTtyZXR1cm4gdFswXT1hKm5bMF0sdFsxXT1hKm5bMV0sdFsyXT1hKm5bMl0sdFszXT1NYXRoLmNvcyhyKSx0fWZ1bmN0aW9uIGYodCxuLHIpe3ZhciBhPW5bMF0sZT1uWzFdLHU9blsyXSxvPW5bM10saT1yWzBdLHM9clsxXSxjPXJbMl0sZj1yWzNdO3JldHVybiB0WzBdPWEqZitvKmkrZSpjLXUqcyx0WzFdPWUqZitvKnMrdSppLWEqYyx0WzJdPXUqZitvKmMrYSpzLWUqaSx0WzNdPW8qZi1hKmktZSpzLXUqYyx0fWZ1bmN0aW9uIE0odCxuLHIsZSl7dmFyIHU9blswXSxvPW5bMV0saT1uWzJdLHM9blszXSxjPXJbMF0sZj1yWzFdLE09clsyXSxoPXJbM10sbD12b2lkIDAsdj12b2lkIDAsZD12b2lkIDAsYj12b2lkIDAsbT12b2lkIDA7cmV0dXJuKHY9dSpjK28qZitpKk0rcypoKTwwJiYodj0tdixjPS1jLGY9LWYsTT0tTSxoPS1oKSwxLXY+YS5FUFNJTE9OPyhsPU1hdGguYWNvcyh2KSxkPU1hdGguc2luKGwpLGI9TWF0aC5zaW4oKDEtZSkqbCkvZCxtPU1hdGguc2luKGUqbCkvZCk6KGI9MS1lLG09ZSksdFswXT1iKnUrbSpjLHRbMV09YipvK20qZix0WzJdPWIqaSttKk0sdFszXT1iKnMrbSpoLHR9ZnVuY3Rpb24gaCh0LG4pe3ZhciByPW5bMF0rbls0XStuWzhdLGE9dm9pZCAwO2lmKHI+MClhPU1hdGguc3FydChyKzEpLHRbM109LjUqYSxhPS41L2EsdFswXT0obls1XS1uWzddKSphLHRbMV09KG5bNl0tblsyXSkqYSx0WzJdPShuWzFdLW5bM10pKmE7ZWxzZXt2YXIgZT0wO25bNF0+blswXSYmKGU9MSksbls4XT5uWzMqZStlXSYmKGU9Mik7dmFyIHU9KGUrMSklMyxvPShlKzIpJTM7YT1NYXRoLnNxcnQoblszKmUrZV0tblszKnUrdV0tblszKm8rb10rMSksdFtlXT0uNSphLGE9LjUvYSx0WzNdPShuWzMqdStvXS1uWzMqbyt1XSkqYSx0W3VdPShuWzMqdStlXStuWzMqZSt1XSkqYSx0W29dPShuWzMqbytlXStuWzMqZStvXSkqYX1yZXR1cm4gdH1uLmNsb25lPW8uY2xvbmUsbi5mcm9tVmFsdWVzPW8uZnJvbVZhbHVlcyxuLmNvcHk9by5jb3B5LG4uc2V0PW8uc2V0LG4uYWRkPW8uYWRkLG4ubXVsPWYsbi5zY2FsZT1vLnNjYWxlLG4uZG90PW8uZG90LG4ubGVycD1vLmxlcnA7dmFyIGw9bi5sZW5ndGg9by5sZW5ndGgsdj0obi5sZW49bCxuLnNxdWFyZWRMZW5ndGg9by5zcXVhcmVkTGVuZ3RoKSxkPShuLnNxckxlbj12LG4ubm9ybWFsaXplPW8ubm9ybWFsaXplKTtuLmV4YWN0RXF1YWxzPW8uZXhhY3RFcXVhbHMsbi5lcXVhbHM9by5lcXVhbHMsbi5yb3RhdGlvblRvPWZ1bmN0aW9uKCl7dmFyIHQ9dS5jcmVhdGUoKSxuPXUuZnJvbVZhbHVlcygxLDAsMCkscj11LmZyb21WYWx1ZXMoMCwxLDApO3JldHVybiBmdW5jdGlvbihhLGUsbyl7dmFyIGk9dS5kb3QoZSxvKTtyZXR1cm4gaTwtLjk5OTk5OT8odS5jcm9zcyh0LG4sZSksdS5sZW4odCk8MWUtNiYmdS5jcm9zcyh0LHIsZSksdS5ub3JtYWxpemUodCx0KSxjKGEsdCxNYXRoLlBJKSxhKTppPi45OTk5OTk/KGFbMF09MCxhWzFdPTAsYVsyXT0wLGFbM109MSxhKToodS5jcm9zcyh0LGUsbyksYVswXT10WzBdLGFbMV09dFsxXSxhWzJdPXRbMl0sYVszXT0xK2ksZChhLGEpKX19KCksbi5zcWxlcnA9ZnVuY3Rpb24oKXt2YXIgdD1zKCksbj1zKCk7cmV0dXJuIGZ1bmN0aW9uKHIsYSxlLHUsbyxpKXtyZXR1cm4gTSh0LGEsbyxpKSxNKG4sZSx1LGkpLE0ocix0LG4sMippKigxLWkpKSxyfX0oKSxuLnNldEF4ZXM9ZnVuY3Rpb24oKXt2YXIgdD1lLmNyZWF0ZSgpO3JldHVybiBmdW5jdGlvbihuLHIsYSxlKXtyZXR1cm4gdFswXT1hWzBdLHRbM109YVsxXSx0WzZdPWFbMl0sdFsxXT1lWzBdLHRbNF09ZVsxXSx0WzddPWVbMl0sdFsyXT0tclswXSx0WzVdPS1yWzFdLHRbOF09LXJbMl0sZChuLGgobix0KSl9fSgpfSxmdW5jdGlvbih0LG4scil7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksbi5zdWI9bi5tdWw9dm9pZCAwLG4uY3JlYXRlPWZ1bmN0aW9uKCl7dmFyIHQ9bmV3IGEuQVJSQVlfVFlQRSgxNik7YS5BUlJBWV9UWVBFIT1GbG9hdDMyQXJyYXkmJih0WzFdPTAsdFsyXT0wLHRbM109MCx0WzRdPTAsdFs2XT0wLHRbN109MCx0WzhdPTAsdFs5XT0wLHRbMTFdPTAsdFsxMl09MCx0WzEzXT0wLHRbMTRdPTApO3JldHVybiB0WzBdPTEsdFs1XT0xLHRbMTBdPTEsdFsxNV09MSx0fSxuLmNsb25lPWZ1bmN0aW9uKHQpe3ZhciBuPW5ldyBhLkFSUkFZX1RZUEUoMTYpO3JldHVybiBuWzBdPXRbMF0sblsxXT10WzFdLG5bMl09dFsyXSxuWzNdPXRbM10sbls0XT10WzRdLG5bNV09dFs1XSxuWzZdPXRbNl0sbls3XT10WzddLG5bOF09dFs4XSxuWzldPXRbOV0sblsxMF09dFsxMF0sblsxMV09dFsxMV0sblsxMl09dFsxMl0sblsxM109dFsxM10sblsxNF09dFsxNF0sblsxNV09dFsxNV0sbn0sbi5jb3B5PWZ1bmN0aW9uKHQsbil7cmV0dXJuIHRbMF09blswXSx0WzFdPW5bMV0sdFsyXT1uWzJdLHRbM109blszXSx0WzRdPW5bNF0sdFs1XT1uWzVdLHRbNl09bls2XSx0WzddPW5bN10sdFs4XT1uWzhdLHRbOV09bls5XSx0WzEwXT1uWzEwXSx0WzExXT1uWzExXSx0WzEyXT1uWzEyXSx0WzEzXT1uWzEzXSx0WzE0XT1uWzE0XSx0WzE1XT1uWzE1XSx0fSxuLmZyb21WYWx1ZXM9ZnVuY3Rpb24odCxuLHIsZSx1LG8saSxzLGMsZixNLGgsbCx2LGQsYil7dmFyIG09bmV3IGEuQVJSQVlfVFlQRSgxNik7cmV0dXJuIG1bMF09dCxtWzFdPW4sbVsyXT1yLG1bM109ZSxtWzRdPXUsbVs1XT1vLG1bNl09aSxtWzddPXMsbVs4XT1jLG1bOV09ZixtWzEwXT1NLG1bMTFdPWgsbVsxMl09bCxtWzEzXT12LG1bMTRdPWQsbVsxNV09YixtfSxuLnNldD1mdW5jdGlvbih0LG4scixhLGUsdSxvLGkscyxjLGYsTSxoLGwsdixkLGIpe3JldHVybiB0WzBdPW4sdFsxXT1yLHRbMl09YSx0WzNdPWUsdFs0XT11LHRbNV09byx0WzZdPWksdFs3XT1zLHRbOF09Yyx0WzldPWYsdFsxMF09TSx0WzExXT1oLHRbMTJdPWwsdFsxM109dix0WzE0XT1kLHRbMTVdPWIsdH0sbi5pZGVudGl0eT1lLG4udHJhbnNwb3NlPWZ1bmN0aW9uKHQsbil7aWYodD09PW4pe3ZhciByPW5bMV0sYT1uWzJdLGU9blszXSx1PW5bNl0sbz1uWzddLGk9blsxMV07dFsxXT1uWzRdLHRbMl09bls4XSx0WzNdPW5bMTJdLHRbNF09cix0WzZdPW5bOV0sdFs3XT1uWzEzXSx0WzhdPWEsdFs5XT11LHRbMTFdPW5bMTRdLHRbMTJdPWUsdFsxM109byx0WzE0XT1pfWVsc2UgdFswXT1uWzBdLHRbMV09bls0XSx0WzJdPW5bOF0sdFszXT1uWzEyXSx0WzRdPW5bMV0sdFs1XT1uWzVdLHRbNl09bls5XSx0WzddPW5bMTNdLHRbOF09blsyXSx0WzldPW5bNl0sdFsxMF09blsxMF0sdFsxMV09blsxNF0sdFsxMl09blszXSx0WzEzXT1uWzddLHRbMTRdPW5bMTFdLHRbMTVdPW5bMTVdO3JldHVybiB0fSxuLmludmVydD1mdW5jdGlvbih0LG4pe3ZhciByPW5bMF0sYT1uWzFdLGU9blsyXSx1PW5bM10sbz1uWzRdLGk9bls1XSxzPW5bNl0sYz1uWzddLGY9bls4XSxNPW5bOV0saD1uWzEwXSxsPW5bMTFdLHY9blsxMl0sZD1uWzEzXSxiPW5bMTRdLG09blsxNV0scD1yKmktYSpvLFA9cipzLWUqbyxBPXIqYy11Km8sRT1hKnMtZSppLE89YSpjLXUqaSxSPWUqYy11KnMseT1mKmQtTSp2LHE9ZipiLWgqdix4PWYqbS1sKnYsXz1NKmItaCpkLFk9TSptLWwqZCxMPWgqbS1sKmIsUz1wKkwtUCpZK0EqXytFKngtTypxK1IqeTtpZighUylyZXR1cm4gbnVsbDtyZXR1cm4gUz0xL1MsdFswXT0oaSpMLXMqWStjKl8pKlMsdFsxXT0oZSpZLWEqTC11Kl8pKlMsdFsyXT0oZCpSLWIqTyttKkUpKlMsdFszXT0oaCpPLU0qUi1sKkUpKlMsdFs0XT0ocyp4LW8qTC1jKnEpKlMsdFs1XT0ocipMLWUqeCt1KnEpKlMsdFs2XT0oYipBLXYqUi1tKlApKlMsdFs3XT0oZipSLWgqQStsKlApKlMsdFs4XT0obypZLWkqeCtjKnkpKlMsdFs5XT0oYSp4LXIqWS11KnkpKlMsdFsxMF09KHYqTy1kKkErbSpwKSpTLHRbMTFdPShNKkEtZipPLWwqcCkqUyx0WzEyXT0oaSpxLW8qXy1zKnkpKlMsdFsxM109KHIqXy1hKnErZSp5KSpTLHRbMTRdPShkKlAtdipFLWIqcCkqUyx0WzE1XT0oZipFLU0qUCtoKnApKlMsdH0sbi5hZGpvaW50PWZ1bmN0aW9uKHQsbil7dmFyIHI9blswXSxhPW5bMV0sZT1uWzJdLHU9blszXSxvPW5bNF0saT1uWzVdLHM9bls2XSxjPW5bN10sZj1uWzhdLE09bls5XSxoPW5bMTBdLGw9blsxMV0sdj1uWzEyXSxkPW5bMTNdLGI9blsxNF0sbT1uWzE1XTtyZXR1cm4gdFswXT1pKihoKm0tbCpiKS1NKihzKm0tYypiKStkKihzKmwtYypoKSx0WzFdPS0oYSooaCptLWwqYiktTSooZSptLXUqYikrZCooZSpsLXUqaCkpLHRbMl09YSoocyptLWMqYiktaSooZSptLXUqYikrZCooZSpjLXUqcyksdFszXT0tKGEqKHMqbC1jKmgpLWkqKGUqbC11KmgpK00qKGUqYy11KnMpKSx0WzRdPS0obyooaCptLWwqYiktZioocyptLWMqYikrdioocypsLWMqaCkpLHRbNV09ciooaCptLWwqYiktZiooZSptLXUqYikrdiooZSpsLXUqaCksdFs2XT0tKHIqKHMqbS1jKmIpLW8qKGUqbS11KmIpK3YqKGUqYy11KnMpKSx0WzddPXIqKHMqbC1jKmgpLW8qKGUqbC11KmgpK2YqKGUqYy11KnMpLHRbOF09byooTSptLWwqZCktZiooaSptLWMqZCkrdiooaSpsLWMqTSksdFs5XT0tKHIqKE0qbS1sKmQpLWYqKGEqbS11KmQpK3YqKGEqbC11Kk0pKSx0WzEwXT1yKihpKm0tYypkKS1vKihhKm0tdSpkKSt2KihhKmMtdSppKSx0WzExXT0tKHIqKGkqbC1jKk0pLW8qKGEqbC11Kk0pK2YqKGEqYy11KmkpKSx0WzEyXT0tKG8qKE0qYi1oKmQpLWYqKGkqYi1zKmQpK3YqKGkqaC1zKk0pKSx0WzEzXT1yKihNKmItaCpkKS1mKihhKmItZSpkKSt2KihhKmgtZSpNKSx0WzE0XT0tKHIqKGkqYi1zKmQpLW8qKGEqYi1lKmQpK3YqKGEqcy1lKmkpKSx0WzE1XT1yKihpKmgtcypNKS1vKihhKmgtZSpNKStmKihhKnMtZSppKSx0fSxuLmRldGVybWluYW50PWZ1bmN0aW9uKHQpe3ZhciBuPXRbMF0scj10WzFdLGE9dFsyXSxlPXRbM10sdT10WzRdLG89dFs1XSxpPXRbNl0scz10WzddLGM9dFs4XSxmPXRbOV0sTT10WzEwXSxoPXRbMTFdLGw9dFsxMl0sdj10WzEzXSxkPXRbMTRdLGI9dFsxNV07cmV0dXJuKG4qby1yKnUpKihNKmItaCpkKS0obippLWEqdSkqKGYqYi1oKnYpKyhuKnMtZSp1KSooZipkLU0qdikrKHIqaS1hKm8pKihjKmItaCpsKS0ocipzLWUqbykqKGMqZC1NKmwpKyhhKnMtZSppKSooYyp2LWYqbCl9LG4ubXVsdGlwbHk9dSxuLnRyYW5zbGF0ZT1mdW5jdGlvbih0LG4scil7dmFyIGE9clswXSxlPXJbMV0sdT1yWzJdLG89dm9pZCAwLGk9dm9pZCAwLHM9dm9pZCAwLGM9dm9pZCAwLGY9dm9pZCAwLE09dm9pZCAwLGg9dm9pZCAwLGw9dm9pZCAwLHY9dm9pZCAwLGQ9dm9pZCAwLGI9dm9pZCAwLG09dm9pZCAwO249PT10Pyh0WzEyXT1uWzBdKmErbls0XSplK25bOF0qdStuWzEyXSx0WzEzXT1uWzFdKmErbls1XSplK25bOV0qdStuWzEzXSx0WzE0XT1uWzJdKmErbls2XSplK25bMTBdKnUrblsxNF0sdFsxNV09blszXSphK25bN10qZStuWzExXSp1K25bMTVdKToobz1uWzBdLGk9blsxXSxzPW5bMl0sYz1uWzNdLGY9bls0XSxNPW5bNV0saD1uWzZdLGw9bls3XSx2PW5bOF0sZD1uWzldLGI9blsxMF0sbT1uWzExXSx0WzBdPW8sdFsxXT1pLHRbMl09cyx0WzNdPWMsdFs0XT1mLHRbNV09TSx0WzZdPWgsdFs3XT1sLHRbOF09dix0WzldPWQsdFsxMF09Yix0WzExXT1tLHRbMTJdPW8qYStmKmUrdip1K25bMTJdLHRbMTNdPWkqYStNKmUrZCp1K25bMTNdLHRbMTRdPXMqYStoKmUrYip1K25bMTRdLHRbMTVdPWMqYStsKmUrbSp1K25bMTVdKTtyZXR1cm4gdH0sbi5zY2FsZT1mdW5jdGlvbih0LG4scil7dmFyIGE9clswXSxlPXJbMV0sdT1yWzJdO3JldHVybiB0WzBdPW5bMF0qYSx0WzFdPW5bMV0qYSx0WzJdPW5bMl0qYSx0WzNdPW5bM10qYSx0WzRdPW5bNF0qZSx0WzVdPW5bNV0qZSx0WzZdPW5bNl0qZSx0WzddPW5bN10qZSx0WzhdPW5bOF0qdSx0WzldPW5bOV0qdSx0WzEwXT1uWzEwXSp1LHRbMTFdPW5bMTFdKnUsdFsxMl09blsxMl0sdFsxM109blsxM10sdFsxNF09blsxNF0sdFsxNV09blsxNV0sdH0sbi5yb3RhdGU9ZnVuY3Rpb24odCxuLHIsZSl7dmFyIHU9ZVswXSxvPWVbMV0saT1lWzJdLHM9TWF0aC5zcXJ0KHUqdStvKm8raSppKSxjPXZvaWQgMCxmPXZvaWQgMCxNPXZvaWQgMCxoPXZvaWQgMCxsPXZvaWQgMCx2PXZvaWQgMCxkPXZvaWQgMCxiPXZvaWQgMCxtPXZvaWQgMCxwPXZvaWQgMCxQPXZvaWQgMCxBPXZvaWQgMCxFPXZvaWQgMCxPPXZvaWQgMCxSPXZvaWQgMCx5PXZvaWQgMCxxPXZvaWQgMCx4PXZvaWQgMCxfPXZvaWQgMCxZPXZvaWQgMCxMPXZvaWQgMCxTPXZvaWQgMCx3PXZvaWQgMCxJPXZvaWQgMDtpZihzPGEuRVBTSUxPTilyZXR1cm4gbnVsbDt1Kj1zPTEvcyxvKj1zLGkqPXMsYz1NYXRoLnNpbihyKSxmPU1hdGguY29zKHIpLE09MS1mLGg9blswXSxsPW5bMV0sdj1uWzJdLGQ9blszXSxiPW5bNF0sbT1uWzVdLHA9bls2XSxQPW5bN10sQT1uWzhdLEU9bls5XSxPPW5bMTBdLFI9blsxMV0seT11KnUqTStmLHE9byp1Kk0raSpjLHg9aSp1Kk0tbypjLF89dSpvKk0taSpjLFk9bypvKk0rZixMPWkqbypNK3UqYyxTPXUqaSpNK28qYyx3PW8qaSpNLXUqYyxJPWkqaSpNK2YsdFswXT1oKnkrYipxK0EqeCx0WzFdPWwqeSttKnErRSp4LHRbMl09dip5K3AqcStPKngsdFszXT1kKnkrUCpxK1IqeCx0WzRdPWgqXytiKlkrQSpMLHRbNV09bCpfK20qWStFKkwsdFs2XT12Kl8rcCpZK08qTCx0WzddPWQqXytQKlkrUipMLHRbOF09aCpTK2IqdytBKkksdFs5XT1sKlMrbSp3K0UqSSx0WzEwXT12KlMrcCp3K08qSSx0WzExXT1kKlMrUCp3K1IqSSxuIT09dCYmKHRbMTJdPW5bMTJdLHRbMTNdPW5bMTNdLHRbMTRdPW5bMTRdLHRbMTVdPW5bMTVdKTtyZXR1cm4gdH0sbi5yb3RhdGVYPWZ1bmN0aW9uKHQsbixyKXt2YXIgYT1NYXRoLnNpbihyKSxlPU1hdGguY29zKHIpLHU9bls0XSxvPW5bNV0saT1uWzZdLHM9bls3XSxjPW5bOF0sZj1uWzldLE09blsxMF0saD1uWzExXTtuIT09dCYmKHRbMF09blswXSx0WzFdPW5bMV0sdFsyXT1uWzJdLHRbM109blszXSx0WzEyXT1uWzEyXSx0WzEzXT1uWzEzXSx0WzE0XT1uWzE0XSx0WzE1XT1uWzE1XSk7cmV0dXJuIHRbNF09dSplK2MqYSx0WzVdPW8qZStmKmEsdFs2XT1pKmUrTSphLHRbN109cyplK2gqYSx0WzhdPWMqZS11KmEsdFs5XT1mKmUtbyphLHRbMTBdPU0qZS1pKmEsdFsxMV09aCplLXMqYSx0fSxuLnJvdGF0ZVk9ZnVuY3Rpb24odCxuLHIpe3ZhciBhPU1hdGguc2luKHIpLGU9TWF0aC5jb3MociksdT1uWzBdLG89blsxXSxpPW5bMl0scz1uWzNdLGM9bls4XSxmPW5bOV0sTT1uWzEwXSxoPW5bMTFdO24hPT10JiYodFs0XT1uWzRdLHRbNV09bls1XSx0WzZdPW5bNl0sdFs3XT1uWzddLHRbMTJdPW5bMTJdLHRbMTNdPW5bMTNdLHRbMTRdPW5bMTRdLHRbMTVdPW5bMTVdKTtyZXR1cm4gdFswXT11KmUtYyphLHRbMV09byplLWYqYSx0WzJdPWkqZS1NKmEsdFszXT1zKmUtaCphLHRbOF09dSphK2MqZSx0WzldPW8qYStmKmUsdFsxMF09aSphK00qZSx0WzExXT1zKmEraCplLHR9LG4ucm90YXRlWj1mdW5jdGlvbih0LG4scil7dmFyIGE9TWF0aC5zaW4ociksZT1NYXRoLmNvcyhyKSx1PW5bMF0sbz1uWzFdLGk9blsyXSxzPW5bM10sYz1uWzRdLGY9bls1XSxNPW5bNl0saD1uWzddO24hPT10JiYodFs4XT1uWzhdLHRbOV09bls5XSx0WzEwXT1uWzEwXSx0WzExXT1uWzExXSx0WzEyXT1uWzEyXSx0WzEzXT1uWzEzXSx0WzE0XT1uWzE0XSx0WzE1XT1uWzE1XSk7cmV0dXJuIHRbMF09dSplK2MqYSx0WzFdPW8qZStmKmEsdFsyXT1pKmUrTSphLHRbM109cyplK2gqYSx0WzRdPWMqZS11KmEsdFs1XT1mKmUtbyphLHRbNl09TSplLWkqYSx0WzddPWgqZS1zKmEsdH0sbi5mcm9tVHJhbnNsYXRpb249ZnVuY3Rpb24odCxuKXtyZXR1cm4gdFswXT0xLHRbMV09MCx0WzJdPTAsdFszXT0wLHRbNF09MCx0WzVdPTEsdFs2XT0wLHRbN109MCx0WzhdPTAsdFs5XT0wLHRbMTBdPTEsdFsxMV09MCx0WzEyXT1uWzBdLHRbMTNdPW5bMV0sdFsxNF09blsyXSx0WzE1XT0xLHR9LG4uZnJvbVNjYWxpbmc9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdFswXT1uWzBdLHRbMV09MCx0WzJdPTAsdFszXT0wLHRbNF09MCx0WzVdPW5bMV0sdFs2XT0wLHRbN109MCx0WzhdPTAsdFs5XT0wLHRbMTBdPW5bMl0sdFsxMV09MCx0WzEyXT0wLHRbMTNdPTAsdFsxNF09MCx0WzE1XT0xLHR9LG4uZnJvbVJvdGF0aW9uPWZ1bmN0aW9uKHQsbixyKXt2YXIgZT1yWzBdLHU9clsxXSxvPXJbMl0saT1NYXRoLnNxcnQoZSplK3UqdStvKm8pLHM9dm9pZCAwLGM9dm9pZCAwLGY9dm9pZCAwO2lmKGk8YS5FUFNJTE9OKXJldHVybiBudWxsO3JldHVybiBlKj1pPTEvaSx1Kj1pLG8qPWkscz1NYXRoLnNpbihuKSxjPU1hdGguY29zKG4pLGY9MS1jLHRbMF09ZSplKmYrYyx0WzFdPXUqZSpmK28qcyx0WzJdPW8qZSpmLXUqcyx0WzNdPTAsdFs0XT1lKnUqZi1vKnMsdFs1XT11KnUqZitjLHRbNl09byp1KmYrZSpzLHRbN109MCx0WzhdPWUqbypmK3Uqcyx0WzldPXUqbypmLWUqcyx0WzEwXT1vKm8qZitjLHRbMTFdPTAsdFsxMl09MCx0WzEzXT0wLHRbMTRdPTAsdFsxNV09MSx0fSxuLmZyb21YUm90YXRpb249ZnVuY3Rpb24odCxuKXt2YXIgcj1NYXRoLnNpbihuKSxhPU1hdGguY29zKG4pO3JldHVybiB0WzBdPTEsdFsxXT0wLHRbMl09MCx0WzNdPTAsdFs0XT0wLHRbNV09YSx0WzZdPXIsdFs3XT0wLHRbOF09MCx0WzldPS1yLHRbMTBdPWEsdFsxMV09MCx0WzEyXT0wLHRbMTNdPTAsdFsxNF09MCx0WzE1XT0xLHR9LG4uZnJvbVlSb3RhdGlvbj1mdW5jdGlvbih0LG4pe3ZhciByPU1hdGguc2luKG4pLGE9TWF0aC5jb3Mobik7cmV0dXJuIHRbMF09YSx0WzFdPTAsdFsyXT0tcix0WzNdPTAsdFs0XT0wLHRbNV09MSx0WzZdPTAsdFs3XT0wLHRbOF09cix0WzldPTAsdFsxMF09YSx0WzExXT0wLHRbMTJdPTAsdFsxM109MCx0WzE0XT0wLHRbMTVdPTEsdH0sbi5mcm9tWlJvdGF0aW9uPWZ1bmN0aW9uKHQsbil7dmFyIHI9TWF0aC5zaW4obiksYT1NYXRoLmNvcyhuKTtyZXR1cm4gdFswXT1hLHRbMV09cix0WzJdPTAsdFszXT0wLHRbNF09LXIsdFs1XT1hLHRbNl09MCx0WzddPTAsdFs4XT0wLHRbOV09MCx0WzEwXT0xLHRbMTFdPTAsdFsxMl09MCx0WzEzXT0wLHRbMTRdPTAsdFsxNV09MSx0fSxuLmZyb21Sb3RhdGlvblRyYW5zbGF0aW9uPW8sbi5mcm9tUXVhdDI9ZnVuY3Rpb24odCxuKXt2YXIgcj1uZXcgYS5BUlJBWV9UWVBFKDMpLGU9LW5bMF0sdT0tblsxXSxpPS1uWzJdLHM9blszXSxjPW5bNF0sZj1uWzVdLE09bls2XSxoPW5bN10sbD1lKmUrdSp1K2kqaStzKnM7bD4wPyhyWzBdPTIqKGMqcytoKmUrZippLU0qdSkvbCxyWzFdPTIqKGYqcytoKnUrTSplLWMqaSkvbCxyWzJdPTIqKE0qcytoKmkrYyp1LWYqZSkvbCk6KHJbMF09MiooYypzK2gqZStmKmktTSp1KSxyWzFdPTIqKGYqcytoKnUrTSplLWMqaSksclsyXT0yKihNKnMraCppK2MqdS1mKmUpKTtyZXR1cm4gbyh0LG4sciksdH0sbi5nZXRUcmFuc2xhdGlvbj1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPW5bMTJdLHRbMV09blsxM10sdFsyXT1uWzE0XSx0fSxuLmdldFNjYWxpbmc9ZnVuY3Rpb24odCxuKXt2YXIgcj1uWzBdLGE9blsxXSxlPW5bMl0sdT1uWzRdLG89bls1XSxpPW5bNl0scz1uWzhdLGM9bls5XSxmPW5bMTBdO3JldHVybiB0WzBdPU1hdGguc3FydChyKnIrYSphK2UqZSksdFsxXT1NYXRoLnNxcnQodSp1K28qbytpKmkpLHRbMl09TWF0aC5zcXJ0KHMqcytjKmMrZipmKSx0fSxuLmdldFJvdGF0aW9uPWZ1bmN0aW9uKHQsbil7dmFyIHI9blswXStuWzVdK25bMTBdLGE9MDtyPjA/KGE9MipNYXRoLnNxcnQocisxKSx0WzNdPS4yNSphLHRbMF09KG5bNl0tbls5XSkvYSx0WzFdPShuWzhdLW5bMl0pL2EsdFsyXT0oblsxXS1uWzRdKS9hKTpuWzBdPm5bNV0mJm5bMF0+blsxMF0/KGE9MipNYXRoLnNxcnQoMStuWzBdLW5bNV0tblsxMF0pLHRbM109KG5bNl0tbls5XSkvYSx0WzBdPS4yNSphLHRbMV09KG5bMV0rbls0XSkvYSx0WzJdPShuWzhdK25bMl0pL2EpOm5bNV0+blsxMF0/KGE9MipNYXRoLnNxcnQoMStuWzVdLW5bMF0tblsxMF0pLHRbM109KG5bOF0tblsyXSkvYSx0WzBdPShuWzFdK25bNF0pL2EsdFsxXT0uMjUqYSx0WzJdPShuWzZdK25bOV0pL2EpOihhPTIqTWF0aC5zcXJ0KDErblsxMF0tblswXS1uWzVdKSx0WzNdPShuWzFdLW5bNF0pL2EsdFswXT0obls4XStuWzJdKS9hLHRbMV09KG5bNl0rbls5XSkvYSx0WzJdPS4yNSphKTtyZXR1cm4gdH0sbi5mcm9tUm90YXRpb25UcmFuc2xhdGlvblNjYWxlPWZ1bmN0aW9uKHQsbixyLGEpe3ZhciBlPW5bMF0sdT1uWzFdLG89blsyXSxpPW5bM10scz1lK2UsYz11K3UsZj1vK28sTT1lKnMsaD1lKmMsbD1lKmYsdj11KmMsZD11KmYsYj1vKmYsbT1pKnMscD1pKmMsUD1pKmYsQT1hWzBdLEU9YVsxXSxPPWFbMl07cmV0dXJuIHRbMF09KDEtKHYrYikpKkEsdFsxXT0oaCtQKSpBLHRbMl09KGwtcCkqQSx0WzNdPTAsdFs0XT0oaC1QKSpFLHRbNV09KDEtKE0rYikpKkUsdFs2XT0oZCttKSpFLHRbN109MCx0WzhdPShsK3ApKk8sdFs5XT0oZC1tKSpPLHRbMTBdPSgxLShNK3YpKSpPLHRbMTFdPTAsdFsxMl09clswXSx0WzEzXT1yWzFdLHRbMTRdPXJbMl0sdFsxNV09MSx0fSxuLmZyb21Sb3RhdGlvblRyYW5zbGF0aW9uU2NhbGVPcmlnaW49ZnVuY3Rpb24odCxuLHIsYSxlKXt2YXIgdT1uWzBdLG89blsxXSxpPW5bMl0scz1uWzNdLGM9dSt1LGY9bytvLE09aStpLGg9dSpjLGw9dSpmLHY9dSpNLGQ9bypmLGI9bypNLG09aSpNLHA9cypjLFA9cypmLEE9cypNLEU9YVswXSxPPWFbMV0sUj1hWzJdLHk9ZVswXSxxPWVbMV0seD1lWzJdLF89KDEtKGQrbSkpKkUsWT0obCtBKSpFLEw9KHYtUCkqRSxTPShsLUEpKk8sdz0oMS0oaCttKSkqTyxJPShiK3ApKk8sTj0oditQKSpSLGc9KGItcCkqUixUPSgxLShoK2QpKSpSO3JldHVybiB0WzBdPV8sdFsxXT1ZLHRbMl09TCx0WzNdPTAsdFs0XT1TLHRbNV09dyx0WzZdPUksdFs3XT0wLHRbOF09Tix0WzldPWcsdFsxMF09VCx0WzExXT0wLHRbMTJdPXJbMF0reS0oXyp5K1MqcStOKngpLHRbMTNdPXJbMV0rcS0oWSp5K3cqcStnKngpLHRbMTRdPXJbMl0reC0oTCp5K0kqcStUKngpLHRbMTVdPTEsdH0sbi5mcm9tUXVhdD1mdW5jdGlvbih0LG4pe3ZhciByPW5bMF0sYT1uWzFdLGU9blsyXSx1PW5bM10sbz1yK3IsaT1hK2Escz1lK2UsYz1yKm8sZj1hKm8sTT1hKmksaD1lKm8sbD1lKmksdj1lKnMsZD11Km8sYj11KmksbT11KnM7cmV0dXJuIHRbMF09MS1NLXYsdFsxXT1mK20sdFsyXT1oLWIsdFszXT0wLHRbNF09Zi1tLHRbNV09MS1jLXYsdFs2XT1sK2QsdFs3XT0wLHRbOF09aCtiLHRbOV09bC1kLHRbMTBdPTEtYy1NLHRbMTFdPTAsdFsxMl09MCx0WzEzXT0wLHRbMTRdPTAsdFsxNV09MSx0fSxuLmZydXN0dW09ZnVuY3Rpb24odCxuLHIsYSxlLHUsbyl7dmFyIGk9MS8oci1uKSxzPTEvKGUtYSksYz0xLyh1LW8pO3JldHVybiB0WzBdPTIqdSppLHRbMV09MCx0WzJdPTAsdFszXT0wLHRbNF09MCx0WzVdPTIqdSpzLHRbNl09MCx0WzddPTAsdFs4XT0ocituKSppLHRbOV09KGUrYSkqcyx0WzEwXT0obyt1KSpjLHRbMTFdPS0xLHRbMTJdPTAsdFsxM109MCx0WzE0XT1vKnUqMipjLHRbMTVdPTAsdH0sbi5wZXJzcGVjdGl2ZT1mdW5jdGlvbih0LG4scixhLGUpe3ZhciB1PTEvTWF0aC50YW4obi8yKSxvPXZvaWQgMDt0WzBdPXUvcix0WzFdPTAsdFsyXT0wLHRbM109MCx0WzRdPTAsdFs1XT11LHRbNl09MCx0WzddPTAsdFs4XT0wLHRbOV09MCx0WzExXT0tMSx0WzEyXT0wLHRbMTNdPTAsdFsxNV09MCxudWxsIT1lJiZlIT09MS8wPyhvPTEvKGEtZSksdFsxMF09KGUrYSkqbyx0WzE0XT0yKmUqYSpvKToodFsxMF09LTEsdFsxNF09LTIqYSk7cmV0dXJuIHR9LG4ucGVyc3BlY3RpdmVGcm9tRmllbGRPZlZpZXc9ZnVuY3Rpb24odCxuLHIsYSl7dmFyIGU9TWF0aC50YW4obi51cERlZ3JlZXMqTWF0aC5QSS8xODApLHU9TWF0aC50YW4obi5kb3duRGVncmVlcypNYXRoLlBJLzE4MCksbz1NYXRoLnRhbihuLmxlZnREZWdyZWVzKk1hdGguUEkvMTgwKSxpPU1hdGgudGFuKG4ucmlnaHREZWdyZWVzKk1hdGguUEkvMTgwKSxzPTIvKG8raSksYz0yLyhlK3UpO3JldHVybiB0WzBdPXMsdFsxXT0wLHRbMl09MCx0WzNdPTAsdFs0XT0wLHRbNV09Yyx0WzZdPTAsdFs3XT0wLHRbOF09LShvLWkpKnMqLjUsdFs5XT0oZS11KSpjKi41LHRbMTBdPWEvKHItYSksdFsxMV09LTEsdFsxMl09MCx0WzEzXT0wLHRbMTRdPWEqci8oci1hKSx0WzE1XT0wLHR9LG4ub3J0aG89ZnVuY3Rpb24odCxuLHIsYSxlLHUsbyl7dmFyIGk9MS8obi1yKSxzPTEvKGEtZSksYz0xLyh1LW8pO3JldHVybiB0WzBdPS0yKmksdFsxXT0wLHRbMl09MCx0WzNdPTAsdFs0XT0wLHRbNV09LTIqcyx0WzZdPTAsdFs3XT0wLHRbOF09MCx0WzldPTAsdFsxMF09MipjLHRbMTFdPTAsdFsxMl09KG4rcikqaSx0WzEzXT0oZSthKSpzLHRbMTRdPShvK3UpKmMsdFsxNV09MSx0fSxuLmxvb2tBdD1mdW5jdGlvbih0LG4scix1KXt2YXIgbz12b2lkIDAsaT12b2lkIDAscz12b2lkIDAsYz12b2lkIDAsZj12b2lkIDAsTT12b2lkIDAsaD12b2lkIDAsbD12b2lkIDAsdj12b2lkIDAsZD12b2lkIDAsYj1uWzBdLG09blsxXSxwPW5bMl0sUD11WzBdLEE9dVsxXSxFPXVbMl0sTz1yWzBdLFI9clsxXSx5PXJbMl07aWYoTWF0aC5hYnMoYi1PKTxhLkVQU0lMT04mJk1hdGguYWJzKG0tUik8YS5FUFNJTE9OJiZNYXRoLmFicyhwLXkpPGEuRVBTSUxPTilyZXR1cm4gZSh0KTtoPWItTyxsPW0tUix2PXAteSxkPTEvTWF0aC5zcXJ0KGgqaCtsKmwrdip2KSxvPUEqKHYqPWQpLUUqKGwqPWQpLGk9RSooaCo9ZCktUCp2LHM9UCpsLUEqaCwoZD1NYXRoLnNxcnQobypvK2kqaStzKnMpKT8obyo9ZD0xL2QsaSo9ZCxzKj1kKToobz0wLGk9MCxzPTApO2M9bCpzLXYqaSxmPXYqby1oKnMsTT1oKmktbCpvLChkPU1hdGguc3FydChjKmMrZipmK00qTSkpPyhjKj1kPTEvZCxmKj1kLE0qPWQpOihjPTAsZj0wLE09MCk7cmV0dXJuIHRbMF09byx0WzFdPWMsdFsyXT1oLHRbM109MCx0WzRdPWksdFs1XT1mLHRbNl09bCx0WzddPTAsdFs4XT1zLHRbOV09TSx0WzEwXT12LHRbMTFdPTAsdFsxMl09LShvKmIraSptK3MqcCksdFsxM109LShjKmIrZiptK00qcCksdFsxNF09LShoKmIrbCptK3YqcCksdFsxNV09MSx0fSxuLnRhcmdldFRvPWZ1bmN0aW9uKHQsbixyLGEpe3ZhciBlPW5bMF0sdT1uWzFdLG89blsyXSxpPWFbMF0scz1hWzFdLGM9YVsyXSxmPWUtclswXSxNPXUtclsxXSxoPW8tclsyXSxsPWYqZitNKk0raCpoO2w+MCYmKGw9MS9NYXRoLnNxcnQobCksZio9bCxNKj1sLGgqPWwpO3ZhciB2PXMqaC1jKk0sZD1jKmYtaSpoLGI9aSpNLXMqZjsobD12KnYrZCpkK2IqYik+MCYmKGw9MS9NYXRoLnNxcnQobCksdio9bCxkKj1sLGIqPWwpO3JldHVybiB0WzBdPXYsdFsxXT1kLHRbMl09Yix0WzNdPTAsdFs0XT1NKmItaCpkLHRbNV09aCp2LWYqYix0WzZdPWYqZC1NKnYsdFs3XT0wLHRbOF09Zix0WzldPU0sdFsxMF09aCx0WzExXT0wLHRbMTJdPWUsdFsxM109dSx0WzE0XT1vLHRbMTVdPTEsdH0sbi5zdHI9ZnVuY3Rpb24odCl7cmV0dXJuXCJtYXQ0KFwiK3RbMF0rXCIsIFwiK3RbMV0rXCIsIFwiK3RbMl0rXCIsIFwiK3RbM10rXCIsIFwiK3RbNF0rXCIsIFwiK3RbNV0rXCIsIFwiK3RbNl0rXCIsIFwiK3RbN10rXCIsIFwiK3RbOF0rXCIsIFwiK3RbOV0rXCIsIFwiK3RbMTBdK1wiLCBcIit0WzExXStcIiwgXCIrdFsxMl0rXCIsIFwiK3RbMTNdK1wiLCBcIit0WzE0XStcIiwgXCIrdFsxNV0rXCIpXCJ9LG4uZnJvYj1mdW5jdGlvbih0KXtyZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHRbMF0sMikrTWF0aC5wb3codFsxXSwyKStNYXRoLnBvdyh0WzJdLDIpK01hdGgucG93KHRbM10sMikrTWF0aC5wb3codFs0XSwyKStNYXRoLnBvdyh0WzVdLDIpK01hdGgucG93KHRbNl0sMikrTWF0aC5wb3codFs3XSwyKStNYXRoLnBvdyh0WzhdLDIpK01hdGgucG93KHRbOV0sMikrTWF0aC5wb3codFsxMF0sMikrTWF0aC5wb3codFsxMV0sMikrTWF0aC5wb3codFsxMl0sMikrTWF0aC5wb3codFsxM10sMikrTWF0aC5wb3codFsxNF0sMikrTWF0aC5wb3codFsxNV0sMikpfSxuLmFkZD1mdW5jdGlvbih0LG4scil7cmV0dXJuIHRbMF09blswXStyWzBdLHRbMV09blsxXStyWzFdLHRbMl09blsyXStyWzJdLHRbM109blszXStyWzNdLHRbNF09bls0XStyWzRdLHRbNV09bls1XStyWzVdLHRbNl09bls2XStyWzZdLHRbN109bls3XStyWzddLHRbOF09bls4XStyWzhdLHRbOV09bls5XStyWzldLHRbMTBdPW5bMTBdK3JbMTBdLHRbMTFdPW5bMTFdK3JbMTFdLHRbMTJdPW5bMTJdK3JbMTJdLHRbMTNdPW5bMTNdK3JbMTNdLHRbMTRdPW5bMTRdK3JbMTRdLHRbMTVdPW5bMTVdK3JbMTVdLHR9LG4uc3VidHJhY3Q9aSxuLm11bHRpcGx5U2NhbGFyPWZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gdFswXT1uWzBdKnIsdFsxXT1uWzFdKnIsdFsyXT1uWzJdKnIsdFszXT1uWzNdKnIsdFs0XT1uWzRdKnIsdFs1XT1uWzVdKnIsdFs2XT1uWzZdKnIsdFs3XT1uWzddKnIsdFs4XT1uWzhdKnIsdFs5XT1uWzldKnIsdFsxMF09blsxMF0qcix0WzExXT1uWzExXSpyLHRbMTJdPW5bMTJdKnIsdFsxM109blsxM10qcix0WzE0XT1uWzE0XSpyLHRbMTVdPW5bMTVdKnIsdH0sbi5tdWx0aXBseVNjYWxhckFuZEFkZD1mdW5jdGlvbih0LG4scixhKXtyZXR1cm4gdFswXT1uWzBdK3JbMF0qYSx0WzFdPW5bMV0rclsxXSphLHRbMl09blsyXStyWzJdKmEsdFszXT1uWzNdK3JbM10qYSx0WzRdPW5bNF0rcls0XSphLHRbNV09bls1XStyWzVdKmEsdFs2XT1uWzZdK3JbNl0qYSx0WzddPW5bN10rcls3XSphLHRbOF09bls4XStyWzhdKmEsdFs5XT1uWzldK3JbOV0qYSx0WzEwXT1uWzEwXStyWzEwXSphLHRbMTFdPW5bMTFdK3JbMTFdKmEsdFsxMl09blsxMl0rclsxMl0qYSx0WzEzXT1uWzEzXStyWzEzXSphLHRbMTRdPW5bMTRdK3JbMTRdKmEsdFsxNV09blsxNV0rclsxNV0qYSx0fSxuLmV4YWN0RXF1YWxzPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHRbMF09PT1uWzBdJiZ0WzFdPT09blsxXSYmdFsyXT09PW5bMl0mJnRbM109PT1uWzNdJiZ0WzRdPT09bls0XSYmdFs1XT09PW5bNV0mJnRbNl09PT1uWzZdJiZ0WzddPT09bls3XSYmdFs4XT09PW5bOF0mJnRbOV09PT1uWzldJiZ0WzEwXT09PW5bMTBdJiZ0WzExXT09PW5bMTFdJiZ0WzEyXT09PW5bMTJdJiZ0WzEzXT09PW5bMTNdJiZ0WzE0XT09PW5bMTRdJiZ0WzE1XT09PW5bMTVdfSxuLmVxdWFscz1mdW5jdGlvbih0LG4pe3ZhciByPXRbMF0sZT10WzFdLHU9dFsyXSxvPXRbM10saT10WzRdLHM9dFs1XSxjPXRbNl0sZj10WzddLE09dFs4XSxoPXRbOV0sbD10WzEwXSx2PXRbMTFdLGQ9dFsxMl0sYj10WzEzXSxtPXRbMTRdLHA9dFsxNV0sUD1uWzBdLEE9blsxXSxFPW5bMl0sTz1uWzNdLFI9bls0XSx5PW5bNV0scT1uWzZdLHg9bls3XSxfPW5bOF0sWT1uWzldLEw9blsxMF0sUz1uWzExXSx3PW5bMTJdLEk9blsxM10sTj1uWzE0XSxnPW5bMTVdO3JldHVybiBNYXRoLmFicyhyLVApPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyhyKSxNYXRoLmFicyhQKSkmJk1hdGguYWJzKGUtQSk8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKGUpLE1hdGguYWJzKEEpKSYmTWF0aC5hYnModS1FKTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnModSksTWF0aC5hYnMoRSkpJiZNYXRoLmFicyhvLU8pPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyhvKSxNYXRoLmFicyhPKSkmJk1hdGguYWJzKGktUik8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKGkpLE1hdGguYWJzKFIpKSYmTWF0aC5hYnMocy15KTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnMocyksTWF0aC5hYnMoeSkpJiZNYXRoLmFicyhjLXEpPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyhjKSxNYXRoLmFicyhxKSkmJk1hdGguYWJzKGYteCk8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKGYpLE1hdGguYWJzKHgpKSYmTWF0aC5hYnMoTS1fKTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnMoTSksTWF0aC5hYnMoXykpJiZNYXRoLmFicyhoLVkpPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyhoKSxNYXRoLmFicyhZKSkmJk1hdGguYWJzKGwtTCk8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKGwpLE1hdGguYWJzKEwpKSYmTWF0aC5hYnModi1TKTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnModiksTWF0aC5hYnMoUykpJiZNYXRoLmFicyhkLXcpPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyhkKSxNYXRoLmFicyh3KSkmJk1hdGguYWJzKGItSSk8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKGIpLE1hdGguYWJzKEkpKSYmTWF0aC5hYnMobS1OKTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnMobSksTWF0aC5hYnMoTikpJiZNYXRoLmFicyhwLWcpPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyhwKSxNYXRoLmFicyhnKSl9O3ZhciBhPWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDt2YXIgbj17fTtpZihudWxsIT10KWZvcih2YXIgciBpbiB0KU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LHIpJiYobltyXT10W3JdKTtyZXR1cm4gbi5kZWZhdWx0PXQsbn0ocigwKSk7ZnVuY3Rpb24gZSh0KXtyZXR1cm4gdFswXT0xLHRbMV09MCx0WzJdPTAsdFszXT0wLHRbNF09MCx0WzVdPTEsdFs2XT0wLHRbN109MCx0WzhdPTAsdFs5XT0wLHRbMTBdPTEsdFsxMV09MCx0WzEyXT0wLHRbMTNdPTAsdFsxNF09MCx0WzE1XT0xLHR9ZnVuY3Rpb24gdSh0LG4scil7dmFyIGE9blswXSxlPW5bMV0sdT1uWzJdLG89blszXSxpPW5bNF0scz1uWzVdLGM9bls2XSxmPW5bN10sTT1uWzhdLGg9bls5XSxsPW5bMTBdLHY9blsxMV0sZD1uWzEyXSxiPW5bMTNdLG09blsxNF0scD1uWzE1XSxQPXJbMF0sQT1yWzFdLEU9clsyXSxPPXJbM107cmV0dXJuIHRbMF09UCphK0EqaStFKk0rTypkLHRbMV09UCplK0EqcytFKmgrTypiLHRbMl09UCp1K0EqYytFKmwrTyptLHRbM109UCpvK0EqZitFKnYrTypwLFA9cls0XSxBPXJbNV0sRT1yWzZdLE89cls3XSx0WzRdPVAqYStBKmkrRSpNK08qZCx0WzVdPVAqZStBKnMrRSpoK08qYix0WzZdPVAqdStBKmMrRSpsK08qbSx0WzddPVAqbytBKmYrRSp2K08qcCxQPXJbOF0sQT1yWzldLEU9clsxMF0sTz1yWzExXSx0WzhdPVAqYStBKmkrRSpNK08qZCx0WzldPVAqZStBKnMrRSpoK08qYix0WzEwXT1QKnUrQSpjK0UqbCtPKm0sdFsxMV09UCpvK0EqZitFKnYrTypwLFA9clsxMl0sQT1yWzEzXSxFPXJbMTRdLE89clsxNV0sdFsxMl09UCphK0EqaStFKk0rTypkLHRbMTNdPVAqZStBKnMrRSpoK08qYix0WzE0XT1QKnUrQSpjK0UqbCtPKm0sdFsxNV09UCpvK0EqZitFKnYrTypwLHR9ZnVuY3Rpb24gbyh0LG4scil7dmFyIGE9blswXSxlPW5bMV0sdT1uWzJdLG89blszXSxpPWErYSxzPWUrZSxjPXUrdSxmPWEqaSxNPWEqcyxoPWEqYyxsPWUqcyx2PWUqYyxkPXUqYyxiPW8qaSxtPW8qcyxwPW8qYztyZXR1cm4gdFswXT0xLShsK2QpLHRbMV09TStwLHRbMl09aC1tLHRbM109MCx0WzRdPU0tcCx0WzVdPTEtKGYrZCksdFs2XT12K2IsdFs3XT0wLHRbOF09aCttLHRbOV09di1iLHRbMTBdPTEtKGYrbCksdFsxMV09MCx0WzEyXT1yWzBdLHRbMTNdPXJbMV0sdFsxNF09clsyXSx0WzE1XT0xLHR9ZnVuY3Rpb24gaSh0LG4scil7cmV0dXJuIHRbMF09blswXS1yWzBdLHRbMV09blsxXS1yWzFdLHRbMl09blsyXS1yWzJdLHRbM109blszXS1yWzNdLHRbNF09bls0XS1yWzRdLHRbNV09bls1XS1yWzVdLHRbNl09bls2XS1yWzZdLHRbN109bls3XS1yWzddLHRbOF09bls4XS1yWzhdLHRbOV09bls5XS1yWzldLHRbMTBdPW5bMTBdLXJbMTBdLHRbMTFdPW5bMTFdLXJbMTFdLHRbMTJdPW5bMTJdLXJbMTJdLHRbMTNdPW5bMTNdLXJbMTNdLHRbMTRdPW5bMTRdLXJbMTRdLHRbMTVdPW5bMTVdLXJbMTVdLHR9bi5tdWw9dSxuLnN1Yj1pfSxmdW5jdGlvbih0LG4scil7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksbi5zdWI9bi5tdWw9dm9pZCAwLG4uY3JlYXRlPWZ1bmN0aW9uKCl7dmFyIHQ9bmV3IGEuQVJSQVlfVFlQRSg5KTthLkFSUkFZX1RZUEUhPUZsb2F0MzJBcnJheSYmKHRbMV09MCx0WzJdPTAsdFszXT0wLHRbNV09MCx0WzZdPTAsdFs3XT0wKTtyZXR1cm4gdFswXT0xLHRbNF09MSx0WzhdPTEsdH0sbi5mcm9tTWF0ND1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPW5bMF0sdFsxXT1uWzFdLHRbMl09blsyXSx0WzNdPW5bNF0sdFs0XT1uWzVdLHRbNV09bls2XSx0WzZdPW5bOF0sdFs3XT1uWzldLHRbOF09blsxMF0sdH0sbi5jbG9uZT1mdW5jdGlvbih0KXt2YXIgbj1uZXcgYS5BUlJBWV9UWVBFKDkpO3JldHVybiBuWzBdPXRbMF0sblsxXT10WzFdLG5bMl09dFsyXSxuWzNdPXRbM10sbls0XT10WzRdLG5bNV09dFs1XSxuWzZdPXRbNl0sbls3XT10WzddLG5bOF09dFs4XSxufSxuLmNvcHk9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdFswXT1uWzBdLHRbMV09blsxXSx0WzJdPW5bMl0sdFszXT1uWzNdLHRbNF09bls0XSx0WzVdPW5bNV0sdFs2XT1uWzZdLHRbN109bls3XSx0WzhdPW5bOF0sdH0sbi5mcm9tVmFsdWVzPWZ1bmN0aW9uKHQsbixyLGUsdSxvLGkscyxjKXt2YXIgZj1uZXcgYS5BUlJBWV9UWVBFKDkpO3JldHVybiBmWzBdPXQsZlsxXT1uLGZbMl09cixmWzNdPWUsZls0XT11LGZbNV09byxmWzZdPWksZls3XT1zLGZbOF09YyxmfSxuLnNldD1mdW5jdGlvbih0LG4scixhLGUsdSxvLGkscyxjKXtyZXR1cm4gdFswXT1uLHRbMV09cix0WzJdPWEsdFszXT1lLHRbNF09dSx0WzVdPW8sdFs2XT1pLHRbN109cyx0WzhdPWMsdH0sbi5pZGVudGl0eT1mdW5jdGlvbih0KXtyZXR1cm4gdFswXT0xLHRbMV09MCx0WzJdPTAsdFszXT0wLHRbNF09MSx0WzVdPTAsdFs2XT0wLHRbN109MCx0WzhdPTEsdH0sbi50cmFuc3Bvc2U9ZnVuY3Rpb24odCxuKXtpZih0PT09bil7dmFyIHI9blsxXSxhPW5bMl0sZT1uWzVdO3RbMV09blszXSx0WzJdPW5bNl0sdFszXT1yLHRbNV09bls3XSx0WzZdPWEsdFs3XT1lfWVsc2UgdFswXT1uWzBdLHRbMV09blszXSx0WzJdPW5bNl0sdFszXT1uWzFdLHRbNF09bls0XSx0WzVdPW5bN10sdFs2XT1uWzJdLHRbN109bls1XSx0WzhdPW5bOF07cmV0dXJuIHR9LG4uaW52ZXJ0PWZ1bmN0aW9uKHQsbil7dmFyIHI9blswXSxhPW5bMV0sZT1uWzJdLHU9blszXSxvPW5bNF0saT1uWzVdLHM9bls2XSxjPW5bN10sZj1uWzhdLE09ZipvLWkqYyxoPS1mKnUraSpzLGw9Yyp1LW8qcyx2PXIqTSthKmgrZSpsO2lmKCF2KXJldHVybiBudWxsO3JldHVybiB2PTEvdix0WzBdPU0qdix0WzFdPSgtZiphK2UqYykqdix0WzJdPShpKmEtZSpvKSp2LHRbM109aCp2LHRbNF09KGYqci1lKnMpKnYsdFs1XT0oLWkqcitlKnUpKnYsdFs2XT1sKnYsdFs3XT0oLWMqcithKnMpKnYsdFs4XT0obypyLWEqdSkqdix0fSxuLmFkam9pbnQ9ZnVuY3Rpb24odCxuKXt2YXIgcj1uWzBdLGE9blsxXSxlPW5bMl0sdT1uWzNdLG89bls0XSxpPW5bNV0scz1uWzZdLGM9bls3XSxmPW5bOF07cmV0dXJuIHRbMF09bypmLWkqYyx0WzFdPWUqYy1hKmYsdFsyXT1hKmktZSpvLHRbM109aSpzLXUqZix0WzRdPXIqZi1lKnMsdFs1XT1lKnUtcippLHRbNl09dSpjLW8qcyx0WzddPWEqcy1yKmMsdFs4XT1yKm8tYSp1LHR9LG4uZGV0ZXJtaW5hbnQ9ZnVuY3Rpb24odCl7dmFyIG49dFswXSxyPXRbMV0sYT10WzJdLGU9dFszXSx1PXRbNF0sbz10WzVdLGk9dFs2XSxzPXRbN10sYz10WzhdO3JldHVybiBuKihjKnUtbypzKStyKigtYyplK28qaSkrYSoocyplLXUqaSl9LG4ubXVsdGlwbHk9ZSxuLnRyYW5zbGF0ZT1mdW5jdGlvbih0LG4scil7dmFyIGE9blswXSxlPW5bMV0sdT1uWzJdLG89blszXSxpPW5bNF0scz1uWzVdLGM9bls2XSxmPW5bN10sTT1uWzhdLGg9clswXSxsPXJbMV07cmV0dXJuIHRbMF09YSx0WzFdPWUsdFsyXT11LHRbM109byx0WzRdPWksdFs1XT1zLHRbNl09aCphK2wqbytjLHRbN109aCplK2wqaStmLHRbOF09aCp1K2wqcytNLHR9LG4ucm90YXRlPWZ1bmN0aW9uKHQsbixyKXt2YXIgYT1uWzBdLGU9blsxXSx1PW5bMl0sbz1uWzNdLGk9bls0XSxzPW5bNV0sYz1uWzZdLGY9bls3XSxNPW5bOF0saD1NYXRoLnNpbihyKSxsPU1hdGguY29zKHIpO3JldHVybiB0WzBdPWwqYStoKm8sdFsxXT1sKmUraCppLHRbMl09bCp1K2gqcyx0WzNdPWwqby1oKmEsdFs0XT1sKmktaCplLHRbNV09bCpzLWgqdSx0WzZdPWMsdFs3XT1mLHRbOF09TSx0fSxuLnNjYWxlPWZ1bmN0aW9uKHQsbixyKXt2YXIgYT1yWzBdLGU9clsxXTtyZXR1cm4gdFswXT1hKm5bMF0sdFsxXT1hKm5bMV0sdFsyXT1hKm5bMl0sdFszXT1lKm5bM10sdFs0XT1lKm5bNF0sdFs1XT1lKm5bNV0sdFs2XT1uWzZdLHRbN109bls3XSx0WzhdPW5bOF0sdH0sbi5mcm9tVHJhbnNsYXRpb249ZnVuY3Rpb24odCxuKXtyZXR1cm4gdFswXT0xLHRbMV09MCx0WzJdPTAsdFszXT0wLHRbNF09MSx0WzVdPTAsdFs2XT1uWzBdLHRbN109blsxXSx0WzhdPTEsdH0sbi5mcm9tUm90YXRpb249ZnVuY3Rpb24odCxuKXt2YXIgcj1NYXRoLnNpbihuKSxhPU1hdGguY29zKG4pO3JldHVybiB0WzBdPWEsdFsxXT1yLHRbMl09MCx0WzNdPS1yLHRbNF09YSx0WzVdPTAsdFs2XT0wLHRbN109MCx0WzhdPTEsdH0sbi5mcm9tU2NhbGluZz1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPW5bMF0sdFsxXT0wLHRbMl09MCx0WzNdPTAsdFs0XT1uWzFdLHRbNV09MCx0WzZdPTAsdFs3XT0wLHRbOF09MSx0fSxuLmZyb21NYXQyZD1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPW5bMF0sdFsxXT1uWzFdLHRbMl09MCx0WzNdPW5bMl0sdFs0XT1uWzNdLHRbNV09MCx0WzZdPW5bNF0sdFs3XT1uWzVdLHRbOF09MSx0fSxuLmZyb21RdWF0PWZ1bmN0aW9uKHQsbil7dmFyIHI9blswXSxhPW5bMV0sZT1uWzJdLHU9blszXSxvPXIrcixpPWErYSxzPWUrZSxjPXIqbyxmPWEqbyxNPWEqaSxoPWUqbyxsPWUqaSx2PWUqcyxkPXUqbyxiPXUqaSxtPXUqcztyZXR1cm4gdFswXT0xLU0tdix0WzNdPWYtbSx0WzZdPWgrYix0WzFdPWYrbSx0WzRdPTEtYy12LHRbN109bC1kLHRbMl09aC1iLHRbNV09bCtkLHRbOF09MS1jLU0sdH0sbi5ub3JtYWxGcm9tTWF0ND1mdW5jdGlvbih0LG4pe3ZhciByPW5bMF0sYT1uWzFdLGU9blsyXSx1PW5bM10sbz1uWzRdLGk9bls1XSxzPW5bNl0sYz1uWzddLGY9bls4XSxNPW5bOV0saD1uWzEwXSxsPW5bMTFdLHY9blsxMl0sZD1uWzEzXSxiPW5bMTRdLG09blsxNV0scD1yKmktYSpvLFA9cipzLWUqbyxBPXIqYy11Km8sRT1hKnMtZSppLE89YSpjLXUqaSxSPWUqYy11KnMseT1mKmQtTSp2LHE9ZipiLWgqdix4PWYqbS1sKnYsXz1NKmItaCpkLFk9TSptLWwqZCxMPWgqbS1sKmIsUz1wKkwtUCpZK0EqXytFKngtTypxK1IqeTtpZighUylyZXR1cm4gbnVsbDtyZXR1cm4gUz0xL1MsdFswXT0oaSpMLXMqWStjKl8pKlMsdFsxXT0ocyp4LW8qTC1jKnEpKlMsdFsyXT0obypZLWkqeCtjKnkpKlMsdFszXT0oZSpZLWEqTC11Kl8pKlMsdFs0XT0ocipMLWUqeCt1KnEpKlMsdFs1XT0oYSp4LXIqWS11KnkpKlMsdFs2XT0oZCpSLWIqTyttKkUpKlMsdFs3XT0oYipBLXYqUi1tKlApKlMsdFs4XT0odipPLWQqQSttKnApKlMsdH0sbi5wcm9qZWN0aW9uPWZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gdFswXT0yL24sdFsxXT0wLHRbMl09MCx0WzNdPTAsdFs0XT0tMi9yLHRbNV09MCx0WzZdPS0xLHRbN109MSx0WzhdPTEsdH0sbi5zdHI9ZnVuY3Rpb24odCl7cmV0dXJuXCJtYXQzKFwiK3RbMF0rXCIsIFwiK3RbMV0rXCIsIFwiK3RbMl0rXCIsIFwiK3RbM10rXCIsIFwiK3RbNF0rXCIsIFwiK3RbNV0rXCIsIFwiK3RbNl0rXCIsIFwiK3RbN10rXCIsIFwiK3RbOF0rXCIpXCJ9LG4uZnJvYj1mdW5jdGlvbih0KXtyZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHRbMF0sMikrTWF0aC5wb3codFsxXSwyKStNYXRoLnBvdyh0WzJdLDIpK01hdGgucG93KHRbM10sMikrTWF0aC5wb3codFs0XSwyKStNYXRoLnBvdyh0WzVdLDIpK01hdGgucG93KHRbNl0sMikrTWF0aC5wb3codFs3XSwyKStNYXRoLnBvdyh0WzhdLDIpKX0sbi5hZGQ9ZnVuY3Rpb24odCxuLHIpe3JldHVybiB0WzBdPW5bMF0rclswXSx0WzFdPW5bMV0rclsxXSx0WzJdPW5bMl0rclsyXSx0WzNdPW5bM10rclszXSx0WzRdPW5bNF0rcls0XSx0WzVdPW5bNV0rcls1XSx0WzZdPW5bNl0rcls2XSx0WzddPW5bN10rcls3XSx0WzhdPW5bOF0rcls4XSx0fSxuLnN1YnRyYWN0PXUsbi5tdWx0aXBseVNjYWxhcj1mdW5jdGlvbih0LG4scil7cmV0dXJuIHRbMF09blswXSpyLHRbMV09blsxXSpyLHRbMl09blsyXSpyLHRbM109blszXSpyLHRbNF09bls0XSpyLHRbNV09bls1XSpyLHRbNl09bls2XSpyLHRbN109bls3XSpyLHRbOF09bls4XSpyLHR9LG4ubXVsdGlwbHlTY2FsYXJBbmRBZGQ9ZnVuY3Rpb24odCxuLHIsYSl7cmV0dXJuIHRbMF09blswXStyWzBdKmEsdFsxXT1uWzFdK3JbMV0qYSx0WzJdPW5bMl0rclsyXSphLHRbM109blszXStyWzNdKmEsdFs0XT1uWzRdK3JbNF0qYSx0WzVdPW5bNV0rcls1XSphLHRbNl09bls2XStyWzZdKmEsdFs3XT1uWzddK3JbN10qYSx0WzhdPW5bOF0rcls4XSphLHR9LG4uZXhhY3RFcXVhbHM9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdFswXT09PW5bMF0mJnRbMV09PT1uWzFdJiZ0WzJdPT09blsyXSYmdFszXT09PW5bM10mJnRbNF09PT1uWzRdJiZ0WzVdPT09bls1XSYmdFs2XT09PW5bNl0mJnRbN109PT1uWzddJiZ0WzhdPT09bls4XX0sbi5lcXVhbHM9ZnVuY3Rpb24odCxuKXt2YXIgcj10WzBdLGU9dFsxXSx1PXRbMl0sbz10WzNdLGk9dFs0XSxzPXRbNV0sYz10WzZdLGY9dFs3XSxNPXRbOF0saD1uWzBdLGw9blsxXSx2PW5bMl0sZD1uWzNdLGI9bls0XSxtPW5bNV0scD1uWzZdLFA9bls3XSxBPW5bOF07cmV0dXJuIE1hdGguYWJzKHItaCk8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKHIpLE1hdGguYWJzKGgpKSYmTWF0aC5hYnMoZS1sKTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnMoZSksTWF0aC5hYnMobCkpJiZNYXRoLmFicyh1LXYpPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyh1KSxNYXRoLmFicyh2KSkmJk1hdGguYWJzKG8tZCk8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKG8pLE1hdGguYWJzKGQpKSYmTWF0aC5hYnMoaS1iKTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnMoaSksTWF0aC5hYnMoYikpJiZNYXRoLmFicyhzLW0pPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyhzKSxNYXRoLmFicyhtKSkmJk1hdGguYWJzKGMtcCk8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKGMpLE1hdGguYWJzKHApKSYmTWF0aC5hYnMoZi1QKTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnMoZiksTWF0aC5hYnMoUCkpJiZNYXRoLmFicyhNLUEpPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyhNKSxNYXRoLmFicyhBKSl9O3ZhciBhPWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDt2YXIgbj17fTtpZihudWxsIT10KWZvcih2YXIgciBpbiB0KU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LHIpJiYobltyXT10W3JdKTtyZXR1cm4gbi5kZWZhdWx0PXQsbn0ocigwKSk7ZnVuY3Rpb24gZSh0LG4scil7dmFyIGE9blswXSxlPW5bMV0sdT1uWzJdLG89blszXSxpPW5bNF0scz1uWzVdLGM9bls2XSxmPW5bN10sTT1uWzhdLGg9clswXSxsPXJbMV0sdj1yWzJdLGQ9clszXSxiPXJbNF0sbT1yWzVdLHA9cls2XSxQPXJbN10sQT1yWzhdO3JldHVybiB0WzBdPWgqYStsKm8rdipjLHRbMV09aCplK2wqaSt2KmYsdFsyXT1oKnUrbCpzK3YqTSx0WzNdPWQqYStiKm8rbSpjLHRbNF09ZCplK2IqaSttKmYsdFs1XT1kKnUrYipzK20qTSx0WzZdPXAqYStQKm8rQSpjLHRbN109cCplK1AqaStBKmYsdFs4XT1wKnUrUCpzK0EqTSx0fWZ1bmN0aW9uIHUodCxuLHIpe3JldHVybiB0WzBdPW5bMF0tclswXSx0WzFdPW5bMV0tclsxXSx0WzJdPW5bMl0tclsyXSx0WzNdPW5bM10tclszXSx0WzRdPW5bNF0tcls0XSx0WzVdPW5bNV0tcls1XSx0WzZdPW5bNl0tcls2XSx0WzddPW5bN10tcls3XSx0WzhdPW5bOF0tcls4XSx0fW4ubXVsPWUsbi5zdWI9dX0sZnVuY3Rpb24odCxuLHIpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLG4uZm9yRWFjaD1uLnNxckxlbj1uLnNxckRpc3Q9bi5kaXN0PW4uZGl2PW4ubXVsPW4uc3ViPW4ubGVuPXZvaWQgMCxuLmNyZWF0ZT1lLG4uY2xvbmU9ZnVuY3Rpb24odCl7dmFyIG49bmV3IGEuQVJSQVlfVFlQRSgyKTtyZXR1cm4gblswXT10WzBdLG5bMV09dFsxXSxufSxuLmZyb21WYWx1ZXM9ZnVuY3Rpb24odCxuKXt2YXIgcj1uZXcgYS5BUlJBWV9UWVBFKDIpO3JldHVybiByWzBdPXQsclsxXT1uLHJ9LG4uY29weT1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPW5bMF0sdFsxXT1uWzFdLHR9LG4uc2V0PWZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gdFswXT1uLHRbMV09cix0fSxuLmFkZD1mdW5jdGlvbih0LG4scil7cmV0dXJuIHRbMF09blswXStyWzBdLHRbMV09blsxXStyWzFdLHR9LG4uc3VidHJhY3Q9dSxuLm11bHRpcGx5PW8sbi5kaXZpZGU9aSxuLmNlaWw9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdFswXT1NYXRoLmNlaWwoblswXSksdFsxXT1NYXRoLmNlaWwoblsxXSksdH0sbi5mbG9vcj1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPU1hdGguZmxvb3IoblswXSksdFsxXT1NYXRoLmZsb29yKG5bMV0pLHR9LG4ubWluPWZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gdFswXT1NYXRoLm1pbihuWzBdLHJbMF0pLHRbMV09TWF0aC5taW4oblsxXSxyWzFdKSx0fSxuLm1heD1mdW5jdGlvbih0LG4scil7cmV0dXJuIHRbMF09TWF0aC5tYXgoblswXSxyWzBdKSx0WzFdPU1hdGgubWF4KG5bMV0sclsxXSksdH0sbi5yb3VuZD1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPU1hdGgucm91bmQoblswXSksdFsxXT1NYXRoLnJvdW5kKG5bMV0pLHR9LG4uc2NhbGU9ZnVuY3Rpb24odCxuLHIpe3JldHVybiB0WzBdPW5bMF0qcix0WzFdPW5bMV0qcix0fSxuLnNjYWxlQW5kQWRkPWZ1bmN0aW9uKHQsbixyLGEpe3JldHVybiB0WzBdPW5bMF0rclswXSphLHRbMV09blsxXStyWzFdKmEsdH0sbi5kaXN0YW5jZT1zLG4uc3F1YXJlZERpc3RhbmNlPWMsbi5sZW5ndGg9ZixuLnNxdWFyZWRMZW5ndGg9TSxuLm5lZ2F0ZT1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPS1uWzBdLHRbMV09LW5bMV0sdH0sbi5pbnZlcnNlPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHRbMF09MS9uWzBdLHRbMV09MS9uWzFdLHR9LG4ubm9ybWFsaXplPWZ1bmN0aW9uKHQsbil7dmFyIHI9blswXSxhPW5bMV0sZT1yKnIrYSphO2U+MCYmKGU9MS9NYXRoLnNxcnQoZSksdFswXT1uWzBdKmUsdFsxXT1uWzFdKmUpO3JldHVybiB0fSxuLmRvdD1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdKm5bMF0rdFsxXSpuWzFdfSxuLmNyb3NzPWZ1bmN0aW9uKHQsbixyKXt2YXIgYT1uWzBdKnJbMV0tblsxXSpyWzBdO3JldHVybiB0WzBdPXRbMV09MCx0WzJdPWEsdH0sbi5sZXJwPWZ1bmN0aW9uKHQsbixyLGEpe3ZhciBlPW5bMF0sdT1uWzFdO3JldHVybiB0WzBdPWUrYSooclswXS1lKSx0WzFdPXUrYSooclsxXS11KSx0fSxuLnJhbmRvbT1mdW5jdGlvbih0LG4pe249bnx8MTt2YXIgcj0yKmEuUkFORE9NKCkqTWF0aC5QSTtyZXR1cm4gdFswXT1NYXRoLmNvcyhyKSpuLHRbMV09TWF0aC5zaW4ocikqbix0fSxuLnRyYW5zZm9ybU1hdDI9ZnVuY3Rpb24odCxuLHIpe3ZhciBhPW5bMF0sZT1uWzFdO3JldHVybiB0WzBdPXJbMF0qYStyWzJdKmUsdFsxXT1yWzFdKmErclszXSplLHR9LG4udHJhbnNmb3JtTWF0MmQ9ZnVuY3Rpb24odCxuLHIpe3ZhciBhPW5bMF0sZT1uWzFdO3JldHVybiB0WzBdPXJbMF0qYStyWzJdKmUrcls0XSx0WzFdPXJbMV0qYStyWzNdKmUrcls1XSx0fSxuLnRyYW5zZm9ybU1hdDM9ZnVuY3Rpb24odCxuLHIpe3ZhciBhPW5bMF0sZT1uWzFdO3JldHVybiB0WzBdPXJbMF0qYStyWzNdKmUrcls2XSx0WzFdPXJbMV0qYStyWzRdKmUrcls3XSx0fSxuLnRyYW5zZm9ybU1hdDQ9ZnVuY3Rpb24odCxuLHIpe3ZhciBhPW5bMF0sZT1uWzFdO3JldHVybiB0WzBdPXJbMF0qYStyWzRdKmUrclsxMl0sdFsxXT1yWzFdKmErcls1XSplK3JbMTNdLHR9LG4ucm90YXRlPWZ1bmN0aW9uKHQsbixyLGEpe3ZhciBlPW5bMF0tclswXSx1PW5bMV0tclsxXSxvPU1hdGguc2luKGEpLGk9TWF0aC5jb3MoYSk7cmV0dXJuIHRbMF09ZSppLXUqbytyWzBdLHRbMV09ZSpvK3UqaStyWzFdLHR9LG4uYW5nbGU9ZnVuY3Rpb24odCxuKXt2YXIgcj10WzBdLGE9dFsxXSxlPW5bMF0sdT1uWzFdLG89cipyK2EqYTtvPjAmJihvPTEvTWF0aC5zcXJ0KG8pKTt2YXIgaT1lKmUrdSp1O2k+MCYmKGk9MS9NYXRoLnNxcnQoaSkpO3ZhciBzPShyKmUrYSp1KSpvKmk7cmV0dXJuIHM+MT8wOnM8LTE/TWF0aC5QSTpNYXRoLmFjb3Mocyl9LG4uc3RyPWZ1bmN0aW9uKHQpe3JldHVyblwidmVjMihcIit0WzBdK1wiLCBcIit0WzFdK1wiKVwifSxuLmV4YWN0RXF1YWxzPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHRbMF09PT1uWzBdJiZ0WzFdPT09blsxXX0sbi5lcXVhbHM9ZnVuY3Rpb24odCxuKXt2YXIgcj10WzBdLGU9dFsxXSx1PW5bMF0sbz1uWzFdO3JldHVybiBNYXRoLmFicyhyLXUpPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyhyKSxNYXRoLmFicyh1KSkmJk1hdGguYWJzKGUtbyk8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKGUpLE1hdGguYWJzKG8pKX07dmFyIGE9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O3ZhciBuPXt9O2lmKG51bGwhPXQpZm9yKHZhciByIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQscikmJihuW3JdPXRbcl0pO3JldHVybiBuLmRlZmF1bHQ9dCxufShyKDApKTtmdW5jdGlvbiBlKCl7dmFyIHQ9bmV3IGEuQVJSQVlfVFlQRSgyKTtyZXR1cm4gYS5BUlJBWV9UWVBFIT1GbG9hdDMyQXJyYXkmJih0WzBdPTAsdFsxXT0wKSx0fWZ1bmN0aW9uIHUodCxuLHIpe3JldHVybiB0WzBdPW5bMF0tclswXSx0WzFdPW5bMV0tclsxXSx0fWZ1bmN0aW9uIG8odCxuLHIpe3JldHVybiB0WzBdPW5bMF0qclswXSx0WzFdPW5bMV0qclsxXSx0fWZ1bmN0aW9uIGkodCxuLHIpe3JldHVybiB0WzBdPW5bMF0vclswXSx0WzFdPW5bMV0vclsxXSx0fWZ1bmN0aW9uIHModCxuKXt2YXIgcj1uWzBdLXRbMF0sYT1uWzFdLXRbMV07cmV0dXJuIE1hdGguc3FydChyKnIrYSphKX1mdW5jdGlvbiBjKHQsbil7dmFyIHI9blswXS10WzBdLGE9blsxXS10WzFdO3JldHVybiByKnIrYSphfWZ1bmN0aW9uIGYodCl7dmFyIG49dFswXSxyPXRbMV07cmV0dXJuIE1hdGguc3FydChuKm4rcipyKX1mdW5jdGlvbiBNKHQpe3ZhciBuPXRbMF0scj10WzFdO3JldHVybiBuKm4rcipyfW4ubGVuPWYsbi5zdWI9dSxuLm11bD1vLG4uZGl2PWksbi5kaXN0PXMsbi5zcXJEaXN0PWMsbi5zcXJMZW49TSxuLmZvckVhY2g9ZnVuY3Rpb24oKXt2YXIgdD1lKCk7cmV0dXJuIGZ1bmN0aW9uKG4scixhLGUsdSxvKXt2YXIgaT12b2lkIDAscz12b2lkIDA7Zm9yKHJ8fChyPTIpLGF8fChhPTApLHM9ZT9NYXRoLm1pbihlKnIrYSxuLmxlbmd0aCk6bi5sZW5ndGgsaT1hO2k8cztpKz1yKXRbMF09bltpXSx0WzFdPW5baSsxXSx1KHQsdCxvKSxuW2ldPXRbMF0sbltpKzFdPXRbMV07cmV0dXJuIG59fSgpfSxmdW5jdGlvbih0LG4scil7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksbi5zcXJMZW49bi5zcXVhcmVkTGVuZ3RoPW4ubGVuPW4ubGVuZ3RoPW4uZG90PW4ubXVsPW4uc2V0UmVhbD1uLmdldFJlYWw9dm9pZCAwLG4uY3JlYXRlPWZ1bmN0aW9uKCl7dmFyIHQ9bmV3IGEuQVJSQVlfVFlQRSg4KTthLkFSUkFZX1RZUEUhPUZsb2F0MzJBcnJheSYmKHRbMF09MCx0WzFdPTAsdFsyXT0wLHRbNF09MCx0WzVdPTAsdFs2XT0wLHRbN109MCk7cmV0dXJuIHRbM109MSx0fSxuLmNsb25lPWZ1bmN0aW9uKHQpe3ZhciBuPW5ldyBhLkFSUkFZX1RZUEUoOCk7cmV0dXJuIG5bMF09dFswXSxuWzFdPXRbMV0sblsyXT10WzJdLG5bM109dFszXSxuWzRdPXRbNF0sbls1XT10WzVdLG5bNl09dFs2XSxuWzddPXRbN10sbn0sbi5mcm9tVmFsdWVzPWZ1bmN0aW9uKHQsbixyLGUsdSxvLGkscyl7dmFyIGM9bmV3IGEuQVJSQVlfVFlQRSg4KTtyZXR1cm4gY1swXT10LGNbMV09bixjWzJdPXIsY1szXT1lLGNbNF09dSxjWzVdPW8sY1s2XT1pLGNbN109cyxjfSxuLmZyb21Sb3RhdGlvblRyYW5zbGF0aW9uVmFsdWVzPWZ1bmN0aW9uKHQsbixyLGUsdSxvLGkpe3ZhciBzPW5ldyBhLkFSUkFZX1RZUEUoOCk7c1swXT10LHNbMV09bixzWzJdPXIsc1szXT1lO3ZhciBjPS41KnUsZj0uNSpvLE09LjUqaTtyZXR1cm4gc1s0XT1jKmUrZipyLU0qbixzWzVdPWYqZStNKnQtYypyLHNbNl09TSplK2Mqbi1mKnQsc1s3XT0tYyp0LWYqbi1NKnIsc30sbi5mcm9tUm90YXRpb25UcmFuc2xhdGlvbj1pLG4uZnJvbVRyYW5zbGF0aW9uPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHRbMF09MCx0WzFdPTAsdFsyXT0wLHRbM109MSx0WzRdPS41Km5bMF0sdFs1XT0uNSpuWzFdLHRbNl09LjUqblsyXSx0WzddPTAsdH0sbi5mcm9tUm90YXRpb249ZnVuY3Rpb24odCxuKXtyZXR1cm4gdFswXT1uWzBdLHRbMV09blsxXSx0WzJdPW5bMl0sdFszXT1uWzNdLHRbNF09MCx0WzVdPTAsdFs2XT0wLHRbN109MCx0fSxuLmZyb21NYXQ0PWZ1bmN0aW9uKHQsbil7dmFyIHI9ZS5jcmVhdGUoKTt1LmdldFJvdGF0aW9uKHIsbik7dmFyIG89bmV3IGEuQVJSQVlfVFlQRSgzKTtyZXR1cm4gdS5nZXRUcmFuc2xhdGlvbihvLG4pLGkodCxyLG8pLHR9LG4uY29weT1zLG4uaWRlbnRpdHk9ZnVuY3Rpb24odCl7cmV0dXJuIHRbMF09MCx0WzFdPTAsdFsyXT0wLHRbM109MSx0WzRdPTAsdFs1XT0wLHRbNl09MCx0WzddPTAsdH0sbi5zZXQ9ZnVuY3Rpb24odCxuLHIsYSxlLHUsbyxpLHMpe3JldHVybiB0WzBdPW4sdFsxXT1yLHRbMl09YSx0WzNdPWUsdFs0XT11LHRbNV09byx0WzZdPWksdFs3XT1zLHR9LG4uZ2V0RHVhbD1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPW5bNF0sdFsxXT1uWzVdLHRbMl09bls2XSx0WzNdPW5bN10sdH0sbi5zZXREdWFsPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHRbNF09blswXSx0WzVdPW5bMV0sdFs2XT1uWzJdLHRbN109blszXSx0fSxuLmdldFRyYW5zbGF0aW9uPWZ1bmN0aW9uKHQsbil7dmFyIHI9bls0XSxhPW5bNV0sZT1uWzZdLHU9bls3XSxvPS1uWzBdLGk9LW5bMV0scz0tblsyXSxjPW5bM107cmV0dXJuIHRbMF09MioocipjK3UqbythKnMtZSppKSx0WzFdPTIqKGEqYyt1KmkrZSpvLXIqcyksdFsyXT0yKihlKmMrdSpzK3IqaS1hKm8pLHR9LG4udHJhbnNsYXRlPWZ1bmN0aW9uKHQsbixyKXt2YXIgYT1uWzBdLGU9blsxXSx1PW5bMl0sbz1uWzNdLGk9LjUqclswXSxzPS41KnJbMV0sYz0uNSpyWzJdLGY9bls0XSxNPW5bNV0saD1uWzZdLGw9bls3XTtyZXR1cm4gdFswXT1hLHRbMV09ZSx0WzJdPXUsdFszXT1vLHRbNF09byppK2UqYy11KnMrZix0WzVdPW8qcyt1KmktYSpjK00sdFs2XT1vKmMrYSpzLWUqaStoLHRbN109LWEqaS1lKnMtdSpjK2wsdH0sbi5yb3RhdGVYPWZ1bmN0aW9uKHQsbixyKXt2YXIgYT0tblswXSx1PS1uWzFdLG89LW5bMl0saT1uWzNdLHM9bls0XSxjPW5bNV0sZj1uWzZdLE09bls3XSxoPXMqaStNKmErYypvLWYqdSxsPWMqaStNKnUrZiphLXMqbyx2PWYqaStNKm8rcyp1LWMqYSxkPU0qaS1zKmEtYyp1LWYqbztyZXR1cm4gZS5yb3RhdGVYKHQsbixyKSxhPXRbMF0sdT10WzFdLG89dFsyXSxpPXRbM10sdFs0XT1oKmkrZCphK2wqby12KnUsdFs1XT1sKmkrZCp1K3YqYS1oKm8sdFs2XT12KmkrZCpvK2gqdS1sKmEsdFs3XT1kKmktaCphLWwqdS12Km8sdH0sbi5yb3RhdGVZPWZ1bmN0aW9uKHQsbixyKXt2YXIgYT0tblswXSx1PS1uWzFdLG89LW5bMl0saT1uWzNdLHM9bls0XSxjPW5bNV0sZj1uWzZdLE09bls3XSxoPXMqaStNKmErYypvLWYqdSxsPWMqaStNKnUrZiphLXMqbyx2PWYqaStNKm8rcyp1LWMqYSxkPU0qaS1zKmEtYyp1LWYqbztyZXR1cm4gZS5yb3RhdGVZKHQsbixyKSxhPXRbMF0sdT10WzFdLG89dFsyXSxpPXRbM10sdFs0XT1oKmkrZCphK2wqby12KnUsdFs1XT1sKmkrZCp1K3YqYS1oKm8sdFs2XT12KmkrZCpvK2gqdS1sKmEsdFs3XT1kKmktaCphLWwqdS12Km8sdH0sbi5yb3RhdGVaPWZ1bmN0aW9uKHQsbixyKXt2YXIgYT0tblswXSx1PS1uWzFdLG89LW5bMl0saT1uWzNdLHM9bls0XSxjPW5bNV0sZj1uWzZdLE09bls3XSxoPXMqaStNKmErYypvLWYqdSxsPWMqaStNKnUrZiphLXMqbyx2PWYqaStNKm8rcyp1LWMqYSxkPU0qaS1zKmEtYyp1LWYqbztyZXR1cm4gZS5yb3RhdGVaKHQsbixyKSxhPXRbMF0sdT10WzFdLG89dFsyXSxpPXRbM10sdFs0XT1oKmkrZCphK2wqby12KnUsdFs1XT1sKmkrZCp1K3YqYS1oKm8sdFs2XT12KmkrZCpvK2gqdS1sKmEsdFs3XT1kKmktaCphLWwqdS12Km8sdH0sbi5yb3RhdGVCeVF1YXRBcHBlbmQ9ZnVuY3Rpb24odCxuLHIpe3ZhciBhPXJbMF0sZT1yWzFdLHU9clsyXSxvPXJbM10saT1uWzBdLHM9blsxXSxjPW5bMl0sZj1uWzNdO3JldHVybiB0WzBdPWkqbytmKmErcyp1LWMqZSx0WzFdPXMqbytmKmUrYyphLWkqdSx0WzJdPWMqbytmKnUraSplLXMqYSx0WzNdPWYqby1pKmEtcyplLWMqdSxpPW5bNF0scz1uWzVdLGM9bls2XSxmPW5bN10sdFs0XT1pKm8rZiphK3MqdS1jKmUsdFs1XT1zKm8rZiplK2MqYS1pKnUsdFs2XT1jKm8rZip1K2kqZS1zKmEsdFs3XT1mKm8taSphLXMqZS1jKnUsdH0sbi5yb3RhdGVCeVF1YXRQcmVwZW5kPWZ1bmN0aW9uKHQsbixyKXt2YXIgYT1uWzBdLGU9blsxXSx1PW5bMl0sbz1uWzNdLGk9clswXSxzPXJbMV0sYz1yWzJdLGY9clszXTtyZXR1cm4gdFswXT1hKmYrbyppK2UqYy11KnMsdFsxXT1lKmYrbypzK3UqaS1hKmMsdFsyXT11KmYrbypjK2Eqcy1lKmksdFszXT1vKmYtYSppLWUqcy11KmMsaT1yWzRdLHM9cls1XSxjPXJbNl0sZj1yWzddLHRbNF09YSpmK28qaStlKmMtdSpzLHRbNV09ZSpmK28qcyt1KmktYSpjLHRbNl09dSpmK28qYythKnMtZSppLHRbN109bypmLWEqaS1lKnMtdSpjLHR9LG4ucm90YXRlQXJvdW5kQXhpcz1mdW5jdGlvbih0LG4scixlKXtpZihNYXRoLmFicyhlKTxhLkVQU0lMT04pcmV0dXJuIHModCxuKTt2YXIgdT1NYXRoLnNxcnQoclswXSpyWzBdK3JbMV0qclsxXStyWzJdKnJbMl0pO2UqPS41O3ZhciBvPU1hdGguc2luKGUpLGk9bypyWzBdL3UsYz1vKnJbMV0vdSxmPW8qclsyXS91LE09TWF0aC5jb3MoZSksaD1uWzBdLGw9blsxXSx2PW5bMl0sZD1uWzNdO3RbMF09aCpNK2QqaStsKmYtdipjLHRbMV09bCpNK2QqYyt2KmktaCpmLHRbMl09dipNK2QqZitoKmMtbCppLHRbM109ZCpNLWgqaS1sKmMtdipmO3ZhciBiPW5bNF0sbT1uWzVdLHA9bls2XSxQPW5bN107cmV0dXJuIHRbNF09YipNK1AqaSttKmYtcCpjLHRbNV09bSpNK1AqYytwKmktYipmLHRbNl09cCpNK1AqZitiKmMtbSppLHRbN109UCpNLWIqaS1tKmMtcCpmLHR9LG4uYWRkPWZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gdFswXT1uWzBdK3JbMF0sdFsxXT1uWzFdK3JbMV0sdFsyXT1uWzJdK3JbMl0sdFszXT1uWzNdK3JbM10sdFs0XT1uWzRdK3JbNF0sdFs1XT1uWzVdK3JbNV0sdFs2XT1uWzZdK3JbNl0sdFs3XT1uWzddK3JbN10sdH0sbi5tdWx0aXBseT1jLG4uc2NhbGU9ZnVuY3Rpb24odCxuLHIpe3JldHVybiB0WzBdPW5bMF0qcix0WzFdPW5bMV0qcix0WzJdPW5bMl0qcix0WzNdPW5bM10qcix0WzRdPW5bNF0qcix0WzVdPW5bNV0qcix0WzZdPW5bNl0qcix0WzddPW5bN10qcix0fSxuLmxlcnA9ZnVuY3Rpb24odCxuLHIsYSl7dmFyIGU9MS1hO2YobixyKTwwJiYoYT0tYSk7cmV0dXJuIHRbMF09blswXSplK3JbMF0qYSx0WzFdPW5bMV0qZStyWzFdKmEsdFsyXT1uWzJdKmUrclsyXSphLHRbM109blszXSplK3JbM10qYSx0WzRdPW5bNF0qZStyWzRdKmEsdFs1XT1uWzVdKmUrcls1XSphLHRbNl09bls2XSplK3JbNl0qYSx0WzddPW5bN10qZStyWzddKmEsdH0sbi5pbnZlcnQ9ZnVuY3Rpb24odCxuKXt2YXIgcj1oKG4pO3JldHVybiB0WzBdPS1uWzBdL3IsdFsxXT0tblsxXS9yLHRbMl09LW5bMl0vcix0WzNdPW5bM10vcix0WzRdPS1uWzRdL3IsdFs1XT0tbls1XS9yLHRbNl09LW5bNl0vcix0WzddPW5bN10vcix0fSxuLmNvbmp1Z2F0ZT1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPS1uWzBdLHRbMV09LW5bMV0sdFsyXT0tblsyXSx0WzNdPW5bM10sdFs0XT0tbls0XSx0WzVdPS1uWzVdLHRbNl09LW5bNl0sdFs3XT1uWzddLHR9LG4ubm9ybWFsaXplPWZ1bmN0aW9uKHQsbil7dmFyIHI9aChuKTtpZihyPjApe3I9TWF0aC5zcXJ0KHIpO3ZhciBhPW5bMF0vcixlPW5bMV0vcix1PW5bMl0vcixvPW5bM10vcixpPW5bNF0scz1uWzVdLGM9bls2XSxmPW5bN10sTT1hKmkrZSpzK3UqYytvKmY7dFswXT1hLHRbMV09ZSx0WzJdPXUsdFszXT1vLHRbNF09KGktYSpNKS9yLHRbNV09KHMtZSpNKS9yLHRbNl09KGMtdSpNKS9yLHRbN109KGYtbypNKS9yfXJldHVybiB0fSxuLnN0cj1mdW5jdGlvbih0KXtyZXR1cm5cInF1YXQyKFwiK3RbMF0rXCIsIFwiK3RbMV0rXCIsIFwiK3RbMl0rXCIsIFwiK3RbM10rXCIsIFwiK3RbNF0rXCIsIFwiK3RbNV0rXCIsIFwiK3RbNl0rXCIsIFwiK3RbN10rXCIpXCJ9LG4uZXhhY3RFcXVhbHM9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdFswXT09PW5bMF0mJnRbMV09PT1uWzFdJiZ0WzJdPT09blsyXSYmdFszXT09PW5bM10mJnRbNF09PT1uWzRdJiZ0WzVdPT09bls1XSYmdFs2XT09PW5bNl0mJnRbN109PT1uWzddfSxuLmVxdWFscz1mdW5jdGlvbih0LG4pe3ZhciByPXRbMF0sZT10WzFdLHU9dFsyXSxvPXRbM10saT10WzRdLHM9dFs1XSxjPXRbNl0sZj10WzddLE09blswXSxoPW5bMV0sbD1uWzJdLHY9blszXSxkPW5bNF0sYj1uWzVdLG09bls2XSxwPW5bN107cmV0dXJuIE1hdGguYWJzKHItTSk8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKHIpLE1hdGguYWJzKE0pKSYmTWF0aC5hYnMoZS1oKTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnMoZSksTWF0aC5hYnMoaCkpJiZNYXRoLmFicyh1LWwpPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyh1KSxNYXRoLmFicyhsKSkmJk1hdGguYWJzKG8tdik8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKG8pLE1hdGguYWJzKHYpKSYmTWF0aC5hYnMoaS1kKTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnMoaSksTWF0aC5hYnMoZCkpJiZNYXRoLmFicyhzLWIpPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyhzKSxNYXRoLmFicyhiKSkmJk1hdGguYWJzKGMtbSk8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKGMpLE1hdGguYWJzKG0pKSYmTWF0aC5hYnMoZi1wKTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnMoZiksTWF0aC5hYnMocCkpfTt2YXIgYT1vKHIoMCkpLGU9byhyKDMpKSx1PW8ocig0KSk7ZnVuY3Rpb24gbyh0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7dmFyIG49e307aWYobnVsbCE9dClmb3IodmFyIHIgaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxyKSYmKG5bcl09dFtyXSk7cmV0dXJuIG4uZGVmYXVsdD10LG59ZnVuY3Rpb24gaSh0LG4scil7dmFyIGE9LjUqclswXSxlPS41KnJbMV0sdT0uNSpyWzJdLG89blswXSxpPW5bMV0scz1uWzJdLGM9blszXTtyZXR1cm4gdFswXT1vLHRbMV09aSx0WzJdPXMsdFszXT1jLHRbNF09YSpjK2Uqcy11KmksdFs1XT1lKmMrdSpvLWEqcyx0WzZdPXUqYythKmktZSpvLHRbN109LWEqby1lKmktdSpzLHR9ZnVuY3Rpb24gcyh0LG4pe3JldHVybiB0WzBdPW5bMF0sdFsxXT1uWzFdLHRbMl09blsyXSx0WzNdPW5bM10sdFs0XT1uWzRdLHRbNV09bls1XSx0WzZdPW5bNl0sdFs3XT1uWzddLHR9bi5nZXRSZWFsPWUuY29weTtuLnNldFJlYWw9ZS5jb3B5O2Z1bmN0aW9uIGModCxuLHIpe3ZhciBhPW5bMF0sZT1uWzFdLHU9blsyXSxvPW5bM10saT1yWzRdLHM9cls1XSxjPXJbNl0sZj1yWzddLE09bls0XSxoPW5bNV0sbD1uWzZdLHY9bls3XSxkPXJbMF0sYj1yWzFdLG09clsyXSxwPXJbM107cmV0dXJuIHRbMF09YSpwK28qZCtlKm0tdSpiLHRbMV09ZSpwK28qYit1KmQtYSptLHRbMl09dSpwK28qbSthKmItZSpkLHRbM109bypwLWEqZC1lKmItdSptLHRbNF09YSpmK28qaStlKmMtdSpzK00qcCt2KmQraCptLWwqYix0WzVdPWUqZitvKnMrdSppLWEqYytoKnArdipiK2wqZC1NKm0sdFs2XT11KmYrbypjK2Eqcy1lKmkrbCpwK3YqbStNKmItaCpkLHRbN109bypmLWEqaS1lKnMtdSpjK3YqcC1NKmQtaCpiLWwqbSx0fW4ubXVsPWM7dmFyIGY9bi5kb3Q9ZS5kb3Q7dmFyIE09bi5sZW5ndGg9ZS5sZW5ndGgsaD0obi5sZW49TSxuLnNxdWFyZWRMZW5ndGg9ZS5zcXVhcmVkTGVuZ3RoKTtuLnNxckxlbj1ofSxmdW5jdGlvbih0LG4scil7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksbi5zdWI9bi5tdWw9dm9pZCAwLG4uY3JlYXRlPWZ1bmN0aW9uKCl7dmFyIHQ9bmV3IGEuQVJSQVlfVFlQRSg2KTthLkFSUkFZX1RZUEUhPUZsb2F0MzJBcnJheSYmKHRbMV09MCx0WzJdPTAsdFs0XT0wLHRbNV09MCk7cmV0dXJuIHRbMF09MSx0WzNdPTEsdH0sbi5jbG9uZT1mdW5jdGlvbih0KXt2YXIgbj1uZXcgYS5BUlJBWV9UWVBFKDYpO3JldHVybiBuWzBdPXRbMF0sblsxXT10WzFdLG5bMl09dFsyXSxuWzNdPXRbM10sbls0XT10WzRdLG5bNV09dFs1XSxufSxuLmNvcHk9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdFswXT1uWzBdLHRbMV09blsxXSx0WzJdPW5bMl0sdFszXT1uWzNdLHRbNF09bls0XSx0WzVdPW5bNV0sdH0sbi5pZGVudGl0eT1mdW5jdGlvbih0KXtyZXR1cm4gdFswXT0xLHRbMV09MCx0WzJdPTAsdFszXT0xLHRbNF09MCx0WzVdPTAsdH0sbi5mcm9tVmFsdWVzPWZ1bmN0aW9uKHQsbixyLGUsdSxvKXt2YXIgaT1uZXcgYS5BUlJBWV9UWVBFKDYpO3JldHVybiBpWzBdPXQsaVsxXT1uLGlbMl09cixpWzNdPWUsaVs0XT11LGlbNV09byxpfSxuLnNldD1mdW5jdGlvbih0LG4scixhLGUsdSxvKXtyZXR1cm4gdFswXT1uLHRbMV09cix0WzJdPWEsdFszXT1lLHRbNF09dSx0WzVdPW8sdH0sbi5pbnZlcnQ9ZnVuY3Rpb24odCxuKXt2YXIgcj1uWzBdLGE9blsxXSxlPW5bMl0sdT1uWzNdLG89bls0XSxpPW5bNV0scz1yKnUtYSplO2lmKCFzKXJldHVybiBudWxsO3JldHVybiBzPTEvcyx0WzBdPXUqcyx0WzFdPS1hKnMsdFsyXT0tZSpzLHRbM109cipzLHRbNF09KGUqaS11Km8pKnMsdFs1XT0oYSpvLXIqaSkqcyx0fSxuLmRldGVybWluYW50PWZ1bmN0aW9uKHQpe3JldHVybiB0WzBdKnRbM10tdFsxXSp0WzJdfSxuLm11bHRpcGx5PWUsbi5yb3RhdGU9ZnVuY3Rpb24odCxuLHIpe3ZhciBhPW5bMF0sZT1uWzFdLHU9blsyXSxvPW5bM10saT1uWzRdLHM9bls1XSxjPU1hdGguc2luKHIpLGY9TWF0aC5jb3Mocik7cmV0dXJuIHRbMF09YSpmK3UqYyx0WzFdPWUqZitvKmMsdFsyXT1hKi1jK3UqZix0WzNdPWUqLWMrbypmLHRbNF09aSx0WzVdPXMsdH0sbi5zY2FsZT1mdW5jdGlvbih0LG4scil7dmFyIGE9blswXSxlPW5bMV0sdT1uWzJdLG89blszXSxpPW5bNF0scz1uWzVdLGM9clswXSxmPXJbMV07cmV0dXJuIHRbMF09YSpjLHRbMV09ZSpjLHRbMl09dSpmLHRbM109bypmLHRbNF09aSx0WzVdPXMsdH0sbi50cmFuc2xhdGU9ZnVuY3Rpb24odCxuLHIpe3ZhciBhPW5bMF0sZT1uWzFdLHU9blsyXSxvPW5bM10saT1uWzRdLHM9bls1XSxjPXJbMF0sZj1yWzFdO3JldHVybiB0WzBdPWEsdFsxXT1lLHRbMl09dSx0WzNdPW8sdFs0XT1hKmMrdSpmK2ksdFs1XT1lKmMrbypmK3MsdH0sbi5mcm9tUm90YXRpb249ZnVuY3Rpb24odCxuKXt2YXIgcj1NYXRoLnNpbihuKSxhPU1hdGguY29zKG4pO3JldHVybiB0WzBdPWEsdFsxXT1yLHRbMl09LXIsdFszXT1hLHRbNF09MCx0WzVdPTAsdH0sbi5mcm9tU2NhbGluZz1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPW5bMF0sdFsxXT0wLHRbMl09MCx0WzNdPW5bMV0sdFs0XT0wLHRbNV09MCx0fSxuLmZyb21UcmFuc2xhdGlvbj1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPTEsdFsxXT0wLHRbMl09MCx0WzNdPTEsdFs0XT1uWzBdLHRbNV09blsxXSx0fSxuLnN0cj1mdW5jdGlvbih0KXtyZXR1cm5cIm1hdDJkKFwiK3RbMF0rXCIsIFwiK3RbMV0rXCIsIFwiK3RbMl0rXCIsIFwiK3RbM10rXCIsIFwiK3RbNF0rXCIsIFwiK3RbNV0rXCIpXCJ9LG4uZnJvYj1mdW5jdGlvbih0KXtyZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHRbMF0sMikrTWF0aC5wb3codFsxXSwyKStNYXRoLnBvdyh0WzJdLDIpK01hdGgucG93KHRbM10sMikrTWF0aC5wb3codFs0XSwyKStNYXRoLnBvdyh0WzVdLDIpKzEpfSxuLmFkZD1mdW5jdGlvbih0LG4scil7cmV0dXJuIHRbMF09blswXStyWzBdLHRbMV09blsxXStyWzFdLHRbMl09blsyXStyWzJdLHRbM109blszXStyWzNdLHRbNF09bls0XStyWzRdLHRbNV09bls1XStyWzVdLHR9LG4uc3VidHJhY3Q9dSxuLm11bHRpcGx5U2NhbGFyPWZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gdFswXT1uWzBdKnIsdFsxXT1uWzFdKnIsdFsyXT1uWzJdKnIsdFszXT1uWzNdKnIsdFs0XT1uWzRdKnIsdFs1XT1uWzVdKnIsdH0sbi5tdWx0aXBseVNjYWxhckFuZEFkZD1mdW5jdGlvbih0LG4scixhKXtyZXR1cm4gdFswXT1uWzBdK3JbMF0qYSx0WzFdPW5bMV0rclsxXSphLHRbMl09blsyXStyWzJdKmEsdFszXT1uWzNdK3JbM10qYSx0WzRdPW5bNF0rcls0XSphLHRbNV09bls1XStyWzVdKmEsdH0sbi5leGFjdEVxdWFscz1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPT09blswXSYmdFsxXT09PW5bMV0mJnRbMl09PT1uWzJdJiZ0WzNdPT09blszXSYmdFs0XT09PW5bNF0mJnRbNV09PT1uWzVdfSxuLmVxdWFscz1mdW5jdGlvbih0LG4pe3ZhciByPXRbMF0sZT10WzFdLHU9dFsyXSxvPXRbM10saT10WzRdLHM9dFs1XSxjPW5bMF0sZj1uWzFdLE09blsyXSxoPW5bM10sbD1uWzRdLHY9bls1XTtyZXR1cm4gTWF0aC5hYnMoci1jKTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnMociksTWF0aC5hYnMoYykpJiZNYXRoLmFicyhlLWYpPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyhlKSxNYXRoLmFicyhmKSkmJk1hdGguYWJzKHUtTSk8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKHUpLE1hdGguYWJzKE0pKSYmTWF0aC5hYnMoby1oKTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnMobyksTWF0aC5hYnMoaCkpJiZNYXRoLmFicyhpLWwpPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyhpKSxNYXRoLmFicyhsKSkmJk1hdGguYWJzKHMtdik8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKHMpLE1hdGguYWJzKHYpKX07dmFyIGE9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O3ZhciBuPXt9O2lmKG51bGwhPXQpZm9yKHZhciByIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQscikmJihuW3JdPXRbcl0pO3JldHVybiBuLmRlZmF1bHQ9dCxufShyKDApKTtmdW5jdGlvbiBlKHQsbixyKXt2YXIgYT1uWzBdLGU9blsxXSx1PW5bMl0sbz1uWzNdLGk9bls0XSxzPW5bNV0sYz1yWzBdLGY9clsxXSxNPXJbMl0saD1yWzNdLGw9cls0XSx2PXJbNV07cmV0dXJuIHRbMF09YSpjK3UqZix0WzFdPWUqYytvKmYsdFsyXT1hKk0rdSpoLHRbM109ZSpNK28qaCx0WzRdPWEqbCt1KnYraSx0WzVdPWUqbCtvKnYrcyx0fWZ1bmN0aW9uIHUodCxuLHIpe3JldHVybiB0WzBdPW5bMF0tclswXSx0WzFdPW5bMV0tclsxXSx0WzJdPW5bMl0tclsyXSx0WzNdPW5bM10tclszXSx0WzRdPW5bNF0tcls0XSx0WzVdPW5bNV0tcls1XSx0fW4ubXVsPWUsbi5zdWI9dX0sZnVuY3Rpb24odCxuLHIpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLG4uc3ViPW4ubXVsPXZvaWQgMCxuLmNyZWF0ZT1mdW5jdGlvbigpe3ZhciB0PW5ldyBhLkFSUkFZX1RZUEUoNCk7YS5BUlJBWV9UWVBFIT1GbG9hdDMyQXJyYXkmJih0WzFdPTAsdFsyXT0wKTtyZXR1cm4gdFswXT0xLHRbM109MSx0fSxuLmNsb25lPWZ1bmN0aW9uKHQpe3ZhciBuPW5ldyBhLkFSUkFZX1RZUEUoNCk7cmV0dXJuIG5bMF09dFswXSxuWzFdPXRbMV0sblsyXT10WzJdLG5bM109dFszXSxufSxuLmNvcHk9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdFswXT1uWzBdLHRbMV09blsxXSx0WzJdPW5bMl0sdFszXT1uWzNdLHR9LG4uaWRlbnRpdHk9ZnVuY3Rpb24odCl7cmV0dXJuIHRbMF09MSx0WzFdPTAsdFsyXT0wLHRbM109MSx0fSxuLmZyb21WYWx1ZXM9ZnVuY3Rpb24odCxuLHIsZSl7dmFyIHU9bmV3IGEuQVJSQVlfVFlQRSg0KTtyZXR1cm4gdVswXT10LHVbMV09bix1WzJdPXIsdVszXT1lLHV9LG4uc2V0PWZ1bmN0aW9uKHQsbixyLGEsZSl7cmV0dXJuIHRbMF09bix0WzFdPXIsdFsyXT1hLHRbM109ZSx0fSxuLnRyYW5zcG9zZT1mdW5jdGlvbih0LG4pe2lmKHQ9PT1uKXt2YXIgcj1uWzFdO3RbMV09blsyXSx0WzJdPXJ9ZWxzZSB0WzBdPW5bMF0sdFsxXT1uWzJdLHRbMl09blsxXSx0WzNdPW5bM107cmV0dXJuIHR9LG4uaW52ZXJ0PWZ1bmN0aW9uKHQsbil7dmFyIHI9blswXSxhPW5bMV0sZT1uWzJdLHU9blszXSxvPXIqdS1lKmE7aWYoIW8pcmV0dXJuIG51bGw7cmV0dXJuIG89MS9vLHRbMF09dSpvLHRbMV09LWEqbyx0WzJdPS1lKm8sdFszXT1yKm8sdH0sbi5hZGpvaW50PWZ1bmN0aW9uKHQsbil7dmFyIHI9blswXTtyZXR1cm4gdFswXT1uWzNdLHRbMV09LW5bMV0sdFsyXT0tblsyXSx0WzNdPXIsdH0sbi5kZXRlcm1pbmFudD1mdW5jdGlvbih0KXtyZXR1cm4gdFswXSp0WzNdLXRbMl0qdFsxXX0sbi5tdWx0aXBseT1lLG4ucm90YXRlPWZ1bmN0aW9uKHQsbixyKXt2YXIgYT1uWzBdLGU9blsxXSx1PW5bMl0sbz1uWzNdLGk9TWF0aC5zaW4ocikscz1NYXRoLmNvcyhyKTtyZXR1cm4gdFswXT1hKnMrdSppLHRbMV09ZSpzK28qaSx0WzJdPWEqLWkrdSpzLHRbM109ZSotaStvKnMsdH0sbi5zY2FsZT1mdW5jdGlvbih0LG4scil7dmFyIGE9blswXSxlPW5bMV0sdT1uWzJdLG89blszXSxpPXJbMF0scz1yWzFdO3JldHVybiB0WzBdPWEqaSx0WzFdPWUqaSx0WzJdPXUqcyx0WzNdPW8qcyx0fSxuLmZyb21Sb3RhdGlvbj1mdW5jdGlvbih0LG4pe3ZhciByPU1hdGguc2luKG4pLGE9TWF0aC5jb3Mobik7cmV0dXJuIHRbMF09YSx0WzFdPXIsdFsyXT0tcix0WzNdPWEsdH0sbi5mcm9tU2NhbGluZz1mdW5jdGlvbih0LG4pe3JldHVybiB0WzBdPW5bMF0sdFsxXT0wLHRbMl09MCx0WzNdPW5bMV0sdH0sbi5zdHI9ZnVuY3Rpb24odCl7cmV0dXJuXCJtYXQyKFwiK3RbMF0rXCIsIFwiK3RbMV0rXCIsIFwiK3RbMl0rXCIsIFwiK3RbM10rXCIpXCJ9LG4uZnJvYj1mdW5jdGlvbih0KXtyZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHRbMF0sMikrTWF0aC5wb3codFsxXSwyKStNYXRoLnBvdyh0WzJdLDIpK01hdGgucG93KHRbM10sMikpfSxuLkxEVT1mdW5jdGlvbih0LG4scixhKXtyZXR1cm4gdFsyXT1hWzJdL2FbMF0sclswXT1hWzBdLHJbMV09YVsxXSxyWzNdPWFbM10tdFsyXSpyWzFdLFt0LG4scl19LG4uYWRkPWZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gdFswXT1uWzBdK3JbMF0sdFsxXT1uWzFdK3JbMV0sdFsyXT1uWzJdK3JbMl0sdFszXT1uWzNdK3JbM10sdH0sbi5zdWJ0cmFjdD11LG4uZXhhY3RFcXVhbHM9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdFswXT09PW5bMF0mJnRbMV09PT1uWzFdJiZ0WzJdPT09blsyXSYmdFszXT09PW5bM119LG4uZXF1YWxzPWZ1bmN0aW9uKHQsbil7dmFyIHI9dFswXSxlPXRbMV0sdT10WzJdLG89dFszXSxpPW5bMF0scz1uWzFdLGM9blsyXSxmPW5bM107cmV0dXJuIE1hdGguYWJzKHItaSk8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKHIpLE1hdGguYWJzKGkpKSYmTWF0aC5hYnMoZS1zKTw9YS5FUFNJTE9OKk1hdGgubWF4KDEsTWF0aC5hYnMoZSksTWF0aC5hYnMocykpJiZNYXRoLmFicyh1LWMpPD1hLkVQU0lMT04qTWF0aC5tYXgoMSxNYXRoLmFicyh1KSxNYXRoLmFicyhjKSkmJk1hdGguYWJzKG8tZik8PWEuRVBTSUxPTipNYXRoLm1heCgxLE1hdGguYWJzKG8pLE1hdGguYWJzKGYpKX0sbi5tdWx0aXBseVNjYWxhcj1mdW5jdGlvbih0LG4scil7cmV0dXJuIHRbMF09blswXSpyLHRbMV09blsxXSpyLHRbMl09blsyXSpyLHRbM109blszXSpyLHR9LG4ubXVsdGlwbHlTY2FsYXJBbmRBZGQ9ZnVuY3Rpb24odCxuLHIsYSl7cmV0dXJuIHRbMF09blswXStyWzBdKmEsdFsxXT1uWzFdK3JbMV0qYSx0WzJdPW5bMl0rclsyXSphLHRbM109blszXStyWzNdKmEsdH07dmFyIGE9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O3ZhciBuPXt9O2lmKG51bGwhPXQpZm9yKHZhciByIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQscikmJihuW3JdPXRbcl0pO3JldHVybiBuLmRlZmF1bHQ9dCxufShyKDApKTtmdW5jdGlvbiBlKHQsbixyKXt2YXIgYT1uWzBdLGU9blsxXSx1PW5bMl0sbz1uWzNdLGk9clswXSxzPXJbMV0sYz1yWzJdLGY9clszXTtyZXR1cm4gdFswXT1hKmkrdSpzLHRbMV09ZSppK28qcyx0WzJdPWEqYyt1KmYsdFszXT1lKmMrbypmLHR9ZnVuY3Rpb24gdSh0LG4scil7cmV0dXJuIHRbMF09blswXS1yWzBdLHRbMV09blsxXS1yWzFdLHRbMl09blsyXS1yWzJdLHRbM109blszXS1yWzNdLHR9bi5tdWw9ZSxuLnN1Yj11fSxmdW5jdGlvbih0LG4scil7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksbi52ZWM0PW4udmVjMz1uLnZlYzI9bi5xdWF0Mj1uLnF1YXQ9bi5tYXQ0PW4ubWF0Mz1uLm1hdDJkPW4ubWF0Mj1uLmdsTWF0cml4PXZvaWQgMDt2YXIgYT1sKHIoMCkpLGU9bChyKDkpKSx1PWwocig4KSksbz1sKHIoNSkpLGk9bChyKDQpKSxzPWwocigzKSksYz1sKHIoNykpLGY9bChyKDYpKSxNPWwocigyKSksaD1sKHIoMSkpO2Z1bmN0aW9uIGwodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O3ZhciBuPXt9O2lmKG51bGwhPXQpZm9yKHZhciByIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQscikmJihuW3JdPXRbcl0pO3JldHVybiBuLmRlZmF1bHQ9dCxufW4uZ2xNYXRyaXg9YSxuLm1hdDI9ZSxuLm1hdDJkPXUsbi5tYXQzPW8sbi5tYXQ0PWksbi5xdWF0PXMsbi5xdWF0Mj1jLG4udmVjMj1mLG4udmVjMz1NLG4udmVjND1ofV0pfSk7IiwiZXhwb3J0cy5zdXJmYWNlTmV0cyAgICAgICAgID0gcmVxdWlyZShcIi4vbGliL3N1cmZhY2VuZXRzLmpzXCIpLnN1cmZhY2VOZXRzO1xuZXhwb3J0cy5tYXJjaGluZ0N1YmVzICAgICAgID0gcmVxdWlyZShcIi4vbGliL21hcmNoaW5nY3ViZXMuanNcIikubWFyY2hpbmdDdWJlcztcbmV4cG9ydHMubWFyY2hpbmdUZXRyYWhlZHJhICA9IHJlcXVpcmUoXCIuL2xpYi9tYXJjaGluZ3RldHJhaGVkcmEuanNcIikubWFyY2hpbmdUZXRyYWhlZHJhO1xuIiwiLyoqXG4gKiBKYXZhc2NyaXB0IE1hcmNoaW5nIEN1YmVzXG4gKlxuICogQmFzZWQgb24gUGF1bCBCb3Vya2UncyBjbGFzc2ljIGltcGxlbWVudGF0aW9uOlxuICogICAgaHR0cDovL2xvY2FsLndhc3AudXdhLmVkdS5hdS9+cGJvdXJrZS9nZW9tZXRyeS9wb2x5Z29uaXNlL1xuICpcbiAqIEpTIHBvcnQgYnkgTWlrb2xhIEx5c2Vua29cbiAqL1xuXG52YXIgZWRnZVRhYmxlPSBuZXcgVWludDMyQXJyYXkoW1xuICAgICAgMHgwICAsIDB4MTA5LCAweDIwMywgMHgzMGEsIDB4NDA2LCAweDUwZiwgMHg2MDUsIDB4NzBjLFxuICAgICAgMHg4MGMsIDB4OTA1LCAweGEwZiwgMHhiMDYsIDB4YzBhLCAweGQwMywgMHhlMDksIDB4ZjAwLFxuICAgICAgMHgxOTAsIDB4OTkgLCAweDM5MywgMHgyOWEsIDB4NTk2LCAweDQ5ZiwgMHg3OTUsIDB4NjljLFxuICAgICAgMHg5OWMsIDB4ODk1LCAweGI5ZiwgMHhhOTYsIDB4ZDlhLCAweGM5MywgMHhmOTksIDB4ZTkwLFxuICAgICAgMHgyMzAsIDB4MzM5LCAweDMzICwgMHgxM2EsIDB4NjM2LCAweDczZiwgMHg0MzUsIDB4NTNjLFxuICAgICAgMHhhM2MsIDB4YjM1LCAweDgzZiwgMHg5MzYsIDB4ZTNhLCAweGYzMywgMHhjMzksIDB4ZDMwLFxuICAgICAgMHgzYTAsIDB4MmE5LCAweDFhMywgMHhhYSAsIDB4N2E2LCAweDZhZiwgMHg1YTUsIDB4NGFjLFxuICAgICAgMHhiYWMsIDB4YWE1LCAweDlhZiwgMHg4YTYsIDB4ZmFhLCAweGVhMywgMHhkYTksIDB4Y2EwLFxuICAgICAgMHg0NjAsIDB4NTY5LCAweDY2MywgMHg3NmEsIDB4NjYgLCAweDE2ZiwgMHgyNjUsIDB4MzZjLFxuICAgICAgMHhjNmMsIDB4ZDY1LCAweGU2ZiwgMHhmNjYsIDB4ODZhLCAweDk2MywgMHhhNjksIDB4YjYwLFxuICAgICAgMHg1ZjAsIDB4NGY5LCAweDdmMywgMHg2ZmEsIDB4MWY2LCAweGZmICwgMHgzZjUsIDB4MmZjLFxuICAgICAgMHhkZmMsIDB4Y2Y1LCAweGZmZiwgMHhlZjYsIDB4OWZhLCAweDhmMywgMHhiZjksIDB4YWYwLFxuICAgICAgMHg2NTAsIDB4NzU5LCAweDQ1MywgMHg1NWEsIDB4MjU2LCAweDM1ZiwgMHg1NSAsIDB4MTVjLFxuICAgICAgMHhlNWMsIDB4ZjU1LCAweGM1ZiwgMHhkNTYsIDB4YTVhLCAweGI1MywgMHg4NTksIDB4OTUwLFxuICAgICAgMHg3YzAsIDB4NmM5LCAweDVjMywgMHg0Y2EsIDB4M2M2LCAweDJjZiwgMHgxYzUsIDB4Y2MgLFxuICAgICAgMHhmY2MsIDB4ZWM1LCAweGRjZiwgMHhjYzYsIDB4YmNhLCAweGFjMywgMHg5YzksIDB4OGMwLFxuICAgICAgMHg4YzAsIDB4OWM5LCAweGFjMywgMHhiY2EsIDB4Y2M2LCAweGRjZiwgMHhlYzUsIDB4ZmNjLFxuICAgICAgMHhjYyAsIDB4MWM1LCAweDJjZiwgMHgzYzYsIDB4NGNhLCAweDVjMywgMHg2YzksIDB4N2MwLFxuICAgICAgMHg5NTAsIDB4ODU5LCAweGI1MywgMHhhNWEsIDB4ZDU2LCAweGM1ZiwgMHhmNTUsIDB4ZTVjLFxuICAgICAgMHgxNWMsIDB4NTUgLCAweDM1ZiwgMHgyNTYsIDB4NTVhLCAweDQ1MywgMHg3NTksIDB4NjUwLFxuICAgICAgMHhhZjAsIDB4YmY5LCAweDhmMywgMHg5ZmEsIDB4ZWY2LCAweGZmZiwgMHhjZjUsIDB4ZGZjLFxuICAgICAgMHgyZmMsIDB4M2Y1LCAweGZmICwgMHgxZjYsIDB4NmZhLCAweDdmMywgMHg0ZjksIDB4NWYwLFxuICAgICAgMHhiNjAsIDB4YTY5LCAweDk2MywgMHg4NmEsIDB4ZjY2LCAweGU2ZiwgMHhkNjUsIDB4YzZjLFxuICAgICAgMHgzNmMsIDB4MjY1LCAweDE2ZiwgMHg2NiAsIDB4NzZhLCAweDY2MywgMHg1NjksIDB4NDYwLFxuICAgICAgMHhjYTAsIDB4ZGE5LCAweGVhMywgMHhmYWEsIDB4OGE2LCAweDlhZiwgMHhhYTUsIDB4YmFjLFxuICAgICAgMHg0YWMsIDB4NWE1LCAweDZhZiwgMHg3YTYsIDB4YWEgLCAweDFhMywgMHgyYTksIDB4M2EwLFxuICAgICAgMHhkMzAsIDB4YzM5LCAweGYzMywgMHhlM2EsIDB4OTM2LCAweDgzZiwgMHhiMzUsIDB4YTNjLFxuICAgICAgMHg1M2MsIDB4NDM1LCAweDczZiwgMHg2MzYsIDB4MTNhLCAweDMzICwgMHgzMzksIDB4MjMwLFxuICAgICAgMHhlOTAsIDB4Zjk5LCAweGM5MywgMHhkOWEsIDB4YTk2LCAweGI5ZiwgMHg4OTUsIDB4OTljLFxuICAgICAgMHg2OWMsIDB4Nzk1LCAweDQ5ZiwgMHg1OTYsIDB4MjlhLCAweDM5MywgMHg5OSAsIDB4MTkwLFxuICAgICAgMHhmMDAsIDB4ZTA5LCAweGQwMywgMHhjMGEsIDB4YjA2LCAweGEwZiwgMHg5MDUsIDB4ODBjLFxuICAgICAgMHg3MGMsIDB4NjA1LCAweDUwZiwgMHg0MDYsIDB4MzBhLCAweDIwMywgMHgxMDksIDB4MCAgIF0pXG4gICwgdHJpVGFibGUgPSBbXG4gICAgICBbXSxcbiAgICAgIFswLCA4LCAzXSxcbiAgICAgIFswLCAxLCA5XSxcbiAgICAgIFsxLCA4LCAzLCA5LCA4LCAxXSxcbiAgICAgIFsxLCAyLCAxMF0sXG4gICAgICBbMCwgOCwgMywgMSwgMiwgMTBdLFxuICAgICAgWzksIDIsIDEwLCAwLCAyLCA5XSxcbiAgICAgIFsyLCA4LCAzLCAyLCAxMCwgOCwgMTAsIDksIDhdLFxuICAgICAgWzMsIDExLCAyXSxcbiAgICAgIFswLCAxMSwgMiwgOCwgMTEsIDBdLFxuICAgICAgWzEsIDksIDAsIDIsIDMsIDExXSxcbiAgICAgIFsxLCAxMSwgMiwgMSwgOSwgMTEsIDksIDgsIDExXSxcbiAgICAgIFszLCAxMCwgMSwgMTEsIDEwLCAzXSxcbiAgICAgIFswLCAxMCwgMSwgMCwgOCwgMTAsIDgsIDExLCAxMF0sXG4gICAgICBbMywgOSwgMCwgMywgMTEsIDksIDExLCAxMCwgOV0sXG4gICAgICBbOSwgOCwgMTAsIDEwLCA4LCAxMV0sXG4gICAgICBbNCwgNywgOF0sXG4gICAgICBbNCwgMywgMCwgNywgMywgNF0sXG4gICAgICBbMCwgMSwgOSwgOCwgNCwgN10sXG4gICAgICBbNCwgMSwgOSwgNCwgNywgMSwgNywgMywgMV0sXG4gICAgICBbMSwgMiwgMTAsIDgsIDQsIDddLFxuICAgICAgWzMsIDQsIDcsIDMsIDAsIDQsIDEsIDIsIDEwXSxcbiAgICAgIFs5LCAyLCAxMCwgOSwgMCwgMiwgOCwgNCwgN10sXG4gICAgICBbMiwgMTAsIDksIDIsIDksIDcsIDIsIDcsIDMsIDcsIDksIDRdLFxuICAgICAgWzgsIDQsIDcsIDMsIDExLCAyXSxcbiAgICAgIFsxMSwgNCwgNywgMTEsIDIsIDQsIDIsIDAsIDRdLFxuICAgICAgWzksIDAsIDEsIDgsIDQsIDcsIDIsIDMsIDExXSxcbiAgICAgIFs0LCA3LCAxMSwgOSwgNCwgMTEsIDksIDExLCAyLCA5LCAyLCAxXSxcbiAgICAgIFszLCAxMCwgMSwgMywgMTEsIDEwLCA3LCA4LCA0XSxcbiAgICAgIFsxLCAxMSwgMTAsIDEsIDQsIDExLCAxLCAwLCA0LCA3LCAxMSwgNF0sXG4gICAgICBbNCwgNywgOCwgOSwgMCwgMTEsIDksIDExLCAxMCwgMTEsIDAsIDNdLFxuICAgICAgWzQsIDcsIDExLCA0LCAxMSwgOSwgOSwgMTEsIDEwXSxcbiAgICAgIFs5LCA1LCA0XSxcbiAgICAgIFs5LCA1LCA0LCAwLCA4LCAzXSxcbiAgICAgIFswLCA1LCA0LCAxLCA1LCAwXSxcbiAgICAgIFs4LCA1LCA0LCA4LCAzLCA1LCAzLCAxLCA1XSxcbiAgICAgIFsxLCAyLCAxMCwgOSwgNSwgNF0sXG4gICAgICBbMywgMCwgOCwgMSwgMiwgMTAsIDQsIDksIDVdLFxuICAgICAgWzUsIDIsIDEwLCA1LCA0LCAyLCA0LCAwLCAyXSxcbiAgICAgIFsyLCAxMCwgNSwgMywgMiwgNSwgMywgNSwgNCwgMywgNCwgOF0sXG4gICAgICBbOSwgNSwgNCwgMiwgMywgMTFdLFxuICAgICAgWzAsIDExLCAyLCAwLCA4LCAxMSwgNCwgOSwgNV0sXG4gICAgICBbMCwgNSwgNCwgMCwgMSwgNSwgMiwgMywgMTFdLFxuICAgICAgWzIsIDEsIDUsIDIsIDUsIDgsIDIsIDgsIDExLCA0LCA4LCA1XSxcbiAgICAgIFsxMCwgMywgMTEsIDEwLCAxLCAzLCA5LCA1LCA0XSxcbiAgICAgIFs0LCA5LCA1LCAwLCA4LCAxLCA4LCAxMCwgMSwgOCwgMTEsIDEwXSxcbiAgICAgIFs1LCA0LCAwLCA1LCAwLCAxMSwgNSwgMTEsIDEwLCAxMSwgMCwgM10sXG4gICAgICBbNSwgNCwgOCwgNSwgOCwgMTAsIDEwLCA4LCAxMV0sXG4gICAgICBbOSwgNywgOCwgNSwgNywgOV0sXG4gICAgICBbOSwgMywgMCwgOSwgNSwgMywgNSwgNywgM10sXG4gICAgICBbMCwgNywgOCwgMCwgMSwgNywgMSwgNSwgN10sXG4gICAgICBbMSwgNSwgMywgMywgNSwgN10sXG4gICAgICBbOSwgNywgOCwgOSwgNSwgNywgMTAsIDEsIDJdLFxuICAgICAgWzEwLCAxLCAyLCA5LCA1LCAwLCA1LCAzLCAwLCA1LCA3LCAzXSxcbiAgICAgIFs4LCAwLCAyLCA4LCAyLCA1LCA4LCA1LCA3LCAxMCwgNSwgMl0sXG4gICAgICBbMiwgMTAsIDUsIDIsIDUsIDMsIDMsIDUsIDddLFxuICAgICAgWzcsIDksIDUsIDcsIDgsIDksIDMsIDExLCAyXSxcbiAgICAgIFs5LCA1LCA3LCA5LCA3LCAyLCA5LCAyLCAwLCAyLCA3LCAxMV0sXG4gICAgICBbMiwgMywgMTEsIDAsIDEsIDgsIDEsIDcsIDgsIDEsIDUsIDddLFxuICAgICAgWzExLCAyLCAxLCAxMSwgMSwgNywgNywgMSwgNV0sXG4gICAgICBbOSwgNSwgOCwgOCwgNSwgNywgMTAsIDEsIDMsIDEwLCAzLCAxMV0sXG4gICAgICBbNSwgNywgMCwgNSwgMCwgOSwgNywgMTEsIDAsIDEsIDAsIDEwLCAxMSwgMTAsIDBdLFxuICAgICAgWzExLCAxMCwgMCwgMTEsIDAsIDMsIDEwLCA1LCAwLCA4LCAwLCA3LCA1LCA3LCAwXSxcbiAgICAgIFsxMSwgMTAsIDUsIDcsIDExLCA1XSxcbiAgICAgIFsxMCwgNiwgNV0sXG4gICAgICBbMCwgOCwgMywgNSwgMTAsIDZdLFxuICAgICAgWzksIDAsIDEsIDUsIDEwLCA2XSxcbiAgICAgIFsxLCA4LCAzLCAxLCA5LCA4LCA1LCAxMCwgNl0sXG4gICAgICBbMSwgNiwgNSwgMiwgNiwgMV0sXG4gICAgICBbMSwgNiwgNSwgMSwgMiwgNiwgMywgMCwgOF0sXG4gICAgICBbOSwgNiwgNSwgOSwgMCwgNiwgMCwgMiwgNl0sXG4gICAgICBbNSwgOSwgOCwgNSwgOCwgMiwgNSwgMiwgNiwgMywgMiwgOF0sXG4gICAgICBbMiwgMywgMTEsIDEwLCA2LCA1XSxcbiAgICAgIFsxMSwgMCwgOCwgMTEsIDIsIDAsIDEwLCA2LCA1XSxcbiAgICAgIFswLCAxLCA5LCAyLCAzLCAxMSwgNSwgMTAsIDZdLFxuICAgICAgWzUsIDEwLCA2LCAxLCA5LCAyLCA5LCAxMSwgMiwgOSwgOCwgMTFdLFxuICAgICAgWzYsIDMsIDExLCA2LCA1LCAzLCA1LCAxLCAzXSxcbiAgICAgIFswLCA4LCAxMSwgMCwgMTEsIDUsIDAsIDUsIDEsIDUsIDExLCA2XSxcbiAgICAgIFszLCAxMSwgNiwgMCwgMywgNiwgMCwgNiwgNSwgMCwgNSwgOV0sXG4gICAgICBbNiwgNSwgOSwgNiwgOSwgMTEsIDExLCA5LCA4XSxcbiAgICAgIFs1LCAxMCwgNiwgNCwgNywgOF0sXG4gICAgICBbNCwgMywgMCwgNCwgNywgMywgNiwgNSwgMTBdLFxuICAgICAgWzEsIDksIDAsIDUsIDEwLCA2LCA4LCA0LCA3XSxcbiAgICAgIFsxMCwgNiwgNSwgMSwgOSwgNywgMSwgNywgMywgNywgOSwgNF0sXG4gICAgICBbNiwgMSwgMiwgNiwgNSwgMSwgNCwgNywgOF0sXG4gICAgICBbMSwgMiwgNSwgNSwgMiwgNiwgMywgMCwgNCwgMywgNCwgN10sXG4gICAgICBbOCwgNCwgNywgOSwgMCwgNSwgMCwgNiwgNSwgMCwgMiwgNl0sXG4gICAgICBbNywgMywgOSwgNywgOSwgNCwgMywgMiwgOSwgNSwgOSwgNiwgMiwgNiwgOV0sXG4gICAgICBbMywgMTEsIDIsIDcsIDgsIDQsIDEwLCA2LCA1XSxcbiAgICAgIFs1LCAxMCwgNiwgNCwgNywgMiwgNCwgMiwgMCwgMiwgNywgMTFdLFxuICAgICAgWzAsIDEsIDksIDQsIDcsIDgsIDIsIDMsIDExLCA1LCAxMCwgNl0sXG4gICAgICBbOSwgMiwgMSwgOSwgMTEsIDIsIDksIDQsIDExLCA3LCAxMSwgNCwgNSwgMTAsIDZdLFxuICAgICAgWzgsIDQsIDcsIDMsIDExLCA1LCAzLCA1LCAxLCA1LCAxMSwgNl0sXG4gICAgICBbNSwgMSwgMTEsIDUsIDExLCA2LCAxLCAwLCAxMSwgNywgMTEsIDQsIDAsIDQsIDExXSxcbiAgICAgIFswLCA1LCA5LCAwLCA2LCA1LCAwLCAzLCA2LCAxMSwgNiwgMywgOCwgNCwgN10sXG4gICAgICBbNiwgNSwgOSwgNiwgOSwgMTEsIDQsIDcsIDksIDcsIDExLCA5XSxcbiAgICAgIFsxMCwgNCwgOSwgNiwgNCwgMTBdLFxuICAgICAgWzQsIDEwLCA2LCA0LCA5LCAxMCwgMCwgOCwgM10sXG4gICAgICBbMTAsIDAsIDEsIDEwLCA2LCAwLCA2LCA0LCAwXSxcbiAgICAgIFs4LCAzLCAxLCA4LCAxLCA2LCA4LCA2LCA0LCA2LCAxLCAxMF0sXG4gICAgICBbMSwgNCwgOSwgMSwgMiwgNCwgMiwgNiwgNF0sXG4gICAgICBbMywgMCwgOCwgMSwgMiwgOSwgMiwgNCwgOSwgMiwgNiwgNF0sXG4gICAgICBbMCwgMiwgNCwgNCwgMiwgNl0sXG4gICAgICBbOCwgMywgMiwgOCwgMiwgNCwgNCwgMiwgNl0sXG4gICAgICBbMTAsIDQsIDksIDEwLCA2LCA0LCAxMSwgMiwgM10sXG4gICAgICBbMCwgOCwgMiwgMiwgOCwgMTEsIDQsIDksIDEwLCA0LCAxMCwgNl0sXG4gICAgICBbMywgMTEsIDIsIDAsIDEsIDYsIDAsIDYsIDQsIDYsIDEsIDEwXSxcbiAgICAgIFs2LCA0LCAxLCA2LCAxLCAxMCwgNCwgOCwgMSwgMiwgMSwgMTEsIDgsIDExLCAxXSxcbiAgICAgIFs5LCA2LCA0LCA5LCAzLCA2LCA5LCAxLCAzLCAxMSwgNiwgM10sXG4gICAgICBbOCwgMTEsIDEsIDgsIDEsIDAsIDExLCA2LCAxLCA5LCAxLCA0LCA2LCA0LCAxXSxcbiAgICAgIFszLCAxMSwgNiwgMywgNiwgMCwgMCwgNiwgNF0sXG4gICAgICBbNiwgNCwgOCwgMTEsIDYsIDhdLFxuICAgICAgWzcsIDEwLCA2LCA3LCA4LCAxMCwgOCwgOSwgMTBdLFxuICAgICAgWzAsIDcsIDMsIDAsIDEwLCA3LCAwLCA5LCAxMCwgNiwgNywgMTBdLFxuICAgICAgWzEwLCA2LCA3LCAxLCAxMCwgNywgMSwgNywgOCwgMSwgOCwgMF0sXG4gICAgICBbMTAsIDYsIDcsIDEwLCA3LCAxLCAxLCA3LCAzXSxcbiAgICAgIFsxLCAyLCA2LCAxLCA2LCA4LCAxLCA4LCA5LCA4LCA2LCA3XSxcbiAgICAgIFsyLCA2LCA5LCAyLCA5LCAxLCA2LCA3LCA5LCAwLCA5LCAzLCA3LCAzLCA5XSxcbiAgICAgIFs3LCA4LCAwLCA3LCAwLCA2LCA2LCAwLCAyXSxcbiAgICAgIFs3LCAzLCAyLCA2LCA3LCAyXSxcbiAgICAgIFsyLCAzLCAxMSwgMTAsIDYsIDgsIDEwLCA4LCA5LCA4LCA2LCA3XSxcbiAgICAgIFsyLCAwLCA3LCAyLCA3LCAxMSwgMCwgOSwgNywgNiwgNywgMTAsIDksIDEwLCA3XSxcbiAgICAgIFsxLCA4LCAwLCAxLCA3LCA4LCAxLCAxMCwgNywgNiwgNywgMTAsIDIsIDMsIDExXSxcbiAgICAgIFsxMSwgMiwgMSwgMTEsIDEsIDcsIDEwLCA2LCAxLCA2LCA3LCAxXSxcbiAgICAgIFs4LCA5LCA2LCA4LCA2LCA3LCA5LCAxLCA2LCAxMSwgNiwgMywgMSwgMywgNl0sXG4gICAgICBbMCwgOSwgMSwgMTEsIDYsIDddLFxuICAgICAgWzcsIDgsIDAsIDcsIDAsIDYsIDMsIDExLCAwLCAxMSwgNiwgMF0sXG4gICAgICBbNywgMTEsIDZdLFxuICAgICAgWzcsIDYsIDExXSxcbiAgICAgIFszLCAwLCA4LCAxMSwgNywgNl0sXG4gICAgICBbMCwgMSwgOSwgMTEsIDcsIDZdLFxuICAgICAgWzgsIDEsIDksIDgsIDMsIDEsIDExLCA3LCA2XSxcbiAgICAgIFsxMCwgMSwgMiwgNiwgMTEsIDddLFxuICAgICAgWzEsIDIsIDEwLCAzLCAwLCA4LCA2LCAxMSwgN10sXG4gICAgICBbMiwgOSwgMCwgMiwgMTAsIDksIDYsIDExLCA3XSxcbiAgICAgIFs2LCAxMSwgNywgMiwgMTAsIDMsIDEwLCA4LCAzLCAxMCwgOSwgOF0sXG4gICAgICBbNywgMiwgMywgNiwgMiwgN10sXG4gICAgICBbNywgMCwgOCwgNywgNiwgMCwgNiwgMiwgMF0sXG4gICAgICBbMiwgNywgNiwgMiwgMywgNywgMCwgMSwgOV0sXG4gICAgICBbMSwgNiwgMiwgMSwgOCwgNiwgMSwgOSwgOCwgOCwgNywgNl0sXG4gICAgICBbMTAsIDcsIDYsIDEwLCAxLCA3LCAxLCAzLCA3XSxcbiAgICAgIFsxMCwgNywgNiwgMSwgNywgMTAsIDEsIDgsIDcsIDEsIDAsIDhdLFxuICAgICAgWzAsIDMsIDcsIDAsIDcsIDEwLCAwLCAxMCwgOSwgNiwgMTAsIDddLFxuICAgICAgWzcsIDYsIDEwLCA3LCAxMCwgOCwgOCwgMTAsIDldLFxuICAgICAgWzYsIDgsIDQsIDExLCA4LCA2XSxcbiAgICAgIFszLCA2LCAxMSwgMywgMCwgNiwgMCwgNCwgNl0sXG4gICAgICBbOCwgNiwgMTEsIDgsIDQsIDYsIDksIDAsIDFdLFxuICAgICAgWzksIDQsIDYsIDksIDYsIDMsIDksIDMsIDEsIDExLCAzLCA2XSxcbiAgICAgIFs2LCA4LCA0LCA2LCAxMSwgOCwgMiwgMTAsIDFdLFxuICAgICAgWzEsIDIsIDEwLCAzLCAwLCAxMSwgMCwgNiwgMTEsIDAsIDQsIDZdLFxuICAgICAgWzQsIDExLCA4LCA0LCA2LCAxMSwgMCwgMiwgOSwgMiwgMTAsIDldLFxuICAgICAgWzEwLCA5LCAzLCAxMCwgMywgMiwgOSwgNCwgMywgMTEsIDMsIDYsIDQsIDYsIDNdLFxuICAgICAgWzgsIDIsIDMsIDgsIDQsIDIsIDQsIDYsIDJdLFxuICAgICAgWzAsIDQsIDIsIDQsIDYsIDJdLFxuICAgICAgWzEsIDksIDAsIDIsIDMsIDQsIDIsIDQsIDYsIDQsIDMsIDhdLFxuICAgICAgWzEsIDksIDQsIDEsIDQsIDIsIDIsIDQsIDZdLFxuICAgICAgWzgsIDEsIDMsIDgsIDYsIDEsIDgsIDQsIDYsIDYsIDEwLCAxXSxcbiAgICAgIFsxMCwgMSwgMCwgMTAsIDAsIDYsIDYsIDAsIDRdLFxuICAgICAgWzQsIDYsIDMsIDQsIDMsIDgsIDYsIDEwLCAzLCAwLCAzLCA5LCAxMCwgOSwgM10sXG4gICAgICBbMTAsIDksIDQsIDYsIDEwLCA0XSxcbiAgICAgIFs0LCA5LCA1LCA3LCA2LCAxMV0sXG4gICAgICBbMCwgOCwgMywgNCwgOSwgNSwgMTEsIDcsIDZdLFxuICAgICAgWzUsIDAsIDEsIDUsIDQsIDAsIDcsIDYsIDExXSxcbiAgICAgIFsxMSwgNywgNiwgOCwgMywgNCwgMywgNSwgNCwgMywgMSwgNV0sXG4gICAgICBbOSwgNSwgNCwgMTAsIDEsIDIsIDcsIDYsIDExXSxcbiAgICAgIFs2LCAxMSwgNywgMSwgMiwgMTAsIDAsIDgsIDMsIDQsIDksIDVdLFxuICAgICAgWzcsIDYsIDExLCA1LCA0LCAxMCwgNCwgMiwgMTAsIDQsIDAsIDJdLFxuICAgICAgWzMsIDQsIDgsIDMsIDUsIDQsIDMsIDIsIDUsIDEwLCA1LCAyLCAxMSwgNywgNl0sXG4gICAgICBbNywgMiwgMywgNywgNiwgMiwgNSwgNCwgOV0sXG4gICAgICBbOSwgNSwgNCwgMCwgOCwgNiwgMCwgNiwgMiwgNiwgOCwgN10sXG4gICAgICBbMywgNiwgMiwgMywgNywgNiwgMSwgNSwgMCwgNSwgNCwgMF0sXG4gICAgICBbNiwgMiwgOCwgNiwgOCwgNywgMiwgMSwgOCwgNCwgOCwgNSwgMSwgNSwgOF0sXG4gICAgICBbOSwgNSwgNCwgMTAsIDEsIDYsIDEsIDcsIDYsIDEsIDMsIDddLFxuICAgICAgWzEsIDYsIDEwLCAxLCA3LCA2LCAxLCAwLCA3LCA4LCA3LCAwLCA5LCA1LCA0XSxcbiAgICAgIFs0LCAwLCAxMCwgNCwgMTAsIDUsIDAsIDMsIDEwLCA2LCAxMCwgNywgMywgNywgMTBdLFxuICAgICAgWzcsIDYsIDEwLCA3LCAxMCwgOCwgNSwgNCwgMTAsIDQsIDgsIDEwXSxcbiAgICAgIFs2LCA5LCA1LCA2LCAxMSwgOSwgMTEsIDgsIDldLFxuICAgICAgWzMsIDYsIDExLCAwLCA2LCAzLCAwLCA1LCA2LCAwLCA5LCA1XSxcbiAgICAgIFswLCAxMSwgOCwgMCwgNSwgMTEsIDAsIDEsIDUsIDUsIDYsIDExXSxcbiAgICAgIFs2LCAxMSwgMywgNiwgMywgNSwgNSwgMywgMV0sXG4gICAgICBbMSwgMiwgMTAsIDksIDUsIDExLCA5LCAxMSwgOCwgMTEsIDUsIDZdLFxuICAgICAgWzAsIDExLCAzLCAwLCA2LCAxMSwgMCwgOSwgNiwgNSwgNiwgOSwgMSwgMiwgMTBdLFxuICAgICAgWzExLCA4LCA1LCAxMSwgNSwgNiwgOCwgMCwgNSwgMTAsIDUsIDIsIDAsIDIsIDVdLFxuICAgICAgWzYsIDExLCAzLCA2LCAzLCA1LCAyLCAxMCwgMywgMTAsIDUsIDNdLFxuICAgICAgWzUsIDgsIDksIDUsIDIsIDgsIDUsIDYsIDIsIDMsIDgsIDJdLFxuICAgICAgWzksIDUsIDYsIDksIDYsIDAsIDAsIDYsIDJdLFxuICAgICAgWzEsIDUsIDgsIDEsIDgsIDAsIDUsIDYsIDgsIDMsIDgsIDIsIDYsIDIsIDhdLFxuICAgICAgWzEsIDUsIDYsIDIsIDEsIDZdLFxuICAgICAgWzEsIDMsIDYsIDEsIDYsIDEwLCAzLCA4LCA2LCA1LCA2LCA5LCA4LCA5LCA2XSxcbiAgICAgIFsxMCwgMSwgMCwgMTAsIDAsIDYsIDksIDUsIDAsIDUsIDYsIDBdLFxuICAgICAgWzAsIDMsIDgsIDUsIDYsIDEwXSxcbiAgICAgIFsxMCwgNSwgNl0sXG4gICAgICBbMTEsIDUsIDEwLCA3LCA1LCAxMV0sXG4gICAgICBbMTEsIDUsIDEwLCAxMSwgNywgNSwgOCwgMywgMF0sXG4gICAgICBbNSwgMTEsIDcsIDUsIDEwLCAxMSwgMSwgOSwgMF0sXG4gICAgICBbMTAsIDcsIDUsIDEwLCAxMSwgNywgOSwgOCwgMSwgOCwgMywgMV0sXG4gICAgICBbMTEsIDEsIDIsIDExLCA3LCAxLCA3LCA1LCAxXSxcbiAgICAgIFswLCA4LCAzLCAxLCAyLCA3LCAxLCA3LCA1LCA3LCAyLCAxMV0sXG4gICAgICBbOSwgNywgNSwgOSwgMiwgNywgOSwgMCwgMiwgMiwgMTEsIDddLFxuICAgICAgWzcsIDUsIDIsIDcsIDIsIDExLCA1LCA5LCAyLCAzLCAyLCA4LCA5LCA4LCAyXSxcbiAgICAgIFsyLCA1LCAxMCwgMiwgMywgNSwgMywgNywgNV0sXG4gICAgICBbOCwgMiwgMCwgOCwgNSwgMiwgOCwgNywgNSwgMTAsIDIsIDVdLFxuICAgICAgWzksIDAsIDEsIDUsIDEwLCAzLCA1LCAzLCA3LCAzLCAxMCwgMl0sXG4gICAgICBbOSwgOCwgMiwgOSwgMiwgMSwgOCwgNywgMiwgMTAsIDIsIDUsIDcsIDUsIDJdLFxuICAgICAgWzEsIDMsIDUsIDMsIDcsIDVdLFxuICAgICAgWzAsIDgsIDcsIDAsIDcsIDEsIDEsIDcsIDVdLFxuICAgICAgWzksIDAsIDMsIDksIDMsIDUsIDUsIDMsIDddLFxuICAgICAgWzksIDgsIDcsIDUsIDksIDddLFxuICAgICAgWzUsIDgsIDQsIDUsIDEwLCA4LCAxMCwgMTEsIDhdLFxuICAgICAgWzUsIDAsIDQsIDUsIDExLCAwLCA1LCAxMCwgMTEsIDExLCAzLCAwXSxcbiAgICAgIFswLCAxLCA5LCA4LCA0LCAxMCwgOCwgMTAsIDExLCAxMCwgNCwgNV0sXG4gICAgICBbMTAsIDExLCA0LCAxMCwgNCwgNSwgMTEsIDMsIDQsIDksIDQsIDEsIDMsIDEsIDRdLFxuICAgICAgWzIsIDUsIDEsIDIsIDgsIDUsIDIsIDExLCA4LCA0LCA1LCA4XSxcbiAgICAgIFswLCA0LCAxMSwgMCwgMTEsIDMsIDQsIDUsIDExLCAyLCAxMSwgMSwgNSwgMSwgMTFdLFxuICAgICAgWzAsIDIsIDUsIDAsIDUsIDksIDIsIDExLCA1LCA0LCA1LCA4LCAxMSwgOCwgNV0sXG4gICAgICBbOSwgNCwgNSwgMiwgMTEsIDNdLFxuICAgICAgWzIsIDUsIDEwLCAzLCA1LCAyLCAzLCA0LCA1LCAzLCA4LCA0XSxcbiAgICAgIFs1LCAxMCwgMiwgNSwgMiwgNCwgNCwgMiwgMF0sXG4gICAgICBbMywgMTAsIDIsIDMsIDUsIDEwLCAzLCA4LCA1LCA0LCA1LCA4LCAwLCAxLCA5XSxcbiAgICAgIFs1LCAxMCwgMiwgNSwgMiwgNCwgMSwgOSwgMiwgOSwgNCwgMl0sXG4gICAgICBbOCwgNCwgNSwgOCwgNSwgMywgMywgNSwgMV0sXG4gICAgICBbMCwgNCwgNSwgMSwgMCwgNV0sXG4gICAgICBbOCwgNCwgNSwgOCwgNSwgMywgOSwgMCwgNSwgMCwgMywgNV0sXG4gICAgICBbOSwgNCwgNV0sXG4gICAgICBbNCwgMTEsIDcsIDQsIDksIDExLCA5LCAxMCwgMTFdLFxuICAgICAgWzAsIDgsIDMsIDQsIDksIDcsIDksIDExLCA3LCA5LCAxMCwgMTFdLFxuICAgICAgWzEsIDEwLCAxMSwgMSwgMTEsIDQsIDEsIDQsIDAsIDcsIDQsIDExXSxcbiAgICAgIFszLCAxLCA0LCAzLCA0LCA4LCAxLCAxMCwgNCwgNywgNCwgMTEsIDEwLCAxMSwgNF0sXG4gICAgICBbNCwgMTEsIDcsIDksIDExLCA0LCA5LCAyLCAxMSwgOSwgMSwgMl0sXG4gICAgICBbOSwgNywgNCwgOSwgMTEsIDcsIDksIDEsIDExLCAyLCAxMSwgMSwgMCwgOCwgM10sXG4gICAgICBbMTEsIDcsIDQsIDExLCA0LCAyLCAyLCA0LCAwXSxcbiAgICAgIFsxMSwgNywgNCwgMTEsIDQsIDIsIDgsIDMsIDQsIDMsIDIsIDRdLFxuICAgICAgWzIsIDksIDEwLCAyLCA3LCA5LCAyLCAzLCA3LCA3LCA0LCA5XSxcbiAgICAgIFs5LCAxMCwgNywgOSwgNywgNCwgMTAsIDIsIDcsIDgsIDcsIDAsIDIsIDAsIDddLFxuICAgICAgWzMsIDcsIDEwLCAzLCAxMCwgMiwgNywgNCwgMTAsIDEsIDEwLCAwLCA0LCAwLCAxMF0sXG4gICAgICBbMSwgMTAsIDIsIDgsIDcsIDRdLFxuICAgICAgWzQsIDksIDEsIDQsIDEsIDcsIDcsIDEsIDNdLFxuICAgICAgWzQsIDksIDEsIDQsIDEsIDcsIDAsIDgsIDEsIDgsIDcsIDFdLFxuICAgICAgWzQsIDAsIDMsIDcsIDQsIDNdLFxuICAgICAgWzQsIDgsIDddLFxuICAgICAgWzksIDEwLCA4LCAxMCwgMTEsIDhdLFxuICAgICAgWzMsIDAsIDksIDMsIDksIDExLCAxMSwgOSwgMTBdLFxuICAgICAgWzAsIDEsIDEwLCAwLCAxMCwgOCwgOCwgMTAsIDExXSxcbiAgICAgIFszLCAxLCAxMCwgMTEsIDMsIDEwXSxcbiAgICAgIFsxLCAyLCAxMSwgMSwgMTEsIDksIDksIDExLCA4XSxcbiAgICAgIFszLCAwLCA5LCAzLCA5LCAxMSwgMSwgMiwgOSwgMiwgMTEsIDldLFxuICAgICAgWzAsIDIsIDExLCA4LCAwLCAxMV0sXG4gICAgICBbMywgMiwgMTFdLFxuICAgICAgWzIsIDMsIDgsIDIsIDgsIDEwLCAxMCwgOCwgOV0sXG4gICAgICBbOSwgMTAsIDIsIDAsIDksIDJdLFxuICAgICAgWzIsIDMsIDgsIDIsIDgsIDEwLCAwLCAxLCA4LCAxLCAxMCwgOF0sXG4gICAgICBbMSwgMTAsIDJdLFxuICAgICAgWzEsIDMsIDgsIDksIDEsIDhdLFxuICAgICAgWzAsIDksIDFdLFxuICAgICAgWzAsIDMsIDhdLFxuICAgICAgW11dXG4gICwgY3ViZVZlcnRzID0gW1xuICAgICBbMCwwLDBdXG4gICAgLFsxLDAsMF1cbiAgICAsWzEsMSwwXVxuICAgICxbMCwxLDBdXG4gICAgLFswLDAsMV1cbiAgICAsWzEsMCwxXVxuICAgICxbMSwxLDFdXG4gICAgLFswLDEsMV1dXG4gICwgZWRnZUluZGV4ID0gWyBbMCwxXSxbMSwyXSxbMiwzXSxbMywwXSxbNCw1XSxbNSw2XSxbNiw3XSxbNyw0XSxbMCw0XSxbMSw1XSxbMiw2XSxbMyw3XSBdO1xuXG5cblxuZXhwb3J0cy5tYXJjaGluZ0N1YmVzID0gZnVuY3Rpb24oZGltcywgcG90ZW50aWFsLCBib3VuZHMpIHtcbiAgaWYoIWJvdW5kcykge1xuICAgIGJvdW5kcyA9IFtbMCwwLDBdLCBkaW1zXTtcbiAgfVxuICB2YXIgc2NhbGUgICAgID0gWzAsMCwwXTtcbiAgdmFyIHNoaWZ0ICAgICA9IFswLDAsMF07XG4gIGZvcih2YXIgaT0wOyBpPDM7ICsraSkge1xuICAgIHNjYWxlW2ldID0gKGJvdW5kc1sxXVtpXSAtIGJvdW5kc1swXVtpXSkgLyBkaW1zW2ldO1xuICAgIHNoaWZ0W2ldID0gYm91bmRzWzBdW2ldO1xuICB9XG5cbiAgdmFyIHZlcnRpY2VzID0gW11cbiAgICAsIGZhY2VzID0gW11cbiAgICAsIG4gPSAwXG4gICAgLCBncmlkID0gbmV3IEFycmF5KDgpXG4gICAgLCBlZGdlcyA9IG5ldyBBcnJheSgxMilcbiAgICAsIHggPSBbMCwwLDBdO1xuICAvL01hcmNoIG92ZXIgdGhlIHZvbHVtZVxuICBmb3IoeFsyXT0wOyB4WzJdPGRpbXNbMl0tMTsgKyt4WzJdLCBuKz1kaW1zWzBdKVxuICBmb3IoeFsxXT0wOyB4WzFdPGRpbXNbMV0tMTsgKyt4WzFdLCArK24pXG4gIGZvcih4WzBdPTA7IHhbMF08ZGltc1swXS0xOyArK3hbMF0sICsrbikge1xuICAgIC8vRm9yIGVhY2ggY2VsbCwgY29tcHV0ZSBjdWJlIG1hc2tcbiAgICB2YXIgY3ViZV9pbmRleCA9IDA7XG4gICAgZm9yKHZhciBpPTA7IGk8ODsgKytpKSB7XG4gICAgICB2YXIgdiA9IGN1YmVWZXJ0c1tpXVxuICAgICAgICAsIHMgPSBwb3RlbnRpYWwoXG4gICAgICAgICAgc2NhbGVbMF0qKHhbMF0rdlswXSkrc2hpZnRbMF0sXG4gICAgICAgICAgc2NhbGVbMV0qKHhbMV0rdlsxXSkrc2hpZnRbMV0sXG4gICAgICAgICAgc2NhbGVbMl0qKHhbMl0rdlsyXSkrc2hpZnRbMl0pO1xuICAgICAgZ3JpZFtpXSA9IHM7XG4gICAgICBjdWJlX2luZGV4IHw9IChzID4gMCkgPyAxIDw8IGkgOiAwO1xuICAgIH1cbiAgICAvL0NvbXB1dGUgdmVydGljZXNcbiAgICB2YXIgZWRnZV9tYXNrID0gZWRnZVRhYmxlW2N1YmVfaW5kZXhdO1xuICAgIGlmKGVkZ2VfbWFzayA9PT0gMCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGZvcih2YXIgaT0wOyBpPDEyOyArK2kpIHtcbiAgICAgIGlmKChlZGdlX21hc2sgJiAoMTw8aSkpID09PSAwKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgZWRnZXNbaV0gPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgICB2YXIgbnYgPSBbMCwwLDBdXG4gICAgICAgICwgZSA9IGVkZ2VJbmRleFtpXVxuICAgICAgICAsIHAwID0gY3ViZVZlcnRzW2VbMF1dXG4gICAgICAgICwgcDEgPSBjdWJlVmVydHNbZVsxXV1cbiAgICAgICAgLCBhID0gZ3JpZFtlWzBdXVxuICAgICAgICAsIGIgPSBncmlkW2VbMV1dXG4gICAgICAgICwgZCA9IGEgLSBiXG4gICAgICAgICwgdCA9IDA7XG4gICAgICBpZihNYXRoLmFicyhkKSA+IDFlLTYpIHtcbiAgICAgICAgdCA9IGEgLyBkO1xuICAgICAgfVxuICAgICAgZm9yKHZhciBqPTA7IGo8MzsgKytqKSB7XG4gICAgICAgIG52W2pdID0gc2NhbGVbal0gKiAoKHhbal0gKyBwMFtqXSkgKyB0ICogKHAxW2pdIC0gcDBbal0pKSArIHNoaWZ0W2pdO1xuICAgICAgfVxuICAgICAgdmVydGljZXMucHVzaChudik7XG4gICAgfVxuICAgIC8vQWRkIGZhY2VzXG4gICAgdmFyIGYgPSB0cmlUYWJsZVtjdWJlX2luZGV4XTtcbiAgICBmb3IodmFyIGk9MDsgaTxmLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICBmYWNlcy5wdXNoKFtlZGdlc1tmW2ldXSwgZWRnZXNbZltpKzFdXSwgZWRnZXNbZltpKzJdXV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4geyBwb3NpdGlvbnM6IHZlcnRpY2VzLCBjZWxsczogZmFjZXMgfTtcbn07XG5cbiIsIi8qKlxuICogTWFyY2hpbmcgVGV0cmFoZWRyYSBpbiBKYXZhc2NyaXB0XG4gKlxuICogQmFzZWQgb24gUGF1bCBCb3Vya2UncyBpbXBsZW1lbnRhdGlvblxuICogIGh0dHA6Ly9sb2NhbC53YXNwLnV3YS5lZHUuYXUvfnBib3Vya2UvZ2VvbWV0cnkvcG9seWdvbmlzZS9cbiAqXG4gKiAoU2V2ZXJhbCBidWcgZml4ZXMgd2VyZSBtYWRlIHRvIGRlYWwgd2l0aCBvcmllbnRlZCBmYWNlcylcbiAqXG4gKiBKYXZhc2NyaXB0IHBvcnQgYnkgTWlrb2xhIEx5c2Vua29cbiAqL1xudmFyIGN1YmVfdmVydGljZXMgPSBbXG4gICAgICAgIFswLDAsMF1cbiAgICAgICwgWzEsMCwwXVxuICAgICAgLCBbMSwxLDBdXG4gICAgICAsIFswLDEsMF1cbiAgICAgICwgWzAsMCwxXVxuICAgICAgLCBbMSwwLDFdXG4gICAgICAsIFsxLDEsMV1cbiAgICAgICwgWzAsMSwxXSBdXG4gICwgdGV0cmFfbGlzdCA9IFtcbiAgICAgICAgWzAsMiwzLDddXG4gICAgICAsIFswLDYsMiw3XVxuICAgICAgLCBbMCw0LDYsN11cbiAgICAgICwgWzAsNiwxLDJdXG4gICAgICAsIFswLDEsNiw0XVxuICAgICAgLCBbNSw2LDEsNF0gXTtcblxuZXhwb3J0cy5tYXJjaGluZ1RldHJhaGVkcmEgPSBmdW5jdGlvbihkaW1zLCBwb3RlbnRpYWwsIGJvdW5kcykge1xuXG4gIGlmKCFib3VuZHMpIHtcbiAgICBib3VuZHMgPSBbWzAsMCwwXSwgZGltc107XG4gIH1cbiAgXG4gIHZhciBzY2FsZSAgICAgPSBbMCwwLDBdO1xuICB2YXIgc2hpZnQgICAgID0gWzAsMCwwXTtcbiAgZm9yKHZhciBpPTA7IGk8MzsgKytpKSB7XG4gICAgc2NhbGVbaV0gPSAoYm91bmRzWzFdW2ldIC0gYm91bmRzWzBdW2ldKSAvIGRpbXNbaV07XG4gICAgc2hpZnRbaV0gPSBib3VuZHNbMF1baV07XG4gIH1cbiAgIFxuICAgdmFyIHZlcnRpY2VzID0gW11cbiAgICAsIGZhY2VzID0gW11cbiAgICAsIG4gPSAwXG4gICAgLCBncmlkID0gbmV3IEZsb2F0MzJBcnJheSg4KVxuICAgICwgZWRnZXMgPSBuZXcgSW50MzJBcnJheSgxMilcbiAgICAsIHggPSBbMCwwLDBdO1xuICAgIFxuICBmdW5jdGlvbiBpbnRlcnAoaTAsIGkxKSB7XG4gICAgdmFyIGcwID0gZ3JpZFtpMF1cbiAgICAgICwgZzEgPSBncmlkW2kxXVxuICAgICAgLCBwMCA9IGN1YmVfdmVydGljZXNbaTBdXG4gICAgICAsIHAxID0gY3ViZV92ZXJ0aWNlc1tpMV1cbiAgICAgICwgdiAgPSBbeFswXSwgeFsxXSwgeFsyXV1cbiAgICAgICwgdCA9IGcwIC0gZzE7XG4gICAgaWYoTWF0aC5hYnModCkgPiAxZS02KSB7XG4gICAgICB0ID0gZzAgLyB0O1xuICAgIH1cbiAgICBmb3IodmFyIGk9MDsgaTwzOyArK2kpIHtcbiAgICAgIHZbaV0gPSBzY2FsZVtpXSAqICh2W2ldICsgcDBbaV0gKyB0ICogKHAxW2ldIC0gcDBbaV0pKSArIHNoaWZ0W2ldO1xuICAgIH1cbiAgICB2ZXJ0aWNlcy5wdXNoKHYpO1xuICAgIHJldHVybiB2ZXJ0aWNlcy5sZW5ndGggLSAxO1xuICB9XG4gIFxuICAvL01hcmNoIG92ZXIgdGhlIHZvbHVtZVxuICBmb3IoeFsyXT0wOyB4WzJdPGRpbXNbMl0tMTsgKyt4WzJdLCBuKz1kaW1zWzBdKVxuICBmb3IoeFsxXT0wOyB4WzFdPGRpbXNbMV0tMTsgKyt4WzFdLCArK24pXG4gIGZvcih4WzBdPTA7IHhbMF08ZGltc1swXS0xOyArK3hbMF0sICsrbikge1xuICAgIC8vUmVhZCBpbiBjdWJlICBcbiAgICBmb3IodmFyIGk9MDsgaTw4OyArK2kpIHtcbiAgICAgIHZhciBjdWJlX3ZlcnQgPSBjdWJlX3ZlcnRpY2VzW2ldO1xuICAgICAgZ3JpZFtpXSA9IHBvdGVudGlhbChcbiAgICAgICAgc2NhbGVbMF0qKHhbMF0rY3ViZV92ZXJ0WzBdKStzaGlmdFswXSxcbiAgICAgICAgc2NhbGVbMV0qKHhbMV0rY3ViZV92ZXJ0WzFdKStzaGlmdFsxXSxcbiAgICAgICAgc2NhbGVbMl0qKHhbMl0rY3ViZV92ZXJ0WzJdKStzaGlmdFsyXSk7XG4gICAgfVxuICAgIGZvcih2YXIgaT0wOyBpPHRldHJhX2xpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBUID0gdGV0cmFfbGlzdFtpXVxuICAgICAgICAsIHRyaWluZGV4ID0gMDtcbiAgICAgIGlmIChncmlkW1RbMF1dIDwgMCkgdHJpaW5kZXggfD0gMTtcbiAgICAgIGlmIChncmlkW1RbMV1dIDwgMCkgdHJpaW5kZXggfD0gMjtcbiAgICAgIGlmIChncmlkW1RbMl1dIDwgMCkgdHJpaW5kZXggfD0gNDtcbiAgICAgIGlmIChncmlkW1RbM11dIDwgMCkgdHJpaW5kZXggfD0gODtcbiAgICAgIFxuICAgICAgLy9IYW5kbGUgZWFjaCBjYXNlXG4gICAgICBzd2l0Y2ggKHRyaWluZGV4KSB7XG4gICAgICAgIGNhc2UgMHgwMDpcbiAgICAgICAgY2FzZSAweDBGOlxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDBFOlxuICAgICAgICAgIGZhY2VzLnB1c2goWyBcbiAgICAgICAgICAgICAgaW50ZXJwKFRbMF0sIFRbMV0pXG4gICAgICAgICAgICAsIGludGVycChUWzBdLCBUWzNdKSBcbiAgICAgICAgICAgICwgaW50ZXJwKFRbMF0sIFRbMl0pIF0pO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDAxOlxuICAgICAgICAgIGZhY2VzLnB1c2goWyBcbiAgICAgICAgICAgICAgaW50ZXJwKFRbMF0sIFRbMV0pXG4gICAgICAgICAgICAsIGludGVycChUWzBdLCBUWzJdKVxuICAgICAgICAgICAgLCBpbnRlcnAoVFswXSwgVFszXSkgIF0pO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDBEOlxuICAgICAgICAgIGZhY2VzLnB1c2goWyBcbiAgICAgICAgICAgICAgaW50ZXJwKFRbMV0sIFRbMF0pXG4gICAgICAgICAgICAsIGludGVycChUWzFdLCBUWzJdKSBcbiAgICAgICAgICAgICwgaW50ZXJwKFRbMV0sIFRbM10pIF0pO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDAyOlxuICAgICAgICAgIGZhY2VzLnB1c2goWyBcbiAgICAgICAgICAgICAgaW50ZXJwKFRbMV0sIFRbMF0pXG4gICAgICAgICAgICAsIGludGVycChUWzFdLCBUWzNdKVxuICAgICAgICAgICAgLCBpbnRlcnAoVFsxXSwgVFsyXSkgXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4MEM6XG4gICAgICAgICAgZmFjZXMucHVzaChbIFxuICAgICAgICAgICAgICAgIGludGVycChUWzFdLCBUWzJdKVxuICAgICAgICAgICAgICAsIGludGVycChUWzFdLCBUWzNdKVxuICAgICAgICAgICAgICAsIGludGVycChUWzBdLCBUWzNdKVxuICAgICAgICAgICAgICAsIGludGVycChUWzBdLCBUWzJdKSBdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHgwMzpcbiAgICAgICAgICBmYWNlcy5wdXNoKFsgXG4gICAgICAgICAgICAgICAgaW50ZXJwKFRbMV0sIFRbMl0pXG4gICAgICAgICAgICAgICwgaW50ZXJwKFRbMF0sIFRbMl0pXG4gICAgICAgICAgICAgICwgaW50ZXJwKFRbMF0sIFRbM10pXG4gICAgICAgICAgICAgICwgaW50ZXJwKFRbMV0sIFRbM10pIF0pO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDA0OlxuICAgICAgICAgIGZhY2VzLnB1c2goWyBcbiAgICAgICAgICAgICAgICBpbnRlcnAoVFsyXSwgVFswXSlcbiAgICAgICAgICAgICAgLCBpbnRlcnAoVFsyXSwgVFsxXSlcbiAgICAgICAgICAgICAgLCBpbnRlcnAoVFsyXSwgVFszXSkgXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4MEI6XG4gICAgICAgICAgZmFjZXMucHVzaChbIFxuICAgICAgICAgICAgICAgIGludGVycChUWzJdLCBUWzBdKVxuICAgICAgICAgICAgICAsIGludGVycChUWzJdLCBUWzNdKSBcbiAgICAgICAgICAgICAgLCBpbnRlcnAoVFsyXSwgVFsxXSkgXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4MDU6XG4gICAgICAgICAgZmFjZXMucHVzaChbIFxuICAgICAgICAgICAgICAgIGludGVycChUWzBdLCBUWzFdKVxuICAgICAgICAgICAgICAsIGludGVycChUWzFdLCBUWzJdKVxuICAgICAgICAgICAgICAsIGludGVycChUWzJdLCBUWzNdKVxuICAgICAgICAgICAgICAsIGludGVycChUWzBdLCBUWzNdKSBdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHgwQTpcbiAgICAgICAgICBmYWNlcy5wdXNoKFsgXG4gICAgICAgICAgICAgICAgaW50ZXJwKFRbMF0sIFRbMV0pXG4gICAgICAgICAgICAgICwgaW50ZXJwKFRbMF0sIFRbM10pXG4gICAgICAgICAgICAgICwgaW50ZXJwKFRbMl0sIFRbM10pXG4gICAgICAgICAgICAgICwgaW50ZXJwKFRbMV0sIFRbMl0pIF0pO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDA2OlxuICAgICAgICAgIGZhY2VzLnB1c2goWyBcbiAgICAgICAgICAgICAgICBpbnRlcnAoVFsyXSwgVFszXSlcbiAgICAgICAgICAgICAgLCBpbnRlcnAoVFswXSwgVFsyXSlcbiAgICAgICAgICAgICAgLCBpbnRlcnAoVFswXSwgVFsxXSlcbiAgICAgICAgICAgICAgLCBpbnRlcnAoVFsxXSwgVFszXSkgXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4MDk6XG4gICAgICAgICAgZmFjZXMucHVzaChbIFxuICAgICAgICAgICAgICAgIGludGVycChUWzJdLCBUWzNdKVxuICAgICAgICAgICAgICAsIGludGVycChUWzFdLCBUWzNdKVxuICAgICAgICAgICAgICAsIGludGVycChUWzBdLCBUWzFdKVxuICAgICAgICAgICAgICAsIGludGVycChUWzBdLCBUWzJdKSBdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHgwNzpcbiAgICAgICAgICBmYWNlcy5wdXNoKFsgXG4gICAgICAgICAgICAgICAgaW50ZXJwKFRbM10sIFRbMF0pXG4gICAgICAgICAgICAgICwgaW50ZXJwKFRbM10sIFRbMV0pXG4gICAgICAgICAgICAgICwgaW50ZXJwKFRbM10sIFRbMl0pIF0pO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDA4OlxuICAgICAgICAgIGZhY2VzLnB1c2goWyBcbiAgICAgICAgICAgICAgICBpbnRlcnAoVFszXSwgVFswXSlcbiAgICAgICAgICAgICAgLCBpbnRlcnAoVFszXSwgVFsyXSlcbiAgICAgICAgICAgICAgLCBpbnRlcnAoVFszXSwgVFsxXSkgXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgcmV0dXJuIHsgcG9zaXRpb25zOiB2ZXJ0aWNlcywgY2VsbHM6IGZhY2VzIH07XG59XG5cbiIsIi8qKlxuICogU3VyZmFjZU5ldHMgaW4gSmF2YVNjcmlwdFxuICpcbiAqIFdyaXR0ZW4gYnkgTWlrb2xhIEx5c2Vua28gKEMpIDIwMTJcbiAqXG4gKiBNSVQgTGljZW5zZVxuICpcbiAqIEJhc2VkIG9uOiBTLkYuIEdpYnNvbiwgXCJDb25zdHJhaW5lZCBFbGFzdGljIFN1cmZhY2UgTmV0c1wiLiAoMTk5OCkgTUVSTCBUZWNoIFJlcG9ydC5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vUHJlY29tcHV0ZSBlZGdlIHRhYmxlLCBsaWtlIFBhdWwgQm91cmtlIGRvZXMuXG4vLyBUaGlzIHNhdmVzIGEgYml0IG9mIHRpbWUgd2hlbiBjb21wdXRpbmcgdGhlIGNlbnRyb2lkIG9mIGVhY2ggYm91bmRhcnkgY2VsbFxudmFyIGN1YmVfZWRnZXMgPSBuZXcgSW50MzJBcnJheSgyNClcbiAgLCBlZGdlX3RhYmxlID0gbmV3IEludDMyQXJyYXkoMjU2KTtcbihmdW5jdGlvbigpIHtcblxuICAvL0luaXRpYWxpemUgdGhlIGN1YmVfZWRnZXMgdGFibGVcbiAgLy8gVGhpcyBpcyBqdXN0IHRoZSB2ZXJ0ZXggbnVtYmVyIG9mIGVhY2ggY3ViZVxuICB2YXIgayA9IDA7XG4gIGZvcih2YXIgaT0wOyBpPDg7ICsraSkge1xuICAgIGZvcih2YXIgaj0xOyBqPD00OyBqPDw9MSkge1xuICAgICAgdmFyIHAgPSBpXmo7XG4gICAgICBpZihpIDw9IHApIHtcbiAgICAgICAgY3ViZV9lZGdlc1trKytdID0gaTtcbiAgICAgICAgY3ViZV9lZGdlc1trKytdID0gcDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvL0luaXRpYWxpemUgdGhlIGludGVyc2VjdGlvbiB0YWJsZS5cbiAgLy8gIFRoaXMgaXMgYSAyXihjdWJlIGNvbmZpZ3VyYXRpb24pIC0+ICAyXihlZGdlIGNvbmZpZ3VyYXRpb24pIG1hcFxuICAvLyAgVGhlcmUgaXMgb25lIGVudHJ5IGZvciBlYWNoIHBvc3NpYmxlIGN1YmUgY29uZmlndXJhdGlvbiwgYW5kIHRoZSBvdXRwdXQgaXMgYSAxMi1iaXQgdmVjdG9yIGVudW1lcmF0aW5nIGFsbCBlZGdlcyBjcm9zc2luZyB0aGUgMC1sZXZlbC5cbiAgZm9yKHZhciBpPTA7IGk8MjU2OyArK2kpIHtcbiAgICB2YXIgZW0gPSAwO1xuICAgIGZvcih2YXIgaj0wOyBqPDI0OyBqKz0yKSB7XG4gICAgICB2YXIgYSA9ICEhKGkgJiAoMTw8Y3ViZV9lZGdlc1tqXSkpXG4gICAgICAgICwgYiA9ICEhKGkgJiAoMTw8Y3ViZV9lZGdlc1tqKzFdKSk7XG4gICAgICBlbSB8PSBhICE9PSBiID8gKDEgPDwgKGogPj4gMSkpIDogMDtcbiAgICB9XG4gICAgZWRnZV90YWJsZVtpXSA9IGVtO1xuICB9XG59KSgpO1xuXG4vL0ludGVybmFsIGJ1ZmZlciwgdGhpcyBtYXkgZ2V0IHJlc2l6ZWQgYXQgcnVuIHRpbWVcbnZhciBidWZmZXIgPSBuZXcgQXJyYXkoNDA5Nik7XG4oZnVuY3Rpb24oKSB7XG4gIGZvcih2YXIgaT0wOyBpPGJ1ZmZlci5sZW5ndGg7ICsraSkge1xuICAgIGJ1ZmZlcltpXSA9IDA7XG4gIH1cbn0pKCk7XG5cbmV4cG9ydHMuc3VyZmFjZU5ldHMgPSBmdW5jdGlvbihkaW1zLCBwb3RlbnRpYWwsIGJvdW5kcykge1xuICBpZighYm91bmRzKSB7XG4gICAgYm91bmRzID0gW1swLDAsMF0sZGltc107XG4gIH1cbiAgXG4gIHZhciBzY2FsZSAgICAgPSBbMCwwLDBdO1xuICB2YXIgc2hpZnQgICAgID0gWzAsMCwwXTtcbiAgZm9yKHZhciBpPTA7IGk8MzsgKytpKSB7XG4gICAgc2NhbGVbaV0gPSAoYm91bmRzWzFdW2ldIC0gYm91bmRzWzBdW2ldKSAvIGRpbXNbaV07XG4gICAgc2hpZnRbaV0gPSBib3VuZHNbMF1baV07XG4gIH1cbiAgXG4gIHZhciB2ZXJ0aWNlcyA9IFtdXG4gICAgLCBmYWNlcyA9IFtdXG4gICAgLCBuID0gMFxuICAgICwgeCA9IFswLCAwLCAwXVxuICAgICwgUiA9IFsxLCAoZGltc1swXSsxKSwgKGRpbXNbMF0rMSkqKGRpbXNbMV0rMSldXG4gICAgLCBncmlkID0gWzAuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCAwLjAsIDAuMCwgMC4wXVxuICAgICwgYnVmX25vID0gMTtcbiAgXG4gICBcbiAgLy9SZXNpemUgYnVmZmVyIGlmIG5lY2Vzc2FyeSBcbiAgaWYoUlsyXSAqIDIgPiBidWZmZXIubGVuZ3RoKSB7XG4gICAgdmFyIG9sID0gYnVmZmVyLmxlbmd0aDtcbiAgICBidWZmZXIubGVuZ3RoID0gUlsyXSAqIDI7XG4gICAgd2hpbGUob2wgPCBidWZmZXIubGVuZ3RoKSB7XG4gICAgICBidWZmZXJbb2wrK10gPSAwO1xuICAgIH1cbiAgfVxuICBcbiAgLy9NYXJjaCBvdmVyIHRoZSB2b3hlbCBncmlkXG4gIGZvcih4WzJdPTA7IHhbMl08ZGltc1syXS0xOyArK3hbMl0sIG4rPWRpbXNbMF0sIGJ1Zl9ubyBePSAxLCBSWzJdPS1SWzJdKSB7XG4gIFxuICAgIC8vbSBpcyB0aGUgcG9pbnRlciBpbnRvIHRoZSBidWZmZXIgd2UgYXJlIGdvaW5nIHRvIHVzZS4gIFxuICAgIC8vVGhpcyBpcyBzbGlnaHRseSBvYnR1c2UgYmVjYXVzZSBqYXZhc2NyaXB0IGRvZXMgbm90IGhhdmUgZ29vZCBzdXBwb3J0IGZvciBwYWNrZWQgZGF0YSBzdHJ1Y3R1cmVzLCBzbyB3ZSBtdXN0IHVzZSB0eXBlZCBhcnJheXMgOihcbiAgICAvL1RoZSBjb250ZW50cyBvZiB0aGUgYnVmZmVyIHdpbGwgYmUgdGhlIGluZGljZXMgb2YgdGhlIHZlcnRpY2VzIG9uIHRoZSBwcmV2aW91cyB4L3kgc2xpY2Ugb2YgdGhlIHZvbHVtZVxuICAgIHZhciBtID0gMSArIChkaW1zWzBdKzEpICogKDEgKyBidWZfbm8gKiAoZGltc1sxXSsxKSk7XG4gICAgXG4gICAgZm9yKHhbMV09MDsgeFsxXTxkaW1zWzFdLTE7ICsreFsxXSwgKytuLCBtKz0yKVxuICAgIGZvcih4WzBdPTA7IHhbMF08ZGltc1swXS0xOyArK3hbMF0sICsrbiwgKyttKSB7XG4gICAgXG4gICAgICAvL1JlYWQgaW4gOCBmaWVsZCB2YWx1ZXMgYXJvdW5kIHRoaXMgdmVydGV4IGFuZCBzdG9yZSB0aGVtIGluIGFuIGFycmF5XG4gICAgICAvL0Fsc28gY2FsY3VsYXRlIDgtYml0IG1hc2ssIGxpa2UgaW4gbWFyY2hpbmcgY3ViZXMsIHNvIHdlIGNhbiBzcGVlZCB1cCBzaWduIGNoZWNrcyBsYXRlclxuICAgICAgdmFyIG1hc2sgPSAwLCBnID0gMDtcbiAgICAgIGZvcih2YXIgaz0wOyBrPDI7ICsraylcbiAgICAgIGZvcih2YXIgaj0wOyBqPDI7ICsraikgICAgICBcbiAgICAgIGZvcih2YXIgaT0wOyBpPDI7ICsraSwgKytnKSB7XG4gICAgICAgIHZhciBwID0gcG90ZW50aWFsKFxuICAgICAgICAgIHNjYWxlWzBdKih4WzBdK2kpK3NoaWZ0WzBdLFxuICAgICAgICAgIHNjYWxlWzFdKih4WzFdK2opK3NoaWZ0WzFdLFxuICAgICAgICAgIHNjYWxlWzJdKih4WzJdK2spK3NoaWZ0WzJdKTtcbiAgICAgICAgZ3JpZFtnXSA9IHA7XG4gICAgICAgIG1hc2sgfD0gKHAgPCAwKSA/ICgxPDxnKSA6IDA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vQ2hlY2sgZm9yIGVhcmx5IHRlcm1pbmF0aW9uIGlmIGNlbGwgZG9lcyBub3QgaW50ZXJzZWN0IGJvdW5kYXJ5XG4gICAgICBpZihtYXNrID09PSAwIHx8IG1hc2sgPT09IDB4ZmYpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vU3VtIHVwIGVkZ2UgaW50ZXJzZWN0aW9uc1xuICAgICAgdmFyIGVkZ2VfbWFzayA9IGVkZ2VfdGFibGVbbWFza11cbiAgICAgICAgLCB2ID0gWzAuMCwwLjAsMC4wXVxuICAgICAgICAsIGVfY291bnQgPSAwO1xuICAgICAgICBcbiAgICAgIC8vRm9yIGV2ZXJ5IGVkZ2Ugb2YgdGhlIGN1YmUuLi5cbiAgICAgIGZvcih2YXIgaT0wOyBpPDEyOyArK2kpIHtcbiAgICAgIFxuICAgICAgICAvL1VzZSBlZGdlIG1hc2sgdG8gY2hlY2sgaWYgaXQgaXMgY3Jvc3NlZFxuICAgICAgICBpZighKGVkZ2VfbWFzayAmICgxPDxpKSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy9JZiBpdCBkaWQsIGluY3JlbWVudCBudW1iZXIgb2YgZWRnZSBjcm9zc2luZ3NcbiAgICAgICAgKytlX2NvdW50O1xuICAgICAgICBcbiAgICAgICAgLy9Ob3cgZmluZCB0aGUgcG9pbnQgb2YgaW50ZXJzZWN0aW9uXG4gICAgICAgIHZhciBlMCA9IGN1YmVfZWRnZXNbIGk8PDEgXSAgICAgICAvL1VucGFjayB2ZXJ0aWNlc1xuICAgICAgICAgICwgZTEgPSBjdWJlX2VkZ2VzWyhpPDwxKSsxXVxuICAgICAgICAgICwgZzAgPSBncmlkW2UwXSAgICAgICAgICAgICAgICAgLy9VbnBhY2sgZ3JpZCB2YWx1ZXNcbiAgICAgICAgICAsIGcxID0gZ3JpZFtlMV1cbiAgICAgICAgICAsIHQgID0gZzAgLSBnMTsgICAgICAgICAgICAgICAgIC8vQ29tcHV0ZSBwb2ludCBvZiBpbnRlcnNlY3Rpb25cbiAgICAgICAgaWYoTWF0aC5hYnModCkgPiAxZS02KSB7XG4gICAgICAgICAgdCA9IGcwIC8gdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy9JbnRlcnBvbGF0ZSB2ZXJ0aWNlcyBhbmQgYWRkIHVwIGludGVyc2VjdGlvbnMgKHRoaXMgY2FuIGJlIGRvbmUgd2l0aG91dCBtdWx0aXBseWluZylcbiAgICAgICAgZm9yKHZhciBqPTAsIGs9MTsgajwzOyArK2osIGs8PD0xKSB7XG4gICAgICAgICAgdmFyIGEgPSBlMCAmIGtcbiAgICAgICAgICAgICwgYiA9IGUxICYgaztcbiAgICAgICAgICBpZihhICE9PSBiKSB7XG4gICAgICAgICAgICB2W2pdICs9IGEgPyAxLjAgLSB0IDogdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdltqXSArPSBhID8gMS4wIDogMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy9Ob3cgd2UganVzdCBhdmVyYWdlIHRoZSBlZGdlIGludGVyc2VjdGlvbnMgYW5kIGFkZCB0aGVtIHRvIGNvb3JkaW5hdGVcbiAgICAgIHZhciBzID0gMS4wIC8gZV9jb3VudDtcbiAgICAgIGZvcih2YXIgaT0wOyBpPDM7ICsraSkge1xuICAgICAgICB2W2ldID0gc2NhbGVbaV0gKiAoeFtpXSArIHMgKiB2W2ldKSArIHNoaWZ0W2ldO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvL0FkZCB2ZXJ0ZXggdG8gYnVmZmVyLCBzdG9yZSBwb2ludGVyIHRvIHZlcnRleCBpbmRleCBpbiBidWZmZXJcbiAgICAgIGJ1ZmZlclttXSA9IHZlcnRpY2VzLmxlbmd0aDtcbiAgICAgIHZlcnRpY2VzLnB1c2godik7XG4gICAgICBcbiAgICAgIC8vTm93IHdlIG5lZWQgdG8gYWRkIGZhY2VzIHRvZ2V0aGVyLCB0byBkbyB0aGlzIHdlIGp1c3QgbG9vcCBvdmVyIDMgYmFzaXMgY29tcG9uZW50c1xuICAgICAgZm9yKHZhciBpPTA7IGk8MzsgKytpKSB7XG4gICAgICAgIC8vVGhlIGZpcnN0IHRocmVlIGVudHJpZXMgb2YgdGhlIGVkZ2VfbWFzayBjb3VudCB0aGUgY3Jvc3NpbmdzIGFsb25nIHRoZSBlZGdlXG4gICAgICAgIGlmKCEoZWRnZV9tYXNrICYgKDE8PGkpKSApIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gaSA9IGF4ZXMgd2UgYXJlIHBvaW50IGFsb25nLiAgaXUsIGl2ID0gb3J0aG9nb25hbCBheGVzXG4gICAgICAgIHZhciBpdSA9IChpKzEpJTNcbiAgICAgICAgICAsIGl2ID0gKGkrMiklMztcbiAgICAgICAgICBcbiAgICAgICAgLy9JZiB3ZSBhcmUgb24gYSBib3VuZGFyeSwgc2tpcCBpdFxuICAgICAgICBpZih4W2l1XSA9PT0gMCB8fCB4W2l2XSA9PT0gMCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvL090aGVyd2lzZSwgbG9vayB1cCBhZGphY2VudCBlZGdlcyBpbiBidWZmZXJcbiAgICAgICAgdmFyIGR1ID0gUltpdV1cbiAgICAgICAgICAsIGR2ID0gUltpdl07XG4gICAgICAgIFxuICAgICAgICAvL1JlbWVtYmVyIHRvIGZsaXAgb3JpZW50YXRpb24gZGVwZW5kaW5nIG9uIHRoZSBzaWduIG9mIHRoZSBjb3JuZXIuXG4gICAgICAgIGlmKG1hc2sgJiAxKSB7XG4gICAgICAgICAgZmFjZXMucHVzaChbYnVmZmVyW21dLCAgICBidWZmZXJbbS1kdV0sICAgIGJ1ZmZlclttLWR2XV0pO1xuICAgICAgICAgIGZhY2VzLnB1c2goW2J1ZmZlclttLWR2XSwgYnVmZmVyW20tZHVdLCAgICBidWZmZXJbbS1kdS1kdl1dKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmYWNlcy5wdXNoKFtidWZmZXJbbV0sICAgIGJ1ZmZlclttLWR2XSwgICAgYnVmZmVyW20tZHVdXSk7XG4gICAgICAgICAgZmFjZXMucHVzaChbYnVmZmVyW20tZHVdLCBidWZmZXJbbS1kdl0sICAgIGJ1ZmZlclttLWR1LWR2XV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICAvL0FsbCBkb25lISAgUmV0dXJuIHRoZSByZXN1bHRcbiAgcmV0dXJuIHsgcG9zaXRpb25zOiB2ZXJ0aWNlcywgY2VsbHM6IGZhY2VzIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gbW91c2VMaXN0ZW5cblxudmFyIG1vdXNlID0gcmVxdWlyZSgnbW91c2UtZXZlbnQnKVxuXG5mdW5jdGlvbiBtb3VzZUxpc3RlbiAoZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgaWYgKCFjYWxsYmFjaykge1xuICAgIGNhbGxiYWNrID0gZWxlbWVudFxuICAgIGVsZW1lbnQgPSB3aW5kb3dcbiAgfVxuXG4gIHZhciBidXR0b25TdGF0ZSA9IDBcbiAgdmFyIHggPSAwXG4gIHZhciB5ID0gMFxuICB2YXIgbW9kcyA9IHtcbiAgICBzaGlmdDogZmFsc2UsXG4gICAgYWx0OiBmYWxzZSxcbiAgICBjb250cm9sOiBmYWxzZSxcbiAgICBtZXRhOiBmYWxzZVxuICB9XG4gIHZhciBhdHRhY2hlZCA9IGZhbHNlXG5cbiAgZnVuY3Rpb24gdXBkYXRlTW9kcyAoZXYpIHtcbiAgICB2YXIgY2hhbmdlZCA9IGZhbHNlXG4gICAgaWYgKCdhbHRLZXknIGluIGV2KSB7XG4gICAgICBjaGFuZ2VkID0gY2hhbmdlZCB8fCBldi5hbHRLZXkgIT09IG1vZHMuYWx0XG4gICAgICBtb2RzLmFsdCA9ICEhZXYuYWx0S2V5XG4gICAgfVxuICAgIGlmICgnc2hpZnRLZXknIGluIGV2KSB7XG4gICAgICBjaGFuZ2VkID0gY2hhbmdlZCB8fCBldi5zaGlmdEtleSAhPT0gbW9kcy5zaGlmdFxuICAgICAgbW9kcy5zaGlmdCA9ICEhZXYuc2hpZnRLZXlcbiAgICB9XG4gICAgaWYgKCdjdHJsS2V5JyBpbiBldikge1xuICAgICAgY2hhbmdlZCA9IGNoYW5nZWQgfHwgZXYuY3RybEtleSAhPT0gbW9kcy5jb250cm9sXG4gICAgICBtb2RzLmNvbnRyb2wgPSAhIWV2LmN0cmxLZXlcbiAgICB9XG4gICAgaWYgKCdtZXRhS2V5JyBpbiBldikge1xuICAgICAgY2hhbmdlZCA9IGNoYW5nZWQgfHwgZXYubWV0YUtleSAhPT0gbW9kcy5tZXRhXG4gICAgICBtb2RzLm1ldGEgPSAhIWV2Lm1ldGFLZXlcbiAgICB9XG4gICAgcmV0dXJuIGNoYW5nZWRcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUV2ZW50IChuZXh0QnV0dG9ucywgZXYpIHtcbiAgICB2YXIgbmV4dFggPSBtb3VzZS54KGV2KVxuICAgIHZhciBuZXh0WSA9IG1vdXNlLnkoZXYpXG4gICAgaWYgKCdidXR0b25zJyBpbiBldikge1xuICAgICAgbmV4dEJ1dHRvbnMgPSBldi5idXR0b25zIHwgMFxuICAgIH1cbiAgICBpZiAobmV4dEJ1dHRvbnMgIT09IGJ1dHRvblN0YXRlIHx8XG4gICAgICBuZXh0WCAhPT0geCB8fFxuICAgICAgbmV4dFkgIT09IHkgfHxcbiAgICAgIHVwZGF0ZU1vZHMoZXYpKSB7XG4gICAgICBidXR0b25TdGF0ZSA9IG5leHRCdXR0b25zIHwgMFxuICAgICAgeCA9IG5leHRYIHx8IDBcbiAgICAgIHkgPSBuZXh0WSB8fCAwXG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhidXR0b25TdGF0ZSwgeCwgeSwgbW9kcylcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhclN0YXRlIChldikge1xuICAgIGhhbmRsZUV2ZW50KDAsIGV2KVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQmx1ciAoKSB7XG4gICAgaWYgKGJ1dHRvblN0YXRlIHx8XG4gICAgICB4IHx8XG4gICAgICB5IHx8XG4gICAgICBtb2RzLnNoaWZ0IHx8XG4gICAgICBtb2RzLmFsdCB8fFxuICAgICAgbW9kcy5tZXRhIHx8XG4gICAgICBtb2RzLmNvbnRyb2wpIHtcbiAgICAgIHggPSB5ID0gMFxuICAgICAgYnV0dG9uU3RhdGUgPSAwXG4gICAgICBtb2RzLnNoaWZ0ID0gbW9kcy5hbHQgPSBtb2RzLmNvbnRyb2wgPSBtb2RzLm1ldGEgPSBmYWxzZVxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soMCwgMCwgMCwgbW9kcylcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVNb2RzIChldikge1xuICAgIGlmICh1cGRhdGVNb2RzKGV2KSkge1xuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soYnV0dG9uU3RhdGUsIHgsIHksIG1vZHMpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlTW91c2VNb3ZlIChldikge1xuICAgIGlmIChtb3VzZS5idXR0b25zKGV2KSA9PT0gMCkge1xuICAgICAgaGFuZGxlRXZlbnQoMCwgZXYpXG4gICAgfSBlbHNlIHtcbiAgICAgIGhhbmRsZUV2ZW50KGJ1dHRvblN0YXRlLCBldilcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVNb3VzZURvd24gKGV2KSB7XG4gICAgaGFuZGxlRXZlbnQoYnV0dG9uU3RhdGUgfCBtb3VzZS5idXR0b25zKGV2KSwgZXYpXG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVNb3VzZVVwIChldikge1xuICAgIGhhbmRsZUV2ZW50KGJ1dHRvblN0YXRlICYgfm1vdXNlLmJ1dHRvbnMoZXYpLCBldilcbiAgfVxuXG4gIGZ1bmN0aW9uIGF0dGFjaExpc3RlbmVycyAoKSB7XG4gICAgaWYgKGF0dGFjaGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgYXR0YWNoZWQgPSB0cnVlXG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGhhbmRsZU1vdXNlTW92ZSlcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlTW91c2VEb3duKVxuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgaGFuZGxlTW91c2VVcClcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGNsZWFyU3RhdGUpXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgY2xlYXJTdGF0ZSlcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgY2xlYXJTdGF0ZSlcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGNsZWFyU3RhdGUpXG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBoYW5kbGVCbHVyKVxuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZU1vZHMpXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlTW9kcylcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgaGFuZGxlTW9kcylcblxuICAgIGlmIChlbGVtZW50ICE9PSB3aW5kb3cpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgaGFuZGxlQmx1cilcblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlTW9kcylcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlTW9kcylcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIGhhbmRsZU1vZHMpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGV0YWNoTGlzdGVuZXJzICgpIHtcbiAgICBpZiAoIWF0dGFjaGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgYXR0YWNoZWQgPSBmYWxzZVxuXG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBoYW5kbGVNb3VzZU1vdmUpXG5cbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZU1vdXNlRG93bilcblxuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGhhbmRsZU1vdXNlVXApXG5cbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBjbGVhclN0YXRlKVxuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGNsZWFyU3RhdGUpXG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGNsZWFyU3RhdGUpXG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBjbGVhclN0YXRlKVxuXG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgaGFuZGxlQmx1cilcblxuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVNb2RzKVxuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZU1vZHMpXG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIGhhbmRsZU1vZHMpXG5cbiAgICBpZiAoZWxlbWVudCAhPT0gd2luZG93KSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIGhhbmRsZUJsdXIpXG5cbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZU1vZHMpXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZU1vZHMpXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBoYW5kbGVNb2RzKVxuICAgIH1cbiAgfVxuXG4gIC8vIEF0dGFjaCBsaXN0ZW5lcnNcbiAgYXR0YWNoTGlzdGVuZXJzKClcblxuICB2YXIgcmVzdWx0ID0ge1xuICAgIGVsZW1lbnQ6IGVsZW1lbnRcbiAgfVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHJlc3VsdCwge1xuICAgIGVuYWJsZWQ6IHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gYXR0YWNoZWQgfSxcbiAgICAgIHNldDogZnVuY3Rpb24gKGYpIHtcbiAgICAgICAgaWYgKGYpIHtcbiAgICAgICAgICBhdHRhY2hMaXN0ZW5lcnMoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRldGFjaExpc3RlbmVycygpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSxcbiAgICBidXR0b25zOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGJ1dHRvblN0YXRlIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSxcbiAgICB4OiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHggfSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuICAgIHk6IHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4geSB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgbW9kczoge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBtb2RzIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiByZXN1bHRcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5mdW5jdGlvbiBtb3VzZUJ1dHRvbnMoZXYpIHtcbiAgaWYodHlwZW9mIGV2ID09PSAnb2JqZWN0Jykge1xuICAgIGlmKCdidXR0b25zJyBpbiBldikge1xuICAgICAgcmV0dXJuIGV2LmJ1dHRvbnNcbiAgICB9IGVsc2UgaWYoJ3doaWNoJyBpbiBldikge1xuICAgICAgdmFyIGIgPSBldi53aGljaFxuICAgICAgaWYoYiA9PT0gMikge1xuICAgICAgICByZXR1cm4gNFxuICAgICAgfSBlbHNlIGlmKGIgPT09IDMpIHtcbiAgICAgICAgcmV0dXJuIDJcbiAgICAgIH0gZWxzZSBpZihiID4gMCkge1xuICAgICAgICByZXR1cm4gMTw8KGItMSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYoJ2J1dHRvbicgaW4gZXYpIHtcbiAgICAgIHZhciBiID0gZXYuYnV0dG9uXG4gICAgICBpZihiID09PSAxKSB7XG4gICAgICAgIHJldHVybiA0XG4gICAgICB9IGVsc2UgaWYoYiA9PT0gMikge1xuICAgICAgICByZXR1cm4gMlxuICAgICAgfSBlbHNlIGlmKGIgPj0gMCkge1xuICAgICAgICByZXR1cm4gMTw8YlxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gMFxufVxuZXhwb3J0cy5idXR0b25zID0gbW91c2VCdXR0b25zXG5cbmZ1bmN0aW9uIG1vdXNlRWxlbWVudChldikge1xuICByZXR1cm4gZXYudGFyZ2V0IHx8IGV2LnNyY0VsZW1lbnQgfHwgd2luZG93XG59XG5leHBvcnRzLmVsZW1lbnQgPSBtb3VzZUVsZW1lbnRcblxuZnVuY3Rpb24gbW91c2VSZWxhdGl2ZVgoZXYpIHtcbiAgaWYodHlwZW9mIGV2ID09PSAnb2JqZWN0Jykge1xuICAgIGlmKCdvZmZzZXRYJyBpbiBldikge1xuICAgICAgcmV0dXJuIGV2Lm9mZnNldFhcbiAgICB9XG4gICAgdmFyIHRhcmdldCA9IG1vdXNlRWxlbWVudChldilcbiAgICB2YXIgYm91bmRzID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgcmV0dXJuIGV2LmNsaWVudFggLSBib3VuZHMubGVmdFxuICB9XG4gIHJldHVybiAwXG59XG5leHBvcnRzLnggPSBtb3VzZVJlbGF0aXZlWFxuXG5mdW5jdGlvbiBtb3VzZVJlbGF0aXZlWShldikge1xuICBpZih0eXBlb2YgZXYgPT09ICdvYmplY3QnKSB7XG4gICAgaWYoJ29mZnNldFknIGluIGV2KSB7XG4gICAgICByZXR1cm4gZXYub2Zmc2V0WVxuICAgIH1cbiAgICB2YXIgdGFyZ2V0ID0gbW91c2VFbGVtZW50KGV2KVxuICAgIHZhciBib3VuZHMgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICByZXR1cm4gZXYuY2xpZW50WSAtIGJvdW5kcy50b3BcbiAgfVxuICByZXR1cm4gMFxufVxuZXhwb3J0cy55ID0gbW91c2VSZWxhdGl2ZVlcbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgdG9QWCA9IHJlcXVpcmUoJ3RvLXB4JylcblxubW9kdWxlLmV4cG9ydHMgPSBtb3VzZVdoZWVsTGlzdGVuXG5cbmZ1bmN0aW9uIG1vdXNlV2hlZWxMaXN0ZW4oZWxlbWVudCwgY2FsbGJhY2ssIG5vU2Nyb2xsKSB7XG4gIGlmKHR5cGVvZiBlbGVtZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgbm9TY3JvbGwgPSAhIWNhbGxiYWNrXG4gICAgY2FsbGJhY2sgPSBlbGVtZW50XG4gICAgZWxlbWVudCA9IHdpbmRvd1xuICB9XG4gIHZhciBsaW5lSGVpZ2h0ID0gdG9QWCgnZXgnLCBlbGVtZW50KVxuICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbihldikge1xuICAgIGlmKG5vU2Nyb2xsKSB7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfVxuICAgIHZhciBkeCA9IGV2LmRlbHRhWCB8fCAwXG4gICAgdmFyIGR5ID0gZXYuZGVsdGFZIHx8IDBcbiAgICB2YXIgZHogPSBldi5kZWx0YVogfHwgMFxuICAgIHZhciBtb2RlID0gZXYuZGVsdGFNb2RlXG4gICAgdmFyIHNjYWxlID0gMVxuICAgIHN3aXRjaChtb2RlKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHNjYWxlID0gbGluZUhlaWdodFxuICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgc2NhbGUgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGR4ICo9IHNjYWxlXG4gICAgZHkgKj0gc2NhbGVcbiAgICBkeiAqPSBzY2FsZVxuICAgIGlmKGR4IHx8IGR5IHx8IGR6KSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZHgsIGR5LCBkeiwgZXYpXG4gICAgfVxuICB9XG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCBsaXN0ZW5lcilcbiAgcmV0dXJuIGxpc3RlbmVyXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlVW5pdChzdHIsIG91dCkge1xuICAgIGlmICghb3V0KVxuICAgICAgICBvdXQgPSBbIDAsICcnIF1cblxuICAgIHN0ciA9IFN0cmluZyhzdHIpXG4gICAgdmFyIG51bSA9IHBhcnNlRmxvYXQoc3RyLCAxMClcbiAgICBvdXRbMF0gPSBudW1cbiAgICBvdXRbMV0gPSBzdHIubWF0Y2goL1tcXGQuXFwtXFwrXSpcXHMqKC4qKS8pWzFdIHx8ICcnXG4gICAgcmV0dXJuIG91dFxufSIsInZhciBtb3VzZUNoYW5nZSA9IHJlcXVpcmUoJ21vdXNlLWNoYW5nZScpXG52YXIgbW91c2VXaGVlbCA9IHJlcXVpcmUoJ21vdXNlLXdoZWVsJylcbnZhciBpZGVudGl0eSA9IHJlcXVpcmUoJ2dsLW1hdDQvaWRlbnRpdHknKVxudmFyIHBlcnNwZWN0aXZlID0gcmVxdWlyZSgnZ2wtbWF0NC9wZXJzcGVjdGl2ZScpXG52YXIgbG9va0F0ID0gcmVxdWlyZSgnZ2wtbWF0NC9sb29rQXQnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUNhbWVyYVxuXG52YXIgaXNCcm93c2VyID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcblxuZnVuY3Rpb24gY3JlYXRlQ2FtZXJhIChyZWdsLCBwcm9wc18pIHtcbiAgdmFyIHByb3BzID0gcHJvcHNfIHx8IHt9XG5cbiAgLy8gUHJlc2VydmUgYmFja3dhcmQtY29tcGF0aWJpbHR5IHdoaWxlIHJlbmFtaW5nIHByZXZlbnREZWZhdWx0IC0+IG5vU2Nyb2xsXG4gIGlmICh0eXBlb2YgcHJvcHMubm9TY3JvbGwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcHJvcHMubm9TY3JvbGwgPSBwcm9wcy5wcmV2ZW50RGVmYXVsdDtcbiAgfVxuXG4gIHZhciBjYW1lcmFTdGF0ZSA9IHtcbiAgICB2aWV3OiBpZGVudGl0eShuZXcgRmxvYXQzMkFycmF5KDE2KSksXG4gICAgcHJvamVjdGlvbjogaWRlbnRpdHkobmV3IEZsb2F0MzJBcnJheSgxNikpLFxuICAgIGNlbnRlcjogbmV3IEZsb2F0MzJBcnJheShwcm9wcy5jZW50ZXIgfHwgMyksXG4gICAgdGhldGE6IHByb3BzLnRoZXRhIHx8IDAsXG4gICAgcGhpOiBwcm9wcy5waGkgfHwgMCxcbiAgICBkaXN0YW5jZTogTWF0aC5sb2cocHJvcHMuZGlzdGFuY2UgfHwgMTAuMCksXG4gICAgZXllOiBuZXcgRmxvYXQzMkFycmF5KDMpLFxuICAgIHVwOiBuZXcgRmxvYXQzMkFycmF5KHByb3BzLnVwIHx8IFswLCAxLCAwXSksXG4gICAgZm92eTogcHJvcHMuZm92eSB8fCBNYXRoLlBJIC8gNC4wLFxuICAgIG5lYXI6IHR5cGVvZiBwcm9wcy5uZWFyICE9PSAndW5kZWZpbmVkJyA/IHByb3BzLm5lYXIgOiAwLjAxLFxuICAgIGZhcjogdHlwZW9mIHByb3BzLmZhciAhPT0gJ3VuZGVmaW5lZCcgPyBwcm9wcy5mYXIgOiAxMDAwLjAsXG4gICAgbm9TY3JvbGw6IHR5cGVvZiBwcm9wcy5ub1Njcm9sbCAhPT0gJ3VuZGVmaW5lZCcgPyBwcm9wcy5ub1Njcm9sbCA6IGZhbHNlLFxuICAgIGZsaXBZOiAhIXByb3BzLmZsaXBZLFxuICAgIGR0aGV0YTogMCxcbiAgICBkcGhpOiAwLFxuICAgIHJvdGF0aW9uU3BlZWQ6IHR5cGVvZiBwcm9wcy5yb3RhdGlvblNwZWVkICE9PSAndW5kZWZpbmVkJyA/IHByb3BzLnJvdGF0aW9uU3BlZWQgOiAxLFxuICAgIHpvb21TcGVlZDogdHlwZW9mIHByb3BzLnpvb21TcGVlZCAhPT0gJ3VuZGVmaW5lZCcgPyBwcm9wcy56b29tU3BlZWQgOiAxLFxuICAgIHJlbmRlck9uRGlydHk6IHR5cGVvZiBwcm9wcy5yZW5kZXJPbkRpcnR5ICE9PSB1bmRlZmluZWQgPyAhIXByb3BzLnJlbmRlck9uRGlydHkgOiBmYWxzZVxuICB9XG5cbiAgdmFyIGVsZW1lbnQgPSBwcm9wcy5lbGVtZW50XG4gIHZhciBkYW1waW5nID0gdHlwZW9mIHByb3BzLmRhbXBpbmcgIT09ICd1bmRlZmluZWQnID8gcHJvcHMuZGFtcGluZyA6IDAuOVxuXG4gIHZhciByaWdodCA9IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDAsIDBdKVxuICB2YXIgZnJvbnQgPSBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAxXSlcblxuICB2YXIgbWluRGlzdGFuY2UgPSBNYXRoLmxvZygnbWluRGlzdGFuY2UnIGluIHByb3BzID8gcHJvcHMubWluRGlzdGFuY2UgOiAwLjEpXG4gIHZhciBtYXhEaXN0YW5jZSA9IE1hdGgubG9nKCdtYXhEaXN0YW5jZScgaW4gcHJvcHMgPyBwcm9wcy5tYXhEaXN0YW5jZSA6IDEwMDApXG5cbiAgdmFyIGRkaXN0YW5jZSA9IDBcblxuICB2YXIgcHJldlggPSAwXG4gIHZhciBwcmV2WSA9IDBcblxuICBpZiAoaXNCcm93c2VyICYmIHByb3BzLm1vdXNlICE9PSBmYWxzZSkge1xuICAgIHZhciBzb3VyY2UgPSBlbGVtZW50IHx8IHJlZ2wuX2dsLmNhbnZhc1xuXG4gICAgZnVuY3Rpb24gZ2V0V2lkdGggKCkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQgPyBlbGVtZW50Lm9mZnNldFdpZHRoIDogd2luZG93LmlubmVyV2lkdGhcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRIZWlnaHQgKCkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQgPyBlbGVtZW50Lm9mZnNldEhlaWdodCA6IHdpbmRvdy5pbm5lckhlaWdodFxuICAgIH1cblxuICAgIG1vdXNlQ2hhbmdlKHNvdXJjZSwgZnVuY3Rpb24gKGJ1dHRvbnMsIHgsIHkpIHtcbiAgICAgIGlmIChidXR0b25zICYgMSkge1xuICAgICAgICB2YXIgZHggPSAoeCAtIHByZXZYKSAvIGdldFdpZHRoKClcbiAgICAgICAgdmFyIGR5ID0gKHkgLSBwcmV2WSkgLyBnZXRIZWlnaHQoKVxuXG4gICAgICAgIGNhbWVyYVN0YXRlLmR0aGV0YSArPSBjYW1lcmFTdGF0ZS5yb3RhdGlvblNwZWVkICogNC4wICogZHhcbiAgICAgICAgY2FtZXJhU3RhdGUuZHBoaSArPSBjYW1lcmFTdGF0ZS5yb3RhdGlvblNwZWVkICogNC4wICogZHlcbiAgICAgICAgY2FtZXJhU3RhdGUuZGlydHkgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcHJldlggPSB4XG4gICAgICBwcmV2WSA9IHlcbiAgICB9KVxuXG4gICAgbW91c2VXaGVlbChzb3VyY2UsIGZ1bmN0aW9uIChkeCwgZHkpIHtcbiAgICAgIGRkaXN0YW5jZSArPSBkeSAvIGdldEhlaWdodCgpICogY2FtZXJhU3RhdGUuem9vbVNwZWVkXG4gICAgICBjYW1lcmFTdGF0ZS5kaXJ0eSA9IHRydWU7XG4gICAgfSwgcHJvcHMubm9TY3JvbGwpXG4gIH1cblxuICBmdW5jdGlvbiBkYW1wICh4KSB7XG4gICAgdmFyIHhkID0geCAqIGRhbXBpbmdcbiAgICBpZiAoTWF0aC5hYnMoeGQpIDwgMC4xKSB7XG4gICAgICByZXR1cm4gMFxuICAgIH1cbiAgICBjYW1lcmFTdGF0ZS5kaXJ0eSA9IHRydWU7XG4gICAgcmV0dXJuIHhkXG4gIH1cblxuICBmdW5jdGlvbiBjbGFtcCAoeCwgbG8sIGhpKSB7XG4gICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHgsIGxvKSwgaGkpXG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVDYW1lcmEgKHByb3BzKSB7XG4gICAgT2JqZWN0LmtleXMocHJvcHMpLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgIGNhbWVyYVN0YXRlW3Byb3BdID0gcHJvcHNbcHJvcF1cbiAgICB9KVxuXG4gICAgdmFyIGNlbnRlciA9IGNhbWVyYVN0YXRlLmNlbnRlclxuICAgIHZhciBleWUgPSBjYW1lcmFTdGF0ZS5leWVcbiAgICB2YXIgdXAgPSBjYW1lcmFTdGF0ZS51cFxuICAgIHZhciBkdGhldGEgPSBjYW1lcmFTdGF0ZS5kdGhldGFcbiAgICB2YXIgZHBoaSA9IGNhbWVyYVN0YXRlLmRwaGlcblxuICAgIGNhbWVyYVN0YXRlLnRoZXRhICs9IGR0aGV0YVxuICAgIGNhbWVyYVN0YXRlLnBoaSA9IGNsYW1wKFxuICAgICAgY2FtZXJhU3RhdGUucGhpICsgZHBoaSxcbiAgICAgIC1NYXRoLlBJIC8gMi4wLFxuICAgICAgTWF0aC5QSSAvIDIuMClcbiAgICBjYW1lcmFTdGF0ZS5kaXN0YW5jZSA9IGNsYW1wKFxuICAgICAgY2FtZXJhU3RhdGUuZGlzdGFuY2UgKyBkZGlzdGFuY2UsXG4gICAgICBtaW5EaXN0YW5jZSxcbiAgICAgIG1heERpc3RhbmNlKVxuXG4gICAgY2FtZXJhU3RhdGUuZHRoZXRhID0gZGFtcChkdGhldGEpXG4gICAgY2FtZXJhU3RhdGUuZHBoaSA9IGRhbXAoZHBoaSlcbiAgICBkZGlzdGFuY2UgPSBkYW1wKGRkaXN0YW5jZSlcblxuICAgIHZhciB0aGV0YSA9IGNhbWVyYVN0YXRlLnRoZXRhXG4gICAgdmFyIHBoaSA9IGNhbWVyYVN0YXRlLnBoaVxuICAgIHZhciByID0gTWF0aC5leHAoY2FtZXJhU3RhdGUuZGlzdGFuY2UpXG5cbiAgICB2YXIgdmYgPSByICogTWF0aC5zaW4odGhldGEpICogTWF0aC5jb3MocGhpKVxuICAgIHZhciB2ciA9IHIgKiBNYXRoLmNvcyh0aGV0YSkgKiBNYXRoLmNvcyhwaGkpXG4gICAgdmFyIHZ1ID0gciAqIE1hdGguc2luKHBoaSlcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgKytpKSB7XG4gICAgICBleWVbaV0gPSBjZW50ZXJbaV0gKyB2ZiAqIGZyb250W2ldICsgdnIgKiByaWdodFtpXSArIHZ1ICogdXBbaV1cbiAgICB9XG5cbiAgICBsb29rQXQoY2FtZXJhU3RhdGUudmlldywgZXllLCBjZW50ZXIsIHVwKVxuICB9XG5cbiAgY2FtZXJhU3RhdGUuZGlydHkgPSB0cnVlO1xuXG4gIHZhciBpbmplY3RDb250ZXh0ID0gcmVnbCh7XG4gICAgY29udGV4dDogT2JqZWN0LmFzc2lnbih7fSwgY2FtZXJhU3RhdGUsIHtcbiAgICAgIGRpcnR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYW1lcmFTdGF0ZS5kaXJ0eTtcbiAgICAgIH0sXG4gICAgICBwcm9qZWN0aW9uOiBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgICAgICBwZXJzcGVjdGl2ZShjYW1lcmFTdGF0ZS5wcm9qZWN0aW9uLFxuICAgICAgICAgIGNhbWVyYVN0YXRlLmZvdnksXG4gICAgICAgICAgY29udGV4dC52aWV3cG9ydFdpZHRoIC8gY29udGV4dC52aWV3cG9ydEhlaWdodCxcbiAgICAgICAgICBjYW1lcmFTdGF0ZS5uZWFyLFxuICAgICAgICAgIGNhbWVyYVN0YXRlLmZhcilcbiAgICAgICAgaWYgKGNhbWVyYVN0YXRlLmZsaXBZKSB7IGNhbWVyYVN0YXRlLnByb2plY3Rpb25bNV0gKj0gLTEgfVxuICAgICAgICByZXR1cm4gY2FtZXJhU3RhdGUucHJvamVjdGlvblxuICAgICAgfVxuICAgIH0pLFxuICAgIHVuaWZvcm1zOiBPYmplY3Qua2V5cyhjYW1lcmFTdGF0ZSkucmVkdWNlKGZ1bmN0aW9uICh1bmlmb3JtcywgbmFtZSkge1xuICAgICAgdW5pZm9ybXNbbmFtZV0gPSByZWdsLmNvbnRleHQobmFtZSlcbiAgICAgIHJldHVybiB1bmlmb3Jtc1xuICAgIH0sIHt9KVxuICB9KVxuXG4gIGZ1bmN0aW9uIHNldHVwQ2FtZXJhIChwcm9wcywgYmxvY2spIHtcbiAgICBpZiAodHlwZW9mIHNldHVwQ2FtZXJhLmRpcnR5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY2FtZXJhU3RhdGUuZGlydHkgPSBzZXR1cENhbWVyYS5kaXJ0eSB8fCBjYW1lcmFTdGF0ZS5kaXJ0eVxuICAgICAgc2V0dXBDYW1lcmEuZGlydHkgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzICYmIGJsb2NrKSB7XG4gICAgICBjYW1lcmFTdGF0ZS5kaXJ0eSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGNhbWVyYVN0YXRlLnJlbmRlck9uRGlydHkgJiYgIWNhbWVyYVN0YXRlLmRpcnR5KSByZXR1cm47XG5cbiAgICBpZiAoIWJsb2NrKSB7XG4gICAgICBibG9jayA9IHByb3BzXG4gICAgICBwcm9wcyA9IHt9XG4gICAgfVxuXG4gICAgdXBkYXRlQ2FtZXJhKHByb3BzKVxuICAgIGluamVjdENvbnRleHQoYmxvY2spXG4gICAgY2FtZXJhU3RhdGUuZGlydHkgPSBmYWxzZTtcbiAgfVxuXG4gIE9iamVjdC5rZXlzKGNhbWVyYVN0YXRlKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgc2V0dXBDYW1lcmFbbmFtZV0gPSBjYW1lcmFTdGF0ZVtuYW1lXVxuICB9KVxuXG4gIHJldHVybiBzZXR1cENhbWVyYVxufVxuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsLmNyZWF0ZVJFR0wgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbnZhciBpc1R5cGVkQXJyYXkgPSBmdW5jdGlvbiAoeCkge1xuICByZXR1cm4gKFxuICAgIHggaW5zdGFuY2VvZiBVaW50OEFycmF5IHx8XG4gICAgeCBpbnN0YW5jZW9mIFVpbnQxNkFycmF5IHx8XG4gICAgeCBpbnN0YW5jZW9mIFVpbnQzMkFycmF5IHx8XG4gICAgeCBpbnN0YW5jZW9mIEludDhBcnJheSB8fFxuICAgIHggaW5zdGFuY2VvZiBJbnQxNkFycmF5IHx8XG4gICAgeCBpbnN0YW5jZW9mIEludDMyQXJyYXkgfHxcbiAgICB4IGluc3RhbmNlb2YgRmxvYXQzMkFycmF5IHx8XG4gICAgeCBpbnN0YW5jZW9mIEZsb2F0NjRBcnJheSB8fFxuICAgIHggaW5zdGFuY2VvZiBVaW50OENsYW1wZWRBcnJheVxuICApXG59O1xuXG52YXIgZXh0ZW5kID0gZnVuY3Rpb24gKGJhc2UsIG9wdHMpIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvcHRzKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgYmFzZVtrZXlzW2ldXSA9IG9wdHNba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIGJhc2Vcbn07XG5cbi8vIEVycm9yIGNoZWNraW5nIGFuZCBwYXJhbWV0ZXIgdmFsaWRhdGlvbi5cbi8vXG4vLyBTdGF0ZW1lbnRzIGZvciB0aGUgZm9ybSBgY2hlY2suc29tZVByb2NlZHVyZSguLi4pYCBnZXQgcmVtb3ZlZCBieVxuLy8gYSBicm93c2VyaWZ5IHRyYW5zZm9ybSBmb3Igb3B0aW1pemVkL21pbmlmaWVkIGJ1bmRsZXMuXG4vL1xuLyogZ2xvYmFscyBhdG9iICovXG52YXIgZW5kbCA9ICdcXG4nO1xuXG4vLyBvbmx5IHVzZWQgZm9yIGV4dHJhY3Rpbmcgc2hhZGVyIG5hbWVzLiAgaWYgYXRvYiBub3QgcHJlc2VudCwgdGhlbiBlcnJvcnNcbi8vIHdpbGwgYmUgc2xpZ2h0bHkgY3JhcHBpZXJcbmZ1bmN0aW9uIGRlY29kZUI2NCAoc3RyKSB7XG4gIGlmICh0eXBlb2YgYXRvYiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gYXRvYihzdHIpXG4gIH1cbiAgcmV0dXJuICdiYXNlNjQ6JyArIHN0clxufVxuXG5mdW5jdGlvbiByYWlzZSAobWVzc2FnZSkge1xuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoJyhyZWdsKSAnICsgbWVzc2FnZSk7XG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICB0aHJvdyBlcnJvclxufVxuXG5mdW5jdGlvbiBjaGVjayAocHJlZCwgbWVzc2FnZSkge1xuICBpZiAoIXByZWQpIHtcbiAgICByYWlzZShtZXNzYWdlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBlbmNvbG9uIChtZXNzYWdlKSB7XG4gIGlmIChtZXNzYWdlKSB7XG4gICAgcmV0dXJuICc6ICcgKyBtZXNzYWdlXG4gIH1cbiAgcmV0dXJuICcnXG59XG5cbmZ1bmN0aW9uIGNoZWNrUGFyYW1ldGVyIChwYXJhbSwgcG9zc2liaWxpdGllcywgbWVzc2FnZSkge1xuICBpZiAoIShwYXJhbSBpbiBwb3NzaWJpbGl0aWVzKSkge1xuICAgIHJhaXNlKCd1bmtub3duIHBhcmFtZXRlciAoJyArIHBhcmFtICsgJyknICsgZW5jb2xvbihtZXNzYWdlKSArXG4gICAgICAgICAgJy4gcG9zc2libGUgdmFsdWVzOiAnICsgT2JqZWN0LmtleXMocG9zc2liaWxpdGllcykuam9pbigpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja0lzVHlwZWRBcnJheSAoZGF0YSwgbWVzc2FnZSkge1xuICBpZiAoIWlzVHlwZWRBcnJheShkYXRhKSkge1xuICAgIHJhaXNlKFxuICAgICAgJ2ludmFsaWQgcGFyYW1ldGVyIHR5cGUnICsgZW5jb2xvbihtZXNzYWdlKSArXG4gICAgICAnLiBtdXN0IGJlIGEgdHlwZWQgYXJyYXknKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja1R5cGVPZiAodmFsdWUsIHR5cGUsIG1lc3NhZ2UpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gdHlwZSkge1xuICAgIHJhaXNlKFxuICAgICAgJ2ludmFsaWQgcGFyYW1ldGVyIHR5cGUnICsgZW5jb2xvbihtZXNzYWdlKSArXG4gICAgICAnLiBleHBlY3RlZCAnICsgdHlwZSArICcsIGdvdCAnICsgKHR5cGVvZiB2YWx1ZSkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrTm9uTmVnYXRpdmVJbnQgKHZhbHVlLCBtZXNzYWdlKSB7XG4gIGlmICghKCh2YWx1ZSA+PSAwKSAmJlxuICAgICAgICAoKHZhbHVlIHwgMCkgPT09IHZhbHVlKSkpIHtcbiAgICByYWlzZSgnaW52YWxpZCBwYXJhbWV0ZXIgdHlwZSwgKCcgKyB2YWx1ZSArICcpJyArIGVuY29sb24obWVzc2FnZSkgK1xuICAgICAgICAgICcuIG11c3QgYmUgYSBub25uZWdhdGl2ZSBpbnRlZ2VyJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tPbmVPZiAodmFsdWUsIGxpc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKGxpc3QuaW5kZXhPZih2YWx1ZSkgPCAwKSB7XG4gICAgcmFpc2UoJ2ludmFsaWQgdmFsdWUnICsgZW5jb2xvbihtZXNzYWdlKSArICcuIG11c3QgYmUgb25lIG9mOiAnICsgbGlzdCk7XG4gIH1cbn1cblxudmFyIGNvbnN0cnVjdG9yS2V5cyA9IFtcbiAgJ2dsJyxcbiAgJ2NhbnZhcycsXG4gICdjb250YWluZXInLFxuICAnYXR0cmlidXRlcycsXG4gICdwaXhlbFJhdGlvJyxcbiAgJ2V4dGVuc2lvbnMnLFxuICAnb3B0aW9uYWxFeHRlbnNpb25zJyxcbiAgJ3Byb2ZpbGUnLFxuICAnb25Eb25lJ1xuXTtcblxuZnVuY3Rpb24gY2hlY2tDb25zdHJ1Y3RvciAob2JqKSB7XG4gIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKGNvbnN0cnVjdG9yS2V5cy5pbmRleE9mKGtleSkgPCAwKSB7XG4gICAgICByYWlzZSgnaW52YWxpZCByZWdsIGNvbnN0cnVjdG9yIGFyZ3VtZW50IFwiJyArIGtleSArICdcIi4gbXVzdCBiZSBvbmUgb2YgJyArIGNvbnN0cnVjdG9yS2V5cyk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gbGVmdFBhZCAoc3RyLCBuKSB7XG4gIHN0ciA9IHN0ciArICcnO1xuICB3aGlsZSAoc3RyLmxlbmd0aCA8IG4pIHtcbiAgICBzdHIgPSAnICcgKyBzdHI7XG4gIH1cbiAgcmV0dXJuIHN0clxufVxuXG5mdW5jdGlvbiBTaGFkZXJGaWxlICgpIHtcbiAgdGhpcy5uYW1lID0gJ3Vua25vd24nO1xuICB0aGlzLmxpbmVzID0gW107XG4gIHRoaXMuaW5kZXggPSB7fTtcbiAgdGhpcy5oYXNFcnJvcnMgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gU2hhZGVyTGluZSAobnVtYmVyLCBsaW5lKSB7XG4gIHRoaXMubnVtYmVyID0gbnVtYmVyO1xuICB0aGlzLmxpbmUgPSBsaW5lO1xuICB0aGlzLmVycm9ycyA9IFtdO1xufVxuXG5mdW5jdGlvbiBTaGFkZXJFcnJvciAoZmlsZU51bWJlciwgbGluZU51bWJlciwgbWVzc2FnZSkge1xuICB0aGlzLmZpbGUgPSBmaWxlTnVtYmVyO1xuICB0aGlzLmxpbmUgPSBsaW5lTnVtYmVyO1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5mdW5jdGlvbiBndWVzc0NvbW1hbmQgKCkge1xuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoKTtcbiAgdmFyIHN0YWNrID0gKGVycm9yLnN0YWNrIHx8IGVycm9yKS50b1N0cmluZygpO1xuICB2YXIgcGF0ID0gL2NvbXBpbGVQcm9jZWR1cmUuKlxcblxccyphdC4qXFwoKC4qKVxcKS8uZXhlYyhzdGFjayk7XG4gIGlmIChwYXQpIHtcbiAgICByZXR1cm4gcGF0WzFdXG4gIH1cbiAgdmFyIHBhdDIgPSAvY29tcGlsZVByb2NlZHVyZS4qXFxuXFxzKmF0XFxzKyguKikoXFxufCQpLy5leGVjKHN0YWNrKTtcbiAgaWYgKHBhdDIpIHtcbiAgICByZXR1cm4gcGF0MlsxXVxuICB9XG4gIHJldHVybiAndW5rbm93bidcbn1cblxuZnVuY3Rpb24gZ3Vlc3NDYWxsU2l0ZSAoKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcigpO1xuICB2YXIgc3RhY2sgPSAoZXJyb3Iuc3RhY2sgfHwgZXJyb3IpLnRvU3RyaW5nKCk7XG4gIHZhciBwYXQgPSAvYXQgUkVHTENvbW1hbmQuKlxcblxccythdC4qXFwoKC4qKVxcKS8uZXhlYyhzdGFjayk7XG4gIGlmIChwYXQpIHtcbiAgICByZXR1cm4gcGF0WzFdXG4gIH1cbiAgdmFyIHBhdDIgPSAvYXQgUkVHTENvbW1hbmQuKlxcblxccythdFxccysoLiopXFxuLy5leGVjKHN0YWNrKTtcbiAgaWYgKHBhdDIpIHtcbiAgICByZXR1cm4gcGF0MlsxXVxuICB9XG4gIHJldHVybiAndW5rbm93bidcbn1cblxuZnVuY3Rpb24gcGFyc2VTb3VyY2UgKHNvdXJjZSwgY29tbWFuZCkge1xuICB2YXIgbGluZXMgPSBzb3VyY2Uuc3BsaXQoJ1xcbicpO1xuICB2YXIgbGluZU51bWJlciA9IDE7XG4gIHZhciBmaWxlTnVtYmVyID0gMDtcbiAgdmFyIGZpbGVzID0ge1xuICAgIHVua25vd246IG5ldyBTaGFkZXJGaWxlKCksXG4gICAgMDogbmV3IFNoYWRlckZpbGUoKVxuICB9O1xuICBmaWxlcy51bmtub3duLm5hbWUgPSBmaWxlc1swXS5uYW1lID0gY29tbWFuZCB8fCBndWVzc0NvbW1hbmQoKTtcbiAgZmlsZXMudW5rbm93bi5saW5lcy5wdXNoKG5ldyBTaGFkZXJMaW5lKDAsICcnKSk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgbGluZSA9IGxpbmVzW2ldO1xuICAgIHZhciBwYXJ0cyA9IC9eXFxzKlxcI1xccyooXFx3KylcXHMrKC4rKVxccyokLy5leGVjKGxpbmUpO1xuICAgIGlmIChwYXJ0cykge1xuICAgICAgc3dpdGNoIChwYXJ0c1sxXSkge1xuICAgICAgICBjYXNlICdsaW5lJzpcbiAgICAgICAgICB2YXIgbGluZU51bWJlckluZm8gPSAvKFxcZCspKFxccytcXGQrKT8vLmV4ZWMocGFydHNbMl0pO1xuICAgICAgICAgIGlmIChsaW5lTnVtYmVySW5mbykge1xuICAgICAgICAgICAgbGluZU51bWJlciA9IGxpbmVOdW1iZXJJbmZvWzFdIHwgMDtcbiAgICAgICAgICAgIGlmIChsaW5lTnVtYmVySW5mb1syXSkge1xuICAgICAgICAgICAgICBmaWxlTnVtYmVyID0gbGluZU51bWJlckluZm9bMl0gfCAwO1xuICAgICAgICAgICAgICBpZiAoIShmaWxlTnVtYmVyIGluIGZpbGVzKSkge1xuICAgICAgICAgICAgICAgIGZpbGVzW2ZpbGVOdW1iZXJdID0gbmV3IFNoYWRlckZpbGUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdkZWZpbmUnOlxuICAgICAgICAgIHZhciBuYW1lSW5mbyA9IC9TSEFERVJfTkFNRShfQjY0KT9cXHMrKC4qKSQvLmV4ZWMocGFydHNbMl0pO1xuICAgICAgICAgIGlmIChuYW1lSW5mbykge1xuICAgICAgICAgICAgZmlsZXNbZmlsZU51bWJlcl0ubmFtZSA9IChuYW1lSW5mb1sxXVxuICAgICAgICAgICAgICAgID8gZGVjb2RlQjY0KG5hbWVJbmZvWzJdKVxuICAgICAgICAgICAgICAgIDogbmFtZUluZm9bMl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICBmaWxlc1tmaWxlTnVtYmVyXS5saW5lcy5wdXNoKG5ldyBTaGFkZXJMaW5lKGxpbmVOdW1iZXIrKywgbGluZSkpO1xuICB9XG4gIE9iamVjdC5rZXlzKGZpbGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlTnVtYmVyKSB7XG4gICAgdmFyIGZpbGUgPSBmaWxlc1tmaWxlTnVtYmVyXTtcbiAgICBmaWxlLmxpbmVzLmZvckVhY2goZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgIGZpbGUuaW5kZXhbbGluZS5udW1iZXJdID0gbGluZTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBmaWxlc1xufVxuXG5mdW5jdGlvbiBwYXJzZUVycm9yTG9nIChlcnJMb2cpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBlcnJMb2cuc3BsaXQoJ1xcbicpLmZvckVhY2goZnVuY3Rpb24gKGVyck1zZykge1xuICAgIGlmIChlcnJNc2cubGVuZ3RoIDwgNSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHZhciBwYXJ0cyA9IC9eRVJST1JcXDpcXHMrKFxcZCspXFw6KFxcZCspXFw6XFxzKiguKikkLy5leGVjKGVyck1zZyk7XG4gICAgaWYgKHBhcnRzKSB7XG4gICAgICByZXN1bHQucHVzaChuZXcgU2hhZGVyRXJyb3IoXG4gICAgICAgIHBhcnRzWzFdIHwgMCxcbiAgICAgICAgcGFydHNbMl0gfCAwLFxuICAgICAgICBwYXJ0c1szXS50cmltKCkpKTtcbiAgICB9IGVsc2UgaWYgKGVyck1zZy5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQucHVzaChuZXcgU2hhZGVyRXJyb3IoJ3Vua25vd24nLCAwLCBlcnJNc2cpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIGFubm90YXRlRmlsZXMgKGZpbGVzLCBlcnJvcnMpIHtcbiAgZXJyb3JzLmZvckVhY2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgdmFyIGZpbGUgPSBmaWxlc1tlcnJvci5maWxlXTtcbiAgICBpZiAoZmlsZSkge1xuICAgICAgdmFyIGxpbmUgPSBmaWxlLmluZGV4W2Vycm9yLmxpbmVdO1xuICAgICAgaWYgKGxpbmUpIHtcbiAgICAgICAgbGluZS5lcnJvcnMucHVzaChlcnJvcik7XG4gICAgICAgIGZpbGUuaGFzRXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuICAgIGZpbGVzLnVua25vd24uaGFzRXJyb3JzID0gdHJ1ZTtcbiAgICBmaWxlcy51bmtub3duLmxpbmVzWzBdLmVycm9ycy5wdXNoKGVycm9yKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrU2hhZGVyRXJyb3IgKGdsLCBzaGFkZXIsIHNvdXJjZSwgdHlwZSwgY29tbWFuZCkge1xuICBpZiAoIWdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgIHZhciBlcnJMb2cgPSBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcik7XG4gICAgdmFyIHR5cGVOYW1lID0gdHlwZSA9PT0gZ2wuRlJBR01FTlRfU0hBREVSID8gJ2ZyYWdtZW50JyA6ICd2ZXJ0ZXgnO1xuICAgIGNoZWNrQ29tbWFuZFR5cGUoc291cmNlLCAnc3RyaW5nJywgdHlwZU5hbWUgKyAnIHNoYWRlciBzb3VyY2UgbXVzdCBiZSBhIHN0cmluZycsIGNvbW1hbmQpO1xuICAgIHZhciBmaWxlcyA9IHBhcnNlU291cmNlKHNvdXJjZSwgY29tbWFuZCk7XG4gICAgdmFyIGVycm9ycyA9IHBhcnNlRXJyb3JMb2coZXJyTG9nKTtcbiAgICBhbm5vdGF0ZUZpbGVzKGZpbGVzLCBlcnJvcnMpO1xuXG4gICAgT2JqZWN0LmtleXMoZmlsZXMpLmZvckVhY2goZnVuY3Rpb24gKGZpbGVOdW1iZXIpIHtcbiAgICAgIHZhciBmaWxlID0gZmlsZXNbZmlsZU51bWJlcl07XG4gICAgICBpZiAoIWZpbGUuaGFzRXJyb3JzKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB2YXIgc3RyaW5ncyA9IFsnJ107XG4gICAgICB2YXIgc3R5bGVzID0gWycnXTtcblxuICAgICAgZnVuY3Rpb24gcHVzaCAoc3RyLCBzdHlsZSkge1xuICAgICAgICBzdHJpbmdzLnB1c2goc3RyKTtcbiAgICAgICAgc3R5bGVzLnB1c2goc3R5bGUgfHwgJycpO1xuICAgICAgfVxuXG4gICAgICBwdXNoKCdmaWxlIG51bWJlciAnICsgZmlsZU51bWJlciArICc6ICcgKyBmaWxlLm5hbWUgKyAnXFxuJywgJ2NvbG9yOnJlZDt0ZXh0LWRlY29yYXRpb246dW5kZXJsaW5lO2ZvbnQtd2VpZ2h0OmJvbGQnKTtcblxuICAgICAgZmlsZS5saW5lcy5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgICAgIGlmIChsaW5lLmVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcHVzaChsZWZ0UGFkKGxpbmUubnVtYmVyLCA0KSArICd8ICAnLCAnYmFja2dyb3VuZC1jb2xvcjp5ZWxsb3c7IGZvbnQtd2VpZ2h0OmJvbGQnKTtcbiAgICAgICAgICBwdXNoKGxpbmUubGluZSArIGVuZGwsICdjb2xvcjpyZWQ7IGJhY2tncm91bmQtY29sb3I6eWVsbG93OyBmb250LXdlaWdodDpib2xkJyk7XG5cbiAgICAgICAgICAvLyB0cnkgdG8gZ3Vlc3MgdG9rZW5cbiAgICAgICAgICB2YXIgb2Zmc2V0ID0gMDtcbiAgICAgICAgICBsaW5lLmVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgICAgICAgdmFyIHRva2VuID0gL15cXHMqXFwnKC4qKVxcJ1xccypcXDpcXHMqKC4qKSQvLmV4ZWMobWVzc2FnZSk7XG4gICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgdmFyIHRva2VuUGF0ID0gdG9rZW5bMV07XG4gICAgICAgICAgICAgIG1lc3NhZ2UgPSB0b2tlblsyXTtcbiAgICAgICAgICAgICAgc3dpdGNoICh0b2tlblBhdCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Fzc2lnbic6XG4gICAgICAgICAgICAgICAgICB0b2tlblBhdCA9ICc9JztcbiAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb2Zmc2V0ID0gTWF0aC5tYXgobGluZS5saW5lLmluZGV4T2YodG9rZW5QYXQsIG9mZnNldCksIDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgb2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcHVzaChsZWZ0UGFkKCd8ICcsIDYpKTtcbiAgICAgICAgICAgIHB1c2gobGVmdFBhZCgnXl5eJywgb2Zmc2V0ICsgMykgKyBlbmRsLCAnZm9udC13ZWlnaHQ6Ym9sZCcpO1xuICAgICAgICAgICAgcHVzaChsZWZ0UGFkKCd8ICcsIDYpKTtcbiAgICAgICAgICAgIHB1c2gobWVzc2FnZSArIGVuZGwsICdmb250LXdlaWdodDpib2xkJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcHVzaChsZWZ0UGFkKCd8ICcsIDYpICsgZW5kbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHVzaChsZWZ0UGFkKGxpbmUubnVtYmVyLCA0KSArICd8ICAnKTtcbiAgICAgICAgICBwdXNoKGxpbmUubGluZSArIGVuZGwsICdjb2xvcjpyZWQnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiAhd2luZG93LmNocm9tZSkge1xuICAgICAgICBzdHlsZXNbMF0gPSBzdHJpbmdzLmpvaW4oJyVjJyk7XG4gICAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIHN0eWxlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhzdHJpbmdzLmpvaW4oJycpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNoZWNrLnJhaXNlKCdFcnJvciBjb21waWxpbmcgJyArIHR5cGVOYW1lICsgJyBzaGFkZXIsICcgKyBmaWxlc1swXS5uYW1lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja0xpbmtFcnJvciAoZ2wsIHByb2dyYW0sIGZyYWdTaGFkZXIsIHZlcnRTaGFkZXIsIGNvbW1hbmQpIHtcbiAgaWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIGdsLkxJTktfU1RBVFVTKSkge1xuICAgIHZhciBlcnJMb2cgPSBnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKTtcbiAgICB2YXIgZnJhZ1BhcnNlID0gcGFyc2VTb3VyY2UoZnJhZ1NoYWRlciwgY29tbWFuZCk7XG4gICAgdmFyIHZlcnRQYXJzZSA9IHBhcnNlU291cmNlKHZlcnRTaGFkZXIsIGNvbW1hbmQpO1xuXG4gICAgdmFyIGhlYWRlciA9ICdFcnJvciBsaW5raW5nIHByb2dyYW0gd2l0aCB2ZXJ0ZXggc2hhZGVyLCBcIicgK1xuICAgICAgdmVydFBhcnNlWzBdLm5hbWUgKyAnXCIsIGFuZCBmcmFnbWVudCBzaGFkZXIgXCInICsgZnJhZ1BhcnNlWzBdLm5hbWUgKyAnXCInO1xuXG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclYycgKyBoZWFkZXIgKyBlbmRsICsgJyVjJyArIGVyckxvZyxcbiAgICAgICAgJ2NvbG9yOnJlZDt0ZXh0LWRlY29yYXRpb246dW5kZXJsaW5lO2ZvbnQtd2VpZ2h0OmJvbGQnLFxuICAgICAgICAnY29sb3I6cmVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKGhlYWRlciArIGVuZGwgKyBlcnJMb2cpO1xuICAgIH1cbiAgICBjaGVjay5yYWlzZShoZWFkZXIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNhdmVDb21tYW5kUmVmIChvYmplY3QpIHtcbiAgb2JqZWN0Ll9jb21tYW5kUmVmID0gZ3Vlc3NDb21tYW5kKCk7XG59XG5cbmZ1bmN0aW9uIHNhdmVEcmF3Q29tbWFuZEluZm8gKG9wdHMsIHVuaWZvcm1zLCBhdHRyaWJ1dGVzLCBzdHJpbmdTdG9yZSkge1xuICBzYXZlQ29tbWFuZFJlZihvcHRzKTtcblxuICBmdW5jdGlvbiBpZCAoc3RyKSB7XG4gICAgaWYgKHN0cikge1xuICAgICAgcmV0dXJuIHN0cmluZ1N0b3JlLmlkKHN0cilcbiAgICB9XG4gICAgcmV0dXJuIDBcbiAgfVxuICBvcHRzLl9mcmFnSWQgPSBpZChvcHRzLnN0YXRpYy5mcmFnKTtcbiAgb3B0cy5fdmVydElkID0gaWQob3B0cy5zdGF0aWMudmVydCk7XG5cbiAgZnVuY3Rpb24gYWRkUHJvcHMgKGRpY3QsIHNldCkge1xuICAgIE9iamVjdC5rZXlzKHNldCkuZm9yRWFjaChmdW5jdGlvbiAodSkge1xuICAgICAgZGljdFtzdHJpbmdTdG9yZS5pZCh1KV0gPSB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIHVuaWZvcm1TZXQgPSBvcHRzLl91bmlmb3JtU2V0ID0ge307XG4gIGFkZFByb3BzKHVuaWZvcm1TZXQsIHVuaWZvcm1zLnN0YXRpYyk7XG4gIGFkZFByb3BzKHVuaWZvcm1TZXQsIHVuaWZvcm1zLmR5bmFtaWMpO1xuXG4gIHZhciBhdHRyaWJ1dGVTZXQgPSBvcHRzLl9hdHRyaWJ1dGVTZXQgPSB7fTtcbiAgYWRkUHJvcHMoYXR0cmlidXRlU2V0LCBhdHRyaWJ1dGVzLnN0YXRpYyk7XG4gIGFkZFByb3BzKGF0dHJpYnV0ZVNldCwgYXR0cmlidXRlcy5keW5hbWljKTtcblxuICBvcHRzLl9oYXNDb3VudCA9IChcbiAgICAnY291bnQnIGluIG9wdHMuc3RhdGljIHx8XG4gICAgJ2NvdW50JyBpbiBvcHRzLmR5bmFtaWMgfHxcbiAgICAnZWxlbWVudHMnIGluIG9wdHMuc3RhdGljIHx8XG4gICAgJ2VsZW1lbnRzJyBpbiBvcHRzLmR5bmFtaWMpO1xufVxuXG5mdW5jdGlvbiBjb21tYW5kUmFpc2UgKG1lc3NhZ2UsIGNvbW1hbmQpIHtcbiAgdmFyIGNhbGxTaXRlID0gZ3Vlc3NDYWxsU2l0ZSgpO1xuICByYWlzZShtZXNzYWdlICtcbiAgICAnIGluIGNvbW1hbmQgJyArIChjb21tYW5kIHx8IGd1ZXNzQ29tbWFuZCgpKSArXG4gICAgKGNhbGxTaXRlID09PSAndW5rbm93bicgPyAnJyA6ICcgY2FsbGVkIGZyb20gJyArIGNhbGxTaXRlKSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrQ29tbWFuZCAocHJlZCwgbWVzc2FnZSwgY29tbWFuZCkge1xuICBpZiAoIXByZWQpIHtcbiAgICBjb21tYW5kUmFpc2UobWVzc2FnZSwgY29tbWFuZCB8fCBndWVzc0NvbW1hbmQoKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tQYXJhbWV0ZXJDb21tYW5kIChwYXJhbSwgcG9zc2liaWxpdGllcywgbWVzc2FnZSwgY29tbWFuZCkge1xuICBpZiAoIShwYXJhbSBpbiBwb3NzaWJpbGl0aWVzKSkge1xuICAgIGNvbW1hbmRSYWlzZShcbiAgICAgICd1bmtub3duIHBhcmFtZXRlciAoJyArIHBhcmFtICsgJyknICsgZW5jb2xvbihtZXNzYWdlKSArXG4gICAgICAnLiBwb3NzaWJsZSB2YWx1ZXM6ICcgKyBPYmplY3Qua2V5cyhwb3NzaWJpbGl0aWVzKS5qb2luKCksXG4gICAgICBjb21tYW5kIHx8IGd1ZXNzQ29tbWFuZCgpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja0NvbW1hbmRUeXBlICh2YWx1ZSwgdHlwZSwgbWVzc2FnZSwgY29tbWFuZCkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSB0eXBlKSB7XG4gICAgY29tbWFuZFJhaXNlKFxuICAgICAgJ2ludmFsaWQgcGFyYW1ldGVyIHR5cGUnICsgZW5jb2xvbihtZXNzYWdlKSArXG4gICAgICAnLiBleHBlY3RlZCAnICsgdHlwZSArICcsIGdvdCAnICsgKHR5cGVvZiB2YWx1ZSksXG4gICAgICBjb21tYW5kIHx8IGd1ZXNzQ29tbWFuZCgpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja09wdGlvbmFsIChibG9jaykge1xuICBibG9jaygpO1xufVxuXG5mdW5jdGlvbiBjaGVja0ZyYW1lYnVmZmVyRm9ybWF0IChhdHRhY2htZW50LCB0ZXhGb3JtYXRzLCByYkZvcm1hdHMpIHtcbiAgaWYgKGF0dGFjaG1lbnQudGV4dHVyZSkge1xuICAgIGNoZWNrT25lT2YoXG4gICAgICBhdHRhY2htZW50LnRleHR1cmUuX3RleHR1cmUuaW50ZXJuYWxmb3JtYXQsXG4gICAgICB0ZXhGb3JtYXRzLFxuICAgICAgJ3Vuc3VwcG9ydGVkIHRleHR1cmUgZm9ybWF0IGZvciBhdHRhY2htZW50Jyk7XG4gIH0gZWxzZSB7XG4gICAgY2hlY2tPbmVPZihcbiAgICAgIGF0dGFjaG1lbnQucmVuZGVyYnVmZmVyLl9yZW5kZXJidWZmZXIuZm9ybWF0LFxuICAgICAgcmJGb3JtYXRzLFxuICAgICAgJ3Vuc3VwcG9ydGVkIHJlbmRlcmJ1ZmZlciBmb3JtYXQgZm9yIGF0dGFjaG1lbnQnKTtcbiAgfVxufVxuXG52YXIgR0xfQ0xBTVBfVE9fRURHRSA9IDB4ODEyRjtcblxudmFyIEdMX05FQVJFU1QgPSAweDI2MDA7XG52YXIgR0xfTkVBUkVTVF9NSVBNQVBfTkVBUkVTVCA9IDB4MjcwMDtcbnZhciBHTF9MSU5FQVJfTUlQTUFQX05FQVJFU1QgPSAweDI3MDE7XG52YXIgR0xfTkVBUkVTVF9NSVBNQVBfTElORUFSID0gMHgyNzAyO1xudmFyIEdMX0xJTkVBUl9NSVBNQVBfTElORUFSID0gMHgyNzAzO1xuXG52YXIgR0xfQllURSA9IDUxMjA7XG52YXIgR0xfVU5TSUdORURfQllURSA9IDUxMjE7XG52YXIgR0xfU0hPUlQgPSA1MTIyO1xudmFyIEdMX1VOU0lHTkVEX1NIT1JUID0gNTEyMztcbnZhciBHTF9JTlQgPSA1MTI0O1xudmFyIEdMX1VOU0lHTkVEX0lOVCA9IDUxMjU7XG52YXIgR0xfRkxPQVQgPSA1MTI2O1xuXG52YXIgR0xfVU5TSUdORURfU0hPUlRfNF80XzRfNCA9IDB4ODAzMztcbnZhciBHTF9VTlNJR05FRF9TSE9SVF81XzVfNV8xID0gMHg4MDM0O1xudmFyIEdMX1VOU0lHTkVEX1NIT1JUXzVfNl81ID0gMHg4MzYzO1xudmFyIEdMX1VOU0lHTkVEX0lOVF8yNF84X1dFQkdMID0gMHg4NEZBO1xuXG52YXIgR0xfSEFMRl9GTE9BVF9PRVMgPSAweDhENjE7XG5cbnZhciBUWVBFX1NJWkUgPSB7fTtcblxuVFlQRV9TSVpFW0dMX0JZVEVdID1cblRZUEVfU0laRVtHTF9VTlNJR05FRF9CWVRFXSA9IDE7XG5cblRZUEVfU0laRVtHTF9TSE9SVF0gPVxuVFlQRV9TSVpFW0dMX1VOU0lHTkVEX1NIT1JUXSA9XG5UWVBFX1NJWkVbR0xfSEFMRl9GTE9BVF9PRVNdID1cblRZUEVfU0laRVtHTF9VTlNJR05FRF9TSE9SVF81XzZfNV0gPVxuVFlQRV9TSVpFW0dMX1VOU0lHTkVEX1NIT1JUXzRfNF80XzRdID1cblRZUEVfU0laRVtHTF9VTlNJR05FRF9TSE9SVF81XzVfNV8xXSA9IDI7XG5cblRZUEVfU0laRVtHTF9JTlRdID1cblRZUEVfU0laRVtHTF9VTlNJR05FRF9JTlRdID1cblRZUEVfU0laRVtHTF9GTE9BVF0gPVxuVFlQRV9TSVpFW0dMX1VOU0lHTkVEX0lOVF8yNF84X1dFQkdMXSA9IDQ7XG5cbmZ1bmN0aW9uIHBpeGVsU2l6ZSAodHlwZSwgY2hhbm5lbHMpIHtcbiAgaWYgKHR5cGUgPT09IEdMX1VOU0lHTkVEX1NIT1JUXzVfNV81XzEgfHxcbiAgICAgIHR5cGUgPT09IEdMX1VOU0lHTkVEX1NIT1JUXzRfNF80XzQgfHxcbiAgICAgIHR5cGUgPT09IEdMX1VOU0lHTkVEX1NIT1JUXzVfNl81KSB7XG4gICAgcmV0dXJuIDJcbiAgfSBlbHNlIGlmICh0eXBlID09PSBHTF9VTlNJR05FRF9JTlRfMjRfOF9XRUJHTCkge1xuICAgIHJldHVybiA0XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFRZUEVfU0laRVt0eXBlXSAqIGNoYW5uZWxzXG4gIH1cbn1cblxuZnVuY3Rpb24gaXNQb3cyICh2KSB7XG4gIHJldHVybiAhKHYgJiAodiAtIDEpKSAmJiAoISF2KVxufVxuXG5mdW5jdGlvbiBjaGVja1RleHR1cmUyRCAoaW5mbywgbWlwRGF0YSwgbGltaXRzKSB7XG4gIHZhciBpO1xuICB2YXIgdyA9IG1pcERhdGEud2lkdGg7XG4gIHZhciBoID0gbWlwRGF0YS5oZWlnaHQ7XG4gIHZhciBjID0gbWlwRGF0YS5jaGFubmVscztcblxuICAvLyBDaGVjayB0ZXh0dXJlIHNoYXBlXG4gIGNoZWNrKHcgPiAwICYmIHcgPD0gbGltaXRzLm1heFRleHR1cmVTaXplICYmXG4gICAgICAgIGggPiAwICYmIGggPD0gbGltaXRzLm1heFRleHR1cmVTaXplLFxuICAgICAgICAnaW52YWxpZCB0ZXh0dXJlIHNoYXBlJyk7XG5cbiAgLy8gY2hlY2sgd3JhcCBtb2RlXG4gIGlmIChpbmZvLndyYXBTICE9PSBHTF9DTEFNUF9UT19FREdFIHx8IGluZm8ud3JhcFQgIT09IEdMX0NMQU1QX1RPX0VER0UpIHtcbiAgICBjaGVjayhpc1BvdzIodykgJiYgaXNQb3cyKGgpLFxuICAgICAgJ2luY29tcGF0aWJsZSB3cmFwIG1vZGUgZm9yIHRleHR1cmUsIGJvdGggd2lkdGggYW5kIGhlaWdodCBtdXN0IGJlIHBvd2VyIG9mIDInKTtcbiAgfVxuXG4gIGlmIChtaXBEYXRhLm1pcG1hc2sgPT09IDEpIHtcbiAgICBpZiAodyAhPT0gMSAmJiBoICE9PSAxKSB7XG4gICAgICBjaGVjayhcbiAgICAgICAgaW5mby5taW5GaWx0ZXIgIT09IEdMX05FQVJFU1RfTUlQTUFQX05FQVJFU1QgJiZcbiAgICAgICAgaW5mby5taW5GaWx0ZXIgIT09IEdMX05FQVJFU1RfTUlQTUFQX0xJTkVBUiAmJlxuICAgICAgICBpbmZvLm1pbkZpbHRlciAhPT0gR0xfTElORUFSX01JUE1BUF9ORUFSRVNUICYmXG4gICAgICAgIGluZm8ubWluRmlsdGVyICE9PSBHTF9MSU5FQVJfTUlQTUFQX0xJTkVBUixcbiAgICAgICAgJ21pbiBmaWx0ZXIgcmVxdWlyZXMgbWlwbWFwJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIHRleHR1cmUgbXVzdCBiZSBwb3dlciBvZiAyXG4gICAgY2hlY2soaXNQb3cyKHcpICYmIGlzUG93MihoKSxcbiAgICAgICd0ZXh0dXJlIG11c3QgYmUgYSBzcXVhcmUgcG93ZXIgb2YgMiB0byBzdXBwb3J0IG1pcG1hcHBpbmcnKTtcbiAgICBjaGVjayhtaXBEYXRhLm1pcG1hc2sgPT09ICh3IDw8IDEpIC0gMSxcbiAgICAgICdtaXNzaW5nIG9yIGluY29tcGxldGUgbWlwbWFwIGRhdGEnKTtcbiAgfVxuXG4gIGlmIChtaXBEYXRhLnR5cGUgPT09IEdMX0ZMT0FUKSB7XG4gICAgaWYgKGxpbWl0cy5leHRlbnNpb25zLmluZGV4T2YoJ29lc190ZXh0dXJlX2Zsb2F0X2xpbmVhcicpIDwgMCkge1xuICAgICAgY2hlY2soaW5mby5taW5GaWx0ZXIgPT09IEdMX05FQVJFU1QgJiYgaW5mby5tYWdGaWx0ZXIgPT09IEdMX05FQVJFU1QsXG4gICAgICAgICdmaWx0ZXIgbm90IHN1cHBvcnRlZCwgbXVzdCBlbmFibGUgb2VzX3RleHR1cmVfZmxvYXRfbGluZWFyJyk7XG4gICAgfVxuICAgIGNoZWNrKCFpbmZvLmdlbk1pcG1hcHMsXG4gICAgICAnbWlwbWFwIGdlbmVyYXRpb24gbm90IHN1cHBvcnRlZCB3aXRoIGZsb2F0IHRleHR1cmVzJyk7XG4gIH1cblxuICAvLyBjaGVjayBpbWFnZSBjb21wbGV0ZVxuICB2YXIgbWlwaW1hZ2VzID0gbWlwRGF0YS5pbWFnZXM7XG4gIGZvciAoaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgaWYgKG1pcGltYWdlc1tpXSkge1xuICAgICAgdmFyIG13ID0gdyA+PiBpO1xuICAgICAgdmFyIG1oID0gaCA+PiBpO1xuICAgICAgY2hlY2sobWlwRGF0YS5taXBtYXNrICYgKDEgPDwgaSksICdtaXNzaW5nIG1pcG1hcCBkYXRhJyk7XG5cbiAgICAgIHZhciBpbWcgPSBtaXBpbWFnZXNbaV07XG5cbiAgICAgIGNoZWNrKFxuICAgICAgICBpbWcud2lkdGggPT09IG13ICYmXG4gICAgICAgIGltZy5oZWlnaHQgPT09IG1oLFxuICAgICAgICAnaW52YWxpZCBzaGFwZSBmb3IgbWlwIGltYWdlcycpO1xuXG4gICAgICBjaGVjayhcbiAgICAgICAgaW1nLmZvcm1hdCA9PT0gbWlwRGF0YS5mb3JtYXQgJiZcbiAgICAgICAgaW1nLmludGVybmFsZm9ybWF0ID09PSBtaXBEYXRhLmludGVybmFsZm9ybWF0ICYmXG4gICAgICAgIGltZy50eXBlID09PSBtaXBEYXRhLnR5cGUsXG4gICAgICAgICdpbmNvbXBhdGlibGUgdHlwZSBmb3IgbWlwIGltYWdlJyk7XG5cbiAgICAgIGlmIChpbWcuY29tcHJlc3NlZCkge1xuICAgICAgICAvLyBUT0RPOiBjaGVjayBzaXplIGZvciBjb21wcmVzc2VkIGltYWdlc1xuICAgICAgfSBlbHNlIGlmIChpbWcuZGF0YSkge1xuICAgICAgICAvLyBjaGVjayhpbWcuZGF0YS5ieXRlTGVuZ3RoID09PSBtdyAqIG1oICpcbiAgICAgICAgLy8gTWF0aC5tYXgocGl4ZWxTaXplKGltZy50eXBlLCBjKSwgaW1nLnVucGFja0FsaWdubWVudCksXG4gICAgICAgIHZhciByb3dTaXplID0gTWF0aC5jZWlsKHBpeGVsU2l6ZShpbWcudHlwZSwgYykgKiBtdyAvIGltZy51bnBhY2tBbGlnbm1lbnQpICogaW1nLnVucGFja0FsaWdubWVudDtcbiAgICAgICAgY2hlY2soaW1nLmRhdGEuYnl0ZUxlbmd0aCA9PT0gcm93U2l6ZSAqIG1oLFxuICAgICAgICAgICdpbnZhbGlkIGRhdGEgZm9yIGltYWdlLCBidWZmZXIgc2l6ZSBpcyBpbmNvbnNpc3RlbnQgd2l0aCBpbWFnZSBmb3JtYXQnKTtcbiAgICAgIH0gZWxzZSBpZiAoaW1nLmVsZW1lbnQpIHtcbiAgICAgICAgLy8gVE9ETzogY2hlY2sgZWxlbWVudCBjYW4gYmUgbG9hZGVkXG4gICAgICB9IGVsc2UgaWYgKGltZy5jb3B5KSB7XG4gICAgICAgIC8vIFRPRE86IGNoZWNrIGNvbXBhdGlibGUgZm9ybWF0IGFuZCB0eXBlXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghaW5mby5nZW5NaXBtYXBzKSB7XG4gICAgICBjaGVjaygobWlwRGF0YS5taXBtYXNrICYgKDEgPDwgaSkpID09PSAwLCAnZXh0cmEgbWlwbWFwIGRhdGEnKTtcbiAgICB9XG4gIH1cblxuICBpZiAobWlwRGF0YS5jb21wcmVzc2VkKSB7XG4gICAgY2hlY2soIWluZm8uZ2VuTWlwbWFwcyxcbiAgICAgICdtaXBtYXAgZ2VuZXJhdGlvbiBmb3IgY29tcHJlc3NlZCBpbWFnZXMgbm90IHN1cHBvcnRlZCcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrVGV4dHVyZUN1YmUgKHRleHR1cmUsIGluZm8sIGZhY2VzLCBsaW1pdHMpIHtcbiAgdmFyIHcgPSB0ZXh0dXJlLndpZHRoO1xuICB2YXIgaCA9IHRleHR1cmUuaGVpZ2h0O1xuICB2YXIgYyA9IHRleHR1cmUuY2hhbm5lbHM7XG5cbiAgLy8gQ2hlY2sgdGV4dHVyZSBzaGFwZVxuICBjaGVjayhcbiAgICB3ID4gMCAmJiB3IDw9IGxpbWl0cy5tYXhUZXh0dXJlU2l6ZSAmJiBoID4gMCAmJiBoIDw9IGxpbWl0cy5tYXhUZXh0dXJlU2l6ZSxcbiAgICAnaW52YWxpZCB0ZXh0dXJlIHNoYXBlJyk7XG4gIGNoZWNrKFxuICAgIHcgPT09IGgsXG4gICAgJ2N1YmUgbWFwIG11c3QgYmUgc3F1YXJlJyk7XG4gIGNoZWNrKFxuICAgIGluZm8ud3JhcFMgPT09IEdMX0NMQU1QX1RPX0VER0UgJiYgaW5mby53cmFwVCA9PT0gR0xfQ0xBTVBfVE9fRURHRSxcbiAgICAnd3JhcCBtb2RlIG5vdCBzdXBwb3J0ZWQgYnkgY3ViZSBtYXAnKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZhY2VzLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIGZhY2UgPSBmYWNlc1tpXTtcbiAgICBjaGVjayhcbiAgICAgIGZhY2Uud2lkdGggPT09IHcgJiYgZmFjZS5oZWlnaHQgPT09IGgsXG4gICAgICAnaW5jb25zaXN0ZW50IGN1YmUgbWFwIGZhY2Ugc2hhcGUnKTtcblxuICAgIGlmIChpbmZvLmdlbk1pcG1hcHMpIHtcbiAgICAgIGNoZWNrKCFmYWNlLmNvbXByZXNzZWQsXG4gICAgICAgICdjYW4gbm90IGdlbmVyYXRlIG1pcG1hcCBmb3IgY29tcHJlc3NlZCB0ZXh0dXJlcycpO1xuICAgICAgY2hlY2soZmFjZS5taXBtYXNrID09PSAxLFxuICAgICAgICAnY2FuIG5vdCBzcGVjaWZ5IG1pcG1hcHMgYW5kIGdlbmVyYXRlIG1pcG1hcHMnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVE9ETzogY2hlY2sgbWlwIGFuZCBmaWx0ZXIgbW9kZVxuICAgIH1cblxuICAgIHZhciBtaXBtYXBzID0gZmFjZS5pbWFnZXM7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCAxNjsgKytqKSB7XG4gICAgICB2YXIgaW1nID0gbWlwbWFwc1tqXTtcbiAgICAgIGlmIChpbWcpIHtcbiAgICAgICAgdmFyIG13ID0gdyA+PiBqO1xuICAgICAgICB2YXIgbWggPSBoID4+IGo7XG4gICAgICAgIGNoZWNrKGZhY2UubWlwbWFzayAmICgxIDw8IGopLCAnbWlzc2luZyBtaXBtYXAgZGF0YScpO1xuICAgICAgICBjaGVjayhcbiAgICAgICAgICBpbWcud2lkdGggPT09IG13ICYmXG4gICAgICAgICAgaW1nLmhlaWdodCA9PT0gbWgsXG4gICAgICAgICAgJ2ludmFsaWQgc2hhcGUgZm9yIG1pcCBpbWFnZXMnKTtcbiAgICAgICAgY2hlY2soXG4gICAgICAgICAgaW1nLmZvcm1hdCA9PT0gdGV4dHVyZS5mb3JtYXQgJiZcbiAgICAgICAgICBpbWcuaW50ZXJuYWxmb3JtYXQgPT09IHRleHR1cmUuaW50ZXJuYWxmb3JtYXQgJiZcbiAgICAgICAgICBpbWcudHlwZSA9PT0gdGV4dHVyZS50eXBlLFxuICAgICAgICAgICdpbmNvbXBhdGlibGUgdHlwZSBmb3IgbWlwIGltYWdlJyk7XG5cbiAgICAgICAgaWYgKGltZy5jb21wcmVzc2VkKSB7XG4gICAgICAgICAgLy8gVE9ETzogY2hlY2sgc2l6ZSBmb3IgY29tcHJlc3NlZCBpbWFnZXNcbiAgICAgICAgfSBlbHNlIGlmIChpbWcuZGF0YSkge1xuICAgICAgICAgIGNoZWNrKGltZy5kYXRhLmJ5dGVMZW5ndGggPT09IG13ICogbWggKlxuICAgICAgICAgICAgTWF0aC5tYXgocGl4ZWxTaXplKGltZy50eXBlLCBjKSwgaW1nLnVucGFja0FsaWdubWVudCksXG4gICAgICAgICAgICAnaW52YWxpZCBkYXRhIGZvciBpbWFnZSwgYnVmZmVyIHNpemUgaXMgaW5jb25zaXN0ZW50IHdpdGggaW1hZ2UgZm9ybWF0Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW1nLmVsZW1lbnQpIHtcbiAgICAgICAgICAvLyBUT0RPOiBjaGVjayBlbGVtZW50IGNhbiBiZSBsb2FkZWRcbiAgICAgICAgfSBlbHNlIGlmIChpbWcuY29weSkge1xuICAgICAgICAgIC8vIFRPRE86IGNoZWNrIGNvbXBhdGlibGUgZm9ybWF0IGFuZCB0eXBlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxudmFyIGNoZWNrJDEgPSBleHRlbmQoY2hlY2ssIHtcbiAgb3B0aW9uYWw6IGNoZWNrT3B0aW9uYWwsXG4gIHJhaXNlOiByYWlzZSxcbiAgY29tbWFuZFJhaXNlOiBjb21tYW5kUmFpc2UsXG4gIGNvbW1hbmQ6IGNoZWNrQ29tbWFuZCxcbiAgcGFyYW1ldGVyOiBjaGVja1BhcmFtZXRlcixcbiAgY29tbWFuZFBhcmFtZXRlcjogY2hlY2tQYXJhbWV0ZXJDb21tYW5kLFxuICBjb25zdHJ1Y3RvcjogY2hlY2tDb25zdHJ1Y3RvcixcbiAgdHlwZTogY2hlY2tUeXBlT2YsXG4gIGNvbW1hbmRUeXBlOiBjaGVja0NvbW1hbmRUeXBlLFxuICBpc1R5cGVkQXJyYXk6IGNoZWNrSXNUeXBlZEFycmF5LFxuICBubmk6IGNoZWNrTm9uTmVnYXRpdmVJbnQsXG4gIG9uZU9mOiBjaGVja09uZU9mLFxuICBzaGFkZXJFcnJvcjogY2hlY2tTaGFkZXJFcnJvcixcbiAgbGlua0Vycm9yOiBjaGVja0xpbmtFcnJvcixcbiAgY2FsbFNpdGU6IGd1ZXNzQ2FsbFNpdGUsXG4gIHNhdmVDb21tYW5kUmVmOiBzYXZlQ29tbWFuZFJlZixcbiAgc2F2ZURyYXdJbmZvOiBzYXZlRHJhd0NvbW1hbmRJbmZvLFxuICBmcmFtZWJ1ZmZlckZvcm1hdDogY2hlY2tGcmFtZWJ1ZmZlckZvcm1hdCxcbiAgZ3Vlc3NDb21tYW5kOiBndWVzc0NvbW1hbmQsXG4gIHRleHR1cmUyRDogY2hlY2tUZXh0dXJlMkQsXG4gIHRleHR1cmVDdWJlOiBjaGVja1RleHR1cmVDdWJlXG59KTtcblxudmFyIFZBUklBQkxFX0NPVU5URVIgPSAwO1xuXG52YXIgRFlOX0ZVTkMgPSAwO1xuXG5mdW5jdGlvbiBEeW5hbWljVmFyaWFibGUgKHR5cGUsIGRhdGEpIHtcbiAgdGhpcy5pZCA9IChWQVJJQUJMRV9DT1VOVEVSKyspO1xuICB0aGlzLnR5cGUgPSB0eXBlO1xuICB0aGlzLmRhdGEgPSBkYXRhO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVTdHIgKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpXG59XG5cbmZ1bmN0aW9uIHNwbGl0UGFydHMgKHN0cikge1xuICBpZiAoc3RyLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBbXVxuICB9XG5cbiAgdmFyIGZpcnN0Q2hhciA9IHN0ci5jaGFyQXQoMCk7XG4gIHZhciBsYXN0Q2hhciA9IHN0ci5jaGFyQXQoc3RyLmxlbmd0aCAtIDEpO1xuXG4gIGlmIChzdHIubGVuZ3RoID4gMSAmJlxuICAgICAgZmlyc3RDaGFyID09PSBsYXN0Q2hhciAmJlxuICAgICAgKGZpcnN0Q2hhciA9PT0gJ1wiJyB8fCBmaXJzdENoYXIgPT09IFwiJ1wiKSkge1xuICAgIHJldHVybiBbJ1wiJyArIGVzY2FwZVN0cihzdHIuc3Vic3RyKDEsIHN0ci5sZW5ndGggLSAyKSkgKyAnXCInXVxuICB9XG5cbiAgdmFyIHBhcnRzID0gL1xcWyhmYWxzZXx0cnVlfG51bGx8XFxkK3wnW14nXSonfFwiW15cIl0qXCIpXFxdLy5leGVjKHN0cik7XG4gIGlmIChwYXJ0cykge1xuICAgIHJldHVybiAoXG4gICAgICBzcGxpdFBhcnRzKHN0ci5zdWJzdHIoMCwgcGFydHMuaW5kZXgpKVxuICAgICAgLmNvbmNhdChzcGxpdFBhcnRzKHBhcnRzWzFdKSlcbiAgICAgIC5jb25jYXQoc3BsaXRQYXJ0cyhzdHIuc3Vic3RyKHBhcnRzLmluZGV4ICsgcGFydHNbMF0ubGVuZ3RoKSkpXG4gICAgKVxuICB9XG5cbiAgdmFyIHN1YnBhcnRzID0gc3RyLnNwbGl0KCcuJyk7XG4gIGlmIChzdWJwYXJ0cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gWydcIicgKyBlc2NhcGVTdHIoc3RyKSArICdcIiddXG4gIH1cblxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3VicGFydHMubGVuZ3RoOyArK2kpIHtcbiAgICByZXN1bHQgPSByZXN1bHQuY29uY2F0KHNwbGl0UGFydHMoc3VicGFydHNbaV0pKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIHRvQWNjZXNzb3JTdHJpbmcgKHN0cikge1xuICByZXR1cm4gJ1snICsgc3BsaXRQYXJ0cyhzdHIpLmpvaW4oJ11bJykgKyAnXSdcbn1cblxuZnVuY3Rpb24gZGVmaW5lRHluYW1pYyAodHlwZSwgZGF0YSkge1xuICByZXR1cm4gbmV3IER5bmFtaWNWYXJpYWJsZSh0eXBlLCB0b0FjY2Vzc29yU3RyaW5nKGRhdGEgKyAnJykpXG59XG5cbmZ1bmN0aW9uIGlzRHluYW1pYyAoeCkge1xuICByZXR1cm4gKHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nICYmICF4Ll9yZWdsVHlwZSkgfHxcbiAgICAgICAgIHggaW5zdGFuY2VvZiBEeW5hbWljVmFyaWFibGVcbn1cblxuZnVuY3Rpb24gdW5ib3ggKHgsIHBhdGgpIHtcbiAgaWYgKHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG5ldyBEeW5hbWljVmFyaWFibGUoRFlOX0ZVTkMsIHgpXG4gIH1cbiAgcmV0dXJuIHhcbn1cblxudmFyIGR5bmFtaWMgPSB7XG4gIER5bmFtaWNWYXJpYWJsZTogRHluYW1pY1ZhcmlhYmxlLFxuICBkZWZpbmU6IGRlZmluZUR5bmFtaWMsXG4gIGlzRHluYW1pYzogaXNEeW5hbWljLFxuICB1bmJveDogdW5ib3gsXG4gIGFjY2Vzc29yOiB0b0FjY2Vzc29yU3RyaW5nXG59O1xuXG4vKiBnbG9iYWxzIHJlcXVlc3RBbmltYXRpb25GcmFtZSwgY2FuY2VsQW5pbWF0aW9uRnJhbWUgKi9cbnZhciByYWYgPSB7XG4gIG5leHQ6IHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbidcbiAgICA/IGZ1bmN0aW9uIChjYikgeyByZXR1cm4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKSB9XG4gICAgOiBmdW5jdGlvbiAoY2IpIHsgcmV0dXJuIHNldFRpbWVvdXQoY2IsIDE2KSB9LFxuICBjYW5jZWw6IHR5cGVvZiBjYW5jZWxBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gZnVuY3Rpb24gKHJhZikgeyByZXR1cm4gY2FuY2VsQW5pbWF0aW9uRnJhbWUocmFmKSB9XG4gICAgOiBjbGVhclRpbWVvdXRcbn07XG5cbi8qIGdsb2JhbHMgcGVyZm9ybWFuY2UgKi9cbnZhciBjbG9jayA9ICh0eXBlb2YgcGVyZm9ybWFuY2UgIT09ICd1bmRlZmluZWQnICYmIHBlcmZvcm1hbmNlLm5vdylcbiAgPyBmdW5jdGlvbiAoKSB7IHJldHVybiBwZXJmb3JtYW5jZS5ub3coKSB9XG4gIDogZnVuY3Rpb24gKCkgeyByZXR1cm4gKyhuZXcgRGF0ZSgpKSB9O1xuXG5mdW5jdGlvbiBjcmVhdGVTdHJpbmdTdG9yZSAoKSB7XG4gIHZhciBzdHJpbmdJZHMgPSB7Jyc6IDB9O1xuICB2YXIgc3RyaW5nVmFsdWVzID0gWycnXTtcbiAgcmV0dXJuIHtcbiAgICBpZDogZnVuY3Rpb24gKHN0cikge1xuICAgICAgdmFyIHJlc3VsdCA9IHN0cmluZ0lkc1tzdHJdO1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBzdHJpbmdJZHNbc3RyXSA9IHN0cmluZ1ZhbHVlcy5sZW5ndGg7XG4gICAgICBzdHJpbmdWYWx1ZXMucHVzaChzdHIpO1xuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH0sXG5cbiAgICBzdHI6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgcmV0dXJuIHN0cmluZ1ZhbHVlc1tpZF1cbiAgICB9XG4gIH1cbn1cblxuLy8gQ29udGV4dCBhbmQgY2FudmFzIGNyZWF0aW9uIGhlbHBlciBmdW5jdGlvbnNcbmZ1bmN0aW9uIGNyZWF0ZUNhbnZhcyAoZWxlbWVudCwgb25Eb25lLCBwaXhlbFJhdGlvKSB7XG4gIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgZXh0ZW5kKGNhbnZhcy5zdHlsZSwge1xuICAgIGJvcmRlcjogMCxcbiAgICBtYXJnaW46IDAsXG4gICAgcGFkZGluZzogMCxcbiAgICB0b3A6IDAsXG4gICAgbGVmdDogMFxuICB9KTtcbiAgZWxlbWVudC5hcHBlbmRDaGlsZChjYW52YXMpO1xuXG4gIGlmIChlbGVtZW50ID09PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBleHRlbmQoZWxlbWVudC5zdHlsZSwge1xuICAgICAgbWFyZ2luOiAwLFxuICAgICAgcGFkZGluZzogMFxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzaXplICgpIHtcbiAgICB2YXIgdyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHZhciBoID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGlmIChlbGVtZW50ICE9PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICB2YXIgYm91bmRzID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHcgPSBib3VuZHMucmlnaHQgLSBib3VuZHMubGVmdDtcbiAgICAgIGggPSBib3VuZHMuYm90dG9tIC0gYm91bmRzLnRvcDtcbiAgICB9XG4gICAgY2FudmFzLndpZHRoID0gcGl4ZWxSYXRpbyAqIHc7XG4gICAgY2FudmFzLmhlaWdodCA9IHBpeGVsUmF0aW8gKiBoO1xuICAgIGV4dGVuZChjYW52YXMuc3R5bGUsIHtcbiAgICAgIHdpZHRoOiB3ICsgJ3B4JyxcbiAgICAgIGhlaWdodDogaCArICdweCdcbiAgICB9KTtcbiAgfVxuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUsIGZhbHNlKTtcblxuICBmdW5jdGlvbiBvbkRlc3Ryb3kgKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUpO1xuICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoY2FudmFzKTtcbiAgfVxuXG4gIHJlc2l6ZSgpO1xuXG4gIHJldHVybiB7XG4gICAgY2FudmFzOiBjYW52YXMsXG4gICAgb25EZXN0cm95OiBvbkRlc3Ryb3lcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDb250ZXh0IChjYW52YXMsIGNvbnRleHRBdHRyaWJ1dGVzKSB7XG4gIGZ1bmN0aW9uIGdldCAobmFtZSkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gY2FudmFzLmdldENvbnRleHQobmFtZSwgY29udGV4dEF0dHJpYnV0ZXMpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbiAgcmV0dXJuIChcbiAgICBnZXQoJ3dlYmdsJykgfHxcbiAgICBnZXQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpIHx8XG4gICAgZ2V0KCd3ZWJnbC1leHBlcmltZW50YWwnKVxuICApXG59XG5cbmZ1bmN0aW9uIGlzSFRNTEVsZW1lbnQgKG9iaikge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiBvYmoubm9kZU5hbWUgPT09ICdzdHJpbmcnICYmXG4gICAgdHlwZW9mIG9iai5hcHBlbmRDaGlsZCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIHR5cGVvZiBvYmouZ2V0Qm91bmRpbmdDbGllbnRSZWN0ID09PSAnZnVuY3Rpb24nXG4gIClcbn1cblxuZnVuY3Rpb24gaXNXZWJHTENvbnRleHQgKG9iaikge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiBvYmouZHJhd0FycmF5cyA9PT0gJ2Z1bmN0aW9uJyB8fFxuICAgIHR5cGVvZiBvYmouZHJhd0VsZW1lbnRzID09PSAnZnVuY3Rpb24nXG4gIClcbn1cblxuZnVuY3Rpb24gcGFyc2VFeHRlbnNpb25zIChpbnB1dCkge1xuICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBpbnB1dC5zcGxpdCgpXG4gIH1cbiAgY2hlY2skMShBcnJheS5pc0FycmF5KGlucHV0KSwgJ2ludmFsaWQgZXh0ZW5zaW9uIGFycmF5Jyk7XG4gIHJldHVybiBpbnB1dFxufVxuXG5mdW5jdGlvbiBnZXRFbGVtZW50IChkZXNjKSB7XG4gIGlmICh0eXBlb2YgZGVzYyA9PT0gJ3N0cmluZycpIHtcbiAgICBjaGVjayQxKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcsICdub3Qgc3VwcG9ydGVkIG91dHNpZGUgb2YgRE9NJyk7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZGVzYylcbiAgfVxuICByZXR1cm4gZGVzY1xufVxuXG5mdW5jdGlvbiBwYXJzZUFyZ3MgKGFyZ3NfKSB7XG4gIHZhciBhcmdzID0gYXJnc18gfHwge307XG4gIHZhciBlbGVtZW50LCBjb250YWluZXIsIGNhbnZhcywgZ2w7XG4gIHZhciBjb250ZXh0QXR0cmlidXRlcyA9IHt9O1xuICB2YXIgZXh0ZW5zaW9ucyA9IFtdO1xuICB2YXIgb3B0aW9uYWxFeHRlbnNpb25zID0gW107XG4gIHZhciBwaXhlbFJhdGlvID0gKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gMSA6IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgdmFyIHByb2ZpbGUgPSBmYWxzZTtcbiAgdmFyIG9uRG9uZSA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjaGVjayQxLnJhaXNlKGVycik7XG4gICAgfVxuICB9O1xuICB2YXIgb25EZXN0cm95ID0gZnVuY3Rpb24gKCkge307XG4gIGlmICh0eXBlb2YgYXJncyA9PT0gJ3N0cmluZycpIHtcbiAgICBjaGVjayQxKFxuICAgICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyxcbiAgICAgICdzZWxlY3RvciBxdWVyaWVzIG9ubHkgc3VwcG9ydGVkIGluIERPTSBlbnZpcm9tZW50cycpO1xuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFyZ3MpO1xuICAgIGNoZWNrJDEoZWxlbWVudCwgJ2ludmFsaWQgcXVlcnkgc3RyaW5nIGZvciBlbGVtZW50Jyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3MgPT09ICdvYmplY3QnKSB7XG4gICAgaWYgKGlzSFRNTEVsZW1lbnQoYXJncykpIHtcbiAgICAgIGVsZW1lbnQgPSBhcmdzO1xuICAgIH0gZWxzZSBpZiAoaXNXZWJHTENvbnRleHQoYXJncykpIHtcbiAgICAgIGdsID0gYXJncztcbiAgICAgIGNhbnZhcyA9IGdsLmNhbnZhcztcbiAgICB9IGVsc2Uge1xuICAgICAgY2hlY2skMS5jb25zdHJ1Y3RvcihhcmdzKTtcbiAgICAgIGlmICgnZ2wnIGluIGFyZ3MpIHtcbiAgICAgICAgZ2wgPSBhcmdzLmdsO1xuICAgICAgfSBlbHNlIGlmICgnY2FudmFzJyBpbiBhcmdzKSB7XG4gICAgICAgIGNhbnZhcyA9IGdldEVsZW1lbnQoYXJncy5jYW52YXMpO1xuICAgICAgfSBlbHNlIGlmICgnY29udGFpbmVyJyBpbiBhcmdzKSB7XG4gICAgICAgIGNvbnRhaW5lciA9IGdldEVsZW1lbnQoYXJncy5jb250YWluZXIpO1xuICAgICAgfVxuICAgICAgaWYgKCdhdHRyaWJ1dGVzJyBpbiBhcmdzKSB7XG4gICAgICAgIGNvbnRleHRBdHRyaWJ1dGVzID0gYXJncy5hdHRyaWJ1dGVzO1xuICAgICAgICBjaGVjayQxLnR5cGUoY29udGV4dEF0dHJpYnV0ZXMsICdvYmplY3QnLCAnaW52YWxpZCBjb250ZXh0IGF0dHJpYnV0ZXMnKTtcbiAgICAgIH1cbiAgICAgIGlmICgnZXh0ZW5zaW9ucycgaW4gYXJncykge1xuICAgICAgICBleHRlbnNpb25zID0gcGFyc2VFeHRlbnNpb25zKGFyZ3MuZXh0ZW5zaW9ucyk7XG4gICAgICB9XG4gICAgICBpZiAoJ29wdGlvbmFsRXh0ZW5zaW9ucycgaW4gYXJncykge1xuICAgICAgICBvcHRpb25hbEV4dGVuc2lvbnMgPSBwYXJzZUV4dGVuc2lvbnMoYXJncy5vcHRpb25hbEV4dGVuc2lvbnMpO1xuICAgICAgfVxuICAgICAgaWYgKCdvbkRvbmUnIGluIGFyZ3MpIHtcbiAgICAgICAgY2hlY2skMS50eXBlKFxuICAgICAgICAgIGFyZ3Mub25Eb25lLCAnZnVuY3Rpb24nLFxuICAgICAgICAgICdpbnZhbGlkIG9yIG1pc3Npbmcgb25Eb25lIGNhbGxiYWNrJyk7XG4gICAgICAgIG9uRG9uZSA9IGFyZ3Mub25Eb25lO1xuICAgICAgfVxuICAgICAgaWYgKCdwcm9maWxlJyBpbiBhcmdzKSB7XG4gICAgICAgIHByb2ZpbGUgPSAhIWFyZ3MucHJvZmlsZTtcbiAgICAgIH1cbiAgICAgIGlmICgncGl4ZWxSYXRpbycgaW4gYXJncykge1xuICAgICAgICBwaXhlbFJhdGlvID0gK2FyZ3MucGl4ZWxSYXRpbztcbiAgICAgICAgY2hlY2skMShwaXhlbFJhdGlvID4gMCwgJ2ludmFsaWQgcGl4ZWwgcmF0aW8nKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY2hlY2skMS5yYWlzZSgnaW52YWxpZCBhcmd1bWVudHMgdG8gcmVnbCcpO1xuICB9XG5cbiAgaWYgKGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnY2FudmFzJykge1xuICAgICAgY2FudmFzID0gZWxlbWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGFpbmVyID0gZWxlbWVudDtcbiAgICB9XG4gIH1cblxuICBpZiAoIWdsKSB7XG4gICAgaWYgKCFjYW52YXMpIHtcbiAgICAgIGNoZWNrJDEoXG4gICAgICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcsXG4gICAgICAgICdtdXN0IG1hbnVhbGx5IHNwZWNpZnkgd2ViZ2wgY29udGV4dCBvdXRzaWRlIG9mIERPTSBlbnZpcm9ubWVudHMnKTtcbiAgICAgIHZhciByZXN1bHQgPSBjcmVhdGVDYW52YXMoY29udGFpbmVyIHx8IGRvY3VtZW50LmJvZHksIG9uRG9uZSwgcGl4ZWxSYXRpbyk7XG4gICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgICAgY2FudmFzID0gcmVzdWx0LmNhbnZhcztcbiAgICAgIG9uRGVzdHJveSA9IHJlc3VsdC5vbkRlc3Ryb3k7XG4gICAgfVxuICAgIGdsID0gY3JlYXRlQ29udGV4dChjYW52YXMsIGNvbnRleHRBdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIGlmICghZ2wpIHtcbiAgICBvbkRlc3Ryb3koKTtcbiAgICBvbkRvbmUoJ3dlYmdsIG5vdCBzdXBwb3J0ZWQsIHRyeSB1cGdyYWRpbmcgeW91ciBicm93c2VyIG9yIGdyYXBoaWNzIGRyaXZlcnMgaHR0cDovL2dldC53ZWJnbC5vcmcnKTtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnbDogZ2wsXG4gICAgY2FudmFzOiBjYW52YXMsXG4gICAgY29udGFpbmVyOiBjb250YWluZXIsXG4gICAgZXh0ZW5zaW9uczogZXh0ZW5zaW9ucyxcbiAgICBvcHRpb25hbEV4dGVuc2lvbnM6IG9wdGlvbmFsRXh0ZW5zaW9ucyxcbiAgICBwaXhlbFJhdGlvOiBwaXhlbFJhdGlvLFxuICAgIHByb2ZpbGU6IHByb2ZpbGUsXG4gICAgb25Eb25lOiBvbkRvbmUsXG4gICAgb25EZXN0cm95OiBvbkRlc3Ryb3lcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVFeHRlbnNpb25DYWNoZSAoZ2wsIGNvbmZpZykge1xuICB2YXIgZXh0ZW5zaW9ucyA9IHt9O1xuXG4gIGZ1bmN0aW9uIHRyeUxvYWRFeHRlbnNpb24gKG5hbWVfKSB7XG4gICAgY2hlY2skMS50eXBlKG5hbWVfLCAnc3RyaW5nJywgJ2V4dGVuc2lvbiBuYW1lIG11c3QgYmUgc3RyaW5nJyk7XG4gICAgdmFyIG5hbWUgPSBuYW1lXy50b0xvd2VyQ2FzZSgpO1xuICAgIHZhciBleHQ7XG4gICAgdHJ5IHtcbiAgICAgIGV4dCA9IGV4dGVuc2lvbnNbbmFtZV0gPSBnbC5nZXRFeHRlbnNpb24obmFtZSk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICByZXR1cm4gISFleHRcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY29uZmlnLmV4dGVuc2lvbnMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgbmFtZSA9IGNvbmZpZy5leHRlbnNpb25zW2ldO1xuICAgIGlmICghdHJ5TG9hZEV4dGVuc2lvbihuYW1lKSkge1xuICAgICAgY29uZmlnLm9uRGVzdHJveSgpO1xuICAgICAgY29uZmlnLm9uRG9uZSgnXCInICsgbmFtZSArICdcIiBleHRlbnNpb24gaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgY3VycmVudCBXZWJHTCBjb250ZXh0LCB0cnkgdXBncmFkaW5nIHlvdXIgc3lzdGVtIG9yIGEgZGlmZmVyZW50IGJyb3dzZXInKTtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgY29uZmlnLm9wdGlvbmFsRXh0ZW5zaW9ucy5mb3JFYWNoKHRyeUxvYWRFeHRlbnNpb24pO1xuXG4gIHJldHVybiB7XG4gICAgZXh0ZW5zaW9uczogZXh0ZW5zaW9ucyxcbiAgICByZXN0b3JlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBPYmplY3Qua2V5cyhleHRlbnNpb25zKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIGlmICghdHJ5TG9hZEV4dGVuc2lvbihuYW1lKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignKHJlZ2wpOiBlcnJvciByZXN0b3JpbmcgZXh0ZW5zaW9uICcgKyBuYW1lKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbG9vcCAobiwgZikge1xuICB2YXIgcmVzdWx0ID0gQXJyYXkobik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgcmVzdWx0W2ldID0gZihpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0XG59XG5cbnZhciBHTF9CWVRFJDEgPSA1MTIwO1xudmFyIEdMX1VOU0lHTkVEX0JZVEUkMiA9IDUxMjE7XG52YXIgR0xfU0hPUlQkMSA9IDUxMjI7XG52YXIgR0xfVU5TSUdORURfU0hPUlQkMSA9IDUxMjM7XG52YXIgR0xfSU5UJDEgPSA1MTI0O1xudmFyIEdMX1VOU0lHTkVEX0lOVCQxID0gNTEyNTtcbnZhciBHTF9GTE9BVCQyID0gNTEyNjtcblxuZnVuY3Rpb24gbmV4dFBvdzE2ICh2KSB7XG4gIGZvciAodmFyIGkgPSAxNjsgaSA8PSAoMSA8PCAyOCk7IGkgKj0gMTYpIHtcbiAgICBpZiAodiA8PSBpKSB7XG4gICAgICByZXR1cm4gaVxuICAgIH1cbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBsb2cyICh2KSB7XG4gIHZhciByLCBzaGlmdDtcbiAgciA9ICh2ID4gMHhGRkZGKSA8PCA0O1xuICB2ID4+Pj0gcjtcbiAgc2hpZnQgPSAodiA+IDB4RkYpIDw8IDM7XG4gIHYgPj4+PSBzaGlmdDsgciB8PSBzaGlmdDtcbiAgc2hpZnQgPSAodiA+IDB4RikgPDwgMjtcbiAgdiA+Pj49IHNoaWZ0OyByIHw9IHNoaWZ0O1xuICBzaGlmdCA9ICh2ID4gMHgzKSA8PCAxO1xuICB2ID4+Pj0gc2hpZnQ7IHIgfD0gc2hpZnQ7XG4gIHJldHVybiByIHwgKHYgPj4gMSlcbn1cblxuZnVuY3Rpb24gY3JlYXRlUG9vbCAoKSB7XG4gIHZhciBidWZmZXJQb29sID0gbG9vcCg4LCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFtdXG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGFsbG9jIChuKSB7XG4gICAgdmFyIHN6ID0gbmV4dFBvdzE2KG4pO1xuICAgIHZhciBiaW4gPSBidWZmZXJQb29sW2xvZzIoc3opID4+IDJdO1xuICAgIGlmIChiaW4ubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIGJpbi5wb3AoKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEFycmF5QnVmZmVyKHN6KVxuICB9XG5cbiAgZnVuY3Rpb24gZnJlZSAoYnVmKSB7XG4gICAgYnVmZmVyUG9vbFtsb2cyKGJ1Zi5ieXRlTGVuZ3RoKSA+PiAyXS5wdXNoKGJ1Zik7XG4gIH1cblxuICBmdW5jdGlvbiBhbGxvY1R5cGUgKHR5cGUsIG4pIHtcbiAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgR0xfQllURSQxOlxuICAgICAgICByZXN1bHQgPSBuZXcgSW50OEFycmF5KGFsbG9jKG4pLCAwLCBuKTtcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgR0xfVU5TSUdORURfQllURSQyOlxuICAgICAgICByZXN1bHQgPSBuZXcgVWludDhBcnJheShhbGxvYyhuKSwgMCwgbik7XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIEdMX1NIT1JUJDE6XG4gICAgICAgIHJlc3VsdCA9IG5ldyBJbnQxNkFycmF5KGFsbG9jKDIgKiBuKSwgMCwgbik7XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIEdMX1VOU0lHTkVEX1NIT1JUJDE6XG4gICAgICAgIHJlc3VsdCA9IG5ldyBVaW50MTZBcnJheShhbGxvYygyICogbiksIDAsIG4pO1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSBHTF9JTlQkMTpcbiAgICAgICAgcmVzdWx0ID0gbmV3IEludDMyQXJyYXkoYWxsb2MoNCAqIG4pLCAwLCBuKTtcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgR0xfVU5TSUdORURfSU5UJDE6XG4gICAgICAgIHJlc3VsdCA9IG5ldyBVaW50MzJBcnJheShhbGxvYyg0ICogbiksIDAsIG4pO1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSBHTF9GTE9BVCQyOlxuICAgICAgICByZXN1bHQgPSBuZXcgRmxvYXQzMkFycmF5KGFsbG9jKDQgKiBuKSwgMCwgbik7XG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICBpZiAocmVzdWx0Lmxlbmd0aCAhPT0gbikge1xuICAgICAgcmV0dXJuIHJlc3VsdC5zdWJhcnJheSgwLCBuKVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBmdW5jdGlvbiBmcmVlVHlwZSAoYXJyYXkpIHtcbiAgICBmcmVlKGFycmF5LmJ1ZmZlcik7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGFsbG9jOiBhbGxvYyxcbiAgICBmcmVlOiBmcmVlLFxuICAgIGFsbG9jVHlwZTogYWxsb2NUeXBlLFxuICAgIGZyZWVUeXBlOiBmcmVlVHlwZVxuICB9XG59XG5cbnZhciBwb29sID0gY3JlYXRlUG9vbCgpO1xuXG4vLyB6ZXJvIHBvb2wgZm9yIGluaXRpYWwgemVybyBkYXRhXG5wb29sLnplcm8gPSBjcmVhdGVQb29sKCk7XG5cbnZhciBHTF9TVUJQSVhFTF9CSVRTID0gMHgwRDUwO1xudmFyIEdMX1JFRF9CSVRTID0gMHgwRDUyO1xudmFyIEdMX0dSRUVOX0JJVFMgPSAweDBENTM7XG52YXIgR0xfQkxVRV9CSVRTID0gMHgwRDU0O1xudmFyIEdMX0FMUEhBX0JJVFMgPSAweDBENTU7XG52YXIgR0xfREVQVEhfQklUUyA9IDB4MEQ1NjtcbnZhciBHTF9TVEVOQ0lMX0JJVFMgPSAweDBENTc7XG5cbnZhciBHTF9BTElBU0VEX1BPSU5UX1NJWkVfUkFOR0UgPSAweDg0NkQ7XG52YXIgR0xfQUxJQVNFRF9MSU5FX1dJRFRIX1JBTkdFID0gMHg4NDZFO1xuXG52YXIgR0xfTUFYX1RFWFRVUkVfU0laRSA9IDB4MEQzMztcbnZhciBHTF9NQVhfVklFV1BPUlRfRElNUyA9IDB4MEQzQTtcbnZhciBHTF9NQVhfVkVSVEVYX0FUVFJJQlMgPSAweDg4Njk7XG52YXIgR0xfTUFYX1ZFUlRFWF9VTklGT1JNX1ZFQ1RPUlMgPSAweDhERkI7XG52YXIgR0xfTUFYX1ZBUllJTkdfVkVDVE9SUyA9IDB4OERGQztcbnZhciBHTF9NQVhfQ09NQklORURfVEVYVFVSRV9JTUFHRV9VTklUUyA9IDB4OEI0RDtcbnZhciBHTF9NQVhfVkVSVEVYX1RFWFRVUkVfSU1BR0VfVU5JVFMgPSAweDhCNEM7XG52YXIgR0xfTUFYX1RFWFRVUkVfSU1BR0VfVU5JVFMgPSAweDg4NzI7XG52YXIgR0xfTUFYX0ZSQUdNRU5UX1VOSUZPUk1fVkVDVE9SUyA9IDB4OERGRDtcbnZhciBHTF9NQVhfQ1VCRV9NQVBfVEVYVFVSRV9TSVpFID0gMHg4NTFDO1xudmFyIEdMX01BWF9SRU5ERVJCVUZGRVJfU0laRSA9IDB4ODRFODtcblxudmFyIEdMX1ZFTkRPUiA9IDB4MUYwMDtcbnZhciBHTF9SRU5ERVJFUiA9IDB4MUYwMTtcbnZhciBHTF9WRVJTSU9OID0gMHgxRjAyO1xudmFyIEdMX1NIQURJTkdfTEFOR1VBR0VfVkVSU0lPTiA9IDB4OEI4QztcblxudmFyIEdMX01BWF9URVhUVVJFX01BWF9BTklTT1RST1BZX0VYVCA9IDB4ODRGRjtcblxudmFyIEdMX01BWF9DT0xPUl9BVFRBQ0hNRU5UU19XRUJHTCA9IDB4OENERjtcbnZhciBHTF9NQVhfRFJBV19CVUZGRVJTX1dFQkdMID0gMHg4ODI0O1xuXG52YXIgR0xfVEVYVFVSRV8yRCA9IDB4MERFMTtcbnZhciBHTF9URVhUVVJFX0NVQkVfTUFQID0gMHg4NTEzO1xudmFyIEdMX1RFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCA9IDB4ODUxNTtcbnZhciBHTF9URVhUVVJFMCA9IDB4ODRDMDtcbnZhciBHTF9SR0JBID0gMHgxOTA4O1xudmFyIEdMX0ZMT0FUJDEgPSAweDE0MDY7XG52YXIgR0xfVU5TSUdORURfQllURSQxID0gMHgxNDAxO1xudmFyIEdMX0ZSQU1FQlVGRkVSID0gMHg4RDQwO1xudmFyIEdMX0ZSQU1FQlVGRkVSX0NPTVBMRVRFID0gMHg4Q0Q1O1xudmFyIEdMX0NPTE9SX0FUVEFDSE1FTlQwID0gMHg4Q0UwO1xudmFyIEdMX0NPTE9SX0JVRkZFUl9CSVQkMSA9IDB4NDAwMDtcblxudmFyIHdyYXBMaW1pdHMgPSBmdW5jdGlvbiAoZ2wsIGV4dGVuc2lvbnMpIHtcbiAgdmFyIG1heEFuaXNvdHJvcGljID0gMTtcbiAgaWYgKGV4dGVuc2lvbnMuZXh0X3RleHR1cmVfZmlsdGVyX2FuaXNvdHJvcGljKSB7XG4gICAgbWF4QW5pc290cm9waWMgPSBnbC5nZXRQYXJhbWV0ZXIoR0xfTUFYX1RFWFRVUkVfTUFYX0FOSVNPVFJPUFlfRVhUKTtcbiAgfVxuXG4gIHZhciBtYXhEcmF3YnVmZmVycyA9IDE7XG4gIHZhciBtYXhDb2xvckF0dGFjaG1lbnRzID0gMTtcbiAgaWYgKGV4dGVuc2lvbnMud2ViZ2xfZHJhd19idWZmZXJzKSB7XG4gICAgbWF4RHJhd2J1ZmZlcnMgPSBnbC5nZXRQYXJhbWV0ZXIoR0xfTUFYX0RSQVdfQlVGRkVSU19XRUJHTCk7XG4gICAgbWF4Q29sb3JBdHRhY2htZW50cyA9IGdsLmdldFBhcmFtZXRlcihHTF9NQVhfQ09MT1JfQVRUQUNITUVOVFNfV0VCR0wpO1xuICB9XG5cbiAgLy8gZGV0ZWN0IGlmIHJlYWRpbmcgZmxvYXQgdGV4dHVyZXMgaXMgYXZhaWxhYmxlIChTYWZhcmkgZG9lc24ndCBzdXBwb3J0KVxuICB2YXIgcmVhZEZsb2F0ID0gISFleHRlbnNpb25zLm9lc190ZXh0dXJlX2Zsb2F0O1xuICBpZiAocmVhZEZsb2F0KSB7XG4gICAgdmFyIHJlYWRGbG9hdFRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG4gICAgZ2wuYmluZFRleHR1cmUoR0xfVEVYVFVSRV8yRCwgcmVhZEZsb2F0VGV4dHVyZSk7XG4gICAgZ2wudGV4SW1hZ2UyRChHTF9URVhUVVJFXzJELCAwLCBHTF9SR0JBLCAxLCAxLCAwLCBHTF9SR0JBLCBHTF9GTE9BVCQxLCBudWxsKTtcblxuICAgIHZhciBmYm8gPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xuICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihHTF9GUkFNRUJVRkZFUiwgZmJvKTtcbiAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChHTF9GUkFNRUJVRkZFUiwgR0xfQ09MT1JfQVRUQUNITUVOVDAsIEdMX1RFWFRVUkVfMkQsIHJlYWRGbG9hdFRleHR1cmUsIDApO1xuICAgIGdsLmJpbmRUZXh0dXJlKEdMX1RFWFRVUkVfMkQsIG51bGwpO1xuXG4gICAgaWYgKGdsLmNoZWNrRnJhbWVidWZmZXJTdGF0dXMoR0xfRlJBTUVCVUZGRVIpICE9PSBHTF9GUkFNRUJVRkZFUl9DT01QTEVURSkgcmVhZEZsb2F0ID0gZmFsc2U7XG5cbiAgICBlbHNlIHtcbiAgICAgIGdsLnZpZXdwb3J0KDAsIDAsIDEsIDEpO1xuICAgICAgZ2wuY2xlYXJDb2xvcigxLjAsIDAuMCwgMC4wLCAxLjApO1xuICAgICAgZ2wuY2xlYXIoR0xfQ09MT1JfQlVGRkVSX0JJVCQxKTtcbiAgICAgIHZhciBwaXhlbHMgPSBwb29sLmFsbG9jVHlwZShHTF9GTE9BVCQxLCA0KTtcbiAgICAgIGdsLnJlYWRQaXhlbHMoMCwgMCwgMSwgMSwgR0xfUkdCQSwgR0xfRkxPQVQkMSwgcGl4ZWxzKTtcblxuICAgICAgaWYgKGdsLmdldEVycm9yKCkpIHJlYWRGbG9hdCA9IGZhbHNlO1xuICAgICAgZWxzZSB7XG4gICAgICAgIGdsLmRlbGV0ZUZyYW1lYnVmZmVyKGZibyk7XG4gICAgICAgIGdsLmRlbGV0ZVRleHR1cmUocmVhZEZsb2F0VGV4dHVyZSk7XG5cbiAgICAgICAgcmVhZEZsb2F0ID0gcGl4ZWxzWzBdID09PSAxLjA7XG4gICAgICB9XG5cbiAgICAgIHBvb2wuZnJlZVR5cGUocGl4ZWxzKTtcbiAgICB9XG4gIH1cblxuICAvLyBkZXRlY3Qgbm9uIHBvd2VyIG9mIHR3byBjdWJlIHRleHR1cmVzIHN1cHBvcnQgKElFIGRvZXNuJ3Qgc3VwcG9ydClcbiAgdmFyIG5wb3RUZXh0dXJlQ3ViZSA9IHRydWU7XG4gIHZhciBjdWJlVGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcbiAgdmFyIGRhdGEgPSBwb29sLmFsbG9jVHlwZShHTF9VTlNJR05FRF9CWVRFJDEsIDM2KTtcbiAgZ2wuYWN0aXZlVGV4dHVyZShHTF9URVhUVVJFMCk7XG4gIGdsLmJpbmRUZXh0dXJlKEdMX1RFWFRVUkVfQ1VCRV9NQVAsIGN1YmVUZXh0dXJlKTtcbiAgZ2wudGV4SW1hZ2UyRChHTF9URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1gsIDAsIEdMX1JHQkEsIDMsIDMsIDAsIEdMX1JHQkEsIEdMX1VOU0lHTkVEX0JZVEUkMSwgZGF0YSk7XG4gIHBvb2wuZnJlZVR5cGUoZGF0YSk7XG4gIGdsLmJpbmRUZXh0dXJlKEdMX1RFWFRVUkVfQ1VCRV9NQVAsIG51bGwpO1xuICBnbC5kZWxldGVUZXh0dXJlKGN1YmVUZXh0dXJlKTtcbiAgbnBvdFRleHR1cmVDdWJlID0gIWdsLmdldEVycm9yKCk7XG5cbiAgcmV0dXJuIHtcbiAgICAvLyBkcmF3aW5nIGJ1ZmZlciBiaXQgZGVwdGhcbiAgICBjb2xvckJpdHM6IFtcbiAgICAgIGdsLmdldFBhcmFtZXRlcihHTF9SRURfQklUUyksXG4gICAgICBnbC5nZXRQYXJhbWV0ZXIoR0xfR1JFRU5fQklUUyksXG4gICAgICBnbC5nZXRQYXJhbWV0ZXIoR0xfQkxVRV9CSVRTKSxcbiAgICAgIGdsLmdldFBhcmFtZXRlcihHTF9BTFBIQV9CSVRTKVxuICAgIF0sXG4gICAgZGVwdGhCaXRzOiBnbC5nZXRQYXJhbWV0ZXIoR0xfREVQVEhfQklUUyksXG4gICAgc3RlbmNpbEJpdHM6IGdsLmdldFBhcmFtZXRlcihHTF9TVEVOQ0lMX0JJVFMpLFxuICAgIHN1YnBpeGVsQml0czogZ2wuZ2V0UGFyYW1ldGVyKEdMX1NVQlBJWEVMX0JJVFMpLFxuXG4gICAgLy8gc3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgICBleHRlbnNpb25zOiBPYmplY3Qua2V5cyhleHRlbnNpb25zKS5maWx0ZXIoZnVuY3Rpb24gKGV4dCkge1xuICAgICAgcmV0dXJuICEhZXh0ZW5zaW9uc1tleHRdXG4gICAgfSksXG5cbiAgICAvLyBtYXggYW5pc28gc2FtcGxlc1xuICAgIG1heEFuaXNvdHJvcGljOiBtYXhBbmlzb3Ryb3BpYyxcblxuICAgIC8vIG1heCBkcmF3IGJ1ZmZlcnNcbiAgICBtYXhEcmF3YnVmZmVyczogbWF4RHJhd2J1ZmZlcnMsXG4gICAgbWF4Q29sb3JBdHRhY2htZW50czogbWF4Q29sb3JBdHRhY2htZW50cyxcblxuICAgIC8vIHBvaW50IGFuZCBsaW5lIHNpemUgcmFuZ2VzXG4gICAgcG9pbnRTaXplRGltczogZ2wuZ2V0UGFyYW1ldGVyKEdMX0FMSUFTRURfUE9JTlRfU0laRV9SQU5HRSksXG4gICAgbGluZVdpZHRoRGltczogZ2wuZ2V0UGFyYW1ldGVyKEdMX0FMSUFTRURfTElORV9XSURUSF9SQU5HRSksXG4gICAgbWF4Vmlld3BvcnREaW1zOiBnbC5nZXRQYXJhbWV0ZXIoR0xfTUFYX1ZJRVdQT1JUX0RJTVMpLFxuICAgIG1heENvbWJpbmVkVGV4dHVyZVVuaXRzOiBnbC5nZXRQYXJhbWV0ZXIoR0xfTUFYX0NPTUJJTkVEX1RFWFRVUkVfSU1BR0VfVU5JVFMpLFxuICAgIG1heEN1YmVNYXBTaXplOiBnbC5nZXRQYXJhbWV0ZXIoR0xfTUFYX0NVQkVfTUFQX1RFWFRVUkVfU0laRSksXG4gICAgbWF4UmVuZGVyYnVmZmVyU2l6ZTogZ2wuZ2V0UGFyYW1ldGVyKEdMX01BWF9SRU5ERVJCVUZGRVJfU0laRSksXG4gICAgbWF4VGV4dHVyZVVuaXRzOiBnbC5nZXRQYXJhbWV0ZXIoR0xfTUFYX1RFWFRVUkVfSU1BR0VfVU5JVFMpLFxuICAgIG1heFRleHR1cmVTaXplOiBnbC5nZXRQYXJhbWV0ZXIoR0xfTUFYX1RFWFRVUkVfU0laRSksXG4gICAgbWF4QXR0cmlidXRlczogZ2wuZ2V0UGFyYW1ldGVyKEdMX01BWF9WRVJURVhfQVRUUklCUyksXG4gICAgbWF4VmVydGV4VW5pZm9ybXM6IGdsLmdldFBhcmFtZXRlcihHTF9NQVhfVkVSVEVYX1VOSUZPUk1fVkVDVE9SUyksXG4gICAgbWF4VmVydGV4VGV4dHVyZVVuaXRzOiBnbC5nZXRQYXJhbWV0ZXIoR0xfTUFYX1ZFUlRFWF9URVhUVVJFX0lNQUdFX1VOSVRTKSxcbiAgICBtYXhWYXJ5aW5nVmVjdG9yczogZ2wuZ2V0UGFyYW1ldGVyKEdMX01BWF9WQVJZSU5HX1ZFQ1RPUlMpLFxuICAgIG1heEZyYWdtZW50VW5pZm9ybXM6IGdsLmdldFBhcmFtZXRlcihHTF9NQVhfRlJBR01FTlRfVU5JRk9STV9WRUNUT1JTKSxcblxuICAgIC8vIHZlbmRvciBpbmZvXG4gICAgZ2xzbDogZ2wuZ2V0UGFyYW1ldGVyKEdMX1NIQURJTkdfTEFOR1VBR0VfVkVSU0lPTiksXG4gICAgcmVuZGVyZXI6IGdsLmdldFBhcmFtZXRlcihHTF9SRU5ERVJFUiksXG4gICAgdmVuZG9yOiBnbC5nZXRQYXJhbWV0ZXIoR0xfVkVORE9SKSxcbiAgICB2ZXJzaW9uOiBnbC5nZXRQYXJhbWV0ZXIoR0xfVkVSU0lPTiksXG5cbiAgICAvLyBxdWlya3NcbiAgICByZWFkRmxvYXQ6IHJlYWRGbG9hdCxcbiAgICBucG90VGV4dHVyZUN1YmU6IG5wb3RUZXh0dXJlQ3ViZVxuICB9XG59O1xuXG5mdW5jdGlvbiBpc05EQXJyYXlMaWtlIChvYmopIHtcbiAgcmV0dXJuIChcbiAgICAhIW9iaiAmJlxuICAgIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmXG4gICAgQXJyYXkuaXNBcnJheShvYmouc2hhcGUpICYmXG4gICAgQXJyYXkuaXNBcnJheShvYmouc3RyaWRlKSAmJlxuICAgIHR5cGVvZiBvYmoub2Zmc2V0ID09PSAnbnVtYmVyJyAmJlxuICAgIG9iai5zaGFwZS5sZW5ndGggPT09IG9iai5zdHJpZGUubGVuZ3RoICYmXG4gICAgKEFycmF5LmlzQXJyYXkob2JqLmRhdGEpIHx8XG4gICAgICBpc1R5cGVkQXJyYXkob2JqLmRhdGEpKSlcbn1cblxudmFyIHZhbHVlcyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubWFwKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIG9ialtrZXldIH0pXG59O1xuXG52YXIgZmxhdHRlblV0aWxzID0ge1xuICBzaGFwZTogYXJyYXlTaGFwZSQxLFxuICBmbGF0dGVuOiBmbGF0dGVuQXJyYXlcbn07XG5cbmZ1bmN0aW9uIGZsYXR0ZW4xRCAoYXJyYXksIG54LCBvdXQpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBueDsgKytpKSB7XG4gICAgb3V0W2ldID0gYXJyYXlbaV07XG4gIH1cbn1cblxuZnVuY3Rpb24gZmxhdHRlbjJEIChhcnJheSwgbngsIG55LCBvdXQpIHtcbiAgdmFyIHB0ciA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbng7ICsraSkge1xuICAgIHZhciByb3cgPSBhcnJheVtpXTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG55OyArK2opIHtcbiAgICAgIG91dFtwdHIrK10gPSByb3dbal07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW4zRCAoYXJyYXksIG54LCBueSwgbnosIG91dCwgcHRyXykge1xuICB2YXIgcHRyID0gcHRyXztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBueDsgKytpKSB7XG4gICAgdmFyIHJvdyA9IGFycmF5W2ldO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgbnk7ICsraikge1xuICAgICAgdmFyIGNvbCA9IHJvd1tqXTtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgbno7ICsraykge1xuICAgICAgICBvdXRbcHRyKytdID0gY29sW2tdO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmbGF0dGVuUmVjIChhcnJheSwgc2hhcGUsIGxldmVsLCBvdXQsIHB0cikge1xuICB2YXIgc3RyaWRlID0gMTtcbiAgZm9yICh2YXIgaSA9IGxldmVsICsgMTsgaSA8IHNoYXBlLmxlbmd0aDsgKytpKSB7XG4gICAgc3RyaWRlICo9IHNoYXBlW2ldO1xuICB9XG4gIHZhciBuID0gc2hhcGVbbGV2ZWxdO1xuICBpZiAoc2hhcGUubGVuZ3RoIC0gbGV2ZWwgPT09IDQpIHtcbiAgICB2YXIgbnggPSBzaGFwZVtsZXZlbCArIDFdO1xuICAgIHZhciBueSA9IHNoYXBlW2xldmVsICsgMl07XG4gICAgdmFyIG56ID0gc2hhcGVbbGV2ZWwgKyAzXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBmbGF0dGVuM0QoYXJyYXlbaV0sIG54LCBueSwgbnosIG91dCwgcHRyKTtcbiAgICAgIHB0ciArPSBzdHJpZGU7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGZsYXR0ZW5SZWMoYXJyYXlbaV0sIHNoYXBlLCBsZXZlbCArIDEsIG91dCwgcHRyKTtcbiAgICAgIHB0ciArPSBzdHJpZGU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW5BcnJheSAoYXJyYXksIHNoYXBlLCB0eXBlLCBvdXRfKSB7XG4gIHZhciBzeiA9IDE7XG4gIGlmIChzaGFwZS5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNoYXBlLmxlbmd0aDsgKytpKSB7XG4gICAgICBzeiAqPSBzaGFwZVtpXTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc3ogPSAwO1xuICB9XG4gIHZhciBvdXQgPSBvdXRfIHx8IHBvb2wuYWxsb2NUeXBlKHR5cGUsIHN6KTtcbiAgc3dpdGNoIChzaGFwZS5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICBicmVha1xuICAgIGNhc2UgMTpcbiAgICAgIGZsYXR0ZW4xRChhcnJheSwgc2hhcGVbMF0sIG91dCk7XG4gICAgICBicmVha1xuICAgIGNhc2UgMjpcbiAgICAgIGZsYXR0ZW4yRChhcnJheSwgc2hhcGVbMF0sIHNoYXBlWzFdLCBvdXQpO1xuICAgICAgYnJlYWtcbiAgICBjYXNlIDM6XG4gICAgICBmbGF0dGVuM0QoYXJyYXksIHNoYXBlWzBdLCBzaGFwZVsxXSwgc2hhcGVbMl0sIG91dCwgMCk7XG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICBmbGF0dGVuUmVjKGFycmF5LCBzaGFwZSwgMCwgb3V0LCAwKTtcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIGFycmF5U2hhcGUkMSAoYXJyYXlfKSB7XG4gIHZhciBzaGFwZSA9IFtdO1xuICBmb3IgKHZhciBhcnJheSA9IGFycmF5XzsgYXJyYXkubGVuZ3RoOyBhcnJheSA9IGFycmF5WzBdKSB7XG4gICAgc2hhcGUucHVzaChhcnJheS5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBzaGFwZVxufVxuXG52YXIgYXJyYXlUeXBlcyA9IHtcblx0XCJbb2JqZWN0IEludDhBcnJheV1cIjogNTEyMCxcblx0XCJbb2JqZWN0IEludDE2QXJyYXldXCI6IDUxMjIsXG5cdFwiW29iamVjdCBJbnQzMkFycmF5XVwiOiA1MTI0LFxuXHRcIltvYmplY3QgVWludDhBcnJheV1cIjogNTEyMSxcblx0XCJbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XVwiOiA1MTIxLFxuXHRcIltvYmplY3QgVWludDE2QXJyYXldXCI6IDUxMjMsXG5cdFwiW29iamVjdCBVaW50MzJBcnJheV1cIjogNTEyNSxcblx0XCJbb2JqZWN0IEZsb2F0MzJBcnJheV1cIjogNTEyNixcblx0XCJbb2JqZWN0IEZsb2F0NjRBcnJheV1cIjogNTEyMSxcblx0XCJbb2JqZWN0IEFycmF5QnVmZmVyXVwiOiA1MTIxXG59O1xuXG52YXIgaW50OCA9IDUxMjA7XG52YXIgaW50MTYgPSA1MTIyO1xudmFyIGludDMyID0gNTEyNDtcbnZhciB1aW50OCA9IDUxMjE7XG52YXIgdWludDE2ID0gNTEyMztcbnZhciB1aW50MzIgPSA1MTI1O1xudmFyIGZsb2F0ID0gNTEyNjtcbnZhciBmbG9hdDMyID0gNTEyNjtcbnZhciBnbFR5cGVzID0ge1xuXHRpbnQ4OiBpbnQ4LFxuXHRpbnQxNjogaW50MTYsXG5cdGludDMyOiBpbnQzMixcblx0dWludDg6IHVpbnQ4LFxuXHR1aW50MTY6IHVpbnQxNixcblx0dWludDMyOiB1aW50MzIsXG5cdGZsb2F0OiBmbG9hdCxcblx0ZmxvYXQzMjogZmxvYXQzMlxufTtcblxudmFyIGR5bmFtaWMkMSA9IDM1MDQ4O1xudmFyIHN0cmVhbSA9IDM1MDQwO1xudmFyIHVzYWdlVHlwZXMgPSB7XG5cdGR5bmFtaWM6IGR5bmFtaWMkMSxcblx0c3RyZWFtOiBzdHJlYW0sXG5cdFwic3RhdGljXCI6IDM1MDQ0XG59O1xuXG52YXIgYXJyYXlGbGF0dGVuID0gZmxhdHRlblV0aWxzLmZsYXR0ZW47XG52YXIgYXJyYXlTaGFwZSA9IGZsYXR0ZW5VdGlscy5zaGFwZTtcblxudmFyIEdMX1NUQVRJQ19EUkFXID0gMHg4OEU0O1xudmFyIEdMX1NUUkVBTV9EUkFXID0gMHg4OEUwO1xuXG52YXIgR0xfVU5TSUdORURfQllURSQzID0gNTEyMTtcbnZhciBHTF9GTE9BVCQzID0gNTEyNjtcblxudmFyIERUWVBFU19TSVpFUyA9IFtdO1xuRFRZUEVTX1NJWkVTWzUxMjBdID0gMTsgLy8gaW50OFxuRFRZUEVTX1NJWkVTWzUxMjJdID0gMjsgLy8gaW50MTZcbkRUWVBFU19TSVpFU1s1MTI0XSA9IDQ7IC8vIGludDMyXG5EVFlQRVNfU0laRVNbNTEyMV0gPSAxOyAvLyB1aW50OFxuRFRZUEVTX1NJWkVTWzUxMjNdID0gMjsgLy8gdWludDE2XG5EVFlQRVNfU0laRVNbNTEyNV0gPSA0OyAvLyB1aW50MzJcbkRUWVBFU19TSVpFU1s1MTI2XSA9IDQ7IC8vIGZsb2F0MzJcblxuZnVuY3Rpb24gdHlwZWRBcnJheUNvZGUgKGRhdGEpIHtcbiAgcmV0dXJuIGFycmF5VHlwZXNbT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGEpXSB8IDBcbn1cblxuZnVuY3Rpb24gY29weUFycmF5IChvdXQsIGlucCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGlucC5sZW5ndGg7ICsraSkge1xuICAgIG91dFtpXSA9IGlucFtpXTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cmFuc3Bvc2UgKFxuICByZXN1bHQsIGRhdGEsIHNoYXBlWCwgc2hhcGVZLCBzdHJpZGVYLCBzdHJpZGVZLCBvZmZzZXQpIHtcbiAgdmFyIHB0ciA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2hhcGVYOyArK2kpIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNoYXBlWTsgKytqKSB7XG4gICAgICByZXN1bHRbcHRyKytdID0gZGF0YVtzdHJpZGVYICogaSArIHN0cmlkZVkgKiBqICsgb2Zmc2V0XTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gd3JhcEJ1ZmZlclN0YXRlIChnbCwgc3RhdHMsIGNvbmZpZywgYXR0cmlidXRlU3RhdGUpIHtcbiAgdmFyIGJ1ZmZlckNvdW50ID0gMDtcbiAgdmFyIGJ1ZmZlclNldCA9IHt9O1xuXG4gIGZ1bmN0aW9uIFJFR0xCdWZmZXIgKHR5cGUpIHtcbiAgICB0aGlzLmlkID0gYnVmZmVyQ291bnQrKztcbiAgICB0aGlzLmJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy51c2FnZSA9IEdMX1NUQVRJQ19EUkFXO1xuICAgIHRoaXMuYnl0ZUxlbmd0aCA9IDA7XG4gICAgdGhpcy5kaW1lbnNpb24gPSAxO1xuICAgIHRoaXMuZHR5cGUgPSBHTF9VTlNJR05FRF9CWVRFJDM7XG5cbiAgICB0aGlzLnBlcnNpc3RlbnREYXRhID0gbnVsbDtcblxuICAgIGlmIChjb25maWcucHJvZmlsZSkge1xuICAgICAgdGhpcy5zdGF0cyA9IHtzaXplOiAwfTtcbiAgICB9XG4gIH1cblxuICBSRUdMQnVmZmVyLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKCkge1xuICAgIGdsLmJpbmRCdWZmZXIodGhpcy50eXBlLCB0aGlzLmJ1ZmZlcik7XG4gIH07XG5cbiAgUkVHTEJ1ZmZlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICBkZXN0cm95KHRoaXMpO1xuICB9O1xuXG4gIHZhciBzdHJlYW1Qb29sID0gW107XG5cbiAgZnVuY3Rpb24gY3JlYXRlU3RyZWFtICh0eXBlLCBkYXRhKSB7XG4gICAgdmFyIGJ1ZmZlciA9IHN0cmVhbVBvb2wucG9wKCk7XG4gICAgaWYgKCFidWZmZXIpIHtcbiAgICAgIGJ1ZmZlciA9IG5ldyBSRUdMQnVmZmVyKHR5cGUpO1xuICAgIH1cbiAgICBidWZmZXIuYmluZCgpO1xuICAgIGluaXRCdWZmZXJGcm9tRGF0YShidWZmZXIsIGRhdGEsIEdMX1NUUkVBTV9EUkFXLCAwLCAxLCBmYWxzZSk7XG4gICAgcmV0dXJuIGJ1ZmZlclxuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveVN0cmVhbSAoc3RyZWFtJCQxKSB7XG4gICAgc3RyZWFtUG9vbC5wdXNoKHN0cmVhbSQkMSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0QnVmZmVyRnJvbVR5cGVkQXJyYXkgKGJ1ZmZlciwgZGF0YSwgdXNhZ2UpIHtcbiAgICBidWZmZXIuYnl0ZUxlbmd0aCA9IGRhdGEuYnl0ZUxlbmd0aDtcbiAgICBnbC5idWZmZXJEYXRhKGJ1ZmZlci50eXBlLCBkYXRhLCB1c2FnZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0QnVmZmVyRnJvbURhdGEgKGJ1ZmZlciwgZGF0YSwgdXNhZ2UsIGR0eXBlLCBkaW1lbnNpb24sIHBlcnNpc3QpIHtcbiAgICB2YXIgc2hhcGU7XG4gICAgYnVmZmVyLnVzYWdlID0gdXNhZ2U7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIGJ1ZmZlci5kdHlwZSA9IGR0eXBlIHx8IEdMX0ZMT0FUJDM7XG4gICAgICBpZiAoZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBmbGF0RGF0YTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YVswXSkpIHtcbiAgICAgICAgICBzaGFwZSA9IGFycmF5U2hhcGUoZGF0YSk7XG4gICAgICAgICAgdmFyIGRpbSA9IDE7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBzaGFwZS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgZGltICo9IHNoYXBlW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgICBidWZmZXIuZGltZW5zaW9uID0gZGltO1xuICAgICAgICAgIGZsYXREYXRhID0gYXJyYXlGbGF0dGVuKGRhdGEsIHNoYXBlLCBidWZmZXIuZHR5cGUpO1xuICAgICAgICAgIGluaXRCdWZmZXJGcm9tVHlwZWRBcnJheShidWZmZXIsIGZsYXREYXRhLCB1c2FnZSk7XG4gICAgICAgICAgaWYgKHBlcnNpc3QpIHtcbiAgICAgICAgICAgIGJ1ZmZlci5wZXJzaXN0ZW50RGF0YSA9IGZsYXREYXRhO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwb29sLmZyZWVUeXBlKGZsYXREYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRhdGFbMF0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgYnVmZmVyLmRpbWVuc2lvbiA9IGRpbWVuc2lvbjtcbiAgICAgICAgICB2YXIgdHlwZWREYXRhID0gcG9vbC5hbGxvY1R5cGUoYnVmZmVyLmR0eXBlLCBkYXRhLmxlbmd0aCk7XG4gICAgICAgICAgY29weUFycmF5KHR5cGVkRGF0YSwgZGF0YSk7XG4gICAgICAgICAgaW5pdEJ1ZmZlckZyb21UeXBlZEFycmF5KGJ1ZmZlciwgdHlwZWREYXRhLCB1c2FnZSk7XG4gICAgICAgICAgaWYgKHBlcnNpc3QpIHtcbiAgICAgICAgICAgIGJ1ZmZlci5wZXJzaXN0ZW50RGF0YSA9IHR5cGVkRGF0YTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9vbC5mcmVlVHlwZSh0eXBlZERhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChpc1R5cGVkQXJyYXkoZGF0YVswXSkpIHtcbiAgICAgICAgICBidWZmZXIuZGltZW5zaW9uID0gZGF0YVswXS5sZW5ndGg7XG4gICAgICAgICAgYnVmZmVyLmR0eXBlID0gZHR5cGUgfHwgdHlwZWRBcnJheUNvZGUoZGF0YVswXSkgfHwgR0xfRkxPQVQkMztcbiAgICAgICAgICBmbGF0RGF0YSA9IGFycmF5RmxhdHRlbihcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBbZGF0YS5sZW5ndGgsIGRhdGFbMF0ubGVuZ3RoXSxcbiAgICAgICAgICAgIGJ1ZmZlci5kdHlwZSk7XG4gICAgICAgICAgaW5pdEJ1ZmZlckZyb21UeXBlZEFycmF5KGJ1ZmZlciwgZmxhdERhdGEsIHVzYWdlKTtcbiAgICAgICAgICBpZiAocGVyc2lzdCkge1xuICAgICAgICAgICAgYnVmZmVyLnBlcnNpc3RlbnREYXRhID0gZmxhdERhdGE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvb2wuZnJlZVR5cGUoZmxhdERhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGVjayQxLnJhaXNlKCdpbnZhbGlkIGJ1ZmZlciBkYXRhJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzVHlwZWRBcnJheShkYXRhKSkge1xuICAgICAgYnVmZmVyLmR0eXBlID0gZHR5cGUgfHwgdHlwZWRBcnJheUNvZGUoZGF0YSk7XG4gICAgICBidWZmZXIuZGltZW5zaW9uID0gZGltZW5zaW9uO1xuICAgICAgaW5pdEJ1ZmZlckZyb21UeXBlZEFycmF5KGJ1ZmZlciwgZGF0YSwgdXNhZ2UpO1xuICAgICAgaWYgKHBlcnNpc3QpIHtcbiAgICAgICAgYnVmZmVyLnBlcnNpc3RlbnREYXRhID0gbmV3IFVpbnQ4QXJyYXkobmV3IFVpbnQ4QXJyYXkoZGF0YS5idWZmZXIpKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzTkRBcnJheUxpa2UoZGF0YSkpIHtcbiAgICAgIHNoYXBlID0gZGF0YS5zaGFwZTtcbiAgICAgIHZhciBzdHJpZGUgPSBkYXRhLnN0cmlkZTtcbiAgICAgIHZhciBvZmZzZXQgPSBkYXRhLm9mZnNldDtcblxuICAgICAgdmFyIHNoYXBlWCA9IDA7XG4gICAgICB2YXIgc2hhcGVZID0gMDtcbiAgICAgIHZhciBzdHJpZGVYID0gMDtcbiAgICAgIHZhciBzdHJpZGVZID0gMDtcbiAgICAgIGlmIChzaGFwZS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgc2hhcGVYID0gc2hhcGVbMF07XG4gICAgICAgIHNoYXBlWSA9IDE7XG4gICAgICAgIHN0cmlkZVggPSBzdHJpZGVbMF07XG4gICAgICAgIHN0cmlkZVkgPSAwO1xuICAgICAgfSBlbHNlIGlmIChzaGFwZS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgc2hhcGVYID0gc2hhcGVbMF07XG4gICAgICAgIHNoYXBlWSA9IHNoYXBlWzFdO1xuICAgICAgICBzdHJpZGVYID0gc3RyaWRlWzBdO1xuICAgICAgICBzdHJpZGVZID0gc3RyaWRlWzFdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hlY2skMS5yYWlzZSgnaW52YWxpZCBzaGFwZScpO1xuICAgICAgfVxuXG4gICAgICBidWZmZXIuZHR5cGUgPSBkdHlwZSB8fCB0eXBlZEFycmF5Q29kZShkYXRhLmRhdGEpIHx8IEdMX0ZMT0FUJDM7XG4gICAgICBidWZmZXIuZGltZW5zaW9uID0gc2hhcGVZO1xuXG4gICAgICB2YXIgdHJhbnNwb3NlRGF0YSA9IHBvb2wuYWxsb2NUeXBlKGJ1ZmZlci5kdHlwZSwgc2hhcGVYICogc2hhcGVZKTtcbiAgICAgIHRyYW5zcG9zZSh0cmFuc3Bvc2VEYXRhLFxuICAgICAgICBkYXRhLmRhdGEsXG4gICAgICAgIHNoYXBlWCwgc2hhcGVZLFxuICAgICAgICBzdHJpZGVYLCBzdHJpZGVZLFxuICAgICAgICBvZmZzZXQpO1xuICAgICAgaW5pdEJ1ZmZlckZyb21UeXBlZEFycmF5KGJ1ZmZlciwgdHJhbnNwb3NlRGF0YSwgdXNhZ2UpO1xuICAgICAgaWYgKHBlcnNpc3QpIHtcbiAgICAgICAgYnVmZmVyLnBlcnNpc3RlbnREYXRhID0gdHJhbnNwb3NlRGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvb2wuZnJlZVR5cGUodHJhbnNwb3NlRGF0YSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoZWNrJDEucmFpc2UoJ2ludmFsaWQgYnVmZmVyIGRhdGEnKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95IChidWZmZXIpIHtcbiAgICBzdGF0cy5idWZmZXJDb3VudC0tO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRyaWJ1dGVTdGF0ZS5zdGF0ZS5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHJlY29yZCA9IGF0dHJpYnV0ZVN0YXRlLnN0YXRlW2ldO1xuICAgICAgaWYgKHJlY29yZC5idWZmZXIgPT09IGJ1ZmZlcikge1xuICAgICAgICBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoaSk7XG4gICAgICAgIHJlY29yZC5idWZmZXIgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBoYW5kbGUgPSBidWZmZXIuYnVmZmVyO1xuICAgIGNoZWNrJDEoaGFuZGxlLCAnYnVmZmVyIG11c3Qgbm90IGJlIGRlbGV0ZWQgYWxyZWFkeScpO1xuICAgIGdsLmRlbGV0ZUJ1ZmZlcihoYW5kbGUpO1xuICAgIGJ1ZmZlci5idWZmZXIgPSBudWxsO1xuICAgIGRlbGV0ZSBidWZmZXJTZXRbYnVmZmVyLmlkXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAob3B0aW9ucywgdHlwZSwgZGVmZXJJbml0LCBwZXJzaXN0ZW50KSB7XG4gICAgc3RhdHMuYnVmZmVyQ291bnQrKztcblxuICAgIHZhciBidWZmZXIgPSBuZXcgUkVHTEJ1ZmZlcih0eXBlKTtcbiAgICBidWZmZXJTZXRbYnVmZmVyLmlkXSA9IGJ1ZmZlcjtcblxuICAgIGZ1bmN0aW9uIHJlZ2xCdWZmZXIgKG9wdGlvbnMpIHtcbiAgICAgIHZhciB1c2FnZSA9IEdMX1NUQVRJQ19EUkFXO1xuICAgICAgdmFyIGRhdGEgPSBudWxsO1xuICAgICAgdmFyIGJ5dGVMZW5ndGggPSAwO1xuICAgICAgdmFyIGR0eXBlID0gMDtcbiAgICAgIHZhciBkaW1lbnNpb24gPSAxO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9ucykgfHxcbiAgICAgICAgICBpc1R5cGVkQXJyYXkob3B0aW9ucykgfHxcbiAgICAgICAgICBpc05EQXJyYXlMaWtlKG9wdGlvbnMpKSB7XG4gICAgICAgIGRhdGEgPSBvcHRpb25zO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgYnl0ZUxlbmd0aCA9IG9wdGlvbnMgfCAwO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb25zKSB7XG4gICAgICAgIGNoZWNrJDEudHlwZShcbiAgICAgICAgICBvcHRpb25zLCAnb2JqZWN0JyxcbiAgICAgICAgICAnYnVmZmVyIGFyZ3VtZW50cyBtdXN0IGJlIGFuIG9iamVjdCwgYSBudW1iZXIgb3IgYW4gYXJyYXknKTtcblxuICAgICAgICBpZiAoJ2RhdGEnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICBjaGVjayQxKFxuICAgICAgICAgICAgZGF0YSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheShkYXRhKSB8fFxuICAgICAgICAgICAgaXNUeXBlZEFycmF5KGRhdGEpIHx8XG4gICAgICAgICAgICBpc05EQXJyYXlMaWtlKGRhdGEpLFxuICAgICAgICAgICAgJ2ludmFsaWQgZGF0YSBmb3IgYnVmZmVyJyk7XG4gICAgICAgICAgZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgndXNhZ2UnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICBjaGVjayQxLnBhcmFtZXRlcihvcHRpb25zLnVzYWdlLCB1c2FnZVR5cGVzLCAnaW52YWxpZCBidWZmZXIgdXNhZ2UnKTtcbiAgICAgICAgICB1c2FnZSA9IHVzYWdlVHlwZXNbb3B0aW9ucy51c2FnZV07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ3R5cGUnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICBjaGVjayQxLnBhcmFtZXRlcihvcHRpb25zLnR5cGUsIGdsVHlwZXMsICdpbnZhbGlkIGJ1ZmZlciB0eXBlJyk7XG4gICAgICAgICAgZHR5cGUgPSBnbFR5cGVzW29wdGlvbnMudHlwZV07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2RpbWVuc2lvbicgaW4gb3B0aW9ucykge1xuICAgICAgICAgIGNoZWNrJDEudHlwZShvcHRpb25zLmRpbWVuc2lvbiwgJ251bWJlcicsICdpbnZhbGlkIGRpbWVuc2lvbicpO1xuICAgICAgICAgIGRpbWVuc2lvbiA9IG9wdGlvbnMuZGltZW5zaW9uIHwgMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnbGVuZ3RoJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgY2hlY2skMS5ubmkoYnl0ZUxlbmd0aCwgJ2J1ZmZlciBsZW5ndGggbXVzdCBiZSBhIG5vbm5lZ2F0aXZlIGludGVnZXInKTtcbiAgICAgICAgICBieXRlTGVuZ3RoID0gb3B0aW9ucy5sZW5ndGggfCAwO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGJ1ZmZlci5iaW5kKCk7XG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgLy8gIzQ3NVxuICAgICAgICBpZiAoYnl0ZUxlbmd0aCkgZ2wuYnVmZmVyRGF0YShidWZmZXIudHlwZSwgYnl0ZUxlbmd0aCwgdXNhZ2UpO1xuICAgICAgICBidWZmZXIuZHR5cGUgPSBkdHlwZSB8fCBHTF9VTlNJR05FRF9CWVRFJDM7XG4gICAgICAgIGJ1ZmZlci51c2FnZSA9IHVzYWdlO1xuICAgICAgICBidWZmZXIuZGltZW5zaW9uID0gZGltZW5zaW9uO1xuICAgICAgICBidWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbml0QnVmZmVyRnJvbURhdGEoYnVmZmVyLCBkYXRhLCB1c2FnZSwgZHR5cGUsIGRpbWVuc2lvbiwgcGVyc2lzdGVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcucHJvZmlsZSkge1xuICAgICAgICBidWZmZXIuc3RhdHMuc2l6ZSA9IGJ1ZmZlci5ieXRlTGVuZ3RoICogRFRZUEVTX1NJWkVTW2J1ZmZlci5kdHlwZV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZWdsQnVmZmVyXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0U3ViRGF0YSAoZGF0YSwgb2Zmc2V0KSB7XG4gICAgICBjaGVjayQxKG9mZnNldCArIGRhdGEuYnl0ZUxlbmd0aCA8PSBidWZmZXIuYnl0ZUxlbmd0aCxcbiAgICAgICAgJ2ludmFsaWQgYnVmZmVyIHN1YmRhdGEgY2FsbCwgYnVmZmVyIGlzIHRvbyBzbWFsbC4gJyArICcgQ2FuXFwndCB3cml0ZSBkYXRhIG9mIHNpemUgJyArIGRhdGEuYnl0ZUxlbmd0aCArICcgc3RhcnRpbmcgZnJvbSBvZmZzZXQgJyArIG9mZnNldCArICcgdG8gYSBidWZmZXIgb2Ygc2l6ZSAnICsgYnVmZmVyLmJ5dGVMZW5ndGgpO1xuXG4gICAgICBnbC5idWZmZXJTdWJEYXRhKGJ1ZmZlci50eXBlLCBvZmZzZXQsIGRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN1YmRhdGEgKGRhdGEsIG9mZnNldF8pIHtcbiAgICAgIHZhciBvZmZzZXQgPSAob2Zmc2V0XyB8fCAwKSB8IDA7XG4gICAgICB2YXIgc2hhcGU7XG4gICAgICBidWZmZXIuYmluZCgpO1xuICAgICAgaWYgKGlzVHlwZWRBcnJheShkYXRhKSkge1xuICAgICAgICBzZXRTdWJEYXRhKGRhdGEsIG9mZnNldCk7XG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgZGF0YVswXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHZhciBjb252ZXJ0ZWQgPSBwb29sLmFsbG9jVHlwZShidWZmZXIuZHR5cGUsIGRhdGEubGVuZ3RoKTtcbiAgICAgICAgICAgIGNvcHlBcnJheShjb252ZXJ0ZWQsIGRhdGEpO1xuICAgICAgICAgICAgc2V0U3ViRGF0YShjb252ZXJ0ZWQsIG9mZnNldCk7XG4gICAgICAgICAgICBwb29sLmZyZWVUeXBlKGNvbnZlcnRlZCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGRhdGFbMF0pIHx8IGlzVHlwZWRBcnJheShkYXRhWzBdKSkge1xuICAgICAgICAgICAgc2hhcGUgPSBhcnJheVNoYXBlKGRhdGEpO1xuICAgICAgICAgICAgdmFyIGZsYXREYXRhID0gYXJyYXlGbGF0dGVuKGRhdGEsIHNoYXBlLCBidWZmZXIuZHR5cGUpO1xuICAgICAgICAgICAgc2V0U3ViRGF0YShmbGF0RGF0YSwgb2Zmc2V0KTtcbiAgICAgICAgICAgIHBvb2wuZnJlZVR5cGUoZmxhdERhdGEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGVjayQxLnJhaXNlKCdpbnZhbGlkIGJ1ZmZlciBkYXRhJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGlzTkRBcnJheUxpa2UoZGF0YSkpIHtcbiAgICAgICAgc2hhcGUgPSBkYXRhLnNoYXBlO1xuICAgICAgICB2YXIgc3RyaWRlID0gZGF0YS5zdHJpZGU7XG5cbiAgICAgICAgdmFyIHNoYXBlWCA9IDA7XG4gICAgICAgIHZhciBzaGFwZVkgPSAwO1xuICAgICAgICB2YXIgc3RyaWRlWCA9IDA7XG4gICAgICAgIHZhciBzdHJpZGVZID0gMDtcbiAgICAgICAgaWYgKHNoYXBlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHNoYXBlWCA9IHNoYXBlWzBdO1xuICAgICAgICAgIHNoYXBlWSA9IDE7XG4gICAgICAgICAgc3RyaWRlWCA9IHN0cmlkZVswXTtcbiAgICAgICAgICBzdHJpZGVZID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChzaGFwZS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICBzaGFwZVggPSBzaGFwZVswXTtcbiAgICAgICAgICBzaGFwZVkgPSBzaGFwZVsxXTtcbiAgICAgICAgICBzdHJpZGVYID0gc3RyaWRlWzBdO1xuICAgICAgICAgIHN0cmlkZVkgPSBzdHJpZGVbMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2hlY2skMS5yYWlzZSgnaW52YWxpZCBzaGFwZScpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkdHlwZSA9IEFycmF5LmlzQXJyYXkoZGF0YS5kYXRhKVxuICAgICAgICAgID8gYnVmZmVyLmR0eXBlXG4gICAgICAgICAgOiB0eXBlZEFycmF5Q29kZShkYXRhLmRhdGEpO1xuXG4gICAgICAgIHZhciB0cmFuc3Bvc2VEYXRhID0gcG9vbC5hbGxvY1R5cGUoZHR5cGUsIHNoYXBlWCAqIHNoYXBlWSk7XG4gICAgICAgIHRyYW5zcG9zZSh0cmFuc3Bvc2VEYXRhLFxuICAgICAgICAgIGRhdGEuZGF0YSxcbiAgICAgICAgICBzaGFwZVgsIHNoYXBlWSxcbiAgICAgICAgICBzdHJpZGVYLCBzdHJpZGVZLFxuICAgICAgICAgIGRhdGEub2Zmc2V0KTtcbiAgICAgICAgc2V0U3ViRGF0YSh0cmFuc3Bvc2VEYXRhLCBvZmZzZXQpO1xuICAgICAgICBwb29sLmZyZWVUeXBlKHRyYW5zcG9zZURhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hlY2skMS5yYWlzZSgnaW52YWxpZCBkYXRhIGZvciBidWZmZXIgc3ViZGF0YScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlZ2xCdWZmZXJcbiAgICB9XG5cbiAgICBpZiAoIWRlZmVySW5pdCkge1xuICAgICAgcmVnbEJ1ZmZlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZWdsQnVmZmVyLl9yZWdsVHlwZSA9ICdidWZmZXInO1xuICAgIHJlZ2xCdWZmZXIuX2J1ZmZlciA9IGJ1ZmZlcjtcbiAgICByZWdsQnVmZmVyLnN1YmRhdGEgPSBzdWJkYXRhO1xuICAgIGlmIChjb25maWcucHJvZmlsZSkge1xuICAgICAgcmVnbEJ1ZmZlci5zdGF0cyA9IGJ1ZmZlci5zdGF0cztcbiAgICB9XG4gICAgcmVnbEJ1ZmZlci5kZXN0cm95ID0gZnVuY3Rpb24gKCkgeyBkZXN0cm95KGJ1ZmZlcik7IH07XG5cbiAgICByZXR1cm4gcmVnbEJ1ZmZlclxuICB9XG5cbiAgZnVuY3Rpb24gcmVzdG9yZUJ1ZmZlcnMgKCkge1xuICAgIHZhbHVlcyhidWZmZXJTZXQpLmZvckVhY2goZnVuY3Rpb24gKGJ1ZmZlcikge1xuICAgICAgYnVmZmVyLmJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgICAgZ2wuYmluZEJ1ZmZlcihidWZmZXIudHlwZSwgYnVmZmVyLmJ1ZmZlcik7XG4gICAgICBnbC5idWZmZXJEYXRhKFxuICAgICAgICBidWZmZXIudHlwZSwgYnVmZmVyLnBlcnNpc3RlbnREYXRhIHx8IGJ1ZmZlci5ieXRlTGVuZ3RoLCBidWZmZXIudXNhZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKGNvbmZpZy5wcm9maWxlKSB7XG4gICAgc3RhdHMuZ2V0VG90YWxCdWZmZXJTaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRvdGFsID0gMDtcbiAgICAgIC8vIFRPRE86IFJpZ2h0IG5vdywgdGhlIHN0cmVhbXMgYXJlIG5vdCBwYXJ0IG9mIHRoZSB0b3RhbCBjb3VudC5cbiAgICAgIE9iamVjdC5rZXlzKGJ1ZmZlclNldCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHRvdGFsICs9IGJ1ZmZlclNldFtrZXldLnN0YXRzLnNpemU7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0b3RhbFxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZTogY3JlYXRlQnVmZmVyLFxuXG4gICAgY3JlYXRlU3RyZWFtOiBjcmVhdGVTdHJlYW0sXG4gICAgZGVzdHJveVN0cmVhbTogZGVzdHJveVN0cmVhbSxcblxuICAgIGNsZWFyOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YWx1ZXMoYnVmZmVyU2V0KS5mb3JFYWNoKGRlc3Ryb3kpO1xuICAgICAgc3RyZWFtUG9vbC5mb3JFYWNoKGRlc3Ryb3kpO1xuICAgIH0sXG5cbiAgICBnZXRCdWZmZXI6IGZ1bmN0aW9uICh3cmFwcGVyKSB7XG4gICAgICBpZiAod3JhcHBlciAmJiB3cmFwcGVyLl9idWZmZXIgaW5zdGFuY2VvZiBSRUdMQnVmZmVyKSB7XG4gICAgICAgIHJldHVybiB3cmFwcGVyLl9idWZmZXJcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsXG4gICAgfSxcblxuICAgIHJlc3RvcmU6IHJlc3RvcmVCdWZmZXJzLFxuXG4gICAgX2luaXRCdWZmZXI6IGluaXRCdWZmZXJGcm9tRGF0YVxuICB9XG59XG5cbnZhciBwb2ludHMgPSAwO1xudmFyIHBvaW50ID0gMDtcbnZhciBsaW5lcyA9IDE7XG52YXIgbGluZSA9IDE7XG52YXIgdHJpYW5nbGVzID0gNDtcbnZhciB0cmlhbmdsZSA9IDQ7XG52YXIgcHJpbVR5cGVzID0ge1xuXHRwb2ludHM6IHBvaW50cyxcblx0cG9pbnQ6IHBvaW50LFxuXHRsaW5lczogbGluZXMsXG5cdGxpbmU6IGxpbmUsXG5cdHRyaWFuZ2xlczogdHJpYW5nbGVzLFxuXHR0cmlhbmdsZTogdHJpYW5nbGUsXG5cdFwibGluZSBsb29wXCI6IDIsXG5cdFwibGluZSBzdHJpcFwiOiAzLFxuXHRcInRyaWFuZ2xlIHN0cmlwXCI6IDUsXG5cdFwidHJpYW5nbGUgZmFuXCI6IDZcbn07XG5cbnZhciBHTF9QT0lOVFMgPSAwO1xudmFyIEdMX0xJTkVTID0gMTtcbnZhciBHTF9UUklBTkdMRVMgPSA0O1xuXG52YXIgR0xfQllURSQyID0gNTEyMDtcbnZhciBHTF9VTlNJR05FRF9CWVRFJDQgPSA1MTIxO1xudmFyIEdMX1NIT1JUJDIgPSA1MTIyO1xudmFyIEdMX1VOU0lHTkVEX1NIT1JUJDIgPSA1MTIzO1xudmFyIEdMX0lOVCQyID0gNTEyNDtcbnZhciBHTF9VTlNJR05FRF9JTlQkMiA9IDUxMjU7XG5cbnZhciBHTF9FTEVNRU5UX0FSUkFZX0JVRkZFUiA9IDM0OTYzO1xuXG52YXIgR0xfU1RSRUFNX0RSQVckMSA9IDB4ODhFMDtcbnZhciBHTF9TVEFUSUNfRFJBVyQxID0gMHg4OEU0O1xuXG5mdW5jdGlvbiB3cmFwRWxlbWVudHNTdGF0ZSAoZ2wsIGV4dGVuc2lvbnMsIGJ1ZmZlclN0YXRlLCBzdGF0cykge1xuICB2YXIgZWxlbWVudFNldCA9IHt9O1xuICB2YXIgZWxlbWVudENvdW50ID0gMDtcblxuICB2YXIgZWxlbWVudFR5cGVzID0ge1xuICAgICd1aW50OCc6IEdMX1VOU0lHTkVEX0JZVEUkNCxcbiAgICAndWludDE2JzogR0xfVU5TSUdORURfU0hPUlQkMlxuICB9O1xuXG4gIGlmIChleHRlbnNpb25zLm9lc19lbGVtZW50X2luZGV4X3VpbnQpIHtcbiAgICBlbGVtZW50VHlwZXMudWludDMyID0gR0xfVU5TSUdORURfSU5UJDI7XG4gIH1cblxuICBmdW5jdGlvbiBSRUdMRWxlbWVudEJ1ZmZlciAoYnVmZmVyKSB7XG4gICAgdGhpcy5pZCA9IGVsZW1lbnRDb3VudCsrO1xuICAgIGVsZW1lbnRTZXRbdGhpcy5pZF0gPSB0aGlzO1xuICAgIHRoaXMuYnVmZmVyID0gYnVmZmVyO1xuICAgIHRoaXMucHJpbVR5cGUgPSBHTF9UUklBTkdMRVM7XG4gICAgdGhpcy52ZXJ0Q291bnQgPSAwO1xuICAgIHRoaXMudHlwZSA9IDA7XG4gIH1cblxuICBSRUdMRWxlbWVudEJ1ZmZlci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmJ1ZmZlci5iaW5kKCk7XG4gIH07XG5cbiAgdmFyIGJ1ZmZlclBvb2wgPSBbXTtcblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50U3RyZWFtIChkYXRhKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJ1ZmZlclBvb2wucG9wKCk7XG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIHJlc3VsdCA9IG5ldyBSRUdMRWxlbWVudEJ1ZmZlcihidWZmZXJTdGF0ZS5jcmVhdGUoXG4gICAgICAgIG51bGwsXG4gICAgICAgIEdMX0VMRU1FTlRfQVJSQVlfQlVGRkVSLFxuICAgICAgICB0cnVlLFxuICAgICAgICBmYWxzZSkuX2J1ZmZlcik7XG4gICAgfVxuICAgIGluaXRFbGVtZW50cyhyZXN1bHQsIGRhdGEsIEdMX1NUUkVBTV9EUkFXJDEsIC0xLCAtMSwgMCwgMCk7XG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveUVsZW1lbnRTdHJlYW0gKGVsZW1lbnRzKSB7XG4gICAgYnVmZmVyUG9vbC5wdXNoKGVsZW1lbnRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRFbGVtZW50cyAoXG4gICAgZWxlbWVudHMsXG4gICAgZGF0YSxcbiAgICB1c2FnZSxcbiAgICBwcmltLFxuICAgIGNvdW50LFxuICAgIGJ5dGVMZW5ndGgsXG4gICAgdHlwZSkge1xuICAgIGVsZW1lbnRzLmJ1ZmZlci5iaW5kKCk7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHZhciBwcmVkaWN0ZWRUeXBlID0gdHlwZTtcbiAgICAgIGlmICghdHlwZSAmJiAoXG4gICAgICAgICAgIWlzVHlwZWRBcnJheShkYXRhKSB8fFxuICAgICAgICAgKGlzTkRBcnJheUxpa2UoZGF0YSkgJiYgIWlzVHlwZWRBcnJheShkYXRhLmRhdGEpKSkpIHtcbiAgICAgICAgcHJlZGljdGVkVHlwZSA9IGV4dGVuc2lvbnMub2VzX2VsZW1lbnRfaW5kZXhfdWludFxuICAgICAgICAgID8gR0xfVU5TSUdORURfSU5UJDJcbiAgICAgICAgICA6IEdMX1VOU0lHTkVEX1NIT1JUJDI7XG4gICAgICB9XG4gICAgICBidWZmZXJTdGF0ZS5faW5pdEJ1ZmZlcihcbiAgICAgICAgZWxlbWVudHMuYnVmZmVyLFxuICAgICAgICBkYXRhLFxuICAgICAgICB1c2FnZSxcbiAgICAgICAgcHJlZGljdGVkVHlwZSxcbiAgICAgICAgMyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsLmJ1ZmZlckRhdGEoR0xfRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGJ5dGVMZW5ndGgsIHVzYWdlKTtcbiAgICAgIGVsZW1lbnRzLmJ1ZmZlci5kdHlwZSA9IGR0eXBlIHx8IEdMX1VOU0lHTkVEX0JZVEUkNDtcbiAgICAgIGVsZW1lbnRzLmJ1ZmZlci51c2FnZSA9IHVzYWdlO1xuICAgICAgZWxlbWVudHMuYnVmZmVyLmRpbWVuc2lvbiA9IDM7XG4gICAgICBlbGVtZW50cy5idWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGg7XG4gICAgfVxuXG4gICAgdmFyIGR0eXBlID0gdHlwZTtcbiAgICBpZiAoIXR5cGUpIHtcbiAgICAgIHN3aXRjaCAoZWxlbWVudHMuYnVmZmVyLmR0eXBlKSB7XG4gICAgICAgIGNhc2UgR0xfVU5TSUdORURfQllURSQ0OlxuICAgICAgICBjYXNlIEdMX0JZVEUkMjpcbiAgICAgICAgICBkdHlwZSA9IEdMX1VOU0lHTkVEX0JZVEUkNDtcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgR0xfVU5TSUdORURfU0hPUlQkMjpcbiAgICAgICAgY2FzZSBHTF9TSE9SVCQyOlxuICAgICAgICAgIGR0eXBlID0gR0xfVU5TSUdORURfU0hPUlQkMjtcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgR0xfVU5TSUdORURfSU5UJDI6XG4gICAgICAgIGNhc2UgR0xfSU5UJDI6XG4gICAgICAgICAgZHR5cGUgPSBHTF9VTlNJR05FRF9JTlQkMjtcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY2hlY2skMS5yYWlzZSgndW5zdXBwb3J0ZWQgdHlwZSBmb3IgZWxlbWVudCBhcnJheScpO1xuICAgICAgfVxuICAgICAgZWxlbWVudHMuYnVmZmVyLmR0eXBlID0gZHR5cGU7XG4gICAgfVxuICAgIGVsZW1lbnRzLnR5cGUgPSBkdHlwZTtcblxuICAgIC8vIENoZWNrIG9lc19lbGVtZW50X2luZGV4X3VpbnQgZXh0ZW5zaW9uXG4gICAgY2hlY2skMShcbiAgICAgIGR0eXBlICE9PSBHTF9VTlNJR05FRF9JTlQkMiB8fFxuICAgICAgISFleHRlbnNpb25zLm9lc19lbGVtZW50X2luZGV4X3VpbnQsXG4gICAgICAnMzIgYml0IGVsZW1lbnQgYnVmZmVycyBub3Qgc3VwcG9ydGVkLCBlbmFibGUgb2VzX2VsZW1lbnRfaW5kZXhfdWludCBmaXJzdCcpO1xuXG4gICAgLy8gdHJ5IHRvIGd1ZXNzIGRlZmF1bHQgcHJpbWl0aXZlIHR5cGUgYW5kIGFyZ3VtZW50c1xuICAgIHZhciB2ZXJ0Q291bnQgPSBjb3VudDtcbiAgICBpZiAodmVydENvdW50IDwgMCkge1xuICAgICAgdmVydENvdW50ID0gZWxlbWVudHMuYnVmZmVyLmJ5dGVMZW5ndGg7XG4gICAgICBpZiAoZHR5cGUgPT09IEdMX1VOU0lHTkVEX1NIT1JUJDIpIHtcbiAgICAgICAgdmVydENvdW50ID4+PSAxO1xuICAgICAgfSBlbHNlIGlmIChkdHlwZSA9PT0gR0xfVU5TSUdORURfSU5UJDIpIHtcbiAgICAgICAgdmVydENvdW50ID4+PSAyO1xuICAgICAgfVxuICAgIH1cbiAgICBlbGVtZW50cy52ZXJ0Q291bnQgPSB2ZXJ0Q291bnQ7XG5cbiAgICAvLyB0cnkgdG8gZ3Vlc3MgcHJpbWl0aXZlIHR5cGUgZnJvbSBjZWxsIGRpbWVuc2lvblxuICAgIHZhciBwcmltVHlwZSA9IHByaW07XG4gICAgaWYgKHByaW0gPCAwKSB7XG4gICAgICBwcmltVHlwZSA9IEdMX1RSSUFOR0xFUztcbiAgICAgIHZhciBkaW1lbnNpb24gPSBlbGVtZW50cy5idWZmZXIuZGltZW5zaW9uO1xuICAgICAgaWYgKGRpbWVuc2lvbiA9PT0gMSkgcHJpbVR5cGUgPSBHTF9QT0lOVFM7XG4gICAgICBpZiAoZGltZW5zaW9uID09PSAyKSBwcmltVHlwZSA9IEdMX0xJTkVTO1xuICAgICAgaWYgKGRpbWVuc2lvbiA9PT0gMykgcHJpbVR5cGUgPSBHTF9UUklBTkdMRVM7XG4gICAgfVxuICAgIGVsZW1lbnRzLnByaW1UeXBlID0gcHJpbVR5cGU7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95RWxlbWVudHMgKGVsZW1lbnRzKSB7XG4gICAgc3RhdHMuZWxlbWVudHNDb3VudC0tO1xuXG4gICAgY2hlY2skMShlbGVtZW50cy5idWZmZXIgIT09IG51bGwsICdtdXN0IG5vdCBkb3VibGUgZGVzdHJveSBlbGVtZW50cycpO1xuICAgIGRlbGV0ZSBlbGVtZW50U2V0W2VsZW1lbnRzLmlkXTtcbiAgICBlbGVtZW50cy5idWZmZXIuZGVzdHJveSgpO1xuICAgIGVsZW1lbnRzLmJ1ZmZlciA9IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50cyAob3B0aW9ucywgcGVyc2lzdGVudCkge1xuICAgIHZhciBidWZmZXIgPSBidWZmZXJTdGF0ZS5jcmVhdGUobnVsbCwgR0xfRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHRydWUpO1xuICAgIHZhciBlbGVtZW50cyA9IG5ldyBSRUdMRWxlbWVudEJ1ZmZlcihidWZmZXIuX2J1ZmZlcik7XG4gICAgc3RhdHMuZWxlbWVudHNDb3VudCsrO1xuXG4gICAgZnVuY3Rpb24gcmVnbEVsZW1lbnRzIChvcHRpb25zKSB7XG4gICAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgICAgYnVmZmVyKCk7XG4gICAgICAgIGVsZW1lbnRzLnByaW1UeXBlID0gR0xfVFJJQU5HTEVTO1xuICAgICAgICBlbGVtZW50cy52ZXJ0Q291bnQgPSAwO1xuICAgICAgICBlbGVtZW50cy50eXBlID0gR0xfVU5TSUdORURfQllURSQ0O1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgYnVmZmVyKG9wdGlvbnMpO1xuICAgICAgICBlbGVtZW50cy5wcmltVHlwZSA9IEdMX1RSSUFOR0xFUztcbiAgICAgICAgZWxlbWVudHMudmVydENvdW50ID0gb3B0aW9ucyB8IDA7XG4gICAgICAgIGVsZW1lbnRzLnR5cGUgPSBHTF9VTlNJR05FRF9CWVRFJDQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZGF0YSA9IG51bGw7XG4gICAgICAgIHZhciB1c2FnZSA9IEdMX1NUQVRJQ19EUkFXJDE7XG4gICAgICAgIHZhciBwcmltVHlwZSA9IC0xO1xuICAgICAgICB2YXIgdmVydENvdW50ID0gLTE7XG4gICAgICAgIHZhciBieXRlTGVuZ3RoID0gMDtcbiAgICAgICAgdmFyIGR0eXBlID0gMDtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9ucykgfHxcbiAgICAgICAgICAgIGlzVHlwZWRBcnJheShvcHRpb25zKSB8fFxuICAgICAgICAgICAgaXNOREFycmF5TGlrZShvcHRpb25zKSkge1xuICAgICAgICAgIGRhdGEgPSBvcHRpb25zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNoZWNrJDEudHlwZShvcHRpb25zLCAnb2JqZWN0JywgJ2ludmFsaWQgYXJndW1lbnRzIGZvciBlbGVtZW50cycpO1xuICAgICAgICAgIGlmICgnZGF0YScgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICAgICAgICAgIGNoZWNrJDEoXG4gICAgICAgICAgICAgICAgQXJyYXkuaXNBcnJheShkYXRhKSB8fFxuICAgICAgICAgICAgICAgIGlzVHlwZWRBcnJheShkYXRhKSB8fFxuICAgICAgICAgICAgICAgIGlzTkRBcnJheUxpa2UoZGF0YSksXG4gICAgICAgICAgICAgICAgJ2ludmFsaWQgZGF0YSBmb3IgZWxlbWVudCBidWZmZXInKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCd1c2FnZScgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgY2hlY2skMS5wYXJhbWV0ZXIoXG4gICAgICAgICAgICAgIG9wdGlvbnMudXNhZ2UsXG4gICAgICAgICAgICAgIHVzYWdlVHlwZXMsXG4gICAgICAgICAgICAgICdpbnZhbGlkIGVsZW1lbnQgYnVmZmVyIHVzYWdlJyk7XG4gICAgICAgICAgICB1c2FnZSA9IHVzYWdlVHlwZXNbb3B0aW9ucy51c2FnZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgncHJpbWl0aXZlJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICBjaGVjayQxLnBhcmFtZXRlcihcbiAgICAgICAgICAgICAgb3B0aW9ucy5wcmltaXRpdmUsXG4gICAgICAgICAgICAgIHByaW1UeXBlcyxcbiAgICAgICAgICAgICAgJ2ludmFsaWQgZWxlbWVudCBidWZmZXIgcHJpbWl0aXZlJyk7XG4gICAgICAgICAgICBwcmltVHlwZSA9IHByaW1UeXBlc1tvcHRpb25zLnByaW1pdGl2ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgnY291bnQnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNoZWNrJDEoXG4gICAgICAgICAgICAgIHR5cGVvZiBvcHRpb25zLmNvdW50ID09PSAnbnVtYmVyJyAmJiBvcHRpb25zLmNvdW50ID49IDAsXG4gICAgICAgICAgICAgICdpbnZhbGlkIHZlcnRleCBjb3VudCBmb3IgZWxlbWVudHMnKTtcbiAgICAgICAgICAgIHZlcnRDb3VudCA9IG9wdGlvbnMuY291bnQgfCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoJ3R5cGUnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNoZWNrJDEucGFyYW1ldGVyKFxuICAgICAgICAgICAgICBvcHRpb25zLnR5cGUsXG4gICAgICAgICAgICAgIGVsZW1lbnRUeXBlcyxcbiAgICAgICAgICAgICAgJ2ludmFsaWQgYnVmZmVyIHR5cGUnKTtcbiAgICAgICAgICAgIGR0eXBlID0gZWxlbWVudFR5cGVzW29wdGlvbnMudHlwZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgnbGVuZ3RoJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICBieXRlTGVuZ3RoID0gb3B0aW9ucy5sZW5ndGggfCAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBieXRlTGVuZ3RoID0gdmVydENvdW50O1xuICAgICAgICAgICAgaWYgKGR0eXBlID09PSBHTF9VTlNJR05FRF9TSE9SVCQyIHx8IGR0eXBlID09PSBHTF9TSE9SVCQyKSB7XG4gICAgICAgICAgICAgIGJ5dGVMZW5ndGggKj0gMjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZHR5cGUgPT09IEdMX1VOU0lHTkVEX0lOVCQyIHx8IGR0eXBlID09PSBHTF9JTlQkMikge1xuICAgICAgICAgICAgICBieXRlTGVuZ3RoICo9IDQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGluaXRFbGVtZW50cyhcbiAgICAgICAgICBlbGVtZW50cyxcbiAgICAgICAgICBkYXRhLFxuICAgICAgICAgIHVzYWdlLFxuICAgICAgICAgIHByaW1UeXBlLFxuICAgICAgICAgIHZlcnRDb3VudCxcbiAgICAgICAgICBieXRlTGVuZ3RoLFxuICAgICAgICAgIGR0eXBlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlZ2xFbGVtZW50c1xuICAgIH1cblxuICAgIHJlZ2xFbGVtZW50cyhvcHRpb25zKTtcblxuICAgIHJlZ2xFbGVtZW50cy5fcmVnbFR5cGUgPSAnZWxlbWVudHMnO1xuICAgIHJlZ2xFbGVtZW50cy5fZWxlbWVudHMgPSBlbGVtZW50cztcbiAgICByZWdsRWxlbWVudHMuc3ViZGF0YSA9IGZ1bmN0aW9uIChkYXRhLCBvZmZzZXQpIHtcbiAgICAgIGJ1ZmZlci5zdWJkYXRhKGRhdGEsIG9mZnNldCk7XG4gICAgICByZXR1cm4gcmVnbEVsZW1lbnRzXG4gICAgfTtcbiAgICByZWdsRWxlbWVudHMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGRlc3Ryb3lFbGVtZW50cyhlbGVtZW50cyk7XG4gICAgfTtcblxuICAgIHJldHVybiByZWdsRWxlbWVudHNcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY3JlYXRlOiBjcmVhdGVFbGVtZW50cyxcbiAgICBjcmVhdGVTdHJlYW06IGNyZWF0ZUVsZW1lbnRTdHJlYW0sXG4gICAgZGVzdHJveVN0cmVhbTogZGVzdHJveUVsZW1lbnRTdHJlYW0sXG4gICAgZ2V0RWxlbWVudHM6IGZ1bmN0aW9uIChlbGVtZW50cykge1xuICAgICAgaWYgKHR5cGVvZiBlbGVtZW50cyA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAgIGVsZW1lbnRzLl9lbGVtZW50cyBpbnN0YW5jZW9mIFJFR0xFbGVtZW50QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50cy5fZWxlbWVudHNcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsXG4gICAgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24gKCkge1xuICAgICAgdmFsdWVzKGVsZW1lbnRTZXQpLmZvckVhY2goZGVzdHJveUVsZW1lbnRzKTtcbiAgICB9XG4gIH1cbn1cblxudmFyIEZMT0FUID0gbmV3IEZsb2F0MzJBcnJheSgxKTtcbnZhciBJTlQgPSBuZXcgVWludDMyQXJyYXkoRkxPQVQuYnVmZmVyKTtcblxudmFyIEdMX1VOU0lHTkVEX1NIT1JUJDQgPSA1MTIzO1xuXG5mdW5jdGlvbiBjb252ZXJ0VG9IYWxmRmxvYXQgKGFycmF5KSB7XG4gIHZhciB1c2hvcnRzID0gcG9vbC5hbGxvY1R5cGUoR0xfVU5TSUdORURfU0hPUlQkNCwgYXJyYXkubGVuZ3RoKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKGlzTmFOKGFycmF5W2ldKSkge1xuICAgICAgdXNob3J0c1tpXSA9IDB4ZmZmZjtcbiAgICB9IGVsc2UgaWYgKGFycmF5W2ldID09PSBJbmZpbml0eSkge1xuICAgICAgdXNob3J0c1tpXSA9IDB4N2MwMDtcbiAgICB9IGVsc2UgaWYgKGFycmF5W2ldID09PSAtSW5maW5pdHkpIHtcbiAgICAgIHVzaG9ydHNbaV0gPSAweGZjMDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIEZMT0FUWzBdID0gYXJyYXlbaV07XG4gICAgICB2YXIgeCA9IElOVFswXTtcblxuICAgICAgdmFyIHNnbiA9ICh4ID4+PiAzMSkgPDwgMTU7XG4gICAgICB2YXIgZXhwID0gKCh4IDw8IDEpID4+PiAyNCkgLSAxMjc7XG4gICAgICB2YXIgZnJhYyA9ICh4ID4+IDEzKSAmICgoMSA8PCAxMCkgLSAxKTtcblxuICAgICAgaWYgKGV4cCA8IC0yNCkge1xuICAgICAgICAvLyByb3VuZCBub24tcmVwcmVzZW50YWJsZSBkZW5vcm1hbHMgdG8gMFxuICAgICAgICB1c2hvcnRzW2ldID0gc2duO1xuICAgICAgfSBlbHNlIGlmIChleHAgPCAtMTQpIHtcbiAgICAgICAgLy8gaGFuZGxlIGRlbm9ybWFsc1xuICAgICAgICB2YXIgcyA9IC0xNCAtIGV4cDtcbiAgICAgICAgdXNob3J0c1tpXSA9IHNnbiArICgoZnJhYyArICgxIDw8IDEwKSkgPj4gcyk7XG4gICAgICB9IGVsc2UgaWYgKGV4cCA+IDE1KSB7XG4gICAgICAgIC8vIHJvdW5kIG92ZXJmbG93IHRvICsvLSBJbmZpbml0eVxuICAgICAgICB1c2hvcnRzW2ldID0gc2duICsgMHg3YzAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gb3RoZXJ3aXNlIGNvbnZlcnQgZGlyZWN0bHlcbiAgICAgICAgdXNob3J0c1tpXSA9IHNnbiArICgoZXhwICsgMTUpIDw8IDEwKSArIGZyYWM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHVzaG9ydHNcbn1cblxuZnVuY3Rpb24gaXNBcnJheUxpa2UgKHMpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkocykgfHwgaXNUeXBlZEFycmF5KHMpXG59XG5cbnZhciBpc1BvdzIkMSA9IGZ1bmN0aW9uICh2KSB7XG4gIHJldHVybiAhKHYgJiAodiAtIDEpKSAmJiAoISF2KVxufTtcblxudmFyIEdMX0NPTVBSRVNTRURfVEVYVFVSRV9GT1JNQVRTID0gMHg4NkEzO1xuXG52YXIgR0xfVEVYVFVSRV8yRCQxID0gMHgwREUxO1xudmFyIEdMX1RFWFRVUkVfQ1VCRV9NQVAkMSA9IDB4ODUxMztcbnZhciBHTF9URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1gkMSA9IDB4ODUxNTtcblxudmFyIEdMX1JHQkEkMSA9IDB4MTkwODtcbnZhciBHTF9BTFBIQSA9IDB4MTkwNjtcbnZhciBHTF9SR0IgPSAweDE5MDc7XG52YXIgR0xfTFVNSU5BTkNFID0gMHgxOTA5O1xudmFyIEdMX0xVTUlOQU5DRV9BTFBIQSA9IDB4MTkwQTtcblxudmFyIEdMX1JHQkE0ID0gMHg4MDU2O1xudmFyIEdMX1JHQjVfQTEgPSAweDgwNTc7XG52YXIgR0xfUkdCNTY1ID0gMHg4RDYyO1xuXG52YXIgR0xfVU5TSUdORURfU0hPUlRfNF80XzRfNCQxID0gMHg4MDMzO1xudmFyIEdMX1VOU0lHTkVEX1NIT1JUXzVfNV81XzEkMSA9IDB4ODAzNDtcbnZhciBHTF9VTlNJR05FRF9TSE9SVF81XzZfNSQxID0gMHg4MzYzO1xudmFyIEdMX1VOU0lHTkVEX0lOVF8yNF84X1dFQkdMJDEgPSAweDg0RkE7XG5cbnZhciBHTF9ERVBUSF9DT01QT05FTlQgPSAweDE5MDI7XG52YXIgR0xfREVQVEhfU1RFTkNJTCA9IDB4ODRGOTtcblxudmFyIEdMX1NSR0JfRVhUID0gMHg4QzQwO1xudmFyIEdMX1NSR0JfQUxQSEFfRVhUID0gMHg4QzQyO1xuXG52YXIgR0xfSEFMRl9GTE9BVF9PRVMkMSA9IDB4OEQ2MTtcblxudmFyIEdMX0NPTVBSRVNTRURfUkdCX1MzVENfRFhUMV9FWFQgPSAweDgzRjA7XG52YXIgR0xfQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUMV9FWFQgPSAweDgzRjE7XG52YXIgR0xfQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUM19FWFQgPSAweDgzRjI7XG52YXIgR0xfQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUNV9FWFQgPSAweDgzRjM7XG5cbnZhciBHTF9DT01QUkVTU0VEX1JHQl9BVENfV0VCR0wgPSAweDhDOTI7XG52YXIgR0xfQ09NUFJFU1NFRF9SR0JBX0FUQ19FWFBMSUNJVF9BTFBIQV9XRUJHTCA9IDB4OEM5MztcbnZhciBHTF9DT01QUkVTU0VEX1JHQkFfQVRDX0lOVEVSUE9MQVRFRF9BTFBIQV9XRUJHTCA9IDB4ODdFRTtcblxudmFyIEdMX0NPTVBSRVNTRURfUkdCX1BWUlRDXzRCUFBWMV9JTUcgPSAweDhDMDA7XG52YXIgR0xfQ09NUFJFU1NFRF9SR0JfUFZSVENfMkJQUFYxX0lNRyA9IDB4OEMwMTtcbnZhciBHTF9DT01QUkVTU0VEX1JHQkFfUFZSVENfNEJQUFYxX0lNRyA9IDB4OEMwMjtcbnZhciBHTF9DT01QUkVTU0VEX1JHQkFfUFZSVENfMkJQUFYxX0lNRyA9IDB4OEMwMztcblxudmFyIEdMX0NPTVBSRVNTRURfUkdCX0VUQzFfV0VCR0wgPSAweDhENjQ7XG5cbnZhciBHTF9VTlNJR05FRF9CWVRFJDUgPSAweDE0MDE7XG52YXIgR0xfVU5TSUdORURfU0hPUlQkMyA9IDB4MTQwMztcbnZhciBHTF9VTlNJR05FRF9JTlQkMyA9IDB4MTQwNTtcbnZhciBHTF9GTE9BVCQ0ID0gMHgxNDA2O1xuXG52YXIgR0xfVEVYVFVSRV9XUkFQX1MgPSAweDI4MDI7XG52YXIgR0xfVEVYVFVSRV9XUkFQX1QgPSAweDI4MDM7XG5cbnZhciBHTF9SRVBFQVQgPSAweDI5MDE7XG52YXIgR0xfQ0xBTVBfVE9fRURHRSQxID0gMHg4MTJGO1xudmFyIEdMX01JUlJPUkVEX1JFUEVBVCA9IDB4ODM3MDtcblxudmFyIEdMX1RFWFRVUkVfTUFHX0ZJTFRFUiA9IDB4MjgwMDtcbnZhciBHTF9URVhUVVJFX01JTl9GSUxURVIgPSAweDI4MDE7XG5cbnZhciBHTF9ORUFSRVNUJDEgPSAweDI2MDA7XG52YXIgR0xfTElORUFSID0gMHgyNjAxO1xudmFyIEdMX05FQVJFU1RfTUlQTUFQX05FQVJFU1QkMSA9IDB4MjcwMDtcbnZhciBHTF9MSU5FQVJfTUlQTUFQX05FQVJFU1QkMSA9IDB4MjcwMTtcbnZhciBHTF9ORUFSRVNUX01JUE1BUF9MSU5FQVIkMSA9IDB4MjcwMjtcbnZhciBHTF9MSU5FQVJfTUlQTUFQX0xJTkVBUiQxID0gMHgyNzAzO1xuXG52YXIgR0xfR0VORVJBVEVfTUlQTUFQX0hJTlQgPSAweDgxOTI7XG52YXIgR0xfRE9OVF9DQVJFID0gMHgxMTAwO1xudmFyIEdMX0ZBU1RFU1QgPSAweDExMDE7XG52YXIgR0xfTklDRVNUID0gMHgxMTAyO1xuXG52YXIgR0xfVEVYVFVSRV9NQVhfQU5JU09UUk9QWV9FWFQgPSAweDg0RkU7XG5cbnZhciBHTF9VTlBBQ0tfQUxJR05NRU5UID0gMHgwQ0Y1O1xudmFyIEdMX1VOUEFDS19GTElQX1lfV0VCR0wgPSAweDkyNDA7XG52YXIgR0xfVU5QQUNLX1BSRU1VTFRJUExZX0FMUEhBX1dFQkdMID0gMHg5MjQxO1xudmFyIEdMX1VOUEFDS19DT0xPUlNQQUNFX0NPTlZFUlNJT05fV0VCR0wgPSAweDkyNDM7XG5cbnZhciBHTF9CUk9XU0VSX0RFRkFVTFRfV0VCR0wgPSAweDkyNDQ7XG5cbnZhciBHTF9URVhUVVJFMCQxID0gMHg4NEMwO1xuXG52YXIgTUlQTUFQX0ZJTFRFUlMgPSBbXG4gIEdMX05FQVJFU1RfTUlQTUFQX05FQVJFU1QkMSxcbiAgR0xfTkVBUkVTVF9NSVBNQVBfTElORUFSJDEsXG4gIEdMX0xJTkVBUl9NSVBNQVBfTkVBUkVTVCQxLFxuICBHTF9MSU5FQVJfTUlQTUFQX0xJTkVBUiQxXG5dO1xuXG52YXIgQ0hBTk5FTFNfRk9STUFUID0gW1xuICAwLFxuICBHTF9MVU1JTkFOQ0UsXG4gIEdMX0xVTUlOQU5DRV9BTFBIQSxcbiAgR0xfUkdCLFxuICBHTF9SR0JBJDFcbl07XG5cbnZhciBGT1JNQVRfQ0hBTk5FTFMgPSB7fTtcbkZPUk1BVF9DSEFOTkVMU1tHTF9MVU1JTkFOQ0VdID1cbkZPUk1BVF9DSEFOTkVMU1tHTF9BTFBIQV0gPVxuRk9STUFUX0NIQU5ORUxTW0dMX0RFUFRIX0NPTVBPTkVOVF0gPSAxO1xuRk9STUFUX0NIQU5ORUxTW0dMX0RFUFRIX1NURU5DSUxdID1cbkZPUk1BVF9DSEFOTkVMU1tHTF9MVU1JTkFOQ0VfQUxQSEFdID0gMjtcbkZPUk1BVF9DSEFOTkVMU1tHTF9SR0JdID1cbkZPUk1BVF9DSEFOTkVMU1tHTF9TUkdCX0VYVF0gPSAzO1xuRk9STUFUX0NIQU5ORUxTW0dMX1JHQkEkMV0gPVxuRk9STUFUX0NIQU5ORUxTW0dMX1NSR0JfQUxQSEFfRVhUXSA9IDQ7XG5cbmZ1bmN0aW9uIG9iamVjdE5hbWUgKHN0cikge1xuICByZXR1cm4gJ1tvYmplY3QgJyArIHN0ciArICddJ1xufVxuXG52YXIgQ0FOVkFTX0NMQVNTID0gb2JqZWN0TmFtZSgnSFRNTENhbnZhc0VsZW1lbnQnKTtcbnZhciBDT05URVhUMkRfQ0xBU1MgPSBvYmplY3ROYW1lKCdDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQnKTtcbnZhciBCSVRNQVBfQ0xBU1MgPSBvYmplY3ROYW1lKCdJbWFnZUJpdG1hcCcpO1xudmFyIElNQUdFX0NMQVNTID0gb2JqZWN0TmFtZSgnSFRNTEltYWdlRWxlbWVudCcpO1xudmFyIFZJREVPX0NMQVNTID0gb2JqZWN0TmFtZSgnSFRNTFZpZGVvRWxlbWVudCcpO1xuXG52YXIgUElYRUxfQ0xBU1NFUyA9IE9iamVjdC5rZXlzKGFycmF5VHlwZXMpLmNvbmNhdChbXG4gIENBTlZBU19DTEFTUyxcbiAgQ09OVEVYVDJEX0NMQVNTLFxuICBCSVRNQVBfQ0xBU1MsXG4gIElNQUdFX0NMQVNTLFxuICBWSURFT19DTEFTU1xuXSk7XG5cbi8vIGZvciBldmVyeSB0ZXh0dXJlIHR5cGUsIHN0b3JlXG4vLyB0aGUgc2l6ZSBpbiBieXRlcy5cbnZhciBUWVBFX1NJWkVTID0gW107XG5UWVBFX1NJWkVTW0dMX1VOU0lHTkVEX0JZVEUkNV0gPSAxO1xuVFlQRV9TSVpFU1tHTF9GTE9BVCQ0XSA9IDQ7XG5UWVBFX1NJWkVTW0dMX0hBTEZfRkxPQVRfT0VTJDFdID0gMjtcblxuVFlQRV9TSVpFU1tHTF9VTlNJR05FRF9TSE9SVCQzXSA9IDI7XG5UWVBFX1NJWkVTW0dMX1VOU0lHTkVEX0lOVCQzXSA9IDQ7XG5cbnZhciBGT1JNQVRfU0laRVNfU1BFQ0lBTCA9IFtdO1xuRk9STUFUX1NJWkVTX1NQRUNJQUxbR0xfUkdCQTRdID0gMjtcbkZPUk1BVF9TSVpFU19TUEVDSUFMW0dMX1JHQjVfQTFdID0gMjtcbkZPUk1BVF9TSVpFU19TUEVDSUFMW0dMX1JHQjU2NV0gPSAyO1xuRk9STUFUX1NJWkVTX1NQRUNJQUxbR0xfREVQVEhfU1RFTkNJTF0gPSA0O1xuXG5GT1JNQVRfU0laRVNfU1BFQ0lBTFtHTF9DT01QUkVTU0VEX1JHQl9TM1RDX0RYVDFfRVhUXSA9IDAuNTtcbkZPUk1BVF9TSVpFU19TUEVDSUFMW0dMX0NPTVBSRVNTRURfUkdCQV9TM1RDX0RYVDFfRVhUXSA9IDAuNTtcbkZPUk1BVF9TSVpFU19TUEVDSUFMW0dMX0NPTVBSRVNTRURfUkdCQV9TM1RDX0RYVDNfRVhUXSA9IDE7XG5GT1JNQVRfU0laRVNfU1BFQ0lBTFtHTF9DT01QUkVTU0VEX1JHQkFfUzNUQ19EWFQ1X0VYVF0gPSAxO1xuXG5GT1JNQVRfU0laRVNfU1BFQ0lBTFtHTF9DT01QUkVTU0VEX1JHQl9BVENfV0VCR0xdID0gMC41O1xuRk9STUFUX1NJWkVTX1NQRUNJQUxbR0xfQ09NUFJFU1NFRF9SR0JBX0FUQ19FWFBMSUNJVF9BTFBIQV9XRUJHTF0gPSAxO1xuRk9STUFUX1NJWkVTX1NQRUNJQUxbR0xfQ09NUFJFU1NFRF9SR0JBX0FUQ19JTlRFUlBPTEFURURfQUxQSEFfV0VCR0xdID0gMTtcblxuRk9STUFUX1NJWkVTX1NQRUNJQUxbR0xfQ09NUFJFU1NFRF9SR0JfUFZSVENfNEJQUFYxX0lNR10gPSAwLjU7XG5GT1JNQVRfU0laRVNfU1BFQ0lBTFtHTF9DT01QUkVTU0VEX1JHQl9QVlJUQ18yQlBQVjFfSU1HXSA9IDAuMjU7XG5GT1JNQVRfU0laRVNfU1BFQ0lBTFtHTF9DT01QUkVTU0VEX1JHQkFfUFZSVENfNEJQUFYxX0lNR10gPSAwLjU7XG5GT1JNQVRfU0laRVNfU1BFQ0lBTFtHTF9DT01QUkVTU0VEX1JHQkFfUFZSVENfMkJQUFYxX0lNR10gPSAwLjI1O1xuXG5GT1JNQVRfU0laRVNfU1BFQ0lBTFtHTF9DT01QUkVTU0VEX1JHQl9FVEMxX1dFQkdMXSA9IDAuNTtcblxuZnVuY3Rpb24gaXNOdW1lcmljQXJyYXkgKGFycikge1xuICByZXR1cm4gKFxuICAgIEFycmF5LmlzQXJyYXkoYXJyKSAmJlxuICAgIChhcnIubGVuZ3RoID09PSAwIHx8XG4gICAgdHlwZW9mIGFyclswXSA9PT0gJ251bWJlcicpKVxufVxuXG5mdW5jdGlvbiBpc1JlY3RBcnJheSAoYXJyKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgdmFyIHdpZHRoID0gYXJyLmxlbmd0aDtcbiAgaWYgKHdpZHRoID09PSAwIHx8ICFpc0FycmF5TGlrZShhcnJbMF0pKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gY2xhc3NTdHJpbmcgKHgpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KVxufVxuXG5mdW5jdGlvbiBpc0NhbnZhc0VsZW1lbnQgKG9iamVjdCkge1xuICByZXR1cm4gY2xhc3NTdHJpbmcob2JqZWN0KSA9PT0gQ0FOVkFTX0NMQVNTXG59XG5cbmZ1bmN0aW9uIGlzQ29udGV4dDJEIChvYmplY3QpIHtcbiAgcmV0dXJuIGNsYXNzU3RyaW5nKG9iamVjdCkgPT09IENPTlRFWFQyRF9DTEFTU1xufVxuXG5mdW5jdGlvbiBpc0JpdG1hcCAob2JqZWN0KSB7XG4gIHJldHVybiBjbGFzc1N0cmluZyhvYmplY3QpID09PSBCSVRNQVBfQ0xBU1Ncbn1cblxuZnVuY3Rpb24gaXNJbWFnZUVsZW1lbnQgKG9iamVjdCkge1xuICByZXR1cm4gY2xhc3NTdHJpbmcob2JqZWN0KSA9PT0gSU1BR0VfQ0xBU1Ncbn1cblxuZnVuY3Rpb24gaXNWaWRlb0VsZW1lbnQgKG9iamVjdCkge1xuICByZXR1cm4gY2xhc3NTdHJpbmcob2JqZWN0KSA9PT0gVklERU9fQ0xBU1Ncbn1cblxuZnVuY3Rpb24gaXNQaXhlbERhdGEgKG9iamVjdCkge1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHZhciBjbGFzc05hbWUgPSBjbGFzc1N0cmluZyhvYmplY3QpO1xuICBpZiAoUElYRUxfQ0xBU1NFUy5pbmRleE9mKGNsYXNzTmFtZSkgPj0gMCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgcmV0dXJuIChcbiAgICBpc051bWVyaWNBcnJheShvYmplY3QpIHx8XG4gICAgaXNSZWN0QXJyYXkob2JqZWN0KSB8fFxuICAgIGlzTkRBcnJheUxpa2Uob2JqZWN0KSlcbn1cblxuZnVuY3Rpb24gdHlwZWRBcnJheUNvZGUkMSAoZGF0YSkge1xuICByZXR1cm4gYXJyYXlUeXBlc1tPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0YSldIHwgMFxufVxuXG5mdW5jdGlvbiBjb252ZXJ0RGF0YSAocmVzdWx0LCBkYXRhKSB7XG4gIHZhciBuID0gZGF0YS5sZW5ndGg7XG4gIHN3aXRjaCAocmVzdWx0LnR5cGUpIHtcbiAgICBjYXNlIEdMX1VOU0lHTkVEX0JZVEUkNTpcbiAgICBjYXNlIEdMX1VOU0lHTkVEX1NIT1JUJDM6XG4gICAgY2FzZSBHTF9VTlNJR05FRF9JTlQkMzpcbiAgICBjYXNlIEdMX0ZMT0FUJDQ6XG4gICAgICB2YXIgY29udmVydGVkID0gcG9vbC5hbGxvY1R5cGUocmVzdWx0LnR5cGUsIG4pO1xuICAgICAgY29udmVydGVkLnNldChkYXRhKTtcbiAgICAgIHJlc3VsdC5kYXRhID0gY29udmVydGVkO1xuICAgICAgYnJlYWtcblxuICAgIGNhc2UgR0xfSEFMRl9GTE9BVF9PRVMkMTpcbiAgICAgIHJlc3VsdC5kYXRhID0gY29udmVydFRvSGFsZkZsb2F0KGRhdGEpO1xuICAgICAgYnJlYWtcblxuICAgIGRlZmF1bHQ6XG4gICAgICBjaGVjayQxLnJhaXNlKCd1bnN1cHBvcnRlZCB0ZXh0dXJlIHR5cGUsIG11c3Qgc3BlY2lmeSBhIHR5cGVkIGFycmF5Jyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJlQ29udmVydCAoaW1hZ2UsIG4pIHtcbiAgcmV0dXJuIHBvb2wuYWxsb2NUeXBlKFxuICAgIGltYWdlLnR5cGUgPT09IEdMX0hBTEZfRkxPQVRfT0VTJDFcbiAgICAgID8gR0xfRkxPQVQkNFxuICAgICAgOiBpbWFnZS50eXBlLCBuKVxufVxuXG5mdW5jdGlvbiBwb3N0Q29udmVydCAoaW1hZ2UsIGRhdGEpIHtcbiAgaWYgKGltYWdlLnR5cGUgPT09IEdMX0hBTEZfRkxPQVRfT0VTJDEpIHtcbiAgICBpbWFnZS5kYXRhID0gY29udmVydFRvSGFsZkZsb2F0KGRhdGEpO1xuICAgIHBvb2wuZnJlZVR5cGUoZGF0YSk7XG4gIH0gZWxzZSB7XG4gICAgaW1hZ2UuZGF0YSA9IGRhdGE7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhbnNwb3NlRGF0YSAoaW1hZ2UsIGFycmF5LCBzdHJpZGVYLCBzdHJpZGVZLCBzdHJpZGVDLCBvZmZzZXQpIHtcbiAgdmFyIHcgPSBpbWFnZS53aWR0aDtcbiAgdmFyIGggPSBpbWFnZS5oZWlnaHQ7XG4gIHZhciBjID0gaW1hZ2UuY2hhbm5lbHM7XG4gIHZhciBuID0gdyAqIGggKiBjO1xuICB2YXIgZGF0YSA9IHByZUNvbnZlcnQoaW1hZ2UsIG4pO1xuXG4gIHZhciBwID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBoOyArK2kpIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHc7ICsraikge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBjOyArK2spIHtcbiAgICAgICAgZGF0YVtwKytdID0gYXJyYXlbc3RyaWRlWCAqIGogKyBzdHJpZGVZICogaSArIHN0cmlkZUMgKiBrICsgb2Zmc2V0XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwb3N0Q29udmVydChpbWFnZSwgZGF0YSk7XG59XG5cbmZ1bmN0aW9uIGdldFRleHR1cmVTaXplIChmb3JtYXQsIHR5cGUsIHdpZHRoLCBoZWlnaHQsIGlzTWlwbWFwLCBpc0N1YmUpIHtcbiAgdmFyIHM7XG4gIGlmICh0eXBlb2YgRk9STUFUX1NJWkVTX1NQRUNJQUxbZm9ybWF0XSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyB3ZSBoYXZlIGEgc3BlY2lhbCBhcnJheSBmb3IgZGVhbGluZyB3aXRoIHdlaXJkIGNvbG9yIGZvcm1hdHMgc3VjaCBhcyBSR0I1QTFcbiAgICBzID0gRk9STUFUX1NJWkVTX1NQRUNJQUxbZm9ybWF0XTtcbiAgfSBlbHNlIHtcbiAgICBzID0gRk9STUFUX0NIQU5ORUxTW2Zvcm1hdF0gKiBUWVBFX1NJWkVTW3R5cGVdO1xuICB9XG5cbiAgaWYgKGlzQ3ViZSkge1xuICAgIHMgKj0gNjtcbiAgfVxuXG4gIGlmIChpc01pcG1hcCkge1xuICAgIC8vIGNvbXB1dGUgdGhlIHRvdGFsIHNpemUgb2YgYWxsIHRoZSBtaXBtYXBzLlxuICAgIHZhciB0b3RhbCA9IDA7XG5cbiAgICB2YXIgdyA9IHdpZHRoO1xuICAgIHdoaWxlICh3ID49IDEpIHtcbiAgICAgIC8vIHdlIGNhbiBvbmx5IHVzZSBtaXBtYXBzIG9uIGEgc3F1YXJlIGltYWdlLFxuICAgICAgLy8gc28gd2UgY2FuIHNpbXBseSB1c2UgdGhlIHdpZHRoIGFuZCBpZ25vcmUgdGhlIGhlaWdodDpcbiAgICAgIHRvdGFsICs9IHMgKiB3ICogdztcbiAgICAgIHcgLz0gMjtcbiAgICB9XG4gICAgcmV0dXJuIHRvdGFsXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHMgKiB3aWR0aCAqIGhlaWdodFxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRleHR1cmVTZXQgKFxuICBnbCwgZXh0ZW5zaW9ucywgbGltaXRzLCByZWdsUG9sbCwgY29udGV4dFN0YXRlLCBzdGF0cywgY29uZmlnKSB7XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW5pdGlhbGl6ZSBjb25zdGFudHMgYW5kIHBhcmFtZXRlciB0YWJsZXMgaGVyZVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIHZhciBtaXBtYXBIaW50ID0ge1xuICAgIFwiZG9uJ3QgY2FyZVwiOiBHTF9ET05UX0NBUkUsXG4gICAgJ2RvbnQgY2FyZSc6IEdMX0RPTlRfQ0FSRSxcbiAgICAnbmljZSc6IEdMX05JQ0VTVCxcbiAgICAnZmFzdCc6IEdMX0ZBU1RFU1RcbiAgfTtcblxuICB2YXIgd3JhcE1vZGVzID0ge1xuICAgICdyZXBlYXQnOiBHTF9SRVBFQVQsXG4gICAgJ2NsYW1wJzogR0xfQ0xBTVBfVE9fRURHRSQxLFxuICAgICdtaXJyb3InOiBHTF9NSVJST1JFRF9SRVBFQVRcbiAgfTtcblxuICB2YXIgbWFnRmlsdGVycyA9IHtcbiAgICAnbmVhcmVzdCc6IEdMX05FQVJFU1QkMSxcbiAgICAnbGluZWFyJzogR0xfTElORUFSXG4gIH07XG5cbiAgdmFyIG1pbkZpbHRlcnMgPSBleHRlbmQoe1xuICAgICdtaXBtYXAnOiBHTF9MSU5FQVJfTUlQTUFQX0xJTkVBUiQxLFxuICAgICduZWFyZXN0IG1pcG1hcCBuZWFyZXN0JzogR0xfTkVBUkVTVF9NSVBNQVBfTkVBUkVTVCQxLFxuICAgICdsaW5lYXIgbWlwbWFwIG5lYXJlc3QnOiBHTF9MSU5FQVJfTUlQTUFQX05FQVJFU1QkMSxcbiAgICAnbmVhcmVzdCBtaXBtYXAgbGluZWFyJzogR0xfTkVBUkVTVF9NSVBNQVBfTElORUFSJDEsXG4gICAgJ2xpbmVhciBtaXBtYXAgbGluZWFyJzogR0xfTElORUFSX01JUE1BUF9MSU5FQVIkMVxuICB9LCBtYWdGaWx0ZXJzKTtcblxuICB2YXIgY29sb3JTcGFjZSA9IHtcbiAgICAnbm9uZSc6IDAsXG4gICAgJ2Jyb3dzZXInOiBHTF9CUk9XU0VSX0RFRkFVTFRfV0VCR0xcbiAgfTtcblxuICB2YXIgdGV4dHVyZVR5cGVzID0ge1xuICAgICd1aW50OCc6IEdMX1VOU0lHTkVEX0JZVEUkNSxcbiAgICAncmdiYTQnOiBHTF9VTlNJR05FRF9TSE9SVF80XzRfNF80JDEsXG4gICAgJ3JnYjU2NSc6IEdMX1VOU0lHTkVEX1NIT1JUXzVfNl81JDEsXG4gICAgJ3JnYjUgYTEnOiBHTF9VTlNJR05FRF9TSE9SVF81XzVfNV8xJDFcbiAgfTtcblxuICB2YXIgdGV4dHVyZUZvcm1hdHMgPSB7XG4gICAgJ2FscGhhJzogR0xfQUxQSEEsXG4gICAgJ2x1bWluYW5jZSc6IEdMX0xVTUlOQU5DRSxcbiAgICAnbHVtaW5hbmNlIGFscGhhJzogR0xfTFVNSU5BTkNFX0FMUEhBLFxuICAgICdyZ2InOiBHTF9SR0IsXG4gICAgJ3JnYmEnOiBHTF9SR0JBJDEsXG4gICAgJ3JnYmE0JzogR0xfUkdCQTQsXG4gICAgJ3JnYjUgYTEnOiBHTF9SR0I1X0ExLFxuICAgICdyZ2I1NjUnOiBHTF9SR0I1NjVcbiAgfTtcblxuICB2YXIgY29tcHJlc3NlZFRleHR1cmVGb3JtYXRzID0ge307XG5cbiAgaWYgKGV4dGVuc2lvbnMuZXh0X3NyZ2IpIHtcbiAgICB0ZXh0dXJlRm9ybWF0cy5zcmdiID0gR0xfU1JHQl9FWFQ7XG4gICAgdGV4dHVyZUZvcm1hdHMuc3JnYmEgPSBHTF9TUkdCX0FMUEhBX0VYVDtcbiAgfVxuXG4gIGlmIChleHRlbnNpb25zLm9lc190ZXh0dXJlX2Zsb2F0KSB7XG4gICAgdGV4dHVyZVR5cGVzLmZsb2F0MzIgPSB0ZXh0dXJlVHlwZXMuZmxvYXQgPSBHTF9GTE9BVCQ0O1xuICB9XG5cbiAgaWYgKGV4dGVuc2lvbnMub2VzX3RleHR1cmVfaGFsZl9mbG9hdCkge1xuICAgIHRleHR1cmVUeXBlc1snZmxvYXQxNiddID0gdGV4dHVyZVR5cGVzWydoYWxmIGZsb2F0J10gPSBHTF9IQUxGX0ZMT0FUX09FUyQxO1xuICB9XG5cbiAgaWYgKGV4dGVuc2lvbnMud2ViZ2xfZGVwdGhfdGV4dHVyZSkge1xuICAgIGV4dGVuZCh0ZXh0dXJlRm9ybWF0cywge1xuICAgICAgJ2RlcHRoJzogR0xfREVQVEhfQ09NUE9ORU5ULFxuICAgICAgJ2RlcHRoIHN0ZW5jaWwnOiBHTF9ERVBUSF9TVEVOQ0lMXG4gICAgfSk7XG5cbiAgICBleHRlbmQodGV4dHVyZVR5cGVzLCB7XG4gICAgICAndWludDE2JzogR0xfVU5TSUdORURfU0hPUlQkMyxcbiAgICAgICd1aW50MzInOiBHTF9VTlNJR05FRF9JTlQkMyxcbiAgICAgICdkZXB0aCBzdGVuY2lsJzogR0xfVU5TSUdORURfSU5UXzI0XzhfV0VCR0wkMVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKGV4dGVuc2lvbnMud2ViZ2xfY29tcHJlc3NlZF90ZXh0dXJlX3MzdGMpIHtcbiAgICBleHRlbmQoY29tcHJlc3NlZFRleHR1cmVGb3JtYXRzLCB7XG4gICAgICAncmdiIHMzdGMgZHh0MSc6IEdMX0NPTVBSRVNTRURfUkdCX1MzVENfRFhUMV9FWFQsXG4gICAgICAncmdiYSBzM3RjIGR4dDEnOiBHTF9DT01QUkVTU0VEX1JHQkFfUzNUQ19EWFQxX0VYVCxcbiAgICAgICdyZ2JhIHMzdGMgZHh0Myc6IEdMX0NPTVBSRVNTRURfUkdCQV9TM1RDX0RYVDNfRVhULFxuICAgICAgJ3JnYmEgczN0YyBkeHQ1JzogR0xfQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUNV9FWFRcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChleHRlbnNpb25zLndlYmdsX2NvbXByZXNzZWRfdGV4dHVyZV9hdGMpIHtcbiAgICBleHRlbmQoY29tcHJlc3NlZFRleHR1cmVGb3JtYXRzLCB7XG4gICAgICAncmdiIGF0Yyc6IEdMX0NPTVBSRVNTRURfUkdCX0FUQ19XRUJHTCxcbiAgICAgICdyZ2JhIGF0YyBleHBsaWNpdCBhbHBoYSc6IEdMX0NPTVBSRVNTRURfUkdCQV9BVENfRVhQTElDSVRfQUxQSEFfV0VCR0wsXG4gICAgICAncmdiYSBhdGMgaW50ZXJwb2xhdGVkIGFscGhhJzogR0xfQ09NUFJFU1NFRF9SR0JBX0FUQ19JTlRFUlBPTEFURURfQUxQSEFfV0VCR0xcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChleHRlbnNpb25zLndlYmdsX2NvbXByZXNzZWRfdGV4dHVyZV9wdnJ0Yykge1xuICAgIGV4dGVuZChjb21wcmVzc2VkVGV4dHVyZUZvcm1hdHMsIHtcbiAgICAgICdyZ2IgcHZydGMgNGJwcHYxJzogR0xfQ09NUFJFU1NFRF9SR0JfUFZSVENfNEJQUFYxX0lNRyxcbiAgICAgICdyZ2IgcHZydGMgMmJwcHYxJzogR0xfQ09NUFJFU1NFRF9SR0JfUFZSVENfMkJQUFYxX0lNRyxcbiAgICAgICdyZ2JhIHB2cnRjIDRicHB2MSc6IEdMX0NPTVBSRVNTRURfUkdCQV9QVlJUQ180QlBQVjFfSU1HLFxuICAgICAgJ3JnYmEgcHZydGMgMmJwcHYxJzogR0xfQ09NUFJFU1NFRF9SR0JBX1BWUlRDXzJCUFBWMV9JTUdcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChleHRlbnNpb25zLndlYmdsX2NvbXByZXNzZWRfdGV4dHVyZV9ldGMxKSB7XG4gICAgY29tcHJlc3NlZFRleHR1cmVGb3JtYXRzWydyZ2IgZXRjMSddID0gR0xfQ09NUFJFU1NFRF9SR0JfRVRDMV9XRUJHTDtcbiAgfVxuXG4gIC8vIENvcHkgb3ZlciBhbGwgdGV4dHVyZSBmb3JtYXRzXG4gIHZhciBzdXBwb3J0ZWRDb21wcmVzc2VkRm9ybWF0cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKFxuICAgIGdsLmdldFBhcmFtZXRlcihHTF9DT01QUkVTU0VEX1RFWFRVUkVfRk9STUFUUykpO1xuICBPYmplY3Qua2V5cyhjb21wcmVzc2VkVGV4dHVyZUZvcm1hdHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgZm9ybWF0ID0gY29tcHJlc3NlZFRleHR1cmVGb3JtYXRzW25hbWVdO1xuICAgIGlmIChzdXBwb3J0ZWRDb21wcmVzc2VkRm9ybWF0cy5pbmRleE9mKGZvcm1hdCkgPj0gMCkge1xuICAgICAgdGV4dHVyZUZvcm1hdHNbbmFtZV0gPSBmb3JtYXQ7XG4gICAgfVxuICB9KTtcblxuICB2YXIgc3VwcG9ydGVkRm9ybWF0cyA9IE9iamVjdC5rZXlzKHRleHR1cmVGb3JtYXRzKTtcbiAgbGltaXRzLnRleHR1cmVGb3JtYXRzID0gc3VwcG9ydGVkRm9ybWF0cztcblxuICAvLyBhc3NvY2lhdGUgd2l0aCBldmVyeSBmb3JtYXQgc3RyaW5nIGl0c1xuICAvLyBjb3JyZXNwb25kaW5nIEdMLXZhbHVlLlxuICB2YXIgdGV4dHVyZUZvcm1hdHNJbnZlcnQgPSBbXTtcbiAgT2JqZWN0LmtleXModGV4dHVyZUZvcm1hdHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciB2YWwgPSB0ZXh0dXJlRm9ybWF0c1trZXldO1xuICAgIHRleHR1cmVGb3JtYXRzSW52ZXJ0W3ZhbF0gPSBrZXk7XG4gIH0pO1xuXG4gIC8vIGFzc29jaWF0ZSB3aXRoIGV2ZXJ5IHR5cGUgc3RyaW5nIGl0c1xuICAvLyBjb3JyZXNwb25kaW5nIEdMLXZhbHVlLlxuICB2YXIgdGV4dHVyZVR5cGVzSW52ZXJ0ID0gW107XG4gIE9iamVjdC5rZXlzKHRleHR1cmVUeXBlcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIHZhbCA9IHRleHR1cmVUeXBlc1trZXldO1xuICAgIHRleHR1cmVUeXBlc0ludmVydFt2YWxdID0ga2V5O1xuICB9KTtcblxuICB2YXIgbWFnRmlsdGVyc0ludmVydCA9IFtdO1xuICBPYmplY3Qua2V5cyhtYWdGaWx0ZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgdmFsID0gbWFnRmlsdGVyc1trZXldO1xuICAgIG1hZ0ZpbHRlcnNJbnZlcnRbdmFsXSA9IGtleTtcbiAgfSk7XG5cbiAgdmFyIG1pbkZpbHRlcnNJbnZlcnQgPSBbXTtcbiAgT2JqZWN0LmtleXMobWluRmlsdGVycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIHZhbCA9IG1pbkZpbHRlcnNba2V5XTtcbiAgICBtaW5GaWx0ZXJzSW52ZXJ0W3ZhbF0gPSBrZXk7XG4gIH0pO1xuXG4gIHZhciB3cmFwTW9kZXNJbnZlcnQgPSBbXTtcbiAgT2JqZWN0LmtleXMod3JhcE1vZGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgdmFsID0gd3JhcE1vZGVzW2tleV07XG4gICAgd3JhcE1vZGVzSW52ZXJ0W3ZhbF0gPSBrZXk7XG4gIH0pO1xuXG4gIC8vIGNvbG9yRm9ybWF0c1tdIGdpdmVzIHRoZSBmb3JtYXQgKGNoYW5uZWxzKSBhc3NvY2lhdGVkIHRvIGFuXG4gIC8vIGludGVybmFsZm9ybWF0XG4gIHZhciBjb2xvckZvcm1hdHMgPSBzdXBwb3J0ZWRGb3JtYXRzLnJlZHVjZShmdW5jdGlvbiAoY29sb3IsIGtleSkge1xuICAgIHZhciBnbGVudW0gPSB0ZXh0dXJlRm9ybWF0c1trZXldO1xuICAgIGlmIChnbGVudW0gPT09IEdMX0xVTUlOQU5DRSB8fFxuICAgICAgICBnbGVudW0gPT09IEdMX0FMUEhBIHx8XG4gICAgICAgIGdsZW51bSA9PT0gR0xfTFVNSU5BTkNFIHx8XG4gICAgICAgIGdsZW51bSA9PT0gR0xfTFVNSU5BTkNFX0FMUEhBIHx8XG4gICAgICAgIGdsZW51bSA9PT0gR0xfREVQVEhfQ09NUE9ORU5UIHx8XG4gICAgICAgIGdsZW51bSA9PT0gR0xfREVQVEhfU1RFTkNJTCkge1xuICAgICAgY29sb3JbZ2xlbnVtXSA9IGdsZW51bTtcbiAgICB9IGVsc2UgaWYgKGdsZW51bSA9PT0gR0xfUkdCNV9BMSB8fCBrZXkuaW5kZXhPZigncmdiYScpID49IDApIHtcbiAgICAgIGNvbG9yW2dsZW51bV0gPSBHTF9SR0JBJDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbG9yW2dsZW51bV0gPSBHTF9SR0I7XG4gICAgfVxuICAgIHJldHVybiBjb2xvclxuICB9LCB7fSk7XG5cbiAgZnVuY3Rpb24gVGV4RmxhZ3MgKCkge1xuICAgIC8vIGZvcm1hdCBpbmZvXG4gICAgdGhpcy5pbnRlcm5hbGZvcm1hdCA9IEdMX1JHQkEkMTtcbiAgICB0aGlzLmZvcm1hdCA9IEdMX1JHQkEkMTtcbiAgICB0aGlzLnR5cGUgPSBHTF9VTlNJR05FRF9CWVRFJDU7XG4gICAgdGhpcy5jb21wcmVzc2VkID0gZmFsc2U7XG5cbiAgICAvLyBwaXhlbCBzdG9yYWdlXG4gICAgdGhpcy5wcmVtdWx0aXBseUFscGhhID0gZmFsc2U7XG4gICAgdGhpcy5mbGlwWSA9IGZhbHNlO1xuICAgIHRoaXMudW5wYWNrQWxpZ25tZW50ID0gMTtcbiAgICB0aGlzLmNvbG9yU3BhY2UgPSBHTF9CUk9XU0VSX0RFRkFVTFRfV0VCR0w7XG5cbiAgICAvLyBzaGFwZSBpbmZvXG4gICAgdGhpcy53aWR0aCA9IDA7XG4gICAgdGhpcy5oZWlnaHQgPSAwO1xuICAgIHRoaXMuY2hhbm5lbHMgPSAwO1xuICB9XG5cbiAgZnVuY3Rpb24gY29weUZsYWdzIChyZXN1bHQsIG90aGVyKSB7XG4gICAgcmVzdWx0LmludGVybmFsZm9ybWF0ID0gb3RoZXIuaW50ZXJuYWxmb3JtYXQ7XG4gICAgcmVzdWx0LmZvcm1hdCA9IG90aGVyLmZvcm1hdDtcbiAgICByZXN1bHQudHlwZSA9IG90aGVyLnR5cGU7XG4gICAgcmVzdWx0LmNvbXByZXNzZWQgPSBvdGhlci5jb21wcmVzc2VkO1xuXG4gICAgcmVzdWx0LnByZW11bHRpcGx5QWxwaGEgPSBvdGhlci5wcmVtdWx0aXBseUFscGhhO1xuICAgIHJlc3VsdC5mbGlwWSA9IG90aGVyLmZsaXBZO1xuICAgIHJlc3VsdC51bnBhY2tBbGlnbm1lbnQgPSBvdGhlci51bnBhY2tBbGlnbm1lbnQ7XG4gICAgcmVzdWx0LmNvbG9yU3BhY2UgPSBvdGhlci5jb2xvclNwYWNlO1xuXG4gICAgcmVzdWx0LndpZHRoID0gb3RoZXIud2lkdGg7XG4gICAgcmVzdWx0LmhlaWdodCA9IG90aGVyLmhlaWdodDtcbiAgICByZXN1bHQuY2hhbm5lbHMgPSBvdGhlci5jaGFubmVscztcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlRmxhZ3MgKGZsYWdzLCBvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0JyB8fCAhb3B0aW9ucykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKCdwcmVtdWx0aXBseUFscGhhJyBpbiBvcHRpb25zKSB7XG4gICAgICBjaGVjayQxLnR5cGUob3B0aW9ucy5wcmVtdWx0aXBseUFscGhhLCAnYm9vbGVhbicsXG4gICAgICAgICdpbnZhbGlkIHByZW11bHRpcGx5QWxwaGEnKTtcbiAgICAgIGZsYWdzLnByZW11bHRpcGx5QWxwaGEgPSBvcHRpb25zLnByZW11bHRpcGx5QWxwaGE7XG4gICAgfVxuXG4gICAgaWYgKCdmbGlwWScgaW4gb3B0aW9ucykge1xuICAgICAgY2hlY2skMS50eXBlKG9wdGlvbnMuZmxpcFksICdib29sZWFuJyxcbiAgICAgICAgJ2ludmFsaWQgdGV4dHVyZSBmbGlwJyk7XG4gICAgICBmbGFncy5mbGlwWSA9IG9wdGlvbnMuZmxpcFk7XG4gICAgfVxuXG4gICAgaWYgKCdhbGlnbm1lbnQnIGluIG9wdGlvbnMpIHtcbiAgICAgIGNoZWNrJDEub25lT2Yob3B0aW9ucy5hbGlnbm1lbnQsIFsxLCAyLCA0LCA4XSxcbiAgICAgICAgJ2ludmFsaWQgdGV4dHVyZSB1bnBhY2sgYWxpZ25tZW50Jyk7XG4gICAgICBmbGFncy51bnBhY2tBbGlnbm1lbnQgPSBvcHRpb25zLmFsaWdubWVudDtcbiAgICB9XG5cbiAgICBpZiAoJ2NvbG9yU3BhY2UnIGluIG9wdGlvbnMpIHtcbiAgICAgIGNoZWNrJDEucGFyYW1ldGVyKG9wdGlvbnMuY29sb3JTcGFjZSwgY29sb3JTcGFjZSxcbiAgICAgICAgJ2ludmFsaWQgY29sb3JTcGFjZScpO1xuICAgICAgZmxhZ3MuY29sb3JTcGFjZSA9IGNvbG9yU3BhY2Vbb3B0aW9ucy5jb2xvclNwYWNlXTtcbiAgICB9XG5cbiAgICBpZiAoJ3R5cGUnIGluIG9wdGlvbnMpIHtcbiAgICAgIHZhciB0eXBlID0gb3B0aW9ucy50eXBlO1xuICAgICAgY2hlY2skMShleHRlbnNpb25zLm9lc190ZXh0dXJlX2Zsb2F0IHx8XG4gICAgICAgICEodHlwZSA9PT0gJ2Zsb2F0JyB8fCB0eXBlID09PSAnZmxvYXQzMicpLFxuICAgICAgICAneW91IG11c3QgZW5hYmxlIHRoZSBPRVNfdGV4dHVyZV9mbG9hdCBleHRlbnNpb24gaW4gb3JkZXIgdG8gdXNlIGZsb2F0aW5nIHBvaW50IHRleHR1cmVzLicpO1xuICAgICAgY2hlY2skMShleHRlbnNpb25zLm9lc190ZXh0dXJlX2hhbGZfZmxvYXQgfHxcbiAgICAgICAgISh0eXBlID09PSAnaGFsZiBmbG9hdCcgfHwgdHlwZSA9PT0gJ2Zsb2F0MTYnKSxcbiAgICAgICAgJ3lvdSBtdXN0IGVuYWJsZSB0aGUgT0VTX3RleHR1cmVfaGFsZl9mbG9hdCBleHRlbnNpb24gaW4gb3JkZXIgdG8gdXNlIDE2LWJpdCBmbG9hdGluZyBwb2ludCB0ZXh0dXJlcy4nKTtcbiAgICAgIGNoZWNrJDEoZXh0ZW5zaW9ucy53ZWJnbF9kZXB0aF90ZXh0dXJlIHx8XG4gICAgICAgICEodHlwZSA9PT0gJ3VpbnQxNicgfHwgdHlwZSA9PT0gJ3VpbnQzMicgfHwgdHlwZSA9PT0gJ2RlcHRoIHN0ZW5jaWwnKSxcbiAgICAgICAgJ3lvdSBtdXN0IGVuYWJsZSB0aGUgV0VCR0xfZGVwdGhfdGV4dHVyZSBleHRlbnNpb24gaW4gb3JkZXIgdG8gdXNlIGRlcHRoL3N0ZW5jaWwgdGV4dHVyZXMuJyk7XG4gICAgICBjaGVjayQxLnBhcmFtZXRlcih0eXBlLCB0ZXh0dXJlVHlwZXMsXG4gICAgICAgICdpbnZhbGlkIHRleHR1cmUgdHlwZScpO1xuICAgICAgZmxhZ3MudHlwZSA9IHRleHR1cmVUeXBlc1t0eXBlXTtcbiAgICB9XG5cbiAgICB2YXIgdyA9IGZsYWdzLndpZHRoO1xuICAgIHZhciBoID0gZmxhZ3MuaGVpZ2h0O1xuICAgIHZhciBjID0gZmxhZ3MuY2hhbm5lbHM7XG4gICAgdmFyIGhhc0NoYW5uZWxzID0gZmFsc2U7XG4gICAgaWYgKCdzaGFwZScgaW4gb3B0aW9ucykge1xuICAgICAgY2hlY2skMShBcnJheS5pc0FycmF5KG9wdGlvbnMuc2hhcGUpICYmIG9wdGlvbnMuc2hhcGUubGVuZ3RoID49IDIsXG4gICAgICAgICdzaGFwZSBtdXN0IGJlIGFuIGFycmF5Jyk7XG4gICAgICB3ID0gb3B0aW9ucy5zaGFwZVswXTtcbiAgICAgIGggPSBvcHRpb25zLnNoYXBlWzFdO1xuICAgICAgaWYgKG9wdGlvbnMuc2hhcGUubGVuZ3RoID09PSAzKSB7XG4gICAgICAgIGMgPSBvcHRpb25zLnNoYXBlWzJdO1xuICAgICAgICBjaGVjayQxKGMgPiAwICYmIGMgPD0gNCwgJ2ludmFsaWQgbnVtYmVyIG9mIGNoYW5uZWxzJyk7XG4gICAgICAgIGhhc0NoYW5uZWxzID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNoZWNrJDEodyA+PSAwICYmIHcgPD0gbGltaXRzLm1heFRleHR1cmVTaXplLCAnaW52YWxpZCB3aWR0aCcpO1xuICAgICAgY2hlY2skMShoID49IDAgJiYgaCA8PSBsaW1pdHMubWF4VGV4dHVyZVNpemUsICdpbnZhbGlkIGhlaWdodCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoJ3JhZGl1cycgaW4gb3B0aW9ucykge1xuICAgICAgICB3ID0gaCA9IG9wdGlvbnMucmFkaXVzO1xuICAgICAgICBjaGVjayQxKHcgPj0gMCAmJiB3IDw9IGxpbWl0cy5tYXhUZXh0dXJlU2l6ZSwgJ2ludmFsaWQgcmFkaXVzJyk7XG4gICAgICB9XG4gICAgICBpZiAoJ3dpZHRoJyBpbiBvcHRpb25zKSB7XG4gICAgICAgIHcgPSBvcHRpb25zLndpZHRoO1xuICAgICAgICBjaGVjayQxKHcgPj0gMCAmJiB3IDw9IGxpbWl0cy5tYXhUZXh0dXJlU2l6ZSwgJ2ludmFsaWQgd2lkdGgnKTtcbiAgICAgIH1cbiAgICAgIGlmICgnaGVpZ2h0JyBpbiBvcHRpb25zKSB7XG4gICAgICAgIGggPSBvcHRpb25zLmhlaWdodDtcbiAgICAgICAgY2hlY2skMShoID49IDAgJiYgaCA8PSBsaW1pdHMubWF4VGV4dHVyZVNpemUsICdpbnZhbGlkIGhlaWdodCcpO1xuICAgICAgfVxuICAgICAgaWYgKCdjaGFubmVscycgaW4gb3B0aW9ucykge1xuICAgICAgICBjID0gb3B0aW9ucy5jaGFubmVscztcbiAgICAgICAgY2hlY2skMShjID4gMCAmJiBjIDw9IDQsICdpbnZhbGlkIG51bWJlciBvZiBjaGFubmVscycpO1xuICAgICAgICBoYXNDaGFubmVscyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGZsYWdzLndpZHRoID0gdyB8IDA7XG4gICAgZmxhZ3MuaGVpZ2h0ID0gaCB8IDA7XG4gICAgZmxhZ3MuY2hhbm5lbHMgPSBjIHwgMDtcblxuICAgIHZhciBoYXNGb3JtYXQgPSBmYWxzZTtcbiAgICBpZiAoJ2Zvcm1hdCcgaW4gb3B0aW9ucykge1xuICAgICAgdmFyIGZvcm1hdFN0ciA9IG9wdGlvbnMuZm9ybWF0O1xuICAgICAgY2hlY2skMShleHRlbnNpb25zLndlYmdsX2RlcHRoX3RleHR1cmUgfHxcbiAgICAgICAgIShmb3JtYXRTdHIgPT09ICdkZXB0aCcgfHwgZm9ybWF0U3RyID09PSAnZGVwdGggc3RlbmNpbCcpLFxuICAgICAgICAneW91IG11c3QgZW5hYmxlIHRoZSBXRUJHTF9kZXB0aF90ZXh0dXJlIGV4dGVuc2lvbiBpbiBvcmRlciB0byB1c2UgZGVwdGgvc3RlbmNpbCB0ZXh0dXJlcy4nKTtcbiAgICAgIGNoZWNrJDEucGFyYW1ldGVyKGZvcm1hdFN0ciwgdGV4dHVyZUZvcm1hdHMsXG4gICAgICAgICdpbnZhbGlkIHRleHR1cmUgZm9ybWF0Jyk7XG4gICAgICB2YXIgaW50ZXJuYWxmb3JtYXQgPSBmbGFncy5pbnRlcm5hbGZvcm1hdCA9IHRleHR1cmVGb3JtYXRzW2Zvcm1hdFN0cl07XG4gICAgICBmbGFncy5mb3JtYXQgPSBjb2xvckZvcm1hdHNbaW50ZXJuYWxmb3JtYXRdO1xuICAgICAgaWYgKGZvcm1hdFN0ciBpbiB0ZXh0dXJlVHlwZXMpIHtcbiAgICAgICAgaWYgKCEoJ3R5cGUnIGluIG9wdGlvbnMpKSB7XG4gICAgICAgICAgZmxhZ3MudHlwZSA9IHRleHR1cmVUeXBlc1tmb3JtYXRTdHJdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm9ybWF0U3RyIGluIGNvbXByZXNzZWRUZXh0dXJlRm9ybWF0cykge1xuICAgICAgICBmbGFncy5jb21wcmVzc2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGhhc0Zvcm1hdCA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gUmVjb25jaWxlIGNoYW5uZWxzIGFuZCBmb3JtYXRcbiAgICBpZiAoIWhhc0NoYW5uZWxzICYmIGhhc0Zvcm1hdCkge1xuICAgICAgZmxhZ3MuY2hhbm5lbHMgPSBGT1JNQVRfQ0hBTk5FTFNbZmxhZ3MuZm9ybWF0XTtcbiAgICB9IGVsc2UgaWYgKGhhc0NoYW5uZWxzICYmICFoYXNGb3JtYXQpIHtcbiAgICAgIGlmIChmbGFncy5jaGFubmVscyAhPT0gQ0hBTk5FTFNfRk9STUFUW2ZsYWdzLmZvcm1hdF0pIHtcbiAgICAgICAgZmxhZ3MuZm9ybWF0ID0gZmxhZ3MuaW50ZXJuYWxmb3JtYXQgPSBDSEFOTkVMU19GT1JNQVRbZmxhZ3MuY2hhbm5lbHNdO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaGFzRm9ybWF0ICYmIGhhc0NoYW5uZWxzKSB7XG4gICAgICBjaGVjayQxKFxuICAgICAgICBmbGFncy5jaGFubmVscyA9PT0gRk9STUFUX0NIQU5ORUxTW2ZsYWdzLmZvcm1hdF0sXG4gICAgICAgICdudW1iZXIgb2YgY2hhbm5lbHMgaW5jb25zaXN0ZW50IHdpdGggc3BlY2lmaWVkIGZvcm1hdCcpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEZsYWdzIChmbGFncykge1xuICAgIGdsLnBpeGVsU3RvcmVpKEdMX1VOUEFDS19GTElQX1lfV0VCR0wsIGZsYWdzLmZsaXBZKTtcbiAgICBnbC5waXhlbFN0b3JlaShHTF9VTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0wsIGZsYWdzLnByZW11bHRpcGx5QWxwaGEpO1xuICAgIGdsLnBpeGVsU3RvcmVpKEdMX1VOUEFDS19DT0xPUlNQQUNFX0NPTlZFUlNJT05fV0VCR0wsIGZsYWdzLmNvbG9yU3BhY2UpO1xuICAgIGdsLnBpeGVsU3RvcmVpKEdMX1VOUEFDS19BTElHTk1FTlQsIGZsYWdzLnVucGFja0FsaWdubWVudCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFRleCBpbWFnZSBkYXRhXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZnVuY3Rpb24gVGV4SW1hZ2UgKCkge1xuICAgIFRleEZsYWdzLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLnhPZmZzZXQgPSAwO1xuICAgIHRoaXMueU9mZnNldCA9IDA7XG5cbiAgICAvLyBkYXRhXG4gICAgdGhpcy5kYXRhID0gbnVsbDtcbiAgICB0aGlzLm5lZWRzRnJlZSA9IGZhbHNlO1xuXG4gICAgLy8gaHRtbCBlbGVtZW50XG4gICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcblxuICAgIC8vIGNvcHlUZXhJbWFnZSBpbmZvXG4gICAgdGhpcy5uZWVkc0NvcHkgPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlSW1hZ2UgKGltYWdlLCBvcHRpb25zKSB7XG4gICAgdmFyIGRhdGEgPSBudWxsO1xuICAgIGlmIChpc1BpeGVsRGF0YShvcHRpb25zKSkge1xuICAgICAgZGF0YSA9IG9wdGlvbnM7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zKSB7XG4gICAgICBjaGVjayQxLnR5cGUob3B0aW9ucywgJ29iamVjdCcsICdpbnZhbGlkIHBpeGVsIGRhdGEgdHlwZScpO1xuICAgICAgcGFyc2VGbGFncyhpbWFnZSwgb3B0aW9ucyk7XG4gICAgICBpZiAoJ3gnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgaW1hZ2UueE9mZnNldCA9IG9wdGlvbnMueCB8IDA7XG4gICAgICB9XG4gICAgICBpZiAoJ3knIGluIG9wdGlvbnMpIHtcbiAgICAgICAgaW1hZ2UueU9mZnNldCA9IG9wdGlvbnMueSB8IDA7XG4gICAgICB9XG4gICAgICBpZiAoaXNQaXhlbERhdGEob3B0aW9ucy5kYXRhKSkge1xuICAgICAgICBkYXRhID0gb3B0aW9ucy5kYXRhO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrJDEoXG4gICAgICAhaW1hZ2UuY29tcHJlc3NlZCB8fFxuICAgICAgZGF0YSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXksXG4gICAgICAnY29tcHJlc3NlZCB0ZXh0dXJlIGRhdGEgbXVzdCBiZSBzdG9yZWQgaW4gYSB1aW50OGFycmF5Jyk7XG5cbiAgICBpZiAob3B0aW9ucy5jb3B5KSB7XG4gICAgICBjaGVjayQxKCFkYXRhLCAnY2FuIG5vdCBzcGVjaWZ5IGNvcHkgYW5kIGRhdGEgZmllbGQgZm9yIHRoZSBzYW1lIHRleHR1cmUnKTtcbiAgICAgIHZhciB2aWV3VyA9IGNvbnRleHRTdGF0ZS52aWV3cG9ydFdpZHRoO1xuICAgICAgdmFyIHZpZXdIID0gY29udGV4dFN0YXRlLnZpZXdwb3J0SGVpZ2h0O1xuICAgICAgaW1hZ2Uud2lkdGggPSBpbWFnZS53aWR0aCB8fCAodmlld1cgLSBpbWFnZS54T2Zmc2V0KTtcbiAgICAgIGltYWdlLmhlaWdodCA9IGltYWdlLmhlaWdodCB8fCAodmlld0ggLSBpbWFnZS55T2Zmc2V0KTtcbiAgICAgIGltYWdlLm5lZWRzQ29weSA9IHRydWU7XG4gICAgICBjaGVjayQxKGltYWdlLnhPZmZzZXQgPj0gMCAmJiBpbWFnZS54T2Zmc2V0IDwgdmlld1cgJiZcbiAgICAgICAgICAgIGltYWdlLnlPZmZzZXQgPj0gMCAmJiBpbWFnZS55T2Zmc2V0IDwgdmlld0ggJiZcbiAgICAgICAgICAgIGltYWdlLndpZHRoID4gMCAmJiBpbWFnZS53aWR0aCA8PSB2aWV3VyAmJlxuICAgICAgICAgICAgaW1hZ2UuaGVpZ2h0ID4gMCAmJiBpbWFnZS5oZWlnaHQgPD0gdmlld0gsXG4gICAgICAgICAgICAnY29weSB0ZXh0dXJlIHJlYWQgb3V0IG9mIGJvdW5kcycpO1xuICAgIH0gZWxzZSBpZiAoIWRhdGEpIHtcbiAgICAgIGltYWdlLndpZHRoID0gaW1hZ2Uud2lkdGggfHwgMTtcbiAgICAgIGltYWdlLmhlaWdodCA9IGltYWdlLmhlaWdodCB8fCAxO1xuICAgICAgaW1hZ2UuY2hhbm5lbHMgPSBpbWFnZS5jaGFubmVscyB8fCA0O1xuICAgIH0gZWxzZSBpZiAoaXNUeXBlZEFycmF5KGRhdGEpKSB7XG4gICAgICBpbWFnZS5jaGFubmVscyA9IGltYWdlLmNoYW5uZWxzIHx8IDQ7XG4gICAgICBpbWFnZS5kYXRhID0gZGF0YTtcbiAgICAgIGlmICghKCd0eXBlJyBpbiBvcHRpb25zKSAmJiBpbWFnZS50eXBlID09PSBHTF9VTlNJR05FRF9CWVRFJDUpIHtcbiAgICAgICAgaW1hZ2UudHlwZSA9IHR5cGVkQXJyYXlDb2RlJDEoZGF0YSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc051bWVyaWNBcnJheShkYXRhKSkge1xuICAgICAgaW1hZ2UuY2hhbm5lbHMgPSBpbWFnZS5jaGFubmVscyB8fCA0O1xuICAgICAgY29udmVydERhdGEoaW1hZ2UsIGRhdGEpO1xuICAgICAgaW1hZ2UuYWxpZ25tZW50ID0gMTtcbiAgICAgIGltYWdlLm5lZWRzRnJlZSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChpc05EQXJyYXlMaWtlKGRhdGEpKSB7XG4gICAgICB2YXIgYXJyYXkgPSBkYXRhLmRhdGE7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXkpICYmIGltYWdlLnR5cGUgPT09IEdMX1VOU0lHTkVEX0JZVEUkNSkge1xuICAgICAgICBpbWFnZS50eXBlID0gdHlwZWRBcnJheUNvZGUkMShhcnJheSk7XG4gICAgICB9XG4gICAgICB2YXIgc2hhcGUgPSBkYXRhLnNoYXBlO1xuICAgICAgdmFyIHN0cmlkZSA9IGRhdGEuc3RyaWRlO1xuICAgICAgdmFyIHNoYXBlWCwgc2hhcGVZLCBzaGFwZUMsIHN0cmlkZVgsIHN0cmlkZVksIHN0cmlkZUM7XG4gICAgICBpZiAoc2hhcGUubGVuZ3RoID09PSAzKSB7XG4gICAgICAgIHNoYXBlQyA9IHNoYXBlWzJdO1xuICAgICAgICBzdHJpZGVDID0gc3RyaWRlWzJdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hlY2skMShzaGFwZS5sZW5ndGggPT09IDIsICdpbnZhbGlkIG5kYXJyYXkgcGl4ZWwgZGF0YSwgbXVzdCBiZSAyIG9yIDNEJyk7XG4gICAgICAgIHNoYXBlQyA9IDE7XG4gICAgICAgIHN0cmlkZUMgPSAxO1xuICAgICAgfVxuICAgICAgc2hhcGVYID0gc2hhcGVbMF07XG4gICAgICBzaGFwZVkgPSBzaGFwZVsxXTtcbiAgICAgIHN0cmlkZVggPSBzdHJpZGVbMF07XG4gICAgICBzdHJpZGVZID0gc3RyaWRlWzFdO1xuICAgICAgaW1hZ2UuYWxpZ25tZW50ID0gMTtcbiAgICAgIGltYWdlLndpZHRoID0gc2hhcGVYO1xuICAgICAgaW1hZ2UuaGVpZ2h0ID0gc2hhcGVZO1xuICAgICAgaW1hZ2UuY2hhbm5lbHMgPSBzaGFwZUM7XG4gICAgICBpbWFnZS5mb3JtYXQgPSBpbWFnZS5pbnRlcm5hbGZvcm1hdCA9IENIQU5ORUxTX0ZPUk1BVFtzaGFwZUNdO1xuICAgICAgaW1hZ2UubmVlZHNGcmVlID0gdHJ1ZTtcbiAgICAgIHRyYW5zcG9zZURhdGEoaW1hZ2UsIGFycmF5LCBzdHJpZGVYLCBzdHJpZGVZLCBzdHJpZGVDLCBkYXRhLm9mZnNldCk7XG4gICAgfSBlbHNlIGlmIChpc0NhbnZhc0VsZW1lbnQoZGF0YSkgfHwgaXNDb250ZXh0MkQoZGF0YSkpIHtcbiAgICAgIGlmIChpc0NhbnZhc0VsZW1lbnQoZGF0YSkpIHtcbiAgICAgICAgaW1hZ2UuZWxlbWVudCA9IGRhdGE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbWFnZS5lbGVtZW50ID0gZGF0YS5jYW52YXM7XG4gICAgICB9XG4gICAgICBpbWFnZS53aWR0aCA9IGltYWdlLmVsZW1lbnQud2lkdGg7XG4gICAgICBpbWFnZS5oZWlnaHQgPSBpbWFnZS5lbGVtZW50LmhlaWdodDtcbiAgICAgIGltYWdlLmNoYW5uZWxzID0gNDtcbiAgICB9IGVsc2UgaWYgKGlzQml0bWFwKGRhdGEpKSB7XG4gICAgICBpbWFnZS5lbGVtZW50ID0gZGF0YTtcbiAgICAgIGltYWdlLndpZHRoID0gZGF0YS53aWR0aDtcbiAgICAgIGltYWdlLmhlaWdodCA9IGRhdGEuaGVpZ2h0O1xuICAgICAgaW1hZ2UuY2hhbm5lbHMgPSA0O1xuICAgIH0gZWxzZSBpZiAoaXNJbWFnZUVsZW1lbnQoZGF0YSkpIHtcbiAgICAgIGltYWdlLmVsZW1lbnQgPSBkYXRhO1xuICAgICAgaW1hZ2Uud2lkdGggPSBkYXRhLm5hdHVyYWxXaWR0aDtcbiAgICAgIGltYWdlLmhlaWdodCA9IGRhdGEubmF0dXJhbEhlaWdodDtcbiAgICAgIGltYWdlLmNoYW5uZWxzID0gNDtcbiAgICB9IGVsc2UgaWYgKGlzVmlkZW9FbGVtZW50KGRhdGEpKSB7XG4gICAgICBpbWFnZS5lbGVtZW50ID0gZGF0YTtcbiAgICAgIGltYWdlLndpZHRoID0gZGF0YS52aWRlb1dpZHRoO1xuICAgICAgaW1hZ2UuaGVpZ2h0ID0gZGF0YS52aWRlb0hlaWdodDtcbiAgICAgIGltYWdlLmNoYW5uZWxzID0gNDtcbiAgICB9IGVsc2UgaWYgKGlzUmVjdEFycmF5KGRhdGEpKSB7XG4gICAgICB2YXIgdyA9IGltYWdlLndpZHRoIHx8IGRhdGFbMF0ubGVuZ3RoO1xuICAgICAgdmFyIGggPSBpbWFnZS5oZWlnaHQgfHwgZGF0YS5sZW5ndGg7XG4gICAgICB2YXIgYyA9IGltYWdlLmNoYW5uZWxzO1xuICAgICAgaWYgKGlzQXJyYXlMaWtlKGRhdGFbMF1bMF0pKSB7XG4gICAgICAgIGMgPSBjIHx8IGRhdGFbMF1bMF0ubGVuZ3RoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYyA9IGMgfHwgMTtcbiAgICAgIH1cbiAgICAgIHZhciBhcnJheVNoYXBlID0gZmxhdHRlblV0aWxzLnNoYXBlKGRhdGEpO1xuICAgICAgdmFyIG4gPSAxO1xuICAgICAgZm9yICh2YXIgZGQgPSAwOyBkZCA8IGFycmF5U2hhcGUubGVuZ3RoOyArK2RkKSB7XG4gICAgICAgIG4gKj0gYXJyYXlTaGFwZVtkZF07XG4gICAgICB9XG4gICAgICB2YXIgYWxsb2NEYXRhID0gcHJlQ29udmVydChpbWFnZSwgbik7XG4gICAgICBmbGF0dGVuVXRpbHMuZmxhdHRlbihkYXRhLCBhcnJheVNoYXBlLCAnJywgYWxsb2NEYXRhKTtcbiAgICAgIHBvc3RDb252ZXJ0KGltYWdlLCBhbGxvY0RhdGEpO1xuICAgICAgaW1hZ2UuYWxpZ25tZW50ID0gMTtcbiAgICAgIGltYWdlLndpZHRoID0gdztcbiAgICAgIGltYWdlLmhlaWdodCA9IGg7XG4gICAgICBpbWFnZS5jaGFubmVscyA9IGM7XG4gICAgICBpbWFnZS5mb3JtYXQgPSBpbWFnZS5pbnRlcm5hbGZvcm1hdCA9IENIQU5ORUxTX0ZPUk1BVFtjXTtcbiAgICAgIGltYWdlLm5lZWRzRnJlZSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGltYWdlLnR5cGUgPT09IEdMX0ZMT0FUJDQpIHtcbiAgICAgIGNoZWNrJDEobGltaXRzLmV4dGVuc2lvbnMuaW5kZXhPZignb2VzX3RleHR1cmVfZmxvYXQnKSA+PSAwLFxuICAgICAgICAnb2VzX3RleHR1cmVfZmxvYXQgZXh0ZW5zaW9uIG5vdCBlbmFibGVkJyk7XG4gICAgfSBlbHNlIGlmIChpbWFnZS50eXBlID09PSBHTF9IQUxGX0ZMT0FUX09FUyQxKSB7XG4gICAgICBjaGVjayQxKGxpbWl0cy5leHRlbnNpb25zLmluZGV4T2YoJ29lc190ZXh0dXJlX2hhbGZfZmxvYXQnKSA+PSAwLFxuICAgICAgICAnb2VzX3RleHR1cmVfaGFsZl9mbG9hdCBleHRlbnNpb24gbm90IGVuYWJsZWQnKTtcbiAgICB9XG5cbiAgICAvLyBkbyBjb21wcmVzc2VkIHRleHR1cmUgIHZhbGlkYXRpb24gaGVyZS5cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEltYWdlIChpbmZvLCB0YXJnZXQsIG1pcGxldmVsKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBpbmZvLmVsZW1lbnQ7XG4gICAgdmFyIGRhdGEgPSBpbmZvLmRhdGE7XG4gICAgdmFyIGludGVybmFsZm9ybWF0ID0gaW5mby5pbnRlcm5hbGZvcm1hdDtcbiAgICB2YXIgZm9ybWF0ID0gaW5mby5mb3JtYXQ7XG4gICAgdmFyIHR5cGUgPSBpbmZvLnR5cGU7XG4gICAgdmFyIHdpZHRoID0gaW5mby53aWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gaW5mby5oZWlnaHQ7XG4gICAgdmFyIGNoYW5uZWxzID0gaW5mby5jaGFubmVscztcblxuICAgIHNldEZsYWdzKGluZm8pO1xuXG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIGdsLnRleEltYWdlMkQodGFyZ2V0LCBtaXBsZXZlbCwgZm9ybWF0LCBmb3JtYXQsIHR5cGUsIGVsZW1lbnQpO1xuICAgIH0gZWxzZSBpZiAoaW5mby5jb21wcmVzc2VkKSB7XG4gICAgICBnbC5jb21wcmVzc2VkVGV4SW1hZ2UyRCh0YXJnZXQsIG1pcGxldmVsLCBpbnRlcm5hbGZvcm1hdCwgd2lkdGgsIGhlaWdodCwgMCwgZGF0YSk7XG4gICAgfSBlbHNlIGlmIChpbmZvLm5lZWRzQ29weSkge1xuICAgICAgcmVnbFBvbGwoKTtcbiAgICAgIGdsLmNvcHlUZXhJbWFnZTJEKFxuICAgICAgICB0YXJnZXQsIG1pcGxldmVsLCBmb3JtYXQsIGluZm8ueE9mZnNldCwgaW5mby55T2Zmc2V0LCB3aWR0aCwgaGVpZ2h0LCAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG51bGxEYXRhID0gIWRhdGE7XG4gICAgICBpZiAobnVsbERhdGEpIHtcbiAgICAgICAgZGF0YSA9IHBvb2wuemVyby5hbGxvY1R5cGUodHlwZSwgd2lkdGggKiBoZWlnaHQgKiBjaGFubmVscyk7XG4gICAgICB9XG5cbiAgICAgIGdsLnRleEltYWdlMkQodGFyZ2V0LCBtaXBsZXZlbCwgZm9ybWF0LCB3aWR0aCwgaGVpZ2h0LCAwLCBmb3JtYXQsIHR5cGUsIGRhdGEpO1xuXG4gICAgICBpZiAobnVsbERhdGEgJiYgZGF0YSkge1xuICAgICAgICBwb29sLnplcm8uZnJlZVR5cGUoZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0U3ViSW1hZ2UgKGluZm8sIHRhcmdldCwgeCwgeSwgbWlwbGV2ZWwpIHtcbiAgICB2YXIgZWxlbWVudCA9IGluZm8uZWxlbWVudDtcbiAgICB2YXIgZGF0YSA9IGluZm8uZGF0YTtcbiAgICB2YXIgaW50ZXJuYWxmb3JtYXQgPSBpbmZvLmludGVybmFsZm9ybWF0O1xuICAgIHZhciBmb3JtYXQgPSBpbmZvLmZvcm1hdDtcbiAgICB2YXIgdHlwZSA9IGluZm8udHlwZTtcbiAgICB2YXIgd2lkdGggPSBpbmZvLndpZHRoO1xuICAgIHZhciBoZWlnaHQgPSBpbmZvLmhlaWdodDtcblxuICAgIHNldEZsYWdzKGluZm8pO1xuXG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIGdsLnRleFN1YkltYWdlMkQoXG4gICAgICAgIHRhcmdldCwgbWlwbGV2ZWwsIHgsIHksIGZvcm1hdCwgdHlwZSwgZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmIChpbmZvLmNvbXByZXNzZWQpIHtcbiAgICAgIGdsLmNvbXByZXNzZWRUZXhTdWJJbWFnZTJEKFxuICAgICAgICB0YXJnZXQsIG1pcGxldmVsLCB4LCB5LCBpbnRlcm5hbGZvcm1hdCwgd2lkdGgsIGhlaWdodCwgZGF0YSk7XG4gICAgfSBlbHNlIGlmIChpbmZvLm5lZWRzQ29weSkge1xuICAgICAgcmVnbFBvbGwoKTtcbiAgICAgIGdsLmNvcHlUZXhTdWJJbWFnZTJEKFxuICAgICAgICB0YXJnZXQsIG1pcGxldmVsLCB4LCB5LCBpbmZvLnhPZmZzZXQsIGluZm8ueU9mZnNldCwgd2lkdGgsIGhlaWdodCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsLnRleFN1YkltYWdlMkQoXG4gICAgICAgIHRhcmdldCwgbWlwbGV2ZWwsIHgsIHksIHdpZHRoLCBoZWlnaHQsIGZvcm1hdCwgdHlwZSwgZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLy8gdGV4SW1hZ2UgcG9vbFxuICB2YXIgaW1hZ2VQb29sID0gW107XG5cbiAgZnVuY3Rpb24gYWxsb2NJbWFnZSAoKSB7XG4gICAgcmV0dXJuIGltYWdlUG9vbC5wb3AoKSB8fCBuZXcgVGV4SW1hZ2UoKVxuICB9XG5cbiAgZnVuY3Rpb24gZnJlZUltYWdlIChpbWFnZSkge1xuICAgIGlmIChpbWFnZS5uZWVkc0ZyZWUpIHtcbiAgICAgIHBvb2wuZnJlZVR5cGUoaW1hZ2UuZGF0YSk7XG4gICAgfVxuICAgIFRleEltYWdlLmNhbGwoaW1hZ2UpO1xuICAgIGltYWdlUG9vbC5wdXNoKGltYWdlKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTWlwIG1hcFxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGZ1bmN0aW9uIE1pcE1hcCAoKSB7XG4gICAgVGV4RmxhZ3MuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuZ2VuTWlwbWFwcyA9IGZhbHNlO1xuICAgIHRoaXMubWlwbWFwSGludCA9IEdMX0RPTlRfQ0FSRTtcbiAgICB0aGlzLm1pcG1hc2sgPSAwO1xuICAgIHRoaXMuaW1hZ2VzID0gQXJyYXkoMTYpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VNaXBNYXBGcm9tU2hhcGUgKG1pcG1hcCwgd2lkdGgsIGhlaWdodCkge1xuICAgIHZhciBpbWcgPSBtaXBtYXAuaW1hZ2VzWzBdID0gYWxsb2NJbWFnZSgpO1xuICAgIG1pcG1hcC5taXBtYXNrID0gMTtcbiAgICBpbWcud2lkdGggPSBtaXBtYXAud2lkdGggPSB3aWR0aDtcbiAgICBpbWcuaGVpZ2h0ID0gbWlwbWFwLmhlaWdodCA9IGhlaWdodDtcbiAgICBpbWcuY2hhbm5lbHMgPSBtaXBtYXAuY2hhbm5lbHMgPSA0O1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VNaXBNYXBGcm9tT2JqZWN0IChtaXBtYXAsIG9wdGlvbnMpIHtcbiAgICB2YXIgaW1nRGF0YSA9IG51bGw7XG4gICAgaWYgKGlzUGl4ZWxEYXRhKG9wdGlvbnMpKSB7XG4gICAgICBpbWdEYXRhID0gbWlwbWFwLmltYWdlc1swXSA9IGFsbG9jSW1hZ2UoKTtcbiAgICAgIGNvcHlGbGFncyhpbWdEYXRhLCBtaXBtYXApO1xuICAgICAgcGFyc2VJbWFnZShpbWdEYXRhLCBvcHRpb25zKTtcbiAgICAgIG1pcG1hcC5taXBtYXNrID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyc2VGbGFncyhtaXBtYXAsIG9wdGlvbnMpO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9ucy5taXBtYXApKSB7XG4gICAgICAgIHZhciBtaXBEYXRhID0gb3B0aW9ucy5taXBtYXA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWlwRGF0YS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgIGltZ0RhdGEgPSBtaXBtYXAuaW1hZ2VzW2ldID0gYWxsb2NJbWFnZSgpO1xuICAgICAgICAgIGNvcHlGbGFncyhpbWdEYXRhLCBtaXBtYXApO1xuICAgICAgICAgIGltZ0RhdGEud2lkdGggPj49IGk7XG4gICAgICAgICAgaW1nRGF0YS5oZWlnaHQgPj49IGk7XG4gICAgICAgICAgcGFyc2VJbWFnZShpbWdEYXRhLCBtaXBEYXRhW2ldKTtcbiAgICAgICAgICBtaXBtYXAubWlwbWFzayB8PSAoMSA8PCBpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW1nRGF0YSA9IG1pcG1hcC5pbWFnZXNbMF0gPSBhbGxvY0ltYWdlKCk7XG4gICAgICAgIGNvcHlGbGFncyhpbWdEYXRhLCBtaXBtYXApO1xuICAgICAgICBwYXJzZUltYWdlKGltZ0RhdGEsIG9wdGlvbnMpO1xuICAgICAgICBtaXBtYXAubWlwbWFzayA9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIGNvcHlGbGFncyhtaXBtYXAsIG1pcG1hcC5pbWFnZXNbMF0pO1xuXG4gICAgLy8gRm9yIHRleHR1cmVzIG9mIHRoZSBjb21wcmVzc2VkIGZvcm1hdCBXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0Y1xuICAgIC8vIHdlIG11c3QgaGF2ZSB0aGF0XG4gICAgLy9cbiAgICAvLyBcIldoZW4gbGV2ZWwgZXF1YWxzIHplcm8gd2lkdGggYW5kIGhlaWdodCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNC5cbiAgICAvLyBXaGVuIGxldmVsIGlzIGdyZWF0ZXIgdGhhbiAwIHdpZHRoIGFuZCBoZWlnaHQgbXVzdCBiZSAwLCAxLCAyIG9yIGEgbXVsdGlwbGUgb2YgNC4gXCJcbiAgICAvL1xuICAgIC8vIGJ1dCB3ZSBkbyBub3QgeWV0IHN1cHBvcnQgaGF2aW5nIG11bHRpcGxlIG1pcG1hcCBsZXZlbHMgZm9yIGNvbXByZXNzZWQgdGV4dHVyZXMsXG4gICAgLy8gc28gd2Ugb25seSB0ZXN0IGZvciBsZXZlbCB6ZXJvLlxuXG4gICAgaWYgKG1pcG1hcC5jb21wcmVzc2VkICYmXG4gICAgICAgIChtaXBtYXAuaW50ZXJuYWxmb3JtYXQgPT09IEdMX0NPTVBSRVNTRURfUkdCX1MzVENfRFhUMV9FWFQpIHx8XG4gICAgICAgIChtaXBtYXAuaW50ZXJuYWxmb3JtYXQgPT09IEdMX0NPTVBSRVNTRURfUkdCQV9TM1RDX0RYVDFfRVhUKSB8fFxuICAgICAgICAobWlwbWFwLmludGVybmFsZm9ybWF0ID09PSBHTF9DT01QUkVTU0VEX1JHQkFfUzNUQ19EWFQzX0VYVCkgfHxcbiAgICAgICAgKG1pcG1hcC5pbnRlcm5hbGZvcm1hdCA9PT0gR0xfQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUNV9FWFQpKSB7XG4gICAgICBjaGVjayQxKG1pcG1hcC53aWR0aCAlIDQgPT09IDAgJiZcbiAgICAgICAgICAgIG1pcG1hcC5oZWlnaHQgJSA0ID09PSAwLFxuICAgICAgICAgICAgJ2ZvciBjb21wcmVzc2VkIHRleHR1cmUgZm9ybWF0cywgbWlwbWFwIGxldmVsIDAgbXVzdCBoYXZlIHdpZHRoIGFuZCBoZWlnaHQgdGhhdCBhcmUgYSBtdWx0aXBsZSBvZiA0Jyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0TWlwTWFwIChtaXBtYXAsIHRhcmdldCkge1xuICAgIHZhciBpbWFnZXMgPSBtaXBtYXAuaW1hZ2VzO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW1hZ2VzLmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoIWltYWdlc1tpXSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHNldEltYWdlKGltYWdlc1tpXSwgdGFyZ2V0LCBpKTtcbiAgICB9XG4gIH1cblxuICB2YXIgbWlwUG9vbCA9IFtdO1xuXG4gIGZ1bmN0aW9uIGFsbG9jTWlwTWFwICgpIHtcbiAgICB2YXIgcmVzdWx0ID0gbWlwUG9vbC5wb3AoKSB8fCBuZXcgTWlwTWFwKCk7XG4gICAgVGV4RmxhZ3MuY2FsbChyZXN1bHQpO1xuICAgIHJlc3VsdC5taXBtYXNrID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICAgIHJlc3VsdC5pbWFnZXNbaV0gPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBmdW5jdGlvbiBmcmVlTWlwTWFwIChtaXBtYXApIHtcbiAgICB2YXIgaW1hZ2VzID0gbWlwbWFwLmltYWdlcztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGltYWdlcy5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKGltYWdlc1tpXSkge1xuICAgICAgICBmcmVlSW1hZ2UoaW1hZ2VzW2ldKTtcbiAgICAgIH1cbiAgICAgIGltYWdlc1tpXSA9IG51bGw7XG4gICAgfVxuICAgIG1pcFBvb2wucHVzaChtaXBtYXApO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBUZXggaW5mb1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGZ1bmN0aW9uIFRleEluZm8gKCkge1xuICAgIHRoaXMubWluRmlsdGVyID0gR0xfTkVBUkVTVCQxO1xuICAgIHRoaXMubWFnRmlsdGVyID0gR0xfTkVBUkVTVCQxO1xuXG4gICAgdGhpcy53cmFwUyA9IEdMX0NMQU1QX1RPX0VER0UkMTtcbiAgICB0aGlzLndyYXBUID0gR0xfQ0xBTVBfVE9fRURHRSQxO1xuXG4gICAgdGhpcy5hbmlzb3Ryb3BpYyA9IDE7XG5cbiAgICB0aGlzLmdlbk1pcG1hcHMgPSBmYWxzZTtcbiAgICB0aGlzLm1pcG1hcEhpbnQgPSBHTF9ET05UX0NBUkU7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVRleEluZm8gKGluZm8sIG9wdGlvbnMpIHtcbiAgICBpZiAoJ21pbicgaW4gb3B0aW9ucykge1xuICAgICAgdmFyIG1pbkZpbHRlciA9IG9wdGlvbnMubWluO1xuICAgICAgY2hlY2skMS5wYXJhbWV0ZXIobWluRmlsdGVyLCBtaW5GaWx0ZXJzKTtcbiAgICAgIGluZm8ubWluRmlsdGVyID0gbWluRmlsdGVyc1ttaW5GaWx0ZXJdO1xuICAgICAgaWYgKE1JUE1BUF9GSUxURVJTLmluZGV4T2YoaW5mby5taW5GaWx0ZXIpID49IDAgJiYgISgnZmFjZXMnIGluIG9wdGlvbnMpKSB7XG4gICAgICAgIGluZm8uZ2VuTWlwbWFwcyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCdtYWcnIGluIG9wdGlvbnMpIHtcbiAgICAgIHZhciBtYWdGaWx0ZXIgPSBvcHRpb25zLm1hZztcbiAgICAgIGNoZWNrJDEucGFyYW1ldGVyKG1hZ0ZpbHRlciwgbWFnRmlsdGVycyk7XG4gICAgICBpbmZvLm1hZ0ZpbHRlciA9IG1hZ0ZpbHRlcnNbbWFnRmlsdGVyXTtcbiAgICB9XG5cbiAgICB2YXIgd3JhcFMgPSBpbmZvLndyYXBTO1xuICAgIHZhciB3cmFwVCA9IGluZm8ud3JhcFQ7XG4gICAgaWYgKCd3cmFwJyBpbiBvcHRpb25zKSB7XG4gICAgICB2YXIgd3JhcCA9IG9wdGlvbnMud3JhcDtcbiAgICAgIGlmICh0eXBlb2Ygd3JhcCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY2hlY2skMS5wYXJhbWV0ZXIod3JhcCwgd3JhcE1vZGVzKTtcbiAgICAgICAgd3JhcFMgPSB3cmFwVCA9IHdyYXBNb2Rlc1t3cmFwXTtcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh3cmFwKSkge1xuICAgICAgICBjaGVjayQxLnBhcmFtZXRlcih3cmFwWzBdLCB3cmFwTW9kZXMpO1xuICAgICAgICBjaGVjayQxLnBhcmFtZXRlcih3cmFwWzFdLCB3cmFwTW9kZXMpO1xuICAgICAgICB3cmFwUyA9IHdyYXBNb2Rlc1t3cmFwWzBdXTtcbiAgICAgICAgd3JhcFQgPSB3cmFwTW9kZXNbd3JhcFsxXV07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICgnd3JhcFMnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG9wdFdyYXBTID0gb3B0aW9ucy53cmFwUztcbiAgICAgICAgY2hlY2skMS5wYXJhbWV0ZXIob3B0V3JhcFMsIHdyYXBNb2Rlcyk7XG4gICAgICAgIHdyYXBTID0gd3JhcE1vZGVzW29wdFdyYXBTXTtcbiAgICAgIH1cbiAgICAgIGlmICgnd3JhcFQnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG9wdFdyYXBUID0gb3B0aW9ucy53cmFwVDtcbiAgICAgICAgY2hlY2skMS5wYXJhbWV0ZXIob3B0V3JhcFQsIHdyYXBNb2Rlcyk7XG4gICAgICAgIHdyYXBUID0gd3JhcE1vZGVzW29wdFdyYXBUXTtcbiAgICAgIH1cbiAgICB9XG4gICAgaW5mby53cmFwUyA9IHdyYXBTO1xuICAgIGluZm8ud3JhcFQgPSB3cmFwVDtcblxuICAgIGlmICgnYW5pc290cm9waWMnIGluIG9wdGlvbnMpIHtcbiAgICAgIHZhciBhbmlzb3Ryb3BpYyA9IG9wdGlvbnMuYW5pc290cm9waWM7XG4gICAgICBjaGVjayQxKHR5cGVvZiBhbmlzb3Ryb3BpYyA9PT0gJ251bWJlcicgJiZcbiAgICAgICAgIGFuaXNvdHJvcGljID49IDEgJiYgYW5pc290cm9waWMgPD0gbGltaXRzLm1heEFuaXNvdHJvcGljLFxuICAgICAgICAnYW5pc28gc2FtcGxlcyBtdXN0IGJlIGJldHdlZW4gMSBhbmQgJyk7XG4gICAgICBpbmZvLmFuaXNvdHJvcGljID0gb3B0aW9ucy5hbmlzb3Ryb3BpYztcbiAgICB9XG5cbiAgICBpZiAoJ21pcG1hcCcgaW4gb3B0aW9ucykge1xuICAgICAgdmFyIGhhc01pcE1hcCA9IGZhbHNlO1xuICAgICAgc3dpdGNoICh0eXBlb2Ygb3B0aW9ucy5taXBtYXApIHtcbiAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICBjaGVjayQxLnBhcmFtZXRlcihvcHRpb25zLm1pcG1hcCwgbWlwbWFwSGludCxcbiAgICAgICAgICAgICdpbnZhbGlkIG1pcG1hcCBoaW50Jyk7XG4gICAgICAgICAgaW5mby5taXBtYXBIaW50ID0gbWlwbWFwSGludFtvcHRpb25zLm1pcG1hcF07XG4gICAgICAgICAgaW5mby5nZW5NaXBtYXBzID0gdHJ1ZTtcbiAgICAgICAgICBoYXNNaXBNYXAgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgaGFzTWlwTWFwID0gaW5mby5nZW5NaXBtYXBzID0gb3B0aW9ucy5taXBtYXA7XG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgIGNoZWNrJDEoQXJyYXkuaXNBcnJheShvcHRpb25zLm1pcG1hcCksICdpbnZhbGlkIG1pcG1hcCB0eXBlJyk7XG4gICAgICAgICAgaW5mby5nZW5NaXBtYXBzID0gZmFsc2U7XG4gICAgICAgICAgaGFzTWlwTWFwID0gdHJ1ZTtcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY2hlY2skMS5yYWlzZSgnaW52YWxpZCBtaXBtYXAgdHlwZScpO1xuICAgICAgfVxuICAgICAgaWYgKGhhc01pcE1hcCAmJiAhKCdtaW4nIGluIG9wdGlvbnMpKSB7XG4gICAgICAgIGluZm8ubWluRmlsdGVyID0gR0xfTkVBUkVTVF9NSVBNQVBfTkVBUkVTVCQxO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFRleEluZm8gKGluZm8sIHRhcmdldCkge1xuICAgIGdsLnRleFBhcmFtZXRlcmkodGFyZ2V0LCBHTF9URVhUVVJFX01JTl9GSUxURVIsIGluZm8ubWluRmlsdGVyKTtcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKHRhcmdldCwgR0xfVEVYVFVSRV9NQUdfRklMVEVSLCBpbmZvLm1hZ0ZpbHRlcik7XG4gICAgZ2wudGV4UGFyYW1ldGVyaSh0YXJnZXQsIEdMX1RFWFRVUkVfV1JBUF9TLCBpbmZvLndyYXBTKTtcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKHRhcmdldCwgR0xfVEVYVFVSRV9XUkFQX1QsIGluZm8ud3JhcFQpO1xuICAgIGlmIChleHRlbnNpb25zLmV4dF90ZXh0dXJlX2ZpbHRlcl9hbmlzb3Ryb3BpYykge1xuICAgICAgZ2wudGV4UGFyYW1ldGVyaSh0YXJnZXQsIEdMX1RFWFRVUkVfTUFYX0FOSVNPVFJPUFlfRVhULCBpbmZvLmFuaXNvdHJvcGljKTtcbiAgICB9XG4gICAgaWYgKGluZm8uZ2VuTWlwbWFwcykge1xuICAgICAgZ2wuaGludChHTF9HRU5FUkFURV9NSVBNQVBfSElOVCwgaW5mby5taXBtYXBIaW50KTtcbiAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKHRhcmdldCk7XG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBGdWxsIHRleHR1cmUgb2JqZWN0XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgdmFyIHRleHR1cmVDb3VudCA9IDA7XG4gIHZhciB0ZXh0dXJlU2V0ID0ge307XG4gIHZhciBudW1UZXhVbml0cyA9IGxpbWl0cy5tYXhUZXh0dXJlVW5pdHM7XG4gIHZhciB0ZXh0dXJlVW5pdHMgPSBBcnJheShudW1UZXhVbml0cykubWFwKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9KTtcblxuICBmdW5jdGlvbiBSRUdMVGV4dHVyZSAodGFyZ2V0KSB7XG4gICAgVGV4RmxhZ3MuY2FsbCh0aGlzKTtcbiAgICB0aGlzLm1pcG1hc2sgPSAwO1xuICAgIHRoaXMuaW50ZXJuYWxmb3JtYXQgPSBHTF9SR0JBJDE7XG5cbiAgICB0aGlzLmlkID0gdGV4dHVyZUNvdW50Kys7XG5cbiAgICB0aGlzLnJlZkNvdW50ID0gMTtcblxuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMudGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcblxuICAgIHRoaXMudW5pdCA9IC0xO1xuICAgIHRoaXMuYmluZENvdW50ID0gMDtcblxuICAgIHRoaXMudGV4SW5mbyA9IG5ldyBUZXhJbmZvKCk7XG5cbiAgICBpZiAoY29uZmlnLnByb2ZpbGUpIHtcbiAgICAgIHRoaXMuc3RhdHMgPSB7c2l6ZTogMH07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdGVtcEJpbmQgKHRleHR1cmUpIHtcbiAgICBnbC5hY3RpdmVUZXh0dXJlKEdMX1RFWFRVUkUwJDEpO1xuICAgIGdsLmJpbmRUZXh0dXJlKHRleHR1cmUudGFyZ2V0LCB0ZXh0dXJlLnRleHR1cmUpO1xuICB9XG5cbiAgZnVuY3Rpb24gdGVtcFJlc3RvcmUgKCkge1xuICAgIHZhciBwcmV2ID0gdGV4dHVyZVVuaXRzWzBdO1xuICAgIGlmIChwcmV2KSB7XG4gICAgICBnbC5iaW5kVGV4dHVyZShwcmV2LnRhcmdldCwgcHJldi50ZXh0dXJlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2wuYmluZFRleHR1cmUoR0xfVEVYVFVSRV8yRCQxLCBudWxsKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95ICh0ZXh0dXJlKSB7XG4gICAgdmFyIGhhbmRsZSA9IHRleHR1cmUudGV4dHVyZTtcbiAgICBjaGVjayQxKGhhbmRsZSwgJ211c3Qgbm90IGRvdWJsZSBkZXN0cm95IHRleHR1cmUnKTtcbiAgICB2YXIgdW5pdCA9IHRleHR1cmUudW5pdDtcbiAgICB2YXIgdGFyZ2V0ID0gdGV4dHVyZS50YXJnZXQ7XG4gICAgaWYgKHVuaXQgPj0gMCkge1xuICAgICAgZ2wuYWN0aXZlVGV4dHVyZShHTF9URVhUVVJFMCQxICsgdW5pdCk7XG4gICAgICBnbC5iaW5kVGV4dHVyZSh0YXJnZXQsIG51bGwpO1xuICAgICAgdGV4dHVyZVVuaXRzW3VuaXRdID0gbnVsbDtcbiAgICB9XG4gICAgZ2wuZGVsZXRlVGV4dHVyZShoYW5kbGUpO1xuICAgIHRleHR1cmUudGV4dHVyZSA9IG51bGw7XG4gICAgdGV4dHVyZS5wYXJhbXMgPSBudWxsO1xuICAgIHRleHR1cmUucGl4ZWxzID0gbnVsbDtcbiAgICB0ZXh0dXJlLnJlZkNvdW50ID0gMDtcbiAgICBkZWxldGUgdGV4dHVyZVNldFt0ZXh0dXJlLmlkXTtcbiAgICBzdGF0cy50ZXh0dXJlQ291bnQtLTtcbiAgfVxuXG4gIGV4dGVuZChSRUdMVGV4dHVyZS5wcm90b3R5cGUsIHtcbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdGV4dHVyZSA9IHRoaXM7XG4gICAgICB0ZXh0dXJlLmJpbmRDb3VudCArPSAxO1xuICAgICAgdmFyIHVuaXQgPSB0ZXh0dXJlLnVuaXQ7XG4gICAgICBpZiAodW5pdCA8IDApIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1UZXhVbml0czsgKytpKSB7XG4gICAgICAgICAgdmFyIG90aGVyID0gdGV4dHVyZVVuaXRzW2ldO1xuICAgICAgICAgIGlmIChvdGhlcikge1xuICAgICAgICAgICAgaWYgKG90aGVyLmJpbmRDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG90aGVyLnVuaXQgPSAtMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGV4dHVyZVVuaXRzW2ldID0gdGV4dHVyZTtcbiAgICAgICAgICB1bml0ID0gaTtcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIGlmICh1bml0ID49IG51bVRleFVuaXRzKSB7XG4gICAgICAgICAgY2hlY2skMS5yYWlzZSgnaW5zdWZmaWNpZW50IG51bWJlciBvZiB0ZXh0dXJlIHVuaXRzJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmZpZy5wcm9maWxlICYmIHN0YXRzLm1heFRleHR1cmVVbml0cyA8ICh1bml0ICsgMSkpIHtcbiAgICAgICAgICBzdGF0cy5tYXhUZXh0dXJlVW5pdHMgPSB1bml0ICsgMTsgLy8gKzEsIHNpbmNlIHRoZSB1bml0cyBhcmUgemVyby1iYXNlZFxuICAgICAgICB9XG4gICAgICAgIHRleHR1cmUudW5pdCA9IHVuaXQ7XG4gICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoR0xfVEVYVFVSRTAkMSArIHVuaXQpO1xuICAgICAgICBnbC5iaW5kVGV4dHVyZSh0ZXh0dXJlLnRhcmdldCwgdGV4dHVyZS50ZXh0dXJlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1bml0XG4gICAgfSxcblxuICAgIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5iaW5kQ291bnQgLT0gMTtcbiAgICB9LFxuXG4gICAgZGVjUmVmOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoLS10aGlzLnJlZkNvdW50IDw9IDApIHtcbiAgICAgICAgZGVzdHJveSh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZVRleHR1cmUyRCAoYSwgYikge1xuICAgIHZhciB0ZXh0dXJlID0gbmV3IFJFR0xUZXh0dXJlKEdMX1RFWFRVUkVfMkQkMSk7XG4gICAgdGV4dHVyZVNldFt0ZXh0dXJlLmlkXSA9IHRleHR1cmU7XG4gICAgc3RhdHMudGV4dHVyZUNvdW50Kys7XG5cbiAgICBmdW5jdGlvbiByZWdsVGV4dHVyZTJEIChhLCBiKSB7XG4gICAgICB2YXIgdGV4SW5mbyA9IHRleHR1cmUudGV4SW5mbztcbiAgICAgIFRleEluZm8uY2FsbCh0ZXhJbmZvKTtcbiAgICAgIHZhciBtaXBEYXRhID0gYWxsb2NNaXBNYXAoKTtcblxuICAgICAgaWYgKHR5cGVvZiBhID09PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAodHlwZW9mIGIgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgcGFyc2VNaXBNYXBGcm9tU2hhcGUobWlwRGF0YSwgYSB8IDAsIGIgfCAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXJzZU1pcE1hcEZyb21TaGFwZShtaXBEYXRhLCBhIHwgMCwgYSB8IDApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGEpIHtcbiAgICAgICAgY2hlY2skMS50eXBlKGEsICdvYmplY3QnLCAnaW52YWxpZCBhcmd1bWVudHMgdG8gcmVnbC50ZXh0dXJlJyk7XG4gICAgICAgIHBhcnNlVGV4SW5mbyh0ZXhJbmZvLCBhKTtcbiAgICAgICAgcGFyc2VNaXBNYXBGcm9tT2JqZWN0KG1pcERhdGEsIGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZW1wdHkgdGV4dHVyZXMgZ2V0IGFzc2lnbmVkIGEgZGVmYXVsdCBzaGFwZSBvZiAxeDFcbiAgICAgICAgcGFyc2VNaXBNYXBGcm9tU2hhcGUobWlwRGF0YSwgMSwgMSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0ZXhJbmZvLmdlbk1pcG1hcHMpIHtcbiAgICAgICAgbWlwRGF0YS5taXBtYXNrID0gKG1pcERhdGEud2lkdGggPDwgMSkgLSAxO1xuICAgICAgfVxuICAgICAgdGV4dHVyZS5taXBtYXNrID0gbWlwRGF0YS5taXBtYXNrO1xuXG4gICAgICBjb3B5RmxhZ3ModGV4dHVyZSwgbWlwRGF0YSk7XG5cbiAgICAgIGNoZWNrJDEudGV4dHVyZTJEKHRleEluZm8sIG1pcERhdGEsIGxpbWl0cyk7XG4gICAgICB0ZXh0dXJlLmludGVybmFsZm9ybWF0ID0gbWlwRGF0YS5pbnRlcm5hbGZvcm1hdDtcblxuICAgICAgcmVnbFRleHR1cmUyRC53aWR0aCA9IG1pcERhdGEud2lkdGg7XG4gICAgICByZWdsVGV4dHVyZTJELmhlaWdodCA9IG1pcERhdGEuaGVpZ2h0O1xuXG4gICAgICB0ZW1wQmluZCh0ZXh0dXJlKTtcbiAgICAgIHNldE1pcE1hcChtaXBEYXRhLCBHTF9URVhUVVJFXzJEJDEpO1xuICAgICAgc2V0VGV4SW5mbyh0ZXhJbmZvLCBHTF9URVhUVVJFXzJEJDEpO1xuICAgICAgdGVtcFJlc3RvcmUoKTtcblxuICAgICAgZnJlZU1pcE1hcChtaXBEYXRhKTtcblxuICAgICAgaWYgKGNvbmZpZy5wcm9maWxlKSB7XG4gICAgICAgIHRleHR1cmUuc3RhdHMuc2l6ZSA9IGdldFRleHR1cmVTaXplKFxuICAgICAgICAgIHRleHR1cmUuaW50ZXJuYWxmb3JtYXQsXG4gICAgICAgICAgdGV4dHVyZS50eXBlLFxuICAgICAgICAgIG1pcERhdGEud2lkdGgsXG4gICAgICAgICAgbWlwRGF0YS5oZWlnaHQsXG4gICAgICAgICAgdGV4SW5mby5nZW5NaXBtYXBzLFxuICAgICAgICAgIGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIHJlZ2xUZXh0dXJlMkQuZm9ybWF0ID0gdGV4dHVyZUZvcm1hdHNJbnZlcnRbdGV4dHVyZS5pbnRlcm5hbGZvcm1hdF07XG4gICAgICByZWdsVGV4dHVyZTJELnR5cGUgPSB0ZXh0dXJlVHlwZXNJbnZlcnRbdGV4dHVyZS50eXBlXTtcblxuICAgICAgcmVnbFRleHR1cmUyRC5tYWcgPSBtYWdGaWx0ZXJzSW52ZXJ0W3RleEluZm8ubWFnRmlsdGVyXTtcbiAgICAgIHJlZ2xUZXh0dXJlMkQubWluID0gbWluRmlsdGVyc0ludmVydFt0ZXhJbmZvLm1pbkZpbHRlcl07XG5cbiAgICAgIHJlZ2xUZXh0dXJlMkQud3JhcFMgPSB3cmFwTW9kZXNJbnZlcnRbdGV4SW5mby53cmFwU107XG4gICAgICByZWdsVGV4dHVyZTJELndyYXBUID0gd3JhcE1vZGVzSW52ZXJ0W3RleEluZm8ud3JhcFRdO1xuXG4gICAgICByZXR1cm4gcmVnbFRleHR1cmUyRFxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN1YmltYWdlIChpbWFnZSwgeF8sIHlfLCBsZXZlbF8pIHtcbiAgICAgIGNoZWNrJDEoISFpbWFnZSwgJ211c3Qgc3BlY2lmeSBpbWFnZSBkYXRhJyk7XG5cbiAgICAgIHZhciB4ID0geF8gfCAwO1xuICAgICAgdmFyIHkgPSB5XyB8IDA7XG4gICAgICB2YXIgbGV2ZWwgPSBsZXZlbF8gfCAwO1xuXG4gICAgICB2YXIgaW1hZ2VEYXRhID0gYWxsb2NJbWFnZSgpO1xuICAgICAgY29weUZsYWdzKGltYWdlRGF0YSwgdGV4dHVyZSk7XG4gICAgICBpbWFnZURhdGEud2lkdGggPSAwO1xuICAgICAgaW1hZ2VEYXRhLmhlaWdodCA9IDA7XG4gICAgICBwYXJzZUltYWdlKGltYWdlRGF0YSwgaW1hZ2UpO1xuICAgICAgaW1hZ2VEYXRhLndpZHRoID0gaW1hZ2VEYXRhLndpZHRoIHx8ICgodGV4dHVyZS53aWR0aCA+PiBsZXZlbCkgLSB4KTtcbiAgICAgIGltYWdlRGF0YS5oZWlnaHQgPSBpbWFnZURhdGEuaGVpZ2h0IHx8ICgodGV4dHVyZS5oZWlnaHQgPj4gbGV2ZWwpIC0geSk7XG5cbiAgICAgIGNoZWNrJDEoXG4gICAgICAgIHRleHR1cmUudHlwZSA9PT0gaW1hZ2VEYXRhLnR5cGUgJiZcbiAgICAgICAgdGV4dHVyZS5mb3JtYXQgPT09IGltYWdlRGF0YS5mb3JtYXQgJiZcbiAgICAgICAgdGV4dHVyZS5pbnRlcm5hbGZvcm1hdCA9PT0gaW1hZ2VEYXRhLmludGVybmFsZm9ybWF0LFxuICAgICAgICAnaW5jb21wYXRpYmxlIGZvcm1hdCBmb3IgdGV4dHVyZS5zdWJpbWFnZScpO1xuICAgICAgY2hlY2skMShcbiAgICAgICAgeCA+PSAwICYmIHkgPj0gMCAmJlxuICAgICAgICB4ICsgaW1hZ2VEYXRhLndpZHRoIDw9IHRleHR1cmUud2lkdGggJiZcbiAgICAgICAgeSArIGltYWdlRGF0YS5oZWlnaHQgPD0gdGV4dHVyZS5oZWlnaHQsXG4gICAgICAgICd0ZXh0dXJlLnN1YmltYWdlIHdyaXRlIG91dCBvZiBib3VuZHMnKTtcbiAgICAgIGNoZWNrJDEoXG4gICAgICAgIHRleHR1cmUubWlwbWFzayAmICgxIDw8IGxldmVsKSxcbiAgICAgICAgJ21pc3NpbmcgbWlwbWFwIGRhdGEnKTtcbiAgICAgIGNoZWNrJDEoXG4gICAgICAgIGltYWdlRGF0YS5kYXRhIHx8IGltYWdlRGF0YS5lbGVtZW50IHx8IGltYWdlRGF0YS5uZWVkc0NvcHksXG4gICAgICAgICdtaXNzaW5nIGltYWdlIGRhdGEnKTtcblxuICAgICAgdGVtcEJpbmQodGV4dHVyZSk7XG4gICAgICBzZXRTdWJJbWFnZShpbWFnZURhdGEsIEdMX1RFWFRVUkVfMkQkMSwgeCwgeSwgbGV2ZWwpO1xuICAgICAgdGVtcFJlc3RvcmUoKTtcblxuICAgICAgZnJlZUltYWdlKGltYWdlRGF0YSk7XG5cbiAgICAgIHJldHVybiByZWdsVGV4dHVyZTJEXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzaXplICh3XywgaF8pIHtcbiAgICAgIHZhciB3ID0gd18gfCAwO1xuICAgICAgdmFyIGggPSAoaF8gfCAwKSB8fCB3O1xuICAgICAgaWYgKHcgPT09IHRleHR1cmUud2lkdGggJiYgaCA9PT0gdGV4dHVyZS5oZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2xUZXh0dXJlMkRcbiAgICAgIH1cblxuICAgICAgcmVnbFRleHR1cmUyRC53aWR0aCA9IHRleHR1cmUud2lkdGggPSB3O1xuICAgICAgcmVnbFRleHR1cmUyRC5oZWlnaHQgPSB0ZXh0dXJlLmhlaWdodCA9IGg7XG5cbiAgICAgIHRlbXBCaW5kKHRleHR1cmUpO1xuXG4gICAgICB2YXIgZGF0YTtcbiAgICAgIHZhciBjaGFubmVscyA9IHRleHR1cmUuY2hhbm5lbHM7XG4gICAgICB2YXIgdHlwZSA9IHRleHR1cmUudHlwZTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IHRleHR1cmUubWlwbWFzayA+PiBpOyArK2kpIHtcbiAgICAgICAgdmFyIF93ID0gdyA+PiBpO1xuICAgICAgICB2YXIgX2ggPSBoID4+IGk7XG4gICAgICAgIGlmICghX3cgfHwgIV9oKSBicmVha1xuICAgICAgICBkYXRhID0gcG9vbC56ZXJvLmFsbG9jVHlwZSh0eXBlLCBfdyAqIF9oICogY2hhbm5lbHMpO1xuICAgICAgICBnbC50ZXhJbWFnZTJEKFxuICAgICAgICAgIEdMX1RFWFRVUkVfMkQkMSxcbiAgICAgICAgICBpLFxuICAgICAgICAgIHRleHR1cmUuZm9ybWF0LFxuICAgICAgICAgIF93LFxuICAgICAgICAgIF9oLFxuICAgICAgICAgIDAsXG4gICAgICAgICAgdGV4dHVyZS5mb3JtYXQsXG4gICAgICAgICAgdGV4dHVyZS50eXBlLFxuICAgICAgICAgIGRhdGEpO1xuICAgICAgICBpZiAoZGF0YSkgcG9vbC56ZXJvLmZyZWVUeXBlKGRhdGEpO1xuICAgICAgfVxuICAgICAgdGVtcFJlc3RvcmUoKTtcblxuICAgICAgLy8gYWxzbywgcmVjb21wdXRlIHRoZSB0ZXh0dXJlIHNpemUuXG4gICAgICBpZiAoY29uZmlnLnByb2ZpbGUpIHtcbiAgICAgICAgdGV4dHVyZS5zdGF0cy5zaXplID0gZ2V0VGV4dHVyZVNpemUoXG4gICAgICAgICAgdGV4dHVyZS5pbnRlcm5hbGZvcm1hdCxcbiAgICAgICAgICB0ZXh0dXJlLnR5cGUsXG4gICAgICAgICAgdyxcbiAgICAgICAgICBoLFxuICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgIGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlZ2xUZXh0dXJlMkRcbiAgICB9XG5cbiAgICByZWdsVGV4dHVyZTJEKGEsIGIpO1xuXG4gICAgcmVnbFRleHR1cmUyRC5zdWJpbWFnZSA9IHN1YmltYWdlO1xuICAgIHJlZ2xUZXh0dXJlMkQucmVzaXplID0gcmVzaXplO1xuICAgIHJlZ2xUZXh0dXJlMkQuX3JlZ2xUeXBlID0gJ3RleHR1cmUyZCc7XG4gICAgcmVnbFRleHR1cmUyRC5fdGV4dHVyZSA9IHRleHR1cmU7XG4gICAgaWYgKGNvbmZpZy5wcm9maWxlKSB7XG4gICAgICByZWdsVGV4dHVyZTJELnN0YXRzID0gdGV4dHVyZS5zdGF0cztcbiAgICB9XG4gICAgcmVnbFRleHR1cmUyRC5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGV4dHVyZS5kZWNSZWYoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHJlZ2xUZXh0dXJlMkRcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVRleHR1cmVDdWJlIChhMCwgYTEsIGEyLCBhMywgYTQsIGE1KSB7XG4gICAgdmFyIHRleHR1cmUgPSBuZXcgUkVHTFRleHR1cmUoR0xfVEVYVFVSRV9DVUJFX01BUCQxKTtcbiAgICB0ZXh0dXJlU2V0W3RleHR1cmUuaWRdID0gdGV4dHVyZTtcbiAgICBzdGF0cy5jdWJlQ291bnQrKztcblxuICAgIHZhciBmYWNlcyA9IG5ldyBBcnJheSg2KTtcblxuICAgIGZ1bmN0aW9uIHJlZ2xUZXh0dXJlQ3ViZSAoYTAsIGExLCBhMiwgYTMsIGE0LCBhNSkge1xuICAgICAgdmFyIGk7XG4gICAgICB2YXIgdGV4SW5mbyA9IHRleHR1cmUudGV4SW5mbztcbiAgICAgIFRleEluZm8uY2FsbCh0ZXhJbmZvKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCA2OyArK2kpIHtcbiAgICAgICAgZmFjZXNbaV0gPSBhbGxvY01pcE1hcCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGEwID09PSAnbnVtYmVyJyB8fCAhYTApIHtcbiAgICAgICAgdmFyIHMgPSAoYTAgfCAwKSB8fCAxO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNjsgKytpKSB7XG4gICAgICAgICAgcGFyc2VNaXBNYXBGcm9tU2hhcGUoZmFjZXNbaV0sIHMsIHMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhMCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgaWYgKGExKSB7XG4gICAgICAgICAgcGFyc2VNaXBNYXBGcm9tT2JqZWN0KGZhY2VzWzBdLCBhMCk7XG4gICAgICAgICAgcGFyc2VNaXBNYXBGcm9tT2JqZWN0KGZhY2VzWzFdLCBhMSk7XG4gICAgICAgICAgcGFyc2VNaXBNYXBGcm9tT2JqZWN0KGZhY2VzWzJdLCBhMik7XG4gICAgICAgICAgcGFyc2VNaXBNYXBGcm9tT2JqZWN0KGZhY2VzWzNdLCBhMyk7XG4gICAgICAgICAgcGFyc2VNaXBNYXBGcm9tT2JqZWN0KGZhY2VzWzRdLCBhNCk7XG4gICAgICAgICAgcGFyc2VNaXBNYXBGcm9tT2JqZWN0KGZhY2VzWzVdLCBhNSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyc2VUZXhJbmZvKHRleEluZm8sIGEwKTtcbiAgICAgICAgICBwYXJzZUZsYWdzKHRleHR1cmUsIGEwKTtcbiAgICAgICAgICBpZiAoJ2ZhY2VzJyBpbiBhMCkge1xuICAgICAgICAgICAgdmFyIGZhY2VfaW5wdXQgPSBhMC5mYWNlcztcbiAgICAgICAgICAgIGNoZWNrJDEoQXJyYXkuaXNBcnJheShmYWNlX2lucHV0KSAmJiBmYWNlX2lucHV0Lmxlbmd0aCA9PT0gNixcbiAgICAgICAgICAgICAgJ2N1YmUgZmFjZXMgbXVzdCBiZSBhIGxlbmd0aCA2IGFycmF5Jyk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNjsgKytpKSB7XG4gICAgICAgICAgICAgIGNoZWNrJDEodHlwZW9mIGZhY2VfaW5wdXRbaV0gPT09ICdvYmplY3QnICYmICEhZmFjZV9pbnB1dFtpXSxcbiAgICAgICAgICAgICAgICAnaW52YWxpZCBpbnB1dCBmb3IgY3ViZSBtYXAgZmFjZScpO1xuICAgICAgICAgICAgICBjb3B5RmxhZ3MoZmFjZXNbaV0sIHRleHR1cmUpO1xuICAgICAgICAgICAgICBwYXJzZU1pcE1hcEZyb21PYmplY3QoZmFjZXNbaV0sIGZhY2VfaW5wdXRbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNjsgKytpKSB7XG4gICAgICAgICAgICAgIHBhcnNlTWlwTWFwRnJvbU9iamVjdChmYWNlc1tpXSwgYTApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hlY2skMS5yYWlzZSgnaW52YWxpZCBhcmd1bWVudHMgdG8gY3ViZSBtYXAnKTtcbiAgICAgIH1cblxuICAgICAgY29weUZsYWdzKHRleHR1cmUsIGZhY2VzWzBdKTtcblxuICAgICAgaWYgKCFsaW1pdHMubnBvdFRleHR1cmVDdWJlKSB7XG4gICAgICAgIGNoZWNrJDEoaXNQb3cyJDEodGV4dHVyZS53aWR0aCkgJiYgaXNQb3cyJDEodGV4dHVyZS5oZWlnaHQpLCAneW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgbm9uIHBvd2VyIG9yIHR3byB0ZXh0dXJlIGRpbWVuc2lvbnMnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRleEluZm8uZ2VuTWlwbWFwcykge1xuICAgICAgICB0ZXh0dXJlLm1pcG1hc2sgPSAoZmFjZXNbMF0ud2lkdGggPDwgMSkgLSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dHVyZS5taXBtYXNrID0gZmFjZXNbMF0ubWlwbWFzaztcbiAgICAgIH1cblxuICAgICAgY2hlY2skMS50ZXh0dXJlQ3ViZSh0ZXh0dXJlLCB0ZXhJbmZvLCBmYWNlcywgbGltaXRzKTtcbiAgICAgIHRleHR1cmUuaW50ZXJuYWxmb3JtYXQgPSBmYWNlc1swXS5pbnRlcm5hbGZvcm1hdDtcblxuICAgICAgcmVnbFRleHR1cmVDdWJlLndpZHRoID0gZmFjZXNbMF0ud2lkdGg7XG4gICAgICByZWdsVGV4dHVyZUN1YmUuaGVpZ2h0ID0gZmFjZXNbMF0uaGVpZ2h0O1xuXG4gICAgICB0ZW1wQmluZCh0ZXh0dXJlKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCA2OyArK2kpIHtcbiAgICAgICAgc2V0TWlwTWFwKGZhY2VzW2ldLCBHTF9URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1gkMSArIGkpO1xuICAgICAgfVxuICAgICAgc2V0VGV4SW5mbyh0ZXhJbmZvLCBHTF9URVhUVVJFX0NVQkVfTUFQJDEpO1xuICAgICAgdGVtcFJlc3RvcmUoKTtcblxuICAgICAgaWYgKGNvbmZpZy5wcm9maWxlKSB7XG4gICAgICAgIHRleHR1cmUuc3RhdHMuc2l6ZSA9IGdldFRleHR1cmVTaXplKFxuICAgICAgICAgIHRleHR1cmUuaW50ZXJuYWxmb3JtYXQsXG4gICAgICAgICAgdGV4dHVyZS50eXBlLFxuICAgICAgICAgIHJlZ2xUZXh0dXJlQ3ViZS53aWR0aCxcbiAgICAgICAgICByZWdsVGV4dHVyZUN1YmUuaGVpZ2h0LFxuICAgICAgICAgIHRleEluZm8uZ2VuTWlwbWFwcyxcbiAgICAgICAgICB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgcmVnbFRleHR1cmVDdWJlLmZvcm1hdCA9IHRleHR1cmVGb3JtYXRzSW52ZXJ0W3RleHR1cmUuaW50ZXJuYWxmb3JtYXRdO1xuICAgICAgcmVnbFRleHR1cmVDdWJlLnR5cGUgPSB0ZXh0dXJlVHlwZXNJbnZlcnRbdGV4dHVyZS50eXBlXTtcblxuICAgICAgcmVnbFRleHR1cmVDdWJlLm1hZyA9IG1hZ0ZpbHRlcnNJbnZlcnRbdGV4SW5mby5tYWdGaWx0ZXJdO1xuICAgICAgcmVnbFRleHR1cmVDdWJlLm1pbiA9IG1pbkZpbHRlcnNJbnZlcnRbdGV4SW5mby5taW5GaWx0ZXJdO1xuXG4gICAgICByZWdsVGV4dHVyZUN1YmUud3JhcFMgPSB3cmFwTW9kZXNJbnZlcnRbdGV4SW5mby53cmFwU107XG4gICAgICByZWdsVGV4dHVyZUN1YmUud3JhcFQgPSB3cmFwTW9kZXNJbnZlcnRbdGV4SW5mby53cmFwVF07XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCA2OyArK2kpIHtcbiAgICAgICAgZnJlZU1pcE1hcChmYWNlc1tpXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZWdsVGV4dHVyZUN1YmVcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdWJpbWFnZSAoZmFjZSwgaW1hZ2UsIHhfLCB5XywgbGV2ZWxfKSB7XG4gICAgICBjaGVjayQxKCEhaW1hZ2UsICdtdXN0IHNwZWNpZnkgaW1hZ2UgZGF0YScpO1xuICAgICAgY2hlY2skMSh0eXBlb2YgZmFjZSA9PT0gJ251bWJlcicgJiYgZmFjZSA9PT0gKGZhY2UgfCAwKSAmJlxuICAgICAgICBmYWNlID49IDAgJiYgZmFjZSA8IDYsICdpbnZhbGlkIGZhY2UnKTtcblxuICAgICAgdmFyIHggPSB4XyB8IDA7XG4gICAgICB2YXIgeSA9IHlfIHwgMDtcbiAgICAgIHZhciBsZXZlbCA9IGxldmVsXyB8IDA7XG5cbiAgICAgIHZhciBpbWFnZURhdGEgPSBhbGxvY0ltYWdlKCk7XG4gICAgICBjb3B5RmxhZ3MoaW1hZ2VEYXRhLCB0ZXh0dXJlKTtcbiAgICAgIGltYWdlRGF0YS53aWR0aCA9IDA7XG4gICAgICBpbWFnZURhdGEuaGVpZ2h0ID0gMDtcbiAgICAgIHBhcnNlSW1hZ2UoaW1hZ2VEYXRhLCBpbWFnZSk7XG4gICAgICBpbWFnZURhdGEud2lkdGggPSBpbWFnZURhdGEud2lkdGggfHwgKCh0ZXh0dXJlLndpZHRoID4+IGxldmVsKSAtIHgpO1xuICAgICAgaW1hZ2VEYXRhLmhlaWdodCA9IGltYWdlRGF0YS5oZWlnaHQgfHwgKCh0ZXh0dXJlLmhlaWdodCA+PiBsZXZlbCkgLSB5KTtcblxuICAgICAgY2hlY2skMShcbiAgICAgICAgdGV4dHVyZS50eXBlID09PSBpbWFnZURhdGEudHlwZSAmJlxuICAgICAgICB0ZXh0dXJlLmZvcm1hdCA9PT0gaW1hZ2VEYXRhLmZvcm1hdCAmJlxuICAgICAgICB0ZXh0dXJlLmludGVybmFsZm9ybWF0ID09PSBpbWFnZURhdGEuaW50ZXJuYWxmb3JtYXQsXG4gICAgICAgICdpbmNvbXBhdGlibGUgZm9ybWF0IGZvciB0ZXh0dXJlLnN1YmltYWdlJyk7XG4gICAgICBjaGVjayQxKFxuICAgICAgICB4ID49IDAgJiYgeSA+PSAwICYmXG4gICAgICAgIHggKyBpbWFnZURhdGEud2lkdGggPD0gdGV4dHVyZS53aWR0aCAmJlxuICAgICAgICB5ICsgaW1hZ2VEYXRhLmhlaWdodCA8PSB0ZXh0dXJlLmhlaWdodCxcbiAgICAgICAgJ3RleHR1cmUuc3ViaW1hZ2Ugd3JpdGUgb3V0IG9mIGJvdW5kcycpO1xuICAgICAgY2hlY2skMShcbiAgICAgICAgdGV4dHVyZS5taXBtYXNrICYgKDEgPDwgbGV2ZWwpLFxuICAgICAgICAnbWlzc2luZyBtaXBtYXAgZGF0YScpO1xuICAgICAgY2hlY2skMShcbiAgICAgICAgaW1hZ2VEYXRhLmRhdGEgfHwgaW1hZ2VEYXRhLmVsZW1lbnQgfHwgaW1hZ2VEYXRhLm5lZWRzQ29weSxcbiAgICAgICAgJ21pc3NpbmcgaW1hZ2UgZGF0YScpO1xuXG4gICAgICB0ZW1wQmluZCh0ZXh0dXJlKTtcbiAgICAgIHNldFN1YkltYWdlKGltYWdlRGF0YSwgR0xfVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YJDEgKyBmYWNlLCB4LCB5LCBsZXZlbCk7XG4gICAgICB0ZW1wUmVzdG9yZSgpO1xuXG4gICAgICBmcmVlSW1hZ2UoaW1hZ2VEYXRhKTtcblxuICAgICAgcmV0dXJuIHJlZ2xUZXh0dXJlQ3ViZVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc2l6ZSAocmFkaXVzXykge1xuICAgICAgdmFyIHJhZGl1cyA9IHJhZGl1c18gfCAwO1xuICAgICAgaWYgKHJhZGl1cyA9PT0gdGV4dHVyZS53aWR0aCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgcmVnbFRleHR1cmVDdWJlLndpZHRoID0gdGV4dHVyZS53aWR0aCA9IHJhZGl1cztcbiAgICAgIHJlZ2xUZXh0dXJlQ3ViZS5oZWlnaHQgPSB0ZXh0dXJlLmhlaWdodCA9IHJhZGl1cztcblxuICAgICAgdGVtcEJpbmQodGV4dHVyZSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY7ICsraSkge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgdGV4dHVyZS5taXBtYXNrID4+IGo7ICsraikge1xuICAgICAgICAgIGdsLnRleEltYWdlMkQoXG4gICAgICAgICAgICBHTF9URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1gkMSArIGksXG4gICAgICAgICAgICBqLFxuICAgICAgICAgICAgdGV4dHVyZS5mb3JtYXQsXG4gICAgICAgICAgICByYWRpdXMgPj4gaixcbiAgICAgICAgICAgIHJhZGl1cyA+PiBqLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIHRleHR1cmUuZm9ybWF0LFxuICAgICAgICAgICAgdGV4dHVyZS50eXBlLFxuICAgICAgICAgICAgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRlbXBSZXN0b3JlKCk7XG5cbiAgICAgIGlmIChjb25maWcucHJvZmlsZSkge1xuICAgICAgICB0ZXh0dXJlLnN0YXRzLnNpemUgPSBnZXRUZXh0dXJlU2l6ZShcbiAgICAgICAgICB0ZXh0dXJlLmludGVybmFsZm9ybWF0LFxuICAgICAgICAgIHRleHR1cmUudHlwZSxcbiAgICAgICAgICByZWdsVGV4dHVyZUN1YmUud2lkdGgsXG4gICAgICAgICAgcmVnbFRleHR1cmVDdWJlLmhlaWdodCxcbiAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlZ2xUZXh0dXJlQ3ViZVxuICAgIH1cblxuICAgIHJlZ2xUZXh0dXJlQ3ViZShhMCwgYTEsIGEyLCBhMywgYTQsIGE1KTtcblxuICAgIHJlZ2xUZXh0dXJlQ3ViZS5zdWJpbWFnZSA9IHN1YmltYWdlO1xuICAgIHJlZ2xUZXh0dXJlQ3ViZS5yZXNpemUgPSByZXNpemU7XG4gICAgcmVnbFRleHR1cmVDdWJlLl9yZWdsVHlwZSA9ICd0ZXh0dXJlQ3ViZSc7XG4gICAgcmVnbFRleHR1cmVDdWJlLl90ZXh0dXJlID0gdGV4dHVyZTtcbiAgICBpZiAoY29uZmlnLnByb2ZpbGUpIHtcbiAgICAgIHJlZ2xUZXh0dXJlQ3ViZS5zdGF0cyA9IHRleHR1cmUuc3RhdHM7XG4gICAgfVxuICAgIHJlZ2xUZXh0dXJlQ3ViZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGV4dHVyZS5kZWNSZWYoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHJlZ2xUZXh0dXJlQ3ViZVxuICB9XG5cbiAgLy8gQ2FsbGVkIHdoZW4gcmVnbCBpcyBkZXN0cm95ZWRcbiAgZnVuY3Rpb24gZGVzdHJveVRleHR1cmVzICgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bVRleFVuaXRzOyArK2kpIHtcbiAgICAgIGdsLmFjdGl2ZVRleHR1cmUoR0xfVEVYVFVSRTAkMSArIGkpO1xuICAgICAgZ2wuYmluZFRleHR1cmUoR0xfVEVYVFVSRV8yRCQxLCBudWxsKTtcbiAgICAgIHRleHR1cmVVbml0c1tpXSA9IG51bGw7XG4gICAgfVxuICAgIHZhbHVlcyh0ZXh0dXJlU2V0KS5mb3JFYWNoKGRlc3Ryb3kpO1xuXG4gICAgc3RhdHMuY3ViZUNvdW50ID0gMDtcbiAgICBzdGF0cy50ZXh0dXJlQ291bnQgPSAwO1xuICB9XG5cbiAgaWYgKGNvbmZpZy5wcm9maWxlKSB7XG4gICAgc3RhdHMuZ2V0VG90YWxUZXh0dXJlU2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0b3RhbCA9IDA7XG4gICAgICBPYmplY3Qua2V5cyh0ZXh0dXJlU2V0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdG90YWwgKz0gdGV4dHVyZVNldFtrZXldLnN0YXRzLnNpemU7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0b3RhbFxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiByZXN0b3JlVGV4dHVyZXMgKCkge1xuICAgIHZhbHVlcyh0ZXh0dXJlU2V0KS5mb3JFYWNoKGZ1bmN0aW9uICh0ZXh0dXJlKSB7XG4gICAgICB0ZXh0dXJlLnRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG4gICAgICBnbC5iaW5kVGV4dHVyZSh0ZXh0dXJlLnRhcmdldCwgdGV4dHVyZS50ZXh0dXJlKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzI7ICsraSkge1xuICAgICAgICBpZiAoKHRleHR1cmUubWlwbWFzayAmICgxIDw8IGkpKSA9PT0gMCkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRleHR1cmUudGFyZ2V0ID09PSBHTF9URVhUVVJFXzJEJDEpIHtcbiAgICAgICAgICBnbC50ZXhJbWFnZTJEKEdMX1RFWFRVUkVfMkQkMSxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICB0ZXh0dXJlLmludGVybmFsZm9ybWF0LFxuICAgICAgICAgICAgdGV4dHVyZS53aWR0aCA+PiBpLFxuICAgICAgICAgICAgdGV4dHVyZS5oZWlnaHQgPj4gaSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICB0ZXh0dXJlLmludGVybmFsZm9ybWF0LFxuICAgICAgICAgICAgdGV4dHVyZS50eXBlLFxuICAgICAgICAgICAgbnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCA2OyArK2opIHtcbiAgICAgICAgICAgIGdsLnRleEltYWdlMkQoR0xfVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YJDEgKyBqLFxuICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICB0ZXh0dXJlLmludGVybmFsZm9ybWF0LFxuICAgICAgICAgICAgICB0ZXh0dXJlLndpZHRoID4+IGksXG4gICAgICAgICAgICAgIHRleHR1cmUuaGVpZ2h0ID4+IGksXG4gICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgIHRleHR1cmUuaW50ZXJuYWxmb3JtYXQsXG4gICAgICAgICAgICAgIHRleHR1cmUudHlwZSxcbiAgICAgICAgICAgICAgbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZXRUZXhJbmZvKHRleHR1cmUudGV4SW5mbywgdGV4dHVyZS50YXJnZXQpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjcmVhdGUyRDogY3JlYXRlVGV4dHVyZTJELFxuICAgIGNyZWF0ZUN1YmU6IGNyZWF0ZVRleHR1cmVDdWJlLFxuICAgIGNsZWFyOiBkZXN0cm95VGV4dHVyZXMsXG4gICAgZ2V0VGV4dHVyZTogZnVuY3Rpb24gKHdyYXBwZXIpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfSxcbiAgICByZXN0b3JlOiByZXN0b3JlVGV4dHVyZXNcbiAgfVxufVxuXG52YXIgR0xfUkVOREVSQlVGRkVSID0gMHg4RDQxO1xuXG52YXIgR0xfUkdCQTQkMSA9IDB4ODA1NjtcbnZhciBHTF9SR0I1X0ExJDEgPSAweDgwNTc7XG52YXIgR0xfUkdCNTY1JDEgPSAweDhENjI7XG52YXIgR0xfREVQVEhfQ09NUE9ORU5UMTYgPSAweDgxQTU7XG52YXIgR0xfU1RFTkNJTF9JTkRFWDggPSAweDhENDg7XG52YXIgR0xfREVQVEhfU1RFTkNJTCQxID0gMHg4NEY5O1xuXG52YXIgR0xfU1JHQjhfQUxQSEE4X0VYVCA9IDB4OEM0MztcblxudmFyIEdMX1JHQkEzMkZfRVhUID0gMHg4ODE0O1xuXG52YXIgR0xfUkdCQTE2Rl9FWFQgPSAweDg4MUE7XG52YXIgR0xfUkdCMTZGX0VYVCA9IDB4ODgxQjtcblxudmFyIEZPUk1BVF9TSVpFUyA9IFtdO1xuXG5GT1JNQVRfU0laRVNbR0xfUkdCQTQkMV0gPSAyO1xuRk9STUFUX1NJWkVTW0dMX1JHQjVfQTEkMV0gPSAyO1xuRk9STUFUX1NJWkVTW0dMX1JHQjU2NSQxXSA9IDI7XG5cbkZPUk1BVF9TSVpFU1tHTF9ERVBUSF9DT01QT05FTlQxNl0gPSAyO1xuRk9STUFUX1NJWkVTW0dMX1NURU5DSUxfSU5ERVg4XSA9IDE7XG5GT1JNQVRfU0laRVNbR0xfREVQVEhfU1RFTkNJTCQxXSA9IDQ7XG5cbkZPUk1BVF9TSVpFU1tHTF9TUkdCOF9BTFBIQThfRVhUXSA9IDQ7XG5GT1JNQVRfU0laRVNbR0xfUkdCQTMyRl9FWFRdID0gMTY7XG5GT1JNQVRfU0laRVNbR0xfUkdCQTE2Rl9FWFRdID0gODtcbkZPUk1BVF9TSVpFU1tHTF9SR0IxNkZfRVhUXSA9IDY7XG5cbmZ1bmN0aW9uIGdldFJlbmRlcmJ1ZmZlclNpemUgKGZvcm1hdCwgd2lkdGgsIGhlaWdodCkge1xuICByZXR1cm4gRk9STUFUX1NJWkVTW2Zvcm1hdF0gKiB3aWR0aCAqIGhlaWdodFxufVxuXG52YXIgd3JhcFJlbmRlcmJ1ZmZlcnMgPSBmdW5jdGlvbiAoZ2wsIGV4dGVuc2lvbnMsIGxpbWl0cywgc3RhdHMsIGNvbmZpZykge1xuICB2YXIgZm9ybWF0VHlwZXMgPSB7XG4gICAgJ3JnYmE0JzogR0xfUkdCQTQkMSxcbiAgICAncmdiNTY1JzogR0xfUkdCNTY1JDEsXG4gICAgJ3JnYjUgYTEnOiBHTF9SR0I1X0ExJDEsXG4gICAgJ2RlcHRoJzogR0xfREVQVEhfQ09NUE9ORU5UMTYsXG4gICAgJ3N0ZW5jaWwnOiBHTF9TVEVOQ0lMX0lOREVYOCxcbiAgICAnZGVwdGggc3RlbmNpbCc6IEdMX0RFUFRIX1NURU5DSUwkMVxuICB9O1xuXG4gIGlmIChleHRlbnNpb25zLmV4dF9zcmdiKSB7XG4gICAgZm9ybWF0VHlwZXNbJ3NyZ2JhJ10gPSBHTF9TUkdCOF9BTFBIQThfRVhUO1xuICB9XG5cbiAgaWYgKGV4dGVuc2lvbnMuZXh0X2NvbG9yX2J1ZmZlcl9oYWxmX2Zsb2F0KSB7XG4gICAgZm9ybWF0VHlwZXNbJ3JnYmExNmYnXSA9IEdMX1JHQkExNkZfRVhUO1xuICAgIGZvcm1hdFR5cGVzWydyZ2IxNmYnXSA9IEdMX1JHQjE2Rl9FWFQ7XG4gIH1cblxuICBpZiAoZXh0ZW5zaW9ucy53ZWJnbF9jb2xvcl9idWZmZXJfZmxvYXQpIHtcbiAgICBmb3JtYXRUeXBlc1sncmdiYTMyZiddID0gR0xfUkdCQTMyRl9FWFQ7XG4gIH1cblxuICB2YXIgZm9ybWF0VHlwZXNJbnZlcnQgPSBbXTtcbiAgT2JqZWN0LmtleXMoZm9ybWF0VHlwZXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciB2YWwgPSBmb3JtYXRUeXBlc1trZXldO1xuICAgIGZvcm1hdFR5cGVzSW52ZXJ0W3ZhbF0gPSBrZXk7XG4gIH0pO1xuXG4gIHZhciByZW5kZXJidWZmZXJDb3VudCA9IDA7XG4gIHZhciByZW5kZXJidWZmZXJTZXQgPSB7fTtcblxuICBmdW5jdGlvbiBSRUdMUmVuZGVyYnVmZmVyIChyZW5kZXJidWZmZXIpIHtcbiAgICB0aGlzLmlkID0gcmVuZGVyYnVmZmVyQ291bnQrKztcbiAgICB0aGlzLnJlZkNvdW50ID0gMTtcblxuICAgIHRoaXMucmVuZGVyYnVmZmVyID0gcmVuZGVyYnVmZmVyO1xuXG4gICAgdGhpcy5mb3JtYXQgPSBHTF9SR0JBNCQxO1xuICAgIHRoaXMud2lkdGggPSAwO1xuICAgIHRoaXMuaGVpZ2h0ID0gMDtcblxuICAgIGlmIChjb25maWcucHJvZmlsZSkge1xuICAgICAgdGhpcy5zdGF0cyA9IHtzaXplOiAwfTtcbiAgICB9XG4gIH1cblxuICBSRUdMUmVuZGVyYnVmZmVyLnByb3RvdHlwZS5kZWNSZWYgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKC0tdGhpcy5yZWZDb3VudCA8PSAwKSB7XG4gICAgICBkZXN0cm95KHRoaXMpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBkZXN0cm95IChyYikge1xuICAgIHZhciBoYW5kbGUgPSByYi5yZW5kZXJidWZmZXI7XG4gICAgY2hlY2skMShoYW5kbGUsICdtdXN0IG5vdCBkb3VibGUgZGVzdHJveSByZW5kZXJidWZmZXInKTtcbiAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKEdMX1JFTkRFUkJVRkZFUiwgbnVsbCk7XG4gICAgZ2wuZGVsZXRlUmVuZGVyYnVmZmVyKGhhbmRsZSk7XG4gICAgcmIucmVuZGVyYnVmZmVyID0gbnVsbDtcbiAgICByYi5yZWZDb3VudCA9IDA7XG4gICAgZGVsZXRlIHJlbmRlcmJ1ZmZlclNldFtyYi5pZF07XG4gICAgc3RhdHMucmVuZGVyYnVmZmVyQ291bnQtLTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJlbmRlcmJ1ZmZlciAoYSwgYikge1xuICAgIHZhciByZW5kZXJidWZmZXIgPSBuZXcgUkVHTFJlbmRlcmJ1ZmZlcihnbC5jcmVhdGVSZW5kZXJidWZmZXIoKSk7XG4gICAgcmVuZGVyYnVmZmVyU2V0W3JlbmRlcmJ1ZmZlci5pZF0gPSByZW5kZXJidWZmZXI7XG4gICAgc3RhdHMucmVuZGVyYnVmZmVyQ291bnQrKztcblxuICAgIGZ1bmN0aW9uIHJlZ2xSZW5kZXJidWZmZXIgKGEsIGIpIHtcbiAgICAgIHZhciB3ID0gMDtcbiAgICAgIHZhciBoID0gMDtcbiAgICAgIHZhciBmb3JtYXQgPSBHTF9SR0JBNCQxO1xuXG4gICAgICBpZiAodHlwZW9mIGEgPT09ICdvYmplY3QnICYmIGEpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBhO1xuICAgICAgICBpZiAoJ3NoYXBlJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgdmFyIHNoYXBlID0gb3B0aW9ucy5zaGFwZTtcbiAgICAgICAgICBjaGVjayQxKEFycmF5LmlzQXJyYXkoc2hhcGUpICYmIHNoYXBlLmxlbmd0aCA+PSAyLFxuICAgICAgICAgICAgJ2ludmFsaWQgcmVuZGVyYnVmZmVyIHNoYXBlJyk7XG4gICAgICAgICAgdyA9IHNoYXBlWzBdIHwgMDtcbiAgICAgICAgICBoID0gc2hhcGVbMV0gfCAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICgncmFkaXVzJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICB3ID0gaCA9IG9wdGlvbnMucmFkaXVzIHwgMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCd3aWR0aCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgdyA9IG9wdGlvbnMud2lkdGggfCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoJ2hlaWdodCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgaCA9IG9wdGlvbnMuaGVpZ2h0IHwgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdmb3JtYXQnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICBjaGVjayQxLnBhcmFtZXRlcihvcHRpb25zLmZvcm1hdCwgZm9ybWF0VHlwZXMsXG4gICAgICAgICAgICAnaW52YWxpZCByZW5kZXJidWZmZXIgZm9ybWF0Jyk7XG4gICAgICAgICAgZm9ybWF0ID0gZm9ybWF0VHlwZXNbb3B0aW9ucy5mb3JtYXRdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhID09PSAnbnVtYmVyJykge1xuICAgICAgICB3ID0gYSB8IDA7XG4gICAgICAgIGlmICh0eXBlb2YgYiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBoID0gYiB8IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaCA9IHc7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIWEpIHtcbiAgICAgICAgdyA9IGggPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hlY2skMS5yYWlzZSgnaW52YWxpZCBhcmd1bWVudHMgdG8gcmVuZGVyYnVmZmVyIGNvbnN0cnVjdG9yJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIGNoZWNrIHNoYXBlXG4gICAgICBjaGVjayQxKFxuICAgICAgICB3ID4gMCAmJiBoID4gMCAmJlxuICAgICAgICB3IDw9IGxpbWl0cy5tYXhSZW5kZXJidWZmZXJTaXplICYmIGggPD0gbGltaXRzLm1heFJlbmRlcmJ1ZmZlclNpemUsXG4gICAgICAgICdpbnZhbGlkIHJlbmRlcmJ1ZmZlciBzaXplJyk7XG5cbiAgICAgIGlmICh3ID09PSByZW5kZXJidWZmZXIud2lkdGggJiZcbiAgICAgICAgICBoID09PSByZW5kZXJidWZmZXIuaGVpZ2h0ICYmXG4gICAgICAgICAgZm9ybWF0ID09PSByZW5kZXJidWZmZXIuZm9ybWF0KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICByZWdsUmVuZGVyYnVmZmVyLndpZHRoID0gcmVuZGVyYnVmZmVyLndpZHRoID0gdztcbiAgICAgIHJlZ2xSZW5kZXJidWZmZXIuaGVpZ2h0ID0gcmVuZGVyYnVmZmVyLmhlaWdodCA9IGg7XG4gICAgICByZW5kZXJidWZmZXIuZm9ybWF0ID0gZm9ybWF0O1xuXG4gICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKEdMX1JFTkRFUkJVRkZFUiwgcmVuZGVyYnVmZmVyLnJlbmRlcmJ1ZmZlcik7XG4gICAgICBnbC5yZW5kZXJidWZmZXJTdG9yYWdlKEdMX1JFTkRFUkJVRkZFUiwgZm9ybWF0LCB3LCBoKTtcblxuICAgICAgY2hlY2skMShcbiAgICAgICAgZ2wuZ2V0RXJyb3IoKSA9PT0gMCxcbiAgICAgICAgJ2ludmFsaWQgcmVuZGVyIGJ1ZmZlciBmb3JtYXQnKTtcblxuICAgICAgaWYgKGNvbmZpZy5wcm9maWxlKSB7XG4gICAgICAgIHJlbmRlcmJ1ZmZlci5zdGF0cy5zaXplID0gZ2V0UmVuZGVyYnVmZmVyU2l6ZShyZW5kZXJidWZmZXIuZm9ybWF0LCByZW5kZXJidWZmZXIud2lkdGgsIHJlbmRlcmJ1ZmZlci5oZWlnaHQpO1xuICAgICAgfVxuICAgICAgcmVnbFJlbmRlcmJ1ZmZlci5mb3JtYXQgPSBmb3JtYXRUeXBlc0ludmVydFtyZW5kZXJidWZmZXIuZm9ybWF0XTtcblxuICAgICAgcmV0dXJuIHJlZ2xSZW5kZXJidWZmZXJcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNpemUgKHdfLCBoXykge1xuICAgICAgdmFyIHcgPSB3XyB8IDA7XG4gICAgICB2YXIgaCA9IChoXyB8IDApIHx8IHc7XG5cbiAgICAgIGlmICh3ID09PSByZW5kZXJidWZmZXIud2lkdGggJiYgaCA9PT0gcmVuZGVyYnVmZmVyLmhlaWdodCkge1xuICAgICAgICByZXR1cm4gcmVnbFJlbmRlcmJ1ZmZlclxuICAgICAgfVxuXG4gICAgICAvLyBjaGVjayBzaGFwZVxuICAgICAgY2hlY2skMShcbiAgICAgICAgdyA+IDAgJiYgaCA+IDAgJiZcbiAgICAgICAgdyA8PSBsaW1pdHMubWF4UmVuZGVyYnVmZmVyU2l6ZSAmJiBoIDw9IGxpbWl0cy5tYXhSZW5kZXJidWZmZXJTaXplLFxuICAgICAgICAnaW52YWxpZCByZW5kZXJidWZmZXIgc2l6ZScpO1xuXG4gICAgICByZWdsUmVuZGVyYnVmZmVyLndpZHRoID0gcmVuZGVyYnVmZmVyLndpZHRoID0gdztcbiAgICAgIHJlZ2xSZW5kZXJidWZmZXIuaGVpZ2h0ID0gcmVuZGVyYnVmZmVyLmhlaWdodCA9IGg7XG5cbiAgICAgIGdsLmJpbmRSZW5kZXJidWZmZXIoR0xfUkVOREVSQlVGRkVSLCByZW5kZXJidWZmZXIucmVuZGVyYnVmZmVyKTtcbiAgICAgIGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoR0xfUkVOREVSQlVGRkVSLCByZW5kZXJidWZmZXIuZm9ybWF0LCB3LCBoKTtcblxuICAgICAgY2hlY2skMShcbiAgICAgICAgZ2wuZ2V0RXJyb3IoKSA9PT0gMCxcbiAgICAgICAgJ2ludmFsaWQgcmVuZGVyIGJ1ZmZlciBmb3JtYXQnKTtcblxuICAgICAgLy8gYWxzbywgcmVjb21wdXRlIHNpemUuXG4gICAgICBpZiAoY29uZmlnLnByb2ZpbGUpIHtcbiAgICAgICAgcmVuZGVyYnVmZmVyLnN0YXRzLnNpemUgPSBnZXRSZW5kZXJidWZmZXJTaXplKFxuICAgICAgICAgIHJlbmRlcmJ1ZmZlci5mb3JtYXQsIHJlbmRlcmJ1ZmZlci53aWR0aCwgcmVuZGVyYnVmZmVyLmhlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZWdsUmVuZGVyYnVmZmVyXG4gICAgfVxuXG4gICAgcmVnbFJlbmRlcmJ1ZmZlcihhLCBiKTtcblxuICAgIHJlZ2xSZW5kZXJidWZmZXIucmVzaXplID0gcmVzaXplO1xuICAgIHJlZ2xSZW5kZXJidWZmZXIuX3JlZ2xUeXBlID0gJ3JlbmRlcmJ1ZmZlcic7XG4gICAgcmVnbFJlbmRlcmJ1ZmZlci5fcmVuZGVyYnVmZmVyID0gcmVuZGVyYnVmZmVyO1xuICAgIGlmIChjb25maWcucHJvZmlsZSkge1xuICAgICAgcmVnbFJlbmRlcmJ1ZmZlci5zdGF0cyA9IHJlbmRlcmJ1ZmZlci5zdGF0cztcbiAgICB9XG4gICAgcmVnbFJlbmRlcmJ1ZmZlci5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmVuZGVyYnVmZmVyLmRlY1JlZigpO1xuICAgIH07XG5cbiAgICByZXR1cm4gcmVnbFJlbmRlcmJ1ZmZlclxuICB9XG5cbiAgaWYgKGNvbmZpZy5wcm9maWxlKSB7XG4gICAgc3RhdHMuZ2V0VG90YWxSZW5kZXJidWZmZXJTaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRvdGFsID0gMDtcbiAgICAgIE9iamVjdC5rZXlzKHJlbmRlcmJ1ZmZlclNldCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHRvdGFsICs9IHJlbmRlcmJ1ZmZlclNldFtrZXldLnN0YXRzLnNpemU7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0b3RhbFxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiByZXN0b3JlUmVuZGVyYnVmZmVycyAoKSB7XG4gICAgdmFsdWVzKHJlbmRlcmJ1ZmZlclNldCkuZm9yRWFjaChmdW5jdGlvbiAocmIpIHtcbiAgICAgIHJiLnJlbmRlcmJ1ZmZlciA9IGdsLmNyZWF0ZVJlbmRlcmJ1ZmZlcigpO1xuICAgICAgZ2wuYmluZFJlbmRlcmJ1ZmZlcihHTF9SRU5ERVJCVUZGRVIsIHJiLnJlbmRlcmJ1ZmZlcik7XG4gICAgICBnbC5yZW5kZXJidWZmZXJTdG9yYWdlKEdMX1JFTkRFUkJVRkZFUiwgcmIuZm9ybWF0LCByYi53aWR0aCwgcmIuaGVpZ2h0KTtcbiAgICB9KTtcbiAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKEdMX1JFTkRFUkJVRkZFUiwgbnVsbCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZTogY3JlYXRlUmVuZGVyYnVmZmVyLFxuICAgIGNsZWFyOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YWx1ZXMocmVuZGVyYnVmZmVyU2V0KS5mb3JFYWNoKGRlc3Ryb3kpO1xuICAgIH0sXG4gICAgcmVzdG9yZTogcmVzdG9yZVJlbmRlcmJ1ZmZlcnNcbiAgfVxufTtcblxuLy8gV2Ugc3RvcmUgdGhlc2UgY29uc3RhbnRzIHNvIHRoYXQgdGhlIG1pbmlmaWVyIGNhbiBpbmxpbmUgdGhlbVxudmFyIEdMX0ZSQU1FQlVGRkVSJDEgPSAweDhENDA7XG52YXIgR0xfUkVOREVSQlVGRkVSJDEgPSAweDhENDE7XG5cbnZhciBHTF9URVhUVVJFXzJEJDIgPSAweDBERTE7XG52YXIgR0xfVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YJDIgPSAweDg1MTU7XG5cbnZhciBHTF9DT0xPUl9BVFRBQ0hNRU5UMCQxID0gMHg4Q0UwO1xudmFyIEdMX0RFUFRIX0FUVEFDSE1FTlQgPSAweDhEMDA7XG52YXIgR0xfU1RFTkNJTF9BVFRBQ0hNRU5UID0gMHg4RDIwO1xudmFyIEdMX0RFUFRIX1NURU5DSUxfQVRUQUNITUVOVCA9IDB4ODIxQTtcblxudmFyIEdMX0ZSQU1FQlVGRkVSX0NPTVBMRVRFJDEgPSAweDhDRDU7XG52YXIgR0xfRlJBTUVCVUZGRVJfSU5DT01QTEVURV9BVFRBQ0hNRU5UID0gMHg4Q0Q2O1xudmFyIEdMX0ZSQU1FQlVGRkVSX0lOQ09NUExFVEVfTUlTU0lOR19BVFRBQ0hNRU5UID0gMHg4Q0Q3O1xudmFyIEdMX0ZSQU1FQlVGRkVSX0lOQ09NUExFVEVfRElNRU5TSU9OUyA9IDB4OENEOTtcbnZhciBHTF9GUkFNRUJVRkZFUl9VTlNVUFBPUlRFRCA9IDB4OENERDtcblxudmFyIEdMX0hBTEZfRkxPQVRfT0VTJDIgPSAweDhENjE7XG52YXIgR0xfVU5TSUdORURfQllURSQ2ID0gMHgxNDAxO1xudmFyIEdMX0ZMT0FUJDUgPSAweDE0MDY7XG5cbnZhciBHTF9SR0IkMSA9IDB4MTkwNztcbnZhciBHTF9SR0JBJDIgPSAweDE5MDg7XG5cbnZhciBHTF9ERVBUSF9DT01QT05FTlQkMSA9IDB4MTkwMjtcblxudmFyIGNvbG9yVGV4dHVyZUZvcm1hdEVudW1zID0gW1xuICBHTF9SR0IkMSxcbiAgR0xfUkdCQSQyXG5dO1xuXG4vLyBmb3IgZXZlcnkgdGV4dHVyZSBmb3JtYXQsIHN0b3JlXG4vLyB0aGUgbnVtYmVyIG9mIGNoYW5uZWxzXG52YXIgdGV4dHVyZUZvcm1hdENoYW5uZWxzID0gW107XG50ZXh0dXJlRm9ybWF0Q2hhbm5lbHNbR0xfUkdCQSQyXSA9IDQ7XG50ZXh0dXJlRm9ybWF0Q2hhbm5lbHNbR0xfUkdCJDFdID0gMztcblxuLy8gZm9yIGV2ZXJ5IHRleHR1cmUgdHlwZSwgc3RvcmVcbi8vIHRoZSBzaXplIGluIGJ5dGVzLlxudmFyIHRleHR1cmVUeXBlU2l6ZXMgPSBbXTtcbnRleHR1cmVUeXBlU2l6ZXNbR0xfVU5TSUdORURfQllURSQ2XSA9IDE7XG50ZXh0dXJlVHlwZVNpemVzW0dMX0ZMT0FUJDVdID0gNDtcbnRleHR1cmVUeXBlU2l6ZXNbR0xfSEFMRl9GTE9BVF9PRVMkMl0gPSAyO1xuXG52YXIgR0xfUkdCQTQkMiA9IDB4ODA1NjtcbnZhciBHTF9SR0I1X0ExJDIgPSAweDgwNTc7XG52YXIgR0xfUkdCNTY1JDIgPSAweDhENjI7XG52YXIgR0xfREVQVEhfQ09NUE9ORU5UMTYkMSA9IDB4ODFBNTtcbnZhciBHTF9TVEVOQ0lMX0lOREVYOCQxID0gMHg4RDQ4O1xudmFyIEdMX0RFUFRIX1NURU5DSUwkMiA9IDB4ODRGOTtcblxudmFyIEdMX1NSR0I4X0FMUEhBOF9FWFQkMSA9IDB4OEM0MztcblxudmFyIEdMX1JHQkEzMkZfRVhUJDEgPSAweDg4MTQ7XG5cbnZhciBHTF9SR0JBMTZGX0VYVCQxID0gMHg4ODFBO1xudmFyIEdMX1JHQjE2Rl9FWFQkMSA9IDB4ODgxQjtcblxudmFyIGNvbG9yUmVuZGVyYnVmZmVyRm9ybWF0RW51bXMgPSBbXG4gIEdMX1JHQkE0JDIsXG4gIEdMX1JHQjVfQTEkMixcbiAgR0xfUkdCNTY1JDIsXG4gIEdMX1NSR0I4X0FMUEhBOF9FWFQkMSxcbiAgR0xfUkdCQTE2Rl9FWFQkMSxcbiAgR0xfUkdCMTZGX0VYVCQxLFxuICBHTF9SR0JBMzJGX0VYVCQxXG5dO1xuXG52YXIgc3RhdHVzQ29kZSA9IHt9O1xuc3RhdHVzQ29kZVtHTF9GUkFNRUJVRkZFUl9DT01QTEVURSQxXSA9ICdjb21wbGV0ZSc7XG5zdGF0dXNDb2RlW0dMX0ZSQU1FQlVGRkVSX0lOQ09NUExFVEVfQVRUQUNITUVOVF0gPSAnaW5jb21wbGV0ZSBhdHRhY2htZW50JztcbnN0YXR1c0NvZGVbR0xfRlJBTUVCVUZGRVJfSU5DT01QTEVURV9ESU1FTlNJT05TXSA9ICdpbmNvbXBsZXRlIGRpbWVuc2lvbnMnO1xuc3RhdHVzQ29kZVtHTF9GUkFNRUJVRkZFUl9JTkNPTVBMRVRFX01JU1NJTkdfQVRUQUNITUVOVF0gPSAnaW5jb21wbGV0ZSwgbWlzc2luZyBhdHRhY2htZW50JztcbnN0YXR1c0NvZGVbR0xfRlJBTUVCVUZGRVJfVU5TVVBQT1JURURdID0gJ3Vuc3VwcG9ydGVkJztcblxuZnVuY3Rpb24gd3JhcEZCT1N0YXRlIChcbiAgZ2wsXG4gIGV4dGVuc2lvbnMsXG4gIGxpbWl0cyxcbiAgdGV4dHVyZVN0YXRlLFxuICByZW5kZXJidWZmZXJTdGF0ZSxcbiAgc3RhdHMpIHtcbiAgdmFyIGZyYW1lYnVmZmVyU3RhdGUgPSB7XG4gICAgY3VyOiBudWxsLFxuICAgIG5leHQ6IG51bGwsXG4gICAgZGlydHk6IGZhbHNlLFxuICAgIHNldEZCTzogbnVsbFxuICB9O1xuXG4gIHZhciBjb2xvclRleHR1cmVGb3JtYXRzID0gWydyZ2JhJ107XG4gIHZhciBjb2xvclJlbmRlcmJ1ZmZlckZvcm1hdHMgPSBbJ3JnYmE0JywgJ3JnYjU2NScsICdyZ2I1IGExJ107XG5cbiAgaWYgKGV4dGVuc2lvbnMuZXh0X3NyZ2IpIHtcbiAgICBjb2xvclJlbmRlcmJ1ZmZlckZvcm1hdHMucHVzaCgnc3JnYmEnKTtcbiAgfVxuXG4gIGlmIChleHRlbnNpb25zLmV4dF9jb2xvcl9idWZmZXJfaGFsZl9mbG9hdCkge1xuICAgIGNvbG9yUmVuZGVyYnVmZmVyRm9ybWF0cy5wdXNoKCdyZ2JhMTZmJywgJ3JnYjE2ZicpO1xuICB9XG5cbiAgaWYgKGV4dGVuc2lvbnMud2ViZ2xfY29sb3JfYnVmZmVyX2Zsb2F0KSB7XG4gICAgY29sb3JSZW5kZXJidWZmZXJGb3JtYXRzLnB1c2goJ3JnYmEzMmYnKTtcbiAgfVxuXG4gIHZhciBjb2xvclR5cGVzID0gWyd1aW50OCddO1xuICBpZiAoZXh0ZW5zaW9ucy5vZXNfdGV4dHVyZV9oYWxmX2Zsb2F0KSB7XG4gICAgY29sb3JUeXBlcy5wdXNoKCdoYWxmIGZsb2F0JywgJ2Zsb2F0MTYnKTtcbiAgfVxuICBpZiAoZXh0ZW5zaW9ucy5vZXNfdGV4dHVyZV9mbG9hdCkge1xuICAgIGNvbG9yVHlwZXMucHVzaCgnZmxvYXQnLCAnZmxvYXQzMicpO1xuICB9XG5cbiAgZnVuY3Rpb24gRnJhbWVidWZmZXJBdHRhY2htZW50ICh0YXJnZXQsIHRleHR1cmUsIHJlbmRlcmJ1ZmZlcikge1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMudGV4dHVyZSA9IHRleHR1cmU7XG4gICAgdGhpcy5yZW5kZXJidWZmZXIgPSByZW5kZXJidWZmZXI7XG5cbiAgICB2YXIgdyA9IDA7XG4gICAgdmFyIGggPSAwO1xuICAgIGlmICh0ZXh0dXJlKSB7XG4gICAgICB3ID0gdGV4dHVyZS53aWR0aDtcbiAgICAgIGggPSB0ZXh0dXJlLmhlaWdodDtcbiAgICB9IGVsc2UgaWYgKHJlbmRlcmJ1ZmZlcikge1xuICAgICAgdyA9IHJlbmRlcmJ1ZmZlci53aWR0aDtcbiAgICAgIGggPSByZW5kZXJidWZmZXIuaGVpZ2h0O1xuICAgIH1cbiAgICB0aGlzLndpZHRoID0gdztcbiAgICB0aGlzLmhlaWdodCA9IGg7XG4gIH1cblxuICBmdW5jdGlvbiBkZWNSZWYgKGF0dGFjaG1lbnQpIHtcbiAgICBpZiAoYXR0YWNobWVudCkge1xuICAgICAgaWYgKGF0dGFjaG1lbnQudGV4dHVyZSkge1xuICAgICAgICBhdHRhY2htZW50LnRleHR1cmUuX3RleHR1cmUuZGVjUmVmKCk7XG4gICAgICB9XG4gICAgICBpZiAoYXR0YWNobWVudC5yZW5kZXJidWZmZXIpIHtcbiAgICAgICAgYXR0YWNobWVudC5yZW5kZXJidWZmZXIuX3JlbmRlcmJ1ZmZlci5kZWNSZWYoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbmNSZWZBbmRDaGVja1NoYXBlIChhdHRhY2htZW50LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgaWYgKCFhdHRhY2htZW50KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKGF0dGFjaG1lbnQudGV4dHVyZSkge1xuICAgICAgdmFyIHRleHR1cmUgPSBhdHRhY2htZW50LnRleHR1cmUuX3RleHR1cmU7XG4gICAgICB2YXIgdHcgPSBNYXRoLm1heCgxLCB0ZXh0dXJlLndpZHRoKTtcbiAgICAgIHZhciB0aCA9IE1hdGgubWF4KDEsIHRleHR1cmUuaGVpZ2h0KTtcbiAgICAgIGNoZWNrJDEodHcgPT09IHdpZHRoICYmIHRoID09PSBoZWlnaHQsXG4gICAgICAgICdpbmNvbnNpc3RlbnQgd2lkdGgvaGVpZ2h0IGZvciBzdXBwbGllZCB0ZXh0dXJlJyk7XG4gICAgICB0ZXh0dXJlLnJlZkNvdW50ICs9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZW5kZXJidWZmZXIgPSBhdHRhY2htZW50LnJlbmRlcmJ1ZmZlci5fcmVuZGVyYnVmZmVyO1xuICAgICAgY2hlY2skMShcbiAgICAgICAgcmVuZGVyYnVmZmVyLndpZHRoID09PSB3aWR0aCAmJiByZW5kZXJidWZmZXIuaGVpZ2h0ID09PSBoZWlnaHQsXG4gICAgICAgICdpbmNvbnNpc3RlbnQgd2lkdGgvaGVpZ2h0IGZvciByZW5kZXJidWZmZXInKTtcbiAgICAgIHJlbmRlcmJ1ZmZlci5yZWZDb3VudCArPSAxO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGF0dGFjaCAobG9jYXRpb24sIGF0dGFjaG1lbnQpIHtcbiAgICBpZiAoYXR0YWNobWVudCkge1xuICAgICAgaWYgKGF0dGFjaG1lbnQudGV4dHVyZSkge1xuICAgICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChcbiAgICAgICAgICBHTF9GUkFNRUJVRkZFUiQxLFxuICAgICAgICAgIGxvY2F0aW9uLFxuICAgICAgICAgIGF0dGFjaG1lbnQudGFyZ2V0LFxuICAgICAgICAgIGF0dGFjaG1lbnQudGV4dHVyZS5fdGV4dHVyZS50ZXh0dXJlLFxuICAgICAgICAgIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoXG4gICAgICAgICAgR0xfRlJBTUVCVUZGRVIkMSxcbiAgICAgICAgICBsb2NhdGlvbixcbiAgICAgICAgICBHTF9SRU5ERVJCVUZGRVIkMSxcbiAgICAgICAgICBhdHRhY2htZW50LnJlbmRlcmJ1ZmZlci5fcmVuZGVyYnVmZmVyLnJlbmRlcmJ1ZmZlcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VBdHRhY2htZW50IChhdHRhY2htZW50KSB7XG4gICAgdmFyIHRhcmdldCA9IEdMX1RFWFRVUkVfMkQkMjtcbiAgICB2YXIgdGV4dHVyZSA9IG51bGw7XG4gICAgdmFyIHJlbmRlcmJ1ZmZlciA9IG51bGw7XG5cbiAgICB2YXIgZGF0YSA9IGF0dGFjaG1lbnQ7XG4gICAgaWYgKHR5cGVvZiBhdHRhY2htZW50ID09PSAnb2JqZWN0Jykge1xuICAgICAgZGF0YSA9IGF0dGFjaG1lbnQuZGF0YTtcbiAgICAgIGlmICgndGFyZ2V0JyBpbiBhdHRhY2htZW50KSB7XG4gICAgICAgIHRhcmdldCA9IGF0dGFjaG1lbnQudGFyZ2V0IHwgMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVjayQxLnR5cGUoZGF0YSwgJ2Z1bmN0aW9uJywgJ2ludmFsaWQgYXR0YWNobWVudCBkYXRhJyk7XG5cbiAgICB2YXIgdHlwZSA9IGRhdGEuX3JlZ2xUeXBlO1xuICAgIGlmICh0eXBlID09PSAndGV4dHVyZTJkJykge1xuICAgICAgdGV4dHVyZSA9IGRhdGE7XG4gICAgICBjaGVjayQxKHRhcmdldCA9PT0gR0xfVEVYVFVSRV8yRCQyKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd0ZXh0dXJlQ3ViZScpIHtcbiAgICAgIHRleHR1cmUgPSBkYXRhO1xuICAgICAgY2hlY2skMShcbiAgICAgICAgdGFyZ2V0ID49IEdMX1RFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCQyICYmXG4gICAgICAgIHRhcmdldCA8IEdMX1RFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCQyICsgNixcbiAgICAgICAgJ2ludmFsaWQgY3ViZSBtYXAgdGFyZ2V0Jyk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAncmVuZGVyYnVmZmVyJykge1xuICAgICAgcmVuZGVyYnVmZmVyID0gZGF0YTtcbiAgICAgIHRhcmdldCA9IEdMX1JFTkRFUkJVRkZFUiQxO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGVjayQxLnJhaXNlKCdpbnZhbGlkIHJlZ2wgb2JqZWN0IGZvciBhdHRhY2htZW50Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBGcmFtZWJ1ZmZlckF0dGFjaG1lbnQodGFyZ2V0LCB0ZXh0dXJlLCByZW5kZXJidWZmZXIpXG4gIH1cblxuICBmdW5jdGlvbiBhbGxvY0F0dGFjaG1lbnQgKFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBpc1RleHR1cmUsXG4gICAgZm9ybWF0LFxuICAgIHR5cGUpIHtcbiAgICBpZiAoaXNUZXh0dXJlKSB7XG4gICAgICB2YXIgdGV4dHVyZSA9IHRleHR1cmVTdGF0ZS5jcmVhdGUyRCh7XG4gICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgIGZvcm1hdDogZm9ybWF0LFxuICAgICAgICB0eXBlOiB0eXBlXG4gICAgICB9KTtcbiAgICAgIHRleHR1cmUuX3RleHR1cmUucmVmQ291bnQgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBGcmFtZWJ1ZmZlckF0dGFjaG1lbnQoR0xfVEVYVFVSRV8yRCQyLCB0ZXh0dXJlLCBudWxsKVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmIgPSByZW5kZXJidWZmZXJTdGF0ZS5jcmVhdGUoe1xuICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICBmb3JtYXQ6IGZvcm1hdFxuICAgICAgfSk7XG4gICAgICByYi5fcmVuZGVyYnVmZmVyLnJlZkNvdW50ID0gMDtcbiAgICAgIHJldHVybiBuZXcgRnJhbWVidWZmZXJBdHRhY2htZW50KEdMX1JFTkRFUkJVRkZFUiQxLCBudWxsLCByYilcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1bndyYXBBdHRhY2htZW50IChhdHRhY2htZW50KSB7XG4gICAgcmV0dXJuIGF0dGFjaG1lbnQgJiYgKGF0dGFjaG1lbnQudGV4dHVyZSB8fCBhdHRhY2htZW50LnJlbmRlcmJ1ZmZlcilcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2l6ZUF0dGFjaG1lbnQgKGF0dGFjaG1lbnQsIHcsIGgpIHtcbiAgICBpZiAoYXR0YWNobWVudCkge1xuICAgICAgaWYgKGF0dGFjaG1lbnQudGV4dHVyZSkge1xuICAgICAgICBhdHRhY2htZW50LnRleHR1cmUucmVzaXplKHcsIGgpO1xuICAgICAgfSBlbHNlIGlmIChhdHRhY2htZW50LnJlbmRlcmJ1ZmZlcikge1xuICAgICAgICBhdHRhY2htZW50LnJlbmRlcmJ1ZmZlci5yZXNpemUodywgaCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIGZyYW1lYnVmZmVyQ291bnQgPSAwO1xuICB2YXIgZnJhbWVidWZmZXJTZXQgPSB7fTtcblxuICBmdW5jdGlvbiBSRUdMRnJhbWVidWZmZXIgKCkge1xuICAgIHRoaXMuaWQgPSBmcmFtZWJ1ZmZlckNvdW50Kys7XG4gICAgZnJhbWVidWZmZXJTZXRbdGhpcy5pZF0gPSB0aGlzO1xuXG4gICAgdGhpcy5mcmFtZWJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XG4gICAgdGhpcy53aWR0aCA9IDA7XG4gICAgdGhpcy5oZWlnaHQgPSAwO1xuXG4gICAgdGhpcy5jb2xvckF0dGFjaG1lbnRzID0gW107XG4gICAgdGhpcy5kZXB0aEF0dGFjaG1lbnQgPSBudWxsO1xuICAgIHRoaXMuc3RlbmNpbEF0dGFjaG1lbnQgPSBudWxsO1xuICAgIHRoaXMuZGVwdGhTdGVuY2lsQXR0YWNobWVudCA9IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBkZWNGQk9SZWZzIChmcmFtZWJ1ZmZlcikge1xuICAgIGZyYW1lYnVmZmVyLmNvbG9yQXR0YWNobWVudHMuZm9yRWFjaChkZWNSZWYpO1xuICAgIGRlY1JlZihmcmFtZWJ1ZmZlci5kZXB0aEF0dGFjaG1lbnQpO1xuICAgIGRlY1JlZihmcmFtZWJ1ZmZlci5zdGVuY2lsQXR0YWNobWVudCk7XG4gICAgZGVjUmVmKGZyYW1lYnVmZmVyLmRlcHRoU3RlbmNpbEF0dGFjaG1lbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSAoZnJhbWVidWZmZXIpIHtcbiAgICB2YXIgaGFuZGxlID0gZnJhbWVidWZmZXIuZnJhbWVidWZmZXI7XG4gICAgY2hlY2skMShoYW5kbGUsICdtdXN0IG5vdCBkb3VibGUgZGVzdHJveSBmcmFtZWJ1ZmZlcicpO1xuICAgIGdsLmRlbGV0ZUZyYW1lYnVmZmVyKGhhbmRsZSk7XG4gICAgZnJhbWVidWZmZXIuZnJhbWVidWZmZXIgPSBudWxsO1xuICAgIHN0YXRzLmZyYW1lYnVmZmVyQ291bnQtLTtcbiAgICBkZWxldGUgZnJhbWVidWZmZXJTZXRbZnJhbWVidWZmZXIuaWRdO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlRnJhbWVidWZmZXIgKGZyYW1lYnVmZmVyKSB7XG4gICAgdmFyIGk7XG5cbiAgICBnbC5iaW5kRnJhbWVidWZmZXIoR0xfRlJBTUVCVUZGRVIkMSwgZnJhbWVidWZmZXIuZnJhbWVidWZmZXIpO1xuICAgIHZhciBjb2xvckF0dGFjaG1lbnRzID0gZnJhbWVidWZmZXIuY29sb3JBdHRhY2htZW50cztcbiAgICBmb3IgKGkgPSAwOyBpIDwgY29sb3JBdHRhY2htZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgYXR0YWNoKEdMX0NPTE9SX0FUVEFDSE1FTlQwJDEgKyBpLCBjb2xvckF0dGFjaG1lbnRzW2ldKTtcbiAgICB9XG4gICAgZm9yIChpID0gY29sb3JBdHRhY2htZW50cy5sZW5ndGg7IGkgPCBsaW1pdHMubWF4Q29sb3JBdHRhY2htZW50czsgKytpKSB7XG4gICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChcbiAgICAgICAgR0xfRlJBTUVCVUZGRVIkMSxcbiAgICAgICAgR0xfQ09MT1JfQVRUQUNITUVOVDAkMSArIGksXG4gICAgICAgIEdMX1RFWFRVUkVfMkQkMixcbiAgICAgICAgbnVsbCxcbiAgICAgICAgMCk7XG4gICAgfVxuXG4gICAgZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoXG4gICAgICBHTF9GUkFNRUJVRkZFUiQxLFxuICAgICAgR0xfREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5ULFxuICAgICAgR0xfVEVYVFVSRV8yRCQyLFxuICAgICAgbnVsbCxcbiAgICAgIDApO1xuICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKFxuICAgICAgR0xfRlJBTUVCVUZGRVIkMSxcbiAgICAgIEdMX0RFUFRIX0FUVEFDSE1FTlQsXG4gICAgICBHTF9URVhUVVJFXzJEJDIsXG4gICAgICBudWxsLFxuICAgICAgMCk7XG4gICAgZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoXG4gICAgICBHTF9GUkFNRUJVRkZFUiQxLFxuICAgICAgR0xfU1RFTkNJTF9BVFRBQ0hNRU5ULFxuICAgICAgR0xfVEVYVFVSRV8yRCQyLFxuICAgICAgbnVsbCxcbiAgICAgIDApO1xuXG4gICAgYXR0YWNoKEdMX0RFUFRIX0FUVEFDSE1FTlQsIGZyYW1lYnVmZmVyLmRlcHRoQXR0YWNobWVudCk7XG4gICAgYXR0YWNoKEdMX1NURU5DSUxfQVRUQUNITUVOVCwgZnJhbWVidWZmZXIuc3RlbmNpbEF0dGFjaG1lbnQpO1xuICAgIGF0dGFjaChHTF9ERVBUSF9TVEVOQ0lMX0FUVEFDSE1FTlQsIGZyYW1lYnVmZmVyLmRlcHRoU3RlbmNpbEF0dGFjaG1lbnQpO1xuXG4gICAgLy8gQ2hlY2sgc3RhdHVzIGNvZGVcbiAgICB2YXIgc3RhdHVzID0gZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhHTF9GUkFNRUJVRkZFUiQxKTtcbiAgICBpZiAoc3RhdHVzICE9PSBHTF9GUkFNRUJVRkZFUl9DT01QTEVURSQxKSB7XG4gICAgICBjaGVjayQxLnJhaXNlKCdmcmFtZWJ1ZmZlciBjb25maWd1cmF0aW9uIG5vdCBzdXBwb3J0ZWQsIHN0YXR1cyA9ICcgK1xuICAgICAgICBzdGF0dXNDb2RlW3N0YXR1c10pO1xuICAgIH1cblxuXG4gICAgZ2wuYmluZEZyYW1lYnVmZmVyKEdMX0ZSQU1FQlVGRkVSJDEsIGZyYW1lYnVmZmVyU3RhdGUubmV4dCA/IGZyYW1lYnVmZmVyU3RhdGUubmV4dC5mcmFtZWJ1ZmZlciA6IG51bGwpO1xuICAgIGZyYW1lYnVmZmVyU3RhdGUuY3VyID0gZnJhbWVidWZmZXJTdGF0ZS5uZXh0O1xuXG4gICAgLy8gRklYTUU6IENsZWFyIGVycm9yIGNvZGUgaGVyZS4gIFRoaXMgaXMgYSB3b3JrIGFyb3VuZCBmb3IgYSBidWcgaW5cbiAgICAvLyBoZWFkbGVzcy1nbFxuICAgIGdsLmdldEVycm9yKCk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVGQk8gKGEwLCBhMSkge1xuICAgIHZhciBmcmFtZWJ1ZmZlciA9IG5ldyBSRUdMRnJhbWVidWZmZXIoKTtcbiAgICBzdGF0cy5mcmFtZWJ1ZmZlckNvdW50Kys7XG5cbiAgICBmdW5jdGlvbiByZWdsRnJhbWVidWZmZXIgKGEsIGIpIHtcbiAgICAgIHZhciBpO1xuXG4gICAgICBjaGVjayQxKGZyYW1lYnVmZmVyU3RhdGUubmV4dCAhPT0gZnJhbWVidWZmZXIsXG4gICAgICAgICdjYW4gbm90IHVwZGF0ZSBmcmFtZWJ1ZmZlciB3aGljaCBpcyBjdXJyZW50bHkgaW4gdXNlJyk7XG5cbiAgICAgIHZhciBleHREcmF3QnVmZmVycyA9IGV4dGVuc2lvbnMud2ViZ2xfZHJhd19idWZmZXJzO1xuXG4gICAgICB2YXIgd2lkdGggPSAwO1xuICAgICAgdmFyIGhlaWdodCA9IDA7XG5cbiAgICAgIHZhciBuZWVkc0RlcHRoID0gdHJ1ZTtcbiAgICAgIHZhciBuZWVkc1N0ZW5jaWwgPSB0cnVlO1xuXG4gICAgICB2YXIgY29sb3JCdWZmZXIgPSBudWxsO1xuICAgICAgdmFyIGNvbG9yVGV4dHVyZSA9IHRydWU7XG4gICAgICB2YXIgY29sb3JGb3JtYXQgPSAncmdiYSc7XG4gICAgICB2YXIgY29sb3JUeXBlID0gJ3VpbnQ4JztcbiAgICAgIHZhciBjb2xvckNvdW50ID0gMTtcblxuICAgICAgdmFyIGRlcHRoQnVmZmVyID0gbnVsbDtcbiAgICAgIHZhciBzdGVuY2lsQnVmZmVyID0gbnVsbDtcbiAgICAgIHZhciBkZXB0aFN0ZW5jaWxCdWZmZXIgPSBudWxsO1xuICAgICAgdmFyIGRlcHRoU3RlbmNpbFRleHR1cmUgPSBmYWxzZTtcblxuICAgICAgaWYgKHR5cGVvZiBhID09PSAnbnVtYmVyJykge1xuICAgICAgICB3aWR0aCA9IGEgfCAwO1xuICAgICAgICBoZWlnaHQgPSAoYiB8IDApIHx8IHdpZHRoO1xuICAgICAgfSBlbHNlIGlmICghYSkge1xuICAgICAgICB3aWR0aCA9IGhlaWdodCA9IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGVjayQxLnR5cGUoYSwgJ29iamVjdCcsICdpbnZhbGlkIGFyZ3VtZW50cyBmb3IgZnJhbWVidWZmZXInKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBhO1xuXG4gICAgICAgIGlmICgnc2hhcGUnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICB2YXIgc2hhcGUgPSBvcHRpb25zLnNoYXBlO1xuICAgICAgICAgIGNoZWNrJDEoQXJyYXkuaXNBcnJheShzaGFwZSkgJiYgc2hhcGUubGVuZ3RoID49IDIsXG4gICAgICAgICAgICAnaW52YWxpZCBzaGFwZSBmb3IgZnJhbWVidWZmZXInKTtcbiAgICAgICAgICB3aWR0aCA9IHNoYXBlWzBdO1xuICAgICAgICAgIGhlaWdodCA9IHNoYXBlWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICgncmFkaXVzJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICB3aWR0aCA9IGhlaWdodCA9IG9wdGlvbnMucmFkaXVzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoJ3dpZHRoJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICB3aWR0aCA9IG9wdGlvbnMud2lkdGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgnaGVpZ2h0JyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICBoZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbG9yJyBpbiBvcHRpb25zIHx8XG4gICAgICAgICAgICAnY29sb3JzJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgY29sb3JCdWZmZXIgPVxuICAgICAgICAgICAgb3B0aW9ucy5jb2xvciB8fFxuICAgICAgICAgICAgb3B0aW9ucy5jb2xvcnM7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY29sb3JCdWZmZXIpKSB7XG4gICAgICAgICAgICBjaGVjayQxKFxuICAgICAgICAgICAgICBjb2xvckJ1ZmZlci5sZW5ndGggPT09IDEgfHwgZXh0RHJhd0J1ZmZlcnMsXG4gICAgICAgICAgICAgICdtdWx0aXBsZSByZW5kZXIgdGFyZ2V0cyBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjb2xvckJ1ZmZlcikge1xuICAgICAgICAgIGlmICgnY29sb3JDb3VudCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgY29sb3JDb3VudCA9IG9wdGlvbnMuY29sb3JDb3VudCB8IDA7XG4gICAgICAgICAgICBjaGVjayQxKGNvbG9yQ291bnQgPiAwLCAnaW52YWxpZCBjb2xvciBidWZmZXIgY291bnQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoJ2NvbG9yVGV4dHVyZScgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgY29sb3JUZXh0dXJlID0gISFvcHRpb25zLmNvbG9yVGV4dHVyZTtcbiAgICAgICAgICAgIGNvbG9yRm9ybWF0ID0gJ3JnYmE0JztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoJ2NvbG9yVHlwZScgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgY29sb3JUeXBlID0gb3B0aW9ucy5jb2xvclR5cGU7XG4gICAgICAgICAgICBpZiAoIWNvbG9yVGV4dHVyZSkge1xuICAgICAgICAgICAgICBpZiAoY29sb3JUeXBlID09PSAnaGFsZiBmbG9hdCcgfHwgY29sb3JUeXBlID09PSAnZmxvYXQxNicpIHtcbiAgICAgICAgICAgICAgICBjaGVjayQxKGV4dGVuc2lvbnMuZXh0X2NvbG9yX2J1ZmZlcl9oYWxmX2Zsb2F0LFxuICAgICAgICAgICAgICAgICAgJ3lvdSBtdXN0IGVuYWJsZSBFWFRfY29sb3JfYnVmZmVyX2hhbGZfZmxvYXQgdG8gdXNlIDE2LWJpdCByZW5kZXIgYnVmZmVycycpO1xuICAgICAgICAgICAgICAgIGNvbG9yRm9ybWF0ID0gJ3JnYmExNmYnO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbG9yVHlwZSA9PT0gJ2Zsb2F0JyB8fCBjb2xvclR5cGUgPT09ICdmbG9hdDMyJykge1xuICAgICAgICAgICAgICAgIGNoZWNrJDEoZXh0ZW5zaW9ucy53ZWJnbF9jb2xvcl9idWZmZXJfZmxvYXQsXG4gICAgICAgICAgICAgICAgICAneW91IG11c3QgZW5hYmxlIFdFQkdMX2NvbG9yX2J1ZmZlcl9mbG9hdCBpbiBvcmRlciB0byB1c2UgMzItYml0IGZsb2F0aW5nIHBvaW50IHJlbmRlcmJ1ZmZlcnMnKTtcbiAgICAgICAgICAgICAgICBjb2xvckZvcm1hdCA9ICdyZ2JhMzJmJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY2hlY2skMShleHRlbnNpb25zLm9lc190ZXh0dXJlX2Zsb2F0IHx8XG4gICAgICAgICAgICAgICAgIShjb2xvclR5cGUgPT09ICdmbG9hdCcgfHwgY29sb3JUeXBlID09PSAnZmxvYXQzMicpLFxuICAgICAgICAgICAgICAgICd5b3UgbXVzdCBlbmFibGUgT0VTX3RleHR1cmVfZmxvYXQgaW4gb3JkZXIgdG8gdXNlIGZsb2F0aW5nIHBvaW50IGZyYW1lYnVmZmVyIG9iamVjdHMnKTtcbiAgICAgICAgICAgICAgY2hlY2skMShleHRlbnNpb25zLm9lc190ZXh0dXJlX2hhbGZfZmxvYXQgfHxcbiAgICAgICAgICAgICAgICAhKGNvbG9yVHlwZSA9PT0gJ2hhbGYgZmxvYXQnIHx8IGNvbG9yVHlwZSA9PT0gJ2Zsb2F0MTYnKSxcbiAgICAgICAgICAgICAgICAneW91IG11c3QgZW5hYmxlIE9FU190ZXh0dXJlX2hhbGZfZmxvYXQgaW4gb3JkZXIgdG8gdXNlIDE2LWJpdCBmbG9hdGluZyBwb2ludCBmcmFtZWJ1ZmZlciBvYmplY3RzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGVjayQxLm9uZU9mKGNvbG9yVHlwZSwgY29sb3JUeXBlcywgJ2ludmFsaWQgY29sb3IgdHlwZScpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICgnY29sb3JGb3JtYXQnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbG9yRm9ybWF0ID0gb3B0aW9ucy5jb2xvckZvcm1hdDtcbiAgICAgICAgICAgIGlmIChjb2xvclRleHR1cmVGb3JtYXRzLmluZGV4T2YoY29sb3JGb3JtYXQpID49IDApIHtcbiAgICAgICAgICAgICAgY29sb3JUZXh0dXJlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29sb3JSZW5kZXJidWZmZXJGb3JtYXRzLmluZGV4T2YoY29sb3JGb3JtYXQpID49IDApIHtcbiAgICAgICAgICAgICAgY29sb3JUZXh0dXJlID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoY29sb3JUZXh0dXJlKSB7XG4gICAgICAgICAgICAgICAgY2hlY2skMS5vbmVPZihcbiAgICAgICAgICAgICAgICAgIG9wdGlvbnMuY29sb3JGb3JtYXQsIGNvbG9yVGV4dHVyZUZvcm1hdHMsXG4gICAgICAgICAgICAgICAgICAnaW52YWxpZCBjb2xvciBmb3JtYXQgZm9yIHRleHR1cmUnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjaGVjayQxLm9uZU9mKFxuICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jb2xvckZvcm1hdCwgY29sb3JSZW5kZXJidWZmZXJGb3JtYXRzLFxuICAgICAgICAgICAgICAgICAgJ2ludmFsaWQgY29sb3IgZm9ybWF0IGZvciByZW5kZXJidWZmZXInKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnZGVwdGhUZXh0dXJlJyBpbiBvcHRpb25zIHx8ICdkZXB0aFN0ZW5jaWxUZXh0dXJlJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgZGVwdGhTdGVuY2lsVGV4dHVyZSA9ICEhKG9wdGlvbnMuZGVwdGhUZXh0dXJlIHx8XG4gICAgICAgICAgICBvcHRpb25zLmRlcHRoU3RlbmNpbFRleHR1cmUpO1xuICAgICAgICAgIGNoZWNrJDEoIWRlcHRoU3RlbmNpbFRleHR1cmUgfHwgZXh0ZW5zaW9ucy53ZWJnbF9kZXB0aF90ZXh0dXJlLFxuICAgICAgICAgICAgJ3dlYmdsX2RlcHRoX3RleHR1cmUgZXh0ZW5zaW9uIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnZGVwdGgnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuZGVwdGggPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgbmVlZHNEZXB0aCA9IG9wdGlvbnMuZGVwdGg7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlcHRoQnVmZmVyID0gb3B0aW9ucy5kZXB0aDtcbiAgICAgICAgICAgIG5lZWRzU3RlbmNpbCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnc3RlbmNpbCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5zdGVuY2lsID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIG5lZWRzU3RlbmNpbCA9IG9wdGlvbnMuc3RlbmNpbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RlbmNpbEJ1ZmZlciA9IG9wdGlvbnMuc3RlbmNpbDtcbiAgICAgICAgICAgIG5lZWRzRGVwdGggPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2RlcHRoU3RlbmNpbCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5kZXB0aFN0ZW5jaWwgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgbmVlZHNEZXB0aCA9IG5lZWRzU3RlbmNpbCA9IG9wdGlvbnMuZGVwdGhTdGVuY2lsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZXB0aFN0ZW5jaWxCdWZmZXIgPSBvcHRpb25zLmRlcHRoU3RlbmNpbDtcbiAgICAgICAgICAgIG5lZWRzRGVwdGggPSBmYWxzZTtcbiAgICAgICAgICAgIG5lZWRzU3RlbmNpbCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBwYXJzZSBhdHRhY2htZW50c1xuICAgICAgdmFyIGNvbG9yQXR0YWNobWVudHMgPSBudWxsO1xuICAgICAgdmFyIGRlcHRoQXR0YWNobWVudCA9IG51bGw7XG4gICAgICB2YXIgc3RlbmNpbEF0dGFjaG1lbnQgPSBudWxsO1xuICAgICAgdmFyIGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQgPSBudWxsO1xuXG4gICAgICAvLyBTZXQgdXAgY29sb3IgYXR0YWNobWVudHNcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGNvbG9yQnVmZmVyKSkge1xuICAgICAgICBjb2xvckF0dGFjaG1lbnRzID0gY29sb3JCdWZmZXIubWFwKHBhcnNlQXR0YWNobWVudCk7XG4gICAgICB9IGVsc2UgaWYgKGNvbG9yQnVmZmVyKSB7XG4gICAgICAgIGNvbG9yQXR0YWNobWVudHMgPSBbcGFyc2VBdHRhY2htZW50KGNvbG9yQnVmZmVyKV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2xvckF0dGFjaG1lbnRzID0gbmV3IEFycmF5KGNvbG9yQ291bnQpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29sb3JDb3VudDsgKytpKSB7XG4gICAgICAgICAgY29sb3JBdHRhY2htZW50c1tpXSA9IGFsbG9jQXR0YWNobWVudChcbiAgICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgICAgY29sb3JUZXh0dXJlLFxuICAgICAgICAgICAgY29sb3JGb3JtYXQsXG4gICAgICAgICAgICBjb2xvclR5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNoZWNrJDEoZXh0ZW5zaW9ucy53ZWJnbF9kcmF3X2J1ZmZlcnMgfHwgY29sb3JBdHRhY2htZW50cy5sZW5ndGggPD0gMSxcbiAgICAgICAgJ3lvdSBtdXN0IGVuYWJsZSB0aGUgV0VCR0xfZHJhd19idWZmZXJzIGV4dGVuc2lvbiBpbiBvcmRlciB0byB1c2UgbXVsdGlwbGUgY29sb3IgYnVmZmVycy4nKTtcbiAgICAgIGNoZWNrJDEoY29sb3JBdHRhY2htZW50cy5sZW5ndGggPD0gbGltaXRzLm1heENvbG9yQXR0YWNobWVudHMsXG4gICAgICAgICd0b28gbWFueSBjb2xvciBhdHRhY2htZW50cywgbm90IHN1cHBvcnRlZCcpO1xuXG4gICAgICB3aWR0aCA9IHdpZHRoIHx8IGNvbG9yQXR0YWNobWVudHNbMF0ud2lkdGg7XG4gICAgICBoZWlnaHQgPSBoZWlnaHQgfHwgY29sb3JBdHRhY2htZW50c1swXS5oZWlnaHQ7XG5cbiAgICAgIGlmIChkZXB0aEJ1ZmZlcikge1xuICAgICAgICBkZXB0aEF0dGFjaG1lbnQgPSBwYXJzZUF0dGFjaG1lbnQoZGVwdGhCdWZmZXIpO1xuICAgICAgfSBlbHNlIGlmIChuZWVkc0RlcHRoICYmICFuZWVkc1N0ZW5jaWwpIHtcbiAgICAgICAgZGVwdGhBdHRhY2htZW50ID0gYWxsb2NBdHRhY2htZW50KFxuICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICBkZXB0aFN0ZW5jaWxUZXh0dXJlLFxuICAgICAgICAgICdkZXB0aCcsXG4gICAgICAgICAgJ3VpbnQzMicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RlbmNpbEJ1ZmZlcikge1xuICAgICAgICBzdGVuY2lsQXR0YWNobWVudCA9IHBhcnNlQXR0YWNobWVudChzdGVuY2lsQnVmZmVyKTtcbiAgICAgIH0gZWxzZSBpZiAobmVlZHNTdGVuY2lsICYmICFuZWVkc0RlcHRoKSB7XG4gICAgICAgIHN0ZW5jaWxBdHRhY2htZW50ID0gYWxsb2NBdHRhY2htZW50KFxuICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAnc3RlbmNpbCcsXG4gICAgICAgICAgJ3VpbnQ4Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkZXB0aFN0ZW5jaWxCdWZmZXIpIHtcbiAgICAgICAgZGVwdGhTdGVuY2lsQXR0YWNobWVudCA9IHBhcnNlQXR0YWNobWVudChkZXB0aFN0ZW5jaWxCdWZmZXIpO1xuICAgICAgfSBlbHNlIGlmICghZGVwdGhCdWZmZXIgJiYgIXN0ZW5jaWxCdWZmZXIgJiYgbmVlZHNTdGVuY2lsICYmIG5lZWRzRGVwdGgpIHtcbiAgICAgICAgZGVwdGhTdGVuY2lsQXR0YWNobWVudCA9IGFsbG9jQXR0YWNobWVudChcbiAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgZGVwdGhTdGVuY2lsVGV4dHVyZSxcbiAgICAgICAgICAnZGVwdGggc3RlbmNpbCcsXG4gICAgICAgICAgJ2RlcHRoIHN0ZW5jaWwnKTtcbiAgICAgIH1cblxuICAgICAgY2hlY2skMShcbiAgICAgICAgKCEhZGVwdGhCdWZmZXIpICsgKCEhc3RlbmNpbEJ1ZmZlcikgKyAoISFkZXB0aFN0ZW5jaWxCdWZmZXIpIDw9IDEsXG4gICAgICAgICdpbnZhbGlkIGZyYW1lYnVmZmVyIGNvbmZpZ3VyYXRpb24sIGNhbiBzcGVjaWZ5IGV4YWN0bHkgb25lIGRlcHRoL3N0ZW5jaWwgYXR0YWNobWVudCcpO1xuXG4gICAgICB2YXIgY29tbW9uQ29sb3JBdHRhY2htZW50U2l6ZSA9IG51bGw7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjb2xvckF0dGFjaG1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGluY1JlZkFuZENoZWNrU2hhcGUoY29sb3JBdHRhY2htZW50c1tpXSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIGNoZWNrJDEoIWNvbG9yQXR0YWNobWVudHNbaV0gfHxcbiAgICAgICAgICAoY29sb3JBdHRhY2htZW50c1tpXS50ZXh0dXJlICYmXG4gICAgICAgICAgICBjb2xvclRleHR1cmVGb3JtYXRFbnVtcy5pbmRleE9mKGNvbG9yQXR0YWNobWVudHNbaV0udGV4dHVyZS5fdGV4dHVyZS5mb3JtYXQpID49IDApIHx8XG4gICAgICAgICAgKGNvbG9yQXR0YWNobWVudHNbaV0ucmVuZGVyYnVmZmVyICYmXG4gICAgICAgICAgICBjb2xvclJlbmRlcmJ1ZmZlckZvcm1hdEVudW1zLmluZGV4T2YoY29sb3JBdHRhY2htZW50c1tpXS5yZW5kZXJidWZmZXIuX3JlbmRlcmJ1ZmZlci5mb3JtYXQpID49IDApLFxuICAgICAgICAgICdmcmFtZWJ1ZmZlciBjb2xvciBhdHRhY2htZW50ICcgKyBpICsgJyBpcyBpbnZhbGlkJyk7XG5cbiAgICAgICAgaWYgKGNvbG9yQXR0YWNobWVudHNbaV0gJiYgY29sb3JBdHRhY2htZW50c1tpXS50ZXh0dXJlKSB7XG4gICAgICAgICAgdmFyIGNvbG9yQXR0YWNobWVudFNpemUgPVxuICAgICAgICAgICAgICB0ZXh0dXJlRm9ybWF0Q2hhbm5lbHNbY29sb3JBdHRhY2htZW50c1tpXS50ZXh0dXJlLl90ZXh0dXJlLmZvcm1hdF0gKlxuICAgICAgICAgICAgICB0ZXh0dXJlVHlwZVNpemVzW2NvbG9yQXR0YWNobWVudHNbaV0udGV4dHVyZS5fdGV4dHVyZS50eXBlXTtcblxuICAgICAgICAgIGlmIChjb21tb25Db2xvckF0dGFjaG1lbnRTaXplID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb21tb25Db2xvckF0dGFjaG1lbnRTaXplID0gY29sb3JBdHRhY2htZW50U2l6ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBtYWtlIHN1cmUgdGhhdCBhbGwgY29sb3IgYXR0YWNobWVudHMgaGF2ZSB0aGUgc2FtZSBudW1iZXIgb2YgYml0cGxhbmVzXG4gICAgICAgICAgICAvLyAodGhhdCBpcywgdGhlIHNhbWUgbnVtZXIgb2YgYml0cyBwZXIgcGl4ZWwpXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHJlcXVpcmVkIGJ5IHRoZSBHTEVTMi4wIHN0YW5kYXJkLiBTZWUgdGhlIGJlZ2lubmluZyBvZiBDaGFwdGVyIDQgaW4gdGhhdCBkb2N1bWVudC5cbiAgICAgICAgICAgIGNoZWNrJDEoY29tbW9uQ29sb3JBdHRhY2htZW50U2l6ZSA9PT0gY29sb3JBdHRhY2htZW50U2l6ZSxcbiAgICAgICAgICAgICAgICAgICdhbGwgY29sb3IgYXR0YWNobWVudHMgbXVjaCBoYXZlIHRoZSBzYW1lIG51bWJlciBvZiBiaXRzIHBlciBwaXhlbC4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGluY1JlZkFuZENoZWNrU2hhcGUoZGVwdGhBdHRhY2htZW50LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIGNoZWNrJDEoIWRlcHRoQXR0YWNobWVudCB8fFxuICAgICAgICAoZGVwdGhBdHRhY2htZW50LnRleHR1cmUgJiZcbiAgICAgICAgICBkZXB0aEF0dGFjaG1lbnQudGV4dHVyZS5fdGV4dHVyZS5mb3JtYXQgPT09IEdMX0RFUFRIX0NPTVBPTkVOVCQxKSB8fFxuICAgICAgICAoZGVwdGhBdHRhY2htZW50LnJlbmRlcmJ1ZmZlciAmJlxuICAgICAgICAgIGRlcHRoQXR0YWNobWVudC5yZW5kZXJidWZmZXIuX3JlbmRlcmJ1ZmZlci5mb3JtYXQgPT09IEdMX0RFUFRIX0NPTVBPTkVOVDE2JDEpLFxuICAgICAgICAnaW52YWxpZCBkZXB0aCBhdHRhY2htZW50IGZvciBmcmFtZWJ1ZmZlciBvYmplY3QnKTtcbiAgICAgIGluY1JlZkFuZENoZWNrU2hhcGUoc3RlbmNpbEF0dGFjaG1lbnQsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgY2hlY2skMSghc3RlbmNpbEF0dGFjaG1lbnQgfHxcbiAgICAgICAgKHN0ZW5jaWxBdHRhY2htZW50LnJlbmRlcmJ1ZmZlciAmJlxuICAgICAgICAgIHN0ZW5jaWxBdHRhY2htZW50LnJlbmRlcmJ1ZmZlci5fcmVuZGVyYnVmZmVyLmZvcm1hdCA9PT0gR0xfU1RFTkNJTF9JTkRFWDgkMSksXG4gICAgICAgICdpbnZhbGlkIHN0ZW5jaWwgYXR0YWNobWVudCBmb3IgZnJhbWVidWZmZXIgb2JqZWN0Jyk7XG4gICAgICBpbmNSZWZBbmRDaGVja1NoYXBlKGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgY2hlY2skMSghZGVwdGhTdGVuY2lsQXR0YWNobWVudCB8fFxuICAgICAgICAoZGVwdGhTdGVuY2lsQXR0YWNobWVudC50ZXh0dXJlICYmXG4gICAgICAgICAgZGVwdGhTdGVuY2lsQXR0YWNobWVudC50ZXh0dXJlLl90ZXh0dXJlLmZvcm1hdCA9PT0gR0xfREVQVEhfU1RFTkNJTCQyKSB8fFxuICAgICAgICAoZGVwdGhTdGVuY2lsQXR0YWNobWVudC5yZW5kZXJidWZmZXIgJiZcbiAgICAgICAgICBkZXB0aFN0ZW5jaWxBdHRhY2htZW50LnJlbmRlcmJ1ZmZlci5fcmVuZGVyYnVmZmVyLmZvcm1hdCA9PT0gR0xfREVQVEhfU1RFTkNJTCQyKSxcbiAgICAgICAgJ2ludmFsaWQgZGVwdGgtc3RlbmNpbCBhdHRhY2htZW50IGZvciBmcmFtZWJ1ZmZlciBvYmplY3QnKTtcblxuICAgICAgLy8gZGVjcmVtZW50IHJlZmVyZW5jZXNcbiAgICAgIGRlY0ZCT1JlZnMoZnJhbWVidWZmZXIpO1xuXG4gICAgICBmcmFtZWJ1ZmZlci53aWR0aCA9IHdpZHRoO1xuICAgICAgZnJhbWVidWZmZXIuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgICBmcmFtZWJ1ZmZlci5jb2xvckF0dGFjaG1lbnRzID0gY29sb3JBdHRhY2htZW50cztcbiAgICAgIGZyYW1lYnVmZmVyLmRlcHRoQXR0YWNobWVudCA9IGRlcHRoQXR0YWNobWVudDtcbiAgICAgIGZyYW1lYnVmZmVyLnN0ZW5jaWxBdHRhY2htZW50ID0gc3RlbmNpbEF0dGFjaG1lbnQ7XG4gICAgICBmcmFtZWJ1ZmZlci5kZXB0aFN0ZW5jaWxBdHRhY2htZW50ID0gZGVwdGhTdGVuY2lsQXR0YWNobWVudDtcblxuICAgICAgcmVnbEZyYW1lYnVmZmVyLmNvbG9yID0gY29sb3JBdHRhY2htZW50cy5tYXAodW53cmFwQXR0YWNobWVudCk7XG4gICAgICByZWdsRnJhbWVidWZmZXIuZGVwdGggPSB1bndyYXBBdHRhY2htZW50KGRlcHRoQXR0YWNobWVudCk7XG4gICAgICByZWdsRnJhbWVidWZmZXIuc3RlbmNpbCA9IHVud3JhcEF0dGFjaG1lbnQoc3RlbmNpbEF0dGFjaG1lbnQpO1xuICAgICAgcmVnbEZyYW1lYnVmZmVyLmRlcHRoU3RlbmNpbCA9IHVud3JhcEF0dGFjaG1lbnQoZGVwdGhTdGVuY2lsQXR0YWNobWVudCk7XG5cbiAgICAgIHJlZ2xGcmFtZWJ1ZmZlci53aWR0aCA9IGZyYW1lYnVmZmVyLndpZHRoO1xuICAgICAgcmVnbEZyYW1lYnVmZmVyLmhlaWdodCA9IGZyYW1lYnVmZmVyLmhlaWdodDtcblxuICAgICAgdXBkYXRlRnJhbWVidWZmZXIoZnJhbWVidWZmZXIpO1xuXG4gICAgICByZXR1cm4gcmVnbEZyYW1lYnVmZmVyXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzaXplICh3XywgaF8pIHtcbiAgICAgIGNoZWNrJDEoZnJhbWVidWZmZXJTdGF0ZS5uZXh0ICE9PSBmcmFtZWJ1ZmZlcixcbiAgICAgICAgJ2NhbiBub3QgcmVzaXplIGEgZnJhbWVidWZmZXIgd2hpY2ggaXMgY3VycmVudGx5IGluIHVzZScpO1xuXG4gICAgICB2YXIgdyA9IHdfIHwgMDtcbiAgICAgIHZhciBoID0gKGhfIHwgMCkgfHwgdztcbiAgICAgIGlmICh3ID09PSBmcmFtZWJ1ZmZlci53aWR0aCAmJiBoID09PSBmcmFtZWJ1ZmZlci5oZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2xGcmFtZWJ1ZmZlclxuICAgICAgfVxuXG4gICAgICAvLyByZXNpemUgYWxsIGJ1ZmZlcnNcbiAgICAgIHZhciBjb2xvckF0dGFjaG1lbnRzID0gZnJhbWVidWZmZXIuY29sb3JBdHRhY2htZW50cztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sb3JBdHRhY2htZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICByZXNpemVBdHRhY2htZW50KGNvbG9yQXR0YWNobWVudHNbaV0sIHcsIGgpO1xuICAgICAgfVxuICAgICAgcmVzaXplQXR0YWNobWVudChmcmFtZWJ1ZmZlci5kZXB0aEF0dGFjaG1lbnQsIHcsIGgpO1xuICAgICAgcmVzaXplQXR0YWNobWVudChmcmFtZWJ1ZmZlci5zdGVuY2lsQXR0YWNobWVudCwgdywgaCk7XG4gICAgICByZXNpemVBdHRhY2htZW50KGZyYW1lYnVmZmVyLmRlcHRoU3RlbmNpbEF0dGFjaG1lbnQsIHcsIGgpO1xuXG4gICAgICBmcmFtZWJ1ZmZlci53aWR0aCA9IHJlZ2xGcmFtZWJ1ZmZlci53aWR0aCA9IHc7XG4gICAgICBmcmFtZWJ1ZmZlci5oZWlnaHQgPSByZWdsRnJhbWVidWZmZXIuaGVpZ2h0ID0gaDtcblxuICAgICAgdXBkYXRlRnJhbWVidWZmZXIoZnJhbWVidWZmZXIpO1xuXG4gICAgICByZXR1cm4gcmVnbEZyYW1lYnVmZmVyXG4gICAgfVxuXG4gICAgcmVnbEZyYW1lYnVmZmVyKGEwLCBhMSk7XG5cbiAgICByZXR1cm4gZXh0ZW5kKHJlZ2xGcmFtZWJ1ZmZlciwge1xuICAgICAgcmVzaXplOiByZXNpemUsXG4gICAgICBfcmVnbFR5cGU6ICdmcmFtZWJ1ZmZlcicsXG4gICAgICBfZnJhbWVidWZmZXI6IGZyYW1lYnVmZmVyLFxuICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBkZXN0cm95KGZyYW1lYnVmZmVyKTtcbiAgICAgICAgZGVjRkJPUmVmcyhmcmFtZWJ1ZmZlcik7XG4gICAgICB9LFxuICAgICAgdXNlOiBmdW5jdGlvbiAoYmxvY2spIHtcbiAgICAgICAgZnJhbWVidWZmZXJTdGF0ZS5zZXRGQk8oe1xuICAgICAgICAgIGZyYW1lYnVmZmVyOiByZWdsRnJhbWVidWZmZXJcbiAgICAgICAgfSwgYmxvY2spO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVDdWJlRkJPIChvcHRpb25zKSB7XG4gICAgdmFyIGZhY2VzID0gQXJyYXkoNik7XG5cbiAgICBmdW5jdGlvbiByZWdsRnJhbWVidWZmZXJDdWJlIChhKSB7XG4gICAgICB2YXIgaTtcblxuICAgICAgY2hlY2skMShmYWNlcy5pbmRleE9mKGZyYW1lYnVmZmVyU3RhdGUubmV4dCkgPCAwLFxuICAgICAgICAnY2FuIG5vdCB1cGRhdGUgZnJhbWVidWZmZXIgd2hpY2ggaXMgY3VycmVudGx5IGluIHVzZScpO1xuXG4gICAgICB2YXIgZXh0RHJhd0J1ZmZlcnMgPSBleHRlbnNpb25zLndlYmdsX2RyYXdfYnVmZmVycztcblxuICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgY29sb3I6IG51bGxcbiAgICAgIH07XG5cbiAgICAgIHZhciByYWRpdXMgPSAwO1xuXG4gICAgICB2YXIgY29sb3JCdWZmZXIgPSBudWxsO1xuICAgICAgdmFyIGNvbG9yRm9ybWF0ID0gJ3JnYmEnO1xuICAgICAgdmFyIGNvbG9yVHlwZSA9ICd1aW50OCc7XG4gICAgICB2YXIgY29sb3JDb3VudCA9IDE7XG5cbiAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcmFkaXVzID0gYSB8IDA7XG4gICAgICB9IGVsc2UgaWYgKCFhKSB7XG4gICAgICAgIHJhZGl1cyA9IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGVjayQxLnR5cGUoYSwgJ29iamVjdCcsICdpbnZhbGlkIGFyZ3VtZW50cyBmb3IgZnJhbWVidWZmZXInKTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBhO1xuXG4gICAgICAgIGlmICgnc2hhcGUnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICB2YXIgc2hhcGUgPSBvcHRpb25zLnNoYXBlO1xuICAgICAgICAgIGNoZWNrJDEoXG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KHNoYXBlKSAmJiBzaGFwZS5sZW5ndGggPj0gMixcbiAgICAgICAgICAgICdpbnZhbGlkIHNoYXBlIGZvciBmcmFtZWJ1ZmZlcicpO1xuICAgICAgICAgIGNoZWNrJDEoXG4gICAgICAgICAgICBzaGFwZVswXSA9PT0gc2hhcGVbMV0sXG4gICAgICAgICAgICAnY3ViZSBmcmFtZWJ1ZmZlciBtdXN0IGJlIHNxdWFyZScpO1xuICAgICAgICAgIHJhZGl1cyA9IHNoYXBlWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICgncmFkaXVzJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICByYWRpdXMgPSBvcHRpb25zLnJhZGl1cyB8IDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgnd2lkdGgnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHJhZGl1cyA9IG9wdGlvbnMud2lkdGggfCAwO1xuICAgICAgICAgICAgaWYgKCdoZWlnaHQnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgY2hlY2skMShvcHRpb25zLmhlaWdodCA9PT0gcmFkaXVzLCAnbXVzdCBiZSBzcXVhcmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKCdoZWlnaHQnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHJhZGl1cyA9IG9wdGlvbnMuaGVpZ2h0IHwgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbG9yJyBpbiBvcHRpb25zIHx8XG4gICAgICAgICAgICAnY29sb3JzJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgY29sb3JCdWZmZXIgPVxuICAgICAgICAgICAgb3B0aW9ucy5jb2xvciB8fFxuICAgICAgICAgICAgb3B0aW9ucy5jb2xvcnM7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY29sb3JCdWZmZXIpKSB7XG4gICAgICAgICAgICBjaGVjayQxKFxuICAgICAgICAgICAgICBjb2xvckJ1ZmZlci5sZW5ndGggPT09IDEgfHwgZXh0RHJhd0J1ZmZlcnMsXG4gICAgICAgICAgICAgICdtdWx0aXBsZSByZW5kZXIgdGFyZ2V0cyBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjb2xvckJ1ZmZlcikge1xuICAgICAgICAgIGlmICgnY29sb3JDb3VudCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgY29sb3JDb3VudCA9IG9wdGlvbnMuY29sb3JDb3VudCB8IDA7XG4gICAgICAgICAgICBjaGVjayQxKGNvbG9yQ291bnQgPiAwLCAnaW52YWxpZCBjb2xvciBidWZmZXIgY291bnQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoJ2NvbG9yVHlwZScgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgY2hlY2skMS5vbmVPZihcbiAgICAgICAgICAgICAgb3B0aW9ucy5jb2xvclR5cGUsIGNvbG9yVHlwZXMsXG4gICAgICAgICAgICAgICdpbnZhbGlkIGNvbG9yIHR5cGUnKTtcbiAgICAgICAgICAgIGNvbG9yVHlwZSA9IG9wdGlvbnMuY29sb3JUeXBlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICgnY29sb3JGb3JtYXQnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbG9yRm9ybWF0ID0gb3B0aW9ucy5jb2xvckZvcm1hdDtcbiAgICAgICAgICAgIGNoZWNrJDEub25lT2YoXG4gICAgICAgICAgICAgIG9wdGlvbnMuY29sb3JGb3JtYXQsIGNvbG9yVGV4dHVyZUZvcm1hdHMsXG4gICAgICAgICAgICAgICdpbnZhbGlkIGNvbG9yIGZvcm1hdCBmb3IgdGV4dHVyZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnZGVwdGgnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICBwYXJhbXMuZGVwdGggPSBvcHRpb25zLmRlcHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdzdGVuY2lsJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgcGFyYW1zLnN0ZW5jaWwgPSBvcHRpb25zLnN0ZW5jaWw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2RlcHRoU3RlbmNpbCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgIHBhcmFtcy5kZXB0aFN0ZW5jaWwgPSBvcHRpb25zLmRlcHRoU3RlbmNpbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgY29sb3JDdWJlcztcbiAgICAgIGlmIChjb2xvckJ1ZmZlcikge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjb2xvckJ1ZmZlcikpIHtcbiAgICAgICAgICBjb2xvckN1YmVzID0gW107XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvbG9yQnVmZmVyLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb2xvckN1YmVzW2ldID0gY29sb3JCdWZmZXJbaV07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbG9yQ3ViZXMgPSBbIGNvbG9yQnVmZmVyIF07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbG9yQ3ViZXMgPSBBcnJheShjb2xvckNvdW50KTtcbiAgICAgICAgdmFyIGN1YmVNYXBQYXJhbXMgPSB7XG4gICAgICAgICAgcmFkaXVzOiByYWRpdXMsXG4gICAgICAgICAgZm9ybWF0OiBjb2xvckZvcm1hdCxcbiAgICAgICAgICB0eXBlOiBjb2xvclR5cGVcbiAgICAgICAgfTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvbG9yQ291bnQ7ICsraSkge1xuICAgICAgICAgIGNvbG9yQ3ViZXNbaV0gPSB0ZXh0dXJlU3RhdGUuY3JlYXRlQ3ViZShjdWJlTWFwUGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBjb2xvciBjdWJlc1xuICAgICAgcGFyYW1zLmNvbG9yID0gQXJyYXkoY29sb3JDdWJlcy5sZW5ndGgpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGNvbG9yQ3ViZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGN1YmUgPSBjb2xvckN1YmVzW2ldO1xuICAgICAgICBjaGVjayQxKFxuICAgICAgICAgIHR5cGVvZiBjdWJlID09PSAnZnVuY3Rpb24nICYmIGN1YmUuX3JlZ2xUeXBlID09PSAndGV4dHVyZUN1YmUnLFxuICAgICAgICAgICdpbnZhbGlkIGN1YmUgbWFwJyk7XG4gICAgICAgIHJhZGl1cyA9IHJhZGl1cyB8fCBjdWJlLndpZHRoO1xuICAgICAgICBjaGVjayQxKFxuICAgICAgICAgIGN1YmUud2lkdGggPT09IHJhZGl1cyAmJiBjdWJlLmhlaWdodCA9PT0gcmFkaXVzLFxuICAgICAgICAgICdpbnZhbGlkIGN1YmUgbWFwIHNoYXBlJyk7XG4gICAgICAgIHBhcmFtcy5jb2xvcltpXSA9IHtcbiAgICAgICAgICB0YXJnZXQ6IEdMX1RFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCQyLFxuICAgICAgICAgIGRhdGE6IGNvbG9yQ3ViZXNbaV1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gMDsgaSA8IDY7ICsraSkge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbG9yQ3ViZXMubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICBwYXJhbXMuY29sb3Jbal0udGFyZ2V0ID0gR0xfVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YJDIgKyBpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJldXNlIGRlcHRoLXN0ZW5jaWwgYXR0YWNobWVudHMgYWNyb3NzIGFsbCBjdWJlIG1hcHNcbiAgICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgcGFyYW1zLmRlcHRoID0gZmFjZXNbMF0uZGVwdGg7XG4gICAgICAgICAgcGFyYW1zLnN0ZW5jaWwgPSBmYWNlc1swXS5zdGVuY2lsO1xuICAgICAgICAgIHBhcmFtcy5kZXB0aFN0ZW5jaWwgPSBmYWNlc1swXS5kZXB0aFN0ZW5jaWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZhY2VzW2ldKSB7XG4gICAgICAgICAgKGZhY2VzW2ldKShwYXJhbXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZhY2VzW2ldID0gY3JlYXRlRkJPKHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGV4dGVuZChyZWdsRnJhbWVidWZmZXJDdWJlLCB7XG4gICAgICAgIHdpZHRoOiByYWRpdXMsXG4gICAgICAgIGhlaWdodDogcmFkaXVzLFxuICAgICAgICBjb2xvcjogY29sb3JDdWJlc1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNpemUgKHJhZGl1c18pIHtcbiAgICAgIHZhciBpO1xuICAgICAgdmFyIHJhZGl1cyA9IHJhZGl1c18gfCAwO1xuICAgICAgY2hlY2skMShyYWRpdXMgPiAwICYmIHJhZGl1cyA8PSBsaW1pdHMubWF4Q3ViZU1hcFNpemUsXG4gICAgICAgICdpbnZhbGlkIHJhZGl1cyBmb3IgY3ViZSBmYm8nKTtcblxuICAgICAgaWYgKHJhZGl1cyA9PT0gcmVnbEZyYW1lYnVmZmVyQ3ViZS53aWR0aCkge1xuICAgICAgICByZXR1cm4gcmVnbEZyYW1lYnVmZmVyQ3ViZVxuICAgICAgfVxuXG4gICAgICB2YXIgY29sb3JzID0gcmVnbEZyYW1lYnVmZmVyQ3ViZS5jb2xvcjtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjb2xvcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29sb3JzW2ldLnJlc2l6ZShyYWRpdXMpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgNjsgKytpKSB7XG4gICAgICAgIGZhY2VzW2ldLnJlc2l6ZShyYWRpdXMpO1xuICAgICAgfVxuXG4gICAgICByZWdsRnJhbWVidWZmZXJDdWJlLndpZHRoID0gcmVnbEZyYW1lYnVmZmVyQ3ViZS5oZWlnaHQgPSByYWRpdXM7XG5cbiAgICAgIHJldHVybiByZWdsRnJhbWVidWZmZXJDdWJlXG4gICAgfVxuXG4gICAgcmVnbEZyYW1lYnVmZmVyQ3ViZShvcHRpb25zKTtcblxuICAgIHJldHVybiBleHRlbmQocmVnbEZyYW1lYnVmZmVyQ3ViZSwge1xuICAgICAgZmFjZXM6IGZhY2VzLFxuICAgICAgcmVzaXplOiByZXNpemUsXG4gICAgICBfcmVnbFR5cGU6ICdmcmFtZWJ1ZmZlckN1YmUnLFxuICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBmYWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XG4gICAgICAgICAgZi5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZXN0b3JlRnJhbWVidWZmZXJzICgpIHtcbiAgICB2YWx1ZXMoZnJhbWVidWZmZXJTZXQpLmZvckVhY2goZnVuY3Rpb24gKGZiKSB7XG4gICAgICBmYi5mcmFtZWJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XG4gICAgICB1cGRhdGVGcmFtZWJ1ZmZlcihmYik7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZXh0ZW5kKGZyYW1lYnVmZmVyU3RhdGUsIHtcbiAgICBnZXRGcmFtZWJ1ZmZlcjogZnVuY3Rpb24gKG9iamVjdCkge1xuICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdmdW5jdGlvbicgJiYgb2JqZWN0Ll9yZWdsVHlwZSA9PT0gJ2ZyYW1lYnVmZmVyJykge1xuICAgICAgICB2YXIgZmJvID0gb2JqZWN0Ll9mcmFtZWJ1ZmZlcjtcbiAgICAgICAgaWYgKGZibyBpbnN0YW5jZW9mIFJFR0xGcmFtZWJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBmYm9cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9LFxuICAgIGNyZWF0ZTogY3JlYXRlRkJPLFxuICAgIGNyZWF0ZUN1YmU6IGNyZWF0ZUN1YmVGQk8sXG4gICAgY2xlYXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhbHVlcyhmcmFtZWJ1ZmZlclNldCkuZm9yRWFjaChkZXN0cm95KTtcbiAgICB9LFxuICAgIHJlc3RvcmU6IHJlc3RvcmVGcmFtZWJ1ZmZlcnNcbiAgfSlcbn1cblxudmFyIEdMX0ZMT0FUJDYgPSA1MTI2O1xuXG5mdW5jdGlvbiBBdHRyaWJ1dGVSZWNvcmQgKCkge1xuICB0aGlzLnN0YXRlID0gMDtcblxuICB0aGlzLnggPSAwLjA7XG4gIHRoaXMueSA9IDAuMDtcbiAgdGhpcy56ID0gMC4wO1xuICB0aGlzLncgPSAwLjA7XG5cbiAgdGhpcy5idWZmZXIgPSBudWxsO1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLm5vcm1hbGl6ZWQgPSBmYWxzZTtcbiAgdGhpcy50eXBlID0gR0xfRkxPQVQkNjtcbiAgdGhpcy5vZmZzZXQgPSAwO1xuICB0aGlzLnN0cmlkZSA9IDA7XG4gIHRoaXMuZGl2aXNvciA9IDA7XG59XG5cbmZ1bmN0aW9uIHdyYXBBdHRyaWJ1dGVTdGF0ZSAoXG4gIGdsLFxuICBleHRlbnNpb25zLFxuICBsaW1pdHMsXG4gIHN0cmluZ1N0b3JlKSB7XG4gIHZhciBOVU1fQVRUUklCVVRFUyA9IGxpbWl0cy5tYXhBdHRyaWJ1dGVzO1xuICB2YXIgYXR0cmlidXRlQmluZGluZ3MgPSBuZXcgQXJyYXkoTlVNX0FUVFJJQlVURVMpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IE5VTV9BVFRSSUJVVEVTOyArK2kpIHtcbiAgICBhdHRyaWJ1dGVCaW5kaW5nc1tpXSA9IG5ldyBBdHRyaWJ1dGVSZWNvcmQoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgUmVjb3JkOiBBdHRyaWJ1dGVSZWNvcmQsXG4gICAgc2NvcGU6IHt9LFxuICAgIHN0YXRlOiBhdHRyaWJ1dGVCaW5kaW5nc1xuICB9XG59XG5cbnZhciBHTF9GUkFHTUVOVF9TSEFERVIgPSAzNTYzMjtcbnZhciBHTF9WRVJURVhfU0hBREVSID0gMzU2MzM7XG5cbnZhciBHTF9BQ1RJVkVfVU5JRk9STVMgPSAweDhCODY7XG52YXIgR0xfQUNUSVZFX0FUVFJJQlVURVMgPSAweDhCODk7XG5cbmZ1bmN0aW9uIHdyYXBTaGFkZXJTdGF0ZSAoZ2wsIHN0cmluZ1N0b3JlLCBzdGF0cywgY29uZmlnKSB7XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBnbHNsIGNvbXBpbGF0aW9uIGFuZCBsaW5raW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICB2YXIgZnJhZ1NoYWRlcnMgPSB7fTtcbiAgdmFyIHZlcnRTaGFkZXJzID0ge307XG5cbiAgZnVuY3Rpb24gQWN0aXZlSW5mbyAobmFtZSwgaWQsIGxvY2F0aW9uLCBpbmZvKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5sb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgIHRoaXMuaW5mbyA9IGluZm87XG4gIH1cblxuICBmdW5jdGlvbiBpbnNlcnRBY3RpdmVJbmZvIChsaXN0LCBpbmZvKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAobGlzdFtpXS5pZCA9PT0gaW5mby5pZCkge1xuICAgICAgICBsaXN0W2ldLmxvY2F0aW9uID0gaW5mby5sb2NhdGlvbjtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuICAgIGxpc3QucHVzaChpbmZvKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNoYWRlciAodHlwZSwgaWQsIGNvbW1hbmQpIHtcbiAgICB2YXIgY2FjaGUgPSB0eXBlID09PSBHTF9GUkFHTUVOVF9TSEFERVIgPyBmcmFnU2hhZGVycyA6IHZlcnRTaGFkZXJzO1xuICAgIHZhciBzaGFkZXIgPSBjYWNoZVtpZF07XG5cbiAgICBpZiAoIXNoYWRlcikge1xuICAgICAgdmFyIHNvdXJjZSA9IHN0cmluZ1N0b3JlLnN0cihpZCk7XG4gICAgICBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodHlwZSk7XG4gICAgICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzb3VyY2UpO1xuICAgICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xuICAgICAgY2hlY2skMS5zaGFkZXJFcnJvcihnbCwgc2hhZGVyLCBzb3VyY2UsIHR5cGUsIGNvbW1hbmQpO1xuICAgICAgY2FjaGVbaWRdID0gc2hhZGVyO1xuICAgIH1cblxuICAgIHJldHVybiBzaGFkZXJcbiAgfVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBwcm9ncmFtIGxpbmtpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIHZhciBwcm9ncmFtQ2FjaGUgPSB7fTtcbiAgdmFyIHByb2dyYW1MaXN0ID0gW107XG5cbiAgdmFyIFBST0dSQU1fQ09VTlRFUiA9IDA7XG5cbiAgZnVuY3Rpb24gUkVHTFByb2dyYW0gKGZyYWdJZCwgdmVydElkKSB7XG4gICAgdGhpcy5pZCA9IFBST0dSQU1fQ09VTlRFUisrO1xuICAgIHRoaXMuZnJhZ0lkID0gZnJhZ0lkO1xuICAgIHRoaXMudmVydElkID0gdmVydElkO1xuICAgIHRoaXMucHJvZ3JhbSA9IG51bGw7XG4gICAgdGhpcy51bmlmb3JtcyA9IFtdO1xuICAgIHRoaXMuYXR0cmlidXRlcyA9IFtdO1xuXG4gICAgaWYgKGNvbmZpZy5wcm9maWxlKSB7XG4gICAgICB0aGlzLnN0YXRzID0ge1xuICAgICAgICB1bmlmb3Jtc0NvdW50OiAwLFxuICAgICAgICBhdHRyaWJ1dGVzQ291bnQ6IDBcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbGlua1Byb2dyYW0gKGRlc2MsIGNvbW1hbmQpIHtcbiAgICB2YXIgaSwgaW5mbztcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBjb21waWxlICYgbGlua1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICB2YXIgZnJhZ1NoYWRlciA9IGdldFNoYWRlcihHTF9GUkFHTUVOVF9TSEFERVIsIGRlc2MuZnJhZ0lkKTtcbiAgICB2YXIgdmVydFNoYWRlciA9IGdldFNoYWRlcihHTF9WRVJURVhfU0hBREVSLCBkZXNjLnZlcnRJZCk7XG5cbiAgICB2YXIgcHJvZ3JhbSA9IGRlc2MucHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcbiAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ1NoYWRlcik7XG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRTaGFkZXIpO1xuICAgIGdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xuICAgIGNoZWNrJDEubGlua0Vycm9yKFxuICAgICAgZ2wsXG4gICAgICBwcm9ncmFtLFxuICAgICAgc3RyaW5nU3RvcmUuc3RyKGRlc2MuZnJhZ0lkKSxcbiAgICAgIHN0cmluZ1N0b3JlLnN0cihkZXNjLnZlcnRJZCksXG4gICAgICBjb21tYW5kKTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBncmFiIHVuaWZvcm1zXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHZhciBudW1Vbmlmb3JtcyA9IGdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgR0xfQUNUSVZFX1VOSUZPUk1TKTtcbiAgICBpZiAoY29uZmlnLnByb2ZpbGUpIHtcbiAgICAgIGRlc2Muc3RhdHMudW5pZm9ybXNDb3VudCA9IG51bVVuaWZvcm1zO1xuICAgIH1cbiAgICB2YXIgdW5pZm9ybXMgPSBkZXNjLnVuaWZvcm1zO1xuICAgIGZvciAoaSA9IDA7IGkgPCBudW1Vbmlmb3JtczsgKytpKSB7XG4gICAgICBpbmZvID0gZ2wuZ2V0QWN0aXZlVW5pZm9ybShwcm9ncmFtLCBpKTtcbiAgICAgIGlmIChpbmZvKSB7XG4gICAgICAgIGlmIChpbmZvLnNpemUgPiAxKSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpbmZvLnNpemU7ICsraikge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBpbmZvLm5hbWUucmVwbGFjZSgnWzBdJywgJ1snICsgaiArICddJyk7XG4gICAgICAgICAgICBpbnNlcnRBY3RpdmVJbmZvKHVuaWZvcm1zLCBuZXcgQWN0aXZlSW5mbyhcbiAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgc3RyaW5nU3RvcmUuaWQobmFtZSksXG4gICAgICAgICAgICAgIGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCBuYW1lKSxcbiAgICAgICAgICAgICAgaW5mbykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbnNlcnRBY3RpdmVJbmZvKHVuaWZvcm1zLCBuZXcgQWN0aXZlSW5mbyhcbiAgICAgICAgICAgIGluZm8ubmFtZSxcbiAgICAgICAgICAgIHN0cmluZ1N0b3JlLmlkKGluZm8ubmFtZSksXG4gICAgICAgICAgICBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbSwgaW5mby5uYW1lKSxcbiAgICAgICAgICAgIGluZm8pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBncmFiIGF0dHJpYnV0ZXNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgdmFyIG51bUF0dHJpYnV0ZXMgPSBnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIEdMX0FDVElWRV9BVFRSSUJVVEVTKTtcbiAgICBpZiAoY29uZmlnLnByb2ZpbGUpIHtcbiAgICAgIGRlc2Muc3RhdHMuYXR0cmlidXRlc0NvdW50ID0gbnVtQXR0cmlidXRlcztcbiAgICB9XG5cbiAgICB2YXIgYXR0cmlidXRlcyA9IGRlc2MuYXR0cmlidXRlcztcbiAgICBmb3IgKGkgPSAwOyBpIDwgbnVtQXR0cmlidXRlczsgKytpKSB7XG4gICAgICBpbmZvID0gZ2wuZ2V0QWN0aXZlQXR0cmliKHByb2dyYW0sIGkpO1xuICAgICAgaWYgKGluZm8pIHtcbiAgICAgICAgaW5zZXJ0QWN0aXZlSW5mbyhhdHRyaWJ1dGVzLCBuZXcgQWN0aXZlSW5mbyhcbiAgICAgICAgICBpbmZvLm5hbWUsXG4gICAgICAgICAgc3RyaW5nU3RvcmUuaWQoaW5mby5uYW1lKSxcbiAgICAgICAgICBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCBpbmZvLm5hbWUpLFxuICAgICAgICAgIGluZm8pKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoY29uZmlnLnByb2ZpbGUpIHtcbiAgICBzdGF0cy5nZXRNYXhVbmlmb3Jtc0NvdW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG0gPSAwO1xuICAgICAgcHJvZ3JhbUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoZGVzYykge1xuICAgICAgICBpZiAoZGVzYy5zdGF0cy51bmlmb3Jtc0NvdW50ID4gbSkge1xuICAgICAgICAgIG0gPSBkZXNjLnN0YXRzLnVuaWZvcm1zQ291bnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG1cbiAgICB9O1xuXG4gICAgc3RhdHMuZ2V0TWF4QXR0cmlidXRlc0NvdW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG0gPSAwO1xuICAgICAgcHJvZ3JhbUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoZGVzYykge1xuICAgICAgICBpZiAoZGVzYy5zdGF0cy5hdHRyaWJ1dGVzQ291bnQgPiBtKSB7XG4gICAgICAgICAgbSA9IGRlc2Muc3RhdHMuYXR0cmlidXRlc0NvdW50O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBtXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc3RvcmVTaGFkZXJzICgpIHtcbiAgICBmcmFnU2hhZGVycyA9IHt9O1xuICAgIHZlcnRTaGFkZXJzID0ge307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9ncmFtTGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgbGlua1Byb2dyYW0ocHJvZ3JhbUxpc3RbaV0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2xlYXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBkZWxldGVTaGFkZXIgPSBnbC5kZWxldGVTaGFkZXIuYmluZChnbCk7XG4gICAgICB2YWx1ZXMoZnJhZ1NoYWRlcnMpLmZvckVhY2goZGVsZXRlU2hhZGVyKTtcbiAgICAgIGZyYWdTaGFkZXJzID0ge307XG4gICAgICB2YWx1ZXModmVydFNoYWRlcnMpLmZvckVhY2goZGVsZXRlU2hhZGVyKTtcbiAgICAgIHZlcnRTaGFkZXJzID0ge307XG5cbiAgICAgIHByb2dyYW1MaXN0LmZvckVhY2goZnVuY3Rpb24gKGRlc2MpIHtcbiAgICAgICAgZ2wuZGVsZXRlUHJvZ3JhbShkZXNjLnByb2dyYW0pO1xuICAgICAgfSk7XG4gICAgICBwcm9ncmFtTGlzdC5sZW5ndGggPSAwO1xuICAgICAgcHJvZ3JhbUNhY2hlID0ge307XG5cbiAgICAgIHN0YXRzLnNoYWRlckNvdW50ID0gMDtcbiAgICB9LFxuXG4gICAgcHJvZ3JhbTogZnVuY3Rpb24gKHZlcnRJZCwgZnJhZ0lkLCBjb21tYW5kKSB7XG4gICAgICBjaGVjayQxLmNvbW1hbmQodmVydElkID49IDAsICdtaXNzaW5nIHZlcnRleCBzaGFkZXInLCBjb21tYW5kKTtcbiAgICAgIGNoZWNrJDEuY29tbWFuZChmcmFnSWQgPj0gMCwgJ21pc3NpbmcgZnJhZ21lbnQgc2hhZGVyJywgY29tbWFuZCk7XG5cbiAgICAgIHZhciBjYWNoZSA9IHByb2dyYW1DYWNoZVtmcmFnSWRdO1xuICAgICAgaWYgKCFjYWNoZSkge1xuICAgICAgICBjYWNoZSA9IHByb2dyYW1DYWNoZVtmcmFnSWRdID0ge307XG4gICAgICB9XG4gICAgICB2YXIgcHJvZ3JhbSA9IGNhY2hlW3ZlcnRJZF07XG4gICAgICBpZiAoIXByb2dyYW0pIHtcbiAgICAgICAgcHJvZ3JhbSA9IG5ldyBSRUdMUHJvZ3JhbShmcmFnSWQsIHZlcnRJZCk7XG4gICAgICAgIHN0YXRzLnNoYWRlckNvdW50Kys7XG5cbiAgICAgICAgbGlua1Byb2dyYW0ocHJvZ3JhbSwgY29tbWFuZCk7XG4gICAgICAgIGNhY2hlW3ZlcnRJZF0gPSBwcm9ncmFtO1xuICAgICAgICBwcm9ncmFtTGlzdC5wdXNoKHByb2dyYW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb2dyYW1cbiAgICB9LFxuXG4gICAgcmVzdG9yZTogcmVzdG9yZVNoYWRlcnMsXG5cbiAgICBzaGFkZXI6IGdldFNoYWRlcixcblxuICAgIGZyYWc6IC0xLFxuICAgIHZlcnQ6IC0xXG4gIH1cbn1cblxudmFyIEdMX1JHQkEkMyA9IDY0MDg7XG52YXIgR0xfVU5TSUdORURfQllURSQ3ID0gNTEyMTtcbnZhciBHTF9QQUNLX0FMSUdOTUVOVCA9IDB4MEQwNTtcbnZhciBHTF9GTE9BVCQ3ID0gMHgxNDA2OyAvLyA1MTI2XG5cbmZ1bmN0aW9uIHdyYXBSZWFkUGl4ZWxzIChcbiAgZ2wsXG4gIGZyYW1lYnVmZmVyU3RhdGUsXG4gIHJlZ2xQb2xsLFxuICBjb250ZXh0LFxuICBnbEF0dHJpYnV0ZXMsXG4gIGV4dGVuc2lvbnMsXG4gIGxpbWl0cykge1xuICBmdW5jdGlvbiByZWFkUGl4ZWxzSW1wbCAoaW5wdXQpIHtcbiAgICB2YXIgdHlwZTtcbiAgICBpZiAoZnJhbWVidWZmZXJTdGF0ZS5uZXh0ID09PSBudWxsKSB7XG4gICAgICBjaGVjayQxKFxuICAgICAgICBnbEF0dHJpYnV0ZXMucHJlc2VydmVEcmF3aW5nQnVmZmVyLFxuICAgICAgICAneW91IG11c3QgY3JlYXRlIGEgd2ViZ2wgY29udGV4dCB3aXRoIFwicHJlc2VydmVEcmF3aW5nQnVmZmVyXCI6dHJ1ZSBpbiBvcmRlciB0byByZWFkIHBpeGVscyBmcm9tIHRoZSBkcmF3aW5nIGJ1ZmZlcicpO1xuICAgICAgdHlwZSA9IEdMX1VOU0lHTkVEX0JZVEUkNztcbiAgICB9IGVsc2Uge1xuICAgICAgY2hlY2skMShcbiAgICAgICAgZnJhbWVidWZmZXJTdGF0ZS5uZXh0LmNvbG9yQXR0YWNobWVudHNbMF0udGV4dHVyZSAhPT0gbnVsbCxcbiAgICAgICAgICAnWW91IGNhbm5vdCByZWFkIGZyb20gYSByZW5kZXJidWZmZXInKTtcbiAgICAgIHR5cGUgPSBmcmFtZWJ1ZmZlclN0YXRlLm5leHQuY29sb3JBdHRhY2htZW50c1swXS50ZXh0dXJlLl90ZXh0dXJlLnR5cGU7XG5cbiAgICAgIGlmIChleHRlbnNpb25zLm9lc190ZXh0dXJlX2Zsb2F0KSB7XG4gICAgICAgIGNoZWNrJDEoXG4gICAgICAgICAgdHlwZSA9PT0gR0xfVU5TSUdORURfQllURSQ3IHx8IHR5cGUgPT09IEdMX0ZMT0FUJDcsXG4gICAgICAgICAgJ1JlYWRpbmcgZnJvbSBhIGZyYW1lYnVmZmVyIGlzIG9ubHkgYWxsb3dlZCBmb3IgdGhlIHR5cGVzIFxcJ3VpbnQ4XFwnIGFuZCBcXCdmbG9hdFxcJycpO1xuXG4gICAgICAgIGlmICh0eXBlID09PSBHTF9GTE9BVCQ3KSB7XG4gICAgICAgICAgY2hlY2skMShsaW1pdHMucmVhZEZsb2F0LCAnUmVhZGluZyBcXCdmbG9hdFxcJyB2YWx1ZXMgaXMgbm90IHBlcm1pdHRlZCBpbiB5b3VyIGJyb3dzZXIuIEZvciBhIGZhbGxiYWNrLCBwbGVhc2Ugc2VlOiBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9nbHNsLXJlYWQtZmxvYXQnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hlY2skMShcbiAgICAgICAgICB0eXBlID09PSBHTF9VTlNJR05FRF9CWVRFJDcsXG4gICAgICAgICAgJ1JlYWRpbmcgZnJvbSBhIGZyYW1lYnVmZmVyIGlzIG9ubHkgYWxsb3dlZCBmb3IgdGhlIHR5cGUgXFwndWludDhcXCcnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgeCA9IDA7XG4gICAgdmFyIHkgPSAwO1xuICAgIHZhciB3aWR0aCA9IGNvbnRleHQuZnJhbWVidWZmZXJXaWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gY29udGV4dC5mcmFtZWJ1ZmZlckhlaWdodDtcbiAgICB2YXIgZGF0YSA9IG51bGw7XG5cbiAgICBpZiAoaXNUeXBlZEFycmF5KGlucHV0KSkge1xuICAgICAgZGF0YSA9IGlucHV0O1xuICAgIH0gZWxzZSBpZiAoaW5wdXQpIHtcbiAgICAgIGNoZWNrJDEudHlwZShpbnB1dCwgJ29iamVjdCcsICdpbnZhbGlkIGFyZ3VtZW50cyB0byByZWdsLnJlYWQoKScpO1xuICAgICAgeCA9IGlucHV0LnggfCAwO1xuICAgICAgeSA9IGlucHV0LnkgfCAwO1xuICAgICAgY2hlY2skMShcbiAgICAgICAgeCA+PSAwICYmIHggPCBjb250ZXh0LmZyYW1lYnVmZmVyV2lkdGgsXG4gICAgICAgICdpbnZhbGlkIHggb2Zmc2V0IGZvciByZWdsLnJlYWQnKTtcbiAgICAgIGNoZWNrJDEoXG4gICAgICAgIHkgPj0gMCAmJiB5IDwgY29udGV4dC5mcmFtZWJ1ZmZlckhlaWdodCxcbiAgICAgICAgJ2ludmFsaWQgeSBvZmZzZXQgZm9yIHJlZ2wucmVhZCcpO1xuICAgICAgd2lkdGggPSAoaW5wdXQud2lkdGggfHwgKGNvbnRleHQuZnJhbWVidWZmZXJXaWR0aCAtIHgpKSB8IDA7XG4gICAgICBoZWlnaHQgPSAoaW5wdXQuaGVpZ2h0IHx8IChjb250ZXh0LmZyYW1lYnVmZmVySGVpZ2h0IC0geSkpIHwgMDtcbiAgICAgIGRhdGEgPSBpbnB1dC5kYXRhIHx8IG51bGw7XG4gICAgfVxuXG4gICAgLy8gc2FuaXR5IGNoZWNrIGlucHV0LmRhdGFcbiAgICBpZiAoZGF0YSkge1xuICAgICAgaWYgKHR5cGUgPT09IEdMX1VOU0lHTkVEX0JZVEUkNykge1xuICAgICAgICBjaGVjayQxKFxuICAgICAgICAgIGRhdGEgaW5zdGFuY2VvZiBVaW50OEFycmF5LFxuICAgICAgICAgICdidWZmZXIgbXVzdCBiZSBcXCdVaW50OEFycmF5XFwnIHdoZW4gcmVhZGluZyBmcm9tIGEgZnJhbWVidWZmZXIgb2YgdHlwZSBcXCd1aW50OFxcJycpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBHTF9GTE9BVCQ3KSB7XG4gICAgICAgIGNoZWNrJDEoXG4gICAgICAgICAgZGF0YSBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSxcbiAgICAgICAgICAnYnVmZmVyIG11c3QgYmUgXFwnRmxvYXQzMkFycmF5XFwnIHdoZW4gcmVhZGluZyBmcm9tIGEgZnJhbWVidWZmZXIgb2YgdHlwZSBcXCdmbG9hdFxcJycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrJDEoXG4gICAgICB3aWR0aCA+IDAgJiYgd2lkdGggKyB4IDw9IGNvbnRleHQuZnJhbWVidWZmZXJXaWR0aCxcbiAgICAgICdpbnZhbGlkIHdpZHRoIGZvciByZWFkIHBpeGVscycpO1xuICAgIGNoZWNrJDEoXG4gICAgICBoZWlnaHQgPiAwICYmIGhlaWdodCArIHkgPD0gY29udGV4dC5mcmFtZWJ1ZmZlckhlaWdodCxcbiAgICAgICdpbnZhbGlkIGhlaWdodCBmb3IgcmVhZCBwaXhlbHMnKTtcblxuICAgIC8vIFVwZGF0ZSBXZWJHTCBzdGF0ZVxuICAgIHJlZ2xQb2xsKCk7XG5cbiAgICAvLyBDb21wdXRlIHNpemVcbiAgICB2YXIgc2l6ZSA9IHdpZHRoICogaGVpZ2h0ICogNDtcblxuICAgIC8vIEFsbG9jYXRlIGRhdGFcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIGlmICh0eXBlID09PSBHTF9VTlNJR05FRF9CWVRFJDcpIHtcbiAgICAgICAgZGF0YSA9IG5ldyBVaW50OEFycmF5KHNpemUpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBHTF9GTE9BVCQ3KSB7XG4gICAgICAgIGRhdGEgPSBkYXRhIHx8IG5ldyBGbG9hdDMyQXJyYXkoc2l6ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVHlwZSBjaGVja1xuICAgIGNoZWNrJDEuaXNUeXBlZEFycmF5KGRhdGEsICdkYXRhIGJ1ZmZlciBmb3IgcmVnbC5yZWFkKCkgbXVzdCBiZSBhIHR5cGVkYXJyYXknKTtcbiAgICBjaGVjayQxKGRhdGEuYnl0ZUxlbmd0aCA+PSBzaXplLCAnZGF0YSBidWZmZXIgZm9yIHJlZ2wucmVhZCgpIHRvbyBzbWFsbCcpO1xuXG4gICAgLy8gUnVuIHJlYWQgcGl4ZWxzXG4gICAgZ2wucGl4ZWxTdG9yZWkoR0xfUEFDS19BTElHTk1FTlQsIDQpO1xuICAgIGdsLnJlYWRQaXhlbHMoeCwgeSwgd2lkdGgsIGhlaWdodCwgR0xfUkdCQSQzLFxuICAgICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICAgIGRhdGEpO1xuXG4gICAgcmV0dXJuIGRhdGFcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRQaXhlbHNGQk8gKG9wdGlvbnMpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIGZyYW1lYnVmZmVyU3RhdGUuc2V0RkJPKHtcbiAgICAgIGZyYW1lYnVmZmVyOiBvcHRpb25zLmZyYW1lYnVmZmVyXG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgcmVzdWx0ID0gcmVhZFBpeGVsc0ltcGwob3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZFBpeGVscyAob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucyB8fCAhKCdmcmFtZWJ1ZmZlcicgaW4gb3B0aW9ucykpIHtcbiAgICAgIHJldHVybiByZWFkUGl4ZWxzSW1wbChvcHRpb25zKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVhZFBpeGVsc0ZCTyhvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZWFkUGl4ZWxzXG59XG5cbmZ1bmN0aW9uIHNsaWNlICh4KSB7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh4KVxufVxuXG5mdW5jdGlvbiBqb2luICh4KSB7XG4gIHJldHVybiBzbGljZSh4KS5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVFbnZpcm9ubWVudCAoKSB7XG4gIC8vIFVuaXF1ZSB2YXJpYWJsZSBpZCBjb3VudGVyXG4gIHZhciB2YXJDb3VudGVyID0gMDtcblxuICAvLyBMaW5rZWQgdmFsdWVzIGFyZSBwYXNzZWQgZnJvbSB0aGlzIHNjb3BlIGludG8gdGhlIGdlbmVyYXRlZCBjb2RlIGJsb2NrXG4gIC8vIENhbGxpbmcgbGluaygpIHBhc3NlcyBhIHZhbHVlIGludG8gdGhlIGdlbmVyYXRlZCBzY29wZSBhbmQgcmV0dXJuc1xuICAvLyB0aGUgdmFyaWFibGUgbmFtZSB3aGljaCBpdCBpcyBib3VuZCB0b1xuICB2YXIgbGlua2VkTmFtZXMgPSBbXTtcbiAgdmFyIGxpbmtlZFZhbHVlcyA9IFtdO1xuICBmdW5jdGlvbiBsaW5rICh2YWx1ZSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlua2VkVmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAobGlua2VkVmFsdWVzW2ldID09PSB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gbGlua2VkTmFtZXNbaV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbmFtZSA9ICdnJyArICh2YXJDb3VudGVyKyspO1xuICAgIGxpbmtlZE5hbWVzLnB1c2gobmFtZSk7XG4gICAgbGlua2VkVmFsdWVzLnB1c2godmFsdWUpO1xuICAgIHJldHVybiBuYW1lXG4gIH1cblxuICAvLyBjcmVhdGUgYSBjb2RlIGJsb2NrXG4gIGZ1bmN0aW9uIGJsb2NrICgpIHtcbiAgICB2YXIgY29kZSA9IFtdO1xuICAgIGZ1bmN0aW9uIHB1c2ggKCkge1xuICAgICAgY29kZS5wdXNoLmFwcGx5KGNvZGUsIHNsaWNlKGFyZ3VtZW50cykpO1xuICAgIH1cblxuICAgIHZhciB2YXJzID0gW107XG4gICAgZnVuY3Rpb24gZGVmICgpIHtcbiAgICAgIHZhciBuYW1lID0gJ3YnICsgKHZhckNvdW50ZXIrKyk7XG4gICAgICB2YXJzLnB1c2gobmFtZSk7XG5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb2RlLnB1c2gobmFtZSwgJz0nKTtcbiAgICAgICAgY29kZS5wdXNoLmFwcGx5KGNvZGUsIHNsaWNlKGFyZ3VtZW50cykpO1xuICAgICAgICBjb2RlLnB1c2goJzsnKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5hbWVcbiAgICB9XG5cbiAgICByZXR1cm4gZXh0ZW5kKHB1c2gsIHtcbiAgICAgIGRlZjogZGVmLFxuICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGpvaW4oW1xuICAgICAgICAgICh2YXJzLmxlbmd0aCA+IDAgPyAndmFyICcgKyB2YXJzICsgJzsnIDogJycpLFxuICAgICAgICAgIGpvaW4oY29kZSlcbiAgICAgICAgXSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gc2NvcGUgKCkge1xuICAgIHZhciBlbnRyeSA9IGJsb2NrKCk7XG4gICAgdmFyIGV4aXQgPSBibG9jaygpO1xuXG4gICAgdmFyIGVudHJ5VG9TdHJpbmcgPSBlbnRyeS50b1N0cmluZztcbiAgICB2YXIgZXhpdFRvU3RyaW5nID0gZXhpdC50b1N0cmluZztcblxuICAgIGZ1bmN0aW9uIHNhdmUgKG9iamVjdCwgcHJvcCkge1xuICAgICAgZXhpdChvYmplY3QsIHByb3AsICc9JywgZW50cnkuZGVmKG9iamVjdCwgcHJvcCksICc7Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGV4dGVuZChmdW5jdGlvbiAoKSB7XG4gICAgICBlbnRyeS5hcHBseShlbnRyeSwgc2xpY2UoYXJndW1lbnRzKSk7XG4gICAgfSwge1xuICAgICAgZGVmOiBlbnRyeS5kZWYsXG4gICAgICBlbnRyeTogZW50cnksXG4gICAgICBleGl0OiBleGl0LFxuICAgICAgc2F2ZTogc2F2ZSxcbiAgICAgIHNldDogZnVuY3Rpb24gKG9iamVjdCwgcHJvcCwgdmFsdWUpIHtcbiAgICAgICAgc2F2ZShvYmplY3QsIHByb3ApO1xuICAgICAgICBlbnRyeShvYmplY3QsIHByb3AsICc9JywgdmFsdWUsICc7Jyk7XG4gICAgICB9LFxuICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGVudHJ5VG9TdHJpbmcoKSArIGV4aXRUb1N0cmluZygpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbmRpdGlvbmFsICgpIHtcbiAgICB2YXIgcHJlZCA9IGpvaW4oYXJndW1lbnRzKTtcbiAgICB2YXIgdGhlbkJsb2NrID0gc2NvcGUoKTtcbiAgICB2YXIgZWxzZUJsb2NrID0gc2NvcGUoKTtcblxuICAgIHZhciB0aGVuVG9TdHJpbmcgPSB0aGVuQmxvY2sudG9TdHJpbmc7XG4gICAgdmFyIGVsc2VUb1N0cmluZyA9IGVsc2VCbG9jay50b1N0cmluZztcblxuICAgIHJldHVybiBleHRlbmQodGhlbkJsb2NrLCB7XG4gICAgICB0aGVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoZW5CbG9jay5hcHBseSh0aGVuQmxvY2ssIHNsaWNlKGFyZ3VtZW50cykpO1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfSxcbiAgICAgIGVsc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZWxzZUJsb2NrLmFwcGx5KGVsc2VCbG9jaywgc2xpY2UoYXJndW1lbnRzKSk7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9LFxuICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVsc2VDbGF1c2UgPSBlbHNlVG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKGVsc2VDbGF1c2UpIHtcbiAgICAgICAgICBlbHNlQ2xhdXNlID0gJ2Vsc2V7JyArIGVsc2VDbGF1c2UgKyAnfSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGpvaW4oW1xuICAgICAgICAgICdpZignLCBwcmVkLCAnKXsnLFxuICAgICAgICAgIHRoZW5Ub1N0cmluZygpLFxuICAgICAgICAgICd9JywgZWxzZUNsYXVzZVxuICAgICAgICBdKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBwcm9jZWR1cmUgbGlzdFxuICB2YXIgZ2xvYmFsQmxvY2sgPSBibG9jaygpO1xuICB2YXIgcHJvY2VkdXJlcyA9IHt9O1xuICBmdW5jdGlvbiBwcm9jIChuYW1lLCBjb3VudCkge1xuICAgIHZhciBhcmdzID0gW107XG4gICAgZnVuY3Rpb24gYXJnICgpIHtcbiAgICAgIHZhciBuYW1lID0gJ2EnICsgYXJncy5sZW5ndGg7XG4gICAgICBhcmdzLnB1c2gobmFtZSk7XG4gICAgICByZXR1cm4gbmFtZVxuICAgIH1cblxuICAgIGNvdW50ID0gY291bnQgfHwgMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyArK2kpIHtcbiAgICAgIGFyZygpO1xuICAgIH1cblxuICAgIHZhciBib2R5ID0gc2NvcGUoKTtcbiAgICB2YXIgYm9keVRvU3RyaW5nID0gYm9keS50b1N0cmluZztcblxuICAgIHZhciByZXN1bHQgPSBwcm9jZWR1cmVzW25hbWVdID0gZXh0ZW5kKGJvZHksIHtcbiAgICAgIGFyZzogYXJnLFxuICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGpvaW4oW1xuICAgICAgICAgICdmdW5jdGlvbignLCBhcmdzLmpvaW4oKSwgJyl7JyxcbiAgICAgICAgICBib2R5VG9TdHJpbmcoKSxcbiAgICAgICAgICAnfSdcbiAgICAgICAgXSlcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbXBpbGUgKCkge1xuICAgIHZhciBjb2RlID0gWydcInVzZSBzdHJpY3RcIjsnLFxuICAgICAgZ2xvYmFsQmxvY2ssXG4gICAgICAncmV0dXJuIHsnXTtcbiAgICBPYmplY3Qua2V5cyhwcm9jZWR1cmVzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICBjb2RlLnB1c2goJ1wiJywgbmFtZSwgJ1wiOicsIHByb2NlZHVyZXNbbmFtZV0udG9TdHJpbmcoKSwgJywnKTtcbiAgICB9KTtcbiAgICBjb2RlLnB1c2goJ30nKTtcbiAgICB2YXIgc3JjID0gam9pbihjb2RlKVxuICAgICAgLnJlcGxhY2UoLzsvZywgJztcXG4nKVxuICAgICAgLnJlcGxhY2UoL30vZywgJ31cXG4nKVxuICAgICAgLnJlcGxhY2UoL3svZywgJ3tcXG4nKTtcbiAgICB2YXIgcHJvYyA9IEZ1bmN0aW9uLmFwcGx5KG51bGwsIGxpbmtlZE5hbWVzLmNvbmNhdChzcmMpKTtcbiAgICByZXR1cm4gcHJvYy5hcHBseShudWxsLCBsaW5rZWRWYWx1ZXMpXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdsb2JhbDogZ2xvYmFsQmxvY2ssXG4gICAgbGluazogbGluayxcbiAgICBibG9jazogYmxvY2ssXG4gICAgcHJvYzogcHJvYyxcbiAgICBzY29wZTogc2NvcGUsXG4gICAgY29uZDogY29uZGl0aW9uYWwsXG4gICAgY29tcGlsZTogY29tcGlsZVxuICB9XG59XG5cbi8vIFwiY3V0ZVwiIG5hbWVzIGZvciB2ZWN0b3IgY29tcG9uZW50c1xudmFyIENVVEVfQ09NUE9ORU5UUyA9ICd4eXp3Jy5zcGxpdCgnJyk7XG5cbnZhciBHTF9VTlNJR05FRF9CWVRFJDggPSA1MTIxO1xuXG52YXIgQVRUUklCX1NUQVRFX1BPSU5URVIgPSAxO1xudmFyIEFUVFJJQl9TVEFURV9DT05TVEFOVCA9IDI7XG5cbnZhciBEWU5fRlVOQyQxID0gMDtcbnZhciBEWU5fUFJPUCQxID0gMTtcbnZhciBEWU5fQ09OVEVYVCQxID0gMjtcbnZhciBEWU5fU1RBVEUkMSA9IDM7XG52YXIgRFlOX1RIVU5LID0gNDtcblxudmFyIFNfRElUSEVSID0gJ2RpdGhlcic7XG52YXIgU19CTEVORF9FTkFCTEUgPSAnYmxlbmQuZW5hYmxlJztcbnZhciBTX0JMRU5EX0NPTE9SID0gJ2JsZW5kLmNvbG9yJztcbnZhciBTX0JMRU5EX0VRVUFUSU9OID0gJ2JsZW5kLmVxdWF0aW9uJztcbnZhciBTX0JMRU5EX0ZVTkMgPSAnYmxlbmQuZnVuYyc7XG52YXIgU19ERVBUSF9FTkFCTEUgPSAnZGVwdGguZW5hYmxlJztcbnZhciBTX0RFUFRIX0ZVTkMgPSAnZGVwdGguZnVuYyc7XG52YXIgU19ERVBUSF9SQU5HRSA9ICdkZXB0aC5yYW5nZSc7XG52YXIgU19ERVBUSF9NQVNLID0gJ2RlcHRoLm1hc2snO1xudmFyIFNfQ09MT1JfTUFTSyA9ICdjb2xvck1hc2snO1xudmFyIFNfQ1VMTF9FTkFCTEUgPSAnY3VsbC5lbmFibGUnO1xudmFyIFNfQ1VMTF9GQUNFID0gJ2N1bGwuZmFjZSc7XG52YXIgU19GUk9OVF9GQUNFID0gJ2Zyb250RmFjZSc7XG52YXIgU19MSU5FX1dJRFRIID0gJ2xpbmVXaWR0aCc7XG52YXIgU19QT0xZR09OX09GRlNFVF9FTkFCTEUgPSAncG9seWdvbk9mZnNldC5lbmFibGUnO1xudmFyIFNfUE9MWUdPTl9PRkZTRVRfT0ZGU0VUID0gJ3BvbHlnb25PZmZzZXQub2Zmc2V0JztcbnZhciBTX1NBTVBMRV9BTFBIQSA9ICdzYW1wbGUuYWxwaGEnO1xudmFyIFNfU0FNUExFX0VOQUJMRSA9ICdzYW1wbGUuZW5hYmxlJztcbnZhciBTX1NBTVBMRV9DT1ZFUkFHRSA9ICdzYW1wbGUuY292ZXJhZ2UnO1xudmFyIFNfU1RFTkNJTF9FTkFCTEUgPSAnc3RlbmNpbC5lbmFibGUnO1xudmFyIFNfU1RFTkNJTF9NQVNLID0gJ3N0ZW5jaWwubWFzayc7XG52YXIgU19TVEVOQ0lMX0ZVTkMgPSAnc3RlbmNpbC5mdW5jJztcbnZhciBTX1NURU5DSUxfT1BGUk9OVCA9ICdzdGVuY2lsLm9wRnJvbnQnO1xudmFyIFNfU1RFTkNJTF9PUEJBQ0sgPSAnc3RlbmNpbC5vcEJhY2snO1xudmFyIFNfU0NJU1NPUl9FTkFCTEUgPSAnc2Npc3Nvci5lbmFibGUnO1xudmFyIFNfU0NJU1NPUl9CT1ggPSAnc2Npc3Nvci5ib3gnO1xudmFyIFNfVklFV1BPUlQgPSAndmlld3BvcnQnO1xuXG52YXIgU19QUk9GSUxFID0gJ3Byb2ZpbGUnO1xuXG52YXIgU19GUkFNRUJVRkZFUiA9ICdmcmFtZWJ1ZmZlcic7XG52YXIgU19WRVJUID0gJ3ZlcnQnO1xudmFyIFNfRlJBRyA9ICdmcmFnJztcbnZhciBTX0VMRU1FTlRTID0gJ2VsZW1lbnRzJztcbnZhciBTX1BSSU1JVElWRSA9ICdwcmltaXRpdmUnO1xudmFyIFNfQ09VTlQgPSAnY291bnQnO1xudmFyIFNfT0ZGU0VUID0gJ29mZnNldCc7XG52YXIgU19JTlNUQU5DRVMgPSAnaW5zdGFuY2VzJztcblxudmFyIFNVRkZJWF9XSURUSCA9ICdXaWR0aCc7XG52YXIgU1VGRklYX0hFSUdIVCA9ICdIZWlnaHQnO1xuXG52YXIgU19GUkFNRUJVRkZFUl9XSURUSCA9IFNfRlJBTUVCVUZGRVIgKyBTVUZGSVhfV0lEVEg7XG52YXIgU19GUkFNRUJVRkZFUl9IRUlHSFQgPSBTX0ZSQU1FQlVGRkVSICsgU1VGRklYX0hFSUdIVDtcbnZhciBTX1ZJRVdQT1JUX1dJRFRIID0gU19WSUVXUE9SVCArIFNVRkZJWF9XSURUSDtcbnZhciBTX1ZJRVdQT1JUX0hFSUdIVCA9IFNfVklFV1BPUlQgKyBTVUZGSVhfSEVJR0hUO1xudmFyIFNfRFJBV0lOR0JVRkZFUiA9ICdkcmF3aW5nQnVmZmVyJztcbnZhciBTX0RSQVdJTkdCVUZGRVJfV0lEVEggPSBTX0RSQVdJTkdCVUZGRVIgKyBTVUZGSVhfV0lEVEg7XG52YXIgU19EUkFXSU5HQlVGRkVSX0hFSUdIVCA9IFNfRFJBV0lOR0JVRkZFUiArIFNVRkZJWF9IRUlHSFQ7XG5cbnZhciBORVNURURfT1BUSU9OUyA9IFtcbiAgU19CTEVORF9GVU5DLFxuICBTX0JMRU5EX0VRVUFUSU9OLFxuICBTX1NURU5DSUxfRlVOQyxcbiAgU19TVEVOQ0lMX09QRlJPTlQsXG4gIFNfU1RFTkNJTF9PUEJBQ0ssXG4gIFNfU0FNUExFX0NPVkVSQUdFLFxuICBTX1ZJRVdQT1JULFxuICBTX1NDSVNTT1JfQk9YLFxuICBTX1BPTFlHT05fT0ZGU0VUX09GRlNFVFxuXTtcblxudmFyIEdMX0FSUkFZX0JVRkZFUiQxID0gMzQ5NjI7XG52YXIgR0xfRUxFTUVOVF9BUlJBWV9CVUZGRVIkMSA9IDM0OTYzO1xuXG52YXIgR0xfRlJBR01FTlRfU0hBREVSJDEgPSAzNTYzMjtcbnZhciBHTF9WRVJURVhfU0hBREVSJDEgPSAzNTYzMztcblxudmFyIEdMX1RFWFRVUkVfMkQkMyA9IDB4MERFMTtcbnZhciBHTF9URVhUVVJFX0NVQkVfTUFQJDIgPSAweDg1MTM7XG5cbnZhciBHTF9DVUxMX0ZBQ0UgPSAweDBCNDQ7XG52YXIgR0xfQkxFTkQgPSAweDBCRTI7XG52YXIgR0xfRElUSEVSID0gMHgwQkQwO1xudmFyIEdMX1NURU5DSUxfVEVTVCA9IDB4MEI5MDtcbnZhciBHTF9ERVBUSF9URVNUID0gMHgwQjcxO1xudmFyIEdMX1NDSVNTT1JfVEVTVCA9IDB4MEMxMTtcbnZhciBHTF9QT0xZR09OX09GRlNFVF9GSUxMID0gMHg4MDM3O1xudmFyIEdMX1NBTVBMRV9BTFBIQV9UT19DT1ZFUkFHRSA9IDB4ODA5RTtcbnZhciBHTF9TQU1QTEVfQ09WRVJBR0UgPSAweDgwQTA7XG5cbnZhciBHTF9GTE9BVCQ4ID0gNTEyNjtcbnZhciBHTF9GTE9BVF9WRUMyID0gMzU2NjQ7XG52YXIgR0xfRkxPQVRfVkVDMyA9IDM1NjY1O1xudmFyIEdMX0ZMT0FUX1ZFQzQgPSAzNTY2NjtcbnZhciBHTF9JTlQkMyA9IDUxMjQ7XG52YXIgR0xfSU5UX1ZFQzIgPSAzNTY2NztcbnZhciBHTF9JTlRfVkVDMyA9IDM1NjY4O1xudmFyIEdMX0lOVF9WRUM0ID0gMzU2Njk7XG52YXIgR0xfQk9PTCA9IDM1NjcwO1xudmFyIEdMX0JPT0xfVkVDMiA9IDM1NjcxO1xudmFyIEdMX0JPT0xfVkVDMyA9IDM1NjcyO1xudmFyIEdMX0JPT0xfVkVDNCA9IDM1NjczO1xudmFyIEdMX0ZMT0FUX01BVDIgPSAzNTY3NDtcbnZhciBHTF9GTE9BVF9NQVQzID0gMzU2NzU7XG52YXIgR0xfRkxPQVRfTUFUNCA9IDM1Njc2O1xudmFyIEdMX1NBTVBMRVJfMkQgPSAzNTY3ODtcbnZhciBHTF9TQU1QTEVSX0NVQkUgPSAzNTY4MDtcblxudmFyIEdMX1RSSUFOR0xFUyQxID0gNDtcblxudmFyIEdMX0ZST05UID0gMTAyODtcbnZhciBHTF9CQUNLID0gMTAyOTtcbnZhciBHTF9DVyA9IDB4MDkwMDtcbnZhciBHTF9DQ1cgPSAweDA5MDE7XG52YXIgR0xfTUlOX0VYVCA9IDB4ODAwNztcbnZhciBHTF9NQVhfRVhUID0gMHg4MDA4O1xudmFyIEdMX0FMV0FZUyA9IDUxOTtcbnZhciBHTF9LRUVQID0gNzY4MDtcbnZhciBHTF9aRVJPID0gMDtcbnZhciBHTF9PTkUgPSAxO1xudmFyIEdMX0ZVTkNfQUREID0gMHg4MDA2O1xudmFyIEdMX0xFU1MgPSA1MTM7XG5cbnZhciBHTF9GUkFNRUJVRkZFUiQyID0gMHg4RDQwO1xudmFyIEdMX0NPTE9SX0FUVEFDSE1FTlQwJDIgPSAweDhDRTA7XG5cbnZhciBibGVuZEZ1bmNzID0ge1xuICAnMCc6IDAsXG4gICcxJzogMSxcbiAgJ3plcm8nOiAwLFxuICAnb25lJzogMSxcbiAgJ3NyYyBjb2xvcic6IDc2OCxcbiAgJ29uZSBtaW51cyBzcmMgY29sb3InOiA3NjksXG4gICdzcmMgYWxwaGEnOiA3NzAsXG4gICdvbmUgbWludXMgc3JjIGFscGhhJzogNzcxLFxuICAnZHN0IGNvbG9yJzogNzc0LFxuICAnb25lIG1pbnVzIGRzdCBjb2xvcic6IDc3NSxcbiAgJ2RzdCBhbHBoYSc6IDc3MixcbiAgJ29uZSBtaW51cyBkc3QgYWxwaGEnOiA3NzMsXG4gICdjb25zdGFudCBjb2xvcic6IDMyNzY5LFxuICAnb25lIG1pbnVzIGNvbnN0YW50IGNvbG9yJzogMzI3NzAsXG4gICdjb25zdGFudCBhbHBoYSc6IDMyNzcxLFxuICAnb25lIG1pbnVzIGNvbnN0YW50IGFscGhhJzogMzI3NzIsXG4gICdzcmMgYWxwaGEgc2F0dXJhdGUnOiA3NzZcbn07XG5cbi8vIFRoZXJlIGFyZSBpbnZhbGlkIHZhbHVlcyBmb3Igc3JjUkdCIGFuZCBkc3RSR0IuIFNlZTpcbi8vIGh0dHBzOi8vd3d3Lmtocm9ub3Mub3JnL3JlZ2lzdHJ5L3dlYmdsL3NwZWNzLzEuMC8jNi4xM1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL0tocm9ub3NHcm91cC9XZWJHTC9ibG9iLzBkMzIwMWY1ZjdlYzNjMDA2MGJjMWYwNDA3NzQ2MTU0MWYxOTg3YjkvY29uZm9ybWFuY2Utc3VpdGVzLzEuMC4zL2NvbmZvcm1hbmNlL21pc2Mvd2ViZ2wtc3BlY2lmaWMuaHRtbCNMNTZcbnZhciBpbnZhbGlkQmxlbmRDb21iaW5hdGlvbnMgPSBbXG4gICdjb25zdGFudCBjb2xvciwgY29uc3RhbnQgYWxwaGEnLFxuICAnb25lIG1pbnVzIGNvbnN0YW50IGNvbG9yLCBjb25zdGFudCBhbHBoYScsXG4gICdjb25zdGFudCBjb2xvciwgb25lIG1pbnVzIGNvbnN0YW50IGFscGhhJyxcbiAgJ29uZSBtaW51cyBjb25zdGFudCBjb2xvciwgb25lIG1pbnVzIGNvbnN0YW50IGFscGhhJyxcbiAgJ2NvbnN0YW50IGFscGhhLCBjb25zdGFudCBjb2xvcicsXG4gICdjb25zdGFudCBhbHBoYSwgb25lIG1pbnVzIGNvbnN0YW50IGNvbG9yJyxcbiAgJ29uZSBtaW51cyBjb25zdGFudCBhbHBoYSwgY29uc3RhbnQgY29sb3InLFxuICAnb25lIG1pbnVzIGNvbnN0YW50IGFscGhhLCBvbmUgbWludXMgY29uc3RhbnQgY29sb3InXG5dO1xuXG52YXIgY29tcGFyZUZ1bmNzID0ge1xuICAnbmV2ZXInOiA1MTIsXG4gICdsZXNzJzogNTEzLFxuICAnPCc6IDUxMyxcbiAgJ2VxdWFsJzogNTE0LFxuICAnPSc6IDUxNCxcbiAgJz09JzogNTE0LFxuICAnPT09JzogNTE0LFxuICAnbGVxdWFsJzogNTE1LFxuICAnPD0nOiA1MTUsXG4gICdncmVhdGVyJzogNTE2LFxuICAnPic6IDUxNixcbiAgJ25vdGVxdWFsJzogNTE3LFxuICAnIT0nOiA1MTcsXG4gICchPT0nOiA1MTcsXG4gICdnZXF1YWwnOiA1MTgsXG4gICc+PSc6IDUxOCxcbiAgJ2Fsd2F5cyc6IDUxOVxufTtcblxudmFyIHN0ZW5jaWxPcHMgPSB7XG4gICcwJzogMCxcbiAgJ3plcm8nOiAwLFxuICAna2VlcCc6IDc2ODAsXG4gICdyZXBsYWNlJzogNzY4MSxcbiAgJ2luY3JlbWVudCc6IDc2ODIsXG4gICdkZWNyZW1lbnQnOiA3NjgzLFxuICAnaW5jcmVtZW50IHdyYXAnOiAzNDA1NSxcbiAgJ2RlY3JlbWVudCB3cmFwJzogMzQwNTYsXG4gICdpbnZlcnQnOiA1Mzg2XG59O1xuXG52YXIgc2hhZGVyVHlwZSA9IHtcbiAgJ2ZyYWcnOiBHTF9GUkFHTUVOVF9TSEFERVIkMSxcbiAgJ3ZlcnQnOiBHTF9WRVJURVhfU0hBREVSJDFcbn07XG5cbnZhciBvcmllbnRhdGlvblR5cGUgPSB7XG4gICdjdyc6IEdMX0NXLFxuICAnY2N3JzogR0xfQ0NXXG59O1xuXG5mdW5jdGlvbiBpc0J1ZmZlckFyZ3MgKHgpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoeCkgfHxcbiAgICBpc1R5cGVkQXJyYXkoeCkgfHxcbiAgICBpc05EQXJyYXlMaWtlKHgpXG59XG5cbi8vIE1ha2Ugc3VyZSB2aWV3cG9ydCBpcyBwcm9jZXNzZWQgZmlyc3RcbmZ1bmN0aW9uIHNvcnRTdGF0ZSAoc3RhdGUpIHtcbiAgcmV0dXJuIHN0YXRlLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICBpZiAoYSA9PT0gU19WSUVXUE9SVCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfSBlbHNlIGlmIChiID09PSBTX1ZJRVdQT1JUKSB7XG4gICAgICByZXR1cm4gMVxuICAgIH1cbiAgICByZXR1cm4gKGEgPCBiKSA/IC0xIDogMVxuICB9KVxufVxuXG5mdW5jdGlvbiBEZWNsYXJhdGlvbiAodGhpc0RlcCwgY29udGV4dERlcCwgcHJvcERlcCwgYXBwZW5kKSB7XG4gIHRoaXMudGhpc0RlcCA9IHRoaXNEZXA7XG4gIHRoaXMuY29udGV4dERlcCA9IGNvbnRleHREZXA7XG4gIHRoaXMucHJvcERlcCA9IHByb3BEZXA7XG4gIHRoaXMuYXBwZW5kID0gYXBwZW5kO1xufVxuXG5mdW5jdGlvbiBpc1N0YXRpYyAoZGVjbCkge1xuICByZXR1cm4gZGVjbCAmJiAhKGRlY2wudGhpc0RlcCB8fCBkZWNsLmNvbnRleHREZXAgfHwgZGVjbC5wcm9wRGVwKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdGF0aWNEZWNsIChhcHBlbmQpIHtcbiAgcmV0dXJuIG5ldyBEZWNsYXJhdGlvbihmYWxzZSwgZmFsc2UsIGZhbHNlLCBhcHBlbmQpXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUR5bmFtaWNEZWNsIChkeW4sIGFwcGVuZCkge1xuICB2YXIgdHlwZSA9IGR5bi50eXBlO1xuICBpZiAodHlwZSA9PT0gRFlOX0ZVTkMkMSkge1xuICAgIHZhciBudW1BcmdzID0gZHluLmRhdGEubGVuZ3RoO1xuICAgIHJldHVybiBuZXcgRGVjbGFyYXRpb24oXG4gICAgICB0cnVlLFxuICAgICAgbnVtQXJncyA+PSAxLFxuICAgICAgbnVtQXJncyA+PSAyLFxuICAgICAgYXBwZW5kKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09IERZTl9USFVOSykge1xuICAgIHZhciBkYXRhID0gZHluLmRhdGE7XG4gICAgcmV0dXJuIG5ldyBEZWNsYXJhdGlvbihcbiAgICAgIGRhdGEudGhpc0RlcCxcbiAgICAgIGRhdGEuY29udGV4dERlcCxcbiAgICAgIGRhdGEucHJvcERlcCxcbiAgICAgIGFwcGVuZClcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IERlY2xhcmF0aW9uKFxuICAgICAgdHlwZSA9PT0gRFlOX1NUQVRFJDEsXG4gICAgICB0eXBlID09PSBEWU5fQ09OVEVYVCQxLFxuICAgICAgdHlwZSA9PT0gRFlOX1BST1AkMSxcbiAgICAgIGFwcGVuZClcbiAgfVxufVxuXG52YXIgU0NPUEVfREVDTCA9IG5ldyBEZWNsYXJhdGlvbihmYWxzZSwgZmFsc2UsIGZhbHNlLCBmdW5jdGlvbiAoKSB7fSk7XG5cbmZ1bmN0aW9uIHJlZ2xDb3JlIChcbiAgZ2wsXG4gIHN0cmluZ1N0b3JlLFxuICBleHRlbnNpb25zLFxuICBsaW1pdHMsXG4gIGJ1ZmZlclN0YXRlLFxuICBlbGVtZW50U3RhdGUsXG4gIHRleHR1cmVTdGF0ZSxcbiAgZnJhbWVidWZmZXJTdGF0ZSxcbiAgdW5pZm9ybVN0YXRlLFxuICBhdHRyaWJ1dGVTdGF0ZSxcbiAgc2hhZGVyU3RhdGUsXG4gIGRyYXdTdGF0ZSxcbiAgY29udGV4dFN0YXRlLFxuICB0aW1lcixcbiAgY29uZmlnKSB7XG4gIHZhciBBdHRyaWJ1dGVSZWNvcmQgPSBhdHRyaWJ1dGVTdGF0ZS5SZWNvcmQ7XG5cbiAgdmFyIGJsZW5kRXF1YXRpb25zID0ge1xuICAgICdhZGQnOiAzMjc3NCxcbiAgICAnc3VidHJhY3QnOiAzMjc3OCxcbiAgICAncmV2ZXJzZSBzdWJ0cmFjdCc6IDMyNzc5XG4gIH07XG4gIGlmIChleHRlbnNpb25zLmV4dF9ibGVuZF9taW5tYXgpIHtcbiAgICBibGVuZEVxdWF0aW9ucy5taW4gPSBHTF9NSU5fRVhUO1xuICAgIGJsZW5kRXF1YXRpb25zLm1heCA9IEdMX01BWF9FWFQ7XG4gIH1cblxuICB2YXIgZXh0SW5zdGFuY2luZyA9IGV4dGVuc2lvbnMuYW5nbGVfaW5zdGFuY2VkX2FycmF5cztcbiAgdmFyIGV4dERyYXdCdWZmZXJzID0gZXh0ZW5zaW9ucy53ZWJnbF9kcmF3X2J1ZmZlcnM7XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBXRUJHTCBTVEFURVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIHZhciBjdXJyZW50U3RhdGUgPSB7XG4gICAgZGlydHk6IHRydWUsXG4gICAgcHJvZmlsZTogY29uZmlnLnByb2ZpbGVcbiAgfTtcbiAgdmFyIG5leHRTdGF0ZSA9IHt9O1xuICB2YXIgR0xfU1RBVEVfTkFNRVMgPSBbXTtcbiAgdmFyIEdMX0ZMQUdTID0ge307XG4gIHZhciBHTF9WQVJJQUJMRVMgPSB7fTtcblxuICBmdW5jdGlvbiBwcm9wTmFtZSAobmFtZSkge1xuICAgIHJldHVybiBuYW1lLnJlcGxhY2UoJy4nLCAnXycpXG4gIH1cblxuICBmdW5jdGlvbiBzdGF0ZUZsYWcgKHNuYW1lLCBjYXAsIGluaXQpIHtcbiAgICB2YXIgbmFtZSA9IHByb3BOYW1lKHNuYW1lKTtcbiAgICBHTF9TVEFURV9OQU1FUy5wdXNoKHNuYW1lKTtcbiAgICBuZXh0U3RhdGVbbmFtZV0gPSBjdXJyZW50U3RhdGVbbmFtZV0gPSAhIWluaXQ7XG4gICAgR0xfRkxBR1NbbmFtZV0gPSBjYXA7XG4gIH1cblxuICBmdW5jdGlvbiBzdGF0ZVZhcmlhYmxlIChzbmFtZSwgZnVuYywgaW5pdCkge1xuICAgIHZhciBuYW1lID0gcHJvcE5hbWUoc25hbWUpO1xuICAgIEdMX1NUQVRFX05BTUVTLnB1c2goc25hbWUpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGluaXQpKSB7XG4gICAgICBjdXJyZW50U3RhdGVbbmFtZV0gPSBpbml0LnNsaWNlKCk7XG4gICAgICBuZXh0U3RhdGVbbmFtZV0gPSBpbml0LnNsaWNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnRTdGF0ZVtuYW1lXSA9IG5leHRTdGF0ZVtuYW1lXSA9IGluaXQ7XG4gICAgfVxuICAgIEdMX1ZBUklBQkxFU1tuYW1lXSA9IGZ1bmM7XG4gIH1cblxuICAvLyBEaXRoZXJpbmdcbiAgc3RhdGVGbGFnKFNfRElUSEVSLCBHTF9ESVRIRVIpO1xuXG4gIC8vIEJsZW5kaW5nXG4gIHN0YXRlRmxhZyhTX0JMRU5EX0VOQUJMRSwgR0xfQkxFTkQpO1xuICBzdGF0ZVZhcmlhYmxlKFNfQkxFTkRfQ09MT1IsICdibGVuZENvbG9yJywgWzAsIDAsIDAsIDBdKTtcbiAgc3RhdGVWYXJpYWJsZShTX0JMRU5EX0VRVUFUSU9OLCAnYmxlbmRFcXVhdGlvblNlcGFyYXRlJyxcbiAgICBbR0xfRlVOQ19BREQsIEdMX0ZVTkNfQUREXSk7XG4gIHN0YXRlVmFyaWFibGUoU19CTEVORF9GVU5DLCAnYmxlbmRGdW5jU2VwYXJhdGUnLFxuICAgIFtHTF9PTkUsIEdMX1pFUk8sIEdMX09ORSwgR0xfWkVST10pO1xuXG4gIC8vIERlcHRoXG4gIHN0YXRlRmxhZyhTX0RFUFRIX0VOQUJMRSwgR0xfREVQVEhfVEVTVCwgdHJ1ZSk7XG4gIHN0YXRlVmFyaWFibGUoU19ERVBUSF9GVU5DLCAnZGVwdGhGdW5jJywgR0xfTEVTUyk7XG4gIHN0YXRlVmFyaWFibGUoU19ERVBUSF9SQU5HRSwgJ2RlcHRoUmFuZ2UnLCBbMCwgMV0pO1xuICBzdGF0ZVZhcmlhYmxlKFNfREVQVEhfTUFTSywgJ2RlcHRoTWFzaycsIHRydWUpO1xuXG4gIC8vIENvbG9yIG1hc2tcbiAgc3RhdGVWYXJpYWJsZShTX0NPTE9SX01BU0ssIFNfQ09MT1JfTUFTSywgW3RydWUsIHRydWUsIHRydWUsIHRydWVdKTtcblxuICAvLyBGYWNlIGN1bGxpbmdcbiAgc3RhdGVGbGFnKFNfQ1VMTF9FTkFCTEUsIEdMX0NVTExfRkFDRSk7XG4gIHN0YXRlVmFyaWFibGUoU19DVUxMX0ZBQ0UsICdjdWxsRmFjZScsIEdMX0JBQ0spO1xuXG4gIC8vIEZyb250IGZhY2Ugb3JpZW50YXRpb25cbiAgc3RhdGVWYXJpYWJsZShTX0ZST05UX0ZBQ0UsIFNfRlJPTlRfRkFDRSwgR0xfQ0NXKTtcblxuICAvLyBMaW5lIHdpZHRoXG4gIHN0YXRlVmFyaWFibGUoU19MSU5FX1dJRFRILCBTX0xJTkVfV0lEVEgsIDEpO1xuXG4gIC8vIFBvbHlnb24gb2Zmc2V0XG4gIHN0YXRlRmxhZyhTX1BPTFlHT05fT0ZGU0VUX0VOQUJMRSwgR0xfUE9MWUdPTl9PRkZTRVRfRklMTCk7XG4gIHN0YXRlVmFyaWFibGUoU19QT0xZR09OX09GRlNFVF9PRkZTRVQsICdwb2x5Z29uT2Zmc2V0JywgWzAsIDBdKTtcblxuICAvLyBTYW1wbGUgY292ZXJhZ2VcbiAgc3RhdGVGbGFnKFNfU0FNUExFX0FMUEhBLCBHTF9TQU1QTEVfQUxQSEFfVE9fQ09WRVJBR0UpO1xuICBzdGF0ZUZsYWcoU19TQU1QTEVfRU5BQkxFLCBHTF9TQU1QTEVfQ09WRVJBR0UpO1xuICBzdGF0ZVZhcmlhYmxlKFNfU0FNUExFX0NPVkVSQUdFLCAnc2FtcGxlQ292ZXJhZ2UnLCBbMSwgZmFsc2VdKTtcblxuICAvLyBTdGVuY2lsXG4gIHN0YXRlRmxhZyhTX1NURU5DSUxfRU5BQkxFLCBHTF9TVEVOQ0lMX1RFU1QpO1xuICBzdGF0ZVZhcmlhYmxlKFNfU1RFTkNJTF9NQVNLLCAnc3RlbmNpbE1hc2snLCAtMSk7XG4gIHN0YXRlVmFyaWFibGUoU19TVEVOQ0lMX0ZVTkMsICdzdGVuY2lsRnVuYycsIFtHTF9BTFdBWVMsIDAsIC0xXSk7XG4gIHN0YXRlVmFyaWFibGUoU19TVEVOQ0lMX09QRlJPTlQsICdzdGVuY2lsT3BTZXBhcmF0ZScsXG4gICAgW0dMX0ZST05ULCBHTF9LRUVQLCBHTF9LRUVQLCBHTF9LRUVQXSk7XG4gIHN0YXRlVmFyaWFibGUoU19TVEVOQ0lMX09QQkFDSywgJ3N0ZW5jaWxPcFNlcGFyYXRlJyxcbiAgICBbR0xfQkFDSywgR0xfS0VFUCwgR0xfS0VFUCwgR0xfS0VFUF0pO1xuXG4gIC8vIFNjaXNzb3JcbiAgc3RhdGVGbGFnKFNfU0NJU1NPUl9FTkFCTEUsIEdMX1NDSVNTT1JfVEVTVCk7XG4gIHN0YXRlVmFyaWFibGUoU19TQ0lTU09SX0JPWCwgJ3NjaXNzb3InLFxuICAgIFswLCAwLCBnbC5kcmF3aW5nQnVmZmVyV2lkdGgsIGdsLmRyYXdpbmdCdWZmZXJIZWlnaHRdKTtcblxuICAvLyBWaWV3cG9ydFxuICBzdGF0ZVZhcmlhYmxlKFNfVklFV1BPUlQsIFNfVklFV1BPUlQsXG4gICAgWzAsIDAsIGdsLmRyYXdpbmdCdWZmZXJXaWR0aCwgZ2wuZHJhd2luZ0J1ZmZlckhlaWdodF0pO1xuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRU5WSVJPTk1FTlRcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICB2YXIgc2hhcmVkU3RhdGUgPSB7XG4gICAgZ2w6IGdsLFxuICAgIGNvbnRleHQ6IGNvbnRleHRTdGF0ZSxcbiAgICBzdHJpbmdzOiBzdHJpbmdTdG9yZSxcbiAgICBuZXh0OiBuZXh0U3RhdGUsXG4gICAgY3VycmVudDogY3VycmVudFN0YXRlLFxuICAgIGRyYXc6IGRyYXdTdGF0ZSxcbiAgICBlbGVtZW50czogZWxlbWVudFN0YXRlLFxuICAgIGJ1ZmZlcjogYnVmZmVyU3RhdGUsXG4gICAgc2hhZGVyOiBzaGFkZXJTdGF0ZSxcbiAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVTdGF0ZS5zdGF0ZSxcbiAgICB1bmlmb3JtczogdW5pZm9ybVN0YXRlLFxuICAgIGZyYW1lYnVmZmVyOiBmcmFtZWJ1ZmZlclN0YXRlLFxuICAgIGV4dGVuc2lvbnM6IGV4dGVuc2lvbnMsXG5cbiAgICB0aW1lcjogdGltZXIsXG4gICAgaXNCdWZmZXJBcmdzOiBpc0J1ZmZlckFyZ3NcbiAgfTtcblxuICB2YXIgc2hhcmVkQ29uc3RhbnRzID0ge1xuICAgIHByaW1UeXBlczogcHJpbVR5cGVzLFxuICAgIGNvbXBhcmVGdW5jczogY29tcGFyZUZ1bmNzLFxuICAgIGJsZW5kRnVuY3M6IGJsZW5kRnVuY3MsXG4gICAgYmxlbmRFcXVhdGlvbnM6IGJsZW5kRXF1YXRpb25zLFxuICAgIHN0ZW5jaWxPcHM6IHN0ZW5jaWxPcHMsXG4gICAgZ2xUeXBlczogZ2xUeXBlcyxcbiAgICBvcmllbnRhdGlvblR5cGU6IG9yaWVudGF0aW9uVHlwZVxuICB9O1xuXG4gIGNoZWNrJDEub3B0aW9uYWwoZnVuY3Rpb24gKCkge1xuICAgIHNoYXJlZFN0YXRlLmlzQXJyYXlMaWtlID0gaXNBcnJheUxpa2U7XG4gIH0pO1xuXG4gIGlmIChleHREcmF3QnVmZmVycykge1xuICAgIHNoYXJlZENvbnN0YW50cy5iYWNrQnVmZmVyID0gW0dMX0JBQ0tdO1xuICAgIHNoYXJlZENvbnN0YW50cy5kcmF3QnVmZmVyID0gbG9vcChsaW1pdHMubWF4RHJhd2J1ZmZlcnMsIGZ1bmN0aW9uIChpKSB7XG4gICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gWzBdXG4gICAgICB9XG4gICAgICByZXR1cm4gbG9vcChpLCBmdW5jdGlvbiAoaikge1xuICAgICAgICByZXR1cm4gR0xfQ09MT1JfQVRUQUNITUVOVDAkMiArIGpcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICB2YXIgZHJhd0NhbGxDb3VudGVyID0gMDtcbiAgZnVuY3Rpb24gY3JlYXRlUkVHTEVudmlyb25tZW50ICgpIHtcbiAgICB2YXIgZW52ID0gY3JlYXRlRW52aXJvbm1lbnQoKTtcbiAgICB2YXIgbGluayA9IGVudi5saW5rO1xuICAgIHZhciBnbG9iYWwgPSBlbnYuZ2xvYmFsO1xuICAgIGVudi5pZCA9IGRyYXdDYWxsQ291bnRlcisrO1xuXG4gICAgZW52LmJhdGNoSWQgPSAnMCc7XG5cbiAgICAvLyBsaW5rIHNoYXJlZCBzdGF0ZVxuICAgIHZhciBTSEFSRUQgPSBsaW5rKHNoYXJlZFN0YXRlKTtcbiAgICB2YXIgc2hhcmVkID0gZW52LnNoYXJlZCA9IHtcbiAgICAgIHByb3BzOiAnYTAnXG4gICAgfTtcbiAgICBPYmplY3Qua2V5cyhzaGFyZWRTdGF0ZSkuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgICAgc2hhcmVkW3Byb3BdID0gZ2xvYmFsLmRlZihTSEFSRUQsICcuJywgcHJvcCk7XG4gICAgfSk7XG5cbiAgICAvLyBJbmplY3QgcnVudGltZSBhc3NlcnRpb24gc3R1ZmYgZm9yIGRlYnVnIGJ1aWxkc1xuICAgIGNoZWNrJDEub3B0aW9uYWwoZnVuY3Rpb24gKCkge1xuICAgICAgZW52LkNIRUNLID0gbGluayhjaGVjayQxKTtcbiAgICAgIGVudi5jb21tYW5kU3RyID0gY2hlY2skMS5ndWVzc0NvbW1hbmQoKTtcbiAgICAgIGVudi5jb21tYW5kID0gbGluayhlbnYuY29tbWFuZFN0cik7XG4gICAgICBlbnYuYXNzZXJ0ID0gZnVuY3Rpb24gKGJsb2NrLCBwcmVkLCBtZXNzYWdlKSB7XG4gICAgICAgIGJsb2NrKFxuICAgICAgICAgICdpZighKCcsIHByZWQsICcpKScsXG4gICAgICAgICAgdGhpcy5DSEVDSywgJy5jb21tYW5kUmFpc2UoJywgbGluayhtZXNzYWdlKSwgJywnLCB0aGlzLmNvbW1hbmQsICcpOycpO1xuICAgICAgfTtcblxuICAgICAgc2hhcmVkQ29uc3RhbnRzLmludmFsaWRCbGVuZENvbWJpbmF0aW9ucyA9IGludmFsaWRCbGVuZENvbWJpbmF0aW9ucztcbiAgICB9KTtcblxuICAgIC8vIENvcHkgR0wgc3RhdGUgdmFyaWFibGVzIG92ZXJcbiAgICB2YXIgbmV4dFZhcnMgPSBlbnYubmV4dCA9IHt9O1xuICAgIHZhciBjdXJyZW50VmFycyA9IGVudi5jdXJyZW50ID0ge307XG4gICAgT2JqZWN0LmtleXMoR0xfVkFSSUFCTEVTKS5mb3JFYWNoKGZ1bmN0aW9uICh2YXJpYWJsZSkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY3VycmVudFN0YXRlW3ZhcmlhYmxlXSkpIHtcbiAgICAgICAgbmV4dFZhcnNbdmFyaWFibGVdID0gZ2xvYmFsLmRlZihzaGFyZWQubmV4dCwgJy4nLCB2YXJpYWJsZSk7XG4gICAgICAgIGN1cnJlbnRWYXJzW3ZhcmlhYmxlXSA9IGdsb2JhbC5kZWYoc2hhcmVkLmN1cnJlbnQsICcuJywgdmFyaWFibGUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBzaGFyZWQgY29uc3RhbnRzXG4gICAgdmFyIGNvbnN0YW50cyA9IGVudi5jb25zdGFudHMgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhzaGFyZWRDb25zdGFudHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIGNvbnN0YW50c1tuYW1lXSA9IGdsb2JhbC5kZWYoSlNPTi5zdHJpbmdpZnkoc2hhcmVkQ29uc3RhbnRzW25hbWVdKSk7XG4gICAgfSk7XG5cbiAgICAvLyBIZWxwZXIgZnVuY3Rpb24gZm9yIGNhbGxpbmcgYSBibG9ja1xuICAgIGVudi5pbnZva2UgPSBmdW5jdGlvbiAoYmxvY2ssIHgpIHtcbiAgICAgIHN3aXRjaCAoeC50eXBlKSB7XG4gICAgICAgIGNhc2UgRFlOX0ZVTkMkMTpcbiAgICAgICAgICB2YXIgYXJnTGlzdCA9IFtcbiAgICAgICAgICAgICd0aGlzJyxcbiAgICAgICAgICAgIHNoYXJlZC5jb250ZXh0LFxuICAgICAgICAgICAgc2hhcmVkLnByb3BzLFxuICAgICAgICAgICAgZW52LmJhdGNoSWRcbiAgICAgICAgICBdO1xuICAgICAgICAgIHJldHVybiBibG9jay5kZWYoXG4gICAgICAgICAgICBsaW5rKHguZGF0YSksICcuY2FsbCgnLFxuICAgICAgICAgICAgICBhcmdMaXN0LnNsaWNlKDAsIE1hdGgubWF4KHguZGF0YS5sZW5ndGggKyAxLCA0KSksXG4gICAgICAgICAgICAgJyknKVxuICAgICAgICBjYXNlIERZTl9QUk9QJDE6XG4gICAgICAgICAgcmV0dXJuIGJsb2NrLmRlZihzaGFyZWQucHJvcHMsIHguZGF0YSlcbiAgICAgICAgY2FzZSBEWU5fQ09OVEVYVCQxOlxuICAgICAgICAgIHJldHVybiBibG9jay5kZWYoc2hhcmVkLmNvbnRleHQsIHguZGF0YSlcbiAgICAgICAgY2FzZSBEWU5fU1RBVEUkMTpcbiAgICAgICAgICByZXR1cm4gYmxvY2suZGVmKCd0aGlzJywgeC5kYXRhKVxuICAgICAgICBjYXNlIERZTl9USFVOSzpcbiAgICAgICAgICB4LmRhdGEuYXBwZW5kKGVudiwgYmxvY2spO1xuICAgICAgICAgIHJldHVybiB4LmRhdGEucmVmXG4gICAgICB9XG4gICAgfTtcblxuICAgIGVudi5hdHRyaWJDYWNoZSA9IHt9O1xuXG4gICAgdmFyIHNjb3BlQXR0cmlicyA9IHt9O1xuICAgIGVudi5zY29wZUF0dHJpYiA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgaWQgPSBzdHJpbmdTdG9yZS5pZChuYW1lKTtcbiAgICAgIGlmIChpZCBpbiBzY29wZUF0dHJpYnMpIHtcbiAgICAgICAgcmV0dXJuIHNjb3BlQXR0cmlic1tpZF1cbiAgICAgIH1cbiAgICAgIHZhciBiaW5kaW5nID0gYXR0cmlidXRlU3RhdGUuc2NvcGVbaWRdO1xuICAgICAgaWYgKCFiaW5kaW5nKSB7XG4gICAgICAgIGJpbmRpbmcgPSBhdHRyaWJ1dGVTdGF0ZS5zY29wZVtpZF0gPSBuZXcgQXR0cmlidXRlUmVjb3JkKCk7XG4gICAgICB9XG4gICAgICB2YXIgcmVzdWx0ID0gc2NvcGVBdHRyaWJzW2lkXSA9IGxpbmsoYmluZGluZyk7XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfTtcblxuICAgIHJldHVybiBlbnZcbiAgfVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUEFSU0lOR1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGZ1bmN0aW9uIHBhcnNlUHJvZmlsZSAob3B0aW9ucykge1xuICAgIHZhciBzdGF0aWNPcHRpb25zID0gb3B0aW9ucy5zdGF0aWM7XG4gICAgdmFyIGR5bmFtaWNPcHRpb25zID0gb3B0aW9ucy5keW5hbWljO1xuXG4gICAgdmFyIHByb2ZpbGVFbmFibGU7XG4gICAgaWYgKFNfUFJPRklMRSBpbiBzdGF0aWNPcHRpb25zKSB7XG4gICAgICB2YXIgdmFsdWUgPSAhIXN0YXRpY09wdGlvbnNbU19QUk9GSUxFXTtcbiAgICAgIHByb2ZpbGVFbmFibGUgPSBjcmVhdGVTdGF0aWNEZWNsKGZ1bmN0aW9uIChlbnYsIHNjb3BlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgfSk7XG4gICAgICBwcm9maWxlRW5hYmxlLmVuYWJsZSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAoU19QUk9GSUxFIGluIGR5bmFtaWNPcHRpb25zKSB7XG4gICAgICB2YXIgZHluID0gZHluYW1pY09wdGlvbnNbU19QUk9GSUxFXTtcbiAgICAgIHByb2ZpbGVFbmFibGUgPSBjcmVhdGVEeW5hbWljRGVjbChkeW4sIGZ1bmN0aW9uIChlbnYsIHNjb3BlKSB7XG4gICAgICAgIHJldHVybiBlbnYuaW52b2tlKHNjb3BlLCBkeW4pXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvZmlsZUVuYWJsZVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VGcmFtZWJ1ZmZlciAob3B0aW9ucywgZW52KSB7XG4gICAgdmFyIHN0YXRpY09wdGlvbnMgPSBvcHRpb25zLnN0YXRpYztcbiAgICB2YXIgZHluYW1pY09wdGlvbnMgPSBvcHRpb25zLmR5bmFtaWM7XG5cbiAgICBpZiAoU19GUkFNRUJVRkZFUiBpbiBzdGF0aWNPcHRpb25zKSB7XG4gICAgICB2YXIgZnJhbWVidWZmZXIgPSBzdGF0aWNPcHRpb25zW1NfRlJBTUVCVUZGRVJdO1xuICAgICAgaWYgKGZyYW1lYnVmZmVyKSB7XG4gICAgICAgIGZyYW1lYnVmZmVyID0gZnJhbWVidWZmZXJTdGF0ZS5nZXRGcmFtZWJ1ZmZlcihmcmFtZWJ1ZmZlcik7XG4gICAgICAgIGNoZWNrJDEuY29tbWFuZChmcmFtZWJ1ZmZlciwgJ2ludmFsaWQgZnJhbWVidWZmZXIgb2JqZWN0Jyk7XG4gICAgICAgIHJldHVybiBjcmVhdGVTdGF0aWNEZWNsKGZ1bmN0aW9uIChlbnYsIGJsb2NrKSB7XG4gICAgICAgICAgdmFyIEZSQU1FQlVGRkVSID0gZW52LmxpbmsoZnJhbWVidWZmZXIpO1xuICAgICAgICAgIHZhciBzaGFyZWQgPSBlbnYuc2hhcmVkO1xuICAgICAgICAgIGJsb2NrLnNldChcbiAgICAgICAgICAgIHNoYXJlZC5mcmFtZWJ1ZmZlcixcbiAgICAgICAgICAgICcubmV4dCcsXG4gICAgICAgICAgICBGUkFNRUJVRkZFUik7XG4gICAgICAgICAgdmFyIENPTlRFWFQgPSBzaGFyZWQuY29udGV4dDtcbiAgICAgICAgICBibG9jay5zZXQoXG4gICAgICAgICAgICBDT05URVhULFxuICAgICAgICAgICAgJy4nICsgU19GUkFNRUJVRkZFUl9XSURUSCxcbiAgICAgICAgICAgIEZSQU1FQlVGRkVSICsgJy53aWR0aCcpO1xuICAgICAgICAgIGJsb2NrLnNldChcbiAgICAgICAgICAgIENPTlRFWFQsXG4gICAgICAgICAgICAnLicgKyBTX0ZSQU1FQlVGRkVSX0hFSUdIVCxcbiAgICAgICAgICAgIEZSQU1FQlVGRkVSICsgJy5oZWlnaHQnKTtcbiAgICAgICAgICByZXR1cm4gRlJBTUVCVUZGRVJcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVTdGF0aWNEZWNsKGZ1bmN0aW9uIChlbnYsIHNjb3BlKSB7XG4gICAgICAgICAgdmFyIHNoYXJlZCA9IGVudi5zaGFyZWQ7XG4gICAgICAgICAgc2NvcGUuc2V0KFxuICAgICAgICAgICAgc2hhcmVkLmZyYW1lYnVmZmVyLFxuICAgICAgICAgICAgJy5uZXh0JyxcbiAgICAgICAgICAgICdudWxsJyk7XG4gICAgICAgICAgdmFyIENPTlRFWFQgPSBzaGFyZWQuY29udGV4dDtcbiAgICAgICAgICBzY29wZS5zZXQoXG4gICAgICAgICAgICBDT05URVhULFxuICAgICAgICAgICAgJy4nICsgU19GUkFNRUJVRkZFUl9XSURUSCxcbiAgICAgICAgICAgIENPTlRFWFQgKyAnLicgKyBTX0RSQVdJTkdCVUZGRVJfV0lEVEgpO1xuICAgICAgICAgIHNjb3BlLnNldChcbiAgICAgICAgICAgIENPTlRFWFQsXG4gICAgICAgICAgICAnLicgKyBTX0ZSQU1FQlVGRkVSX0hFSUdIVCxcbiAgICAgICAgICAgIENPTlRFWFQgKyAnLicgKyBTX0RSQVdJTkdCVUZGRVJfSEVJR0hUKTtcbiAgICAgICAgICByZXR1cm4gJ251bGwnXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChTX0ZSQU1FQlVGRkVSIGluIGR5bmFtaWNPcHRpb25zKSB7XG4gICAgICB2YXIgZHluID0gZHluYW1pY09wdGlvbnNbU19GUkFNRUJVRkZFUl07XG4gICAgICByZXR1cm4gY3JlYXRlRHluYW1pY0RlY2woZHluLCBmdW5jdGlvbiAoZW52LCBzY29wZSkge1xuICAgICAgICB2YXIgRlJBTUVCVUZGRVJfRlVOQyA9IGVudi5pbnZva2Uoc2NvcGUsIGR5bik7XG4gICAgICAgIHZhciBzaGFyZWQgPSBlbnYuc2hhcmVkO1xuICAgICAgICB2YXIgRlJBTUVCVUZGRVJfU1RBVEUgPSBzaGFyZWQuZnJhbWVidWZmZXI7XG4gICAgICAgIHZhciBGUkFNRUJVRkZFUiA9IHNjb3BlLmRlZihcbiAgICAgICAgICBGUkFNRUJVRkZFUl9TVEFURSwgJy5nZXRGcmFtZWJ1ZmZlcignLCBGUkFNRUJVRkZFUl9GVU5DLCAnKScpO1xuXG4gICAgICAgIGNoZWNrJDEub3B0aW9uYWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGVudi5hc3NlcnQoc2NvcGUsXG4gICAgICAgICAgICAnIScgKyBGUkFNRUJVRkZFUl9GVU5DICsgJ3x8JyArIEZSQU1FQlVGRkVSLFxuICAgICAgICAgICAgJ2ludmFsaWQgZnJhbWVidWZmZXIgb2JqZWN0Jyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNjb3BlLnNldChcbiAgICAgICAgICBGUkFNRUJVRkZFUl9TVEFURSxcbiAgICAgICAgICAnLm5leHQnLFxuICAgICAgICAgIEZSQU1FQlVGRkVSKTtcbiAgICAgICAgdmFyIENPTlRFWFQgPSBzaGFyZWQuY29udGV4dDtcbiAgICAgICAgc2NvcGUuc2V0KFxuICAgICAgICAgIENPTlRFWFQsXG4gICAgICAgICAgJy4nICsgU19GUkFNRUJVRkZFUl9XSURUSCxcbiAgICAgICAgICBGUkFNRUJVRkZFUiArICc/JyArIEZSQU1FQlVGRkVSICsgJy53aWR0aDonICtcbiAgICAgICAgICBDT05URVhUICsgJy4nICsgU19EUkFXSU5HQlVGRkVSX1dJRFRIKTtcbiAgICAgICAgc2NvcGUuc2V0KFxuICAgICAgICAgIENPTlRFWFQsXG4gICAgICAgICAgJy4nICsgU19GUkFNRUJVRkZFUl9IRUlHSFQsXG4gICAgICAgICAgRlJBTUVCVUZGRVIgK1xuICAgICAgICAgICc/JyArIEZSQU1FQlVGRkVSICsgJy5oZWlnaHQ6JyArXG4gICAgICAgICAgQ09OVEVYVCArICcuJyArIFNfRFJBV0lOR0JVRkZFUl9IRUlHSFQpO1xuICAgICAgICByZXR1cm4gRlJBTUVCVUZGRVJcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VWaWV3cG9ydFNjaXNzb3IgKG9wdGlvbnMsIGZyYW1lYnVmZmVyLCBlbnYpIHtcbiAgICB2YXIgc3RhdGljT3B0aW9ucyA9IG9wdGlvbnMuc3RhdGljO1xuICAgIHZhciBkeW5hbWljT3B0aW9ucyA9IG9wdGlvbnMuZHluYW1pYztcblxuICAgIGZ1bmN0aW9uIHBhcnNlQm94IChwYXJhbSkge1xuICAgICAgaWYgKHBhcmFtIGluIHN0YXRpY09wdGlvbnMpIHtcbiAgICAgICAgdmFyIGJveCA9IHN0YXRpY09wdGlvbnNbcGFyYW1dO1xuICAgICAgICBjaGVjayQxLmNvbW1hbmRUeXBlKGJveCwgJ29iamVjdCcsICdpbnZhbGlkICcgKyBwYXJhbSwgZW52LmNvbW1hbmRTdHIpO1xuXG4gICAgICAgIHZhciBpc1N0YXRpYyA9IHRydWU7XG4gICAgICAgIHZhciB4ID0gYm94LnggfCAwO1xuICAgICAgICB2YXIgeSA9IGJveC55IHwgMDtcbiAgICAgICAgdmFyIHcsIGg7XG4gICAgICAgIGlmICgnd2lkdGgnIGluIGJveCkge1xuICAgICAgICAgIHcgPSBib3gud2lkdGggfCAwO1xuICAgICAgICAgIGNoZWNrJDEuY29tbWFuZCh3ID49IDAsICdpbnZhbGlkICcgKyBwYXJhbSwgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlzU3RhdGljID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdoZWlnaHQnIGluIGJveCkge1xuICAgICAgICAgIGggPSBib3guaGVpZ2h0IHwgMDtcbiAgICAgICAgICBjaGVjayQxLmNvbW1hbmQoaCA+PSAwLCAnaW52YWxpZCAnICsgcGFyYW0sIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpc1N0YXRpYyA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBEZWNsYXJhdGlvbihcbiAgICAgICAgICAhaXNTdGF0aWMgJiYgZnJhbWVidWZmZXIgJiYgZnJhbWVidWZmZXIudGhpc0RlcCxcbiAgICAgICAgICAhaXNTdGF0aWMgJiYgZnJhbWVidWZmZXIgJiYgZnJhbWVidWZmZXIuY29udGV4dERlcCxcbiAgICAgICAgICAhaXNTdGF0aWMgJiYgZnJhbWVidWZmZXIgJiYgZnJhbWVidWZmZXIucHJvcERlcCxcbiAgICAgICAgICBmdW5jdGlvbiAoZW52LCBzY29wZSkge1xuICAgICAgICAgICAgdmFyIENPTlRFWFQgPSBlbnYuc2hhcmVkLmNvbnRleHQ7XG4gICAgICAgICAgICB2YXIgQk9YX1cgPSB3O1xuICAgICAgICAgICAgaWYgKCEoJ3dpZHRoJyBpbiBib3gpKSB7XG4gICAgICAgICAgICAgIEJPWF9XID0gc2NvcGUuZGVmKENPTlRFWFQsICcuJywgU19GUkFNRUJVRkZFUl9XSURUSCwgJy0nLCB4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBCT1hfSCA9IGg7XG4gICAgICAgICAgICBpZiAoISgnaGVpZ2h0JyBpbiBib3gpKSB7XG4gICAgICAgICAgICAgIEJPWF9IID0gc2NvcGUuZGVmKENPTlRFWFQsICcuJywgU19GUkFNRUJVRkZFUl9IRUlHSFQsICctJywgeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW3gsIHksIEJPWF9XLCBCT1hfSF1cbiAgICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChwYXJhbSBpbiBkeW5hbWljT3B0aW9ucykge1xuICAgICAgICB2YXIgZHluQm94ID0gZHluYW1pY09wdGlvbnNbcGFyYW1dO1xuICAgICAgICB2YXIgcmVzdWx0ID0gY3JlYXRlRHluYW1pY0RlY2woZHluQm94LCBmdW5jdGlvbiAoZW52LCBzY29wZSkge1xuICAgICAgICAgIHZhciBCT1ggPSBlbnYuaW52b2tlKHNjb3BlLCBkeW5Cb3gpO1xuXG4gICAgICAgICAgY2hlY2skMS5vcHRpb25hbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbnYuYXNzZXJ0KHNjb3BlLFxuICAgICAgICAgICAgICBCT1ggKyAnJiZ0eXBlb2YgJyArIEJPWCArICc9PT1cIm9iamVjdFwiJyxcbiAgICAgICAgICAgICAgJ2ludmFsaWQgJyArIHBhcmFtKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHZhciBDT05URVhUID0gZW52LnNoYXJlZC5jb250ZXh0O1xuICAgICAgICAgIHZhciBCT1hfWCA9IHNjb3BlLmRlZihCT1gsICcueHwwJyk7XG4gICAgICAgICAgdmFyIEJPWF9ZID0gc2NvcGUuZGVmKEJPWCwgJy55fDAnKTtcbiAgICAgICAgICB2YXIgQk9YX1cgPSBzY29wZS5kZWYoXG4gICAgICAgICAgICAnXCJ3aWR0aFwiIGluICcsIEJPWCwgJz8nLCBCT1gsICcud2lkdGh8MDonLFxuICAgICAgICAgICAgJygnLCBDT05URVhULCAnLicsIFNfRlJBTUVCVUZGRVJfV0lEVEgsICctJywgQk9YX1gsICcpJyk7XG4gICAgICAgICAgdmFyIEJPWF9IID0gc2NvcGUuZGVmKFxuICAgICAgICAgICAgJ1wiaGVpZ2h0XCIgaW4gJywgQk9YLCAnPycsIEJPWCwgJy5oZWlnaHR8MDonLFxuICAgICAgICAgICAgJygnLCBDT05URVhULCAnLicsIFNfRlJBTUVCVUZGRVJfSEVJR0hULCAnLScsIEJPWF9ZLCAnKScpO1xuXG4gICAgICAgICAgY2hlY2skMS5vcHRpb25hbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbnYuYXNzZXJ0KHNjb3BlLFxuICAgICAgICAgICAgICBCT1hfVyArICc+PTAmJicgK1xuICAgICAgICAgICAgICBCT1hfSCArICc+PTAnLFxuICAgICAgICAgICAgICAnaW52YWxpZCAnICsgcGFyYW0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIFtCT1hfWCwgQk9YX1ksIEJPWF9XLCBCT1hfSF1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChmcmFtZWJ1ZmZlcikge1xuICAgICAgICAgIHJlc3VsdC50aGlzRGVwID0gcmVzdWx0LnRoaXNEZXAgfHwgZnJhbWVidWZmZXIudGhpc0RlcDtcbiAgICAgICAgICByZXN1bHQuY29udGV4dERlcCA9IHJlc3VsdC5jb250ZXh0RGVwIHx8IGZyYW1lYnVmZmVyLmNvbnRleHREZXA7XG4gICAgICAgICAgcmVzdWx0LnByb3BEZXAgPSByZXN1bHQucHJvcERlcCB8fCBmcmFtZWJ1ZmZlci5wcm9wRGVwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH0gZWxzZSBpZiAoZnJhbWVidWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEZWNsYXJhdGlvbihcbiAgICAgICAgICBmcmFtZWJ1ZmZlci50aGlzRGVwLFxuICAgICAgICAgIGZyYW1lYnVmZmVyLmNvbnRleHREZXAsXG4gICAgICAgICAgZnJhbWVidWZmZXIucHJvcERlcCxcbiAgICAgICAgICBmdW5jdGlvbiAoZW52LCBzY29wZSkge1xuICAgICAgICAgICAgdmFyIENPTlRFWFQgPSBlbnYuc2hhcmVkLmNvbnRleHQ7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAwLCAwLFxuICAgICAgICAgICAgICBzY29wZS5kZWYoQ09OVEVYVCwgJy4nLCBTX0ZSQU1FQlVGRkVSX1dJRFRIKSxcbiAgICAgICAgICAgICAgc2NvcGUuZGVmKENPTlRFWFQsICcuJywgU19GUkFNRUJVRkZFUl9IRUlHSFQpXVxuICAgICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciB2aWV3cG9ydCA9IHBhcnNlQm94KFNfVklFV1BPUlQpO1xuXG4gICAgaWYgKHZpZXdwb3J0KSB7XG4gICAgICB2YXIgcHJldlZpZXdwb3J0ID0gdmlld3BvcnQ7XG4gICAgICB2aWV3cG9ydCA9IG5ldyBEZWNsYXJhdGlvbihcbiAgICAgICAgdmlld3BvcnQudGhpc0RlcCxcbiAgICAgICAgdmlld3BvcnQuY29udGV4dERlcCxcbiAgICAgICAgdmlld3BvcnQucHJvcERlcCxcbiAgICAgICAgZnVuY3Rpb24gKGVudiwgc2NvcGUpIHtcbiAgICAgICAgICB2YXIgVklFV1BPUlQgPSBwcmV2Vmlld3BvcnQuYXBwZW5kKGVudiwgc2NvcGUpO1xuICAgICAgICAgIHZhciBDT05URVhUID0gZW52LnNoYXJlZC5jb250ZXh0O1xuICAgICAgICAgIHNjb3BlLnNldChcbiAgICAgICAgICAgIENPTlRFWFQsXG4gICAgICAgICAgICAnLicgKyBTX1ZJRVdQT1JUX1dJRFRILFxuICAgICAgICAgICAgVklFV1BPUlRbMl0pO1xuICAgICAgICAgIHNjb3BlLnNldChcbiAgICAgICAgICAgIENPTlRFWFQsXG4gICAgICAgICAgICAnLicgKyBTX1ZJRVdQT1JUX0hFSUdIVCxcbiAgICAgICAgICAgIFZJRVdQT1JUWzNdKTtcbiAgICAgICAgICByZXR1cm4gVklFV1BPUlRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHZpZXdwb3J0OiB2aWV3cG9ydCxcbiAgICAgIHNjaXNzb3JfYm94OiBwYXJzZUJveChTX1NDSVNTT1JfQk9YKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlUHJvZ3JhbSAob3B0aW9ucykge1xuICAgIHZhciBzdGF0aWNPcHRpb25zID0gb3B0aW9ucy5zdGF0aWM7XG4gICAgdmFyIGR5bmFtaWNPcHRpb25zID0gb3B0aW9ucy5keW5hbWljO1xuXG4gICAgZnVuY3Rpb24gcGFyc2VTaGFkZXIgKG5hbWUpIHtcbiAgICAgIGlmIChuYW1lIGluIHN0YXRpY09wdGlvbnMpIHtcbiAgICAgICAgdmFyIGlkID0gc3RyaW5nU3RvcmUuaWQoc3RhdGljT3B0aW9uc1tuYW1lXSk7XG4gICAgICAgIGNoZWNrJDEub3B0aW9uYWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNoYWRlclN0YXRlLnNoYWRlcihzaGFkZXJUeXBlW25hbWVdLCBpZCwgY2hlY2skMS5ndWVzc0NvbW1hbmQoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgcmVzdWx0ID0gY3JlYXRlU3RhdGljRGVjbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGlkXG4gICAgICAgIH0pO1xuICAgICAgICByZXN1bHQuaWQgPSBpZDtcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfSBlbHNlIGlmIChuYW1lIGluIGR5bmFtaWNPcHRpb25zKSB7XG4gICAgICAgIHZhciBkeW4gPSBkeW5hbWljT3B0aW9uc1tuYW1lXTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUR5bmFtaWNEZWNsKGR5biwgZnVuY3Rpb24gKGVudiwgc2NvcGUpIHtcbiAgICAgICAgICB2YXIgc3RyID0gZW52Lmludm9rZShzY29wZSwgZHluKTtcbiAgICAgICAgICB2YXIgaWQgPSBzY29wZS5kZWYoZW52LnNoYXJlZC5zdHJpbmdzLCAnLmlkKCcsIHN0ciwgJyknKTtcbiAgICAgICAgICBjaGVjayQxLm9wdGlvbmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNjb3BlKFxuICAgICAgICAgICAgICBlbnYuc2hhcmVkLnNoYWRlciwgJy5zaGFkZXIoJyxcbiAgICAgICAgICAgICAgc2hhZGVyVHlwZVtuYW1lXSwgJywnLFxuICAgICAgICAgICAgICBpZCwgJywnLFxuICAgICAgICAgICAgICBlbnYuY29tbWFuZCwgJyk7Jyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGlkXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIHZhciBmcmFnID0gcGFyc2VTaGFkZXIoU19GUkFHKTtcbiAgICB2YXIgdmVydCA9IHBhcnNlU2hhZGVyKFNfVkVSVCk7XG5cbiAgICB2YXIgcHJvZ3JhbSA9IG51bGw7XG4gICAgdmFyIHByb2dWYXI7XG4gICAgaWYgKGlzU3RhdGljKGZyYWcpICYmIGlzU3RhdGljKHZlcnQpKSB7XG4gICAgICBwcm9ncmFtID0gc2hhZGVyU3RhdGUucHJvZ3JhbSh2ZXJ0LmlkLCBmcmFnLmlkKTtcbiAgICAgIHByb2dWYXIgPSBjcmVhdGVTdGF0aWNEZWNsKGZ1bmN0aW9uIChlbnYsIHNjb3BlKSB7XG4gICAgICAgIHJldHVybiBlbnYubGluayhwcm9ncmFtKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb2dWYXIgPSBuZXcgRGVjbGFyYXRpb24oXG4gICAgICAgIChmcmFnICYmIGZyYWcudGhpc0RlcCkgfHwgKHZlcnQgJiYgdmVydC50aGlzRGVwKSxcbiAgICAgICAgKGZyYWcgJiYgZnJhZy5jb250ZXh0RGVwKSB8fCAodmVydCAmJiB2ZXJ0LmNvbnRleHREZXApLFxuICAgICAgICAoZnJhZyAmJiBmcmFnLnByb3BEZXApIHx8ICh2ZXJ0ICYmIHZlcnQucHJvcERlcCksXG4gICAgICAgIGZ1bmN0aW9uIChlbnYsIHNjb3BlKSB7XG4gICAgICAgICAgdmFyIFNIQURFUl9TVEFURSA9IGVudi5zaGFyZWQuc2hhZGVyO1xuICAgICAgICAgIHZhciBmcmFnSWQ7XG4gICAgICAgICAgaWYgKGZyYWcpIHtcbiAgICAgICAgICAgIGZyYWdJZCA9IGZyYWcuYXBwZW5kKGVudiwgc2NvcGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcmFnSWQgPSBzY29wZS5kZWYoU0hBREVSX1NUQVRFLCAnLicsIFNfRlJBRyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2ZXJ0SWQ7XG4gICAgICAgICAgaWYgKHZlcnQpIHtcbiAgICAgICAgICAgIHZlcnRJZCA9IHZlcnQuYXBwZW5kKGVudiwgc2NvcGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2ZXJ0SWQgPSBzY29wZS5kZWYoU0hBREVSX1NUQVRFLCAnLicsIFNfVkVSVCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBwcm9nRGVmID0gU0hBREVSX1NUQVRFICsgJy5wcm9ncmFtKCcgKyB2ZXJ0SWQgKyAnLCcgKyBmcmFnSWQ7XG4gICAgICAgICAgY2hlY2skMS5vcHRpb25hbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwcm9nRGVmICs9ICcsJyArIGVudi5jb21tYW5kO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBzY29wZS5kZWYocHJvZ0RlZiArICcpJylcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGZyYWc6IGZyYWcsXG4gICAgICB2ZXJ0OiB2ZXJ0LFxuICAgICAgcHJvZ1ZhcjogcHJvZ1ZhcixcbiAgICAgIHByb2dyYW06IHByb2dyYW1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZURyYXcgKG9wdGlvbnMsIGVudikge1xuICAgIHZhciBzdGF0aWNPcHRpb25zID0gb3B0aW9ucy5zdGF0aWM7XG4gICAgdmFyIGR5bmFtaWNPcHRpb25zID0gb3B0aW9ucy5keW5hbWljO1xuXG4gICAgZnVuY3Rpb24gcGFyc2VFbGVtZW50cyAoKSB7XG4gICAgICBpZiAoU19FTEVNRU5UUyBpbiBzdGF0aWNPcHRpb25zKSB7XG4gICAgICAgIHZhciBlbGVtZW50cyA9IHN0YXRpY09wdGlvbnNbU19FTEVNRU5UU107XG4gICAgICAgIGlmIChpc0J1ZmZlckFyZ3MoZWxlbWVudHMpKSB7XG4gICAgICAgICAgZWxlbWVudHMgPSBlbGVtZW50U3RhdGUuZ2V0RWxlbWVudHMoZWxlbWVudFN0YXRlLmNyZWF0ZShlbGVtZW50cywgdHJ1ZSkpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnRzKSB7XG4gICAgICAgICAgZWxlbWVudHMgPSBlbGVtZW50U3RhdGUuZ2V0RWxlbWVudHMoZWxlbWVudHMpO1xuICAgICAgICAgIGNoZWNrJDEuY29tbWFuZChlbGVtZW50cywgJ2ludmFsaWQgZWxlbWVudHMnLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlc3VsdCA9IGNyZWF0ZVN0YXRpY0RlY2woZnVuY3Rpb24gKGVudiwgc2NvcGUpIHtcbiAgICAgICAgICBpZiAoZWxlbWVudHMpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBlbnYubGluayhlbGVtZW50cyk7XG4gICAgICAgICAgICBlbnYuRUxFTUVOVFMgPSByZXN1bHQ7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgICAgfVxuICAgICAgICAgIGVudi5FTEVNRU5UUyA9IG51bGw7XG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfSk7XG4gICAgICAgIHJlc3VsdC52YWx1ZSA9IGVsZW1lbnRzO1xuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICB9IGVsc2UgaWYgKFNfRUxFTUVOVFMgaW4gZHluYW1pY09wdGlvbnMpIHtcbiAgICAgICAgdmFyIGR5biA9IGR5bmFtaWNPcHRpb25zW1NfRUxFTUVOVFNdO1xuICAgICAgICByZXR1cm4gY3JlYXRlRHluYW1pY0RlY2woZHluLCBmdW5jdGlvbiAoZW52LCBzY29wZSkge1xuICAgICAgICAgIHZhciBzaGFyZWQgPSBlbnYuc2hhcmVkO1xuXG4gICAgICAgICAgdmFyIElTX0JVRkZFUl9BUkdTID0gc2hhcmVkLmlzQnVmZmVyQXJncztcbiAgICAgICAgICB2YXIgRUxFTUVOVF9TVEFURSA9IHNoYXJlZC5lbGVtZW50cztcblxuICAgICAgICAgIHZhciBlbGVtZW50RGVmbiA9IGVudi5pbnZva2Uoc2NvcGUsIGR5bik7XG4gICAgICAgICAgdmFyIGVsZW1lbnRzID0gc2NvcGUuZGVmKCdudWxsJyk7XG4gICAgICAgICAgdmFyIGVsZW1lbnRTdHJlYW0gPSBzY29wZS5kZWYoSVNfQlVGRkVSX0FSR1MsICcoJywgZWxlbWVudERlZm4sICcpJyk7XG5cbiAgICAgICAgICB2YXIgaWZ0ZSA9IGVudi5jb25kKGVsZW1lbnRTdHJlYW0pXG4gICAgICAgICAgICAudGhlbihlbGVtZW50cywgJz0nLCBFTEVNRU5UX1NUQVRFLCAnLmNyZWF0ZVN0cmVhbSgnLCBlbGVtZW50RGVmbiwgJyk7JylcbiAgICAgICAgICAgIC5lbHNlKGVsZW1lbnRzLCAnPScsIEVMRU1FTlRfU1RBVEUsICcuZ2V0RWxlbWVudHMoJywgZWxlbWVudERlZm4sICcpOycpO1xuXG4gICAgICAgICAgY2hlY2skMS5vcHRpb25hbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbnYuYXNzZXJ0KGlmdGUuZWxzZSxcbiAgICAgICAgICAgICAgJyEnICsgZWxlbWVudERlZm4gKyAnfHwnICsgZWxlbWVudHMsXG4gICAgICAgICAgICAgICdpbnZhbGlkIGVsZW1lbnRzJyk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBzY29wZS5lbnRyeShpZnRlKTtcbiAgICAgICAgICBzY29wZS5leGl0KFxuICAgICAgICAgICAgZW52LmNvbmQoZWxlbWVudFN0cmVhbSlcbiAgICAgICAgICAgICAgLnRoZW4oRUxFTUVOVF9TVEFURSwgJy5kZXN0cm95U3RyZWFtKCcsIGVsZW1lbnRzLCAnKTsnKSk7XG5cbiAgICAgICAgICBlbnYuRUxFTUVOVFMgPSBlbGVtZW50cztcblxuICAgICAgICAgIHJldHVybiBlbGVtZW50c1xuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIHZhciBlbGVtZW50cyA9IHBhcnNlRWxlbWVudHMoKTtcblxuICAgIGZ1bmN0aW9uIHBhcnNlUHJpbWl0aXZlICgpIHtcbiAgICAgIGlmIChTX1BSSU1JVElWRSBpbiBzdGF0aWNPcHRpb25zKSB7XG4gICAgICAgIHZhciBwcmltaXRpdmUgPSBzdGF0aWNPcHRpb25zW1NfUFJJTUlUSVZFXTtcbiAgICAgICAgY2hlY2skMS5jb21tYW5kUGFyYW1ldGVyKHByaW1pdGl2ZSwgcHJpbVR5cGVzLCAnaW52YWxpZCBwcmltaXR2ZScsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVN0YXRpY0RlY2woZnVuY3Rpb24gKGVudiwgc2NvcGUpIHtcbiAgICAgICAgICByZXR1cm4gcHJpbVR5cGVzW3ByaW1pdGl2ZV1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAoU19QUklNSVRJVkUgaW4gZHluYW1pY09wdGlvbnMpIHtcbiAgICAgICAgdmFyIGR5blByaW1pdGl2ZSA9IGR5bmFtaWNPcHRpb25zW1NfUFJJTUlUSVZFXTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUR5bmFtaWNEZWNsKGR5blByaW1pdGl2ZSwgZnVuY3Rpb24gKGVudiwgc2NvcGUpIHtcbiAgICAgICAgICB2YXIgUFJJTV9UWVBFUyA9IGVudi5jb25zdGFudHMucHJpbVR5cGVzO1xuICAgICAgICAgIHZhciBwcmltID0gZW52Lmludm9rZShzY29wZSwgZHluUHJpbWl0aXZlKTtcbiAgICAgICAgICBjaGVjayQxLm9wdGlvbmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVudi5hc3NlcnQoc2NvcGUsXG4gICAgICAgICAgICAgIHByaW0gKyAnIGluICcgKyBQUklNX1RZUEVTLFxuICAgICAgICAgICAgICAnaW52YWxpZCBwcmltaXRpdmUsIG11c3QgYmUgb25lIG9mICcgKyBPYmplY3Qua2V5cyhwcmltVHlwZXMpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gc2NvcGUuZGVmKFBSSU1fVFlQRVMsICdbJywgcHJpbSwgJ10nKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChlbGVtZW50cykge1xuICAgICAgICBpZiAoaXNTdGF0aWMoZWxlbWVudHMpKSB7XG4gICAgICAgICAgaWYgKGVsZW1lbnRzLnZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlU3RhdGljRGVjbChmdW5jdGlvbiAoZW52LCBzY29wZSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2NvcGUuZGVmKGVudi5FTEVNRU5UUywgJy5wcmltVHlwZScpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlU3RhdGljRGVjbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBHTF9UUklBTkdMRVMkMVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBEZWNsYXJhdGlvbihcbiAgICAgICAgICAgIGVsZW1lbnRzLnRoaXNEZXAsXG4gICAgICAgICAgICBlbGVtZW50cy5jb250ZXh0RGVwLFxuICAgICAgICAgICAgZWxlbWVudHMucHJvcERlcCxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlbnYsIHNjb3BlKSB7XG4gICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGVudi5FTEVNRU5UUztcbiAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLmRlZihlbGVtZW50cywgJz8nLCBlbGVtZW50cywgJy5wcmltVHlwZTonLCBHTF9UUklBTkdMRVMkMSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VQYXJhbSAocGFyYW0sIGlzT2Zmc2V0KSB7XG4gICAgICBpZiAocGFyYW0gaW4gc3RhdGljT3B0aW9ucykge1xuICAgICAgICB2YXIgdmFsdWUgPSBzdGF0aWNPcHRpb25zW3BhcmFtXSB8IDA7XG4gICAgICAgIGNoZWNrJDEuY29tbWFuZCghaXNPZmZzZXQgfHwgdmFsdWUgPj0gMCwgJ2ludmFsaWQgJyArIHBhcmFtLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgIHJldHVybiBjcmVhdGVTdGF0aWNEZWNsKGZ1bmN0aW9uIChlbnYsIHNjb3BlKSB7XG4gICAgICAgICAgaWYgKGlzT2Zmc2V0KSB7XG4gICAgICAgICAgICBlbnYuT0ZGU0VUID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChwYXJhbSBpbiBkeW5hbWljT3B0aW9ucykge1xuICAgICAgICB2YXIgZHluVmFsdWUgPSBkeW5hbWljT3B0aW9uc1twYXJhbV07XG4gICAgICAgIHJldHVybiBjcmVhdGVEeW5hbWljRGVjbChkeW5WYWx1ZSwgZnVuY3Rpb24gKGVudiwgc2NvcGUpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gZW52Lmludm9rZShzY29wZSwgZHluVmFsdWUpO1xuICAgICAgICAgIGlmIChpc09mZnNldCkge1xuICAgICAgICAgICAgZW52Lk9GRlNFVCA9IHJlc3VsdDtcbiAgICAgICAgICAgIGNoZWNrJDEub3B0aW9uYWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBlbnYuYXNzZXJ0KHNjb3BlLFxuICAgICAgICAgICAgICAgIHJlc3VsdCArICc+PTAnLFxuICAgICAgICAgICAgICAgICdpbnZhbGlkICcgKyBwYXJhbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChpc09mZnNldCAmJiBlbGVtZW50cykge1xuICAgICAgICByZXR1cm4gY3JlYXRlU3RhdGljRGVjbChmdW5jdGlvbiAoZW52LCBzY29wZSkge1xuICAgICAgICAgIGVudi5PRkZTRVQgPSAnMCc7XG4gICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgdmFyIE9GRlNFVCA9IHBhcnNlUGFyYW0oU19PRkZTRVQsIHRydWUpO1xuXG4gICAgZnVuY3Rpb24gcGFyc2VWZXJ0Q291bnQgKCkge1xuICAgICAgaWYgKFNfQ09VTlQgaW4gc3RhdGljT3B0aW9ucykge1xuICAgICAgICB2YXIgY291bnQgPSBzdGF0aWNPcHRpb25zW1NfQ09VTlRdIHwgMDtcbiAgICAgICAgY2hlY2skMS5jb21tYW5kKFxuICAgICAgICAgIHR5cGVvZiBjb3VudCA9PT0gJ251bWJlcicgJiYgY291bnQgPj0gMCwgJ2ludmFsaWQgdmVydGV4IGNvdW50JywgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICByZXR1cm4gY3JlYXRlU3RhdGljRGVjbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNvdW50XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKFNfQ09VTlQgaW4gZHluYW1pY09wdGlvbnMpIHtcbiAgICAgICAgdmFyIGR5bkNvdW50ID0gZHluYW1pY09wdGlvbnNbU19DT1VOVF07XG4gICAgICAgIHJldHVybiBjcmVhdGVEeW5hbWljRGVjbChkeW5Db3VudCwgZnVuY3Rpb24gKGVudiwgc2NvcGUpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gZW52Lmludm9rZShzY29wZSwgZHluQ291bnQpO1xuICAgICAgICAgIGNoZWNrJDEub3B0aW9uYWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZW52LmFzc2VydChzY29wZSxcbiAgICAgICAgICAgICAgJ3R5cGVvZiAnICsgcmVzdWx0ICsgJz09PVwibnVtYmVyXCImJicgK1xuICAgICAgICAgICAgICByZXN1bHQgKyAnPj0wJiYnICtcbiAgICAgICAgICAgICAgcmVzdWx0ICsgJz09PSgnICsgcmVzdWx0ICsgJ3wwKScsXG4gICAgICAgICAgICAgICdpbnZhbGlkIHZlcnRleCBjb3VudCcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAoZWxlbWVudHMpIHtcbiAgICAgICAgaWYgKGlzU3RhdGljKGVsZW1lbnRzKSkge1xuICAgICAgICAgIGlmIChlbGVtZW50cykge1xuICAgICAgICAgICAgaWYgKE9GRlNFVCkge1xuICAgICAgICAgICAgICByZXR1cm4gbmV3IERlY2xhcmF0aW9uKFxuICAgICAgICAgICAgICAgIE9GRlNFVC50aGlzRGVwLFxuICAgICAgICAgICAgICAgIE9GRlNFVC5jb250ZXh0RGVwLFxuICAgICAgICAgICAgICAgIE9GRlNFVC5wcm9wRGVwLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlbnYsIHNjb3BlKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gc2NvcGUuZGVmKFxuICAgICAgICAgICAgICAgICAgICBlbnYuRUxFTUVOVFMsICcudmVydENvdW50LScsIGVudi5PRkZTRVQpO1xuXG4gICAgICAgICAgICAgICAgICBjaGVjayQxLm9wdGlvbmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZW52LmFzc2VydChzY29wZSxcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKyAnPj0wJyxcbiAgICAgICAgICAgICAgICAgICAgICAnaW52YWxpZCB2ZXJ0ZXggb2Zmc2V0L2VsZW1lbnQgYnVmZmVyIHRvbyBzbWFsbCcpO1xuICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVN0YXRpY0RlY2woZnVuY3Rpb24gKGVudiwgc2NvcGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGUuZGVmKGVudi5FTEVNRU5UUywgJy52ZXJ0Q291bnQnKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gY3JlYXRlU3RhdGljRGVjbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiAtMVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjaGVjayQxLm9wdGlvbmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmVzdWx0Lk1JU1NJTkcgPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB2YXJpYWJsZSA9IG5ldyBEZWNsYXJhdGlvbihcbiAgICAgICAgICAgIGVsZW1lbnRzLnRoaXNEZXAgfHwgT0ZGU0VULnRoaXNEZXAsXG4gICAgICAgICAgICBlbGVtZW50cy5jb250ZXh0RGVwIHx8IE9GRlNFVC5jb250ZXh0RGVwLFxuICAgICAgICAgICAgZWxlbWVudHMucHJvcERlcCB8fCBPRkZTRVQucHJvcERlcCxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlbnYsIHNjb3BlKSB7XG4gICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGVudi5FTEVNRU5UUztcbiAgICAgICAgICAgICAgaWYgKGVudi5PRkZTRVQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGUuZGVmKGVsZW1lbnRzLCAnPycsIGVsZW1lbnRzLCAnLnZlcnRDb3VudC0nLFxuICAgICAgICAgICAgICAgICAgZW52Lk9GRlNFVCwgJzotMScpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLmRlZihlbGVtZW50cywgJz8nLCBlbGVtZW50cywgJy52ZXJ0Q291bnQ6LTEnKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgY2hlY2skMS5vcHRpb25hbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXJpYWJsZS5EWU5BTUlDID0gdHJ1ZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gdmFyaWFibGVcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZWxlbWVudHM6IGVsZW1lbnRzLFxuICAgICAgcHJpbWl0aXZlOiBwYXJzZVByaW1pdGl2ZSgpLFxuICAgICAgY291bnQ6IHBhcnNlVmVydENvdW50KCksXG4gICAgICBpbnN0YW5jZXM6IHBhcnNlUGFyYW0oU19JTlNUQU5DRVMsIGZhbHNlKSxcbiAgICAgIG9mZnNldDogT0ZGU0VUXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VHTFN0YXRlIChvcHRpb25zLCBlbnYpIHtcbiAgICB2YXIgc3RhdGljT3B0aW9ucyA9IG9wdGlvbnMuc3RhdGljO1xuICAgIHZhciBkeW5hbWljT3B0aW9ucyA9IG9wdGlvbnMuZHluYW1pYztcblxuICAgIHZhciBTVEFURSA9IHt9O1xuXG4gICAgR0xfU1RBVEVfTkFNRVMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgICAgdmFyIHBhcmFtID0gcHJvcE5hbWUocHJvcCk7XG5cbiAgICAgIGZ1bmN0aW9uIHBhcnNlUGFyYW0gKHBhcnNlU3RhdGljLCBwYXJzZUR5bmFtaWMpIHtcbiAgICAgICAgaWYgKHByb3AgaW4gc3RhdGljT3B0aW9ucykge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IHBhcnNlU3RhdGljKHN0YXRpY09wdGlvbnNbcHJvcF0pO1xuICAgICAgICAgIFNUQVRFW3BhcmFtXSA9IGNyZWF0ZVN0YXRpY0RlY2woZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvcCBpbiBkeW5hbWljT3B0aW9ucykge1xuICAgICAgICAgIHZhciBkeW4gPSBkeW5hbWljT3B0aW9uc1twcm9wXTtcbiAgICAgICAgICBTVEFURVtwYXJhbV0gPSBjcmVhdGVEeW5hbWljRGVjbChkeW4sIGZ1bmN0aW9uIChlbnYsIHNjb3BlKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VEeW5hbWljKGVudiwgc2NvcGUsIGVudi5pbnZva2Uoc2NvcGUsIGR5bikpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgIGNhc2UgU19DVUxMX0VOQUJMRTpcbiAgICAgICAgY2FzZSBTX0JMRU5EX0VOQUJMRTpcbiAgICAgICAgY2FzZSBTX0RJVEhFUjpcbiAgICAgICAgY2FzZSBTX1NURU5DSUxfRU5BQkxFOlxuICAgICAgICBjYXNlIFNfREVQVEhfRU5BQkxFOlxuICAgICAgICBjYXNlIFNfU0NJU1NPUl9FTkFCTEU6XG4gICAgICAgIGNhc2UgU19QT0xZR09OX09GRlNFVF9FTkFCTEU6XG4gICAgICAgIGNhc2UgU19TQU1QTEVfQUxQSEE6XG4gICAgICAgIGNhc2UgU19TQU1QTEVfRU5BQkxFOlxuICAgICAgICBjYXNlIFNfREVQVEhfTUFTSzpcbiAgICAgICAgICByZXR1cm4gcGFyc2VQYXJhbShcbiAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmRUeXBlKHZhbHVlLCAnYm9vbGVhbicsIHByb3AsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKGVudiwgc2NvcGUsIHZhbHVlKSB7XG4gICAgICAgICAgICAgIGNoZWNrJDEub3B0aW9uYWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGVudi5hc3NlcnQoc2NvcGUsXG4gICAgICAgICAgICAgICAgICAndHlwZW9mICcgKyB2YWx1ZSArICc9PT1cImJvb2xlYW5cIicsXG4gICAgICAgICAgICAgICAgICAnaW52YWxpZCBmbGFnICcgKyBwcm9wLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgY2FzZSBTX0RFUFRIX0ZVTkM6XG4gICAgICAgICAgcmV0dXJuIHBhcnNlUGFyYW0oXG4gICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgY2hlY2skMS5jb21tYW5kUGFyYW1ldGVyKHZhbHVlLCBjb21wYXJlRnVuY3MsICdpbnZhbGlkICcgKyBwcm9wLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgIHJldHVybiBjb21wYXJlRnVuY3NbdmFsdWVdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKGVudiwgc2NvcGUsIHZhbHVlKSB7XG4gICAgICAgICAgICAgIHZhciBDT01QQVJFX0ZVTkNTID0gZW52LmNvbnN0YW50cy5jb21wYXJlRnVuY3M7XG4gICAgICAgICAgICAgIGNoZWNrJDEub3B0aW9uYWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGVudi5hc3NlcnQoc2NvcGUsXG4gICAgICAgICAgICAgICAgICB2YWx1ZSArICcgaW4gJyArIENPTVBBUkVfRlVOQ1MsXG4gICAgICAgICAgICAgICAgICAnaW52YWxpZCAnICsgcHJvcCArICcsIG11c3QgYmUgb25lIG9mICcgKyBPYmplY3Qua2V5cyhjb21wYXJlRnVuY3MpKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiBzY29wZS5kZWYoQ09NUEFSRV9GVU5DUywgJ1snLCB2YWx1ZSwgJ10nKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICBjYXNlIFNfREVQVEhfUkFOR0U6XG4gICAgICAgICAgcmV0dXJuIHBhcnNlUGFyYW0oXG4gICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgY2hlY2skMS5jb21tYW5kKFxuICAgICAgICAgICAgICAgIGlzQXJyYXlMaWtlKHZhbHVlKSAmJlxuICAgICAgICAgICAgICAgIHZhbHVlLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiB2YWx1ZVswXSA9PT0gJ251bWJlcicgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgdmFsdWVbMV0gPT09ICdudW1iZXInICYmXG4gICAgICAgICAgICAgICAgdmFsdWVbMF0gPD0gdmFsdWVbMV0sXG4gICAgICAgICAgICAgICAgJ2RlcHRoIHJhbmdlIGlzIDJkIGFycmF5JyxcbiAgICAgICAgICAgICAgICBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlbnYsIHNjb3BlLCB2YWx1ZSkge1xuICAgICAgICAgICAgICBjaGVjayQxLm9wdGlvbmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlbnYuYXNzZXJ0KHNjb3BlLFxuICAgICAgICAgICAgICAgICAgZW52LnNoYXJlZC5pc0FycmF5TGlrZSArICcoJyArIHZhbHVlICsgJykmJicgK1xuICAgICAgICAgICAgICAgICAgdmFsdWUgKyAnLmxlbmd0aD09PTImJicgK1xuICAgICAgICAgICAgICAgICAgJ3R5cGVvZiAnICsgdmFsdWUgKyAnWzBdPT09XCJudW1iZXJcIiYmJyArXG4gICAgICAgICAgICAgICAgICAndHlwZW9mICcgKyB2YWx1ZSArICdbMV09PT1cIm51bWJlclwiJiYnICtcbiAgICAgICAgICAgICAgICAgIHZhbHVlICsgJ1swXTw9JyArIHZhbHVlICsgJ1sxXScsXG4gICAgICAgICAgICAgICAgICAnZGVwdGggcmFuZ2UgbXVzdCBiZSBhIDJkIGFycmF5Jyk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIHZhciBaX05FQVIgPSBzY29wZS5kZWYoJysnLCB2YWx1ZSwgJ1swXScpO1xuICAgICAgICAgICAgICB2YXIgWl9GQVIgPSBzY29wZS5kZWYoJysnLCB2YWx1ZSwgJ1sxXScpO1xuICAgICAgICAgICAgICByZXR1cm4gW1pfTkVBUiwgWl9GQVJdXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIGNhc2UgU19CTEVORF9GVU5DOlxuICAgICAgICAgIHJldHVybiBwYXJzZVBhcmFtKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZFR5cGUodmFsdWUsICdvYmplY3QnLCAnYmxlbmQuZnVuYycsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgdmFyIHNyY1JHQiA9ICgnc3JjUkdCJyBpbiB2YWx1ZSA/IHZhbHVlLnNyY1JHQiA6IHZhbHVlLnNyYyk7XG4gICAgICAgICAgICAgIHZhciBzcmNBbHBoYSA9ICgnc3JjQWxwaGEnIGluIHZhbHVlID8gdmFsdWUuc3JjQWxwaGEgOiB2YWx1ZS5zcmMpO1xuICAgICAgICAgICAgICB2YXIgZHN0UkdCID0gKCdkc3RSR0InIGluIHZhbHVlID8gdmFsdWUuZHN0UkdCIDogdmFsdWUuZHN0KTtcbiAgICAgICAgICAgICAgdmFyIGRzdEFscGhhID0gKCdkc3RBbHBoYScgaW4gdmFsdWUgPyB2YWx1ZS5kc3RBbHBoYSA6IHZhbHVlLmRzdCk7XG4gICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZFBhcmFtZXRlcihzcmNSR0IsIGJsZW5kRnVuY3MsIHBhcmFtICsgJy5zcmNSR0InLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZFBhcmFtZXRlcihzcmNBbHBoYSwgYmxlbmRGdW5jcywgcGFyYW0gKyAnLnNyY0FscGhhJywgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmRQYXJhbWV0ZXIoZHN0UkdCLCBibGVuZEZ1bmNzLCBwYXJhbSArICcuZHN0UkdCJywgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmRQYXJhbWV0ZXIoZHN0QWxwaGEsIGJsZW5kRnVuY3MsIHBhcmFtICsgJy5kc3RBbHBoYScsIGVudi5jb21tYW5kU3RyKTtcblxuICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmQoXG4gICAgICAgICAgICAgICAgKGludmFsaWRCbGVuZENvbWJpbmF0aW9ucy5pbmRleE9mKHNyY1JHQiArICcsICcgKyBkc3RSR0IpID09PSAtMSksXG4gICAgICAgICAgICAgICAgJ3VuYWxsb3dlZCBibGVuZGluZyBjb21iaW5hdGlvbiAoc3JjUkdCLCBkc3RSR0IpID0gKCcgKyBzcmNSR0IgKyAnLCAnICsgZHN0UkdCICsgJyknLCBlbnYuY29tbWFuZFN0cik7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBibGVuZEZ1bmNzW3NyY1JHQl0sXG4gICAgICAgICAgICAgICAgYmxlbmRGdW5jc1tkc3RSR0JdLFxuICAgICAgICAgICAgICAgIGJsZW5kRnVuY3Nbc3JjQWxwaGFdLFxuICAgICAgICAgICAgICAgIGJsZW5kRnVuY3NbZHN0QWxwaGFdXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoZW52LCBzY29wZSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgdmFyIEJMRU5EX0ZVTkNTID0gZW52LmNvbnN0YW50cy5ibGVuZEZ1bmNzO1xuXG4gICAgICAgICAgICAgIGNoZWNrJDEub3B0aW9uYWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGVudi5hc3NlcnQoc2NvcGUsXG4gICAgICAgICAgICAgICAgICB2YWx1ZSArICcmJnR5cGVvZiAnICsgdmFsdWUgKyAnPT09XCJvYmplY3RcIicsXG4gICAgICAgICAgICAgICAgICAnaW52YWxpZCBibGVuZCBmdW5jLCBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICBmdW5jdGlvbiByZWFkIChwcmVmaXgsIHN1ZmZpeCkge1xuICAgICAgICAgICAgICAgIHZhciBmdW5jID0gc2NvcGUuZGVmKFxuICAgICAgICAgICAgICAgICAgJ1wiJywgcHJlZml4LCBzdWZmaXgsICdcIiBpbiAnLCB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICc/JywgdmFsdWUsICcuJywgcHJlZml4LCBzdWZmaXgsXG4gICAgICAgICAgICAgICAgICAnOicsIHZhbHVlLCAnLicsIHByZWZpeCk7XG5cbiAgICAgICAgICAgICAgICBjaGVjayQxLm9wdGlvbmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIGVudi5hc3NlcnQoc2NvcGUsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmMgKyAnIGluICcgKyBCTEVORF9GVU5DUyxcbiAgICAgICAgICAgICAgICAgICAgJ2ludmFsaWQgJyArIHByb3AgKyAnLicgKyBwcmVmaXggKyBzdWZmaXggKyAnLCBtdXN0IGJlIG9uZSBvZiAnICsgT2JqZWN0LmtleXMoYmxlbmRGdW5jcykpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmNcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBzcmNSR0IgPSByZWFkKCdzcmMnLCAnUkdCJyk7XG4gICAgICAgICAgICAgIHZhciBkc3RSR0IgPSByZWFkKCdkc3QnLCAnUkdCJyk7XG5cbiAgICAgICAgICAgICAgY2hlY2skMS5vcHRpb25hbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIElOVkFMSURfQkxFTkRfQ09NQklOQVRJT05TID0gZW52LmNvbnN0YW50cy5pbnZhbGlkQmxlbmRDb21iaW5hdGlvbnM7XG5cbiAgICAgICAgICAgICAgICBlbnYuYXNzZXJ0KHNjb3BlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgSU5WQUxJRF9CTEVORF9DT01CSU5BVElPTlMgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJy5pbmRleE9mKCcgKyBzcmNSR0IgKyAnK1wiLCBcIisnICsgZHN0UkdCICsgJykgPT09IC0xICcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAndW5hbGxvd2VkIGJsZW5kaW5nIGNvbWJpbmF0aW9uIGZvciAoc3JjUkdCLCBkc3RSR0IpJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICB2YXIgU1JDX1JHQiA9IHNjb3BlLmRlZihCTEVORF9GVU5DUywgJ1snLCBzcmNSR0IsICddJyk7XG4gICAgICAgICAgICAgIHZhciBTUkNfQUxQSEEgPSBzY29wZS5kZWYoQkxFTkRfRlVOQ1MsICdbJywgcmVhZCgnc3JjJywgJ0FscGhhJyksICddJyk7XG4gICAgICAgICAgICAgIHZhciBEU1RfUkdCID0gc2NvcGUuZGVmKEJMRU5EX0ZVTkNTLCAnWycsIGRzdFJHQiwgJ10nKTtcbiAgICAgICAgICAgICAgdmFyIERTVF9BTFBIQSA9IHNjb3BlLmRlZihCTEVORF9GVU5DUywgJ1snLCByZWFkKCdkc3QnLCAnQWxwaGEnKSwgJ10nKTtcblxuICAgICAgICAgICAgICByZXR1cm4gW1NSQ19SR0IsIERTVF9SR0IsIFNSQ19BTFBIQSwgRFNUX0FMUEhBXVxuICAgICAgICAgICAgfSlcblxuICAgICAgICBjYXNlIFNfQkxFTkRfRVFVQVRJT046XG4gICAgICAgICAgcmV0dXJuIHBhcnNlUGFyYW0oXG4gICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmRQYXJhbWV0ZXIodmFsdWUsIGJsZW5kRXF1YXRpb25zLCAnaW52YWxpZCAnICsgcHJvcCwgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgICBibGVuZEVxdWF0aW9uc1t2YWx1ZV0sXG4gICAgICAgICAgICAgICAgICBibGVuZEVxdWF0aW9uc1t2YWx1ZV1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZFBhcmFtZXRlcihcbiAgICAgICAgICAgICAgICAgIHZhbHVlLnJnYiwgYmxlbmRFcXVhdGlvbnMsIHByb3AgKyAnLnJnYicsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmRQYXJhbWV0ZXIoXG4gICAgICAgICAgICAgICAgICB2YWx1ZS5hbHBoYSwgYmxlbmRFcXVhdGlvbnMsIHByb3AgKyAnLmFscGhhJywgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgICBibGVuZEVxdWF0aW9uc1t2YWx1ZS5yZ2JdLFxuICAgICAgICAgICAgICAgICAgYmxlbmRFcXVhdGlvbnNbdmFsdWUuYWxwaGFdXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZFJhaXNlKCdpbnZhbGlkIGJsZW5kLmVxdWF0aW9uJywgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKGVudiwgc2NvcGUsIHZhbHVlKSB7XG4gICAgICAgICAgICAgIHZhciBCTEVORF9FUVVBVElPTlMgPSBlbnYuY29uc3RhbnRzLmJsZW5kRXF1YXRpb25zO1xuXG4gICAgICAgICAgICAgIHZhciBSR0IgPSBzY29wZS5kZWYoKTtcbiAgICAgICAgICAgICAgdmFyIEFMUEhBID0gc2NvcGUuZGVmKCk7XG5cbiAgICAgICAgICAgICAgdmFyIGlmdGUgPSBlbnYuY29uZCgndHlwZW9mICcsIHZhbHVlLCAnPT09XCJzdHJpbmdcIicpO1xuXG4gICAgICAgICAgICAgIGNoZWNrJDEub3B0aW9uYWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNoZWNrUHJvcCAoYmxvY2ssIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICBlbnYuYXNzZXJ0KGJsb2NrLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSArICcgaW4gJyArIEJMRU5EX0VRVUFUSU9OUyxcbiAgICAgICAgICAgICAgICAgICAgJ2ludmFsaWQgJyArIG5hbWUgKyAnLCBtdXN0IGJlIG9uZSBvZiAnICsgT2JqZWN0LmtleXMoYmxlbmRFcXVhdGlvbnMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hlY2tQcm9wKGlmdGUudGhlbiwgcHJvcCwgdmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgZW52LmFzc2VydChpZnRlLmVsc2UsXG4gICAgICAgICAgICAgICAgICB2YWx1ZSArICcmJnR5cGVvZiAnICsgdmFsdWUgKyAnPT09XCJvYmplY3RcIicsXG4gICAgICAgICAgICAgICAgICAnaW52YWxpZCAnICsgcHJvcCk7XG4gICAgICAgICAgICAgICAgY2hlY2tQcm9wKGlmdGUuZWxzZSwgcHJvcCArICcucmdiJywgdmFsdWUgKyAnLnJnYicpO1xuICAgICAgICAgICAgICAgIGNoZWNrUHJvcChpZnRlLmVsc2UsIHByb3AgKyAnLmFscGhhJywgdmFsdWUgKyAnLmFscGhhJyk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIGlmdGUudGhlbihcbiAgICAgICAgICAgICAgICBSR0IsICc9JywgQUxQSEEsICc9JywgQkxFTkRfRVFVQVRJT05TLCAnWycsIHZhbHVlLCAnXTsnKTtcbiAgICAgICAgICAgICAgaWZ0ZS5lbHNlKFxuICAgICAgICAgICAgICAgIFJHQiwgJz0nLCBCTEVORF9FUVVBVElPTlMsICdbJywgdmFsdWUsICcucmdiXTsnLFxuICAgICAgICAgICAgICAgIEFMUEhBLCAnPScsIEJMRU5EX0VRVUFUSU9OUywgJ1snLCB2YWx1ZSwgJy5hbHBoYV07Jyk7XG5cbiAgICAgICAgICAgICAgc2NvcGUoaWZ0ZSk7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIFtSR0IsIEFMUEhBXVxuICAgICAgICAgICAgfSlcblxuICAgICAgICBjYXNlIFNfQkxFTkRfQ09MT1I6XG4gICAgICAgICAgcmV0dXJuIHBhcnNlUGFyYW0oXG4gICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgY2hlY2skMS5jb21tYW5kKFxuICAgICAgICAgICAgICAgIGlzQXJyYXlMaWtlKHZhbHVlKSAmJlxuICAgICAgICAgICAgICAgIHZhbHVlLmxlbmd0aCA9PT0gNCxcbiAgICAgICAgICAgICAgICAnYmxlbmQuY29sb3IgbXVzdCBiZSBhIDRkIGFycmF5JywgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICAgICAgICByZXR1cm4gbG9vcCg0LCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiArdmFsdWVbaV1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoZW52LCBzY29wZSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgY2hlY2skMS5vcHRpb25hbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZW52LmFzc2VydChzY29wZSxcbiAgICAgICAgICAgICAgICAgIGVudi5zaGFyZWQuaXNBcnJheUxpa2UgKyAnKCcgKyB2YWx1ZSArICcpJiYnICtcbiAgICAgICAgICAgICAgICAgIHZhbHVlICsgJy5sZW5ndGg9PT00JyxcbiAgICAgICAgICAgICAgICAgICdibGVuZC5jb2xvciBtdXN0IGJlIGEgNGQgYXJyYXknKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiBsb29wKDQsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLmRlZignKycsIHZhbHVlLCAnWycsIGksICddJylcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgY2FzZSBTX1NURU5DSUxfTUFTSzpcbiAgICAgICAgICByZXR1cm4gcGFyc2VQYXJhbShcbiAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmRUeXBlKHZhbHVlLCAnbnVtYmVyJywgcGFyYW0sIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIHwgMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlbnYsIHNjb3BlLCB2YWx1ZSkge1xuICAgICAgICAgICAgICBjaGVjayQxLm9wdGlvbmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlbnYuYXNzZXJ0KHNjb3BlLFxuICAgICAgICAgICAgICAgICAgJ3R5cGVvZiAnICsgdmFsdWUgKyAnPT09XCJudW1iZXJcIicsXG4gICAgICAgICAgICAgICAgICAnaW52YWxpZCBzdGVuY2lsLm1hc2snKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiBzY29wZS5kZWYodmFsdWUsICd8MCcpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIGNhc2UgU19TVEVOQ0lMX0ZVTkM6XG4gICAgICAgICAgcmV0dXJuIHBhcnNlUGFyYW0oXG4gICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgY2hlY2skMS5jb21tYW5kVHlwZSh2YWx1ZSwgJ29iamVjdCcsIHBhcmFtLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgIHZhciBjbXAgPSB2YWx1ZS5jbXAgfHwgJ2tlZXAnO1xuICAgICAgICAgICAgICB2YXIgcmVmID0gdmFsdWUucmVmIHx8IDA7XG4gICAgICAgICAgICAgIHZhciBtYXNrID0gJ21hc2snIGluIHZhbHVlID8gdmFsdWUubWFzayA6IC0xO1xuICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmRQYXJhbWV0ZXIoY21wLCBjb21wYXJlRnVuY3MsIHByb3AgKyAnLmNtcCcsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgY2hlY2skMS5jb21tYW5kVHlwZShyZWYsICdudW1iZXInLCBwcm9wICsgJy5yZWYnLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZFR5cGUobWFzaywgJ251bWJlcicsIHByb3AgKyAnLm1hc2snLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgY29tcGFyZUZ1bmNzW2NtcF0sXG4gICAgICAgICAgICAgICAgcmVmLFxuICAgICAgICAgICAgICAgIG1hc2tcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlbnYsIHNjb3BlLCB2YWx1ZSkge1xuICAgICAgICAgICAgICB2YXIgQ09NUEFSRV9GVU5DUyA9IGVudi5jb25zdGFudHMuY29tcGFyZUZ1bmNzO1xuICAgICAgICAgICAgICBjaGVjayQxLm9wdGlvbmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBhc3NlcnQgKCkge1xuICAgICAgICAgICAgICAgICAgZW52LmFzc2VydChzY29wZSxcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLmpvaW4uY2FsbChhcmd1bWVudHMsICcnKSxcbiAgICAgICAgICAgICAgICAgICAgJ2ludmFsaWQgc3RlbmNpbC5mdW5jJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFzc2VydCh2YWx1ZSArICcmJnR5cGVvZiAnLCB2YWx1ZSwgJz09PVwib2JqZWN0XCInKTtcbiAgICAgICAgICAgICAgICBhc3NlcnQoJyEoXCJjbXBcIiBpbiAnLCB2YWx1ZSwgJyl8fCgnLFxuICAgICAgICAgICAgICAgICAgdmFsdWUsICcuY21wIGluICcsIENPTVBBUkVfRlVOQ1MsICcpJyk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB2YXIgY21wID0gc2NvcGUuZGVmKFxuICAgICAgICAgICAgICAgICdcImNtcFwiIGluICcsIHZhbHVlLFxuICAgICAgICAgICAgICAgICc/JywgQ09NUEFSRV9GVU5DUywgJ1snLCB2YWx1ZSwgJy5jbXBdJyxcbiAgICAgICAgICAgICAgICAnOicsIEdMX0tFRVApO1xuICAgICAgICAgICAgICB2YXIgcmVmID0gc2NvcGUuZGVmKHZhbHVlLCAnLnJlZnwwJyk7XG4gICAgICAgICAgICAgIHZhciBtYXNrID0gc2NvcGUuZGVmKFxuICAgICAgICAgICAgICAgICdcIm1hc2tcIiBpbiAnLCB2YWx1ZSxcbiAgICAgICAgICAgICAgICAnPycsIHZhbHVlLCAnLm1hc2t8MDotMScpO1xuICAgICAgICAgICAgICByZXR1cm4gW2NtcCwgcmVmLCBtYXNrXVxuICAgICAgICAgICAgfSlcblxuICAgICAgICBjYXNlIFNfU1RFTkNJTF9PUEZST05UOlxuICAgICAgICBjYXNlIFNfU1RFTkNJTF9PUEJBQ0s6XG4gICAgICAgICAgcmV0dXJuIHBhcnNlUGFyYW0oXG4gICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgY2hlY2skMS5jb21tYW5kVHlwZSh2YWx1ZSwgJ29iamVjdCcsIHBhcmFtLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgIHZhciBmYWlsID0gdmFsdWUuZmFpbCB8fCAna2VlcCc7XG4gICAgICAgICAgICAgIHZhciB6ZmFpbCA9IHZhbHVlLnpmYWlsIHx8ICdrZWVwJztcbiAgICAgICAgICAgICAgdmFyIHpwYXNzID0gdmFsdWUuenBhc3MgfHwgJ2tlZXAnO1xuICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmRQYXJhbWV0ZXIoZmFpbCwgc3RlbmNpbE9wcywgcHJvcCArICcuZmFpbCcsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgY2hlY2skMS5jb21tYW5kUGFyYW1ldGVyKHpmYWlsLCBzdGVuY2lsT3BzLCBwcm9wICsgJy56ZmFpbCcsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgY2hlY2skMS5jb21tYW5kUGFyYW1ldGVyKHpwYXNzLCBzdGVuY2lsT3BzLCBwcm9wICsgJy56cGFzcycsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBwcm9wID09PSBTX1NURU5DSUxfT1BCQUNLID8gR0xfQkFDSyA6IEdMX0ZST05ULFxuICAgICAgICAgICAgICAgIHN0ZW5jaWxPcHNbZmFpbF0sXG4gICAgICAgICAgICAgICAgc3RlbmNpbE9wc1t6ZmFpbF0sXG4gICAgICAgICAgICAgICAgc3RlbmNpbE9wc1t6cGFzc11cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlbnYsIHNjb3BlLCB2YWx1ZSkge1xuICAgICAgICAgICAgICB2YXIgU1RFTkNJTF9PUFMgPSBlbnYuY29uc3RhbnRzLnN0ZW5jaWxPcHM7XG5cbiAgICAgICAgICAgICAgY2hlY2skMS5vcHRpb25hbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZW52LmFzc2VydChzY29wZSxcbiAgICAgICAgICAgICAgICAgIHZhbHVlICsgJyYmdHlwZW9mICcgKyB2YWx1ZSArICc9PT1cIm9iamVjdFwiJyxcbiAgICAgICAgICAgICAgICAgICdpbnZhbGlkICcgKyBwcm9wKTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgZnVuY3Rpb24gcmVhZCAobmFtZSkge1xuICAgICAgICAgICAgICAgIGNoZWNrJDEub3B0aW9uYWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgZW52LmFzc2VydChzY29wZSxcbiAgICAgICAgICAgICAgICAgICAgJyEoXCInICsgbmFtZSArICdcIiBpbiAnICsgdmFsdWUgKyAnKXx8JyArXG4gICAgICAgICAgICAgICAgICAgICcoJyArIHZhbHVlICsgJy4nICsgbmFtZSArICcgaW4gJyArIFNURU5DSUxfT1BTICsgJyknLFxuICAgICAgICAgICAgICAgICAgICAnaW52YWxpZCAnICsgcHJvcCArICcuJyArIG5hbWUgKyAnLCBtdXN0IGJlIG9uZSBvZiAnICsgT2JqZWN0LmtleXMoc3RlbmNpbE9wcykpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLmRlZihcbiAgICAgICAgICAgICAgICAgICdcIicsIG5hbWUsICdcIiBpbiAnLCB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICc/JywgU1RFTkNJTF9PUFMsICdbJywgdmFsdWUsICcuJywgbmFtZSwgJ106JyxcbiAgICAgICAgICAgICAgICAgIEdMX0tFRVApXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIHByb3AgPT09IFNfU1RFTkNJTF9PUEJBQ0sgPyBHTF9CQUNLIDogR0xfRlJPTlQsXG4gICAgICAgICAgICAgICAgcmVhZCgnZmFpbCcpLFxuICAgICAgICAgICAgICAgIHJlYWQoJ3pmYWlsJyksXG4gICAgICAgICAgICAgICAgcmVhZCgnenBhc3MnKVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIGNhc2UgU19QT0xZR09OX09GRlNFVF9PRkZTRVQ6XG4gICAgICAgICAgcmV0dXJuIHBhcnNlUGFyYW0oXG4gICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgY2hlY2skMS5jb21tYW5kVHlwZSh2YWx1ZSwgJ29iamVjdCcsIHBhcmFtLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgIHZhciBmYWN0b3IgPSB2YWx1ZS5mYWN0b3IgfCAwO1xuICAgICAgICAgICAgICB2YXIgdW5pdHMgPSB2YWx1ZS51bml0cyB8IDA7XG4gICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZFR5cGUoZmFjdG9yLCAnbnVtYmVyJywgcGFyYW0gKyAnLmZhY3RvcicsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgY2hlY2skMS5jb21tYW5kVHlwZSh1bml0cywgJ251bWJlcicsIHBhcmFtICsgJy51bml0cycsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgcmV0dXJuIFtmYWN0b3IsIHVuaXRzXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlbnYsIHNjb3BlLCB2YWx1ZSkge1xuICAgICAgICAgICAgICBjaGVjayQxLm9wdGlvbmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlbnYuYXNzZXJ0KHNjb3BlLFxuICAgICAgICAgICAgICAgICAgdmFsdWUgKyAnJiZ0eXBlb2YgJyArIHZhbHVlICsgJz09PVwib2JqZWN0XCInLFxuICAgICAgICAgICAgICAgICAgJ2ludmFsaWQgJyArIHByb3ApO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICB2YXIgRkFDVE9SID0gc2NvcGUuZGVmKHZhbHVlLCAnLmZhY3RvcnwwJyk7XG4gICAgICAgICAgICAgIHZhciBVTklUUyA9IHNjb3BlLmRlZih2YWx1ZSwgJy51bml0c3wwJyk7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIFtGQUNUT1IsIFVOSVRTXVxuICAgICAgICAgICAgfSlcblxuICAgICAgICBjYXNlIFNfQ1VMTF9GQUNFOlxuICAgICAgICAgIHJldHVybiBwYXJzZVBhcmFtKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgIHZhciBmYWNlID0gMDtcbiAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSAnZnJvbnQnKSB7XG4gICAgICAgICAgICAgICAgZmFjZSA9IEdMX0ZST05UO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnYmFjaycpIHtcbiAgICAgICAgICAgICAgICBmYWNlID0gR0xfQkFDSztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmQoISFmYWNlLCBwYXJhbSwgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICAgICAgICByZXR1cm4gZmFjZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlbnYsIHNjb3BlLCB2YWx1ZSkge1xuICAgICAgICAgICAgICBjaGVjayQxLm9wdGlvbmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlbnYuYXNzZXJ0KHNjb3BlLFxuICAgICAgICAgICAgICAgICAgdmFsdWUgKyAnPT09XCJmcm9udFwifHwnICtcbiAgICAgICAgICAgICAgICAgIHZhbHVlICsgJz09PVwiYmFja1wiJyxcbiAgICAgICAgICAgICAgICAgICdpbnZhbGlkIGN1bGwuZmFjZScpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLmRlZih2YWx1ZSwgJz09PVwiZnJvbnRcIj8nLCBHTF9GUk9OVCwgJzonLCBHTF9CQUNLKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICBjYXNlIFNfTElORV9XSURUSDpcbiAgICAgICAgICByZXR1cm4gcGFyc2VQYXJhbShcbiAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmQoXG4gICAgICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJlxuICAgICAgICAgICAgICAgIHZhbHVlID49IGxpbWl0cy5saW5lV2lkdGhEaW1zWzBdICYmXG4gICAgICAgICAgICAgICAgdmFsdWUgPD0gbGltaXRzLmxpbmVXaWR0aERpbXNbMV0sXG4gICAgICAgICAgICAgICAgJ2ludmFsaWQgbGluZSB3aWR0aCwgbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlciBiZXR3ZWVuICcgK1xuICAgICAgICAgICAgICAgIGxpbWl0cy5saW5lV2lkdGhEaW1zWzBdICsgJyBhbmQgJyArIGxpbWl0cy5saW5lV2lkdGhEaW1zWzFdLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlbnYsIHNjb3BlLCB2YWx1ZSkge1xuICAgICAgICAgICAgICBjaGVjayQxLm9wdGlvbmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlbnYuYXNzZXJ0KHNjb3BlLFxuICAgICAgICAgICAgICAgICAgJ3R5cGVvZiAnICsgdmFsdWUgKyAnPT09XCJudW1iZXJcIiYmJyArXG4gICAgICAgICAgICAgICAgICB2YWx1ZSArICc+PScgKyBsaW1pdHMubGluZVdpZHRoRGltc1swXSArICcmJicgK1xuICAgICAgICAgICAgICAgICAgdmFsdWUgKyAnPD0nICsgbGltaXRzLmxpbmVXaWR0aERpbXNbMV0sXG4gICAgICAgICAgICAgICAgICAnaW52YWxpZCBsaW5lIHdpZHRoJyk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgICAgICAgfSlcblxuICAgICAgICBjYXNlIFNfRlJPTlRfRkFDRTpcbiAgICAgICAgICByZXR1cm4gcGFyc2VQYXJhbShcbiAgICAgICAgICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmRQYXJhbWV0ZXIodmFsdWUsIG9yaWVudGF0aW9uVHlwZSwgcGFyYW0sIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgcmV0dXJuIG9yaWVudGF0aW9uVHlwZVt2YWx1ZV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoZW52LCBzY29wZSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgY2hlY2skMS5vcHRpb25hbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZW52LmFzc2VydChzY29wZSxcbiAgICAgICAgICAgICAgICAgIHZhbHVlICsgJz09PVwiY3dcInx8JyArXG4gICAgICAgICAgICAgICAgICB2YWx1ZSArICc9PT1cImNjd1wiJyxcbiAgICAgICAgICAgICAgICAgICdpbnZhbGlkIGZyb250RmFjZSwgbXVzdCBiZSBvbmUgb2YgY3csY2N3Jyk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gc2NvcGUuZGVmKHZhbHVlICsgJz09PVwiY3dcIj8nICsgR0xfQ1cgKyAnOicgKyBHTF9DQ1cpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIGNhc2UgU19DT0xPUl9NQVNLOlxuICAgICAgICAgIHJldHVybiBwYXJzZVBhcmFtKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZChcbiAgICAgICAgICAgICAgICBpc0FycmF5TGlrZSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSA0LFxuICAgICAgICAgICAgICAgICdjb2xvci5tYXNrIG11c3QgYmUgbGVuZ3RoIDQgYXJyYXknLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5tYXAoZnVuY3Rpb24gKHYpIHsgcmV0dXJuICEhdiB9KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlbnYsIHNjb3BlLCB2YWx1ZSkge1xuICAgICAgICAgICAgICBjaGVjayQxLm9wdGlvbmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlbnYuYXNzZXJ0KHNjb3BlLFxuICAgICAgICAgICAgICAgICAgZW52LnNoYXJlZC5pc0FycmF5TGlrZSArICcoJyArIHZhbHVlICsgJykmJicgK1xuICAgICAgICAgICAgICAgICAgdmFsdWUgKyAnLmxlbmd0aD09PTQnLFxuICAgICAgICAgICAgICAgICAgJ2ludmFsaWQgY29sb3IubWFzaycpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIGxvb3AoNCwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyEhJyArIHZhbHVlICsgJ1snICsgaSArICddJ1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICBjYXNlIFNfU0FNUExFX0NPVkVSQUdFOlxuICAgICAgICAgIHJldHVybiBwYXJzZVBhcmFtKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZCh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLCBwYXJhbSwgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICAgICAgICB2YXIgc2FtcGxlVmFsdWUgPSAndmFsdWUnIGluIHZhbHVlID8gdmFsdWUudmFsdWUgOiAxO1xuICAgICAgICAgICAgICB2YXIgc2FtcGxlSW52ZXJ0ID0gISF2YWx1ZS5pbnZlcnQ7XG4gICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZChcbiAgICAgICAgICAgICAgICB0eXBlb2Ygc2FtcGxlVmFsdWUgPT09ICdudW1iZXInICYmXG4gICAgICAgICAgICAgICAgc2FtcGxlVmFsdWUgPj0gMCAmJiBzYW1wbGVWYWx1ZSA8PSAxLFxuICAgICAgICAgICAgICAgICdzYW1wbGUuY292ZXJhZ2UudmFsdWUgbXVzdCBiZSBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEnLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgIHJldHVybiBbc2FtcGxlVmFsdWUsIHNhbXBsZUludmVydF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoZW52LCBzY29wZSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgY2hlY2skMS5vcHRpb25hbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZW52LmFzc2VydChzY29wZSxcbiAgICAgICAgICAgICAgICAgIHZhbHVlICsgJyYmdHlwZW9mICcgKyB2YWx1ZSArICc9PT1cIm9iamVjdFwiJyxcbiAgICAgICAgICAgICAgICAgICdpbnZhbGlkIHNhbXBsZS5jb3ZlcmFnZScpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdmFyIFZBTFVFID0gc2NvcGUuZGVmKFxuICAgICAgICAgICAgICAgICdcInZhbHVlXCIgaW4gJywgdmFsdWUsICc/KycsIHZhbHVlLCAnLnZhbHVlOjEnKTtcbiAgICAgICAgICAgICAgdmFyIElOVkVSVCA9IHNjb3BlLmRlZignISEnLCB2YWx1ZSwgJy5pbnZlcnQnKTtcbiAgICAgICAgICAgICAgcmV0dXJuIFtWQUxVRSwgSU5WRVJUXVxuICAgICAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBTVEFURVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VVbmlmb3JtcyAodW5pZm9ybXMsIGVudikge1xuICAgIHZhciBzdGF0aWNVbmlmb3JtcyA9IHVuaWZvcm1zLnN0YXRpYztcbiAgICB2YXIgZHluYW1pY1VuaWZvcm1zID0gdW5pZm9ybXMuZHluYW1pYztcblxuICAgIHZhciBVTklGT1JNUyA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMoc3RhdGljVW5pZm9ybXMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHN0YXRpY1VuaWZvcm1zW25hbWVdO1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8XG4gICAgICAgICAgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgcmVzdWx0ID0gY3JlYXRlU3RhdGljRGVjbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIHJlZ2xUeXBlID0gdmFsdWUuX3JlZ2xUeXBlO1xuICAgICAgICBpZiAocmVnbFR5cGUgPT09ICd0ZXh0dXJlMmQnIHx8XG4gICAgICAgICAgICByZWdsVHlwZSA9PT0gJ3RleHR1cmVDdWJlJykge1xuICAgICAgICAgIHJlc3VsdCA9IGNyZWF0ZVN0YXRpY0RlY2woZnVuY3Rpb24gKGVudikge1xuICAgICAgICAgICAgcmV0dXJuIGVudi5saW5rKHZhbHVlKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHJlZ2xUeXBlID09PSAnZnJhbWVidWZmZXInIHx8XG4gICAgICAgICAgICAgICAgICAgcmVnbFR5cGUgPT09ICdmcmFtZWJ1ZmZlckN1YmUnKSB7XG4gICAgICAgICAgY2hlY2skMS5jb21tYW5kKHZhbHVlLmNvbG9yLmxlbmd0aCA+IDAsXG4gICAgICAgICAgICAnbWlzc2luZyBjb2xvciBhdHRhY2htZW50IGZvciBmcmFtZWJ1ZmZlciBzZW50IHRvIHVuaWZvcm0gXCInICsgbmFtZSArICdcIicsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICByZXN1bHQgPSBjcmVhdGVTdGF0aWNEZWNsKGZ1bmN0aW9uIChlbnYpIHtcbiAgICAgICAgICAgIHJldHVybiBlbnYubGluayh2YWx1ZS5jb2xvclswXSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGVjayQxLmNvbW1hbmRSYWlzZSgnaW52YWxpZCBkYXRhIGZvciB1bmlmb3JtIFwiJyArIG5hbWUgKyAnXCInLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UodmFsdWUpKSB7XG4gICAgICAgIHJlc3VsdCA9IGNyZWF0ZVN0YXRpY0RlY2woZnVuY3Rpb24gKGVudikge1xuICAgICAgICAgIHZhciBJVEVNID0gZW52Lmdsb2JhbC5kZWYoJ1snLFxuICAgICAgICAgICAgbG9vcCh2YWx1ZS5sZW5ndGgsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZChcbiAgICAgICAgICAgICAgICB0eXBlb2YgdmFsdWVbaV0gPT09ICdudW1iZXInIHx8XG4gICAgICAgICAgICAgICAgdHlwZW9mIHZhbHVlW2ldID09PSAnYm9vbGVhbicsXG4gICAgICAgICAgICAgICAgJ2ludmFsaWQgdW5pZm9ybSAnICsgbmFtZSwgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWVbaV1cbiAgICAgICAgICAgIH0pLCAnXScpO1xuICAgICAgICAgIHJldHVybiBJVEVNXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hlY2skMS5jb21tYW5kUmFpc2UoJ2ludmFsaWQgb3IgbWlzc2luZyBkYXRhIGZvciB1bmlmb3JtIFwiJyArIG5hbWUgKyAnXCInLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICB9XG4gICAgICByZXN1bHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgIFVOSUZPUk1TW25hbWVdID0gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgT2JqZWN0LmtleXMoZHluYW1pY1VuaWZvcm1zKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBkeW4gPSBkeW5hbWljVW5pZm9ybXNba2V5XTtcbiAgICAgIFVOSUZPUk1TW2tleV0gPSBjcmVhdGVEeW5hbWljRGVjbChkeW4sIGZ1bmN0aW9uIChlbnYsIHNjb3BlKSB7XG4gICAgICAgIHJldHVybiBlbnYuaW52b2tlKHNjb3BlLCBkeW4pXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBVTklGT1JNU1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VBdHRyaWJ1dGVzIChhdHRyaWJ1dGVzLCBlbnYpIHtcbiAgICB2YXIgc3RhdGljQXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMuc3RhdGljO1xuICAgIHZhciBkeW5hbWljQXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMuZHluYW1pYztcblxuICAgIHZhciBhdHRyaWJ1dGVEZWZzID0ge307XG5cbiAgICBPYmplY3Qua2V5cyhzdGF0aWNBdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHN0YXRpY0F0dHJpYnV0ZXNbYXR0cmlidXRlXTtcbiAgICAgIHZhciBpZCA9IHN0cmluZ1N0b3JlLmlkKGF0dHJpYnV0ZSk7XG5cbiAgICAgIHZhciByZWNvcmQgPSBuZXcgQXR0cmlidXRlUmVjb3JkKCk7XG4gICAgICBpZiAoaXNCdWZmZXJBcmdzKHZhbHVlKSkge1xuICAgICAgICByZWNvcmQuc3RhdGUgPSBBVFRSSUJfU1RBVEVfUE9JTlRFUjtcbiAgICAgICAgcmVjb3JkLmJ1ZmZlciA9IGJ1ZmZlclN0YXRlLmdldEJ1ZmZlcihcbiAgICAgICAgICBidWZmZXJTdGF0ZS5jcmVhdGUodmFsdWUsIEdMX0FSUkFZX0JVRkZFUiQxLCBmYWxzZSwgdHJ1ZSkpO1xuICAgICAgICByZWNvcmQudHlwZSA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgYnVmZmVyID0gYnVmZmVyU3RhdGUuZ2V0QnVmZmVyKHZhbHVlKTtcbiAgICAgICAgaWYgKGJ1ZmZlcikge1xuICAgICAgICAgIHJlY29yZC5zdGF0ZSA9IEFUVFJJQl9TVEFURV9QT0lOVEVSO1xuICAgICAgICAgIHJlY29yZC5idWZmZXIgPSBidWZmZXI7XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNoZWNrJDEuY29tbWFuZCh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLFxuICAgICAgICAgICAgJ2ludmFsaWQgZGF0YSBmb3IgYXR0cmlidXRlICcgKyBhdHRyaWJ1dGUsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICBpZiAoJ2NvbnN0YW50JyBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIGNvbnN0YW50ID0gdmFsdWUuY29uc3RhbnQ7XG4gICAgICAgICAgICByZWNvcmQuYnVmZmVyID0gJ251bGwnO1xuICAgICAgICAgICAgcmVjb3JkLnN0YXRlID0gQVRUUklCX1NUQVRFX0NPTlNUQU5UO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zdGFudCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgcmVjb3JkLnggPSBjb25zdGFudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZChcbiAgICAgICAgICAgICAgICBpc0FycmF5TGlrZShjb25zdGFudCkgJiZcbiAgICAgICAgICAgICAgICBjb25zdGFudC5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgY29uc3RhbnQubGVuZ3RoIDw9IDQsXG4gICAgICAgICAgICAgICAgJ2ludmFsaWQgY29uc3RhbnQgZm9yIGF0dHJpYnV0ZSAnICsgYXR0cmlidXRlLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgIENVVEVfQ09NUE9ORU5UUy5mb3JFYWNoKGZ1bmN0aW9uIChjLCBpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBjb25zdGFudC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgIHJlY29yZFtjXSA9IGNvbnN0YW50W2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpc0J1ZmZlckFyZ3ModmFsdWUuYnVmZmVyKSkge1xuICAgICAgICAgICAgICBidWZmZXIgPSBidWZmZXJTdGF0ZS5nZXRCdWZmZXIoXG4gICAgICAgICAgICAgICAgYnVmZmVyU3RhdGUuY3JlYXRlKHZhbHVlLmJ1ZmZlciwgR0xfQVJSQVlfQlVGRkVSJDEsIGZhbHNlLCB0cnVlKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBidWZmZXIgPSBidWZmZXJTdGF0ZS5nZXRCdWZmZXIodmFsdWUuYnVmZmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZCghIWJ1ZmZlciwgJ21pc3NpbmcgYnVmZmVyIGZvciBhdHRyaWJ1dGUgXCInICsgYXR0cmlidXRlICsgJ1wiJywgZW52LmNvbW1hbmRTdHIpO1xuXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdmFsdWUub2Zmc2V0IHwgMDtcbiAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZChvZmZzZXQgPj0gMCxcbiAgICAgICAgICAgICAgJ2ludmFsaWQgb2Zmc2V0IGZvciBhdHRyaWJ1dGUgXCInICsgYXR0cmlidXRlICsgJ1wiJywgZW52LmNvbW1hbmRTdHIpO1xuXG4gICAgICAgICAgICB2YXIgc3RyaWRlID0gdmFsdWUuc3RyaWRlIHwgMDtcbiAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZChzdHJpZGUgPj0gMCAmJiBzdHJpZGUgPCAyNTYsXG4gICAgICAgICAgICAgICdpbnZhbGlkIHN0cmlkZSBmb3IgYXR0cmlidXRlIFwiJyArIGF0dHJpYnV0ZSArICdcIiwgbXVzdCBiZSBpbnRlZ2VyIGJldHdlZWVuIFswLCAyNTVdJywgZW52LmNvbW1hbmRTdHIpO1xuXG4gICAgICAgICAgICB2YXIgc2l6ZSA9IHZhbHVlLnNpemUgfCAwO1xuICAgICAgICAgICAgY2hlY2skMS5jb21tYW5kKCEoJ3NpemUnIGluIHZhbHVlKSB8fCAoc2l6ZSA+IDAgJiYgc2l6ZSA8PSA0KSxcbiAgICAgICAgICAgICAgJ2ludmFsaWQgc2l6ZSBmb3IgYXR0cmlidXRlIFwiJyArIGF0dHJpYnV0ZSArICdcIiwgbXVzdCBiZSAxLDIsMyw0JywgZW52LmNvbW1hbmRTdHIpO1xuXG4gICAgICAgICAgICB2YXIgbm9ybWFsaXplZCA9ICEhdmFsdWUubm9ybWFsaXplZDtcblxuICAgICAgICAgICAgdmFyIHR5cGUgPSAwO1xuICAgICAgICAgICAgaWYgKCd0eXBlJyBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmRQYXJhbWV0ZXIoXG4gICAgICAgICAgICAgICAgdmFsdWUudHlwZSwgZ2xUeXBlcyxcbiAgICAgICAgICAgICAgICAnaW52YWxpZCB0eXBlIGZvciBhdHRyaWJ1dGUgJyArIGF0dHJpYnV0ZSwgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICAgICAgICB0eXBlID0gZ2xUeXBlc1t2YWx1ZS50eXBlXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRpdmlzb3IgPSB2YWx1ZS5kaXZpc29yIHwgMDtcbiAgICAgICAgICAgIGlmICgnZGl2aXNvcicgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgY2hlY2skMS5jb21tYW5kKGRpdmlzb3IgPT09IDAgfHwgZXh0SW5zdGFuY2luZyxcbiAgICAgICAgICAgICAgICAnY2Fubm90IHNwZWNpZnkgZGl2aXNvciBmb3IgYXR0cmlidXRlIFwiJyArIGF0dHJpYnV0ZSArICdcIiwgaW5zdGFuY2luZyBub3Qgc3VwcG9ydGVkJywgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmQoZGl2aXNvciA+PSAwLFxuICAgICAgICAgICAgICAgICdpbnZhbGlkIGRpdmlzb3IgZm9yIGF0dHJpYnV0ZSBcIicgKyBhdHRyaWJ1dGUgKyAnXCInLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNoZWNrJDEub3B0aW9uYWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgY29tbWFuZCA9IGVudi5jb21tYW5kU3RyO1xuXG4gICAgICAgICAgICAgIHZhciBWQUxJRF9LRVlTID0gW1xuICAgICAgICAgICAgICAgICdidWZmZXInLFxuICAgICAgICAgICAgICAgICdvZmZzZXQnLFxuICAgICAgICAgICAgICAgICdkaXZpc29yJyxcbiAgICAgICAgICAgICAgICAnbm9ybWFsaXplZCcsXG4gICAgICAgICAgICAgICAgJ3R5cGUnLFxuICAgICAgICAgICAgICAgICdzaXplJyxcbiAgICAgICAgICAgICAgICAnc3RyaWRlJ1xuICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICAgICAgICAgICAgY2hlY2skMS5jb21tYW5kKFxuICAgICAgICAgICAgICAgICAgVkFMSURfS0VZUy5pbmRleE9mKHByb3ApID49IDAsXG4gICAgICAgICAgICAgICAgICAndW5rbm93biBwYXJhbWV0ZXIgXCInICsgcHJvcCArICdcIiBmb3IgYXR0cmlidXRlIHBvaW50ZXIgXCInICsgYXR0cmlidXRlICsgJ1wiICh2YWxpZCBwYXJhbWV0ZXJzIGFyZSAnICsgVkFMSURfS0VZUyArICcpJyxcbiAgICAgICAgICAgICAgICAgIGNvbW1hbmQpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZWNvcmQuYnVmZmVyID0gYnVmZmVyO1xuICAgICAgICAgICAgcmVjb3JkLnN0YXRlID0gQVRUUklCX1NUQVRFX1BPSU5URVI7XG4gICAgICAgICAgICByZWNvcmQuc2l6ZSA9IHNpemU7XG4gICAgICAgICAgICByZWNvcmQubm9ybWFsaXplZCA9IG5vcm1hbGl6ZWQ7XG4gICAgICAgICAgICByZWNvcmQudHlwZSA9IHR5cGUgfHwgYnVmZmVyLmR0eXBlO1xuICAgICAgICAgICAgcmVjb3JkLm9mZnNldCA9IG9mZnNldDtcbiAgICAgICAgICAgIHJlY29yZC5zdHJpZGUgPSBzdHJpZGU7XG4gICAgICAgICAgICByZWNvcmQuZGl2aXNvciA9IGRpdmlzb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGF0dHJpYnV0ZURlZnNbYXR0cmlidXRlXSA9IGNyZWF0ZVN0YXRpY0RlY2woZnVuY3Rpb24gKGVudiwgc2NvcGUpIHtcbiAgICAgICAgdmFyIGNhY2hlID0gZW52LmF0dHJpYkNhY2hlO1xuICAgICAgICBpZiAoaWQgaW4gY2FjaGUpIHtcbiAgICAgICAgICByZXR1cm4gY2FjaGVbaWRdXG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgICBpc1N0cmVhbTogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgT2JqZWN0LmtleXMocmVjb3JkKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IHJlY29yZFtrZXldO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJlY29yZC5idWZmZXIpIHtcbiAgICAgICAgICByZXN1bHQuYnVmZmVyID0gZW52LmxpbmsocmVjb3JkLmJ1ZmZlcik7XG4gICAgICAgICAgcmVzdWx0LnR5cGUgPSByZXN1bHQudHlwZSB8fCAocmVzdWx0LmJ1ZmZlciArICcuZHR5cGUnKTtcbiAgICAgICAgfVxuICAgICAgICBjYWNoZVtpZF0gPSByZXN1bHQ7XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgT2JqZWN0LmtleXMoZHluYW1pY0F0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgdmFyIGR5biA9IGR5bmFtaWNBdHRyaWJ1dGVzW2F0dHJpYnV0ZV07XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGVuZEF0dHJpYnV0ZUNvZGUgKGVudiwgYmxvY2spIHtcbiAgICAgICAgdmFyIFZBTFVFID0gZW52Lmludm9rZShibG9jaywgZHluKTtcblxuICAgICAgICB2YXIgc2hhcmVkID0gZW52LnNoYXJlZDtcblxuICAgICAgICB2YXIgSVNfQlVGRkVSX0FSR1MgPSBzaGFyZWQuaXNCdWZmZXJBcmdzO1xuICAgICAgICB2YXIgQlVGRkVSX1NUQVRFID0gc2hhcmVkLmJ1ZmZlcjtcblxuICAgICAgICAvLyBQZXJmb3JtIHZhbGlkYXRpb24gb24gYXR0cmlidXRlXG4gICAgICAgIGNoZWNrJDEub3B0aW9uYWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGVudi5hc3NlcnQoYmxvY2ssXG4gICAgICAgICAgICBWQUxVRSArICcmJih0eXBlb2YgJyArIFZBTFVFICsgJz09PVwib2JqZWN0XCJ8fHR5cGVvZiAnICtcbiAgICAgICAgICAgIFZBTFVFICsgJz09PVwiZnVuY3Rpb25cIikmJignICtcbiAgICAgICAgICAgIElTX0JVRkZFUl9BUkdTICsgJygnICsgVkFMVUUgKyAnKXx8JyArXG4gICAgICAgICAgICBCVUZGRVJfU1RBVEUgKyAnLmdldEJ1ZmZlcignICsgVkFMVUUgKyAnKXx8JyArXG4gICAgICAgICAgICBCVUZGRVJfU1RBVEUgKyAnLmdldEJ1ZmZlcignICsgVkFMVUUgKyAnLmJ1ZmZlcil8fCcgK1xuICAgICAgICAgICAgSVNfQlVGRkVSX0FSR1MgKyAnKCcgKyBWQUxVRSArICcuYnVmZmVyKXx8JyArXG4gICAgICAgICAgICAnKFwiY29uc3RhbnRcIiBpbiAnICsgVkFMVUUgK1xuICAgICAgICAgICAgJyYmKHR5cGVvZiAnICsgVkFMVUUgKyAnLmNvbnN0YW50PT09XCJudW1iZXJcInx8JyArXG4gICAgICAgICAgICBzaGFyZWQuaXNBcnJheUxpa2UgKyAnKCcgKyBWQUxVRSArICcuY29uc3RhbnQpKSkpJyxcbiAgICAgICAgICAgICdpbnZhbGlkIGR5bmFtaWMgYXR0cmlidXRlIFwiJyArIGF0dHJpYnV0ZSArICdcIicpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBhbGxvY2F0ZSBuYW1lcyBmb3IgcmVzdWx0XG4gICAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgICAgaXNTdHJlYW06IGJsb2NrLmRlZihmYWxzZSlcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGRlZmF1bHRSZWNvcmQgPSBuZXcgQXR0cmlidXRlUmVjb3JkKCk7XG4gICAgICAgIGRlZmF1bHRSZWNvcmQuc3RhdGUgPSBBVFRSSUJfU1RBVEVfUE9JTlRFUjtcbiAgICAgICAgT2JqZWN0LmtleXMoZGVmYXVsdFJlY29yZCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBibG9jay5kZWYoJycgKyBkZWZhdWx0UmVjb3JkW2tleV0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgQlVGRkVSID0gcmVzdWx0LmJ1ZmZlcjtcbiAgICAgICAgdmFyIFRZUEUgPSByZXN1bHQudHlwZTtcbiAgICAgICAgYmxvY2soXG4gICAgICAgICAgJ2lmKCcsIElTX0JVRkZFUl9BUkdTLCAnKCcsIFZBTFVFLCAnKSl7JyxcbiAgICAgICAgICByZXN1bHQuaXNTdHJlYW0sICc9dHJ1ZTsnLFxuICAgICAgICAgIEJVRkZFUiwgJz0nLCBCVUZGRVJfU1RBVEUsICcuY3JlYXRlU3RyZWFtKCcsIEdMX0FSUkFZX0JVRkZFUiQxLCAnLCcsIFZBTFVFLCAnKTsnLFxuICAgICAgICAgIFRZUEUsICc9JywgQlVGRkVSLCAnLmR0eXBlOycsXG4gICAgICAgICAgJ31lbHNleycsXG4gICAgICAgICAgQlVGRkVSLCAnPScsIEJVRkZFUl9TVEFURSwgJy5nZXRCdWZmZXIoJywgVkFMVUUsICcpOycsXG4gICAgICAgICAgJ2lmKCcsIEJVRkZFUiwgJyl7JyxcbiAgICAgICAgICBUWVBFLCAnPScsIEJVRkZFUiwgJy5kdHlwZTsnLFxuICAgICAgICAgICd9ZWxzZSBpZihcImNvbnN0YW50XCIgaW4gJywgVkFMVUUsICcpeycsXG4gICAgICAgICAgcmVzdWx0LnN0YXRlLCAnPScsIEFUVFJJQl9TVEFURV9DT05TVEFOVCwgJzsnLFxuICAgICAgICAgICdpZih0eXBlb2YgJyArIFZBTFVFICsgJy5jb25zdGFudCA9PT0gXCJudW1iZXJcIil7JyxcbiAgICAgICAgICByZXN1bHRbQ1VURV9DT01QT05FTlRTWzBdXSwgJz0nLCBWQUxVRSwgJy5jb25zdGFudDsnLFxuICAgICAgICAgIENVVEVfQ09NUE9ORU5UUy5zbGljZSgxKS5tYXAoZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRbbl1cbiAgICAgICAgICB9KS5qb2luKCc9JyksICc9MDsnLFxuICAgICAgICAgICd9ZWxzZXsnLFxuICAgICAgICAgIENVVEVfQ09NUE9ORU5UUy5tYXAoZnVuY3Rpb24gKG5hbWUsIGkpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIHJlc3VsdFtuYW1lXSArICc9JyArIFZBTFVFICsgJy5jb25zdGFudC5sZW5ndGg+JyArIGkgK1xuICAgICAgICAgICAgICAnPycgKyBWQUxVRSArICcuY29uc3RhbnRbJyArIGkgKyAnXTowOydcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9KS5qb2luKCcnKSxcbiAgICAgICAgICAnfX1lbHNleycsXG4gICAgICAgICAgJ2lmKCcsIElTX0JVRkZFUl9BUkdTLCAnKCcsIFZBTFVFLCAnLmJ1ZmZlcikpeycsXG4gICAgICAgICAgQlVGRkVSLCAnPScsIEJVRkZFUl9TVEFURSwgJy5jcmVhdGVTdHJlYW0oJywgR0xfQVJSQVlfQlVGRkVSJDEsICcsJywgVkFMVUUsICcuYnVmZmVyKTsnLFxuICAgICAgICAgICd9ZWxzZXsnLFxuICAgICAgICAgIEJVRkZFUiwgJz0nLCBCVUZGRVJfU1RBVEUsICcuZ2V0QnVmZmVyKCcsIFZBTFVFLCAnLmJ1ZmZlcik7JyxcbiAgICAgICAgICAnfScsXG4gICAgICAgICAgVFlQRSwgJz1cInR5cGVcIiBpbiAnLCBWQUxVRSwgJz8nLFxuICAgICAgICAgIHNoYXJlZC5nbFR5cGVzLCAnWycsIFZBTFVFLCAnLnR5cGVdOicsIEJVRkZFUiwgJy5kdHlwZTsnLFxuICAgICAgICAgIHJlc3VsdC5ub3JtYWxpemVkLCAnPSEhJywgVkFMVUUsICcubm9ybWFsaXplZDsnKTtcbiAgICAgICAgZnVuY3Rpb24gZW1pdFJlYWRSZWNvcmQgKG5hbWUpIHtcbiAgICAgICAgICBibG9jayhyZXN1bHRbbmFtZV0sICc9JywgVkFMVUUsICcuJywgbmFtZSwgJ3wwOycpO1xuICAgICAgICB9XG4gICAgICAgIGVtaXRSZWFkUmVjb3JkKCdzaXplJyk7XG4gICAgICAgIGVtaXRSZWFkUmVjb3JkKCdvZmZzZXQnKTtcbiAgICAgICAgZW1pdFJlYWRSZWNvcmQoJ3N0cmlkZScpO1xuICAgICAgICBlbWl0UmVhZFJlY29yZCgnZGl2aXNvcicpO1xuXG4gICAgICAgIGJsb2NrKCd9fScpO1xuXG4gICAgICAgIGJsb2NrLmV4aXQoXG4gICAgICAgICAgJ2lmKCcsIHJlc3VsdC5pc1N0cmVhbSwgJyl7JyxcbiAgICAgICAgICBCVUZGRVJfU1RBVEUsICcuZGVzdHJveVN0cmVhbSgnLCBCVUZGRVIsICcpOycsXG4gICAgICAgICAgJ30nKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICB9XG5cbiAgICAgIGF0dHJpYnV0ZURlZnNbYXR0cmlidXRlXSA9IGNyZWF0ZUR5bmFtaWNEZWNsKGR5biwgYXBwZW5kQXR0cmlidXRlQ29kZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXR0cmlidXRlRGVmc1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VDb250ZXh0IChjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRpY0NvbnRleHQgPSBjb250ZXh0LnN0YXRpYztcbiAgICB2YXIgZHluYW1pY0NvbnRleHQgPSBjb250ZXh0LmR5bmFtaWM7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMoc3RhdGljQ29udGV4dCkuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIHZhbHVlID0gc3RhdGljQ29udGV4dFtuYW1lXTtcbiAgICAgIHJlc3VsdFtuYW1lXSA9IGNyZWF0ZVN0YXRpY0RlY2woZnVuY3Rpb24gKGVudiwgc2NvcGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICByZXR1cm4gJycgKyB2YWx1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBlbnYubGluayh2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBPYmplY3Qua2V5cyhkeW5hbWljQ29udGV4dCkuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIGR5biA9IGR5bmFtaWNDb250ZXh0W25hbWVdO1xuICAgICAgcmVzdWx0W25hbWVdID0gY3JlYXRlRHluYW1pY0RlY2woZHluLCBmdW5jdGlvbiAoZW52LCBzY29wZSkge1xuICAgICAgICByZXR1cm4gZW52Lmludm9rZShzY29wZSwgZHluKVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUFyZ3VtZW50cyAob3B0aW9ucywgYXR0cmlidXRlcywgdW5pZm9ybXMsIGNvbnRleHQsIGVudikge1xuICAgIHZhciBzdGF0aWNPcHRpb25zID0gb3B0aW9ucy5zdGF0aWM7XG4gICAgdmFyIGR5bmFtaWNPcHRpb25zID0gb3B0aW9ucy5keW5hbWljO1xuXG4gICAgY2hlY2skMS5vcHRpb25hbChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgS0VZX05BTUVTID0gW1xuICAgICAgICBTX0ZSQU1FQlVGRkVSLFxuICAgICAgICBTX1ZFUlQsXG4gICAgICAgIFNfRlJBRyxcbiAgICAgICAgU19FTEVNRU5UUyxcbiAgICAgICAgU19QUklNSVRJVkUsXG4gICAgICAgIFNfT0ZGU0VULFxuICAgICAgICBTX0NPVU5ULFxuICAgICAgICBTX0lOU1RBTkNFUyxcbiAgICAgICAgU19QUk9GSUxFXG4gICAgICBdLmNvbmNhdChHTF9TVEFURV9OQU1FUyk7XG5cbiAgICAgIGZ1bmN0aW9uIGNoZWNrS2V5cyAoZGljdCkge1xuICAgICAgICBPYmplY3Qua2V5cyhkaWN0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICBjaGVjayQxLmNvbW1hbmQoXG4gICAgICAgICAgICBLRVlfTkFNRVMuaW5kZXhPZihrZXkpID49IDAsXG4gICAgICAgICAgICAndW5rbm93biBwYXJhbWV0ZXIgXCInICsga2V5ICsgJ1wiJyxcbiAgICAgICAgICAgIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNoZWNrS2V5cyhzdGF0aWNPcHRpb25zKTtcbiAgICAgIGNoZWNrS2V5cyhkeW5hbWljT3B0aW9ucyk7XG4gICAgfSk7XG5cbiAgICB2YXIgZnJhbWVidWZmZXIgPSBwYXJzZUZyYW1lYnVmZmVyKG9wdGlvbnMsIGVudik7XG4gICAgdmFyIHZpZXdwb3J0QW5kU2Npc3NvciA9IHBhcnNlVmlld3BvcnRTY2lzc29yKG9wdGlvbnMsIGZyYW1lYnVmZmVyLCBlbnYpO1xuICAgIHZhciBkcmF3ID0gcGFyc2VEcmF3KG9wdGlvbnMsIGVudik7XG4gICAgdmFyIHN0YXRlID0gcGFyc2VHTFN0YXRlKG9wdGlvbnMsIGVudik7XG4gICAgdmFyIHNoYWRlciA9IHBhcnNlUHJvZ3JhbShvcHRpb25zLCBlbnYpO1xuXG4gICAgZnVuY3Rpb24gY29weUJveCAobmFtZSkge1xuICAgICAgdmFyIGRlZm4gPSB2aWV3cG9ydEFuZFNjaXNzb3JbbmFtZV07XG4gICAgICBpZiAoZGVmbikge1xuICAgICAgICBzdGF0ZVtuYW1lXSA9IGRlZm47XG4gICAgICB9XG4gICAgfVxuICAgIGNvcHlCb3goU19WSUVXUE9SVCk7XG4gICAgY29weUJveChwcm9wTmFtZShTX1NDSVNTT1JfQk9YKSk7XG5cbiAgICB2YXIgZGlydHkgPSBPYmplY3Qua2V5cyhzdGF0ZSkubGVuZ3RoID4gMDtcblxuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICBmcmFtZWJ1ZmZlcjogZnJhbWVidWZmZXIsXG4gICAgICBkcmF3OiBkcmF3LFxuICAgICAgc2hhZGVyOiBzaGFkZXIsXG4gICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICBkaXJ0eTogZGlydHlcbiAgICB9O1xuXG4gICAgcmVzdWx0LnByb2ZpbGUgPSBwYXJzZVByb2ZpbGUob3B0aW9ucywgZW52KTtcbiAgICByZXN1bHQudW5pZm9ybXMgPSBwYXJzZVVuaWZvcm1zKHVuaWZvcm1zLCBlbnYpO1xuICAgIHJlc3VsdC5hdHRyaWJ1dGVzID0gcGFyc2VBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMsIGVudik7XG4gICAgcmVzdWx0LmNvbnRleHQgPSBwYXJzZUNvbnRleHQoY29udGV4dCwgZW52KTtcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENPTU1PTiBVUERBVEUgRlVOQ1RJT05TXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZnVuY3Rpb24gZW1pdENvbnRleHQgKGVudiwgc2NvcGUsIGNvbnRleHQpIHtcbiAgICB2YXIgc2hhcmVkID0gZW52LnNoYXJlZDtcbiAgICB2YXIgQ09OVEVYVCA9IHNoYXJlZC5jb250ZXh0O1xuXG4gICAgdmFyIGNvbnRleHRFbnRlciA9IGVudi5zY29wZSgpO1xuXG4gICAgT2JqZWN0LmtleXMoY29udGV4dCkuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgc2NvcGUuc2F2ZShDT05URVhULCAnLicgKyBuYW1lKTtcbiAgICAgIHZhciBkZWZuID0gY29udGV4dFtuYW1lXTtcbiAgICAgIGNvbnRleHRFbnRlcihDT05URVhULCAnLicsIG5hbWUsICc9JywgZGVmbi5hcHBlbmQoZW52LCBzY29wZSksICc7Jyk7XG4gICAgfSk7XG5cbiAgICBzY29wZShjb250ZXh0RW50ZXIpO1xuICB9XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDT01NT04gRFJBV0lORyBGVU5DVElPTlNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBmdW5jdGlvbiBlbWl0UG9sbEZyYW1lYnVmZmVyIChlbnYsIHNjb3BlLCBmcmFtZWJ1ZmZlciwgc2tpcENoZWNrKSB7XG4gICAgdmFyIHNoYXJlZCA9IGVudi5zaGFyZWQ7XG5cbiAgICB2YXIgR0wgPSBzaGFyZWQuZ2w7XG4gICAgdmFyIEZSQU1FQlVGRkVSX1NUQVRFID0gc2hhcmVkLmZyYW1lYnVmZmVyO1xuICAgIHZhciBFWFRfRFJBV19CVUZGRVJTO1xuICAgIGlmIChleHREcmF3QnVmZmVycykge1xuICAgICAgRVhUX0RSQVdfQlVGRkVSUyA9IHNjb3BlLmRlZihzaGFyZWQuZXh0ZW5zaW9ucywgJy53ZWJnbF9kcmF3X2J1ZmZlcnMnKTtcbiAgICB9XG5cbiAgICB2YXIgY29uc3RhbnRzID0gZW52LmNvbnN0YW50cztcblxuICAgIHZhciBEUkFXX0JVRkZFUlMgPSBjb25zdGFudHMuZHJhd0J1ZmZlcjtcbiAgICB2YXIgQkFDS19CVUZGRVIgPSBjb25zdGFudHMuYmFja0J1ZmZlcjtcblxuICAgIHZhciBORVhUO1xuICAgIGlmIChmcmFtZWJ1ZmZlcikge1xuICAgICAgTkVYVCA9IGZyYW1lYnVmZmVyLmFwcGVuZChlbnYsIHNjb3BlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgTkVYVCA9IHNjb3BlLmRlZihGUkFNRUJVRkZFUl9TVEFURSwgJy5uZXh0Jyk7XG4gICAgfVxuXG4gICAgaWYgKCFza2lwQ2hlY2spIHtcbiAgICAgIHNjb3BlKCdpZignLCBORVhULCAnIT09JywgRlJBTUVCVUZGRVJfU1RBVEUsICcuY3VyKXsnKTtcbiAgICB9XG4gICAgc2NvcGUoXG4gICAgICAnaWYoJywgTkVYVCwgJyl7JyxcbiAgICAgIEdMLCAnLmJpbmRGcmFtZWJ1ZmZlcignLCBHTF9GUkFNRUJVRkZFUiQyLCAnLCcsIE5FWFQsICcuZnJhbWVidWZmZXIpOycpO1xuICAgIGlmIChleHREcmF3QnVmZmVycykge1xuICAgICAgc2NvcGUoRVhUX0RSQVdfQlVGRkVSUywgJy5kcmF3QnVmZmVyc1dFQkdMKCcsXG4gICAgICAgIERSQVdfQlVGRkVSUywgJ1snLCBORVhULCAnLmNvbG9yQXR0YWNobWVudHMubGVuZ3RoXSk7Jyk7XG4gICAgfVxuICAgIHNjb3BlKCd9ZWxzZXsnLFxuICAgICAgR0wsICcuYmluZEZyYW1lYnVmZmVyKCcsIEdMX0ZSQU1FQlVGRkVSJDIsICcsbnVsbCk7Jyk7XG4gICAgaWYgKGV4dERyYXdCdWZmZXJzKSB7XG4gICAgICBzY29wZShFWFRfRFJBV19CVUZGRVJTLCAnLmRyYXdCdWZmZXJzV0VCR0woJywgQkFDS19CVUZGRVIsICcpOycpO1xuICAgIH1cbiAgICBzY29wZShcbiAgICAgICd9JyxcbiAgICAgIEZSQU1FQlVGRkVSX1NUQVRFLCAnLmN1cj0nLCBORVhULCAnOycpO1xuICAgIGlmICghc2tpcENoZWNrKSB7XG4gICAgICBzY29wZSgnfScpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGVtaXRQb2xsU3RhdGUgKGVudiwgc2NvcGUsIGFyZ3MpIHtcbiAgICB2YXIgc2hhcmVkID0gZW52LnNoYXJlZDtcblxuICAgIHZhciBHTCA9IHNoYXJlZC5nbDtcblxuICAgIHZhciBDVVJSRU5UX1ZBUlMgPSBlbnYuY3VycmVudDtcbiAgICB2YXIgTkVYVF9WQVJTID0gZW52Lm5leHQ7XG4gICAgdmFyIENVUlJFTlRfU1RBVEUgPSBzaGFyZWQuY3VycmVudDtcbiAgICB2YXIgTkVYVF9TVEFURSA9IHNoYXJlZC5uZXh0O1xuXG4gICAgdmFyIGJsb2NrID0gZW52LmNvbmQoQ1VSUkVOVF9TVEFURSwgJy5kaXJ0eScpO1xuXG4gICAgR0xfU1RBVEVfTkFNRVMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgICAgdmFyIHBhcmFtID0gcHJvcE5hbWUocHJvcCk7XG4gICAgICBpZiAocGFyYW0gaW4gYXJncy5zdGF0ZSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdmFyIE5FWFQsIENVUlJFTlQ7XG4gICAgICBpZiAocGFyYW0gaW4gTkVYVF9WQVJTKSB7XG4gICAgICAgIE5FWFQgPSBORVhUX1ZBUlNbcGFyYW1dO1xuICAgICAgICBDVVJSRU5UID0gQ1VSUkVOVF9WQVJTW3BhcmFtXTtcbiAgICAgICAgdmFyIHBhcnRzID0gbG9vcChjdXJyZW50U3RhdGVbcGFyYW1dLmxlbmd0aCwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICByZXR1cm4gYmxvY2suZGVmKE5FWFQsICdbJywgaSwgJ10nKVxuICAgICAgICB9KTtcbiAgICAgICAgYmxvY2soZW52LmNvbmQocGFydHMubWFwKGZ1bmN0aW9uIChwLCBpKSB7XG4gICAgICAgICAgcmV0dXJuIHAgKyAnIT09JyArIENVUlJFTlQgKyAnWycgKyBpICsgJ10nXG4gICAgICAgIH0pLmpvaW4oJ3x8JykpXG4gICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICBHTCwgJy4nLCBHTF9WQVJJQUJMRVNbcGFyYW1dLCAnKCcsIHBhcnRzLCAnKTsnLFxuICAgICAgICAgICAgcGFydHMubWFwKGZ1bmN0aW9uIChwLCBpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBDVVJSRU5UICsgJ1snICsgaSArICddPScgKyBwXG4gICAgICAgICAgICB9KS5qb2luKCc7JyksICc7JykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgTkVYVCA9IGJsb2NrLmRlZihORVhUX1NUQVRFLCAnLicsIHBhcmFtKTtcbiAgICAgICAgdmFyIGlmdGUgPSBlbnYuY29uZChORVhULCAnIT09JywgQ1VSUkVOVF9TVEFURSwgJy4nLCBwYXJhbSk7XG4gICAgICAgIGJsb2NrKGlmdGUpO1xuICAgICAgICBpZiAocGFyYW0gaW4gR0xfRkxBR1MpIHtcbiAgICAgICAgICBpZnRlKFxuICAgICAgICAgICAgZW52LmNvbmQoTkVYVClcbiAgICAgICAgICAgICAgICAudGhlbihHTCwgJy5lbmFibGUoJywgR0xfRkxBR1NbcGFyYW1dLCAnKTsnKVxuICAgICAgICAgICAgICAgIC5lbHNlKEdMLCAnLmRpc2FibGUoJywgR0xfRkxBR1NbcGFyYW1dLCAnKTsnKSxcbiAgICAgICAgICAgIENVUlJFTlRfU1RBVEUsICcuJywgcGFyYW0sICc9JywgTkVYVCwgJzsnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZnRlKFxuICAgICAgICAgICAgR0wsICcuJywgR0xfVkFSSUFCTEVTW3BhcmFtXSwgJygnLCBORVhULCAnKTsnLFxuICAgICAgICAgICAgQ1VSUkVOVF9TVEFURSwgJy4nLCBwYXJhbSwgJz0nLCBORVhULCAnOycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKE9iamVjdC5rZXlzKGFyZ3Muc3RhdGUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYmxvY2soQ1VSUkVOVF9TVEFURSwgJy5kaXJ0eT1mYWxzZTsnKTtcbiAgICB9XG4gICAgc2NvcGUoYmxvY2spO1xuICB9XG5cbiAgZnVuY3Rpb24gZW1pdFNldE9wdGlvbnMgKGVudiwgc2NvcGUsIG9wdGlvbnMsIGZpbHRlcikge1xuICAgIHZhciBzaGFyZWQgPSBlbnYuc2hhcmVkO1xuICAgIHZhciBDVVJSRU5UX1ZBUlMgPSBlbnYuY3VycmVudDtcbiAgICB2YXIgQ1VSUkVOVF9TVEFURSA9IHNoYXJlZC5jdXJyZW50O1xuICAgIHZhciBHTCA9IHNoYXJlZC5nbDtcbiAgICBzb3J0U3RhdGUoT2JqZWN0LmtleXMob3B0aW9ucykpLmZvckVhY2goZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgZGVmbiA9IG9wdGlvbnNbcGFyYW1dO1xuICAgICAgaWYgKGZpbHRlciAmJiAhZmlsdGVyKGRlZm4pKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdmFyIHZhcmlhYmxlID0gZGVmbi5hcHBlbmQoZW52LCBzY29wZSk7XG4gICAgICBpZiAoR0xfRkxBR1NbcGFyYW1dKSB7XG4gICAgICAgIHZhciBmbGFnID0gR0xfRkxBR1NbcGFyYW1dO1xuICAgICAgICBpZiAoaXNTdGF0aWMoZGVmbikpIHtcbiAgICAgICAgICBpZiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgIHNjb3BlKEdMLCAnLmVuYWJsZSgnLCBmbGFnLCAnKTsnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2NvcGUoR0wsICcuZGlzYWJsZSgnLCBmbGFnLCAnKTsnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2NvcGUoZW52LmNvbmQodmFyaWFibGUpXG4gICAgICAgICAgICAudGhlbihHTCwgJy5lbmFibGUoJywgZmxhZywgJyk7JylcbiAgICAgICAgICAgIC5lbHNlKEdMLCAnLmRpc2FibGUoJywgZmxhZywgJyk7JykpO1xuICAgICAgICB9XG4gICAgICAgIHNjb3BlKENVUlJFTlRfU1RBVEUsICcuJywgcGFyYW0sICc9JywgdmFyaWFibGUsICc7Jyk7XG4gICAgICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKHZhcmlhYmxlKSkge1xuICAgICAgICB2YXIgQ1VSUkVOVCA9IENVUlJFTlRfVkFSU1twYXJhbV07XG4gICAgICAgIHNjb3BlKFxuICAgICAgICAgIEdMLCAnLicsIEdMX1ZBUklBQkxFU1twYXJhbV0sICcoJywgdmFyaWFibGUsICcpOycsXG4gICAgICAgICAgdmFyaWFibGUubWFwKGZ1bmN0aW9uICh2LCBpKSB7XG4gICAgICAgICAgICByZXR1cm4gQ1VSUkVOVCArICdbJyArIGkgKyAnXT0nICsgdlxuICAgICAgICAgIH0pLmpvaW4oJzsnKSwgJzsnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNjb3BlKFxuICAgICAgICAgIEdMLCAnLicsIEdMX1ZBUklBQkxFU1twYXJhbV0sICcoJywgdmFyaWFibGUsICcpOycsXG4gICAgICAgICAgQ1VSUkVOVF9TVEFURSwgJy4nLCBwYXJhbSwgJz0nLCB2YXJpYWJsZSwgJzsnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluamVjdEV4dGVuc2lvbnMgKGVudiwgc2NvcGUpIHtcbiAgICBpZiAoZXh0SW5zdGFuY2luZykge1xuICAgICAgZW52Lmluc3RhbmNpbmcgPSBzY29wZS5kZWYoXG4gICAgICAgIGVudi5zaGFyZWQuZXh0ZW5zaW9ucywgJy5hbmdsZV9pbnN0YW5jZWRfYXJyYXlzJyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZW1pdFByb2ZpbGUgKGVudiwgc2NvcGUsIGFyZ3MsIHVzZVNjb3BlLCBpbmNyZW1lbnRDb3VudGVyKSB7XG4gICAgdmFyIHNoYXJlZCA9IGVudi5zaGFyZWQ7XG4gICAgdmFyIFNUQVRTID0gZW52LnN0YXRzO1xuICAgIHZhciBDVVJSRU5UX1NUQVRFID0gc2hhcmVkLmN1cnJlbnQ7XG4gICAgdmFyIFRJTUVSID0gc2hhcmVkLnRpbWVyO1xuICAgIHZhciBwcm9maWxlQXJnID0gYXJncy5wcm9maWxlO1xuXG4gICAgZnVuY3Rpb24gcGVyZkNvdW50ZXIgKCkge1xuICAgICAgaWYgKHR5cGVvZiBwZXJmb3JtYW5jZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuICdEYXRlLm5vdygpJ1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICdwZXJmb3JtYW5jZS5ub3coKSdcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgQ1BVX1NUQVJULCBRVUVSWV9DT1VOVEVSO1xuICAgIGZ1bmN0aW9uIGVtaXRQcm9maWxlU3RhcnQgKGJsb2NrKSB7XG4gICAgICBDUFVfU1RBUlQgPSBzY29wZS5kZWYoKTtcbiAgICAgIGJsb2NrKENQVV9TVEFSVCwgJz0nLCBwZXJmQ291bnRlcigpLCAnOycpO1xuICAgICAgaWYgKHR5cGVvZiBpbmNyZW1lbnRDb3VudGVyID09PSAnc3RyaW5nJykge1xuICAgICAgICBibG9jayhTVEFUUywgJy5jb3VudCs9JywgaW5jcmVtZW50Q291bnRlciwgJzsnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJsb2NrKFNUQVRTLCAnLmNvdW50Kys7Jyk7XG4gICAgICB9XG4gICAgICBpZiAodGltZXIpIHtcbiAgICAgICAgaWYgKHVzZVNjb3BlKSB7XG4gICAgICAgICAgUVVFUllfQ09VTlRFUiA9IHNjb3BlLmRlZigpO1xuICAgICAgICAgIGJsb2NrKFFVRVJZX0NPVU5URVIsICc9JywgVElNRVIsICcuZ2V0TnVtUGVuZGluZ1F1ZXJpZXMoKTsnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBibG9jayhUSU1FUiwgJy5iZWdpblF1ZXJ5KCcsIFNUQVRTLCAnKTsnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVtaXRQcm9maWxlRW5kIChibG9jaykge1xuICAgICAgYmxvY2soU1RBVFMsICcuY3B1VGltZSs9JywgcGVyZkNvdW50ZXIoKSwgJy0nLCBDUFVfU1RBUlQsICc7Jyk7XG4gICAgICBpZiAodGltZXIpIHtcbiAgICAgICAgaWYgKHVzZVNjb3BlKSB7XG4gICAgICAgICAgYmxvY2soVElNRVIsICcucHVzaFNjb3BlU3RhdHMoJyxcbiAgICAgICAgICAgIFFVRVJZX0NPVU5URVIsICcsJyxcbiAgICAgICAgICAgIFRJTUVSLCAnLmdldE51bVBlbmRpbmdRdWVyaWVzKCksJyxcbiAgICAgICAgICAgIFNUQVRTLCAnKTsnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBibG9jayhUSU1FUiwgJy5lbmRRdWVyeSgpOycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NvcGVQcm9maWxlICh2YWx1ZSkge1xuICAgICAgdmFyIHByZXYgPSBzY29wZS5kZWYoQ1VSUkVOVF9TVEFURSwgJy5wcm9maWxlJyk7XG4gICAgICBzY29wZShDVVJSRU5UX1NUQVRFLCAnLnByb2ZpbGU9JywgdmFsdWUsICc7Jyk7XG4gICAgICBzY29wZS5leGl0KENVUlJFTlRfU1RBVEUsICcucHJvZmlsZT0nLCBwcmV2LCAnOycpO1xuICAgIH1cblxuICAgIHZhciBVU0VfUFJPRklMRTtcbiAgICBpZiAocHJvZmlsZUFyZykge1xuICAgICAgaWYgKGlzU3RhdGljKHByb2ZpbGVBcmcpKSB7XG4gICAgICAgIGlmIChwcm9maWxlQXJnLmVuYWJsZSkge1xuICAgICAgICAgIGVtaXRQcm9maWxlU3RhcnQoc2NvcGUpO1xuICAgICAgICAgIGVtaXRQcm9maWxlRW5kKHNjb3BlLmV4aXQpO1xuICAgICAgICAgIHNjb3BlUHJvZmlsZSgndHJ1ZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNjb3BlUHJvZmlsZSgnZmFsc2UnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIFVTRV9QUk9GSUxFID0gcHJvZmlsZUFyZy5hcHBlbmQoZW52LCBzY29wZSk7XG4gICAgICBzY29wZVByb2ZpbGUoVVNFX1BST0ZJTEUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBVU0VfUFJPRklMRSA9IHNjb3BlLmRlZihDVVJSRU5UX1NUQVRFLCAnLnByb2ZpbGUnKTtcbiAgICB9XG5cbiAgICB2YXIgc3RhcnQgPSBlbnYuYmxvY2soKTtcbiAgICBlbWl0UHJvZmlsZVN0YXJ0KHN0YXJ0KTtcbiAgICBzY29wZSgnaWYoJywgVVNFX1BST0ZJTEUsICcpeycsIHN0YXJ0LCAnfScpO1xuICAgIHZhciBlbmQgPSBlbnYuYmxvY2soKTtcbiAgICBlbWl0UHJvZmlsZUVuZChlbmQpO1xuICAgIHNjb3BlLmV4aXQoJ2lmKCcsIFVTRV9QUk9GSUxFLCAnKXsnLCBlbmQsICd9Jyk7XG4gIH1cblxuICBmdW5jdGlvbiBlbWl0QXR0cmlidXRlcyAoZW52LCBzY29wZSwgYXJncywgYXR0cmlidXRlcywgZmlsdGVyKSB7XG4gICAgdmFyIHNoYXJlZCA9IGVudi5zaGFyZWQ7XG5cbiAgICBmdW5jdGlvbiB0eXBlTGVuZ3RoICh4KSB7XG4gICAgICBzd2l0Y2ggKHgpIHtcbiAgICAgICAgY2FzZSBHTF9GTE9BVF9WRUMyOlxuICAgICAgICBjYXNlIEdMX0lOVF9WRUMyOlxuICAgICAgICBjYXNlIEdMX0JPT0xfVkVDMjpcbiAgICAgICAgICByZXR1cm4gMlxuICAgICAgICBjYXNlIEdMX0ZMT0FUX1ZFQzM6XG4gICAgICAgIGNhc2UgR0xfSU5UX1ZFQzM6XG4gICAgICAgIGNhc2UgR0xfQk9PTF9WRUMzOlxuICAgICAgICAgIHJldHVybiAzXG4gICAgICAgIGNhc2UgR0xfRkxPQVRfVkVDNDpcbiAgICAgICAgY2FzZSBHTF9JTlRfVkVDNDpcbiAgICAgICAgY2FzZSBHTF9CT09MX1ZFQzQ6XG4gICAgICAgICAgcmV0dXJuIDRcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gMVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVtaXRCaW5kQXR0cmlidXRlIChBVFRSSUJVVEUsIHNpemUsIHJlY29yZCkge1xuICAgICAgdmFyIEdMID0gc2hhcmVkLmdsO1xuXG4gICAgICB2YXIgTE9DQVRJT04gPSBzY29wZS5kZWYoQVRUUklCVVRFLCAnLmxvY2F0aW9uJyk7XG4gICAgICB2YXIgQklORElORyA9IHNjb3BlLmRlZihzaGFyZWQuYXR0cmlidXRlcywgJ1snLCBMT0NBVElPTiwgJ10nKTtcblxuICAgICAgdmFyIFNUQVRFID0gcmVjb3JkLnN0YXRlO1xuICAgICAgdmFyIEJVRkZFUiA9IHJlY29yZC5idWZmZXI7XG4gICAgICB2YXIgQ09OU1RfQ09NUE9ORU5UUyA9IFtcbiAgICAgICAgcmVjb3JkLngsXG4gICAgICAgIHJlY29yZC55LFxuICAgICAgICByZWNvcmQueixcbiAgICAgICAgcmVjb3JkLndcbiAgICAgIF07XG5cbiAgICAgIHZhciBDT01NT05fS0VZUyA9IFtcbiAgICAgICAgJ2J1ZmZlcicsXG4gICAgICAgICdub3JtYWxpemVkJyxcbiAgICAgICAgJ29mZnNldCcsXG4gICAgICAgICdzdHJpZGUnXG4gICAgICBdO1xuXG4gICAgICBmdW5jdGlvbiBlbWl0QnVmZmVyICgpIHtcbiAgICAgICAgc2NvcGUoXG4gICAgICAgICAgJ2lmKCEnLCBCSU5ESU5HLCAnLmJ1ZmZlcil7JyxcbiAgICAgICAgICBHTCwgJy5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSgnLCBMT0NBVElPTiwgJyk7fScpO1xuXG4gICAgICAgIHZhciBUWVBFID0gcmVjb3JkLnR5cGU7XG4gICAgICAgIHZhciBTSVpFO1xuICAgICAgICBpZiAoIXJlY29yZC5zaXplKSB7XG4gICAgICAgICAgU0laRSA9IHNpemU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgU0laRSA9IHNjb3BlLmRlZihyZWNvcmQuc2l6ZSwgJ3x8Jywgc2l6ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBzY29wZSgnaWYoJyxcbiAgICAgICAgICBCSU5ESU5HLCAnLnR5cGUhPT0nLCBUWVBFLCAnfHwnLFxuICAgICAgICAgIEJJTkRJTkcsICcuc2l6ZSE9PScsIFNJWkUsICd8fCcsXG4gICAgICAgICAgQ09NTU9OX0tFWVMubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBCSU5ESU5HICsgJy4nICsga2V5ICsgJyE9PScgKyByZWNvcmRba2V5XVxuICAgICAgICAgIH0pLmpvaW4oJ3x8JyksXG4gICAgICAgICAgJyl7JyxcbiAgICAgICAgICBHTCwgJy5iaW5kQnVmZmVyKCcsIEdMX0FSUkFZX0JVRkZFUiQxLCAnLCcsIEJVRkZFUiwgJy5idWZmZXIpOycsXG4gICAgICAgICAgR0wsICcudmVydGV4QXR0cmliUG9pbnRlcignLCBbXG4gICAgICAgICAgICBMT0NBVElPTixcbiAgICAgICAgICAgIFNJWkUsXG4gICAgICAgICAgICBUWVBFLFxuICAgICAgICAgICAgcmVjb3JkLm5vcm1hbGl6ZWQsXG4gICAgICAgICAgICByZWNvcmQuc3RyaWRlLFxuICAgICAgICAgICAgcmVjb3JkLm9mZnNldFxuICAgICAgICAgIF0sICcpOycsXG4gICAgICAgICAgQklORElORywgJy50eXBlPScsIFRZUEUsICc7JyxcbiAgICAgICAgICBCSU5ESU5HLCAnLnNpemU9JywgU0laRSwgJzsnLFxuICAgICAgICAgIENPTU1PTl9LRVlTLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gQklORElORyArICcuJyArIGtleSArICc9JyArIHJlY29yZFtrZXldICsgJzsnXG4gICAgICAgICAgfSkuam9pbignJyksXG4gICAgICAgICAgJ30nKTtcblxuICAgICAgICBpZiAoZXh0SW5zdGFuY2luZykge1xuICAgICAgICAgIHZhciBESVZJU09SID0gcmVjb3JkLmRpdmlzb3I7XG4gICAgICAgICAgc2NvcGUoXG4gICAgICAgICAgICAnaWYoJywgQklORElORywgJy5kaXZpc29yIT09JywgRElWSVNPUiwgJyl7JyxcbiAgICAgICAgICAgIGVudi5pbnN0YW5jaW5nLCAnLnZlcnRleEF0dHJpYkRpdmlzb3JBTkdMRSgnLCBbTE9DQVRJT04sIERJVklTT1JdLCAnKTsnLFxuICAgICAgICAgICAgQklORElORywgJy5kaXZpc29yPScsIERJVklTT1IsICc7fScpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGVtaXRDb25zdGFudCAoKSB7XG4gICAgICAgIHNjb3BlKFxuICAgICAgICAgICdpZignLCBCSU5ESU5HLCAnLmJ1ZmZlcil7JyxcbiAgICAgICAgICBHTCwgJy5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoJywgTE9DQVRJT04sICcpOycsXG4gICAgICAgICAgJ31pZignLCBDVVRFX0NPTVBPTkVOVFMubWFwKGZ1bmN0aW9uIChjLCBpKSB7XG4gICAgICAgICAgICByZXR1cm4gQklORElORyArICcuJyArIGMgKyAnIT09JyArIENPTlNUX0NPTVBPTkVOVFNbaV1cbiAgICAgICAgICB9KS5qb2luKCd8fCcpLCAnKXsnLFxuICAgICAgICAgIEdMLCAnLnZlcnRleEF0dHJpYjRmKCcsIExPQ0FUSU9OLCAnLCcsIENPTlNUX0NPTVBPTkVOVFMsICcpOycsXG4gICAgICAgICAgQ1VURV9DT01QT05FTlRTLm1hcChmdW5jdGlvbiAoYywgaSkge1xuICAgICAgICAgICAgcmV0dXJuIEJJTkRJTkcgKyAnLicgKyBjICsgJz0nICsgQ09OU1RfQ09NUE9ORU5UU1tpXSArICc7J1xuICAgICAgICAgIH0pLmpvaW4oJycpLFxuICAgICAgICAgICd9Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChTVEFURSA9PT0gQVRUUklCX1NUQVRFX1BPSU5URVIpIHtcbiAgICAgICAgZW1pdEJ1ZmZlcigpO1xuICAgICAgfSBlbHNlIGlmIChTVEFURSA9PT0gQVRUUklCX1NUQVRFX0NPTlNUQU5UKSB7XG4gICAgICAgIGVtaXRDb25zdGFudCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NvcGUoJ2lmKCcsIFNUQVRFLCAnPT09JywgQVRUUklCX1NUQVRFX1BPSU5URVIsICcpeycpO1xuICAgICAgICBlbWl0QnVmZmVyKCk7XG4gICAgICAgIHNjb3BlKCd9ZWxzZXsnKTtcbiAgICAgICAgZW1pdENvbnN0YW50KCk7XG4gICAgICAgIHNjb3BlKCd9Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgIHZhciBuYW1lID0gYXR0cmlidXRlLm5hbWU7XG4gICAgICB2YXIgYXJnID0gYXJncy5hdHRyaWJ1dGVzW25hbWVdO1xuICAgICAgdmFyIHJlY29yZDtcbiAgICAgIGlmIChhcmcpIHtcbiAgICAgICAgaWYgKCFmaWx0ZXIoYXJnKSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHJlY29yZCA9IGFyZy5hcHBlbmQoZW52LCBzY29wZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWZpbHRlcihTQ09QRV9ERUNMKSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHZhciBzY29wZUF0dHJpYiA9IGVudi5zY29wZUF0dHJpYihuYW1lKTtcbiAgICAgICAgY2hlY2skMS5vcHRpb25hbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZW52LmFzc2VydChzY29wZSxcbiAgICAgICAgICAgIHNjb3BlQXR0cmliICsgJy5zdGF0ZScsXG4gICAgICAgICAgICAnbWlzc2luZyBhdHRyaWJ1dGUgJyArIG5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVjb3JkID0ge307XG4gICAgICAgIE9iamVjdC5rZXlzKG5ldyBBdHRyaWJ1dGVSZWNvcmQoKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcmVjb3JkW2tleV0gPSBzY29wZS5kZWYoc2NvcGVBdHRyaWIsICcuJywga2V5KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBlbWl0QmluZEF0dHJpYnV0ZShcbiAgICAgICAgZW52LmxpbmsoYXR0cmlidXRlKSwgdHlwZUxlbmd0aChhdHRyaWJ1dGUuaW5mby50eXBlKSwgcmVjb3JkKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVtaXRVbmlmb3JtcyAoZW52LCBzY29wZSwgYXJncywgdW5pZm9ybXMsIGZpbHRlcikge1xuICAgIHZhciBzaGFyZWQgPSBlbnYuc2hhcmVkO1xuICAgIHZhciBHTCA9IHNoYXJlZC5nbDtcblxuICAgIHZhciBpbmZpeDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVuaWZvcm1zLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgdW5pZm9ybSA9IHVuaWZvcm1zW2ldO1xuICAgICAgdmFyIG5hbWUgPSB1bmlmb3JtLm5hbWU7XG4gICAgICB2YXIgdHlwZSA9IHVuaWZvcm0uaW5mby50eXBlO1xuICAgICAgdmFyIGFyZyA9IGFyZ3MudW5pZm9ybXNbbmFtZV07XG4gICAgICB2YXIgVU5JRk9STSA9IGVudi5saW5rKHVuaWZvcm0pO1xuICAgICAgdmFyIExPQ0FUSU9OID0gVU5JRk9STSArICcubG9jYXRpb24nO1xuXG4gICAgICB2YXIgVkFMVUU7XG4gICAgICBpZiAoYXJnKSB7XG4gICAgICAgIGlmICghZmlsdGVyKGFyZykpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG4gICAgICAgIGlmIChpc1N0YXRpYyhhcmcpKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gYXJnLnZhbHVlO1xuICAgICAgICAgIGNoZWNrJDEuY29tbWFuZChcbiAgICAgICAgICAgIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcsXG4gICAgICAgICAgICAnbWlzc2luZyB1bmlmb3JtIFwiJyArIG5hbWUgKyAnXCInLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgaWYgKHR5cGUgPT09IEdMX1NBTVBMRVJfMkQgfHwgdHlwZSA9PT0gR0xfU0FNUExFUl9DVUJFKSB7XG4gICAgICAgICAgICBjaGVjayQxLmNvbW1hbmQoXG4gICAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAgICAgICAoKHR5cGUgPT09IEdMX1NBTVBMRVJfMkQgJiZcbiAgICAgICAgICAgICAgICAodmFsdWUuX3JlZ2xUeXBlID09PSAndGV4dHVyZTJkJyB8fFxuICAgICAgICAgICAgICAgIHZhbHVlLl9yZWdsVHlwZSA9PT0gJ2ZyYW1lYnVmZmVyJykpIHx8XG4gICAgICAgICAgICAgICh0eXBlID09PSBHTF9TQU1QTEVSX0NVQkUgJiZcbiAgICAgICAgICAgICAgICAodmFsdWUuX3JlZ2xUeXBlID09PSAndGV4dHVyZUN1YmUnIHx8XG4gICAgICAgICAgICAgICAgdmFsdWUuX3JlZ2xUeXBlID09PSAnZnJhbWVidWZmZXJDdWJlJykpKSxcbiAgICAgICAgICAgICAgJ2ludmFsaWQgdGV4dHVyZSBmb3IgdW5pZm9ybSAnICsgbmFtZSwgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICAgICAgdmFyIFRFWF9WQUxVRSA9IGVudi5saW5rKHZhbHVlLl90ZXh0dXJlIHx8IHZhbHVlLmNvbG9yWzBdLl90ZXh0dXJlKTtcbiAgICAgICAgICAgIHNjb3BlKEdMLCAnLnVuaWZvcm0xaSgnLCBMT0NBVElPTiwgJywnLCBURVhfVkFMVUUgKyAnLmJpbmQoKSk7Jyk7XG4gICAgICAgICAgICBzY29wZS5leGl0KFRFWF9WQUxVRSwgJy51bmJpbmQoKTsnKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgdHlwZSA9PT0gR0xfRkxPQVRfTUFUMiB8fFxuICAgICAgICAgICAgdHlwZSA9PT0gR0xfRkxPQVRfTUFUMyB8fFxuICAgICAgICAgICAgdHlwZSA9PT0gR0xfRkxPQVRfTUFUNCkge1xuICAgICAgICAgICAgY2hlY2skMS5vcHRpb25hbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZChpc0FycmF5TGlrZSh2YWx1ZSksXG4gICAgICAgICAgICAgICAgJ2ludmFsaWQgbWF0cml4IGZvciB1bmlmb3JtICcgKyBuYW1lLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZChcbiAgICAgICAgICAgICAgICAodHlwZSA9PT0gR0xfRkxPQVRfTUFUMiAmJiB2YWx1ZS5sZW5ndGggPT09IDQpIHx8XG4gICAgICAgICAgICAgICAgKHR5cGUgPT09IEdMX0ZMT0FUX01BVDMgJiYgdmFsdWUubGVuZ3RoID09PSA5KSB8fFxuICAgICAgICAgICAgICAgICh0eXBlID09PSBHTF9GTE9BVF9NQVQ0ICYmIHZhbHVlLmxlbmd0aCA9PT0gMTYpLFxuICAgICAgICAgICAgICAgICdpbnZhbGlkIGxlbmd0aCBmb3IgbWF0cml4IHVuaWZvcm0gJyArIG5hbWUsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIE1BVF9WQUxVRSA9IGVudi5nbG9iYWwuZGVmKCduZXcgRmxvYXQzMkFycmF5KFsnICtcbiAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodmFsdWUpICsgJ10pJyk7XG4gICAgICAgICAgICB2YXIgZGltID0gMjtcbiAgICAgICAgICAgIGlmICh0eXBlID09PSBHTF9GTE9BVF9NQVQzKSB7XG4gICAgICAgICAgICAgIGRpbSA9IDM7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IEdMX0ZMT0FUX01BVDQpIHtcbiAgICAgICAgICAgICAgZGltID0gNDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNjb3BlKFxuICAgICAgICAgICAgICBHTCwgJy51bmlmb3JtTWF0cml4JywgZGltLCAnZnYoJyxcbiAgICAgICAgICAgICAgTE9DQVRJT04sICcsZmFsc2UsJywgTUFUX1ZBTFVFLCAnKTsnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgIGNhc2UgR0xfRkxPQVQkODpcbiAgICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmRUeXBlKHZhbHVlLCAnbnVtYmVyJywgJ3VuaWZvcm0gJyArIG5hbWUsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgICBpbmZpeCA9ICcxZic7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgY2FzZSBHTF9GTE9BVF9WRUMyOlxuICAgICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZChcbiAgICAgICAgICAgICAgICAgIGlzQXJyYXlMaWtlKHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDIsXG4gICAgICAgICAgICAgICAgICAndW5pZm9ybSAnICsgbmFtZSwgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICAgICAgICAgIGluZml4ID0gJzJmJztcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICBjYXNlIEdMX0ZMT0FUX1ZFQzM6XG4gICAgICAgICAgICAgICAgY2hlY2skMS5jb21tYW5kKFxuICAgICAgICAgICAgICAgICAgaXNBcnJheUxpa2UodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMyxcbiAgICAgICAgICAgICAgICAgICd1bmlmb3JtICcgKyBuYW1lLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgICAgaW5maXggPSAnM2YnO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgIGNhc2UgR0xfRkxPQVRfVkVDNDpcbiAgICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmQoXG4gICAgICAgICAgICAgICAgICBpc0FycmF5TGlrZSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSA0LFxuICAgICAgICAgICAgICAgICAgJ3VuaWZvcm0gJyArIG5hbWUsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgICBpbmZpeCA9ICc0Zic7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgY2FzZSBHTF9CT09MOlxuICAgICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZFR5cGUodmFsdWUsICdib29sZWFuJywgJ3VuaWZvcm0gJyArIG5hbWUsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgICBpbmZpeCA9ICcxaSc7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgY2FzZSBHTF9JTlQkMzpcbiAgICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmRUeXBlKHZhbHVlLCAnbnVtYmVyJywgJ3VuaWZvcm0gJyArIG5hbWUsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgICBpbmZpeCA9ICcxaSc7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgY2FzZSBHTF9CT09MX1ZFQzI6XG4gICAgICAgICAgICAgICAgY2hlY2skMS5jb21tYW5kKFxuICAgICAgICAgICAgICAgICAgaXNBcnJheUxpa2UodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMixcbiAgICAgICAgICAgICAgICAgICd1bmlmb3JtICcgKyBuYW1lLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgICAgaW5maXggPSAnMmknO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgIGNhc2UgR0xfSU5UX1ZFQzI6XG4gICAgICAgICAgICAgICAgY2hlY2skMS5jb21tYW5kKFxuICAgICAgICAgICAgICAgICAgaXNBcnJheUxpa2UodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMixcbiAgICAgICAgICAgICAgICAgICd1bmlmb3JtICcgKyBuYW1lLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgICAgICAgICAgaW5maXggPSAnMmknO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgIGNhc2UgR0xfQk9PTF9WRUMzOlxuICAgICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZChcbiAgICAgICAgICAgICAgICAgIGlzQXJyYXlMaWtlKHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDMsXG4gICAgICAgICAgICAgICAgICAndW5pZm9ybSAnICsgbmFtZSwgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICAgICAgICAgIGluZml4ID0gJzNpJztcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICBjYXNlIEdMX0lOVF9WRUMzOlxuICAgICAgICAgICAgICAgIGNoZWNrJDEuY29tbWFuZChcbiAgICAgICAgICAgICAgICAgIGlzQXJyYXlMaWtlKHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDMsXG4gICAgICAgICAgICAgICAgICAndW5pZm9ybSAnICsgbmFtZSwgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICAgICAgICAgIGluZml4ID0gJzNpJztcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICBjYXNlIEdMX0JPT0xfVkVDNDpcbiAgICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmQoXG4gICAgICAgICAgICAgICAgICBpc0FycmF5TGlrZSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSA0LFxuICAgICAgICAgICAgICAgICAgJ3VuaWZvcm0gJyArIG5hbWUsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgICBpbmZpeCA9ICc0aSc7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgY2FzZSBHTF9JTlRfVkVDNDpcbiAgICAgICAgICAgICAgICBjaGVjayQxLmNvbW1hbmQoXG4gICAgICAgICAgICAgICAgICBpc0FycmF5TGlrZSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSA0LFxuICAgICAgICAgICAgICAgICAgJ3VuaWZvcm0gJyArIG5hbWUsIGVudi5jb21tYW5kU3RyKTtcbiAgICAgICAgICAgICAgICBpbmZpeCA9ICc0aSc7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNjb3BlKEdMLCAnLnVuaWZvcm0nLCBpbmZpeCwgJygnLCBMT0NBVElPTiwgJywnLFxuICAgICAgICAgICAgICBpc0FycmF5TGlrZSh2YWx1ZSkgPyBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh2YWx1ZSkgOiB2YWx1ZSxcbiAgICAgICAgICAgICAgJyk7Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgVkFMVUUgPSBhcmcuYXBwZW5kKGVudiwgc2NvcGUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWZpbHRlcihTQ09QRV9ERUNMKSkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICAgICAgVkFMVUUgPSBzY29wZS5kZWYoc2hhcmVkLnVuaWZvcm1zLCAnWycsIHN0cmluZ1N0b3JlLmlkKG5hbWUpLCAnXScpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZSA9PT0gR0xfU0FNUExFUl8yRCkge1xuICAgICAgICBzY29wZShcbiAgICAgICAgICAnaWYoJywgVkFMVUUsICcmJicsIFZBTFVFLCAnLl9yZWdsVHlwZT09PVwiZnJhbWVidWZmZXJcIil7JyxcbiAgICAgICAgICBWQUxVRSwgJz0nLCBWQUxVRSwgJy5jb2xvclswXTsnLFxuICAgICAgICAgICd9Jyk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IEdMX1NBTVBMRVJfQ1VCRSkge1xuICAgICAgICBzY29wZShcbiAgICAgICAgICAnaWYoJywgVkFMVUUsICcmJicsIFZBTFVFLCAnLl9yZWdsVHlwZT09PVwiZnJhbWVidWZmZXJDdWJlXCIpeycsXG4gICAgICAgICAgVkFMVUUsICc9JywgVkFMVUUsICcuY29sb3JbMF07JyxcbiAgICAgICAgICAnfScpO1xuICAgICAgfVxuXG4gICAgICAvLyBwZXJmb3JtIHR5cGUgdmFsaWRhdGlvblxuICAgICAgY2hlY2skMS5vcHRpb25hbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrIChwcmVkLCBtZXNzYWdlKSB7XG4gICAgICAgICAgZW52LmFzc2VydChzY29wZSwgcHJlZCxcbiAgICAgICAgICAgICdiYWQgZGF0YSBvciBtaXNzaW5nIGZvciB1bmlmb3JtIFwiJyArIG5hbWUgKyAnXCIuICAnICsgbWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjaGVja1R5cGUgKHR5cGUpIHtcbiAgICAgICAgICBjaGVjayhcbiAgICAgICAgICAgICd0eXBlb2YgJyArIFZBTFVFICsgJz09PVwiJyArIHR5cGUgKyAnXCInLFxuICAgICAgICAgICAgJ2ludmFsaWQgdHlwZSwgZXhwZWN0ZWQgJyArIHR5cGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tWZWN0b3IgKG4sIHR5cGUpIHtcbiAgICAgICAgICBjaGVjayhcbiAgICAgICAgICAgIHNoYXJlZC5pc0FycmF5TGlrZSArICcoJyArIFZBTFVFICsgJykmJicgKyBWQUxVRSArICcubGVuZ3RoPT09JyArIG4sXG4gICAgICAgICAgICAnaW52YWxpZCB2ZWN0b3IsIHNob3VsZCBoYXZlIGxlbmd0aCAnICsgbiwgZW52LmNvbW1hbmRTdHIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tUZXh0dXJlICh0YXJnZXQpIHtcbiAgICAgICAgICBjaGVjayhcbiAgICAgICAgICAgICd0eXBlb2YgJyArIFZBTFVFICsgJz09PVwiZnVuY3Rpb25cIiYmJyArXG4gICAgICAgICAgICBWQUxVRSArICcuX3JlZ2xUeXBlPT09XCJ0ZXh0dXJlJyArXG4gICAgICAgICAgICAodGFyZ2V0ID09PSBHTF9URVhUVVJFXzJEJDMgPyAnMmQnIDogJ0N1YmUnKSArICdcIicsXG4gICAgICAgICAgICAnaW52YWxpZCB0ZXh0dXJlIHR5cGUnLCBlbnYuY29tbWFuZFN0cik7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICBjYXNlIEdMX0lOVCQzOlxuICAgICAgICAgICAgY2hlY2tUeXBlKCdudW1iZXInKTtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSBHTF9JTlRfVkVDMjpcbiAgICAgICAgICAgIGNoZWNrVmVjdG9yKDIsICdudW1iZXInKTtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSBHTF9JTlRfVkVDMzpcbiAgICAgICAgICAgIGNoZWNrVmVjdG9yKDMsICdudW1iZXInKTtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSBHTF9JTlRfVkVDNDpcbiAgICAgICAgICAgIGNoZWNrVmVjdG9yKDQsICdudW1iZXInKTtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSBHTF9GTE9BVCQ4OlxuICAgICAgICAgICAgY2hlY2tUeXBlKCdudW1iZXInKTtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSBHTF9GTE9BVF9WRUMyOlxuICAgICAgICAgICAgY2hlY2tWZWN0b3IoMiwgJ251bWJlcicpO1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlIEdMX0ZMT0FUX1ZFQzM6XG4gICAgICAgICAgICBjaGVja1ZlY3RvcigzLCAnbnVtYmVyJyk7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgR0xfRkxPQVRfVkVDNDpcbiAgICAgICAgICAgIGNoZWNrVmVjdG9yKDQsICdudW1iZXInKTtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSBHTF9CT09MOlxuICAgICAgICAgICAgY2hlY2tUeXBlKCdib29sZWFuJyk7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgR0xfQk9PTF9WRUMyOlxuICAgICAgICAgICAgY2hlY2tWZWN0b3IoMiwgJ2Jvb2xlYW4nKTtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSBHTF9CT09MX1ZFQzM6XG4gICAgICAgICAgICBjaGVja1ZlY3RvcigzLCAnYm9vbGVhbicpO1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlIEdMX0JPT0xfVkVDNDpcbiAgICAgICAgICAgIGNoZWNrVmVjdG9yKDQsICdib29sZWFuJyk7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgR0xfRkxPQVRfTUFUMjpcbiAgICAgICAgICAgIGNoZWNrVmVjdG9yKDQsICdudW1iZXInKTtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSBHTF9GTE9BVF9NQVQzOlxuICAgICAgICAgICAgY2hlY2tWZWN0b3IoOSwgJ251bWJlcicpO1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlIEdMX0ZMT0FUX01BVDQ6XG4gICAgICAgICAgICBjaGVja1ZlY3RvcigxNiwgJ251bWJlcicpO1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlIEdMX1NBTVBMRVJfMkQ6XG4gICAgICAgICAgICBjaGVja1RleHR1cmUoR0xfVEVYVFVSRV8yRCQzKTtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSBHTF9TQU1QTEVSX0NVQkU6XG4gICAgICAgICAgICBjaGVja1RleHR1cmUoR0xfVEVYVFVSRV9DVUJFX01BUCQyKTtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB2YXIgdW5yb2xsID0gMTtcbiAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIEdMX1NBTVBMRVJfMkQ6XG4gICAgICAgIGNhc2UgR0xfU0FNUExFUl9DVUJFOlxuICAgICAgICAgIHZhciBURVggPSBzY29wZS5kZWYoVkFMVUUsICcuX3RleHR1cmUnKTtcbiAgICAgICAgICBzY29wZShHTCwgJy51bmlmb3JtMWkoJywgTE9DQVRJT04sICcsJywgVEVYLCAnLmJpbmQoKSk7Jyk7XG4gICAgICAgICAgc2NvcGUuZXhpdChURVgsICcudW5iaW5kKCk7Jyk7XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIEdMX0lOVCQzOlxuICAgICAgICBjYXNlIEdMX0JPT0w6XG4gICAgICAgICAgaW5maXggPSAnMWknO1xuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSBHTF9JTlRfVkVDMjpcbiAgICAgICAgY2FzZSBHTF9CT09MX1ZFQzI6XG4gICAgICAgICAgaW5maXggPSAnMmknO1xuICAgICAgICAgIHVucm9sbCA9IDI7XG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlIEdMX0lOVF9WRUMzOlxuICAgICAgICBjYXNlIEdMX0JPT0xfVkVDMzpcbiAgICAgICAgICBpbmZpeCA9ICczaSc7XG4gICAgICAgICAgdW5yb2xsID0gMztcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgR0xfSU5UX1ZFQzQ6XG4gICAgICAgIGNhc2UgR0xfQk9PTF9WRUM0OlxuICAgICAgICAgIGluZml4ID0gJzRpJztcbiAgICAgICAgICB1bnJvbGwgPSA0O1xuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSBHTF9GTE9BVCQ4OlxuICAgICAgICAgIGluZml4ID0gJzFmJztcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgR0xfRkxPQVRfVkVDMjpcbiAgICAgICAgICBpbmZpeCA9ICcyZic7XG4gICAgICAgICAgdW5yb2xsID0gMjtcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgR0xfRkxPQVRfVkVDMzpcbiAgICAgICAgICBpbmZpeCA9ICczZic7XG4gICAgICAgICAgdW5yb2xsID0gMztcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgR0xfRkxPQVRfVkVDNDpcbiAgICAgICAgICBpbmZpeCA9ICc0Zic7XG4gICAgICAgICAgdW5yb2xsID0gNDtcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgR0xfRkxPQVRfTUFUMjpcbiAgICAgICAgICBpbmZpeCA9ICdNYXRyaXgyZnYnO1xuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSBHTF9GTE9BVF9NQVQzOlxuICAgICAgICAgIGluZml4ID0gJ01hdHJpeDNmdic7XG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlIEdMX0ZMT0FUX01BVDQ6XG4gICAgICAgICAgaW5maXggPSAnTWF0cml4NGZ2JztcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBzY29wZShHTCwgJy51bmlmb3JtJywgaW5maXgsICcoJywgTE9DQVRJT04sICcsJyk7XG4gICAgICBpZiAoaW5maXguY2hhckF0KDApID09PSAnTScpIHtcbiAgICAgICAgdmFyIG1hdFNpemUgPSBNYXRoLnBvdyh0eXBlIC0gR0xfRkxPQVRfTUFUMiArIDIsIDIpO1xuICAgICAgICB2YXIgU1RPUkFHRSA9IGVudi5nbG9iYWwuZGVmKCduZXcgRmxvYXQzMkFycmF5KCcsIG1hdFNpemUsICcpJyk7XG4gICAgICAgIHNjb3BlKFxuICAgICAgICAgICdmYWxzZSwoQXJyYXkuaXNBcnJheSgnLCBWQUxVRSwgJyl8fCcsIFZBTFVFLCAnIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5KT8nLCBWQUxVRSwgJzooJyxcbiAgICAgICAgICBsb29wKG1hdFNpemUsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICByZXR1cm4gU1RPUkFHRSArICdbJyArIGkgKyAnXT0nICsgVkFMVUUgKyAnWycgKyBpICsgJ10nXG4gICAgICAgICAgfSksICcsJywgU1RPUkFHRSwgJyknKTtcbiAgICAgIH0gZWxzZSBpZiAodW5yb2xsID4gMSkge1xuICAgICAgICBzY29wZShsb29wKHVucm9sbCwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICByZXR1cm4gVkFMVUUgKyAnWycgKyBpICsgJ10nXG4gICAgICAgIH0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNjb3BlKFZBTFVFKTtcbiAgICAgIH1cbiAgICAgIHNjb3BlKCcpOycpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGVtaXREcmF3IChlbnYsIG91dGVyLCBpbm5lciwgYXJncykge1xuICAgIHZhciBzaGFyZWQgPSBlbnYuc2hhcmVkO1xuICAgIHZhciBHTCA9IHNoYXJlZC5nbDtcbiAgICB2YXIgRFJBV19TVEFURSA9IHNoYXJlZC5kcmF3O1xuXG4gICAgdmFyIGRyYXdPcHRpb25zID0gYXJncy5kcmF3O1xuXG4gICAgZnVuY3Rpb24gZW1pdEVsZW1lbnRzICgpIHtcbiAgICAgIHZhciBkZWZuID0gZHJhd09wdGlvbnMuZWxlbWVudHM7XG4gICAgICB2YXIgRUxFTUVOVFM7XG4gICAgICB2YXIgc2NvcGUgPSBvdXRlcjtcbiAgICAgIGlmIChkZWZuKSB7XG4gICAgICAgIGlmICgoZGVmbi5jb250ZXh0RGVwICYmIGFyZ3MuY29udGV4dER5bmFtaWMpIHx8IGRlZm4ucHJvcERlcCkge1xuICAgICAgICAgIHNjb3BlID0gaW5uZXI7XG4gICAgICAgIH1cbiAgICAgICAgRUxFTUVOVFMgPSBkZWZuLmFwcGVuZChlbnYsIHNjb3BlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEVMRU1FTlRTID0gc2NvcGUuZGVmKERSQVdfU1RBVEUsICcuJywgU19FTEVNRU5UUyk7XG4gICAgICB9XG4gICAgICBpZiAoRUxFTUVOVFMpIHtcbiAgICAgICAgc2NvcGUoXG4gICAgICAgICAgJ2lmKCcgKyBFTEVNRU5UUyArICcpJyArXG4gICAgICAgICAgR0wgKyAnLmJpbmRCdWZmZXIoJyArIEdMX0VMRU1FTlRfQVJSQVlfQlVGRkVSJDEgKyAnLCcgKyBFTEVNRU5UUyArICcuYnVmZmVyLmJ1ZmZlcik7Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gRUxFTUVOVFNcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbWl0Q291bnQgKCkge1xuICAgICAgdmFyIGRlZm4gPSBkcmF3T3B0aW9ucy5jb3VudDtcbiAgICAgIHZhciBDT1VOVDtcbiAgICAgIHZhciBzY29wZSA9IG91dGVyO1xuICAgICAgaWYgKGRlZm4pIHtcbiAgICAgICAgaWYgKChkZWZuLmNvbnRleHREZXAgJiYgYXJncy5jb250ZXh0RHluYW1pYykgfHwgZGVmbi5wcm9wRGVwKSB7XG4gICAgICAgICAgc2NvcGUgPSBpbm5lcjtcbiAgICAgICAgfVxuICAgICAgICBDT1VOVCA9IGRlZm4uYXBwZW5kKGVudiwgc2NvcGUpO1xuICAgICAgICBjaGVjayQxLm9wdGlvbmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoZGVmbi5NSVNTSU5HKSB7XG4gICAgICAgICAgICBlbnYuYXNzZXJ0KG91dGVyLCAnZmFsc2UnLCAnbWlzc2luZyB2ZXJ0ZXggY291bnQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGRlZm4uRFlOQU1JQykge1xuICAgICAgICAgICAgZW52LmFzc2VydChzY29wZSwgQ09VTlQgKyAnPj0wJywgJ21pc3NpbmcgdmVydGV4IGNvdW50Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIENPVU5UID0gc2NvcGUuZGVmKERSQVdfU1RBVEUsICcuJywgU19DT1VOVCk7XG4gICAgICAgIGNoZWNrJDEub3B0aW9uYWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGVudi5hc3NlcnQoc2NvcGUsIENPVU5UICsgJz49MCcsICdtaXNzaW5nIHZlcnRleCBjb3VudCcpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDT1VOVFxuICAgIH1cblxuICAgIHZhciBFTEVNRU5UUyA9IGVtaXRFbGVtZW50cygpO1xuICAgIGZ1bmN0aW9uIGVtaXRWYWx1ZSAobmFtZSkge1xuICAgICAgdmFyIGRlZm4gPSBkcmF3T3B0aW9uc1tuYW1lXTtcbiAgICAgIGlmIChkZWZuKSB7XG4gICAgICAgIGlmICgoZGVmbi5jb250ZXh0RGVwICYmIGFyZ3MuY29udGV4dER5bmFtaWMpIHx8IGRlZm4ucHJvcERlcCkge1xuICAgICAgICAgIHJldHVybiBkZWZuLmFwcGVuZChlbnYsIGlubmVyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBkZWZuLmFwcGVuZChlbnYsIG91dGVyKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gb3V0ZXIuZGVmKERSQVdfU1RBVEUsICcuJywgbmFtZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgUFJJTUlUSVZFID0gZW1pdFZhbHVlKFNfUFJJTUlUSVZFKTtcbiAgICB2YXIgT0ZGU0VUID0gZW1pdFZhbHVlKFNfT0ZGU0VUKTtcblxuICAgIHZhciBDT1VOVCA9IGVtaXRDb3VudCgpO1xuICAgIGlmICh0eXBlb2YgQ09VTlQgPT09ICdudW1iZXInKSB7XG4gICAgICBpZiAoQ09VTlQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlubmVyKCdpZignLCBDT1VOVCwgJyl7Jyk7XG4gICAgICBpbm5lci5leGl0KCd9Jyk7XG4gICAgfVxuXG4gICAgdmFyIElOU1RBTkNFUywgRVhUX0lOU1RBTkNJTkc7XG4gICAgaWYgKGV4dEluc3RhbmNpbmcpIHtcbiAgICAgIElOU1RBTkNFUyA9IGVtaXRWYWx1ZShTX0lOU1RBTkNFUyk7XG4gICAgICBFWFRfSU5TVEFOQ0lORyA9IGVudi5pbnN0YW5jaW5nO1xuICAgIH1cblxuICAgIHZhciBFTEVNRU5UX1RZUEUgPSBFTEVNRU5UUyArICcudHlwZSc7XG5cbiAgICB2YXIgZWxlbWVudHNTdGF0aWMgPSBkcmF3T3B0aW9ucy5lbGVtZW50cyAmJiBpc1N0YXRpYyhkcmF3T3B0aW9ucy5lbGVtZW50cyk7XG5cbiAgICBmdW5jdGlvbiBlbWl0SW5zdGFuY2luZyAoKSB7XG4gICAgICBmdW5jdGlvbiBkcmF3RWxlbWVudHMgKCkge1xuICAgICAgICBpbm5lcihFWFRfSU5TVEFOQ0lORywgJy5kcmF3RWxlbWVudHNJbnN0YW5jZWRBTkdMRSgnLCBbXG4gICAgICAgICAgUFJJTUlUSVZFLFxuICAgICAgICAgIENPVU5ULFxuICAgICAgICAgIEVMRU1FTlRfVFlQRSxcbiAgICAgICAgICBPRkZTRVQgKyAnPDwoKCcgKyBFTEVNRU5UX1RZUEUgKyAnLScgKyBHTF9VTlNJR05FRF9CWVRFJDggKyAnKT4+MSknLFxuICAgICAgICAgIElOU1RBTkNFU1xuICAgICAgICBdLCAnKTsnKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZHJhd0FycmF5cyAoKSB7XG4gICAgICAgIGlubmVyKEVYVF9JTlNUQU5DSU5HLCAnLmRyYXdBcnJheXNJbnN0YW5jZWRBTkdMRSgnLFxuICAgICAgICAgIFtQUklNSVRJVkUsIE9GRlNFVCwgQ09VTlQsIElOU1RBTkNFU10sICcpOycpO1xuICAgICAgfVxuXG4gICAgICBpZiAoRUxFTUVOVFMpIHtcbiAgICAgICAgaWYgKCFlbGVtZW50c1N0YXRpYykge1xuICAgICAgICAgIGlubmVyKCdpZignLCBFTEVNRU5UUywgJyl7Jyk7XG4gICAgICAgICAgZHJhd0VsZW1lbnRzKCk7XG4gICAgICAgICAgaW5uZXIoJ31lbHNleycpO1xuICAgICAgICAgIGRyYXdBcnJheXMoKTtcbiAgICAgICAgICBpbm5lcignfScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRyYXdFbGVtZW50cygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkcmF3QXJyYXlzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW1pdFJlZ3VsYXIgKCkge1xuICAgICAgZnVuY3Rpb24gZHJhd0VsZW1lbnRzICgpIHtcbiAgICAgICAgaW5uZXIoR0wgKyAnLmRyYXdFbGVtZW50cygnICsgW1xuICAgICAgICAgIFBSSU1JVElWRSxcbiAgICAgICAgICBDT1VOVCxcbiAgICAgICAgICBFTEVNRU5UX1RZUEUsXG4gICAgICAgICAgT0ZGU0VUICsgJzw8KCgnICsgRUxFTUVOVF9UWVBFICsgJy0nICsgR0xfVU5TSUdORURfQllURSQ4ICsgJyk+PjEpJ1xuICAgICAgICBdICsgJyk7Jyk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRyYXdBcnJheXMgKCkge1xuICAgICAgICBpbm5lcihHTCArICcuZHJhd0FycmF5cygnICsgW1BSSU1JVElWRSwgT0ZGU0VULCBDT1VOVF0gKyAnKTsnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKEVMRU1FTlRTKSB7XG4gICAgICAgIGlmICghZWxlbWVudHNTdGF0aWMpIHtcbiAgICAgICAgICBpbm5lcignaWYoJywgRUxFTUVOVFMsICcpeycpO1xuICAgICAgICAgIGRyYXdFbGVtZW50cygpO1xuICAgICAgICAgIGlubmVyKCd9ZWxzZXsnKTtcbiAgICAgICAgICBkcmF3QXJyYXlzKCk7XG4gICAgICAgICAgaW5uZXIoJ30nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkcmF3RWxlbWVudHMoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHJhd0FycmF5cygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChleHRJbnN0YW5jaW5nICYmICh0eXBlb2YgSU5TVEFOQ0VTICE9PSAnbnVtYmVyJyB8fCBJTlNUQU5DRVMgPj0gMCkpIHtcbiAgICAgIGlmICh0eXBlb2YgSU5TVEFOQ0VTID09PSAnc3RyaW5nJykge1xuICAgICAgICBpbm5lcignaWYoJywgSU5TVEFOQ0VTLCAnPjApeycpO1xuICAgICAgICBlbWl0SW5zdGFuY2luZygpO1xuICAgICAgICBpbm5lcignfWVsc2UgaWYoJywgSU5TVEFOQ0VTLCAnPDApeycpO1xuICAgICAgICBlbWl0UmVndWxhcigpO1xuICAgICAgICBpbm5lcignfScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW1pdEluc3RhbmNpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZW1pdFJlZ3VsYXIoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVCb2R5IChlbWl0Qm9keSwgcGFyZW50RW52LCBhcmdzLCBwcm9ncmFtLCBjb3VudCkge1xuICAgIHZhciBlbnYgPSBjcmVhdGVSRUdMRW52aXJvbm1lbnQoKTtcbiAgICB2YXIgc2NvcGUgPSBlbnYucHJvYygnYm9keScsIGNvdW50KTtcbiAgICBjaGVjayQxLm9wdGlvbmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgIGVudi5jb21tYW5kU3RyID0gcGFyZW50RW52LmNvbW1hbmRTdHI7XG4gICAgICBlbnYuY29tbWFuZCA9IGVudi5saW5rKHBhcmVudEVudi5jb21tYW5kU3RyKTtcbiAgICB9KTtcbiAgICBpZiAoZXh0SW5zdGFuY2luZykge1xuICAgICAgZW52Lmluc3RhbmNpbmcgPSBzY29wZS5kZWYoXG4gICAgICAgIGVudi5zaGFyZWQuZXh0ZW5zaW9ucywgJy5hbmdsZV9pbnN0YW5jZWRfYXJyYXlzJyk7XG4gICAgfVxuICAgIGVtaXRCb2R5KGVudiwgc2NvcGUsIGFyZ3MsIHByb2dyYW0pO1xuICAgIHJldHVybiBlbnYuY29tcGlsZSgpLmJvZHlcbiAgfVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRFJBVyBQUk9DXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZnVuY3Rpb24gZW1pdERyYXdCb2R5IChlbnYsIGRyYXcsIGFyZ3MsIHByb2dyYW0pIHtcbiAgICBpbmplY3RFeHRlbnNpb25zKGVudiwgZHJhdyk7XG4gICAgZW1pdEF0dHJpYnV0ZXMoZW52LCBkcmF3LCBhcmdzLCBwcm9ncmFtLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSk7XG4gICAgZW1pdFVuaWZvcm1zKGVudiwgZHJhdywgYXJncywgcHJvZ3JhbS51bmlmb3JtcywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9KTtcbiAgICBlbWl0RHJhdyhlbnYsIGRyYXcsIGRyYXcsIGFyZ3MpO1xuICB9XG5cbiAgZnVuY3Rpb24gZW1pdERyYXdQcm9jIChlbnYsIGFyZ3MpIHtcbiAgICB2YXIgZHJhdyA9IGVudi5wcm9jKCdkcmF3JywgMSk7XG5cbiAgICBpbmplY3RFeHRlbnNpb25zKGVudiwgZHJhdyk7XG5cbiAgICBlbWl0Q29udGV4dChlbnYsIGRyYXcsIGFyZ3MuY29udGV4dCk7XG4gICAgZW1pdFBvbGxGcmFtZWJ1ZmZlcihlbnYsIGRyYXcsIGFyZ3MuZnJhbWVidWZmZXIpO1xuXG4gICAgZW1pdFBvbGxTdGF0ZShlbnYsIGRyYXcsIGFyZ3MpO1xuICAgIGVtaXRTZXRPcHRpb25zKGVudiwgZHJhdywgYXJncy5zdGF0ZSk7XG5cbiAgICBlbWl0UHJvZmlsZShlbnYsIGRyYXcsIGFyZ3MsIGZhbHNlLCB0cnVlKTtcblxuICAgIHZhciBwcm9ncmFtID0gYXJncy5zaGFkZXIucHJvZ1Zhci5hcHBlbmQoZW52LCBkcmF3KTtcbiAgICBkcmF3KGVudi5zaGFyZWQuZ2wsICcudXNlUHJvZ3JhbSgnLCBwcm9ncmFtLCAnLnByb2dyYW0pOycpO1xuXG4gICAgaWYgKGFyZ3Muc2hhZGVyLnByb2dyYW0pIHtcbiAgICAgIGVtaXREcmF3Qm9keShlbnYsIGRyYXcsIGFyZ3MsIGFyZ3Muc2hhZGVyLnByb2dyYW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZHJhd0NhY2hlID0gZW52Lmdsb2JhbC5kZWYoJ3t9Jyk7XG4gICAgICB2YXIgUFJPR19JRCA9IGRyYXcuZGVmKHByb2dyYW0sICcuaWQnKTtcbiAgICAgIHZhciBDQUNIRURfUFJPQyA9IGRyYXcuZGVmKGRyYXdDYWNoZSwgJ1snLCBQUk9HX0lELCAnXScpO1xuICAgICAgZHJhdyhcbiAgICAgICAgZW52LmNvbmQoQ0FDSEVEX1BST0MpXG4gICAgICAgICAgLnRoZW4oQ0FDSEVEX1BST0MsICcuY2FsbCh0aGlzLGEwKTsnKVxuICAgICAgICAgIC5lbHNlKFxuICAgICAgICAgICAgQ0FDSEVEX1BST0MsICc9JywgZHJhd0NhY2hlLCAnWycsIFBST0dfSUQsICddPScsXG4gICAgICAgICAgICBlbnYubGluayhmdW5jdGlvbiAocHJvZ3JhbSkge1xuICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlQm9keShlbWl0RHJhd0JvZHksIGVudiwgYXJncywgcHJvZ3JhbSwgMSlcbiAgICAgICAgICAgIH0pLCAnKCcsIHByb2dyYW0sICcpOycsXG4gICAgICAgICAgICBDQUNIRURfUFJPQywgJy5jYWxsKHRoaXMsYTApOycpKTtcbiAgICB9XG5cbiAgICBpZiAoT2JqZWN0LmtleXMoYXJncy5zdGF0ZSkubGVuZ3RoID4gMCkge1xuICAgICAgZHJhdyhlbnYuc2hhcmVkLmN1cnJlbnQsICcuZGlydHk9dHJ1ZTsnKTtcbiAgICB9XG4gIH1cblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEJBVENIIFBST0NcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIGVtaXRCYXRjaER5bmFtaWNTaGFkZXJCb2R5IChlbnYsIHNjb3BlLCBhcmdzLCBwcm9ncmFtKSB7XG4gICAgZW52LmJhdGNoSWQgPSAnYTEnO1xuXG4gICAgaW5qZWN0RXh0ZW5zaW9ucyhlbnYsIHNjb3BlKTtcblxuICAgIGZ1bmN0aW9uIGFsbCAoKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGVtaXRBdHRyaWJ1dGVzKGVudiwgc2NvcGUsIGFyZ3MsIHByb2dyYW0uYXR0cmlidXRlcywgYWxsKTtcbiAgICBlbWl0VW5pZm9ybXMoZW52LCBzY29wZSwgYXJncywgcHJvZ3JhbS51bmlmb3JtcywgYWxsKTtcbiAgICBlbWl0RHJhdyhlbnYsIHNjb3BlLCBzY29wZSwgYXJncyk7XG4gIH1cblxuICBmdW5jdGlvbiBlbWl0QmF0Y2hCb2R5IChlbnYsIHNjb3BlLCBhcmdzLCBwcm9ncmFtKSB7XG4gICAgaW5qZWN0RXh0ZW5zaW9ucyhlbnYsIHNjb3BlKTtcblxuICAgIHZhciBjb250ZXh0RHluYW1pYyA9IGFyZ3MuY29udGV4dERlcDtcblxuICAgIHZhciBCQVRDSF9JRCA9IHNjb3BlLmRlZigpO1xuICAgIHZhciBQUk9QX0xJU1QgPSAnYTAnO1xuICAgIHZhciBOVU1fUFJPUFMgPSAnYTEnO1xuICAgIHZhciBQUk9QUyA9IHNjb3BlLmRlZigpO1xuICAgIGVudi5zaGFyZWQucHJvcHMgPSBQUk9QUztcbiAgICBlbnYuYmF0Y2hJZCA9IEJBVENIX0lEO1xuXG4gICAgdmFyIG91dGVyID0gZW52LnNjb3BlKCk7XG4gICAgdmFyIGlubmVyID0gZW52LnNjb3BlKCk7XG5cbiAgICBzY29wZShcbiAgICAgIG91dGVyLmVudHJ5LFxuICAgICAgJ2ZvcignLCBCQVRDSF9JRCwgJz0wOycsIEJBVENIX0lELCAnPCcsIE5VTV9QUk9QUywgJzsrKycsIEJBVENIX0lELCAnKXsnLFxuICAgICAgUFJPUFMsICc9JywgUFJPUF9MSVNULCAnWycsIEJBVENIX0lELCAnXTsnLFxuICAgICAgaW5uZXIsXG4gICAgICAnfScsXG4gICAgICBvdXRlci5leGl0KTtcblxuICAgIGZ1bmN0aW9uIGlzSW5uZXJEZWZuIChkZWZuKSB7XG4gICAgICByZXR1cm4gKChkZWZuLmNvbnRleHREZXAgJiYgY29udGV4dER5bmFtaWMpIHx8IGRlZm4ucHJvcERlcClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc091dGVyRGVmbiAoZGVmbikge1xuICAgICAgcmV0dXJuICFpc0lubmVyRGVmbihkZWZuKVxuICAgIH1cblxuICAgIGlmIChhcmdzLm5lZWRzQ29udGV4dCkge1xuICAgICAgZW1pdENvbnRleHQoZW52LCBpbm5lciwgYXJncy5jb250ZXh0KTtcbiAgICB9XG4gICAgaWYgKGFyZ3MubmVlZHNGcmFtZWJ1ZmZlcikge1xuICAgICAgZW1pdFBvbGxGcmFtZWJ1ZmZlcihlbnYsIGlubmVyLCBhcmdzLmZyYW1lYnVmZmVyKTtcbiAgICB9XG4gICAgZW1pdFNldE9wdGlvbnMoZW52LCBpbm5lciwgYXJncy5zdGF0ZSwgaXNJbm5lckRlZm4pO1xuXG4gICAgaWYgKGFyZ3MucHJvZmlsZSAmJiBpc0lubmVyRGVmbihhcmdzLnByb2ZpbGUpKSB7XG4gICAgICBlbWl0UHJvZmlsZShlbnYsIGlubmVyLCBhcmdzLCBmYWxzZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCFwcm9ncmFtKSB7XG4gICAgICB2YXIgcHJvZ0NhY2hlID0gZW52Lmdsb2JhbC5kZWYoJ3t9Jyk7XG4gICAgICB2YXIgUFJPR1JBTSA9IGFyZ3Muc2hhZGVyLnByb2dWYXIuYXBwZW5kKGVudiwgaW5uZXIpO1xuICAgICAgdmFyIFBST0dfSUQgPSBpbm5lci5kZWYoUFJPR1JBTSwgJy5pZCcpO1xuICAgICAgdmFyIENBQ0hFRF9QUk9DID0gaW5uZXIuZGVmKHByb2dDYWNoZSwgJ1snLCBQUk9HX0lELCAnXScpO1xuICAgICAgaW5uZXIoXG4gICAgICAgIGVudi5zaGFyZWQuZ2wsICcudXNlUHJvZ3JhbSgnLCBQUk9HUkFNLCAnLnByb2dyYW0pOycsXG4gICAgICAgICdpZighJywgQ0FDSEVEX1BST0MsICcpeycsXG4gICAgICAgIENBQ0hFRF9QUk9DLCAnPScsIHByb2dDYWNoZSwgJ1snLCBQUk9HX0lELCAnXT0nLFxuICAgICAgICBlbnYubGluayhmdW5jdGlvbiAocHJvZ3JhbSkge1xuICAgICAgICAgIHJldHVybiBjcmVhdGVCb2R5KFxuICAgICAgICAgICAgZW1pdEJhdGNoRHluYW1pY1NoYWRlckJvZHksIGVudiwgYXJncywgcHJvZ3JhbSwgMilcbiAgICAgICAgfSksICcoJywgUFJPR1JBTSwgJyk7fScsXG4gICAgICAgIENBQ0hFRF9QUk9DLCAnLmNhbGwodGhpcyxhMFsnLCBCQVRDSF9JRCwgJ10sJywgQkFUQ0hfSUQsICcpOycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbWl0QXR0cmlidXRlcyhlbnYsIG91dGVyLCBhcmdzLCBwcm9ncmFtLmF0dHJpYnV0ZXMsIGlzT3V0ZXJEZWZuKTtcbiAgICAgIGVtaXRBdHRyaWJ1dGVzKGVudiwgaW5uZXIsIGFyZ3MsIHByb2dyYW0uYXR0cmlidXRlcywgaXNJbm5lckRlZm4pO1xuICAgICAgZW1pdFVuaWZvcm1zKGVudiwgb3V0ZXIsIGFyZ3MsIHByb2dyYW0udW5pZm9ybXMsIGlzT3V0ZXJEZWZuKTtcbiAgICAgIGVtaXRVbmlmb3JtcyhlbnYsIGlubmVyLCBhcmdzLCBwcm9ncmFtLnVuaWZvcm1zLCBpc0lubmVyRGVmbik7XG4gICAgICBlbWl0RHJhdyhlbnYsIG91dGVyLCBpbm5lciwgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZW1pdEJhdGNoUHJvYyAoZW52LCBhcmdzKSB7XG4gICAgdmFyIGJhdGNoID0gZW52LnByb2MoJ2JhdGNoJywgMik7XG4gICAgZW52LmJhdGNoSWQgPSAnMCc7XG5cbiAgICBpbmplY3RFeHRlbnNpb25zKGVudiwgYmF0Y2gpO1xuXG4gICAgLy8gQ2hlY2sgaWYgYW55IGNvbnRleHQgdmFyaWFibGVzIGRlcGVuZCBvbiBwcm9wc1xuICAgIHZhciBjb250ZXh0RHluYW1pYyA9IGZhbHNlO1xuICAgIHZhciBuZWVkc0NvbnRleHQgPSB0cnVlO1xuICAgIE9iamVjdC5rZXlzKGFyZ3MuY29udGV4dCkuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgY29udGV4dER5bmFtaWMgPSBjb250ZXh0RHluYW1pYyB8fCBhcmdzLmNvbnRleHRbbmFtZV0ucHJvcERlcDtcbiAgICB9KTtcbiAgICBpZiAoIWNvbnRleHREeW5hbWljKSB7XG4gICAgICBlbWl0Q29udGV4dChlbnYsIGJhdGNoLCBhcmdzLmNvbnRleHQpO1xuICAgICAgbmVlZHNDb250ZXh0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gZnJhbWVidWZmZXIgc3RhdGUgYWZmZWN0cyBmcmFtZWJ1ZmZlcldpZHRoL2hlaWdodCBjb250ZXh0IHZhcnNcbiAgICB2YXIgZnJhbWVidWZmZXIgPSBhcmdzLmZyYW1lYnVmZmVyO1xuICAgIHZhciBuZWVkc0ZyYW1lYnVmZmVyID0gZmFsc2U7XG4gICAgaWYgKGZyYW1lYnVmZmVyKSB7XG4gICAgICBpZiAoZnJhbWVidWZmZXIucHJvcERlcCkge1xuICAgICAgICBjb250ZXh0RHluYW1pYyA9IG5lZWRzRnJhbWVidWZmZXIgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChmcmFtZWJ1ZmZlci5jb250ZXh0RGVwICYmIGNvbnRleHREeW5hbWljKSB7XG4gICAgICAgIG5lZWRzRnJhbWVidWZmZXIgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKCFuZWVkc0ZyYW1lYnVmZmVyKSB7XG4gICAgICAgIGVtaXRQb2xsRnJhbWVidWZmZXIoZW52LCBiYXRjaCwgZnJhbWVidWZmZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlbWl0UG9sbEZyYW1lYnVmZmVyKGVudiwgYmF0Y2gsIG51bGwpO1xuICAgIH1cblxuICAgIC8vIHZpZXdwb3J0IGlzIHdlaXJkIGJlY2F1c2UgaXQgY2FuIGFmZmVjdCBjb250ZXh0IHZhcnNcbiAgICBpZiAoYXJncy5zdGF0ZS52aWV3cG9ydCAmJiBhcmdzLnN0YXRlLnZpZXdwb3J0LnByb3BEZXApIHtcbiAgICAgIGNvbnRleHREeW5hbWljID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0lubmVyRGVmbiAoZGVmbikge1xuICAgICAgcmV0dXJuIChkZWZuLmNvbnRleHREZXAgJiYgY29udGV4dER5bmFtaWMpIHx8IGRlZm4ucHJvcERlcFxuICAgIH1cblxuICAgIC8vIHNldCB3ZWJnbCBvcHRpb25zXG4gICAgZW1pdFBvbGxTdGF0ZShlbnYsIGJhdGNoLCBhcmdzKTtcbiAgICBlbWl0U2V0T3B0aW9ucyhlbnYsIGJhdGNoLCBhcmdzLnN0YXRlLCBmdW5jdGlvbiAoZGVmbikge1xuICAgICAgcmV0dXJuICFpc0lubmVyRGVmbihkZWZuKVxuICAgIH0pO1xuXG4gICAgaWYgKCFhcmdzLnByb2ZpbGUgfHwgIWlzSW5uZXJEZWZuKGFyZ3MucHJvZmlsZSkpIHtcbiAgICAgIGVtaXRQcm9maWxlKGVudiwgYmF0Y2gsIGFyZ3MsIGZhbHNlLCAnYTEnKTtcbiAgICB9XG5cbiAgICAvLyBTYXZlIHRoZXNlIHZhbHVlcyB0byBhcmdzIHNvIHRoYXQgdGhlIGJhdGNoIGJvZHkgcm91dGluZSBjYW4gdXNlIHRoZW1cbiAgICBhcmdzLmNvbnRleHREZXAgPSBjb250ZXh0RHluYW1pYztcbiAgICBhcmdzLm5lZWRzQ29udGV4dCA9IG5lZWRzQ29udGV4dDtcbiAgICBhcmdzLm5lZWRzRnJhbWVidWZmZXIgPSBuZWVkc0ZyYW1lYnVmZmVyO1xuXG4gICAgLy8gZGV0ZXJtaW5lIGlmIHNoYWRlciBpcyBkeW5hbWljXG4gICAgdmFyIHByb2dEZWZuID0gYXJncy5zaGFkZXIucHJvZ1ZhcjtcbiAgICBpZiAoKHByb2dEZWZuLmNvbnRleHREZXAgJiYgY29udGV4dER5bmFtaWMpIHx8IHByb2dEZWZuLnByb3BEZXApIHtcbiAgICAgIGVtaXRCYXRjaEJvZHkoXG4gICAgICAgIGVudixcbiAgICAgICAgYmF0Y2gsXG4gICAgICAgIGFyZ3MsXG4gICAgICAgIG51bGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgUFJPR1JBTSA9IHByb2dEZWZuLmFwcGVuZChlbnYsIGJhdGNoKTtcbiAgICAgIGJhdGNoKGVudi5zaGFyZWQuZ2wsICcudXNlUHJvZ3JhbSgnLCBQUk9HUkFNLCAnLnByb2dyYW0pOycpO1xuICAgICAgaWYgKGFyZ3Muc2hhZGVyLnByb2dyYW0pIHtcbiAgICAgICAgZW1pdEJhdGNoQm9keShcbiAgICAgICAgICBlbnYsXG4gICAgICAgICAgYmF0Y2gsXG4gICAgICAgICAgYXJncyxcbiAgICAgICAgICBhcmdzLnNoYWRlci5wcm9ncmFtKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBiYXRjaENhY2hlID0gZW52Lmdsb2JhbC5kZWYoJ3t9Jyk7XG4gICAgICAgIHZhciBQUk9HX0lEID0gYmF0Y2guZGVmKFBST0dSQU0sICcuaWQnKTtcbiAgICAgICAgdmFyIENBQ0hFRF9QUk9DID0gYmF0Y2guZGVmKGJhdGNoQ2FjaGUsICdbJywgUFJPR19JRCwgJ10nKTtcbiAgICAgICAgYmF0Y2goXG4gICAgICAgICAgZW52LmNvbmQoQ0FDSEVEX1BST0MpXG4gICAgICAgICAgICAudGhlbihDQUNIRURfUFJPQywgJy5jYWxsKHRoaXMsYTAsYTEpOycpXG4gICAgICAgICAgICAuZWxzZShcbiAgICAgICAgICAgICAgQ0FDSEVEX1BST0MsICc9JywgYmF0Y2hDYWNoZSwgJ1snLCBQUk9HX0lELCAnXT0nLFxuICAgICAgICAgICAgICBlbnYubGluayhmdW5jdGlvbiAocHJvZ3JhbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVCb2R5KGVtaXRCYXRjaEJvZHksIGVudiwgYXJncywgcHJvZ3JhbSwgMilcbiAgICAgICAgICAgICAgfSksICcoJywgUFJPR1JBTSwgJyk7JyxcbiAgICAgICAgICAgICAgQ0FDSEVEX1BST0MsICcuY2FsbCh0aGlzLGEwLGExKTsnKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKE9iamVjdC5rZXlzKGFyZ3Muc3RhdGUpLmxlbmd0aCA+IDApIHtcbiAgICAgIGJhdGNoKGVudi5zaGFyZWQuY3VycmVudCwgJy5kaXJ0eT10cnVlOycpO1xuICAgIH1cbiAgfVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gU0NPUEUgQ09NTUFORFxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGZ1bmN0aW9uIGVtaXRTY29wZVByb2MgKGVudiwgYXJncykge1xuICAgIHZhciBzY29wZSA9IGVudi5wcm9jKCdzY29wZScsIDMpO1xuICAgIGVudi5iYXRjaElkID0gJ2EyJztcblxuICAgIHZhciBzaGFyZWQgPSBlbnYuc2hhcmVkO1xuICAgIHZhciBDVVJSRU5UX1NUQVRFID0gc2hhcmVkLmN1cnJlbnQ7XG5cbiAgICBlbWl0Q29udGV4dChlbnYsIHNjb3BlLCBhcmdzLmNvbnRleHQpO1xuXG4gICAgaWYgKGFyZ3MuZnJhbWVidWZmZXIpIHtcbiAgICAgIGFyZ3MuZnJhbWVidWZmZXIuYXBwZW5kKGVudiwgc2NvcGUpO1xuICAgIH1cblxuICAgIHNvcnRTdGF0ZShPYmplY3Qua2V5cyhhcmdzLnN0YXRlKSkuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIGRlZm4gPSBhcmdzLnN0YXRlW25hbWVdO1xuICAgICAgdmFyIHZhbHVlID0gZGVmbi5hcHBlbmQoZW52LCBzY29wZSk7XG4gICAgICBpZiAoaXNBcnJheUxpa2UodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24gKHYsIGkpIHtcbiAgICAgICAgICBzY29wZS5zZXQoZW52Lm5leHRbbmFtZV0sICdbJyArIGkgKyAnXScsIHYpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNjb3BlLnNldChzaGFyZWQubmV4dCwgJy4nICsgbmFtZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZW1pdFByb2ZpbGUoZW52LCBzY29wZSwgYXJncywgdHJ1ZSwgdHJ1ZSlcblxuICAgIDtbU19FTEVNRU5UUywgU19PRkZTRVQsIFNfQ09VTlQsIFNfSU5TVEFOQ0VTLCBTX1BSSU1JVElWRV0uZm9yRWFjaChcbiAgICAgIGZ1bmN0aW9uIChvcHQpIHtcbiAgICAgICAgdmFyIHZhcmlhYmxlID0gYXJncy5kcmF3W29wdF07XG4gICAgICAgIGlmICghdmFyaWFibGUpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBzY29wZS5zZXQoc2hhcmVkLmRyYXcsICcuJyArIG9wdCwgJycgKyB2YXJpYWJsZS5hcHBlbmQoZW52LCBzY29wZSkpO1xuICAgICAgfSk7XG5cbiAgICBPYmplY3Qua2V5cyhhcmdzLnVuaWZvcm1zKS5mb3JFYWNoKGZ1bmN0aW9uIChvcHQpIHtcbiAgICAgIHNjb3BlLnNldChcbiAgICAgICAgc2hhcmVkLnVuaWZvcm1zLFxuICAgICAgICAnWycgKyBzdHJpbmdTdG9yZS5pZChvcHQpICsgJ10nLFxuICAgICAgICBhcmdzLnVuaWZvcm1zW29wdF0uYXBwZW5kKGVudiwgc2NvcGUpKTtcbiAgICB9KTtcblxuICAgIE9iamVjdC5rZXlzKGFyZ3MuYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIHJlY29yZCA9IGFyZ3MuYXR0cmlidXRlc1tuYW1lXS5hcHBlbmQoZW52LCBzY29wZSk7XG4gICAgICB2YXIgc2NvcGVBdHRyaWIgPSBlbnYuc2NvcGVBdHRyaWIobmFtZSk7XG4gICAgICBPYmplY3Qua2V5cyhuZXcgQXR0cmlidXRlUmVjb3JkKCkpLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgc2NvcGUuc2V0KHNjb3BlQXR0cmliLCAnLicgKyBwcm9wLCByZWNvcmRbcHJvcF0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzYXZlU2hhZGVyIChuYW1lKSB7XG4gICAgICB2YXIgc2hhZGVyID0gYXJncy5zaGFkZXJbbmFtZV07XG4gICAgICBpZiAoc2hhZGVyKSB7XG4gICAgICAgIHNjb3BlLnNldChzaGFyZWQuc2hhZGVyLCAnLicgKyBuYW1lLCBzaGFkZXIuYXBwZW5kKGVudiwgc2NvcGUpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2F2ZVNoYWRlcihTX1ZFUlQpO1xuICAgIHNhdmVTaGFkZXIoU19GUkFHKTtcblxuICAgIGlmIChPYmplY3Qua2V5cyhhcmdzLnN0YXRlKS5sZW5ndGggPiAwKSB7XG4gICAgICBzY29wZShDVVJSRU5UX1NUQVRFLCAnLmRpcnR5PXRydWU7Jyk7XG4gICAgICBzY29wZS5leGl0KENVUlJFTlRfU1RBVEUsICcuZGlydHk9dHJ1ZTsnKTtcbiAgICB9XG5cbiAgICBzY29wZSgnYTEoJywgZW52LnNoYXJlZC5jb250ZXh0LCAnLGEwLCcsIGVudi5iYXRjaElkLCAnKTsnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRHluYW1pY09iamVjdCAob2JqZWN0KSB7XG4gICAgaWYgKHR5cGVvZiBvYmplY3QgIT09ICdvYmplY3QnIHx8IGlzQXJyYXlMaWtlKG9iamVjdCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB2YXIgcHJvcHMgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChkeW5hbWljLmlzRHluYW1pYyhvYmplY3RbcHJvcHNbaV1dKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHNwbGF0T2JqZWN0IChlbnYsIG9wdGlvbnMsIG5hbWUpIHtcbiAgICB2YXIgb2JqZWN0ID0gb3B0aW9ucy5zdGF0aWNbbmFtZV07XG4gICAgaWYgKCFvYmplY3QgfHwgIWlzRHluYW1pY09iamVjdChvYmplY3QpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB2YXIgZ2xvYmFscyA9IGVudi5nbG9iYWw7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuICAgIHZhciB0aGlzRGVwID0gZmFsc2U7XG4gICAgdmFyIGNvbnRleHREZXAgPSBmYWxzZTtcbiAgICB2YXIgcHJvcERlcCA9IGZhbHNlO1xuICAgIHZhciBvYmplY3RSZWYgPSBlbnYuZ2xvYmFsLmRlZigne30nKTtcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIHZhbHVlID0gb2JqZWN0W2tleV07XG4gICAgICBpZiAoZHluYW1pYy5pc0R5bmFtaWModmFsdWUpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldID0gZHluYW1pYy51bmJveCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlcHMgPSBjcmVhdGVEeW5hbWljRGVjbCh2YWx1ZSwgbnVsbCk7XG4gICAgICAgIHRoaXNEZXAgPSB0aGlzRGVwIHx8IGRlcHMudGhpc0RlcDtcbiAgICAgICAgcHJvcERlcCA9IHByb3BEZXAgfHwgZGVwcy5wcm9wRGVwO1xuICAgICAgICBjb250ZXh0RGVwID0gY29udGV4dERlcCB8fCBkZXBzLmNvbnRleHREZXA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnbG9iYWxzKG9iamVjdFJlZiwgJy4nLCBrZXksICc9Jyk7XG4gICAgICAgIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgIGdsb2JhbHModmFsdWUpO1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgZ2xvYmFscygnXCInLCB2YWx1ZSwgJ1wiJyk7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgZ2xvYmFscygnWycsIHZhbHVlLmpvaW4oKSwgJ10nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGdsb2JhbHMoZW52LmxpbmsodmFsdWUpKTtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgZ2xvYmFscygnOycpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gYXBwZW5kQmxvY2sgKGVudiwgYmxvY2spIHtcbiAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgICAgICBpZiAoIWR5bmFtaWMuaXNEeW5hbWljKHZhbHVlKSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHZhciByZWYgPSBlbnYuaW52b2tlKGJsb2NrLCB2YWx1ZSk7XG4gICAgICAgIGJsb2NrKG9iamVjdFJlZiwgJy4nLCBrZXksICc9JywgcmVmLCAnOycpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgb3B0aW9ucy5keW5hbWljW25hbWVdID0gbmV3IGR5bmFtaWMuRHluYW1pY1ZhcmlhYmxlKERZTl9USFVOSywge1xuICAgICAgdGhpc0RlcDogdGhpc0RlcCxcbiAgICAgIGNvbnRleHREZXA6IGNvbnRleHREZXAsXG4gICAgICBwcm9wRGVwOiBwcm9wRGVwLFxuICAgICAgcmVmOiBvYmplY3RSZWYsXG4gICAgICBhcHBlbmQ6IGFwcGVuZEJsb2NrXG4gICAgfSk7XG4gICAgZGVsZXRlIG9wdGlvbnMuc3RhdGljW25hbWVdO1xuICB9XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBNQUlOIERSQVcgQ09NTUFORFxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGZ1bmN0aW9uIGNvbXBpbGVDb21tYW5kIChvcHRpb25zLCBhdHRyaWJ1dGVzLCB1bmlmb3JtcywgY29udGV4dCwgc3RhdHMpIHtcbiAgICB2YXIgZW52ID0gY3JlYXRlUkVHTEVudmlyb25tZW50KCk7XG5cbiAgICAvLyBsaW5rIHN0YXRzLCBzbyB0aGF0IHdlIGNhbiBlYXNpbHkgYWNjZXNzIGl0IGluIHRoZSBwcm9ncmFtLlxuICAgIGVudi5zdGF0cyA9IGVudi5saW5rKHN0YXRzKTtcblxuICAgIC8vIHNwbGF0IG9wdGlvbnMgYW5kIGF0dHJpYnV0ZXMgdG8gYWxsb3cgZm9yIGR5bmFtaWMgbmVzdGVkIHByb3BlcnRpZXNcbiAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzLnN0YXRpYykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBzcGxhdE9iamVjdChlbnYsIGF0dHJpYnV0ZXMsIGtleSk7XG4gICAgfSk7XG4gICAgTkVTVEVEX09QVElPTlMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgc3BsYXRPYmplY3QoZW52LCBvcHRpb25zLCBuYW1lKTtcbiAgICB9KTtcblxuICAgIHZhciBhcmdzID0gcGFyc2VBcmd1bWVudHMob3B0aW9ucywgYXR0cmlidXRlcywgdW5pZm9ybXMsIGNvbnRleHQsIGVudik7XG5cbiAgICBlbWl0RHJhd1Byb2MoZW52LCBhcmdzKTtcbiAgICBlbWl0U2NvcGVQcm9jKGVudiwgYXJncyk7XG4gICAgZW1pdEJhdGNoUHJvYyhlbnYsIGFyZ3MpO1xuXG4gICAgcmV0dXJuIGVudi5jb21waWxlKClcbiAgfVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUE9MTCAvIFJFRlJFU0hcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICByZXR1cm4ge1xuICAgIG5leHQ6IG5leHRTdGF0ZSxcbiAgICBjdXJyZW50OiBjdXJyZW50U3RhdGUsXG4gICAgcHJvY3M6IChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZW52ID0gY3JlYXRlUkVHTEVudmlyb25tZW50KCk7XG4gICAgICB2YXIgcG9sbCA9IGVudi5wcm9jKCdwb2xsJyk7XG4gICAgICB2YXIgcmVmcmVzaCA9IGVudi5wcm9jKCdyZWZyZXNoJyk7XG4gICAgICB2YXIgY29tbW9uID0gZW52LmJsb2NrKCk7XG4gICAgICBwb2xsKGNvbW1vbik7XG4gICAgICByZWZyZXNoKGNvbW1vbik7XG5cbiAgICAgIHZhciBzaGFyZWQgPSBlbnYuc2hhcmVkO1xuICAgICAgdmFyIEdMID0gc2hhcmVkLmdsO1xuICAgICAgdmFyIE5FWFRfU1RBVEUgPSBzaGFyZWQubmV4dDtcbiAgICAgIHZhciBDVVJSRU5UX1NUQVRFID0gc2hhcmVkLmN1cnJlbnQ7XG5cbiAgICAgIGNvbW1vbihDVVJSRU5UX1NUQVRFLCAnLmRpcnR5PWZhbHNlOycpO1xuXG4gICAgICBlbWl0UG9sbEZyYW1lYnVmZmVyKGVudiwgcG9sbCk7XG4gICAgICBlbWl0UG9sbEZyYW1lYnVmZmVyKGVudiwgcmVmcmVzaCwgbnVsbCwgdHJ1ZSk7XG5cbiAgICAgIC8vIFJlZnJlc2ggdXBkYXRlcyBhbGwgYXR0cmlidXRlIHN0YXRlIGNoYW5nZXNcbiAgICAgIHZhciBJTlNUQU5DSU5HO1xuICAgICAgaWYgKGV4dEluc3RhbmNpbmcpIHtcbiAgICAgICAgSU5TVEFOQ0lORyA9IGVudi5saW5rKGV4dEluc3RhbmNpbmcpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW1pdHMubWF4QXR0cmlidXRlczsgKytpKSB7XG4gICAgICAgIHZhciBCSU5ESU5HID0gcmVmcmVzaC5kZWYoc2hhcmVkLmF0dHJpYnV0ZXMsICdbJywgaSwgJ10nKTtcbiAgICAgICAgdmFyIGlmdGUgPSBlbnYuY29uZChCSU5ESU5HLCAnLmJ1ZmZlcicpO1xuICAgICAgICBpZnRlLnRoZW4oXG4gICAgICAgICAgR0wsICcuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoJywgaSwgJyk7JyxcbiAgICAgICAgICBHTCwgJy5iaW5kQnVmZmVyKCcsXG4gICAgICAgICAgICBHTF9BUlJBWV9CVUZGRVIkMSwgJywnLFxuICAgICAgICAgICAgQklORElORywgJy5idWZmZXIuYnVmZmVyKTsnLFxuICAgICAgICAgIEdMLCAnLnZlcnRleEF0dHJpYlBvaW50ZXIoJyxcbiAgICAgICAgICAgIGksICcsJyxcbiAgICAgICAgICAgIEJJTkRJTkcsICcuc2l6ZSwnLFxuICAgICAgICAgICAgQklORElORywgJy50eXBlLCcsXG4gICAgICAgICAgICBCSU5ESU5HLCAnLm5vcm1hbGl6ZWQsJyxcbiAgICAgICAgICAgIEJJTkRJTkcsICcuc3RyaWRlLCcsXG4gICAgICAgICAgICBCSU5ESU5HLCAnLm9mZnNldCk7J1xuICAgICAgICApLmVsc2UoXG4gICAgICAgICAgR0wsICcuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KCcsIGksICcpOycsXG4gICAgICAgICAgR0wsICcudmVydGV4QXR0cmliNGYoJyxcbiAgICAgICAgICAgIGksICcsJyxcbiAgICAgICAgICAgIEJJTkRJTkcsICcueCwnLFxuICAgICAgICAgICAgQklORElORywgJy55LCcsXG4gICAgICAgICAgICBCSU5ESU5HLCAnLnosJyxcbiAgICAgICAgICAgIEJJTkRJTkcsICcudyk7JyxcbiAgICAgICAgICBCSU5ESU5HLCAnLmJ1ZmZlcj1udWxsOycpO1xuICAgICAgICByZWZyZXNoKGlmdGUpO1xuICAgICAgICBpZiAoZXh0SW5zdGFuY2luZykge1xuICAgICAgICAgIHJlZnJlc2goXG4gICAgICAgICAgICBJTlNUQU5DSU5HLCAnLnZlcnRleEF0dHJpYkRpdmlzb3JBTkdMRSgnLFxuICAgICAgICAgICAgaSwgJywnLFxuICAgICAgICAgICAgQklORElORywgJy5kaXZpc29yKTsnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBPYmplY3Qua2V5cyhHTF9GTEFHUykuZm9yRWFjaChmdW5jdGlvbiAoZmxhZykge1xuICAgICAgICB2YXIgY2FwID0gR0xfRkxBR1NbZmxhZ107XG4gICAgICAgIHZhciBORVhUID0gY29tbW9uLmRlZihORVhUX1NUQVRFLCAnLicsIGZsYWcpO1xuICAgICAgICB2YXIgYmxvY2sgPSBlbnYuYmxvY2soKTtcbiAgICAgICAgYmxvY2soJ2lmKCcsIE5FWFQsICcpeycsXG4gICAgICAgICAgR0wsICcuZW5hYmxlKCcsIGNhcCwgJyl9ZWxzZXsnLFxuICAgICAgICAgIEdMLCAnLmRpc2FibGUoJywgY2FwLCAnKX0nLFxuICAgICAgICAgIENVUlJFTlRfU1RBVEUsICcuJywgZmxhZywgJz0nLCBORVhULCAnOycpO1xuICAgICAgICByZWZyZXNoKGJsb2NrKTtcbiAgICAgICAgcG9sbChcbiAgICAgICAgICAnaWYoJywgTkVYVCwgJyE9PScsIENVUlJFTlRfU1RBVEUsICcuJywgZmxhZywgJyl7JyxcbiAgICAgICAgICBibG9jayxcbiAgICAgICAgICAnfScpO1xuICAgICAgfSk7XG5cbiAgICAgIE9iamVjdC5rZXlzKEdMX1ZBUklBQkxFUykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgZnVuYyA9IEdMX1ZBUklBQkxFU1tuYW1lXTtcbiAgICAgICAgdmFyIGluaXQgPSBjdXJyZW50U3RhdGVbbmFtZV07XG4gICAgICAgIHZhciBORVhULCBDVVJSRU5UO1xuICAgICAgICB2YXIgYmxvY2sgPSBlbnYuYmxvY2soKTtcbiAgICAgICAgYmxvY2soR0wsICcuJywgZnVuYywgJygnKTtcbiAgICAgICAgaWYgKGlzQXJyYXlMaWtlKGluaXQpKSB7XG4gICAgICAgICAgdmFyIG4gPSBpbml0Lmxlbmd0aDtcbiAgICAgICAgICBORVhUID0gZW52Lmdsb2JhbC5kZWYoTkVYVF9TVEFURSwgJy4nLCBuYW1lKTtcbiAgICAgICAgICBDVVJSRU5UID0gZW52Lmdsb2JhbC5kZWYoQ1VSUkVOVF9TVEFURSwgJy4nLCBuYW1lKTtcbiAgICAgICAgICBibG9jayhcbiAgICAgICAgICAgIGxvb3AobiwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIE5FWFQgKyAnWycgKyBpICsgJ10nXG4gICAgICAgICAgICB9KSwgJyk7JyxcbiAgICAgICAgICAgIGxvb3AobiwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIENVUlJFTlQgKyAnWycgKyBpICsgJ109JyArIE5FWFQgKyAnWycgKyBpICsgJ107J1xuICAgICAgICAgICAgfSkuam9pbignJykpO1xuICAgICAgICAgIHBvbGwoXG4gICAgICAgICAgICAnaWYoJywgbG9vcChuLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICByZXR1cm4gTkVYVCArICdbJyArIGkgKyAnXSE9PScgKyBDVVJSRU5UICsgJ1snICsgaSArICddJ1xuICAgICAgICAgICAgfSkuam9pbignfHwnKSwgJyl7JyxcbiAgICAgICAgICAgIGJsb2NrLFxuICAgICAgICAgICAgJ30nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBORVhUID0gY29tbW9uLmRlZihORVhUX1NUQVRFLCAnLicsIG5hbWUpO1xuICAgICAgICAgIENVUlJFTlQgPSBjb21tb24uZGVmKENVUlJFTlRfU1RBVEUsICcuJywgbmFtZSk7XG4gICAgICAgICAgYmxvY2soXG4gICAgICAgICAgICBORVhULCAnKTsnLFxuICAgICAgICAgICAgQ1VSUkVOVF9TVEFURSwgJy4nLCBuYW1lLCAnPScsIE5FWFQsICc7Jyk7XG4gICAgICAgICAgcG9sbChcbiAgICAgICAgICAgICdpZignLCBORVhULCAnIT09JywgQ1VSUkVOVCwgJyl7JyxcbiAgICAgICAgICAgIGJsb2NrLFxuICAgICAgICAgICAgJ30nKTtcbiAgICAgICAgfVxuICAgICAgICByZWZyZXNoKGJsb2NrKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZW52LmNvbXBpbGUoKVxuICAgIH0pKCksXG4gICAgY29tcGlsZTogY29tcGlsZUNvbW1hbmRcbiAgfVxufVxuXG5mdW5jdGlvbiBzdGF0cyAoKSB7XG4gIHJldHVybiB7XG4gICAgYnVmZmVyQ291bnQ6IDAsXG4gICAgZWxlbWVudHNDb3VudDogMCxcbiAgICBmcmFtZWJ1ZmZlckNvdW50OiAwLFxuICAgIHNoYWRlckNvdW50OiAwLFxuICAgIHRleHR1cmVDb3VudDogMCxcbiAgICBjdWJlQ291bnQ6IDAsXG4gICAgcmVuZGVyYnVmZmVyQ291bnQ6IDAsXG4gICAgbWF4VGV4dHVyZVVuaXRzOiAwXG4gIH1cbn1cblxudmFyIEdMX1FVRVJZX1JFU1VMVF9FWFQgPSAweDg4NjY7XG52YXIgR0xfUVVFUllfUkVTVUxUX0FWQUlMQUJMRV9FWFQgPSAweDg4Njc7XG52YXIgR0xfVElNRV9FTEFQU0VEX0VYVCA9IDB4ODhCRjtcblxudmFyIGNyZWF0ZVRpbWVyID0gZnVuY3Rpb24gKGdsLCBleHRlbnNpb25zKSB7XG4gIHZhciBleHRUaW1lciA9IGV4dGVuc2lvbnMuZXh0X2Rpc2pvaW50X3RpbWVyX3F1ZXJ5O1xuXG4gIGlmICghZXh0VGltZXIpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgLy8gUVVFUlkgUE9PTCBCRUdJTlxuICB2YXIgcXVlcnlQb29sID0gW107XG4gIGZ1bmN0aW9uIGFsbG9jUXVlcnkgKCkge1xuICAgIHJldHVybiBxdWVyeVBvb2wucG9wKCkgfHwgZXh0VGltZXIuY3JlYXRlUXVlcnlFWFQoKVxuICB9XG4gIGZ1bmN0aW9uIGZyZWVRdWVyeSAocXVlcnkpIHtcbiAgICBxdWVyeVBvb2wucHVzaChxdWVyeSk7XG4gIH1cbiAgLy8gUVVFUlkgUE9PTCBFTkRcblxuICB2YXIgcGVuZGluZ1F1ZXJpZXMgPSBbXTtcbiAgZnVuY3Rpb24gYmVnaW5RdWVyeSAoc3RhdHMpIHtcbiAgICB2YXIgcXVlcnkgPSBhbGxvY1F1ZXJ5KCk7XG4gICAgZXh0VGltZXIuYmVnaW5RdWVyeUVYVChHTF9USU1FX0VMQVBTRURfRVhULCBxdWVyeSk7XG4gICAgcGVuZGluZ1F1ZXJpZXMucHVzaChxdWVyeSk7XG4gICAgcHVzaFNjb3BlU3RhdHMocGVuZGluZ1F1ZXJpZXMubGVuZ3RoIC0gMSwgcGVuZGluZ1F1ZXJpZXMubGVuZ3RoLCBzdGF0cyk7XG4gIH1cblxuICBmdW5jdGlvbiBlbmRRdWVyeSAoKSB7XG4gICAgZXh0VGltZXIuZW5kUXVlcnlFWFQoR0xfVElNRV9FTEFQU0VEX0VYVCk7XG4gIH1cblxuICAvL1xuICAvLyBQZW5kaW5nIHN0YXRzIHBvb2wuXG4gIC8vXG4gIGZ1bmN0aW9uIFBlbmRpbmdTdGF0cyAoKSB7XG4gICAgdGhpcy5zdGFydFF1ZXJ5SW5kZXggPSAtMTtcbiAgICB0aGlzLmVuZFF1ZXJ5SW5kZXggPSAtMTtcbiAgICB0aGlzLnN1bSA9IDA7XG4gICAgdGhpcy5zdGF0cyA9IG51bGw7XG4gIH1cbiAgdmFyIHBlbmRpbmdTdGF0c1Bvb2wgPSBbXTtcbiAgZnVuY3Rpb24gYWxsb2NQZW5kaW5nU3RhdHMgKCkge1xuICAgIHJldHVybiBwZW5kaW5nU3RhdHNQb29sLnBvcCgpIHx8IG5ldyBQZW5kaW5nU3RhdHMoKVxuICB9XG4gIGZ1bmN0aW9uIGZyZWVQZW5kaW5nU3RhdHMgKHBlbmRpbmdTdGF0cykge1xuICAgIHBlbmRpbmdTdGF0c1Bvb2wucHVzaChwZW5kaW5nU3RhdHMpO1xuICB9XG4gIC8vIFBlbmRpbmcgc3RhdHMgcG9vbCBlbmRcblxuICB2YXIgcGVuZGluZ1N0YXRzID0gW107XG4gIGZ1bmN0aW9uIHB1c2hTY29wZVN0YXRzIChzdGFydCwgZW5kLCBzdGF0cykge1xuICAgIHZhciBwcyA9IGFsbG9jUGVuZGluZ1N0YXRzKCk7XG4gICAgcHMuc3RhcnRRdWVyeUluZGV4ID0gc3RhcnQ7XG4gICAgcHMuZW5kUXVlcnlJbmRleCA9IGVuZDtcbiAgICBwcy5zdW0gPSAwO1xuICAgIHBzLnN0YXRzID0gc3RhdHM7XG4gICAgcGVuZGluZ1N0YXRzLnB1c2gocHMpO1xuICB9XG5cbiAgLy8gd2Ugc2hvdWxkIGNhbGwgdGhpcyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBmcmFtZSxcbiAgLy8gaW4gb3JkZXIgdG8gdXBkYXRlIGdwdVRpbWVcbiAgdmFyIHRpbWVTdW0gPSBbXTtcbiAgdmFyIHF1ZXJ5UHRyID0gW107XG4gIGZ1bmN0aW9uIHVwZGF0ZSAoKSB7XG4gICAgdmFyIHB0ciwgaTtcblxuICAgIHZhciBuID0gcGVuZGluZ1F1ZXJpZXMubGVuZ3RoO1xuICAgIGlmIChuID09PSAwKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBSZXNlcnZlIHNwYWNlXG4gICAgcXVlcnlQdHIubGVuZ3RoID0gTWF0aC5tYXgocXVlcnlQdHIubGVuZ3RoLCBuICsgMSk7XG4gICAgdGltZVN1bS5sZW5ndGggPSBNYXRoLm1heCh0aW1lU3VtLmxlbmd0aCwgbiArIDEpO1xuICAgIHRpbWVTdW1bMF0gPSAwO1xuICAgIHF1ZXJ5UHRyWzBdID0gMDtcblxuICAgIC8vIFVwZGF0ZSBhbGwgcGVuZGluZyB0aW1lciBxdWVyaWVzXG4gICAgdmFyIHF1ZXJ5VGltZSA9IDA7XG4gICAgcHRyID0gMDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgcGVuZGluZ1F1ZXJpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBxdWVyeSA9IHBlbmRpbmdRdWVyaWVzW2ldO1xuICAgICAgaWYgKGV4dFRpbWVyLmdldFF1ZXJ5T2JqZWN0RVhUKHF1ZXJ5LCBHTF9RVUVSWV9SRVNVTFRfQVZBSUxBQkxFX0VYVCkpIHtcbiAgICAgICAgcXVlcnlUaW1lICs9IGV4dFRpbWVyLmdldFF1ZXJ5T2JqZWN0RVhUKHF1ZXJ5LCBHTF9RVUVSWV9SRVNVTFRfRVhUKTtcbiAgICAgICAgZnJlZVF1ZXJ5KHF1ZXJ5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlbmRpbmdRdWVyaWVzW3B0cisrXSA9IHF1ZXJ5O1xuICAgICAgfVxuICAgICAgdGltZVN1bVtpICsgMV0gPSBxdWVyeVRpbWU7XG4gICAgICBxdWVyeVB0cltpICsgMV0gPSBwdHI7XG4gICAgfVxuICAgIHBlbmRpbmdRdWVyaWVzLmxlbmd0aCA9IHB0cjtcblxuICAgIC8vIFVwZGF0ZSBhbGwgcGVuZGluZyBzdGF0IHF1ZXJpZXNcbiAgICBwdHIgPSAwO1xuICAgIGZvciAoaSA9IDA7IGkgPCBwZW5kaW5nU3RhdHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBzdGF0cyA9IHBlbmRpbmdTdGF0c1tpXTtcbiAgICAgIHZhciBzdGFydCA9IHN0YXRzLnN0YXJ0UXVlcnlJbmRleDtcbiAgICAgIHZhciBlbmQgPSBzdGF0cy5lbmRRdWVyeUluZGV4O1xuICAgICAgc3RhdHMuc3VtICs9IHRpbWVTdW1bZW5kXSAtIHRpbWVTdW1bc3RhcnRdO1xuICAgICAgdmFyIHN0YXJ0UHRyID0gcXVlcnlQdHJbc3RhcnRdO1xuICAgICAgdmFyIGVuZFB0ciA9IHF1ZXJ5UHRyW2VuZF07XG4gICAgICBpZiAoZW5kUHRyID09PSBzdGFydFB0cikge1xuICAgICAgICBzdGF0cy5zdGF0cy5ncHVUaW1lICs9IHN0YXRzLnN1bSAvIDFlNjtcbiAgICAgICAgZnJlZVBlbmRpbmdTdGF0cyhzdGF0cyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0cy5zdGFydFF1ZXJ5SW5kZXggPSBzdGFydFB0cjtcbiAgICAgICAgc3RhdHMuZW5kUXVlcnlJbmRleCA9IGVuZFB0cjtcbiAgICAgICAgcGVuZGluZ1N0YXRzW3B0cisrXSA9IHN0YXRzO1xuICAgICAgfVxuICAgIH1cbiAgICBwZW5kaW5nU3RhdHMubGVuZ3RoID0gcHRyO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBiZWdpblF1ZXJ5OiBiZWdpblF1ZXJ5LFxuICAgIGVuZFF1ZXJ5OiBlbmRRdWVyeSxcbiAgICBwdXNoU2NvcGVTdGF0czogcHVzaFNjb3BlU3RhdHMsXG4gICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgZ2V0TnVtUGVuZGluZ1F1ZXJpZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBwZW5kaW5nUXVlcmllcy5sZW5ndGhcbiAgICB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbiAoKSB7XG4gICAgICBxdWVyeVBvb2wucHVzaC5hcHBseShxdWVyeVBvb2wsIHBlbmRpbmdRdWVyaWVzKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVlcnlQb29sLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGV4dFRpbWVyLmRlbGV0ZVF1ZXJ5RVhUKHF1ZXJ5UG9vbFtpXSk7XG4gICAgICB9XG4gICAgICBwZW5kaW5nUXVlcmllcy5sZW5ndGggPSAwO1xuICAgICAgcXVlcnlQb29sLmxlbmd0aCA9IDA7XG4gICAgfSxcbiAgICByZXN0b3JlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBwZW5kaW5nUXVlcmllcy5sZW5ndGggPSAwO1xuICAgICAgcXVlcnlQb29sLmxlbmd0aCA9IDA7XG4gICAgfVxuICB9XG59O1xuXG52YXIgR0xfQ09MT1JfQlVGRkVSX0JJVCA9IDE2Mzg0O1xudmFyIEdMX0RFUFRIX0JVRkZFUl9CSVQgPSAyNTY7XG52YXIgR0xfU1RFTkNJTF9CVUZGRVJfQklUID0gMTAyNDtcblxudmFyIEdMX0FSUkFZX0JVRkZFUiA9IDM0OTYyO1xuXG52YXIgQ09OVEVYVF9MT1NUX0VWRU5UID0gJ3dlYmdsY29udGV4dGxvc3QnO1xudmFyIENPTlRFWFRfUkVTVE9SRURfRVZFTlQgPSAnd2ViZ2xjb250ZXh0cmVzdG9yZWQnO1xuXG52YXIgRFlOX1BST1AgPSAxO1xudmFyIERZTl9DT05URVhUID0gMjtcbnZhciBEWU5fU1RBVEUgPSAzO1xuXG5mdW5jdGlvbiBmaW5kIChoYXlzdGFjaywgbmVlZGxlKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaGF5c3RhY2subGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoaGF5c3RhY2tbaV0gPT09IG5lZWRsZSkge1xuICAgICAgcmV0dXJuIGlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xXG59XG5cbmZ1bmN0aW9uIHdyYXBSRUdMIChhcmdzKSB7XG4gIHZhciBjb25maWcgPSBwYXJzZUFyZ3MoYXJncyk7XG4gIGlmICghY29uZmlnKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIHZhciBnbCA9IGNvbmZpZy5nbDtcbiAgdmFyIGdsQXR0cmlidXRlcyA9IGdsLmdldENvbnRleHRBdHRyaWJ1dGVzKCk7XG4gIHZhciBjb250ZXh0TG9zdCA9IGdsLmlzQ29udGV4dExvc3QoKTtcblxuICB2YXIgZXh0ZW5zaW9uU3RhdGUgPSBjcmVhdGVFeHRlbnNpb25DYWNoZShnbCwgY29uZmlnKTtcbiAgaWYgKCFleHRlbnNpb25TdGF0ZSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICB2YXIgc3RyaW5nU3RvcmUgPSBjcmVhdGVTdHJpbmdTdG9yZSgpO1xuICB2YXIgc3RhdHMkJDEgPSBzdGF0cygpO1xuICB2YXIgZXh0ZW5zaW9ucyA9IGV4dGVuc2lvblN0YXRlLmV4dGVuc2lvbnM7XG4gIHZhciB0aW1lciA9IGNyZWF0ZVRpbWVyKGdsLCBleHRlbnNpb25zKTtcblxuICB2YXIgU1RBUlRfVElNRSA9IGNsb2NrKCk7XG4gIHZhciBXSURUSCA9IGdsLmRyYXdpbmdCdWZmZXJXaWR0aDtcbiAgdmFyIEhFSUdIVCA9IGdsLmRyYXdpbmdCdWZmZXJIZWlnaHQ7XG5cbiAgdmFyIGNvbnRleHRTdGF0ZSA9IHtcbiAgICB0aWNrOiAwLFxuICAgIHRpbWU6IDAsXG4gICAgdmlld3BvcnRXaWR0aDogV0lEVEgsXG4gICAgdmlld3BvcnRIZWlnaHQ6IEhFSUdIVCxcbiAgICBmcmFtZWJ1ZmZlcldpZHRoOiBXSURUSCxcbiAgICBmcmFtZWJ1ZmZlckhlaWdodDogSEVJR0hULFxuICAgIGRyYXdpbmdCdWZmZXJXaWR0aDogV0lEVEgsXG4gICAgZHJhd2luZ0J1ZmZlckhlaWdodDogSEVJR0hULFxuICAgIHBpeGVsUmF0aW86IGNvbmZpZy5waXhlbFJhdGlvXG4gIH07XG4gIHZhciB1bmlmb3JtU3RhdGUgPSB7fTtcbiAgdmFyIGRyYXdTdGF0ZSA9IHtcbiAgICBlbGVtZW50czogbnVsbCxcbiAgICBwcmltaXRpdmU6IDQsIC8vIEdMX1RSSUFOR0xFU1xuICAgIGNvdW50OiAtMSxcbiAgICBvZmZzZXQ6IDAsXG4gICAgaW5zdGFuY2VzOiAtMVxuICB9O1xuXG4gIHZhciBsaW1pdHMgPSB3cmFwTGltaXRzKGdsLCBleHRlbnNpb25zKTtcbiAgdmFyIGF0dHJpYnV0ZVN0YXRlID0gd3JhcEF0dHJpYnV0ZVN0YXRlKFxuICAgIGdsLFxuICAgIGV4dGVuc2lvbnMsXG4gICAgbGltaXRzLFxuICAgIHN0cmluZ1N0b3JlKTtcbiAgdmFyIGJ1ZmZlclN0YXRlID0gd3JhcEJ1ZmZlclN0YXRlKFxuICAgIGdsLFxuICAgIHN0YXRzJCQxLFxuICAgIGNvbmZpZyxcbiAgICBhdHRyaWJ1dGVTdGF0ZSk7XG4gIHZhciBlbGVtZW50U3RhdGUgPSB3cmFwRWxlbWVudHNTdGF0ZShnbCwgZXh0ZW5zaW9ucywgYnVmZmVyU3RhdGUsIHN0YXRzJCQxKTtcbiAgdmFyIHNoYWRlclN0YXRlID0gd3JhcFNoYWRlclN0YXRlKGdsLCBzdHJpbmdTdG9yZSwgc3RhdHMkJDEsIGNvbmZpZyk7XG4gIHZhciB0ZXh0dXJlU3RhdGUgPSBjcmVhdGVUZXh0dXJlU2V0KFxuICAgIGdsLFxuICAgIGV4dGVuc2lvbnMsXG4gICAgbGltaXRzLFxuICAgIGZ1bmN0aW9uICgpIHsgY29yZS5wcm9jcy5wb2xsKCk7IH0sXG4gICAgY29udGV4dFN0YXRlLFxuICAgIHN0YXRzJCQxLFxuICAgIGNvbmZpZyk7XG4gIHZhciByZW5kZXJidWZmZXJTdGF0ZSA9IHdyYXBSZW5kZXJidWZmZXJzKGdsLCBleHRlbnNpb25zLCBsaW1pdHMsIHN0YXRzJCQxLCBjb25maWcpO1xuICB2YXIgZnJhbWVidWZmZXJTdGF0ZSA9IHdyYXBGQk9TdGF0ZShcbiAgICBnbCxcbiAgICBleHRlbnNpb25zLFxuICAgIGxpbWl0cyxcbiAgICB0ZXh0dXJlU3RhdGUsXG4gICAgcmVuZGVyYnVmZmVyU3RhdGUsXG4gICAgc3RhdHMkJDEpO1xuICB2YXIgY29yZSA9IHJlZ2xDb3JlKFxuICAgIGdsLFxuICAgIHN0cmluZ1N0b3JlLFxuICAgIGV4dGVuc2lvbnMsXG4gICAgbGltaXRzLFxuICAgIGJ1ZmZlclN0YXRlLFxuICAgIGVsZW1lbnRTdGF0ZSxcbiAgICB0ZXh0dXJlU3RhdGUsXG4gICAgZnJhbWVidWZmZXJTdGF0ZSxcbiAgICB1bmlmb3JtU3RhdGUsXG4gICAgYXR0cmlidXRlU3RhdGUsXG4gICAgc2hhZGVyU3RhdGUsXG4gICAgZHJhd1N0YXRlLFxuICAgIGNvbnRleHRTdGF0ZSxcbiAgICB0aW1lcixcbiAgICBjb25maWcpO1xuICB2YXIgcmVhZFBpeGVscyA9IHdyYXBSZWFkUGl4ZWxzKFxuICAgIGdsLFxuICAgIGZyYW1lYnVmZmVyU3RhdGUsXG4gICAgY29yZS5wcm9jcy5wb2xsLFxuICAgIGNvbnRleHRTdGF0ZSxcbiAgICBnbEF0dHJpYnV0ZXMsIGV4dGVuc2lvbnMsIGxpbWl0cyk7XG5cbiAgdmFyIG5leHRTdGF0ZSA9IGNvcmUubmV4dDtcbiAgdmFyIGNhbnZhcyA9IGdsLmNhbnZhcztcblxuICB2YXIgcmFmQ2FsbGJhY2tzID0gW107XG4gIHZhciBsb3NzQ2FsbGJhY2tzID0gW107XG4gIHZhciByZXN0b3JlQ2FsbGJhY2tzID0gW107XG4gIHZhciBkZXN0cm95Q2FsbGJhY2tzID0gW2NvbmZpZy5vbkRlc3Ryb3ldO1xuXG4gIHZhciBhY3RpdmVSQUYgPSBudWxsO1xuICBmdW5jdGlvbiBoYW5kbGVSQUYgKCkge1xuICAgIGlmIChyYWZDYWxsYmFja3MubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAodGltZXIpIHtcbiAgICAgICAgdGltZXIudXBkYXRlKCk7XG4gICAgICB9XG4gICAgICBhY3RpdmVSQUYgPSBudWxsO1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gc2NoZWR1bGUgbmV4dCBhbmltYXRpb24gZnJhbWVcbiAgICBhY3RpdmVSQUYgPSByYWYubmV4dChoYW5kbGVSQUYpO1xuXG4gICAgLy8gcG9sbCBmb3IgY2hhbmdlc1xuICAgIHBvbGwoKTtcblxuICAgIC8vIGZpcmUgYSBjYWxsYmFjayBmb3IgYWxsIHBlbmRpbmcgcmFmc1xuICAgIGZvciAodmFyIGkgPSByYWZDYWxsYmFja3MubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHZhciBjYiA9IHJhZkNhbGxiYWNrc1tpXTtcbiAgICAgIGlmIChjYikge1xuICAgICAgICBjYihjb250ZXh0U3RhdGUsIG51bGwsIDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZsdXNoIGFsbCBwZW5kaW5nIHdlYmdsIGNhbGxzXG4gICAgZ2wuZmx1c2goKTtcblxuICAgIC8vIHBvbGwgR1BVIHRpbWVycyAqYWZ0ZXIqIGdsLmZsdXNoIHNvIHdlIGRvbid0IGRlbGF5IGNvbW1hbmQgZGlzcGF0Y2hcbiAgICBpZiAodGltZXIpIHtcbiAgICAgIHRpbWVyLnVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0UkFGICgpIHtcbiAgICBpZiAoIWFjdGl2ZVJBRiAmJiByYWZDYWxsYmFja3MubGVuZ3RoID4gMCkge1xuICAgICAgYWN0aXZlUkFGID0gcmFmLm5leHQoaGFuZGxlUkFGKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzdG9wUkFGICgpIHtcbiAgICBpZiAoYWN0aXZlUkFGKSB7XG4gICAgICByYWYuY2FuY2VsKGhhbmRsZVJBRik7XG4gICAgICBhY3RpdmVSQUYgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUNvbnRleHRMb3NzIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBzZXQgY29udGV4dCBsb3N0IGZsYWdcbiAgICBjb250ZXh0TG9zdCA9IHRydWU7XG5cbiAgICAvLyBwYXVzZSByZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZVxuICAgIHN0b3BSQUYoKTtcblxuICAgIC8vIGxvc2UgY29udGV4dFxuICAgIGxvc3NDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2IpIHtcbiAgICAgIGNiKCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVDb250ZXh0UmVzdG9yZWQgKGV2ZW50KSB7XG4gICAgLy8gY2xlYXIgZXJyb3IgY29kZVxuICAgIGdsLmdldEVycm9yKCk7XG5cbiAgICAvLyBjbGVhciBjb250ZXh0IGxvc3QgZmxhZ1xuICAgIGNvbnRleHRMb3N0ID0gZmFsc2U7XG5cbiAgICAvLyByZWZyZXNoIHN0YXRlXG4gICAgZXh0ZW5zaW9uU3RhdGUucmVzdG9yZSgpO1xuICAgIHNoYWRlclN0YXRlLnJlc3RvcmUoKTtcbiAgICBidWZmZXJTdGF0ZS5yZXN0b3JlKCk7XG4gICAgdGV4dHVyZVN0YXRlLnJlc3RvcmUoKTtcbiAgICByZW5kZXJidWZmZXJTdGF0ZS5yZXN0b3JlKCk7XG4gICAgZnJhbWVidWZmZXJTdGF0ZS5yZXN0b3JlKCk7XG4gICAgaWYgKHRpbWVyKSB7XG4gICAgICB0aW1lci5yZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgLy8gcmVmcmVzaCBzdGF0ZVxuICAgIGNvcmUucHJvY3MucmVmcmVzaCgpO1xuXG4gICAgLy8gcmVzdGFydCBSQUZcbiAgICBzdGFydFJBRigpO1xuXG4gICAgLy8gcmVzdG9yZSBjb250ZXh0XG4gICAgcmVzdG9yZUNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChjYikge1xuICAgICAgY2IoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChjYW52YXMpIHtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihDT05URVhUX0xPU1RfRVZFTlQsIGhhbmRsZUNvbnRleHRMb3NzLCBmYWxzZSk7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoQ09OVEVYVF9SRVNUT1JFRF9FVkVOVCwgaGFuZGxlQ29udGV4dFJlc3RvcmVkLCBmYWxzZSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95ICgpIHtcbiAgICByYWZDYWxsYmFja3MubGVuZ3RoID0gMDtcbiAgICBzdG9wUkFGKCk7XG5cbiAgICBpZiAoY2FudmFzKSB7XG4gICAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihDT05URVhUX0xPU1RfRVZFTlQsIGhhbmRsZUNvbnRleHRMb3NzKTtcbiAgICAgIGNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKENPTlRFWFRfUkVTVE9SRURfRVZFTlQsIGhhbmRsZUNvbnRleHRSZXN0b3JlZCk7XG4gICAgfVxuXG4gICAgc2hhZGVyU3RhdGUuY2xlYXIoKTtcbiAgICBmcmFtZWJ1ZmZlclN0YXRlLmNsZWFyKCk7XG4gICAgcmVuZGVyYnVmZmVyU3RhdGUuY2xlYXIoKTtcbiAgICB0ZXh0dXJlU3RhdGUuY2xlYXIoKTtcbiAgICBlbGVtZW50U3RhdGUuY2xlYXIoKTtcbiAgICBidWZmZXJTdGF0ZS5jbGVhcigpO1xuXG4gICAgaWYgKHRpbWVyKSB7XG4gICAgICB0aW1lci5jbGVhcigpO1xuICAgIH1cblxuICAgIGRlc3Ryb3lDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2IpIHtcbiAgICAgIGNiKCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjb21waWxlUHJvY2VkdXJlIChvcHRpb25zKSB7XG4gICAgY2hlY2skMSghIW9wdGlvbnMsICdpbnZhbGlkIGFyZ3MgdG8gcmVnbCh7Li4ufSknKTtcbiAgICBjaGVjayQxLnR5cGUob3B0aW9ucywgJ29iamVjdCcsICdpbnZhbGlkIGFyZ3MgdG8gcmVnbCh7Li4ufSknKTtcblxuICAgIGZ1bmN0aW9uIGZsYXR0ZW5OZXN0ZWRPcHRpb25zIChvcHRpb25zKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gZXh0ZW5kKHt9LCBvcHRpb25zKTtcbiAgICAgIGRlbGV0ZSByZXN1bHQudW5pZm9ybXM7XG4gICAgICBkZWxldGUgcmVzdWx0LmF0dHJpYnV0ZXM7XG4gICAgICBkZWxldGUgcmVzdWx0LmNvbnRleHQ7XG5cbiAgICAgIGlmICgnc3RlbmNpbCcgaW4gcmVzdWx0ICYmIHJlc3VsdC5zdGVuY2lsLm9wKSB7XG4gICAgICAgIHJlc3VsdC5zdGVuY2lsLm9wQmFjayA9IHJlc3VsdC5zdGVuY2lsLm9wRnJvbnQgPSByZXN1bHQuc3RlbmNpbC5vcDtcbiAgICAgICAgZGVsZXRlIHJlc3VsdC5zdGVuY2lsLm9wO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBtZXJnZSAobmFtZSkge1xuICAgICAgICBpZiAobmFtZSBpbiByZXN1bHQpIHtcbiAgICAgICAgICB2YXIgY2hpbGQgPSByZXN1bHRbbmFtZV07XG4gICAgICAgICAgZGVsZXRlIHJlc3VsdFtuYW1lXTtcbiAgICAgICAgICBPYmplY3Qua2V5cyhjaGlsZCkuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICAgICAgcmVzdWx0W25hbWUgKyAnLicgKyBwcm9wXSA9IGNoaWxkW3Byb3BdO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBtZXJnZSgnYmxlbmQnKTtcbiAgICAgIG1lcmdlKCdkZXB0aCcpO1xuICAgICAgbWVyZ2UoJ2N1bGwnKTtcbiAgICAgIG1lcmdlKCdzdGVuY2lsJyk7XG4gICAgICBtZXJnZSgncG9seWdvbk9mZnNldCcpO1xuICAgICAgbWVyZ2UoJ3NjaXNzb3InKTtcbiAgICAgIG1lcmdlKCdzYW1wbGUnKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNlcGFyYXRlRHluYW1pYyAob2JqZWN0KSB7XG4gICAgICB2YXIgc3RhdGljSXRlbXMgPSB7fTtcbiAgICAgIHZhciBkeW5hbWljSXRlbXMgPSB7fTtcbiAgICAgIE9iamVjdC5rZXlzKG9iamVjdCkuZm9yRWFjaChmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IG9iamVjdFtvcHRpb25dO1xuICAgICAgICBpZiAoZHluYW1pYy5pc0R5bmFtaWModmFsdWUpKSB7XG4gICAgICAgICAgZHluYW1pY0l0ZW1zW29wdGlvbl0gPSBkeW5hbWljLnVuYm94KHZhbHVlLCBvcHRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0YXRpY0l0ZW1zW29wdGlvbl0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkeW5hbWljOiBkeW5hbWljSXRlbXMsXG4gICAgICAgIHN0YXRpYzogc3RhdGljSXRlbXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUcmVhdCBjb250ZXh0IHZhcmlhYmxlcyBzZXBhcmF0ZSBmcm9tIG90aGVyIGR5bmFtaWMgdmFyaWFibGVzXG4gICAgdmFyIGNvbnRleHQgPSBzZXBhcmF0ZUR5bmFtaWMob3B0aW9ucy5jb250ZXh0IHx8IHt9KTtcbiAgICB2YXIgdW5pZm9ybXMgPSBzZXBhcmF0ZUR5bmFtaWMob3B0aW9ucy51bmlmb3JtcyB8fCB7fSk7XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBzZXBhcmF0ZUR5bmFtaWMob3B0aW9ucy5hdHRyaWJ1dGVzIHx8IHt9KTtcbiAgICB2YXIgb3B0cyA9IHNlcGFyYXRlRHluYW1pYyhmbGF0dGVuTmVzdGVkT3B0aW9ucyhvcHRpb25zKSk7XG5cbiAgICB2YXIgc3RhdHMkJDEgPSB7XG4gICAgICBncHVUaW1lOiAwLjAsXG4gICAgICBjcHVUaW1lOiAwLjAsXG4gICAgICBjb3VudDogMFxuICAgIH07XG5cbiAgICB2YXIgY29tcGlsZWQgPSBjb3JlLmNvbXBpbGUob3B0cywgYXR0cmlidXRlcywgdW5pZm9ybXMsIGNvbnRleHQsIHN0YXRzJCQxKTtcblxuICAgIHZhciBkcmF3ID0gY29tcGlsZWQuZHJhdztcbiAgICB2YXIgYmF0Y2ggPSBjb21waWxlZC5iYXRjaDtcbiAgICB2YXIgc2NvcGUgPSBjb21waWxlZC5zY29wZTtcblxuICAgIC8vIEZJWE1FOiB3ZSBzaG91bGQgbW9kaWZ5IGNvZGUgZ2VuZXJhdGlvbiBmb3IgYmF0Y2ggY29tbWFuZHMgc28gdGhpc1xuICAgIC8vIGlzbid0IG5lY2Vzc2FyeVxuICAgIHZhciBFTVBUWV9BUlJBWSA9IFtdO1xuICAgIGZ1bmN0aW9uIHJlc2VydmUgKGNvdW50KSB7XG4gICAgICB3aGlsZSAoRU1QVFlfQVJSQVkubGVuZ3RoIDwgY291bnQpIHtcbiAgICAgICAgRU1QVFlfQVJSQVkucHVzaChudWxsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBFTVBUWV9BUlJBWVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIFJFR0xDb21tYW5kIChhcmdzLCBib2R5KSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGlmIChjb250ZXh0TG9zdCkge1xuICAgICAgICBjaGVjayQxLnJhaXNlKCdjb250ZXh0IGxvc3QnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgYXJncyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gc2NvcGUuY2FsbCh0aGlzLCBudWxsLCBhcmdzLCAwKVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpZiAodHlwZW9mIGFyZ3MgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IGFyZ3M7ICsraSkge1xuICAgICAgICAgICAgc2NvcGUuY2FsbCh0aGlzLCBudWxsLCBib2R5LCBpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcmdzKSkge1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBzY29wZS5jYWxsKHRoaXMsIGFyZ3NbaV0sIGJvZHksIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc2NvcGUuY2FsbCh0aGlzLCBhcmdzLCBib2R5LCAwKVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmdzID09PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAoYXJncyA+IDApIHtcbiAgICAgICAgICByZXR1cm4gYmF0Y2guY2FsbCh0aGlzLCByZXNlcnZlKGFyZ3MgfCAwKSwgYXJncyB8IDApXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcmdzKSkge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gYmF0Y2guY2FsbCh0aGlzLCBhcmdzLCBhcmdzLmxlbmd0aClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGRyYXcuY2FsbCh0aGlzLCBhcmdzKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBleHRlbmQoUkVHTENvbW1hbmQsIHtcbiAgICAgIHN0YXRzOiBzdGF0cyQkMVxuICAgIH0pXG4gIH1cblxuICB2YXIgc2V0RkJPID0gZnJhbWVidWZmZXJTdGF0ZS5zZXRGQk8gPSBjb21waWxlUHJvY2VkdXJlKHtcbiAgICBmcmFtZWJ1ZmZlcjogZHluYW1pYy5kZWZpbmUuY2FsbChudWxsLCBEWU5fUFJPUCwgJ2ZyYW1lYnVmZmVyJylcbiAgfSk7XG5cbiAgZnVuY3Rpb24gY2xlYXJJbXBsIChfLCBvcHRpb25zKSB7XG4gICAgdmFyIGNsZWFyRmxhZ3MgPSAwO1xuICAgIGNvcmUucHJvY3MucG9sbCgpO1xuXG4gICAgdmFyIGMgPSBvcHRpb25zLmNvbG9yO1xuICAgIGlmIChjKSB7XG4gICAgICBnbC5jbGVhckNvbG9yKCtjWzBdIHx8IDAsICtjWzFdIHx8IDAsICtjWzJdIHx8IDAsICtjWzNdIHx8IDApO1xuICAgICAgY2xlYXJGbGFncyB8PSBHTF9DT0xPUl9CVUZGRVJfQklUO1xuICAgIH1cbiAgICBpZiAoJ2RlcHRoJyBpbiBvcHRpb25zKSB7XG4gICAgICBnbC5jbGVhckRlcHRoKCtvcHRpb25zLmRlcHRoKTtcbiAgICAgIGNsZWFyRmxhZ3MgfD0gR0xfREVQVEhfQlVGRkVSX0JJVDtcbiAgICB9XG4gICAgaWYgKCdzdGVuY2lsJyBpbiBvcHRpb25zKSB7XG4gICAgICBnbC5jbGVhclN0ZW5jaWwob3B0aW9ucy5zdGVuY2lsIHwgMCk7XG4gICAgICBjbGVhckZsYWdzIHw9IEdMX1NURU5DSUxfQlVGRkVSX0JJVDtcbiAgICB9XG5cbiAgICBjaGVjayQxKCEhY2xlYXJGbGFncywgJ2NhbGxlZCByZWdsLmNsZWFyIHdpdGggbm8gYnVmZmVyIHNwZWNpZmllZCcpO1xuICAgIGdsLmNsZWFyKGNsZWFyRmxhZ3MpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXIgKG9wdGlvbnMpIHtcbiAgICBjaGVjayQxKFxuICAgICAgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICYmIG9wdGlvbnMsXG4gICAgICAncmVnbC5jbGVhcigpIHRha2VzIGFuIG9iamVjdCBhcyBpbnB1dCcpO1xuICAgIGlmICgnZnJhbWVidWZmZXInIGluIG9wdGlvbnMpIHtcbiAgICAgIGlmIChvcHRpb25zLmZyYW1lYnVmZmVyICYmXG4gICAgICAgICAgb3B0aW9ucy5mcmFtZWJ1ZmZlcl9yZWdsVHlwZSA9PT0gJ2ZyYW1lYnVmZmVyQ3ViZScpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyArK2kpIHtcbiAgICAgICAgICBzZXRGQk8oZXh0ZW5kKHtcbiAgICAgICAgICAgIGZyYW1lYnVmZmVyOiBvcHRpb25zLmZyYW1lYnVmZmVyLmZhY2VzW2ldXG4gICAgICAgICAgfSwgb3B0aW9ucyksIGNsZWFySW1wbCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldEZCTyhvcHRpb25zLCBjbGVhckltcGwpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjbGVhckltcGwobnVsbCwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZnJhbWUgKGNiKSB7XG4gICAgY2hlY2skMS50eXBlKGNiLCAnZnVuY3Rpb24nLCAncmVnbC5mcmFtZSgpIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgIHJhZkNhbGxiYWNrcy5wdXNoKGNiKTtcblxuICAgIGZ1bmN0aW9uIGNhbmNlbCAoKSB7XG4gICAgICAvLyBGSVhNRTogIHNob3VsZCB3ZSBjaGVjayBzb21ldGhpbmcgb3RoZXIgdGhhbiBlcXVhbHMgY2IgaGVyZT9cbiAgICAgIC8vIHdoYXQgaWYgYSB1c2VyIGNhbGxzIGZyYW1lIHR3aWNlIHdpdGggdGhlIHNhbWUgY2FsbGJhY2suLi5cbiAgICAgIC8vXG4gICAgICB2YXIgaSA9IGZpbmQocmFmQ2FsbGJhY2tzLCBjYik7XG4gICAgICBjaGVjayQxKGkgPj0gMCwgJ2Nhbm5vdCBjYW5jZWwgYSBmcmFtZSB0d2ljZScpO1xuICAgICAgZnVuY3Rpb24gcGVuZGluZ0NhbmNlbCAoKSB7XG4gICAgICAgIHZhciBpbmRleCA9IGZpbmQocmFmQ2FsbGJhY2tzLCBwZW5kaW5nQ2FuY2VsKTtcbiAgICAgICAgcmFmQ2FsbGJhY2tzW2luZGV4XSA9IHJhZkNhbGxiYWNrc1tyYWZDYWxsYmFja3MubGVuZ3RoIC0gMV07XG4gICAgICAgIHJhZkNhbGxiYWNrcy5sZW5ndGggLT0gMTtcbiAgICAgICAgaWYgKHJhZkNhbGxiYWNrcy5sZW5ndGggPD0gMCkge1xuICAgICAgICAgIHN0b3BSQUYoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmFmQ2FsbGJhY2tzW2ldID0gcGVuZGluZ0NhbmNlbDtcbiAgICB9XG5cbiAgICBzdGFydFJBRigpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNhbmNlbDogY2FuY2VsXG4gICAgfVxuICB9XG5cbiAgLy8gcG9sbCB2aWV3cG9ydFxuICBmdW5jdGlvbiBwb2xsVmlld3BvcnQgKCkge1xuICAgIHZhciB2aWV3cG9ydCA9IG5leHRTdGF0ZS52aWV3cG9ydDtcbiAgICB2YXIgc2Npc3NvckJveCA9IG5leHRTdGF0ZS5zY2lzc29yX2JveDtcbiAgICB2aWV3cG9ydFswXSA9IHZpZXdwb3J0WzFdID0gc2Npc3NvckJveFswXSA9IHNjaXNzb3JCb3hbMV0gPSAwO1xuICAgIGNvbnRleHRTdGF0ZS52aWV3cG9ydFdpZHRoID1cbiAgICAgIGNvbnRleHRTdGF0ZS5mcmFtZWJ1ZmZlcldpZHRoID1cbiAgICAgIGNvbnRleHRTdGF0ZS5kcmF3aW5nQnVmZmVyV2lkdGggPVxuICAgICAgdmlld3BvcnRbMl0gPVxuICAgICAgc2Npc3NvckJveFsyXSA9IGdsLmRyYXdpbmdCdWZmZXJXaWR0aDtcbiAgICBjb250ZXh0U3RhdGUudmlld3BvcnRIZWlnaHQgPVxuICAgICAgY29udGV4dFN0YXRlLmZyYW1lYnVmZmVySGVpZ2h0ID1cbiAgICAgIGNvbnRleHRTdGF0ZS5kcmF3aW5nQnVmZmVySGVpZ2h0ID1cbiAgICAgIHZpZXdwb3J0WzNdID1cbiAgICAgIHNjaXNzb3JCb3hbM10gPSBnbC5kcmF3aW5nQnVmZmVySGVpZ2h0O1xuICB9XG5cbiAgZnVuY3Rpb24gcG9sbCAoKSB7XG4gICAgY29udGV4dFN0YXRlLnRpY2sgKz0gMTtcbiAgICBjb250ZXh0U3RhdGUudGltZSA9IG5vdygpO1xuICAgIHBvbGxWaWV3cG9ydCgpO1xuICAgIGNvcmUucHJvY3MucG9sbCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVmcmVzaCAoKSB7XG4gICAgcG9sbFZpZXdwb3J0KCk7XG4gICAgY29yZS5wcm9jcy5yZWZyZXNoKCk7XG4gICAgaWYgKHRpbWVyKSB7XG4gICAgICB0aW1lci51cGRhdGUoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBub3cgKCkge1xuICAgIHJldHVybiAoY2xvY2soKSAtIFNUQVJUX1RJTUUpIC8gMTAwMC4wXG4gIH1cblxuICByZWZyZXNoKCk7XG5cbiAgZnVuY3Rpb24gYWRkTGlzdGVuZXIgKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIGNoZWNrJDEudHlwZShjYWxsYmFjaywgJ2Z1bmN0aW9uJywgJ2xpc3RlbmVyIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gICAgdmFyIGNhbGxiYWNrcztcbiAgICBzd2l0Y2ggKGV2ZW50KSB7XG4gICAgICBjYXNlICdmcmFtZSc6XG4gICAgICAgIHJldHVybiBmcmFtZShjYWxsYmFjaylcbiAgICAgIGNhc2UgJ2xvc3QnOlxuICAgICAgICBjYWxsYmFja3MgPSBsb3NzQ2FsbGJhY2tzO1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSAncmVzdG9yZSc6XG4gICAgICAgIGNhbGxiYWNrcyA9IHJlc3RvcmVDYWxsYmFja3M7XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdkZXN0cm95JzpcbiAgICAgICAgY2FsbGJhY2tzID0gZGVzdHJveUNhbGxiYWNrcztcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNoZWNrJDEucmFpc2UoJ2ludmFsaWQgZXZlbnQsIG11c3QgYmUgb25lIG9mIGZyYW1lLGxvc3QscmVzdG9yZSxkZXN0cm95Jyk7XG4gICAgfVxuXG4gICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgIHJldHVybiB7XG4gICAgICBjYW5jZWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2tzW2ldID09PSBjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2tzW2ldID0gY2FsbGJhY2tzW2NhbGxiYWNrcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGNhbGxiYWNrcy5wb3AoKTtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciByZWdsID0gZXh0ZW5kKGNvbXBpbGVQcm9jZWR1cmUsIHtcbiAgICAvLyBDbGVhciBjdXJyZW50IEZCT1xuICAgIGNsZWFyOiBjbGVhcixcblxuICAgIC8vIFNob3J0IGN1dHMgZm9yIGR5bmFtaWMgdmFyaWFibGVzXG4gICAgcHJvcDogZHluYW1pYy5kZWZpbmUuYmluZChudWxsLCBEWU5fUFJPUCksXG4gICAgY29udGV4dDogZHluYW1pYy5kZWZpbmUuYmluZChudWxsLCBEWU5fQ09OVEVYVCksXG4gICAgdGhpczogZHluYW1pYy5kZWZpbmUuYmluZChudWxsLCBEWU5fU1RBVEUpLFxuXG4gICAgLy8gZXhlY3V0ZXMgYW4gZW1wdHkgZHJhdyBjb21tYW5kXG4gICAgZHJhdzogY29tcGlsZVByb2NlZHVyZSh7fSksXG5cbiAgICAvLyBSZXNvdXJjZXNcbiAgICBidWZmZXI6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICByZXR1cm4gYnVmZmVyU3RhdGUuY3JlYXRlKG9wdGlvbnMsIEdMX0FSUkFZX0JVRkZFUiwgZmFsc2UsIGZhbHNlKVxuICAgIH0sXG4gICAgZWxlbWVudHM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICByZXR1cm4gZWxlbWVudFN0YXRlLmNyZWF0ZShvcHRpb25zLCBmYWxzZSlcbiAgICB9LFxuICAgIHRleHR1cmU6IHRleHR1cmVTdGF0ZS5jcmVhdGUyRCxcbiAgICBjdWJlOiB0ZXh0dXJlU3RhdGUuY3JlYXRlQ3ViZSxcbiAgICByZW5kZXJidWZmZXI6IHJlbmRlcmJ1ZmZlclN0YXRlLmNyZWF0ZSxcbiAgICBmcmFtZWJ1ZmZlcjogZnJhbWVidWZmZXJTdGF0ZS5jcmVhdGUsXG4gICAgZnJhbWVidWZmZXJDdWJlOiBmcmFtZWJ1ZmZlclN0YXRlLmNyZWF0ZUN1YmUsXG5cbiAgICAvLyBFeHBvc2UgY29udGV4dCBhdHRyaWJ1dGVzXG4gICAgYXR0cmlidXRlczogZ2xBdHRyaWJ1dGVzLFxuXG4gICAgLy8gRnJhbWUgcmVuZGVyaW5nXG4gICAgZnJhbWU6IGZyYW1lLFxuICAgIG9uOiBhZGRMaXN0ZW5lcixcblxuICAgIC8vIFN5c3RlbSBsaW1pdHNcbiAgICBsaW1pdHM6IGxpbWl0cyxcbiAgICBoYXNFeHRlbnNpb246IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICByZXR1cm4gbGltaXRzLmV4dGVuc2lvbnMuaW5kZXhPZihuYW1lLnRvTG93ZXJDYXNlKCkpID49IDBcbiAgICB9LFxuXG4gICAgLy8gUmVhZCBwaXhlbHNcbiAgICByZWFkOiByZWFkUGl4ZWxzLFxuXG4gICAgLy8gRGVzdHJveSByZWdsIGFuZCBhbGwgYXNzb2NpYXRlZCByZXNvdXJjZXNcbiAgICBkZXN0cm95OiBkZXN0cm95LFxuXG4gICAgLy8gRGlyZWN0IEdMIHN0YXRlIG1hbmlwdWxhdGlvblxuICAgIF9nbDogZ2wsXG4gICAgX3JlZnJlc2g6IHJlZnJlc2gsXG5cbiAgICBwb2xsOiBmdW5jdGlvbiAoKSB7XG4gICAgICBwb2xsKCk7XG4gICAgICBpZiAodGltZXIpIHtcbiAgICAgICAgdGltZXIudXBkYXRlKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEN1cnJlbnQgdGltZVxuICAgIG5vdzogbm93LFxuXG4gICAgLy8gcmVnbCBTdGF0aXN0aWNzIEluZm9ybWF0aW9uXG4gICAgc3RhdHM6IHN0YXRzJCQxXG4gIH0pO1xuXG4gIGNvbmZpZy5vbkRvbmUobnVsbCwgcmVnbCk7XG5cbiAgcmV0dXJuIHJlZ2xcbn1cblxucmV0dXJuIHdyYXBSRUdMO1xuXG59KSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVnbC5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgcGFyc2VVbml0ID0gcmVxdWlyZSgncGFyc2UtdW5pdCcpXG5cbm1vZHVsZS5leHBvcnRzID0gdG9QWFxuXG52YXIgUElYRUxTX1BFUl9JTkNIID0gOTZcblxuZnVuY3Rpb24gZ2V0UHJvcGVydHlJblBYKGVsZW1lbnQsIHByb3ApIHtcbiAgdmFyIHBhcnRzID0gcGFyc2VVbml0KGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wKSlcbiAgcmV0dXJuIHBhcnRzWzBdICogdG9QWChwYXJ0c1sxXSwgZWxlbWVudClcbn1cblxuLy9UaGlzIGJydXRhbCBoYWNrIGlzIG5lZWRlZFxuZnVuY3Rpb24gZ2V0U2l6ZUJydXRhbCh1bml0LCBlbGVtZW50KSB7XG4gIHZhciB0ZXN0RElWID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgdGVzdERJVi5zdHlsZVsnZm9udC1zaXplJ10gPSAnMTI4JyArIHVuaXRcbiAgZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXN0RElWKVxuICB2YXIgc2l6ZSA9IGdldFByb3BlcnR5SW5QWCh0ZXN0RElWLCAnZm9udC1zaXplJykgLyAxMjhcbiAgZWxlbWVudC5yZW1vdmVDaGlsZCh0ZXN0RElWKVxuICByZXR1cm4gc2l6ZVxufVxuXG5mdW5jdGlvbiB0b1BYKHN0ciwgZWxlbWVudCkge1xuICBlbGVtZW50ID0gZWxlbWVudCB8fCBkb2N1bWVudC5ib2R5XG4gIHN0ciA9IChzdHIgfHwgJ3B4JykudHJpbSgpLnRvTG93ZXJDYXNlKClcbiAgaWYoZWxlbWVudCA9PT0gd2luZG93IHx8IGVsZW1lbnQgPT09IGRvY3VtZW50KSB7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmJvZHkgXG4gIH1cbiAgc3dpdGNoKHN0cikge1xuICAgIGNhc2UgJyUnOiAgLy9BbWJpZ3VvdXMsIG5vdCBzdXJlIGlmIHdlIHNob3VsZCB1c2Ugd2lkdGggb3IgaGVpZ2h0XG4gICAgICByZXR1cm4gZWxlbWVudC5jbGllbnRIZWlnaHQgLyAxMDAuMFxuICAgIGNhc2UgJ2NoJzpcbiAgICBjYXNlICdleCc6XG4gICAgICByZXR1cm4gZ2V0U2l6ZUJydXRhbChzdHIsIGVsZW1lbnQpXG4gICAgY2FzZSAnZW0nOlxuICAgICAgcmV0dXJuIGdldFByb3BlcnR5SW5QWChlbGVtZW50LCAnZm9udC1zaXplJylcbiAgICBjYXNlICdyZW0nOlxuICAgICAgcmV0dXJuIGdldFByb3BlcnR5SW5QWChkb2N1bWVudC5ib2R5LCAnZm9udC1zaXplJylcbiAgICBjYXNlICd2dyc6XG4gICAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGgvMTAwXG4gICAgY2FzZSAndmgnOlxuICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodC8xMDBcbiAgICBjYXNlICd2bWluJzpcbiAgICAgIHJldHVybiBNYXRoLm1pbih3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KSAvIDEwMFxuICAgIGNhc2UgJ3ZtYXgnOlxuICAgICAgcmV0dXJuIE1hdGgubWF4KHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpIC8gMTAwXG4gICAgY2FzZSAnaW4nOlxuICAgICAgcmV0dXJuIFBJWEVMU19QRVJfSU5DSFxuICAgIGNhc2UgJ2NtJzpcbiAgICAgIHJldHVybiBQSVhFTFNfUEVSX0lOQ0ggLyAyLjU0XG4gICAgY2FzZSAnbW0nOlxuICAgICAgcmV0dXJuIFBJWEVMU19QRVJfSU5DSCAvIDI1LjRcbiAgICBjYXNlICdwdCc6XG4gICAgICByZXR1cm4gUElYRUxTX1BFUl9JTkNIIC8gNzJcbiAgICBjYXNlICdwYyc6XG4gICAgICByZXR1cm4gUElYRUxTX1BFUl9JTkNIIC8gNlxuICB9XG4gIHJldHVybiAxXG59Il19
