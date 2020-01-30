import { Definition } from "@binr/ast";
import { each } from "lodash";

import { BinrDefinitionImporter } from "../../lib/binr/binr-definition-importer";

function createAndCallParser(input: string): () => Definition {
  return () => {
    const reader = new BinrDefinitionImporter();
    return reader.readInput(input);
  };
}

describe("BinrDefinitionImporter", () => {
  test("throws an error when lexing invalid input", () => {
    expect(createAndCallParser("👍")).toThrow(/lexing/);
  });

  each(["#bar", "struct {}", "123", "beep", "##"], (value: string) => {
    test(`throws an error when parsing invalid input (${value})`, () => {
      expect(createAndCallParser(value)).toThrow(/parsing/);
    });
  });

  each(
    [
      "struct a {} struct a {}",
      "struct a {int a; int a;}",
      "",
      `#set "b"
#set "b"
struct a {}`,
      "struct int {}",
      "struct a { b b; }",
      "struct c { int:0 a; }",
      "struct c { int:255 a; }",
      "struct c { string a; }",
    ],
    (value: string) => {
      test.skip(`throws an error on invalid content (${value})`, () => {
        expect(createAndCallParser(value)).toThrow(/validation/i);
      });
    },
  );

  each(
    [
      `#set "foo"
struct a {}`,
      `#set 32
struct b {}`,
      "struct a {}",
    ],
    (value: string) => {
      test(`accepts minimal input (${value})`, () => {
        const result = createAndCallParser(value)();
        expect(result).toBeDefined();
        expect(result).toMatchSnapshot();
      });
    },
  );

  test("accepts field annotations", () => {
    const result = createAndCallParser("struct a { @ignore(false) int b; @ignore(true) int c; }")();
    expect(result).toBeDefined();
    expect(result).toMatchSnapshot();
  });

  test("accepts bitmasks", () => {
    const result = createAndCallParser("bitmask foo extends int:16 { A = 10 } struct A {}")();
    expect(result).toBeDefined();
    expect(result).toMatchSnapshot();
  });

  test("accepts enumerations", () => {
    const result = createAndCallParser("enum foo extends int:16 { A = 10 } struct A {}")();
    expect(result).toBeDefined();
    expect(result).toMatchSnapshot();
  });

  test("accepts == and ||", () => {
    const result = createAndCallParser("struct a { int foo[1 == 2 || 3 == 4]; }")();
    expect(result).toBeDefined();
    expect(result).toMatchSnapshot();
  });

  each(["a++", "a--", "++a", "--a"], (value: string) => {
    test.skip(`rejects unsupported expression (${value})`, () => {
      expect(createAndCallParser(`struct a { int foo[${value}]; }`)).toThrow(/supported/);
    });
  });
  each(["+", "())"], (value: string) => {
    test(`rejects invalid expression (${value}`, () => {
      expect(createAndCallParser(`struct a { int foo[${value}]; }`)).toThrow(/parsing/);
    });
  });
});
