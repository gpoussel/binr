"use strict";

const _ = require("lodash");
const DefinitionReader = require("../lib/definition-reader");
const { VariableScope } = require("@binr/shared");

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

  test("accepts field annotations", () => {
    _.each(["struct a { @ignore(false) int b; @ignore(true) int c; }"], value => {
      expect(createAndCallParser(value)()).toBeDefined();
    });
  });

  test("accepts expression", () => {
    _.each(
      [
        "2+3",
        "ar[0].c",
        "(1-2)*3",
        "a ? b : c",
        "(a && b) || 5",
        "((a && b) || c) ^ d",
        "a | b",
        "a & b",
        "ob.b",
        "f(b,c)",
        "a === b ? 1 : 0",
        "a == b ? 1 : 0",
        "a != b ? 1 : 0",
        "a !== b ? 1 : 0",
        "~1",
        "!a",
        "+a",
        "a>>1",
        "a>>>b",
        "-4",
        "[1][0]",
        "[,a, c ][1]",
      ],
      value => {
        const result = createAndCallParser(`struct a { int foo[${value}]; }`)();
        expect(result).toBeDefined();
        const resultFn = _.first(_.first(result.structures).fields).type.sizeExpression;
        const scope = new VariableScope();
        scope.put("a", 1);
        scope.put("b", 11);
        scope.put("c", 5);
        scope.put("d", 3);
        scope.put("ar", [
          {
            c: 1,
          },
        ]);
        scope.put("ob", {
          b: 4,
        });
        scope.put("f", () => 1);
        expect(resultFn).toBeDefined();

        // eslint-disable-next-line no-eval
        const size = eval(resultFn)(scope);
        expect(size).toBeDefined();
      }
    );
  });
  test("rejects unsupported expression", () => {
    _.each(["a++", "a--", "++a", "--a"], value => {
      expect(createAndCallParser(`struct a { int foo[${value}]; }`)).toThrow(/supported/);
    });
  });
  test("rejects invalid expression", () => {
    _.each(["+", "())"], value => {
      expect(createAndCallParser(`struct a { int foo[${value}]; }`)).toThrow(/parsing/);
    });
  });
});
