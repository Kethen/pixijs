import { TexturePool } from '../../../rendering/renderers/shared/texture/TexturePool.mjs';
import { RendererType } from '../../../rendering/renderers/types.mjs';
import { Filter } from '../../Filter.mjs';
import { generateBlurGlProgram } from './gl/generateBlurGlProgram.mjs';
import { generateBlurProgram } from './gpu/generateBlurProgram.mjs';

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
const _BlurFilterPass = class _BlurFilterPass extends Filter {
  /**
   * @param options
   * @param options.horizontal - Do pass along the x-axis (`true`) or y-axis (`false`).
   * @param options.strength - The strength of the blur filter.
   * @param options.quality - The quality of the blur filter.
   * @param options.kernelSize - The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
   */
  constructor(options) {
    options = __spreadValues(__spreadValues({}, _BlurFilterPass.defaultOptions), options);
    const glProgram = generateBlurGlProgram(options.horizontal, options.kernelSize);
    const gpuProgram = generateBlurProgram(options.horizontal, options.kernelSize);
    super(__spreadValues({
      glProgram,
      gpuProgram,
      resources: {
        blurUniforms: {
          uStrength: { value: 0, type: "f32" }
        }
      }
    }, options));
    this.horizontal = options.horizontal;
    this._quality = 0;
    this.quality = options.quality;
    this.blur = options.strength;
    this._uniforms = this.resources.blurUniforms.uniforms;
  }
  /**
   * Applies the filter.
   * @param filterManager - The manager.
   * @param input - The input target.
   * @param output - The output target.
   * @param clearMode - How to clear
   */
  apply(filterManager, input, output, clearMode) {
    this._uniforms.uStrength = this.strength / this.passes;
    if (this.passes === 1) {
      filterManager.applyFilter(this, input, output, clearMode);
    } else {
      const tempTexture = TexturePool.getSameSizeTexture(input);
      let flip = input;
      let flop = tempTexture;
      this._state.blend = false;
      for (let i = 0; i < this.passes - 1; i++) {
        filterManager.applyFilter(this, flip, flop, filterManager.renderer.type === RendererType.WEBGPU);
        const temp = flop;
        flop = flip;
        flip = temp;
      }
      this._state.blend = true;
      filterManager.applyFilter(this, flip, output, clearMode);
      TexturePool.returnTexture(tempTexture);
    }
  }
  /**
   * Sets the strength of both the blur.
   * @default 16
   */
  get blur() {
    return this.strength;
  }
  set blur(value) {
    this.padding = 1 + Math.abs(value) * 2;
    this.strength = value;
  }
  /**
   * Sets the quality of the blur by modifying the number of passes. More passes means higher
   * quality blurring but the lower the performance.
   * @default 4
   */
  get quality() {
    return this._quality;
  }
  set quality(value) {
    this._quality = value;
    this.passes = value;
  }
};
/** Default blur filter pass options */
_BlurFilterPass.defaultOptions = {
  /** The strength of the blur filter. */
  strength: 8,
  /** The quality of the blur filter. */
  quality: 4,
  /** The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15. */
  kernelSize: 5
};
let BlurFilterPass = _BlurFilterPass;

export { BlurFilterPass };
//# sourceMappingURL=BlurFilterPass.mjs.map
