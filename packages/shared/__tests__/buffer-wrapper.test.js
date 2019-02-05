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

  test("throws an error on invalid length (unsigned)", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([]), "big");
    expect(() => bufferWrapper.readUint(9)).toThrow(/length/);
  });

  test("throws an error on invalid bitset (unsigned)", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([1, 2]), "big");
    expect(bufferWrapper.readUint(7)).toBe(0);
    expect(() => bufferWrapper.readUint(2)).toThrow(/length/);
  });

  test("throws an error on invalid length (signed)", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([]), "big");
    expect(() => bufferWrapper.readInt(9)).toThrow(/length/);
  });

  test("throws an error on invalid bitset (signed)", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([1, 2]), "big");
    expect(bufferWrapper.readInt(7)).toBe(0);
    expect(() => bufferWrapper.readInt(2)).toThrow(/length/);
  });

  test("reads bitset properly with unsigned integer", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([255, 0]), "big");
    expect(bufferWrapper.readUint(1)).toBe(1);
    expect(bufferWrapper.readUint(2)).toBe(3);
    expect(bufferWrapper.readUint(3)).toBe(7);
    expect(bufferWrapper.readUint(2)).toBe(3);
    expect(bufferWrapper.readUint(2)).toBe(0);
  });

  test("reads bitset properly with signed integer", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([255, 0]), "big");
    expect(bufferWrapper.readInt(1)).toBe(1);
    expect(bufferWrapper.readInt(2)).toBe(3);
    expect(bufferWrapper.readInt(3)).toBe(7);
    expect(bufferWrapper.readInt(2)).toBe(3);
    expect(bufferWrapper.readInt(2)).toBe(0);
  });

  test("reads bytes (unsigned)", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([255, 30]), "big");
    expect(bufferWrapper.readUnsignedBytes(2)).toEqual([255, 30]);
  });

  test("reads bytes (signed)", () => {
    const bufferWrapper = new BufferWrapper(Buffer.from([255, 30]), "big");
    expect(bufferWrapper.readSignedBytes(2)).toEqual([-1, 30]);
  });

  test("reads double (big endian)", () => {
    const bufferWrapper = new BufferWrapper(
      Buffer.from([0x40, 0x20, 0x2f, 0xff, 0x0f, 0x02, 0x22, 0x20]),
      "big"
    );
    expect(bufferWrapper.readDouble()).toBeCloseTo(8.0937428178, 1e-8);
  });

  test("reads double (little endian)", () => {
    const bufferWrapper = new BufferWrapper(
      Buffer.from([0x20, 0x22, 0x02, 0x0f, 0xff, 0x2f, 0x20, 0x40]),
      "little"
    );
    expect(bufferWrapper.readDouble()).toBeCloseTo(8.0937428178, 1e-8);
  });
});
