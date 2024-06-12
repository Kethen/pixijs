'use strict';

var Buffer = require('../../../rendering/renderers/shared/buffer/Buffer.js');
var _const = require('../../../rendering/renderers/shared/buffer/const.js');
var Geometry = require('../../../rendering/renderers/shared/geometry/Geometry.js');
var deprecation = require('../../../utils/logging/deprecation.js');

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
const _MeshGeometry = class _MeshGeometry extends Geometry.Geometry {
  constructor(...args) {
    var _a;
    let options = (_a = args[0]) != null ? _a : {};
    if (options instanceof Float32Array) {
      deprecation.deprecation(deprecation.v8_0_0, "use new MeshGeometry({ positions, uvs, indices }) instead");
      options = {
        positions: options,
        uvs: args[1],
        indices: args[2]
      };
    }
    options = __spreadValues(__spreadValues({}, _MeshGeometry.defaultOptions), options);
    const positions = options.positions || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    const uvs = options.uvs || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    const indices = options.indices || new Uint32Array([0, 1, 2, 0, 2, 3]);
    const shrinkToFit = options.shrinkBuffersToFit;
    const positionBuffer = new Buffer.Buffer({
      data: positions,
      label: "attribute-mesh-positions",
      shrinkToFit,
      usage: _const.BufferUsage.VERTEX | _const.BufferUsage.COPY_DST
    });
    const uvBuffer = new Buffer.Buffer({
      data: uvs,
      label: "attribute-mesh-uvs",
      shrinkToFit,
      usage: _const.BufferUsage.VERTEX | _const.BufferUsage.COPY_DST
    });
    const indexBuffer = new Buffer.Buffer({
      data: indices,
      label: "index-mesh-buffer",
      shrinkToFit,
      usage: _const.BufferUsage.INDEX | _const.BufferUsage.COPY_DST
    });
    super({
      attributes: {
        aPosition: {
          buffer: positionBuffer,
          format: "float32x2",
          stride: 2 * 4,
          offset: 0
        },
        aUV: {
          buffer: uvBuffer,
          format: "float32x2",
          stride: 2 * 4,
          offset: 0
        }
      },
      indexBuffer,
      topology: options.topology
    });
    this.batchMode = "auto";
  }
  /** The positions of the mesh. */
  get positions() {
    return this.attributes.aPosition.buffer.data;
  }
  set positions(value) {
    this.attributes.aPosition.buffer.data = value;
  }
  /** The UVs of the mesh. */
  get uvs() {
    return this.attributes.aUV.buffer.data;
  }
  set uvs(value) {
    this.attributes.aUV.buffer.data = value;
  }
  /** The indices of the mesh. */
  get indices() {
    return this.indexBuffer.data;
  }
  set indices(value) {
    this.indexBuffer.data = value;
  }
};
_MeshGeometry.defaultOptions = {
  topology: "triangle-list",
  shrinkBuffersToFit: false
};
let MeshGeometry = _MeshGeometry;

exports.MeshGeometry = MeshGeometry;
//# sourceMappingURL=MeshGeometry.js.map
