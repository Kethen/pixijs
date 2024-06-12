'use strict';

var GlProgram = require('../../../rendering/renderers/gl/shader/GlProgram.js');
var GpuProgram = require('../../../rendering/renderers/gpu/shader/GpuProgram.js');
var UniformGroup = require('../../../rendering/renderers/shared/shader/UniformGroup.js');
var Filter = require('../../Filter.js');
var defaultFilter = require('../defaultFilter.vert.js');
var alpha$1 = require('./alpha.frag.js');
var alpha = require('./alpha.wgsl.js');

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
const _AlphaFilter = class _AlphaFilter extends Filter.Filter {
  constructor(options) {
    options = __spreadValues(__spreadValues({}, _AlphaFilter.defaultOptions), options);
    const gpuProgram = GpuProgram.GpuProgram.from({
      vertex: {
        source: alpha.default,
        entryPoint: "mainVertex"
      },
      fragment: {
        source: alpha.default,
        entryPoint: "mainFragment"
      }
    });
    const glProgram = GlProgram.GlProgram.from({
      vertex: defaultFilter.default,
      fragment: alpha$1.default,
      name: "alpha-filter"
    });
    const _a = options, { alpha: alpha$2 } = _a, rest = __objRest(_a, ["alpha"]);
    const alphaUniforms = new UniformGroup.UniformGroup({
      uAlpha: { value: alpha$2, type: "f32" }
    });
    super(__spreadProps(__spreadValues({}, rest), {
      gpuProgram,
      glProgram,
      resources: {
        alphaUniforms
      }
    }));
  }
  /**
   * Coefficient for alpha multiplication
   * @default 1
   */
  get alpha() {
    return this.resources.alphaUniforms.uniforms.uAlpha;
  }
  set alpha(value) {
    this.resources.alphaUniforms.uniforms.uAlpha = value;
  }
};
/** Default filter options */
_AlphaFilter.defaultOptions = {
  /** Amount of alpha from 0 to 1, where 0 is transparent */
  alpha: 1
};
let AlphaFilter = _AlphaFilter;

exports.AlphaFilter = AlphaFilter;
//# sourceMappingURL=AlphaFilter.js.map
