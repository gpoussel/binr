"use strict";

const fs = require("fs");
const _ = require("lodash");
const DefinitionReader = require("../lib/definition-reader");
const { Definition } = require("@binr/model");

const pathToFixtures = `${__dirname}/../__fixtures__/`;

function createAndCallParser(input) {
  return () => {
    const reader = new DefinitionReader();
    return reader.readInput(input);
  };
}

describe("DefinitionReader", () => {
  test("throws an error on invalid input type", () => {
    _.each([null, 123, a => a], value => {
      expect(createAndCallParser(value)).toThrow(/input/);
    });
  });

  test("throws an error when lexing invalid input", () => {
    expect(createAndCallParser("👍")).toThrow(/lexing/);
  });

  test("throws an error when parsing invalid input", () => {
    _.each(["#bar", "struct {}", "123", "beep", "##"], value => {
      expect(createAndCallParser(value)).toThrow(/parsing/);
    });
  });

  test("throws an error on invalid content", () => {
    _.each(["struct a {} struct a {}", "struct a {int a; int a;}", ""], value => {
      expect(createAndCallParser(value)).toThrow(/validation/i);
    });
  });

  test("accepts minimal input", () => {
    _.each(['#set "foo" struct a {}', "#set 32 struct b {}", "struct a {}"], value => {
      expect(createAndCallParser(value)()).toBeDefined();
    });
  });

  test(`parses GIF format definition`, () => {
    const structure = fs.readFileSync(`${pathToFixtures}/gif.binr`, "utf-8");
    const result = createAndCallParser(structure)();
    expect(result).toBeInstanceOf(Definition);
  });
});
