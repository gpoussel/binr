import { BufferWrapper, Environment } from "@binr/shared";

export abstract class Type {
  public abstract read(buffer: BufferWrapper, environment: Environment): any;
}
