"use strict";

/**
 * This object is exposed in structure definition through "_" global variable
 */
class StreamObject {
  constructor(bufferWrapper) {
    this.bufferWrapper = bufferWrapper;
  }

  eof() {
    return this.bufferWrapper.cursor === this.bufferWrapper.buffer.length;
  }

  size() {
    return this.bufferWrapper.buffer.length;
  }

  seek(pos) {
    this.bufferWrapper.seek(pos);
  }

  skip(pos) {
    this.bufferWrapper.skip(pos);
  }

  tell() {
    return this.bufferWrapper.buffer.cursor;
  }
}

module.exports = StreamObject;
