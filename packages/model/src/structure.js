"use strict";

const assert = require("assert");

class Structure {
  constructor(name, statements) {
    this.name = name;
    this.statements = statements;
  }

  setEndianness(endianness) {
    assert(endianness === "big" || endianness === "little");
    this.endianness = endianness;
  }

  getEndianness() {
    return this.endianness;
  }
}

module.exports = Structure;
