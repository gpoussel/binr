"use strict";

const _ = require("lodash");
const { Definition, Field, Structure } = require("@binr/model");
const { builtInTypes, StructureType } = require("./types");

class DefinitionBuilder {
  build(ast) {
    const structures = _.map(ast.structures, this.buildStructure.bind(this));
    return new Definition(structures);
  }

  buildStructure(structure) {
    console.log(structure);
    return new Structure(structure.name, _.map(structure.fields, this.buildField.bind(this)));
  }

  buildField(field) {
    return new Field(field.name);
  }
}

module.exports = DefinitionBuilder;
