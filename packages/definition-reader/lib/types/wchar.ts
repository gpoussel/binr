import { BufferWrapper } from "@binr/shared";

import { Type } from "./type";

export class WCharType extends Type {
  public read(buffer: BufferWrapper) {
    return buffer.readUtf16String(2);
  }
}
