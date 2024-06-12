'use strict';

var Texture = require('../../rendering/renderers/shared/texture/Texture.js');
var deprecation = require('../../utils/logging/deprecation.js');
var Container = require('../container/Container.js');
var NineSliceGeometry = require('./NineSliceGeometry.js');

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
const _NineSliceSprite = class _NineSliceSprite extends Container.Container {
  /**
   * @param {scene.NineSliceSpriteOptions|Texture} options - Options to use
   * @param options.texture - The texture to use on the NineSliceSprite.
   * @param options.leftWidth - Width of the left vertical bar (A)
   * @param options.topHeight - Height of the top horizontal bar (C)
   * @param options.rightWidth - Width of the right vertical bar (B)
   * @param options.bottomHeight - Height of the bottom horizontal bar (D)
   * @param options.width - Width of the NineSliceSprite,
   * setting this will actually modify the vertices and not the UV's of this plane.
   * @param options.height - Height of the NineSliceSprite,
   * setting this will actually modify the vertices and not UV's of this plane.
   */
  constructor(options) {
    var _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    if (options instanceof Texture.Texture) {
      options = { texture: options };
    }
    const _a = options, {
      width,
      height,
      leftWidth,
      rightWidth,
      topHeight,
      bottomHeight,
      texture,
      roundPixels
    } = _a, rest = __objRest(_a, [
      "width",
      "height",
      "leftWidth",
      "rightWidth",
      "topHeight",
      "bottomHeight",
      "texture",
      "roundPixels"
    ]);
    super(__spreadValues({
      label: "NineSliceSprite"
    }, rest));
    this._roundPixels = 0;
    this.renderPipeId = "nineSliceSprite";
    this.batched = true;
    this._didSpriteUpdate = true;
    this.bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    this._leftWidth = (_c = leftWidth != null ? leftWidth : (_b = texture == null ? void 0 : texture.defaultBorders) == null ? void 0 : _b.left) != null ? _c : NineSliceGeometry.NineSliceGeometry.defaultOptions.leftWidth;
    this._topHeight = (_e = topHeight != null ? topHeight : (_d = texture == null ? void 0 : texture.defaultBorders) == null ? void 0 : _d.top) != null ? _e : NineSliceGeometry.NineSliceGeometry.defaultOptions.topHeight;
    this._rightWidth = (_g = rightWidth != null ? rightWidth : (_f = texture == null ? void 0 : texture.defaultBorders) == null ? void 0 : _f.right) != null ? _g : NineSliceGeometry.NineSliceGeometry.defaultOptions.rightWidth;
    this._bottomHeight = (_i = bottomHeight != null ? bottomHeight : (_h = texture == null ? void 0 : texture.defaultBorders) == null ? void 0 : _h.bottom) != null ? _i : NineSliceGeometry.NineSliceGeometry.defaultOptions.bottomHeight;
    this.bounds.maxX = this._width = (_j = width != null ? width : texture.width) != null ? _j : NineSliceGeometry.NineSliceGeometry.defaultOptions.width;
    this.bounds.maxY = this._height = (_k = height != null ? height : texture.height) != null ? _k : NineSliceGeometry.NineSliceGeometry.defaultOptions.height;
    this.allowChildren = false;
    this.texture = texture != null ? texture : _NineSliceSprite.defaultOptions.texture;
    this.roundPixels = roundPixels != null ? roundPixels : false;
  }
  /** The width of the NineSliceSprite, setting this will actually modify the vertices and UV's of this plane. */
  get width() {
    return this._width;
  }
  set width(value) {
    this.bounds.maxX = this._width = value;
    this.onViewUpdate();
  }
  /** The height of the NineSliceSprite, setting this will actually modify the vertices and UV's of this plane. */
  get height() {
    return this._height;
  }
  set height(value) {
    this.bounds.maxY = this._height = value;
    this.onViewUpdate();
  }
  /** The width of the left column (a) of the NineSliceSprite. */
  get leftWidth() {
    return this._leftWidth;
  }
  set leftWidth(value) {
    this._leftWidth = value;
    this.onViewUpdate();
  }
  /** The width of the right column (b) of the NineSliceSprite. */
  get topHeight() {
    return this._topHeight;
  }
  set topHeight(value) {
    this._topHeight = value;
    this.onViewUpdate();
  }
  /** The width of the right column (b) of the NineSliceSprite. */
  get rightWidth() {
    return this._rightWidth;
  }
  set rightWidth(value) {
    this._rightWidth = value;
    this.onViewUpdate();
  }
  /** The width of the right column (b) of the NineSliceSprite. */
  get bottomHeight() {
    return this._bottomHeight;
  }
  set bottomHeight(value) {
    this._bottomHeight = value;
    this.onViewUpdate();
  }
  /** The texture that the NineSliceSprite is using. */
  get texture() {
    return this._texture;
  }
  set texture(value) {
    value || (value = Texture.Texture.EMPTY);
    const currentTexture = this._texture;
    if (currentTexture === value)
      return;
    if (currentTexture && currentTexture.dynamic)
      currentTexture.off("update", this.onViewUpdate, this);
    if (value.dynamic)
      value.on("update", this.onViewUpdate, this);
    this._texture = value;
    this.onViewUpdate();
  }
  /**
   *  Whether or not to round the x/y position of the sprite.
   * @type {boolean}
   */
  get roundPixels() {
    return !!this._roundPixels;
  }
  set roundPixels(value) {
    this._roundPixels = value ? 1 : 0;
  }
  /** The original width of the texture */
  get originalWidth() {
    return this._texture.width;
  }
  /** The original height of the texture */
  get originalHeight() {
    return this._texture.height;
  }
  onViewUpdate() {
    this._didChangeId += 1 << 12;
    this._didSpriteUpdate = true;
    if (this.didViewUpdate)
      return;
    this.didViewUpdate = true;
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    if (renderGroup) {
      renderGroup.onChildViewUpdate(this);
    }
  }
  /**
   * Adds the bounds of this object to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(bounds) {
    const _bounds = this.bounds;
    bounds.addFrame(_bounds.minX, _bounds.minY, _bounds.maxX, _bounds.maxY);
  }
  /**
   * Checks if the object contains the given point.
   * @param point - The point to check
   */
  containsPoint(point) {
    const bounds = this.bounds;
    if (point.x >= bounds.minX && point.x <= bounds.maxX) {
      if (point.y >= bounds.minY && point.y <= bounds.maxY) {
        return true;
      }
    }
    return false;
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
   */
  destroy(options) {
    super.destroy(options);
    const destroyTexture = typeof options === "boolean" ? options : options == null ? void 0 : options.texture;
    if (destroyTexture) {
      const destroyTextureSource = typeof options === "boolean" ? options : options == null ? void 0 : options.textureSource;
      this._texture.destroy(destroyTextureSource);
    }
    this._texture = null;
    this.bounds = null;
  }
};
/** The default options, used to override the initial values of any options passed in the constructor. */
_NineSliceSprite.defaultOptions = {
  /** @default Texture.EMPTY */
  texture: Texture.Texture.EMPTY
};
let NineSliceSprite = _NineSliceSprite;
class NineSlicePlane extends NineSliceSprite {
  constructor(...args) {
    let options = args[0];
    if (options instanceof Texture.Texture) {
      deprecation.deprecation(deprecation.v8_0_0, "NineSlicePlane now uses the options object {texture, leftWidth, rightWidth, topHeight, bottomHeight}");
      options = {
        texture: options,
        leftWidth: args[1],
        topHeight: args[2],
        rightWidth: args[3],
        bottomHeight: args[4]
      };
    }
    deprecation.deprecation(deprecation.v8_0_0, "NineSlicePlane is deprecated. Use NineSliceSprite instead.");
    super(options);
  }
}

exports.NineSlicePlane = NineSlicePlane;
exports.NineSliceSprite = NineSliceSprite;
//# sourceMappingURL=NineSliceSprite.js.map
