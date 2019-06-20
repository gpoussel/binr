"use strict";

import { Type } from "./type";

export class WCharType extends Type {
  public constructor(typeRestriction) {
    super();
    // TODO
  }
  public read(buffer) {
    return buffer.readUtf16String(2);
  }
}
