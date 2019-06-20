"use strict";

import assert from "assert";

export class Structure {
  private name: string;
  private statements: any[];
  private endianness: string;

  constructor(name, statements) {
    this.name = name;
    this.statements = statements;
  }

  public setEndianness(endianness) {
    assert(endianness === "big" || endianness === "little");
    this.endianness = endianness;
  }

  public getEndianness() {
    return this.endianness;
  }
}
