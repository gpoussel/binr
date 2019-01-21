"use strict";

const Type = require("./type");

class StringType extends Type {
  constructor(size) {
    super();
    this.size = size;
  }

  read(buffer) {
    console.log(`Reading string`);
  }
}

module.exports = StringType;
