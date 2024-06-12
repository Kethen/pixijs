import { GlProgram } from '../renderers/gl/shader/GlProgram.mjs';
import { GpuProgram } from '../renderers/gpu/shader/GpuProgram.mjs';
import { compileHighShader, compileHighShaderGl } from './compiler/compileHighShader.mjs';
import { fragmentGPUTemplate, vertexGPUTemplate, vertexGlTemplate, fragmentGlTemplate } from './defaultProgramTemplate.mjs';
import { globalUniformsBit, globalUniformsBitGl } from './shader-bits/globalUniformsBit.mjs';

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
  const source = compileHighShader({
    template: {
      fragment: fragmentGPUTemplate,
      vertex: vertexGPUTemplate
    },
    bits: [
      globalUniformsBit,
      ...bits
    ]
  });
  return GpuProgram.from({
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
  return new GlProgram(__spreadValues({
    name
  }, compileHighShaderGl({
    template: {
      vertex: vertexGlTemplate,
      fragment: fragmentGlTemplate
    },
    bits: [
      globalUniformsBitGl,
      ...bits
    ]
  })));
}

export { compileHighShaderGlProgram, compileHighShaderGpuProgram };
//# sourceMappingURL=compileHighShaderToProgram.mjs.map
