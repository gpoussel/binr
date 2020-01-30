import { BufferWrapper } from "@binr/shared";

import { Type } from "./type";

export class CharType extends Type {
  public read(buffer: BufferWrapper) {
    return buffer.readAsciiString(1);
  }
}
