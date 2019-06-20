"use strict";

const assert = require("assert");

export class Structure {
  private name: string;
  private statements: any[];
  private endianness: string;

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
