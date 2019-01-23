"use strict";

const _ = require("lodash");
const assert = require("assert");

class BufferWrapper {
  constructor(buffer) {
    assert(_.isBuffer(buffer), "'buffer' argument must be a buffer");
    this.buffer = buffer;
    this.cursor = 0;
    this.endianness = "big";
  }

  readAsciiString(length) {
    const stringValue = this.buffer.toString("ascii", this.cursor, this.cursor + length);
    this.cursor += length;
    return stringValue;
  }

  readUint(length) {
    if (length === 8) {
      return this.readByte();
    }
    if (_.includes([16, 32], length)) {
      return this.readAndIncrementOffset(length / 8, "readUInt");
    }
    if (length === 24) {
      const bytes = this.readBytes(3);
      return (bytes[this.isBigEndian() ? 0 : 2] << 16) | (bytes[1] << 8) | bytes[this.isBigEndian() ? 2 : 0];
    }
    assert(false, `length = ${length} not supported`);
  }

  readInt(length) {
    if (length === 8) {
      return this.readByte();
    }
    if (_.includes([16, 32], length)) {
      return this.readAndIncrementOffset(length / 8, "readInt");
    }
    if (length === 24) {
      const uintValue = this.readUint(length);
      const negative = uintValue & 0x800000;
      if (!negative) {
        return uintValue;
      }
      return -(0xffffff - uintValue + 1);
    }
    assert(false, `length = ${length} not supported`);
  }

  isBigEndian() {
    return this.endianness === "big";
  }

  readByte() {
    const value = this.buffer.readInt8(this.cursor);
    this.cursor += 1;
    return value;
  }

  readBytes(count) {
    assert(count > 0, "count must be > 0");
    const bytes = [];
    _.times(count, () => {
      bytes.push(this.readByte());
    });
    return bytes;
  }

  readAndIncrementOffset(size, method) {
    const value = this.buffer[method + (this.isBigEndian() ? "BE" : "LE")](this.cursor);
    this.cursor += size;
    return value;
  }
}

module.exports = BufferWrapper;
