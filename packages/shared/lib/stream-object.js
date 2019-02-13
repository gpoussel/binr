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
}

module.exports = StreamObject;
