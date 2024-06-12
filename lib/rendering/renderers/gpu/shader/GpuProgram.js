'use strict';

var createIdFromString = require('../../shared/utils/createIdFromString.js');
var extractAttributesFromGpuProgram = require('./utils/extractAttributesFromGpuProgram.js');
var extractStructAndGroups = require('./utils/extractStructAndGroups.js');
var generateGpuLayoutGroups = require('./utils/generateGpuLayoutGroups.js');
var generateLayoutHash = require('./utils/generateLayoutHash.js');
var removeStructAndGroupDuplicates = require('./utils/removeStructAndGroupDuplicates.js');

"use strict";
const programCache = /* @__PURE__ */ Object.create(null);
class GpuProgram {
  /**
   * Create a new GpuProgram
   * @param options - The options for the gpu program
   */
  constructor(options) {
    /**
     * @internal
     * @ignore
     */
    this._layoutKey = 0;
    var _a, _b;
    const { fragment, vertex, layout, gpuLayout, name } = options;
    this.name = name;
    this.fragment = fragment;
    this.vertex = vertex;
    if (fragment.source === vertex.source) {
      const structsAndGroups = extractStructAndGroups.extractStructAndGroups(fragment.source);
      this.structsAndGroups = structsAndGroups;
    } else {
      const vertexStructsAndGroups = extractStructAndGroups.extractStructAndGroups(vertex.source);
      const fragmentStructsAndGroups = extractStructAndGroups.extractStructAndGroups(fragment.source);
      this.structsAndGroups = removeStructAndGroupDuplicates.removeStructAndGroupDuplicates(vertexStructsAndGroups, fragmentStructsAndGroups);
    }
    this.layout = layout != null ? layout : generateLayoutHash.generateLayoutHash(this.structsAndGroups);
    this.gpuLayout = gpuLayout != null ? gpuLayout : generateGpuLayoutGroups.generateGpuLayoutGroups(this.structsAndGroups);
    this.autoAssignGlobalUniforms = !!(((_a = this.layout[0]) == null ? void 0 : _a.globalUniforms) !== void 0);
    this.autoAssignLocalUniforms = !!(((_b = this.layout[1]) == null ? void 0 : _b.localUniforms) !== void 0);
    this._generateProgramKey();
  }
  // TODO maker this pure
  _generateProgramKey() {
    const { vertex, fragment } = this;
    const bigKey = vertex.source + fragment.source + vertex.entryPoint + fragment.entryPoint;
    this._layoutKey = createIdFromString.createIdFromString(bigKey, "program");
  }
  get attributeData() {
    var _a;
    (_a = this._attributeData) != null ? _a : this._attributeData = extractAttributesFromGpuProgram.extractAttributesFromGpuProgram(this.vertex);
    return this._attributeData;
  }
  /** destroys the program */
  destroy() {
    this.gpuLayout = null;
    this.layout = null;
    this.structsAndGroups = null;
    this.fragment = null;
    this.vertex = null;
  }
  /**
   * Helper function that creates a program for a given source.
   * It will check the program cache if the program has already been created.
   * If it has that one will be returned, if not a new one will be created and cached.
   * @param options - The options for the program.
   * @returns A program using the same source
   */
  static from(options) {
    const key = `${options.vertex.source}:${options.fragment.source}:${options.fragment.entryPoint}:${options.vertex.entryPoint}`;
    if (!programCache[key]) {
      programCache[key] = new GpuProgram(options);
    }
    return programCache[key];
  }
}

exports.GpuProgram = GpuProgram;
//# sourceMappingURL=GpuProgram.js.map
