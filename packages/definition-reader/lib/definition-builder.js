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
    const structures = _.values(this.buildAllStructures(ast, ast.structures, builtElements));
    return new Definition(structures, enumerations, bitmasks);
  }

  /**
   * This method build all structures and takes into account dependencies
   * between them. Some structures need to be built before other ones.
   * @param {array} structures AST structures
   */
  buildAllStructures(ast, structures, builtElements) {
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
            ast,
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
        // a rotation without changes.
        throw new Error("Circular dependencies detected between structures");
      }
    }
    return builtStructures;
  }

  buildStructure(ast, builtElements, structure) {
    const endiannessHeader = ast.headers.find(h => h.name === "endianness");
    const structureObject = new Structure(
      structure.name,
      _.map(structure.fields, f => this.buildField(builtElements, f))
    );
    if (!_.isUndefined(endiannessHeader)) {
      structureObject.setEndianness(endiannessHeader.value);
    }
    return structureObject;
  }

  buildEnumeration(enumeration) {
    const entries = _.map(enumeration.entries, this.buildEnumEntry.bind(this));
    return new Enumeration(enumeration.name, entries);
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
      type = new EnumerationType(_.get(builtElements.enumerations, typeName));
    } else if (_.has(builtElements.bitmasks, typeName)) {
      const bitmask = _.get(builtElements.bitmasks, typeName);
      type = new BitmaskType(this.getBuiltInType(bitmask.parentType), bitmask);
    } else {
      throw new Error(`Unable to find referenced type ${typeName}`);
    }
    if (_.has(field, "arrayDefinition")) {
      const definitionCode = `(function(variableScope) { return ${this.converter.convert(
        field.arrayDefinition
      )} })`;
      type = new ArrayType(type, definitionCode);
    }
    return new Field(field.name, type);
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
