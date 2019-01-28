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
    _.each(
      [
        "struct a {} struct a {}",
        "struct a {int a; int a;}",
        "",
        '#set "b" #set "b" struct a {}',
        "struct int {}",
        "struct a { b b; }",
        "struct c { int:0 a; }",
        "struct c { int:255 a; }",
        "struct c { string a; }",
      ],
      value => {
        expect(createAndCallParser(value)).toThrow(/validation/i);
      }
    );
  });

  test("accepts minimal input", () => {
    _.each(['#set "foo" struct a {}', "#set 32 struct b {}", "struct a {}"], value => {
      expect(createAndCallParser(value)()).toBeDefined();
    });
  });

  test("accepts expression", () => {
    _.each(
      [
        "2+3",
        "a, b",
        "b[0].c",
        "(1-2)*3",
        "a ? b : c",
        "(a && b) || 5",
        "((a && b) || c) ^ d",
        "a | b",
        "a & b",
        "a.b",
        "a(b,c)",
        "a === b ? 1 : 0",
        "a == b ? 1 : 0",
        "a != b ? 1 : 0",
        "a !== b ? 1 : 0",
        "a++",
        "a--",
        "++a",
        "--a",
        "~1",
        "!a",
        "a>>1",
        "a>>>b",
        "-4",
        "[][0]",
        "[,a, c ]",
        '{a:5, b:6,0:c,"_":1, }.a',
      ],
      value => {
        const result = createAndCallParser(`struct a { int foo[${value}]; }`)();
        expect(result).toBeDefined();
        const resultSize = _.first(_.first(result.structures).fields).type.size;
        if (_.replace(value, / /g, "") !== _.replace(resultSize, / /g, "")) {
          console.log(`${value}: ${resultSize}`);
        }
      }
    );
  });
  test("rejects invalid expression", () => {
    _.each(["+", "())"], value => {
      expect(createAndCallParser(`struct a { int foo[${value}]; }`)).toThrow(/parsing/);
    });
  });
  test(`parses GIF format definition`, () => {
    const structure = fs.readFileSync(`${pathToFixtures}/gif.binr`, "utf-8");
    const result = createAndCallParser(structure)();
    expect(result).toBeInstanceOf(Definition);
  });
});
