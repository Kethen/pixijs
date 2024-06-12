'use strict';

var Matrix = require('../../maths/matrix/Matrix.js');
var GlProgram = require('../../rendering/renderers/gl/shader/GlProgram.js');
var GpuProgram = require('../../rendering/renderers/gpu/shader/GpuProgram.js');
var UniformGroup = require('../../rendering/renderers/shared/shader/UniformGroup.js');
var TextureMatrix = require('../../rendering/renderers/shared/texture/TextureMatrix.js');
var Filter = require('../Filter.js');
var mask$2 = require('./mask.frag.js');
var mask$1 = require('./mask.vert.js');
var mask = require('./mask.wgsl.js');

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
var __objRest = (source2, exclude) => {
  var target = {};
  for (var prop in source2)
    if (__hasOwnProp.call(source2, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source2[prop];
  if (source2 != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source2)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source2, prop))
        target[prop] = source2[prop];
    }
  return target;
};
class MaskFilter extends Filter.Filter {
  constructor(options) {
    const _a = options, { sprite } = _a, rest = __objRest(_a, ["sprite"]);
    const textureMatrix = new TextureMatrix.TextureMatrix(sprite.texture);
    const filterUniforms = new UniformGroup.UniformGroup({
      uFilterMatrix: { value: new Matrix.Matrix(), type: "mat3x3<f32>" },
      uMaskClamp: { value: textureMatrix.uClampFrame, type: "vec4<f32>" },
      uAlpha: { value: 1, type: "f32" }
    });
    const gpuProgram = GpuProgram.GpuProgram.from({
      vertex: {
        source: mask.default,
        entryPoint: "mainVertex"
      },
      fragment: {
        source: mask.default,
        entryPoint: "mainFragment"
      }
    });
    const glProgram = GlProgram.GlProgram.from({
      vertex: mask$1.default,
      fragment: mask$2.default,
      name: "mask-filter"
    });
    super(__spreadProps(__spreadValues({}, rest), {
      gpuProgram,
      glProgram,
      resources: {
        filterUniforms,
        uMaskTexture: sprite.texture.source
      }
    }));
    this.sprite = sprite;
    this._textureMatrix = textureMatrix;
  }
  apply(filterManager, input, output, clearMode) {
    this._textureMatrix.texture = this.sprite.texture;
    filterManager.calculateSpriteMatrix(
      this.resources.filterUniforms.uniforms.uFilterMatrix,
      this.sprite
    ).prepend(this._textureMatrix.mapCoord);
    this.resources.uMaskTexture = this.sprite.texture.source;
    filterManager.applyFilter(this, input, output, clearMode);
  }
}

exports.MaskFilter = MaskFilter;
//# sourceMappingURL=MaskFilter.js.map
