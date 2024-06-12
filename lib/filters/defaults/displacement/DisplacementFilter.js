'use strict';

var Matrix = require('../../../maths/matrix/Matrix.js');
var Point = require('../../../maths/point/Point.js');
var GlProgram = require('../../../rendering/renderers/gl/shader/GlProgram.js');
var GpuProgram = require('../../../rendering/renderers/gpu/shader/GpuProgram.js');
var UniformGroup = require('../../../rendering/renderers/shared/shader/UniformGroup.js');
var Sprite = require('../../../scene/sprite/Sprite.js');
var deprecation = require('../../../utils/logging/deprecation.js');
var Filter = require('../../Filter.js');
var displacement$1 = require('./displacement.frag.js');
var displacement = require('./displacement.vert.js');
var displacement$2 = require('./displacement.wgsl.js');

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
class DisplacementFilter extends Filter.Filter {
  constructor(...args) {
    let options = args[0];
    if (options instanceof Sprite.Sprite) {
      if (args[1]) {
        deprecation.deprecation(deprecation.v8_0_0, "DisplacementFilter now uses options object instead of params. {sprite, scale}");
      }
      options = { sprite: options, scale: args[1] };
    }
    const _a = options, { sprite, scale: scaleOption } = _a, rest = __objRest(_a, ["sprite", "scale"]);
    let scale = scaleOption != null ? scaleOption : 20;
    if (typeof scale === "number") {
      scale = new Point.Point(scale, scale);
    }
    const filterUniforms = new UniformGroup.UniformGroup({
      uFilterMatrix: { value: new Matrix.Matrix(), type: "mat3x3<f32>" },
      uScale: { value: scale, type: "vec2<f32>" },
      uRotation: { value: new Float32Array([0, 0, 0, 0]), type: "mat2x2<f32>" }
    });
    const glProgram = GlProgram.GlProgram.from({
      vertex: displacement.default,
      fragment: displacement$1.default,
      name: "displacement-filter"
    });
    const gpuProgram = GpuProgram.GpuProgram.from({
      vertex: {
        source: displacement$2.default,
        entryPoint: "mainVertex"
      },
      fragment: {
        source: displacement$2.default,
        entryPoint: "mainFragment"
      }
    });
    const textureSource = sprite.texture.source;
    super(__spreadProps(__spreadValues({}, rest), {
      gpuProgram,
      glProgram,
      resources: {
        filterUniforms,
        uMapTexture: textureSource,
        uMapSampler: textureSource.style
      }
    }));
    this._sprite = options.sprite;
    this._sprite.renderable = false;
  }
  /**
   * Applies the filter.
   * @param filterManager - The manager.
   * @param input - The input target.
   * @param output - The output target.
   * @param clearMode - clearMode.
   */
  apply(filterManager, input, output, clearMode) {
    const uniforms = this.resources.filterUniforms.uniforms;
    filterManager.calculateSpriteMatrix(
      uniforms.uFilterMatrix,
      this._sprite
    );
    const wt = this._sprite.worldTransform;
    const lenX = Math.sqrt(wt.a * wt.a + wt.b * wt.b);
    const lenY = Math.sqrt(wt.c * wt.c + wt.d * wt.d);
    if (lenX !== 0 && lenY !== 0) {
      uniforms.uRotation[0] = wt.a / lenX;
      uniforms.uRotation[1] = wt.b / lenX;
      uniforms.uRotation[2] = wt.c / lenY;
      uniforms.uRotation[3] = wt.d / lenY;
    }
    this.resources.uMapTexture = this._sprite.texture.source;
    filterManager.applyFilter(this, input, output, clearMode);
  }
  /** scaleX, scaleY for displacements */
  get scale() {
    return this.resources.filterUniforms.uniforms.uScale;
  }
}

exports.DisplacementFilter = DisplacementFilter;
//# sourceMappingURL=DisplacementFilter.js.map
