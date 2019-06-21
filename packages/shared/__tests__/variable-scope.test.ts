import { VariableScope } from "../lib/variable-scope";

describe("VariableScope", () => {
  test("throws an error on invalid argument", () => {
    const variableScope = new VariableScope();
    expect(() => variableScope.get("a")).toThrow();
  });

  test("gets variables", () => {
    const variableScope = new VariableScope();
    variableScope.put("a", 1);
    expect(variableScope.get("a")).toEqual(1);
  });
});
