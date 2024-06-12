'use strict';

var adapter = require('../../../../environment/adapter.js');
var Extensions = require('../../../../extensions/Extensions.js');
var ImageSource = require('../../../../rendering/renderers/shared/texture/sources/ImageSource.js');
var getResolutionOfUrl = require('../../../../utils/network/getResolutionOfUrl.js');
var checkDataUrl = require('../../../utils/checkDataUrl.js');
var checkExtension = require('../../../utils/checkExtension.js');
var WorkerManager = require('../../workers/WorkerManager.js');
var LoaderParser = require('../LoaderParser.js');
var createTexture = require('./utils/createTexture.js');

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
const validImageExtensions = [".jpeg", ".jpg", ".png", ".webp", ".avif"];
const validImageMIMEs = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
];
async function loadImageBitmap(url) {
  const response = await adapter.DOMAdapter.get().fetch(url);
  if (!response.ok) {
    throw new Error(`[loadImageBitmap] Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  const imageBlob = await response.blob();
  const imageBitmap = await createImageBitmap(imageBlob);
  return imageBitmap;
}
const loadTextures = {
  name: "loadTextures",
  extension: {
    type: Extensions.ExtensionType.LoadParser,
    priority: LoaderParser.LoaderParserPriority.High,
    name: "loadTextures"
  },
  config: {
    preferWorkers: true,
    preferCreateImageBitmap: true,
    crossOrigin: "anonymous"
  },
  test(url) {
    return checkDataUrl.checkDataUrl(url, validImageMIMEs) || checkExtension.checkExtension(url, validImageExtensions);
  },
  async load(url, asset, loader) {
    var _a;
    let src = null;
    if (globalThis.createImageBitmap && this.config.preferCreateImageBitmap) {
      if (this.config.preferWorkers && await WorkerManager.WorkerManager.isImageBitmapSupported()) {
        src = await WorkerManager.WorkerManager.loadImageBitmap(url);
      } else {
        src = await loadImageBitmap(url);
      }
    } else {
      src = await new Promise((resolve) => {
        src = new Image();
        src.crossOrigin = this.config.crossOrigin;
        src.src = url;
        if (src.complete) {
          resolve(src);
        } else {
          src.onload = () => {
            resolve(src);
          };
        }
      });
    }
    const base = new ImageSource.ImageSource(__spreadValues({
      resource: src,
      alphaMode: "premultiply-alpha-on-upload",
      resolution: ((_a = asset.data) == null ? void 0 : _a.resolution) || getResolutionOfUrl.getResolutionOfUrl(url)
    }, asset.data));
    return createTexture.createTexture(base, loader, url);
  },
  unload(texture) {
    texture.destroy(true);
  }
};

exports.loadImageBitmap = loadImageBitmap;
exports.loadTextures = loadTextures;
//# sourceMappingURL=loadTextures.js.map
