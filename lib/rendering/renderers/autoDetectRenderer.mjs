import { isWebGLSupported } from '../../utils/browser/isWebGLSupported.mjs';
import { isWebGPUSupported } from '../../utils/browser/isWebGPUSupported.mjs';
import { AbstractRenderer } from './shared/system/AbstractRenderer.mjs';

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
const renderPriority = ["webgl", "webgpu", "canvas"];
async function autoDetectRenderer(options) {
  var _a;
  let preferredOrder = [];
  if (options.preference) {
    preferredOrder.push(options.preference);
    renderPriority.forEach((item) => {
      if (item !== options.preference) {
        preferredOrder.push(item);
      }
    });
  } else {
    preferredOrder = renderPriority.slice();
  }
  let RendererClass;
  let finalOptions = {};
  for (let i = 0; i < preferredOrder.length; i++) {
    const rendererType = preferredOrder[i];
    if (rendererType === "webgpu" && await isWebGPUSupported()) {
      const { WebGPURenderer } = await import('./gpu/WebGPURenderer.mjs');
      RendererClass = WebGPURenderer;
      finalOptions = __spreadValues(__spreadValues({}, options), options.webgpu);
      break;
    } else if (rendererType === "webgl" && isWebGLSupported(
      (_a = options.failIfMajorPerformanceCaveat) != null ? _a : AbstractRenderer.defaultOptions.failIfMajorPerformanceCaveat
    )) {
      const { WebGLRenderer } = await import('./gl/WebGLRenderer.mjs');
      RendererClass = WebGLRenderer;
      finalOptions = __spreadValues(__spreadValues({}, options), options.webgl);
      break;
    } else if (rendererType === "canvas") {
      finalOptions = __spreadValues({}, options);
      throw new Error("CanvasRenderer is not yet implemented");
    }
  }
  delete finalOptions.webgpu;
  delete finalOptions.webgl;
  if (!RendererClass) {
    throw new Error("No available renderer for the current environment");
  }
  const renderer = new RendererClass();
  await renderer.init(finalOptions);
  return renderer;
}

export { autoDetectRenderer };
//# sourceMappingURL=autoDetectRenderer.mjs.map
