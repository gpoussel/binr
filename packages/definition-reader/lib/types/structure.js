"use strict";

const assert = require("assert");
const _ = require("lodash");

const { ValueAggregator } = require("@binr/shared");

const Type = require("./type");

class StructureType extends Type {
  constructor(structure) {
    super();
    assert(!_.isUndefined(structure));
    this.structure = structure;
  }

  read(buffer, environment) {
    const valueAggregator = new ValueAggregator();
    const nestedEnvironment = environment.nestedScope();
    _.each(this.structure.statements, statement => {
      buffer.setEndianness(this.structure.endianness);
      statement.read(buffer, nestedEnvironment, valueAggregator);
    });
    return valueAggregator.build();
  }
}

module.exports = StructureType;
