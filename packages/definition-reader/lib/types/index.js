const StringType = require("./string");
const UintType = require("./uint");
const StructureType = require("./structure");

module.exports = {
  StringType,
  UintType,
  StructureType,
  builtInTypes: [StringType, UintType],
};
