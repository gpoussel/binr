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
    _.each(this.structure.fields, statement => {
      buffer.setEndianness(this.structure.endianness);
      const nestedScope = new VariableScope(scope);
      statement.read(buffer, nestedScope, scope, value);
    });
    return value;
  }
}

module.exports = StructureType;
