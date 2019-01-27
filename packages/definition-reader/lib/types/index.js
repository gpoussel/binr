"use strict";

const CStringType = require("./cstring");
const CharType = require("./char");
const UintType = require("./uint");
const IntType = require("./int");
const StructureType = require("./structure");
const ArrayType = require("./array");

const builtInTypes = {
  cstring: field => new CStringType(field.typeRestriction),
  uint: () => new UintType(),
  int: () => new IntType(),
  char: () => new CharType(),
};

module.exports = {
  CStringType,
  CharType,
  UintType,
  IntType,
  StructureType,
  ArrayType,
  builtInTypes,
};
