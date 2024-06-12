'use strict';

var TexturePool = require('../../../rendering/renderers/shared/texture/TexturePool.js');
var types = require('../../../rendering/renderers/types.js');
var deprecation = require('../../../utils/logging/deprecation.js');
var Filter = require('../../Filter.js');
var BlurFilterPass = require('./BlurFilterPass.js');

"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
class BlurFilter extends Filter.Filter {
  constructor(...args) {
    var _a;
    let options = (_a = args[0]) != null ? _a : {};
    if (typeof options === "number") {
      deprecation.deprecation(deprecation.v8_0_0, "BlurFilter constructor params are now options object. See params: { strength, quality, resolution, kernelSize }");
      options = { strength: options };
      if (args[1])
        options.quality = args[1];
      if (args[2])
        options.resolution = args[2];
      if (args[3])
        options.kernelSize = args[3];
    }
    options = __spreadValues(__spreadValues({}, BlurFilterPass.BlurFilterPass.defaultOptions), options);
    const _b = options, { strength, quality } = _b, rest = __objRest(_b, ["strength", "quality"]);
    super(__spreadProps(__spreadValues({}, rest), {
      compatibleRenderers: types.RendererType.BOTH,
      resources: {}
    }));
    this._repeatEdgePixels = false;
    this.blurXFilter = new BlurFilterPass.BlurFilterPass(__spreadValues({ horizontal: false }, options));
    this.blurYFilter = new BlurFilterPass.BlurFilterPass(__spreadValues({ horizontal: true }, options));
    this.quality = quality;
    this.blur = strength;
    this.repeatEdgePixels = false;
  }
  /**
   * Applies the filter.
   * @param filterManager - The manager.
   * @param input - The input target.
   * @param output - The output target.
   * @param clearMode - How to clear
   */
  apply(filterManager, input, output, clearMode) {
    const xStrength = Math.abs(this.blurXFilter.strength);
    const yStrength = Math.abs(this.blurYFilter.strength);
    if (xStrength && yStrength) {
      const tempTexture = TexturePool.TexturePool.getSameSizeTexture(input);
      this.blurXFilter.apply(filterManager, input, tempTexture, true);
      this.blurYFilter.apply(filterManager, tempTexture, output, clearMode);
      TexturePool.TexturePool.returnTexture(tempTexture);
    } else if (yStrength) {
      this.blurYFilter.apply(filterManager, input, output, clearMode);
    } else {
      this.blurXFilter.apply(filterManager, input, output, clearMode);
    }
  }
  updatePadding() {
    if (this._repeatEdgePixels) {
      this.padding = 0;
    } else {
      this.padding = Math.max(Math.abs(this.blurXFilter.blur), Math.abs(this.blurYFilter.blur)) * 2;
    }
  }
  /**
   * Sets the strength of both the blurX and blurY properties simultaneously
   * @default 2
   */
  get blur() {
    return this.blurXFilter.blur;
  }
  set blur(value) {
    this.blurXFilter.blur = this.blurYFilter.blur = value;
    this.updatePadding();
  }
  /**
   * Sets the number of passes for blur. More passes means higher quality bluring.
   * @default 1
   */
  get quality() {
    return this.blurXFilter.quality;
  }
  set quality(value) {
    this.blurXFilter.quality = this.blurYFilter.quality = value;
  }
  /**
   * Sets the strength of the blurX property
   * @default 2
   */
  get blurX() {
    return this.blurXFilter.blur;
  }
  set blurX(value) {
    this.blurXFilter.blur = value;
    this.updatePadding();
  }
  /**
   * Sets the strength of the blurY property
   * @default 2
   */
  get blurY() {
    return this.blurYFilter.blur;
  }
  set blurY(value) {
    this.blurYFilter.blur = value;
    this.updatePadding();
  }
  /**
   * Sets the blendmode of the filter
   * @default "normal"
   */
  get blendMode() {
    return this.blurYFilter.blendMode;
  }
  set blendMode(value) {
    this.blurYFilter.blendMode = value;
  }
  /**
   * If set to true the edge of the target will be clamped
   * @default false
   */
  get repeatEdgePixels() {
    return this._repeatEdgePixels;
  }
  set repeatEdgePixels(value) {
    this._repeatEdgePixels = value;
    this.updatePadding();
  }
}
/** Default blur filter options */
BlurFilter.defaultOptions = {
  /** The strength of the blur filter. */
  strength: 8,
  /** The quality of the blur filter. */
  quality: 4,
  /** The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15. */
  kernelSize: 5
};

exports.BlurFilter = BlurFilter;
//# sourceMappingURL=BlurFilter.js.map
