"use strict";

const _ = require("lodash");
const assert = require("assert");

class BufferWrapper {
  constructor(buffer, endianness) {
    assert(_.isBuffer(buffer), "'buffer' argument must be a buffer");

    this.buffer = buffer;
    this.cursor = 0;
    this.currentByte = undefined;
    this.positionInCurrentByte = 0;
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
      return this.readUnsignedByte();
    }
    if (_.includes([16, 32], length)) {
      return this.readAndIncrementOffset(length, "readUInt");
    }
    if (length < 8) {
      this.readByteForBitsetIfNecessary(this.readUnsignedByte.bind(this));
      if (this.positionInCurrentByte + length >= 8) {
        throw new Error(`Invalid byte offset position = ${this.positionInCurrentByte}, length = ${length}`);
      }
      return (this.currentByte >> (8 - length - this.positionInCurrentByte)) & ((1 << length) - 1);
    }
    throw new Error(`length = ${length} not supported`);
  }

  readInt(length) {
    if (length === 8) {
      return this.readSignedByte();
    }
    if (_.includes([16, 32], length)) {
      return this.readAndIncrementOffset(length, "readInt");
    }
    if (length < 8) {
      this.readByteForBitsetIfNecessary(this.readSignedByte.bind(this));
      if (this.positionInCurrentByte + length >= 8) {
        throw new Error(`Invalid byte offset position = ${this.positionInCurrentByte}, length = ${length}`);
      }
      return (this.currentByte >> (8 - length - this.positionInCurrentByte)) & ((1 << length) - 1);
    }
    throw new Error(`length = ${length} not supported`);
  }

  readDouble() {
    const value = this.buffer[`readDouble${this.isBigEndian() ? "BE" : "LE"}`](this.cursor);
    this.cursor += 8;
    return value;
  }

  readSignedByte() {
    const value = this.buffer.readInt8(this.cursor);
    this.cursor += 1;
    return value;
  }

  readUnsignedByte() {
    const value = this.buffer.readUInt8(this.cursor);
    this.cursor += 1;
    return value;
  }

  readSignedBytes(count) {
    return this.readBytes(count, this.readSignedByte.bind(this));
  }

  readUnsignedBytes(count) {
    return this.readBytes(count, this.readUnsignedByte.bind(this));
  }

  readBytes(count, fn) {
    assert(count > 0, "count must be > 0");
    const bytes = [];
    _.times(count, () => {
      bytes.push(fn());
    });
    return bytes;
  }

  readAndIncrementOffset(size, method) {
    const value = this.buffer[method + size + (this.isBigEndian() ? "BE" : "LE")](this.cursor);
    this.cursor += size / 8;
    return value;
  }

  readByteForBitsetIfNecessary(fn) {
    if (_.isUndefined(this.currentByte)) {
      this.currentByte = fn();
      this.positionInCurrentByte = 0;
    }
  }

  isBigEndian() {
    return this.endianness === "big";
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
