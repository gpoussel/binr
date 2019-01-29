"use strict";

const _ = require("lodash");
const { Definition, Field, Structure, Enumeration, EnumEntry } = require("@binr/model");
const ExpressionConverter = require("./expression-converter");
const { builtInTypes, StructureType, ArrayType } = require("./types");

class DefinitionBuilder {
  constructor() {
    this.converter = new ExpressionConverter();
  }

  build(ast) {
    const structures = _.map(ast.structures, s => this.buildStructure(ast.structures, s));
    const enumerations = _.map(ast.enumerations, e => this.buildEnumeration(e));
    return new Definition(structures, enumerations);
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
      type = new ArrayType(type, definitionCode);
    }
    return new Field(field.name, type);
  }

  buildEnumeration(enumeration) {
    const entries = _.map(enumeration.entries, this.buildEnumEntry.bind(this));
    return new Enumeration(enumeration.name, entries);
  }

  buildEnumEntry(entry) {
    return new EnumEntry(entry.key, entry.value);
  }
}

module.exports = DefinitionBuilder;
