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
  test("throws an error on invalid input", () => {
    expect(createAndCallParser(null)).toThrow(/input/);
    expect(createAndCallParser(123)).toThrow(/input/);
  });

  test("accepts minimal input", () => {
    expect(createAndCallParser('#set "foo"')()).toBeDefined();
  });
  _.each(["gif"], file => {
    test(`parses ${file} format`, () => {
      const structure = fs.readFileSync(`${pathToFixtures}/${file}.binr`, "utf-8");
      expect(createAndCallParser(structure)()).toBeDefined();
    });
  });
});
