"use strict";

const Type = require("./type");

class CStringType extends Type {
  read(buffer) {
    let str = "";
    let byte = buffer.readByte();
    while (byte !== 0) {
      str += String.fromCharCode(byte);
      byte = buffer.readByte();
    }
    return str;
  }
}

module.exports = CStringType;