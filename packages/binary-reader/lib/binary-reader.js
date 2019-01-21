"use strict";

const _ = require("lodash");
const assert = require("assert");

class BinaryReader {
  read(binaryBuffer, definition, providedStructureName = undefined) {
    assert(_.isObject(definition), "definition must be an object");
    assert(_.isBuffer(binaryBuffer), "binaryBuffer must be a buffer");

    let mainStructureName;
    if (_.isUndefined(providedStructureName)) {
      // No structure provided: assume there is only one in the definition
      // Otherwise that's an error
      assert(
        _.get(definition, "structures.length") === 1,
        `No 'structureName' provided: structures.length must be === 1`
      );
      mainStructureName = _.first(definition.structures).name;
    } else {
      mainStructureName = providedStructureName;
    }

    const mainStructure = _.find(definition.structures, s => s.name === mainStructureName);
    assert(!_.isUndefined(mainStructure), `Main structure '${mainStructureName} not found`);

    return this.readStructure(binaryBuffer, definition, mainStructure);
  }

  readStructure(binaryBuffer, definition, structure) {
    _.each(structure.fields, field => {
      console.log("Reading field: ", field);
    });
  }
}

module.exports = BinaryReader;
