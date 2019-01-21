"use strict";

const Type = require("./type");

class UintType extends Type {
  constructor(size) {
    super();
    this.size = size;
  }
}

module.exports = UintType;
