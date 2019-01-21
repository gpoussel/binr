"use strict";

const StringType = require("./string");
const UintType = require("./uint");
const IntType = require("./int");
const StructureType = require("./structure");

const builtInTypes = {
  string: () => new StringType(),
  uint: () => new UintType(),
  int: () => new IntType(),
};

module.exports = {
  StringType,
  UintType,
  IntType,
  StructureType,
  builtInTypes,
};
