"use strict";

const _ = require("lodash");
const assert = require("assert");

class BufferWrapper {
  constructor(buffer, endianness) {
    assert(_.isBuffer(buffer), "'buffer' argument must be a buffer");

    this.buffer = buffer;
    this.cursor = 0;
    this.setEndianness(endianness);
  }

  readAsciiString(length) {
    const stringValue = this.buffer.toString("ascii", this.cursor, this.cursor + length);
    this.cursor += length;
    return stringValue;
  }

  readUtf16String(length) {
    const stringValue = this.buffer.toString("utf16le", this.cursor, this.cursor + length);
    this.cursor += length;
    return stringValue;
  }

  readUint(length) {
    if (length === 8) {
      return this.readByte();
    }
    if (_.includes([16, 32], length)) {
      return this.readAndIncrementOffset(length, "readUInt");
    }
    assert(false, `length = ${length} not supported`);
  }

  readInt(length) {
    if (length === 8) {
      return this.readByte();
    }
    if (_.includes([16, 32], length)) {
      return this.readAndIncrementOffset(length, "readInt");
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
    const value = this.buffer[method + size + (this.isBigEndian() ? "BE" : "LE")](this.cursor);
    this.cursor += size / 8;
    return value;
  }

  setEndianness(endianness) {
    assert(
      _.includes(["big", "little"], endianness),
      `'endianness' must be either 'big' or 'little', found: ${endianness}`
    );
    this.endianness = endianness;
  }
}

module.exports = BufferWrapper;
