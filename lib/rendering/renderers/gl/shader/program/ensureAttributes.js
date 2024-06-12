'use strict';

var warn = require('../../../../../utils/logging/warn.js');
var getAttributeInfoFromFormat = require('../../../shared/geometry/utils/getAttributeInfoFromFormat.js');

"use strict";
function ensureAttributes(geometry, extractedData) {
  var _a, _b, _c, _d;
  for (const i in geometry.attributes) {
    const attribute = geometry.attributes[i];
    const attributeData = extractedData[i];
    if (attributeData) {
      (_a = attribute.location) != null ? _a : attribute.location = attributeData.location;
      (_b = attribute.format) != null ? _b : attribute.format = attributeData.format;
      (_c = attribute.offset) != null ? _c : attribute.offset = attributeData.offset;
      (_d = attribute.instance) != null ? _d : attribute.instance = attributeData.instance;
    } else {
      warn.warn(`Attribute ${i} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`);
    }
  }
  ensureStartAndStride(geometry);
}
function ensureStartAndStride(geometry) {
  var _a, _b;
  const { buffers, attributes } = geometry;
  const tempStride = {};
  const tempStart = {};
  for (const j in buffers) {
    const buffer = buffers[j];
    tempStride[buffer.uid] = 0;
    tempStart[buffer.uid] = 0;
  }
  for (const j in attributes) {
    const attribute = attributes[j];
    tempStride[attribute.buffer.uid] += getAttributeInfoFromFormat.getAttributeInfoFromFormat(attribute.format).stride;
  }
  for (const j in attributes) {
    const attribute = attributes[j];
    (_a = attribute.stride) != null ? _a : attribute.stride = tempStride[attribute.buffer.uid];
    (_b = attribute.start) != null ? _b : attribute.start = tempStart[attribute.buffer.uid];
    tempStart[attribute.buffer.uid] += getAttributeInfoFromFormat.getAttributeInfoFromFormat(attribute.format).stride;
  }
}

exports.ensureAttributes = ensureAttributes;
//# sourceMappingURL=ensureAttributes.js.map
