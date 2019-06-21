import { BufferWrapper } from "./buffer-wrapper";

/**
 * This object is exposed in structure definition through "_" global variable
 */
export class StreamObject {
  private bufferWrapper: BufferWrapper;

  constructor(bufferWrapper: BufferWrapper) {
    this.bufferWrapper = bufferWrapper;
  }

  public eof() {
    return this.bufferWrapper.cursor === this.bufferWrapper.buffer.length;
  }

  public size() {
    return this.bufferWrapper.buffer.length;
  }

  public seek(pos: number) {
    this.bufferWrapper.seek(pos);
  }

  public skip(pos: number) {
    this.bufferWrapper.skip(pos);
  }

  public tell() {
    return this.bufferWrapper.cursor;
  }
}
