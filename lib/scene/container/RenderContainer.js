'use strict';

var Bounds = require('./bounds/Bounds.js');
var Container = require('./Container.js');

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
class RenderContainer extends Container.Container {
  /**
   * @param options - The options for the container.
   */
  constructor(options) {
    var _b, _c;
    if (typeof options === "function") {
      options = { render: options };
    }
    const _a = options, { render } = _a, rest = __objRest(_a, ["render"]);
    super(__spreadValues({
      label: "RenderContainer"
    }, rest));
    this.batched = false;
    /**
     * The local bounds of the sprite.
     * @type {rendering.Bounds}
     */
    this.bounds = new Bounds.Bounds();
    this.canBundle = false;
    this.renderPipeId = "customRender";
    if (render)
      this.render = render;
    this.containsPoint = (_b = options.containsPoint) != null ? _b : () => false;
    this.addBounds = (_c = options.addBounds) != null ? _c : () => false;
  }
  /**
   * An overrideable function that can be used to render the object using the current renderer.
   * @param _renderer - The current renderer
   */
  render(_renderer) {
  }
}

exports.RenderContainer = RenderContainer;
//# sourceMappingURL=RenderContainer.js.map
