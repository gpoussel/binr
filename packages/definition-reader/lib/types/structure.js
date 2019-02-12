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

  read(buffer, scopes) {
    const value = {};
    const nestedScope = {
      functions: scopes.functions,
      stream: scopes.stream,
      variables: new VariableScope(scopes.variables),
    };
    _.each(this.structure.statements, statement => {
      buffer.setEndianness(this.structure.endianness);
      statement.read(buffer, nestedScope, scopes, value);
    });
    return value;
  }
}

module.exports = StructureType;
