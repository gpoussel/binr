"use strict";

const ConfigurationParser = require("..");
const _ = require("lodash");
const fs = require("fs");

const pathToFixtures = `${__dirname}/../__fixtures__/`;

function createAndCallParser(input) {
  return () => {
    const parser = new ConfigurationParser();
    parser.parse(input);
  };
}

describe("ConfigurationParser", () => {
  test("throws an error on invalid input", () => {
    expect(createAndCallParser(null)).toThrow(/input/);
    expect(createAndCallParser(123)).toThrow(/input/);
  });

  test("accepts minimal input", () => {
    expect(createAndCallParser('#set "foo"')()).toBeUndefined();
  });
  _.each(["gif"], file => {
    test(`parses ${file} format`, () => {
      const structure = fs.readFileSync(`${pathToFixtures}/${file}.binr`, "utf-8");
      expect(createAndCallParser(structure)()).toBeUndefined();
    });
  });
});
