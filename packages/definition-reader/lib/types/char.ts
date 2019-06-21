import { Type } from "./type";

export class CharType extends Type {
  public constructor() {
    super();
  }

  public read(buffer) {
    return buffer.readAsciiString(1);
  }
}
