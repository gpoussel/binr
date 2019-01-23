"use strict";

const Type = require("./type");

class UintType extends Type {
  constructor(size) {
    super();
    this.size = size;
  }

  read(buffer) {
    return buffer.readUint(this.size);
  }
}

module.exports = UintType;