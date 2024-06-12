'use strict';

var Resolver = require('../../assets/resolver/Resolver.js');

"use strict";
function getResolutionOfUrl(url, defaultValue = 1) {
  var _a;
  const resolution = (_a = Resolver.Resolver.RETINA_PREFIX) == null ? void 0 : _a.exec(url);
  if (resolution) {
    return parseFloat(resolution[1]);
  }
  return defaultValue;
}

exports.getResolutionOfUrl = getResolutionOfUrl;
//# sourceMappingURL=getResolutionOfUrl.js.map
