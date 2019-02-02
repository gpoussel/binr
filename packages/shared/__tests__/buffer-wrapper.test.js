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
});
