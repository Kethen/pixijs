'use strict';

var Cache = require('../../assets/cache/Cache.js');
var deprecation = require('../../utils/logging/deprecation.js');
var TextStyle = require('../text/TextStyle.js');
var DynamicBitmapFont = require('./DynamicBitmapFont.js');
var getBitmapTextLayout = require('./utils/getBitmapTextLayout.js');
var resolveCharacters = require('./utils/resolveCharacters.js');

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
class BitmapFontManagerClass {
  constructor() {
    /**
     * This character set includes all the letters in the alphabet (both lower- and upper- case).
     * @type {string[][]}
     * @example
     * BitmapFont.from('ExampleFont', style, { chars: BitmapFont.ALPHA })
     */
    this.ALPHA = [["a", "z"], ["A", "Z"], " "];
    /**
     * This character set includes all decimal digits (from 0 to 9).
     * @type {string[][]}
     * @example
     * BitmapFont.from('ExampleFont', style, { chars: BitmapFont.NUMERIC })
     */
    this.NUMERIC = [["0", "9"]];
    /**
     * This character set is the union of `BitmapFont.ALPHA` and `BitmapFont.NUMERIC`.
     * @type {string[][]}
     */
    this.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "];
    /**
     * This character set consists of all the ASCII table.
     * @member {string[][]}
     * @see http://www.asciitable.com/
     */
    this.ASCII = [[" ", "~"]];
    /** Default options for installing a new BitmapFont. */
    this.defaultOptions = {
      chars: this.ALPHANUMERIC,
      resolution: 1,
      padding: 4,
      skipKerning: false
    };
  }
  /**
   * Get a font for the specified text and style.
   * @param text - The text to get the font for
   * @param style - The style to use
   */
  getFont(text, style) {
    var _a;
    let fontFamilyKey = `${style.fontFamily}-bitmap`;
    let overrideFill = true;
    if (style._fill.fill) {
      fontFamilyKey += style._fill.fill.uid;
      overrideFill = false;
    }
    if (!Cache.Cache.has(fontFamilyKey)) {
      const fnt = new DynamicBitmapFont.DynamicBitmapFont(__spreadValues({
        style,
        overrideFill,
        overrideSize: true
      }, this.defaultOptions));
      fnt.once("destroy", () => Cache.Cache.remove(fontFamilyKey));
      Cache.Cache.set(
        fontFamilyKey,
        fnt
      );
    }
    const dynamicFont = Cache.Cache.get(fontFamilyKey);
    (_a = dynamicFont.ensureCharacters) == null ? void 0 : _a.call(dynamicFont, text);
    return dynamicFont;
  }
  /**
   * Get the layout of a text for the specified style.
   * @param text - The text to get the layout for
   * @param style - The style to use
   */
  getLayout(text, style) {
    const bitmapFont = this.getFont(text, style);
    return getBitmapTextLayout.getBitmapTextLayout([...text], style, bitmapFont);
  }
  /**
   * Measure the text using the specified style.
   * @param text - The text to measure
   * @param style - The style to use
   */
  measureText(text, style) {
    return this.getLayout(text, style);
  }
  // eslint-disable-next-line max-len
  install(...args) {
    var _a, _b, _c, _d;
    let options = args[0];
    if (typeof options === "string") {
      options = {
        name: options,
        style: args[1],
        chars: (_a = args[2]) == null ? void 0 : _a.chars,
        resolution: (_b = args[2]) == null ? void 0 : _b.resolution,
        padding: (_c = args[2]) == null ? void 0 : _c.padding,
        skipKerning: (_d = args[2]) == null ? void 0 : _d.skipKerning
      };
      deprecation.deprecation(deprecation.v8_0_0, "BitmapFontManager.install(name, style, options) is deprecated, use BitmapFontManager.install({name, style, ...options})");
    }
    const name = options == null ? void 0 : options.name;
    if (!name) {
      throw new Error("[BitmapFontManager] Property `name` is required.");
    }
    options = __spreadValues(__spreadValues({}, this.defaultOptions), options);
    const textStyle = options.style;
    const style = textStyle instanceof TextStyle.TextStyle ? textStyle : new TextStyle.TextStyle(textStyle);
    const overrideFill = style._fill.fill !== null && style._fill.fill !== void 0;
    const font = new DynamicBitmapFont.DynamicBitmapFont({
      style,
      overrideFill,
      skipKerning: options.skipKerning,
      padding: options.padding,
      resolution: options.resolution,
      overrideSize: false
    });
    const flatChars = resolveCharacters.resolveCharacters(options.chars);
    font.ensureCharacters(flatChars.join(""));
    Cache.Cache.set(`${name}-bitmap`, font);
    font.once("destroy", () => Cache.Cache.remove(`${name}-bitmap`));
    return font;
  }
  /**
   * Uninstalls a bitmap font from the cache.
   * @param {string} name - The name of the bitmap font to uninstall.
   */
  uninstall(name) {
    const cacheKey = `${name}-bitmap`;
    const font = Cache.Cache.get(cacheKey);
    if (font) {
      Cache.Cache.remove(cacheKey);
      font.destroy();
    }
  }
}
const BitmapFontManager = new BitmapFontManagerClass();

exports.BitmapFontManager = BitmapFontManager;
//# sourceMappingURL=BitmapFontManager.js.map
