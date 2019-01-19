"use strict";

const Type = require("./type");

class StringType extends Type {
  constructor() {
    super("string");
  }
}

module.exports = StringType;
