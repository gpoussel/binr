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
      expect(result).toMatchSnapshot();
    });
  });

  test("accepts enumerations", () => {
    each(["enum foo extends int:16 { A = 10 } struct A {}"], (value: string) => {
      const result = createAndCallParser(value)();
      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });
  });

  test("accepts == and ||", () => {
    const result = createAndCallParser("struct a { int foo[1 == 2 || 3 == 4]; }")();
    expect(result).toBeDefined();
    expect(result).toMatchSnapshot();
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
