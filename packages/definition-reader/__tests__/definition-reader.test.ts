import { FieldStatement, Definition } from "@binr/model";
import { ExpressionEvaluator, FunctionScope, VariableScope } from "@binr/shared";
import { each } from "lodash";
import { DefinitionReader } from "../lib/definition-reader";

function createAndCallParser(input: string): () => Definition {
  return () => {
    const reader = new DefinitionReader();
    return reader.readInput(input);
  };
}

describe("DefinitionReader", () => {
  test("throws an error when lexing invalid input", () => {
    expect(createAndCallParser("👍")).toThrow(/lexing/);
  });

  test("throws an error when parsing invalid input", () => {
    each(["#bar", "struct {}", "123", "beep", "##"], (value: string) => {
      expect(createAndCallParser(value)).toThrow(/parsing/);
    });
  });

  test("throws an error on invalid content", () => {
    each(
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
      (value: string) => {
        expect(createAndCallParser(value)).toThrow(/validation/i);
      },
    );
  });

  test("accepts minimal input", () => {
    each(['#set "foo" struct a {}', "#set 32 struct b {}", "struct a {}"], (value: string) => {
      expect(createAndCallParser(value)()).toBeDefined();
    });
  });

  test("accepts field annotations", () => {
    each(["struct a { @ignore(false) int b; @ignore(true) int c; }"], (value: string) => {
      expect(createAndCallParser(value)()).toBeDefined();
    });
  });

  test("accepts bitmasks", () => {
    each(["bitmask foo extends int:16 { A = 10 } struct A {}"], (value: string) => {
      const result = createAndCallParser(value)();
      expect(result).toBeDefined();
      expect(result.bitmasks).toHaveLength(1);
    });
  });

  test("accepts enumerations", () => {
    each(["enum foo extends int:16 { A = 10 } struct A {}"], (value: string) => {
      const result = createAndCallParser(value)();
      expect(result).toBeDefined();
      expect(result.enumerations).toHaveLength(1);
    });
  });

  test("accepts expression", () => {
    const evaluator = new ExpressionEvaluator();
    each(
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
        "a == b ? 1 : 0",
        "a != b ? 1 : 0",
        "~1",
        "!a",
        "+a",
        "a>>1",
        "a>>>b",
        "-4",
        "[1][0]",
        "[,a, c ][1]",
      ],
      (value: string) => {
        const result = createAndCallParser(`struct a { int foo[${value}]; }`)();
        expect(result).toBeDefined();
        const resultFn = (result.structures[0].statements[0] as FieldStatement).type.sizeExpression;
        expect(resultFn).toBeDefined();
        const variableScope = new VariableScope();
        variableScope.put("a", 1);
        variableScope.put("b", 11);
        variableScope.put("c", 5);
        variableScope.put("d", 3);
        variableScope.put("ar", [
          {
            c: 1,
          },
        ]);
        variableScope.put("ob", {
          b: 4,
        });

        const functionScope = new FunctionScope();
        functionScope.put("f", () => 1);

        const size = evaluator.evaluate(resultFn, {
          variables: variableScope,
          functions: functionScope,
        });
        expect(size).toBeDefined();
      },
    );
  });

  test("accepts == and ||", () => {
    const result = createAndCallParser("struct a { int foo[1 == 2 || 3 == 4]; }")();
    expect(result).toBeDefined();
    const resultFn = (result.structures[0].statements[0] as FieldStatement).type.sizeExpression;
    expect(resultFn).toBeDefined();
    expect(resultFn).toContain("==");
    expect(resultFn).toContain("||");
  });

  test("rejects unsupported expression", () => {
    each(["a++", "a--", "++a", "--a"], (value: string) => {
      expect(createAndCallParser(`struct a { int foo[${value}]; }`)).toThrow(/supported/);
    });
  });
  test("rejects invalid expression", () => {
    each(["+", "())"], (value: string) => {
      expect(createAndCallParser(`struct a { int foo[${value}]; }`)).toThrow(/parsing/);
    });
  });
});
