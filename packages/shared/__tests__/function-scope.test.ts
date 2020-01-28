import { FunctionScope } from "../lib/function-scope";

describe("FunctionScope", () => {
  test("throws an error on invalid argument", () => {
    const functionScope = new FunctionScope();
    expect(() => functionScope.get("a")).toThrow();
  });

  test("gets functions", () => {
    const functionScope = new FunctionScope();
    const fn = () => {};
    functionScope.put("a", fn);
    expect(functionScope.get("a")).toEqual(fn);
  });
});
