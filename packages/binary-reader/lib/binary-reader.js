"use strict";

const _ = require("lodash");
const assert = require("assert");

const { StructureType } = require("@binr/definition-reader");
const { BufferWrapper, VariableScope, FunctionScope } = require("@binr/shared");

const StreamObject = require("./stream-object");

class BinaryReader {
  read(binaryBuffer, definition, providedStructureName = undefined) {
    assert(_.isObject(definition), "definition must be an object");
    assert(_.isBuffer(binaryBuffer), "binaryBuffer must be a buffer");

    const functionScope = new FunctionScope();
    this.setupFunctionScope(functionScope);

    let mainStructureName;
    if (_.isUndefined(providedStructureName)) {
      // No structure provided: assume there is only one in the definition
      // Otherwise that's an error
      assert(
        _.get(definition, "structures.length") === 1,
        `No 'structureName' provided: structures.length must be === 1`
      );
      mainStructureName = _.first(definition.structures).name;
    } else {
      mainStructureName = providedStructureName;
    }

    const mainStructure = _.find(definition.structures, s => s.name === mainStructureName);
    assert(!_.isUndefined(mainStructure), `Main structure '${mainStructureName}' not found`);

    const structureType = new StructureType(mainStructure);
    const bufferWrapper = new BufferWrapper(binaryBuffer, mainStructure.getEndianness());

    const scopes = {
      variables: new VariableScope(),
      functions: functionScope,
      stream: new StreamObject(bufferWrapper),
    };

    return structureType.read(bufferWrapper, scopes);
  }

  setupFunctionScope(functionScope) {
    functionScope.put("min", (...args) => _.min(args));
    functionScope.put("max", (...args) => _.max(args));
  }
}

module.exports = BinaryReader;
