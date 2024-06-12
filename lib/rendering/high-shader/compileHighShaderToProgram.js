'use strict';

var GlProgram = require('../renderers/gl/shader/GlProgram.js');
var GpuProgram = require('../renderers/gpu/shader/GpuProgram.js');
var compileHighShader = require('./compiler/compileHighShader.js');
var defaultProgramTemplate = require('./defaultProgramTemplate.js');
var globalUniformsBit = require('./shader-bits/globalUniformsBit.js');

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
function compileHighShaderGpuProgram({ bits, name }) {
  const source = compileHighShader.compileHighShader({
    template: {
      fragment: defaultProgramTemplate.fragmentGPUTemplate,
      vertex: defaultProgramTemplate.vertexGPUTemplate
    },
    bits: [
      globalUniformsBit.globalUniformsBit,
      ...bits
    ]
  });
  return GpuProgram.GpuProgram.from({
    name,
    vertex: {
      source: source.vertex,
      entryPoint: "main"
    },
    fragment: {
      source: source.fragment,
      entryPoint: "main"
    }
  });
}
function compileHighShaderGlProgram({ bits, name }) {
  return new GlProgram.GlProgram(__spreadValues({
    name
  }, compileHighShader.compileHighShaderGl({
    template: {
      vertex: defaultProgramTemplate.vertexGlTemplate,
      fragment: defaultProgramTemplate.fragmentGlTemplate
    },
    bits: [
      globalUniformsBit.globalUniformsBitGl,
      ...bits
    ]
  })));
}

exports.compileHighShaderGlProgram = compileHighShaderGlProgram;
exports.compileHighShaderGpuProgram = compileHighShaderGpuProgram;
//# sourceMappingURL=compileHighShaderToProgram.js.map
