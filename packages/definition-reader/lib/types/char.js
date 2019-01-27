"use strict";

const Type = require("./type");

class CharType extends Type {
  read(buffer) {
    return buffer.readAsciiString(1);
  }
}

module.exports = CharType;
