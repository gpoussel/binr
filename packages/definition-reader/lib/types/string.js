"use strict";

const Type = require("./type");

class StringType extends Type {
  constructor(size) {
    super();
    this.size = size;
  }

  read(buffer) {
    return buffer.readAsciiString(this.size);
  }
}

module.exports = StringType;
