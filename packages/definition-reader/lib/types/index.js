"use strict";

const CStringType = require("./cstring");
const CharType = require("./char");
const WCharType = require("./wchar");
const DoubleType = require("./double");
const UintType = require("./uint");
const IntType = require("./int");
const StructureType = require("./structure");
const ArrayType = require("./array");
const ArrayUntilType = require("./array-until");
const EnumerationType = require("./enumeration");
const BitmaskType = require("./bitmask");

const builtInTypes = {
  cstring: type => new CStringType(type.typeRestriction),
  uint: type => new UintType(type.typeRestriction),
  int: type => new IntType(type.typeRestriction),
  char: type => new CharType(type.typeRestriction),
  wchar: type => new WCharType(type.typeRestriction),
  double: () => new DoubleType(),
};

module.exports = {
  CStringType,
  CharType,
  WCharType,
  DoubleType,
  UintType,
  IntType,
  StructureType,
  ArrayType,
  ArrayUntilType,
  EnumerationType,
  BitmaskType,
  builtInTypes,
};
