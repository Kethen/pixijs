import { DOMAdapter } from '../../../../environment/adapter.mjs';
import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { ImageSource } from '../../../../rendering/renderers/shared/texture/sources/ImageSource.mjs';
import { GraphicsContext } from '../../../../scene/graphics/shared/GraphicsContext.mjs';
import { getResolutionOfUrl } from '../../../../utils/network/getResolutionOfUrl.mjs';
import { checkDataUrl } from '../../../utils/checkDataUrl.mjs';
import { checkExtension } from '../../../utils/checkExtension.mjs';
import { LoaderParserPriority } from '../LoaderParser.mjs';
import { createTexture } from './utils/createTexture.mjs';

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
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const validSVGExtension = ".svg";
const validSVGMIME = "image/svg+xml";
const loadSvg = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.Low,
    name: "loadSVG"
  },
  name: "loadSVG",
  config: {
    crossOrigin: "anonymous",
    parseAsGraphicsContext: false
  },
  test(url) {
    return checkDataUrl(url, validSVGMIME) || checkExtension(url, validSVGExtension);
  },
  async load(url, asset, loader) {
    var _a;
    if ((_a = asset.data.parseAsGraphicsContext) != null ? _a : this.config.parseAsGraphicsContext) {
      return loadAsGraphics(url);
    }
    return loadAsTexture(url, asset, loader, this.config.crossOrigin);
  },
  unload(asset) {
    asset.destroy(true);
  }
};
async function loadAsTexture(url, asset, loader, crossOrigin) {
  var _a, _b, _c, _d, _e;
  const response = await DOMAdapter.get().fetch(url);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const image = new Image();
  image.src = blobUrl;
  image.crossOrigin = crossOrigin;
  await image.decode();
  URL.revokeObjectURL(blobUrl);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const resolution = ((_a = asset.data) == null ? void 0 : _a.resolution) || getResolutionOfUrl(url);
  const width = (_c = (_b = asset.data) == null ? void 0 : _b.width) != null ? _c : image.width;
  const height = (_e = (_d = asset.data) == null ? void 0 : _d.height) != null ? _e : image.height;
  canvas.width = width * resolution;
  canvas.height = height * resolution;
  context.drawImage(image, 0, 0, width * resolution, height * resolution);
  const _f = asset.data, { parseAsGraphicsContext: _p } = _f, rest = __objRest(_f, ["parseAsGraphicsContext"]);
  const base = new ImageSource(__spreadValues({
    resource: canvas,
    alphaMode: "premultiply-alpha-on-upload",
    resolution
  }, rest));
  return createTexture(base, loader, url);
}
async function loadAsGraphics(url) {
  const response = await DOMAdapter.get().fetch(url);
  const svgSource = await response.text();
  const context = new GraphicsContext();
  context.svg(svgSource);
  return context;
}

export { loadSvg };
//# sourceMappingURL=loadSVG.mjs.map
