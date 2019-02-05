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

  test("throws an error on invalid length", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([]), "big");
    expect(() => bufferWrapper.readUint(9)).toThrow(/length/);
  });

  test("throws an error on invalid bitset", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([1, 2]), "big");
    expect(bufferWrapper.readUint(7)).toBe(0);
    expect(() => bufferWrapper.readUint(2)).toThrow(/length/);
  });

  test("reads bitset properly", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([255, 0]), "big");
    expect(bufferWrapper.readUint(1)).toBe(1);
    expect(bufferWrapper.readUint(2)).toBe(3);
    expect(bufferWrapper.readUint(3)).toBe(7);
    expect(bufferWrapper.readUint(2)).toBe(3);
    expect(bufferWrapper.readUint(2)).toBe(0);
  });
});
