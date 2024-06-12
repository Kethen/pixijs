import { GlProgram } from '../../rendering/renderers/gl/shader/GlProgram.mjs';
import { GpuProgram } from '../../rendering/renderers/gpu/shader/GpuProgram.mjs';
import { UniformGroup } from '../../rendering/renderers/shared/shader/UniformGroup.mjs';
import { Texture } from '../../rendering/renderers/shared/texture/Texture.mjs';
import { Filter } from '../Filter.mjs';
import blendTemplateFrag from './blend-template.frag.mjs';
import blendTemplateVert from './blend-template.vert.mjs';
import blendTemplate from './blend-template.wgsl.mjs';

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
class BlendModeFilter extends Filter {
  constructor(options) {
    const gpuOptions = options.gpu;
    const gpuSource = compileBlendModeShader(__spreadValues({ source: blendTemplate }, gpuOptions));
    const gpuProgram = GpuProgram.from({
      vertex: {
        source: gpuSource,
        entryPoint: "mainVertex"
      },
      fragment: {
        source: gpuSource,
        entryPoint: "mainFragment"
      }
    });
    const glOptions = options.gl;
    const glSource = compileBlendModeShader(__spreadValues({ source: blendTemplateFrag }, glOptions));
    const glProgram = GlProgram.from({
      vertex: blendTemplateVert,
      fragment: glSource
    });
    const uniformGroup = new UniformGroup({
      uBlend: {
        value: 1,
        type: "f32"
      }
    });
    super({
      gpuProgram,
      glProgram,
      blendRequired: true,
      resources: {
        blendUniforms: uniformGroup,
        uBackTexture: Texture.EMPTY
      }
    });
  }
}
function compileBlendModeShader(options) {
  const { source, functions, main } = options;
  return source.replace("{FUNCTIONS}", functions).replace("{MAIN}", main);
}

export { BlendModeFilter };
//# sourceMappingURL=BlendModeFilter.mjs.map
