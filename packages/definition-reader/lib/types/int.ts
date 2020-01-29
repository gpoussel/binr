import { BufferWrapper } from "@binr/shared";

import { Type } from "./type";

export class IntType extends Type {
  private size: number;
  constructor(size: number) {
    super();
    this.size = size;
  }

  public read(buffer: BufferWrapper) {
    return buffer.readInt(this.size);
  }
}
