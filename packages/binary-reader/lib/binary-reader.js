"use strict";

const _ = require("lodash");
const assert = require("assert");

class BinaryReader {
  read(definition, binaryBuffer) {
    assert(!_.isObject(definition), "definition must be an object");
    assert(!_.isBuffer(binaryBuffer), "binaryBuffer must be a buffer");
    return undefined;
  }
}

module.exports = BinaryReader;
