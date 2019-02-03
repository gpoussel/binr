"use strict";

const Type = require("./type");

class DoubleType extends Type {
  read(buffer) {
    return buffer.readDouble();
  }
}

module.exports = DoubleType;
