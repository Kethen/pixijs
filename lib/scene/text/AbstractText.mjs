import { ObservablePoint } from '../../maths/point/ObservablePoint.mjs';
import { deprecation, v8_0_0 } from '../../utils/logging/deprecation.mjs';
import { Bounds } from '../container/bounds/Bounds.mjs';
import { Container } from '../container/Container.mjs';

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
class AbstractText extends Container {
  constructor(options, styleClass) {
    const _a = options, { text, resolution, style, anchor, width, height, roundPixels } = _a, rest = __objRest(_a, ["text", "resolution", "style", "anchor", "width", "height", "roundPixels"]);
    super(__spreadValues({}, rest));
    this.batched = true;
    this._resolution = null;
    this._didTextUpdate = true;
    this._roundPixels = 0;
    this._bounds = new Bounds();
    this._boundsDirty = true;
    this._styleClass = styleClass;
    this.text = text != null ? text : "";
    this.style = style;
    this.resolution = resolution != null ? resolution : null;
    this.allowChildren = false;
    this._anchor = new ObservablePoint(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    );
    if (anchor)
      this.anchor = anchor;
    this.roundPixels = roundPixels != null ? roundPixels : false;
    if (width)
      this.width = width;
    if (height)
      this.height = height;
  }
  /**
   * The anchor sets the origin point of the text.
   * The default is `(0,0)`, this means the text's origin is the top left.
   *
   * Setting the anchor to `(0.5,0.5)` means the text's origin is centered.
   *
   * Setting the anchor to `(1,1)` would mean the text's origin point will be the bottom right corner.
   *
   * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
   * @example
   * import { Text } from 'pixi.js';
   *
   * const text = new Text('hello world');
   * text.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(value) {
    typeof value === "number" ? this._anchor.set(value) : this._anchor.copyFrom(value);
  }
  /**
   *  Whether or not to round the x/y position of the text.
   * @type {boolean}
   */
  get roundPixels() {
    return !!this._roundPixels;
  }
  set roundPixels(value) {
    this._roundPixels = value ? 1 : 0;
  }
  /** Set the copy for the text object. To split a line you can use '\n'. */
  set text(value) {
    value = value.toString();
    if (this._text === value)
      return;
    this._text = value;
    this.onViewUpdate();
  }
  get text() {
    return this._text;
  }
  /**
   * The resolution / device pixel ratio of the canvas.
   * @default 1
   */
  set resolution(value) {
    this._resolution = value;
    this.onViewUpdate();
  }
  get resolution() {
    return this._resolution;
  }
  get style() {
    return this._style;
  }
  /**
   * Set the style of the text.
   *
   * Set up an event listener to listen for changes on the style object and mark the text as dirty.
   *
   * If setting the `style` can also be partial {@link AnyTextStyleOptions}.
   * @type {
   * text.TextStyle |
   * Partial<text.TextStyle> |
   * text.TextStyleOptions |
   * text.HTMLTextStyle |
   * Partial<text.HTMLTextStyle> |
   * text.HTMLTextStyleOptions
   * }
   */
  set style(style) {
    var _a;
    style = style || {};
    (_a = this._style) == null ? void 0 : _a.off("update", this.onViewUpdate, this);
    if (style instanceof this._styleClass) {
      this._style = style;
    } else {
      this._style = new this._styleClass(style);
    }
    this._style.on("update", this.onViewUpdate, this);
    this.onViewUpdate();
  }
  /**
   * The local bounds of the Text.
   * @type {rendering.Bounds}
   */
  get bounds() {
    if (this._boundsDirty) {
      this._updateBounds();
      this._boundsDirty = false;
    }
    return this._bounds;
  }
  /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return Math.abs(this.scale.x) * this.bounds.width;
  }
  set width(value) {
    this._setWidth(value, this.bounds.width);
  }
  /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return Math.abs(this.scale.y) * this.bounds.height;
  }
  set height(value) {
    this._setHeight(value, this.bounds.height);
  }
  /**
   * Retrieves the size of the Text as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the Text.
   */
  getSize(out) {
    if (!out) {
      out = {};
    }
    out.width = Math.abs(this.scale.x) * this.bounds.width;
    out.height = Math.abs(this.scale.y) * this.bounds.height;
    return out;
  }
  /**
   * Sets the size of the Text to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(value, height) {
    var _a;
    let convertedWidth;
    let convertedHeight;
    if (typeof value !== "object") {
      convertedWidth = value;
      convertedHeight = height != null ? height : value;
    } else {
      convertedWidth = value.width;
      convertedHeight = (_a = value.height) != null ? _a : value.width;
    }
    if (convertedWidth !== void 0) {
      this._setWidth(convertedWidth, this.bounds.width);
    }
    if (convertedHeight !== void 0) {
      this._setHeight(convertedHeight, this.bounds.height);
    }
  }
  /**
   * Adds the bounds of this text to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(bounds) {
    const _bounds = this.bounds;
    bounds.addFrame(
      _bounds.minX,
      _bounds.minY,
      _bounds.maxX,
      _bounds.maxY
    );
  }
  /**
   * Checks if the text contains the given point.
   * @param point - The point to check
   */
  containsPoint(point) {
    const width = this.bounds.width;
    const height = this.bounds.height;
    const x1 = -width * this.anchor.x;
    let y1 = 0;
    if (point.x >= x1 && point.x <= x1 + width) {
      y1 = -height * this.anchor.y;
      if (point.y >= y1 && point.y <= y1 + height)
        return true;
    }
    return false;
  }
  onViewUpdate() {
    this._didChangeId += 1 << 12;
    this._boundsDirty = true;
    if (this.didViewUpdate)
      return;
    this.didViewUpdate = true;
    this._didTextUpdate = true;
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    if (renderGroup) {
      renderGroup.onChildViewUpdate(this);
    }
  }
  _getKey() {
    return `${this.text}:${this._style.styleKey}-${this.resolution}`;
  }
  /**
   * Destroys this text renderable and optionally its style texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the texture of the text style
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the text style
   * @param {boolean} [options.style=false] - Should it destroy the style of the text
   */
  destroy(options = false) {
    super.destroy(options);
    this.owner = null;
    this._bounds = null;
    this._anchor = null;
    if (typeof options === "boolean" ? options : options == null ? void 0 : options.style) {
      this._style.destroy(options);
    }
    this._style = null;
    this._text = null;
  }
}
function ensureOptions(args, name) {
  var _a;
  let options = (_a = args[0]) != null ? _a : {};
  if (typeof options === "string" || args[1]) {
    deprecation(v8_0_0, `use new ${name}({ text: "hi!", style }) instead`);
    options = {
      text: options,
      style: args[1]
    };
  }
  return options;
}

export { AbstractText, ensureOptions };
//# sourceMappingURL=AbstractText.mjs.map
