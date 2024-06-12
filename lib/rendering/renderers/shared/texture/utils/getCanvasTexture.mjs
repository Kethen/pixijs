import { CanvasSource } from '../sources/CanvasSource.mjs';
import { Texture } from '../Texture.mjs';

"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const canvasCache = /* @__PURE__ */ new Map();
function getCanvasTexture(canvas, options) {
  if (!canvasCache.has(canvas)) {
    const texture = new Texture({
      source: new CanvasSource(__spreadValues({
        resource: canvas
      }, options))
    });
    const onDestroy = () => {
      if (canvasCache.get(canvas) === texture) {
        canvasCache.delete(canvas);
      }
    };
    texture.once("destroy", onDestroy);
    texture.source.once("destroy", onDestroy);
    canvasCache.set(canvas, texture);
  }
  return canvasCache.get(canvas);
}
function hasCachedCanvasTexture(canvas) {
  return canvasCache.has(canvas);
}

export { getCanvasTexture, hasCachedCanvasTexture };
//# sourceMappingURL=getCanvasTexture.mjs.map
