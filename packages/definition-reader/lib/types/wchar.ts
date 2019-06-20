"use strict";

import { Type } from "./type";

export class WCharType extends Type {
  public constructor(typeRestriction) {
    // TODO
  }
  public read(buffer) {
    return buffer.readUtf16String(2);
  }
}
