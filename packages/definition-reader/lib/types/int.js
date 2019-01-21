"use strict";

const Type = require("./type");

class IntType extends Type {
  constructor(size) {
    super();
    this.size = size;
  }
}

module.exports = IntType;
