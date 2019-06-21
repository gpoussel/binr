import { DefinitionBuilder } from "../lib/definition-builder";
import { FieldNode } from "../lib/nodes";

describe("DefinitionBuilder", () => {
  test("throws an error when circular dependencies are found", () => {
    const builder = new DefinitionBuilder();
    const structure1 = {
      name: "Structure1",
      statements: [
        new FieldNode(
          {
            type: "Structure2",
          },
          "s2",
        ),
      ],
    };
    const structure2 = {
      name: "Structure2",
      statements: [
        new FieldNode(
          {
            type: "Structure1",
          },
          "s1",
        ),
      ],
    };
    const ast = {
      headers: [],
      structures: [structure1, structure2],
      enumerations: [],
      bitmasks: [],
    };
    expect(() => builder.build(ast)).toThrow(/invalid/i);
  });

  test("throws an error when type is not found", () => {
    const builder = new DefinitionBuilder();
    const structure1 = {
      name: "Structure1",
      statements: [
        new FieldNode(
          {
            type: "WTF",
          },
          "s2",
        ),
      ],
    };
    const ast = {
      headers: [],
      structures: [structure1],
      enumerations: [],
      bitmasks: [],
    };
    expect(() => builder.build(ast)).toThrow(/invalid/);
  });
});
