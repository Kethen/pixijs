import { Resolver } from '../../assets/resolver/Resolver.mjs';

"use strict";
function getResolutionOfUrl(url, defaultValue = 1) {
  var _a;
  const resolution = (_a = Resolver.RETINA_PREFIX) == null ? void 0 : _a.exec(url);
  if (resolution) {
    return parseFloat(resolution[1]);
  }
  return defaultValue;
}

export { getResolutionOfUrl };
//# sourceMappingURL=getResolutionOfUrl.mjs.map
