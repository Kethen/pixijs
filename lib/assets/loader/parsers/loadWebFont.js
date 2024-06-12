'use strict';

var adapter = require('../../../environment/adapter.js');
var Extensions = require('../../../extensions/Extensions.js');
var warn = require('../../../utils/logging/warn.js');
var path = require('../../../utils/path.js');
var Cache = require('../../cache/Cache.js');
var checkDataUrl = require('../../utils/checkDataUrl.js');
var checkExtension = require('../../utils/checkExtension.js');
var LoaderParser = require('./LoaderParser.js');

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
const validWeights = [
  "normal",
  "bold",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900"
];
const validFontExtensions = [".ttf", ".otf", ".woff", ".woff2"];
const validFontMIMEs = [
  "font/ttf",
  "font/otf",
  "font/woff",
  "font/woff2"
];
const CSS_IDENT_TOKEN_REGEX = /^(--|-?[A-Z_])[0-9A-Z_-]*$/i;
function getFontFamilyName(url) {
  const ext = path.path.extname(url);
  const name = path.path.basename(url, ext);
  const nameWithSpaces = name.replace(/(-|_)/g, " ");
  const nameTokens = nameWithSpaces.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  let valid = nameTokens.length > 0;
  for (const token of nameTokens) {
    if (!token.match(CSS_IDENT_TOKEN_REGEX)) {
      valid = false;
      break;
    }
  }
  let fontFamilyName = nameTokens.join(" ");
  if (!valid) {
    fontFamilyName = `"${fontFamilyName.replace(/[\\"]/g, "\\$&")}"`;
  }
  return fontFamilyName;
}
const validURICharactersRegex = /^[0-9A-Za-z%:/?#\[\]@!\$&'()\*\+,;=\-._~]*$/;
function encodeURIWhenNeeded(uri) {
  if (validURICharactersRegex.test(uri)) {
    return uri;
  }
  return encodeURI(uri);
}
const loadWebFont = {
  extension: {
    type: Extensions.ExtensionType.LoadParser,
    priority: LoaderParser.LoaderParserPriority.Low
  },
  name: "loadWebFont",
  test(url) {
    return checkDataUrl.checkDataUrl(url, validFontMIMEs) || checkExtension.checkExtension(url, validFontExtensions);
  },
  async load(url, options) {
    var _a, _b, _c, _d, _e, _f;
    const fonts = adapter.DOMAdapter.get().getFontFaceSet();
    if (fonts) {
      const fontFaces = [];
      const name = (_b = (_a = options.data) == null ? void 0 : _a.family) != null ? _b : getFontFamilyName(url);
      const weights = (_e = (_d = (_c = options.data) == null ? void 0 : _c.weights) == null ? void 0 : _d.filter((weight) => validWeights.includes(weight))) != null ? _e : ["normal"];
      const data = (_f = options.data) != null ? _f : {};
      for (let i = 0; i < weights.length; i++) {
        const weight = weights[i];
        const font = new FontFace(name, `url(${encodeURIWhenNeeded(url)})`, __spreadProps(__spreadValues({}, data), {
          weight
        }));
        await font.load();
        fonts.add(font);
        fontFaces.push(font);
      }
      Cache.Cache.set(`${name}-and-url`, {
        url,
        fontFaces
      });
      return fontFaces.length === 1 ? fontFaces[0] : fontFaces;
    }
    warn.warn("[loadWebFont] FontFace API is not supported. Skipping loading font");
    return null;
  },
  unload(font) {
    (Array.isArray(font) ? font : [font]).forEach((t) => {
      Cache.Cache.remove(t.family);
      adapter.DOMAdapter.get().getFontFaceSet().delete(t);
    });
  }
};

exports.getFontFamilyName = getFontFamilyName;
exports.loadWebFont = loadWebFont;
//# sourceMappingURL=loadWebFont.js.map
