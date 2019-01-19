"use strict";

const DefinitionReader = require("../lib/definition-reader");
const _ = require("lodash");
const fs = require("fs");

const pathToFixtures = `${__dirname}/../__fixtures__/`;

function createAndCallParser(input) {
  return () => {
    const reader = new DefinitionReader();
    return reader.readInput(input);
  };
}

describe("DefinitionReader", () => {
  test("throws an error on invalid input type", () => {
    expect(createAndCallParser(null)).toThrow(/input/);
    expect(createAndCallParser(123)).toThrow(/input/);
  });

  test("throws an error when parsing invalid input", () => {
    expect(createAndCallParser("#bar")).toThrow(/parsing/);
    expect(createAndCallParser("struct {}")).toThrow(/parsing/);
    expect(createAndCallParser("123")).toThrow(/parsing/);
    expect(createAndCallParser("beep")).toThrow(/parsing/);
  });

  test("accepts empty input", () => {
    expect(createAndCallParser("")()).toBeDefined();
  });

  test("accepts minimal input", () => {
    expect(createAndCallParser('#set "foo"')()).toBeDefined();
    expect(createAndCallParser("#set 32")()).toBeDefined();
    expect(createAndCallParser("struct a {}")()).toBeDefined();
  });

  _.each(["gif"], file => {
    test(`parses ${file} format`, () => {
      const structure = fs.readFileSync(`${pathToFixtures}/${file}.binr`, "utf-8");
      expect(createAndCallParser(structure)()).toBeDefined();
    });
  });
});
