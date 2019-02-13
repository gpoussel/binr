"use strict";

const assert = require("assert");
const _ = require("lodash");

const Type = require("./type");

class StructureType extends Type {
  constructor(structure) {
    super();
    assert(!_.isUndefined(structure));
    this.structure = structure;
  }

  read(buffer, environment) {
    const value = {};
    const nestedEnvironment = environment.nestedScope();
    _.each(this.structure.statements, statement => {
      buffer.setEndianness(this.structure.endianness);
      statement.read(buffer, nestedEnvironment, value);
    });
    return value;
  }
}

module.exports = StructureType;
