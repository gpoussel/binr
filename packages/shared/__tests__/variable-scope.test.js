"use strict";

const _ = require("lodash");
const assert = require("assert");

const VariableScope = require("../lib/variable-scope");

describe("VariableScope", () => {
  test("throws an error on invalid argument", () => {
    const variableScope = new VariableScope();
    expect(() => variableScope.get()).toThrow();
    expect(() => variableScope.get("a")).toThrow();
  });

  test("gets variables", () => {
    const variableScope = new VariableScope();
    variableScope.put("a", 1);
    expect(variableScope.get("a")).toEqual(1);
  });
});
