"use strict";

const assert = require("assert");
const _ = require("lodash");
const { VariableScope } = require("@binr/shared");

const Type = require("./type");

class StructureType extends Type {
  constructor(structure) {
    super();
    assert(!_.isUndefined(structure));
    this.structure = structure;
  }

  read(buffer, scope) {
    const value = {};
    _.each(this.structure.fields, field => {
      buffer.setEndianness(this.structure.endianness);
      const nestedScope = new VariableScope(scope);
      const readValue = field.type.read(buffer, nestedScope);
      const ignore = _.get(field.meta, "ignore", false);
      if (!ignore) {
        value[field.name] = readValue;
        scope.put(field.name, readValue);
      }
    });
    return value;
  }
}

module.exports = StructureType;
