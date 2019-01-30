"use strict";

const BufferWrapper = require("../lib/buffer-wrapper");

describe("BufferWrapper", () => {
  test("throws an error on invalid argument", () => {
    expect(() => new BufferWrapper(3)).toThrow();
    expect(() => new BufferWrapper()).toThrow();
    expect(() => new BufferWrapper("42")).toThrow();
    expect(() => new BufferWrapper(Buffer.from([]))).toThrow();
    expect(() => new BufferWrapper(Buffer.from([]), "42")).toThrow();
  });

  test("accepts a Buffer as argument", () => {
    expect(new BufferWrapper(Buffer.from([]), "big")).toBeDefined();
  });

  test("throws error on invalid types", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([65, 4, 1, 2]), "big");
    expect(() => bufferWrapper.readUint(3)).toThrow();
    expect(() => bufferWrapper.readInt(3)).toThrow();
  });

  test("read basic types on big-endian buffer", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([65, 4, 1, 2]), "big");
    expect(bufferWrapper.isBigEndian()).toBeTruthy();
    expect(bufferWrapper.readAsciiString(1)).toEqual("A");
    expect(bufferWrapper.readByte()).toEqual(4);
    expect(bufferWrapper.readBytes(2)).toEqual([1, 2]);
  });

  test("read int types on big-endian buffer", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([1, 2, 3, 7, 8, 9, 10]), "big");
    expect(bufferWrapper.readUint(8)).toEqual(1);
    expect(bufferWrapper.readUint(16)).toEqual(515);
    expect(bufferWrapper.readUint(32)).toEqual(117967114);
  });

  test("read int types on little-endian buffer", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([1, 2, 3, 7, 8, 9, 10]), "little");
    expect(bufferWrapper.readUint(8)).toEqual(1);
    expect(bufferWrapper.readUint(16)).toEqual(770);
    expect(bufferWrapper.readUint(32)).toEqual(168364039);
  });

  test("read uint types on big-endian buffer", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([1, 0xfe, 0xd4, 0xe7, 0xbd, 0xbe, 0xd4]), "big");
    expect(bufferWrapper.readInt(8)).toEqual(1);
    expect(bufferWrapper.readInt(16)).toEqual(-300);
    expect(bufferWrapper.readInt(32)).toEqual(-406995244);
  });

  test("read uint types on little-endian buffer", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([1, 0xd4, 0xfe, 0xd4, 0xbe, 0xbd, 0xe7]), "little");
    expect(bufferWrapper.readInt(8)).toEqual(1);
    expect(bufferWrapper.readInt(16)).toEqual(-300);
    expect(bufferWrapper.readInt(32)).toEqual(-406995244);
  });
});
