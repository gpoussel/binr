"use strict";

import assert from "assert";
import _ from "lodash";

export class FunctionScope {
  private functions: {};
  private parentScope: FunctionScope;

  constructor() {
    this.functions = {};
  }

  public get(name) {
    if (_.has(this.functions, name)) {
      return _.get(this.functions, name);
    }
    throw new Error(`Undefined function ${name} in scope`);
  }

  public put(name, value) {
    assert(!_.has(this.functions, name), `Function named '${name}' is already present in scope`);
    this.functions[name] = value;
  }
}
