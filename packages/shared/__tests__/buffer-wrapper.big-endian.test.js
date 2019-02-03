"use strict";

const BufferWrapper = require("../lib/buffer-wrapper");

describe("BufferWrapper, big endian", () => {
  test("read basic types on big-endian buffer", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([65, 4, 1, 2]), "big");
    expect(bufferWrapper.isBigEndian()).toBeTruthy();
    expect(bufferWrapper.readAsciiString(1)).toEqual("A");
    expect(bufferWrapper.readUnsignedByte()).toEqual(4);
    expect(bufferWrapper.readUnsignedBytes(2)).toEqual([1, 2]);
  });

  test("read int types on big-endian buffer", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([1, 2, 3, 7, 8, 9, 10]), "big");
    expect(bufferWrapper.readUint(8)).toEqual(1);
    expect(bufferWrapper.readUint(16)).toEqual(515);
    expect(bufferWrapper.readUint(32)).toEqual(117967114);
  });

  test("read uint types on big-endian buffer", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([1, 0xfe, 0xd4, 0xe7, 0xbd, 0xbe, 0xd4]), "big");
    expect(bufferWrapper.readInt(8)).toEqual(1);
    expect(bufferWrapper.readInt(16)).toEqual(-300);
    expect(bufferWrapper.readInt(32)).toEqual(-406995244);
  });
});
