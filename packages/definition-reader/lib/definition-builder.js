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
    const enumerations = _.keyBy(_.map(ast.enumerations, e => this.buildEnumeration(e)), "name");
    const bitmasks = _.keyBy(_.map(ast.bitmasks, e => this.buildBitmask(e)), "name");
    const builtElements = {
      enumerations,
      bitmasks,
    };
    const endiannessHeader = ast.headers.find(h => h.name === "endianness");
    const globalEndianness = _.get(endiannessHeader, "value", "big");
    const structures = _.values(this.buildAllStructures(globalEndianness, ast.structures, builtElements));
    return new Definition(structures, enumerations, bitmasks);
  }

  /**
   * This method build all structures and takes into account dependencies
   * between them. Some structures need to be built before other ones.
   * @param {array} structures AST structures
   */
  buildAllStructures(globalEndianness, structures, builtElements) {
    const builtStructures = {};
    const structuresToProcess = _.clone(structures);
    while (structuresToProcess.length > 0) {
      const builtStructuresDuringThisTurn = [];

      // We have to check if any field depends on a structure not built yet
      _.each(structuresToProcess, structureToProcess => {
        let readyToBuild = true;
        _.each(structureToProcess.fields, field => {
          const typeName = field.type.type;
          if (_.has(builtInTypes, typeName)) {
            // Built-in type
            return;
          }
          if (_.has(builtElements.bitmasks, typeName)) {
            // Bitmask
            return;
          }
          if (_.has(builtElements.enumerations, typeName)) {
            // Enumeration
            return;
          }
          if (_.has(builtStructures, typeName)) {
            // Structure already built
            return;
          }
          readyToBuild = false;
          return false;
        });

        if (readyToBuild) {
          builtStructuresDuringThisTurn.push(structureToProcess);
          builtStructures[structureToProcess.name] = this.buildStructure(
            globalEndianness,
            {
              structures: builtStructures,
              enumerations: builtElements.enumerations,
              bitmasks: builtElements.bitmasks,
            },
            structureToProcess
          );
        }
      });

      _.remove(structuresToProcess, s => _.includes(builtStructuresDuringThisTurn, s));

      if (builtStructuresDuringThisTurn.length === 0) {
        // We have just met a circular dependency, since we have just performed
        // a rotation without changes.  Or, we have a field with an unknwon
        // type. Either way, that's a good reason to stop the processing now.
        throw new Error("Unable to build Definition: invalid structures");
      }
    }
    return builtStructures;
  }

  buildStructure(globalEndianness, builtElements, structure) {
    const structureObject = new Structure(
      structure.name,
      _.map(structure.fields, f => this.buildField(builtElements, f))
    );
    const endiannessAnnotation = _.find(structure.annotations, h => h.name === "endianness");
    const structureEndianness = _.get(endiannessAnnotation, "value", globalEndianness);
    structureObject.setEndianness(_.defaultTo(structureEndianness));
    return structureObject;
  }

  buildEnumeration(enumeration) {
    const entries = _.map(enumeration.entries, this.buildEnumEntry.bind(this));
    return new Enumeration(enumeration.name, enumeration.parentType, entries);
  }

  buildBitmask(bitmask) {
    const entries = _.map(bitmask.entries, this.buildBitmaskEntry.bind(this));
    return new Bitmask(bitmask.name, bitmask.parentType, entries);
  }

  buildField(builtElements, field) {
    const typeName = field.type.type;
    let type;
    if (_.has(builtInTypes, typeName)) {
      type = this.getBuiltInType(field.type);
    } else if (_.has(builtElements.structures, typeName)) {
      type = new StructureType(_.get(builtElements.structures, typeName));
    } else if (_.has(builtElements.enumerations, typeName)) {
      const enumeration = _.get(builtElements.enumerations, typeName);
      type = new EnumerationType(this.getBuiltInType(enumeration.parentType), enumeration);
    } else {
      const bitmask = _.get(builtElements.bitmasks, typeName);
      type = new BitmaskType(this.getBuiltInType(bitmask.parentType), bitmask);
    }
    if (_.has(field, "arrayDefinition")) {
      const definitionCode = `(function(variableScope) { return ${this.converter.convert(
        field.arrayDefinition
      )} })`;
      type = new ArrayType(type, definitionCode);
    }
    return new Field(
      field.name,
      type,
      _.fromPairs(
        _.map(field.annotations, annotation => {
          if (annotation.name === "ignore") {
            return ["ignore", annotation.value];
          }
        }).filter(pair => pair[0])
      )
    );
  }

  getBuiltInType(type) {
    return builtInTypes[type.type](type);
  }

  buildEnumEntry(entry) {
    return new EnumEntry(entry.key, entry.value);
  }

  buildBitmaskEntry(entry) {
    return new BitmaskEntry(entry.key, entry.value);
  }
}

module.exports = DefinitionBuilder;
