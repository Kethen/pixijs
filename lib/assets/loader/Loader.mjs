import { warn } from '../../utils/logging/warn.mjs';
import { path } from '../../utils/path.mjs';
import { convertToList } from '../utils/convertToList.mjs';
import { isSingleItem } from '../utils/isSingleItem.mjs';

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
class Loader {
  constructor() {
    this._parsers = [];
    this._parsersValidated = false;
    /**
     * All loader parsers registered
     * @type {assets.LoaderParser[]}
     */
    this.parsers = new Proxy(this._parsers, {
      set: (target, key, value) => {
        this._parsersValidated = false;
        target[key] = value;
        return true;
      }
    });
    /** Cache loading promises that ae currently active */
    this.promiseCache = {};
  }
  /** function used for testing */
  reset() {
    this._parsersValidated = false;
    this.promiseCache = {};
  }
  /**
   * Used internally to generate a promise for the asset to be loaded.
   * @param url - The URL to be loaded
   * @param data - any custom additional information relevant to the asset being loaded
   * @returns - a promise that will resolve to an Asset for example a Texture of a JSON object
   */
  _getLoadPromiseAndParser(url, data) {
    const result = {
      promise: null,
      parser: null
    };
    result.promise = (async () => {
      var _a, _b;
      let asset = null;
      let parser = null;
      if (data.loadParser) {
        parser = this._parserHash[data.loadParser];
        if (!parser) {
          warn(`[Assets] specified load parser "${data.loadParser}" not found while loading ${url}`);
        }
      }
      if (!parser) {
        for (let i = 0; i < this.parsers.length; i++) {
          const parserX = this.parsers[i];
          if (parserX.load && ((_a = parserX.test) == null ? void 0 : _a.call(parserX, url, data, this))) {
            parser = parserX;
            break;
          }
        }
        if (!parser) {
          warn(`[Assets] ${url} could not be loaded as we don't know how to parse it, ensure the correct parser has been added`);
          return null;
        }
      }
      asset = await parser.load(url, data, this);
      result.parser = parser;
      for (let i = 0; i < this.parsers.length; i++) {
        const parser2 = this.parsers[i];
        if (parser2.parse) {
          if (parser2.parse && await ((_b = parser2.testParse) == null ? void 0 : _b.call(parser2, asset, data, this))) {
            asset = await parser2.parse(asset, data, this) || asset;
            result.parser = parser2;
          }
        }
      }
      return asset;
    })();
    return result;
  }
  async load(assetsToLoadIn, onProgress) {
    if (!this._parsersValidated) {
      this._validateParsers();
    }
    let count = 0;
    const assets = {};
    const singleAsset = isSingleItem(assetsToLoadIn);
    const assetsToLoad = convertToList(assetsToLoadIn, (item) => ({
      alias: [item],
      src: item
    }));
    const total = assetsToLoad.length;
    const promises = assetsToLoad.map(async (asset) => {
      const url = path.toAbsolute(asset.src);
      if (!assets[asset.src]) {
        try {
          if (!this.promiseCache[url]) {
            this.promiseCache[url] = this._getLoadPromiseAndParser(url, asset);
          }
          assets[asset.src] = await this.promiseCache[url].promise;
          if (onProgress)
            onProgress(++count / total);
        } catch (e) {
          delete this.promiseCache[url];
          delete assets[asset.src];
          throw new Error(`[Loader.load] Failed to load ${url}.
${e}`);
        }
      }
    });
    await Promise.all(promises);
    return singleAsset ? assets[assetsToLoad[0].src] : assets;
  }
  /**
   * Unloads one or more assets. Any unloaded assets will be destroyed, freeing up memory for your app.
   * The parser that created the asset, will be the one that unloads it.
   * @example
   * // Single asset:
   * const asset = await Loader.load('cool.png');
   *
   * await Loader.unload('cool.png');
   *
   * console.log(asset.destroyed); // true
   * @param assetsToUnloadIn - urls that you want to unload, or a single one!
   */
  async unload(assetsToUnloadIn) {
    const assetsToUnload = convertToList(assetsToUnloadIn, (item) => ({
      alias: [item],
      src: item
    }));
    const promises = assetsToUnload.map(async (asset) => {
      var _a, _b;
      const url = path.toAbsolute(asset.src);
      const loadPromise = this.promiseCache[url];
      if (loadPromise) {
        const loadedAsset = await loadPromise.promise;
        delete this.promiseCache[url];
        await ((_b = (_a = loadPromise.parser) == null ? void 0 : _a.unload) == null ? void 0 : _b.call(_a, loadedAsset, asset, this));
      }
    });
    await Promise.all(promises);
  }
  /** validates our parsers, right now it only checks for name conflicts but we can add more here as required! */
  _validateParsers() {
    this._parsersValidated = true;
    this._parserHash = this._parsers.filter((parser) => parser.name).reduce((hash, parser) => {
      if (!parser.name) {
        warn(`[Assets] loadParser should have a name`);
      } else if (hash[parser.name]) {
        warn(`[Assets] loadParser name conflict "${parser.name}"`);
      }
      return __spreadProps(__spreadValues({}, hash), { [parser.name]: parser });
    }, {});
  }
}

export { Loader };
//# sourceMappingURL=Loader.mjs.map
