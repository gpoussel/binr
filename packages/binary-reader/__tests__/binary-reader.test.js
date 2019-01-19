"use strict";

const BinaryReader = require("..");

const { Definition, Structure } = require("@binr/model");

const reader = new BinaryReader();

describe("BinaryReader", () => {
  test("throws an error on invalid arguments", () => {
    expect(() => {
      reader.read(new Definition(), null);
    }).toThrow();

    expect(() => {
      reader.read("a", Buffer.from([]));
    }).toThrow();
  });
});
