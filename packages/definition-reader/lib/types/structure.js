"use strict";

const _ = require("lodash");

const Type = require("./type");

class StructureType extends Type {
  constructor(structure) {
    super();
    this.structure = structure;
  }

  read(buffer, scope) {
    const value = {};
    _.each(this.structure.fields, field => {
      const readValue = field.type.read(buffer, scope);
      value[field.name] = readValue;
      scope.put(field.name, readValue);
    });
    return value;
  }
}

module.exports = StructureType;
