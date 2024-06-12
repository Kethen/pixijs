import { Resolver } from '../../assets/resolver/Resolver.mjs';
import { checkExtension } from '../../assets/utils/checkExtension.mjs';
import { ExtensionType } from '../../extensions/Extensions.mjs';

"use strict";
const validFormats = ["basis", "bc7", "bc6h", "astc", "etc2", "bc5", "bc4", "bc3", "bc2", "bc1", "eac"];
const resolveCompressedTextureUrl = {
  extension: ExtensionType.ResolveParser,
  test: (value) => checkExtension(value, [".ktx", ".ktx2", ".dds"]),
  parse: (value) => {
    var _a, _b;
    let format;
    const splitValue = value.split(".");
    if (splitValue.length > 2) {
      const newFormat = splitValue[splitValue.length - 2];
      if (validFormats.includes(newFormat)) {
        format = newFormat;
      }
    } else {
      format = splitValue[splitValue.length - 1];
    }
    return {
      resolution: parseFloat((_b = (_a = Resolver.RETINA_PREFIX.exec(value)) == null ? void 0 : _a[1]) != null ? _b : "1"),
      format,
      src: value
    };
  }
};

export { resolveCompressedTextureUrl, validFormats };
//# sourceMappingURL=resolveCompressedTextureUrl.mjs.map
