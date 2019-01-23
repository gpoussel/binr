"use strict";

const Type = require("./type");

class IntType extends Type {
  constructor(size) {
    super();
    this.size = size;
  }

  read(buffer) {
    return buffer.readInt(this.size);
  }
}

module.exports = IntType;
