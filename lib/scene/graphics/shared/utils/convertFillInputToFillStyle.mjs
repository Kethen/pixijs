import { Color } from '../../../../color/Color.mjs';
import { Matrix } from '../../../../maths/matrix/Matrix.mjs';
import { Texture } from '../../../../rendering/renderers/shared/texture/Texture.mjs';
import { FillGradient } from '../fill/FillGradient.mjs';
import { FillPattern } from '../fill/FillPattern.mjs';

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
function isColorLike(value) {
  return Color.isColorLike(value);
}
function isFillPattern(value) {
  return value instanceof FillPattern;
}
function isFillGradient(value) {
  return value instanceof FillGradient;
}
function handleColorLike(fill, value, defaultStyle) {
  const temp = Color.shared.setValue(value != null ? value : 0);
  fill.color = temp.toNumber();
  fill.alpha = temp.alpha === 1 ? defaultStyle.alpha : temp.alpha;
  fill.texture = Texture.WHITE;
  return __spreadValues(__spreadValues({}, defaultStyle), fill);
}
function handleFillPattern(fill, value, defaultStyle) {
  fill.fill = value;
  fill.color = 16777215;
  fill.texture = value.texture;
  fill.matrix = value.transform;
  return __spreadValues(__spreadValues({}, defaultStyle), fill);
}
function handleFillGradient(fill, value, defaultStyle) {
  value.buildLinearGradient();
  fill.fill = value;
  fill.color = 16777215;
  fill.texture = value.texture;
  fill.matrix = value.transform;
  return __spreadValues(__spreadValues({}, defaultStyle), fill);
}
function handleFillObject(value, defaultStyle) {
  var _a;
  const style = __spreadValues(__spreadValues({}, defaultStyle), value);
  if (style.texture) {
    if (style.texture !== Texture.WHITE) {
      const m = ((_a = style.matrix) == null ? void 0 : _a.invert()) || new Matrix();
      m.scale(1 / style.texture.frame.width, 1 / style.texture.frame.height);
      style.matrix = m;
    }
    const sourceStyle = style.texture.source.style;
    if (sourceStyle.addressMode === "clamp-to-edge") {
      sourceStyle.addressMode = "repeat";
    }
  }
  const color = Color.shared.setValue(style.color);
  style.alpha *= color.alpha;
  style.color = color.toNumber();
  style.matrix = style.matrix ? style.matrix.clone() : null;
  return style;
}
function toFillStyle(value, defaultStyle) {
  if (value === void 0 || value === null) {
    return null;
  }
  const fill = {};
  const objectStyle = value;
  if (isColorLike(value)) {
    return handleColorLike(fill, value, defaultStyle);
  } else if (isFillPattern(value)) {
    return handleFillPattern(fill, value, defaultStyle);
  } else if (isFillGradient(value)) {
    return handleFillGradient(fill, value, defaultStyle);
  } else if (objectStyle.fill && isFillPattern(objectStyle.fill)) {
    return handleFillPattern(objectStyle, objectStyle.fill, defaultStyle);
  } else if (objectStyle.fill && isFillGradient(objectStyle.fill)) {
    return handleFillGradient(objectStyle, objectStyle.fill, defaultStyle);
  }
  return handleFillObject(objectStyle, defaultStyle);
}
function toStrokeStyle(value, defaultStyle) {
  const _a = defaultStyle, { width, alignment, miterLimit, cap, join } = _a, rest = __objRest(_a, ["width", "alignment", "miterLimit", "cap", "join"]);
  const fill = toFillStyle(value, rest);
  if (!fill) {
    return null;
  }
  return __spreadValues({
    width,
    alignment,
    miterLimit,
    cap,
    join
  }, fill);
}

export { toFillStyle, toStrokeStyle };
//# sourceMappingURL=convertFillInputToFillStyle.mjs.map
