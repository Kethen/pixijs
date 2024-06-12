'use strict';

var Extensions = require('../../../extensions/Extensions.js');
var loadTextures = require('../../loader/parsers/textures/loadTextures.js');
var Resolver = require('../Resolver.js');

"use strict";
const resolveTextureUrl = {
  extension: {
    type: Extensions.ExtensionType.ResolveParser,
    name: "resolveTexture"
  },
  test: loadTextures.loadTextures.test,
  parse: (value) => {
    var _a, _b;
    return {
      resolution: parseFloat((_b = (_a = Resolver.Resolver.RETINA_PREFIX.exec(value)) == null ? void 0 : _a[1]) != null ? _b : "1"),
      format: value.split(".").pop(),
      src: value
    };
  }
};

exports.resolveTextureUrl = resolveTextureUrl;
//# sourceMappingURL=resolveTextureUrl.js.map
