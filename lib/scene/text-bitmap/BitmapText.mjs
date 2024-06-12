import { AbstractText, ensureOptions } from '../text/AbstractText.mjs';
import { TextStyle } from '../text/TextStyle.mjs';
import { BitmapFontManager } from './BitmapFontManager.mjs';

"use strict";
class BitmapText extends AbstractText {
  constructor(...args) {
    var _a, _b, _c;
    const options = ensureOptions(args, "BitmapText");
    (_a = options.style) != null ? _a : options.style = options.style || {};
    (_c = (_b = options.style).fill) != null ? _c : _b.fill = 16777215;
    super(options, TextStyle);
    this.renderPipeId = "bitmapText";
  }
  _updateBounds() {
    const bounds = this._bounds;
    const padding = this._style.padding;
    const anchor = this._anchor;
    const bitmapMeasurement = BitmapFontManager.measureText(this.text, this._style);
    const scale = bitmapMeasurement.scale;
    const offset = bitmapMeasurement.offsetY * scale;
    const width = bitmapMeasurement.width * scale;
    const height = bitmapMeasurement.height * scale;
    bounds.minX = -anchor._x * width - padding;
    bounds.maxX = bounds.minX + width;
    bounds.minY = -anchor._y * (height + offset) - padding;
    bounds.maxY = bounds.minY + height;
  }
}

export { BitmapText };
//# sourceMappingURL=BitmapText.mjs.map
