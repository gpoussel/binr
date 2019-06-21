import { BufferWrapper } from "@binr/shared";
import { Type } from "./type";

export class DoubleType extends Type {
  public read(buffer: BufferWrapper) {
    return buffer.readDouble();
  }
}
