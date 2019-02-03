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
    const enumerations = _.map(ast.enumerations, e => this.buildEnumeration(ast, e));
    const bitmasks = _.map(ast.bitmasks, e => this.buildBitmask(ast, e));
    const builtElements = {
      enumerations,
      bitmasks,
    };
    const structures = _.map(ast.structures, s => this.buildStructure(ast, builtElements, s));
    return new Definition(structures, enumerations, bitmasks);
  }

  buildStructure(ast, builtElements, structure) {
    const endiannessHeader = ast.headers.find(h => h.name === "endianness");
    const structureObject = new Structure(
      structure.name,
      _.map(structure.fields, f => this.buildField(ast, builtElements, f))
    );
    if (!_.isUndefined(endiannessHeader)) {
      structureObject.setEndianness(endiannessHeader.value);
    }
    return structureObject;
  }

  buildEnumeration(ast, enumeration) {
    const entries = _.map(enumeration.entries, this.buildEnumEntry.bind(this));
    return new Enumeration(enumeration.name, entries);
  }

  buildBitmask(ast, bitmask) {
    const entries = _.map(bitmask.entries, this.buildBitmaskEntry.bind(this));
    return new Bitmask(bitmask.name, entries);
  }

  buildField(ast, builtElements, field) {
    const typeName = field.type.type;
    let type;
    if (_.has(builtInTypes, typeName)) {
      // Built-in type
      type = builtInTypes[typeName](field.type);
    } else {
      // TODO: Cache the "buildStructure" calls, otherwise each structure will be built several times
      const foundStructure = _.find(ast.structures, s => s.name === typeName);
      if (!_.isUndefined(foundStructure)) {
        type = new StructureType(this.buildStructure(ast, builtElements, foundStructure));
      } else {
        const foundEnumeration = _.find(builtElements.enumerations, e => e.name === typeName);
        if (!_.isUndefined(foundEnumeration)) {
          type = new EnumerationType(foundEnumeration);
        } else {
          const foundBitmask = _.find(builtElements.bitmasks, b => b.name === typeName);
          if (!_.isUndefined(foundBitmask)) {
            type = new BitmaskType(foundBitmask);
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

  buildEnumEntry(entry) {
    return new EnumEntry(entry.key, entry.value);
  }

  buildBitmaskEntry(entry) {
    return new BitmaskEntry(entry.key, entry.value);
  }
}

module.exports = DefinitionBuilder;
