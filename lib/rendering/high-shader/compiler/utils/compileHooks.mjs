"use strict";
const findHooksRx = /\{\{(.*?)\}\}/g;
function compileHooks(programSrc) {
  var _a, _b;
  const parts = {};
  const partMatches = (_b = (_a = programSrc.match(findHooksRx)) == null ? void 0 : _a.map((hook) => hook.replace(/[{()}]/g, ""))) != null ? _b : [];
  partMatches.forEach((hook) => {
    parts[hook] = [];
  });
  return parts;
}

export { compileHooks, findHooksRx };
//# sourceMappingURL=compileHooks.mjs.map
