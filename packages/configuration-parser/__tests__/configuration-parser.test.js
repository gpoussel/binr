"use strict";

const ConfigurationParser = require("..");

function createAndCallParser(input) {
  return () => {
    const parser = new ConfigurationParser();
    parser.parse(input);
  };
}

describe("configuration-parser", () => {
  test("throws an error on invalid input", () => {
    expect(createAndCallParser(null)).toThrow(/input/);
  });

  test("accepts minimal input", () => {
    expect(createAndCallParser("#define ")()).toBeUndefined();
  });
});
