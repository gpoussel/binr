"use strict";

const _ = require("lodash");
const { Definition, Field, Structure } = require("@binr/model");
const ExpressionConverter = require("./expression-converter");
const { builtInTypes, StructureType, ArrayType } = require("./types");

class DefinitionBuilder {
  constructor() {
    this.converter = new ExpressionConverter();
  }

  build(ast) {
    const structures = _.map(ast.structures, s => this.buildStructure(ast.structures, s));
    return new Definition(structures);
  }

  buildStructure(structures, structure) {
    return new Structure(structure.name, _.map(structure.fields, f => this.buildField(structures, f)));
  }

  buildField(structures, field) {
    let type;
    if (_.has(builtInTypes, field.type)) {
      // Built-in type
      type = builtInTypes[field.type](field);
    } else {
      // Must be structure in the current definition
      type = new StructureType(_.find(structures, s => s.name === field.type));
    }
    if (_.has(field, "arrayDefinition")) {
      const definitionCode = `(function(variableScope) { return ${this.converter.convert(
        field.arrayDefinition
      )} })`;
      // TODO: Find a better way of evaluating expressions
      // I think eval() raises some security concerns, but that's fine for now
      // eslint-disable-next-line no-eval
      type = new ArrayType(type, eval(definitionCode));
    }
    return new Field(field.name, type);
  }
}

module.exports = DefinitionBuilder;
