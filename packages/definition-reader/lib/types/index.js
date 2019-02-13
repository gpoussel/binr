"use strict";

const ArrayType = require("./array");
const ArrayUntilType = require("./array-until");
const BitmaskType = require("./bitmask");
const CharArrayType = require("./char-array");
const CharType = require("./char");
const CStringType = require("./cstring");
const DoubleType = require("./double");
const EnumerationType = require("./enumeration");
const IntType = require("./int");
const StructureType = require("./structure");
const UintType = require("./uint");
const WCharType = require("./wchar");

const builtInTypes = {
  char: type => new CharType(type.typeRestriction),
  cstring: type => new CStringType(type.typeRestriction),
  double: () => new DoubleType(),
  int: type => new IntType(type.typeRestriction),
  uint: type => new UintType(type.typeRestriction),
  wchar: type => new WCharType(type.typeRestriction),
};

module.exports = {
  ArrayType,
  ArrayUntilType,
  BitmaskType,
  builtInTypes,
  CharArrayType,
  CharType,
  CStringType,
  DoubleType,
  EnumerationType,
  IntType,
  StructureType,
  UintType,
  WCharType,
};
