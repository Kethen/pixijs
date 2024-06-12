import { DOMAdapter } from '../../../../../environment/adapter.mjs';

"use strict";
let context;
function getTestContext() {
  if (!context || (context == null ? void 0 : context.isContextLost())) {
    const canvas = DOMAdapter.get().createCanvas();
    context = canvas.getContext("webgl", {});
  }
  return context;
}

export { getTestContext };
//# sourceMappingURL=getTestContext.mjs.map
