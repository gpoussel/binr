import { Type } from "./type";

export class WCharType extends Type {
  public constructor() {
    super();
  }
  public read(buffer) {
    return buffer.readUtf16String(2);
  }
}
