"use strict";

const assert = require("assert");

class Structure {
  constructor(name, fields) {
    this.name = name;
    this.fields = fields;
    this.setEndianness("big");
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
