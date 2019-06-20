"use strict";

import assert from "assert";
import _ from "lodash";

export class VariableScope {
  private parentScope: VariableScope;
  private variables: {};

  constructor(parentScope?: VariableScope) {
    if (!_.isUndefined(parentScope)) {
      assert(parentScope instanceof VariableScope, "parentScope must be an instance of VariableScope");
      this.parentScope = parentScope;
    }
    this.variables = {};
  }

  public get(name) {
    if (_.has(this.variables, name)) {
      return _.get(this.variables, name);
    }
    if (!_.isUndefined(this.parentScope)) {
      return this.parentScope.get(name);
    }
    throw new Error(`Undefined variable ${name} in the current scope`);
  }

  public put(name, value) {
    assert(!_.has(this.variables, name), `Variable named '${name}' is already present in current scope`);
    this.variables[name] = value;
  }
}
