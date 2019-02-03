"use strict";

const assert = require("assert");

class Structure {
  constructor(name, fields) {
    this.name = name;
    this.fields = fields;
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
