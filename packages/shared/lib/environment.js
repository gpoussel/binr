"use strict";

const VariableScope = require("./variable-scope");
const FunctionScope = require("./function-scope");
const StreamObject = require("./stream-object");

class Environment {
  constructor(stream, variables, functions) {
    this.stream = stream;
    this.variables = variables || new VariableScope();
    this.functions = functions || new FunctionScope();
  }

  nestedScope() {
    return new Environment(this.stream, new VariableScope(this.variables), this.functions);
  }
}

module.exports = Environment;
