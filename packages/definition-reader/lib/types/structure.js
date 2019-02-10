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
    _.each(this.structure.statements, statement => {
      buffer.setEndianness(this.structure.endianness);
      const nestedScope = {
        functions: scopes.functions,
        globalFunctions: scopes.globalFunctions,
        variables: new VariableScope(scopes.variables),
      };
      statement.read(buffer, nestedScope, scopes, value);
    });
    return value;
  }
}

module.exports = StructureType;
