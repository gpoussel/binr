"use strict";

const _ = require("lodash");

const ExpressionConverter = require("../lib/expression-converter");

describe("ExpressionConverter", () => {
  test("converts simple expressions", () => {
    const converter = new ExpressionConverter();
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
        "~1",
        "!a",
        "a>>1",
        "a>>>b",
        "-4",
        "[1][0]",
        "[,a, c ][1]",
      ],
      entry => {
        const result = converter.convert(entry);
        expect(result).toBeDefined();
      }
    );
  });

  test("rejects expressions with side-effects", () => {
    const converter = new ExpressionConverter();
    _.each(["a++", "a--", "++a", "--a"], entry => {
      expect(() => converter.convert(entry)).toThrow(/supported/);
    });
  });
});
