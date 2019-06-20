"use strict";

import { Type } from "./type";

export class IntType extends Type {
  private size: any;
  constructor(size) {
    super();
    this.size = size;
  }

  public read(buffer) {
    return buffer.readInt(this.size);
  }
}
