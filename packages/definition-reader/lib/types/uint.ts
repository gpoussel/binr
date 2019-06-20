"use strict";

import { Type } from "./type";

export class UintType extends Type {
  constructor(size) {
    super();
    this.size = size;
  }

  public read(buffer) {
    return buffer.readUint(this.size);
  }
}
