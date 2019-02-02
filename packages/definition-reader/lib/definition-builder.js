"use strict";

const _ = require("lodash");
const {
  Definition,
  Field,
  Structure,
  Enumeration,
  EnumEntry,
  Bitmask,
  BitmaskEntry,
} = require("@binr/model");
const ExpressionConverter = require("./expression-converter");
const { builtInTypes, StructureType, ArrayType, EnumerationType, BitmaskType } = require("./types");

class DefinitionBuilder {
  constructor() {
    this.converter = new ExpressionConverter();
  }

  build(ast) {
    const structures = _.map(ast.structures, s => this.buildStructure(ast, s));
    const enumerations = _.map(ast.enumerations, e => this.buildEnumeration(ast, e));
    const bitmasks = _.map(ast.bitmasks, e => this.buildBitmask(ast, e));
    return new Definition(structures, enumerations, bitmasks);
  }

  buildStructure(ast, structure) {
    return new Structure(structure.name, _.map(structure.fields, f => this.buildField(ast, f)));
  }

  buildField(ast, field) {
    const typeName = field.type.type;
    let type;
    if (_.has(builtInTypes, typeName)) {
      // Built-in type
      type = builtInTypes[typeName](field.type);
    } else {
      // TODO: Cache the "buildXXX" calls, otherwise each
      // structure/bitmask/enumeration will be built several times
      const foundStructure = _.find(ast.structures, s => s.name === typeName);
      if (!_.isUndefined(foundStructure)) {
        type = new StructureType(this.buildStructure(ast, foundStructure));
      } else {
        const foundEnumeration = _.find(ast.enumerations, e => e.name === typeName);
        if (!_.isUndefined(foundEnumeration)) {
          type = new EnumerationType(this.buildEnumeration(ast, foundEnumeration));
        } else {
          const foundBitmask = _.find(ast.bitmasks, b => b.name === typeName);
          if (!_.isUndefined(foundBitmask)) {
            type = new BitmaskType(this.buildBitmask(ast, foundBitmask));
          } else {
            throw new Error(`Unable to find referenced type ${typeName}`);
          }
        }
      }
    }
    if (_.has(field, "arrayDefinition")) {
      const definitionCode = `(function(variableScope) { return ${this.converter.convert(
        field.arrayDefinition
      )} })`;
      type = new ArrayType(type, definitionCode);
    }
    return new Field(field.name, type);
  }

  buildEnumeration(ast, enumeration) {
    const entries = _.map(enumeration.entries, this.buildEnumEntry.bind(this));
    return new Enumeration(enumeration.name, entries);
  }

  buildBitmask(ast, bitmask) {
    const entries = _.map(bitmask.entries, this.buildBitmaskEntry.bind(this));
    return new Bitmask(bitmask.name, entries);
  }

  buildEnumEntry(entry) {
    return new EnumEntry(entry.key, entry.value);
  }

  buildBitmaskEntry(entry) {
    return new BitmaskEntry(entry.key, entry.value);
  }
}

module.exports = DefinitionBuilder;
