import * as assert from "assert";
import { includes, isUndefined, times } from "lodash";

export class BufferWrapper {
  public buffer: Buffer;
  public cursor: number;
  private positionInCurrentByte: number;
  private currentByte: number | undefined;
  private endianness: string; // TODO enumeration

  constructor(buffer: Buffer, endianness: string) {
    assert(
      includes(["big", "little"], endianness),
      `'endianness' must be either 'big' or 'little', found: ${endianness}`,
    );

    this.buffer = buffer;
    this.cursor = 0;
    this.currentByte = undefined;
    this.positionInCurrentByte = 0;
    this.endianness = endianness;
  }

  public skip(length: number) {
    this.cursor += length;
  }

  public seek(length: number) {
    this.cursor = length;
  }

  public readAsciiString(length: number) {
    const stringValue = this.buffer.toString("ascii", this.cursor, this.cursor + length);
    this.cursor += length;
    return stringValue;
  }

  public readUtf16String(length: number) {
    const stringValue = this.buffer.toString("utf16le", this.cursor, this.cursor + length);
    this.cursor += length;
    return stringValue;
  }

  public readUint(length: number) {
    if (length === 8) {
      return this.readUnsignedByte();
    }
    if (includes([16, 32], length)) {
      return this.readAndIncrementOffset(length, false);
    }
    if (length < 8) {
      this.readByteForBitsetIfNecessary(this.readUnsignedByte.bind(this));
      if (this.positionInCurrentByte + length > 8) {
        throw new Error(`Invalid byte offset position = ${this.positionInCurrentByte}, length = ${length}`);
      }
      const value = (this.currentByte! >> (8 - length - this.positionInCurrentByte)) & ((1 << length) - 1);
      this.positionInCurrentByte += length;
      this.resetBitsetIfNecessary();
      return value;
    }
    throw new Error(`length = ${length} not supported`);
  }

  public readInt(length: number) {
    if (length === 8) {
      return this.readSignedByte();
    }
    if (includes([16, 32], length)) {
      return this.readAndIncrementOffset(length, true);
    }
    if (length < 8) {
      this.readByteForBitsetIfNecessary(this.readSignedByte.bind(this));
      if (this.positionInCurrentByte + length > 8) {
        throw new Error(`Invalid byte offset position = ${this.positionInCurrentByte}, length = ${length}`);
      }
      const value = (this.currentByte! >> (8 - length - this.positionInCurrentByte)) & ((1 << length) - 1);
      this.positionInCurrentByte += length;
      this.resetBitsetIfNecessary();
      return value;
    }
    throw new Error(`length = ${length} not supported`);
  }

  public readDouble() {
    const value = this.isBigEndian()
      ? this.buffer.readDoubleBE(this.cursor)
      : this.buffer.readDoubleLE(this.cursor);
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

  public readSignedBytes(count: number) {
    return this.readBytes(count, this.readSignedByte.bind(this));
  }

  public readUnsignedBytes(count: number) {
    return this.readBytes(count, this.readUnsignedByte.bind(this));
  }

  public readBytes(count: number, fn: () => number) {
    assert(count > 0, "count must be > 0");
    const bytes: number[] = [];
    times(count, () => {
      bytes.push(fn());
    });
    return bytes;
  }

  public resetBitsetIfNecessary() {
    if (this.positionInCurrentByte === 8) {
      // We have just stopped at the end of the byte => reset
      this.currentByte = undefined;
      this.positionInCurrentByte = 0;
    }
  }

  public readByteForBitsetIfNecessary(fn: () => number) {
    if (isUndefined(this.currentByte)) {
      this.currentByte = fn();
      this.positionInCurrentByte = 0;
    }
  }

  public isBigEndian() {
    return this.endianness === "big";
  }

  public setEndianness(endianness: string) {
    assert(
      includes(["big", "little"], endianness),
      `'endianness' must be either 'big' or 'little', found: ${endianness}`,
    );
    this.endianness = endianness;
  }

  private readAndIncrementOffset(size: number, signed: boolean) {
    const methodName = (signed ? "readInt" : "readUInt") + size + (this.isBigEndian() ? "BE" : "LE");
    const value = (this.buffer as any)[methodName](this.cursor);
    this.cursor += size / 8;
    return value;
  }
}
