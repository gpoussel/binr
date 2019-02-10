const Definition = require("./src/definition");
const Structure = require("./src/structure");
const Enumeration = require("./src/enumeration");
const EnumEntry = require("./src/enum-entry");
const Bitmask = require("./src/bitmask");
const BitmaskEntry = require("./src/bitmask-entry");
const FieldStatement = require("./src/statement/field");
const IfStatement = require("./src/statement/if");
const BlockStatement = require("./src/statement/block");

module.exports = {
  Definition,
  Structure,
  Enumeration,
  EnumEntry,
  Bitmask,
  BitmaskEntry,
  // Statements
  FieldStatement,
  IfStatement,
  BlockStatement,
};
