"use strict";

const DefinitionBuilder = require("../lib/definition-builder");

describe("DefinitionBuilder", () => {
  test("throws an error when circular dependencies are found", () => {
    const builder = new DefinitionBuilder();
    const structure1 = {
      name: "Structure1",
      fields: [
        {
          name: "s2",
          type: {
            type: "Structure2",
          },
        },
      ],
    };
    const structure2 = {
      name: "Structure2",
      fields: [
        {
          name: "s1",
          type: {
            type: "Structure1",
          },
        },
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
      fields: [
        {
          name: "s2",
          type: {
            type: "WTF",
          },
        },
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
