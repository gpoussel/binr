import { join } from "lodash";

import { BufferWrapper, Environment } from "@binr/shared";
import { Type } from "./type";

export class CharArrayType extends Type {
  private arrayType: Type;
  constructor(arrayType: Type) {
    super();
    this.arrayType = arrayType;
  }

  public read(buffer: BufferWrapper, environment: Environment) {
    return join(this.arrayType.read(buffer, environment), "");
  }
}
