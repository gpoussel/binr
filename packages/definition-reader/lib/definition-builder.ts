import { Bitmask, BitmaskEntry, Definition, EnumEntry, Enumeration, Structure } from "@binr/model";
import { clone, defaultTo, each, find, get, has, includes, keyBy, map, remove, values } from "lodash";
import { builtInTypes } from "./types";

export class DefinitionBuilder {
  public build(ast) {
    const enumerations = keyBy(map(ast.enumerations, (e) => this.buildEnumeration(e)), "name");
    const bitmasks = keyBy(map(ast.bitmasks, (e) => this.buildBitmask(e)), "name");
    const builtElements = {
      enumerations,
      bitmasks,
    };
    const endiannessHeader = ast.headers.find((h) => h.name === "endianness");
    const globalEndianness = get(endiannessHeader, "value", "big");
    const structures = values(this.buildAllStructures(globalEndianness, ast.structures, builtElements));
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
    const structuresToProcess = clone(structures);
    while (structuresToProcess.length > 0) {
      const builtStructuresDuringThisTurn = [];

      // We have to check if any field depends on a structure not built yet
      each(structuresToProcess, (structureToProcess) => {
        let readyToBuild = true;
        each(structureToProcess.statements, (statement) => {
          each(statement.getTypes(), (type) => {
            const typeName = type.type;
            if (has(builtInTypes, typeName)) {
              // Built-in type
              return;
            }
            if (has(builtElements.bitmasks, typeName)) {
              // Bitmask
              return;
            }
            if (has(builtElements.enumerations, typeName)) {
              // Enumeration
              return;
            }
            if (has(builtStructures, typeName)) {
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

      remove(structuresToProcess, (s) => includes(builtStructuresDuringThisTurn, s));

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
      map(structure.statements, (s) => s.buildStatement(builtElements)),
    );
    const endiannessAnnotation = find(structure.annotations, (h) => h.name === "endianness");
    const structureEndianness = get(endiannessAnnotation, "value", globalEndianness);
    structureObject.setEndianness(defaultTo(structureEndianness, globalEndianness));
    return structureObject;
  }

  public buildEnumeration(enumeration) {
    const entries = map(enumeration.entries, this.buildEnumEntry.bind(this));
    return new Enumeration(enumeration.name, enumeration.parentType, entries);
  }

  public buildBitmask(bitmask) {
    const entries = map(bitmask.entries, this.buildBitmaskEntry.bind(this));
    return new Bitmask(bitmask.name, bitmask.parentType, entries);
  }

  public buildEnumEntry(entry) {
    return new EnumEntry(entry.key, entry.value);
  }

  public buildBitmaskEntry(entry) {
    return new BitmaskEntry(entry.key, entry.value);
  }
}
