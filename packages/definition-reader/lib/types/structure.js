"use strict";

const _ = require("lodash");

const Type = require("./type");

class StructureType extends Type {
  constructor(structure) {
    super();
    this.structure = structure;
  }

  read(buffer) {
    const value = {};
    _.each(this.structure.fields, field => {
      value[field.name] = field.type.read(buffer);
    });
    return value;
  }
}

module.exports = StructureType;
