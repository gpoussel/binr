"use strict";

const Type = require("./type");

class WCharType extends Type {
  read(buffer) {
    return buffer.readUtf16String(2);
  }
}

module.exports = WCharType;
