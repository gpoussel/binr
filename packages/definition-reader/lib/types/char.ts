import { Type } from "./type";

export class CharType extends Type {
  public constructor(typeRestriction) {
    super();
    // TODO
  }

  public read(buffer) {
    return buffer.readAsciiString(1);
  }
}
