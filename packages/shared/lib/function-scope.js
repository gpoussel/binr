"use strict";

const _ = require("lodash");
const assert = require("assert");

class FunctionScope {
  constructor() {
    this.functions = {};
  }

  get(name) {
    if (_.has(this.functions, name)) {
      return _.get(this.functions, name);
    }
    if (!_.isUndefined(this.parentScope)) {
      return this.parentScope.get(name);
    }
    throw new Error(`Undefined function ${name} in scope`);
  }

  put(name, value) {
    assert(!_.has(this.functions, name), `Function named '${name}' is already present in scope`);
    this.functions[name] = value;
  }
}

module.exports = FunctionScope;
