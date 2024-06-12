import { definedProps } from '../container/utils/definedProps.mjs';
import { Mesh } from '../mesh/shared/Mesh.mjs';
import { PlaneGeometry } from './PlaneGeometry.mjs';

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
class MeshPlane extends Mesh {
  /**
   * @param options - Options to be applied to MeshPlane
   */
  constructor(options) {
    const _a = options, { texture, verticesX, verticesY } = _a, rest = __objRest(_a, ["texture", "verticesX", "verticesY"]);
    const planeGeometry = new PlaneGeometry(definedProps({
      width: texture.width,
      height: texture.height,
      verticesX,
      verticesY
    }));
    super(definedProps(__spreadProps(__spreadValues({}, rest), { geometry: planeGeometry, texture })));
    this.texture = texture;
    this.autoResize = true;
  }
  /**
   * Method used for overrides, to do something in case texture frame was changed.
   * Meshes based on plane can override it and change more details based on texture.
   */
  textureUpdated() {
    const geometry = this.geometry;
    const { width, height } = this.texture;
    if (this.autoResize && (geometry.width !== width || geometry.height !== height)) {
      geometry.width = width;
      geometry.height = height;
      geometry.build({});
    }
  }
  set texture(value) {
    var _a;
    (_a = this._texture) == null ? void 0 : _a.off("update", this.textureUpdated, this);
    super.texture = value;
    value.on("update", this.textureUpdated, this);
    this.textureUpdated();
  }
  /** The texture of the MeshPlane */
  get texture() {
    return this._texture;
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
   */
  destroy(options) {
    this.texture.off("update", this.textureUpdated, this);
    super.destroy(options);
  }
}

export { MeshPlane };
//# sourceMappingURL=MeshPlane.mjs.map
