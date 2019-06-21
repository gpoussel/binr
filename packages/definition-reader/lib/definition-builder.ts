import { Bitmask, BitmaskEntry, Definition, EnumEntry, Enumeration, Structure } from "@binr/model";
import { clone, defaultTo, each, find, get, has, includes, keyBy, map, remove, values } from "lodash";
import { builtInTypes } from "./types";

export class DefinitionBuilder {
  public build(ast: any) {
    const enumerations = map(ast.enumerations, (e) => this.buildEnumeration(e));
    const bitmasks = map(ast.bitmasks, (e) => this.buildBitmask(e));
    const builtElements = {
      enumerations: keyBy(enumerations, "name"),
      bitmasks: keyBy(bitmasks, "name"),
    };
    const endiannessHeader = ast.headers.find((h: any) => h.name === "endianness");
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
  public buildAllStructures(
    globalEndianness: string,
    structures: any[],
    builtElements: {
      enumerations: { [key: string]: Enumeration };
      bitmasks: { [key: string]: Bitmask };
    },
  ): { [key: string]: Structure } {
    const builtStructures: { [key: string]: Structure } = {};
    const structuresToProcess = clone(structures);
    while (structuresToProcess.length > 0) {
      const builtStructuresDuringThisTurn: any[] = [];

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

  public buildStructure(
    globalEndianness: string,
    builtElements: {
      structures: { [key: string]: Structure };
      enumerations: { [key: string]: Enumeration };
      bitmasks: { [key: string]: Bitmask };
    },
    structure: any,
  ): Structure {
    const structureObject = new Structure(
      structure.name,
      map(structure.statements, (s) => s.buildStatement(builtElements)),
    );
    const endiannessAnnotation = find(structure.annotations, (h) => h.name === "endianness");
    const structureEndianness = get(endiannessAnnotation, "value", globalEndianness);
    structureObject.setEndianness(defaultTo(structureEndianness, globalEndianness));
    return structureObject;
  }

  public buildEnumeration(enumeration: any): Enumeration {
    const entries = map(enumeration.entries, this.buildEnumEntry);
    return new Enumeration(enumeration.name, enumeration.parentType, entries);
  }

  public buildBitmask(bitmask: any): Bitmask {
    const entries = map(bitmask.entries, this.buildBitmaskEntry);
    return new Bitmask(bitmask.name, bitmask.parentType, entries);
  }

  public buildEnumEntry(entry: any): EnumEntry {
    return new EnumEntry(entry.key, entry.value);
  }

  public buildBitmaskEntry(entry: any): BitmaskEntry {
    return new BitmaskEntry(entry.key, entry.value);
  }
}
