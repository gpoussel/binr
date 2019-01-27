"use strict";

const StringType = require("./string");
const CharType = require("./char");
const UintType = require("./uint");
const IntType = require("./int");
const StructureType = require("./structure");
const ArrayType = require("./array");

const builtInTypes = {
  string: field => new StringType(field.typeRestriction),
  uint: () => new UintType(),
  int: () => new IntType(),
  char: () => new CharType(),
};

module.exports = {
  StringType,
  CharType,
  UintType,
  IntType,
  StructureType,
  ArrayType,
  builtInTypes,
};
