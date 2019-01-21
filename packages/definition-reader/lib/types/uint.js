"use strict";

const Type = require("./type");

class UintType extends Type {
  constructor(size) {
    super();
    this.size = size;
  }

  read(buffer) {
    console.log(`Reading UInt of size ${this.size}`);
  }
}

module.exports = UintType;
