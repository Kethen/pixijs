import EventEmitter from 'eventemitter3';
import { uid } from '../../../../utils/data/uid.mjs';
import { deprecation, v8_0_0 } from '../../../../utils/logging/deprecation.mjs';

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
const idHash = /* @__PURE__ */ Object.create(null);
function createResourceIdFromString(value) {
  const id = idHash[value];
  if (id === void 0) {
    idHash[value] = uid("resource");
  }
  return id;
}
const _TextureStyle = class _TextureStyle extends EventEmitter {
  /**
   * @param options - options for the style
   */
  constructor(options = {}) {
    var _a, _b, _c, _d, _e, _f, _g;
    super();
    this._resourceType = "textureSampler";
    this._touched = 0;
    /**
     * Specifies the maximum anisotropy value clamp used by the sampler.
     * Note: Most implementations support {@link GPUSamplerDescriptor#maxAnisotropy} values in range
     * between 1 and 16, inclusive. The used value of {@link GPUSamplerDescriptor#maxAnisotropy} will
     * be clamped to the maximum value that the platform supports.
     * @internal
     * @ignore
     */
    this._maxAnisotropy = 1;
    /**
     * Has the style been destroyed?
     * @readonly
     */
    this.destroyed = false;
    options = __spreadValues(__spreadValues({}, _TextureStyle.defaultOptions), options);
    this.addressMode = options.addressMode;
    this.addressModeU = (_a = options.addressModeU) != null ? _a : this.addressModeU;
    this.addressModeV = (_b = options.addressModeV) != null ? _b : this.addressModeV;
    this.addressModeW = (_c = options.addressModeW) != null ? _c : this.addressModeW;
    this.scaleMode = options.scaleMode;
    this.magFilter = (_d = options.magFilter) != null ? _d : this.magFilter;
    this.minFilter = (_e = options.minFilter) != null ? _e : this.minFilter;
    this.mipmapFilter = (_f = options.mipmapFilter) != null ? _f : this.mipmapFilter;
    this.lodMinClamp = options.lodMinClamp;
    this.lodMaxClamp = options.lodMaxClamp;
    this.compare = options.compare;
    this.maxAnisotropy = (_g = options.maxAnisotropy) != null ? _g : 1;
  }
  set addressMode(value) {
    this.addressModeU = value;
    this.addressModeV = value;
    this.addressModeW = value;
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this.addressModeU;
  }
  set wrapMode(value) {
    deprecation(v8_0_0, "TextureStyle.wrapMode is now TextureStyle.addressMode");
    this.addressMode = value;
  }
  get wrapMode() {
    return this.addressMode;
  }
  set scaleMode(value) {
    this.magFilter = value;
    this.minFilter = value;
    this.mipmapFilter = value;
  }
  /** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
  get scaleMode() {
    return this.magFilter;
  }
  /** Specifies the maximum anisotropy value clamp used by the sampler. */
  set maxAnisotropy(value) {
    this._maxAnisotropy = Math.min(value, 16);
    if (this._maxAnisotropy > 1) {
      this.scaleMode = "linear";
    }
  }
  get maxAnisotropy() {
    return this._maxAnisotropy;
  }
  // TODO - move this to WebGL?
  get _resourceId() {
    return this._sharedResourceId || this._generateResourceId();
  }
  update() {
    this.emit("change", this);
    this._sharedResourceId = null;
  }
  _generateResourceId() {
    const bigKey = `${this.addressModeU}-${this.addressModeV}-${this.addressModeW}-${this.magFilter}-${this.minFilter}-${this.mipmapFilter}-${this.lodMinClamp}-${this.lodMaxClamp}-${this.compare}-${this._maxAnisotropy}`;
    this._sharedResourceId = createResourceIdFromString(bigKey);
    return this._resourceId;
  }
  /** Destroys the style */
  destroy() {
    this.destroyed = true;
    this.emit("destroy", this);
    this.emit("change", this);
    this.removeAllListeners();
  }
};
/** default options for the style */
_TextureStyle.defaultOptions = {
  addressMode: "clamp-to-edge",
  scaleMode: "linear"
};
let TextureStyle = _TextureStyle;

export { TextureStyle };
//# sourceMappingURL=TextureStyle.mjs.map
