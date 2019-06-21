import * as assert from "assert";
import { find, get, isBuffer, isObject, isUndefined } from "lodash";

import { StructureType } from "@binr/definition-reader";
import { BufferWrapper, Environment, StreamObject } from "@binr/shared";

export class BinaryReader {
  public read(binaryBuffer, definition, providedStructureName?) {
    assert(isObject(definition), "definition must be an object");
    assert(isBuffer(binaryBuffer), "binaryBuffer must be a buffer");

    let mainStructureName;
    if (isUndefined(providedStructureName)) {
      // No structure provided: assume there is only one in the definition
      // Otherwise that's an error
      assert(
        get(definition, "structures.length") === 1,
        "No 'structureName' provided: structures.length must be === 1",
      );
      mainStructureName = definition.structures[0].name;
    } else {
      mainStructureName = providedStructureName;
    }

    const mainStructure = find(definition.structures, (s) => s.name === mainStructureName);
    assert(!isUndefined(mainStructure), `Main structure '${mainStructureName}' not found`);

    const structureType = new StructureType(mainStructure);
    const bufferWrapper = new BufferWrapper(binaryBuffer, mainStructure.endianness);

    const streamObject = new StreamObject(bufferWrapper);
    const environment = new Environment(streamObject);

    return structureType.read(bufferWrapper, environment);
  }
}
