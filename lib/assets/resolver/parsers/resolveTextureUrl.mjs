import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { loadTextures } from '../../loader/parsers/textures/loadTextures.mjs';
import { Resolver } from '../Resolver.mjs';

"use strict";
const resolveTextureUrl = {
  extension: {
    type: ExtensionType.ResolveParser,
    name: "resolveTexture"
  },
  test: loadTextures.test,
  parse: (value) => {
    var _a, _b;
    return {
      resolution: parseFloat((_b = (_a = Resolver.RETINA_PREFIX.exec(value)) == null ? void 0 : _a[1]) != null ? _b : "1"),
      format: value.split(".").pop(),
      src: value
    };
  }
};

export { resolveTextureUrl };
//# sourceMappingURL=resolveTextureUrl.mjs.map
