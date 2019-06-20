"use strict";

/**
 * This object is exposed in structure definition through "_" global variable
 */
export class StreamObject {
  private bufferWrapper: any;

  constructor(bufferWrapper) {
    this.bufferWrapper = bufferWrapper;
  }

  public eof() {
    return this.bufferWrapper.cursor === this.bufferWrapper.buffer.length;
  }

  public size() {
    return this.bufferWrapper.buffer.length;
  }

  public seek(pos) {
    this.bufferWrapper.seek(pos);
  }

  public skip(pos) {
    this.bufferWrapper.skip(pos);
  }

  public tell() {
    return this.bufferWrapper.buffer.cursor;
  }
}
