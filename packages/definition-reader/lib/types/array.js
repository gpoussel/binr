"use strict";

const _ = require("lodash");

const Type = require("./type");

class ArrayType extends Type {
  constructor(innerType, size) {
    super();
    this.innerType = innerType;
    this.size = size;
  }

  read(buffer) {
    return _.times(this.size, () => this.innerType.read(buffer));
  }
}

module.exports = ArrayType;
