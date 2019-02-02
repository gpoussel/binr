"use strict";

const BufferWrapper = require("../lib/buffer-wrapper");

describe("BufferWrapper, little endian", () => {
  test("read int types on little-endian buffer", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([1, 2, 3, 7, 8, 9, 10]), "little");
    expect(bufferWrapper.readUint(8)).toEqual(1);
    expect(bufferWrapper.readUint(16)).toEqual(770);
    expect(bufferWrapper.readUint(32)).toEqual(168364039);
  });

  test("read uint types on little-endian buffer", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([1, 0xd4, 0xfe, 0xd4, 0xbe, 0xbd, 0xe7]), "little");
    expect(bufferWrapper.readInt(8)).toEqual(1);
    expect(bufferWrapper.readInt(16)).toEqual(-300);
    expect(bufferWrapper.readInt(32)).toEqual(-406995244);
  });
});
