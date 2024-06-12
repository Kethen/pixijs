import { Sprite } from '../../scene/sprite/Sprite.mjs';

"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const colors = [
  "#000080",
  // Navy Blue
  "#228B22",
  // Forest Green
  "#8B0000",
  // Dark Red
  "#4169E1",
  // Royal Blue
  "#008080",
  // Teal
  "#800000",
  // Maroon
  "#9400D3",
  // Dark Violet
  "#FF8C00",
  // Dark Orange
  "#556B2F",
  // Olive Green
  "#8B008B"
  // Dark Magenta
];
let colorTick = 0;
function logScene(container, depth = 0, data = { color: "#000000" }) {
  if (container.renderGroup) {
    data.color = colors[colorTick++];
  }
  let spaces = "";
  for (let i = 0; i < depth; i++) {
    spaces += "    ";
  }
  let label = container.label;
  if (!label && container instanceof Sprite) {
    label = `sprite:${container.texture.label}`;
  }
  let output = `%c ${spaces}|- ${label} (worldX:${container.worldTransform.tx}, relativeRenderX:${container.relativeGroupTransform.tx}, renderX:${container.groupTransform.tx}, localX:${container.x})`;
  if (container.renderGroup) {
    output += " (RenderGroup)";
  }
  if (container.filters) {
    output += "(*filters)";
  }
  console.log(output, `color:${data.color}; font-weight:bold;`);
  depth++;
  for (let i = 0; i < container.children.length; i++) {
    const child = container.children[i];
    logScene(child, depth, __spreadValues({}, data));
  }
}
function logRenderGroupScene(renderGroup, depth = 0, data = { index: 0, color: "#000000" }) {
  let spaces = "";
  for (let i = 0; i < depth; i++) {
    spaces += "    ";
  }
  const output = `%c ${spaces}- ${data.index}: ${renderGroup.root.label} worldX:${renderGroup.worldTransform.tx}`;
  console.log(output, `color:${data.color}; font-weight:bold;`);
  depth++;
  for (let i = 0; i < renderGroup.renderGroupChildren.length; i++) {
    const child = renderGroup.renderGroupChildren[i];
    logRenderGroupScene(child, depth, __spreadProps(__spreadValues({}, data), { index: i }));
  }
}

export { logRenderGroupScene, logScene };
//# sourceMappingURL=logScene.mjs.map
