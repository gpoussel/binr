import assert from "assert";
import _ from "lodash";

import { StructureType } from "@binr/definition-reader";
import { BufferWrapper, Environment, StreamObject } from "@binr/shared";

export class BinaryReader {
  public read(binaryBuffer, definition, providedStructureName?) {
    assert(_.isObject(definition), "definition must be an object");
    assert(_.isBuffer(binaryBuffer), "binaryBuffer must be a buffer");

    let mainStructureName;
    if (_.isUndefined(providedStructureName)) {
      // No structure provided: assume there is only one in the definition
      // Otherwise that's an error
      assert(
        _.get(definition, "structures.length") === 1,
        "No 'structureName' provided: structures.length must be === 1",
      );
      mainStructureName = _.first(definition.structures).name;
    } else {
      mainStructureName = providedStructureName;
    }

    const mainStructure = _.find(definition.structures, (s) => s.name === mainStructureName);
    assert(!_.isUndefined(mainStructure), `Main structure '${mainStructureName}' not found`);

    const structureType = new StructureType(mainStructure);
    const bufferWrapper = new BufferWrapper(binaryBuffer, mainStructure.getEndianness());

    const streamObject = new StreamObject(bufferWrapper);
    const environment = new Environment(streamObject);

    return structureType.read(bufferWrapper, environment);
  }
}
