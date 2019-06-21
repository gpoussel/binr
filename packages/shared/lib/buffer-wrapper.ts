import * as assert from "assert";
import { includes, isBuffer, isUndefined, times } from "lodash";

export class BufferWrapper {
  private buffer: Buffer;
  private cursor: number;
  private positionInCurrentByte: number;
  private currentByte: number;
  private endianness: string; // TODO enumeration

  constructor(buffer, endianness) {
    assert(isBuffer(buffer), "'buffer' argument must be a buffer");

    this.buffer = buffer;
    this.cursor = 0;
    this.currentByte = undefined;
    this.positionInCurrentByte = 0;
    this.setEndianness(endianness);
  }

  public skip(length) {
    this.cursor += length;
  }

  public seek(length) {
    this.cursor = length;
  }

  public readAsciiString(length) {
    const stringValue = this.buffer.toString("ascii", this.cursor, this.cursor + length);
    this.cursor += length;
    return stringValue;
  }

  public readUtf16String(length) {
    const stringValue = this.buffer.toString("utf16le", this.cursor, this.cursor + length);
    this.cursor += length;
    return stringValue;
  }

  public readUint(length) {
    if (length === 8) {
      return this.readUnsignedByte();
    }
    if (includes([16, 32], length)) {
      return this.readAndIncrementOffset(length, "readUInt");
    }
    if (length < 8) {
      this.readByteForBitsetIfNecessary(this.readUnsignedByte.bind(this));
      if (this.positionInCurrentByte + length > 8) {
        throw new Error(`Invalid byte offset position = ${this.positionInCurrentByte}, length = ${length}`);
      }
      const value = (this.currentByte >> (8 - length - this.positionInCurrentByte)) & ((1 << length) - 1);
      this.positionInCurrentByte += length;
      this.resetBitsetIfNecessary();
      return value;
    }
    throw new Error(`length = ${length} not supported`);
  }

  public readInt(length) {
    if (length === 8) {
      return this.readSignedByte();
    }
    if (includes([16, 32], length)) {
      return this.readAndIncrementOffset(length, "readInt");
    }
    if (length < 8) {
      this.readByteForBitsetIfNecessary(this.readSignedByte.bind(this));
      if (this.positionInCurrentByte + length > 8) {
        throw new Error(`Invalid byte offset position = ${this.positionInCurrentByte}, length = ${length}`);
      }
      const value = (this.currentByte >> (8 - length - this.positionInCurrentByte)) & ((1 << length) - 1);
      this.positionInCurrentByte += length;
      this.resetBitsetIfNecessary();
      return value;
    }
    throw new Error(`length = ${length} not supported`);
  }

  public readDouble() {
    const value = this.buffer[`readDouble${this.isBigEndian() ? "BE" : "LE"}`](this.cursor);
    this.cursor += 8;
    return value;
  }

  public readSignedByte() {
    const value = this.buffer.readInt8(this.cursor);
    this.cursor += 1;
    return value;
  }

  public readUnsignedByte() {
    const value = this.buffer.readUInt8(this.cursor);
    this.cursor += 1;
    return value;
  }

  public readSignedBytes(count) {
    return this.readBytes(count, this.readSignedByte.bind(this));
  }

  public readUnsignedBytes(count) {
    return this.readBytes(count, this.readUnsignedByte.bind(this));
  }

  public readBytes(count, fn) {
    assert(count > 0, "count must be > 0");
    const bytes = [];
    times(count, () => {
      bytes.push(fn());
    });
    return bytes;
  }

  public readAndIncrementOffset(size, method) {
    const value = this.buffer[method + size + (this.isBigEndian() ? "BE" : "LE")](this.cursor);
    this.cursor += size / 8;
    return value;
  }

  public resetBitsetIfNecessary() {
    if (this.positionInCurrentByte === 8) {
      // We have just stopped at the end of the byte => reset
      this.currentByte = undefined;
      this.positionInCurrentByte = 0;
    }
  }

  public readByteForBitsetIfNecessary(fn) {
    if (isUndefined(this.currentByte)) {
      this.currentByte = fn();
      this.positionInCurrentByte = 0;
    }
  }

  public isBigEndian() {
    return this.endianness === "big";
  }

  public setEndianness(endianness) {
    assert(
      includes(["big", "little"], endianness),
      `'endianness' must be either 'big' or 'little', found: ${endianness}`,
    );
    this.endianness = endianness;
  }
}
