"use strict";

import { Bitmask, BitmaskEntry, Definition, EnumEntry, Enumeration, Structure } from "@binr/model";
import _ from "lodash";
import { ExpressionConverter } from "./expression-converter";
import { builtInTypes } from "./types";

export class DefinitionBuilder {
  private converter: ExpressionConverter;
  constructor() {
    this.converter = new ExpressionConverter();
  }

  public build(ast) {
    const enumerations = _.keyBy(_.map(ast.enumerations, (e) => this.buildEnumeration(e)), "name");
    const bitmasks = _.keyBy(_.map(ast.bitmasks, (e) => this.buildBitmask(e)), "name");
    const builtElements = {
      enumerations,
      bitmasks,
    };
    const endiannessHeader = ast.headers.find((h) => h.name === "endianness");
    const globalEndianness = _.get(endiannessHeader, "value", "big");
    const structures = _.values(this.buildAllStructures(globalEndianness, ast.structures, builtElements));
    return new Definition(structures, enumerations, bitmasks);
  }

  /**
   * This method build all structures and takes into account dependencies
   * between them. Some structures need to be built before other ones.
   * @param {string} globalEndianness definition endianness "little" or "big"
   * @param {array} structures AST structures
   * @param {array} builtElements all elements already built in this definition
   * @return {array} all structures
   */
  public buildAllStructures(globalEndianness, structures, builtElements) {
    const builtStructures = {};
    const structuresToProcess = _.clone(structures);
    while (structuresToProcess.length > 0) {
      const builtStructuresDuringThisTurn = [];

      // We have to check if any field depends on a structure not built yet
      _.each(structuresToProcess, (structureToProcess) => {
        let readyToBuild = true;
        _.each(structureToProcess.statements, (statement) => {
          _.each(statement.getTypes(), (type) => {
            const typeName = type.type;
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
          if (!readyToBuild) {
            return false;
          }
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
            structureToProcess,
          );
        }
      });

      _.remove(structuresToProcess, (s) => _.includes(builtStructuresDuringThisTurn, s));

      if (builtStructuresDuringThisTurn.length === 0) {
        // We have just met a circular dependency, since we have just performed
        // a rotation without changes.  Or, we have a field with an unknwon
        // type. Either way, that's a good reason to stop the processing now.
        throw new Error("Unable to build Definition: invalid structures");
      }
    }
    return builtStructures;
  }

  public buildStructure(globalEndianness, builtElements, structure) {
    const structureObject = new Structure(
      structure.name,
      _.map(structure.statements, (s) => s.buildStatement(builtElements)),
    );
    const endiannessAnnotation = _.find(structure.annotations, (h) => h.name === "endianness");
    const structureEndianness = _.get(endiannessAnnotation, "value", globalEndianness);
    structureObject.setEndianness(_.defaultTo(structureEndianness));
    return structureObject;
  }

  public buildEnumeration(enumeration) {
    const entries = _.map(enumeration.entries, this.buildEnumEntry.bind(this));
    return new Enumeration(enumeration.name, enumeration.parentType, entries);
  }

  public buildBitmask(bitmask) {
    const entries = _.map(bitmask.entries, this.buildBitmaskEntry.bind(this));
    return new Bitmask(bitmask.name, bitmask.parentType, entries);
  }

  public buildEnumEntry(entry) {
    return new EnumEntry(entry.key, entry.value);
  }

  public buildBitmaskEntry(entry) {
    return new BitmaskEntry(entry.key, entry.value);
  }
}
