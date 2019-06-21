import { Type } from "./type";

export class DoubleType extends Type {
  public read(buffer) {
    return buffer.readDouble();
  }
}
