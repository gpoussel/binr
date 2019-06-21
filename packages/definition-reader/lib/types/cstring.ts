import { BufferWrapper } from "@binr/shared";
import { Type } from "./type";

export class CStringType extends Type {
  public constructor() {
    super();
  }
  public read(buffer: BufferWrapper) {
    let str = "";
    let byte = buffer.readUnsignedByte();
    while (byte !== 0) {
      str += String.fromCharCode(byte);
      byte = buffer.readUnsignedByte();
    }
    return str;
  }
}
