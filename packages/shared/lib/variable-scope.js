"use strict";

const _ = require("lodash");
const assert = require("assert");

class VariableScope {
  constructor(parentScope) {
    if (!_.isUndefined(parentScope)) {
      assert(parentScope instanceof VariableScope, "parentScope must be an instance of VariableScope");
      this.parentScope = parentScope;
    }
    this.variables = {};
  }

  get(name) {
    if (_.has(this.variables, name)) {
      return _.get(this.variables, name);
    }
    if (!_.isUndefined(this.parentScope)) {
      return this.parentScope.get(name);
    }
    throw new Error(`Undefined variable ${name} in the current scope`);
  }

  put(name, value) {
    assert(!_.has(this.variables, name), `Variable named '${name}' is already present in current scope`);
    this.variables[name] = value;
  }
}

module.exports = VariableScope;
