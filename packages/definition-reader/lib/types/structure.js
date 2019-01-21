"use strict";

const Type = require("./type");

class StructureType extends Type {
  constructor(structure) {
    super();
    this.structure = structure;
  }
}

module.exports = StructureType;
