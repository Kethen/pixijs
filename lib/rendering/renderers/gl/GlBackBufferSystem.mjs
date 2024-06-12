import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { warn } from '../../../utils/logging/warn.mjs';
import { Geometry } from '../shared/geometry/Geometry.mjs';
import { Shader } from '../shared/shader/Shader.mjs';
import { State } from '../shared/state/State.mjs';
import { TextureSource } from '../shared/texture/sources/TextureSource.mjs';
import { Texture } from '../shared/texture/Texture.mjs';
import { GlProgram } from './shader/GlProgram.mjs';

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
const bigTriangleGeometry = new Geometry({
  attributes: {
    aPosition: [
      -1,
      -1,
      // Bottom left corner
      3,
      -1,
      // Bottom right corner, extending beyond right edge
      -1,
      3
      // Top left corner, extending beyond top edge
    ]
  }
});
const _GlBackBufferSystem = class _GlBackBufferSystem {
  constructor(renderer) {
    /** if true, the back buffer is used */
    this.useBackBuffer = false;
    this._useBackBufferThisRender = false;
    this._renderer = renderer;
  }
  init(options = {}) {
    const { useBackBuffer, antialias } = __spreadValues(__spreadValues({}, _GlBackBufferSystem.defaultOptions), options);
    this.useBackBuffer = useBackBuffer;
    this._antialias = antialias;
    if (!this._renderer.context.supports.msaa) {
      warn("antialiasing, is not supported on when using the back buffer");
      this._antialias = false;
    }
    this._state = State.for2d();
    const bigTriangleProgram = new GlProgram({
      vertex: `
                attribute vec2 aPosition;
                out vec2 vUv;

                void main() {
                    gl_Position = vec4(aPosition, 0.0, 1.0);

                    vUv = (aPosition + 1.0) / 2.0;

                    // flip dem UVs
                    vUv.y = 1.0 - vUv.y;
                }`,
      fragment: `
                in vec2 vUv;
                out vec4 finalColor;

                uniform sampler2D uTexture;

                void main() {
                    finalColor = texture(uTexture, vUv);
                }`,
      name: "big-triangle"
    });
    this._bigTriangleShader = new Shader({
      glProgram: bigTriangleProgram,
      resources: {
        uTexture: Texture.WHITE.source
      }
    });
  }
  /**
   * This is called before the RenderTargetSystem is started. This is where
   * we replace the target with the back buffer if required.
   * @param options - The options for this render.
   */
  renderStart(options) {
    const renderTarget = this._renderer.renderTarget.getRenderTarget(options.target);
    this._useBackBufferThisRender = this.useBackBuffer && !!renderTarget.isRoot;
    if (this._useBackBufferThisRender) {
      const renderTarget2 = this._renderer.renderTarget.getRenderTarget(options.target);
      this._targetTexture = renderTarget2.colorTexture;
      options.target = this._getBackBufferTexture(renderTarget2.colorTexture);
    }
  }
  renderEnd() {
    this._presentBackBuffer();
  }
  _presentBackBuffer() {
    const renderer = this._renderer;
    renderer.renderTarget.finishRenderPass();
    if (!this._useBackBufferThisRender)
      return;
    renderer.renderTarget.bind(this._targetTexture, false);
    this._bigTriangleShader.resources.uTexture = this._backBufferTexture.source;
    renderer.encoder.draw({
      geometry: bigTriangleGeometry,
      shader: this._bigTriangleShader,
      state: this._state
    });
  }
  _getBackBufferTexture(targetSourceTexture) {
    this._backBufferTexture = this._backBufferTexture || new Texture({
      source: new TextureSource({
        width: targetSourceTexture.width,
        height: targetSourceTexture.height,
        resolution: targetSourceTexture._resolution,
        antialias: this._antialias
      })
    });
    this._backBufferTexture.source.resize(
      targetSourceTexture.width,
      targetSourceTexture.height,
      targetSourceTexture._resolution
    );
    return this._backBufferTexture;
  }
  /** destroys the back buffer */
  destroy() {
    if (this._backBufferTexture) {
      this._backBufferTexture.destroy();
      this._backBufferTexture = null;
    }
  }
};
/** @ignore */
_GlBackBufferSystem.extension = {
  type: [
    ExtensionType.WebGLSystem
  ],
  name: "backBuffer",
  priority: 1
};
/** default options for the back buffer system */
_GlBackBufferSystem.defaultOptions = {
  /** if true will use the back buffer where required */
  useBackBuffer: false
};
let GlBackBufferSystem = _GlBackBufferSystem;

export { GlBackBufferSystem };
//# sourceMappingURL=GlBackBufferSystem.mjs.map
